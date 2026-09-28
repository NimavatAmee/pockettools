import { Suspense } from "react";
import type { Metadata } from "next";
import { getToolBySlug } from "@/lib/constants/tools";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { DateDifferenceCalculator } from "@/components/calculators/DateDifferenceCalculator";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Date Difference Calculator — Days Between Two Dates",
  description:
    "Free date difference calculator. Calculate elapsed days, weeks, months, years, and business working days between any two dates.",
  alternates: {
    canonical: "https://pockettools.app/date-time/date-difference",
  },
  openGraph: {
    title: "Date Difference Calculator Online — Pocket Tools",
    description: "Calculate elapsed calendar days and business days between dates accurately.",
  },
};

export default function DateDifferenceCalculatorPage() {
  const tool = getToolBySlug("date-time/date-difference");

  if (!tool) {
    notFound();
  }

  return (
    <ToolLayout tool={tool}>
      <Suspense fallback={<div className="p-8 text-center text-sm text-text-secondary">Loading Date Difference Calculator...</div>}>
        <DateDifferenceCalculator />
      </Suspense>
    </ToolLayout>
  );
}
