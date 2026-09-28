"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-btn border border-border bg-surface flex items-center justify-center opacity-60">
        <Moon className="w-4 h-4 text-text-secondary" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="w-10 h-10 p-0 rounded-btn"
      aria-label={`Switch to ${isDark ? "Light" : "Dark"} mode`}
      title={`Current: ${isDark ? "Dark" : "Light"} mode. Click to switch.`}
    >
      {isDark ? (
        <Moon className="w-4 h-4 text-primary transition-transform hover:scale-110" />
      ) : (
        <Sun className="w-4 h-4 text-amber-500 transition-transform hover:scale-110" />
      )}
    </Button>
  );
}
