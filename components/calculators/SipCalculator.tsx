"use client";

import React, { useState, useMemo } from "react";
import { calculateSip } from "@/lib/calculations/sip";
import { exportSipReportToPdf } from "@/lib/export/pdfExporter";
import { exportSipSummaryToCsv } from "@/lib/export/csvExporter";
import { useShareableUrl } from "@/hooks/useShareableUrl";
import { formatCurrency, parseSafeNumber } from "@/lib/formatters";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { CopyButton } from "@/components/shared/CommonStates";
import { ShareButton } from "@/components/shared/ShareModal";
import { RotateCcw, FileText, Download, TrendingUp, Table, ChevronDown, ChevronUp } from "lucide-react";

export function SipCalculator() {
  const { getInitialParam } = useShareableUrl({});

  const [investmentType, setInvestmentType] = useState<"sip" | "lumpsum">(() =>
    getInitialParam("type", "sip") === "lumpsum" ? "lumpsum" : "sip"
  );
  const [monthlyAmountStr, setMonthlyAmountStr] = useState<string>(() =>
    getInitialParam("amount", "5000")
  );
  const [lumpsumAmountStr, setLumpsumAmountStr] = useState<string>(() =>
    getInitialParam("lumpsum", "100000")
  );
  const [returnRateStr, setReturnRateStr] = useState<string>(() =>
    getInitialParam("rate", "12")
  );
  const [tenureYearsStr, setTenureYearsStr] = useState<string>(() =>
    getInitialParam("years", "10")
  );
  const [stepUpStr, setStepUpStr] = useState<string>(() =>
    getInitialParam("stepup", "0")
  );

  const [showTable, setShowTable] = useState<boolean>(true);

  // Sync state to URL params live
  useShareableUrl(
    useMemo(
      () => ({
        type: investmentType,
        amount: investmentType === "sip" ? monthlyAmountStr : lumpsumAmountStr,
        rate: returnRateStr,
        years: tenureYearsStr,
        stepup: stepUpStr,
      }),
      [investmentType, monthlyAmountStr, lumpsumAmountStr, returnRateStr, tenureYearsStr, stepUpStr]
    )
  );

  const monthlyInvestment = parseSafeNumber(monthlyAmountStr, 5000);
  const lumpsumAmount = parseSafeNumber(lumpsumAmountStr, 100000);
  const expectedReturnRate = parseSafeNumber(returnRateStr, 12);
  const timePeriodYears = parseSafeNumber(tenureYearsStr, 10);
  const stepUpPercentage = parseSafeNumber(stepUpStr, 0);

  const sipParams = {
    investmentType,
    monthlyInvestment,
    lumpsumAmount,
    expectedReturnRate,
    timePeriodYears,
    stepUpPercentage,
  };

  const result = calculateSip(sipParams);

  const handleReset = () => {
    setMonthlyAmountStr("5000");
    setLumpsumAmountStr("100000");
    setReturnRateStr("12");
    setTenureYearsStr("10");
    setStepUpStr("0");
  };

  const investedRatio = result.totalValue > 0 ? ((result.totalInvested / result.totalValue) * 100).toFixed(1) : "50";
  const gainsRatio = result.totalValue > 0 ? ((result.wealthGained / result.totalValue) * 100).toFixed(1) : "50";

  const copySummaryText = `Your Mutual Fund SIP Wealth Result

Systematic Investment Plan (SIP) Projection

Investment Mode: ${investmentType === "sip" ? "Monthly SIP" : "One-Time Lumpsum"}
${investmentType === "sip" ? `Monthly Contribution: ${formatCurrency(monthlyInvestment)}` : `Lumpsum Principal: ${formatCurrency(lumpsumAmount)}`}
Expected Annual Return: ${expectedReturnRate}% p.a.
Investment Duration: ${timePeriodYears} Years${stepUpPercentage > 0 ? `\nAnnual Step-Up: ${stepUpPercentage}%` : ""}

Total Amount Invested: ${formatCurrency(result.totalInvested)}
Estimated Capital Gains: ${formatCurrency(result.wealthGained)}
Total Future Wealth: ${formatCurrency(result.totalValue)}

Want to calculate your mutual fund returns and wealth growth?

Calculate your SIP:
[URL]

Plan your monthly SIP investments, visualize wealth growth, and download complete investment reports.`;

  return (
    <div className="space-y-8">
      {/* 1. Calculator & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Card: Inputs */}
        <Card className="border-border">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-lg">Investment Details</CardTitle>
            <p className="text-xs text-text-secondary">
              Configure your periodic investment, expected CAGR returns, and duration.
            </p>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            {/* Mode Switcher */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Investment Strategy
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-surface-secondary rounded-btn">
                <button
                  type="button"
                  onClick={() => setInvestmentType("sip")}
                  className={`py-2 text-xs font-medium rounded-md transition-all ${
                    investmentType === "sip"
                      ? "bg-surface text-primary shadow-sm font-semibold"
                      : "text-text-secondary hover:text-text"
                  }`}
                >
                  Monthly SIP
                </button>
                <button
                  type="button"
                  onClick={() => setInvestmentType("lumpsum")}
                  className={`py-2 text-xs font-medium rounded-md transition-all ${
                    investmentType === "lumpsum"
                      ? "bg-surface text-primary shadow-sm font-semibold"
                      : "text-text-secondary hover:text-text"
                  }`}
                >
                  One-Time Lumpsum
                </button>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex justify-between">
                <span>{investmentType === "sip" ? "Monthly Investment Amount" : "Lumpsum Principal"}</span>
                <span className="text-text-muted">₹ INR</span>
              </label>
              <Input
                type="number"
                min="100"
                step="500"
                prefixSymbol="₹"
                value={investmentType === "sip" ? monthlyAmountStr : lumpsumAmountStr}
                onChange={(e) =>
                  investmentType === "sip" ? setMonthlyAmountStr(e.target.value) : setLumpsumAmountStr(e.target.value)
                }
                placeholder="e.g. 5000"
              />
            </div>

            {/* Expected Rate & Tenure */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex justify-between">
                  <span>Expected Return</span>
                  <span className="text-text-muted">% p.a.</span>
                </label>
                <Input
                  type="number"
                  min="1"
                  max="40"
                  step="0.5"
                  suffixSymbol="%"
                  value={returnRateStr}
                  onChange={(e) => setReturnRateStr(e.target.value)}
                  placeholder="e.g. 12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex justify-between">
                  <span>Time Period</span>
                  <span className="text-text-muted">Years</span>
                </label>
                <Input
                  type="number"
                  min="1"
                  max="40"
                  suffixSymbol="Yrs"
                  value={tenureYearsStr}
                  onChange={(e) => setTenureYearsStr(e.target.value)}
                  placeholder="e.g. 10"
                />
              </div>
            </div>

            {/* Step-Up Option for SIP */}
            {investmentType === "sip" && (
              <div className="space-y-2 pt-1 border-t border-border">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Annual Step-Up Top-up (%)
                  </label>
                  <span className="text-xs text-text-muted">Optional salary raise</span>
                </div>
                <div className="flex gap-2 items-center">
                  {[0, 5, 10, 15].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setStepUpStr(String(pct))}
                      className={`px-3 py-1 text-xs rounded-btn border transition-all ${
                        Number(stepUpStr) === pct
                          ? "border-primary bg-primary text-white shadow-sm font-semibold"
                          : "border-border bg-surface text-text hover:bg-surface-secondary"
                      }`}
                    >
                      {pct === 0 ? "None" : `+${pct}% / yr`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between border-t border-border">
              <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </Button>
              <div className="text-xs text-text-muted">Calculates dynamically</div>
            </div>
          </CardContent>
        </Card>

        {/* Right Card: Results */}
        <Card className="border-border bg-surface/80 flex flex-col justify-between">
          <div>
            <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Wealth Projection</CardTitle>
                <p className="text-xs text-text-secondary">Capital invested vs estimated maturity corpus</p>
              </div>
              <div className="flex items-center gap-2">
                <ShareButton title="SIP Investment Projection" summaryText={copySummaryText} />
                <CopyButton value={copySummaryText} label="Copy" />
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {/* Total Corpus Hero */}
              <div className="p-5 rounded-card bg-primary-light border border-primary/20 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Total Estimated Future Value
                </span>
                <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-primary">
                  {formatCurrency(result.totalValue)}
                </div>
                <span className="text-xs text-primary/80 mt-1 block">
                  after {timePeriodYears} years @ {expectedReturnRate}% CAGR
                </span>
              </div>

              {/* Progress Proportion Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-text flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
                    Invested: {investedRatio}%
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    Returns: {gainsRatio}%
                  </span>
                </div>
                <div className="w-full h-3 bg-surface-secondary rounded-full overflow-hidden flex">
                  <div className="h-full bg-primary transition-all duration-300" style={{ width: `${investedRatio}%` }} />
                  <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${gainsRatio}%` }} />
                </div>
              </div>

              {/* Key Figures */}
              <div className="space-y-2.5 pt-2 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-border/60">
                  <span className="text-text-secondary">Total Amount Invested</span>
                  <span className="font-semibold text-text">{formatCurrency(result.totalInvested)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-border/60">
                  <span className="text-text-secondary">Estimated Capital Gains</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    +{formatCurrency(result.wealthGained)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2.5 bg-surface-secondary/50 px-3 rounded-btn">
                  <span className="font-semibold text-text">Final Maturity Corpus</span>
                  <span className="font-bold text-primary text-base">{formatCurrency(result.totalValue)}</span>
                </div>
              </div>

              {/* Download Reports */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => exportSipReportToPdf(sipParams, result)}
                  className="gap-2 text-xs flex-1"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download PDF Report</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => exportSipSummaryToCsv(sipParams, result)}
                  className="gap-2 text-xs flex-1"
                >
                  <Download className="w-4 h-4 text-primary" />
                  <span>Export CSV</span>
                </Button>
              </div>
            </CardContent>
          </div>

          <div className="p-4 border-t border-border bg-surface-secondary/30 rounded-b-card text-xs text-text-secondary">
            <span>
              {result.wealthGained > result.totalInvested
                ? "🚀 Compounding Miracle: Your capital gains exceed your total invested principal!"
                : "Consistent periodic investing harnesses the power of rupee-cost averaging."}
            </span>
          </div>
        </Card>
      </div>

      {/* 2. Interactive SVG Wealth Growth Visualization */}
      <Card className="border-border">
        <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-btn bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Wealth Growth Trajectory</CardTitle>
              <p className="text-xs text-text-secondary">Yearly progression of capital invested vs compounding gains</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* SVG Bar / Area Visualization */}
          <div className="h-64 sm:h-72 w-full flex items-end gap-1 sm:gap-2 pt-6 pb-2 px-2 overflow-x-auto">
            {result.yearlySchedule.map((item) => {
              const maxVal = result.totalValue || 1;
              const totalHeightPct = Math.min(100, Math.max(8, (item.totalCorpus / maxVal) * 100));
              const investedHeightPct = item.totalCorpus > 0 ? (item.investedAmount / item.totalCorpus) * 100 : 100;
              const gainsHeightPct = 100 - investedHeightPct;

              return (
                <div
                  key={item.year}
                  className="flex-1 flex flex-col items-center justify-end h-full min-w-[28px] group relative"
                >
                  {/* Tooltip on Hover */}
                  <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-12 z-20 bg-neutral-900 text-white text-[10px] p-1.5 rounded shadow-lg whitespace-nowrap transition-opacity">
                    <p className="font-bold">Year {item.year}</p>
                    <p>Total: {formatCurrency(item.totalCorpus)}</p>
                  </div>

                  {/* Stacked Bar */}
                  <div
                    className="w-full rounded-t-md overflow-hidden flex flex-col justify-end transition-all duration-300 group-hover:brightness-110"
                    style={{ height: `${totalHeightPct}%` }}
                  >
                    <div className="w-full bg-emerald-500" style={{ height: `${gainsHeightPct}%` }} />
                    <div className="w-full bg-primary" style={{ height: `${investedHeightPct}%` }} />
                  </div>

                  <span className="text-[10px] text-text-muted mt-2 font-mono">Y{item.year}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 pt-4 text-xs font-medium border-t border-border">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-primary" />
              <span className="text-text-secondary">Amount Invested</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500" />
              <span className="text-text-secondary">Estimated Capital Gain</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Year-by-Year Growth Table */}
      <Card className="border-border">
        <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-btn bg-primary-light text-primary flex items-center justify-center">
              <Table className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Yearly Investment Breakdown</CardTitle>
              <p className="text-xs text-text-secondary">Detailed year-by-year corpus accumulation</p>
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
                  <th className="py-2.5 px-3">Invested Principal</th>
                  <th className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">Estimated Returns</th>
                  <th className="py-2.5 px-3 text-primary font-bold">Total Corpus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {result.yearlySchedule.map((yr) => (
                  <tr key={yr.year} className="hover:bg-surface-secondary/30 transition-colors">
                    <td className="py-2 px-3 font-semibold font-sans">Year {yr.year}</td>
                    <td className="py-2 px-3">{formatCurrency(yr.investedAmount)}</td>
                    <td className="py-2 px-3 font-medium text-emerald-600 dark:text-emerald-400">
                      +{formatCurrency(yr.wealthGained)}
                    </td>
                    <td className="py-2 px-3 font-bold text-primary">{formatCurrency(yr.totalCorpus)}</td>
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
