/* ============================================================
   Contact.tsx — Contact Page
   Design: Aurora — Immersive Depth (matching site style)
   ============================================================ */
import { Link } from "wouter";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import { useA11y } from "@/hooks/useA11y";

const TEXT_HEAD  = "#0f2336";
const TEXT_BODY  = "#1e3a52";
const TEXT_DIM   = "#5a7a9a";
const GOLD       = "#b07d0a";
const GOLD_LIGHT = "#f5c842";
const TEAL       = "#1ab8a0";
const BORDER     = "rgba(100,160,220,0.30)";
const CARD_BG    = "rgba(255,255,255,0.72)";

export default function Contact() {
  const { wrapperStyle: a11yStyle } = useA11y();

  return (
    <div data-tts-content="true" style={{ ...a11yStyle,
      minHeight: "100vh",
      background: "linear-gradient(160deg, #e8f4fd 0%, #d4eaf7 30%, #f0f7e8 60%, #fdf6e3 100%)",
      fontFamily: "'Outfit', 'Inter', sans-serif",
      color: TEXT_BODY,
    }}>
      <AccessibilityToolbar />

      {/* ── Header ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(232,244,253,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${BORDER}`,
        padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "64px",
      }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 700, color: TEXT_HEAD, letterSpacing: "-0.01em" }}>
            InSync <span style={{ color: TEAL }}>Profiles</span>
          </span>
        </Link>
        <nav style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <Link href="/pricing" style={{ color: TEXT_HEAD, fontSize: "15px", fontWeight: 600, textDecoration: "none", padding: "7px 14px", borderRadius: "8px" }}>Pricing</Link>
          <Link href="/how-to-use" style={{ color: TEXT_HEAD, fontSize: "15px", fontWeight: 600, textDecoration: "none", padding: "7px 14px", borderRadius: "8px" }}>How It Works</Link>
          <Link href="/demo" style={{
            background: `linear-gradient(135deg, ${TEAL} 0%, ${GOLD_LIGHT} 100%)`,
            color: "#0d1b2a", fontSize: "14px", fontWeight: 800,
            textDecoration: "none", padding: "8px 20px", borderRadius: "99px",
          }}>Try Demo</Link>
        </nav>
      </header>

      {/* ── Main content ── */}
      <main style={{ maxWidth: "680px", margin: "0 auto", padding: "64px 24px 80px" }}>

        {/* Page title */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.12em", color: TEAL, textTransform: "uppercase", marginBottom: "12px" }}>
            GET IN TOUCH
          </p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(36px, 6vw, 52px)",
            fontWeight: 700,
            color: TEXT_HEAD,
            lineHeight: 1.15,
            margin: "0 0 16px",
          }}>
            Contact Us
          </h1>
          <p style={{ fontSize: "17px", color: TEXT_DIM, lineHeight: 1.6, maxWidth: "480px", margin: "0 auto" }}>
            Questions about InSync Profiles, licensing, or how it works for your team? We'd love to hear from you.
          </p>
        </div>

        {/* Contact card */}
        <div style={{
          background: CARD_BG,
          border: `1px solid ${BORDER}`,
          borderRadius: "20px",
          padding: "40px 40px",
          boxShadow: "0 8px 40px rgba(26,72,138,0.08)",
          marginBottom: "32px",
        }}>

          {/* Email block */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", marginBottom: "32px" }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "14px", flexShrink: 0,
              background: `linear-gradient(135deg, ${TEAL}22 0%, ${GOLD_LIGHT}22 100%)`,
              border: `1px solid ${TEAL}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "24px",
            }}>✉️</div>
            <div>
              <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", color: TEAL, textTransform: "uppercase", margin: "0 0 4px" }}>Email</p>
              <a
                href="mailto:insyncprofiles@gmail.com"
                style={{
                  fontSize: "20px", fontWeight: 700, color: TEXT_HEAD,
                  textDecoration: "none", display: "block", marginBottom: "6px",
                  transition: "color 150ms",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = TEAL)}
                onMouseLeave={e => (e.currentTarget.style.color = TEXT_HEAD)}
              >
                insyncprofiles@gmail.com
              </a>
              <p style={{ fontSize: "14px", color: TEXT_DIM, margin: 0, lineHeight: 1.5 }}>
                We typically respond within 1–2 business days.
              </p>
            </div>
          </div>

        </div>

        {/* ABN / Made in Australia */}
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/" style={{ fontSize: "14px", color: TEXT_DIM, textDecoration: "none", fontWeight: 600 }}>← Back to Home</Link>
            <span style={{ color: BORDER }}>·</span>
            <Link href="/pricing" style={{ fontSize: "14px", color: TEXT_DIM, textDecoration: "none", fontWeight: 600 }}>Pricing</Link>
            <span style={{ color: BORDER }}>·</span>
            <Link href="/privacy" style={{ fontSize: "14px", color: TEXT_DIM, textDecoration: "none", fontWeight: 600 }}>Legal & Privacy</Link>
          </div>
        </div>

      </main>
    </div>
  );
}
