/* useA11y — Reactive accessibility settings hook
   Reads sw-accessibility-settings from localStorage and listens for changes.
   Returns style overrides to apply to the page wrapper so that font scale,
   dyslexia font, and high contrast work even on pages that use inline styles. */
import { useState, useEffect } from "react";

interface A11ySettings {
  fontSize: number;
  highContrast: boolean;
  dyslexiaFont: boolean;
}

const STORAGE_KEY = "sw-accessibility-settings";
const DYSLEXIA_FONT = "'OpenDyslexic', 'Comic Sans MS', cursive";
const NORMAL_FONT = "'Outfit', sans-serif";

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

  const wrapperStyle: React.CSSProperties = {
    fontSize: settings.fontSize !== 1 ? `${settings.fontSize * 100}%` : undefined,
    fontFamily: settings.dyslexiaFont ? DYSLEXIA_FONT : NORMAL_FONT,
    filter: settings.highContrast ? "contrast(1.8) brightness(1.05)" : undefined,
  };

  return { settings, wrapperStyle };
}
