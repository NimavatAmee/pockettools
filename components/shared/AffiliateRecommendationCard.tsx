"use client";

import React from "react";
import { AffiliateOffer } from "@/lib/constants/affiliates";
import {
  TrendingUp,
  Landmark,
  ShieldCheck,
  Wallet,
  FileText,
  CreditCard,
  HeartPulse,
  Sparkles,
  Shield,
  Code,
  Clock,
  Coins,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";

const ICON_MAP = {
  TrendingUp,
  Landmark,
  ShieldCheck,
  Wallet,
  FileText,
  CreditCard,
  HeartPulse,
  Sparkles,
  Shield,
  Code,
  Clock,
  Coins,
  RefreshCw,
};

interface AffiliateRecommendationCardProps {
  offer: AffiliateOffer;
}

export function AffiliateRecommendationCard({ offer }: AffiliateRecommendationCardProps) {
  const IconComponent = ICON_MAP[offer.logoIcon] || TrendingUp;

  return (
    <aside
      aria-label="Partner Recommendation"
      className="my-10 relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-surface-raised to-surface p-5 sm:p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Left Info */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-inner">
            <IconComponent className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" />
                {offer.badge}
              </span>
              <span className="text-[11px] text-text-muted">
                Sponsored • {offer.sponsorName}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-text tracking-tight">
              {offer.title}
            </h3>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl">
              {offer.description}
            </p>
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex items-center self-start md:self-center shrink-0">
          <a
            href={offer.href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-all shadow-sm active:scale-95 group"
          >
            <span>{offer.ctaText}</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </aside>
  );
}
