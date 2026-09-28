export type CompoundingFrequency =
  | "daily"
  | "monthly"
  | "quarterly"
  | "semi_annually"
  | "annually";

export interface CompoundInterestParams {
  principal: number;
  annualRate: number; // percentage e.g. 8%
  timeYears: number;
  frequency: CompoundingFrequency;
  periodicAddition?: number; // optional regular addition
  additionFrequency?: "monthly" | "annually";
}

export interface CompoundYearProgression {
  year: number;
  principalInvested: number;
  interestEarned: number;
  totalBalance: number;
}

export interface CompoundInterestResult {
  initialPrincipal: number;
  totalDeposits: number;
  totalInterest: number;
  finalBalance: number;
  simpleInterestComparison: number; // What SI would have yielded
  compoundDifference: number; // Extra money earned via compounding
  yearlySchedule: CompoundYearProgression[];
}

export function getFrequencyTimesPerYear(freq: CompoundingFrequency): number {
  switch (freq) {
    case "daily":
      return 365;
    case "monthly":
      return 12;
    case "quarterly":
      return 4;
    case "semi_annually":
      return 2;
    case "annually":
      return 1;
    default:
      return 1;
  }
}

export function calculateCompoundInterest(
  params: CompoundInterestParams
): CompoundInterestResult {
  const {
    principal,
    annualRate,
    timeYears,
    frequency,
    periodicAddition = 0,
    additionFrequency = "monthly",
  } = params;

  const validPrincipal = Math.max(0, principal);
  const validYears = Math.max(1, Math.min(50, Math.round(timeYears)));
  const rateDec = Math.max(0, annualRate) / 100;
  const n = getFrequencyTimesPerYear(frequency);
  const pmt = Math.max(0, periodicAddition);

  const yearlySchedule: CompoundYearProgression[] = [];
  let currentBalance = validPrincipal;
  let totalDeposited = validPrincipal;

  for (let yr = 1; yr <= validYears; yr++) {
    // We simulate compounding month by month or sub-period for precise yearly schedule
    for (let period = 1; period <= n; period++) {
      // Interest added for this compound slice
      const interestFraction = rateDec / n;
      currentBalance = currentBalance * (1 + interestFraction);

      // Add periodic contribution if applicable
      if (pmt > 0) {
        if (additionFrequency === "monthly") {
          // distribute monthly contribution across periods
          const monthlyAdditionPerSlice = (pmt * 12) / n;
          currentBalance += monthlyAdditionPerSlice;
          totalDeposited += monthlyAdditionPerSlice;
        } else if (additionFrequency === "annually" && period === n) {
          currentBalance += pmt;
          totalDeposited += pmt;
        }
      }
    }

    const roundedBalance = Math.round(currentBalance);
    const roundedDeposits = Math.round(totalDeposited);
    const interestSoFar = Math.max(0, roundedBalance - roundedDeposits);

    yearlySchedule.push({
      year: yr,
      principalInvested: roundedDeposits,
      interestEarned: interestSoFar,
      totalBalance: roundedBalance,
    });
  }

  const finalBalance = Math.round(currentBalance);
  const totalDeposits = Math.round(totalDeposited);
  const totalInterest = Math.max(0, finalBalance - totalDeposits);

  // Simple interest for same principal & deposits
  const simpleInterestComparison = Math.round(
    validPrincipal * rateDec * validYears +
      (pmt > 0
        ? pmt *
          (additionFrequency === "monthly" ? 12 : 1) *
          ((validYears * (validYears + 1)) / 2) *
          rateDec
        : 0)
  );

  const compoundDifference = Math.max(0, totalInterest - simpleInterestComparison);

  return {
    initialPrincipal: Math.round(validPrincipal),
    totalDeposits,
    totalInterest,
    finalBalance,
    simpleInterestComparison,
    compoundDifference,
    yearlySchedule,
  };
}
