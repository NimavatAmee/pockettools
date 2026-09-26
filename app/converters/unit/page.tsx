import type { Metadata } from "next";
import { getToolBySlug } from "@/lib/constants/tools";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { UnitConverter } from "@/components/calculators/UnitConverter";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Unit Converter — Convert Length, Weight, Temperature, Data & More",
  description:
    "Free multi-unit converter. Convert units across Length, Weight, Temperature (°C to °F), Area, Volume, Time, and Digital Storage Data instantly.",
  alternates: {
    canonical: "https://pockettools.app/converters/unit",
  },
  openGraph: {
    title: "Unit Converter Online — Pocket Tools",
    description: "Convert units across length, weight, temperature, area, volume, and data fast.",
  },
};

export default function UnitConverterPage() {
  const tool = getToolBySlug("converters/unit");

  if (!tool) {
    notFound();
  }

  return (
    <ToolLayout tool={tool}>
      <UnitConverter />
    </ToolLayout>
  );
}
