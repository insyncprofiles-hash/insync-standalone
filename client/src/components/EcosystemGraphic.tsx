import { useState } from "react";

// ── InSync Profiles Ecosystem Graphic ─────────────────────────────────────
// Colours drawn from the InSync Profiles logo arcs:
//   Steel Blue   #4a7ab5  (top-left arc)
//   Warm Gold    #c9a84c  (top-right arc)
//   Copper       #a0522d  (bottom-left arc)
//   Olive/Khaki  #7a8c3a  (bottom-right arc)
//   Burnt Violet #6b3fa0  (fifth profile — user-specified)

const W = 900;
const H = 900;
const CX = W / 2;
const CY = H / 2;

const INNER_R = 185; // profile type nodes
const OUTER_R = 345; // destination nodes
const DEST_R  = 50;  // destination circle base radius (larger to fit text)

// ── PROFILE TYPES (inner ring) ────────────────────────────────────────────
// Exact metallic colours sampled from InSync Profiles logo arcs
// Each profile circle uses a metallic gradient: mid-tone base + lighter highlight
const profileTypes = [
  {
    id: "support-worker",
    label: "Support Worker\nProfile",
    emoji: "🤝",
    color: "#4b7aa8",      // steel blue — logo top-left arc
    colorLight: "#7aafd4", // highlight
    colorDark: "#274760",  // shadow
    textColor: "#ffffff",
    href: "/editor",
    angle: -90,
  },
  {
    id: "allied-health",
    label: "Allied Health\nProfile",
    emoji: "🩺",
    color: "#c89e6c",      // warm gold — logo top-right arc
    colorLight: "#e8c98a", // highlight
    colorDark: "#8a6030",  // shadow
    textColor: "#1a0e00",
    href: "/allied-health",
    angle: -18,
  },
  {
    id: "coordinator",
    label: "Support Coordinator\nProfile",
    emoji: "📋",
    color: "#9f5e38",      // copper — logo bottom-left arc
    colorLight: "#c8845a", // highlight
    colorDark: "#5a2e10",  // shadow
    textColor: "#ffffff",
    href: "/coordinators",
    angle: 54,
  },
  {
    id: "about-me-disability",
    label: "About Me Profile\n(Disability / NDIS)",
    emoji: "♿",
    color: "#746e4a",      // olive/khaki — logo bottom-right arc
    colorLight: "#a09a70", // highlight
    colorDark: "#3a3820",  // shadow
    textColor: "#ffffff",
    href: "/about-me/editor",
    angle: 126,
  },
  {
    id: "about-me-aged",
    label: "About Me Profile\n(Aged Care)",
    emoji: "🌿",
    color: "#6b3fa0",      // burnt violet — user specified
    colorLight: "#9a6ad0", // highlight
    colorDark: "#3a1860",  // shadow
    textColor: "#ffffff",
    href: "/about-me/editor",
    angle: 198,
  },
];

// ── DESTINATIONS (outer ring) ─────────────────────────────────────────────
// White fill, coloured border + text
const destinations = [
  { id: "participants",  label: "NDIS Participants\n& Families",    emoji: "👨‍👩‍👧", color: "#4a7ab5", angle: -110, profiles: ["support-worker", "about-me-disability", "coordinator"] },
  { id: "aged-persons",  label: "Aged Persons\n& Carers",           emoji: "👴",    color: "#6b3fa0", angle: -60,  profiles: ["about-me-aged", "support-worker"] },
  { id: "hospitals",     label: "Hospitals\n& Ward Staff",          emoji: "🏥",    color: "#be123c", angle: -15,  profiles: ["about-me-disability", "about-me-aged", "allied-health"] },
  { id: "ndis-providers",label: "NDIS Providers\n& Services",       emoji: "🏢",    color: "#a0522d", angle: 30,   profiles: ["support-worker", "allied-health", "coordinator", "about-me-disability"] },
  { id: "aged-facilities",label: "Aged Care\nFacilities",           emoji: "🏡",    color: "#7a8c3a", angle: 75,   profiles: ["about-me-aged", "support-worker"] },
  { id: "schools",       label: "Schools &\nTherapists",            emoji: "📚",    color: "#c9a84c", angle: 120,  profiles: ["about-me-disability", "allied-health"] },
  { id: "new-workers",   label: "New Support\nWorkers",             emoji: "🤲",    color: "#4a7ab5", angle: 165,  profiles: ["support-worker", "about-me-disability", "about-me-aged"] },
  { id: "sah",           label: "SAH Recipients\n& Home Care",      emoji: "🏠",    color: "#6b3fa0", angle: 210,  profiles: ["about-me-aged", "coordinator"] },
  { id: "self-advocacy", label: "Participants\nSelf-Advocacy",      emoji: "✊",    color: "#7a8c3a", angle: 255,  profiles: ["about-me-disability", "coordinator"] },
];

