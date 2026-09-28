"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  POPULAR_CURRENCIES,
  DEFAULT_USD_RATES,
  convertCurrency,
  CurrencyInfo,
} from "@/lib/calculations/currency";
import { useShareableUrl } from "@/hooks/useShareableUrl";
import { formatNumber, parseSafeNumber } from "@/lib/formatters";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { CopyButton } from "@/components/shared/CommonStates";
import { ShareButton } from "@/components/shared/ShareModal";
import { ArrowLeftRight, RotateCcw, RefreshCw, Globe, Check } from "lucide-react";

export function CurrencyConverter() {
  const { getInitialParam } = useShareableUrl({});

  const [amountStr, setAmountStr] = useState<string>(() =>
    getInitialParam("amount", "100")
  );
  const [fromCode, setFromCode] = useState<string>(() =>
    getInitialParam("from", "USD")
  );
  const [toCode, setToCode] = useState<string>(() =>
    getInitialParam("to", "INR")
  );

  const [rates, setRates] = useState<Record<string, number>>(DEFAULT_USD_RATES);
  const [lastUpdated, setLastUpdated] = useState<string>("Cached Baseline");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync state to URL params live
  useShareableUrl(
    useMemo(
      () => ({
        amount: amountStr,
        from: fromCode,
        to: toCode,
      }),
      [amountStr, fromCode, toCode]
    )
  );

  // Fetch live exchange rates on mount with localStorage caching
  useEffect(() => {
    const fetchRates = async () => {
      const cacheKey = "pocket_tools_forex_rates";
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          // 6 hours cache validity
          if (Date.now() - parsed.timestamp < 6 * 60 * 60 * 1000) {
            setRates(parsed.rates);
            setLastUpdated(parsed.date || "Today");
            return;
          }
        } catch {}
      }

      setIsLoading(true);
      try {
        // Free, open public exchange rate API
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        if (res.ok) {
          const data = await res.json();
          if (data.rates) {
            setRates(data.rates);
            setLastUpdated(data.time_last_update_utc?.slice(0, 16) || "Live");
            localStorage.setItem(
              cacheKey,
              JSON.stringify({
                rates: data.rates,
                date: data.time_last_update_utc?.slice(0, 16) || "Live",
                timestamp: Date.now(),
              })
            );
          }
        }
      } catch {
        // Use cached / default
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
  }, []);

  const amount = parseSafeNumber(amountStr, 100);
  const result = convertCurrency(amount, fromCode, toCode, rates, lastUpdated);

  const handleSwap = () => {
    const temp = fromCode;
    setFromCode(toCode);
    setToCode(temp);
  };

  const handleReset = () => {
    setAmountStr("100");
    setFromCode("USD");
    setToCode("INR");
  };

  const copySummaryText = `Your Currency Conversion Result

Real-Time Foreign Exchange (Forex) Assessment

Converted: ${result.fromAmount} ${result.fromCurrency.code} (${result.fromCurrency.name})
To: ${formatNumber(result.convertedAmount, 2)} ${result.toCurrency.code} (${result.toCurrency.name})

Exchange Rate: 1 ${result.fromCurrency.code} = ${result.exchangeRate} ${result.toCurrency.code}
Inverse Rate: 1 ${result.toCurrency.code} = ${result.inverseRate} ${result.fromCurrency.code}

Want to convert live world currencies?

Convert Currencies:
[URL]

Convert 160+ world currencies instantly with live exchange rates, country flags, and offline support.`;

  return (
    <div className="space-y-8">
      {/* 1. Main Converter Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Card: Inputs */}
        <Card className="border-border">
          <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Convert Currencies</CardTitle>
              <p className="text-xs text-text-secondary">Enter amount and choose from 160+ global currencies.</p>
            </div>
            {isLoading && <span className="text-[11px] text-primary animate-pulse font-medium">Fetching rates...</span>}
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Amount */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Amount to Convert
              </label>
              <Input
                type="number"
                min="0"
                step="any"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                placeholder="Enter amount"
              />
            </div>

            {/* Currency Selectors with Swap */}
            <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
              {/* From Currency */}
              <div className="sm:col-span-5 space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  From Currency
                </label>
                <select
                  value={fromCode}
                  onChange={(e) => setFromCode(e.target.value)}
                  className="w-full h-11 rounded-btn border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                >
                  {POPULAR_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} — {c.name} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <div className="sm:col-span-1 flex justify-center pt-4 sm:pt-6">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="w-10 h-10 rounded-full border border-border bg-surface hover:bg-surface-secondary flex items-center justify-center text-primary transition-transform active:rotate-180"
                  title="Swap Currencies"
                  aria-label="Swap Currencies"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>

              {/* To Currency */}
              <div className="sm:col-span-5 space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  To Currency
                </label>
                <select
                  value={toCode}
                  onChange={(e) => setToCode(e.target.value)}
                  className="w-full h-11 rounded-btn border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                >
                  {POPULAR_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} — {c.name} ({c.symbol})
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
              <div className="text-xs text-text-muted">Rate updated: {lastUpdated}</div>
            </div>
          </CardContent>
        </Card>

        {/* Right Card: Result */}
        <Card className="border-border bg-surface/80 flex flex-col justify-between">
          <div>
            <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Exchange Output</CardTitle>
                <p className="text-xs text-text-secondary">Live exchange calculation</p>
              </div>
              <div className="flex items-center gap-2">
                <ShareButton title="Currency Conversion Result" summaryText={copySummaryText} />
                <CopyButton value={copySummaryText} label="Copy" />
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {/* Hero Converted Value */}
              <div className="p-5 rounded-card bg-primary-light border border-primary/20 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {result.fromAmount} {result.fromCurrency.flag} {result.fromCurrency.code} equals
                </span>
                <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-primary break-all">
                  {result.toCurrency.symbol} {formatNumber(result.convertedAmount, 2)}{" "}
                  <span className="text-xl sm:text-2xl font-semibold">{result.toCurrency.code}</span>
                </div>
              </div>

              {/* Exchange Details */}
              <div className="space-y-2.5 pt-2 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-border/60">
                  <span className="text-text-secondary">Direct Exchange Rate</span>
                  <span className="font-semibold text-text font-mono">
                    1 {result.fromCurrency.code} = {result.exchangeRate} {result.toCurrency.code}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-border/60">
                  <span className="text-text-secondary">Inverse Exchange Rate</span>
                  <span className="font-semibold text-text font-mono">
                    1 {result.toCurrency.code} = {result.inverseRate} {result.fromCurrency.code}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-border/60">
                  <span className="text-text-secondary">Offline Cache Fallback</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Enabled
                  </span>
                </div>
              </div>
            </CardContent>
          </div>

          <div className="p-4 border-t border-border bg-surface-secondary/30 rounded-b-card text-xs text-text-secondary flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary shrink-0" />
            <span>Indicative market exchange rates for personal and travel calculations.</span>
          </div>
        </Card>
      </div>

      {/* 2. Popular Currencies Quick Comparison Grid */}
      <Card className="border-border">
        <CardHeader className="border-b border-border pb-3">
          <CardTitle className="text-base font-semibold">
            Quick Conversion Grid against {result.fromCurrency.flag} {result.fromCurrency.code}
          </CardTitle>
          <p className="text-xs text-text-secondary">Live benchmark rates for popular world currencies</p>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {["INR", "USD", "EUR", "GBP", "AED", "CAD"]
              .filter((c) => c !== fromCode)
              .slice(0, 6)
              .map((targetCode) => {
                const conv = convertCurrency(amount, fromCode, targetCode, rates, lastUpdated);
                return (
                  <button
                    key={targetCode}
                    type="button"
                    onClick={() => setToCode(targetCode)}
                    className="p-3 rounded-btn border border-border bg-surface hover:bg-surface-secondary text-left transition-all hover:scale-[1.02]"
                  >
                    <span className="text-xs text-text-muted block">
                      {conv.toCurrency.flag} {targetCode}
                    </span>
                    <span className="text-base font-bold text-text mt-0.5 block font-mono">
                      {conv.toCurrency.symbol} {formatNumber(conv.convertedAmount, 2)}
                    </span>
                  </button>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
