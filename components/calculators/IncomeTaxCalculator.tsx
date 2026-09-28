"use client";

import React, { useState, useMemo } from "react";
import { calculateIncomeTax, IncomeTaxInputs } from "@/lib/calculations/income-tax";
import { exportIncomeTaxReportToPdf } from "@/lib/export/pdfExporter";
import { useShareableUrl } from "@/hooks/useShareableUrl";
import { formatCurrency, parseSafeNumber } from "@/lib/formatters";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { CopyButton } from "@/components/shared/CommonStates";
import { ShareButton } from "@/components/shared/ShareModal";
import { RotateCcw, FileText, CheckCircle2, Award, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";

export function IncomeTaxCalculator() {
  const { getInitialParam } = useShareableUrl({});

  const [salaryStr, setSalaryStr] = useState<string>(() =>
    getInitialParam("salary", "1000000")
  );
  const [otherIncomeStr, setOtherIncomeStr] = useState<string>(() =>
    getInitialParam("other", "0")
  );
  const [ageCategory, setAgeCategory] = useState<"general" | "senior" | "super_senior">(() => {
    const a = getInitialParam("age", "general");
    return a === "senior" || a === "super_senior" ? a : "general";
  });

  // Deductions for Old Regime
  const [sec80CStr, setSec80CStr] = useState<string>(() =>
    getInitialParam("d80c", "150000")
  );
  const [sec80DStr, setSec80DStr] = useState<string>(() =>
    getInitialParam("d80d", "25000")
  );
  const [sec24bStr, setSec24bStr] = useState<string>(() =>
    getInitialParam("d24b", "0")
  );
  const [hraStr, setHraStr] = useState<string>(() =>
    getInitialParam("dhra", "0")
  );
  const [npsStr, setNpsStr] = useState<string>(() =>
    getInitialParam("dnps", "0")
  );
  const [otherDedsStr, setOtherDedsStr] = useState<string>(() =>
    getInitialParam("dother", "0")
  );

  const [showDeductions, setShowDeductions] = useState<boolean>(true);

  useShareableUrl(
    useMemo(
      () => ({
        salary: salaryStr,
        other: otherIncomeStr,
        age: ageCategory,
        d80c: sec80CStr,
        d80d: sec80DStr,
        d24b: sec24bStr,
        dhra: hraStr,
        dnps: npsStr,
        dother: otherDedsStr,
      }),
      [salaryStr, otherIncomeStr, ageCategory, sec80CStr, sec80DStr, sec24bStr, hraStr, npsStr, otherDedsStr]
    )
  );

  const taxInputs: IncomeTaxInputs = {
    grossSalary: parseSafeNumber(salaryStr, 1000000),
    otherIncome: parseSafeNumber(otherIncomeStr, 0),
    ageCategory,
    section80C: parseSafeNumber(sec80CStr, 150000),
    section80D: parseSafeNumber(sec80DStr, 25000),
    section24b: parseSafeNumber(sec24bStr, 0),
    hraExemption: parseSafeNumber(hraStr, 0),
    nps80CCD1B: parseSafeNumber(npsStr, 0),
    otherDeductions: parseSafeNumber(otherDedsStr, 0),
  };

  const result = calculateIncomeTax(taxInputs);

  const handleReset = () => {
    setSalaryStr("1000000");
    setOtherIncomeStr("0");
    setAgeCategory("general");
    setSec80CStr("150000");
    setSec80DStr("25000");
    setSec24bStr("0");
    setHraStr("0");
    setNpsStr("0");
    setOtherDedsStr("0");
  };

  const copySummaryText = `Your Income Tax Assessment Result

Indian Income Tax Comparison (FY 2024-25 / FY 2025-26)

Gross Annual Income: ${formatCurrency(result.newRegime.grossIncome)}
Age Category: ${ageCategory === "general" ? "General (<60 Yrs)" : ageCategory === "senior" ? "Senior Citizen (60-80 Yrs)" : "Super Senior (80+ Yrs)"}

New Tax Regime:
• Standard Deduction: ${formatCurrency(result.newRegime.standardDeduction)}
• Net Taxable Income: ${formatCurrency(result.newRegime.netTaxableIncome)}
• Total Tax Payable: ${formatCurrency(result.newRegime.totalTaxLiability)}

Old Tax Regime:
• Total Deductions: ${formatCurrency(result.oldRegime.totalDeductions)}
• Net Taxable Income: ${formatCurrency(result.oldRegime.netTaxableIncome)}
• Total Tax Payable: ${formatCurrency(result.oldRegime.totalTaxLiability)}

Recommendation:
${
  result.recommendedRegime === "new"
    ? `✨ NEW TAX REGIME is better for you! (Saves ${formatCurrency(result.taxSavings)} in taxes)`
    : result.recommendedRegime === "old"
    ? `✨ OLD TAX REGIME is better for you! (Saves ${formatCurrency(result.taxSavings)} in taxes)`
    : "Both Tax Regimes result in the exact same tax liability."
}

Want to compare Old vs New Tax Regimes for your salary?

Calculate your Income Tax:
[URL]

Compare tax slabs, standard deduction (₹75,000), Section 87A rebate, and 80C/80D deductions instantly.`;

  return (
    <div className="space-y-8">
      {/* 1. Recommendation Winner Hero Banner */}
      <div
        className={`p-5 rounded-card border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm ${
          result.recommendedRegime === "new"
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
            : result.recommendedRegime === "old"
            ? "bg-primary-light border-primary/30 text-primary"
            : "bg-surface-secondary border-border text-text"
        }`}
      >
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg">
              {result.recommendedRegime === "new"
                ? "New Tax Regime is Recommended for You!"
                : result.recommendedRegime === "old"
                ? "Old Tax Regime is Recommended for You!"
                : "Both Tax Regimes Result in Equal Tax"}
            </h3>
            <p className="text-xs opacity-90">
              {result.taxSavings > 0 ? (
                <span>
                  You save <strong>{formatCurrency(result.taxSavings)}</strong> by choosing the{" "}
                  {result.recommendedRegime === "new" ? "New" : "Old"} Tax Regime.
                </span>
              ) : (
                <span>Both regimes yield the exact same tax liability for your income.</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ShareButton title="Income Tax Comparison" summaryText={copySummaryText} />
          <CopyButton value={copySummaryText} label="Copy Summary" />
        </div>
      </div>

      {/* 2. Inputs & Deductions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Income & Deductions */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-border">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-lg">Income Details</CardTitle>
              <p className="text-xs text-text-secondary">Enter gross annual salary and additional income sources.</p>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {/* Gross Salary */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex justify-between">
                  <span>Gross Annual Salary</span>
                  <span className="text-text-muted">₹ INR / Year</span>
                </label>
                <Input
                  type="number"
                  min="0"
                  step="25000"
                  prefixSymbol="₹"
                  value={salaryStr}
                  onChange={(e) => setSalaryStr(e.target.value)}
                  placeholder="e.g. 1000000"
                />
              </div>

              {/* Other Income */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex justify-between">
                  <span>Income from Other Sources</span>
                  <span className="text-text-muted">Interest, Rental, Freelance</span>
                </label>
                <Input
                  type="number"
                  min="0"
                  step="5000"
                  prefixSymbol="₹"
                  value={otherIncomeStr}
                  onChange={(e) => setOtherIncomeStr(e.target.value)}
                  placeholder="e.g. 50000"
                />
              </div>

              {/* Age Category */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Taxpayer Age Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "general", label: "General (<60)" },
                    { id: "senior", label: "Senior (60-80)" },
                    { id: "super_senior", label: "Super (80+)" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setAgeCategory(cat.id as "general" | "senior" | "super_senior")}
                      className={`py-2 text-xs font-medium rounded-btn border transition-all ${
                        ageCategory === cat.id
                          ? "border-primary bg-primary text-white shadow-sm font-semibold"
                          : "border-border bg-surface text-text hover:bg-surface-secondary"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deductions Accordion Card (Old Regime) */}
          <Card className="border-border">
            <CardHeader
              className="border-b border-border pb-4 flex flex-row items-center justify-between cursor-pointer select-none"
              onClick={() => setShowDeductions(!showDeductions)}
            >
              <div>
                <CardTitle className="text-base font-semibold">Old Regime Deductions & Exemptions</CardTitle>
                <p className="text-xs text-text-secondary">Eligible tax-saving investments (Section 80C, 80D, HRA, etc.)</p>
              </div>
              <Button variant="ghost" size="sm" className="p-2">
                {showDeductions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CardHeader>

            {showDeductions && (
              <CardContent className="pt-6 space-y-4">
                {/* 80C */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex justify-between">
                    <span>Section 80C (PPF, EPF, ELSS, LIC, Home Loan)</span>
                    <span className="text-text-muted">Max ₹1.5L</span>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="150000"
                    step="5000"
                    prefixSymbol="₹"
                    value={sec80CStr}
                    onChange={(e) => setSec80CStr(e.target.value)}
                    placeholder="e.g. 150000"
                  />
                </div>

                {/* 80D */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex justify-between">
                    <span>Section 80D (Health Insurance Premium)</span>
                    <span className="text-text-muted">Self & Parents</span>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="2500"
                    prefixSymbol="₹"
                    value={sec80DStr}
                    onChange={(e) => setSec80DStr(e.target.value)}
                    placeholder="e.g. 25000"
                  />
                </div>

                {/* HRA & 24b Home Loan Interest */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      HRA Exemption
                    </label>
                    <Input
                      type="number"
                      min="0"
                      prefixSymbol="₹"
                      value={hraStr}
                      onChange={(e) => setHraStr(e.target.value)}
                      placeholder="e.g. 60000"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex justify-between">
                      <span>Home Loan Interest</span>
                      <span className="text-text-muted">Max ₹2L</span>
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="200000"
                      prefixSymbol="₹"
                      value={sec24bStr}
                      onChange={(e) => setSec24bStr(e.target.value)}
                      placeholder="e.g. 100000"
                    />
                  </div>
                </div>

                {/* NPS 80CCD(1B) */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex justify-between">
                    <span>Section 80CCD(1B) — National Pension System (NPS)</span>
                    <span className="text-text-muted">Max ₹50K</span>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="50000"
                    prefixSymbol="₹"
                    value={npsStr}
                    onChange={(e) => setNpsStr(e.target.value)}
                    placeholder="e.g. 50000"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-border">
                  <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Fields</span>
                  </Button>
                  <span className="text-xs text-text-muted">Deductions apply to Old Regime only</span>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Right Column: Side-by-Side Comparison */}
        <div className="lg:col-span-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* New Regime Card */}
            <Card
              className={`border transition-all ${
                result.recommendedRegime === "new"
                  ? "border-emerald-500 bg-emerald-500/5 shadow-md ring-2 ring-emerald-500/20"
                  : "border-border bg-surface"
              }`}
            >
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-text">New Tax Regime</span>
                  {result.recommendedRegime === "new" && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                      Recommended
                    </span>
                  )}
                </div>
                <div className="mt-2 text-2xl font-extrabold text-text">
                  {formatCurrency(result.newRegime.totalTaxLiability)}
                </div>
                <span className="text-[11px] text-text-muted">Total Tax Payable (incl. Cess)</span>
              </CardHeader>
              <CardContent className="pt-4 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-text-secondary">Standard Deduction</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    -{formatCurrency(result.newRegime.standardDeduction)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-text-secondary">Net Taxable Income</span>
                  <span className="font-semibold text-text">{formatCurrency(result.newRegime.netTaxableIncome)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-text-secondary">Section 87A Rebate</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {result.newRegime.rebate87A > 0 ? `-${formatCurrency(result.newRegime.rebate87A)}` : "₹0"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-text-secondary">Effective Tax Rate</span>
                  <span className="font-semibold text-text">{result.newRegime.effectiveTaxRate}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Old Regime Card */}
            <Card
              className={`border transition-all ${
                result.recommendedRegime === "old"
                  ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/20"
                  : "border-border bg-surface"
              }`}
            >
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-text">Old Tax Regime</span>
                  {result.recommendedRegime === "old" && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white">
                      Recommended
                    </span>
                  )}
                </div>
                <div className="mt-2 text-2xl font-extrabold text-text">
                  {formatCurrency(result.oldRegime.totalTaxLiability)}
                </div>
                <span className="text-[11px] text-text-muted">Total Tax Payable (incl. Cess)</span>
              </CardHeader>
              <CardContent className="pt-4 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-text-secondary">Total Deductions</span>
                  <span className="font-semibold text-primary">-{formatCurrency(result.oldRegime.totalDeductions)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-text-secondary">Net Taxable Income</span>
                  <span className="font-semibold text-text">{formatCurrency(result.oldRegime.netTaxableIncome)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-text-secondary">Section 87A Rebate</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {result.oldRegime.rebate87A > 0 ? `-${formatCurrency(result.oldRegime.rebate87A)}` : "₹0"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-text-secondary">Effective Tax Rate</span>
                  <span className="font-semibold text-text">{result.oldRegime.effectiveTaxRate}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Download Comparison Sheet */}
          <Card className="border-border bg-surface">
            <CardContent className="p-4 space-y-3">
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => exportIncomeTaxReportToPdf(taxInputs, result)}
                className="w-full gap-2 text-xs"
              >
                <FileText className="w-4 h-4" />
                <span>Download Tax Comparison Report (PDF)</span>
              </Button>
              <div className="flex items-center gap-2 text-[11px] text-text-secondary justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Updated for Union Budget FY 2024-25 & FY 2025-26 rules</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
