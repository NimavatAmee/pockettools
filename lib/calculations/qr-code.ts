import QRCode from "qrcode";

export type QrMode = "url" | "wifi" | "vcard" | "text" | "email" | "upi";
export type QrErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface WifiData {
  ssid: string;
  password?: string;
  security: "WPA" | "WEP" | "nopass";
  hidden?: boolean;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  organization?: string;
  jobTitle?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  note?: string;
}

export interface EmailData {
  email: string;
  subject?: string;
  body?: string;
}

export interface UpiData {
  vpa: string; // e.g. user@okhdfcbank
  payeeName?: string;
  amount?: string;
  note?: string;
}

export interface QrOptions {
  foreground: string;
  background: string;
  errorCorrectionLevel: QrErrorCorrectionLevel;
  margin?: number;
  width?: number;
}

export const DEFAULT_QR_OPTIONS: QrOptions = {
  foreground: "#000000",
  background: "#ffffff",
  errorCorrectionLevel: "M",
  margin: 2,
  width: 512,
};

/**
 * Escapes special characters for WiFi SSID and passwords (backslashes, semicolons, colons, commas)
 */
function escapeWifiString(str: string): string {
  return str.replace(/([\\;:,\"])/g, "\\$1");
}

/**
 * Builds standard WiFi QR code string payload
 * Format: WIFI:S:MyNetwork;T:WPA;P:secret123;H:true;;
 */
export function buildWifiPayload(data: WifiData): string {
  const ssid = escapeWifiString(data.ssid || "");
  const security = data.security || "WPA";
  const password = security === "nopass" ? "" : escapeWifiString(data.password || "");
  const hidden = data.hidden ? "H:true;" : "";

  if (security === "nopass") {
    return `WIFI:S:${ssid};T:nopass;${hidden};`;
  }
  return `WIFI:S:${ssid};T:${security};P:${password};${hidden};`;
}

/**
 * Builds standard vCard 3.0 payload for digital contact cards
 */
export function buildVCardPayload(data: VCardData): string {
  const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0"];

  const firstName = data.firstName?.trim() || "";
  const lastName = data.lastName?.trim() || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  lines.push(`N:${lastName};${firstName};;;`);
  lines.push(`FN:${fullName || "Contact"}`);

  if (data.organization?.trim()) lines.push(`ORG:${data.organization.trim()}`);
  if (data.jobTitle?.trim()) lines.push(`TITLE:${data.jobTitle.trim()}`);
  if (data.phone?.trim()) lines.push(`TEL;TYPE=CELL:${data.phone.trim()}`);
  if (data.email?.trim()) lines.push(`EMAIL;TYPE=WORK:${data.email.trim()}`);
  if (data.website?.trim()) lines.push(`URL:${data.website.trim()}`);
  if (data.address?.trim()) lines.push(`ADR;TYPE=WORK:;;${data.address.trim()};;;;`);
  if (data.note?.trim()) lines.push(`NOTE:${data.note.trim()}`);

  lines.push("END:VCARD");
  return lines.join("\n");
}

/**
 * Builds email mailto link
 */
export function buildEmailPayload(data: EmailData): string {
  const email = data.email?.trim() || "";
  const params: string[] = [];
  if (data.subject?.trim()) params.push(`subject=${encodeURIComponent(data.subject.trim())}`);
  if (data.body?.trim()) params.push(`body=${encodeURIComponent(data.body.trim())}`);

  if (params.length > 0) {
    return `mailto:${email}?${params.join("&")}`;
  }
  return `mailto:${email}`;
}

/**
 * Builds UPI payment link
 */
export function buildUpiPayload(data: UpiData): string {
  const vpa = data.vpa?.trim() || "";
  const params: string[] = [`pa=${encodeURIComponent(vpa)}`];
  if (data.payeeName?.trim()) params.push(`pn=${encodeURIComponent(data.payeeName.trim())}`);
  if (data.amount?.trim() && !isNaN(Number(data.amount))) {
    params.push(`am=${encodeURIComponent(data.amount.trim())}`);
    params.push("cu=INR");
  }
  if (data.note?.trim()) params.push(`tn=${encodeURIComponent(data.note.trim())}`);

  return `upi://pay?${params.join("&")}`;
}

/**
 * Generates PNG data URL from payload
 */
export async function generateQrDataUrl(
  text: string,
  options: Partial<QrOptions> = {}
): Promise<string> {
  const merged = { ...DEFAULT_QR_OPTIONS, ...options };
  return QRCode.toDataURL(text || " ", {
    errorCorrectionLevel: merged.errorCorrectionLevel,
    margin: merged.margin ?? 2,
    width: merged.width ?? 512,
    color: {
      dark: merged.foreground,
      light: merged.background,
    },
  });
}

/**
 * Generates SVG string from payload
 */
export async function generateQrSvgString(
  text: string,
  options: Partial<QrOptions> = {}
): Promise<string> {
  const merged = { ...DEFAULT_QR_OPTIONS, ...options };
  return QRCode.toString(text || " ", {
    type: "svg",
    errorCorrectionLevel: merged.errorCorrectionLevel,
    margin: merged.margin ?? 2,
    width: merged.width ?? 512,
    color: {
      dark: merged.foreground,
      light: merged.background,
    },
  });
}
