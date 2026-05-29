/* ============================================================
   Skins.tsx — Profile Skin Packs — Coming Soon teaser page
   No skin preview images — just pack names, descriptions,
   skin names/taglines, and a notify-me email signup.
   ============================================================ */
import { SKIN_PACKS } from "@/lib/skins";

// ── Pack card (Coming Soon — no images) ──────────────────────
function PackCard({ pack }: { pack: typeof SKIN_PACKS[0] }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1.5px solid rgba(255,255,255,0.10)",
      borderRadius: "20px",
      padding: "28px 32px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Coming Soon ribbon */}
      <div style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        background: "linear-gradient(135deg, rgba(210,175,80,0.9), rgba(255,210,60,0.9))",
        color: "#1a1200",
        fontFamily: "'Outfit', sans-serif",
        fontSize: "10px",
        fontWeight: 800,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        padding: "5px 14px",
        borderRadius: "20px",
      }}>
        Coming Soon
      </div>

      {/* Pack header */}
      <div style={{ paddingRight: "110px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <span style={{ fontSize: "30px" }}>{pack.emoji}</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 700, color: "#f0e8d0", margin: 0 }}>{pack.name}</h2>
        </div>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "14px", color: "rgba(240,232,208,0.65)", margin: 0, lineHeight: 1.7, maxWidth: "520px" }}>{pack.description}</p>
      </div>

      {/* Skin name list — no images */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {pack.skins.map(skin => (
          <div key={skin.id} style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "12px",
            padding: "14px 18px",
          }}>
            <span style={{ fontSize: "24px", flexShrink: 0 }}>{skin.emoji}</span>
            <div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "15px", fontWeight: 700, color: "#f0e8d0", marginBottom: "2px" }}>{skin.name}</div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "12px", color: "rgba(240,232,208,0.50)" }}>{skin.tagline}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Teaser note */}
      <div style={{ background: "rgba(210,175,80,0.06)", border: "1px dashed rgba(210,175,80,0.25)", borderRadius: "12px", padding: "14px 18px" }}>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13px", color: "rgba(210,175,80,0.85)", margin: 0, lineHeight: 1.6 }}>
          ✦ This pack is launching soon.
        </p>
      </div>
    </div>
  );
}



// ── Main page ─────────────────────────────────────────────────
export default function Skins() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 20% 50%, oklch(0.18 0.06 155 / 60%) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, oklch(0.20 0.08 75 / 40%) 0%, transparent 50%), oklch(0.10 0.03 240)",
      padding: "0 0 80px",
    }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "110px 24px 0" }}>
        {/* Back link */}
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "'Outfit', sans-serif", fontSize: "13px", color: "rgba(210,175,80,0.8)", textDecoration: "none", marginBottom: "32px" }}>
          ← Back to Home
        </a>

        {/* Page heading */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(210,175,80,0.7)", marginBottom: "12px" }}>InSync Profiles</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "42px", fontWeight: 700, color: "#f0e8d0", margin: "0 0 16px", lineHeight: 1.1 }}>Profile Skin Packs</h1>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "15px", color: "rgba(240,232,208,0.65)", margin: "0 auto", maxWidth: "520px", lineHeight: 1.7 }}>
            Personalise your buyer postcard with themed skins that celebrate the days and communities that matter most to you. Each pack includes 3 unique skins — unlock once, use forever.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "20px", background: "rgba(210,175,80,0.12)", border: "1px solid rgba(210,175,80,0.3)", borderRadius: "30px", padding: "8px 20px" }}>
            <span style={{ fontSize: "16px" }}>🚀</span>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: 700, color: "rgba(210,175,80,1)", letterSpacing: "0.06em" }}>Launching Soon</span>
          </div>
        </div>

        {/* Pack cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {SKIN_PACKS.map(pack => (
            <PackCard key={pack.id} pack={pack} />
          ))}
        </div>


      </div>
    </div>
  );
}
