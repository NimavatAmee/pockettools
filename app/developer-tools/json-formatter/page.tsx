import type { Metadata } from "next";
import { getToolBySlug } from "@/lib/constants/tools";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { JsonFormatter } from "@/components/calculators/JsonFormatter";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator — Beautify, Minify & Inspect JSON Online",
  description:
    "Free online JSON formatter, validator, and minifier. Fix syntax errors, beautify with 2 or 4 spaces indent, 100% private in-browser tool.",
  alternates: {
    canonical: "https://pockettools.app/developer-tools/json-formatter",
  },
  openGraph: {
    title: "JSON Formatter & Validator Online — Pocket Tools",
    description: "Format, beautify, and validate JSON code with syntax error detection.",
  },
};

export default function JsonFormatterPage() {
  const tool = getToolBySlug("developer-tools/json-formatter");

  if (!tool) {
    notFound();
  }

  return (
    <ToolLayout tool={tool}>
      <JsonFormatter />
    </ToolLayout>
  );
}
