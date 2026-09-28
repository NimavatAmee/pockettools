import { Suspense } from "react";
import type { Metadata } from "next";
import { getToolBySlug } from "@/lib/constants/tools";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { EpfCalculator } from "@/components/calculators/EpfCalculator";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "EPF Calculator — Employees' Provident Fund & Retirement Corpus Calculator",
  description:
    "Free online EPF calculator. Calculate your provident fund balance, retirement maturity corpus, interest earned at 8.25%, and yearly salary increment projections.",
  alternates: {
    canonical: "https://pockettools-seven.vercel.app/calculators/epf",
  },
  openGraph: {
    title: "EPF Calculator — Provident Fund Retirement Corpus",
    description: "Calculate your EPF balance, compounding interest, and retirement wealth with yearly increment projections.",
  },
};

export default function EpfCalculatorPage() {
  const tool = getToolBySlug("calculators/epf");

  if (!tool) {
    notFound();
  }

  return (
    <ToolLayout tool={tool}>
      <Suspense
        fallback={<div className="p-8 text-center text-sm text-text-secondary">Loading EPF Calculator...</div>}
      >
        <EpfCalculator />
      </Suspense>
    </ToolLayout>
  );
}
