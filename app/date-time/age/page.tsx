import { Suspense } from "react";
import type { Metadata } from "next";
import { getToolBySlug } from "@/lib/constants/tools";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { AgeCalculator } from "@/components/calculators/AgeCalculator";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Age Calculator — Calculate Exact Age in Years, Months & Days",
  description:
    "Free online age calculator. Find out your exact age in years, months, days, hours, and count down to your next birthday.",
  alternates: {
    canonical: "https://pockettools.app/date-time/age",
  },
  openGraph: {
    title: "Age Calculator Online — Pocket Tools",
    description: "Calculate exact age breakdown and birthday countdown online.",
  },
};

export default function AgeCalculatorPage() {
  const tool = getToolBySlug("date-time/age");

  if (!tool) {
    notFound();
  }

  return (
    <ToolLayout tool={tool}>
      <Suspense fallback={<div className="p-8 text-center text-sm text-text-secondary">Loading Age Calculator...</div>}>
        <AgeCalculator />
      </Suspense>
    </ToolLayout>
  );
}
