import { useState } from "react";

// ── InSync Profiles Ecosystem Graphic ─────────────────────────────────────
// Uses a tall viewBox (900×1400) so the diagram fits on mobile portrait
// without any circles being clipped or overlapping.
// Profile types: inner ring at r=210, circle r=78
// Destinations:  outer ring at r=420, circle r=58
// Canvas is tall enough that all 9 destination nodes fit within bounds.

const W  = 900;
const H  = 1400;
const CX = W / 2;
const CY = 680; // centre pushed down slightly so top nodes have room

const PROFILE_R  = 210;
const DEST_R_POS = 420;
const PROFILE_CR = 78;
const DEST_CR    = 58;

function toRad(deg: number) { return (deg * Math.PI) / 180; }
function nodePos(r: number, angleDeg: number) {
  return { x: CX + r * Math.cos(toRad(angleDeg)), y: CY + r * Math.sin(toRad(angleDeg)) };
}

// Profile types — 5 nodes, 72° apart
const profileTypes = [
  { id: "support-worker",       label: ["Support Worker", "Profile"],            emoji: "🤝", color: "#4b7aa8", colorLight: "#7aafd4", colorDark: "#1e3d58", textColor: "#ffffff", href: "/view",            angle: -90 },
  { id: "allied-health",        label: ["Allied Health", "Profile"],             emoji: "🩺", color: "#c89e6c", colorLight: "#e8c98a", colorDark: "#7a5820", textColor: "#1a0800", href: "/alliedhealth/view", angle: -18 },
  { id: "coordinator",          label: ["Support Coordinator", "Profile"],       emoji: "📋", color: "#9f5e38", colorLight: "#c8845a", colorDark: "#4a2010", textColor: "#ffffff", href: "/coordinators",    angle: 54  },
  { id: "about-me-disability",  label: ["About Me Profile", "(Disability/NDIS)"],emoji: "♿", color: "#746e4a", colorLight: "#a09a70", colorDark: "#302e18", textColor: "#ffffff", href: "/about-me/editor", angle: 126 },
  { id: "about-me-aged",        label: ["About Me Profile", "(Aged Care)"],      emoji: "🌿", color: "#6b3fa0", colorLight: "#9a6ad0", colorDark: "#2e1060", textColor: "#ffffff", href: "/about-me/editor", angle: 198 },
];

// Destinations — 9 nodes, manually spaced to avoid overlap
// Min angular gap needed = 2 * arcsin(DEST_CR / DEST_R_POS) ≈ 2 * arcsin(58/420) ≈ 15.8°
// Using ~38° average gap across 9 nodes (360/9 = 40°) — safe
const destinations = [
  { id: "participants",    label: ["NDIS Participants", "& Families"],     emoji: "👨‍👩‍👧", color: "#1e3a8a", angle: -108, profiles: ["support-worker","about-me-disability","coordinator"] },
  { id: "aged-persons",    label: ["Aged Persons", "& Carers"],            emoji: "👴",    color: "#6b3fa0", angle: -68,  profiles: ["about-me-aged","support-worker"] },
  { id: "hospitals",       label: ["Hospitals", "& Ward Staff"],           emoji: "🏥",    color: "#be123c", angle: -28,  profiles: ["about-me-disability","about-me-aged","allied-health"] },
  { id: "ndis-providers",  label: ["NDIS Providers", "& Services"],        emoji: "🏢",    color: "#9f5e38", angle: 12,   profiles: ["support-worker","allied-health","coordinator","about-me-disability"] },
  { id: "aged-facilities", label: ["Aged Care", "Facilities"],             emoji: "🏡",    color: "#746e4a", angle: 52,   profiles: ["about-me-aged","support-worker"] },
  { id: "schools",         label: ["Schools &", "Therapists"],             emoji: "📚",    color: "#c89e6c", angle: 92,   profiles: ["about-me-disability","allied-health"] },
  { id: "new-workers",     label: ["New Support", "Workers"],              emoji: "🤲",    color: "#4b7aa8", angle: 148,  profiles: ["support-worker","about-me-disability","about-me-aged"] },
  { id: "sah",             label: ["SAH Recipients", "& Home Care"],       emoji: "🏠",    color: "#6b3fa0", angle: 208,  profiles: ["about-me-aged","coordinator"] },
  { id: "self-advocacy",   label: ["Participants", "Self-Advocacy"],       emoji: "✊",    color: "#746e4a", angle: 252,  profiles: ["about-me-disability","coordinator"] },
];

