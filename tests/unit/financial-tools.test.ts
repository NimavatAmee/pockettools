import { describe, it, expect } from "vitest";
import { calculateSip } from "@/lib/calculations/sip";
import { calculateCompoundInterest } from "@/lib/calculations/compound-interest";
import { calculateIncomeTax } from "@/lib/calculations/income-tax";
import { calculateFd, calculateRd } from "@/lib/calculations/fd-rd";
import { convertCurrency } from "@/lib/calculations/currency";

describe("Financial Calculation Engines", () => {
  describe("SIP & Lumpsum Engine", () => {
    it("should accurately calculate standard monthly SIP", () => {
      const res = calculateSip({
        investmentType: "sip",
        monthlyInvestment: 5000,
        lumpsumAmount: 0,
        expectedReturnRate: 12,
        timePeriodYears: 10,
      });

      // 5000 * 120 = 600,000 invested
      expect(res.totalInvested).toBe(600000);
      expect(res.totalValue).toBeGreaterThan(1150000);
      expect(res.wealthGained).toBe(res.totalValue - res.totalInvested);
      expect(res.yearlySchedule.length).toBe(10);
    });

    it("should calculate lumpsum returns correctly", () => {
      const res = calculateSip({
        investmentType: "lumpsum",
        monthlyInvestment: 0,
        lumpsumAmount: 100000,
        expectedReturnRate: 10,
        timePeriodYears: 5,
      });

      expect(res.totalInvested).toBe(100000);
      // 100,000 * (1.10)^5 = ~161,051
      expect(res.totalValue).toBe(161051);
      expect(res.yearlySchedule.length).toBe(5);
    });
  });

  describe("Compound Interest Engine", () => {
    it("should calculate quarterly compounding on principal", () => {
      const res = calculateCompoundInterest({
        principal: 100000,
        annualRate: 8,
        timeYears: 5,
        frequency: "quarterly",
      });

      expect(res.initialPrincipal).toBe(100000);
      // A = 100000 * (1 + 0.08/4)^(4*5) = 100000 * (1.02)^20 = ~148,595
      expect(res.finalBalance).toBe(148595);
      expect(res.compoundDifference).toBeGreaterThan(0);
      expect(res.yearlySchedule.length).toBe(5);
    });
  });

  describe("Income Tax Engine (Old vs New Regime)", () => {
    it("should give 0 tax for salaried up to ₹7.75 Lakh in New Regime (Section 87A + Std Deduction)", () => {
      const res = calculateIncomeTax({
        grossSalary: 775000,
        otherIncome: 0,
        ageCategory: "general",
        section80C: 0,
        section80D: 0,
        section24b: 0,
        hraExemption: 0,
        nps80CCD1B: 0,
        otherDeductions: 0,
      });

      expect(res.newRegime.standardDeduction).toBe(75000);
      expect(res.newRegime.netTaxableIncome).toBe(700000);
      expect(res.newRegime.totalTaxLiability).toBe(0);
      expect(res.recommendedRegime).toBe("new");
    });

    it("should compare Old Regime with high deductions", () => {
      const res = calculateIncomeTax({
        grossSalary: 1200000,
        otherIncome: 0,
        ageCategory: "general",
        section80C: 150000,
        section80D: 50000,
        section24b: 200000,
        hraExemption: 100000,
        nps80CCD1B: 50000,
        otherDeductions: 0,
      });

      expect(res.oldRegime.totalDeductions).toBe(600000); // 50k + 1.5L + 50k + 2L + 1L + 50k
      expect(res.oldRegime.netTaxableIncome).toBe(600000);
      expect(res.oldRegime.totalTaxLiability).toBeGreaterThan(0);
    });
  });

  describe("FD & RD Engine", () => {
    it("should calculate bank FD with quarterly compounding", () => {
      const fd = calculateFd({
        depositAmount: 100000,
        annualInterestRate: 7,
        tenureYears: 1,
        tenureMonths: 0,
        tenureDays: 0,
        isSeniorCitizen: false,
        compoundingFrequency: "quarterly",
      });

      // 100,000 * (1 + 0.07/4)^4 = 100,000 * (1.0175)^4 = ~107,186
      expect(fd.principalAmount).toBe(100000);
      expect(fd.maturityAmount).toBe(107186);
      expect(fd.totalInterestEarned).toBe(7186);
      expect(fd.isTdsApplicable).toBe(false);
    });

    it("should calculate bank RD with monthly installments", () => {
      const rd = calculateRd({
        monthlyDeposit: 5000,
        annualInterestRate: 7,
        tenureMonths: 12,
        isSeniorCitizen: false,
      });

      expect(rd.totalInvested).toBe(60000);
      expect(rd.maturityAmount).toBeGreaterThan(62000);
      expect(rd.totalInterestEarned).toBeGreaterThan(2000);
    });
  });

  describe("Currency Conversion Engine", () => {
    it("should convert USD to INR correctly", () => {
      const conv = convertCurrency(100, "USD", "INR", { USD: 1, INR: 83.5 });
      expect(conv.fromAmount).toBe(100);
      expect(conv.convertedAmount).toBe(8350);
      expect(conv.exchangeRate).toBe(83.5);
    });

    it("should handle currency reversal", () => {
      const conv = convertCurrency(8350, "INR", "USD", { USD: 1, INR: 83.5 });
      expect(conv.fromAmount).toBe(8350);
      expect(conv.convertedAmount).toBe(100);
    });
  });
});
