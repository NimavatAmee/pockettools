import { Suspense } from "react";
import type { Metadata } from "next";
import { getToolBySlug } from "@/lib/constants/tools";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { SipCalculator } from "@/components/calculators/SipCalculator";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "SIP Calculator — Mutual Fund SIP & Lumpsum Investment Return Calculator",
  description:
    "Free online SIP calculator. Calculate mutual fund wealth growth, monthly SIP returns, Lumpsum returns, and Step-Up top-ups with interactive charts.",
  alternates: {
    canonical: "https://pockettools.app/calculators/sip",
  },
  openGraph: {
    title: "SIP Calculator Online — Pocket Tools",
    description: "Calculate mutual fund SIP returns and visualize wealth growth with interactive charts.",
  },
};

export default function SipCalculatorPage() {
  const tool = getToolBySlug("calculators/sip");

  if (!tool) {
    notFound();
  }

  return (
    <ToolLayout tool={tool}>
      <Suspense fallback={<div className="p-8 text-center text-sm text-text-secondary">Loading SIP Calculator...</div>}>
        <SipCalculator />
      </Suspense>
    </ToolLayout>
  );
}
