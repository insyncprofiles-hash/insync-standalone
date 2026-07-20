/* useA11y — Reactive accessibility settings hook
   Reads sw-accessibility-settings from localStorage and listens for changes.
   Applies font scale directly to :root via --a11y-font-scale CSS variable,
   and returns style overrides for dyslexia font and high contrast. */
import { useState, useEffect } from "react";

interface A11ySettings {
  fontSize: number;
  highContrast: boolean;
  dyslexiaFont: boolean;
}

const STORAGE_KEY = "sw-accessibility-settings";
const DYSLEXIA_FONT = "'Lexend', 'OpenDyslexic', sans-serif";
const NORMAL_FONT = "'Nunito', 'Outfit', sans-serif";

function readSettings(): A11ySettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        fontSize: typeof parsed.fontSize === "number" ? parsed.fontSize : 1,
        highContrast: Boolean(parsed.highContrast),
        dyslexiaFont: Boolean(parsed.dyslexiaFont),
      };
    }
  } catch {}
  return { fontSize: 1, highContrast: false, dyslexiaFont: false };
}

export function useA11y() {
  const [settings, setSettings] = useState<A11ySettings>(readSettings);

  useEffect(() => {
    const handler = () => setSettings(readSettings());
    // Listen for storage changes from other tabs / the TopAccessibilityBar
    window.addEventListener("storage", handler);
    // Also poll every 300ms to catch same-tab changes (TopAccessibilityBar doesn't dispatch storage events)
    const interval = setInterval(handler, 300);
    return () => {
      window.removeEventListener("storage", handler);
      clearInterval(interval);
    };
  }, []);

  // Apply font scale to :root — this makes rem-based AND px-based text scale via CSS calc()
  useEffect(() => {
    document.documentElement.style.setProperty("--a11y-font-scale", String(settings.fontSize));
    // Also set font-size on <html> directly so all rem units scale
    document.documentElement.style.fontSize = `${settings.fontSize * 100}%`;
  }, [settings.fontSize]);

  // Apply/remove dyslexia class on <html> so the CSS rule catches inline-styled elements
  useEffect(() => {
    document.documentElement.classList.toggle("a11y-dyslexia", settings.dyslexiaFont);
  }, [settings.dyslexiaFont]);

  // Apply/remove high-contrast class
  useEffect(() => {
    document.documentElement.classList.toggle("a11y-high-contrast", settings.highContrast);
  }, [settings.highContrast]);

  // wrapperStyle: only fontFamily and filter — font size is handled via :root font-size
  const wrapperStyle: React.CSSProperties = {
    fontFamily: settings.dyslexiaFont ? DYSLEXIA_FONT : NORMAL_FONT,
    filter: settings.highContrast ? "contrast(1.8) brightness(1.05)" : undefined,
  };

  return { settings, wrapperStyle };
}
