import EcosystemGraphic from "../components/EcosystemGraphic";

const H = "'Outfit', 'Nunito', sans-serif";
const B = "'Nunito', sans-serif";

export default function Ecosystem() {
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: "60px" }}>

      {/* Hero header */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #0f172a 100%)",
        padding: "96px 24px 40px",
        textAlign: "center",
        borderBottom: "3px solid #fcd34d",
      }}>
        <p style={{ fontFamily: H, fontWeight: 900, fontSize: "13px", color: "#fcd34d", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 12px" }}>
          InSync Profiles
        </p>
        <h1 style={{ fontFamily: H, fontWeight: 900, fontSize: "clamp(26px, 5vw, 40px)", color: "#ffffff", margin: "0 0 14px", lineHeight: 1.2 }}>
          The InSync Profiles Ecosystem
        </h1>
        <p style={{ fontFamily: B, fontSize: "clamp(14px, 2.5vw, 17px)", color: "#93c5fd", maxWidth: "640px", margin: "0 auto 0", lineHeight: 1.7 }}>
          Four profile types. One shared purpose — making sure the right people have the right information, before they need to ask.
        </p>
      </div>

      {/* Graphic */}
      <div style={{ maxWidth: "860px", margin: "40px auto 0", padding: "0 16px" }}>
        {/* Interactive sticker */}
        <div style={{ textAlign: "center", marginBottom: "14px" }}>
          <span style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #b45309 0%, #d97706 50%, #b45309 100%)",
            color: "#ffffff",
            fontFamily: "'Outfit', 'Nunito', sans-serif",
            fontWeight: 900,
            fontSize: "15px",
            letterSpacing: "0.03em",
            padding: "10px 22px",
            borderRadius: "20px",
            boxShadow: "0 3px 14px rgba(180,83,9,0.50), inset 0 1px 0 rgba(255,255,255,0.25)",
            border: "2px solid #92400e",
            lineHeight: 1.4,
          }}>
            👆 Interactive — tap any profile to see its purpose &amp; real-world connections
          </span>
        </div>
        <div style={{
          background: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 4px 32px rgba(30,58,138,0.10)",
          border: "1.5px solid #e2e8f0",
          padding: "32px 16px 24px",
        }}>
          <EcosystemGraphic />
        </div>
      </div>

      {/* Profile type descriptions */}
      <div style={{ maxWidth: "860px", margin: "40px auto 0", padding: "0 16px" }}>
        <h2 style={{ fontFamily: H, fontWeight: 900, fontSize: "22px", color: "#1e3a8a", marginBottom: "20px", textAlign: "center" }}>
          Profile Types
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>

          {/* Support Worker — steel blue #4b7aa8 */}
          <a href="/view" style={{ textDecoration: "none" }}>
            <div style={{ background: "#dbeafe", border: "3px solid #4b7aa8", borderRadius: "16px", padding: "20px", cursor: "pointer" }}>
              <p style={{ fontFamily: H, fontWeight: 900, fontSize: "16px", color: "#1e3d58", margin: "0 0 6px" }}>🤝 Support Worker Profile</p>
              <p style={{ fontFamily: B, fontSize: "13px", color: "#1e3d58", margin: 0, lineHeight: 1.6 }}>
                For support workers, DSWs, and personal care workers. Share your services, availability, communication style, and credentials in one accessible link.
              </p>
            </div>
          </a>

          {/* Allied Health — warm gold #c89e6c */}
          <a href="https://insyncprofiles.net/view?name=Sarah+Torens&title=Occupational+Therapist&roleType=allied-health" style={{ textDecoration: "none" }}>
            <div style={{ background: "#fef9ee", border: "3px solid #c89e6c", borderRadius: "16px", padding: "20px", cursor: "pointer" }}>
              <p style={{ fontFamily: H, fontWeight: 900, fontSize: "16px", color: "#7a5820", margin: "0 0 6px" }}>🩺 Allied Health Profile</p>
              <p style={{ fontFamily: B, fontSize: "13px", color: "#7a5820", margin: 0, lineHeight: 1.6 }}>
                For OTs, physiotherapists, speech pathologists, psychologists, and other allied health practitioners. Participant-ready profiles with accessibility built in.
              </p>
            </div>
          </a>

          {/* Support Coordinator — copper #9f5e38 */}
          <a href="/coordinators" style={{ textDecoration: "none" }}>
            <div style={{ background: "#fdf0e8", border: "3px solid #9f5e38", borderRadius: "16px", padding: "20px", cursor: "pointer" }}>
              <p style={{ fontFamily: H, fontWeight: 900, fontSize: "16px", color: "#4a2010", margin: "0 0 6px" }}>📋 Support Coordinator Profile</p>
              <p style={{ fontFamily: B, fontSize: "13px", color: "#4a2010", margin: 0, lineHeight: 1.6 }}>
                For support coordinators and specialist support coordinators. Help participants and families understand who you are and how you work before the first meeting.
              </p>
            </div>
          </a>

          {/* About Me Disability — olive/khaki #746e4a */}
          <a href="/about-me/editor" style={{ textDecoration: "none" }}>
            <div style={{ background: "#f5f4ec", border: "3px solid #746e4a", borderRadius: "16px", padding: "20px", cursor: "pointer" }}>
              <p style={{ fontFamily: H, fontWeight: 900, fontSize: "16px", color: "#302e18", margin: "0 0 6px" }}>♿ About Me Profile — Disability / NDIS</p>
              <p style={{ fontFamily: B, fontSize: "13px", color: "#302e18", margin: 0, lineHeight: 1.6 }}>
                For NDIS participants, people with disability, and their families. A free, private profile that travels with the person into hospitals, new services, and first appointments.
              </p>
            </div>
          </a>

          {/* About Me Aged Care — burnt violet #6b3fa0 */}
          <a href="/about-me/editor" style={{ textDecoration: "none" }}>
            <div style={{ background: "#f3eeff", border: "3px solid #6b3fa0", borderRadius: "16px", padding: "20px", cursor: "pointer" }}>
              <p style={{ fontFamily: H, fontWeight: 900, fontSize: "16px", color: "#2e1060", margin: "0 0 6px" }}>🌿 About Me Profile — Aged Care</p>
              <p style={{ fontFamily: B, fontSize: "13px", color: "#2e1060", margin: 0, lineHeight: 1.6 }}>
                For aged care residents, Support at Home (SAH) recipients, and people transitioning to home. Free, private, and person-centred — no login required.
              </p>
            </div>
          </a>

        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center", marginTop: "48px", padding: "0 24px" }}>
        <p style={{ fontFamily: B, fontSize: "15px", color: "#475569", marginBottom: "20px" }}>
          All profiles are free to view. Support Worker, Allied Health, and Coordinator profiles are available with a one-off purchase — no subscription, ever.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}>
          <a href="/about-me/editor" style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)",
            color: "#ffffff", fontFamily: H, fontWeight: 900, fontSize: "15px",
            padding: "14px 28px", borderRadius: "20px", textDecoration: "none",
            boxShadow: "0 4px 16px rgba(30,58,138,0.30)",
          }}>
            ✨ Create a Free About Me Profile
          </a>
          <a href="/pricing" style={{
            display: "inline-block",
            background: "transparent",
            color: "#1e3a8a", fontFamily: H, fontWeight: 900, fontSize: "15px",
            padding: "14px 28px", borderRadius: "20px", textDecoration: "none",
            border: "2px solid #1e3a8a",
          }}>
            See Pricing →
          </a>
        </div>
      </div>

    </div>
  );
}
