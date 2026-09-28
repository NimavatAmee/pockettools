"use client";

import React, { useState, useMemo } from "react";
import { calculateTip } from "@/lib/calculations/tip";
import { formatCurrency, parseSafeNumber } from "@/lib/formatters";
import { useShareableUrl } from "@/hooks/useShareableUrl";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { CopyButton } from "@/components/shared/CommonStates";
import { ShareButton } from "@/components/shared/ShareModal";
import { RotateCcw, Users, Utensils } from "lucide-react";

const TIP_PRESETS = [5, 10, 15, 20, 25];

export function TipCalculator() {
  const { getInitialParam } = useShareableUrl({});

  const [billStr, setBillStr] = useState<string>(() =>
    getInitialParam("bill", "1000")
  );
  const [tipPctStr, setTipPctStr] = useState<string>(() =>
    getInitialParam("tip", "10")
  );
  const [peopleStr, setPeopleStr] = useState<string>(() =>
    getInitialParam("people", "2")
  );

  useShareableUrl(
    useMemo(
      () => ({
        bill: billStr,
        tip: tipPctStr,
        people: peopleStr,
      }),
      [billStr, tipPctStr, peopleStr]
    )
  );

  const billAmount = parseSafeNumber(billStr, 1000);
  const tipPercentage = parseSafeNumber(tipPctStr, 10);
  const numberOfPeople = Math.max(1, parseSafeNumber(peopleStr, 2));

  const result = calculateTip({
    billAmount,
    tipPercentage,
    numberOfPeople,
  });

  const handleReset = () => {
    setBillStr("1000");
    setTipPctStr("10");
    setPeopleStr("2");
  };

  const copySummaryText = `Your Tip & Bill Split Result

Restaurant Tip & Split Bill Breakdown

Bill Subtotal: ${formatCurrency(result.billAmount)}
Tip Percentage: ${result.tipPercentage}%
Party Size: ${result.numberOfPeople} person(s)

Tip Amount: ${formatCurrency(result.tipAmount)}
Total Bill with Tip: ${formatCurrency(result.totalAmount)}
Total Per Person: ${formatCurrency(result.totalPerPerson)} (Includes ${formatCurrency(result.tipPerPerson)} tip share)

Want to calculate tips and split bills with friends?

Calculate your Tip:
[URL]

Easily split dining checks, calculate tips per person, and avoid math at the table.`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 1. Left Card */}
      <Card className="border-border">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="text-lg">Bill & Gratuity</CardTitle>
          <p className="text-xs text-text-secondary">Enter bill subtotal, tip percentage, and group size.</p>
        </CardHeader>
        <CardContent className="pt-6 space-y-5">
          {/* Bill Amount */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex justify-between">
              <span>Bill Subtotal</span>
              <span className="text-text-muted">₹ INR</span>
            </label>
            <Input
              type="number"
              min="0"
              step="any"
              prefixSymbol="₹"
              value={billStr}
              onChange={(e) => setBillStr(e.target.value)}
              placeholder="e.g. 1000"
            />
          </div>

          {/* Tip Percentage Presets */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Tip Percentage
            </label>
            <div className="flex flex-wrap gap-2">
              {TIP_PRESETS.map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setTipPctStr(String(pct))}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-btn border transition-all ${
                    Number(tipPctStr) === pct
                      ? "border-primary bg-primary text-white shadow-sm"
                      : "border-border bg-surface hover:bg-surface-secondary text-text"
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
            <div className="pt-1">
              <Input
                type="number"
                min="0"
                max="100"
                step="any"
                suffixSymbol="% Tip"
                placeholder="Custom tip percentage"
                value={tipPctStr}
                onChange={(e) => setTipPctStr(e.target.value)}
              />
            </div>
          </div>

          {/* Number of People */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex justify-between">
              <span>Split Between</span>
              <span className="text-text-muted">Diners</span>
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                step="1"
                prefixSymbol="👤"
                value={peopleStr}
                onChange={(e) => setPeopleStr(e.target.value)}
                placeholder="Number of people"
              />
              <div className="flex gap-1 shrink-0">
                {[1, 2, 4, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPeopleStr(String(num))}
                    className="w-9 h-11 rounded-btn border border-border bg-surface hover:bg-surface-secondary text-xs font-medium text-text transition-colors"
                  >
                    {num}
                  </button>
                ))}
              </div>
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
              <CardTitle className="text-lg">Split Breakdown</CardTitle>
              <p className="text-xs text-text-secondary">Per-person share & total billing</p>
            </div>
            <div className="flex items-center gap-2">
              <ShareButton title="Tip & Bill Split Calculation" summaryText={copySummaryText} />
              <CopyButton value={copySummaryText} label="Copy" />
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Per Person Hero */}
            <div className="p-5 rounded-card bg-primary-light border border-primary/20 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center justify-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Total Per Person</span>
              </span>
              <div className="mt-1 text-3xl font-extrabold text-primary">
                {formatCurrency(result.totalPerPerson)}
              </div>
              <span className="text-xs text-primary/80 mt-1 block">
                Includes {formatCurrency(result.tipPerPerson)} tip per person
              </span>
            </div>

            {/* Total Summary */}
            <div className="space-y-2.5 pt-2 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-border/60">
                <span className="text-text-secondary">Bill Subtotal</span>
                <span className="font-semibold text-text">{formatCurrency(result.billAmount)}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border/60">
                <span className="text-text-secondary">Tip Amount ({result.tipPercentage}%)</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  +{formatCurrency(result.tipAmount)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border/60">
                <span className="text-text-secondary">Party Size</span>
                <span className="font-semibold text-text">{result.numberOfPeople} person(s)</span>
              </div>

              <div className="flex justify-between items-center py-2.5 bg-surface-secondary/50 px-3 rounded-btn">
                <span className="font-semibold text-text">Total Bill (with Tip)</span>
                <span className="font-bold text-primary text-base">
                  {formatCurrency(result.totalAmount)}
                </span>
              </div>
            </div>
          </CardContent>
        </div>

        <div className="p-4 border-t border-border bg-surface-secondary/30 rounded-b-card text-xs text-text-secondary flex items-center gap-2">
          <Utensils className="w-4 h-4 text-primary shrink-0" />
          <span>Fair bill splitting made easy for dining and group events.</span>
        </div>
      </Card>
    </div>
  );
}