function toRad(deg: number) { return (deg * Math.PI) / 180; }
function nodePos(r: number, angleDeg: number) {
  return { x: CX + r * Math.cos(toRad(angleDeg)), y: CY + r * Math.sin(toRad(angleDeg)) };
}

export default function EcosystemGraphic() {
  const [hovered, setHovered] = useState<string | null>(null);

  function isLineActive(profileId: string, destId: string) {
    if (!hovered) return false;
    const destProfiles = destinations.find(d => d.id === destId)?.profiles ?? [];
    if (hovered === profileId) return destProfiles.includes(profileId);
    if (hovered === destId)    return destProfiles.includes(profileId);
    return false;
  }

  function profileDimmed(id: string) {
    if (!hovered) return false;
    if (hovered === id) return false;
    // If a destination is hovered, keep its connected profiles bright
    const hoveredDest = destinations.find(d => d.id === hovered);
    if (hoveredDest) return !hoveredDest.profiles.includes(id);
    return true;
  }

  function destDimmed(id: string) {
    if (!hovered) return false;
    if (hovered === id) return false;
    // If a profile is hovered, keep its connected destinations bright
    const hoveredProfile = profileTypes.find(p => p.id === hovered);
    if (hoveredProfile) {
      return !destinations.find(d => d.id === id)?.profiles.includes(hoveredProfile.id);
    }
    return true;
  }

  return (
    <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto", padding: "0 8px" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        aria-label="InSync Profiles Ecosystem — profile types connected to destinations"
        role="img"
      >
        <defs>
          <radialGradient id="centreGrad" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#2a2a3a" />
            <stop offset="100%" stopColor="#0f0f1a" />
          </radialGradient>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="softglow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Clip path for logo image inside centre circle */}
          <clipPath id="centreClip">
            <circle cx={CX} cy={CY} r={66} />
          </clipPath>
        </defs>

        {/* ── Background guide rings ── */}
        <circle cx={CX} cy={CY} r={INNER_R + 12} fill="none" stroke="#d1d5db" strokeWidth="1" strokeDasharray="4 7" opacity="0.4" />
        <circle cx={CX} cy={CY} r={OUTER_R + 12} fill="none" stroke="#d1d5db" strokeWidth="1" strokeDasharray="4 7" opacity="0.3" />

        {/* ── Connection lines ── */}
        {profileTypes.map(profile =>
          destinations
            .filter(dest => dest.profiles.includes(profile.id))
            .map(dest => {
              const from = nodePos(INNER_R, profile.angle);
              const to   = nodePos(OUTER_R, dest.angle);
              const active = isLineActive(profile.id, dest.id);
              const dimmed = hovered && !active;
              return (
                <line
                  key={`${profile.id}-${dest.id}`}
                  x1={from.x} y1={from.y}
                  x2={to.x}   y2={to.y}
                  stroke={active ? profile.color : "#9ca3af"}
                  strokeWidth={active ? 2.5 : 1}
                  opacity={dimmed ? 0.08 : active ? 0.9 : 0.28}
                  style={{ transition: "all 200ms ease-out" }}
                />
              );
            })
        )}

        {/* ── Centre: logo image + dark circle ── */}
        <circle cx={CX} cy={CY} r={72} fill="url(#centreGrad)" filter="url(#glow)" />
        {/* Logo image clipped to circle */}
        <image
          href="/assets/insync-logo-transparent_9e0df532.png"
          x={CX - 54} y={CY - 54}
          width={108} height={108}
          clipPath="url(#centreClip)"
          preserveAspectRatio="xMidYMid meet"
          style={{ imageRendering: "auto" }}
        />
        {/* Gold ring border */}
        <circle cx={CX} cy={CY} r={72} fill="none" stroke="#c9a84c" strokeWidth="2.5" opacity="0.8" />

        {/* ── Metallic gradient defs for each profile ── */}
        {profileTypes.map(p => (
          <defs key={`grad-${p.id}`}>
            <radialGradient id={`grad-${p.id}`} cx="38%" cy="32%" r="65%">
              <stop offset="0%"   stopColor={p.colorLight} />
              <stop offset="45%"  stopColor={p.color} />
              <stop offset="100%" stopColor={p.colorDark} />
            </radialGradient>
          </defs>
        ))}

        {/* ── Inner ring: Profile types (metallic gradient fill) ── */}
        {profileTypes.map(profile => {
          const pos    = nodePos(INNER_R, profile.angle);
          const dimmed = profileDimmed(profile.id);
          const active = hovered === profile.id;
          const lines  = profile.label.split("\n");
          const r      = active ? 58 : 54;
          return (
            <g
              key={profile.id}
              style={{ cursor: "pointer", transition: "opacity 200ms ease-out" }}
              opacity={dimmed ? 0.2 : 1}
              onMouseEnter={() => setHovered(profile.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => { window.location.href = profile.href; }}
              role="link"
              aria-label={profile.label.replace("\n", " ")}
            >
              {/* Metallic gradient fill circle */}
              <circle
                cx={pos.x} cy={pos.y} r={r}
                fill={`url(#grad-${profile.id})`}
                stroke={active ? "#ffffff" : "rgba(255,255,255,0.35)"}
                strokeWidth={active ? 2.5 : 1.5}
                filter={active ? "url(#softglow)" : undefined}
                style={{ transition: "all 180ms ease-out" }}
              />
              {/* Emoji */}
              <text x={pos.x} y={pos.y - 16} textAnchor="middle" fontSize="18">{profile.emoji}</text>
              {/* Label lines */}
              {lines.map((line, i) => (
                <text
                  key={i}
                  x={pos.x}
                  y={pos.y + (lines.length === 1 ? 6 : 0) + i * 13}
                  textAnchor="middle"
                  fontFamily="'Outfit', 'Nunito', sans-serif"
                  fontWeight="800"
                  fontSize="9"
                  fill={profile.textColor}
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}

        {/* ── Outer ring: Destinations (white fill, coloured border) ── */}
        {destinations.map(dest => {
          const pos    = nodePos(OUTER_R, dest.angle);
          const dimmed = destDimmed(dest.id);
          const active = hovered === dest.id;
          const lines  = dest.label.split("\n");
          // Auto-size: longer text → slightly bigger circle
          const maxLen = Math.max(...lines.map(l => l.length));
          const r      = active ? DEST_R + 6 : Math.max(DEST_R, DEST_R + (maxLen - 12) * 0.8);
          return (
            <g
              key={dest.id}
              style={{ cursor: "default", transition: "opacity 200ms ease-out" }}
              opacity={dimmed ? 0.15 : 1}
              onMouseEnter={() => setHovered(dest.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* White fill circle with coloured border */}
              <circle
                cx={pos.x} cy={pos.y} r={r}
                fill="#ffffff"
                stroke={dest.color}
                strokeWidth={active ? 3 : 2}
                filter={active ? "url(#softglow)" : undefined}
                style={{ transition: "all 180ms ease-out" }}
              />
              {/* Emoji */}
              <text x={pos.x} y={pos.y - 13} textAnchor="middle" fontSize="16">{dest.emoji}</text>
              {/* Label lines */}
              {lines.map((line, i) => (
                <text
                  key={i}
                  x={pos.x}
                  y={pos.y + 3 + i * 12}
                  textAnchor="middle"
                  fontFamily="'Outfit', 'Nunito', sans-serif"
                  fontWeight="700"
                  fontSize="8.5"
                  fill={dest.color}
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}

        {/* ── Hint text ── */}
        <text x={CX} y={H - 16} textAnchor="middle" fontFamily="'Outfit', 'Nunito', sans-serif" fontWeight="500" fontSize="11" fill="#9ca3af">
          Hover a node to see connections · Click a profile type to explore
        </text>
      </svg>

      {/* Mobile legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginTop: "20px" }}>
        {profileTypes.map(p => (
          <a
            key={p.id}
            href={p.href}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: p.color,
              borderRadius: "20px", padding: "7px 16px",
              fontFamily: "'Outfit', 'Nunito', sans-serif",
              fontWeight: 800, fontSize: "12px", color: p.textColor,
              textDecoration: "none",
              boxShadow: `0 2px 8px ${p.color}55`,
            }}
          >
            {p.emoji} {p.label.replace("\n", " ")}
          </a>
        ))}
      </div>
    </div>
  );
}
