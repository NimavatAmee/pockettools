import type { Metadata } from "next";
import { Suspense } from "react";
import { getToolBySlug } from "@/lib/constants/tools";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { EmiCalculator } from "@/components/calculators/EmiCalculator";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "EMI Calculator — Calculate Loan EMI with Amortization Schedule & PDF",
  description:
    "Free loan EMI calculator with Amortization Schedule, PDF report export, Excel/CSV download, and WhatsApp sharing. Handles 0% interest.",
  alternates: {
    canonical: "https://pockettools.app/calculators/emi",
  },
  openGraph: {
    title: "EMI Calculator Online — Pocket Tools",
    description: "Accurate monthly loan EMI calculation with Amortization Schedule and PDF download.",
  },
};

export default function EmiCalculatorPage() {
  const tool = getToolBySlug("calculators/emi");

  if (!tool) {
    notFound();
  }

  return (
    <ToolLayout tool={tool}>
      <Suspense fallback={<div className="p-8 text-center text-sm text-text-secondary">Loading EMI Calculator...</div>}>
        <EmiCalculator />
      </Suspense>
    </ToolLayout>
  );
}
