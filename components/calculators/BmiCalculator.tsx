"use client";

import React, { useState } from "react";
import { calculateBmi, BmiUnitSystem } from "@/lib/calculations/bmi";
import { parseSafeNumber } from "@/lib/formatters";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge } from "@/components/ui";
import { CopyButton } from "@/components/shared/CommonStates";
import { RotateCcw, AlertTriangle, HeartPulse } from "lucide-react";

export function BmiCalculator() {
  const [system, setSystem] = useState<BmiUnitSystem>("metric");
  
  // Metric state
  const [weightKgStr, setWeightKgStr] = useState<string>("70");
  const [heightCmStr, setHeightCmStr] = useState<string>("175");

  // Imperial state
  const [weightLbStr, setWeightLbStr] = useState<string>("154");
  const [heightFeetStr, setHeightFeetStr] = useState<string>("5");
  const [heightInchesStr, setHeightInchesStr] = useState<string>("9");

  const result = calculateBmi({
    system,
    weightKg: parseSafeNumber(weightKgStr, 70),
    heightCm: parseSafeNumber(heightCmStr, 175),
    weightLb: parseSafeNumber(weightLbStr, 154),
    heightFeet: parseSafeNumber(heightFeetStr, 5),
    heightInches: parseSafeNumber(heightInchesStr, 9),
  });

  const handleReset = () => {
    if (system === "metric") {
      setWeightKgStr("70");
      setHeightCmStr("175");
    } else {
      setWeightLbStr("154");
      setHeightFeetStr("5");
      setHeightInchesStr("9");
    }
  };

  const copySummaryText = `BMI Calculation Result:
• Units: ${system === "metric" ? "Metric (kg/cm)" : "Imperial (lbs/ft-in)"}
• Calculated BMI Score: ${result ? result.bmi : "N/A"}
• WHO Category: ${result ? result.category : "N/A"}
• Healthy Weight Range: ${result ? result.healthyWeightRange : "N/A"}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 1. Left Card */}
      <Card className="border-border">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="text-lg">Body Measurements</CardTitle>
          <p className="text-xs text-text-secondary">Select measurement units and enter height and weight.</p>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Unit System Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Measurement System
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-surface-secondary rounded-btn">
              <button
                type="button"
                onClick={() => setSystem("metric")}
                className={`py-2 text-xs font-medium rounded-md transition-all ${
                  system === "metric"
                    ? "bg-surface text-primary shadow-sm font-semibold"
                    : "text-text-secondary hover:text-text"
                }`}
              >
                Metric (kg, cm)
              </button>
              <button
                type="button"
                onClick={() => setSystem("imperial")}
                className={`py-2 text-xs font-medium rounded-md transition-all ${
                  system === "imperial"
                    ? "bg-surface text-primary shadow-sm font-semibold"
                    : "text-text-secondary hover:text-text"
                }`}
              >
                Imperial (lbs, ft-in)
              </button>
            </div>
          </div>

          {/* Metric Inputs */}
          {system === "metric" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex justify-between">
                  <span>Height</span>
                  <span className="text-text-muted">Centimeters (cm)</span>
                </label>
                <Input
                  type="number"
                  min="50"
                  max="260"
                  suffixSymbol="cm"
                  value={heightCmStr}
                  onChange={(e) => setHeightCmStr(e.target.value)}
                  placeholder="e.g. 175"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex justify-between">
                  <span>Weight</span>
                  <span className="text-text-muted">Kilograms (kg)</span>
                </label>
                <Input
                  type="number"
                  min="10"
                  max="400"
                  step="0.5"
                  suffixSymbol="kg"
                  value={weightKgStr}
                  onChange={(e) => setWeightKgStr(e.target.value)}
                  placeholder="e.g. 70"
                />
              </div>
            </div>
          ) : (
            /* Imperial Inputs */
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Height
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number"
                    min="2"
                    max="8"
                    suffixSymbol="ft"
                    value={heightFeetStr}
                    onChange={(e) => setHeightFeetStr(e.target.value)}
                    placeholder="Feet"
                  />
                  <Input
                    type="number"
                    min="0"
                    max="11"
                    suffixSymbol="in"
                    value={heightInchesStr}
                    onChange={(e) => setHeightInchesStr(e.target.value)}
                    placeholder="Inches"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex justify-between">
                  <span>Weight</span>
                  <span className="text-text-muted">Pounds (lbs)</span>
                </label>
                <Input
                  type="number"
                  min="20"
                  max="800"
                  step="0.5"
                  suffixSymbol="lbs"
                  value={weightLbStr}
                  onChange={(e) => setWeightLbStr(e.target.value)}
                  placeholder="e.g. 154"
                />
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between border-t border-border">
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Button>
            <div className="text-xs text-text-muted">Instant assessment</div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Right Card: Results */}
      <Card className="border-border bg-surface/80 flex flex-col justify-between">
        <div>
          <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">BMI Assessment</CardTitle>
              <p className="text-xs text-text-secondary">Category and healthy weight range</p>
            </div>
            {result && <CopyButton value={copySummaryText} label="Copy" />}
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {result ? (
              <>
                {/* Score Hero */}
                <div className="p-5 rounded-card bg-primary-light border border-primary/20 text-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Your Body Mass Index (BMI)
                  </span>
                  <div className="mt-1 text-4xl font-extrabold text-primary">
                    {result.bmi}
                  </div>
                  <div className="mt-2 inline-block">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${result.categoryColor}`}
                    >
                      {result.category}
                    </span>
                  </div>
                </div>

                {/* Range Details */}
                <div className="space-y-2.5 pt-2 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-border/60">
                    <span className="text-text-secondary">Healthy Weight Target</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {result.healthyWeightRange}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-border/60">
                    <span className="text-text-secondary">BMI Prime Ratio</span>
                    <span className="font-semibold text-text">{result.prime}</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-border/60">
                    <span className="text-text-secondary">WHO Classification</span>
                    <span className="font-medium text-text">{result.category}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-text-secondary">
                Please enter valid height and weight values.
              </div>
            )}
          </CardContent>
        </div>

        {/* Medical Disclaimer */}
        <div className="p-4 border-t border-border bg-amber-500/5 rounded-b-card text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Non-Medical Advice Disclaimer:</strong> This BMI calculator is provided for general informational screening only. It does not replace clinical advice from a physician.
          </p>
        </div>
      </Card>
    </div>
  );
}
