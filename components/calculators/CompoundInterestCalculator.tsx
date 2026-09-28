"use client";

import React, { useState, useMemo } from "react";
import {
  calculateCompoundInterest,
  CompoundingFrequency,
} from "@/lib/calculations/compound-interest";
import { exportCompoundInterestSummaryToCsv } from "@/lib/export/csvExporter";
import { useShareableUrl } from "@/hooks/useShareableUrl";
import { formatCurrency, parseSafeNumber } from "@/lib/formatters";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { CopyButton } from "@/components/shared/CommonStates";
import { ShareButton } from "@/components/shared/ShareModal";
import { RotateCcw, Download, Sparkles, Table, ChevronDown, ChevronUp, Zap } from "lucide-react";

const FREQUENCIES: { id: CompoundingFrequency; label: string }[] = [
  { id: "daily", label: "Daily (365x)" },
  { id: "monthly", label: "Monthly (12x)" },
  { id: "quarterly", label: "Quarterly (4x)" },
  { id: "semi_annually", label: "Semi-Annual (2x)" },
  { id: "annually", label: "Annually (1x)" },
];

export function CompoundInterestCalculator() {
  const { getInitialParam } = useShareableUrl({});

  const [principalStr, setPrincipalStr] = useState<string>(() =>
    getInitialParam("p", "100000")
  );
  const [rateStr, setRateStr] = useState<string>(() =>
    getInitialParam("r", "8")
  );
  const [yearsStr, setYearsStr] = useState<string>(() =>
    getInitialParam("t", "5")
  );
  const [frequency, setFrequency] = useState<CompoundingFrequency>(() => {
    const f = getInitialParam("f", "quarterly") as CompoundingFrequency;
    return ["daily", "monthly", "quarterly", "semi_annually", "annually"].includes(f)
      ? f
      : "quarterly";
  });
  const [additionStr, setAdditionStr] = useState<string>(() =>
    getInitialParam("add", "0")
  );

  const [showTable, setShowTable] = useState<boolean>(true);

  useShareableUrl(
    useMemo(
      () => ({
        p: principalStr,
        r: rateStr,
        t: yearsStr,
        f: frequency,
        add: additionStr,
      }),
      [principalStr, rateStr, yearsStr, frequency, additionStr]
    )
  );

  const principal = parseSafeNumber(principalStr, 100000);
  const annualRate = parseSafeNumber(rateStr, 8);
  const timeYears = parseSafeNumber(yearsStr, 5);
  const periodicAddition = parseSafeNumber(additionStr, 0);

  const compoundParams = {
    principal,
    annualRate,
    timeYears,
    frequency,
    periodicAddition,
    additionFrequency: "monthly" as const,
  };

  const result = calculateCompoundInterest(compoundParams);

  const handleReset = () => {
    setPrincipalStr("100000");
    setRateStr("8");
    setYearsStr("5");
    setFrequency("quarterly");
    setAdditionStr("0");
  };

  const copySummaryText = `Your Compound Interest Result

Compound Interest & Wealth Growth

Initial Principal: ${formatCurrency(result.initialPrincipal)}
Annual Interest Rate: ${annualRate}%
Investment Duration: ${timeYears} Years
Compounding Frequency: ${FREQUENCIES.find((f) => f.id === frequency)?.label}
${periodicAddition > 0 ? `Monthly Contribution: ${formatCurrency(periodicAddition)}\n` : ""}
Total Deposits: ${formatCurrency(result.totalDeposits)}
Total Interest Earned: ${formatCurrency(result.totalInterest)}
Final Maturity Balance: ${formatCurrency(result.finalBalance)}
Gain from Compounding (vs Simple Interest): +${formatCurrency(result.compoundDifference)}

Want to calculate compound interest for your investments?

Calculate Compound Interest:
[URL]

Calculate daily, monthly, quarterly, and yearly compound interest with periodic contributions and full amortization schedules.`;

  return (
    <div className="space-y-8">
      {/* 1. Calculator & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Card */}
        <Card className="border-border">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-lg">Compounding Parameters</CardTitle>
            <p className="text-xs text-text-secondary">
              Enter deposit amount, interest rate, duration, and compounding interval.
            </p>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            {/* Principal */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex justify-between">
                <span>Initial Principal</span>
                <span className="text-text-muted">₹ INR</span>
              </label>
              <Input
                type="number"
                min="0"
                step="5000"
                prefixSymbol="₹"
                value={principalStr}
                onChange={(e) => setPrincipalStr(e.target.value)}
                placeholder="e.g. 100000"
              />
            </div>

            {/* Rate & Tenure */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex justify-between">
                  <span>Interest Rate</span>
                  <span className="text-text-muted">% p.a.</span>
                </label>
                <Input
                  type="number"
                  min="0.1"
                  max="50"
                  step="0.1"
                  suffixSymbol="%"
                  value={rateStr}
                  onChange={(e) => setRateStr(e.target.value)}
                  placeholder="e.g. 8"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex justify-between">
                  <span>Duration</span>
                  <span className="text-text-muted">Years</span>
                </label>
                <Input
                  type="number"
                  min="1"
                  max="50"
                  suffixSymbol="Yrs"
                  value={yearsStr}
                  onChange={(e) => setYearsStr(e.target.value)}
                  placeholder="e.g. 5"
                />
              </div>
            </div>

            {/* Compounding Frequency */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Compounding Frequency
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FREQUENCIES.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFrequency(f.id)}
                    className={`py-2 px-2 text-xs font-medium rounded-btn border transition-all ${
                      frequency === f.id
                        ? "border-primary bg-primary text-white shadow-sm font-semibold"
                        : "border-border bg-surface text-text hover:bg-surface-secondary"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Regular Addition */}
            <div className="space-y-2 pt-2 border-t border-border">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex justify-between">
                <span>Optional Monthly Contribution</span>
                <span className="text-text-muted">₹ Added each month</span>
              </label>
              <Input
                type="number"
                min="0"
                step="500"
                prefixSymbol="₹"
                value={additionStr}
                onChange={(e) => setAdditionStr(e.target.value)}
                placeholder="e.g. 2000 (0 for none)"
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-border">
              <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </Button>
              <div className="text-xs text-text-muted">Instant calculation</div>
            </div>
          </CardContent>
        </Card>

        {/* Right Card: Results */}
        <Card className="border-border bg-surface/80 flex flex-col justify-between">
          <div>
            <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Compounded Returns</CardTitle>
                <p className="text-xs text-text-secondary">Maturity value and interest breakdown</p>
              </div>
              <div className="flex items-center gap-2">
                <ShareButton title="Compound Interest Calculation" summaryText={copySummaryText} />
                <CopyButton value={copySummaryText} label="Copy" />
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {/* Final Balance Hero */}
              <div className="p-5 rounded-card bg-primary-light border border-primary/20 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Final Maturity Balance
                </span>
                <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-primary">
                  {formatCurrency(result.finalBalance)}
                </div>
                <span className="text-xs text-primary/80 mt-1 block">
                  after {timeYears} years of {frequency} compounding
                </span>
              </div>

              {/* Power of Compounding Highlight Badge */}
              {result.compoundDifference > 0 && (
                <div className="p-3.5 rounded-btn bg-amber-500/10 border border-amber-500/20 flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <span className="font-bold">The Power of Compounding: </span>
                    <span>You earn <strong>+{formatCurrency(result.compoundDifference)} extra</strong> compared to simple interest!</span>
                  </div>
                </div>
              )}

              {/* Breakdown Rows */}
              <div className="space-y-2.5 pt-2 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-border/60">
                  <span className="text-text-secondary">Initial Principal</span>
                  <span className="font-semibold text-text">{formatCurrency(result.initialPrincipal)}</span>
                </div>

                {periodicAddition > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-border/60">
                    <span className="text-text-secondary">Total Regular Additions</span>
                    <span className="font-semibold text-text">
                      {formatCurrency(result.totalDeposits - result.initialPrincipal)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center py-2 border-b border-border/60">
                  <span className="text-text-secondary">Total Interest Earned</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    +{formatCurrency(result.totalInterest)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2.5 bg-surface-secondary/50 px-3 rounded-btn">
                  <span className="font-semibold text-text">Total Accumulated Value</span>
                  <span className="font-bold text-primary text-base">{formatCurrency(result.finalBalance)}</span>
                </div>
              </div>

              {/* Export */}
              <div className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => exportCompoundInterestSummaryToCsv(compoundParams, result)}
                  className="w-full gap-2 text-xs"
                >
                  <Download className="w-4 h-4 text-primary" />
                  <span>Export Growth Schedule (CSV)</span>
                </Button>
              </div>
            </CardContent>
          </div>

          <div className="p-4 border-t border-border bg-surface-secondary/30 rounded-b-card text-xs text-text-secondary flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <span>Higher compounding frequency increases effective annual yield (APY).</span>
          </div>
        </Card>
      </div>

      {/* 2. Year-by-Year Amortization Schedule */}
      <Card className="border-border">
        <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-btn bg-primary-light text-primary flex items-center justify-center">
              <Table className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Annual Balance & Compounding Schedule</CardTitle>
              <p className="text-xs text-text-secondary">Progression of deposits vs accumulated interest over time</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTable(!showTable)}
            className="p-2"
            title={showTable ? "Collapse Table" : "Expand Table"}
          >
            {showTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </CardHeader>

        {showTable && (
          <CardContent className="pt-4 overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border bg-surface-secondary/40 text-text font-sans font-semibold">
                  <th className="py-2.5 px-3">Timeline</th>
                  <th className="py-2.5 px-3">Total Invested</th>
                  <th className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">Interest Earned</th>
                  <th className="py-2.5 px-3 text-primary font-bold">Closing Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {result.yearlySchedule.map((yr) => (
                  <tr key={yr.year} className="hover:bg-surface-secondary/30 transition-colors">
                    <td className="py-2 px-3 font-semibold font-sans">Year {yr.year}</td>
                    <td className="py-2 px-3">{formatCurrency(yr.principalInvested)}</td>
                    <td className="py-2 px-3 font-medium text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(yr.interestEarned)}
                    </td>
                    <td className="py-2 px-3 font-bold text-primary">{formatCurrency(yr.totalBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
