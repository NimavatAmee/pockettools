import { Suspense } from "react";
import type { Metadata } from "next";
import { getToolBySlug } from "@/lib/constants/tools";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { PomodoroTimer } from "@/components/calculators/PomodoroTimer";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Pomodoro Focus Timer — Boost Productivity with Tab Alerts & Sound",
  description:
    "Free online Pomodoro focus timer with live browser tab countdown, audio notifications, interval customization, and daily focus statistics. 100% client-side.",
  alternates: {
    canonical: "https://pockettools.app/date-time/pomodoro",
  },
  openGraph: {
    title: "Pomodoro Focus Timer Online — Pocket Tools",
    description: "Online Pomodoro timer with live tab countdown, customizable intervals, and sound alerts.",
  },
};

export default function PomodoroTimerPage() {
  const tool = getToolBySlug("date-time/pomodoro");

  if (!tool) {
    notFound();
  }

  return (
    <ToolLayout tool={tool}>
      <Suspense fallback={<div className="p-8 text-center text-sm text-text-secondary">Loading Pomodoro Timer...</div>}>
        <PomodoroTimer />
      </Suspense>
    </ToolLayout>
  );
}
