/* ============================================================
   TopAccessibilityBar — Fixed top bar with accessibility + colour theme controls
   Design: Always visible, high-contrast, WCAG 2.1 AA
   Purpose: First thing disabled users see — large labelled buttons
   ============================================================ */
import { useState, useEffect, useCallback, useRef } from "react";
import { useColorTheme } from "@/contexts/ColorThemeContext";
import AACBoard from "@/components/AACBoard";

export interface AccessibilitySettings {
  fontSize: number;
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
const SETTINGS_VERSION = 2; // bump this to reset all users' stored settings

function loadSettings(): AccessibilitySettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // If stored version doesn't match, reset to defaults to clear stuck settings
      if (parsed._v !== SETTINGS_VERSION) {
        localStorage.removeItem(STORAGE_KEY);
        return DEFAULT_SETTINGS;
      }
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch {}
  return DEFAULT_SETTINGS;
}

function saveSettings(s: AccessibilitySettings) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...s, _v: SETTINGS_VERSION })); } catch {}
}

function applySettings(s: AccessibilitySettings) {
  const root = document.documentElement;
  root.style.setProperty("--a11y-font-scale", String(s.fontSize));
  root.classList.toggle("a11y-high-contrast", s.highContrast);
  root.classList.toggle("a11y-dyslexia", s.dyslexiaFont);
  root.classList.toggle("a11y-reduced-motion", s.reducedMotion);
}

interface Props {
  onSettingsChange?: (s: AccessibilitySettings) => void;
  showBack?: boolean;
  backHref?: string;
  backLabel?: string;
  showHamburger?: boolean;
}

export const TOP_BAR_HEIGHT = 60; // px — height of the fixed top bar
export const TOP_BARS_TOTAL = 110; // px — top bar (60px) + access bar (50px) combined offset