export default function EcosystemGraphic() {
  const [hovered, setHovered] = useState<string | null>(null);

  function isLineActive(profileId: string, destId: string) {
    if (!hovered) return false;
    const dp = destinations.find(d => d.id === destId)?.profiles ?? [];
    if (hovered === profileId) return dp.includes(profileId);
    if (hovered === destId)    return dp.includes(profileId);
    return false;
  }
  function profileDimmed(id: string) {
    if (!hovered) return false;
    if (hovered === id) return false;
    const hd = destinations.find(d => d.id === hovered);
    if (hd) return !hd.profiles.includes(id);
    return true;
  }
  function destDimmed(id: string) {
    if (!hovered) return false;
    if (hovered === id) return false;
    const hp = profileTypes.find(p => p.id === hovered);
    if (hp) return !destinations.find(d => d.id === id)?.profiles.includes(hp.id);
    return true;
  }

  return (
    <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto", padding: "0 4px" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        aria-label="InSync Profiles Ecosystem"
        role="img"
      >
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#f0f4ff" />
            <stop offset="100%" stopColor="#e4eaf8" />
          </radialGradient>
          <radialGradient id="centreGrad" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#2a2a3a" />
            <stop offset="100%" stopColor="#0a0a18" />
          </radialGradient>
          <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="softglow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="dropshadow">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#00000033" />
          </filter>
          <clipPath id="centreClip">
            <circle cx={CX} cy={CY} r={82} />
          </clipPath>
          {profileTypes.map(p => (
            <radialGradient key={`g-${p.id}`} id={`g-${p.id}`} cx="35%" cy="28%" r="70%">
              <stop offset="0%"   stopColor={p.colorLight} />
              <stop offset="50%"  stopColor={p.color} />
              <stop offset="100%" stopColor={p.colorDark} />
            </radialGradient>
          ))}
        </defs>

        {/* Background */}
        <rect x="0" y="0" width={W} height={H} fill="url(#bgGrad)" rx="20" />

        {/* Title */}
        <text x={CX} y={52} textAnchor="middle" fontFamily="'Outfit','Nunito',sans-serif" fontWeight="900" fontSize="28" fill="#1e3a8a">
          The InSync Profiles Ecosystem
        </text>
        <text x={CX} y={84} textAnchor="middle" fontFamily="'Outfit','Nunito',sans-serif" fontWeight="600" fontSize="15" fill="#4a5568">
          Profile types · Who they serve · Where they travel
        </text>

        {/* Guide rings */}
        <circle cx={CX} cy={CY} r={PROFILE_R + 14} fill="none" stroke="#c7d2e8" strokeWidth="1.5" strokeDasharray="6 9" opacity="0.5" />
        <circle cx={CX} cy={CY} r={DEST_R_POS + 14} fill="none" stroke="#c7d2e8" strokeWidth="1.5" strokeDasharray="6 9" opacity="0.35" />

        {/* Connection lines */}
        {profileTypes.map(profile =>
          destinations
            .filter(dest => dest.profiles.includes(profile.id))
            .map(dest => {
              const from   = nodePos(PROFILE_R, profile.angle);
              const to     = nodePos(DEST_R_POS, dest.angle);
              const active = isLineActive(profile.id, dest.id);
              const dimmed = hovered && !active;
              return (
                <line
                  key={`${profile.id}-${dest.id}`}
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={active ? profile.color : "#8fa0c0"}
                  strokeWidth={active ? 3 : 1}
                  opacity={dimmed ? 0.04 : active ? 0.9 : 0.2}
                  style={{ transition: "all 200ms ease-out" }}
                />
              );
            })
        )}

        {/* Centre */}
        <circle cx={CX} cy={CY} r={88} fill="url(#centreGrad)" filter="url(#glow)" />
        <image href="/assets/insync-logo-transparent_9e0df532.png" x={CX-70} y={CY-70} width={140} height={140} clipPath="url(#centreClip)" preserveAspectRatio="xMidYMid meet" />
        <circle cx={CX} cy={CY} r={88} fill="none" stroke="#c89e6c" strokeWidth="3" opacity="0.9" />

        {/* Profile type circles */}
        {profileTypes.map(profile => {
          const pos    = nodePos(PROFILE_R, profile.angle);
          const dimmed = profileDimmed(profile.id);
          const active = hovered === profile.id;
          const r      = active ? PROFILE_CR + 8 : PROFILE_CR;
          return (
            <g
              key={profile.id}
              style={{ cursor: "pointer", transition: "opacity 200ms ease-out" }}
              opacity={dimmed ? 0.18 : 1}
              onMouseEnter={() => setHovered(profile.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => { window.location.href = profile.href; }}
            >
              {/* Outer glow ring */}
              <circle cx={pos.x} cy={pos.y} r={r + 5} fill="none" stroke={profile.colorLight} strokeWidth="1.5" opacity="0.4" />
              {/* Main circle */}
              <circle
                cx={pos.x} cy={pos.y} r={r}
                fill={`url(#g-${profile.id})`}
                stroke={active ? "#ffffff" : profile.colorLight}
                strokeWidth={active ? 3 : 2}
                filter={active ? "url(#softglow)" : "url(#dropshadow)"}
                style={{ transition: "all 180ms ease-out" }}
              />
              {/* Emoji */}
              <text x={pos.x} y={pos.y - 26} textAnchor="middle" fontSize="26" dominantBaseline="middle">{profile.emoji}</text>
              {/* Label line 1 */}
              <text x={pos.x} y={pos.y + 8}  textAnchor="middle" fontFamily="'Outfit','Nunito',sans-serif" fontWeight="900" fontSize="14" fill={profile.textColor}>{profile.label[0]}</text>
              {/* Label line 2 */}
              <text x={pos.x} y={pos.y + 26} textAnchor="middle" fontFamily="'Outfit','Nunito',sans-serif" fontWeight="900" fontSize="13" fill={profile.textColor}>{profile.label[1]}</text>
            </g>
          );
        })}

        {/* Destination circles */}
        {destinations.map(dest => {
          const pos    = nodePos(DEST_R_POS, dest.angle);
          const dimmed = destDimmed(dest.id);
          const active = hovered === dest.id;
          const r      = active ? DEST_CR + 6 : DEST_CR;
          return (
            <g
              key={dest.id}
              style={{ cursor: "default", transition: "opacity 200ms ease-out" }}
              opacity={dimmed ? 0.1 : 1}
              onMouseEnter={() => setHovered(dest.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <circle
                cx={pos.x} cy={pos.y} r={r}
                fill="#ffffff"
                stroke={dest.color}
                strokeWidth={active ? 3.5 : 2.5}
                filter="url(#dropshadow)"
                style={{ transition: "all 180ms ease-out" }}
              />
              {/* Emoji */}
              <text x={pos.x} y={pos.y - 14} textAnchor="middle" fontSize="18" dominantBaseline="middle">{dest.emoji}</text>
              {/* Label line 1 */}
              <text x={pos.x} y={pos.y + 6}  textAnchor="middle" fontFamily="'Outfit','Nunito',sans-serif" fontWeight="800" fontSize="11" fill={dest.color}>{dest.label[0]}</text>
              {/* Label line 2 */}
              <text x={pos.x} y={pos.y + 20} textAnchor="middle" fontFamily="'Outfit','Nunito',sans-serif" fontWeight="800" fontSize="11" fill={dest.color}>{dest.label[1]}</text>
            </g>
          );
        })}

        {/* Hint */}
        <text x={CX} y={H - 30} textAnchor="middle" fontFamily="'Outfit','Nunito',sans-serif" fontWeight="600" fontSize="13" fill="#6b7280">
          Hover a node to see connections · Tap a profile type to explore
        </text>
      </svg>

      {/* Legend pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginTop: "20px", padding: "0 8px" }}>
        {profileTypes.map(p => (
          <a key={p.id} href={p.href} style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: `linear-gradient(135deg, ${p.colorLight}, ${p.color})`,
            borderRadius: "24px", padding: "10px 20px",
            fontFamily: "'Outfit','Nunito',sans-serif", fontWeight: 900, fontSize: "13px",
            color: p.textColor, textDecoration: "none",
            boxShadow: `0 3px 10px ${p.colorDark}66`,
          }}>
            {p.emoji} {p.label.join(" ")}
          </a>
        ))}
      </div>
    </div>
  );
}
