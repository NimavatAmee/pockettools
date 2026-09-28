"use client";

import React, { useState, useMemo } from "react";
import { calculateFd, calculateRd } from "@/lib/calculations/fd-rd";
import { useShareableUrl } from "@/hooks/useShareableUrl";
import { formatCurrency, parseSafeNumber } from "@/lib/formatters";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { CopyButton } from "@/components/shared/CommonStates";
import { ShareButton } from "@/components/shared/ShareModal";
import { RotateCcw, PiggyBank, AlertCircle, CheckCircle2 } from "lucide-react";

export function FdRdCalculator() {
  const { getInitialParam } = useShareableUrl({});

  const [mode, setMode] = useState<"fd" | "rd">(() =>
    getInitialParam("mode", "fd") === "rd" ? "rd" : "fd"
  );
  const [depositAmountStr, setDepositAmountStr] = useState<string>(() =>
    getInitialParam("amount", "100000")
  );
  const [rateStr, setRateStr] = useState<string>(() =>
    getInitialParam("rate", "7")
  );
  const [tenureYearsStr, setTenureYearsStr] = useState<string>(() =>
    getInitialParam("years", "1")
  );
  const [tenureMonthsStr, setTenureMonthsStr] = useState<string>(() =>
    getInitialParam("months", "0")
  );
  const [isSeniorCitizen, setIsSeniorCitizen] = useState<boolean>(() =>
    getInitialParam("senior", "0") === "1"
  );

  useShareableUrl(
    useMemo(
      () => ({
        mode,
        amount: depositAmountStr,
        rate: rateStr,
        years: tenureYearsStr,
        months: tenureMonthsStr,
        senior: isSeniorCitizen ? "1" : "0",
      }),
      [mode, depositAmountStr, rateStr, tenureYearsStr, tenureMonthsStr, isSeniorCitizen]
    )
  );

  const amount = parseSafeNumber(depositAmountStr, 100000);
  const baseRate = parseSafeNumber(rateStr, 7);
  const years = parseSafeNumber(tenureYearsStr, 1);
  const months = parseSafeNumber(tenureMonthsStr, 0);

  const fdResult = calculateFd({
    depositAmount: amount,
    annualInterestRate: baseRate,
    tenureYears: years,
    tenureMonths: months,
    tenureDays: 0,
    isSeniorCitizen,
    compoundingFrequency: "quarterly",
  });

  const rdResult = calculateRd({
    monthlyDeposit: amount,
    annualInterestRate: baseRate,
    tenureMonths: years * 12 + months || 12,
    isSeniorCitizen,
  });

  const handleReset = () => {
    setDepositAmountStr(mode === "fd" ? "100000" : "5000");
    setRateStr("7");
    setTenureYearsStr("1");
    setTenureMonthsStr("0");
    setIsSeniorCitizen(false);
  };

  const copySummaryText = `Your Bank ${mode === "fd" ? "Fixed Deposit (FD)" : "Recurring Deposit (RD)"} Result

Bank Term Deposit Maturity Assessment

Deposit Mode: ${mode === "fd" ? "Fixed Deposit (FD)" : "Recurring Deposit (RD)"}
${mode === "fd" ? `Principal Deposit: ${formatCurrency(amount)}` : `Monthly Installment: ${formatCurrency(amount)}`}
Interest Rate Applied: ${baseRate + (isSeniorCitizen ? 0.5 : 0)}% p.a. (Quarterly Compounding)
${isSeniorCitizen ? "Senior Citizen Benefit: +0.50% Applied\n" : ""}Tenure: ${years > 0 ? `${years} Year(s) ` : ""}${months > 0 ? `${months} Month(s)` : ""}

Total Invested: ${formatCurrency(mode === "fd" ? fdResult.principalAmount : rdResult.totalInvested)}
Total Interest Gained: ${formatCurrency(mode === "fd" ? fdResult.totalInterestEarned : rdResult.totalInterestEarned)}
Total Maturity Value: ${formatCurrency(mode === "fd" ? fdResult.maturityAmount : rdResult.maturityAmount)}

Want to calculate FD or RD returns for your bank deposits?

Calculate your FD / RD:
[URL]

Calculate bank fixed deposits and recurring deposits with quarterly compounding and Senior Citizen rates.`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 1. Left Card: Inputs */}
      <Card className="border-border">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="text-lg">Deposit Parameters</CardTitle>
          <p className="text-xs text-text-secondary">
            Select deposit type (FD / RD), duration, and senior citizen rate benefit.
          </p>
        </CardHeader>
        <CardContent className="pt-6 space-y-5">
          {/* Mode Switcher */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Deposit Type
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-surface-secondary rounded-btn">
              <button
                type="button"
                onClick={() => {
                  setMode("fd");
                  if (amount === 5000) setDepositAmountStr("100000");
                }}
                className={`py-2 text-xs font-medium rounded-md transition-all ${
                  mode === "fd"
                    ? "bg-surface text-primary shadow-sm font-semibold"
                    : "text-text-secondary hover:text-text"
                }`}
              >
                Fixed Deposit (FD)
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("rd");
                  if (amount === 100000) setDepositAmountStr("5000");
                }}
                className={`py-2 text-xs font-medium rounded-md transition-all ${
                  mode === "rd"
                    ? "bg-surface text-primary shadow-sm font-semibold"
                    : "text-text-secondary hover:text-text"
                }`}
              >
                Recurring Deposit (RD)
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex justify-between">
              <span>{mode === "fd" ? "Lumpsum Deposit Amount" : "Monthly Installment"}</span>
              <span className="text-text-muted">₹ INR</span>
            </label>
            <Input
              type="number"
              min="500"
              step={mode === "fd" ? "5000" : "500"}
              prefixSymbol="₹"
              value={depositAmountStr}
              onChange={(e) => setDepositAmountStr(e.target.value)}
              placeholder={mode === "fd" ? "e.g. 100000" : "e.g. 5000"}
            />
          </div>

          {/* Rate & Senior Citizen Check */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex justify-between">
              <span>Annual Bank Interest Rate</span>
              <span className="text-text-muted">% p.a.</span>
            </label>
            <Input
              type="number"
              min="1"
              max="20"
              step="0.1"
              suffixSymbol="%"
              value={rateStr}
              onChange={(e) => setRateStr(e.target.value)}
              placeholder="e.g. 7.0"
            />
          </div>

          {/* Senior Citizen Checkbox */}
          <label className="flex items-center gap-3 p-3 rounded-btn border border-border bg-surface hover:bg-surface-secondary cursor-pointer select-none transition-colors">
            <input
              type="checkbox"
              checked={isSeniorCitizen}
              onChange={(e) => setIsSeniorCitizen(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary border-border cursor-pointer"
            />
            <div className="text-xs">
              <span className="font-semibold text-text block">Senior Citizen (+0.50% Extra Rate)</span>
              <span className="text-text-muted text-[11px]">Age 60 years or above</span>
            </div>
          </label>

          {/* Tenure */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Years
              </label>
              <Input
                type="number"
                min="0"
                max="10"
                suffixSymbol="Yrs"
                value={tenureYearsStr}
                onChange={(e) => setTenureYearsStr(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Months
              </label>
              <Input
                type="number"
                min="0"
                max="11"
                suffixSymbol="Mos"
                value={tenureMonthsStr}
                onChange={(e) => setTenureMonthsStr(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-border">
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Button>
            <div className="text-xs text-text-muted">Standard quarterly compounding</div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Right Card: Results */}
      <Card className="border-border bg-surface/80 flex flex-col justify-between">
        <div>
          <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Deposit Maturity Breakdown</CardTitle>
              <p className="text-xs text-text-secondary">Interest earnings and maturity corpus</p>
            </div>
            <div className="flex items-center gap-2">
              <ShareButton title={`${mode.toUpperCase()} Deposit Calculation`} summaryText={copySummaryText} />
              <CopyButton value={copySummaryText} label="Copy" />
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Hero Maturity Amount */}
            <div className="p-5 rounded-card bg-primary-light border border-primary/20 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Total Maturity Amount
              </span>
              <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-primary">
                {formatCurrency(mode === "fd" ? fdResult.maturityAmount : rdResult.maturityAmount)}
              </div>
              <span className="text-xs text-primary/80 mt-1 block">
                @ {baseRate + (isSeniorCitizen ? 0.5 : 0)}% p.a. (Quarterly Compounded)
              </span>
            </div>

            {/* Figures */}
            <div className="space-y-2.5 pt-2 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-border/60">
                <span className="text-text-secondary">Total Amount Invested</span>
                <span className="font-semibold text-text">
                  {formatCurrency(mode === "fd" ? fdResult.principalAmount : rdResult.totalInvested)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border/60">
                <span className="text-text-secondary">Total Interest Earned</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  +{formatCurrency(mode === "fd" ? fdResult.totalInterestEarned : rdResult.totalInterestEarned)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2.5 bg-surface-secondary/50 px-3 rounded-btn">
                <span className="font-semibold text-text">Final Net Maturity Value</span>
                <span className="font-bold text-primary text-base">
                  {formatCurrency(mode === "fd" ? fdResult.maturityAmount : rdResult.maturityAmount)}
                </span>
              </div>
            </div>

            {/* TDS Alert */}
            {(mode === "fd" ? fdResult.isTdsApplicable : rdResult.isTdsApplicable) ? (
              <div className="p-3.5 rounded-btn bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p>
                  <strong>TDS Alert:</strong> Estimated annual interest exceeds the Section 194A threshold (₹
                  {isSeniorCitizen ? "50,000" : "40,000"}). Bank may deduct 10% TDS unless Form 15G/15H is submitted.
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-btn bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Annual interest is within TDS exemption limit (No TDS deducted).</span>
              </div>
            )}
          </CardContent>
        </div>

        <div className="p-4 border-t border-border bg-surface-secondary/30 rounded-b-card text-xs text-text-secondary">
          <span>Formula accounts for Indian banking quarterly compounding standards.</span>
        </div>
      </Card>
    </div>
  );
}
