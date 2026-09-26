export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous?: boolean; // Avoid 0, O, l, 1, I
}

export type PasswordStrength = "Very Weak" | "Weak" | "Fair" | "Strong" | "Very Strong";

export interface PasswordResult {
  password: string;
  strength: PasswordStrength;
  score: number; // 0 to 4
  entropyBits: number;
}

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

const AMBIGUOUS = /[0Ol1I]/g;

export function generateSecurePassword(options: PasswordOptions): PasswordResult {
  const length = Math.min(64, Math.max(6, isNaN(options.length) ? 16 : options.length));

  let charset = "";
  if (options.includeUppercase) charset += UPPERCASE;
  if (options.includeLowercase) charset += LOWERCASE;
  if (options.includeNumbers) charset += NUMBERS;
  if (options.includeSymbols) charset += SYMBOLS;

  if (options.excludeAmbiguous) {
    charset = charset.replace(AMBIGUOUS, "");
  }

  // Fallback if user unchecked all options
  if (charset.length === 0) {
    charset = LOWERCASE + NUMBERS;
  }

  const charsetLength = charset.length;
  const randomBytes = new Uint32Array(length);

  // Use Web Crypto API (works in modern browser window.crypto and Node.js globalThis.crypto)
  const cryptoObj =
    typeof window !== "undefined" && window.crypto
      ? window.crypto
      : typeof globalThis !== "undefined" && globalThis.crypto
      ? globalThis.crypto
      : null;

  if (cryptoObj && typeof cryptoObj.getRandomValues === "function") {
    cryptoObj.getRandomValues(randomBytes);
  } else {
    // Fallback if environment lacks Web Crypto
    for (let i = 0; i < length; i++) {
      randomBytes[i] = Math.floor(Math.random() * 0xffffffff);
    }
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes[i] % charsetLength;
    password += charset[randomIndex];
  }

  // Calculate entropy and strength
  const entropy = Math.round(length * Math.log2(charsetLength));
  let score = 0;
  let strength: PasswordStrength = "Very Weak";

  if (entropy >= 80) {
    strength = "Very Strong";
    score = 4;
  } else if (entropy >= 60) {
    strength = "Strong";
    score = 3;
  } else if (entropy >= 45) {
    strength = "Fair";
    score = 2;
  } else if (entropy >= 30) {
    strength = "Weak";
    score = 1;
  }

  return {
    password,
    strength,
    score,
    entropyBits: entropy,
  };
}
