import type { Metadata } from "next";
import { getToolBySlug } from "@/lib/constants/tools";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { PercentageCalculator } from "@/components/calculators/PercentageCalculator";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Percentage Calculator — Calculate Percent of Value & Change",
  description:
    "Free percentage calculator. Calculate what is X% of Y, X is what % of Y, and percentage increase or decrease easily online.",
  alternates: {
    canonical: "https://pockettools.app/calculators/percentage",
  },
  openGraph: {
    title: "Percentage Calculator Online — Pocket Tools",
    description: "Multi-mode percentage calculator for discounts, tax calculations, and percentage change.",
  },
};

export default function PercentageCalculatorPage() {
  const tool = getToolBySlug("calculators/percentage");

  if (!tool) {
    notFound();
  }

  return (
    <ToolLayout tool={tool}>
      <PercentageCalculator />
    </ToolLayout>
  );
}
