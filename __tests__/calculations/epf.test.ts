import { describe, it, expect } from "vitest";
import { calculateEpf } from "@/lib/calculations/epf";

describe("calculateEpf", () => {
  it("calculates basic EPF corpus accurately", () => {
    const result = calculateEpf({
      currentAge: 25,
      retirementAge: 58,
      basicSalaryMonthly: 30000,
      employeeContributionPercent: 12,
      employerEpfPercent: 3.67,
      annualSalaryIncrementPercent: 5,
      annualInterestRate: 8.25,
      currentEpfBalance: 0,
    });

    expect(result.totalYears).toBe(33);
    expect(result.maturityCorpus).toBeGreaterThan(result.totalContribution);
    expect(result.totalInterestEarned).toBeGreaterThan(0);
    expect(result.yearlySchedule.length).toBe(33);
    expect(result.yearlySchedule[0].age).toBe(26);
  });

  it("handles existing EPF initial balance", () => {
    const result = calculateEpf({
      currentAge: 30,
      retirementAge: 60,
      basicSalaryMonthly: 50000,
      employeeContributionPercent: 12,
      employerEpfPercent: 3.67,
      annualSalaryIncrementPercent: 0,
      annualInterestRate: 8.25,
      currentEpfBalance: 200000,
    });

    expect(result.totalYears).toBe(30);
    expect(result.maturityCorpus).toBeGreaterThan(200000);
    expect(result.totalContribution).toBeGreaterThan(200000);
  });
});
