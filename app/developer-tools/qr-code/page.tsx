import { Suspense } from "react";
import type { Metadata } from "next";
import { getToolBySlug } from "@/lib/constants/tools";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { QrCodeGenerator } from "@/components/calculators/QrCodeGenerator";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "QR Code Generator — Free Online WiFi, URL & vCard QR Maker (PNG & SVG)",
  description:
    "Free online QR code generator. Create customized QR codes for WiFi networks, website URLs, digital vCard contacts, text, email, and UPI. Download high-resolution PNG & SVG vector files. 100% private & client-side.",
  alternates: {
    canonical: "https://pockettools.app/developer-tools/qr-code",
  },
  openGraph: {
    title: "QR Code Generator Online — Pocket Tools",
    description: "Create WiFi, URL, vCard & UPI QR codes with custom colors and vector SVG download.",
  },
};

export default function QrCodeGeneratorPage() {
  const tool = getToolBySlug("developer-tools/qr-code");

  if (!tool) {
    notFound();
  }

  return (
    <ToolLayout tool={tool}>
      <Suspense fallback={<div className="p-8 text-center text-sm text-text-secondary">Loading QR Code Generator...</div>}>
        <QrCodeGenerator />
      </Suspense>
    </ToolLayout>
  );
}
