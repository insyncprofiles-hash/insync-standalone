/* ============================================================
   AlliedHealth.tsx — InSync Profiles
   Audience: Allied Health Practitioners, OTs, Speech Pathologists,
             Behaviour Support, Physio, Psychology, Remote Services
   Design: Matches Landing.tsx — deep navy/teal/gold palette
   ============================================================ */
import { Link } from "wouter";
import { useState, useEffect } from "react";

// ── Colour constants (mirrors Landing.tsx) ─────────────────────
const C = {
  bgPage:   "linear-gradient(160deg, #0d1b2a 0%, #0f2d3d 40%, #0a2a1e 100%)",
  bgCard:   "rgba(255,255,255,0.06)",
  textHead: "#ffffff",
  textBody: "rgba(255,255,255,0.78)",
  textDim:  "rgba(255,255,255,0.45)",
  gold:     "#f5c842",
  goldDim:  "rgba(245,200,66,0.55)",
  teal:     "#2dd4bf",
  tealDim:  "rgba(45,212,191,0.55)",
  border:   "rgba(255,255,255,0.10)",
};

// ── Who this matters for cards ─────────────────────────────────
const WHO_CARDS = [
  {
    icon: "🧠",
    heading: "Participants with anxiety or withdrawal",
    body: "Knowing who is coming before they arrive. Recognising a face before the first visit. Understanding an approach before the first session. That's not clinical. That's human.",
    accent: C.teal,
  },
  {
    icon: "📡",
    heading: "Remote communities",
    body: "The practitioner doesn't disappear between appointments. The strategy stays accessible. The family doesn't have to start from scratch every time someone new comes into the picture.",
    accent: C.gold,
  },
  {
    icon: "👨‍👩‍👧",
    heading: "Carers and families",
    body: "The information they need exists somewhere they can actually find it. The same source. The same version. Not a phone call away — already there.",
    accent: C.teal,
  },
  {
    icon: "🔗",
    heading: "The whole support team",
    body: "When every person in a participant's support circle can access the same profile, the support stops being fragmented. One source. Shared. Consistent. Current.",
    accent: C.gold,
  },
];

// ── What a profile can hold ────────────────────────────────────
const PROFILE_HOLDS = [
  { icon: "🎥", label: "Intro video", desc: "A short, personal video so participants can see and hear the practitioner before any contact." },
  { icon: "💬", label: "Communication style", desc: "How the practitioner communicates, what to expect in a session, and how they involve the participant in decisions." },
  { icon: "📋", label: "Therapy guides & strategies", desc: "Key approaches, techniques, and resources the participant and their support team can return to between appointments." },
  { icon: "🗓", label: "Availability & service area", desc: "When and where — including telehealth and remote reach." },
  { icon: "🏅", label: "Credentials & specialties", desc: "Qualifications, registration, and areas of focus — clearly presented, not buried in a CV." },
  { icon: "♿", label: "Accessibility-first design", desc: "Works on any device. No login. No app. Compatible with screen readers and AAC devices." },
];

