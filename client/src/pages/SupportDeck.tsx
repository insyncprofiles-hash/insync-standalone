/**
 * Support Deck — public, filterable directory of opted-in support workers.
 * No login required. Workers opt in from their editor dashboard.
 * Listings are stored in localStorage on the worker's device and submitted
 * to a shared Forge data store keyed by pid.
 *
 * Design: deep navy-to-teal bg · gold accents · teal/gold avatar placeholders
 * Tagline: "Not assigned. Chosen."
 */
import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import QRCode from "qrcode";

// ── Colour palette (matches Landing.tsx) ──────────────────────────────────────
const C = {
  bgPage:   "linear-gradient(160deg, #0d1b2a 0%, #0f2d3d 40%, #0a2a1e 100%)",
  bgCard:   "rgba(13,27,42,0.82)",
  bgCardHover: "rgba(15,45,61,0.95)",
  border:   "rgba(45,212,191,0.18)",
  borderGold: "rgba(245,200,66,0.35)",
  gold:     "#f5c842",
  goldDim:  "rgba(245,200,66,0.55)",
  teal:     "#2dd4bf",
  tealDim:  "rgba(45,212,191,0.55)",
  textBody: "rgba(255,255,255,0.88)",
  textDim:  "rgba(255,255,255,0.50)",
  textMid:  "rgba(255,255,255,0.70)",
  available:  "#4ade80",
  limited:    "#fbbf24",
  unavailable:"#f87171",
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface DeckListing {
  pid: string;
  profileUrl: string;
  workerName: string;
  location: string;
  services: string[];
  availability: "available" | "limited" | "unavailable";
  photoUrl?: string;
  tagline: string;
  addedAt: number;
}

// ── Avatar placeholder — illustrated teal/gold geometric ─────────────────────
function AvatarPlaceholder({ size = 56, seed = 0 }: { size?: number; seed?: number }) {
  const shapes = [
    // Teal circle
    <circle key="c" cx="50%" cy="50%" r="38%" fill={C.teal} opacity="0.7" />,
    // Gold diamond
    <polygon key="d" points="50,12 88,50 50,88 12,50" fill={C.gold} opacity="0.7" />,
    // Teal hexagon
    <polygon key="h" points="50,10 85,30 85,70 50,90 15,70 15,30" fill={C.teal} opacity="0.65" />,
    // Gold star
    <polygon key="s" points="50,8 61,35 90,35 68,57 76,84 50,65 24,84 32,57 10,35 39,35" fill={C.gold} opacity="0.65" />,
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ borderRadius: "50%", background: "rgba(13,27,42,0.7)", flexShrink: 0 }}>
      <rect width="100" height="100" rx="50" fill="rgba(13,27,42,0.7)" />
      {shapes[seed % shapes.length]}
      {/* Subtle inner ring */}
      <circle cx="50" cy="50" r="46" fill="none" stroke={C.gold} strokeWidth="2" opacity="0.3" />
    </svg>
  );
}

