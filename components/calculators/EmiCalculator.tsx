"use client";

import React, { useState, useMemo } from "react";
import { calculateEmi } from "@/lib/calculations/emi";
import { generateAmortizationSchedule } from "@/lib/calculations/amortization";
import { exportEmiScheduleToPdf } from "@/lib/export/pdfExporter";
import { exportEmiScheduleToCsv } from "@/lib/export/csvExporter";
import { useShareableUrl } from "@/hooks/useShareableUrl";
import { formatCurrency, parseSafeNumber } from "@/lib/formatters";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { CopyButton } from "@/components/shared/CommonStates";
import { ShareButton } from "@/components/shared/ShareModal";
import { RotateCcw, FileText, Download, Table, ChevronDown, ChevronUp } from "lucide-react";

export function EmiCalculator() {
  const { getInitialParam } = useShareableUrl({});

  const [principalStr, setPrincipalStr] = useState<string>(() =>
    getInitialParam("amount", "100000")
  );
  const [interestRateStr, setInterestRateStr] = useState<string>(() =>
    getInitialParam("rate", "12")
  );
  const [tenureValueStr, setTenureValueStr] = useState<string>(() =>
    getInitialParam("tenure", "12")
  );
  const [tenureType, setTenureType] = useState<"months" | "years">(() =>
    getInitialParam("type", "months") === "years" ? "years" : "months"
  );

  const [scheduleView, setScheduleView] = useState<"yearly" | "monthly">("yearly");
  const [showSchedule, setShowSchedule] = useState<boolean>(true);

  // Sync state to URL params live
  useShareableUrl(
    useMemo(
      () => ({
        amount: principalStr,
        rate: interestRateStr,
        tenure: tenureValueStr,
        type: tenureType,
      }),
      [principalStr, interestRateStr, tenureValueStr, tenureType]
    )
  );

  const principal = parseSafeNumber(principalStr, 100000);
  const interestRate = parseSafeNumber(interestRateStr, 12);
  const tenureValue = parseSafeNumber(tenureValueStr, 12);

  const result = calculateEmi({
    principal,
    annualInterestRate: interestRate,
    tenureValue,
    tenureType,
  });

  const amortization = useMemo(() => {
    return generateAmortizationSchedule(
      result.principal,
      interestRate,
      result.months,
      result.monthlyEmi
    );
  }, [result.principal, interestRate, result.months, result.monthlyEmi]);

  const handleReset = () => {
    setPrincipalStr("100000");
    setInterestRateStr("12");
    setTenureValueStr("12");
    setTenureType("months");
  };

  const principalPercent =
    result.totalPayment > 0
      ? ((result.principal / result.totalPayment) * 100).toFixed(1)
      : "100";
  const interestPercent =
    result.totalPayment > 0
      ? ((result.totalInterest / result.totalPayment) * 100).toFixed(1)
      : "0";

  const copySummaryText = `Your Loan EMI Result

Equated Monthly Installment (EMI) Breakdown

Loan Principal: ${formatCurrency(result.principal)}
Annual Interest Rate: ${interestRate}% p.a.
Loan Tenure: ${result.months} Months (${tenureValue} ${tenureType})

Monthly EMI: ${formatCurrency(result.monthlyEmi)}
Total Interest Payable: ${formatCurrency(result.totalInterest)}
Total Repayment (Principal + Interest): ${formatCurrency(result.totalPayment)}

Want to calculate your monthly EMI and repayment plan?

Calculate your Loan EMI:
[URL]

Accurately calculate home, car, or personal loan EMI and view your complete amortization schedule.`;

  return (
    <div className="space-y-8">
      {/* 1. Interactive Inputs & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Card: Calculator Inputs */}
        <Card className="border-border">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-lg">Loan Parameters</CardTitle>
            <p className="text-xs text-text-secondary">
              Enter your loan amount, annual interest rate, and duration.
            </p>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            {/* Principal */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex justify-between">
                <span>Loan Amount</span>
                <span className="text-text-muted">₹ Principal</span>
              </label>
              <Input
                type="number"
                min="0"
                step="1000"
                prefixSymbol="₹"
                value={principalStr}
                onChange={(e) => setPrincipalStr(e.target.value)}
                placeholder="e.g. 100000"
              />
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex justify-between">
                <span>Annual Interest Rate</span>
                <span className="text-text-muted">% p.a. (0 for no-cost)</span>
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.1"
                suffixSymbol="%"
                value={interestRateStr}
                onChange={(e) => setInterestRateStr(e.target.value)}
                placeholder="e.g. 12"
              />
            </div>

            {/* Tenure & Unit */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Loan Tenure ({tenureType})
                </label>
                <div className="flex p-0.5 bg-surface-secondary rounded-md text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      if (tenureType === "years") {
                        setTenureValueStr(String(Math.round(tenureValue * 12)));
                      }
                      setTenureType("months");
                    }}
                    className={`px-2.5 py-1 rounded font-medium transition-all ${
                      tenureType === "months"
                        ? "bg-surface text-primary shadow-sm font-semibold"
                        : "text-text-secondary hover:text-text"
                    }`}
                  >
                    Months
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (tenureType === "months") {
                        setTenureValueStr(String(Math.max(1, Math.round(tenureValue / 12))));
                      }
                      setTenureType("years");
                    }}
                    className={`px-2.5 py-1 rounded font-medium transition-all ${
                      tenureType === "years"
                        ? "bg-surface text-primary shadow-sm font-semibold"
                        : "text-text-secondary hover:text-text"
                    }`}
                  >
                    Years
                  </button>
                </div>
              </div>
              <Input
                type="number"
                min="1"
                max="360"
                value={tenureValueStr}
                onChange={(e) => setTenureValueStr(e.target.value)}
                placeholder={tenureType === "months" ? "e.g. 12" : "e.g. 1"}
                suffixSymbol={tenureType}
              />
            </div>

            {/* Quick Presets */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block mb-2">
                Popular Tenures
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "6 Months", months: 6 },
                  { label: "1 Year", months: 12 },
                  { label: "2 Years", months: 24 },
                  { label: "3 Years", months: 36 },
                  { label: "5 Years", months: 60 },
                ].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setTenureType("months");
                      setTenureValueStr(String(p.months));
                    }}
                    className="px-2.5 py-1 text-xs rounded-btn border border-border bg-surface hover:bg-surface-secondary text-text transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-border">
              <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </Button>
              <div className="text-xs text-text-muted">Live calculation</div>
            </div>
          </CardContent>
        </Card>

        {/* Right Card: Repayment Summary */}
        <Card className="border-border bg-surface/80 flex flex-col justify-between">
          <div>
            <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Repayment Summary</CardTitle>
                <p className="text-xs text-text-secondary">Monthly EMI & total payable breakdown</p>
              </div>
              <div className="flex items-center gap-2">
                <ShareButton title="EMI Loan Calculation" summaryText={copySummaryText} />
                <CopyButton value={copySummaryText} label="Copy" />
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {/* Monthly EMI Hero */}
              <div className="p-5 rounded-card bg-primary-light border border-primary/20 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Monthly EMI Installment
                </span>
                <div className="mt-1 text-3xl font-extrabold text-primary">
                  {formatCurrency(result.monthlyEmi)}
                </div>
                <span className="text-xs text-primary/80 mt-1 block">
                  for {result.months} consecutive months
                </span>
              </div>

              {/* Proportion Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-text flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
                    Principal: {principalPercent}%
                  </span>
                  <span className="text-text flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    Interest: {interestPercent}%
                  </span>
                </div>
                <div className="w-full h-3 bg-surface-secondary rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${principalPercent}%` }}
                  />
                  <div
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${interestPercent}%` }}
                  />
                </div>
              </div>

              {/* Detailed Figures */}
              <div className="space-y-2.5 pt-2 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-border/60">
                  <span className="text-text-secondary">Principal Loan Amount</span>
                  <span className="font-semibold text-text">{formatCurrency(result.principal)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-border/60">
                  <span className="text-text-secondary">Total Interest Amount</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {formatCurrency(result.totalInterest)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2.5 bg-surface-secondary/50 px-3 rounded-btn">
                  <span className="font-semibold text-text">Total Repayment Amount</span>
                  <span className="font-bold text-primary text-base">
                    {formatCurrency(result.totalPayment)}
                  </span>
                </div>
              </div>

              {/* PDF & CSV Export Actions */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => exportEmiScheduleToPdf(result, interestRate, amortization.monthlySchedule)}
                  className="gap-2 text-xs flex-1"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download PDF Report</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => exportEmiScheduleToCsv(result, amortization.monthlySchedule, amortization.yearlySchedule)}
                  className="gap-2 text-xs flex-1"
                >
                  <Download className="w-4 h-4 text-primary" />
                  <span>Export CSV / Excel</span>
                </Button>
              </div>
            </CardContent>
          </div>

          <div className="p-4 border-t border-border bg-surface-secondary/30 rounded-b-card text-xs text-text-secondary">
            <span>
              Tip: Extra principal pre-payments directly reduce interest charges over the remaining tenure.
            </span>
          </div>
        </Card>
      </div>

      {/* 2. Interactive Amortization Schedule Table */}
      <Card className="border-border">
        <CardHeader className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-btn bg-primary-light text-primary flex items-center justify-center">
              <Table className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Loan Amortization Repayment Schedule</CardTitle>
              <p className="text-xs text-text-secondary">Breakdown of principal vs interest paid over time</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher */}
            <div className="flex p-0.5 bg-surface-secondary rounded-btn text-xs">
              <button
                type="button"
                onClick={() => setScheduleView("yearly")}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  scheduleView === "yearly"
                    ? "bg-surface text-primary shadow-sm font-semibold"
                    : "text-text-secondary hover:text-text"
                }`}
              >
                Yearly View
              </button>
              <button
                type="button"
                onClick={() => setScheduleView("monthly")}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  scheduleView === "monthly"
                    ? "bg-surface text-primary shadow-sm font-semibold"
                    : "text-text-secondary hover:text-text"
                }`}
              >
                Monthly View ({amortization.monthlySchedule.length}m)
              </button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSchedule(!showSchedule)}
              className="p-2"
              title={showSchedule ? "Collapse Table" : "Expand Table"}
            >
              {showSchedule ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>

        {showSchedule && (
          <CardContent className="pt-4 overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border bg-surface-secondary/40 text-text font-sans font-semibold">
                  <th className="py-2.5 px-3">{scheduleView === "yearly" ? "Year" : "Period"}</th>
                  {scheduleView === "monthly" && <th className="py-2.5 px-3">Opening Balance</th>}
                  <th className="py-2.5 px-3">Monthly EMI</th>
                  <th className="py-2.5 px-3 text-primary">Principal Paid</th>
                  <th className="py-2.5 px-3 text-amber-600 dark:text-amber-400">Interest Paid</th>
                  <th className="py-2.5 px-3">Closing Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {scheduleView === "yearly"
                  ? amortization.yearlySchedule.map((yr) => (
                      <tr key={yr.year} className="hover:bg-surface-secondary/30 transition-colors">
                        <td className="py-2 px-3 font-semibold font-sans">Year {yr.year}</td>
                        <td className="py-2 px-3">{formatCurrency(yr.totalPaid)}</td>
                        <td className="py-2 px-3 font-medium text-primary">{formatCurrency(yr.principalPaid)}</td>
                        <td className="py-2 px-3 font-medium text-amber-600 dark:text-amber-400">
                          {formatCurrency(yr.interestPaid)}
                        </td>
                        <td className="py-2 px-3">{formatCurrency(yr.closingBalance)}</td>
                      </tr>
                    ))
                  : amortization.monthlySchedule.map((m) => (
                      <tr key={m.month} className="hover:bg-surface-secondary/30 transition-colors">
                        <td className="py-2 px-3 font-medium font-sans">Month {m.month}</td>
                        <td className="py-2 px-3">{formatCurrency(m.openingBalance)}</td>
                        <td className="py-2 px-3">{formatCurrency(m.emi)}</td>
                        <td className="py-2 px-3 text-primary font-medium">{formatCurrency(m.principalPaid)}</td>
                        <td className="py-2 px-3 text-amber-600 dark:text-amber-400 font-medium">
                          {formatCurrency(m.interestPaid)}
                        </td>
                        <td className="py-2 px-3 font-semibold">{formatCurrency(m.closingBalance)}</td>
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
