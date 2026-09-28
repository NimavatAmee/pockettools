import { describe, it, expect } from "vitest";
import {
  formatTimeRemaining,
  getDurationForMode,
  getNextMode,
  getTabTitle,
  DEFAULT_POMODORO_SETTINGS,
} from "@/lib/calculations/pomodoro";

describe("Pomodoro Timer Engine", () => {
  it("should format remaining seconds correctly into MM:SS", () => {
    expect(formatTimeRemaining(1500)).toBe("25:00");
    expect(formatTimeRemaining(299)).toBe("04:59");
    expect(formatTimeRemaining(5)).toBe("00:05");
    expect(formatTimeRemaining(0)).toBe("00:00");
    expect(formatTimeRemaining(-10)).toBe("00:00");
  });

  it("should return correct durations based on settings", () => {
    expect(getDurationForMode("focus", DEFAULT_POMODORO_SETTINGS)).toBe(1500); // 25 min * 60
    expect(getDurationForMode("short_break", DEFAULT_POMODORO_SETTINGS)).toBe(300); // 5 min * 60
    expect(getDurationForMode("long_break", DEFAULT_POMODORO_SETTINGS)).toBe(900); // 15 min * 60
  });

  it("should transition from Focus to Short Break for cycles 1, 2, 3 and Long Break on cycle 4", () => {
    const cycle1 = getNextMode("focus", 0, DEFAULT_POMODORO_SETTINGS);
    expect(cycle1.nextMode).toBe("short_break");
    expect(cycle1.newCycleCount).toBe(1);

    const backToFocus1 = getNextMode("short_break", 1, DEFAULT_POMODORO_SETTINGS);
    expect(backToFocus1.nextMode).toBe("focus");
    expect(backToFocus1.newCycleCount).toBe(1);

    const cycle4 = getNextMode("focus", 3, DEFAULT_POMODORO_SETTINGS);
    expect(cycle4.nextMode).toBe("long_break");
    expect(cycle4.newCycleCount).toBe(4);
  });

  it("should generate proper browser tab titles", () => {
    expect(getTabTitle("focus", 1500)).toBe("(25:00) 🧠 Focus | Pocket Tools");
    expect(getTabTitle("short_break", 300)).toBe("(05:00) ☕ Short Break | Pocket Tools");
    expect(getTabTitle("long_break", 900)).toBe("(15:00) 🌴 Long Break | Pocket Tools");
  });
});
