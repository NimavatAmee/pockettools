export interface EmiInput {
  principal: number;
  annualInterestRate: number;
  tenureValue: number;
  tenureType: "months" | "years";
}

export interface EmiResult {
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
  principal: number;
  months: number;
}

export function calculateEmi(input: EmiInput): EmiResult {
  const principal = Math.max(0, isNaN(input.principal) ? 0 : input.principal);
  const annualRate = Math.max(0, isNaN(input.annualInterestRate) ? 0 : input.annualInterestRate);
  const tenureVal = Math.max(1, isNaN(input.tenureValue) ? 1 : input.tenureValue);
  
  const totalMonths = input.tenureType === "years" ? Math.round(tenureVal * 12) : Math.round(tenureVal);

  if (principal === 0 || totalMonths <= 0) {
    return {
      monthlyEmi: 0,
      totalInterest: 0,
      totalPayment: 0,
      principal: 0,
      months: totalMonths || 1,
    };
  }

  // Handle 0% interest (e.g. No-cost EMI)
  if (annualRate === 0) {
    const monthlyEmi = principal / totalMonths;
    return {
      monthlyEmi: Number(monthlyEmi.toFixed(2)),
      totalInterest: 0,
      totalPayment: Number(principal.toFixed(2)),
      principal: Number(principal.toFixed(2)),
      months: totalMonths,
    };
  }

  const monthlyRate = annualRate / 12 / 100;
  // EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]
  const rateFactor = Math.pow(1 + monthlyRate, totalMonths);
  const monthlyEmi = (principal * monthlyRate * rateFactor) / (rateFactor - 1);
  const totalPayment = monthlyEmi * totalMonths;
  const totalInterest = totalPayment - principal;

  return {
    monthlyEmi: Number(monthlyEmi.toFixed(2)),
    totalInterest: Number(totalInterest.toFixed(2)),
    totalPayment: Number(totalPayment.toFixed(2)),
    principal: Number(principal.toFixed(2)),
    months: totalMonths,
  };
}
