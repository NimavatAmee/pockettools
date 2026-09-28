import type { Metadata } from "next";
import { Suspense } from "react";
import { getToolBySlug } from "@/lib/constants/tools";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { BasicCalculator } from "@/components/calculators/BasicCalculator";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Basic Calculator — Fast Online Arithmetic Calculator",
  description:
    "Free online standard calculator. Fast, keyboard-friendly arithmetic operations, percentages, and decimals. No eval(), 100% private.",
  alternates: {
    canonical: "https://pockettools.app/math/basic-calculator",
  },
  openGraph: {
    title: "Basic Calculator Online — Pocket Tools",
    description: "Fast, keyboard-friendly online calculator for everyday arithmetic math.",
  },
};

export default function BasicCalculatorPage() {
  const tool = getToolBySlug("math/basic-calculator");

  if (!tool) {
    notFound();
  }

  return (
    <ToolLayout tool={tool}>
      <Suspense fallback={<div className="p-8 text-center text-sm text-text-secondary">Loading Calculator...</div>}>
        <BasicCalculator />
      </Suspense>
    </ToolLayout>
  );
}
