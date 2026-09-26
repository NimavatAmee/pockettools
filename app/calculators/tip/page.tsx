import type { Metadata } from "next";
import { getToolBySlug } from "@/lib/constants/tools";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { TipCalculator } from "@/components/calculators/TipCalculator";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Tip Calculator — Calculate Tip & Split Restaurant Bills Online",
  description:
    "Free online tip calculator and bill splitter. Calculate gratuity amounts and divide the total bill evenly per person.",
  alternates: {
    canonical: "https://pockettools.app/calculators/tip",
  },
  openGraph: {
    title: "Tip Calculator & Bill Splitter Online — Pocket Tools",
    description: "Easy dining gratuity calculator and party bill splitter.",
  },
};

export default function TipCalculatorPage() {
  const tool = getToolBySlug("calculators/tip");

  if (!tool) {
    notFound();
  }

  return (
    <ToolLayout tool={tool}>
      <TipCalculator />
    </ToolLayout>
  );
}
