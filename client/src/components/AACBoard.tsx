/* ============================================================
   AACBoard — Augmentative & Alternative Communication Board
   Design: High-contrast, large-icon, simplified view
   Purpose: Clients who use AAC can interact with this board
   to communicate their support preferences
   WCAG 2.1 AA+ compliant — designed for AAC users
   ============================================================ */
import { useState } from "react";
import type { ProfileData } from "@/pages/Home";

interface Props {
  profile?: Partial<ProfileData>;
  onClose: () => void;
}

// AAC tile colours — high contrast, distinct, warm
const TILE_COLORS = [
  { bg: "#1a3a6b", border: "#4a90d9", text: "#ffffff" },  // blue
  { bg: "#2d5a27", border: "#6abf5e", text: "#ffffff" },  // green
  { bg: "#6b2d1a", border: "#d97a4a", text: "#ffffff" },  // orange
  { bg: "#1a3a6b", border: "#5aaad9", text: "#ffffff" },  // sky blue
  { bg: "#1a5a5a", border: "#4abfbf", text: "#ffffff" },  // teal
  { bg: "#6b5a1a", border: "#d9c44a", text: "#ffffff" },  // yellow
];

// Core AAC vocabulary tiles always shown
const CORE_VOCAB = [
  { icon: "✅", label: "YES", color: { bg: "#1a5a27", border: "#4abf6e", text: "#ffffff" } },
  { icon: "❌", label: "NO", color: { bg: "#6b1a1a", border: "#d94a4a", text: "#ffffff" } },
  { icon: "🙏", label: "PLEASE", color: { bg: "#1a3a6b", border: "#4a90d9", text: "#ffffff" } },
  { icon: "★", label: "THANK YOU", color: { bg: "#5a4a00", border: "#d9b84a", text: "#ffffff" } },
  { icon: "⏸️", label: "STOP", color: { bg: "#6b1a1a", border: "#d94a4a", text: "#ffffff" } },
  { icon: "❓", label: "HELP", color: { bg: "#1a3a6b", border: "#5aaad9", text: "#ffffff" } },
];

interface AACTile {
  icon: string;
  label: string;
  color: { bg: string; border: string; text: string };
  action?: () => void;
}

