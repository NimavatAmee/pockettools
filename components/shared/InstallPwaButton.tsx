"use client";

import React, { useEffect, useState } from "react";
import { Download, Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function InstallPwaButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Automatically show banner if not installed
      setShowBanner(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("To install Pocket Tools:\n\n1. Tap the Chrome 3-dots (⋮) menu at top-right.\n2. Tap 'Add to Home screen' or 'Install App'.");
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* Navbar Button */}
      <Button
        variant="primary"
        size="sm"
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-1.5 shadow-sm bg-primary hover:bg-primary/90 text-white"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </Button>

      {/* Floating Bottom Banner for Mobile */}
      {showBanner && (
        <div className="fixed bottom-4 left-4 right-4 z-50 p-3.5 bg-surface-raised border border-primary/40 rounded-2xl shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-sm">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-text">Install Pocket Tools App</p>
              <p className="text-[11px] text-text-secondary">Fast & works offline</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleInstallClick}
              className="text-xs font-bold px-3 py-1.5 h-8 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-sm"
            >
              Install
            </Button>
            <button
              onClick={() => setShowBanner(false)}
              className="p-1.5 text-text-secondary hover:text-text rounded-lg"
              aria-label="Close install banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
