"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Menu, X, Layers } from "lucide-react";
import { Button, cn } from "@/components/ui";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "All Tools", href: "/calculators" },
  { name: "Categories", href: "/#categories" },
  { name: "About", href: "/about" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/90 backdrop-blur-md">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-lg text-text tracking-tight group"
        >
          <div className="w-8 h-8 rounded-btn bg-primary flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Layers className="w-4 h-4" />
          </div>
          <span className="bg-gradient-to-r from-text to-text-secondary bg-clip-text text-transparent">
            Pocket Tools
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-primary",
                  isActive ? "text-primary font-semibold" : "text-text-secondary"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Theme Toggle & Mobile Menu */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 p-0 rounded-btn"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-btn text-sm font-medium text-text hover:bg-surface-secondary hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-text-secondary px-3">
            <span>Theme Control</span>
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
