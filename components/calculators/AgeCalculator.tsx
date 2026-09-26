"use client";

import React, { useState } from "react";
import { calculateAge } from "@/lib/calculations/date";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { CopyButton } from "@/components/shared/CommonStates";
import { RotateCcw, Calendar, Cake, Clock } from "lucide-react";

export function AgeCalculator() {
  const todayStr = new Date().toISOString().split("T")[0];
  const [dobStr, setDobStr] = useState<string>("1995-01-15");
  const [asOfStr, setAsOfStr] = useState<string>(todayStr);

  const result = calculateAge(dobStr, asOfStr);

  const handleReset = () => {
    setDobStr("1995-01-15");
    setAsOfStr(todayStr);
  };

  const copySummaryText = `Age Breakdown:
• Date of Birth: ${dobStr}
• Age as of ${asOfStr}: ${result.years} Years, ${result.months} Months, ${result.days} Days
• Total Days Lived: ${result.totalDays.toLocaleString()} days
• Days until Next Birthday: ${result.nextBirthdayDays} days`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 1. Left Card */}
      <Card className="border-border">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="text-lg">Date Information</CardTitle>
          <p className="text-xs text-text-secondary">Select birth date and optional target evaluation date.</p>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* DOB Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Date of Birth
            </label>
            <Input
              type="date"
              value={dobStr}
              max={todayStr}
              onChange={(e) => setDobStr(e.target.value)}
              error={!result.isValid ? result.errorMessage : undefined}
            />
          </div>

          {/* As-Of Date Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex justify-between">
              <span>Age As Of Date</span>
              <span className="text-text-muted">Defaults to Today</span>
            </label>
            <Input
              type="date"
              value={asOfStr}
              onChange={(e) => setAsOfStr(e.target.value)}
            />
          </div>

          {/* Quick Presets */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
              Sample Birth Years
            </span>
            <div className="flex flex-wrap gap-2">
              {[1990, 1995, 2000, 2005, 2010].map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setDobStr(`${year}-01-01`)}
                  className="px-2.5 py-1 text-xs rounded-btn border border-border bg-surface hover:bg-surface-secondary text-text transition-colors"
                >
                  Born {year}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-border">
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Today</span>
            </Button>
            <div className="text-xs text-text-muted">Instant calculation</div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Right Card: Results */}
      <Card className="border-border bg-surface/80 flex flex-col justify-between">
        <div>
          <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Calculated Age</CardTitle>
              <p className="text-xs text-text-secondary">Full calendar breakdown and milestones</p>
            </div>
            {result.isValid && <CopyButton value={copySummaryText} label="Copy" />}
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {result.isValid ? (
              <>
                {/* Age Hero Blocks */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-4 rounded-card bg-primary-light border border-primary/20">
                    <span className="text-2xl sm:text-3xl font-extrabold text-primary block">
                      {result.years}
                    </span>
                    <span className="text-xs font-semibold text-primary/80 uppercase tracking-wider">
                      Years
                    </span>
                  </div>

                  <div className="p-4 rounded-card bg-surface-secondary border border-border">
                    <span className="text-2xl sm:text-3xl font-extrabold text-text block">
                      {result.months}
                    </span>
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Months
                    </span>
                  </div>

                  <div className="p-4 rounded-card bg-surface-secondary border border-border">
                    <span className="text-2xl sm:text-3xl font-extrabold text-text block">
                      {result.days}
                    </span>
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Days
                    </span>
                  </div>
                </div>

                {/* Additional Stats */}
                <div className="space-y-2.5 pt-2 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-border/60">
                    <span className="text-text-secondary flex items-center gap-1.5">
                      <Cake className="w-4 h-4 text-primary" />
                      Next Birthday In
                    </span>
                    <span className="font-semibold text-primary">
                      {result.nextBirthdayDays} days
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-border/60">
                    <span className="text-text-secondary flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-text-muted" />
                      Total Days Lived
                    </span>
                    <span className="font-semibold text-text">
                      {result.totalDays.toLocaleString()} days
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-border/60">
                    <span className="text-text-secondary flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-text-muted" />
                      Total Hours
                    </span>
                    <span className="font-semibold text-text">
                      {result.totalHours.toLocaleString()} hours
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
          <span>Accurately accounts for leap years and individual month durations.</span>
        </div>
      </Card>
    </div>
  );
}
