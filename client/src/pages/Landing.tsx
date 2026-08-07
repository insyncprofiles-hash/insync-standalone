/* ============================================================
   Landing.tsx — InSync Profiles Marketing Landing Page
   Design: Clean white/light background · Teal & navy accents
           Reference: 60dfa60d design — exact match
   Fonts: Inter (body) + display weights for headings
   ============================================================ */
import { Link } from "wouter";
import { useState, useEffect, useRef } from "react";

// ── Infographic section with tap-to-zoom lightbox ─────────────
function InfographicSection() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setLightboxOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen]);
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);
  const IMG_SRC = "/assets/infographic_branded_v2_0438716f.png";
  const IMG_ALT = "InSync Profiles infographic — Real choice starts when everyone is included.";
  return (
    <>
      <section style={{ padding: "64px 24px 80px", maxWidth: "860px", margin: "0 auto", textAlign: "center" }} aria-labelledby="infographic-heading">
        <div style={{ marginBottom: "36px" }}>
          <h2 id="infographic-heading" style={{ fontFamily: "Inter, sans-serif", color: "#0f2a4a", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, lineHeight: 1.1, marginBottom: "14px" }}>
            Real Choice Starts <span style={{ color: "#0d9488" }}>When Everyone Is Included.</span>
          </h2>
          <p style={{ color: "#4a6a8a", fontSize: "15px", lineHeight: 1.75, maxWidth: "540px", margin: "0 auto" }}>
            Accessible. Interactive. Family informed. Because choice and control belongs to the person — and the people who know them best.
          </p>
        </div>
        <div style={{ position: "relative", display: "inline-block", maxWidth: "100%" }}>
          <button onClick={() => setLightboxOpen(true)} aria-label="Tap to zoom in and read the infographic"
            style={{ background: "none", border: "none", padding: 0, cursor: "zoom-in", display: "block", width: "100%", borderRadius: "20px", position: "relative" }}>
            <img src={IMG_SRC} alt={IMG_ALT} style={{ width: "100%", borderRadius: "20px", display: "block", boxShadow: "0 8px 40px rgba(0,0,0,0.12)" }} />
            <div style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: "12px", fontWeight: 700, padding: "5px 12px", borderRadius: "99px", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", gap: "5px" }}>
              🔍 Tap to zoom
            </div>
          </button>
        </div>
      </section>
      {lightboxOpen && (
        <div onClick={() => setLightboxOpen(false)} role="dialog" aria-modal="true" aria-label="Infographic zoomed view"
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", cursor: "zoom-out", backdropFilter: "blur(4px)" }}>
          <img src={IMG_SRC} alt={IMG_ALT} style={{ maxWidth: "100%", maxHeight: "90vh", borderRadius: "12px", objectFit: "contain", boxShadow: "0 20px 80px rgba(0,0,0,0.6)" }} />
          <button onClick={() => setLightboxOpen(false)} aria-label="Close zoomed infographic"
            style={{ position: "absolute", top: "16px", right: "16px", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", width: "40px", height: "40px", borderRadius: "50%", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>✕</button>
          <p style={{ position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.6)", fontSize: "13px", whiteSpace: "nowrap" }}>Tap outside or press Esc to close · Pinch to zoom on mobile</p>
        </div>
      )}
    </>
  );
}

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, []);

  // Force light theme on landing page — remove dark class from html element
  useEffect(() => {
    const root = document.documentElement;
    const hadDark = root.classList.contains("dark");
    root.classList.remove("dark");
    root.style.background = "#ffffff";
    document.body.style.background = "#ffffff";
    return () => {
      if (hadDark) root.classList.add("dark");
      root.style.background = "";
      document.body.style.background = "";
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif", color: "#111827" }}>

      {/* ── NAV ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: scrolled ? "rgba(255,255,255,0.98)" : "#ffffff", borderBottom: "1px solid #e8eef5", boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,0.08)" : "none", transition: "all 0.2s ease" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <img src="/assets/insync-logo-transparent_9e0df532.png" alt="InSync Profiles" style={{ width: "40px", height: "40px", objectFit: "contain" }} />
            <div>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "16px", color: "#0c1f36", lineHeight: 1.1 }}>InSync</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#0a7a72" }}>PROFILES</div>
            </div>
          </Link>
          {/* Desktop nav */}
          <div style={{ display: "flex", alignItems: "center", gap: "28px" }} className="desktop-nav">
            {[
              { label: "Home", href: "/" },
              { label: "How it works", href: "/how-it-works" },
              { label: "For participants & carers", href: "/about-me/editor" },
              { label: "For support workers", href: "/view" },
              { label: "For providers", href: "/allied-health" },
              { label: "About us", href: "/about" },
              { label: "Contact", href: "/contact" },
            ].map(item => (
              <Link key={item.label} href={item.href} style={{ color: "#1f2937", fontSize: "16px", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>{item.label}</Link>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link href="/view" style={{ background: "#0d9488", color: "#fff", fontSize: "16px", fontWeight: 700, padding: "9px 20px", borderRadius: "8px", textDecoration: "none", whiteSpace: "nowrap" }}>View demo</Link>
            <button aria-label="Accessibility options" style={{ width: "36px", height: "36px", borderRadius: "50%", border: "1.5px solid #e0e7ef", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>♿</button>
            {/* Mobile hamburger */}
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(o => !o)} aria-label="Open menu" style={{ width: "36px", height: "36px", borderRadius: "8px", border: "1.5px solid #e0e7ef", background: "#fff", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "5px" }}>
              <span style={{ width: "18px", height: "2px", background: "#1f2937", borderRadius: "2px" }} />
              <span style={{ width: "18px", height: "2px", background: "#1f2937", borderRadius: "2px" }} />
              <span style={{ width: "18px", height: "2px", background: "#1f2937", borderRadius: "2px" }} />
            </button>
          </div>
        </div>
        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div style={{ background: "#fff", borderTop: "1px solid #e8eef5", padding: "16px 24px", display: "flex", flexDirection: "column", gap: "4px" }}>
            {[
              { label: "Home", href: "/" },
              { label: "How it works", href: "/how-it-works" },
              { label: "For participants & carers", href: "/about-me/editor" },
              { label: "For support workers", href: "/view" },
              { label: "For providers", href: "/allied-health" },
              { label: "About us", href: "/about" },
              { label: "Contact", href: "/contact" },
            ].map(item => (
              <Link key={item.label} href={item.href} onClick={() => setMobileMenuOpen(false)} style={{ color: "#1f2937", fontSize: "16px", fontWeight: 600, textDecoration: "none", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>{item.label}</Link>
            ))}
            <Link href="/view" onClick={() => setMobileMenuOpen(false)} style={{ background: "#0d9488", color: "#fff", fontSize: "15px", fontWeight: 700, padding: "12px 20px", borderRadius: "8px", textDecoration: "none", textAlign: "center", marginTop: "8px" }}>View demo</Link>
          </div>
        )}
        <style>{`
          @media (max-width: 900px) { .desktop-nav { display: none !important; } }
          @media (min-width: 901px) { .mobile-menu-btn { display: none !important; } }
        `}</style>
      </nav>

      {/* ── HERO — Partnership banner as full-width hero ── */}
      <section style={{ position: "relative", overflow: "hidden", minHeight: "460px", display: "flex", flexDirection: "column" }} aria-labelledby="hero-heading">
        <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&q=80" alt="" aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.48)" }} />
        {/* Text content — top */}
        <div style={{ position: "relative", zIndex: 2, maxWidth: "700px", margin: "0 auto", padding: "64px 32px 24px", textAlign: "center", flex: 1 }}>
          <h1 id="hero-heading" style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(2rem, 4.5vw, 3.2rem)", fontWeight: 900, color: "#ffffff", lineHeight: 1.2, marginBottom: "20px", textShadow: "0 2px 16px rgba(0,0,0,0.6)" }}>
            When people are known before they are supported,<br />support becomes a <em style={{ fontStyle: "italic", color: "#f0c040" }}>partnership.</em>
          </h1>
          <p style={{ fontSize: "18px", color: "#ffffff", lineHeight: 1.8, maxWidth: "540px", margin: "0 auto", textShadow: "0 1px 8px rgba(0,0,0,0.5)", fontWeight: 500 }}>
            InSync Profiles was created from lived experience as a family carer and support worker, with one purpose: to make support feel more human, more informed and more in sync.
          </p>
        </div>
        {/* Buttons — pinned to bottom */}
        <div style={{ position: "relative", zIndex: 2, padding: "24px 32px 40px", display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}>
          <p style={{ width: "100%", textAlign: "center", fontSize: "15px", color: "rgba(255,255,255,0.85)", fontWeight: 600, letterSpacing: "0.04em", marginBottom: "4px" }}>♡ A participant-first matching and communication resource</p>
          {/* About Me button */}
          <Link href="/about-me/editor" style={{ position: "relative", display: "inline-flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f0c040 0%, #e6a800 100%)", color: "#1a3a1a", fontSize: "17px", fontWeight: 900, padding: "14px 32px 12px", borderRadius: "40px", textDecoration: "none", boxShadow: "0 4px 20px rgba(240,192,64,0.4)", border: "2px solid rgba(255,255,255,0.3)", minWidth: "200px" }}>
            <span style={{ position: "absolute", top: "-12px", left: "12px", background: "#c0392b", color: "#fff", fontSize: "11px", fontWeight: 900, padding: "3px 10px", borderRadius: "20px", letterSpacing: "0.08em", textTransform: "uppercase", boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }}>FREE TO USE</span>
            <span style={{ fontSize: "18px", fontWeight: 900, letterSpacing: "0.02em" }}>✨ About Me</span>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#0a4a1a", letterSpacing: "0.05em", marginTop: "2px" }}>Continuity for Aged &amp; Disabled Persons</span>
          </Link>
          <Link href="/view" style={{ background: "#0d9488", color: "#fff", fontSize: "15px", fontWeight: 700, padding: "14px 28px", borderRadius: "8px", textDecoration: "none" }}>Explore Demo SW Profile</Link>
          <Link href="/ecosystem" style={{ background: "rgba(255,255,255,0.12)", color: "#fff", fontSize: "15px", fontWeight: 600, padding: "14px 28px", borderRadius: "8px", textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.35)" }}>Learn more</Link>
        </div>
      </section>

      {/* ── CHALLENGES ── */}
      <section style={{ padding: "80px 24px", background: "#f8fafc" }} aria-labelledby="challenges-heading">
        <div style={{ maxWidth: "960px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#0d9488", marginBottom: "12px" }}>Why it matters</p>
          <h2 id="challenges-heading" style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 900, color: "#0c1f36", marginBottom: "16px", lineHeight: 1.2 }}>The challenges we all know too well</h2>
          <p style={{ fontSize: "16px", color: "#4a6a8a", maxWidth: "560px", margin: "0 auto 56px", lineHeight: 1.7 }}>People deserve more than a name and a photo when choosing who enters their life.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "28px", textAlign: "left" }}>
            {[
              { icon: "💬", color: "#0d9488", bg: "#e6f7f5", title: "Retell your story", subtitle: "Again and again", desc: "Participants and carers repeat the same information across providers, coordinators, support workers, hospitals and services.", accent: "#0d9488" },
              { icon: "🔍", color: "#f59e0b", bg: "#fef9ec", title: "Choose with limited information", subtitle: "Availability is not compatibility", desc: "A name, a photo and a roster rarely tell someone how a support worker communicates, adapts or understands their needs.", accent: "#f59e0b" },
              { icon: "🔄", color: "#7c3aed", bg: "#f3f0ff", title: "Start over when it doesn't fit", subtitle: "Mismatches have a cost", desc: "When support is a poor match, people lose trust, continuity, energy and sometimes the confidence to ask for what they need.", accent: "#7c3aed" },
            ].map(c => (
              <div key={c.title} style={{ background: "#ffffff", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid #e8eef5", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px" }}>
                  {c.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "17px", color: "#0c1f36", lineHeight: 1.3, marginBottom: "4px" }}>{c.title}</div>
                  <div style={{ fontWeight: 600, fontSize: "15px", color: c.color }}>{c.subtitle}</div>
                </div>
                <p style={{ fontSize: "16px", color: "#4a6a8a", lineHeight: 1.75, margin: 0, flex: 1 }}>{c.desc}</p>
                <div style={{ width: "36px", height: "3px", background: c.accent, borderRadius: "2px" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHIFT BANNER ── */}

      {/* ── SHIFT BANNER IMAGE ── */}
      <section aria-label="From fitting into services to services fitting around people" style={{ padding: "0 0 48px" }}>
        <img src="/shift_banner.jpg"
          alt="From fitting into services to services fitting around people. Support that fits you. A teal cube with a hole, a smiling woman with floating support icons around her."
          style={{ width: "100%", display: "block", objectFit: "contain", background: "#f0f7f6" }} />
      </section>

      {/* ── SPLIT IMAGE ── */}
      <section aria-label="Before and after InSync Profiles" style={{ width: "100%" }}>
        <img src="/split_hero_known.jpg"
          alt="Left: overwhelmed person with paperwork and speech bubbles. Right: smiling support worker with elderly person showing 'Known. Understood. In sync.' with an accessible profile on screen."
          style={{ width: "100%", display: "block", objectFit: "cover" }} />
      </section>

      {/* ── COMPARISON + ECOSYSTEM ── */}
      <section className="compare-section" style={{ padding: "48px 24px", background: "#ffffff" }}>
        <div className="compare-grid" style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "start" }}>
          {/* Comparison table */}
          <div>
            <h2 style={{ fontSize: "clamp(1.1rem, 2vw, 1.3rem)", fontWeight: 800, color: "#0c1f36", marginBottom: "20px" }}>What makes InSync Profiles different?</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "16px" }}>
              <thead>
                <tr>
                  <th style={{ padding: "8px 14px", textAlign: "left", background: "#f1f5f9", color: "#374151", fontWeight: 700, border: "1px solid #e2e8f0", fontSize: "15px" }}>Traditional matching</th>
                  <th style={{ padding: "8px 14px", textAlign: "left", background: "#0d9488", color: "#fff", fontWeight: 700, border: "1px solid #0d9488", fontSize: "15px" }}>InSync approach</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Available worker", "Communication style"],
                  ["Basic profile", "Support preferences"],
                  ["Little communication insight", "Sensory & accessibility needs"],
                  ["Limited accessibility information", "Trauma-aware considerations"],
                  ["Hope it works", "Personality and compatibility"],
                  ["", "Informed choice & control"],
                ].map(([old, neo], i) => (
                  <tr key={i}>
                    <td style={{ padding: "7px 14px", border: "1px solid #e2e8f0", color: "#374151", background: "#fff", fontSize: "15px" }}>
                      {old && <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ color: "#ef4444", fontWeight: 700 }}>✗</span> {old}</span>}
                    </td>
                    <td style={{ padding: "7px 14px", border: "1px solid #ccede9", color: "#0c1f36", background: "#f0faf9", fontSize: "15px" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ color: "#0d9488", fontWeight: 700 }}>✓</span> {neo}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Ecosystem */}
          <div>
            <h2 style={{ fontSize: "clamp(1.1rem, 2vw, 1.3rem)", fontWeight: 800, color: "#0c1f36", marginBottom: "8px" }}>Built for the whole support circle</h2>
            <p style={{ fontSize: "16px", color: "#374151", marginBottom: "32px" }}>Stronger connections. Better outcomes. For everyone.</p>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", flexWrap: "wrap" }}>
              {[
                { svg: "M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z", label: "Participants", bg: "#b2dfdb", color: "#00796b" },
                { svg: "M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zm-8 0c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5c0-2.3-4.7-3.5-7-3.5zm8 0c-.3 0-.6 0-.9.1 1.1.8 1.9 1.8 1.9 3.4V19h6v-2.5c0-2.3-4.7-3.5-7-3.5z", label: "Carers &\nFamilies", bg: "#ffe0b2", color: "#e65100" },
                { svg: "M8 5v14l11-7z", label: "Support\nWorkers", bg: "#d1c4e9", color: "#4527a0" },
                { svg: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z", label: "Support\nCoordinators", bg: "#b2dfdb", color: "#00695c" },
                { svg: "M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z", label: "Providers", bg: "#bbdefb", color: "#1565c0" },
                { svg: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z", label: "Aged Care", bg: "#f8bbd0", color: "#c2185b" },
              ].map(e => (
                <div key={e.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flex: "1 1 80px" }}>
                  <div style={{ width: "68px", height: "68px", borderRadius: "50%", background: e.bg, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${e.color}33` }}>
                    <svg viewBox="0 0 24 24" width="32" height="32" fill={e.color}><path d={e.svg} /></svg>
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#1f2937", textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.3 }}>{e.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`@media (max-width: 700px) { .compare-grid { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* ── ACCESSIBILITY STRIP ── */}
      <section className="access-section" style={{ padding: "40px 24px", background: "#f8fafc", borderTop: "1px solid #e8eef5", borderBottom: "1px solid #e8eef5" }} aria-labelledby="access-heading">
        <div className="access-grid" style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "auto 1fr", gap: "48px", alignItems: "center" }}>
          <div style={{ maxWidth: "220px" }}>
            <h2 id="access-heading" style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0d9488", lineHeight: 1.3 }}>
              Accessibility is<br />the foundation<br />of being understood.
            </h2>
          </div>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "space-around" }}>
            {[
              { icon: "🌐", label: "Multi-language" },
              { icon: "🎙️", label: "Voice options" },
              { icon: "👁️", label: "Visual supports" },
              { icon: "Aa", label: "Readable\nformats", isText: true },
              { icon: "💬", label: "Plain language" },
              { icon: "🤲", label: "Trauma-aware" },
              { icon: "🧠", label: "Neurodiversity\naffirming" },
            ].map(a => (
              <div key={a.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", minWidth: "68px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "10px", border: "1.5px solid #d1d9e6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: a.isText ? "15px" : "20px", fontWeight: a.isText ? 800 : 400, color: a.isText ? "#0d9488" : "inherit", background: "#ffffff" }}>{a.icon}</div>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "#374151", textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.3 }}>{a.label}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media (max-width: 700px) { .access-grid { grid-template-columns: 1fr !important; gap: 24px !important; } }`}</style>
      </section>


      {/* ── FOOTER ── */}

      {/* ── PARTNERSHIP CLOSING BANNER ── */}
      <section style={{ position: "relative", overflow: "hidden", minHeight: "220px", display: "flex", alignItems: "center" }}>
        <img src="/partnership_photo.jpg" alt="" aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.48)" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: "700px", margin: "0 auto", padding: "48px 32px", width: "100%" }}>
          <div>
            <h2 style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)", fontWeight: 800, color: "#ffffff", lineHeight: 1.4, marginBottom: "12px", textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
              When people are known before they are supported,<br />support becomes a <em style={{ fontStyle: "italic", color: "#f0c040" }}>partnership.</em>
            </h2>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.88)", lineHeight: 1.7, maxWidth: "480px", marginBottom: "24px", textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
              InSync Profiles was created from lived experience as a family carer and support worker, with one purpose: to make support feel more human, more informed and more in sync.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/view" style={{ background: "#0d9488", color: "#fff", fontSize: "16px", fontWeight: 700, padding: "11px 24px", borderRadius: "8px", textDecoration: "none" }}>Explore the demo</Link>
              <Link href="/ecosystem" style={{ background: "rgba(255,255,255,0.12)", color: "#fff", fontSize: "16px", fontWeight: 600, padding: "11px 24px", borderRadius: "8px", textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.35)" }}>Learn more</Link>
            </div>
          </div>
        </div>
        <style>{`@media (max-width: 700px) { .partner-close { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      <footer style={{ background: "#ffffff", borderTop: "1px solid #e8eef5", padding: "16px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
         <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
           {["♡ Participant-led", "• Choice and control", "• Understanding over assumptions"].map(t => (
              <span key={t} style={{ fontSize: "13px", color: "#374151" }}>{t}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "13px", color: "#374151" }}>© 2026 InSync Profiles</span>
            <Link href="/privacy" style={{ fontSize: "13px", color: "#1f2937", textDecoration: "none", fontWeight: 600 }}>Privacy & Terms</Link>
            <Link href="/contact" style={{ fontSize: "13px", color: "#1f2937", textDecoration: "none", fontWeight: 600 }}>Contact</Link>
            <button aria-label="Accessibility" style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #f0c040 0%, #e6a800 100%)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="#1a1a1a"><path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-1 5h2c1.1 0 2 .9 2 2v4h-1v5h-2v-5H11v5H9v-5H8V9c0-1.1.9-2 2-2z"/></svg>
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