export default function AACBoard({ profile = {}, onClose }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [spoken, setSpoken] = useState<string | null>(null);

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.85;
      u.lang = "en-AU";
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang.startsWith("en-AU")) || voices.find(v => v.lang.startsWith("en"));
      if (preferred) u.voice = preferred;
      window.speechSynthesis.speak(u);
    }
    setSpoken(text);
    setTimeout(() => setSpoken(null), 2000);
  };

  const handleTile = (label: string) => {
    speak(label);
    setSelected(prev => [...prev, label]);
  };

  const clearLast = () => {
    setSelected(prev => prev.slice(0, -1));
  };

  const clearAll = () => {
    setSelected([]);
    window.speechSynthesis?.cancel();
  };

  const speakSentence = () => {
    if (selected.length > 0) speak(selected.join(". "));
  };

  // Build service tiles from profile (safe — profile may be partial)
  const serviceTiles: AACTile[] = (profile.services ?? [])
    .filter(s => s.selected)
    .map((s, i) => ({
      icon: s.icon,
      label: s.label,
      color: TILE_COLORS[i % TILE_COLORS.length],
    }));

  // Contact tiles (safe — profile may be partial)
  const phone = profile.phone ?? "";
  const email = profile.email ?? "";
  const contactTiles: AACTile[] = [
    phone && {
      icon: "📞",
      label: "CALL ME",
      color: { bg: "#1a3a6b", border: "#4a90d9", text: "#ffffff" },
      action: () => { window.location.href = `tel:${phone.replace(/\s/g, "")}`; },
    },
    email && {
      icon: "✉️",
      label: "EMAIL ME",
      color: { bg: "#2d5a27", border: "#6abf5e", text: "#ffffff" },
      action: () => { window.location.href = `mailto:${email}`; },
    },
  ].filter(Boolean) as AACTile[];

  return (
    <div
      className="fixed inset-0 overflow-y-auto"
      style={{ background: "#0a0f1a", zIndex: 10002, paddingTop: "60px" }}
      role="dialog"
      aria-modal="true"
      aria-label={`AAC Communication Board${profile.name ? ` for ${profile.name}` : ""}`}
    >
      {/* Header */}
      <div
        style={{
          background: "#0d1525",
          borderBottom: "3px solid #c9a227",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div>
          <p style={{ color: "#c9a227", fontSize: "11px", fontFamily: "'Outfit', sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
            AAC Board
          </p>
          <h1 style={{ color: "#ffffff", fontSize: "clamp(16px, 4vw, 22px)", fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, margin: "2px 0 0" }}>
            {profile.name || "Communication Board"}
          </h1>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "#1a2540",
            border: "2px solid #c9a227",
            borderRadius: "12px",
            color: "#c9a227",
            padding: "10px 18px",
            fontSize: "14px",
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            cursor: "pointer",
          }}
          aria-label="Close AAC board and return to profile"
        >
          ← Back
        </button>
      </div>

      {/* Sentence strip */}
      <div
        style={{
          background: "#111827",
          borderBottom: "2px solid #c9a227",
          padding: "12px 20px",
          minHeight: "64px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexWrap: "wrap",
        }}
        aria-live="polite"
        aria-label="Your selected words"
      >
        <span style={{ color: "#c9a227", fontSize: "12px", fontFamily: "'Outfit', sans-serif", fontWeight: 700, letterSpacing: "0.08em", marginRight: "4px", flexShrink: 0 }}>
          I WANT:
        </span>
        {selected.length === 0 && (
          <span style={{ color: "#4a5568", fontSize: "14px", fontFamily: "'Outfit', sans-serif", fontStyle: "italic" }}>
            Tap a tile below to choose...
          </span>
        )}
        {selected.map((word, i) => (
          <span
            key={i}
            style={{
              background: "#1a3a6b",
              border: "1.5px solid #4a90d9",
              borderRadius: "8px",
              color: "#ffffff",
              padding: "4px 10px",
              fontSize: "clamp(13px, 3vw, 16px)",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600,
            }}
          >
            {word}
          </span>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: "8px", flexShrink: 0 }}>
          {selected.length > 0 && (
            <>
              <button
                onClick={speakSentence}
                style={{
                  background: "#c9a227",
                  border: "none",
                  borderRadius: "10px",
                  color: "#0a0f1a",
                  padding: "8px 14px",
                  fontSize: "13px",
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
                aria-label="Speak all selected words aloud"
              >
                🔊 Speak
              </button>
              <button
                onClick={clearLast}
                style={{
                  background: "#1a2540",
                  border: "2px solid #4a5568",
                  borderRadius: "10px",
                  color: "#a0aec0",
                  padding: "8px 12px",
                  fontSize: "13px",
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                aria-label="Remove last word"
              >
                ⌫
              </button>
              <button
                onClick={clearAll}
                style={{
                  background: "#1a2540",
                  border: "2px solid #6b1a1a",
                  borderRadius: "10px",
                  color: "#d94a4a",
                  padding: "8px 12px",
                  fontSize: "13px",
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                aria-label="Clear all words"
              >
                ✕ Clear
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>

        {/* CORE VOCABULARY */}
        <section aria-labelledby="core-vocab-heading">
          <h2
            id="core-vocab-heading"
            style={{ color: "#c9a227", fontSize: "12px", fontFamily: "'Outfit', sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}
          >
            Core Words
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(130px, 100%), 1fr))",
              gap: "10px",
              marginBottom: "28px",
            }}
            role="group"
            aria-label="Core vocabulary tiles"
          >
            {CORE_VOCAB.map(tile => (
              <AACTileButton
                key={tile.label}
                tile={tile}
                spoken={spoken}
                onTap={() => handleTile(tile.label)}
              />
            ))}
          </div>
        </section>

        {/* SUPPORT SERVICES */}
        {serviceTiles.length > 0 && (
          <section aria-labelledby="services-heading">
            <h2
              id="services-heading"
              style={{ color: "#c9a227", fontSize: "12px", fontFamily: "'Outfit', sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}
            >
              I Need Support With
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(150px, 100%), 1fr))",
                gap: "10px",
                marginBottom: "28px",
              }}
              role="group"
              aria-label="Support service tiles"
            >
              {serviceTiles.map(tile => (
                <AACTileButton
                  key={tile.label}
                  tile={tile}
                  spoken={spoken}
                  onTap={() => handleTile(tile.label)}
                />
              ))}
            </div>
          </section>
        )}

        {/* FEELINGS */}
        <section aria-labelledby="feelings-heading">
          <h2
            id="feelings-heading"
            style={{ color: "#c9a227", fontSize: "12px", fontFamily: "'Outfit', sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}
          >
            How I Feel
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(130px, 100%), 1fr))",
              gap: "10px",
              marginBottom: "28px",
            }}
            role="group"
            aria-label="Feelings tiles"
          >
            {[
              { icon: "😊", label: "HAPPY", color: { bg: "#2d5a27", border: "#6abf5e", text: "#ffffff" } },
              { icon: "😔", label: "SAD", color: { bg: "#1a3a6b", border: "#4a90d9", text: "#ffffff" } },
              { icon: "😰", label: "ANXIOUS", color: { bg: "#1a3a6b", border: "#5aaad9", text: "#ffffff" } },
              { icon: "😴", label: "TIRED", color: { bg: "#1a3a3a", border: "#4abfbf", text: "#ffffff" } },
              { icon: "😤", label: "FRUSTRATED", color: { bg: "#6b2d1a", border: "#d97a4a", text: "#ffffff" } },
              { icon: "😌", label: "CALM", color: { bg: "#1a5a5a", border: "#4abfbf", text: "#ffffff" } },
              { icon: "🤕", label: "PAIN", color: { bg: "#6b1a1a", border: "#d94a4a", text: "#ffffff" } },
              { icon: "🤔", label: "CONFUSED", color: { bg: "#5a4a00", border: "#d9b84a", text: "#ffffff" } },
            ].map(tile => (
              <AACTileButton
                key={tile.label}
                tile={tile}
                spoken={spoken}
                onTap={() => handleTile(tile.label)}
              />
            ))}
          </div>
        </section>

        {/* ASK THE WORKER */}
        <section aria-labelledby="ask-heading">
          <h2
            id="ask-heading"
            style={{ color: "#c9a227", fontSize: "12px", fontFamily: "'Outfit', sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}
          >
            Ask the Worker
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(160px, 100%), 1fr))",
              gap: "10px",
              marginBottom: "28px",
            }}
            role="group"
            aria-label="Ask the worker tiles"
          >
            {[
              { icon: "🎯", label: "Give me an example", color: { bg: "#1a3a6b", border: "#4a90d9", text: "#ffffff" } },
              { icon: "💡", label: "Why did you choose this work?", color: { bg: "#2d5a27", border: "#6abf5e", text: "#ffffff" } },
              { icon: "🌟", label: "How would you support my goals?", color: { bg: "#1a5a5a", border: "#4abfbf", text: "#ffffff" } },
              { icon: "💬", label: "What would you do if I was upset?", color: { bg: "#6b2d1a", border: "#d97a4a", text: "#ffffff" } },
              { icon: "✊", label: "How do you advocate for me?", color: { bg: "#5a4a00", border: "#d9b84a", text: "#ffffff" } },
            ].map(tile => (
              <AACTileButton
                key={tile.label}
                tile={tile}
                spoken={spoken}
                onTap={() => handleTile(tile.label)}
              />
            ))}
          </div>
        </section>

        {/* CONTACT */}
        {contactTiles.length > 0 && (
          <section aria-labelledby="contact-heading">
            <h2
              id="contact-heading"
              style={{ color: "#c9a227", fontSize: "12px", fontFamily: "'Outfit', sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" }}
            >
              Contact {(profile.name ?? "").split(" ")[0] || "Support Worker"}
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(160px, 100%), 1fr))",
                gap: "10px",
                marginBottom: "28px",
              }}
              role="group"
              aria-label="Contact tiles"
            >
              {contactTiles.map(tile => (
                <AACTileButton
                  key={tile.label}
                  tile={tile}
                  spoken={spoken}
                  onTap={() => {
                    speak(tile.label);
                    tile.action?.();
                  }}
                  isAction
                />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

// ── Individual AAC tile button ──────────────────────────────────
function AACTileButton({
  tile, spoken, onTap, isAction = false,
}: {
  tile: { icon: string; label: string; color: { bg: string; border: string; text: string } };
  spoken: string | null;
  onTap: () => void;
  isAction?: boolean;
}) {
  const isSpoken = spoken === tile.label;
  return (
    <button
      onClick={onTap}
      aria-label={`${tile.label}${isAction ? " — opens contact action" : " — tap to select"}`}
      style={{
        background: isSpoken ? tile.color.border : tile.color.bg,
        border: `3px solid ${tile.color.border}`,
        borderRadius: "16px",
        color: tile.color.text,
        padding: "16px 8px 12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
        transition: "all 160ms ease-out",
        transform: isSpoken ? "scale(1.06)" : "scale(1)",
        boxShadow: isSpoken ? `0 0 20px ${tile.color.border}80` : "none",
        minHeight: "90px",
        width: "100%",
      }}
    >
      <span style={{ fontSize: "clamp(28px, 6vw, 36px)", lineHeight: 1 }} aria-hidden="true">
        {tile.icon}
      </span>
      <span style={{ fontSize: "clamp(11px, 2.5vw, 14px)", fontFamily: "'Outfit', sans-serif", fontWeight: 700, letterSpacing: "0.05em", lineHeight: 1.2, textAlign: "center" }}>
        {tile.label}
      </span>
      {isAction && (
        <span style={{ fontSize: "10px", opacity: 0.7, fontFamily: "'Outfit', sans-serif" }}>tap to contact</span>
      )}
    </button>
  );
}
