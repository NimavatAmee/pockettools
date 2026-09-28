export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export const POPULAR_CURRENCIES: CurrencyInfo[] = [
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", flag: "🇸🇦" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", flag: "🇳🇿" },
  { code: "QAR", name: "Qatari Riyal", symbol: "QR", flag: "🇶🇦" },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "KD", flag: "🇰🇼" },
  { code: "BHD", name: "Bahraini Dinar", symbol: "BD", flag: "🇧🇭" },
  { code: "OMR", name: "Omani Rial", symbol: "OMR", flag: "🇴🇲" },
  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽", flag: "🇷🇺" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", flag: "🇹🇷" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰" },
  { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", flag: "🇸🇪" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", flag: "🇳🇴" },
  { code: "DKK", name: "Danish Krone", symbol: "kr", flag: "🇩🇰" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł", flag: "🇵🇱" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱", flag: "🇵🇭" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", flag: "🇻🇳" },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£", flag: "🇪🇬" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨", flag: "🇵🇰" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", flag: "🇧🇩" },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs", flag: "🇱🇰" },
  { code: "NPR", name: "Nepalese Rupee", symbol: "रू", flag: "🇳🇵" },
];

// Fallback baseline exchange rates against USD (used if network offline / initial load)
export const DEFAULT_USD_RATES: Record<string, number> = {
  USD: 1.0,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.78,
  AED: 3.67,
  CAD: 1.37,
  AUD: 1.52,
  JPY: 155.0,
  SGD: 1.35,
  SAR: 3.75,
  CHF: 0.91,
  CNY: 7.24,
  THB: 36.8,
  MYR: 4.71,
  NZD: 1.66,
  QAR: 3.64,
  KWD: 0.31,
  BHD: 0.38,
  OMR: 0.38,
  ZAR: 18.2,
  BRL: 5.35,
  RUB: 91.0,
  TRY: 32.5,
  HKD: 7.81,
  KRW: 1370.0,
  SEK: 10.6,
  NOK: 10.7,
  DKK: 6.88,
  PLN: 3.96,
  PHP: 58.5,
  IDR: 16200.0,
  VND: 25400.0,
  EGP: 47.5,
  PKR: 278.0,
  BDT: 117.0,
  LKR: 302.0,
  NPR: 133.5,
};

export interface ConversionResult {
  fromAmount: number;
  fromCurrency: CurrencyInfo;
  toCurrency: CurrencyInfo;
  convertedAmount: number;
  exchangeRate: number;
  inverseRate: number;
  lastUpdated: string;
}

export function convertCurrency(
  amount: number,
  fromCode: string,
  toCode: string,
  rates: Record<string, number> = DEFAULT_USD_RATES,
  lastUpdated: string = new Date().toISOString().split("T")[0]
): ConversionResult {
  const from = POPULAR_CURRENCIES.find((c) => c.code === fromCode) || {
    code: fromCode,
    name: fromCode,
    symbol: fromCode,
    flag: "🌐",
  };

  const to = POPULAR_CURRENCIES.find((c) => c.code === toCode) || {
    code: toCode,
    name: toCode,
    symbol: toCode,
    flag: "🌐",
  };

  const fromRateInUSD = rates[fromCode] || DEFAULT_USD_RATES[fromCode] || 1;
  const toRateInUSD = rates[toCode] || DEFAULT_USD_RATES[toCode] || 1;

  // Rate: 1 fromCode = (toRate / fromRate) toCode
  const exchangeRate = toRateInUSD / fromRateInUSD;
  const inverseRate = exchangeRate > 0 ? 1 / exchangeRate : 0;
  const convertedAmount = Math.max(0, amount) * exchangeRate;

  return {
    fromAmount: Math.max(0, amount),
    fromCurrency: from,
    toCurrency: to,
    convertedAmount: Number(convertedAmount.toFixed(4)),
    exchangeRate: Number(exchangeRate.toFixed(4)),
    inverseRate: Number(inverseRate.toFixed(4)),
    lastUpdated,
  };
}