export default function AlliedHealth() {
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: C.bgPage, minHeight: "100vh", fontFamily: "'Outfit', sans-serif", color: C.textBody }}>

      {/* ── HEADER ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(13,27,42,0.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <img src="/assets/insync_logo_sq_b4e7c2a1.jpg" alt="InSync Profiles logo" style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "cover" }} />
          <div>
            <div style={{ color: C.textHead, fontSize: "13px", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" }}>InSync Profiles</div>
            <div style={{ color: C.textDim, fontSize: "10px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Allied Health</div>
          </div>
        </Link>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link href="/" style={{ color: C.textDim, fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>← Back</Link>
          <Link href="/pricing" style={{ background: `linear-gradient(135deg, ${C.gold} 0%, #e8a800 100%)`, color: "#0d1b2a", fontSize: "13px", fontWeight: 800, textDecoration: "none", padding: "8px 18px", borderRadius: "99px" }}>Get Started →</Link>
        </div>
      </header>

      <main>

        {/* ── HERO ── */}
        <section style={{ padding: "80px 24px 64px", maxWidth: "780px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(45,212,191,0.10)", border: `1px solid rgba(45,212,191,0.25)`, borderRadius: "99px", padding: "6px 18px", marginBottom: "28px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.teal, display: "inline-block" }} aria-hidden="true" />
            <span style={{ color: C.teal, fontSize: "11px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>Allied Health · Every Support Role</span>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textHead, fontSize: "clamp(34px, 6vw, 58px)", fontWeight: 700, lineHeight: 1.1, marginBottom: "24px" }}>
            Beyond<br />
            <span style={{ background: `linear-gradient(90deg, ${C.teal} 0%, ${C.gold} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Appointments</span>
          </h1>
            <p style={{ color: C.textBody, fontSize: "clamp(19px, 2.5vw, 23px)", lineHeight: 1.8, maxWidth: "620px", margin: "0 auto 40px" }}>
            Some of the most valuable work in allied health doesn't happen in the session.
          </p>
        </section>

        {/* ── ARTICLE BODY ── */}
        <section style={{ padding: "0 24px 80px", maxWidth: "720px", margin: "0 auto" }}>

          {/* Opening */}
          <div style={{ marginBottom: "56px" }}>
            <p style={{ fontSize: "clamp(17px, 2vw, 20px)", lineHeight: 1.9, marginBottom: "20px", color: C.textBody }}>
              It happens the night before, when a family member is trying to remember what the OT said.
            </p>
            <p style={{ fontSize: "clamp(17px, 2vw, 20px)", lineHeight: 1.9, marginBottom: "20px", color: C.textBody }}>
              It happens on a Tuesday when a support worker is about to walk through a door and has no idea what approach the speech pathologist has been working on.
            </p>
            <p style={{ fontSize: "clamp(17px, 2vw, 20px)", lineHeight: 1.9, color: C.textBody }}>
              It happens when a participant with anxiety gets a name and a phone number instead of a face, a voice, and a reason to trust.
            </p>
          </div>

          {/* Divider */}
          <div style={{ borderTop: `1px solid ${C.border}`, margin: "0 0 56px" }} />

          {/* The gap */}
          <div style={{ marginBottom: "56px" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textHead, fontSize: "clamp(24px, 3.5vw, 34px)", fontWeight: 700, marginBottom: "24px", lineHeight: 1.2 }}>
              The appointment is not the whole story.
            </h2>
            <p style={{ fontSize: "clamp(17px, 2vw, 20px)", lineHeight: 1.9, marginBottom: "20px", color: C.textBody }}>
              The gap between sessions is where things either stick or fall apart. Where a strategy gets reinforced — or quietly abandoned because nobody else knew it existed.
            </p>
            <p style={{ fontSize: "clamp(17px, 2vw, 20px)", lineHeight: 1.9, color: C.textBody }}>
              A living profile becomes the thread connecting scattered moments. Not a filing cabinet. Not a report. Something that travels with the participant's journey and stays retrievable when it's needed.
            </p>
          </div>

          {/* Pull quote */}
          <blockquote style={{ borderLeft: `4px solid ${C.teal}`, paddingLeft: "24px", margin: "0 0 56px", fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px, 2.5vw, 26px)", color: C.textHead, fontStyle: "italic", lineHeight: 1.5 }}>
            "The gap between sessions is where real change sticks."
          </blockquote>

          {/* The fragmented picture */}
          <div style={{ marginBottom: "56px" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textHead, fontSize: "clamp(24px, 3.5vw, 34px)", fontWeight: 700, marginBottom: "24px", lineHeight: 1.2 }}>
              Everyone is working from a different version of the picture.
            </h2>
            <p style={{ fontSize: "clamp(17px, 2vw, 20px)", lineHeight: 1.9, marginBottom: "20px", color: C.textBody }}>
              No participant is supported by one person alone. Their OT, their speech pathologist, their support worker, their coordinator, their family — each holding a piece of the picture. Each starting from a different place. Each explaining the same things to different people, in different rooms, at different times.
            </p>
            <p style={{ fontSize: "clamp(17px, 2vw, 20px)", lineHeight: 1.9, marginBottom: "20px", color: C.textBody }}>
              When every person in a participant's support circle can access the same profile — the same strategies, the same communication approach, the same understanding of who is involved and how they work — the support stops being fragmented.
            </p>
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "28px 28px", marginBottom: "20px" }}>
              <p style={{ fontSize: "17px", lineHeight: 1.9, color: C.textBody, margin: "0 0 12px" }}>The support worker reinforces what the OT introduced.</p>
              <p style={{ fontSize: "17px", lineHeight: 1.9, color: C.textBody, margin: "0 0 12px" }}>The coordinator shares the speech pathologist's approach with a new carer.</p>
              <p style={{ fontSize: "17px", lineHeight: 1.9, color: C.textBody, margin: 0 }}>The family doesn't have to translate between services anymore.</p>
            </div>
            <p style={{ fontSize: "clamp(17px, 2vw, 20px)", lineHeight: 1.9, color: C.gold, fontWeight: 700 }}>
              One source. Shared. Consistent. Current.
            </p>
          </div>

          {/* Divider */}
          <div style={{ borderTop: `1px solid ${C.border}`, margin: "0 0 56px" }} />

          {/* Anxiety / connection */}
          <div style={{ marginBottom: "56px" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textHead, fontSize: "clamp(24px, 3.5vw, 34px)", fontWeight: 700, marginBottom: "24px", lineHeight: 1.2 }}>
              For participants who live with anxiety, withdrawal, or disconnection — consistency isn't a feature. It's the foundation.
            </h2>
            <p style={{ fontSize: "clamp(17px, 2vw, 20px)", lineHeight: 1.9, marginBottom: "20px", color: C.textBody }}>
              Knowing who is coming before they arrive. Recognising a face before the first visit. Understanding an approach before the first session.
            </p>
            <p style={{ fontSize: "clamp(17px, 2vw, 20px)", lineHeight: 1.9, color: C.textBody }}>
              That's not clinical. That's human.
            </p>
          </div>

        </section>

        {/* ── WHO THIS MATTERS FOR ── */}
        <section style={{ padding: "0 24px 80px", maxWidth: "1060px", margin: "0 auto" }} aria-labelledby="who-heading">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 id="who-heading" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textHead, fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700 }}>
              Who this matters for
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: "16px" }}>
            {WHO_CARDS.map((card) => (
              <div key={card.heading} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "28px 24px", position: "relative", overflow: "hidden" }}>
                <div aria-hidden="true" style={{ position: "absolute", top: 0, left: "24px", right: "24px", height: "2px", background: `linear-gradient(90deg, ${card.accent}, transparent)`, borderRadius: "2px" }} />
                <div style={{ fontSize: "28px", marginBottom: "14px" }} aria-hidden="true">{card.icon}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textHead, fontSize: "19px", fontWeight: 700, marginBottom: "10px", lineHeight: 1.3 }}>{card.heading}</h3>
                <p style={{ color: C.textBody, fontSize: "16px", lineHeight: 1.75, margin: 0 }}>{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── WHAT A PROFILE CAN HOLD ── */}
        <section style={{ padding: "0 24px 80px", maxWidth: "1060px", margin: "0 auto" }} aria-labelledby="profile-holds-heading">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 id="profile-holds-heading" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textHead, fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700 }}>
              What a living profile can hold
            </h2>
            <p style={{ color: C.textBody, fontSize: "18px", maxWidth: "520px", margin: "14px auto 0", lineHeight: 1.7 }}>
              Not just reports. Not just handouts. Something that stays accessible when it's needed most.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "14px" }}>
            {PROFILE_HOLDS.map((item) => (
              <div key={item.label} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: "14px", padding: "22px 20px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "24px", flexShrink: 0, marginTop: "2px" }} aria-hidden="true">{item.icon}</span>
                <div>
                  <div style={{ color: C.textHead, fontSize: "17px", fontWeight: 700, marginBottom: "6px" }}>{item.label}</div>
                  <div style={{ color: C.textBody, fontSize: "15px", lineHeight: 1.7 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CLOSING STATEMENT ── */}
        <section style={{ padding: "0 24px 100px", maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "64px" }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textHead, fontSize: "clamp(20px, 3vw, 28px)", lineHeight: 1.6, marginBottom: "16px", fontStyle: "italic" }}>
              "Current. Accessible. Shared. Informed."
            </p>
            <p style={{ color: C.textBody, fontSize: "clamp(17px, 2vw, 20px)", lineHeight: 1.9, marginBottom: "16px" }}>
              Because participant engagement doesn't start and end in a session.
            </p>
            <p style={{ color: C.gold, fontSize: "clamp(17px, 2vw, 20px)", fontWeight: 700, marginBottom: "48px" }}>
              And neither does the journey.
            </p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/pricing" style={{ background: `linear-gradient(135deg, ${C.gold} 0%, #e8a800 100%)`, color: "#0d1b2a", padding: "16px 44px", borderRadius: "99px", fontSize: "16px", fontWeight: 800, textDecoration: "none", display: "inline-block", boxShadow: `0 6px 32px rgba(245,200,66,0.35)` }}>Get Started →</Link>
              <Link href="/demo" style={{ background: "transparent", color: C.teal, padding: "16px 44px", borderRadius: "99px", fontSize: "16px", fontWeight: 700, textDecoration: "none", display: "inline-block", border: `1.5px solid ${C.tealDim}` }}>Try Free Demo</Link>
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer style={{ padding: "32px 24px", textAlign: "center", borderTop: `1px solid ${C.border}` }}>
        <p style={{ color: C.textDim, fontSize: "12px", margin: "0 0 8px" }}>
          <Link href="/" style={{ color: C.textDim, textDecoration: "none" }}>← Back to insyncprofiles.net</Link>
          {" · "}
          <Link href="/privacy" style={{ color: C.textDim, textDecoration: "none" }}>Legal & Privacy</Link>
        </p>
        <p style={{ color: C.textDim, fontSize: "11px", margin: 0 }}>© {new Date().getFullYear()} InSync Profiles · Made in Australia</p>
      </footer>

      {/* ── BACK TO TOP ── */}
      {showBackTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          style={{ position: "fixed", bottom: "24px", right: "24px", background: C.teal, color: "#0d1b2a", border: "none", borderRadius: "50%", width: "44px", height: "44px", fontSize: "18px", cursor: "pointer", boxShadow: "0 4px 16px rgba(45,212,191,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}
        >↑</button>
      )}

    </div>
  );
}
