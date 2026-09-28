export interface FdInputs {
  depositAmount: number;
  annualInterestRate: number; // percentage
  tenureYears: number;
  tenureMonths: number;
  tenureDays: number;
  isSeniorCitizen: boolean; // +0.50%
  compoundingFrequency: "quarterly" | "monthly" | "annually" | "simple";
}

export interface RdInputs {
  monthlyDeposit: number;
  annualInterestRate: number; // percentage
  tenureMonths: number;
  isSeniorCitizen: boolean; // +0.50%
}

export interface FdResult {
  principalAmount: number;
  interestRateApplied: number;
  totalInterestEarned: number;
  maturityAmount: number;
  totalDays: number;
  isTdsApplicable: boolean; // if annual interest > 40,000 (50,000 for senior)
  tdsThreshold: number;
}

export interface RdResult {
  monthlyDeposit: number;
  totalInvested: number;
  tenureMonths: number;
  interestRateApplied: number;
  totalInterestEarned: number;
  maturityAmount: number;
  isTdsApplicable: boolean;
  tdsThreshold: number;
}

export function calculateFd(inputs: FdInputs): FdResult {
  const P = Math.max(0, inputs.depositAmount);
  const baseRate = Math.max(0, inputs.annualInterestRate);
  const effectiveRate = baseRate + (inputs.isSeniorCitizen ? 0.5 : 0);

  const totalYears =
    Math.max(0, inputs.tenureYears) +
    Math.max(0, inputs.tenureMonths) / 12 +
    Math.max(0, inputs.tenureDays) / 365;

  const totalDays = Math.round(totalYears * 365);
  const rDec = effectiveRate / 100;

  let maturityAmount = P;

  if (inputs.compoundingFrequency === "quarterly") {
    // Standard Bank FD: Quarterly compounding
    const n = 4;
    maturityAmount = P * Math.pow(1 + rDec / n, n * totalYears);
  } else if (inputs.compoundingFrequency === "monthly") {
    const n = 12;
    maturityAmount = P * Math.pow(1 + rDec / n, n * totalYears);
  } else if (inputs.compoundingFrequency === "annually") {
    const n = 1;
    maturityAmount = P * Math.pow(1 + rDec / n, n * totalYears);
  } else {
    // Simple interest
    maturityAmount = P * (1 + rDec * totalYears);
  }

  const roundedMaturity = Math.round(maturityAmount);
  const totalInterest = Math.max(0, roundedMaturity - P);

  // Annualized interest check for TDS
  const annualizedInterest = totalYears > 0 ? totalInterest / totalYears : totalInterest;
  const tdsThreshold = inputs.isSeniorCitizen ? 50000 : 40000;
  const isTdsApplicable = annualizedInterest > tdsThreshold;

  return {
    principalAmount: Math.round(P),
    interestRateApplied: effectiveRate,
    totalInterestEarned: totalInterest,
    maturityAmount: roundedMaturity,
    totalDays,
    isTdsApplicable,
    tdsThreshold,
  };
}

export function calculateRd(inputs: RdInputs): RdResult {
  const P = Math.max(0, inputs.monthlyDeposit);
  const baseRate = Math.max(0, inputs.annualInterestRate);
  const effectiveRate = baseRate + (inputs.isSeniorCitizen ? 0.5 : 0);
  const nMonths = Math.max(1, Math.round(inputs.tenureMonths));

  const totalInvested = P * nMonths;
  const r = effectiveRate / 100;

  // Indian Bank RD quarterly compounding formula:
  // Maturity = sum of each installment compounded quarterly: P * (1 + r/4)^(4 * (n - i + 1)/12)
  let maturityAcc = 0;
  for (let i = 1; i <= nMonths; i++) {
    const monthsRemaining = nMonths - i + 1;
    const quarters = monthsRemaining / 3;
    maturityAcc += P * Math.pow(1 + r / 4, quarters);
  }

  const roundedMaturity = Math.round(maturityAcc);
  const totalInterest = Math.max(0, roundedMaturity - totalInvested);

  const totalYears = nMonths / 12;
  const annualizedInterest = totalYears > 0 ? totalInterest / totalYears : totalInterest;
  const tdsThreshold = inputs.isSeniorCitizen ? 50000 : 40000;
  const isTdsApplicable = annualizedInterest > tdsThreshold;

  return {
    monthlyDeposit: Math.round(P),
    totalInvested: Math.round(totalInvested),
    tenureMonths: nMonths,
    interestRateApplied: effectiveRate,
    totalInterestEarned: totalInterest,
    maturityAmount: roundedMaturity,
    isTdsApplicable,
    tdsThreshold,
  };
}
