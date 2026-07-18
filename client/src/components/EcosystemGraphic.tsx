import { useState } from "react";

// ── InSync Profiles Ecosystem Graphic ─────────────────────────────────────
// Uses a tall viewBox (900×1400) so the diagram fits on mobile portrait
// without any circles being clipped or overlapping.
// Profile types: inner ring at r=210, circle r=78
// Destinations:  outer ring at r=420, circle r=58
// Canvas is tall enough that all 9 destination nodes fit within bounds.
//
// Interaction model:
//   Desktop: hover to highlight connections, click to navigate
//   Mobile:  first tap selects & shows connections (with a "View sample" button),
//            tap empty space to deselect, tap the button to navigate

const W  = 900;
const H  = 1400;
const CX = W / 2;
const CY = 680; // centre pushed down slightly so top nodes have room

const PROFILE_R  = 210;
const DEST_R_POS = 420;
const PROFILE_CR = 78;
const DEST_CR    = 72;

function toRad(deg: number) { return (deg * Math.PI) / 180; }
function nodePos(r: number, angleDeg: number) {
  return { x: CX + r * Math.cos(toRad(angleDeg)), y: CY + r * Math.sin(toRad(angleDeg)) };
}

// Profile types — 5 nodes, 72° apart
const profileTypes = [
  { id: "support-worker",       label: ["Support Worker", "Profile"],            emoji: "🤝", color: "#4b7aa8", colorLight: "#7aafd4", colorDark: "#1e3d58", textColor: "#ffffff", href: "/view",            angle: -90 },
  { id: "allied-health",        label: ["Allied Health", "Profile"],             emoji: "🩺", color: "#c89e6c", colorLight: "#e8c98a", colorDark: "#7a5820", textColor: "#1a0800", href: "https://insyncprofiles.net/view?name=Sarah+Torens&title=Occupational+Therapist&tagline=I+meet+you+where+you+are+%E2%80%94+and+we+go+from+there.&roleType=allied-health&bio=Hi%2C+I%27m+Sarah+%E2%80%94+an+OT+based+in+Queensland+with+a+special+interest+in+working+with+children+and+young+people+with+intellectual+and+developmental+disabilities.%0A%0AI+believe+the+best+therapy+happens+when+the+person+in+front+of+me+is+actually+part+of+it.+That+means+starting+with+what+they+love%2C+what+lights+them+up%2C+and+what+matters+to+their+family+%E2%80%94+not+a+checklist.%0A%0AAs+an+OT%2C+I+work+on+the+things+that+matter+in+everyday+life+%E2%80%94+building+independence+in+daily+living+tasks%2C+assessing+functional+capacity%2C+recommending+assistive+technology%2C+supporting+sensory+regulation%2C+and+helping+participants+and+their+families+develop+strategies+they+can+use+between+sessions.+I+also+work+closely+with+schools%2C+carers%2C+and+support+teams+to+make+sure+the+plan+carries+through+everywhere+it+needs+to.%0A%0AI+work+across+remote+and+regional+Queensland+and+I%27m+experienced+in+supporting+participants+with+global+developmental+delay%2C+low+muscle+tone%2C+and+building+walking+endurance+through+fun%2C+meaningful+activity.%0A%0ABefore+I+travel+to+your+town%2C+I%27d+love+to+hear+from+Ky+and+the+family.+If+Ky+wants+to+let+me+know+anything+%E2%80%94+what+he%27s+excited+about%2C+what+he%27s+worried+about%2C+or+just+say+hi+%E2%80%94+he+can+use+the+Speak+to+Message+button+or+the+AAC+board+on+this+page.+No+typing+needed.%0A%0AI%27m+registered+with+AHPRA+and+a+member+of+Occupational+Therapy+Australia.+I+hold+a+current+NDIS+Worker+Screening+Check%2C+Blue+Card%2C+and+full+professional+indemnity+insurance.&email=sarah.torens%40example.com.au&phone=0400+000+000&location=Queensland+%28Remote+%26+Regional%29&ctaText=MESSAGE+TO+BEGIN&video=https%3A%2F%2Fyoutube.com%2Fshorts%2F_e1uvuez1NI%3Fsi%3DjGkN2eZw0Zxkdj9z&photo=https%3A%2F%2Fres.cloudinary.com%2Fdqacbq4qp%2Fimage%2Fupload%2Fv1784180622%2Frldbl1imhhtmixkt4qmq.png&services=ot%2Csensory-processing%2Cassistive-tech%2Ccapacity-building%2Chome-visits%2Ctelehealth%2Ccarer-training%2Cearly-intervention&exp=disability%3Aintellectual%2Cdisability%3Aautism%2Cdisability%3Aphysical%2Cage%3Achildren%2Cage%3Ayoung-adults%2Csetting%3Ahome%2Csetting%3Acommunity%2Csetting%3Atelehealth&availDays=Mon%2CTue%2CWed%2CThu%2CFri&availFrom=8%3A00+AM&availTo=5%3A00+PM&susCom=visual-supports%2Csimple-language%2Cwritten-summaries&susCon=sensory-aware%2Cstrengths-based%2Cfamily-centred&susPre=calm%2Cplayful%2Cconsistent&yrsExp=7&customExp=Specialised+in+remote+service+delivery%2C+functional+capacity+assessments%2C+daily+living+skill+building%2C+sensory+processing%2C+assistive+technology+prescription%2C+and+supporting+participants+with+GDD+and+intellectual+disability+to+build+walking+endurance+and+independence.&badges=AHPRA+Registered%7CNDIS+Worker+Screening%7CBlue+Card%7CRemote+%26+Regional%7CTelehealth+Available&resources=NDIS%2520Occupational%2520Therapy%2520Explained%7Chttps%253A%252F%252Fwww.ndis.gov.au%252Fparticipants%252Freasonable-and-necessary-supports%252Ftherapies-and-supports%7COfficial%2520NDIS%2520guide%2520to%2520OT%2520supports%2520and%2520what%27s%2520funded%7EFlat%2520Feet%2520%2526%2520Orthotics%2520in%2520Children%7Chttps%253A%252F%252Fwww.rch.org.au%252Fkidsinfo%252Ffact_sheets%252FFlat_feet%252F%7CRoyal%2520Children%27s%2520Hospital%2520guide%2520for%2520families%7EBuilding%2520Walking%2520Endurance%2520%25E2%2580%2594%2520Tips%2520for%2520Families%7Chttps%253A%252F%252Fwww.cerebralpalsy.org.au%252Fresources%252F%7CPractical%2520strategies%2520to%2520support%2520walking%2520goals%2520at%2520home%7ESensory%2520Processing%2520%2526%2520Intellectual%2520Disability%7Chttps%253A%252F%252Fwww.otaus.com.au%252F%7COT%2520Australia%2520resources%2520for%2520practitioners%2520and%2520families", angle: -18 },
  { id: "coordinator",          label: ["Support Coordinator", "Profile"],       emoji: "📋", color: "#9f5e38", colorLight: "#c8845a", colorDark: "#4a2010", textColor: "#ffffff", href: "/coordinators",    angle: 54  },
  { id: "about-me-disability",  label: ["About Me Profile", "(Disability/NDIS)"],emoji: "♿", color: "#746e4a", colorLight: "#a09a70", colorDark: "#302e18", textColor: "#ffffff", href: "/about-me/editor", angle: 126 },
  { id: "about-me-aged",        label: ["About Me Profile", "(Aged Care)"],      emoji: "🌿", color: "#6b3fa0", colorLight: "#9a6ad0", colorDark: "#2e1060", textColor: "#ffffff", href: "/about-me/editor", angle: 198 },
];

