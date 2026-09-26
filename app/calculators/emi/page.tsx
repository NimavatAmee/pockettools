import type { Metadata } from "next";
import { getToolBySlug } from "@/lib/constants/tools";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { EmiCalculator } from "@/components/calculators/EmiCalculator";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "EMI Calculator — Calculate Home, Car & Personal Loan EMI Online",
  description:
    "Free loan EMI calculator. Calculate monthly EMI, total interest payable, and overall loan repayment with support for 0% no-cost EMI.",
  alternates: {
    canonical: "https://pockettools.app/calculators/emi",
  },
  openGraph: {
    title: "EMI Calculator Online — Pocket Tools",
    description: "Accurate monthly loan EMI calculation with visual principal vs interest breakdown.",
  },
};

export default function EmiCalculatorPage() {
  const tool = getToolBySlug("calculators/emi");

  if (!tool) {
    notFound();
  }

  return (
    <ToolLayout tool={tool}>
      <EmiCalculator />
    </ToolLayout>
  );
}
