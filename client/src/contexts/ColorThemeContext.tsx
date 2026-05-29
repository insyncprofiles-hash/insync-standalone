/* ============================================================
   ColorThemeContext — selectable colour palettes
   Gradient themes appear first — default is Sky & Gold.
   Light and Dark themes also available.
   Each theme defines: bg, card, border, accent, gold, text, textMid, textDim
   ============================================================ */
import { createContext, useContext, useEffect, useState } from "react";

export interface ColorTheme {
  id: string;
  name: string;
  emoji: string;
  description: string;
  // CSS variable values (OKLCH strings)
  bg: string;
  bgCard: string;
  bgCard2: string;
  border: string;
  accent: string;       // primary accent (replaces gold)
  accentGlow: string;   // glow/shadow colour
  accentText: string;   // text on accent background
  textLight: string;
  textMid: string;
  textDim: string;
  // Post preview specific
  postBg: string;
  postBg2: string;
  circleBg: string;
  circleStroke: string;
  titleFont: string;    // "serif" | "script" | "sans"
}

export const COLOR_THEMES: ColorTheme[] = [
  // ── GRADIENT THEMES (shown first) ────────────────────────────
  {
    id: "sky-gold",
    name: "Sky & Gold",
    emoji: "🌅",
    description: "Soft sky blue to warm honey gold — flowing, calming, accessible",
    bg: "oklch(0.96 0.025 220)",
    bgCard: "oklch(1.0 0.0 0 / 92%)",
    bgCard2: "oklch(0.94 0.02 220 / 85%)",
    border: "oklch(0.72 0.14 75 / 30%)",
    accent: "oklch(0.55 0.16 220)",
    accentGlow: "oklch(0.55 0.16 220 / 25%)",
    accentText: "oklch(0.98 0.005 220)",
    textLight: "oklch(0.15 0.02 240)",
    textMid: "oklch(0.35 0.04 240)",
    textDim: "oklch(0.55 0.03 240)",
    postBg: "#C8E6FA",
    postBg2: "#F7E08A",
    circleBg: "rgba(255,255,255,0.90)",
    circleStroke: "#3b82f6",
    titleFont: "sans",
  },
  {
    id: "ocean-amber",
    name: "Ocean & Amber",
    emoji: "🌊",
    description: "Deep ocean teal to warm amber gold — bold, warm, confident",
    bg: "oklch(0.30 0.06 220)",
    bgCard: "oklch(0.96 0.02 80 / 95%)",
    bgCard2: "oklch(0.90 0.04 80 / 90%)",
    border: "oklch(0.72 0.14 75 / 35%)",
    accent: "oklch(0.65 0.16 75)",
    accentGlow: "oklch(0.65 0.16 75 / 30%)",
    accentText: "oklch(0.15 0.03 240)",
    textLight: "oklch(0.15 0.03 240)",
    textMid: "oklch(0.30 0.05 220)",
    textDim: "oklch(0.45 0.04 220)",
    postBg: "#1A6BAA",
    postBg2: "#E8A020",
    circleBg: "rgba(248,244,234,0.92)",
    circleStroke: "#0d9488",
    titleFont: "sans",
  },
  {
    id: "rainbow-prism",
    name: "Rainbow Prism",
    emoji: "🌈",
    description: "Soft rainbow bands — joyful, inclusive, flowing",
    bg: "oklch(0.95 0.015 280)",
    bgCard: "oklch(1.0 0.0 0 / 92%)",
    bgCard2: "oklch(0.94 0.02 280 / 85%)",
    border: "oklch(0.55 0.12 280 / 25%)",
    accent: "oklch(0.50 0.16 280)",
    accentGlow: "oklch(0.50 0.16 280 / 25%)",
    accentText: "oklch(0.98 0.005 280)",
    textLight: "oklch(0.18 0.03 280)",
    textMid: "oklch(0.38 0.05 280)",
    textDim: "oklch(0.55 0.04 280)",
    postBg: "#C8E6FA",
    postBg2: "#F7E08A",
    circleBg: "rgba(255,255,255,0.90)",
    circleStroke: "#7c3aed",
    titleFont: "sans",
  },
  {
    id: "cobalt-gold",
    name: "Cobalt & Gold",
    emoji: "💙",
    description: "Rich cobalt blue to bright gold — bold, premium, eye-catching",
    bg: "oklch(0.28 0.10 240)",
    bgCard: "oklch(1.0 0.0 0 / 95%)",
    bgCard2: "oklch(0.95 0.02 240 / 90%)",
    border: "oklch(0.72 0.14 75 / 35%)",
    accent: "oklch(0.65 0.16 75)",
    accentGlow: "oklch(0.65 0.16 75 / 30%)",
    accentText: "oklch(0.15 0.03 240)",
    textLight: "oklch(0.15 0.03 240)",
    textMid: "oklch(0.30 0.05 240)",
    textDim: "oklch(0.45 0.04 240)",
    postBg: "#1565C0",
    postBg2: "#F4A800",
    circleBg: "rgba(255,255,255,0.95)",
    circleStroke: "#1565c0",
    titleFont: "sans",
  },
  // ── LIGHT THEMES ────────────────────────────
  {
    id: "daylight",
    name: "Daylight",
    emoji: "☀️",
    description: "Clean white & sky blue — bright, accessible, professional",
    bg: "oklch(0.97 0.005 220)",
    bgCard: "oklch(1.0 0.0 0 / 80%)",
    bgCard2: "oklch(0.94 0.01 220 / 80%)",
    border: "oklch(0.40 0.08 220 / 25%)",
    accent: "oklch(0.45 0.15 240)",
    accentGlow: "oklch(0.45 0.15 240 / 25%)",
    accentText: "oklch(0.98 0.005 220)",
    textLight: "oklch(0.15 0.02 240)",
    textMid: "oklch(0.35 0.04 240)",
    textDim: "oklch(0.55 0.03 240)",
    postBg: "#e8f0f8",
    postBg2: "#d0e4f4",
    circleBg: "rgba(255,255,255,0.85)",
    circleStroke: "#2563eb",
    titleFont: "sans",
  },
  {
    id: "sage-linen",
    name: "Sage & Linen",
    emoji: "🌾",
    description: "Warm linen & sage green — calm, natural, earthy",
    bg: "oklch(0.95 0.015 100)",
    bgCard: "oklch(0.98 0.01 90 / 85%)",
    bgCard2: "oklch(0.92 0.02 130 / 80%)",
    border: "oklch(0.45 0.08 145 / 25%)",
    accent: "oklch(0.42 0.12 145)",
    accentGlow: "oklch(0.42 0.12 145 / 25%)",
    accentText: "oklch(0.97 0.01 100)",
    textLight: "oklch(0.18 0.03 145)",
    textMid: "oklch(0.38 0.05 145)",
    textDim: "oklch(0.55 0.04 145)",
    postBg: "#e8ede0",
    postBg2: "#d8e8cc",
    circleBg: "rgba(248,245,238,0.85)",
    circleStroke: "#4a7c59",
    titleFont: "serif",
  },
  {
    id: "blush-cream",
    name: "Blush & Cream",
    emoji: "🌷",
    description: "Soft blush & warm cream — gentle, welcoming, inclusive",
    bg: "oklch(0.96 0.015 20)",
    bgCard: "oklch(0.99 0.008 30 / 85%)",
    bgCard2: "oklch(0.93 0.02 15 / 80%)",
    border: "oklch(0.55 0.10 15 / 25%)",
    accent: "oklch(0.50 0.14 15)",
    accentGlow: "oklch(0.50 0.14 15 / 25%)",
    accentText: "oklch(0.97 0.01 20)",
    textLight: "oklch(0.18 0.03 15)",
    textMid: "oklch(0.38 0.05 15)",
    textDim: "oklch(0.55 0.04 15)",
    postBg: "#f5e8e0",
    postBg2: "#f0d8cc",
    circleBg: "rgba(255,248,244,0.85)",
    circleStroke: "#c0605a",
    titleFont: "serif",
  },
  {
    id: "slate-mint",
    name: "Slate & Mint",
    emoji: "🩵",
    description: "Cool slate & fresh mint — crisp, modern, high readability",
    bg: "oklch(0.95 0.008 200)",
    bgCard: "oklch(0.99 0.005 200 / 85%)",
    bgCard2: "oklch(0.92 0.015 175 / 80%)",
    border: "oklch(0.40 0.10 185 / 25%)",
    accent: "oklch(0.42 0.14 185)",
    accentGlow: "oklch(0.42 0.14 185 / 25%)",
    accentText: "oklch(0.97 0.01 200)",
    textLight: "oklch(0.15 0.02 220)",
    textMid: "oklch(0.35 0.04 210)",
    textDim: "oklch(0.52 0.03 210)",
    postBg: "#ddeef0",
    postBg2: "#c8e8ec",
    circleBg: "rgba(245,252,253,0.85)",
    circleStroke: "#0e9488",
    titleFont: "sans",
  },
];

