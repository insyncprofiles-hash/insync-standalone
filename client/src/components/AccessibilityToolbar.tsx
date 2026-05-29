/* ============================================================
   AccessibilityToolbar — Client-facing accessibility controls
   Design: Midnight Luxury Accessibility (Navy + Gold)
   Features: Text-to-speech, font size, high contrast, dyslexia font,
             reduced motion, focus indicators
   WCAG 2.1 AA compliant
   ============================================================ */
import { useState, useEffect, useCallback, useRef } from "react";

export interface AccessibilitySettings {
  fontSize: number;         // 1 = normal, 1.25 = large, 1.5 = extra large
  highContrast: boolean;
  dyslexiaFont: boolean;
  reducedMotion: boolean;
  ttsEnabled: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 1,
  highContrast: false,
  dyslexiaFont: false,
  reducedMotion: false,
  ttsEnabled: false,
};

const STORAGE_KEY = "sw-accessibility-settings";

function loadSettings(): AccessibilitySettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {}
  return DEFAULT_SETTINGS;
}

function saveSettings(s: AccessibilitySettings) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

function applySettings(s: AccessibilitySettings) {
  const root = document.documentElement;
  // Font size
  root.style.setProperty("--a11y-font-scale", String(s.fontSize));
  // High contrast
  root.classList.toggle("a11y-high-contrast", s.highContrast);
  // Dyslexia font
  root.classList.toggle("a11y-dyslexia", s.dyslexiaFont);
  // Reduced motion
  root.classList.toggle("a11y-reduced-motion", s.reducedMotion);
}

interface Props {
  onSettingsChange?: (s: AccessibilitySettings) => void;
}

