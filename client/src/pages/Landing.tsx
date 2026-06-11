/* ============================================================
   Landing.tsx — InSync Profiles Marketing Landing Page
   Design: Deep navy-to-teal gradient bg · Gold accent highlights
           Bold, modern, confident — built for support workers
   Fonts: Cormorant Garamond (display) + Outfit (body)
   ============================================================ */
import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";

// ── Infographic section with tap-to-zoom lightbox ─────────────
function InfographicSection() {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setLightboxOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen]);

  // Prevent body scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  const IMG_SRC = "/assets/infographic_branded_v2_0438716f.png";
  const IMG_ALT = "InSync Profiles infographic — Real choice starts when everyone is included. Shows families, children, and individuals with disability viewing a support worker's accessible digital profile. For clients: see the real person. For families: be informed, be involved. For children: easy to understand, fun to explore. For everyone: accessible design, clear information, inclusive for all abilities. One profile, every perspective, better matches, better outcomes.";

  return (
    <>
      <section
        style={{ padding: "64px 24px 80px", maxWidth: "860px", margin: "0 auto", textAlign: "center" }}
        aria-labelledby="infographic-heading"
      >
        {/* Label + heading */}
        <div style={{ marginBottom: "36px" }}>
          <div style={{ display: "inline-block", background: "rgba(245,200,66,0.12)", border: "1px solid rgba(245,200,66,0.30)", borderRadius: "30px", padding: "6px 18px", marginBottom: "16px" }}>
            <span style={{ color: "#f5c842", fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Why InSync Profiles</span>
          </div>
          <h2
            id="infographic-heading"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#ffffff", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, lineHeight: 1.1, marginBottom: "14px" }}
          >
            Real Choice Starts<br />
            <span style={{ background: "linear-gradient(90deg, #2dd4bf 0%, #f5c842 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              When Everyone Is Included.
            </span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "15px", lineHeight: 1.75, maxWidth: "540px", margin: "0 auto" }}>
            Accessible. Interactive. Family informed. Because choice and control belongs to the person — and the people who know them best.
          </p>
        </div>

        {/* Clickable image — tap to zoom */}
        <div style={{ position: "relative", display: "inline-block", maxWidth: "100%" }}>
          <button
            onClick={() => setLightboxOpen(true)}
            aria-label="Tap to zoom in and read the infographic"
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "zoom-in",
              display: "block",
              width: "100%",
              borderRadius: "20px",
              position: "relative",
            }}
          >
            <img
              src={IMG_SRC}
              alt={IMG_ALT}
              style={{
                width: "100%",
                maxWidth: "700px",
                height: "auto",
                borderRadius: "20px",
                boxShadow: "0 24px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)",
                display: "block",
                margin: "0 auto",
                transition: "transform 200ms cubic-bezier(0.23,1,0.32,1), box-shadow 200ms",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.015)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
              loading="lazy"
              width="700"
              height="834"
            />
            {/* Zoom hint badge */}
            <div style={{
              position: "absolute",
              top: "14px",
              right: "14px",
              background: "rgba(13,27,42,0.82)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "99px",
              padding: "5px 12px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              pointerEvents: "none",
            }}>
              <span style={{ fontSize: "13px" }} aria-hidden="true">🔍</span>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>Tap to zoom</span>
            </div>
          </button>

          {/* AI small-print label */}
          <p style={{ marginTop: "10px", fontSize: "10px", color: "rgba(255,255,255,0.35)", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.04em", textAlign: "center" }}>
            ✦ AI-generated image for illustrative purposes. All accessibility features shown are real and available in every InSync Profiles profile.
          </p>
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Infographic zoomed view"
          onClick={() => setLightboxOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.92)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            overflowY: "auto",
            padding: "24px 12px 40px",
            cursor: "zoom-out",
          }}
        >
          {/* Close button */}
          <button
            onClick={e => { e.stopPropagation(); setLightboxOpen(false); }}
            aria-label="Close zoomed view"
            style={{
              position: "fixed",
              top: "16px",
              right: "16px",
              zIndex: 10000,
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "18px",
              color: "#fff",
              backdropFilter: "blur(8px)",
            }}
          >
            ×
          </button>

          {/* Full-size scrollable image */}
          <img
            src={IMG_SRC}
            alt={IMG_ALT}
            onClick={e => e.stopPropagation()}
            style={{
              width: "min(100%, 900px)",
              height: "auto",
              borderRadius: "16px",
              boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
              cursor: "default",
              marginTop: "8px",
              touchAction: "pinch-zoom",
            }}
          />

          {/* Hint text */}
          <p style={{
            position: "fixed",
            bottom: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "'Outfit', sans-serif",
            fontSize: "11px",
            color: "rgba(255,255,255,0.45)",
            background: "rgba(0,0,0,0.6)",
            borderRadius: "99px",
            padding: "5px 14px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}>
            Tap outside or press Esc to close · Pinch to zoom on mobile
          </p>
        </div>
      )}
    </>
  );
}

// ── Design tokens (fixed — not theme-dependent on landing) ───
const C = {
  // Backgrounds
  bgPage:    "linear-gradient(160deg, #0d1b2a 0%, #0f2d3d 40%, #0a2a1e 100%)",
  bgCard:    "rgba(255,255,255,0.06)",
  bgCardHov: "rgba(255,255,255,0.10)",
  bgGlass:   "rgba(255,255,255,0.08)",
  bgCatBand: "rgba(255,255,255,0.04)",

  // Text
  textHead:  "#ffffff",
  textBody:  "rgba(255,255,255,0.78)",
  textDim:   "rgba(255,255,255,0.45)",

  // Accents
  gold:      "#f5c842",
  goldDim:   "rgba(245,200,66,0.55)",
  goldGlow:  "rgba(245,200,66,0.22)",
  teal:      "#2dd4bf",
  tealDim:   "rgba(45,212,191,0.55)",

  // Borders
  border:    "rgba(255,255,255,0.10)",
  borderGold:"rgba(245,200,66,0.30)",
};

const FEATURES = [
  { icon: "🪪", title: "Professional Profile Card",     desc: "A shareable social media post card for Instagram, Facebook, and LinkedIn — photo, services, credentials, all in one." },
  { icon: "🔗", title: "Shareable Profile Link",        desc: "One unique URL that works on any device. No app, no login — clients tap and read instantly." },
  { icon: "🎥", title: "Intro Video Embed",             desc: "Paste a YouTube link and it plays inline. Let clients see and hear you before they make contact." },
  { icon: "💬", title: "How I Show Up",                 desc: "Communicate your style with selectable chips — how you connect, communicate, and show up for clients." },
  { icon: "🔧", title: "Profile Accessibility First",   desc: "Built to WCAG 2.1 AA. Font size controls, dyslexia-friendly font, AAC communication board, text-to-speech, and screen reader support — because the person reading your profile may have complex communication needs too." },
  { icon: "🛡", title: "Professional Credentials (Self-Reported)",         desc: "Display your NDIS Worker Check, Working with Children Check, First Aid, and Police Check as credential badges on your profile." },
  { icon: "📅", title: "Availability & Services",      desc: "Show exactly which days and hours you're available, which services you offer, and which areas you cover." },
  { icon: "🎨", title: "11 Colour Themes",             desc: "Choose from 11 professionally designed colour themes to match your personal brand or organisation." },
  { icon: "📲", title: "QR Code Sharing",              desc: "Every profile generates a unique QR code. Print it on your CV, ID badge, business card, or flyer — clients scan and view your profile instantly, no typing required." },
];

