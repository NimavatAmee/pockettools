"use client";

import React, { useState } from "react";
import { calculateDiscount } from "@/lib/calculations/discount";
import { formatCurrency, parseSafeNumber } from "@/lib/formatters";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { CopyButton } from "@/components/shared/CommonStates";
import { RotateCcw, Tag } from "lucide-react";

const DISCOUNT_PRESETS = [5, 10, 15, 20, 25, 30, 40, 50, 70];

export function DiscountCalculator() {
  const [priceStr, setPriceStr] = useState<string>("1000");
  const [discountStr, setDiscountStr] = useState<string>("20");

  const originalPrice = parseSafeNumber(priceStr, 1000);
  const discountPercentage = parseSafeNumber(discountStr, 20);

  const result = calculateDiscount({
    originalPrice,
    discountPercentage,
  });

  const handleReset = () => {
    setPriceStr("1000");
    setDiscountStr("20");
  };

  const copySummaryText = `Discount Summary:
• Original Price: ${formatCurrency(result.originalPrice)}
• Discount: ${result.discountPercentage}%
• You Save: ${formatCurrency(result.savingsAmount)}
• Final Checkout Price: ${formatCurrency(result.finalPrice)}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 1. Left Card */}
      <Card className="border-border">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="text-lg">Price & Discount</CardTitle>
          <p className="text-xs text-text-secondary">Enter original tag price and discount percentage.</p>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Original Price */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex justify-between">
              <span>Original Price</span>
              <span className="text-text-muted">₹ INR</span>
            </label>
            <Input
              type="number"
              min="0"
              step="any"
              prefixSymbol="₹"
              value={priceStr}
              onChange={(e) => setPriceStr(e.target.value)}
              placeholder="e.g. 1000"
            />
          </div>

          {/* Discount Percentage */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex justify-between">
              <span>Discount Percentage</span>
              <span className="text-text-muted">% Off</span>
            </label>
            <Input
              type="number"
              min="0"
              max="100"
              step="any"
              suffixSymbol="%"
              value={discountStr}
              onChange={(e) => setDiscountStr(e.target.value)}
              placeholder="e.g. 20"
            />
          </div>

          {/* Preset Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Quick Discount Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {DISCOUNT_PRESETS.map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setDiscountStr(String(pct))}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-btn border transition-all ${
                    Number(discountStr) === pct
                      ? "border-primary bg-primary text-white shadow-sm"
                      : "border-border bg-surface hover:bg-surface-secondary text-text"
                  }`}
                >
                  {pct}% OFF
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-border">
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Button>
            <div className="text-xs text-text-muted">Calculates instantly</div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Right Card: Results */}
      <Card className="border-border bg-surface/80 flex flex-col justify-between">
        <div>
          <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Sale Price Breakdown</CardTitle>
              <p className="text-xs text-text-secondary">Your total savings and net payable</p>
            </div>
            <CopyButton value={copySummaryText} label="Copy" />
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Final Price Hero */}
            <div className="p-5 rounded-card bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Final Discounted Price
              </span>
              <div className="mt-1 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(result.finalPrice)}
              </div>
              <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-text-secondary">
                <Tag className="w-3.5 h-3.5 text-emerald-500" />
                <span>You save {formatCurrency(result.savingsAmount)} ({result.discountPercentage}%)</span>
              </div>
            </div>

            {/* Figures */}
            <div className="space-y-2.5 pt-2 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-border/60">
                <span className="text-text-secondary">Original List Price</span>
                <span className="font-semibold text-text line-through opacity-70">
                  {formatCurrency(result.originalPrice)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border/60">
                <span className="text-text-secondary">Discount Percentage</span>
                <span className="font-semibold text-text">{result.discountPercentage}%</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border/60">
                <span className="text-text-secondary font-medium">Total Money Saved</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  - {formatCurrency(result.savingsAmount)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2.5 bg-surface-secondary/50 px-3 rounded-btn">
                <span className="font-semibold text-text">You Pay</span>
                <span className="font-bold text-primary text-base">
                  {formatCurrency(result.finalPrice)}
                </span>
              </div>
            </div>
          </CardContent>
        </div>

        <div className="p-4 border-t border-border bg-surface-secondary/30 rounded-b-card text-xs text-text-secondary">
          <span>
            {result.discountPercentage >= 50 ? "🎉 Huge deal! You are saving half or more of the original price." : "Every saving counts!"}
          </span>
        </div>
      </Card>
    </div>
  );
}
