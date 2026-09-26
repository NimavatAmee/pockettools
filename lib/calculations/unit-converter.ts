export type UnitCategory =
  | "length"
  | "weight"
  | "temperature"
  | "area"
  | "volume"
  | "time"
  | "data";

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  ratioToBase?: number; // Multiply by this to get base unit
}

export interface UnitCategoryData {
  id: UnitCategory;
  name: string;
  baseUnit: string;
  units: UnitDefinition[];
}

export const UNIT_CATEGORIES: Record<UnitCategory, UnitCategoryData> = {
  length: {
    id: "length",
    name: "Length",
    baseUnit: "meter",
    units: [
      { id: "m", name: "Meter", symbol: "m", ratioToBase: 1 },
      { id: "km", name: "Kilometer", symbol: "km", ratioToBase: 1000 },
      { id: "cm", name: "Centimeter", symbol: "cm", ratioToBase: 0.01 },
      { id: "mm", name: "Millimeter", symbol: "mm", ratioToBase: 0.001 },
      { id: "mi", name: "Mile", symbol: "mi", ratioToBase: 1609.344 },
      { id: "yd", name: "Yard", symbol: "yd", ratioToBase: 0.9144 },
      { id: "ft", name: "Foot", symbol: "ft", ratioToBase: 0.3048 },
      { id: "in", name: "Inch", symbol: "in", ratioToBase: 0.0254 },
    ],
  },
  weight: {
    id: "weight",
    name: "Weight & Mass",
    baseUnit: "kilogram",
    units: [
      { id: "kg", name: "Kilogram", symbol: "kg", ratioToBase: 1 },
      { id: "g", name: "Gram", symbol: "g", ratioToBase: 0.001 },
      { id: "mg", name: "Milligram", symbol: "mg", ratioToBase: 0.000001 },
      { id: "lb", name: "Pound", symbol: "lb", ratioToBase: 0.45359237 },
      { id: "oz", name: "Ounce", symbol: "oz", ratioToBase: 0.028349523125 },
      { id: "t", name: "Metric Ton", symbol: "t", ratioToBase: 1000 },
    ],
  },
  temperature: {
    id: "temperature",
    name: "Temperature",
    baseUnit: "celsius",
    units: [
      { id: "c", name: "Celsius", symbol: "°C" },
      { id: "f", name: "Fahrenheit", symbol: "°F" },
      { id: "k", name: "Kelvin", symbol: "K" },
    ],
  },
  area: {
    id: "area",
    name: "Area",
    baseUnit: "square_meter",
    units: [
      { id: "sq_m", name: "Square Meter", symbol: "m²", ratioToBase: 1 },
      { id: "sq_km", name: "Square Kilometer", symbol: "km²", ratioToBase: 1000000 },
      { id: "sq_ft", name: "Square Foot", symbol: "ft²", ratioToBase: 0.092903 },
      { id: "acre", name: "Acre", symbol: "ac", ratioToBase: 4046.8564224 },
      { id: "hectare", name: "Hectare", symbol: "ha", ratioToBase: 10000 },
      { id: "sq_mi", name: "Square Mile", symbol: "mi²", ratioToBase: 2589988.11 },
    ],
  },
  volume: {
    id: "volume",
    name: "Volume",
    baseUnit: "liter",
    units: [
      { id: "l", name: "Liter", symbol: "L", ratioToBase: 1 },
      { id: "ml", name: "Milliliter", symbol: "mL", ratioToBase: 0.001 },
      { id: "cu_m", name: "Cubic Meter", symbol: "m³", ratioToBase: 1000 },
      { id: "gal_us", name: "US Gallon", symbol: "gal", ratioToBase: 3.78541 },
      { id: "cup", name: "US Cup", symbol: "cup", ratioToBase: 0.236588 },
      { id: "fl_oz", name: "US Fluid Ounce", symbol: "fl oz", ratioToBase: 0.0295735 },
    ],
  },
  time: {
    id: "time",
    name: "Time",
    baseUnit: "second",
    units: [
      { id: "s", name: "Second", symbol: "s", ratioToBase: 1 },
      { id: "min", name: "Minute", symbol: "min", ratioToBase: 60 },
      { id: "h", name: "Hour", symbol: "h", ratioToBase: 3600 },
      { id: "d", name: "Day", symbol: "d", ratioToBase: 86400 },
      { id: "wk", name: "Week", symbol: "wk", ratioToBase: 604800 },
      { id: "yr", name: "Year (365 days)", symbol: "yr", ratioToBase: 31536000 },
    ],
  },
  data: {
    id: "data",
    name: "Digital Data",
    baseUnit: "byte",
    units: [
      { id: "b", name: "Byte", symbol: "B", ratioToBase: 1 },
      { id: "kb", name: "Kilobyte (KB)", symbol: "KB", ratioToBase: 1024 },
      { id: "mb", name: "Megabyte (MB)", symbol: "MB", ratioToBase: 1024 * 1024 },
      { id: "gb", name: "Gigabyte (GB)", symbol: "GB", ratioToBase: 1024 * 1024 * 1024 },
      { id: "tb", name: "Terabyte (TB)", symbol: "TB", ratioToBase: 1024 * 1024 * 1024 * 1024 },
      { id: "bit", name: "Bit", symbol: "bit", ratioToBase: 0.125 },
    ],
  },
};

