import React from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/constants/tools";
import { Layers } from "lucide-react";
import { InstallPwaButton } from "@/components/shared/InstallPwaButton";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="mt-auto border-t border-border bg-surface text-text-secondary text-sm">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-base text-text">
              <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-white">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <span>Pocket Tools</span>
            </Link>
            <p className="text-xs text-text-secondary leading-relaxed">
              Fast, simple, and free online tools for everyday calculations and utilities. 100% private, browser-based, and ad-free.
            </p>
          </div>

          {/* Categories Col */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-text">Categories</h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 4).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/#${cat.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Tools Col */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-text">Popular Tools</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/calculators/gst" className="hover:text-primary transition-colors">
                  GST Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculators/emi" className="hover:text-primary transition-colors">
                  EMI Calculator
                </Link>
              </li>
              <li>
                <Link href="/health/bmi" className="hover:text-primary transition-colors">
                  BMI Calculator
                </Link>
              </li>
              <li>
                <Link href="/developer-tools/password-generator" className="hover:text-primary transition-colors">
                  Password Generator
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & About Col */}
          <div className="space-y-3">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-text">Company & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Pocket Tools
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <InstallPwaButton variant="footer" />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted gap-4">
          <p>© {currentYear} Pocket Tools. All rights reserved. Calculations execute locally in your browser.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/about" className="hover:underline">
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
