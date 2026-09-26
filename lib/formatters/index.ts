/**
 * Format a numeric value as Indian Rupee currency (e.g. ₹1,00,000.00 or ₹1,00,000)
 */
export function formatCurrency(
  value: number | null | undefined,
  options: { decimals?: number; showSymbol?: boolean } = {}
): string {
  if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    return options.showSymbol !== false ? "₹0" : "0";
  }

  const decimals = options.decimals !== undefined ? options.decimals : 2;
  const showSymbol = options.showSymbol !== false;

  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  return showSymbol ? `₹${formatted}` : formatted;
}

/**
 * Format a general number with Indian numbering grouping (e.g. 1,00,000)
 */
export function formatNumber(
  value: number | null | undefined,
  maxDecimals: number = 2
): string {
  if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    return "0";
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: maxDecimals,
  }).format(value);
}

/**
 * Format a percentage value (e.g. 18% or 18.5%)
 */
export function formatPercentage(
  value: number | null | undefined,
  maxDecimals: number = 2
): string {
  if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    return "0%";
  }

  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: maxDecimals,
  }).format(value);

  return `${formatted}%`;
}

/**
 * Format a decimal number with fixed precision
 */
export function formatDecimal(
  value: number | null | undefined,
  decimals: number = 2
): string {
  if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    return "0.00";
  }

  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Parse string into a valid safe number or return default
 */
export function parseSafeNumber(val: string | number, fallback: number = 0): number {
  if (typeof val === "number") {
    return isFinite(val) ? val : fallback;
  }
  const clean = val.replace(/,/g, "").trim();
  const parsed = parseFloat(clean);
  return isNaN(parsed) || !isFinite(parsed) ? fallback : parsed;
}
