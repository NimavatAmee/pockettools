"use client";

import React, { useState } from "react";
import { formatJson } from "@/lib/calculations/json-formatter";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { CopyButton } from "@/components/shared/CommonStates";
import { ShareButton } from "@/components/shared/ShareModal";
import { Trash2, Sparkles, Minimize2, CheckCircle2, AlertCircle } from "lucide-react";

const SAMPLE_JSON = `{
  "app": "Pocket Tools",
  "version": 1.0,
  "clientSide": true,
  "features": ["Finance", "Math", "Health", "Date & Time", "Converters", "Developer Tools"],
  "meta": {
    "speed": "instant",
    "privacy": "100% offline-ready"
  }
}`;

export function JsonFormatter() {
  const [inputJson, setInputJson] = useState<string>(SAMPLE_JSON);
  const [indentSize, setIndentSize] = useState<number>(2);

  const result = formatJson(inputJson, indentSize);

  const handleFormat = () => {
    if (result.success && result.formattedJson) {
      setInputJson(result.formattedJson);
    }
  };

  const handleMinify = () => {
    if (result.success && result.minifiedJson) {
      setInputJson(result.minifiedJson);
    }
  };

  const handleClear = () => {
    setInputJson("");
  };

  const handleLoadSample = () => {
    setInputJson(SAMPLE_JSON);
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-card border border-border bg-surface">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" size="sm" onClick={handleFormat} className="gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Beautify / Format</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleMinify} className="gap-1.5">
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Minify (1 Line)</span>
          </Button>

          {/* Indent Selector */}
          <div className="flex items-center gap-1.5 ml-2 text-xs text-text-secondary">
            <span>Indent:</span>
            {[2, 4].map((spaces) => (
              <button
                key={spaces}
                type="button"
                onClick={() => setIndentSize(spaces)}
                className={`px-2 py-1 rounded text-xs font-semibold border ${
                  indentSize === spaces
                    ? "bg-primary-light text-primary border-primary"
                    : "bg-surface text-text border-border"
                }`}
              >
                {spaces} spaces
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ShareButton
            title="JSON Formatter & Validator"
            summaryText={`Your JSON Document Status

JSON Formatter & Validator

Document Status: ${result.success ? "Valid JSON (RFC 8259)" : "Syntax Error Detected"}
Document Size: ${result.stats?.sizeBytes ?? 0} bytes
Total Lines: ${result.stats?.linesCount ?? 0}
Total Keys: ${result.stats?.keysCount ?? 0}

Want to format, beautify, or validate your JSON documents?

Format your JSON:
[URL]

100% private, browser-based JSON formatter, validator, and minifier with instant error detection.`}
          />
          <Button variant="ghost" size="sm" onClick={handleLoadSample} className="text-xs">
            Load Sample
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs text-rose-500 hover:text-rose-600 gap-1">
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </Button>
          <CopyButton value={inputJson} label="Copy JSON" variant="secondary" />
        </div>
      </div>

      {/* Editor & Diagnostic Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Area */}
        <Card className="lg:col-span-8 border-border p-0 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-border bg-surface-secondary/50 flex items-center justify-between text-xs text-text-secondary">
            <span className="font-semibold text-text font-mono">JSON Document</span>
            <div className="flex items-center gap-2">
              {result.success ? (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Valid JSON
                </span>
              ) : (
                <span className="flex items-center gap-1 text-rose-500 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> Syntax Error
                </span>
              )}
            </div>
          </div>

          <textarea
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder="Paste raw JSON here..."
            className="w-full h-[400px] p-4 font-mono text-xs sm:text-sm bg-surface text-text resize-y focus:outline-none focus:ring-0 leading-relaxed"
            spellCheck={false}
          />
        </Card>

        {/* Diagnostics & Stats */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status Diagnostic Card */}
          <Card className={`border ${result.success ? "border-emerald-500/30 bg-emerald-500/5" : "border-rose-500/30 bg-rose-500/5"}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                {result.success ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-700 dark:text-emerald-300">Valid JSON Syntax</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                    <span className="text-rose-700 dark:text-rose-300">Invalid JSON Syntax</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs">
              {result.success ? (
                <p className="text-emerald-800/80 dark:text-emerald-300/80 leading-relaxed">
                  JSON is valid and formatted strictly according to RFC 8259 specs.
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="font-mono text-rose-600 dark:text-rose-400 bg-rose-500/10 p-2.5 rounded-btn break-words">
                    {result.error?.message}
                  </p>
                  {result.error?.line && (
                    <p className="text-text-secondary">
                      Near Line <strong>{result.error.line}</strong>, Column <strong>{result.error.column}</strong>
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Card */}
          {result.success && result.stats && (
            <Card className="border-border">
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-sm font-semibold">Document Statistics</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-border/60">
                  <span className="text-text-secondary">Total Size</span>
                  <span className="font-semibold text-text">{result.stats.sizeBytes} bytes</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-border/60">
                  <span className="text-text-secondary">Total Lines</span>
                  <span className="font-semibold text-text">{result.stats.linesCount} lines</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-text-secondary">Total Keys</span>
                  <span className="font-semibold text-text">{result.stats.keysCount} keys</span>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-border bg-surface-secondary/30">
            <CardContent className="pt-4 text-xs text-text-secondary space-y-1.5">
              <span className="font-bold text-text uppercase tracking-wider text-[10px]">Client-Side Guarantee</span>
              <p className="leading-relaxed">
                Your JSON string is processed entirely in local memory and is never transmitted over the network.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
