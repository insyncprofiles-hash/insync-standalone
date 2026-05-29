/* ============================================================
   SocialPostPreview — redesigned to match mockup layout
   Photo left + name/title/location right header
   Horizontal service circles row
   Large video with rainbow border
   Quoted italic tagline
   Gradient blue-to-gold CTA button
   4-column badge pills row
   ============================================================ */
import { useRef } from "react";
import type { ProfileData } from "@/pages/Home";
import { useColorTheme } from "@/contexts/ColorThemeContext";

function useCardPalette() {
  const { theme } = useColorTheme();

  if (theme.id === "sky-gold") return {
    bg:            "#fdfcf8",
    bgSection:     "#f5f0e8",
    text:          "#1a2340",
    textMid:       "#3a4a6a",
    textDim:       "#7a8aaa",
    accent:        "#4a90d9",
    accentAlt:     "#d4a820",
    border:        "rgba(74,144,217,0.18)",
    ringBorder:    "#d4a820",
    ringGlow:      "rgba(212,168,32,0.22)",
    badgeBg:       "rgba(74,144,217,0.09)",
    badgeBorder:   "rgba(74,144,217,0.28)",
    ctaFrom:       "#4a90d9",
    ctaTo:         "#d4a820",
    videoBorder:   "linear-gradient(135deg,#4a90d9,#d4a820,#4a90d9)",
    circleColors:  ["#4a90d9","#2ecc71","#e67e22","#9b59b6","#e74c3c"],
    serviceLabel:  "#3a4a6a",
  };

  if (theme.id === "ocean-amber") return {
    bg:            "#fdf8f0",
    bgSection:     "#f5ede0",
    text:          "#0d2a1a",
    textMid:       "#2a5040",
    textDim:       "#6a8a78",
    accent:        "#009488",
    accentAlt:     "#e8820a",
    border:        "rgba(0,148,136,0.18)",
    ringBorder:    "#e8820a",
    ringGlow:      "rgba(232,130,10,0.22)",
    badgeBg:       "rgba(0,148,136,0.09)",
    badgeBorder:   "rgba(0,148,136,0.28)",
    ctaFrom:       "#009488",
    ctaTo:         "#e8820a",
    videoBorder:   "linear-gradient(135deg,#009488,#e8820a,#009488)",
    circleColors:  ["#009488","#e8820a","#3498db","#9b59b6","#e74c3c"],
    serviceLabel:  "#2a5040",
  };

  if (theme.id === "rainbow-prism") return {
    bg:            "#ffffff",
    bgSection:     "#f8f4ff",
    text:          "#1a1040",
    textMid:       "#3a2a60",
    textDim:       "#7a6a9a",
    accent:        "#9b59b6",
    accentAlt:     "#3498db",
    border:        "rgba(155,89,182,0.18)",
    ringBorder:    "url(#ringRainbow)",
    ringGlow:      "rgba(155,89,182,0.22)",
    badgeBg:       "rgba(155,89,182,0.09)",
    badgeBorder:   "rgba(155,89,182,0.28)",
    ctaFrom:       "#3498db",
    ctaTo:         "#9b59b6",
    videoBorder:   "linear-gradient(135deg,#e74c3c,#f1c40f,#2ecc71,#3498db,#9b59b6)",
    circleColors:  ["#e74c3c","#e67e22","#f1c40f","#2ecc71","#3498db"],
    serviceLabel:  "#3a2a60",
  };

  if (theme.id === "cobalt-gold") return {
    bg:            "#ffffff",
    bgSection:     "#f0f4ff",
    text:          "#0d1b4a",
    textMid:       "#2a3a7a",
    textDim:       "#6a7aaa",
    accent:        "#1565c0",
    accentAlt:     "#f4a800",
    border:        "rgba(21,101,192,0.18)",
    ringBorder:    "#f4a800",
    ringGlow:      "rgba(244,168,0,0.22)",
    badgeBg:       "rgba(21,101,192,0.09)",
    badgeBorder:   "rgba(21,101,192,0.28)",
    ctaFrom:       "#1565c0",
    ctaTo:         "#f4a800",
    videoBorder:   "linear-gradient(135deg,#1565c0,#f4a800,#1565c0)",
    circleColors:  ["#1565c0","#f4a800","#2ecc71","#e74c3c","#9b59b6"],
    serviceLabel:  "#2a3a7a",
  };

  // Light / dark fallback
  return {
    bg:            "#faf8f3",
    bgSection:     "#f5f2eb",
    text:          "#1a2e1e",
    textMid:       "#3d5c42",
    textDim:       "#7a9b7e",
    accent:        "#4a90d9",
    accentAlt:     "oklch(0.72 0.14 75)",
    border:        "rgba(26,46,30,0.10)",
    ringBorder:    "oklch(0.72 0.14 75)",
    ringGlow:      "oklch(0.72 0.14 75 / 22%)",
    badgeBg:       "oklch(0.82 0.14 75 / 12%)",
    badgeBorder:   "oklch(0.72 0.14 75 / 40%)",
    ctaFrom:       "#4a90d9",
    ctaTo:         "oklch(0.72 0.14 75)",
    videoBorder:   "linear-gradient(135deg,#4a90d9,oklch(0.72 0.14 75),#4a90d9)",
    circleColors:  ["#4a90d9","#2ecc71","#e67e22","#9b59b6","#e74c3c"],
    serviceLabel:  "#3d5c42",
  };
}

