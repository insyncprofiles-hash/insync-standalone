import { useState } from "react";

// ── InSync Profiles Ecosystem Graphic ─────────────────────────────────────
// Interactive SVG showing profile types (inner ring) and destinations (outer ring)
// connected by animated lines from the InSync Profiles centre.

const W = 800;
const H = 800;
const CX = W / 2;
const CY = H / 2;

const INNER_R = 165; // profile type nodes
const OUTER_R = 310; // destination nodes

// ── PROFILE TYPES (inner ring) ────────────────────────────────────────────
const profileTypes = [
  {
    id: "support-worker",
    label: "Support Worker\nProfile",
    emoji: "🤝",
    color: "#1e3a8a",
    light: "#dbeafe",
    href: "/editor",
    angle: -90,
  },
  {
    id: "allied-health",
    label: "Allied Health\nProfile",
    emoji: "🩺",
    color: "#0f766e",
    light: "#ccfbf1",
    href: "/allied-health",
    angle: -18,
  },
  {
    id: "coordinator",
    label: "Support Coordinator\nProfile",
    emoji: "📋",
    color: "#7c3aed",
    light: "#ede9fe",
    href: "/coordinators",
    angle: 54,
  },
  {
    id: "about-me-disability",
    label: "About Me Profile\n(Disability / NDIS)",
    emoji: "♿",
    color: "#1d4ed8",
    light: "#eff6ff",
    href: "/about-me/editor",
    angle: 126,
  },
  {
    id: "about-me-aged",
    label: "About Me Profile\n(Aged Care)",
    emoji: "🌿",
    color: "#b45309",
    light: "#fef3c7",
    href: "/about-me/editor",
    angle: 198,
  },
];

// ── DESTINATIONS (outer ring) ─────────────────────────────────────────────
const destinations = [
  { id: "participants", label: "NDIS Participants\n& Families", emoji: "👨‍👩‍👧", color: "#1e40af", angle: -110, profiles: ["support-worker", "about-me-disability", "coordinator"] },
  { id: "aged-persons", label: "Aged Persons\n& Carers", emoji: "👴", color: "#92400e", angle: -60, profiles: ["about-me-aged", "support-worker"] },
  { id: "hospitals", label: "Hospitals\n& Ward Staff", emoji: "🏥", color: "#be123c", angle: -15, profiles: ["about-me-disability", "about-me-aged", "allied-health"] },
  { id: "ndis-providers", label: "NDIS Providers\n& Services", emoji: "🏢", color: "#0f766e", angle: 30, profiles: ["support-worker", "allied-health", "coordinator", "about-me-disability"] },
  { id: "aged-facilities", label: "Aged Care\nFacilities", emoji: "🏡", color: "#b45309", angle: 75, profiles: ["about-me-aged", "support-worker"] },
  { id: "schools", label: "Schools &\nTherapists", emoji: "📚", color: "#7c3aed", angle: 120, profiles: ["about-me-disability", "allied-health"] },
  { id: "new-workers", label: "New Support\nWorkers", emoji: "🤲", color: "#1e3a8a", angle: 165, profiles: ["support-worker", "about-me-disability", "about-me-aged"] },
  { id: "sah", label: "SAH Recipients\n& Home Care", emoji: "🏠", color: "#0369a1", angle: 210, profiles: ["about-me-aged", "coordinator"] },
  { id: "participants2", label: "Participants\nSelf-Advocacy", emoji: "✊", color: "#1d4ed8", angle: 255, profiles: ["about-me-disability", "coordinator"] },
];

function toRad(deg: number) { return (deg * Math.PI) / 180; }
function nodePos(r: number, angleDeg: number) {
  return { x: CX + r * Math.cos(toRad(angleDeg)), y: CY + r * Math.sin(toRad(angleDeg)) };
}

