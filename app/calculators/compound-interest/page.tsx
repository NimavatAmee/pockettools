import { Suspense } from "react";
import type { Metadata } from "next";
import { getToolBySlug } from "@/lib/constants/tools";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { CompoundInterestCalculator } from "@/components/calculators/CompoundInterestCalculator";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Compound Interest Calculator — Daily, Monthly & Yearly Compounding",
  description:
    "Free online compound interest calculator. Calculate APY returns with daily, monthly, quarterly, and annual compounding plus monthly additions.",
  alternates: {
    canonical: "https://pockettools.app/calculators/compound-interest",
  },
  openGraph: {
    title: "Compound Interest Calculator Online — Pocket Tools",
    description: "Calculate compound interest with multiple frequencies and compare with simple interest.",
  },
};

export default function CompoundInterestCalculatorPage() {
  const tool = getToolBySlug("calculators/compound-interest");

  if (!tool) {
    notFound();
  }

  return (
    <ToolLayout tool={tool}>
      <Suspense
        fallback={<div className="p-8 text-center text-sm text-text-secondary">Loading Compound Interest Calculator...</div>}
      >
        <CompoundInterestCalculator />
      </Suspense>
    </ToolLayout>
  );
}
