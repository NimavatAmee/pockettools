import { Suspense } from "react";
import type { Metadata } from "next";
import { getToolBySlug } from "@/lib/constants/tools";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { IncomeTaxCalculator } from "@/components/calculators/IncomeTaxCalculator";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Income Tax Calculator FY 2024-25 & 2025-26 — Old vs New Regime Compare",
  description:
    "Free online Indian income tax calculator. Compare Old vs New Tax Regime side-by-side with ₹75,000 Standard Deduction, Section 87A rebate, and 80C/80D deductions.",
  alternates: {
    canonical: "https://pockettools.app/calculators/income-tax",
  },
  openGraph: {
    title: "Income Tax Calculator Online — Pocket Tools",
    description: "Compare Old vs New Tax Regime for FY 2024-25 & FY 2025-26 with instant tax savings recommendation.",
  },
};

export default function IncomeTaxCalculatorPage() {
  const tool = getToolBySlug("calculators/income-tax");

  if (!tool) {
    notFound();
  }

  return (
    <ToolLayout tool={tool}>
      <Suspense
        fallback={<div className="p-8 text-center text-sm text-text-secondary">Loading Income Tax Calculator...</div>}
      >
        <IncomeTaxCalculator />
      </Suspense>
    </ToolLayout>
  );
}
