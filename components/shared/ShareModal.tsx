"use client";

import React, { useState } from "react";
import {
  Share2,
  MessageCircle,
  Send,
  Twitter,
  Linkedin,
  Mail,
  Copy,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui";

interface ShareModalProps {
  title: string;
  summaryText: string;
  className?: string;
  variant?: "outline" | "secondary" | "ghost" | "primary";
}

export function ShareButton({
  title,
  summaryText,
  className,
  variant = "outline",
}: ShareModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const LIVE_BASE_URL = "https://pockettools-seven.vercel.app";

  const getShareUrl = () => {
    if (typeof window === "undefined") return LIVE_BASE_URL;
    const pathname = window.location.pathname;
    const search = window.location.search;
    return `${LIVE_BASE_URL}${pathname}${search}`;
  };

  const getFullShareText = () => {
    const url = getShareUrl();
    if (summaryText.includes("{{URL}}")) {
      return summaryText.replace(/\{\{URL\}\}/g, url);
    }
    if (summaryText.includes("[URL]")) {
      return summaryText.replace(/\[URL\]/g, url);
    }
    return `${title}\n\n${summaryText}\n\nCalculate here:\n${url}`;
  };

  const handleCopyLinkOnly = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {}
  };

  const handleCopyFullSummary = async () => {
    try {
      await navigator.clipboard.writeText(getFullShareText());
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch {}
  };

  const handleWhatsApp = () => {
    const text = getFullShareText();
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleTelegram = () => {
    const text = getFullShareText();
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(getShareUrl())}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, "_blank", "noopener,noreferrer");
  };

  const handleTwitter = () => {
    const url = getShareUrl();
    const text = `${title} — Check it out on @PocketTools:\n${url}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  const handleLinkedIn = () => {
    const url = getShareUrl();
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedinUrl, "_blank", "noopener,noreferrer");
  };

  const handleEmail = () => {
    const url = getShareUrl();
    const subject = encodeURIComponent(`Pocket Tools Calculation: ${title}`);
    const body = encodeURIComponent(`${title}\n\n${summaryText}\n\nView calculation online at: ${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: summaryText,
          url: getShareUrl(),
        });
      } catch {
        // Cancelled
      }
    } else {
      handleCopyFullSummary();
    }
  };

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size="sm"
        onClick={() => setIsOpen(true)}
        className={`gap-1.5 text-xs ${className || ""}`}
        title="Share Calculation to Any Platform"
        aria-label="Share Calculation to Any Platform"
      >
        <Share2 className="w-3.5 h-3.5 text-primary" />
        <span>Share</span>
      </Button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg p-6 bg-surface border border-border rounded-card shadow-2xl space-y-5 animate-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-btn bg-primary-light text-primary flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-text">Share Calculation</h3>
                  <p className="text-xs text-text-secondary">Send to any chat, social platform, or copy link</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-text-muted hover:text-text rounded-btn hover:bg-surface-secondary transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Summary Preview Box */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                Formatted Message Preview
              </span>
              <div className="p-3.5 bg-surface-secondary/80 border border-border/70 rounded-btn text-xs text-text-secondary font-sans whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto select-all">
                {getFullShareText()}
              </div>
            </div>

            {/* Social Share Grid */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                Choose Platform
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {/* WhatsApp */}
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="flex items-center gap-2 p-2.5 rounded-btn bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] dark:text-[#25D366] border border-[#25D366]/30 text-xs font-semibold transition-all hover:scale-[1.02]"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>WhatsApp</span>
                </button>

                {/* Telegram */}
                <button
                  type="button"
                  onClick={handleTelegram}
                  className="flex items-center gap-2 p-2.5 rounded-btn bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] border border-[#0088cc]/30 text-xs font-semibold transition-all hover:scale-[1.02]"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  <span>Telegram</span>
                </button>

                {/* Twitter / X */}
                <button
                  type="button"
                  onClick={handleTwitter}
                  className="flex items-center gap-2 p-2.5 rounded-btn bg-neutral-900/10 hover:bg-neutral-900/20 text-text border border-border text-xs font-semibold transition-all hover:scale-[1.02]"
                >
                  <Twitter className="w-4 h-4 shrink-0" />
                  <span>Twitter / X</span>
                </button>

                {/* LinkedIn */}
                <button
                  type="button"
                  onClick={handleLinkedIn}
                  className="flex items-center gap-2 p-2.5 rounded-btn bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] border border-[#0A66C2]/30 text-xs font-semibold transition-all hover:scale-[1.02]"
                >
                  <Linkedin className="w-4 h-4 shrink-0" />
                  <span>LinkedIn</span>
                </button>

                {/* Email */}
                <button
                  type="button"
                  onClick={handleEmail}
                  className="flex items-center gap-2 p-2.5 rounded-btn bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all hover:scale-[1.02]"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>Email</span>
                </button>

                {/* Native Mobile Share Sheet */}
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="flex items-center gap-2 p-2.5 rounded-btn bg-primary-light hover:bg-primary/20 text-primary border border-primary/30 text-xs font-semibold transition-all hover:scale-[1.02]"
                >
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  <span>More Apps</span>
                </button>
              </div>
            </div>

            {/* Direct Copy Actions */}
            <div className="pt-2 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyLinkOnly}
                className="w-full gap-2 text-xs py-2.5"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link Only</span>
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleCopyFullSummary}
                className="w-full gap-2 text-xs py-2.5"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Full Text & Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Full Summary</span>
                  </>
                )}
              </Button>
            </div>

            <p className="text-[11px] text-text-muted text-center leading-relaxed">
              Anyone opening your shared link will see this calculation pre-filled on their device.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
