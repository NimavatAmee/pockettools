import type { Metadata } from "next";
import { getToolBySlug } from "@/lib/constants/tools";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { DiscountCalculator } from "@/components/calculators/DiscountCalculator";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Discount Calculator — Calculate Sale Price & Savings Online",
  description:
    "Fast online discount calculator. Find out final prices after percentage markdowns and see total money saved.",
  alternates: {
    canonical: "https://pockettools.app/calculators/discount",
  },
  openGraph: {
    title: "Discount Calculator Online — Pocket Tools",
    description: "Calculate sale price and savings instantly with percentage presets.",
  },
};

export default function DiscountCalculatorPage() {
  const tool = getToolBySlug("calculators/discount");

  if (!tool) {
    notFound();
  }

  return (
    <ToolLayout tool={tool}>
      <DiscountCalculator />
    </ToolLayout>
  );
}
