/* ============================================================
   WelcomeOverlay — shown once to first-time buyers who open
   a pre-filled profile link. Dismissed by clicking "Let's go"
   or pressing Escape. State stored in sessionStorage so it
   only shows once per browser session.
   ============================================================ */
import { useEffect, useState, useRef } from "react";
import { useColorTheme } from "@/contexts/ColorThemeContext";

interface Props {
  buyerName?: string; // pre-filled name from URL, e.g. "Jordan"
}

const STORAGE_KEY = "insync-welcome-seen";

const STEPS = [
  {
    icon: "📸",
    title: "Add your photo",
    desc: "Tap the circle on your profile card to upload a clear, friendly photo. This is the first thing clients see.",
  },
  {
    icon: "✅",
    title: "Choose your services",
    desc: "Go to the Services tab in the editor. Toggle on the services you offer — only your selected ones show on the card.",
  },
  {
    icon: "✍️",
    title: "Write your bio",
    desc: "In the Profile tab, write a short bio in your own words. Tell clients who you are and how you show up for them.",
  },
  {
    icon: "🔗",
    title: "Copy your link",
    desc: "Click the \"MESSAGE TO BEGIN\" button or the share icon at the bottom of the card to copy your unique profile link.",
  },
  {
    icon: "📲",
    title: "Share it",
    desc: "Post your link to Facebook, send it to your support coordinator, or add it to your email signature. You're live.",
  },
];

export default function WelcomeOverlay({ buyerName }: Props) {
  const { theme } = useColorTheme();
  const isLight = ['daylight','sage-linen','blush-cream','slate-mint'].includes(theme.id);
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Show if: URL has a ?name= param (buyer link) OR first-time activation flag is set
    const hasName = new URLSearchParams(window.location.search).has("name");
    const firstActivation = sessionStorage.getItem("insync_show_welcome") === "1";
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if ((hasName || firstActivation) && !seen) {
      // Clear the first-activation flag so it only fires once
      if (firstActivation) sessionStorage.removeItem("insync_show_welcome");
      // Small delay so the page renders first
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      // Trap focus on close button
      setTimeout(() => closeRef.current?.focus(), 50);
      // Keyboard dismiss
      const handler = (e: KeyboardEvent) => {
        if (e.key === "Escape") dismiss();
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }
  }, [visible]);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      dismiss();
    }
  };

  if (!visible) return null;

  const bg = isLight ? theme.bgCard : "oklch(0.09 0.06 155)";
  const cardBg = isLight ? theme.bgCard2 : "oklch(0.12 0.07 155 / 80%)";
  const textPrimary = theme.textLight;
  const textSub = theme.textMid;
  const accent = theme.accent;
  const currentStep = STEPS[step];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to InSync Profiles"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 20000,
        background: "oklch(0.04 0.04 155 / 85%)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeIn 250ms ease-out",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div
        style={{
          background: bg,
          border: `1.5px solid ${accent}40`,
          borderRadius: "20px",
          boxShadow: `0 24px 80px oklch(0.04 0.04 155 / 90%), 0 0 0 1px ${accent}18`,
          width: "min(480px, 100%)",
          overflow: "hidden",
          animation: "scaleIn 250ms cubic-bezier(0.23,1,0.32,1)",
        }}
      >
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${accent}22 0%, ${accent}08 100%)`,
          borderBottom: `1px solid ${accent}25`,
          padding: "28px 28px 20px",
          textAlign: "center",
          position: "relative",
        }}>
          <button
            ref={closeRef}
            onClick={dismiss}
            aria-label="Close welcome guide"
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "oklch(1 0 0 / 8%)",
              border: "none",
              borderRadius: "8px",
              width: "32px",
              height: "32px",
              cursor: "pointer",
              color: textSub,
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            ✕
          </button>
          <div style={{ fontSize: "48px", lineHeight: 1, marginBottom: "12px" }}>✦</div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "26px",
            fontWeight: 700,
            color: textPrimary,
            margin: "0 0 6px",
            lineHeight: 1.2,
          }}>
            {buyerName ? `Welcome, ${buyerName}!` : "Welcome to InSync Profiles"}
          </h2>
          <p style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "14px",
            color: textSub,
            margin: 0,
            lineHeight: 1.5,
          }}>
            Your profile is ready. Here's how to set it up in 5 steps.
          </p>
        </div>

        {/* Step content */}
        <div style={{ padding: "24px 28px" }}>
          {/* Progress dots */}
          <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "24px" }}>
            {STEPS.map((_, i) => (
              <div
                key={i}
                onClick={() => setStep(i)}
                style={{
                  width: i === step ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background: i === step ? accent : `${accent}35`,
                  transition: "all 200ms ease-out",
                  cursor: "pointer",
                }}
                aria-label={`Step ${i + 1}`}
              />
            ))}
          </div>

          {/* Current step card */}
          <div
            key={step}
            style={{
              background: cardBg,
              border: `1px solid ${accent}20`,
              borderRadius: "14px",
              padding: "24px",
              textAlign: "center",
              marginBottom: "20px",
              animation: "fadeIn 180ms ease-out",
            }}
          >
            <div style={{ fontSize: "44px", lineHeight: 1, marginBottom: "14px" }}>
              {currentStep.icon}
            </div>
            <h3 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "17px",
              fontWeight: 700,
              color: accent,
              margin: "0 0 10px",
              letterSpacing: "0.01em",
            }}>
              Step {step + 1} — {currentStep.title}
            </h3>
            <p style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "14px",
              color: textSub,
              margin: 0,
              lineHeight: 1.6,
            }}>
              {currentStep.desc}
            </p>
          </div>

          {/* Navigation buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                style={{
                  flex: 1,
                  height: "46px",
                  borderRadius: "10px",
                  background: "oklch(1 0 0 / 6%)",
                  border: `1.5px solid ${accent}30`,
                  color: textSub,
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 150ms ease-out",
                }}
              >
                ← Back
              </button>
            )}
            <button
              onClick={next}
              style={{
                flex: 2,
                height: "46px",
                borderRadius: "10px",
                background: accent,
                border: "none",
                color: theme.accentText,
                fontFamily: "'Outfit', sans-serif",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 150ms ease-out",
                letterSpacing: "0.03em",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.1)"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.filter = ""; (e.currentTarget as HTMLButtonElement).style.transform = ""; }}
            >
              {step < STEPS.length - 1 ? `Next →` : `Let's go →`}
            </button>
          </div>

          <p style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "11px",
            color: `${textSub}80`,
            textAlign: "center",
            marginTop: "14px",
            marginBottom: 0,
          }}>
            Press Escape or click outside to close
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) } to { opacity: 1; transform: scale(1) } }
      `}</style>
    </div>
  );
}
