export interface IncomeTaxInputs {
  grossSalary: number;
  otherIncome: number; // interest, rental, etc.
  ageCategory: "general" | "senior" | "super_senior"; // general (<60), senior (60-80), super senior (80+)

  // Deductions for Old Regime
  section80C: number; // PPF, ELSS, EPF, LIC, Home Loan Principal (max 1.5L)
  section80D: number; // Health Insurance (self + parents)
  section24b: number; // Home Loan Interest (max 2L for self-occupied)
  hraExemption: number; // House Rent Allowance exemption
  nps80CCD1B: number; // Additional NPS (max 50k)
  otherDeductions: number; // 80E, 80G, 80TTA, etc.
}

export interface TaxSlabBreakdown {
  slab: string;
  rate: number;
  taxableAmountInSlab: number;
  taxAmount: number;
}

export interface RegimeTaxResult {
  grossIncome: number;
  standardDeduction: number;
  totalDeductions: number;
  netTaxableIncome: number;
  slabBreakdown: TaxSlabBreakdown[];
  baseTax: number;
  rebate87A: number;
  taxAfterRebate: number;
  cess: number; // 4% Health & Education Cess
  totalTaxLiability: number;
  effectiveTaxRate: number; // percentage
}

export interface IncomeTaxComparisonResult {
  newRegime: RegimeTaxResult;
  oldRegime: RegimeTaxResult;
  recommendedRegime: "new" | "old" | "equal";
  taxSavings: number; // Amount saved by picking recommended regime
}

