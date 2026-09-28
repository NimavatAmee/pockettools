export interface AmortizationMonth {
  month: number;
  openingBalance: number;
  emi: number;
  principalPaid: number;
  interestPaid: number;
  closingBalance: number;
}

export interface AmortizationYear {
  year: number;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  closingBalance: number;
}

export interface AmortizationScheduleResult {
  monthlySchedule: AmortizationMonth[];
  yearlySchedule: AmortizationYear[];
  totalPrincipal: number;
  totalInterest: number;
  totalPayment: number;
}

export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  months: number,
  monthlyEmi: number
): AmortizationScheduleResult {
  const safePrincipal = Math.max(0, isNaN(principal) ? 0 : principal);
  const safeRate = Math.max(0, isNaN(annualRate) ? 0 : annualRate);
  const safeMonths = Math.max(1, isNaN(months) ? 1 : Math.round(months));

  const monthlySchedule: AmortizationMonth[] = [];
  const yearlyMap = new Map<number, { principal: number; interest: number; closing: number }>();

  let balance = safePrincipal;
  const monthlyRate = safeRate / 12 / 100;
  let totalInterestSum = 0;
  let totalPrincipalSum = 0;

  for (let m = 1; m <= safeMonths; m++) {
    const opening = balance;
    let interest = safeRate === 0 ? 0 : opening * monthlyRate;
    let principalPaid = monthlyEmi - interest;

    // Handle last month rounding or balance termination
    if (m === safeMonths || balance - principalPaid <= 0.05) {
      principalPaid = balance;
      balance = 0;
    } else {
      balance = Math.max(0, balance - principalPaid);
    }

    interest = Number(interest.toFixed(2));
    principalPaid = Number(principalPaid.toFixed(2));
    const emiForMonth = Number((principalPaid + interest).toFixed(2));
    const closing = Number(balance.toFixed(2));

    totalInterestSum += interest;
    totalPrincipalSum += principalPaid;

    monthlySchedule.push({
      month: m,
      openingBalance: Number(opening.toFixed(2)),
      emi: emiForMonth,
      principalPaid,
      interestPaid: interest,
      closingBalance: closing,
    });

    // Aggregate into Year
    const yearNumber = Math.ceil(m / 12);
    const existingYear = yearlyMap.get(yearNumber) || { principal: 0, interest: 0, closing: 0 };
    existingYear.principal += principalPaid;
    existingYear.interest += interest;
    existingYear.closing = closing;
    yearlyMap.set(yearNumber, existingYear);
  }

  const yearlySchedule: AmortizationYear[] = Array.from(yearlyMap.entries()).map(([yr, data]) => ({
    year: yr,
    principalPaid: Number(data.principal.toFixed(2)),
    interestPaid: Number(data.interest.toFixed(2)),
    totalPaid: Number((data.principal + data.interest).toFixed(2)),
    closingBalance: data.closing,
  }));

  return {
    monthlySchedule,
    yearlySchedule,
    totalPrincipal: Number(totalPrincipalSum.toFixed(2)),
    totalInterest: Number(totalInterestSum.toFixed(2)),
    totalPayment: Number((totalPrincipalSum + totalInterestSum).toFixed(2)),
  };
}