// Destinations — 9 nodes, manually spaced to avoid overlap
const destinations = [
  { id: "participants",    label: ["NDIS Participants", "& Families"],     emoji: "👨‍👩‍👧", color: "#1e3a8a", angle: -108, profiles: ["support-worker","about-me-disability","coordinator"] },
  { id: "aged-persons",    label: ["Aged Persons", "& Carers"],            emoji: "👴",    color: "#6b3fa0", angle: -68,  profiles: ["about-me-aged","support-worker"] },
  { id: "hospitals",       label: ["Hospitals", "& Ward Staff"],           emoji: "🏥",    color: "#be123c", angle: -35,  profiles: ["about-me-disability","about-me-aged","allied-health"] },
  { id: "ndis-providers",  label: ["NDIS Providers", "& Services"],        emoji: "🏢",    color: "#9f5e38", angle: 35,  profiles: ["support-worker","allied-health","coordinator","about-me-disability"] },
  { id: "aged-facilities", label: ["Aged Care", "Facilities"],             emoji: "🏡",    color: "#746e4a", angle: 52,   profiles: ["about-me-aged","support-worker"] },
  { id: "schools",         label: ["Schools &", "Therapists"],             emoji: "📚",    color: "#c89e6c", angle: 92,   profiles: ["about-me-disability","allied-health"] },
  { id: "new-workers",     label: ["New Support", "Workers"],              emoji: "🤲",    color: "#4b7aa8", angle: 148,  profiles: ["support-worker","about-me-disability","about-me-aged"] },
  { id: "sah",             label: ["SAH Recipients", "& Home Care"],       emoji: "🏠",    color: "#6b3fa0", angle: 208,  profiles: ["about-me-aged","coordinator"] },
  { id: "self-advocacy",   label: ["Participants", "Self-Advocacy"],       emoji: "✊",    color: "#746e4a", angle: 252,  profiles: ["about-me-disability","coordinator"] },
];

