"use client";

import React, { useState, useMemo } from "react";
import { calculatePercentage, PercentageMode } from "@/lib/calculations/percentage";
import { formatNumber, parseSafeNumber } from "@/lib/formatters";
import { useShareableUrl } from "@/hooks/useShareableUrl";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { CopyButton } from "@/components/shared/CommonStates";
import { ShareButton } from "@/components/shared/ShareModal";
import { RotateCcw, TrendingUp, TrendingDown } from "lucide-react";

export function PercentageCalculator() {
  const { getInitialParam } = useShareableUrl({});

  const [mode, setMode] = useState<PercentageMode>(() => {
    const m = getInitialParam("mode", "percent_of");
    return m === "what_percent" || m === "increase_decrease" ? m : "percent_of";
  });
  const [valueXStr, setValueXStr] = useState<string>(() =>
    getInitialParam("x", "20")
  );
  const [valueYStr, setValueYStr] = useState<string>(() =>
    getInitialParam("y", "500")
  );

  useShareableUrl(
    useMemo(
      () => ({
        mode,
        x: valueXStr,
        y: valueYStr,
      }),
      [mode, valueXStr, valueYStr]
    )
  );

  const x = parseSafeNumber(valueXStr, 0);
  const y = parseSafeNumber(valueYStr, 0);

  const result = calculatePercentage({
    mode,
    valueX: x,
    valueY: y,
  });

  const handleReset = () => {
    setValueXStr(mode === "percent_of" ? "20" : "50");
    setValueYStr(mode === "percent_of" ? "500" : "200");
  };

  const copySummaryText = `Your Percentage Calculation Result

Percentage Math Breakdown

Calculation: ${result.explanation}
Selected Mode: ${mode === "percent_of" ? "X% of Y" : mode === "what_percent" ? "X is what % of Y" : "Percentage Change"}
Input Values: X = ${valueXStr}, Y = ${valueYStr}

Calculated Answer: ${formatNumber(result.result, 4)}${mode !== "percent_of" ? "%" : ""}

Want to calculate percentages quickly?

Calculate your Percentage:
[URL]

Solve percentage of values, find percentage proportions, and calculate percent increase or decrease.`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 1. Left Card */}
      <Card className="border-border">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="text-lg">Percentage Mode & Values</CardTitle>
          <p className="text-xs text-text-secondary">Select calculation formula and enter values.</p>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Mode Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              What do you want to calculate?
            </label>
            <div className="flex flex-col space-y-1.5 p-1 bg-surface-secondary rounded-card">
              <button
                type="button"
                onClick={() => {
                  setMode("percent_of");
                  setValueXStr("20");
                  setValueYStr("500");
                }}
                className={`p-2.5 text-xs text-left rounded-btn font-medium transition-all ${
                  mode === "percent_of"
                    ? "bg-surface text-primary shadow-sm font-semibold"
                    : "text-text-secondary hover:text-text"
                }`}
              >
                1. What is <span className="text-primary font-bold">X%</span> of <span className="text-primary font-bold">Y</span>?
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("what_percent");
                  setValueXStr("50");
                  setValueYStr("200");
                }}
                className={`p-2.5 text-xs text-left rounded-btn font-medium transition-all ${
                  mode === "what_percent"
                    ? "bg-surface text-primary shadow-sm font-semibold"
                    : "text-text-secondary hover:text-text"
                }`}
              >
                2. <span className="text-primary font-bold">X</span> is what percentage of <span className="text-primary font-bold">Y</span>?
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("increase_decrease");
                  setValueXStr("100");
                  setValueYStr("150");
                }}
                className={`p-2.5 text-xs text-left rounded-btn font-medium transition-all ${
                  mode === "increase_decrease"
                    ? "bg-surface text-primary shadow-sm font-semibold"
                    : "text-text-secondary hover:text-text"
                }`}
              >
                3. Percentage increase / decrease from <span className="text-primary font-bold">X</span> to <span className="text-primary font-bold">Y</span>
              </button>
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                {mode === "percent_of" ? "Percentage (X %)" : "Initial Value (X)"}
              </label>
              <Input
                type="number"
                step="any"
                suffixSymbol={mode === "percent_of" ? "%" : undefined}
                value={valueXStr}
                onChange={(e) => setValueXStr(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                {mode === "increase_decrease" ? "New Value (Y)" : "Total Value (Y)"}
              </label>
              <Input
                type="number"
                step="any"
                value={valueYStr}
                onChange={(e) => setValueYStr(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-border">
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Button>
            <div className="text-xs text-text-muted">Dynamic calculation</div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Right Card */}
      <Card className="border-border bg-surface/80 flex flex-col justify-between">
        <div>
          <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Calculated Result</CardTitle>
              <p className="text-xs text-text-secondary">Computed output and interpretation</p>
            </div>
            <div className="flex items-center gap-2">
              <ShareButton title="Percentage Calculation" summaryText={copySummaryText} />
              <CopyButton value={copySummaryText} label="Copy" />
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            <div className="p-6 rounded-card bg-primary-light border border-primary/20 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Result Output
              </span>
              <div className="mt-2 text-4xl font-extrabold text-primary flex items-center justify-center gap-2">
                {mode === "increase_decrease" && (
                  result.isIncrease ? (
                    <TrendingUp className="w-8 h-8 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-8 h-8 text-rose-500" />
                  )
                )}
                <span>
                  {formatNumber(result.result, 4)}
                  {mode !== "percent_of" && "%"}
                </span>
              </div>
              <p className="mt-2 text-sm text-text-secondary font-medium">
                {result.explanation}
              </p>
            </div>

            <div className="space-y-3 pt-2 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-border/60">
                <span className="text-text-secondary">Selected Mode</span>
                <span className="font-semibold text-text">
                  {mode === "percent_of"
                    ? "X% of Y"
                    : mode === "what_percent"
                    ? "X is what % of Y"
                    : "Percentage change"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/60">
                <span className="text-text-secondary">Input X</span>
                <span className="font-semibold text-text">{valueXStr}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/60">
                <span className="text-text-secondary">Input Y</span>
                <span className="font-semibold text-text">{valueYStr}</span>
              </div>
            </div>
          </CardContent>
        </div>

        <div className="p-4 border-t border-border bg-surface-secondary/30 rounded-b-card text-xs text-text-secondary">
          <span>Formula: {mode === "percent_of" ? "(X / 100) × Y" : mode === "what_percent" ? "(X / Y) × 100" : "((Y - X) / |X|) × 100"}</span>
        </div>
      </Card>
    </div>
  );
}
