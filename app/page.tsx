import type { Metadata } from "next";
import { HomeClient } from "@/components/home/HomeClient";

export const metadata: Metadata = {
  title: "Pocket Tools — Everything You Need, All in One Place",
  description:
    "Fast, simple and free online tools for everyday calculations and utilities: GST Calculator, EMI, BMI, Discount, Tip, Unit Converter, JSON Formatter, and Password Generator.",
  alternates: {
    canonical: "https://pockettools.app",
  },
};

export default function HomePage() {
  return <HomeClient />;
}
