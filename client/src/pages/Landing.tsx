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
            <h2 style={{ fontSize: "clamp(1.1rem, 2vw, 1.3rem)", fontWeight: 800, color: "#0c1f36", marginBottom: "6px", textAlign: "center" }}>Built for the whole support circle</h2>
            <p style={{ fontSize: "15px", color: "#374151", marginBottom: "28px", textAlign: "center" }}>Stronger connections. Better outcomes. For everyone.</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "clamp(12px, 3vw, 28px)", flexWrap: "wrap" }}>
              {[
                { label: "Participants", bg: "#3a9e9e", icon: <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg> },
                { label: "Carers &\nFamilies", bg: "#d4a017", icon: <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="3"/><path d="M3 21c0-3 2.7-5.5 6-5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M13 21c0-2.5 1.8-4.5 4-4.5s4 2 4 4.5"/></svg> },
                { label: "Support\nWorkers", bg: "#7b5ea7", icon: <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><rect x="8" y="13" width="8" height="9" rx="1"/><line x1="10" y1="13" x2="10" y2="22"/><line x1="14" y1="13" x2="14" y2="22"/><line x1="8" y1="17" x2="16" y2="17"/></svg> },
                { label: "Support\nCoordinators", bg: "#3a9e9e", icon: <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5 21c0-3.5 3.1-6 7-6s7 2.5 7 6"/><line x1="5" y1="14" x2="3" y2="16"/><line x1="19" y1="14" x2="21" y2="16"/></svg> },
                { label: "Providers", bg: "#5a9e6e", icon: <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V9l7-6 7 6v12"/><rect x="9" y="13" width="2" height="4"/><rect x="13" y="13" width="2" height="4"/><path d="M9 9h6"/></svg> },
                { label: "Aged Care", bg: "#4a8fa8", icon: <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21C12 21 4 15.5 4 9.5a4 4 0 0 1 8-0.5 4 4 0 0 1 8 0.5C20 15.5 12 21 12 21z"/><path d="M8 13c1 1.5 2.5 2.5 4 3"/></svg> },
              ].map(e => (
                <div key={e.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", minWidth: "72px" }}>
                  <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: e.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {e.icon}
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
