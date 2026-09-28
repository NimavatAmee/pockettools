import { describe, it, expect } from "vitest";
import { generateAmortizationSchedule } from "@/lib/calculations/amortization";

describe("Amortization Schedule Engine", () => {
  it("should correctly compute 12-month loan schedule ending at 0 balance", () => {
    const schedule = generateAmortizationSchedule(100000, 12, 12, 8884.88);
    expect(schedule.monthlySchedule.length).toBe(12);
    expect(schedule.yearlySchedule.length).toBe(1);

    // Closing balance in final month must be 0
    const lastMonth = schedule.monthlySchedule[11];
    expect(lastMonth.closingBalance).toBe(0);

    // Total principal repaid should match original principal
    expect(Math.round(schedule.totalPrincipal)).toBe(100000);

    // Total interest should be approximately 6618
    expect(Math.round(schedule.totalInterest)).toBe(6619);
  });

  it("should handle 0% no-cost EMI loan correctly", () => {
    const schedule = generateAmortizationSchedule(60000, 0, 6, 10000);
    expect(schedule.monthlySchedule.length).toBe(6);
    expect(schedule.totalInterest).toBe(0);
    expect(schedule.totalPrincipal).toBe(60000);
    expect(schedule.monthlySchedule[0].interestPaid).toBe(0);
    expect(schedule.monthlySchedule[0].principalPaid).toBe(10000);
    expect(schedule.monthlySchedule[5].closingBalance).toBe(0);
  });
});
