/**
 * Design Tokens for Pocket Tools
 * Defines color palettes, semantic tokens, and theme variables for Light and Dark modes.
 */

export const THEME_TOKENS = {
  light: {
    primary: "#5B5BF7",
    primaryHover: "#4848E0",
    primaryLight: "#EEF0FE",
    accent: "#00C2A8",
    accentHover: "#00AB94",
    accentLight: "#E6FAF6",
    background: "#F8F9FC",
    surface: "#FFFFFF",
    surfaceSecondary: "#EEF1F8",
    textMain: "#171923",
    textSecondary: "#5A6072",
    textMuted: "#8890A4",
    border: "#E2E5F0",
    cardShadow: "0 4px 16px -2px rgba(91, 91, 247, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.03)",
  },
  dark: {
    primary: "#5B5BF7",
    primaryHover: "#7272FA",
    primaryLight: "#1E2042",
    accent: "#00C2A8",
    accentHover: "#26D6C0",
    accentLight: "#0D2A26",
    background: "#0E1017",
    surface: "#161922",
    surfaceSecondary: "#1E2330",
    textMain: "#F8F9FC",
    textSecondary: "#9BA3B8",
    textMuted: "#687187",
    border: "#2A3042",
    cardShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.45), 0 2px 8px -1px rgba(0, 0, 0, 0.35)",
  },
  categories: {
    finance: {
      color: "#00C2A8",
      bgLight: "rgba(0, 194, 168, 0.12)",
      border: "rgba(0, 194, 168, 0.25)",
    },
    math: {
      color: "#5B5BF7",
      bgLight: "rgba(91, 91, 247, 0.12)",
      border: "rgba(91, 91, 247, 0.25)",
    },
    health: {
      color: "#FF5376",
      bgLight: "rgba(255, 83, 118, 0.12)",
      border: "rgba(255, 83, 118, 0.25)",
    },
    dateTime: {
      color: "#F59E0B",
      bgLight: "rgba(245, 158, 11, 0.12)",
      border: "rgba(245, 158, 11, 0.25)",
    },
    converters: {
      color: "#06B6D4",
      bgLight: "rgba(6, 182, 212, 0.12)",
      border: "rgba(6, 182, 212, 0.25)",
    },
    developerTools: {
      color: "#8B5CF6",
      bgLight: "rgba(139, 92, 246, 0.12)",
      border: "rgba(139, 92, 246, 0.25)",
    },
  },
} as const;

export type ThemeTokens = typeof THEME_TOKENS;
