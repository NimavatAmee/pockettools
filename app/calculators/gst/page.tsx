import type { Metadata } from "next";
import { Suspense } from "react";
import { getToolBySlug } from "@/lib/constants/tools";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { GstCalculator } from "@/components/calculators/GstCalculator";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "GST Calculator — Calculate GST Exclusive & Inclusive Online",
  description:
    "Free online GST Calculator for India. Calculate GST exclusive and inclusive prices, CGST, SGST, IGST with 0%, 5%, 12%, 18%, 28% slabs and custom tax rates. Download PDF & CSV.",
  alternates: {
    canonical: "https://pockettools.app/calculators/gst",
  },
  openGraph: {
    title: "GST Calculator Online — Pocket Tools",
    description: "Fast, accurate Goods and Services Tax calculator with inclusive and exclusive tax modes.",
  },
};

export default function GstCalculatorPage() {
  const tool = getToolBySlug("calculators/gst");

  if (!tool) {
    notFound();
  }

  return (
    <ToolLayout tool={tool}>
      <Suspense fallback={<div className="p-8 text-center text-sm text-text-secondary">Loading GST Calculator...</div>}>
        <GstCalculator />
      </Suspense>
    </ToolLayout>
  );
}