export default function TopAccessibilityBar({ onSettingsChange, showBack, backHref = "/", backLabel = "← Back", showHamburger = true }: Props) {
  const { theme, setThemeId, themes } = useColorTheme();
  const isAurora = theme.id === "aurora";
  const isLight = ['daylight','sage-linen','blush-cream','slate-mint'].includes(theme.id);

  const [settings, setSettings] = useState<AccessibilitySettings>(loadSettings);
  const [openPanel, setOpenPanel] = useState<"none" | "a11y" | "theme">("none");
  const [speaking, setSpeaking] = useState(false);
  const [ttsStatus, setTtsStatus] = useState<"idle" | "reading" | "paused">("idle");
  const [showAACBoard, setShowAACBoard] = useState(false);

  const a11yBtnRef = useRef<HTMLButtonElement>(null);
  const themeBtnRef = useRef<HTMLButtonElement>(null);
  const a11yPanelRef = useRef<HTMLDivElement>(null);
  const themePanelRef = useRef<HTMLDivElement>(null);

  // Apply settings on mount and change
  useEffect(() => {
    applySettings(settings);
    saveSettings(settings);
    onSettingsChange?.(settings);
  }, [settings, onSettingsChange]);

  // Close panels on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openPanel !== "none") {
        setOpenPanel("none");
        if (openPanel === "a11y") a11yBtnRef.current?.focus();
        if (openPanel === "theme") themeBtnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [openPanel]);

  // Close panels on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (openPanel === "a11y" && a11yPanelRef.current && !a11yPanelRef.current.contains(target) && !a11yBtnRef.current?.contains(target)) {
        setOpenPanel("none");
      }
      if (openPanel === "theme" && themePanelRef.current && !themePanelRef.current.contains(target) && !themeBtnRef.current?.contains(target)) {
        setOpenPanel("none");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [openPanel]);

  const updateSettings = useCallback((patch: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...patch }));
  }, []);

  // TTS
  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setTtsStatus("idle");
  }, []);

  const readPage = useCallback(() => {
    if (!window.speechSynthesis) return;
    if (ttsStatus === "reading") {
      window.speechSynthesis.pause();
      setTtsStatus("paused");
      return;
    }
    if (ttsStatus === "paused") {
      window.speechSynthesis.resume();
      setTtsStatus("reading");
      return;
    }
    window.speechSynthesis.cancel();
    const text = document.body.innerText.slice(0, 5000);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.onstart = () => { setSpeaking(true); setTtsStatus("reading"); };
    utterance.onend = () => { setSpeaking(false); setTtsStatus("idle"); };
    utterance.onerror = () => { setSpeaking(false); setTtsStatus("idle"); };
    window.speechSynthesis.speak(utterance);
  }, [ttsStatus]);

  // Bar background — adapts to light/dark themes
  const barBg = isLight ? theme.bgCard2 : "oklch(0.08 0.06 155)";
  const barText = isLight ? theme.textLight : "oklch(0.92 0.01 78)";
  const barBorder = isLight ? `${theme.accent}50` : isAurora ? "rgba(100,220,130,0.25)" : `${theme.accent}40`;
  const btnActiveBg = isLight ? `${theme.accent}22` : isAurora ? "rgba(60,200,100,0.18)" : `${theme.accent}22`;
  const btnActiveBorder = isLight ? theme.accent : isAurora ? "rgba(60,200,100,0.55)" : theme.accent;
  const accentColor = isLight ? theme.accent : isAurora ? "oklch(0.72 0.18 145)" : theme.accent;

  const panelStyle: React.CSSProperties = {
    position: "fixed",
    top: `${TOP_BAR_HEIGHT + 4}px`,
    zIndex: 10001,
    width: "min(360px, calc(100vw - 32px))",
    background: isLight ? theme.bgCard : "oklch(0.10 0.06 155)",
    border: `1.5px solid ${accentColor}55`,
    borderRadius: "0 0 16px 16px",
    boxShadow: isLight ? `0 12px 40px ${theme.accent}20` : `0 12px 40px oklch(0.04 0.04 155 / 80%), 0 0 0 1px ${accentColor}18`,
    padding: "20px",
    animation: "fadeInDown 180ms cubic-bezier(0.23,1,0.32,1)",
  };

  const sectionLabel: React.CSSProperties = {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: accentColor,
    marginBottom: "10px",
    display: "block",
  };

  const controlRow: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid oklch(1 0 0 / 6%)",
  };

  const controlLabel: React.CSSProperties = {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "14px",
    fontWeight: 500,
    color: "oklch(0.92 0.02 78)",
    lineHeight: 1.3,
  };

  const controlDesc: React.CSSProperties = {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "11px",
    color: "oklch(0.55 0.04 155)",
    lineHeight: 1.3,
    marginTop: "1px",
  };

  const toggleBtn = (active: boolean): React.CSSProperties => ({
    width: "48px",
    height: "26px",
    borderRadius: "13px",
    background: active ? accentColor : "oklch(0.20 0.04 155)",
    border: `1.5px solid ${active ? accentColor : "oklch(0.30 0.04 155)"}`,
    cursor: "pointer",
    position: "relative",
    transition: "all 200ms ease-out",
    flexShrink: 0,
  });

  const toggleThumb = (active: boolean): React.CSSProperties => ({
    position: "absolute",
    top: "2px",
    left: active ? "22px" : "2px",
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    background: "white",
    transition: "left 200ms ease-out",
    boxShadow: "0 1px 4px oklch(0 0 0 / 30%)",
  });

  const fontSizeBtn = (size: number): React.CSSProperties => ({
    padding: "6px 14px",
    borderRadius: "8px",
    border: `1.5px solid ${settings.fontSize === size ? accentColor : "oklch(0.25 0.04 155)"}`,
    background: settings.fontSize === size ? `${accentColor}22` : "transparent",
    color: settings.fontSize === size ? accentColor : "oklch(0.65 0.03 155)",
    fontFamily: "'Outfit', sans-serif",
    fontSize: `${12 * size}px`,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 150ms ease-out",
  });

  return (
    <>
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── FIXED TOP BAR — matches reference: hamburger | title | accessibility circle ── */}
      <div
        role="banner"
        aria-label="Accessibility and display options"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: `${TOP_BAR_HEIGHT}px`,
          zIndex: 10000,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1.5px solid rgba(200,230,250,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "16px",
          paddingRight: "16px",
          boxShadow: "0 2px 16px rgba(100,160,220,0.10)",
          color: "#1a2e4a",
        }}
      >
        {/* Left: hamburger menu button — opens colour theme panel (hidden on demo/client view) */}
        {showHamburger ? (
          <button
            ref={themeBtnRef}
            onClick={() => setOpenPanel(p => p === "theme" ? "none" : "theme")}
            aria-label="Open colour theme menu"
            aria-expanded={openPanel === "theme"}
            aria-controls="theme-panel"
            style={{
              width: "40px", height: "40px", borderRadius: "10px",
              background: openPanel === "theme" ? "rgba(74,144,217,0.10)" : "transparent",
              border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "5px",
              transition: "background 150ms ease-out", flexShrink: 0,
            }}
          >
            <span style={{ display: "block", width: "20px", height: "2px", borderRadius: "2px", background: "#1a2e4a" }} />
            <span style={{ display: "block", width: "20px", height: "2px", borderRadius: "2px", background: "#1a2e4a" }} />
            <span style={{ display: "block", width: "20px", height: "2px", borderRadius: "2px", background: "#1a2e4a" }} />
          </button>
        ) : (
          <div style={{ width: "40px" }} />
        )}
        {/* Centre: InSync Profiles logo — always visible on all screen sizes */}
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "auto",
          }}
          aria-label="InSync Profiles — go to home"
        >
          <img
            src="/assets/insync-logo-transparent_9e0df532.png"
            alt="InSync Profiles logo"
            aria-hidden="true"
            style={{ width: "40px", height: "40px", flexShrink: 0, objectFit: "contain" }}
          />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "1px" }}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "12px", fontWeight: 800, color: "#c9a84c", letterSpacing: "0.10em", textTransform: "uppercase", lineHeight: 1 }}>InSync Profiles</span>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "9px", fontWeight: 600, color: "rgba(30,58,120,0.65)", letterSpacing: "0.07em", textTransform: "uppercase", lineHeight: 1.2 }}>Support Worker Profile</span>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "8px", fontWeight: 500, color: "rgba(30,58,120,0.45)", letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1.2 }}>Interactive &amp; Accessible</span>
          </div>
        </a>

        {/* Right: Back button (on sub-pages) or spacer (on home) */}
        {showBack ? (
          <a
            href={backHref}
            aria-label={backLabel}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              textDecoration: "none",
              color: "#1a3a6b",
              fontFamily: "'Outfit', sans-serif",
              fontSize: "12px",
              fontWeight: 700,
              padding: "7px 12px",
              borderRadius: "10px",
              background: "rgba(74,144,217,0.08)",
              border: "1px solid rgba(74,144,217,0.18)",
              transition: "background 150ms ease-out",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a3a6b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Back
          </a>
        ) : (
          <div style={{ width: "40px" }} />
        )}
      </div>

      {/* ── SECOND ROW: Access button + optional TTS stop — sticky below the top bar ── */}
      <div
        style={{
          position: "fixed",
          top: `${TOP_BAR_HEIGHT}px`,
          left: 0,
          right: 0,
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          padding: "6px 16px",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(200,230,250,0.55)",
          boxShadow: "0 2px 10px rgba(100,160,220,0.08)",
        }}
      >
        {/* TTS stop — shown when speaking */}
        {speaking && (
          <button
            onClick={stopSpeaking}
            style={{
              background: "#e53935",
              border: "none",
              borderRadius: "20px",
              color: "white",
              padding: "7px 14px",
              fontSize: "12px",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              boxShadow: "0 2px 8px rgba(229,57,53,0.35)",
            }}
            aria-label="Stop reading aloud"
          >
            ⏹ Stop
          </button>
        )}

        {/* ── ACCESSIBILITY BUTTON — blue pill with icon + label ── */}
        <button
          ref={a11yBtnRef}
          onClick={() => setOpenPanel(p => p === "a11y" ? "none" : "a11y")}
          aria-expanded={openPanel === "a11y"}
          aria-controls="a11y-panel"
          aria-label="Accessibility options — text size, contrast, dyslexia font, text to speech"
          style={{
            height: "38px",
            paddingLeft: "12px",
            paddingRight: "16px",
            borderRadius: "19px",
            background: openPanel === "a11y"
              ? "linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)"
              : "linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)",
            border: openPanel === "a11y" ? "2px solid #1565c0" : "2px solid rgba(21,101,192,0.35)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "7px",
            transition: "transform 150ms ease-out, box-shadow 150ms ease-out",
            flexShrink: 0,
            boxShadow: openPanel === "a11y"
              ? "0 0 0 3px rgba(21,101,192,0.30), 0 4px 18px rgba(21,101,192,0.45)"
              : "0 4px 16px rgba(21,101,192,0.32)",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.04)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="5.5" r="2.2" fill="white" />
            <path d="M12 9v5" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M7.5 11h9" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M12 14l-3 5M12 14l3 5" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: 800, color: "white", letterSpacing: "0.02em" }}>Access</span>
        </button>
      </div>

      {/* ── COLOUR THEME PANEL ── */}
      {openPanel === "theme" && (
        <div
          id="theme-panel"
          ref={themePanelRef}
          role="dialog"
          aria-label="Choose colour theme"
          aria-modal="false"
          style={{ ...panelStyle, right: "16px" }}
        >
          <span style={sectionLabel}>🎨 Colour Theme</span>

          {/* Gradient themes — shown first */}
          <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: isLight ? theme.textDim : "oklch(0.55 0.04 155)", fontFamily: "'Outfit', sans-serif", margin: "0 0 6px 2px" }}>Gradient</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "14px" }}>
            {themes.filter(t => ['sky-gold','ocean-amber','rainbow-prism','cobalt-gold'].includes(t.id)).map(t => (
              <button
                key={t.id}
                onClick={() => { setThemeId(t.id); }}
                aria-pressed={theme.id === t.id}
                aria-label={`${t.name} theme — ${t.description}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: theme.id === t.id ? `2px solid ${t.accent}` : `2px solid ${t.circleStroke}30`,
                  background: theme.id === t.id ? `${t.accent}18` : t.postBg,
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                  transition: "all 150ms ease-out",
                }}
              >
                <div aria-hidden="true" style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: `linear-gradient(135deg, ${t.postBg2} 0%, ${t.circleStroke} 100%)`,
                  border: `1px solid ${t.circleStroke}40`,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                }}>
                  {t.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, fontFamily: "'Outfit', sans-serif", color: theme.id === t.id ? t.accent : t.textLight, margin: 0, lineHeight: 1.2 }}>{t.name}</p>
                  <p style={{ fontSize: "11px", fontFamily: "'Outfit', sans-serif", color: t.textDim, margin: 0, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.description}</p>
                </div>
                {theme.id === t.id && <span aria-hidden="true" style={{ fontSize: "16px", flexShrink: 0, color: t.accent }}>✓</span>}
              </button>
            ))}
          </div>

          {/* Light themes */}
          <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: isLight ? theme.textDim : "oklch(0.55 0.04 155)", fontFamily: "'Outfit', sans-serif", margin: "0 0 6px 2px" }}>Light</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "14px" }}>
            {themes.filter(t => ['daylight','sage-linen','blush-cream','slate-mint'].includes(t.id)).map(t => (
              <button
                key={t.id}
                onClick={() => { setThemeId(t.id); }}
                aria-pressed={theme.id === t.id}
                aria-label={`${t.name} theme — ${t.description}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: theme.id === t.id ? `2px solid ${t.accent}` : `2px solid ${t.circleStroke}30`,
                  background: theme.id === t.id ? `${t.accent}18` : t.postBg,
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                  transition: "all 150ms ease-out",
                }}
              >
                <div aria-hidden="true" style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: `linear-gradient(135deg, ${t.postBg} 0%, ${t.accent} 100%)`,
                  border: "1px solid oklch(1 0 0 / 15%)",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                }}>
                  {t.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, fontFamily: "'Outfit', sans-serif", color: theme.id === t.id ? t.accent : t.textLight, margin: 0, lineHeight: 1.2 }}>{t.name}</p>
                  <p style={{ fontSize: "11px", fontFamily: "'Outfit', sans-serif", color: t.textDim, margin: 0, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.description}</p>
                </div>
                {theme.id === t.id && <span aria-hidden="true" style={{ fontSize: "16px", flexShrink: 0, color: t.accent }}>✓</span>}
              </button>
            ))}
          </div>

          {/* Dark themes */}
          <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: isLight ? theme.textDim : "oklch(0.55 0.04 155)", fontFamily: "'Outfit', sans-serif", margin: "0 0 6px 2px" }}>Dark</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "14px" }}>
            {themes.filter(t => !['sky-gold','ocean-amber','rainbow-prism','cobalt-gold','daylight','sage-linen','blush-cream','slate-mint'].includes(t.id)).map(t => (
              <button
                key={t.id}
                onClick={() => { setThemeId(t.id); }}
                aria-pressed={theme.id === t.id}
                aria-label={`${t.name} theme — ${t.description}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: theme.id === t.id ? `2px solid ${t.accent}` : "2px solid oklch(1 0 0 / 8%)",
                  background: theme.id === t.id ? `${t.accent}18` : "oklch(1 0 0 / 4%)",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                  transition: "all 150ms ease-out",
                }}
              >
                <div aria-hidden="true" style={{ width: "32px", height: "32px", borderRadius: "8px", background: `linear-gradient(135deg, ${t.postBg} 0%, ${t.accent} 100%)`, border: "1px solid oklch(1 0 0 / 15%)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
                  {t.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, fontFamily: "'Outfit', sans-serif", color: theme.id === t.id ? t.accent : "oklch(0.92 0.01 78)", margin: 0, lineHeight: 1.2 }}>{t.name}</p>
                  <p style={{ fontSize: "11px", fontFamily: "'Outfit', sans-serif", color: "oklch(0.50 0.04 155)", margin: 0, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.description}</p>
                </div>
                {theme.id === t.id && <span aria-hidden="true" style={{ fontSize: "16px", flexShrink: 0, color: t.accent }}>✓</span>}
              </button>
            ))}
          </div>

          <p style={{ fontSize: "11px", fontFamily: "'Outfit', sans-serif", color: "oklch(0.45 0.04 155)", marginTop: "12px", textAlign: "center" }}>
            Theme saves automatically
          </p>
        </div>
      )}

      {/* ── AAC BOARD OVERLAY ── */}
      {showAACBoard && (
        <AACBoard onClose={() => setShowAACBoard(false)} />
      )}

      {/* ── ACCESSIBILITY PANEL ── */}
      {openPanel === "a11y" && (
        <div
          id="a11y-panel"
          ref={a11yPanelRef}
          role="dialog"
          aria-label="Accessibility settings"
          aria-modal="false"
          style={{ ...panelStyle, right: "16px" }}
        >
          {/* Text Size */}
          <span style={sectionLabel}>Text Size</span>
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            <button style={fontSizeBtn(1)} onClick={() => updateSettings({ fontSize: 1 })} aria-pressed={settings.fontSize === 1} aria-label="Normal text size">A</button>
            <button style={fontSizeBtn(1.25)} onClick={() => updateSettings({ fontSize: 1.25 })} aria-pressed={settings.fontSize === 1.25} aria-label="Large text size">A+</button>
            <button style={fontSizeBtn(1.5)} onClick={() => updateSettings({ fontSize: 1.5 })} aria-pressed={settings.fontSize === 1.5} aria-label="Extra large text size">A++</button>
          </div>

          {/* Toggles */}
          <span style={sectionLabel}>Display Options</span>

          {/* High Contrast */}
          <div style={controlRow}>
            <div>
              <p style={controlLabel}>High Contrast</p>
              <p style={controlDesc}>Stronger colour contrast for easier reading</p>
            </div>
            <button
              role="switch"
              aria-checked={settings.highContrast}
              aria-label="Toggle high contrast mode"
              onClick={() => updateSettings({ highContrast: !settings.highContrast })}
              style={toggleBtn(settings.highContrast)}
            >
              <span style={toggleThumb(settings.highContrast)} />
            </button>
          </div>

          {/* Dyslexia Font */}
          <div style={controlRow}>
            <div>
              <p style={controlLabel}>Dyslexia-Friendly Font</p>
              <p style={controlDesc}>Switches to Lexend — easier letter spacing</p>
            </div>
            <button
              role="switch"
              aria-checked={settings.dyslexiaFont}
              aria-label="Toggle dyslexia-friendly font"
              onClick={() => updateSettings({ dyslexiaFont: !settings.dyslexiaFont })}
              style={toggleBtn(settings.dyslexiaFont)}
            >
              <span style={toggleThumb(settings.dyslexiaFont)} />
            </button>
          </div>

          {/* Reduced Motion */}
          <div style={controlRow}>
            <div>
              <p style={controlLabel}>Reduce Motion</p>
              <p style={controlDesc}>Stops animations and transitions</p>
            </div>
            <button
              role="switch"
              aria-checked={settings.reducedMotion}
              aria-label="Toggle reduced motion"
              onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
              style={toggleBtn(settings.reducedMotion)}
            >
              <span style={toggleThumb(settings.reducedMotion)} />
            </button>
          </div>


          {/* AAC Board */}
          <div style={{ ...controlRow }}>
            <div>
              <p style={controlLabel}>AAC Board</p>
              <p style={controlDesc}>Augmentative communication tiles — tap to speak</p>
            </div>
            <button
              onClick={() => { setShowAACBoard(true); setOpenPanel("none"); }}
              aria-label="Open AAC communication board"
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                background: `${accentColor}22`,
                border: `1.5px solid ${accentColor}`,
                color: accentColor,
                fontFamily: "'Outfit', sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 150ms ease-out",
                flexShrink: 0,
              }}
            >
              🗣 Open
            </button>
          </div>

          {/* Read Aloud */}
          <div style={{ ...controlRow, borderBottom: "none", paddingBottom: 0 }}>
            <div>
              <p style={controlLabel}>Read Page Aloud</p>
              <p style={controlDesc}>Text-to-speech for the whole page</p>
            </div>
            <button
              onClick={readPage}
              aria-label={ttsStatus === "reading" ? "Pause reading" : ttsStatus === "paused" ? "Resume reading" : "Read page aloud"}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                background: ttsStatus !== "idle" ? `${accentColor}22` : "oklch(0.18 0.05 155)",
                border: `1.5px solid ${ttsStatus !== "idle" ? accentColor : "oklch(0.28 0.05 155)"}`,
                color: ttsStatus !== "idle" ? accentColor : "oklch(0.75 0.03 155)",
                fontFamily: "'Outfit', sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 150ms ease-out",
                flexShrink: 0,
              }}
            >
              {ttsStatus === "reading" ? "⏸ Pause" : ttsStatus === "paused" ? "▶ Resume" : "▶ Read"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
