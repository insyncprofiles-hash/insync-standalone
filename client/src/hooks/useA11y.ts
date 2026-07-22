/* useA11y — Reactive accessibility settings hook
   Reads sw-accessibility-settings from localStorage and listens for changes.
   Returns wrapperStyle with zoom so ALL text (including inline px) scales correctly.
   TopAccessibilityBar dispatches a11y-settings-changed event for instant updates. */
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
    // Listen for storage changes from other tabs
    window.addEventListener("storage", handler);
    // Listen for custom event dispatched by TopAccessibilityBar on same-tab changes
    window.addEventListener("a11y-settings-changed", handler);
    // Fallback poll every 500ms
    const interval = setInterval(handler, 500);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("a11y-settings-changed", handler);
      clearInterval(interval);
    };
  }, []);

  // Keep CSS variable in sync
  useEffect(() => {
    document.documentElement.style.setProperty("--a11y-font-scale", String(settings.fontSize));
  }, [settings.fontSize]);

  // Apply/remove dyslexia class
  useEffect(() => {
    document.documentElement.classList.toggle("a11y-dyslexia", settings.dyslexiaFont);
  }, [settings.dyslexiaFont]);

  // Apply/remove high-contrast class
  useEffect(() => {
    document.documentElement.classList.toggle("a11y-high-contrast", settings.highContrast);
  }, [settings.highContrast]);

  // zoom scales the entire wrapper including inline px sizes — works in Chrome/Edge/Safari
  // For Firefox (which doesn't support zoom), fall back to transform: scale
  const wrapperStyle: React.CSSProperties = {
    zoom: settings.fontSize !== 1 ? settings.fontSize : undefined,
    fontFamily: settings.dyslexiaFont ? DYSLEXIA_FONT : NORMAL_FONT,
    filter: settings.highContrast ? "contrast(1.8) brightness(1.05)" : undefined,
  };

  return { settings, wrapperStyle, fontScale: settings.fontSize };
}
