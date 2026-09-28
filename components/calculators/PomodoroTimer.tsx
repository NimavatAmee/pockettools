"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  PomodoroMode,
  PomodoroSettings,
  DEFAULT_POMODORO_SETTINGS,
  formatTimeRemaining,
  getDurationForMode,
  getNextMode,
  getTabTitle,
} from "@/lib/calculations/pomodoro";
import { soundEffects } from "@/lib/audio/soundEffects";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { ShareButton } from "@/components/shared/ShareModal";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SlidersHorizontal,
  X,
  Volume2,
  VolumeX,
  Bell,
  CheckCircle2,
  Flame,
  Brain,
  Coffee,
  Palmtree,
  Hourglass,
  CircleDot,
  Sparkles,
} from "lucide-react";

export function PomodoroTimer() {
  const [mode, setMode] = useState<PomodoroMode>("focus");
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_POMODORO_SETTINGS);
  const [timeLeft, setTimeLeft] = useState<number>(() =>
    getDurationForMode("focus", DEFAULT_POMODORO_SETTINGS)
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [dailyCount, setDailyCount] = useState<number>(0);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [notificationGranted, setNotificationGranted] = useState<boolean>(false);
  const [visualMode, setVisualMode] = useState<"hourglass" | "ring">("hourglass");

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const endTimeRef = useRef<number | null>(null);
  const settingsRef = useRef<HTMLDivElement | null>(null);

  // 1. Load settings & daily stats from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check Notification permission
    if ("Notification" in window) {
      setNotificationGranted(Notification.permission === "granted");
    }

    // Load daily stats
    const todayStr = new Date().toISOString().split("T")[0];
    const savedStats = localStorage.getItem("pocket_tools_pomodoro_stats");
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        if (parsed.date === todayStr) {
          setDailyCount(parsed.count || 0);
        }
      } catch {}
    }

    // Load settings
    const savedSettings = localStorage.getItem("pocket_tools_pomodoro_settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_POMODORO_SETTINGS, ...parsed });
        setTimeLeft(getDurationForMode("focus", { ...DEFAULT_POMODORO_SETTINGS, ...parsed }));
      } catch {}
    }
  }, []);

  // Save settings whenever modified
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("pocket_tools_pomodoro_settings", JSON.stringify(settings));
  }, [settings]);

  // 2. Save daily stats to localStorage
  const incrementDailyCount = useCallback(() => {
    setDailyCount((prev) => {
      const newCount = prev + 1;
      const todayStr = new Date().toISOString().split("T")[0];
      localStorage.setItem(
        "pocket_tools_pomodoro_stats",
        JSON.stringify({ date: todayStr, count: newCount })
      );
      return newCount;
    });
  }, []);

  // 3. Tab Title Effect
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isRunning) {
      document.title = getTabTitle(mode, timeLeft);
    } else {
      document.title = "Pomodoro Focus Timer | Pocket Tools";
    }

    return () => {
      document.title = "Pocket Tools";
    };
  }, [isRunning, timeLeft, mode]);

  // 4. Request Desktop Notification Permission
  const requestNotificationPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const perm = await Notification.requestPermission();
      setNotificationGranted(perm === "granted");
    }
  };

  // 5. Trigger Completion Alerts
  const triggerCompletion = useCallback(() => {
    // Audio Chime (Long tone / Zen bowl)
    if (settings.soundEnabled) {
      soundEffects.playTone(settings.soundTone || "zen_bowl");
    }

    // Desktop Notification
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      const title = mode === "focus" ? "🍅 Pomodoro Completed!" : "⚡ Break Over!";
      const body =
        mode === "focus"
          ? "Great job! Time for a well-deserved short break."
          : "Break is over. Ready to jump back into deep focus?";
      new Notification(title, { body });
    }

    // Transition to next mode
    const { nextMode, newCycleCount } = getNextMode(mode, completedCycles, settings);
    if (mode === "focus") {
      incrementDailyCount();
    }

    setCompletedCycles(newCycleCount);
    setMode(nextMode);
    const nextDuration = getDurationForMode(nextMode, settings);
    setTimeLeft(nextDuration);

    const shouldAutoStart =
      nextMode === "focus" ? settings.autoStartPomodoro : settings.autoStartBreaks;
    setIsRunning(shouldAutoStart);
    if (shouldAutoStart) {
      endTimeRef.current = Date.now() + nextDuration * 1000;
    }
  }, [mode, completedCycles, settings, incrementDailyCount]);

  // 6. Drift-Free Timer Loop
  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    endTimeRef.current = Date.now() + timeLeft * 1000;

    timerRef.current = setInterval(() => {
      if (!endTimeRef.current) return;
      const remainingMs = endTimeRef.current - Date.now();
      const remainingSecs = Math.max(0, Math.ceil(remainingMs / 1000));

      setTimeLeft(remainingSecs);

      if (remainingSecs <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        triggerCompletion();
      }
    }, 250);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, triggerCompletion]);

  // 7. Controls
  const handleTogglePlay = () => {
    soundEffects.playClick();
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    soundEffects.playClick();
    setIsRunning(false);
    setTimeLeft(getDurationForMode(mode, settings));
  };

  const handleSkip = () => {
    soundEffects.playClick();
    setIsRunning(false);
    triggerCompletion();
  };

  const handleModeChange = (newMode: PomodoroMode) => {
    soundEffects.playClick();
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(getDurationForMode(newMode, settings));
  };

  const handleToggleCustomSettings = () => {
    soundEffects.playClick();
    if (!showSettings) {
      setShowSettings(true);
      setTimeout(() => {
        settingsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } else {
      setShowSettings(false);
    }
  };

  // 8. Keyboard Shortcuts (Spacebar, R, S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === "Space") {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === "r" || e.key === "R") {
        handleReset();
      } else if (e.key === "s" || e.key === "S") {
        handleSkip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // Calculate Progress
  const totalDuration = getDurationForMode(mode, settings);
  const progressRatio = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
  const strokeDashoffset = 100 - progressRatio * 100;

  // Sand heights for Hourglass animation (0% to 100%)
  const topSandRemaining = Math.max(0, 1 - progressRatio); // 1 (full) down to 0 (empty)
  const bottomSandAccumulated = Math.min(1, progressRatio); // 0 (empty) up to 1 (full)

  const copySummaryText = `🍅 My Daily Pomodoro Focus Report

Productivity & Flow Session Tracker

Completed Focus Sessions Today: ${dailyCount} Pomodoros (~${dailyCount * settings.focusMinutes} mins focused)
Current Interval: ${mode === "focus" ? "Deep Focus" : mode === "short_break" ? "Short Break" : "Long Break"} (${formatTimeRemaining(timeLeft)} remaining)
Current Cycle: #${(completedCycles % settings.longBreakInterval) + 1} of ${settings.longBreakInterval}

Want to boost your daily focus and eliminate procrastination?

Start your Pomodoro Timer:
[URL]

Scientific time-management timer with animated hourglass, live browser tab countdown, and zen audio chimes.`;

  // Color theme classes based on mode
  const modeAccentColor =
    mode === "focus"
      ? "rose"
      : mode === "short_break"
      ? "emerald"
      : "purple";

  return (
    <div className="max-w-xl mx-auto space-y-8">
      {/* 1. Main Timer Card with Dynamic Ambient Glow */}
      <div className="relative group">
        {/* Ambient Breathing Neon Glow Layer */}
        <div
          className={`absolute -inset-1 rounded-2xl blur-xl opacity-35 transition-all duration-700 pointer-events-none ${
            isRunning
              ? mode === "focus"
                ? "bg-gradient-to-r from-rose-500/50 via-orange-500/40 to-rose-600/50 animate-pulse"
                : mode === "short_break"
                ? "bg-gradient-to-r from-emerald-500/50 via-teal-500/40 to-green-600/50 animate-pulse"
                : "bg-gradient-to-r from-purple-500/50 via-indigo-500/40 to-violet-600/50 animate-pulse"
              : "bg-transparent"
          }`}
        />

        <Card className="relative border-border shadow-2xl overflow-hidden bg-surface/95 backdrop-blur-sm">
          {/* Mode Navigation & Customize Header */}
          <div className="p-3 border-b border-border bg-surface-secondary/40 flex items-center justify-between gap-2">
            <div className="flex p-1 bg-surface rounded-btn border border-border gap-1 text-xs shrink-0">
              <button
                type="button"
                onClick={() => handleModeChange("focus")}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md font-semibold transition-all ${
                  mode === "focus"
                    ? "bg-rose-500 text-white shadow-sm"
                    : "text-text-secondary hover:text-text"
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Focus</span>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange("short_break")}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md font-semibold transition-all ${
                  mode === "short_break"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "text-text-secondary hover:text-text"
                }`}
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>Short Break</span>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange("long_break")}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md font-semibold transition-all ${
                  mode === "long_break"
                    ? "bg-primary text-white shadow-sm"
                    : "text-text-secondary hover:text-text"
                }`}
              >
                <Palmtree className="w-3.5 h-3.5" />
                <span>Long Break</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleCustomSettings}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 h-8 text-xs font-semibold rounded-md border transition-all ${
                  showSettings
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-surface border-border text-text-secondary hover:text-text hover:bg-surface-secondary"
                }`}
                title="Customize Timer Durations & Sound"
                aria-label="Customize Timer Durations & Sound"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Customize</span>
              </Button>
              <ShareButton title="Pomodoro Focus Session" summaryText={copySummaryText} />
            </div>
          </div>

          <CardContent className="pt-6 pb-8 flex flex-col items-center justify-center space-y-6">
            {/* Visualizer Toggle: Hourglass vs Ring */}
            <div className="flex items-center gap-1 p-1 bg-surface-secondary/70 rounded-full border border-border text-[11px]">
              <button
                type="button"
                onClick={() => setVisualMode("hourglass")}
                className={`flex items-center gap-1 px-3 py-1 rounded-full font-medium transition-all ${
                  visualMode === "hourglass"
                    ? "bg-surface text-text shadow-sm font-semibold border border-border"
                    : "text-text-muted hover:text-text"
                }`}
              >
                <Hourglass className="w-3 h-3 text-rose-500" />
                <span>Hourglass Flow</span>
              </button>
              <button
                type="button"
                onClick={() => setVisualMode("ring")}
                className={`flex items-center gap-1 px-3 py-1 rounded-full font-medium transition-all ${
                  visualMode === "ring"
                    ? "bg-surface text-text shadow-sm font-semibold border border-border"
                    : "text-text-muted hover:text-text"
                }`}
              >
                <CircleDot className="w-3 h-3 text-primary" />
                <span>Modern Ring</span>
              </button>
            </div>

            {/* 2A. Hourglass Visualizer */}
            {visualMode === "hourglass" ? (
              <div className="flex flex-col items-center justify-center space-y-4 select-none">
                {/* Large Clear Digital Timer Display & Badge on Top */}
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="font-mono text-5xl sm:text-6xl font-black text-text tracking-tight drop-shadow-sm">
                    {formatTimeRemaining(timeLeft)}
                  </span>
                  
                  <div className="flex items-center gap-3 mt-1.5">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full ${
                        mode === "focus"
                          ? "text-rose-600 bg-rose-500/15"
                          : mode === "short_break"
                          ? "text-emerald-600 bg-emerald-500/15"
                          : "text-purple-600 bg-purple-500/15"
                      }`}
                    >
                      {mode === "focus" ? "Stay Focused" : mode === "short_break" ? "Take a Rest" : "Extended Rest"}
                    </span>

                    {/* Cycle Dots */}
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-secondary border border-border">
                      {[0, 1, 2, 3].map((dotIdx) => {
                        const currentDot = completedCycles % settings.longBreakInterval;
                        return (
                          <span
                            key={dotIdx}
                            className={`w-2 h-2 rounded-full transition-all ${
                              dotIdx < currentDot
                                ? "bg-rose-500 scale-110"
                                : dotIdx === currentDot && mode === "focus"
                                ? "bg-rose-500 animate-pulse"
                                : "bg-surface border border-border"
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Unobstructed High-Clarity SVG Hourglass */}
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
                  <svg className="w-full h-full drop-shadow-md" viewBox="0 0 200 240" fill="none">
                    <defs>
                      {/* Top Bulb Clip */}
                      <clipPath id="topBulbClip">
                        <path d="M 50 32 C 50 78, 88 114, 94 120 L 106 120 C 112 114, 150 78, 150 32 Z" />
                      </clipPath>
                      {/* Bottom Bulb Clip */}
                      <clipPath id="bottomBulbClip">
                        <path d="M 94 120 C 88 126, 50 162, 50 208 L 150 208 C 150 162, 112 126, 106 120 Z" />
                      </clipPath>

                      {/* Sand Gradients */}
                      <linearGradient id="sandGradientRose" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#f43f5e" />
                        <stop offset="50%" stopColor="#fb7185" />
                        <stop offset="100%" stopColor="#e11d48" />
                      </linearGradient>
                      <linearGradient id="sandGradientEmerald" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="50%" stopColor="#34d399" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                      <linearGradient id="sandGradientPurple" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="50%" stopColor="#a78bfa" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </linearGradient>

                      {/* Glass Glow */}
                      <radialGradient id="glassGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Glass Outer Glow */}
                    <rect x="30" y="20" width="140" height="200" rx="40" fill="url(#glassGlow)" className="text-text" />

                    {/* Top Sand (Drains from y=32 downwards to y=120) */}
                    <g clipPath="url(#topBulbClip)">
                      <rect
                        x="40"
                        y={32 + (1 - topSandRemaining) * 88}
                        width="120"
                        height="100"
                        fill={
                          mode === "focus"
                            ? "url(#sandGradientRose)"
                            : mode === "short_break"
                            ? "url(#sandGradientEmerald)"
                            : "url(#sandGradientPurple)"
                        }
                        className="transition-all duration-300 ease-linear"
                      />
                    </g>

                    {/* Flowing Sand Stream (when running) */}
                    {isRunning && topSandRemaining > 0 && (
                      <g>
                        <line
                          x1="100"
                          y1="118"
                          x2="100"
                          y2={208 - bottomSandAccumulated * 76}
                          stroke={mode === "focus" ? "#fb7185" : mode === "short_break" ? "#34d399" : "#a78bfa"}
                          strokeWidth="3"
                          strokeLinecap="round"
                          className="animate-pulse"
                        />
                        {/* Falling Sparkle Particles */}
                        <circle cx="100" cy="135" r="1.5" fill="#ffffff" className="animate-ping" />
                        <circle cx="100" cy="165" r="1.5" fill="#ffffff" className="animate-ping" />
                      </g>
                    )}

                    {/* Bottom Sand (Accumulates from y=208 upwards) */}
                    <g clipPath="url(#bottomBulbClip)">
                      <rect
                        x="40"
                        y={208 - bottomSandAccumulated * 88}
                        width="120"
                        height="100"
                        fill={
                          mode === "focus"
                            ? "url(#sandGradientRose)"
                            : mode === "short_break"
                            ? "url(#sandGradientEmerald)"
                            : "url(#sandGradientPurple)"
                        }
                        className="transition-all duration-300 ease-linear"
                      />
                      {/* Sand heap tip when running */}
                      {isRunning && bottomSandAccumulated > 0.05 && bottomSandAccumulated < 0.95 && (
                        <polygon
                          points={`90,${208 - bottomSandAccumulated * 88 + 2} 100,${208 - bottomSandAccumulated * 88 - 6} 110,${208 - bottomSandAccumulated * 88 + 2}`}
                          fill={mode === "focus" ? "#f43f5e" : mode === "short_break" ? "#10b981" : "#8b5cf6"}
                        />
                      )}
                    </g>

                    {/* Glass Flask Outer Contour */}
                    <path
                      d="M 50 32 C 50 78, 88 114, 94 120 C 88 126, 50 162, 50 208 L 150 208 C 150 162, 112 126, 106 120 C 112 114, 150 78, 150 32 Z"
                      className="stroke-border"
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                      fill="none"
                    />

                    {/* Glass Glossy Light Highlights (3D Realism) */}
                    <path
                      d="M 58 45 C 58 75, 78 100, 84 108"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeOpacity="0.4"
                      fill="none"
                    />
                    <path
                      d="M 58 195 C 58 165, 78 140, 84 132"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeOpacity="0.4"
                      fill="none"
                    />

                    {/* Top Wooden / Metallic Cap */}
                    <rect x="36" y="22" width="128" height="10" rx="3" className="fill-surface-secondary stroke-border" strokeWidth="2" />
                    {/* Bottom Wooden / Metallic Cap */}
                    <rect x="36" y="208" width="128" height="10" rx="3" className="fill-surface-secondary stroke-border" strokeWidth="2" />

                    {/* Metallic Pillar Rods */}
                    <line x1="42" y1="32" x2="42" y2="208" className="stroke-border" strokeWidth="2" strokeDasharray="3 3" />
                    <line x1="158" y1="32" x2="158" y2="208" className="stroke-border" strokeWidth="2" strokeDasharray="3 3" />
                  </svg>
                </div>
              </div>
            ) : (
              /* 2B. Circular Progress Ring Visualizer */
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    className="stroke-surface-secondary"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    className={`transition-all duration-300 ease-linear ${
                      mode === "focus"
                        ? "stroke-rose-500"
                        : mode === "short_break"
                        ? "stroke-emerald-500"
                        : "stroke-primary"
                    }`}
                    strokeWidth="6"
                    strokeDasharray="276.46"
                    strokeDashoffset={(276.46 * strokeDashoffset) / 100}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>

                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="font-mono text-5xl sm:text-6xl font-extrabold text-text tracking-tight select-none">
                    {formatTimeRemaining(timeLeft)}
                  </span>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider mt-2 px-2.5 py-0.5 rounded-full ${
                      mode === "focus"
                        ? "text-rose-600 bg-rose-500/10"
                        : mode === "short_break"
                        ? "text-emerald-600 bg-emerald-500/10"
                        : "text-primary bg-primary-light"
                    }`}
                  >
                    {mode === "focus" ? "Stay Focused" : mode === "short_break" ? "Take a Rest" : "Extended Rest"}
                  </span>

                  <div className="flex items-center gap-1.5 mt-3">
                    {[0, 1, 2, 3].map((dotIdx) => {
                      const currentDot = completedCycles % settings.longBreakInterval;
                      return (
                        <span
                          key={dotIdx}
                          className={`w-2 h-2 rounded-full transition-all ${
                            dotIdx < currentDot
                              ? "bg-rose-500 scale-110"
                              : dotIdx === currentDot && mode === "focus"
                              ? "bg-rose-500 animate-pulse"
                              : "bg-surface-secondary border border-border"
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Ambient Flow Tip */}
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>
                {mode === "focus"
                  ? "Deep work mode active • Silence interruptions"
                  : "Rest your eyes, breathe, and stretch"}
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex items-center gap-3 pt-1">
              <Button
                type="button"
                variant={isRunning ? "outline" : "primary"}
                size="lg"
                onClick={handleTogglePlay}
                className={`w-36 sm:w-44 py-6 text-base font-bold gap-2 rounded-card shadow-md transition-transform active:scale-95 ${
                  !isRunning && mode === "focus"
                    ? "bg-rose-500 hover:bg-rose-600 text-white"
                    : !isRunning && mode === "short_break"
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : !isRunning && mode === "long_break"
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : ""
                }`}
              >
                {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                <span>{isRunning ? "PAUSE" : "START"}</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleReset}
                className="p-4 rounded-card"
                title="Reset Timer (Press R)"
                aria-label="Reset Timer"
              >
                <RotateCcw className="w-5 h-5 text-text-secondary" />
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleSkip}
                className="p-4 rounded-card"
                title="Skip Interval (Press S)"
                aria-label="Skip Interval"
              >
                <SkipForward className="w-5 h-5 text-text-secondary" />
              </Button>
            </div>

            {/* Keyboard Hint */}
            <div className="text-[11px] text-text-muted flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 rounded bg-surface-secondary border border-border font-mono">Space</kbd> Play/Pause
              <span>•</span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface-secondary border border-border font-mono">R</kbd> Reset
              <span>•</span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface-secondary border border-border font-mono">S</kbd> Skip
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Daily Stats & Notifications Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Daily Streak Card */}
        <Card className="border-border bg-surface">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-text">
                {dailyCount} <span className="text-xs font-semibold text-text-secondary">Pomodoros today</span>
              </div>
              <p className="text-[11px] text-text-muted">
                ~{dailyCount * settings.focusMinutes} mins of deep work completed
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Desktop Notification Banner */}
        <Card className="border-border bg-surface">
          <CardContent className="p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Bell className="w-5 h-5 text-primary shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-text block">Desktop Alerts</span>
                <span className="text-[11px] text-text-muted">
                  {notificationGranted ? "Alerts enabled for tab switches" : "Get notified when timer finishes"}
                </span>
              </div>
            </div>

            {!notificationGranted ? (
              <Button
                variant="outline"
                size="sm"
                onClick={requestNotificationPermission}
                className="text-xs shrink-0"
              >
                Enable
              </Button>
            ) : (
              <span className="text-emerald-500 text-xs font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Active
              </span>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 3. Settings Drawer */}
      {showSettings && (
        <div ref={settingsRef}>
          <Card className="border-border animate-in fade-in-50 ring-2 ring-primary/20 shadow-md">
            <CardHeader className="border-b border-border pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-primary" />
                  <span>Customize Timer Durations</span>
                </CardTitle>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Set your personal focus & break intervals. Changes auto-save instantly.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(false)}
                className="h-7 w-7 p-0 rounded-full text-text-muted hover:text-text hover:bg-surface-secondary"
                aria-label="Close Settings"
                title="Close"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-text-secondary uppercase">Focus (min)</label>
                  <Input
                    type="number"
                    min="1"
                    max="120"
                    value={settings.focusMinutes}
                    onChange={(e) => {
                      const val = Math.max(1, parseInt(e.target.value, 10) || 25);
                      setSettings((prev) => ({ ...prev, focusMinutes: val }));
                      if (mode === "focus" && !isRunning) setTimeLeft(val * 60);
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-text-secondary uppercase">Short Break</label>
                  <Input
                    type="number"
                    min="1"
                    max="60"
                    value={settings.shortBreakMinutes}
                    onChange={(e) => {
                      const val = Math.max(1, parseInt(e.target.value, 10) || 5);
                      setSettings((prev) => ({ ...prev, shortBreakMinutes: val }));
                      if (mode === "short_break" && !isRunning) setTimeLeft(val * 60);
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-text-secondary uppercase">Long Break</label>
                  <Input
                    type="number"
                    min="1"
                    max="60"
                    value={settings.longBreakMinutes}
                    onChange={(e) => {
                      const val = Math.max(1, parseInt(e.target.value, 10) || 15);
                      setSettings((prev) => ({ ...prev, longBreakMinutes: val }));
                      if (mode === "long_break" && !isRunning) setTimeLeft(val * 60);
                    }}
                  />
                </div>
              </div>

              {/* Sound Settings & Tone Options */}
              <div className="pt-3 border-t border-border space-y-3">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                    className="flex items-center gap-2 text-xs text-text font-medium"
                  >
                    {settings.soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-text-muted" />
                    )}
                    <span>Sound Alerts {settings.soundEnabled ? "Enabled" : "Muted"}</span>
                  </button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => soundEffects.playTone(settings.soundTone || "zen_bowl")}
                    className="text-xs gap-1.5 text-primary hover:text-primary hover:bg-primary/10"
                  >
                    <span>Test Sound</span>
                    <Volume2 className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {settings.soundEnabled && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-text-secondary uppercase">
                      Select Sound Style (Long Resonant Tones)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSettings((prev) => ({ ...prev, soundTone: "zen_bowl" }));
                          soundEffects.playZenBowl();
                        }}
                        className={`px-2.5 py-2 rounded-lg text-left text-xs font-medium border transition-all ${
                          (settings.soundTone || "zen_bowl") === "zen_bowl"
                            ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                            : "border-border bg-surface text-text-secondary hover:text-text hover:bg-surface-secondary"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>🧘 Zen Bowl</span>
                        </div>
                        <span className="text-[10px] text-text-muted block mt-0.5">Deep & Long (~4s)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSettings((prev) => ({ ...prev, soundTone: "bell_chime" }));
                          soundEffects.playBellChime();
                        }}
                        className={`px-2.5 py-2 rounded-lg text-left text-xs font-medium border transition-all ${
                          settings.soundTone === "bell_chime"
                            ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                            : "border-border bg-surface text-text-secondary hover:text-text hover:bg-surface-secondary"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>🔔 Bell Chime</span>
                        </div>
                        <span className="text-[10px] text-text-muted block mt-0.5">Harmonic (~3s)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSettings((prev) => ({ ...prev, soundTone: "digital_harp" }));
                          soundEffects.playDigitalHarp();
                        }}
                        className={`px-2.5 py-2 rounded-lg text-left text-xs font-medium border transition-all ${
                          settings.soundTone === "digital_harp"
                            ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                            : "border-border bg-surface text-text-secondary hover:text-text hover:bg-surface-secondary"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>🎵 Harp Melody</span>
                        </div>
                        <span className="text-[10px] text-text-muted block mt-0.5">Ascending (~2.5s)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
