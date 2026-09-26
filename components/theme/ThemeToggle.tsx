"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
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

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={cycleTheme}
      className="w-10 h-10 p-0 rounded-btn"
      aria-label={`Current theme: ${theme}. Click to switch theme.`}
      title={`Theme: ${theme}`}
    >
      {theme === "light" && <Sun className="w-4 h-4 text-amber-500 transition-transform" />}
      {theme === "dark" && <Moon className="w-4 h-4 text-primary transition-transform" />}
      {theme === "system" && <Monitor className="w-4 h-4 text-text-secondary transition-transform" />}
    </Button>
  );
}