export function calculateIncomeTax(inputs: IncomeTaxInputs): IncomeTaxComparisonResult {
  const grossSalary = Math.max(0, inputs.grossSalary);
  const otherIncome = Math.max(0, inputs.otherIncome);
  const totalGross = grossSalary + otherIncome;

  // --- 1. NEW TAX REGIME (FY 2024-25 / FY 2025-26) ---
  // Standard Deduction: ₹75,000 for salaried
  const newStdDeduction = grossSalary > 0 ? Math.min(grossSalary, 75000) : 0;
  const newNetTaxable = Math.max(0, totalGross - newStdDeduction);

  const newSlabs: { min: number; max: number; rate: number; label: string }[] = [
    { min: 0, max: 300000, rate: 0, label: "Up to ₹3,00,000" },
    { min: 300000, max: 700000, rate: 5, label: "₹3,00,001 – ₹7,00,000" },
    { min: 700000, max: 1000000, rate: 10, label: "₹7,00,001 – ₹10,00,000" },
    { min: 1000000, max: 1200000, rate: 15, label: "₹10,00,001 – ₹12,00,000" },
    { min: 1200000, max: 1500000, rate: 20, label: "₹12,00,001 – ₹15,00,000" },
    { min: 1500000, max: Infinity, rate: 30, label: "Above ₹15,00,000" },
  ];

  let newBaseTax = 0;
  const newSlabBreakdown: TaxSlabBreakdown[] = [];

  for (const s of newSlabs) {
    if (newNetTaxable > s.min) {
      const taxableInSlab = Math.min(newNetTaxable, s.max) - s.min;
      const taxForSlab = (taxableInSlab * s.rate) / 100;
      newBaseTax += taxForSlab;

      newSlabBreakdown.push({
        slab: s.label,
        rate: s.rate,
        taxableAmountInSlab: Math.round(taxableInSlab),
        taxAmount: Math.round(taxForSlab),
      });
    } else {
      newSlabBreakdown.push({
        slab: s.label,
        rate: s.rate,
        taxableAmountInSlab: 0,
        taxAmount: 0,
      });
    }
  }

  // Section 87A Rebate for New Regime: If taxable income <= ₹7,00,000, full rebate (max ₹25,000)
  let newRebate87A = 0;
  if (newNetTaxable <= 700000) {
    newRebate87A = newBaseTax;
  }
  const newTaxAfterRebate = Math.max(0, newBaseTax - newRebate87A);
  const newCess = Math.round(newTaxAfterRebate * 0.04);
  const newTotalTax = Math.round(newTaxAfterRebate + newCess);
  const newEffectiveRate = totalGross > 0 ? Number(((newTotalTax / totalGross) * 100).toFixed(2)) : 0;

  const newRegimeResult: RegimeTaxResult = {
    grossIncome: totalGross,
    standardDeduction: newStdDeduction,
    totalDeductions: newStdDeduction,
    netTaxableIncome: Math.round(newNetTaxable),
    slabBreakdown: newSlabBreakdown,
    baseTax: Math.round(newBaseTax),
    rebate87A: Math.round(newRebate87A),
    taxAfterRebate: Math.round(newTaxAfterRebate),
    cess: newCess,
    totalTaxLiability: newTotalTax,
    effectiveTaxRate: newEffectiveRate,
  };

  // --- 2. OLD TAX REGIME ---
  // Standard Deduction: ₹50,000 for salaried
  const oldStdDeduction = grossSalary > 0 ? Math.min(grossSalary, 50000) : 0;
  const capped80C = Math.min(150000, Math.max(0, inputs.section80C));
  const capped80D = Math.max(0, inputs.section80D);
  const capped24b = Math.min(200000, Math.max(0, inputs.section24b));
  const cappedHra = Math.max(0, inputs.hraExemption);
  const cappedNps = Math.min(50000, Math.max(0, inputs.nps80CCD1B));
  const otherDeds = Math.max(0, inputs.otherDeductions);

  const totalOldDeductions =
    oldStdDeduction + capped80C + capped80D + capped24b + cappedHra + cappedNps + otherDeds;
  const oldNetTaxable = Math.max(0, totalGross - totalOldDeductions);

  // Old Regime Slabs based on age
  let basicExemption = 250000;
  if (inputs.ageCategory === "senior") basicExemption = 300000;
  if (inputs.ageCategory === "super_senior") basicExemption = 500000;

  const oldSlabs: { min: number; max: number; rate: number; label: string }[] = [
    { min: 0, max: basicExemption, rate: 0, label: `Up to ₹${basicExemption.toLocaleString("en-IN")}` },
    { min: basicExemption, max: 500000, rate: 5, label: `₹${(basicExemption + 1).toLocaleString("en-IN")} – ₹5,00,000` },
    { min: 500000, max: 1000000, rate: 20, label: "₹5,00,001 – ₹10,00,000" },
    { min: 1000000, max: Infinity, rate: 30, label: "Above ₹10,00,000" },
  ];

  let oldBaseTax = 0;
  const oldSlabBreakdown: TaxSlabBreakdown[] = [];

  for (const s of oldSlabs) {
    if (s.min >= s.max) continue;
    if (oldNetTaxable > s.min) {
      const taxableInSlab = Math.min(oldNetTaxable, s.max) - s.min;
      const taxForSlab = (taxableInSlab * s.rate) / 100;
      oldBaseTax += taxForSlab;

      oldSlabBreakdown.push({
        slab: s.label,
        rate: s.rate,
        taxableAmountInSlab: Math.round(taxableInSlab),
        taxAmount: Math.round(taxForSlab),
      });
    } else {
      oldSlabBreakdown.push({
        slab: s.label,
        rate: s.rate,
        taxableAmountInSlab: 0,
        taxAmount: 0,
      });
    }
  }

  // Section 87A Rebate for Old Regime: If taxable income <= ₹5,00,000, rebate up to ₹12,500
  let oldRebate87A = 0;
  if (oldNetTaxable <= 500000) {
    oldRebate87A = Math.min(oldBaseTax, 12500);
  }
  const oldTaxAfterRebate = Math.max(0, oldBaseTax - oldRebate87A);
  const oldCess = Math.round(oldTaxAfterRebate * 0.04);
  const oldTotalTax = Math.round(oldTaxAfterRebate + oldCess);
  const oldEffectiveRate = totalGross > 0 ? Number(((oldTotalTax / totalGross) * 100).toFixed(2)) : 0;

  const oldRegimeResult: RegimeTaxResult = {
    grossIncome: totalGross,
    standardDeduction: oldStdDeduction,
    totalDeductions: totalOldDeductions,
    netTaxableIncome: Math.round(oldNetTaxable),
    slabBreakdown: oldSlabBreakdown,
    baseTax: Math.round(oldBaseTax),
    rebate87A: Math.round(oldRebate87A),
    taxAfterRebate: Math.round(oldTaxAfterRebate),
    cess: oldCess,
    totalTaxLiability: oldTotalTax,
    effectiveTaxRate: oldEffectiveRate,
  };

  // Comparison logic
  let recommendedRegime: "new" | "old" | "equal" = "equal";
  let taxSavings = 0;

  if (newTotalTax < oldTotalTax) {
    recommendedRegime = "new";
    taxSavings = oldTotalTax - newTotalTax;
  } else if (oldTotalTax < newTotalTax) {
    recommendedRegime = "old";
    taxSavings = newTotalTax - oldTotalTax;
  }

  return {
    newRegime: newRegimeResult,
    oldRegime: oldRegimeResult,
    recommendedRegime,
    taxSavings,
  };
}
