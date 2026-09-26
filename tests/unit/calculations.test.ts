import { describe, it, expect } from "vitest";
import { calculateGst } from "@/lib/calculations/gst";
import { calculateEmi } from "@/lib/calculations/emi";
import { calculateDiscount } from "@/lib/calculations/discount";
import { calculatePercentage } from "@/lib/calculations/percentage";
import { calculateTip } from "@/lib/calculations/tip";
import { evaluateExpression } from "@/lib/calculations/calculator";
import { calculateBmi } from "@/lib/calculations/bmi";
import { calculateAge, calculateDateDifference } from "@/lib/calculations/date";
import { convertUnit } from "@/lib/calculations/unit-converter";
import { formatJson } from "@/lib/calculations/json-formatter";
import { generateSecurePassword } from "@/lib/calculations/password-generator";

describe("Smoke Tests & Core Calculations Verification", () => {
  // 1. GST Calculator
  describe("GST Calculator", () => {
    it("should calculate ₹1,000 at 18% exclusive: Tax ₹180, Total ₹1,180", () => {
      const result = calculateGst({ amount: 1000, rate: 18, isInclusive: false });
      expect(result.baseAmount).toBe(1000);
      expect(result.gstAmount).toBe(180);
      expect(result.totalAmount).toBe(1180);
      expect(result.cgst).toBe(90);
      expect(result.sgst).toBe(90);
    });

    it("should calculate ₹1,180 at 18% inclusive: Tax ₹180, Base ₹1,000", () => {
      const result = calculateGst({ amount: 1180, rate: 18, isInclusive: true });
      expect(result.baseAmount).toBe(1000);
      expect(result.gstAmount).toBe(180);
      expect(result.totalAmount).toBe(1180);
    });

    it("should handle 0% rate and ₹0 amount gracefully", () => {
      const result = calculateGst({ amount: 500, rate: 0, isInclusive: false });
      expect(result.gstAmount).toBe(0);
      expect(result.totalAmount).toBe(500);
    });
  });

  // 2. EMI Calculator
  describe("EMI Calculator", () => {
    it("should calculate ₹100,000 at 12% annual for 12 months: EMI approx ₹8,884.88", () => {
      const result = calculateEmi({
        principal: 100000,
        annualInterestRate: 12,
        tenureValue: 12,
        tenureType: "months",
      });
      expect(result.monthlyEmi).toBe(8884.88);
      expect(result.totalPayment).toBe(106618.55);
      expect(result.totalInterest).toBe(6618.55);
    });

    it("should handle zero interest EMI gracefully", () => {
      const result = calculateEmi({
        principal: 60000,
        annualInterestRate: 0,
        tenureValue: 6,
        tenureType: "months",
      });
      expect(result.monthlyEmi).toBe(10000);
      expect(result.totalInterest).toBe(0);
      expect(result.totalPayment).toBe(60000);
    });
  });

  // 3. Discount Calculator
  describe("Discount Calculator", () => {
    it("should calculate ₹1,000 with 20% discount: Discount ₹200, Final ₹800", () => {
      const result = calculateDiscount({ originalPrice: 1000, discountPercentage: 20 });
      expect(result.savingsAmount).toBe(200);
      expect(result.finalPrice).toBe(800);
    });

    it("should handle 100% discount correctly", () => {
      const result = calculateDiscount({ originalPrice: 500, discountPercentage: 100 });
      expect(result.savingsAmount).toBe(500);
      expect(result.finalPrice).toBe(0);
    });
  });

  // 4. Percentage Calculator
  describe("Percentage Calculator", () => {
    it("should calculate 20% of 500 = 100", () => {
      const result = calculatePercentage({ mode: "percent_of", valueX: 20, valueY: 500 });
      expect(result.result).toBe(100);
    });

    it("should calculate 50 is what % of 200 = 25%", () => {
      const result = calculatePercentage({ mode: "what_percent", valueX: 50, valueY: 200 });
      expect(result.result).toBe(25);
    });

    it("should calculate percentage increase from 100 to 150 = 50%", () => {
      const result = calculatePercentage({ mode: "increase_decrease", valueX: 100, valueY: 150 });
      expect(result.result).toBe(50);
      expect(result.isIncrease).toBe(true);
    });

    it("should handle division by zero safely", () => {
      const result = calculatePercentage({ mode: "what_percent", valueX: 50, valueY: 0 });
      expect(result.result).toBe(0);
    });
  });

  // 5. Tip Calculator
  describe("Tip Calculator", () => {
    it("should calculate ₹1,000 at 10% for 2 people: Tip ₹100, Total ₹1,100, Per Person ₹550", () => {
      const result = calculateTip({ billAmount: 1000, tipPercentage: 10, numberOfPeople: 2 });
      expect(result.tipAmount).toBe(100);
      expect(result.totalAmount).toBe(1100);
      expect(result.tipPerPerson).toBe(50);
      expect(result.totalPerPerson).toBe(550);
    });
  });

  // 6. Basic Calculator
  describe("Basic Calculator (No eval)", () => {
    it("should evaluate basic arithmetic expressions accurately", () => {
      expect(evaluateExpression("10 + 20 * 2").value).toBe(50);
      expect(evaluateExpression("(10 + 20) * 2").value).toBe(60);
      expect(evaluateExpression("100 / 4 - 5").value).toBe(20);
    });

    it("should handle division by zero safely without crashing", () => {
      const res = evaluateExpression("50 / 0");
      expect(res.success).toBe(false);
      expect(res.error).toBe("Cannot divide by zero");
    });
  });

  // 7. BMI Calculator
  describe("BMI Calculator", () => {
    it("should calculate 70 kg, 175 cm = approx 22.86 (Normal weight)", () => {
      const result = calculateBmi({ system: "metric", weightKg: 70, heightCm: 175 });
      expect(result).not.toBeNull();
      expect(result?.bmi).toBe(22.86);
      expect(result?.category).toBe("Normal weight");
    });
  });

  // 8. Age & Date Difference
  describe("Date Calculations", () => {
    it("should reject future date of birth", () => {
      const res = calculateAge("2099-01-01");
      expect(res.isValid).toBe(false);
      expect(res.errorMessage).toBe("Date of birth cannot be in the future.");
    });

    it("should calculate date difference from 2026-01-01 to 2026-01-31 = 30 elapsed days", () => {
      const res = calculateDateDifference("2026-01-01", "2026-01-31", false);
      expect(res.isValid).toBe(true);
      expect(res.totalDays).toBe(30);
    });
  });

  // 9. Unit Converter
  describe("Unit Converter", () => {
    it("should convert 0°C to °F = 32°F", () => {
      const res = convertUnit("temperature", "c", "f", 0);
      expect(res.toValue).toBe(32);
    });

    it("should convert 1000m to km = 1km", () => {
      const res = convertUnit("length", "m", "km", 1000);
      expect(res.toValue).toBe(1);
    });
  });

  // 10. JSON Formatter
  describe("JSON Formatter", () => {
    it("should format valid JSON correctly without eval", () => {
      const res = formatJson('{"name":"Pocket"}');
      expect(res.success).toBe(true);
      expect(res.formattedJson).toContain('"name": "Pocket"');
    });

    it("should report readable error for invalid JSON", () => {
      const res = formatJson('{name: "invalid"}');
      expect(res.success).toBe(false);
      expect(res.error?.message).toBeDefined();
    });
  });

  // 11. Password Generator
  describe("Password Generator", () => {
    it("should generate a secure password of requested length", () => {
      const res = generateSecurePassword({
        length: 20,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
      });
      expect(res.password.length).toBe(20);
      expect(res.strength).toBe("Very Strong");
    });
  });
});
