"use client";

import React, { useEffect, useState } from "react";
import { Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function InstallPwaButton({
  variant = "navbar",
  className = "",
}: {
  variant?: "navbar" | "menu" | "footer";
  className?: string;
}) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
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
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instruction for browser
      const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIos) {
        alert("To install Pocket Tools on iPhone/iPad:\n1. Tap the Share icon (box with up arrow) in Safari.\n2. Tap 'Add to Home Screen'.");
      } else {
        alert("To install Pocket Tools:\n1. Tap the browser menu (⋮) at top-right.\n2. Tap 'Install app' or 'Add to Home screen'.");
      }
    }
  };

  if (isInstalled) {
    return null;
  }

  // Footer Link Style
  if (variant === "footer") {
    return (
      <button
        onClick={handleInstallClick}
        className={`flex items-center gap-1.5 text-xs text-primary hover:underline font-medium ${className}`}
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App (PWA)</span>
      </button>
    );
  }

  // Mobile Menu Drawer Style
  if (variant === "menu") {
    return (
      <button
        onClick={handleInstallClick}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-btn text-sm font-medium text-primary hover:bg-primary/10 transition-colors ${className}`}
      >
        <span className="flex items-center gap-2">
          <Smartphone className="w-4 h-4" />
          Install Mobile App
        </span>
        <Download className="w-4 h-4" />
      </button>
    );
  }

  // Navbar Header Style (Right next to Dark/Light theme toggle)
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleInstallClick}
      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-btn border-primary/40 text-primary hover:bg-primary/10 transition-all ${className}`}
      title="Install Pocket Tools App"
      aria-label="Install App"
    >
      <Download className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">Install</span>
    </Button>
  );
}
