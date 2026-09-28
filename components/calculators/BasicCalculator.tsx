"use client";

import React, { useState, useEffect, useCallback } from "react";
import { evaluateExpression } from "@/lib/calculations/calculator";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui";
import { CopyButton } from "@/components/shared/CommonStates";
import { ShareButton } from "@/components/shared/ShareModal";
import { Delete, History } from "lucide-react";

interface KeypadButton {
  label: string;
  action: () => void;
  variant: "primary" | "secondary" | "outline" | "danger";
  colSpan?: number;
  icon?: React.ComponentType<{ className?: string }>;
}

export function BasicCalculator() {
  const [expression, setExpression] = useState<string>("");
  const [result, setResult] = useState<string>("0");
  const [history, setHistory] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleInput = useCallback((char: string) => {
    setError(null);
    setExpression((prev) => {
      // Prevent consecutive duplicate operators
      const lastChar = prev.slice(-1);
      if (["+", "-", "×", "÷", "%"].includes(lastChar) && ["+", "×", "÷", "%"].includes(char)) {
        return prev.slice(0, -1) + char;
      }
      return prev + char;
    });
  }, []);

  const handleClear = useCallback(() => {
    setExpression("");
    setResult("0");
    setError(null);
  }, []);

  const handleDelete = useCallback(() => {
    setError(null);
    setExpression((prev) => prev.slice(0, -1));
  }, []);

  const handleCalculate = useCallback(() => {
    if (!expression.trim()) return;

    const evalResult = evaluateExpression(expression);
    if (evalResult.success && evalResult.value !== undefined) {
      const resStr = String(evalResult.value);
      setResult(resStr);
      setHistory((prev) => [`${expression} = ${resStr}`, ...prev].slice(0, 5));
      setError(null);
    } else {
      setError(evalResult.error || "Syntax Error");
    }
  }, [expression]);

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key >= "0" && e.key <= "9") {
        handleInput(e.key);
      } else if (e.key === "+") {
        handleInput("+");
      } else if (e.key === "-") {
        handleInput("−");
      } else if (e.key === "*") {
        handleInput("×");
      } else if (e.key === "/") {
        e.preventDefault();
        handleInput("÷");
      } else if (e.key === "%") {
        handleInput("%");
      } else if (e.key === ".") {
        handleInput(".");
      } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        handleCalculate();
      } else if (e.key === "Backspace") {
        handleDelete();
      } else if (e.key === "Escape") {
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleInput, handleCalculate, handleDelete, handleClear]);

  const KEYPAD: KeypadButton[][] = [
    [
      { label: "C", action: handleClear, variant: "danger" as const },
      { label: "⌫", action: handleDelete, variant: "secondary" as const, icon: Delete },
      { label: "%", action: () => handleInput("%"), variant: "secondary" as const },
      { label: "÷", action: () => handleInput("÷"), variant: "primary" as const },
    ],
    [
      { label: "7", action: () => handleInput("7"), variant: "outline" as const },
      { label: "8", action: () => handleInput("8"), variant: "outline" as const },
      { label: "9", action: () => handleInput("9"), variant: "outline" as const },
      { label: "×", action: () => handleInput("×"), variant: "primary" as const },
    ],
    [
      { label: "4", action: () => handleInput("4"), variant: "outline" as const },
      { label: "5", action: () => handleInput("5"), variant: "outline" as const },
      { label: "6", action: () => handleInput("6"), variant: "outline" as const },
      { label: "−", action: () => handleInput("−"), variant: "primary" as const },
    ],
    [
      { label: "1", action: () => handleInput("1"), variant: "outline" as const },
      { label: "2", action: () => handleInput("2"), variant: "outline" as const },
      { label: "3", action: () => handleInput("3"), variant: "outline" as const },
      { label: "+", action: () => handleInput("+"), variant: "primary" as const },
    ],
    [
      { label: "0", action: () => handleInput("0"), variant: "outline" as const, colSpan: 2 },
      { label: ".", action: () => handleInput("."), variant: "outline" as const },
      { label: "=", action: handleCalculate, variant: "primary" as const },
    ],
  ];

  const copySummaryText = `Your Arithmetic Calculation Result

Pocket Tools Standard Calculator

Expression: ${expression || "0"}
Calculated Answer: ${result}

Want to do fast everyday math calculations?

Open Calculator:
[URL]

Fast, keyboard-friendly online arithmetic calculator with instant results and memory history.`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-4xl mx-auto">
      {/* Calculator Body */}
      <Card className="lg:col-span-7 border-border shadow-md">
        <CardHeader className="border-b border-border pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">Standard Calculator</CardTitle>
          <div className="flex items-center gap-2">
            <ShareButton title="Math Calculator Result" summaryText={copySummaryText} />
            <CopyButton value={result} label="Copy Result" />
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          {/* LCD Display */}
          <div className="p-4 rounded-card bg-surface-secondary border border-border flex flex-col justify-end items-end min-h-[96px] overflow-hidden">
            <div className="text-xs sm:text-sm font-mono text-text-secondary h-6 truncate max-w-full">
              {expression || "0"}
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-text tracking-tight truncate max-w-full">
              {error ? (
                <span className="text-rose-500 text-lg font-sans font-medium">{error}</span>
              ) : (
                result
              )}
            </div>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-4 gap-2.5 pt-2">
            {KEYPAD.map((row, rIdx) =>
              row.map((btn, bIdx) => (
                <button
                  key={`${rIdx}-${bIdx}`}
                  type="button"
                  onClick={btn.action}
                  className={`h-14 sm:h-16 text-lg sm:text-xl font-medium rounded-btn transition-all active:scale-95 flex items-center justify-center select-none shadow-sm ${
                    btn.colSpan === 2 ? "col-span-2" : ""
                  } ${
                    btn.variant === "primary"
                      ? "bg-primary text-white hover:bg-primary-hover font-semibold"
                      : btn.variant === "danger"
                      ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 font-semibold"
                      : btn.variant === "secondary"
                      ? "bg-surface-secondary text-text hover:bg-border/60"
                      : "bg-surface text-text border border-border hover:bg-surface-secondary"
                  }`}
                >
                  {btn.icon ? <btn.icon className="w-5 h-5" /> : btn.label}
                </button>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* History & Tips Column */}
      <div className="lg:col-span-5 space-y-6">
        <Card className="border-border">
          <CardHeader className="border-b border-border pb-3 flex flex-row items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            <CardTitle className="text-base font-semibold">Session History</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2">
            {history.length === 0 ? (
              <p className="text-xs text-text-muted py-6 text-center">No calculations performed yet.</p>
            ) : (
              <div className="space-y-2">
                {history.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-btn bg-surface-secondary/60 text-xs font-mono text-text flex items-center justify-between"
                  >
                    <span>{item}</span>
                    <CopyButton value={item.split(" = ")[1] || ""} label="Copy" variant="ghost" />
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setHistory([])}
                  className="w-full text-xs text-text-muted hover:text-text mt-2"
                >
                  Clear History
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-surface-secondary/30">
          <CardContent className="pt-4 text-xs text-text-secondary space-y-2">
            <h4 className="font-semibold text-text uppercase tracking-wider text-[10px]">Keyboard Shortcuts</h4>
            <ul className="space-y-1">
              <li>• Numbers 0–9, decimals (.)</li>
              <li>• +, -, *, /, % for operators</li>
              <li>• Enter or = to evaluate</li>
              <li>• Backspace to delete, Esc to clear</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