// ── QR tile ───────────────────────────────────────────────────────────────────
function QRTile({ url, size = 90 }: { url: string; size?: number }) {
  const [dataUrl, setDataUrl] = useState("");
  useEffect(() => {
    QRCode.toDataURL(url, {
      width: size * 2,
      margin: 1,
      color: { dark: "#000000", light: "#fffef5" },
      errorCorrectionLevel: "M",
    }).then(setDataUrl).catch(() => {});
  }, [url, size]);
  return (
    <div style={{
      width: size, height: size,
      background: "#fffef5",
      borderRadius: "10px",
      border: `2px solid ${C.gold}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: `0 0 16px ${C.gold}33`,
      flexShrink: 0,
      overflow: "hidden",
    }}>
      {dataUrl
        ? <img src={dataUrl} alt="QR code" style={{ width: size - 8, height: size - 8, display: "block" }} />
        : <div style={{ width: size - 16, height: size - 16, background: "rgba(0,0,0,0.08)", borderRadius: "6px" }} />
      }
    </div>
  );
}

// ── Availability dot ──────────────────────────────────────────────────────────
function AvailDot({ status }: { status: DeckListing["availability"] }) {
  const col = status === "available" ? C.available : status === "limited" ? C.limited : C.unavailable;
  const label = status === "available" ? "Available" : status === "limited" ? "Limited" : "Unavailable";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12px", color: col, fontWeight: 600 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: col, display: "inline-block", boxShadow: `0 0 6px ${col}` }} />
      {label}
    </span>
  );
}

// ── Worker card ───────────────────────────────────────────────────────────────
function WorkerCard({ listing, idx }: { listing: DeckListing; idx: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? C.bgCardHover : C.bgCard,
        border: `1.5px solid ${hovered ? C.borderGold : C.border}`,
        borderRadius: "18px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        transition: "all 0.2s cubic-bezier(0.23,1,0.32,1)",
        boxShadow: hovered ? `0 8px 32px rgba(245,200,66,0.12)` : "0 2px 12px rgba(0,0,0,0.3)",
        cursor: "default",
      }}
    >
      {/* QR code centred at top */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <QRTile url={listing.profileUrl} size={100} />
      </div>

      {/* Avatar + name + location */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {listing.photoUrl
          ? <img src={listing.photoUrl} alt="" style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", border: `2px solid ${C.gold}`, flexShrink: 0 }} />
          : <AvatarPlaceholder size={52} seed={idx} />
        }
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "16px", color: "#fff", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {listing.workerName || "Support Worker"}
          </div>
          <div style={{ fontSize: "12px", color: C.teal, fontWeight: 600, marginTop: "2px" }}>SUPPORT WORKER</div>
          {listing.location && (
            <div style={{ fontSize: "12px", color: C.textDim, marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
              <span>📍</span>{listing.location}
            </div>
          )}
        </div>
      </div>

      {/* Tagline */}
      {listing.tagline && (
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "13px", color: C.textMid, margin: 0, lineHeight: 1.5, borderLeft: `2px solid ${C.tealDim}`, paddingLeft: "10px" }}>
          "{listing.tagline}"
        </p>
      )}

      {/* Service chips */}
      {listing.services.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {listing.services.slice(0, 4).map(s => (
            <span key={s} style={{
              padding: "4px 10px", borderRadius: "20px",
              background: "rgba(45,212,191,0.10)",
              border: `1px solid ${C.tealDim}`,
              color: C.teal, fontSize: "11px", fontWeight: 600,
            }}>{s}</span>
          ))}
          {listing.services.length > 4 && (
            <span style={{ padding: "4px 10px", borderRadius: "20px", background: "rgba(255,255,255,0.05)", color: C.textDim, fontSize: "11px" }}>+{listing.services.length - 4} more</span>
          )}
        </div>
      )}

      {/* Availability + View Profile */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "4px" }}>
        <AvailDot status={listing.availability} />
        <a
          href={listing.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "8px 18px",
            borderRadius: "20px",
            background: "none",
            border: `1.5px solid ${C.gold}`,
            color: C.gold,
            fontSize: "12px",
            fontWeight: 700,
            textDecoration: "none",
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: "0.04em",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { (e.target as HTMLAnchorElement).style.background = C.gold; (e.target as HTMLAnchorElement).style.color = "#0d1b2a"; }}
          onMouseLeave={e => { (e.target as HTMLAnchorElement).style.background = "none"; (e.target as HTMLAnchorElement).style.color = C.gold; }}
        >
          View Profile →
        </a>
      </div>
    </div>
  );
}

// ── Filter chip ───────────────────────────────────────────────────────────────
function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 16px", borderRadius: "20px",
        background: active ? C.gold : "rgba(255,255,255,0.06)",
        color: active ? "#0d1b2a" : C.textMid,
        border: `1.5px solid ${active ? C.gold : "rgba(255,255,255,0.12)"}`,
        fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: active ? 700 : 500,
        cursor: "pointer", transition: "all 0.15s cubic-bezier(0.23,1,0.32,1)",
        boxShadow: active ? `0 0 12px ${C.gold}44` : "none",
      }}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

// ── Demo listings — shown when the deck is empty ──────────────────────────────
const DEMO_LISTINGS: DeckListing[] = [
  {
    pid: "demo1",
    profileUrl: "https://YOUR_DOMAIN/view?demo=1",
    workerName: "Amina K.",
    location: "Lakemba, NSW",
    services: ["Community Access", "Personal Care", "Transport"],
    availability: "available",
    tagline: "I believe every person deserves to be seen, heard, and supported on their own terms.",
    addedAt: Date.now() - 86400000,
  },
  {
    pid: "demo2",
    profileUrl: "https://YOUR_DOMAIN/view?demo=2",
    workerName: "Robert T.",
    location: "Surry Hills, NSW",
    services: ["Shopping", "Meal Prep", "Social Support"],
    availability: "available",
    tagline: "Retired teacher turned support worker. Patience is my superpower.",
    addedAt: Date.now() - 172800000,
  },
  {
    pid: "demo3",
    profileUrl: "https://YOUR_DOMAIN/view?demo=3",
    workerName: "Charlie M.",
    location: "Melbourne, VIC",
    services: ["Youth Support", "Mentoring", "Daily Living"],
    availability: "limited",
    tagline: "Young, energetic, and passionate about empowering young people with disability.",
    addedAt: Date.now() - 259200000,
  },
  {
    pid: "demo4",
    profileUrl: "https://YOUR_DOMAIN/view?demo=4",
    workerName: "Sarah P.",
    location: "Brisbane, QLD",
    services: ["Complex Care", "Spinal Injury", "Advocacy"],
    availability: "available",
    tagline: "Lived experience of disability. I get it — because I've lived it.",
    addedAt: Date.now() - 345600000,
  },
  {
    pid: "demo5",
    profileUrl: "https://YOUR_DOMAIN/view?demo=5",
    workerName: "Marcus W.",
    location: "Perth, WA",
    services: ["Autism Support", "Sensory Needs", "Community Access"],
    availability: "available",
    tagline: "Neurodiversity-affirming, sensory-aware, and always led by the person.",
    addedAt: Date.now() - 432000000,
  },
  {
    pid: "demo6",
    profileUrl: "https://YOUR_DOMAIN/view?demo=6",
    workerName: "Priya N.",
    location: "Adelaide, SA",
    services: ["Personal Care", "Cultural Support", "Domestic Assistance"],
    availability: "limited",
    tagline: "Bilingual (English/Hindi). Culturally safe support for CALD participants.",
    addedAt: Date.now() - 518400000,
  },
];

// ── Service filter options ────────────────────────────────────────────────────
const SERVICE_FILTERS = [
  "Community Access", "Personal Care", "Transport", "Domestic Assistance",
  "Youth Support", "Complex Care", "Autism Support", "Cultural Support",
  "Advocacy", "Mentoring",
];

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SupportDeck() {
  const [listings, setListings] = useState<DeckListing[]>([]);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [availFilter, setAvailFilter] = useState<"all" | "available" | "limited">("all");
  const [serviceFilter, setServiceFilter] = useState<string[]>([]);
  const [showDemo, setShowDemo] = useState(false);

  // Load listings from localStorage (submitted by opted-in workers)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("insync_deck_listings");
      if (stored) {
        const parsed: DeckListing[] = JSON.parse(stored);
        setListings(parsed);
        setShowDemo(parsed.length === 0);
      } else {
        setShowDemo(true);
      }
    } catch {
      setShowDemo(true);
    }
  }, []);

  const displayListings = showDemo ? DEMO_LISTINGS : listings;

  const filtered = useMemo(() => {
    return displayListings.filter(l => {
      if (availFilter !== "all" && l.availability !== availFilter) return false;
      if (locationFilter.trim() && !l.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
      if (serviceFilter.length > 0 && !serviceFilter.some(sf => l.services.some(s => s.toLowerCase().includes(sf.toLowerCase())))) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!l.workerName.toLowerCase().includes(q) && !l.location.toLowerCase().includes(q) && !l.tagline.toLowerCase().includes(q) && !l.services.some(s => s.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [displayListings, search, locationFilter, availFilter, serviceFilter]);

  const toggleService = (s: string) => {
    setServiceFilter(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  return (
    <div style={{ background: C.bgPage, minHeight: "100vh", fontFamily: "'Outfit', sans-serif", color: C.textBody }}>

      {/* ── Header ── */}
      <div style={{
        background: "rgba(13,27,42,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.border}`,
        padding: "0 24px",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "1px" }}>
            <span style={{ color: C.gold, fontSize: "13px", fontWeight: 800, letterSpacing: "0.10em", textTransform: "uppercase" }}>InSync Profiles</span>
            <span style={{ color: C.teal, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Support Deck</span>
          </Link>
          <Link href="/pricing" style={{
            padding: "9px 22px", borderRadius: "20px",
            background: `linear-gradient(135deg, ${C.teal}, ${C.gold})`,
            color: "#0d1b2a", fontSize: "13px", fontWeight: 800,
            textDecoration: "none", letterSpacing: "0.04em",
          }}>
            List Your Profile →
          </Link>
        </div>
      </div>

      {/* ── Hero ── */}
      <div style={{ textAlign: "center", padding: "56px 24px 40px" }}>
        <div style={{ display: "inline-block", background: "rgba(45,212,191,0.10)", border: `1px solid ${C.tealDim}`, borderRadius: "30px", padding: "6px 18px", marginBottom: "16px" }}>
          <span style={{ color: C.teal, fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Participant Choice &amp; Control</span>
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", color: "#fff", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700, lineHeight: 1.1, margin: "0 0 12px" }}>
          Support Deck
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(18px, 2.5vw, 24px)", margin: "0 0 12px" }}>
          <span style={{ background: `linear-gradient(90deg, ${C.teal} 0%, ${C.gold} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontWeight: 600 }}>
            Not assigned. Chosen.
          </span>
        </p>
        <p style={{ color: C.textDim, fontSize: "15px", maxWidth: "520px", margin: "0 auto 8px", lineHeight: 1.7 }}>
          Browse opted-in support workers. Filter by what matters to you. Scan their QR code to read their full profile before you decide.
        </p>
        {showDemo && (
          <p style={{ color: C.goldDim, fontSize: "12px", marginTop: "8px", fontStyle: "italic" }}>
            ✨ Showing example profiles — real listings will appear as workers opt in.
          </p>
        )}
      </div>

      {/* ── Filters ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 32px" }}>
        {/* Search bar */}
        <div style={{ position: "relative", marginBottom: "20px" }}>
          <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", pointerEvents: "none" }}>🔍</span>
          <input
            type="text"
            placeholder="Search by name, location, or support type…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "14px 16px 14px 44px",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.06)",
              border: `1.5px solid ${C.border}`,
              color: "#fff", fontFamily: "'Outfit', sans-serif", fontSize: "14px",
              outline: "none", boxSizing: "border-box",
              transition: "border-color 0.15s",
            }}
            onFocus={e => (e.target.style.borderColor = C.teal)}
            onBlur={e => (e.target.style.borderColor = C.border)}
            aria-label="Search support workers"
          />
        </div>

        {/* Location + Availability row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "16px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="📍 Filter by location…"
            value={locationFilter}
            onChange={e => setLocationFilter(e.target.value)}
            style={{
              padding: "10px 16px", borderRadius: "20px",
              background: "rgba(255,255,255,0.06)",
              border: `1.5px solid ${C.border}`,
              color: "#fff", fontFamily: "'Outfit', sans-serif", fontSize: "13px",
              outline: "none", minWidth: "180px",
              transition: "border-color 0.15s",
            }}
            onFocus={e => (e.target.style.borderColor = C.teal)}
            onBlur={e => (e.target.style.borderColor = C.border)}
            aria-label="Filter by location"
          />
          <FilterChip label="All" active={availFilter === "all"} onClick={() => setAvailFilter("all")} />
          <FilterChip label="🟢 Available" active={availFilter === "available"} onClick={() => setAvailFilter("available")} />
          <FilterChip label="🟡 Limited" active={availFilter === "limited"} onClick={() => setAvailFilter("limited")} />
        </div>

        {/* Service chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
          {SERVICE_FILTERS.map(s => (
            <FilterChip key={s} label={s} active={serviceFilter.includes(s)} onClick={() => toggleService(s)} />
          ))}
          {serviceFilter.length > 0 && (
            <button onClick={() => setServiceFilter([])} style={{ padding: "8px 14px", borderRadius: "20px", background: "rgba(248,113,113,0.12)", border: "1.5px solid rgba(248,113,113,0.35)", color: "#f87171", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
              ✕ Clear filters
            </button>
          )}
        </div>

        {/* Result count */}
        <p style={{ color: C.textDim, fontSize: "13px", marginBottom: "24px" }}>
          {filtered.length} worker{filtered.length !== 1 ? "s" : ""} found
          {(search || locationFilter || availFilter !== "all" || serviceFilter.length > 0) && " — matching your filters"}
        </p>

        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px", color: C.textDim }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <p style={{ fontSize: "16px", fontWeight: 600, color: C.textMid }}>No workers match those filters</p>
            <p style={{ fontSize: "14px" }}>Try broadening your search or clearing some filters.</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}>
            {filtered.map((listing, idx) => (
              <WorkerCard key={listing.pid} listing={listing} idx={idx} />
            ))}
          </div>
        )}

        {/* ── Participant Notice ── */}
        <div style={{
          marginTop: "48px",
          padding: "20px 24px",
          borderRadius: "14px",
          background: "rgba(255,255,255,0.04)",
          border: `1px solid rgba(255,255,255,0.10)`,
        }}>
          <p style={{ margin: 0, fontSize: "13px", color: C.textDim, lineHeight: 1.7 }}>
            <span style={{ color: "#f87171", marginRight: "6px" }}>❗</span>
            <strong style={{ color: C.textMid }}>Participant Notice:</strong>{" "}
            This is a self-reported inclusive screening tool designed for personality and cultural matching. Credentials listed have not been independently verified by this platform. As a participant, nominee, or guardian, you must verify this worker's Screening ID directly via your{" "}
            <a href="https://www.ndiscommission.gov.au/workers/worker-screening" target="_blank" rel="noopener noreferrer" style={{ color: C.teal, textDecoration: "underline" }}>
              NDIS Quality and Safeguards Commission Portal
            </a>{" "}
            or professional provider links before they commence work.
          </p>
        </div>

        {/* ── Footer ── */}
        <div style={{ textAlign: "center", padding: "32px 0 16px", color: C.textDim, fontSize: "12px" }}>
          <p style={{ margin: "0 0 6px" }}>
            <span style={{ color: C.gold, fontWeight: 700 }}>InSync Profiles</span> · Support Deck
          </p>
          <p style={{ margin: 0 }}>
            Are you a support worker?{" "}
            <Link href="/pricing" style={{ color: C.teal, textDecoration: "none", fontWeight: 600 }}>
              Get your InSync Profile and list yourself on the Deck →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
