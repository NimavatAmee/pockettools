"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui";

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
  variant?: "outline" | "secondary" | "ghost" | "primary";
}

export function CopyButton({
  value,
  label = "Copy",
  className,
  variant = "outline",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      onClick={handleCopy}
      className={className}
      aria-label={`Copy ${label}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-500" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>{label}</span>
        </>
      )}
    </Button>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 rounded-card border border-dashed border-border bg-surface/50">
      <h4 className="text-base font-medium text-text">{title}</h4>
      <p className="mt-1 text-sm text-text-secondary max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="p-4 rounded-btn border border-rose-500/20 bg-rose-500/5 text-rose-600 dark:text-rose-400">
      <h4 className="font-semibold text-sm">{title}</h4>
      {message && <p className="mt-1 text-xs opacity-90">{message}</p>}
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry} className="mt-3">
          Try Again
        </Button>
      )}
    </div>
  );
}