const STEPS = [
  { num: "01", title: "Purchase your licence",  desc: "Choose Solo, Team (5), or Team (10). One-time payment via PayPal. You'll receive a licence key to activate your profile editor." },
  { num: "02", title: "Enter your licence key", desc: "Go to insyncprofiles.net and enter your licence key. Your profile editor unlocks instantly." },
  { num: "03", title: "Fill in your details",   desc: "Add your name, photo, bio, services, availability, credentials, and intro video. Preview updates live." },
  { num: "04", title: "Save & share your link", desc: "Click Save Changes. Your unique profile link is ready to share via email, WhatsApp, or social media." },
];

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Demo carousel: 0 = Pete James, 1 = Sophie Langford
  const [demoIndex, setDemoIndex] = useState(0);
  // Thread animation: tracks which threads have been revealed
  const [visibleThreads, setVisibleThreads] = useState<number[]>([]);
  const postcardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Stagger reveal: thread index 0..4 (4 threads + video)
          [0, 1, 2, 3, 4].forEach((i) => {
            setTimeout(() => {
              setVisibleThreads(prev => prev.includes(i) ? prev : [...prev, i]);
            }, 200 + i * 180);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    if (postcardRef.current) observer.observe(postcardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: C.bgPage, minHeight: "100vh", fontFamily: "'Outfit', sans-serif", color: C.textBody, maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
      <a href="#main-content" style={{ position: "absolute", left: "-9999px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }}>Skip to main content</a>

      {/* ── NAV ── */}
      <header
        style={{
          background: "rgba(13,27,42,0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: `1px solid ${C.border}`,
          padding: "0 20px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: "110px", // 60px top bar + 50px access bar
          zIndex: 40,
        }}
        role="navigation"
      >
        {/* Spacer — logo removed from nav (shown in top bar instead) */}
        <div style={{ width: "40px" }} />

        {/* Desktop nav links — hidden on mobile */}
        <nav aria-label="Page navigation" className="desktop-nav" style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <Link href="/pricing" style={{ color: C.textBody, fontSize: "13px", fontWeight: 500, textDecoration: "none", padding: "8px 16px", borderRadius: "8px", transition: "color 150ms" }}>Pricing</Link>
          <Link href="/how-to-use" style={{ color: C.textBody, fontSize: "13px", fontWeight: 500, textDecoration: "none", padding: "8px 16px", borderRadius: "8px" }}>How It Works</Link>
          <Link href="/scenarios" style={{ color: C.textBody, fontSize: "13px", fontWeight: 500, textDecoration: "none", padding: "8px 16px", borderRadius: "8px" }}>Scenarios</Link>
          <Link href="/blog" style={{ color: C.textBody, fontSize: "13px", fontWeight: 500, textDecoration: "none", padding: "8px 16px", borderRadius: "8px" }}>Blog</Link>
          <Link href="/coordinators" style={{ color: C.teal, fontSize: "13px", fontWeight: 600, textDecoration: "none", padding: "8px 16px", borderRadius: "8px" }}>Coordinators</Link>
          <Link href="/skins" style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: C.gold, fontSize: "13px", fontWeight: 600, textDecoration: "none", padding: "8px 14px", borderRadius: "8px" }}>Skin Packs <span style={{ fontSize: "9px", fontWeight: 800, background: `rgba(245,200,66,0.15)`, color: C.gold, padding: "2px 6px", borderRadius: "20px", letterSpacing: "0.08em", border: `1px solid rgba(245,200,66,0.3)` }}>SOON</span></Link>
          <Link href="/demo" style={{ background: `linear-gradient(135deg, ${C.teal} 0%, ${C.gold} 100%)`, color: "#0d1b2a", fontSize: "13px", fontWeight: 800, textDecoration: "none", padding: "9px 22px", borderRadius: "99px", letterSpacing: "0.02em" }}>Try Demo</Link>
        </nav>

        {/* Mobile hamburger button — shown only on mobile */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(o => !o)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          style={{
            display: "none", // overridden by CSS below
            width: "52px", height: "44px", borderRadius: "10px",
            background: mobileMenuOpen ? `rgba(45,212,191,0.15)` : "transparent",
            border: `1.5px solid ${mobileMenuOpen ? C.teal : C.border}`,
            cursor: "pointer",
            flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px",
            transition: "all 150ms ease-out", flexShrink: 0,
          }}
        >
          {mobileMenuOpen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <>
              <span style={{ display: "block", width: "18px", height: "2px", borderRadius: "2px", background: C.textBody }} />
              <span style={{ display: "block", width: "18px", height: "2px", borderRadius: "2px", background: C.textBody }} />
              <span style={{ display: "block", width: "18px", height: "2px", borderRadius: "2px", background: C.textBody }} />
              <span style={{ display: "block", fontSize: "9px", fontWeight: 700, color: C.textBody, letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1, marginTop: "1px" }}>Menu</span>
            </>
          )}
        </button>
      </header>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-drawer"
          style={{
            position: "sticky",
            top: "174px", // 60px top bar + 50px access bar + 64px nav
            zIndex: 39,
            background: "rgba(13,27,42,0.97)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: `1px solid ${C.border}`,
            padding: "12px 20px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            animation: "fadeInDown 180ms cubic-bezier(0.23,1,0.32,1)",
          }}
          role="menu"
          aria-label="Mobile navigation"
        >
          {[
            { href: "/scenarios",  label: "🌊 The New Wave" },
            { href: "/pricing",    label: "Pricing" },
            { href: "/how-to-use", label: "How It Works" },
            { href: "/blog",       label: "📝 Blog" },
            { href: "/coordinators", label: "🔗 For Coordinators" },
            { href: "/skins",      label: "🎨 Skin Packs — Coming Soon" },
          ].map(link => (
            <Link
              key={link.label}
              href={link.href}
              role="menuitem"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: C.textBody, fontSize: "15px", fontWeight: 500, textDecoration: "none", padding: "12px 16px", borderRadius: "10px", display: "block", borderBottom: `1px solid ${C.border}` }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/demo"
            role="menuitem"
            onClick={() => setMobileMenuOpen(false)}
            style={{ background: `linear-gradient(135deg, ${C.teal} 0%, ${C.gold} 100%)`, color: "#0d1b2a", fontSize: "15px", fontWeight: 800, textDecoration: "none", padding: "13px 20px", borderRadius: "12px", display: "block", textAlign: "center", marginTop: "8px" }}
          >
            Try Demo →
          </Link>
        </div>
      )}

      {/* Responsive nav CSS */}
      <style>{`
        .hidden-mobile { display: flex; }
        .mobile-menu-btn { display: none; }
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .desktop-nav   { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <main id="main-content" style={{ paddingTop: "174px" }}>

        {/* Wave section removed */}
        {false && <section aria-labelledby="wave-heading">
          {/* Full-bleed wave gradient background */}
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(160deg, #071520 0%, #0a2535 25%, #0d3320 55%, #0a1f30 80%, #06111e 100%)`,
            zIndex: 0,
          }} />
          {/* Animated glow orbs */}
          <div aria-hidden="true" style={{ position: "absolute", top: "-80px", left: "-100px", width: "700px", height: "700px", background: `radial-gradient(ellipse at center, rgba(45,212,191,0.18) 0%, transparent 65%)`, pointerEvents: "none", zIndex: 0, animation: "waveOrb1 12s ease-in-out infinite" }} />
          <div aria-hidden="true" style={{ position: "absolute", bottom: "-100px", right: "-80px", width: "600px", height: "600px", background: `radial-gradient(ellipse at center, rgba(245,200,66,0.16) 0%, transparent 65%)`, pointerEvents: "none", zIndex: 0, animation: "waveOrb2 15s ease-in-out infinite" }} />
          <div aria-hidden="true" style={{ position: "absolute", top: "40%", left: "50%", transform: "translateX(-50%)", width: "900px", height: "400px", background: `radial-gradient(ellipse at center, rgba(45,212,191,0.08) 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />

          <style>{`
            @keyframes waveOrb1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,30px)} }
            @keyframes waveOrb2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,-40px)} }
          `}</style>

          <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1, padding: "120px 24px 100px" }}>

            {/* — HERO STATEMENT — */}
            <div style={{ textAlign: "center", marginBottom: "80px" }}>

              {/* Badge */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "rgba(45,212,191,0.12)", border: `1.5px solid rgba(45,212,191,0.35)`, borderRadius: "99px", padding: "10px 24px", marginBottom: "36px" }}>
                <span style={{ fontSize: "20px" }} aria-hidden="true">🌊</span>
                <span style={{ color: C.teal, fontSize: "13px", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase" }}>The New Wave</span>
              </div>

              {/* Giant headline */}
              <h2
                id="wave-heading"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#ffffff",
                  fontSize: "clamp(44px, 8vw, 96px)",
                  fontWeight: 700,
                  lineHeight: 1.0,
                  marginBottom: "0",
                  letterSpacing: "-0.01em",
                }}
              >
                One Profile.
              </h2>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(44px, 8vw, 96px)",
                  fontWeight: 700,
                  lineHeight: 1.0,
                  marginBottom: "32px",
                  letterSpacing: "-0.01em",
                  background: `linear-gradient(90deg, ${C.teal} 0%, #a8edea 40%, ${C.gold} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontStyle: "italic",
                }}
              >
                Unlimited Possibilities.
              </h2>

              {/* Bold statement */}
              <p style={{ color: "rgba(255,255,255,0.70)", fontSize: "clamp(16px, 2.5vw, 22px)", lineHeight: 1.75, maxWidth: "680px", margin: "0 auto 24px", fontFamily: "'Outfit', sans-serif" }}>
                InSync Profiles isn’t just a template. It’s a shift in how the support sector presents itself
                &nbsp;— to employers, to clients, to families, to the world.
              </p>

              {/* “You get it.” moment */}
              <div style={{ display: "inline-block", margin: "0 auto 0", padding: "18px 40px", borderRadius: "16px", background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.12)" }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, color: C.gold, fontStyle: "italic", margin: 0, letterSpacing: "0.01em" }}>
                  “You get it.”
                </p>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: "6px 0 0", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  — What the sector will say about you
                </p>
              </div>
            </div>

            {/* — SCENARIO TILES — */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "20px", marginBottom: "64px" }}>
              {[
                { icon: "🎯", title: "Job Seekers",        body: "Your profile link is your new cover letter. Attach it to every application and arrive at the interview already known.", accent: C.teal, tag: "Employment" },
                { icon: "📲", title: "Social Media",       body: "Post your profile card in NDIS and aged care Facebook groups. While others post text, you post a presence.", accent: C.gold, tag: "Visibility" },
                { icon: "💼", title: "Sector Credibility", body: "Badges, service circles, communication chips — you speak the sector’s language before you’ve said a word.", accent: C.teal, tag: "Trust" },
                { icon: "🏢", title: "Provider Onboarding", body: "Send every new worker’s profile to clients 48 hours before their first shift. Onboarding becomes a system.", accent: C.gold, tag: "Operations" },
                { icon: "🤝", title: "Client Connection",  body: "Your profile speaks to recipients before you do. By the time you arrive, you’re already someone they know.", accent: C.teal, tag: "Connection" },
                { icon: "🌊", title: "Public Awareness",   body: "Every published profile adds to a growing public presence for the sector — professional, accessible, human.", accent: C.gold, tag: "Impact" },
              ].map(tile => (
                <div
                  key={tile.title}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid rgba(255,255,255,0.10)`,
                    borderTop: `3px solid ${tile.accent}`,
                    borderRadius: "20px",
                    padding: "32px 28px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Subtle glow top-right */}
                  <div aria-hidden="true" style={{ position: "absolute", top: "-20px", right: "-20px", width: "120px", height: "120px", background: `radial-gradient(ellipse at center, ${tile.accent}22 0%, transparent 70%)`, pointerEvents: "none" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ fontSize: "28px" }} aria-hidden="true">{tile.icon}</div>
                    <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: tile.accent, fontFamily: "'Outfit', sans-serif", background: `${tile.accent}18`, padding: "3px 10px", borderRadius: "99px", border: `1px solid ${tile.accent}40` }}>{tile.tag}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: "#ffffff", fontSize: "24px", fontWeight: 700, marginBottom: "10px", lineHeight: 1.1 }}>{tile.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "14px", lineHeight: 1.8, margin: 0, fontFamily: "'Outfit', sans-serif" }}>{tile.body}</p>
                </div>
              ))}
            </div>

            {/* — BOTTOM CTA — */}
            <div style={{ textAlign: "center" }}>
              <Link
                href="/scenarios"
                style={{
                  background: `linear-gradient(135deg, ${C.teal} 0%, ${C.gold} 100%)`,
                  color: "#0d1b2a",
                  padding: "18px 52px",
                  borderRadius: "99px",
                  fontSize: "16px",
                  fontWeight: 800,
                  textDecoration: "none",
                  display: "inline-block",
                  boxShadow: `0 8px 40px rgba(45,212,191,0.35)`,
                  letterSpacing: "0.02em",
                }}
              >
                Explore All Scenarios →
              </Link>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", marginTop: "16px", fontFamily: "'Outfit', sans-serif" }}>6 real-world scenarios showing exactly how this changes your career</p>
            </div>
          </div>
        </section>}

        {/* ── HERO ── */}
        <section
          style={{
            padding: "0 24px 80px",
            maxWidth: "1200px",
            margin: "0 auto",
            position: "relative",
          }}
          aria-labelledby="hero-heading"
        >
          {/* Glow orbs */}
          <div aria-hidden="true" style={{ position: "absolute", top: "60px", left: "30%", transform: "translateX(-50%)", width: "600px", height: "300px", background: `radial-gradient(ellipse at center, ${C.tealDim} 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />
          <div aria-hidden="true" style={{ position: "absolute", top: "120px", left: "10%", width: "300px", height: "200px", background: `radial-gradient(ellipse at center, ${C.goldGlow} 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />

          <div style={{ position: "relative", zIndex: 1, display: "flex", gap: "56px", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>

            {/* ── LEFT: Headline + CTAs ── */}
            <div style={{ flex: "1 1 380px", maxWidth: "520px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* Sector tag */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: C.bgGlass, border: `1px solid ${C.border}`, borderRadius: "99px", padding: "6px 16px", marginBottom: "28px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.teal, display: "inline-block", flexShrink: 0 }} aria-hidden="true" />
                <span style={{ color: C.textBody, fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em" }}>
                  Aged Care · Disability Support · NDIS · Independent Support Workers
                </span>
              </div>

              <h1
                id="hero-heading"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textHead, fontSize: "clamp(36px, 5.5vw, 60px)", fontWeight: 700, lineHeight: 1.08, marginBottom: "24px", letterSpacing: "-0.01em" }}
              >
                Your Professional Profile<br />
                <span style={{ background: `linear-gradient(90deg, ${C.teal} 0%, ${C.gold} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontStyle: "italic" }}>
                  Built for Support Work
                </span>
              </h1>

              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(18px, 2.5vw, 24px)", fontStyle: "italic", fontWeight: 600, color: C.gold, letterSpacing: "0.01em", marginBottom: "20px", lineHeight: 1.3 }}>
                Beyond the “Sea of Sameness”
              </p>

              <p style={{ color: C.textBody, fontSize: "clamp(14px, 2vw, 17px)", lineHeight: 1.8, marginBottom: "36px", maxWidth: "480px" }}>
                InSync Profiles is an interactive, accessibility-first profile template for support workers and their potential clients. Share your services, availability, credentials, and communication style — all in one shareable link.
              </p>

              {/* Social proof */}
              <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", marginBottom: "40px" }}>
                {[
                  { icon: "⭐", text: "5.0 rating" },
                  { icon: "✦",  text: "WCAG 2.1 AA" },
                  { icon: "🇦🇺", text: "Made in Australia" },
                ].map(item => (
                  <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <span style={{ fontSize: "14px" }} aria-hidden="true">{item.icon}</span>
                    <span style={{ color: C.textDim, fontSize: "13px", fontWeight: 500 }}>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <Link href="/pricing" style={{ background: `linear-gradient(135deg, ${C.gold} 0%, #e8a800 100%)`, color: "#0d1b2a", padding: "15px 36px", borderRadius: "99px", fontSize: "15px", fontWeight: 800, textDecoration: "none", display: "inline-block", boxShadow: `0 6px 32px ${C.goldGlow}`, letterSpacing: "0.01em" }}>See Pricing →</Link>
                <Link href="/demo" style={{ background: "transparent", color: C.teal, padding: "15px 36px", borderRadius: "99px", fontSize: "15px", fontWeight: 700, textDecoration: "none", display: "inline-block", border: `1.5px solid ${C.tealDim}` }}>Try the Demo</Link>
              </div>

            </div>

            {/* ── RIGHT: Sample Postcard Carousel ── */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", flexShrink: 0 }}>
              {/* Live Example label + carousel nav */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  onClick={() => { setDemoIndex(0); setVisibleThreads([]); setTimeout(() => [0,1,2,3,4].forEach(i => setTimeout(() => setVisibleThreads(p => p.includes(i) ? p : [...p, i]), 200 + i * 180)), 50); }}
                  aria-label="View Pete James sample profile"
                  style={{ background: demoIndex === 0 ? "rgba(45,212,191,0.25)" : "rgba(255,255,255,0.06)", border: demoIndex === 0 ? "1.5px solid #2dd4bf" : "1.5px solid rgba(255,255,255,0.15)", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", transition: "all 200ms" }}
                >◀</button>
                <div style={{ display: "flex", alignItems: "center", gap: "7px", background: "rgba(100,80,180,0.18)", border: "1px solid rgba(100,80,180,0.40)", borderRadius: "99px", padding: "5px 14px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#9b59b6", display: "inline-block", flexShrink: 0 }} aria-hidden="true" />
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "10px", fontWeight: 800, color: "#c084fc", letterSpacing: "0.14em", textTransform: "uppercase" }}>✦ Live Example — Sample Profile</span>
                </div>
                <button
                  onClick={() => { setDemoIndex(1); setVisibleThreads([]); setTimeout(() => [0,1,2,3,4].forEach(i => setTimeout(() => setVisibleThreads(p => p.includes(i) ? p : [...p, i]), 200 + i * 180)), 50); }}
                  aria-label="View Sophie Langford sample profile"
                  style={{ background: demoIndex === 1 ? "rgba(45,212,191,0.25)" : "rgba(255,255,255,0.06)", border: demoIndex === 1 ? "1.5px solid #2dd4bf" : "1.5px solid rgba(255,255,255,0.15)", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", transition: "all 200ms" }}
                >▶</button>
              </div>
              {/* Dot indicators */}
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                {[0, 1].map(i => (
                  <button key={i} onClick={() => { setDemoIndex(i); setVisibleThreads([]); setTimeout(() => [0,1,2,3,4].forEach(j => setTimeout(() => setVisibleThreads(p => p.includes(j) ? p : [...p, j]), 200 + j * 180)), 50); }} aria-label={i === 0 ? "Pete James" : "Sophie Langford"} style={{ width: demoIndex === i ? "20px" : "8px", height: "8px", borderRadius: "4px", background: demoIndex === i ? "#2dd4bf" : "rgba(255,255,255,0.25)", border: "none", cursor: "pointer", transition: "all 250ms cubic-bezier(0.23,1,0.32,1)", padding: 0 }} />
                ))}
              </div>
            <style>{`
              @keyframes threadReveal {
                from { opacity: 0; transform: translateY(10px); }
                to   { opacity: 1; transform: translateY(0); }
              }
              @keyframes connectorGrow {
                from { transform: scaleY(0); }
                to   { transform: scaleY(1); }
              }
            `}</style>
            <div
              ref={postcardRef}
              onContextMenu={e => e.preventDefault()}
              onDragStart={e => e.preventDefault()}
              onCopy={e => e.preventDefault()}
              onCut={e => e.preventDefault()}
              style={{
                background: "linear-gradient(160deg, #dceeff 0%, #f7e0f5 45%, #fff3c8 100%)",
                border: "1.5px solid rgba(180,160,220,0.35)",
                borderRadius: "24px",
                padding: "0",
                width: "340px",
                boxShadow: "0 24px 80px rgba(0,0,0,0.22), 0 2px 8px rgba(100,120,220,0.12)",
                position: "relative",
                overflow: "hidden",
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
              }}>
              {/* ── Gold Accessibility Bar — top of postcard ── */}
              <div style={{
                background: "linear-gradient(90deg, #1a2e4a 0%, #1e3a5f 100%)",
                borderRadius: "22px 22px 0 0",
                padding: "7px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(240,192,64,0.25)",
              }}>
                {/* Left: hamburger lines */}
                <div style={{ display: "flex", flexDirection: "column", gap: "3px", padding: "2px" }}>
                  <span style={{ display: "block", width: "14px", height: "1.5px", borderRadius: "2px", background: "rgba(255,255,255,0.55)" }} />
                  <span style={{ display: "block", width: "14px", height: "1.5px", borderRadius: "2px", background: "rgba(255,255,255,0.55)" }} />
                  <span style={{ display: "block", width: "14px", height: "1.5px", borderRadius: "2px", background: "rgba(255,255,255,0.55)" }} />
                </div>
                {/* Centre: logo + name */}
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <img src="/assets/insync-logo-transparent_9e0df532.png" alt="InSync Profiles" draggable={false} onContextMenu={e => e.preventDefault()} style={{ width: "22px", height: "22px", objectFit: "contain", flexShrink: 0, pointerEvents: "none" }} />
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "9px", fontWeight: 800, color: "rgba(255,255,255,0.85)", letterSpacing: "0.08em", textTransform: "uppercase" }}>InSync Profiles</span>
                </div>
                {/* Right: gold Access button with universal accessibility icon */}
                <div style={{
                  background: "linear-gradient(135deg, #f0c040 0%, #d4a020 100%)",
                  borderRadius: "20px",
                  padding: "3px 8px 3px 4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  boxShadow: "0 2px 8px rgba(240,192,64,0.35)",
                }}>
                  <img
                    src="/assets/accessibility_icon_0186b679.png"
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    onContextMenu={e => e.preventDefault()}
                    style={{ width: "16px", height: "16px", borderRadius: "50%", objectFit: "cover", flexShrink: 0, pointerEvents: "none" }}
                  />
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "8px", fontWeight: 800, color: "#1a2e4a", letterSpacing: "0.06em", textTransform: "uppercase" }}>Access</span>
                </div>
              </div>
              {/* ── Inner content wrapper ── */}
              <div style={{ padding: "20px 24px 28px" }}>
              {/* Glow top-right */}
              <div aria-hidden="true" style={{ position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "radial-gradient(circle, rgba(147,197,253,0.30) 0%, transparent 70%)", pointerEvents: "none" }} />
              {/* Transparent overlay — blocks drag-to-save and right-click image download */}
              <div
                aria-hidden="true"
                onContextMenu={e => e.preventDefault()}
                onDragStart={e => e.preventDefault()}
                style={{ position: "absolute", inset: 0, zIndex: 10, background: "transparent", pointerEvents: "auto", userSelect: "none", borderRadius: "24px" }}
              />

              {/* Header row — real photo */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                <img
                  src={demoIndex === 0 ? "/assets/pete_james_headshot_c42b5c10.png" : "/assets/sophie_langford_headshot.png"}
                  alt={demoIndex === 0 ? "Pete James — support worker profile photo, Central Coast NSW" : "Sophie Langford — support worker profile photo, Melbourne VIC"}
                  draggable={false}
                  onContextMenu={e => e.preventDefault()}
                  style={{ width: "68px", height: "68px", borderRadius: "50%", objectFit: "cover", border: demoIndex === 0 ? "2.5px solid #7c9fd4" : "2.5px solid #e879a0", flexShrink: 0, pointerEvents: "none", transition: "border-color 300ms" }}
                />
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "21px", fontWeight: 700, color: "#1a2040", lineHeight: 1.1 }}>{demoIndex === 0 ? "Pete James" : "Sophie Langford"}</div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: demoIndex === 0 ? "#4a6fa8" : "#c026d3", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "3px" }}>Support Worker</div>
                  <div style={{ fontSize: "11px", color: "#7a7aaa", marginTop: "2px" }}>📍 {demoIndex === 0 ? "Central Coast, NSW" : "Melbourne, VIC"}</div>
                </div>
              </div>

              {/* Bio */}
              <p style={{ fontSize: "12px", color: "#2a2a4a", lineHeight: 1.7, marginBottom: "14px", borderLeft: demoIndex === 0 ? "2px solid rgba(147,100,200,0.45)" : "2px solid rgba(192,38,211,0.45)", paddingLeft: "10px", fontStyle: "italic" }}>
                {demoIndex === 0 ? "Active sourcing & advocacy for accessible, inclusive activities. Real support delivered, every time." : "I get it. I see you. I'm here. Compassionate support tailored to your unique journey."}
              </p>

              {/* Thread divider */}
              <div style={{ textAlign: "center", margin: "4px 0 6px" }}>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9acc", margin: 0 }}>✦ My Profile Threads ✦</p>
              </div>

              {/* 4 curated threads: Identity, Services, Availability, Credentials */}
              {(demoIndex === 0 ? [
                { num: 1, icon: "🧶", label: "Identity",     color: "#7c3aed", chips: ["Pete James", "Central Coast NSW", "6 yrs experience"] },
                { num: 2, icon: "🧩", label: "Services",     color: "#4a90d9", chips: ["Personal Care", "Community Access", "Domestic Assistance", "Transport"] },
                { num: 5, icon: "📅", label: "Availability", color: "#e67e22", chips: ["Mon","Tue","Wed","Thu","Fri"] },
                { num: 7, icon: "🛡", label: "Credentials",  color: "#f59e0b", chips: ["✓ NDIS Worker Check", "✓ First Aid", "✓ Police Check"] },
              ] : [
                { num: 1, icon: "🧶", label: "Identity",     color: "#c026d3", chips: ["Sophie Langford", "Melbourne VIC", "6 yrs experience"] },
                { num: 2, icon: "🧩", label: "Services",     color: "#0891b2", chips: ["Emotional Support", "Community Access", "Mental Wellbeing", "Creative Arts"] },
                { num: 5, icon: "📅", label: "Availability", color: "#16a34a", chips: ["Mon","Tue","Wed","Thu","Fri","Sat"] },
                { num: 7, icon: "🛡", label: "Credentials",  color: "#f59e0b", chips: ["✓ NDIS Worker Check", "✓ First Aid", "✓ Police Check", "✓ Working with Children"] },
              ]).map((t, idx) => (
                <div
                  key={t.num}
                  style={{
                    opacity: visibleThreads.includes(idx) ? 1 : 0,
                    animation: visibleThreads.includes(idx) ? "threadReveal 320ms cubic-bezier(0.23,1,0.32,1) forwards" : "none",
                    transition: "opacity 320ms",
                  }}
                >
                  {/* Connector line */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: idx === 0 ? "22px" : "14px" }}>
                    <div style={{
                      width: "2px",
                      height: "100%",
                      background: `linear-gradient(180deg, ${t.color} 0%, rgba(240,192,64,0.4) 100%)`,
                      transformOrigin: "top",
                      animation: visibleThreads.includes(idx) ? "connectorGrow 280ms cubic-bezier(0.23,1,0.32,1) forwards" : "none",
                    }} />
                  </div>
                  {/* Thread card */}
                  <div style={{
                    background: visibleThreads.includes(idx) ? "rgba(255,255,255,0.60)" : "rgba(255,255,255,0.20)",
                    borderRadius: "12px",
                    border: `1.5px solid ${visibleThreads.includes(idx) ? t.color : t.color + "40"}`,
                    padding: "8px 12px",
                    marginBottom: "2px",
                    transition: "background 300ms, border-color 300ms",
                    boxShadow: visibleThreads.includes(idx) ? `0 2px 12px ${t.color}22` : "none",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "5px" }}>
                      <span style={{ fontSize: "8px", fontWeight: 800, color: t.color, letterSpacing: "0.1em", textTransform: "uppercase" }}>Thread {t.num}</span>
                      <span style={{ fontSize: "9px", color: "#6a7aaa" }}>{t.icon} {t.label}</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
                      {t.label === "Availability"
                        ? ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => (
                            <div key={d} style={{ width: "28px", height: "24px", borderRadius: "6px", background: i < 5 ? `${t.color}20` : "rgba(0,0,0,0.04)", border: `1px solid ${i < 5 ? t.color + "60" : "rgba(0,0,0,0.10)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "7px", fontWeight: 700, color: i < 5 ? t.color : "#aaaacc" }}>{d}</div>
                          ))
                        : t.chips.map(c => (
                            <span key={c} style={{ background: `${t.color}14`, color: t.color, border: `1px solid ${t.color}35`, borderRadius: "20px", fontSize: "8px", fontWeight: 600, padding: "2px 7px" }}>{c}</span>
                          ))
                      }
                    </div>
                  </div>
                </div>
              ))}

              {/* Thread 8 — Intro Video */}
              <div
                style={{
                  opacity: visibleThreads.includes(4) ? 1 : 0,
                  animation: visibleThreads.includes(4) ? "threadReveal 320ms cubic-bezier(0.23,1,0.32,1) forwards" : "none",
                  transition: "opacity 320ms",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "14px" }}>
                  <div style={{
                    width: "2px",
                    height: "100%",
                    background: "linear-gradient(180deg, #e11d48 0%, rgba(240,192,64,0.4) 100%)",
                    transformOrigin: "top",
                    animation: visibleThreads.includes(4) ? "connectorGrow 280ms cubic-bezier(0.23,1,0.32,1) forwards" : "none",
                  }} />
                </div>
                <div style={{
                  background: visibleThreads.includes(4) ? "rgba(255,255,255,0.60)" : "rgba(255,255,255,0.20)",
                  borderRadius: "12px",
                  border: visibleThreads.includes(4) ? "1.5px solid #e11d48" : "1.5px solid #e11d4840",
                  padding: "8px 12px",
                  marginBottom: "2px",
                  transition: "background 300ms, border-color 300ms",
                  boxShadow: visibleThreads.includes(4) ? "0 2px 12px rgba(225,29,72,0.13)" : "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "7px" }}>
                    <span style={{ fontSize: "8px", fontWeight: 800, color: "#e11d48", letterSpacing: "0.1em", textTransform: "uppercase" }}>Thread 8</span>
                    <span style={{ fontSize: "9px", color: "#6a7aaa" }}>🎬 Intro Video</span>
                  </div>
                  {/* Video thumbnail with play button */}
                  <div style={{ position: "relative", borderRadius: "8px", overflow: "hidden", width: "100%", aspectRatio: "16/9", background: "#0a0a1a" }}>
                    <video
                      src="/assets/sw_final_video_new_music_46a119c4.mp4"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
                      muted
                      playsInline
                      preload="metadata"
                      draggable={false}
                      onContextMenu={e => e.preventDefault()}
                    />
                    {/* Play button overlay */}
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.28)" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.35)" }}>
                        <div style={{ width: 0, height: 0, borderTop: "7px solid transparent", borderBottom: "7px solid transparent", borderLeft: "12px solid #e11d48", marginLeft: "2px" }} />
                      </div>
                    </div>
                    {/* Duration badge */}
                    <div style={{ position: "absolute", bottom: "5px", right: "6px", background: "rgba(0,0,0,0.70)", color: "#fff", fontSize: "7px", fontWeight: 700, padding: "1px 5px", borderRadius: "4px", letterSpacing: "0.04em" }}>0:15</div>
                  </div>
                  <p style={{ fontSize: "8px", color: "#8888aa", margin: "5px 0 0", textAlign: "center" }}>15-second intro · clients see this on your profile</p>
                </div>
              </div>

              {/* Footer — QR + CTA */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(180,160,220,0.30)", paddingTop: "14px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <img
                    src="/assets/sample_qr_code_ed40ff77.png"
                    alt="Sample QR code — visual simulation only, not linked"
                    draggable={false}
                    onContextMenu={e => e.preventDefault()}
                    style={{ width: "52px", height: "52px", borderRadius: "6px", border: "1px solid #d4e8d4", objectFit: "contain", pointerEvents: "none" }}
                  />
                  <div style={{ fontSize: "9px", color: "#8888aa" }}>Scan to view</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "9px", color: "#8888aa", marginBottom: "6px" }}>{demoIndex === 0 ? "insyncprofiles.net/pete-j" : "insyncprofiles.net/sophie-l"}</div>
                  <div style={{ background: "linear-gradient(135deg, #009488 0%, #007a70 100%)", color: "#fff", fontSize: "11px", fontWeight: 700, padding: "8px 16px", borderRadius: "20px", letterSpacing: "0.04em", display: "inline-block" }}>Message to Begin →</div>
                </div>
              </div>
              </div>{/* end inner content wrapper */}
            </div>
            {/* Condensed sample note */}
            <div style={{ background: "rgba(245,200,66,0.10)", border: "1px solid rgba(245,200,66,0.28)", borderRadius: "10px", padding: "8px 14px", maxWidth: "320px", textAlign: "center" }}>
              <p style={{ fontSize: "10px", color: "rgba(245,200,66,0.85)", lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                ⚠️ This sample shows 4 of 8 profile threads. The full client view includes all threads, accessibility tools, and your custom colour theme.
              </p>
            </div>
            {/* View Full Sample button */}
            <Link
              href="/view"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "linear-gradient(135deg, #dceeff 0%, #f7e0f5 45%, #fff3c8 100%)",
                color: "#1a2e4a",
                fontSize: "13px",
                fontWeight: 800,
                textDecoration: "none",
                padding: "10px 22px",
                borderRadius: "99px",
                border: "1.5px solid rgba(180,160,220,0.50)",
                boxShadow: "0 4px 20px rgba(147,100,200,0.18)",
                letterSpacing: "0.01em",
              }}
            >
              <span style={{ fontSize: "14px" }} aria-hidden="true">📱</span>
              View Full Sample Profile
              <span style={{ fontSize: "12px", opacity: 0.7 }}>→</span>
            </Link>
            {/* Disclaimer */}
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.30)", textAlign: "center", maxWidth: "320px", lineHeight: 1.5, margin: 0 }}>
              Image source: AI-generated. Visual simulation only — used for demonstration purposes.
            </p>
            {/* Try Demo link */}
            <div style={{ textAlign: "center", marginTop: "6px" }}>
              <Link
                href="/demo"
                style={{ color: "#2a9d8f", fontSize: "13px", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "5px", borderBottom: "1.5px solid #2a9d8f44", paddingBottom: "1px" }}
              >
                ✦ This is interactive — try the live demo →
              </Link>
            </div>
            </div>

          </div>
        </section>

        {/* ── DIVIDER ── */}
        <div style={{ maxWidth: "900px", margin: "0 auto 64px", padding: "0 24px" }}>
          <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${C.tealDim}, ${C.goldDim}, transparent)` }} aria-hidden="true" />
        </div>

        {/* ── INFOGRAPHIC: Real Choice Starts When Everyone Is Included ── */}
        <InfographicSection />


        {/* ── FEATURES GRID ── */}
        <section style={{ padding: "0 24px 80px", maxWidth: "1100px", margin: "0 auto" }} aria-labelledby="features-heading">
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2
              id="features-heading"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textHead, fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, marginBottom: "14px" }}
            >
              Everything a Support Worker Needs
            </h2>
            <p style={{ color: C.textBody, fontSize: "16px", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
              One template. All the tools to present yourself professionally and connect with clients.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: "16px" }}>
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                style={{
                  background: C.bgCard,
                  borderRadius: "16px",
                  padding: "28px 24px",
                  border: `1px solid ${C.border}`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Subtle accent line top */}
                <div aria-hidden="true" style={{ position: "absolute", top: 0, left: "24px", right: "24px", height: "2px", background: i % 2 === 0 ? `linear-gradient(90deg, ${C.teal}, transparent)` : `linear-gradient(90deg, ${C.gold}, transparent)`, borderRadius: "2px" }} />
                <div style={{ fontSize: "28px", marginBottom: "14px" }} aria-hidden="true">
                  {f.icon === "🔧" ? (
                    <img src="/assets/accessibility-icon_f6ed13be.png" alt="" style={{ width: "36px", height: "36px", objectFit: "contain" }} />
                  ) : f.icon}
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textHead, fontSize: "19px", fontWeight: 700, marginBottom: "8px" }}>{f.title}</h3>
                <p style={{ color: C.textBody, fontSize: "13px", lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── ACCESSIBILITY CALLOUT ── */}
        <section style={{ padding: "0 24px 80px", maxWidth: "860px", margin: "0 auto" }} aria-labelledby="a11y-callout-heading">
          <div style={{
            background: "rgba(45,212,191,0.07)",
            border: `1.5px solid rgba(45,212,191,0.25)`,
            borderRadius: "20px",
            padding: "40px 40px",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Glow accent */}
            <div aria-hidden="true" style={{ position: "absolute", top: "-40px", right: "-40px", width: "220px", height: "220px", borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(45,212,191,0.12)", border: `1px solid rgba(45,212,191,0.30)`, borderRadius: "99px", padding: "6px 16px", marginBottom: "20px" }}>
              <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="4" r="2" fill="#2dd4bf"/>
                  <path d="M15 8H9l-1 5h3l1 5h2l1-5h3l-1-5z" fill="#2dd4bf" opacity="0.85"/>
                  <path d="M9.5 13.5C8.1 15 7 16.9 7 19a5 5 0 0 0 10 0c0-1.5-.6-2.9-1.5-4" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                </svg>
              </span>
              <span style={{ color: C.teal, fontSize: "11px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>Why Accessibility Matters Here</span>
            </div>
            <h2 id="a11y-callout-heading" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textHead, fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 700, marginBottom: "20px", lineHeight: 1.2 }}>
              Most profiles assume the reader is neurotypical. InSync Profiles doesn't.
            </h2>
            <p style={{ color: C.textBody, fontSize: "16px", lineHeight: 1.85, marginBottom: "20px", maxWidth: "720px" }}>
              Most support worker profiles assume the person reading them is neurotypical and literate. InSync Profiles is the only one that assumes the reader might have complex communication needs — and designs for that from the start. That directly reflects the values of the sector: person-centred, inclusive, communication-first.
            </p>
            <p style={{ color: C.textBody, fontSize: "16px", lineHeight: 1.85, margin: 0, maxWidth: "720px" }}>
              It also makes the profile useful in face-to-face introductions. A worker can pull up their profile on a tablet and hand it to a client who uses AAC — and the client can respond right there on the same screen, without switching to a separate app. No context switch. No barrier. Just connection.
            </p>
          </div>
        </section>

        {/* ── SAMPLE POSTCARD (moved to hero) ── */}
        {false && <section
          style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto" }}
          aria-labelledby="postcard-heading"
        >
          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <div style={{ display: "inline-block", background: `rgba(245,200,66,0.12)`, border: `1px solid ${C.borderGold}`, borderRadius: "30px", padding: "6px 18px", marginBottom: "16px" }}>
              <span style={{ color: C.gold, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Live Example</span>
            </div>
            <h2
              id="postcard-heading"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textHead, fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, marginBottom: "14px" }}
            >
              See What Your Profile Looks Like
            </h2>
            <p style={{ color: C.textBody, fontSize: "16px", maxWidth: "540px", margin: "0 auto", lineHeight: 1.7 }}>
              This is a real sample postcard — the same format buyers receive. Every field is editable. Share it as a link, QR code, or social media post.
            </p>
          </div>

          {/* Postcard + context layout */}
          <div style={{ display: "flex", gap: "48px", alignItems: "flex-start", flexWrap: "wrap", justifyContent: "center" }}>

            {/* ── THE POSTCARD ── */}
            <div style={{
              background: "linear-gradient(145deg, #0f2d3d 0%, #0a2a1e 100%)",
              border: `1.5px solid ${C.tealDim}`,
              borderRadius: "20px",
              padding: "28px",
              width: "340px",
              flexShrink: 0,
              boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(45,212,191,0.08)`,
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Subtle glow top-right */}
              <div aria-hidden="true" style={{ position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

              {/* Header row */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
                {/* Avatar */}
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: `linear-gradient(135deg, ${C.teal} 0%, #0a9e8a 100%)`, border: `2px solid ${C.teal}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", flexShrink: 0 }}>👩</div>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 700, color: C.textHead, lineHeight: 1.1 }}>Pete James</div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: C.teal, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "3px" }}>Support Worker</div>
                  <div style={{ fontSize: "11px", color: C.textDim, marginTop: "2px" }}>📍 Central Coast, NSW</div>
                </div>
              </div>

              {/* Bio */}
              <p style={{ fontSize: "12px", color: C.textBody, lineHeight: 1.7, marginBottom: "16px", borderLeft: `2px solid ${C.tealDim}`, paddingLeft: "10px" }}>
                Active sourcing &amp; advocacy for accessible, inclusive activities. Real support delivered, every time.
              </p>

              {/* Services */}
              <div style={{ marginBottom: "14px" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: C.gold, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Services</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {["Personal Care", "Community Access", "Domestic Assistance", "Transport", "Meal Prep"].map(s => (
                    <span key={s} style={{ background: "rgba(45,212,191,0.12)", color: C.teal, border: `1px solid rgba(45,212,191,0.25)`, borderRadius: "20px", fontSize: "10px", fontWeight: 600, padding: "3px 10px" }}>{s}</span>
                  ))}
                </div>
              </div>

              {/* Credentials */}
              <div style={{ marginBottom: "14px" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: C.gold, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Credentials</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {["✓ NDIS Worker Check", "✓ First Aid", "✓ Police Check", "✓ Working with Children"].map(c => (
                    <span key={c} style={{ background: "rgba(245,200,66,0.10)", color: C.gold, border: `1px solid rgba(245,200,66,0.25)`, borderRadius: "20px", fontSize: "10px", fontWeight: 600, padding: "3px 10px" }}>{c}</span>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div style={{ marginBottom: "18px" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: C.gold, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Availability</div>
                <div style={{ display: "flex", gap: "5px" }}>
                  {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => (
                    <div key={d} style={{ width: "34px", height: "34px", borderRadius: "8px", background: [0,1,2,3,4].includes(i) ? `rgba(45,212,191,0.18)` : "rgba(255,255,255,0.04)", border: `1px solid ${[0,1,2,3,4].includes(i) ? C.tealDim : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: 700, color: [0,1,2,3,4].includes(i) ? C.teal : C.textDim }}>{d}</div>
                  ))}
                </div>
              </div>

              {/* Footer row — QR + CTA */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${C.border}`, paddingTop: "14px" }}>
                {/* QR code placeholder */}
                <div style={{ width: "52px", height: "52px", background: "rgba(255,255,255,0.06)", border: `1px solid ${C.border}`, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>⬛</div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "10px", color: C.textDim, marginBottom: "6px" }}>insyncprofiles.net/pete-j</div>
                  <div style={{ background: `linear-gradient(135deg, ${C.teal} 0%, #0a9e8a 100%)`, color: "#fff", fontSize: "11px", fontWeight: 700, padding: "7px 16px", borderRadius: "20px", letterSpacing: "0.04em", display: "inline-block" }}>Message to Begin →</div>
                </div>
              </div>
            </div>

            {/* ── CALLOUT POINTS ── */}
            <div style={{ flex: "1 1 280px", maxWidth: "420px", display: "flex", flexDirection: "column", gap: "20px", paddingTop: "8px" }}>
              {[
                { icon: "🔗", title: "One link, anywhere", desc: "Share via WhatsApp, email, Facebook, or print as a QR code. Clients tap and see everything instantly — no app needed." },
                { icon: "🎨", title: "Fully personalised", desc: "Change the name, photo, bio, services, credentials, and availability. 11 colour themes to match your style." },
                { icon: "⬛", title: "QR code included", desc: "Every profile generates a unique QR code. Print it on your CV, ID badge, business card, or flyer — clients scan and view instantly." },
                { icon: "__acc__", title: "Accessibility built in", desc: "Font size controls, dyslexia-friendly font, AAC communication board, and screen reader support — WCAG 2.1 AA compliant." },
                { icon: "💼", title: "Works for any sector", desc: "NDIS, aged care, CHSP, SAH, independent workers, and providers. One template that covers every corner of the support sector." },
              ].map(point => (
                <div key={point.title} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(45,212,191,0.10)", border: `1px solid rgba(45,212,191,0.20)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>
                    {point.icon === "__acc__" ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Accessibility">
                        <circle cx="12" cy="4" r="2" fill="#2dd4bf"/>
                        <path d="M15 8H9l-1 5h3l1 5h2l1-5h3l-1-5z" fill="#2dd4bf" opacity="0.85"/>
                        <path d="M9.5 13.5C8.1 15 7 16.9 7 19a5 5 0 0 0 10 0c0-1.5-.6-2.9-1.5-4" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                      </svg>
                    ) : point.icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "17px", fontWeight: 700, color: C.textHead, marginBottom: "4px" }}>{point.title}</div>
                    <p style={{ fontSize: "13px", color: C.textBody, lineHeight: 1.7, margin: 0 }}>{point.desc}</p>
                  </div>
                </div>
              ))}

              <Link
                href="/pricing"
                style={{ background: `linear-gradient(135deg, ${C.gold} 0%, #e8a800 100%)`, color: "#0d1b2a", padding: "14px 32px", borderRadius: "99px", fontSize: "14px", fontWeight: 800, textDecoration: "none", display: "inline-block", boxShadow: `0 4px 20px ${C.goldGlow}`, alignSelf: "flex-start", marginTop: "8px" }}
              >
                Get Your Profile →
              </Link>
            </div>
          </div>
        </section>}

        {/* ── YOUR PROFILE GOES WHERE YOU GO ── */}
        <section
          style={{
            padding: "80px 24px",
            background: "rgba(8,13,20,0.95)",
            borderTop: `1px solid rgba(245,200,66,0.12)`,
            borderBottom: `1px solid rgba(245,200,66,0.12)`,
            overflow: "hidden",
          }}
          aria-labelledby="expo-heading"
        >
          <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(460px,100%), 1fr))", gap: "56px", alignItems: "center" }}>
            {/* Image */}
            <div style={{ borderRadius: "20px", overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}>
              <img
                src="/assets/insync_expo_post_v2_89644f5b.png"
                alt="Support worker wearing an InSync Profiles lanyard card at a disability expo — a participant scans the QR code with their phone"
                style={{ width: "100%", display: "block", objectFit: "cover" }}
                loading="lazy"
              />
            </div>
            {/* Copy */}
            <div>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.gold, marginBottom: "16px" }}>✦ Because the right match changes everything</p>
              <h2
                id="expo-heading"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textHead, fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 700, lineHeight: 1.15, marginBottom: "24px" }}
              >
                In the room.<br />On the lanyard.<br /><span style={{ color: C.gold }}>Already working.</span>
              </h2>
              <p style={{ color: C.textBody, fontSize: "15px", lineHeight: 1.8, marginBottom: "20px" }}>
                NDIS expos. Disability connection events. Day programs. Community access. Wherever you show up — your InSync Profile shows up with you.
              </p>
              <p style={{ color: C.textBody, fontSize: "15px", lineHeight: 1.8, marginBottom: "32px" }}>
                Every licence includes a <strong style={{ color: C.textHead }}>personalised lanyard QR card</strong> — print it, laminate it, wear it. A participant scans it and has your full profile before you’ve even sat down together.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                {[
                  { icon: "🎪", label: "NDIS Expos" },
                  { icon: "🤝", label: "Connection Events" },
                  { icon: "🌳", label: "Community Access" },
                  { icon: "👋", label: "Meet-and-Greets" },
                ].map(item => (
                  <span key={item.label} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "99px", border: `1px solid rgba(245,200,66,0.25)`, background: "rgba(245,200,66,0.06)", color: C.textBody, fontSize: "13px", fontWeight: 500 }}>
                    <span aria-hidden="true">{item.icon}</span> {item.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── DIVIDER ── */}
        <div style={{ maxWidth: "900px", margin: "0 auto 0", padding: "0 24px" }}>
          <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${C.tealDim}, ${C.goldDim}, transparent)` }} aria-hidden="true" />
        </div>

        {/* ── HOW IT WORKS ── */}
        <section
          style={{
            padding: "72px 24px",
            background: C.bgCatBand,
            borderTop: `1px solid ${C.border}`,
            borderBottom: `1px solid ${C.border}`,
          }}
          aria-labelledby="steps-heading"
        >
          <div style={{ maxWidth: "860px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <h2
                id="steps-heading"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textHead, fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, marginBottom: "14px" }}
              >
                Up and Running in Minutes
              </h2>
              <p style={{ color: C.textBody, fontSize: "16px", lineHeight: 1.7 }}>No technical skills needed. No app to download. Works on any device.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(380px, 100%), 1fr))", gap: "20px" }}>
              {STEPS.map((step, i) => (
                <div
                  key={step.num}
                  style={{
                    display: "flex",
                    gap: "20px",
                    alignItems: "flex-start",
                    background: C.bgCard,
                    borderRadius: "16px",
                    padding: "24px",
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div
                    style={{
                      width: "44px", height: "44px", borderRadius: "12px",
                      background: i % 2 === 0
                        ? `linear-gradient(135deg, ${C.teal} 0%, #0891b2 100%)`
                        : `linear-gradient(135deg, ${C.gold} 0%, #e8a800 100%)`,
                      color: i % 2 === 0 ? "#0d1b2a" : "#0d1b2a",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "13px", fontWeight: 800, flexShrink: 0,
                      letterSpacing: "0.04em",
                    }}
                    aria-hidden="true"
                  >
                    {step.num}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textHead, fontSize: "20px", fontWeight: 700, marginBottom: "6px" }}>{step.title}</h3>
                    <p style={{ color: C.textBody, fontSize: "14px", lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section
          style={{
            padding: "96px 24px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
          aria-labelledby="cta-heading"
        >
          {/* Glow */}
          <div aria-hidden="true" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "700px", height: "400px", background: `radial-gradient(ellipse at center, ${C.goldGlow} 0%, transparent 70%)`, pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1, maxWidth: "600px", margin: "0 auto" }}>
            <h2
              id="cta-heading"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textHead, fontSize: "clamp(30px, 4.5vw, 48px)", fontWeight: 700, marginBottom: "20px", lineHeight: 1.1 }}
            >
              Ready to get your support workers<br />
              <span style={{ background: `linear-gradient(90deg, ${C.teal} 0%, ${C.gold} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                to stand out?
              </span>
            </h2>
            <p style={{ color: C.textBody, fontSize: "17px", lineHeight: 1.75, marginBottom: "44px" }}>
              Starting from just $25 AUD. One-time payment. No subscriptions. Your licence key activates your profile editor instantly.
            </p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/pricing" style={{ background: `linear-gradient(135deg, ${C.gold} 0%, #e8a800 100%)`, color: "#0d1b2a", padding: "16px 44px", borderRadius: "99px", fontSize: "16px", fontWeight: 800, textDecoration: "none", display: "inline-block", boxShadow: `0 6px 32px ${C.goldGlow}` }}>View Pricing →</Link>
              <Link href="/demo" style={{ background: "transparent", color: C.teal, padding: "16px 44px", borderRadius: "99px", fontSize: "16px", fontWeight: 700, textDecoration: "none", display: "inline-block", border: `1.5px solid ${C.tealDim}` }}>Try Free Demo</Link>
            </div>

          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer
          style={{
            padding: "32px 24px",
            textAlign: "center",
            borderTop: `1px solid ${C.border}`,
          }}
          role="contentinfo"
        >
          <p style={{ color: C.textDim, fontSize: "12px", margin: "0 0 12px" }}>
            © {new Date().getFullYear()} InSync Profiles · ABN 54 116 010 622 · Made in Australia
          </p>
          <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { href: "/pricing",    label: "Pricing" },
              { href: "/how-to-use", label: "How It Works" },
              { href: "/scenarios",  label: "Scenarios" },
              { href: "/blog",       label: "Blog" },
              { href: "/skins",      label: "Skin Packs" },
              { href: "/privacy",    label: "Legal & Privacy" },
              { href: "/demo",      label: "Try Demo" },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{ color: C.textDim, fontSize: "12px", textDecoration: "none", transition: "color 150ms" }}>{link.label}</Link>
            ))}
          </div>
        </footer>

      </main>
    </div>
  );
}
