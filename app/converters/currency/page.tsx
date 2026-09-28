import { Suspense } from "react";
import type { Metadata } from "next";
import { getToolBySlug } from "@/lib/constants/tools";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { CurrencyConverter } from "@/components/calculators/CurrencyConverter";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Live Currency Converter — Convert 160+ World Currencies Online",
  description:
    "Free live currency converter. Convert USD, EUR, INR, GBP, AED, CAD, and 160+ global currencies with live exchange rates and offline support.",
  alternates: {
    canonical: "https://pockettools.app/converters/currency",
  },
  openGraph: {
    title: "Live Currency Converter Online — Pocket Tools",
    description: "Convert 160+ global currencies with real-time exchange rates and offline cache support.",
  },
};

export default function CurrencyConverterPage() {
  const tool = getToolBySlug("converters/currency");

  if (!tool) {
    notFound();
  }

  return (
    <ToolLayout tool={tool}>
      <Suspense
        fallback={<div className="p-8 text-center text-sm text-text-secondary">Loading Currency Converter...</div>}
      >
        <CurrencyConverter />
      </Suspense>
    </ToolLayout>
  );
}
