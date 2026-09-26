"use client";

import React, { useState, useEffect } from "react";
import { generateSecurePassword, PasswordOptions } from "@/lib/calculations/password-generator";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { CopyButton } from "@/components/shared/CommonStates";
import { RefreshCw, Shield, ShieldCheck, Key, Check } from "lucide-react";

export function PasswordGenerator() {
  const [length, setLength] = useState<number>(16);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(false);

  const [password, setPassword] = useState<string>("");
  const [strength, setStrength] = useState<string>("Strong");
  const [score, setScore] = useState<number>(3);
  const [entropy, setEntropy] = useState<number>(96);

  const handleGenerate = () => {
    const res = generateSecurePassword({
      length,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
      excludeAmbiguous,
    });
    setPassword(res.password);
    setStrength(res.strength);
    setScore(res.score);
    setEntropy(res.entropyBits);
  };

  useEffect(() => {
    handleGenerate();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeAmbiguous]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* 1. Generator Main Card */}
      <Card className="lg:col-span-8 border-border">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="text-lg">Generated Secure Password</CardTitle>
          <p className="text-xs text-text-secondary">
            Generated locally using browser Web Crypto API (CSPRNG). Never persisted or transmitted.
          </p>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Output Display Card */}
          <div className="p-4 sm:p-5 rounded-card bg-surface-secondary border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="font-mono text-base sm:text-xl font-bold text-text break-all select-all tracking-wide text-center sm:text-left">
              {password || "Select at least 1 character set"}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                className="w-10 h-10 p-0 rounded-btn"
                title="Regenerate Password"
                aria-label="Regenerate Password"
              >
                <RefreshCw className="w-4 h-4 text-primary" />
              </Button>
              <CopyButton value={password} label="Copy Password" variant="primary" />
            </div>
          </div>

          {/* Strength Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-text-secondary">Password Security Rating:</span>
              <span className="font-bold text-primary">{strength} (~{entropy} bits entropy)</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 h-2">
              {[1, 2, 3, 4].map((barIdx) => (
                <div
                  key={barIdx}
                  className={`h-full rounded-full transition-all duration-300 ${
                    score >= barIdx
                      ? score === 1
                        ? "bg-rose-500"
                        : score === 2
                        ? "bg-amber-500"
                        : score === 3
                        ? "bg-primary"
                        : "bg-emerald-500"
                      : "bg-surface-secondary"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Length Slider & Direct Input */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Password Length
              </label>
              <span className="text-base font-bold font-mono text-primary px-3 py-1 bg-primary-light rounded-btn">
                {length} chars
              </span>
            </div>
            <input
              type="range"
              min="6"
              max="64"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value, 10))}
              className="w-full accent-primary h-2 bg-surface-secondary rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-text-muted">
              <span>6 min</span>
              <span>16 recommended</span>
              <span>64 max</span>
            </div>
          </div>

          {/* Character Options */}
          <div className="space-y-3 pt-2 border-t border-border">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary block">
              Included Character Types
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-3 p-3 rounded-btn border border-border bg-surface hover:bg-surface-secondary cursor-pointer transition-colors select-none">
                <input
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-border cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-semibold text-text block">Uppercase (A-Z)</span>
                  <span className="text-text-muted text-[11px]">ABC...XYZ</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-btn border border-border bg-surface hover:bg-surface-secondary cursor-pointer transition-colors select-none">
                <input
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={(e) => setIncludeLowercase(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-border cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-semibold text-text block">Lowercase (a-z)</span>
                  <span className="text-text-muted text-[11px]">abc...xyz</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-btn border border-border bg-surface hover:bg-surface-secondary cursor-pointer transition-colors select-none">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-border cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-semibold text-text block">Numbers (0-9)</span>
                  <span className="text-text-muted text-[11px]">0123456789</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-btn border border-border bg-surface hover:bg-surface-secondary cursor-pointer transition-colors select-none">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-border cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-semibold text-text block">Symbols (!@#$%)</span>
                  <span className="text-text-muted text-[11px]">!@#$%^&*()...</span>
                </div>
              </label>
            </div>

            <label className="flex items-center gap-3 p-3 rounded-btn border border-border/70 bg-surface/50 hover:bg-surface-secondary cursor-pointer transition-colors select-none mt-2">
              <input
                type="checkbox"
                checked={excludeAmbiguous}
                onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-border cursor-pointer"
              />
              <div className="text-xs">
                <span className="font-semibold text-text">Exclude Ambiguous Characters</span>
                <span className="text-text-muted text-[11px] block">Avoid lookalike letters like 0, O, 1, l, I</span>
              </div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* 2. Security Sidebar Card */}
      <div className="lg:col-span-4 space-y-6">
        <Card className="border-border bg-surface">
          <CardHeader className="pb-3 border-b border-border flex flex-row items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm font-semibold">Security Best Practices</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs text-text-secondary leading-relaxed">
            <div className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>Use at least 16 characters for high security.</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>Use a unique password for each online account.</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span>Never send passwords over unencrypted channels.</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-surface-secondary/30">
          <CardContent className="pt-4 text-xs text-text-secondary space-y-2">
            <span className="font-bold text-text uppercase tracking-wider text-[10px]">Zero Storage Policy</span>
            <p className="leading-relaxed">
              Passwords generated here are never logged, stored in cookies/localStorage, or sent to any server. When you leave this page, the password vanishes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