// Badge icon mapping
const BADGE_ICONS: Record<string, string> = {
  "NDIS Worker Screened":    "🛡",
  "First Aid Certified":     "⭐",
  "Mental Health Support":   "🤍",
  "Working With Children":   "🧒",
  "Police Check":            "🔍",
  "NDIS Worker Check":       "✅",
  "5+ Years Experience":     "👥",
};

interface Props {
  profile: ProfileData;
  onServiceToggle?: (id: string) => void;
  onShareProfile?: () => void;
  noRoundTop?: boolean;
  videoUrl?: string | null;
}

export default function SocialPostPreview({ profile, onServiceToggle, onShareProfile, noRoundTop, videoUrl }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const P = useCardPalette();
  const { theme } = useColorTheme();
  const isRainbow = theme.id === "rainbow-prism";

  const handleImageClick = () => fileInputRef.current?.click();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      window.dispatchEvent(new CustomEvent("profileImageChange", { detail: url }));
    }
  };

  const displayServices = profile.services.filter(s => s.selected).slice(0, 5);
  const serviceSlots = [...displayServices, ...profile.services.filter(s => !s.selected)].slice(0, 5);

  return (
    <article
      className={`relative w-full overflow-hidden select-none ${noRoundTop ? "rounded-none" : "rounded-2xl"}`}
      style={{
        background: P.bg,
        border: `1.5px solid ${P.border}`,
        boxShadow: `0 8px 40px ${P.ringGlow}, 0 2px 12px rgba(0,0,0,0.06)`,
        fontFamily: "'Outfit', sans-serif",
      }}
      aria-label={`Support worker profile card for ${profile.name}`}
    >
      {/* SVG defs for rainbow */}
      {isRainbow && (
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <linearGradient id="ringRainbow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#e74c3c" />
              <stop offset="33%"  stopColor="#2ecc71" />
              <stop offset="66%"  stopColor="#3498db" />
              <stop offset="100%" stopColor="#9b59b6" />
            </linearGradient>
          </defs>
        </svg>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" className="sr-only" aria-label="Upload profile photo" onChange={handleImageChange} />

      <div style={{ padding: "24px 20px 20px", display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* ── HEADER: Photo left + Name/Title/Location right ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          {/* Photo */}
          <button
            onClick={handleImageClick}
            style={{
              flexShrink: 0,
              width: "96px",
              height: "96px",
              borderRadius: "50%",
              overflow: "hidden",
              border: isRainbow ? "3px solid transparent" : `3px solid ${P.ringBorder}`,
              backgroundImage: isRainbow
                ? "linear-gradient(#fff,#fff), linear-gradient(135deg,#e74c3c,#f1c40f,#2ecc71,#3498db,#9b59b6)"
                : undefined,
              backgroundOrigin: isRainbow ? "border-box" : undefined,
              backgroundClip: isRainbow ? "padding-box, border-box" : undefined,
              boxShadow: `0 0 0 5px ${P.badgeBg}, 0 4px 20px ${P.ringGlow}`,
              background: isRainbow ? undefined : P.bgSection,
              cursor: "pointer",
              transition: "transform 0.2s",
              padding: 0,
            }}
            aria-label="Tap to upload your profile photo"
            title="Tap to upload your profile photo"
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            {profile.profileImage ? (
              <img src={profile.profileImage} alt={`${profile.name || 'Support worker'} — NDIS support worker profile for sharing on Facebook Instagram and social media`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: P.bgSection }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={P.textDim} strokeWidth="1.5" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
                <span style={{ fontSize: "8px", color: P.textDim, marginTop: "3px", fontWeight: 600, letterSpacing: "0.04em" }}>TAP TO ADD</span>
              </div>
            )}
          </button>

          {/* Name / Title / Location */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: "clamp(22px, 5vw, 30px)",
              color: P.text,
              margin: "0 0 3px",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
            }}>
              {profile.name || "Your Name"}
            </h2>
            <p style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: "12px",
              color: P.accent,
              margin: "0 0 6px",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
            }}>
              {profile.title || "Support Worker"}
            </p>
            {profile.location && (
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13px", color: P.textMid, margin: 0, display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ color: "#e67e22", fontSize: "14px" }}>📍</span>
                {profile.location}
              </p>
            )}
          </div>
        </div>

        {/* ── SERVICE CIRCLES — horizontal row ── */}
        <div
          role="group"
          aria-label="Services — tap to select or deselect"
          style={{ display: "flex", justifyContent: "space-between", gap: "4px" }}
        >
          {serviceSlots.map((service, i) => {
            const isSelected = service.selected;
            const color = P.circleColors[i] || P.accent;
            return (
              <button
                key={service.id}
                onClick={() => onServiceToggle?.(service.id)}
                aria-pressed={isSelected}
                aria-label={`${service.label}${isSelected ? " — selected" : ""}`}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0",
                  transition: "transform 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              >
                <div style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background: isSelected ? `${color}18` : "rgba(0,0,0,0.03)",
                  border: `2px solid ${isSelected ? color : "rgba(0,0,0,0.10)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  boxShadow: isSelected ? `0 0 12px ${color}44` : "none",
                  transition: "all 0.2s",
                }}>
                  {service.icon}
                </div>
                <span style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "10px",
                  fontWeight: 600,
                  color: isSelected ? P.serviceLabel : P.textDim,
                  textAlign: "center",
                  lineHeight: 1.2,
                  maxWidth: "56px",
                }}>
                  {service.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── INTRO VIDEO ── */}
        {videoUrl && (
          <div style={{ position: "relative" }}>
            {/* Rainbow gradient border wrapper */}
            <div style={{
              padding: "3px",
              borderRadius: "16px",
              background: P.videoBorder,
              boxShadow: `0 4px 20px ${P.ringGlow}`,
            }}>
              <div style={{ borderRadius: "13px", overflow: "hidden", background: "#000" }}>
                <video
                  src={videoUrl}
                  controls
                  playsInline
                  preload="metadata"
                  style={{ width: "100%", display: "block", maxHeight: "240px", objectFit: "cover" }}
                  aria-label="Support worker intro video"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── TAGLINE ── */}
        <div style={{ textAlign: "center", padding: "0 8px" }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: "clamp(20px, 5vw, 26px)",
            color: P.text,
            margin: 0,
            lineHeight: 1.3,
          }}>
            "{profile.tagline || "I get it. I see you. I'm here."}"
          </p>
        </div>

        {/* ── CTA BUTTON — gradient blue to gold ── */}
        <button
          onClick={onShareProfile}
          style={{
            width: "100%",
            padding: "16px 24px",
            borderRadius: "50px",
            background: `linear-gradient(135deg, ${P.ctaFrom} 0%, ${P.ctaTo} 100%)`,
            border: "none",
            color: "#ffffff",
            fontFamily: "'Outfit', sans-serif",
            fontSize: "15px",
            fontWeight: 700,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            boxShadow: `0 4px 20px ${P.ringGlow}, 0 2px 8px rgba(0,0,0,0.12)`,
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
            (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 28px ${P.ringGlow}, 0 4px 12px rgba(0,0,0,0.16)`;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${P.ringGlow}, 0 2px 8px rgba(0,0,0,0.12)`;
          }}
          aria-label={`${profile.ctaText} — message this support worker`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {profile.ctaText || "MESSAGE TO BEGIN"}
        </button>

        {/* ── CREDENTIAL BADGES — 2-per-row pill grid ── */}
        {profile.badges.length > 0 && (
          <div
            role="list"
            aria-label="Certifications and clearances"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
            }}
          >
            {profile.badges.slice(0, 4).map((badge, i) => {
              const color = P.circleColors[i % P.circleColors.length];
              const icon = BADGE_ICONS[badge] || "✦";
              return (
                <div
                  key={i}
                  role="listitem"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    background: `${color}0d`,
                    border: `1.5px solid ${color}30`,
                  }}
                >
                  <span style={{ fontSize: "18px", flexShrink: 0 }} aria-hidden="true">{icon}</span>
                  <span style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: P.textMid,
                    lineHeight: 1.2,
                  }}>
                    {badge}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* ── CONTACT BUTTONS ── */}
        {(profile.phone || profile.email || profile.website) && (
          <div style={{ borderTop: `1px solid ${P.border}`, paddingTop: "14px", display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
            {profile.phone && (
              <a href={`tel:${profile.phone.replace(/\s/g, "")}`} aria-label={`Call ${profile.name}`}
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "20px", background: P.badgeBg, border: `1.5px solid ${P.badgeBorder}`, color: P.text, textDecoration: "none", fontFamily: "'Outfit', sans-serif", fontSize: "12px", fontWeight: 600 }}>
                📞 CALL
              </a>
            )}
            {profile.email && (
              <a href={`mailto:${profile.email}`} aria-label={`Email ${profile.name}`}
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "20px", background: P.badgeBg, border: `1.5px solid ${P.badgeBorder}`, color: P.text, textDecoration: "none", fontFamily: "'Outfit', sans-serif", fontSize: "12px", fontWeight: 600 }}>
                ✉️ EMAIL
              </a>
            )}
            {profile.website && (
              <a href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${profile.name}'s website`}
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "20px", background: P.badgeBg, border: `1.5px solid ${P.badgeBorder}`, color: P.text, textDecoration: "none", fontFamily: "'Outfit', sans-serif", fontSize: "12px", fontWeight: 600 }}>
                🌐 WEBSITE
              </a>
            )}
          </div>
        )}

      </div>
    </article>
  );
}
