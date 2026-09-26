"use client";

import React, { useState } from "react";
import {
  UnitCategory,
  UNIT_CATEGORIES,
  convertUnit,
} from "@/lib/calculations/unit-converter";
import { parseSafeNumber } from "@/lib/formatters";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { CopyButton } from "@/components/shared/CommonStates";
import { ArrowLeftRight, RotateCcw } from "lucide-react";

export function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>("length");
  const [fromUnit, setFromUnit] = useState<string>("m");
  const [toUnit, setToUnit] = useState<string>("km");
  const [valueStr, setValueStr] = useState<string>("1000");

  const currentCategory = UNIT_CATEGORIES[category];
  const value = parseSafeNumber(valueStr, 0);

  const result = convertUnit(category, fromUnit, toUnit, value);

  const handleCategoryChange = (newCat: UnitCategory) => {
    setCategory(newCat);
    const catData = UNIT_CATEGORIES[newCat];
    if (newCat === "temperature") {
      setFromUnit("c");
      setToUnit("f");
      setValueStr("0");
    } else {
      setFromUnit(catData.units[0].id);
      setToUnit(catData.units[1]?.id || catData.units[0].id);
      setValueStr("1");
    }
  };

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const handleReset = () => {
    handleCategoryChange(category);
  };

  const copySummaryText = `Unit Conversion:
• Category: ${currentCategory.name}
• ${result.fromValue} ${result.fromUnit} = ${result.toValue} ${result.toUnit}
• Formula: ${result.formula}`;

  return (
    <div className="space-y-6">
      {/* Category Selection Bar */}
      <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
        {Object.values(UNIT_CATEGORIES).map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleCategoryChange(cat.id)}
            className={`px-4 py-2 rounded-btn text-xs font-semibold whitespace-nowrap transition-all border ${
              category === cat.id
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-surface text-text border-border hover:bg-surface-secondary"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 1. Left Card */}
        <Card className="border-border">
          <CardHeader className="border-b border-border pb-4">
            <CardTitle className="text-lg">Convert Units</CardTitle>
            <p className="text-xs text-text-secondary">
              Converting {currentCategory.name.toLowerCase()} units.
            </p>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Value Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Amount to Convert
              </label>
              <Input
                type="number"
                step="any"
                value={valueStr}
                onChange={(e) => setValueStr(e.target.value)}
                placeholder="Enter value"
              />
            </div>

            {/* Units Selection Grid with Swap */}
            <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
              {/* From Unit */}
              <div className="sm:col-span-5 space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  From Unit
                </label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full h-11 rounded-btn border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {currentCategory.units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <div className="sm:col-span-1 flex justify-center pt-5 sm:pt-6">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="w-10 h-10 rounded-full border border-border bg-surface hover:bg-surface-secondary flex items-center justify-center text-primary transition-transform active:rotate-180"
                  title="Swap Units"
                  aria-label="Swap from and to units"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>

              {/* To Unit */}
              <div className="sm:col-span-5 space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  To Unit
                </label>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full h-11 rounded-btn border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {currentCategory.units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-border">
              <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </Button>
              <div className="text-xs text-text-muted">Pure client calculation</div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Right Card */}
        <Card className="border-border bg-surface/80 flex flex-col justify-between">
          <div>
            <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Converted Result</CardTitle>
                <p className="text-xs text-text-secondary">Instant conversion output & unit details</p>
              </div>
              <CopyButton value={copySummaryText} label="Copy" />
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {/* Converted Output Hero */}
              <div className="p-5 rounded-card bg-primary-light border border-primary/20 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {result.fromValue} {result.fromUnit} equals
                </span>
                <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-primary break-all">
                  {result.toValue} <span className="text-xl sm:text-2xl font-semibold">{result.toUnit}</span>
                </div>
              </div>

              {/* Conversion Formula */}
              <div className="space-y-2.5 pt-2 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-border/60">
                  <span className="text-text-secondary">Conversion Formula</span>
                  <span className="font-mono text-xs font-semibold text-text">{result.formula}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-border/60">
                  <span className="text-text-secondary">Measurement Category</span>
                  <span className="font-semibold text-text">{currentCategory.name}</span>
                </div>
              </div>
            </CardContent>
          </div>

          <div className="p-4 border-t border-border bg-surface-secondary/30 rounded-b-card text-xs text-text-secondary">
            <span>High-precision mathematical conversion with zero server latency.</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