export default function EcosystemGraphic() {
  const [hovered, setHovered] = useState<string | null>(null);

  // Determine which connections to highlight
  const activeProfileIds = hovered
    ? profileTypes.filter(p => p.id === hovered).map(p => p.id)
      .concat(destinations.find(d => d.id === hovered)?.profiles ?? [])
    : [];
  const activeDestIds = hovered
    ? destinations.filter(d => d.id === hovered).map(d => d.id)
      .concat(destinations.filter(d => d.profiles.includes(hovered ?? "")).map(d => d.id))
    : [];

  function isLineActive(profileId: string, destId: string) {
    if (!hovered) return false;
    if (hovered === profileId) return destinations.find(d => d.id === destId)?.profiles.includes(profileId) ?? false;
    if (hovered === destId) return destinations.find(d => d.id === destId)?.profiles.includes(profileId) ?? false;
    return false;
  }

  return (
    <div style={{ width: "100%", maxWidth: "820px", margin: "0 auto", padding: "0 8px" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        aria-label="InSync Profiles Ecosystem — profile types connected to destinations"
        role="img"
      >
        <defs>
          {/* Radial gradient for centre circle */}
          <radialGradient id="centreGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
          {/* Glow filter */}
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="softglow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Background subtle rings ── */}
        <circle cx={CX} cy={CY} r={INNER_R + 10} fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 6" opacity="0.5" />
        <circle cx={CX} cy={CY} r={OUTER_R + 10} fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />

        {/* ── Connection lines: profile → destination ── */}
        {profileTypes.map(profile =>
          destinations
            .filter(dest => dest.profiles.includes(profile.id))
            .map(dest => {
              const from = nodePos(INNER_R, profile.angle);
              const to = nodePos(OUTER_R, dest.angle);
              const active = isLineActive(profile.id, dest.id);
              const dimmed = hovered && !active;
              return (
                <line
                  key={`${profile.id}-${dest.id}`}
                  x1={from.x} y1={from.y}
                  x2={to.x} y2={to.y}
                  stroke={active ? profile.color : "#cbd5e1"}
                  strokeWidth={active ? 2.5 : 1}
                  opacity={dimmed ? 0.12 : active ? 0.85 : 0.35}
                  style={{ transition: "all 200ms ease-out" }}
                />
              );
            })
        )}

        {/* ── Centre: InSync Profiles ── */}
        <circle cx={CX} cy={CY} r={70} fill="url(#centreGrad)" filter="url(#glow)" />
        <circle cx={CX} cy={CY} r={70} fill="none" stroke="#fcd34d" strokeWidth="2.5" opacity="0.7" />
        <text x={CX} y={CY - 14} textAnchor="middle" fontFamily="'Outfit', 'Nunito', sans-serif" fontWeight="900" fontSize="13" fill="#fcd34d" letterSpacing="0.5">InSync</text>
        <text x={CX} y={CY + 4} textAnchor="middle" fontFamily="'Outfit', 'Nunito', sans-serif" fontWeight="900" fontSize="13" fill="#fcd34d" letterSpacing="0.5">Profiles</text>
        <text x={CX} y={CY + 22} textAnchor="middle" fontFamily="'Outfit', 'Nunito', sans-serif" fontWeight="700" fontSize="10" fill="#93c5fd" letterSpacing="0.3">Ecosystem</text>

        {/* ── Inner ring: Profile types ── */}
        {profileTypes.map(profile => {
          const pos = nodePos(INNER_R, profile.angle);
          const dimmed = hovered && hovered !== profile.id && !activeProfileIds.includes(profile.id);
          const active = hovered === profile.id;
          const lines = profile.label.split("\n");
          return (
            <g
              key={profile.id}
              style={{ cursor: "pointer", transition: "opacity 200ms ease-out" }}
              opacity={dimmed ? 0.25 : 1}
              onMouseEnter={() => setHovered(profile.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => { window.location.href = profile.href; }}
              role="link"
              aria-label={profile.label.replace("\n", " ")}
            >
              <circle
                cx={pos.x} cy={pos.y} r={active ? 46 : 42}
                fill={profile.light}
                stroke={profile.color}
                strokeWidth={active ? 3 : 2}
                filter={active ? "url(#softglow)" : undefined}
                style={{ transition: "all 180ms ease-out" }}
              />
              <text x={pos.x} y={pos.y - 14} textAnchor="middle" fontSize="20">{profile.emoji}</text>
              {lines.map((line, i) => (
                <text
                  key={i}
                  x={pos.x}
                  y={pos.y + 4 + i * 13}
                  textAnchor="middle"
                  fontFamily="'Outfit', 'Nunito', sans-serif"
                  fontWeight="800"
                  fontSize="9.5"
                  fill={profile.color}
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}

        {/* ── Outer ring: Destinations ── */}
        {destinations.map(dest => {
          const pos = nodePos(OUTER_R, dest.angle);
          const dimmed = hovered && hovered !== dest.id && !activeDestIds.includes(dest.id);
          const active = hovered === dest.id;
          const lines = dest.label.split("\n");
          return (
            <g
              key={dest.id}
              style={{ cursor: "default", transition: "opacity 200ms ease-out" }}
              opacity={dimmed ? 0.20 : 1}
              onMouseEnter={() => setHovered(dest.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <circle
                cx={pos.x} cy={pos.y} r={active ? 40 : 36}
                fill="#ffffff"
                stroke={dest.color}
                strokeWidth={active ? 3 : 1.5}
                filter={active ? "url(#softglow)" : undefined}
                style={{ transition: "all 180ms ease-out" }}
              />
              <text x={pos.x} y={pos.y - 12} textAnchor="middle" fontSize="17">{dest.emoji}</text>
              {lines.map((line, i) => (
                <text
                  key={i}
                  x={pos.x}
                  y={pos.y + 4 + i * 12}
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

        {/* ── Legend label ── */}
        <text x={CX} y={H - 18} textAnchor="middle" fontFamily="'Outfit', 'Nunito', sans-serif" fontWeight="600" fontSize="11" fill="#94a3b8">
          Hover a profile type or destination to see connections · Click a profile to explore
        </text>
      </svg>

      {/* Mobile-friendly legend below SVG */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginTop: "16px" }}>
        {profileTypes.map(p => (
          <a
            key={p.id}
            href={p.href}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: p.light, border: `2px solid ${p.color}`,
              borderRadius: "20px", padding: "6px 14px",
              fontFamily: "'Outfit', 'Nunito', sans-serif",
              fontWeight: 800, fontSize: "12px", color: p.color,
              textDecoration: "none",
            }}
          >
            {p.emoji} {p.label.replace("\n", " ")}
          </a>
        ))}
      </div>
    </div>
  );
}
