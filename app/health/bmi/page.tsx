import { Suspense } from "react";
import type { Metadata } from "next";
import { getToolBySlug } from "@/lib/constants/tools";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { BmiCalculator } from "@/components/calculators/BmiCalculator";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "BMI Calculator — Body Mass Index Calculator (Metric & Imperial)",
  description:
    "Free online Body Mass Index (BMI) calculator for men and women. Check your healthy weight range and WHO health category in kg/cm or lbs/ft-in.",
  alternates: {
    canonical: "https://pockettools.app/health/bmi",
  },
  openGraph: {
    title: "BMI Calculator Online — Pocket Tools",
    description: "Check your Body Mass Index with metric and imperial measurements and healthy weight target.",
  },
};

export default function BmiCalculatorPage() {
  const tool = getToolBySlug("health/bmi");

  if (!tool) {
    notFound();
  }

  return (
    <ToolLayout tool={tool}>
      <Suspense fallback={<div className="p-8 text-center text-sm text-text-secondary">Loading BMI Calculator...</div>}>
        <BmiCalculator />
      </Suspense>
    </ToolLayout>
  );
}
