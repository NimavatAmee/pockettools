export type PomodoroMode = "focus" | "short_break" | "long_break";

export interface PomodoroSettings {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number; // default 4
  autoStartBreaks: boolean;
  autoStartPomodoro: boolean;
  soundEnabled: boolean;
  soundTone: "zen_bowl" | "bell_chime" | "digital_harp";
}

export const DEFAULT_POMODORO_SETTINGS: PomodoroSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoro: false,
  soundEnabled: true,
  soundTone: "zen_bowl",
};

export interface DailyFocusStats {
  date: string; // YYYY-MM-DD
  completedPomodoros: number;
  totalFocusMinutes: number;
}

export function formatTimeRemaining(seconds: number): string {
  const mins = Math.floor(Math.max(0, seconds) / 60);
  const secs = Math.max(0, seconds) % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function getDurationForMode(mode: PomodoroMode, settings: PomodoroSettings): number {
  switch (mode) {
    case "focus":
      return Math.max(1, settings.focusMinutes) * 60;
    case "short_break":
      return Math.max(1, settings.shortBreakMinutes) * 60;
    case "long_break":
      return Math.max(1, settings.longBreakMinutes) * 60;
    default:
      return 25 * 60;
  }
}

export function getNextMode(
  currentMode: PomodoroMode,
  completedCycles: number,
  settings: PomodoroSettings
): { nextMode: PomodoroMode; newCycleCount: number } {
  if (currentMode === "focus") {
    const newCycleCount = completedCycles + 1;
    const isLongBreak = newCycleCount % settings.longBreakInterval === 0;
    return {
      nextMode: isLongBreak ? "long_break" : "short_break",
      newCycleCount,
    };
  }

  // After short or long break, return to focus
  return {
    nextMode: "focus",
    newCycleCount: completedCycles,
  };
}

export function getTabTitle(mode: PomodoroMode, secondsLeft: number): string {
  const formatted = formatTimeRemaining(secondsLeft);
  switch (mode) {
    case "focus":
      return `(${formatted}) 🧠 Focus | Pocket Tools`;
    case "short_break":
      return `(${formatted}) ☕ Short Break | Pocket Tools`;
    case "long_break":
      return `(${formatted}) 🌴 Long Break | Pocket Tools`;
    default:
      return `(${formatted}) | Pocket Tools`;
  }
}