export interface ConvertResult {
  fromValue: number;
  fromUnit: string;
  toValue: number;
  toUnit: string;
  formula: string;
}

export function convertUnit(
  category: UnitCategory,
  fromUnitId: string,
  toUnitId: string,
  value: number
): ConvertResult {
  const safeValue = isNaN(value) ? 0 : value;
  const categoryData = UNIT_CATEGORIES[category];

  if (category === "temperature") {
    let result = 0;
    let formula = "";

    if (fromUnitId === toUnitId) {
      result = safeValue;
      formula = `${safeValue} = ${safeValue}`;
    } else if (fromUnitId === "c" && toUnitId === "f") {
      result = (safeValue * 9) / 5 + 32;
      formula = `(${safeValue} × 9/5) + 32 = ${result.toFixed(2)} °F`;
    } else if (fromUnitId === "f" && toUnitId === "c") {
      result = ((safeValue - 32) * 5) / 9;
      formula = `(${safeValue} - 32) × 5/9 = ${result.toFixed(2)} °C`;
    } else if (fromUnitId === "c" && toUnitId === "k") {
      result = safeValue + 273.15;
      formula = `${safeValue} + 273.15 = ${result.toFixed(2)} K`;
    } else if (fromUnitId === "k" && toUnitId === "c") {
      result = safeValue - 273.15;
      formula = `${safeValue} - 273.15 = ${result.toFixed(2)} °C`;
    } else if (fromUnitId === "f" && toUnitId === "k") {
      result = ((safeValue - 32) * 5) / 9 + 273.15;
      formula = `((${safeValue} - 32) × 5/9) + 273.15 = ${result.toFixed(2)} K`;
    } else if (fromUnitId === "k" && toUnitId === "f") {
      result = ((safeValue - 273.15) * 9) / 5 + 32;
      formula = `((${safeValue} - 273.15) × 9/5) + 32 = ${result.toFixed(2)} °F`;
    }

    return {
      fromValue: safeValue,
      fromUnit: fromUnitId.toUpperCase(),
      toValue: Number(result.toFixed(4)),
      toUnit: toUnitId.toUpperCase(),
      formula,
    };
  }

  const fromDef = categoryData.units.find((u) => u.id === fromUnitId);
  const toDef = categoryData.units.find((u) => u.id === toUnitId);

  if (!fromDef || !toDef || !fromDef.ratioToBase || !toDef.ratioToBase) {
    return {
      fromValue: safeValue,
      fromUnit: fromUnitId,
      toValue: safeValue,
      toUnit: toUnitId,
      formula: "1:1 Direct mapping",
    };
  }

  const baseValue = safeValue * fromDef.ratioToBase;
  const toValue = baseValue / toDef.ratioToBase;

  // Clean rounding
  const rounded = Number(Math.round(Number(toValue + "e+6")) + "e-6");

  return {
    fromValue: safeValue,
    fromUnit: fromDef.symbol,
    toValue: rounded,
    toUnit: toDef.symbol,
    formula: `1 ${fromDef.symbol} = ${(fromDef.ratioToBase / toDef.ratioToBase).toFixed(6)} ${toDef.symbol}`,
  };
}
