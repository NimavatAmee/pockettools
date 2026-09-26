export type BmiUnitSystem = "metric" | "imperial";

export interface BmiInput {
  system: BmiUnitSystem;
  weightKg?: number;
  heightCm?: number;
  weightLb?: number;
  heightFeet?: number;
  heightInches?: number;
}

export type BmiCategory =
  | "Underweight"
  | "Normal weight"
  | "Overweight"
  | "Obesity Class I"
  | "Obesity Class II"
  | "Obesity Class III";

export interface BmiResult {
  bmi: number;
  category: BmiCategory;
  categoryColor: string;
  healthyWeightRange: string;
  prime: number; // BMI / 25
  disclaimer: string;
}

export function calculateBmi(input: BmiInput): BmiResult | null {
  let weightInKg = 0;
  let heightInMeters = 0;

  if (input.system === "metric") {
    const kg = input.weightKg || 0;
    const cm = input.heightCm || 0;
    if (kg <= 0 || cm <= 0) return null;
    weightInKg = kg;
    heightInMeters = cm / 100;
  } else {
    const lb = input.weightLb || 0;
    const ft = input.heightFeet || 0;
    const inches = input.heightInches || 0;
    const totalInches = ft * 12 + inches;
    if (lb <= 0 || totalInches <= 0) return null;

    weightInKg = lb * 0.45359237;
    heightInMeters = totalInches * 0.0254;
  }

  if (heightInMeters <= 0 || weightInKg <= 0) return null;

  const bmiRaw = weightInKg / (heightInMeters * heightInMeters);
  const bmi = Number(bmiRaw.toFixed(2));

  let category: BmiCategory;
  let categoryColor: string;

  if (bmi < 18.5) {
    category = "Underweight";
    categoryColor = "text-amber-500 bg-amber-500/10 border-amber-500/30";
  } else if (bmi < 25) {
    category = "Normal weight";
    categoryColor = "text-emerald-500 bg-emerald-500/10 border-emerald-500/30";
  } else if (bmi < 30) {
    category = "Overweight";
    categoryColor = "text-orange-500 bg-orange-500/10 border-orange-500/30";
  } else if (bmi < 35) {
    category = "Obesity Class I";
    categoryColor = "text-rose-500 bg-rose-500/10 border-rose-500/30";
  } else if (bmi < 40) {
    category = "Obesity Class II";
    categoryColor = "text-red-600 bg-red-600/10 border-red-600/30";
  } else {
    category = "Obesity Class III";
    categoryColor = "text-purple-600 bg-purple-600/10 border-purple-600/30";
  }

  const minNormalKg = 18.5 * (heightInMeters * heightInMeters);
  const maxNormalKg = 24.9 * (heightInMeters * heightInMeters);

  let healthyRangeStr = `${minNormalKg.toFixed(1)} kg - ${maxNormalKg.toFixed(1)} kg`;
  if (input.system === "imperial") {
    const minLb = minNormalKg * 2.20462;
    const maxLb = maxNormalKg * 2.20462;
    healthyRangeStr = `${minLb.toFixed(1)} lbs - ${maxLb.toFixed(1)} lbs`;
  }

  return {
    bmi,
    category,
    categoryColor,
    healthyWeightRange: healthyRangeStr,
    prime: Number((bmi / 25).toFixed(2)),
    disclaimer:
      "Disclaimer: Body Mass Index (BMI) is a general screening guide for adults and does not account for muscle mass, bone density, or age. It is not medical advice.",
  };
}