interface ColorThemeContextType {
  theme: ColorTheme;
  setThemeId: (id: string) => void;
  themes: ColorTheme[];
}

const ColorThemeContext = createContext<ColorThemeContextType>({
  theme: COLOR_THEMES[0],
  setThemeId: () => {},
  themes: COLOR_THEMES,
});

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<string>(() => {
    return localStorage.getItem("sw-color-theme") || "sky-gold";
  });

  const theme = COLOR_THEMES.find(t => t.id === themeId) || COLOR_THEMES[0];

  useEffect(() => {
    localStorage.setItem("sw-color-theme", themeId);
    // Apply CSS variables to root
    const root = document.documentElement;
    root.style.setProperty("--theme-bg", theme.bg);
    root.style.setProperty("--theme-card", theme.bgCard);
    root.style.setProperty("--theme-card2", theme.bgCard2);
    root.style.setProperty("--theme-border", theme.border);
    root.style.setProperty("--theme-accent", theme.accent);
    root.style.setProperty("--theme-accent-glow", theme.accentGlow);
    root.style.setProperty("--theme-accent-text", theme.accentText);
    root.style.setProperty("--theme-text-light", theme.textLight);
    root.style.setProperty("--theme-text-mid", theme.textMid);
    root.style.setProperty("--theme-text-dim", theme.textDim);
  }, [themeId, theme]);

  return (
    <ColorThemeContext.Provider value={{ theme, setThemeId, themes: COLOR_THEMES }}>
      {children}
    </ColorThemeContext.Provider>
  );
}

export function useColorTheme() {
  return useContext(ColorThemeContext);
}
