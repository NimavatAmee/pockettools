"use client";

import React, { useState, useMemo } from "react";
import { calculateGst } from "@/lib/calculations/gst";
import { exportGstReceiptToPdf } from "@/lib/export/pdfExporter";
import { exportGstSummaryToCsv } from "@/lib/export/csvExporter";
import { useShareableUrl } from "@/hooks/useShareableUrl";
import { formatCurrency, parseSafeNumber } from "@/lib/formatters";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { CopyButton } from "@/components/shared/CommonStates";
import { ShareButton } from "@/components/shared/ShareModal";
import { RotateCcw, ArrowRight, FileText, Download } from "lucide-react";

const GST_RATES = [0, 5, 12, 18, 28];

export function GstCalculator() {
  const { getInitialParam } = useShareableUrl({});

  const [amountStr, setAmountStr] = useState<string>(() =>
    getInitialParam("amount", "10000")
  );
  const [selectedRate, setSelectedRate] = useState<number>(() =>
    parseSafeNumber(getInitialParam("rate", "18"), 18)
  );
  const [customRate, setCustomRate] = useState<string>("");
  const [isCustomRate, setIsCustomRate] = useState<boolean>(false);
  const [isInclusive, setIsInclusive] = useState<boolean>(() =>
    getInitialParam("mode", "exclusive") === "inclusive"
  );

  const amount = parseSafeNumber(amountStr, 0);
  const activeRate = isCustomRate ? parseSafeNumber(customRate, 0) : selectedRate;

  // Sync state to URL params live
  useShareableUrl(
    useMemo(
      () => ({
        amount: amountStr,
        rate: activeRate,
        mode: isInclusive ? "inclusive" : "exclusive",
      }),
      [amountStr, activeRate, isInclusive]
    )
  );

  const result = calculateGst({
    amount,
    rate: activeRate,
    isInclusive,
  });

  const handleReset = () => {
    setAmountStr("10000");
    setSelectedRate(18);
    setCustomRate("");
    setIsCustomRate(false);
    setIsInclusive(false);
  };

  const copySummaryText = `Your GST Calculation Result

Goods and Services Tax (GST) Breakdown

Calculation Type: ${isInclusive ? "GST Inclusive (Extract Tax)" : "GST Exclusive (Add Tax)"}
Initial Amount: ₹${amountStr}
GST Rate: ${activeRate}%

Net Base Price: ${formatCurrency(result.baseAmount)}
GST Tax Amount: ${formatCurrency(result.gstAmount)}
Total Payable Amount: ${formatCurrency(result.totalAmount)}
(CGST: ${formatCurrency(result.cgst)} | SGST: ${formatCurrency(result.sgst)})

Want to calculate GST for your products or invoices?

Calculate your GST:
[URL]

Quickly calculate inclusive and exclusive GST rates with CGST, SGST & IGST tax breakdowns.`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 1. Left Card: Calculator Inputs */}
      <Card className="border-border">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="text-lg">Calculator Inputs</CardTitle>
          <p className="text-xs text-text-secondary">
            Select tax inclusion mode, enter amount, and choose GST slab.
          </p>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Inclusive vs Exclusive Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Calculation Mode
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-surface-secondary rounded-btn">
              <button
                type="button"
                onClick={() => setIsInclusive(false)}
                className={`py-2 text-xs font-medium rounded-md transition-all ${
                  !isInclusive
                    ? "bg-surface text-primary shadow-sm font-semibold"
                    : "text-text-secondary hover:text-text"
                }`}
              >
                GST Exclusive (Add GST)
              </button>
              <button
                type="button"
                onClick={() => setIsInclusive(true)}
                className={`py-2 text-xs font-medium rounded-md transition-all ${
                  isInclusive
                    ? "bg-surface text-primary shadow-sm font-semibold"
                    : "text-text-secondary hover:text-text"
                }`}
              >
                GST Inclusive (Extract GST)
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex justify-between">
              <span>{isInclusive ? "Total Amount (with GST)" : "Base Amount"}</span>
              <span className="text-text-muted">₹ INR</span>
            </label>
            <Input
              type="number"
              min="0"
              step="any"
              prefixSymbol="₹"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              placeholder="e.g. 10000"
            />
          </div>

          {/* GST Slabs */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              GST Tax Rate (%)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {GST_RATES.map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => {
                    setSelectedRate(rate);
                    setIsCustomRate(false);
                  }}
                  className={`py-2 text-xs font-semibold rounded-btn border transition-all ${
                    !isCustomRate && selectedRate === rate
                      ? "border-primary bg-primary text-white shadow-sm"
                      : "border-border bg-surface hover:bg-surface-secondary text-text"
                  }`}
                >
                  {rate}%
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsCustomRate(true)}
                className={`py-2 text-xs font-semibold rounded-btn border transition-all ${
                  isCustomRate
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-border bg-surface hover:bg-surface-secondary text-text"
                }`}
              >
                Custom
              </button>
            </div>

            {isCustomRate && (
              <div className="pt-2 animate-in fade-in-50">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  suffixSymbol="%"
                  placeholder="Enter custom rate % (e.g. 7.5)"
                  value={customRate}
                  onChange={(e) => setCustomRate(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-border">
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Button>
            <div className="text-xs text-text-muted">Calculates automatically</div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Right Card: Calculation Results */}
      <Card className="border-border bg-surface/80 flex flex-col justify-between">
        <div>
          <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Calculation Breakdown</CardTitle>
              <p className="text-xs text-text-secondary">Summary of tax and totals</p>
            </div>
            <div className="flex items-center gap-2">
              <ShareButton title="GST Tax Calculation" summaryText={copySummaryText} />
              <CopyButton value={copySummaryText} label="Copy" />
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-4">
            {/* Total Result Hero */}
            <div className="p-5 rounded-card bg-primary-light border border-primary/20 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {isInclusive ? "Gross Payable (Inclusive)" : "Total Amount Payable"}
              </span>
              <div className="mt-1 text-3xl font-extrabold text-primary">
                {formatCurrency(result.totalAmount)}
              </div>
            </div>

            {/* Detailed Rows */}
            <div className="space-y-2.5 pt-2 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-border/60">
                <span className="text-text-secondary">Base Net Amount</span>
                <span className="font-semibold text-text">{formatCurrency(result.baseAmount)}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border/60">
                <span className="text-text-secondary">Applied GST Rate</span>
                <span className="font-semibold text-text">{activeRate}%</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border/60">
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <span>CGST (Central Tax 50%)</span>
                </div>
                <span className="font-semibold text-text">{formatCurrency(result.cgst)}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border/60">
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <span>SGST / UTGST (State Tax 50%)</span>
                </div>
                <span className="font-semibold text-text">{formatCurrency(result.sgst)}</span>
              </div>

              <div className="flex justify-between items-center py-2.5 bg-surface-secondary/50 px-3 rounded-btn">
                <span className="font-medium text-text">Total GST Tax Amount</span>
                <span className="font-bold text-primary">{formatCurrency(result.gstAmount)}</span>
              </div>
            </div>

            {/* PDF & CSV Download Buttons */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => exportGstReceiptToPdf(amount, activeRate, isInclusive, result)}
                className="gap-2 text-xs flex-1"
              >
                <FileText className="w-4 h-4" />
                <span>Download PDF Receipt</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => exportGstSummaryToCsv(amount, activeRate, isInclusive, result)}
                className="gap-2 text-xs flex-1"
              >
                <Download className="w-4 h-4 text-primary" />
                <span>Export CSV</span>
              </Button>
            </div>
          </CardContent>
        </div>

        <div className="p-4 border-t border-border bg-surface-secondary/30 rounded-b-card text-xs text-text-secondary flex items-center gap-2">
          <ArrowRight className="w-4 h-4 text-primary shrink-0" />
          <span>For inter-state supply, IGST equals {formatCurrency(result.gstAmount)} (100%).</span>
        </div>
      </Card>
    </div>
  );
}
