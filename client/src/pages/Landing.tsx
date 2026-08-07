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
            <div style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: "11px", fontWeight: 700, padding: "5px 12px", borderRadius: "99px", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", gap: "5px" }}>
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
          <p style={{ position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.6)", fontSize: "12px", whiteSpace: "nowrap" }}>Tap outside or press Esc to close · Pinch to zoom on mobile</p>
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
              <Link key={item.label} href={item.href} style={{ color: "#1f2937", fontSize: "14px", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>{item.label}</Link>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link href="/view" style={{ background: "#0d9488", color: "#fff", fontSize: "14px", fontWeight: 700, padding: "9px 20px", borderRadius: "8px", textDecoration: "none", whiteSpace: "nowrap" }}>View demo</Link>
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
      <section style={{ position: "relative", overflow: "hidden", minHeight: "380px" }} aria-labelledby="hero-heading">
        <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&q=80" alt="" aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.45)" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: "700px", margin: "0 auto", padding: "72px 32px", textAlign: "center" }}>
          <h1 id="hero-heading" style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(1.4rem, 3vw, 2.2rem)", fontWeight: 800, color: "#ffffff", lineHeight: 1.4, marginBottom: "16px" }}>
            When people are known before they are supported,<br />support becomes a <em style={{ fontStyle: "italic", color: "#f0c040" }}>partnership.</em>
          </h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.85)", lineHeight: 1.8, marginBottom: "32px", maxWidth: "500px", margin: "0 auto 32px" }}>
            InSync Profiles was created from lived experience as a family carer and support worker, with one purpose: to make support feel more human, more informed and more in sync.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/view" style={{ background: "#0d9488", color: "#fff", fontSize: "15px", fontWeight: 700, padding: "12px 28px", borderRadius: "8px", textDecoration: "none" }}>Explore the demo</Link>
            <Link href="/ecosystem" style={{ background: "rgba(255,255,255,0.12)", color: "#fff", fontSize: "15px", fontWeight: 600, padding: "12px 28px", borderRadius: "8px", textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.35)" }}>Learn more</Link>
          </div>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", marginTop: "20px" }}>♡ Not an NDIS provider &nbsp;•&nbsp; A participant-first matching and communication resource</p>
        </div>
      </section>

      {/* ── SPLIT IMAGE ── */}
      <section aria-label="Before and after InSync Profiles" style={{ width: "100%" }}>
        <img src="/split_hero_known.jpg"
          alt="Left: overwhelmed person with paperwork and speech bubbles. Right: smiling support worker with elderly person showing 'Known. Understood. In sync.' with an accessible profile on screen."
          style={{ width: "100%", display: "block", objectFit: "cover" }} />
      </section>

      {/* ── CHALLENGES ── */}
      <section style={{ padding: "72px 24px", background: "#ffffff" }} aria-labelledby="challenges-heading">
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 id="challenges-heading" style={{ textAlign: "center", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0c1f36", marginBottom: "48px" }}>The challenges we all know too well</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>
            {[
              { icon: "💬", color: "#0d9488", title: "Retell your story", subtitle: "Again and again", desc: "Participants and carers often repeat the same information across providers, coordinators, support workers, hospitals and services.", underline: "#0d9488" },
              { icon: "🔍", color: "#f59e0b", title: "Choose with limited information", subtitle: "Availability is not compatibility", desc: "A name, a photo and a roster rarely tell someone how a support worker communicates, adapts or understands their needs, preferences and lived experience.", underline: "#f59e0b" },
              { icon: "🔄", color: "#7c3aed", title: "Start over when it doesn't fit", subtitle: "Mismatches have a cost", desc: "When support is a poor match, people lose trust, continuity, energy and sometimes the confidence to ask for what they need.", underline: "#7c3aed" },
            ].map(c => (
              <div key={c.title} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                  <div style={{ width: "52px", height: "52px", borderRadius: "50%", border: `2px solid ${c.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0, color: c.color }}>
                    {c.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "16px", color: "#0c1f36", lineHeight: 1.3 }}>{c.title}</div>
                    <div style={{ fontWeight: 600, fontSize: "13px", color: "#374151", marginTop: "2px" }}>{c.subtitle}</div>
                  </div>
                </div>
                <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.7, margin: 0 }}>{c.desc}</p>
                <div style={{ width: "40px", height: "3px", background: c.underline, borderRadius: "2px" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHIFT BANNER ── */}
      <section className="shift-banner" style={{ margin: "0 24px 48px", borderRadius: "20px", background: "linear-gradient(135deg, #e6f7f5 0%, #fef9ec 100%)", padding: "clamp(32px, 5vw, 48px) clamp(24px, 4vw, 40px)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "center", overflow: "hidden" }} aria-label="From fitting into services to services fitting around people">
        {/* Left */}
        <div>
          <h2 style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(1.4rem, 2.8vw, 2rem)", fontWeight: 800, color: "#0f2a4a", lineHeight: 1.3 }}>
            From fitting into services<br />
            <span style={{ color: "#374151", fontWeight: 500 }}>to services fitting</span><br />
            <span style={{ color: "#374151", fontWeight: 500 }}>around people</span>
          </h2>
          <div style={{ marginTop: "24px", width: "120px", height: "120px", background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px", boxShadow: "0 8px 24px rgba(13,148,136,0.25)" }}>
            📦
          </div>
        </div>
        {/* Right */}
        <div style={{ textAlign: "center", position: "relative" }}>
          <div style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.7rem)", fontWeight: 800, color: "#0f2a4a", marginBottom: "24px" }}>
            Support that<br />fits <em style={{ fontStyle: "italic", color: "#0d9488" }}>you.</em>
          </div>
          <div style={{ position: "relative", display: "inline-block" }}>
            <div style={{ width: "100px", height: "100px", borderRadius: "50%", overflow: "hidden", border: "4px solid #fff", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", margin: "0 auto" }}>
              <img src="/assets/kira_chen_headshot_70b4d1ab.png" alt="Participant" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            {[
              { icon: "💬", top: "-20px", right: "-30px", bg: "#fff" },
              { icon: "👂", top: "-10px", right: "60px", bg: "#fef3c7" },
              { icon: "📅", bottom: "10px", right: "-30px", bg: "#e0f2fe" },
              { icon: "👤", bottom: "-10px", left: "-30px", bg: "#ede9fe" },
              { icon: "👤", bottom: "30px", left: "60px", bg: "#d1fae5" },
            ].map((b, i) => (
              <div key={i} style={{ position: "absolute", top: b.top, bottom: b.bottom, left: b.left, right: b.right, width: "36px", height: "36px", borderRadius: "50%", background: b.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.10)", border: "2px solid #fff" }}>{b.icon}</div>
            ))}
          </div>
        </div>
        <style>{`@media (max-width: 600px) { .shift-banner { grid-template-columns: 1fr !important; margin: 0 12px 32px !important; } }`}</style>
      </section>

      {/* ── COMPARISON + ECOSYSTEM ── */}
      <section className="compare-section" style={{ padding: "48px 24px", background: "#f8fafc" }}>
        <div className="compare-grid" style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "start" }}>
          {/* Comparison table */}
          <div>
            <h2 style={{ fontSize: "clamp(1.1rem, 2vw, 1.3rem)", fontWeight: 800, color: "#0c1f36", marginBottom: "20px" }}>What makes InSync Profiles different?</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr>
                  <th style={{ padding: "10px 16px", textAlign: "left", background: "#f1f5f9", color: "#374151", fontWeight: 700, borderRadius: "8px 0 0 0", border: "1px solid #e2e8f0" }}>Traditional matching</th>
                  <th style={{ padding: "10px 16px", textAlign: "left", background: "#0d9488", color: "#fff", fontWeight: 700, borderRadius: "0 8px 0 0", border: "1px solid #0d9488" }}>InSync approach</th>
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
                    <td style={{ padding: "9px 16px", border: "1px solid #e2e8f0", color: "#374151", background: "#fff" }}>
                      {old && <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ color: "#ef4444", fontWeight: 700 }}>✗</span> {old}</span>}
                    </td>
                    <td style={{ padding: "9px 16px", border: "1px solid #ccede9", color: "#0c1f36", background: "#f0faf9" }}>
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
            <p style={{ fontSize: "14px", color: "#374151", marginBottom: "32px" }}>Stronger connections. Better outcomes. For everyone.</p>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
              {[
                { icon: "👤", label: "Participants", bg: "#dbeafe", color: "#1d4ed8" },
                { icon: "👨‍👩‍👧", label: "Carers &\nFamilies", bg: "#fef3c7", color: "#b45309" },
                { icon: "🏅", label: "Support\nWorkers", bg: "#ede9fe", color: "#6d28d9" },
                { icon: "🤝", label: "Support\nCoordinators", bg: "#d1fae5", color: "#065f46" },
                { icon: "🏢", label: "Providers", bg: "#e0f2fe", color: "#0369a1" },
                { icon: "❤️", label: "Aged Care", bg: "#fce7f3", color: "#9d174d" },
              ].map(e => (
                <div key={e.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flex: "1 1 80px" }}>
                  <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: e.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", border: `2px solid ${e.color}22` }}>{e.icon}</div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#1f2937", textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.3 }}>{e.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`@media (max-width: 700px) { .compare-grid { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* ── ACCESSIBILITY STRIP ── */}
      <section className="access-section" style={{ padding: "56px 24px", background: "#ffffff" }} aria-labelledby="access-heading">
        <div className="access-grid" style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "auto 1fr", gap: "48px", alignItems: "center" }}>
          <div style={{ maxWidth: "220px" }}>
            <h2 id="access-heading" style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0d9488", lineHeight: 1.3 }}>
              Accessibility is<br />the foundation<br />of being understood.
            </h2>
          </div>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "space-around" }}>
            {[
              { icon: "🌐", label: "Multi-language" },
              { icon: "🎙️", label: "Voice options" },
              { icon: "👁️", label: "Visual supports" },
              { icon: "Aa", label: "Readable\nformats", isText: true },
              { icon: "💬", label: "Plain language" },
              { icon: "🤲", label: "Trauma-aware" },
              { icon: "🧠", label: "Neurodiversity\naffirming" },
            ].map(a => (
              <div key={a.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", minWidth: "72px" }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "12px", border: "1.5px solid #e0e7ef", display: "flex", alignItems: "center", justifyContent: "center", fontSize: a.isText ? "16px" : "22px", fontWeight: a.isText ? 800 : 400, color: a.isText ? "#0d9488" : "inherit", background: "#f8fafc" }}>{a.icon}</div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#1f2937", textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.3 }}>{a.label}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media (max-width: 700px) { .access-grid { grid-template-columns: 1fr !important; gap: 24px !important; } }`}</style>
      </section>


      {/* ── FOOTER ── */}
      <footer style={{ background: "#ffffff", borderTop: "1px solid #e8eef5", padding: "16px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {["♡ Participant-led", "• Choice and control", "• Understanding over assumptions"].map(t => (
              <span key={t} style={{ fontSize: "12px", color: "#374151" }}>{t}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", color: "#374151" }}>© 2024 InSync Profiles</span>
            {["Privacy", "Terms", "Contact"].map(l => (
              <Link key={l} href={`/${l.toLowerCase()}`} style={{ fontSize: "12px", color: "#1f2937", textDecoration: "none", fontWeight: 600 }}>{l}</Link>
            ))}
            <button aria-label="Accessibility" style={{ width: "28px", height: "28px", borderRadius: "50%", border: "1.5px solid #e0e7ef", background: "#fff", cursor: "pointer", fontSize: "14px" }}>♿</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