export default function AccessibilityToolbar({ onSettingsChange }: Props) {
  const [settings, setSettings] = useState<AccessibilitySettings>(loadSettings);
  const [open, setOpen] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [ttsStatus, setTtsStatus] = useState<"idle" | "reading" | "paused">("idle");
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Apply settings to DOM whenever they change
  useEffect(() => {
    applySettings(settings);
    saveSettings(settings);
    onSettingsChange?.(settings);
  }, [settings, onSettingsChange]);

  // Close panel on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (open && panelRef.current && !panelRef.current.contains(e.target as Node) && !triggerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const update = useCallback((updates: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  // ── Text-to-Speech ──────────────────────────────────────────
  const speak = useCallback((text?: string) => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser. Please try Chrome or Edge.");
      return;
    }
    if (ttsStatus === "reading") {
      window.speechSynthesis.cancel();
      setTtsStatus("idle");
      setSpeaking(false);
      return;
    }
    const content = text || extractPageText();
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.lang = "en-AU";
    // Prefer a clear female voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("female"))
      || voices.find(v => v.lang.startsWith("en-AU"))
      || voices.find(v => v.lang.startsWith("en"));
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => { setTtsStatus("reading"); setSpeaking(true); };
    utterance.onend = () => { setTtsStatus("idle"); setSpeaking(false); };
    utterance.onerror = () => { setTtsStatus("idle"); setSpeaking(false); };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [ttsStatus]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setTtsStatus("idle");
    setSpeaking(false);
  }, []);

  // Stop speech when component unmounts
  useEffect(() => () => { window.speechSynthesis?.cancel(); }, []);

  // ── Hover-to-speak on elements ──────────────────────────────
  useEffect(() => {
    if (!settings.ttsEnabled) return;
    const handler = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const text = el.getAttribute("aria-label") || el.textContent?.trim();
      if (text && text.length > 2 && text.length < 300) {
        window.speechSynthesis?.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 1.0;
        u.lang = "en-AU";
        window.speechSynthesis.speak(u);
      }
    };
    document.addEventListener("mouseover", handler);
    return () => document.removeEventListener("mouseover", handler);
  }, [settings.ttsEnabled]);

  const fontSizeLabels = ["Normal", "Large", "Extra Large"];
  const fontSizeValues = [1, 1.25, 1.5];
  const currentFontIdx = fontSizeValues.indexOf(settings.fontSize);

  const btnStyle = (active: boolean): React.CSSProperties => ({
    background: active ? "oklch(0.82 0.14 75)" : "oklch(0.15 0.06 155)",
    border: `1.5px solid ${active ? "oklch(0.82 0.14 75)" : "oklch(0.72 0.14 75 / 30%)"}`,
    borderRadius: "10px",
    color: active ? "oklch(0.08 0.05 155)" : "oklch(0.82 0.04 130)",
    padding: "8px 12px",
    fontSize: "13px",
    fontFamily: "'Outfit', sans-serif",
    fontWeight: active ? 700 : 500,
    cursor: "pointer",
    transition: "all 160ms ease-out",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    whiteSpace: "nowrap" as const,
  });

  return (
    <>
      {/* Floating trigger button */}
      <div
        data-no-print="true"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "8px",
        }}
      >
        {/* TTS stop button — shown when speaking */}
        {speaking && (
          <button
            onClick={stopSpeaking}
            style={{
              background: "oklch(0.65 0.20 25)",
              border: "none",
              borderRadius: "50px",
              color: "white",
              padding: "8px 16px",
              fontSize: "13px",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 4px 20px oklch(0.65 0.20 25 / 40%)",
              animation: "pulse-soft 1.5s ease-in-out infinite",
            }}
            aria-label="Stop reading aloud"
          >
            ⏹ Stop Reading
          </button>
        )}

        {/* Main accessibility button */}
        <button
          ref={triggerRef}
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          aria-controls="a11y-panel"
          aria-label="Accessibility options — text size, contrast, text to speech"
          title="Accessibility Options"
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: open ? "oklch(0.82 0.14 75)" : "oklch(0.13 0.06 155)",
            border: "2px solid oklch(0.82 0.14 75)",
            boxShadow: "0 4px 24px oklch(0.72 0.14 75 / 35%)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 200ms ease-out",
            color: open ? "oklch(0.08 0.05 155)" : "oklch(0.82 0.14 75)",
            fontSize: "24px",
          }}
        >
          <img src="/assets/accessibility-icon_f6ed13be.png" alt="" aria-hidden="true" style={{ width: "40px", height: "40px", objectFit: "contain", borderRadius: "50%" }} />
        </button>
      </div>

      {/* Accessibility panel */}
      {open && (
        <div
          id="a11y-panel"
          data-no-print="true"
          ref={panelRef}
          role="dialog"
          aria-label="Accessibility settings"
          aria-modal="false"
          style={{
            position: "fixed",
            bottom: "92px",
            right: "24px",
            zIndex: 9998,
            width: "min(360px, calc(100vw - 32px))",
            background: "oklch(0.12 0.06 155)",
            border: "1.5px solid oklch(0.72 0.14 75 / 40%)",
            borderRadius: "20px",
            boxShadow: "0 8px 40px oklch(0.06 0.05 155 / 80%), 0 0 0 1px oklch(0.72 0.14 75 / 10%)",
            padding: "20px",
            animation: "slideUpFade 200ms cubic-bezier(0.23, 1, 0.32, 1) both",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 style={{ color: "oklch(0.92 0.01 78)", fontFamily: "'Cormorant Garamond', serif", fontSize: "17px", fontWeight: 700, margin: 0 }}>
                Accessibility
              </h2>
              <p style={{ color: "oklch(0.60 0.04 155)", fontSize: "12px", fontFamily: "'Outfit', sans-serif", margin: "2px 0 0" }}>
                Customise your reading experience
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close accessibility panel"
              style={{
                background: "oklch(0.15 0.06 155)",
                border: "1px solid oklch(0.72 0.14 75 / 20%)",
                borderRadius: "8px",
                color: "oklch(0.65 0.04 155)",
                width: "32px",
                height: "32px",
                cursor: "pointer",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* ── Text Size ── */}
            <section aria-labelledby="a11y-fontsize-label">
              <p id="a11y-fontsize-label" style={{ color: "oklch(0.72 0.14 75 / 80%)", fontSize: "11px", fontFamily: "'Outfit', sans-serif", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
                🔤 Text Size
              </p>
              <div role="group" aria-labelledby="a11y-fontsize-label" style={{ display: "flex", gap: "6px" }}>
                {fontSizeValues.map((val, i) => (
                  <button
                    key={val}
                    onClick={() => update({ fontSize: val })}
                    aria-pressed={settings.fontSize === val}
                    aria-label={`Set text size to ${fontSizeLabels[i]}`}
                    style={{
                      ...btnStyle(settings.fontSize === val),
                      flex: 1,
                      justifyContent: "center",
                      fontSize: `${11 + i * 2}px`,
                    }}
                  >
                    A{i === 0 ? "" : i === 1 ? "+" : "++"}
                  </button>
                ))}
              </div>
              <p style={{ color: "oklch(0.55 0.04 155)", fontSize: "11px", fontFamily: "'Outfit', sans-serif", marginTop: "5px" }}>
                Currently: <strong style={{ color: "oklch(0.82 0.14 75)" }}>{fontSizeLabels[currentFontIdx] ?? "Normal"}</strong>
              </p>
            </section>

            {/* ── Text to Speech ── */}
            <section aria-labelledby="a11y-tts-label">
              <p id="a11y-tts-label" style={{ color: "oklch(0.72 0.14 75 / 80%)", fontSize: "11px", fontFamily: "'Outfit', sans-serif", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
                🔊 Text to Speech
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <button
                  onClick={() => speak()}
                  aria-label={ttsStatus === "reading" ? "Stop reading page aloud" : "Read this page aloud"}
                  style={{
                    ...btnStyle(ttsStatus === "reading"),
                    justifyContent: "center",
                    width: "100%",
                    padding: "10px 16px",
                    fontSize: "13px",
                  }}
                >
                  {ttsStatus === "reading" ? "⏹ Stop Reading" : "▶ Read Page Aloud"}
                </button>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: "10px", background: "oklch(0.15 0.06 155)", border: "1.5px solid oklch(0.72 0.14 75 / 20%)" }}>
                  <div>
                    <p style={{ color: "oklch(0.82 0.04 130)", fontSize: "13px", fontFamily: "'Outfit', sans-serif", fontWeight: 600, margin: 0 }}>
                      Hover to Speak
                    </p>
                    <p style={{ color: "oklch(0.55 0.04 155)", fontSize: "11px", fontFamily: "'Outfit', sans-serif", margin: "2px 0 0" }}>
                      Reads text under your cursor
                    </p>
                  </div>
                  <ToggleSwitch
                    checked={settings.ttsEnabled}
                    onChange={v => update({ ttsEnabled: v })}
                    label="Toggle hover to speak"
                  />
                </div>
              </div>
            </section>

            {/* ── Display Options ── */}
            <section aria-labelledby="a11y-display-label">
              <p id="a11y-display-label" style={{ color: "oklch(0.72 0.14 75 / 80%)", fontSize: "11px", fontFamily: "'Outfit', sans-serif", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
                🎨 Display Options
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {[
                  {
                    key: "highContrast" as const,
                    icon: "◑",
                    label: "High Contrast",
                    desc: "Stronger colour contrast for low vision",
                  },
                  {
                    key: "dyslexiaFont" as const,
                    icon: "Aa",
                    label: "Dyslexia-Friendly Font",
                    desc: "OpenDyslexic font for easier reading",
                  },
                  {
                    key: "reducedMotion" as const,
                    icon: "⏸",
                    label: "Reduce Motion",
                    desc: "Stops animations and transitions",
                  },
                ].map(opt => (
                  <div
                    key={opt.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      background: settings[opt.key] ? "oklch(0.72 0.14 75 / 10%)" : "oklch(0.15 0.06 155)",
                      border: `1.5px solid ${settings[opt.key] ? "oklch(0.72 0.14 75 / 40%)" : "oklch(0.72 0.14 75 / 20%)"}`,
                      transition: "all 160ms ease-out",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "16px", width: "22px", textAlign: "center", color: settings[opt.key] ? "oklch(0.82 0.14 75)" : "oklch(0.60 0.04 155)" }} aria-hidden="true">
                        {opt.icon}
                      </span>
                      <div>
                        <p style={{ color: settings[opt.key] ? "oklch(0.88 0.06 78)" : "oklch(0.82 0.04 130)", fontSize: "13px", fontFamily: "'Outfit', sans-serif", fontWeight: 600, margin: 0 }}>
                          {opt.label}
                        </p>
                        <p style={{ color: "oklch(0.55 0.04 155)", fontSize: "11px", fontFamily: "'Outfit', sans-serif", margin: "2px 0 0" }}>
                          {opt.desc}
                        </p>
                      </div>
                    </div>
                    <ToggleSwitch
                      checked={settings[opt.key] as boolean}
                      onChange={v => update({ [opt.key]: v })}
                      label={`Toggle ${opt.label}`}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Reset */}
            <button
              onClick={() => setSettings(DEFAULT_SETTINGS)}
              aria-label="Reset all accessibility settings to default"
              style={{
                background: "transparent",
                border: "1.5px solid oklch(0.72 0.14 75 / 20%)",
                borderRadius: "10px",
                color: "oklch(0.55 0.04 155)",
                padding: "8px",
                fontSize: "12px",
                fontFamily: "'Outfit', sans-serif",
                cursor: "pointer",
                transition: "all 160ms ease-out",
                width: "100%",
              }}
            >
              ↺ Reset to Default
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ── Small toggle switch sub-component ──────────────────────────
function ToggleSwitch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      style={{
        width: "44px",
        height: "24px",
        borderRadius: "12px",
        background: checked ? "oklch(0.82 0.14 75)" : "oklch(0.18 0.06 155)",
        border: "none",
        cursor: "pointer",
        position: "relative",
        flexShrink: 0,
        transition: "background 160ms ease-out",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "4px",
          left: checked ? "24px" : "4px",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          background: "white",
          transition: "left 160ms ease-out",
        }}
        aria-hidden="true"
      />
    </button>
  );
}

// ── Extract readable text from the page ────────────────────────
function extractPageText(): string {
  const mainEl = document.getElementById("main-content") || document.body;
  const walker = document.createTreeWalker(mainEl, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      const tag = parent.tagName.toLowerCase();
      if (["script", "style", "noscript"].includes(tag)) return NodeFilter.FILTER_REJECT;
      if (parent.getAttribute("aria-hidden") === "true") return NodeFilter.FILTER_REJECT;
      const text = node.textContent?.trim();
      return text && text.length > 1 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });
  const parts: string[] = [];
  let node;
  while ((node = walker.nextNode())) {
    const text = node.textContent?.trim();
    if (text) parts.push(text);
  }
  return parts.join(". ").replace(/\.\s*\./g, ".").substring(0, 3000);
}
