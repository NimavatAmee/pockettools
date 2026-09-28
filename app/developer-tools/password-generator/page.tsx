import { Suspense } from "react";
import type { Metadata } from "next";
import { getToolBySlug } from "@/lib/constants/tools";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { PasswordGenerator } from "@/components/calculators/PasswordGenerator";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Password Generator — Strong Random Password Creator (Web Crypto)",
  description:
    "Free secure password generator using cryptographic browser entropy (Web Crypto API). Custom length, symbols, numbers, uppercase, lowercase. 100% private.",
  alternates: {
    canonical: "https://pockettools.app/developer-tools/password-generator",
  },
  openGraph: {
    title: "Secure Password Generator Online — Pocket Tools",
    description: "Generate cryptographically secure random passwords instantly without server transmission.",
  },
};

export default function PasswordGeneratorPage() {
  const tool = getToolBySlug("developer-tools/password-generator");

  if (!tool) {
    notFound();
  }

  return (
    <ToolLayout tool={tool}>
      <Suspense fallback={<div className="p-8 text-center text-sm text-text-secondary">Loading Password Generator...</div>}>
        <PasswordGenerator />
      </Suspense>
    </ToolLayout>
  );
}
