/* ============================================================
   Landing.tsx — InSync Profiles Marketing Landing Page
   Design: Deep navy-to-teal gradient bg · Gold accent highlights
           Bold, modern, confident — built for every support role
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
  const IMG_ALT = "InSync Profiles infographic — Real choice starts when everyone is included. Shows families, children, and individuals with disability viewing an accessible digital profile for every support role. For clients: see the real person. For families: be informed, be involved. For children: easy to understand, fun to explore. For everyone: accessible design, clear information, inclusive for all abilities. One profile, every perspective, better matches, better outcomes.";

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
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#0f2a4a", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, lineHeight: 1.1, marginBottom: "14px" }}
          >
            Real Choice Starts<br />
            <span style={{ background: "linear-gradient(90deg, #2dd4bf 0%, #f5c842 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              When Everyone Is Included.
            </span>
          </h2>
          <p style={{ color: "#1e3a5f", fontSize: "15px", lineHeight: 1.75, maxWidth: "540px", margin: "0 auto" }}>
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
              background: "rgba(255,255,255,0.92)",
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
            color: "#4a6a8a",
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
  bgPage:    "linear-gradient(135deg, #e8eef7 0%, #d8e6f4 35%, #c4d8ef 60%, #9abde0 80%, #2554c7 100%)",
  bgCard:    "rgba(255,255,255,0.55)",
  bgCardHov: "rgba(255,255,255,0.70)",
  bgGlass:   "#4a6a8a",
  bgCatBand: "rgba(255,255,255,0.30)",

  // Text
  textHead:  "#0f2a4a",
  textBody:  "#1e3a5f",
  textDim:   "#4a6a8a",

  // Accents
  gold:      "#f5c842",
  goldDim:   "rgba(245,200,66,0.55)",
  goldGlow:  "rgba(245,200,66,0.22)",
  teal:      "#2dd4bf",
  tealDim:   "rgba(45,212,191,0.55)",

  // Borders
  border:    "rgba(255,255,255,0.70)",
  borderGold:"rgba(180,130,0,0.35)",
};

const FEATURES = [
  { icon: "🪪", title: "Professional Profile Card",     desc: "A shareable social media post card for Instagram, Facebook, and LinkedIn — photo, services, credentials, all in one." },
  { icon: "🔗", title: "Shareable Profile Link",        desc: "One unique URL that works on any device. No app, no login — clients tap and read instantly." },
  { icon: "🎥", title: "Intro Video Embed",             desc: "Paste a YouTube link and it plays inline. Let clients see and hear you before they make contact." },
  { icon: "💬", title: "How I Show Up",                 desc: "Communicate your style with selectable chips — how you connect, communicate, and show up for clients." },
  { icon: "🔧", title: "Profile Accessibility First",   desc: "Built to WCAG 2.1 AA. Font size controls, dyslexia-friendly font, AAC communication board, text-to-speech, and screen reader support — because the person reading your profile may have complex communication needs too." },
  { icon: "🛡", title: "Professional Credentials (Self-Reported)",         desc: "Display your NDIS Worker Check, Working with Children Check, First Aid, and Police Check as credential badges on your profile." },
  { icon: "📅", title: "Availability & Services",      desc: "Show exactly which days and hours you're available, which services you offer, and which areas you cover." },

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
          background: "rgba(255,255,255,0.95)",
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
          <div style={{ position: "relative", display: "inline-flex", flexShrink: 0 }}>
            <Link href="/about-me/editor" style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "2px", background: "linear-gradient(135deg, #f5c842 0%, #f59e0b 100%)", color: "#0f4c45", textDecoration: "none", padding: "7px 20px 8px", borderRadius: "99px", letterSpacing: "0.01em", boxShadow: "0 2px 12px rgba(245,200,66,0.40)" }}>
              <span style={{ fontSize: "15px", fontWeight: 900, display: "flex", alignItems: "center", gap: "6px" }}>✨ About Me</span>
              <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.04em", opacity: 0.8, lineHeight: 1 }}>Continuity for Aged &amp; Disabled Persons</span>
            </Link>
            <span style={{ position: "absolute", top: "4px", left: "-14px", background: "linear-gradient(135deg, #b91c1c 0%, #7f1d1d 40%, #c0392b 70%, #991b1b 100%)", color: "#fff", fontSize: "9px", fontWeight: 900, letterSpacing: "0.06em", padding: "3px 8px", borderRadius: "99px", boxShadow: "0 2px 6px rgba(120,20,20,0.55), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.25)", textTransform: "uppercase", whiteSpace: "nowrap", border: "1px solid rgba(255,255,255,0.15)", pointerEvents: "none" }}>Free to use</span>
          </div>
          <Link href="/how-to-use" style={{ color: C.textHead, fontSize: "16px", fontWeight: 700, textDecoration: "none", padding: "8px 16px", borderRadius: "8px" }}>How It Works</Link>
          <Link href="/scenarios" style={{ color: C.textHead, fontSize: "16px", fontWeight: 700, textDecoration: "none", padding: "8px 16px", borderRadius: "8px" }}>Scenarios</Link>
          <Link href="/blog" style={{ color: C.textHead, fontSize: "16px", fontWeight: 700, textDecoration: "none", padding: "8px 16px", borderRadius: "8px" }}>Blog</Link>
          <Link href="/guides" style={{ color: C.textHead, fontSize: "16px", fontWeight: 700, textDecoration: "none", padding: "8px 16px", borderRadius: "8px" }}>Guides</Link>
          <Link href="/allied-health" style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: `linear-gradient(135deg, ${C.teal}22 0%, ${C.teal}11 100%)`, border: `1.5px solid ${C.teal}66`, color: C.teal, fontSize: "15px", fontWeight: 800, textDecoration: "none", padding: "8px 16px", borderRadius: "99px", letterSpacing: "0.01em" }}>🩺 Allied Health</Link>
          <Link href="/coordinators" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: C.textBody, fontSize: "14px", fontWeight: 600, textDecoration: "none", padding: "8px 14px", borderRadius: "8px" }}>🔗 For Coordinators</Link>
          <Link href="/demo" style={{ background: `linear-gradient(135deg, ${C.teal} 0%, ${C.gold} 100%)`, color: "#0d1b2a", fontSize: "15px", fontWeight: 800, textDecoration: "none", padding: "9px 22px", borderRadius: "99px", letterSpacing: "0.02em" }}>Try Demo</Link>
        </nav>

        {/* Mobile hamburger button — shown only on mobile */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(o => !o)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          style={{
            display: "none", // overridden by CSS below
            width: "88px", height: "70px", borderRadius: "14px",
            background: mobileMenuOpen ? `rgba(45,212,191,0.15)` : "transparent",
            border: `1.5px solid ${mobileMenuOpen ? C.teal : C.border}`,
            cursor: "pointer",
            flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px",
            transition: "all 150ms ease-out", flexShrink: 0,
          }}
        >
          {mobileMenuOpen ? (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <>
              <span style={{ display: "block", width: "36px", height: "4px", borderRadius: "3px", background: C.textBody }} />
              <span style={{ display: "block", width: "36px", height: "4px", borderRadius: "3px", background: C.textBody }} />
              <span style={{ display: "block", width: "36px", height: "4px", borderRadius: "3px", background: C.textBody }} />
              <span style={{ display: "block", fontSize: "12px", fontWeight: 700, color: C.textBody, letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1, marginTop: "3px" }}>Menu</span>
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
            background: "rgba(255,255,255,0.98)",
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
          {          [
            { href: "/about-me/editor", label: "✨ About Me" },
            { href: "/scenarios",  label: "🌊 The New Wave" },
            { href: "/how-to-use", label: "How It Works" },
            { href: "/blog",       label: "📝 Blog" },
            { href: "/guides",       label: "📖 Guides" },
            { href: "/allied-health", label: "🩺 Allied Health" },
            { href: "/coordinators", label: "🔗 For Coordinators" },
            { href: "/contact",    label: "✉️ Contact" },
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
        .mobile-top-nav { display: none; }
        .footer-nav-links { display: flex; }
        .mobile-aboutme-btn { display: none; }
        @media (max-width: 768px) {
          #main-content { padding-top: 110px !important; }
          .hero-section { padding-top: 16px !important; }
          .hidden-mobile { display: none !important; }
          .desktop-nav   { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .mobile-top-nav { display: block !important; }
          .footer-nav-links { display: none !important; }
          .mobile-aboutme-btn {
            display: inline-flex !important;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f5c842 0%, #f59e0b 100%);
            color: #0f4c45;
            font-family: 'Outfit', sans-serif;
            text-decoration: none;
            padding: 6px 14px 8px;
            border-radius: 99px;
            box-shadow: 0 2px 12px rgba(245,200,66,0.45);
            flex-shrink: 0;
          }
          .mobile-aboutme-inner {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
          }
          .mobile-aboutme-title {
            font-size: 13px;
            font-weight: 900;
            letter-spacing: 0.01em;
            white-space: nowrap;
            line-height: 1.2;
          }
          .mobile-aboutme-tag {
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.03em;
            opacity: 0.75;
            white-space: nowrap;
            line-height: 1;
          }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        /* Landscape mobile — switch to hamburger/strip nav on phone-sized heights */
        @media (orientation: landscape) and (max-height: 900px) {
          #main-content { padding-top: 110px !important; }
          .hero-section { padding-top: 8px !important; }
          .landscape-hero-buffer { height: 0 !important; }
          .hidden-mobile { display: none !important; }
          .desktop-nav   { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .mobile-top-nav { display: block !important; }
          .footer-nav-links { display: none !important; }
          .hero-inner-flex { gap: 32px !important; justify-content: center !important; }
          .hero-left-col { flex: 1 1 260px !important; max-width: 360px !important; min-width: 220px !important; }
          .hero-right-col { flex-shrink: 0 !important; margin-left: 0 !important; transform: scale(0.82) !important; transform-origin: top center !important; margin-top: -20px !important; }
        }
      `}</style>

      <main id="main-content" style={{ paddingTop: "174px" }}>

        {/* ── MOBILE TOP NAV STRIP — shown only on mobile, hidden on desktop ── */}
        <div className="mobile-top-nav" style={{ display: "none" }}>
          <div style={{
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            display: "flex",
            gap: "6px",
            padding: "10px 16px 18px",
            borderBottom: `1px solid ${C.border}`,
            background: "rgba(255,255,255,0.97)",
          }}>
            {/* About Me Profile — gold pill with tagline, first in mobile nav strip */}
            <div style={{ position: "relative", display: "inline-flex", flexShrink: 0 }}>
              <Link
                href="/about-me/editor"
                style={{
                  display: "inline-flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "2px",
                  background: "linear-gradient(135deg, #f5c842 0%, #f59e0b 100%)",
                  color: "#0f4c45",
                  textDecoration: "none",
                  padding: "5px 14px 7px",
                  borderRadius: "99px",
                  boxShadow: "0 2px 8px rgba(245,200,66,0.40)",
                }}
              >
                <span style={{ fontSize: "13px", fontWeight: 900, whiteSpace: "nowrap", lineHeight: 1.2 }}>✨ About Me</span>
                <span style={{ fontSize: "9px", fontWeight: 700, opacity: 0.75, whiteSpace: "nowrap", lineHeight: 1, letterSpacing: "0.03em" }}>Continuity for Aged &amp; Disabled Persons</span>
              </Link>
              <span style={{ position: "absolute", top: "3px", left: "-12px", background: "linear-gradient(135deg, #b91c1c 0%, #7f1d1d 40%, #c0392b 70%, #991b1b 100%)", color: "#fff", fontSize: "8px", fontWeight: 900, letterSpacing: "0.06em", padding: "2px 7px", borderRadius: "99px", boxShadow: "0 2px 5px rgba(120,20,20,0.55), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.25)", textTransform: "uppercase", whiteSpace: "nowrap", border: "1px solid rgba(255,255,255,0.15)", pointerEvents: "none" }}>Free to use</span>
            </div>
            {[
              { href: "/how-to-use", label: "How It Works",    teal: false },
              { href: "/scenarios",  label: "Scenarios",       teal: false },
              { href: "/blog",       label: "Blog",            teal: false },
              { href: "/guides",       label: "Guides",            teal: false },
              { href: "/allied-health", label: "🩺 Allied Health", teal: true },
              { href: "/coordinators", label: "🔗 For Coordinators", teal: false },
              { href: "/privacy",    label: "Legal & Privacy", teal: false },
              { href: "/contact",    label: "Contact",         teal: false },
              { href: "/demo",       label: "Try Demo",        teal: false },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: link.teal ? C.teal : C.textHead,
                  fontSize: "13px",
                  fontWeight: link.teal ? 800 : 600,
                  textDecoration: "none",
                  padding: "6px 14px",
                  borderRadius: "99px",
                  border: link.teal ? `1.5px solid ${C.teal}88` : `1px solid ${C.border}`,
                  background: link.teal ? `rgba(26,184,160,0.12)` : "rgba(255,255,255,0.55)",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >{link.label}</Link>
            ))}
          </div>
        </div>

        {/* Wave section removed */}
        {false && <section aria-labelledby="wave-heading">
          {/* Full-bleed wave gradient background */}
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(160deg, #dce8f5 0%, #c4d8ef 40%, #9abde0 70%, #2554c7 100%)`,
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
                  color: "#0f2a4a",
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
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13px", color: "#4a6a8a", margin: "6px 0 0", letterSpacing: "0.06em", textTransform: "uppercase" }}>
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
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: "#0f2a4a", fontSize: "24px", fontWeight: 700, marginBottom: "10px", lineHeight: 1.1 }}>{tile.title}</h3>
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
        {/* ── PARTNERSHIP BANNER ── */}
        <section
          aria-label="About InSync Profiles"
          style={{
            position: "relative",
            overflow: "hidden",
            minHeight: "280px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Background photo */}
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&q=80"
            alt=""
            aria-hidden="true"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.45)" }}
          />
          {/* Logo card — top right corner */}
          <div style={{ position: "absolute", top: "16px", right: "16px", zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", background: "rgba(255,255,255,0.70)", borderRadius: "14px", padding: "12px 16px", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.18)" }}>
            <img src="/assets/insync-logo-transparent_9e0df532.png" alt="InSync Profiles" style={{ width: "52px", height: "52px", objectFit: "contain" }} />
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 900, fontSize: "0.85rem", color: "#fff", textAlign: "center" }}>InSync</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", textAlign: "center" }}>PROFILES</div>
          </div>
          {/* Content overlay */}
          <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "56px 32px", display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "40px", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 400px", maxWidth: "620px" }}>
              <h1 id="hero-heading" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.4rem, 3vw, 2.2rem)", fontWeight: 800, color: "#0f2a4a", lineHeight: 1.35, marginBottom: "16px" }}>
                When people are known before they are supported,{" "}
                <br />support becomes a{" "}
                <em style={{ fontStyle: "italic", color: "#f0c040" }}>partnership.</em>
              </h1>
              <p style={{ fontSize: "clamp(13px, 1.6vw, 15px)", color: "rgba(255,255,255,0.82)", lineHeight: 1.8, marginBottom: "28px", maxWidth: "520px", fontFamily: "'Outfit', sans-serif" }}>
                InSync Profiles was created from lived experience as a family carer and support worker, with one purpose: to make support feel more human, more informed and more in sync.
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link href="/view" style={{ background: C.teal, color: "#fff", fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "15px", padding: "11px 24px", borderRadius: "8px", textDecoration: "none" }}>Explore the demo</Link>
                <Link href="/ecosystem" style={{ background: "rgba(255,255,255,0.12)", color: "#fff", fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "15px", padding: "11px 24px", borderRadius: "8px", textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.35)" }}>Learn more</Link>
              </div>
            </div>
          </div>
        </section>


        {/* ── SPLIT HERO IMAGE ── */}
        <section aria-label="Before and after InSync Profiles" style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "0 0 0 0" }}>
          <img
            src="/split_hero_known.jpg"
            alt="Left side: a person overwhelmed by paperwork with speech bubbles saying 'Tell your story again...', 'Start over new forms', 'Explain everything again', 'Start over again'. Right side: a smiling support worker with an elderly person, showing Sarah Torens' accessible profile with the text 'Known. Understood. In sync.'"
            style={{ width: "100%", display: "block", objectFit: "cover" }}
          />
        </section>

        {/* ── REAL CHOICE INFOGRAPHIC ── */}
        <InfographicSection />

        {/* ── YOUR PROFILE GOES WHERE YOU GO ── */}
        <section
          style={{
            padding: "80px 24px",
            background: "rgba(210,228,248,0.97)",
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
              Ready to get your team<br />
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

      </main>

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
          <div className="footer-nav-links" style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { href: "/how-to-use", label: "How It Works" },
              { href: "/scenarios",  label: "Scenarios" },
              { href: "/blog",       label: "Blog" },
              { href: "/guides",     label: "Guides" },
              { href: "/privacy",    label: "Legal & Privacy" },
              { href: "/contact",    label: "Contact" },
              { href: "/demo",      label: "Try Demo" },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{ color: C.textDim, fontSize: "12px", textDecoration: "none", transition: "color 150ms" }}>{link.label}</Link>
            ))}
          </div>
        </footer>
    </div>
  );
}
