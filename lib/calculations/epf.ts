export interface EpfParams {
  currentAge: number;
  retirementAge: number;
  basicSalaryMonthly: number; // Basic Salary + Dearness Allowance (DA)
  employeeContributionPercent: number; // default 12%
  employerEpfPercent: number; // default 3.67% (EPF portion of employer's 12%, remaining 8.33% goes to EPS)
  annualSalaryIncrementPercent: number; // e.g. 5% or 10%
  annualInterestRate: number; // default 8.25% p.a.
  currentEpfBalance?: number; // Existing accumulated EPF balance
}

export interface EpfYearlyBreakdown {
  year: number;
  age: number;
  monthlySalary: number;
  employeeContributionYearly: number;
  employerContributionYearly: number;
  totalContributionYearly: number;
  interestEarnedYearly: number;
  closingBalance: number;
}

export interface EpfResult {
  totalYears: number;
  totalEmployeeContribution: number;
  totalEmployerContribution: number;
  totalContribution: number;
  totalInterestEarned: number;
  maturityCorpus: number;
  yearlySchedule: EpfYearlyBreakdown[];
}

/**
 * Calculates EPF (Employees' Provident Fund) accumulated corpus at retirement.
 * Rules based on EPFO India:
 * - Employee contributes 12% of (Basic + DA).
 * - Employer contributes 12% total: 3.67% goes to EPF, 8.33% goes to EPS (capped typically, but calculated on base).
 * - Interest is credited annually based on monthly running balance.
 * - Salary increments take place annually.
 */
export function calculateEpf(params: EpfParams): EpfResult {
  const currentAge = Math.max(18, Math.min(70, params.currentAge));
  const retirementAge = Math.max(currentAge + 1, Math.min(75, params.retirementAge));
  const totalYears = retirementAge - currentAge;

  let monthlySalary = Math.max(0, params.basicSalaryMonthly);
  const empPercent = Math.max(0, Math.min(100, params.employeeContributionPercent)) / 100;
  const emplyrPercent = Math.max(0, Math.min(100, params.employerEpfPercent)) / 100;
  const incrementRate = Math.max(0, Math.min(50, params.annualSalaryIncrementPercent)) / 100;
  const annualInterestRate = Math.max(0, params.annualInterestRate) / 100;
  const monthlyInterestRate = annualInterestRate / 12;

  let currentBalance = Math.max(0, params.currentEpfBalance || 0);
  let totalEmployeeContribution = 0;
  let totalEmployerContribution = 0;
  let totalInterestEarned = 0;

  const yearlySchedule: EpfYearlyBreakdown[] = [];

  for (let yr = 1; yr <= totalYears; yr++) {
    const age = currentAge + yr;
    const monthlyEmp = monthlySalary * empPercent;
    const monthlyEmplyr = monthlySalary * emplyrPercent;
    const totalMonthlyDeposit = monthlyEmp + monthlyEmplyr;

    const yearlyEmp = monthlyEmp * 12;
    const yearlyEmplyr = monthlyEmplyr * 12;
    const yearlyDeposit = yearlyEmp + yearlyEmplyr;

    // Monthly compounding interest calculation on running balance
    let interestThisYear = 0;
    let runningBalance = currentBalance;

    for (let month = 1; month <= 12; month++) {
      runningBalance += totalMonthlyDeposit;
      interestThisYear += runningBalance * monthlyInterestRate;
    }

    currentBalance = currentBalance + yearlyDeposit + interestThisYear;

    totalEmployeeContribution += yearlyEmp;
    totalEmployerContribution += yearlyEmplyr;
    totalInterestEarned += interestThisYear;

    yearlySchedule.push({
      year: yr,
      age,
      monthlySalary: Math.round(monthlySalary),
      employeeContributionYearly: Math.round(yearlyEmp),
      employerContributionYearly: Math.round(yearlyEmplyr),
      totalContributionYearly: Math.round(yearlyDeposit),
      interestEarnedYearly: Math.round(interestThisYear),
      closingBalance: Math.round(currentBalance),
    });

    // Apply annual salary increment for next year
    monthlySalary = monthlySalary * (1 + incrementRate);
  }

  const totalContribution = Math.round(
    totalEmployeeContribution + totalEmployerContribution + (params.currentEpfBalance || 0)
  );
  const roundedMaturityCorpus = Math.round(currentBalance);
  const roundedTotalInterest = Math.round(totalInterestEarned);

  return {
    totalYears,
    totalEmployeeContribution: Math.round(totalEmployeeContribution),
    totalEmployerContribution: Math.round(totalEmployerContribution),
    totalContribution,
    totalInterestEarned: roundedTotalInterest,
    maturityCorpus: roundedMaturityCorpus,
    yearlySchedule,
  };
}