export default function EcosystemGraphic() {
  // hovered = desktop hover state
  const [hovered, setHovered] = useState<string | null>(null);
  // selected = mobile tap-to-select state (profile id only)
  const [selected, setSelected] = useState<string | null>(null);

  // The active highlight is whichever is set (hover takes priority on desktop)
  const active = hovered ?? selected;

  function isLineActive(profileId: string, destId: string) {
    if (!active) return false;
    const dp = destinations.find(d => d.id === destId)?.profiles ?? [];
    if (active === profileId) return dp.includes(profileId);
    if (active === destId)    return dp.includes(profileId);
    return false;
  }
  function profileDimmed(id: string) {
    if (!active) return false;
    if (active === id) return false;
    const hd = destinations.find(d => d.id === active);
    if (hd) return !hd.profiles.includes(id);
    return true;
  }
  function destDimmed(id: string) {
    if (!active) return false;
    if (active === id) return false;
    const hp = profileTypes.find(p => p.id === active);
    if (hp) return !destinations.find(d => d.id === id)?.profiles.includes(hp.id);
    return true;
  }

  function handleProfileClick(profileId: string, href: string) {
    // If already selected → navigate to sample profile
    if (selected === profileId) {
      window.location.href = href;
      return;
    }
    // First tap → select and show connections
    setSelected(profileId);
  }

  function handleBackgroundClick() {
    setSelected(null);
  }

  const selectedProfile = profileTypes.find(p => p.id === selected);

  return (
    <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto", padding: "0 4px" }}>

      {/* Selected profile action banner — shown on mobile after first tap */}
      {selectedProfile && (
        <div style={{
          background: `linear-gradient(135deg, ${selectedProfile.colorLight}, ${selectedProfile.color})`,
          borderRadius: "14px",
          padding: "12px 16px",
          marginBottom: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
        }}>
          <div>
            <p style={{ margin: 0, fontFamily: "'Outfit','Nunito',sans-serif", fontWeight: 900, fontSize: "14px", color: selectedProfile.textColor }}>
              {selectedProfile.emoji} {selectedProfile.label.join(" ")} — connections highlighted below
            </p>
            <p style={{ margin: "3px 0 0", fontFamily: "'Nunito',sans-serif", fontSize: "12px", color: selectedProfile.textColor, opacity: 0.8 }}>
              Tap again to view a sample profile, or tap empty space to deselect
            </p>
          </div>
          <a
            href={selectedProfile.href}
            style={{
              background: "rgba(255,255,255,0.25)",
              border: "1.5px solid rgba(255,255,255,0.5)",
              color: selectedProfile.textColor,
              fontFamily: "'Outfit','Nunito',sans-serif",
              fontWeight: 900,
              fontSize: "13px",
              padding: "7px 16px",
              borderRadius: "99px",
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            View sample →
          </a>
        </div>
      )}

      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        aria-label="InSync Profiles Ecosystem"
        role="img"
        onClick={handleBackgroundClick}
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

        {/* Background — clicking it deselects */}
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
              const lineActive = isLineActive(profile.id, dest.id);
              const dimmed = active && !lineActive;
              return (
                <line
                  key={`${profile.id}-${dest.id}`}
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={lineActive ? profile.color : "#8fa0c0"}
                  strokeWidth={lineActive ? 3 : 1}
                  opacity={dimmed ? 0.04 : lineActive ? 0.9 : 0.2}
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
          const pos     = nodePos(PROFILE_R, profile.angle);
          const dimmed  = profileDimmed(profile.id);
          const isActive = active === profile.id;
          const r       = isActive ? PROFILE_CR + 8 : PROFILE_CR;
          return (
            <g
              key={profile.id}
              style={{ cursor: "pointer", transition: "opacity 200ms ease-out" }}
              opacity={dimmed ? 0.18 : 1}
              onMouseEnter={() => setHovered(profile.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={(e) => {
                e.stopPropagation(); // prevent background deselect
                handleProfileClick(profile.id, profile.href);
              }}
            >
              {/* Outer glow ring */}
              <circle cx={pos.x} cy={pos.y} r={r + 5} fill="none" stroke={profile.colorLight} strokeWidth="1.5" opacity="0.4" />
              {/* Main circle */}
              <circle
                cx={pos.x} cy={pos.y} r={r}
                fill={`url(#g-${profile.id})`}
                stroke={isActive ? "#ffffff" : profile.colorLight}
                strokeWidth={isActive ? 3 : 2}
                filter={isActive ? "url(#softglow)" : "url(#dropshadow)"}
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
          const pos     = nodePos(DEST_R_POS, dest.angle);
          const dimmed  = destDimmed(dest.id);
          const isActive = active === dest.id;
          const r       = isActive ? DEST_CR + 6 : DEST_CR;
          return (
            <g
              key={dest.id}
              style={{ cursor: "default", transition: "opacity 200ms ease-out" }}
              opacity={dimmed ? 0.1 : 1}
              onMouseEnter={() => setHovered(dest.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={(e) => e.stopPropagation()}
            >
              <circle
                cx={pos.x} cy={pos.y} r={r}
                fill="#ffffff"
                stroke={dest.color}
                strokeWidth={isActive ? 3.5 : 2.5}
                filter="url(#dropshadow)"
                style={{ transition: "all 180ms ease-out" }}
              />
              {/* Emoji */}
              <text x={pos.x} y={pos.y - 18} textAnchor="middle" fontSize="22" dominantBaseline="middle">{dest.emoji}</text>
              {/* Label line 1 */}
              <text x={pos.x} y={pos.y + 8}  textAnchor="middle" fontFamily="'Outfit','Nunito',sans-serif" fontWeight="800" fontSize="14" fill={dest.color}>{dest.label[0]}</text>
              {/* Label line 2 */}
              <text x={pos.x} y={pos.y + 26} textAnchor="middle" fontFamily="'Outfit','Nunito',sans-serif" fontWeight="800" fontSize="14" fill={dest.color}>{dest.label[1]}</text>
            </g>
          );
        })}

        {/* Hint */}
        <text x={CX} y={H - 30} textAnchor="middle" fontFamily="'Outfit','Nunito',sans-serif" fontWeight="600" fontSize="13" fill="#6b7280">
          Tap a profile to see connections · Tap again to view sample · Tap space to clear
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
