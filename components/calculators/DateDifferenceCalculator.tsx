"use client";

import React, { useState, useMemo } from "react";
import { calculateDateDifference } from "@/lib/calculations/date";
import { useShareableUrl } from "@/hooks/useShareableUrl";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { CopyButton } from "@/components/shared/CommonStates";
import { ShareButton } from "@/components/shared/ShareModal";
import { RotateCcw, Calendar, Briefcase, SunMedium } from "lucide-react";

export function DateDifferenceCalculator() {
  const { getInitialParam } = useShareableUrl({});

  const [startDateStr, setStartDateStr] = useState<string>(() =>
    getInitialParam("start", "2026-01-01")
  );
  const [endDateStr, setEndDateStr] = useState<string>(() =>
    getInitialParam("end", "2026-01-31")
  );
  const [inclusive, setInclusive] = useState<boolean>(() =>
    getInitialParam("inc", "0") === "1"
  );

  useShareableUrl(
    useMemo(
      () => ({
        start: startDateStr,
        end: endDateStr,
        inc: inclusive ? "1" : "0",
      }),
      [startDateStr, endDateStr, inclusive]
    )
  );

  const result = calculateDateDifference(startDateStr, endDateStr, inclusive);

  const handleReset = () => {
    setStartDateStr("2026-01-01");
    setEndDateStr("2026-01-31");
    setInclusive(false);
  };

  const copySummaryText = `Your Date Difference Result

Calendar & Business Days Duration

Start Date: ${startDateStr}
End Date: ${endDateStr}
Include End Date: ${inclusive ? "Yes (+1 day)" : "No"}

Total Elapsed Days: ${inclusive ? result.inclusiveDays : result.totalDays} Days
Calendar Duration: ${result.years > 0 ? `${result.years} Years, ` : ""}${result.months > 0 ? `${result.months} Months, ` : ""}${result.days} Days (${result.weeks} weeks and ${result.remainingDays} days)
Working Days (Mon - Fri): ${result.workingDays} days
Weekend Days: ${result.weekendDays} days

Want to calculate days between two dates?

Calculate your Date Difference:
[URL]

Calculate total elapsed days, calendar duration, and business working days between any two dates.`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 1. Left Card */}
      <Card className="border-border">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="text-lg">Date Range</CardTitle>
          <p className="text-xs text-text-secondary">Select start and end dates to calculate the span.</p>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Start Date */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Start Date
            </label>
            <Input
              type="date"
              value={startDateStr}
              onChange={(e) => setStartDateStr(e.target.value)}
            />
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              End Date
            </label>
            <Input
              type="date"
              value={endDateStr}
              onChange={(e) => setEndDateStr(e.target.value)}
            />
          </div>

          {/* Include End Date Checkbox */}
          <div className="pt-1">
            <label className="flex items-center gap-2.5 text-xs text-text cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inclusive}
                onChange={(e) => setInclusive(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-border cursor-pointer"
              />
              <span className="font-medium">Include end date in total count (+1 day)</span>
            </label>
          </div>

          {/* Presets */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
              Sample Intervals
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setStartDateStr("2026-01-01");
                  setEndDateStr("2026-01-31");
                  setInclusive(false);
                }}
                className="px-2.5 py-1 text-xs rounded-btn border border-border bg-surface hover:bg-surface-secondary text-text transition-colors"
              >
                Jan 2026 (30 days)
              </button>
              <button
                type="button"
                onClick={() => {
                  setStartDateStr("2026-01-01");
                  setEndDateStr("2026-12-31");
                  setInclusive(true);
                }}
                className="px-2.5 py-1 text-xs rounded-btn border border-border bg-surface hover:bg-surface-secondary text-text transition-colors"
              >
                Full Year 2026
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-border">
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Button>
            <div className="text-xs text-text-muted">Calculates automatically</div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Right Card: Results */}
      <Card className="border-border bg-surface/80 flex flex-col justify-between">
        <div>
          <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Duration Summary</CardTitle>
              <p className="text-xs text-text-secondary">Elapsed days, calendar duration & business days</p>
            </div>
            <div className="flex items-center gap-2">
              <ShareButton title="Date Difference Calculation" summaryText={copySummaryText} />
              {result.isValid && <CopyButton value={copySummaryText} label="Copy" />}
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {result.isValid ? (
              <>
                {/* Total Days Hero */}
                <div className="p-5 rounded-card bg-primary-light border border-primary/20 text-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Total Elapsed Days
                  </span>
                  <div className="mt-1 text-4xl font-extrabold text-primary">
                    {inclusive ? result.inclusiveDays : result.totalDays} Days
                  </div>
                  <span className="text-xs text-primary/80 mt-1 block">
                    {result.weeks} weeks and {result.remainingDays} days
                  </span>
                </div>

                {/* Duration Breakdown */}
                <div className="space-y-2.5 pt-2 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-border/60">
                    <span className="text-text-secondary flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-text-muted" />
                      Calendar Breakdown
                    </span>
                    <span className="font-semibold text-text">
                      {result.years > 0 && `${result.years}y `}
                      {result.months > 0 && `${result.months}m `}
                      {result.days}d
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-border/60">
                    <span className="text-text-secondary flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-emerald-500" />
                      Working Days (Mon - Fri)
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {result.workingDays} days
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-border/60">
                    <span className="text-text-secondary flex items-center gap-1.5">
                      <SunMedium className="w-4 h-4 text-amber-500" />
                      Weekend Days (Sat - Sun)
                    </span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      {result.weekendDays} days
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-rose-500 font-medium">
                {result.errorMessage}
              </div>
            )}
          </CardContent>
        </div>

        <div className="p-4 border-t border-border bg-surface-secondary/30 rounded-b-card text-xs text-text-secondary">
          <span>Automatically computes chronological difference regardless of which date is chosen first.</span>
        </div>
      </Card>
    </div>
  );
}
