"use client";

import React, { useState, useMemo } from "react";
import { calculateEpf } from "@/lib/calculations/epf";
import { useShareableUrl } from "@/hooks/useShareableUrl";
import { formatCurrency, parseSafeNumber } from "@/lib/formatters";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { CopyButton } from "@/components/shared/CommonStates";
import { ShareButton } from "@/components/shared/ShareModal";
import { RotateCcw, Landmark, ShieldCheck } from "lucide-react";

export function EpfCalculator() {
  const { getInitialParam } = useShareableUrl({});

  const [currentAgeStr, setCurrentAgeStr] = useState<string>(() =>
    getInitialParam("age", "25")
  );
  const [retirementAgeStr, setRetirementAgeStr] = useState<string>(() =>
    getInitialParam("retireAge", "58")
  );
  const [basicSalaryStr, setBasicSalaryStr] = useState<string>(() =>
    getInitialParam("salary", "40000")
  );
  const [employeeContributionPercentStr, setEmployeeContributionPercentStr] = useState<string>(() =>
    getInitialParam("empShare", "12")
  );
  const [annualIncrementStr, setAnnualIncrementStr] = useState<string>(() =>
    getInitialParam("increment", "5")
  );
  const [interestRateStr, setInterestRateStr] = useState<string>(() =>
    getInitialParam("rate", "8.25")
  );
  const [currentBalanceStr, setCurrentBalanceStr] = useState<string>(() =>
    getInitialParam("balance", "0")
  );

  // Sync state to URL parameters live
  useShareableUrl(
    useMemo(
      () => ({
        age: currentAgeStr,
        retireAge: retirementAgeStr,
        salary: basicSalaryStr,
        empShare: employeeContributionPercentStr,
        increment: annualIncrementStr,
        rate: interestRateStr,
        balance: currentBalanceStr,
      }),
      [
        currentAgeStr,
        retirementAgeStr,
        basicSalaryStr,
        employeeContributionPercentStr,
        annualIncrementStr,
        interestRateStr,
        currentBalanceStr,
      ]
    )
  );

  const currentAge = parseSafeNumber(currentAgeStr, 25);
  const retirementAge = parseSafeNumber(retirementAgeStr, 58);
  const basicSalaryMonthly = parseSafeNumber(basicSalaryStr, 40000);
  const employeeContributionPercent = parseSafeNumber(employeeContributionPercentStr, 12);
  const annualSalaryIncrementPercent = parseSafeNumber(annualIncrementStr, 5);
  const annualInterestRate = parseSafeNumber(interestRateStr, 8.25);
  const currentEpfBalance = parseSafeNumber(currentBalanceStr, 0);

  const epfParams = {
    currentAge,
    retirementAge,
    basicSalaryMonthly,
    employeeContributionPercent,
    employerEpfPercent: 3.67, // 3.67% to EPF + 8.33% to EPS
    annualSalaryIncrementPercent,
    annualInterestRate,
    currentEpfBalance,
  };

  const result = calculateEpf(epfParams);

  const handleReset = () => {
    setCurrentAgeStr("25");
    setRetirementAgeStr("58");
    setBasicSalaryStr("40000");
    setEmployeeContributionPercentStr("12");
    setAnnualIncrementStr("5");
    setInterestRateStr("8.25");
    setCurrentBalanceStr("0");
  };

  const totalDeposited = result.totalContribution;
  const totalInterest = result.totalInterestEarned;
  const totalCorpus = result.maturityCorpus;

  const depositPercent = totalCorpus > 0 ? ((totalDeposited / totalCorpus) * 100).toFixed(1) : "40";
  const interestPercent = totalCorpus > 0 ? ((totalInterest / totalCorpus) * 100).toFixed(1) : "60";

  const copySummaryText = `Employees' Provident Fund (EPF) Projection

Current Age: ${currentAge} Years | Retirement Age: ${retirementAge} Years
Monthly Basic Salary + DA: ${formatCurrency(basicSalaryMonthly)}
Employee Share: ${employeeContributionPercent}% | Employer EPF Share: 3.67%
Expected Annual Increment: ${annualSalaryIncrementPercent}%
Current EPF Interest Rate: ${annualInterestRate}% p.a.

EPF Retirement Corpus Breakdown:
Total Employee Deposit: ${formatCurrency(result.totalEmployeeContribution)}
Total Employer EPF Deposit: ${formatCurrency(result.totalEmployerContribution)}
Total Principal Contributed: ${formatCurrency(result.totalContribution)}
Total Interest Earned: ${formatCurrency(result.totalInterestEarned)}
Total Accumulated Corpus at Age ${retirementAge}: ${formatCurrency(result.maturityCorpus)}

Calculate your EPF & retirement corpus:
[URL]

Fast, free and 100% private financial calculators on Pocket Tools.`;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface-raised border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-text">EPF / PF Retirement Corpus Calculator</h2>
            <p className="text-xs text-text-secondary">
              Calculate accumulated provident fund with compounding interest & yearly increments
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>
          <CopyButton value={copySummaryText} label="Copy Summary" />
          <ShareButton summaryText={copySummaryText} title="EPF Calculator" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-text">Salary & Contribution Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Monthly Basic + DA */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-text">Monthly Basic Salary + DA</label>
                  <span className="text-sm font-semibold text-primary">{formatCurrency(basicSalaryMonthly)}</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-secondary font-medium">₹</span>
                  <Input
                    type="number"
                    min="1000"
                    max="10000000"
                    step="1000"
                    value={basicSalaryStr}
                    onChange={(e) => setBasicSalaryStr(e.target.value)}
                    className="pl-8 text-text font-medium"
                    placeholder="40000"
                  />
                </div>
                <input
                  type="range"
                  min="5000"
                  max="300000"
                  step="1000"
                  value={Math.min(300000, basicSalaryMonthly)}
                  onChange={(e) => setBasicSalaryStr(e.target.value)}
                  className="w-full accent-primary h-1.5 bg-border rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Ages Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">Current Age (Years)</label>
                  <Input
                    type="number"
                    min="18"
                    max="65"
                    value={currentAgeStr}
                    onChange={(e) => setCurrentAgeStr(e.target.value)}
                    className="text-text font-medium"
                    placeholder="25"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">Retirement Age</label>
                  <Input
                    type="number"
                    min="45"
                    max="75"
                    value={retirementAgeStr}
                    onChange={(e) => setRetirementAgeStr(e.target.value)}
                    className="text-text font-medium"
                    placeholder="58"
                  />
                </div>
              </div>

              {/* Annual Increment */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-text">Expected Annual Salary Increment</label>
                  <span className="text-sm font-semibold text-primary">{annualSalaryIncrementPercent}%</span>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    max="30"
                    step="0.5"
                    value={annualIncrementStr}
                    onChange={(e) => setAnnualIncrementStr(e.target.value)}
                    className="pr-8 text-text font-medium"
                    placeholder="5"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-secondary">%</span>
                </div>
              </div>

              {/* Interest Rate & Existing Balance */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">EPF Interest Rate</label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="1"
                      max="15"
                      step="0.05"
                      value={interestRateStr}
                      onChange={(e) => setInterestRateStr(e.target.value)}
                      className="pr-8 text-text font-medium"
                      placeholder="8.25"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-secondary">%</span>
                  </div>
                  <p className="text-[11px] text-text-secondary">Govt rate: 8.25% p.a.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text">Current EPF Balance</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-secondary">₹</span>
                    <Input
                      type="number"
                      min="0"
                      step="10000"
                      value={currentBalanceStr}
                      onChange={(e) => setCurrentBalanceStr(e.target.value)}
                      className="pl-7 text-text font-medium"
                      placeholder="0"
                    />
                  </div>
                  <p className="text-[11px] text-text-secondary">Optional starting fund</p>
                </div>
              </div>

              {/* Info Note */}
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-surface border border-border text-xs text-text-secondary">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  Employee contributes 12% of Basic + DA. From employer&apos;s 12% matching share, 3.67% goes to EPF and 8.33% goes to EPS (pension).
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-surface-raised to-surface overflow-hidden shadow-md">
            <CardHeader className="pb-2">
              <span className="text-xs uppercase font-bold tracking-wider text-primary">
                Accumulated Retirement Corpus ({result.totalYears} Years)
              </span>
              <CardTitle className="text-3xl sm:text-4xl font-black tracking-tight text-text mt-1">
                {formatCurrency(result.maturityCorpus)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              {/* Progress visual bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-text-secondary">
                  <span>Contributions ({depositPercent}%)</span>
                  <span>Interest Gain ({interestPercent}%)</span>
                </div>
                <div className="h-3 w-full bg-border/60 rounded-full overflow-hidden flex">
                  <div
                    className="bg-primary transition-all duration-300"
                    style={{ width: `${depositPercent}%` }}
                    title={`Total Contributed: ${formatCurrency(result.totalContribution)}`}
                  />
                  <div
                    className="bg-accent transition-all duration-300"
                    style={{ width: `${interestPercent}%` }}
                    title={`Interest Earned: ${formatCurrency(result.totalInterestEarned)}`}
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-surface border border-border">
                  <p className="text-xs text-text-secondary mb-1">Employee Share (12%)</p>
                  <p className="text-base font-bold text-text">{formatCurrency(result.totalEmployeeContribution)}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-surface border border-border">
                  <p className="text-xs text-text-secondary mb-1">Employer EPF (3.67%)</p>
                  <p className="text-base font-bold text-text">{formatCurrency(result.totalEmployerContribution)}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-surface border border-border">
                  <p className="text-xs text-text-secondary mb-1">Total Principal Deposited</p>
                  <p className="text-base font-bold text-text">{formatCurrency(result.totalContribution)}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-accent/10 border border-accent/20">
                  <p className="text-xs text-accent font-medium mb-1">Total Interest Earned</p>
                  <p className="text-base font-bold text-accent">{formatCurrency(result.totalInterestEarned)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
