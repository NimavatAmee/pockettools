import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Zap, Sparkles, Layers, Award, HeartHandshake } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export const metadata: Metadata = {
  title: "About Pocket Tools — Fast, Private, Offline-Ready Utilities",
  description:
    "Learn about Pocket Tools mission to deliver fast, accurate, and completely private browser-based utility tools.",
  alternates: {
    canonical: "https://pockettools.app/about",
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      <div className="space-y-4 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text">
          About Pocket Tools
        </h1>
        <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
          Pocket Tools is a suite of modern, lightweight, privacy-first web utilities designed for professionals, students, developers, and everyday users.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-btn bg-primary-light text-primary flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <CardTitle className="text-base">Blazing Fast Client Calculations</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-text-secondary leading-relaxed">
            All arithmetic, conversions, and string formatting execute immediately in your browser runtime without backend API latency.
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-btn bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <CardTitle className="text-base">Absolute Privacy by Design</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-text-secondary leading-relaxed">
            No accounts, no user telemetry trackers, and no backend database. Your calculations, JSON documents, and generated passwords never leave your device.
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-btn bg-primary-light text-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <CardTitle className="text-base">No Ad Clutter</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-text-secondary leading-relaxed">
            Clean, modern interface designed around speed and ease of use, free from popups, deceptive ads, or paywalls.
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-btn bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <CardTitle className="text-base">Accessible & Responsive</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-text-secondary leading-relaxed">
            Full keyboard accessibility, high-contrast dark mode support, and fluid layouts for phones, tablets, and desktops.
          </CardContent>
        </Card>
      </div>

      <div className="p-6 rounded-card border border-border bg-surface-secondary/40 space-y-3">
        <h3 className="text-base font-bold text-text">Our Core Philosophy</h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          Everyday tools shouldn’t require downloading heavy apps or trading personal data. Pocket Tools is crafted with Next.js and TypeScript strict mode to provide reliable, mathematically rigorous tools you can trust anytime.
        </p>
      </div>
    </div>
  );
}
