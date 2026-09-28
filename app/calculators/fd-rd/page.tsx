import { Suspense } from "react";
import type { Metadata } from "next";
import { getToolBySlug } from "@/lib/constants/tools";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { FdRdCalculator } from "@/components/calculators/FdRdCalculator";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "FD & RD Calculator — Fixed & Recurring Deposit Maturity Return Calculator",
  description:
    "Free bank FD and RD calculator. Calculate maturity value with quarterly compounding, senior citizen rate boost, and Section 194A TDS threshold alerts.",
  alternates: {
    canonical: "https://pockettools.app/calculators/fd-rd",
  },
  openGraph: {
    title: "FD & RD Calculator Online — Pocket Tools",
    description: "Calculate Fixed Deposit and Recurring Deposit maturity returns with quarterly bank compounding.",
  },
};

export default function FdRdCalculatorPage() {
  const tool = getToolBySlug("calculators/fd-rd");

  if (!tool) {
    notFound();
  }

  return (
    <ToolLayout tool={tool}>
      <Suspense fallback={<div className="p-8 text-center text-sm text-text-secondary">Loading FD & RD Calculator...</div>}>
        <FdRdCalculator />
      </Suspense>
    </ToolLayout>
  );
}
