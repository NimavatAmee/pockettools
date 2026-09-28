export interface SipParams {
  investmentType: "sip" | "lumpsum";
  monthlyInvestment: number;
  lumpsumAmount: number;
  expectedReturnRate: number; // annual percentage e.g. 12
  timePeriodYears: number;
  stepUpPercentage?: number; // annual increment e.g. 10% (0 for none)
}

export interface YearProgression {
  year: number;
  investedAmount: number;
  wealthGained: number;
  totalCorpus: number;
}

export interface SipResult {
  totalInvested: number;
  wealthGained: number;
  totalValue: number;
  yearlySchedule: YearProgression[];
}

export function calculateSip(params: SipParams): SipResult {
  const {
    investmentType,
    monthlyInvestment,
    lumpsumAmount,
    expectedReturnRate,
    timePeriodYears,
    stepUpPercentage = 0,
  } = params;

  const validYears = Math.max(1, Math.min(50, Math.round(timePeriodYears)));
  const annualRate = Math.max(0, expectedReturnRate);
  const monthlyRate = annualRate / 12 / 100;
  const yearlySchedule: YearProgression[] = [];

  if (investmentType === "lumpsum") {
    const P = Math.max(0, lumpsumAmount);
    let currentCorpus = P;

    for (let yr = 1; yr <= validYears; yr++) {
      currentCorpus = P * Math.pow(1 + annualRate / 100, yr);
      yearlySchedule.push({
        year: yr,
        investedAmount: Math.round(P),
        wealthGained: Math.round(currentCorpus - P),
        totalCorpus: Math.round(currentCorpus),
      });
    }

    const totalValue = Math.round(currentCorpus);
    const totalInvested = Math.round(P);
    const wealthGained = Math.max(0, totalValue - totalInvested);

    return {
      totalInvested,
      wealthGained,
      totalValue,
      yearlySchedule,
    };
  }

  // SIP / Step-Up SIP calculation
  let totalInvestedAcc = 0;
  let currentCorpusAcc = 0;
  let currentMonthlySIP = Math.max(0, monthlyInvestment);

  for (let yr = 1; yr <= validYears; yr++) {
    for (let m = 1; m <= 12; m++) {
      totalInvestedAcc += currentMonthlySIP;
      currentCorpusAcc = (currentCorpusAcc + currentMonthlySIP) * (1 + monthlyRate);
    }

    yearlySchedule.push({
      year: yr,
      investedAmount: Math.round(totalInvestedAcc),
      wealthGained: Math.round(Math.max(0, currentCorpusAcc - totalInvestedAcc)),
      totalCorpus: Math.round(currentCorpusAcc),
    });

    if (stepUpPercentage > 0) {
      currentMonthlySIP += (currentMonthlySIP * stepUpPercentage) / 100;
    }
  }

  const totalInvested = Math.round(totalInvestedAcc);
  const totalValue = Math.round(currentCorpusAcc);
  const wealthGained = Math.max(0, totalValue - totalInvested);

  return {
    totalInvested,
    wealthGained,
    totalValue,
    yearlySchedule,
  };
}
