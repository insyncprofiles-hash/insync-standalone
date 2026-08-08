import { useState } from "react";
import { Link } from "wouter";
import { useA11y } from "@/hooks/useA11y";

const GUIDES = [
  {
    id: "share-support",
    title: "Share the Right Support",
    subtitle: "Empower Informed Choice",
    description:
      "How coordinators, providers, and support teams can share worker profiles via email, social media, and dedicated website pages — instantly, to the right people.",
    src: "/assets/guide_share_support.jpg",
    downloadSrc: "/assets/guide_share_support.pdf",
    alt: "InSync Profiles guide: Share the Right Support — share via email, socials, or dedicate a page on your website",
  },
  {
    id: "when-familiar",
    title: "When Support Becomes Familiar",
    subtitle: "Who's actually going to support me?",
    description:
      "Real-world NDIS scenarios showing how InSync Profiles is used by LACs, Support Coordinators, Providers, Parents, Recovery Coaches, and SIL teams to help participants connect with the right worker.",
    src: "/assets/guide_when_familiar.jpg",
    downloadSrc: "/assets/guide_when_familiar.pdf",
    alt: "InSync Profiles guide: When Support Becomes Familiar — NDIS scenarios showing how profiles are used across LAC, coordinator, provider, parent, recovery coach, and SIL contexts",
  },
];

// Colour tokens matching the site's Aurora palette
const C = {
  bg: "#0d1b2a",
  card: "#0f2235",
  border: "rgba(45,212,191,0.18)",
  teal: "#1ab8a0",
  gold: "#f5c842",
  textHead: "#e8f4f0",
  textBody: "#a8c5bc",
  textDim: "#6b8f84",
};

export default function Guides() {
  const { wrapperStyle: a11yStyle } = useA11y();

  const [zoomed, setZoomed] = useState<string | null>(null);

  return (
    <div data-tts-content="true" style={{ ...a11yStyle, minHeight: "100vh", background: C.bg, color: C.textHead, fontFamily: "'Inter', sans-serif", paddingTop: "110px" }}>

      {/* Hero */}
      <section style={{ maxWidth: "860px", margin: "0 auto", padding: "60px 24px 32px", textAlign: "center" }}>
        <p style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "0.14em", color: C.teal, textTransform: "uppercase", marginBottom: "12px" }}>
          ✦ Resources
        </p>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 46px)", fontWeight: 900, lineHeight: 1.15, margin: "0 0 16px", color: C.textHead }}>
          InSync Profiles Guides
        </h1>
        <p style={{ fontSize: "17px", color: C.textBody, lineHeight: 1.7, maxWidth: "600px", margin: "0 auto 0" }}>
          Practical visual guides for support workers, coordinators, providers, and families — showing how InSync Profiles works in real NDIS contexts.
        </p>
      </section>

      {/* Guide cards */}
      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "24px 20px 80px", display: "flex", flexDirection: "column", gap: "56px" }}>
        {GUIDES.map(guide => (
          <article
            key={guide.id}
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            {/* Text header */}
            <div style={{ padding: "28px 28px 20px" }}>
              <h2 style={{ fontSize: "22px", fontWeight: 800, color: C.textHead, margin: "0 0 4px" }}>{guide.title}</h2>
              <p style={{ fontSize: "15px", fontWeight: 700, color: C.teal, margin: "0 0 12px" }}>{guide.subtitle}</p>
              <p style={{ fontSize: "14px", color: C.textBody, lineHeight: 1.65, margin: 0 }}>{guide.description}</p>
            </div>

            {/* Image — tap to zoom */}
            <div
              style={{ position: "relative", cursor: "zoom-in" }}
              onClick={() => setZoomed(guide.id)}
              role="button"
              aria-label={`Zoom in: ${guide.title}`}
              tabIndex={0}
              onKeyDown={e => e.key === "Enter" && setZoomed(guide.id)}
            >
              <img
                src={guide.src}
                alt={guide.alt}
                style={{ width: "100%", display: "block", objectFit: "contain" }}
                loading="lazy"
              />
              <div style={{
                position: "absolute", bottom: "12px", right: "12px",
                background: "rgba(13,27,42,0.82)", backdropFilter: "blur(6px)",
                border: `1px solid ${C.border}`, borderRadius: "8px",
                padding: "5px 12px", fontSize: "12px", fontWeight: 700, color: C.teal,
                pointerEvents: "none",
              }}>
                🔍 Tap to zoom
              </div>
            </div>

            {/* Download link */}
            <div style={{ padding: "16px 28px 24px", display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
              <a
                href={guide.downloadSrc ?? guide.src}
                download
                style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  background: `linear-gradient(135deg, ${C.teal} 0%, ${C.gold} 100%)`,
                  color: "#0d1b2a", fontSize: "14px", fontWeight: 800,
                  textDecoration: "none", padding: "9px 20px", borderRadius: "99px",
                }}
              >
                ↓ Download PDF Guide
              </a>
            </div>
          </article>
        ))}
      </section>

      {/* Footer nav */}
      <div style={{ textAlign: "center", padding: "0 20px 48px", display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
        <Link href="/" style={{ fontSize: "14px", color: C.textDim, textDecoration: "none", fontWeight: 600 }}>← Back to Home</Link>
        <span style={{ color: C.border }}>·</span>
        <Link href="/coordinators" style={{ fontSize: "14px", color: C.textDim, textDecoration: "none", fontWeight: 600 }}>For Coordinators</Link>
        <span style={{ color: C.border }}>·</span>
        <Link href="/scenarios" style={{ fontSize: "14px", color: C.textDim, textDecoration: "none", fontWeight: 600 }}>Scenarios</Link>
        <span style={{ color: C.border }}>·</span>
        <Link href="/pricing" style={{ fontSize: "14px", color: C.textDim, textDecoration: "none", fontWeight: 600 }}>Pricing</Link>
      </div>

      {/* Lightbox zoom overlay */}
      {zoomed && (() => {
        const guide = GUIDES.find(g => g.id === zoomed)!;
        return (
          <div
            onClick={() => setZoomed(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`Zoomed view: ${guide.title}`}
            style={{
              position: "fixed", inset: 0, zIndex: 9999,
              background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "16px", cursor: "zoom-out",
            }}
          >
            <img
              src={guide.src}
              alt={guide.alt}
              style={{
                maxWidth: "100%", maxHeight: "92vh",
                objectFit: "contain", borderRadius: "12px",
                boxShadow: "0 0 60px rgba(0,0,0,0.8)",
              }}
            />
            <button
              onClick={() => setZoomed(null)}
              aria-label="Close zoom"
              style={{
                position: "fixed", top: "16px", right: "16px",
                background: "rgba(255,255,255,0.12)", border: "none",
                color: "#fff", fontSize: "22px", width: "44px", height: "44px",
                borderRadius: "50%", cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}
            >✕</button>
          </div>
        );
      })()}
    </div>
  );
}
