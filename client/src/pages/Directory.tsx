/* ============================================================
   Directory.tsx — InSync Profiles Provider Directory
   Coming Soon placeholder page
   Design: Matches site — deep navy bg, gold + teal accents
   Fonts: Cormorant Garamond (display) + Outfit (body)
   ============================================================ */
import { Link } from "wouter";

export default function Directory() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #0d1b2a 0%, #0a2540 50%, #0d1b2a 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        fontFamily: "'Outfit', sans-serif",
        textAlign: "center",
      }}
    >
      {/* Glow orb */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(45,212,191,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Badge */}
      <div
        style={{
          display: "inline-block",
          background: "rgba(245,200,66,0.12)",
          border: "1px solid rgba(245,200,66,0.30)",
          borderRadius: "30px",
          padding: "6px 18px",
          marginBottom: "28px",
        }}
      >
        <span
          style={{
            color: "#f5c842",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Coming Soon
        </span>
      </div>

      {/* Heading */}
      <h1
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          color: "#ffffff",
          fontSize: "clamp(32px, 6vw, 58px)",
          fontWeight: 700,
          lineHeight: 1.1,
          marginBottom: "20px",
          maxWidth: "700px",
        }}
      >
        Provider Directory
        <br />
        <span
          style={{
            background: "linear-gradient(90deg, #2dd4bf 0%, #f5c842 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Is On Its Way.
        </span>
      </h1>

      {/* Subtext */}
      <p
        style={{
          color: "rgba(255,255,255,0.72)",
          fontSize: "16px",
          lineHeight: 1.8,
          maxWidth: "520px",
          marginBottom: "48px",
        }}
      >
        A searchable, filterable directory of NDIS support workers — built for participants, families, and coordinators to find the right match with confidence.
      </p>

      {/* Feature pills */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "center",
          marginBottom: "52px",
          maxWidth: "560px",
        }}
      >
        {[
          "Filter by service",
          "Filter by availability",
          "Filter by experience",
          "Shortlist workers",
          "Email a shortlist",
          "Copy profile links",
        ].map((f) => (
          <span
            key={f}
            style={{
              background: "rgba(45,212,191,0.08)",
              border: "1px solid rgba(45,212,191,0.22)",
              borderRadius: "20px",
              color: "rgba(255,255,255,0.80)",
              fontSize: "13px",
              fontWeight: 500,
              padding: "6px 14px",
            }}
          >
            {f}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", justifyContent: "center" }}>
        <Link
          href="/pricing"
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #2dd4bf 0%, #1a9e8f 100%)",
            color: "#0d1b2a",
            fontFamily: "'Outfit', sans-serif",
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "14px 28px",
            borderRadius: "30px",
            textDecoration: "none",
            boxShadow: "0 4px 24px rgba(45,212,191,0.30)",
          }}
        >
          Get InSync Profiles
        </Link>
        <Link
          href="/"
          style={{
            display: "inline-block",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.22)",
            color: "rgba(255,255,255,0.80)",
            fontFamily: "'Outfit', sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            letterSpacing: "0.04em",
            padding: "14px 28px",
            borderRadius: "30px",
            textDecoration: "none",
          }}
        >
          ← Back to Home
        </Link>
      </div>

      {/* Footer note */}
      <p
        style={{
          marginTop: "64px",
          color: "rgba(255,255,255,0.35)",
          fontSize: "12px",
        }}
      >
        © {new Date().getFullYear()} InSync Profiles
      </p>
    </div>
  );
}
