/* ============================================================
   Coordinators.tsx — InSync Profiles
   Audience: NDIS Support Coordinators & Specialist Support Coordinators
   Design: Matches Landing.tsx — deep navy/teal/gold palette
   ============================================================ */
import { Link, useLocation } from "wouter";
import { useState, useCallback } from "react";

// Mark navigation source so back button knows to return here
function useCoordNav() {
  const [, navigate] = useLocation();
  return useCallback((href: string) => {
    sessionStorage.setItem("insync_back_to", "coordinators");
    navigate(href);
  }, [navigate]);
}

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

// ── Frustrated keyword tags — real coordinator pain points ─────
const FRUSTRATED_TAGS = [
  "workers with no online presence",
  "participants can't choose who supports them",
  "generic CVs that say nothing",
  "families left out of the decision",
  "workers who look great on paper but aren't a fit",
  "no way to share worker info before first contact",
  "participants who can't read standard documents",
  "coordinators doing all the matching work",
  "workers who ghost after one meeting",
  "no consistent format across workers",
  "families calling to ask basic questions",
  "participants anxious about meeting strangers",
  "workers who don't understand communication needs",
  "no video intro — just a name and a number",
  "NDIS choice and control not actually happening",
];

// ── How it works steps ─────────────────────────────────────────
const STEPS = [
  {
    num: "01",
    heading: "Worker builds their profile",
    body: "The support worker uses the InSync Profiles editor to fill in 8 structured threads: identity, services, availability, communication style, what matters to them, who they work best with, credentials, and an intro video. Takes about 20 minutes.",
    icon: "✏️",
  },
  {
    num: "02",
    heading: "You receive or request the link",
    body: "The worker shares their unique profile URL with you. You can also recommend InSync Profiles to workers on your books and ask them to build one before their next placement.",
    icon: "🔗",
  },
  {
    num: "03",
    heading: "Share directly with the participant and family",
    body: "Paste the link into an email, message, or support plan. The participant and their family can review the profile independently — in their own time, in a format built for accessibility.",
    icon: "📤",
  },
  {
    num: "04",
    heading: "The support worker arrives. The participant is already informed.",
    body: "The first meeting happens after the participant has already seen the worker's face, heard their voice, and read how they support people. Less anxiety. Better fit. Fewer breakdowns.",
    icon: "✅",
  },
];

// ── FAQ ────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Does the worker need to pay?",
    a: "Yes — the profile is purchased by the worker, not the coordinator or participant. Plans start from $25 AUD (Solo — 1 user), $105 AUD (Team — up to 5 users), or $195 AUD (Team 10 — up to 10 users). All are one-time payments, no subscription. You can recommend it to workers on your books as a professional development tool.",
  },
  {
    q: "Can I request a profile from a worker I'm placing?",
    a: "Absolutely. You can share the link to InSync Profiles with any worker and ask them to build a profile before their next placement. Many coordinators include it in their worker onboarding checklist.",
  },
  {
    q: "Is it accessible for participants with cognitive or communication disability?",
    a: "Yes — accessibility is the foundation of the design. Every profile includes font size controls, a dyslexia-friendly font option, an AAC communication board, text-to-speech, high contrast mode, and plain language throughout.",
  },
  {
    q: "Does it replace a CV or NDIS Worker Screening check?",
    a: "No — it complements them. InSync Profiles is a human-facing profile that helps participants and families understand who the worker is as a person. Credentials, screening, and compliance documents are separate.",
  },
  {
    q: "Can the participant view it without logging in?",
    a: "Yes. The profile is a shareable link — no app, no login, no account required. The participant taps the link and reads the profile on any device.",
  },
  {
    q: "Can families view it too?",
    a: "Yes. The link can be shared with anyone — the participant, their family, a carer, or a guardian. It's designed to be reviewed together, so families can be part of the decision.",
  },
];

// ── What coordinators get ──────────────────────────────────────
const BENEFITS = [
  {
    icon: "🧩",
    heading: "Match on what actually matters",
    body: "Communication style. Values. Who they work best with. Approach to support. InSync Profiles gives you structured information that CVs never capture.",
    accent: C.teal,
  },
  {
    icon: "📋",
    heading: "Consistent format across every worker",
    body: "Every InSync Profile uses the same 8 threads. No more comparing apples to oranges — you can review workers side by side with confidence.",
    accent: C.gold,
  },
  {
    icon: "📤",
    heading: "Share directly with participants and families",
    body: "One link. Paste it into an email or message. The participant and family review it in their own time, in a format built for accessibility.",
    accent: "#a78bfa",
  },
  {
    icon: "♿", // replaced below
    heading: "Built for participants with complex needs",
    body: "Large text, plain language, colour themes, AAC board, text-to-speech, and a video intro. Participants can engage with the profile independently.",
    accent: "#f87171",
  },
];

// ── Component ──────────────────────────────────────────────────
const REFERRAL_EMAIL = `Subject: A tool that might help you stand out — InSync Profiles

Hi [Name],

I wanted to share something that could make a real difference for you as a support worker.

InSync Profiles is a professional profile tool built specifically for NDIS support workers. Instead of a generic CV, it gives you a structured, accessible profile that participants and their families can actually read and interact with — covering how you support people, your experience, availability, communication style, and more. It's built specifically for the NDIS sector.

As a support coordinator, I can share your profile link directly with participants before the first visit. That means they already know who you are and how you work before you walk through the door.

You can see a sample profile here: https://insyncprofiles.net/view?pid=demo

And find out more or get your own profile at: https://insyncprofiles.net

Worth a look — I think it would really help you connect with the right participants.

[Your name]`;

export default function Coordinators() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [emailCopied, setEmailCopied] = useState(false);
  const coordNav = useCoordNav();

  function copyReferralEmail() {
    navigator.clipboard.writeText(REFERRAL_EMAIL).then(() => {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 3000);
    });
  }

  return (
    <div
      style={{
        background: C.bgPage,
        minHeight: "100vh",
        fontFamily: "'Outfit', sans-serif",
        color: C.textBody,
      }}
    >
      {/* ── HERO ── */}
      <section
        style={{ padding: "100px 24px 72px", maxWidth: "900px", margin: "0 auto", textAlign: "center" }}
        aria-labelledby="coord-hero-heading"
      >
        {/* Pill badge */}
        <div style={{ display: "inline-block", background: "rgba(45,212,191,0.10)", border: "1px solid rgba(45,212,191,0.28)", borderRadius: "30px", padding: "6px 18px", marginBottom: "20px" }}>
          <span style={{ color: C.teal, fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>For Support Coordinators</span>
        </div>

        <h1
          id="coord-hero-heading"
          style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textHead, fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 700, lineHeight: 1.05, marginBottom: "22px" }}
        >
          Stop matching on gut instinct.<br />
          <span style={{ background: `linear-gradient(90deg, ${C.teal} 0%, ${C.gold} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Start matching on what actually matters.
          </span>
        </h1>

        <p style={{ color: C.textBody, fontSize: "17px", lineHeight: 1.8, maxWidth: "640px", margin: "0 auto 36px" }}>
          InSync Profiles gives support coordinators structured, consistent worker information they can share directly with participants and families — before the first visit ever happens.
        </p>

        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => coordNav("/view")}
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: `linear-gradient(135deg, ${C.teal} 0%, #0a9e8a 100%)`,
              color: "#fff", fontSize: "14px", fontWeight: 800, border: "none", cursor: "pointer",
              padding: "13px 28px", borderRadius: "99px",
              boxShadow: "0 8px 32px rgba(45,212,191,0.28)", letterSpacing: "0.01em",
            }}
          >
            📱 View a Sample Profile →
          </button>
          <button
            onClick={() => coordNav("/pricing")}
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(255,255,255,0.08)", border: `1px solid ${C.border}`,
              color: C.textHead, fontSize: "14px", fontWeight: 700, cursor: "pointer",
              padding: "13px 28px", borderRadius: "99px", letterSpacing: "0.01em",
            }}
          >
            See Pricing
          </button>
        </div>
      </section>

      {/* ── FRUSTRATED KEYWORD TAGS ── */}
      <section
        style={{ padding: "56px 24px", maxWidth: "1000px", margin: "0 auto" }}
        aria-labelledby="pain-heading"
      >
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <h2
            id="pain-heading"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textHead, fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 700, marginBottom: "10px" }}
          >
            Sound familiar?
          </h2>
          <p style={{ color: C.textDim, fontSize: "14px" }}>These are the real frustrations coordinators tell us about every day.</p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
          {FRUSTRATED_TAGS.map((tag) => (
            <span
              key={tag}
              style={{
                background: "rgba(248,113,113,0.10)",
                border: "1px solid rgba(248,113,113,0.28)",
                color: "#fca5a5",
                fontSize: "13px",
                fontWeight: 600,
                padding: "7px 16px",
                borderRadius: "99px",
                letterSpacing: "0.01em",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bridge line */}
        <p style={{
          textAlign: "center", marginTop: "40px",
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(20px, 2.8vw, 28px)", fontWeight: 600, fontStyle: "italic",
          color: C.textHead, lineHeight: 1.5,
        }}>
          InSync Profiles was built to solve every one of these.
        </p>
      </section>

      {/* ── DIVIDER ── */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${C.tealDim}, ${C.goldDim}, transparent)` }} aria-hidden="true" />
      </div>

      {/* ── WHAT COORDINATORS GET ── */}
      <section
        style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto" }}
        aria-labelledby="benefits-heading"
      >
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <h2
            id="benefits-heading"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textHead, fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, lineHeight: 1.1, marginBottom: "14px" }}
          >
            What coordinators get
          </h2>
          <p style={{ color: C.textBody, fontSize: "15px", lineHeight: 1.75, maxWidth: "540px", margin: "0 auto" }}>
            Structured. Consistent. Accessible. Everything you need to make a confident match.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
          {BENEFITS.map(({ icon, heading, body, accent }) => (
            <div
              key={heading}
              style={{
                background: C.bgCard,
                border: "1px solid rgba(255,255,255,0.08)",
                borderTop: `3px solid ${accent}`,
                borderRadius: "16px",
                padding: "28px 24px",
              }}
            >
              <div style={{ fontSize: "26px", marginBottom: "10px" }} aria-hidden="true">
                {icon === "♿" || icon === "♿, // replaced below" ? (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Disability accessibility">
                    <circle cx="12" cy="4" r="2" fill="#f87171"/>
                    <path d="M15 8H9l-1 5h3l1 5h2l1-5h3l-1-5z" fill="#f87171" opacity="0.85"/>
                    <path d="M9.5 13.5C8.1 15 7 16.9 7 19a5 5 0 0 0 10 0c0-1.5-.6-2.9-1.5-4" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                  </svg>
                ) : icon}
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textHead, fontSize: "20px", fontWeight: 700, lineHeight: 1.2, marginBottom: "10px" }}>{heading}</h3>
              <p style={{ color: C.textBody, fontSize: "14px", lineHeight: 1.75, margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${C.tealDim}, ${C.goldDim}, transparent)` }} aria-hidden="true" />
      </div>

      {/* ── HOW IT WORKS ── */}
      <section
        style={{ padding: "80px 24px", maxWidth: "860px", margin: "0 auto" }}
        aria-labelledby="how-heading"
      >
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <h2
            id="how-heading"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textHead, fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 700, lineHeight: 1.1, marginBottom: "14px" }}
          >
            How it works
          </h2>
          <p style={{ color: C.textBody, fontSize: "15px", lineHeight: 1.75, maxWidth: "480px", margin: "0 auto" }}>
            Four steps from zero to a confident, informed match.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {STEPS.map(({ num, heading, body, icon }) => (
            <div
              key={num}
              style={{
                display: "grid",
                gridTemplateColumns: "64px 1fr",
                gap: "20px",
                alignItems: "start",
                background: C.bgCard,
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                padding: "28px 24px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "28px", marginBottom: "4px" }} aria-hidden="true">{icon}</div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "11px", fontWeight: 800, color: C.teal, letterSpacing: "0.14em" }}>{num}</div>
              </div>
              <div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textHead, fontSize: "21px", fontWeight: 700, lineHeight: 1.2, marginBottom: "8px" }}>{heading}</h3>
                <p style={{ color: C.textBody, fontSize: "14px", lineHeight: 1.75, margin: 0 }}>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── REFERRAL CTA BAND ── */}
      <section
        style={{
          background: "rgba(45,212,191,0.07)",
          border: "1px solid rgba(45,212,191,0.18)",
          margin: "0 24px 80px",
          borderRadius: "20px",
          padding: "56px 32px",
          maxWidth: "900px",
          marginLeft: "auto",
          marginRight: "auto",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textHead, fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 700, lineHeight: 1.1, marginBottom: "14px" }}>
          Know a support worker who should have one of these?
        </h2>
        <p style={{ color: C.textBody, fontSize: "15px", lineHeight: 1.75, maxWidth: "560px", margin: "0 auto 28px" }}>
          Share this page with any worker on your books. We've written a ready-to-send email for you — just copy it, add their name, and hit send.
        </p>

        {/* Email preview box */}
        <div style={{
          background: "rgba(0,0,0,0.30)", border: `1px solid ${C.border}`,
          borderRadius: "14px", padding: "24px 28px", maxWidth: "640px",
          margin: "0 auto 28px", textAlign: "left",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", gap: "12px", flexWrap: "wrap" }}>
            <span style={{ color: C.gold, fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Ready-to-send referral email</span>
            <button
              onClick={copyReferralEmail}
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                background: emailCopied ? "rgba(45,212,191,0.20)" : "rgba(255,255,255,0.08)",
                border: `1px solid ${emailCopied ? C.teal : C.border}`,
                color: emailCopied ? C.teal : C.textHead,
                fontSize: "12px", fontWeight: 700, cursor: "pointer",
                padding: "7px 16px", borderRadius: "99px", letterSpacing: "0.04em",
                transition: "all 0.2s ease",
              }}
            >
              {emailCopied ? "✓ Copied!" : "📋 Copy email"}
            </button>
          </div>
          <pre style={{
            color: C.textBody, fontSize: "12.5px", lineHeight: 1.7,
            whiteSpace: "pre-wrap", wordBreak: "break-word",
            fontFamily: "'Outfit', sans-serif", margin: 0,
            maxHeight: "220px", overflowY: "auto",
          }}>{REFERRAL_EMAIL}</pre>
        </div>

        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => coordNav("/pricing")}
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: `linear-gradient(135deg, ${C.teal} 0%, #0a9e8a 100%)`,
              color: "#fff", fontSize: "14px", fontWeight: 800, border: "none", cursor: "pointer",
              padding: "13px 28px", borderRadius: "99px",
              boxShadow: "0 8px 32px rgba(45,212,191,0.28)", letterSpacing: "0.01em",
            }}
          >
            See Pricing →
          </button>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${C.tealDim}, ${C.goldDim}, transparent)` }} aria-hidden="true" />
      </div>

      {/* ── SAMPLE PROFILE CTA BAND ── */}
      <section style={{ padding: "72px 24px", maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "rgba(245,200,66,0.12)", border: "1px solid rgba(245,200,66,0.30)", borderRadius: "30px", padding: "6px 18px", marginBottom: "20px" }}>
          <span style={{ color: C.gold, fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>See it in action</span>
        </div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textHead, fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 700, lineHeight: 1.1, marginBottom: "16px" }}>
          See exactly what you would share<br />with a participant and their family.
        </h2>
        <p style={{ color: C.textBody, fontSize: "15px", lineHeight: 1.75, maxWidth: "520px", margin: "0 auto 32px" }}>
          Pete James is a real sample profile built using InSync Profiles. Tap through the threads, try the accessibility tools, and see what a participant would experience before their first meeting.
        </p>
        <button
          onClick={() => coordNav("/view")}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: `linear-gradient(135deg, ${C.gold} 0%, #d4a017 100%)`,
            color: "#0d1b2a", fontSize: "14px", fontWeight: 800, border: "none", cursor: "pointer",
            padding: "14px 32px", borderRadius: "99px",
            boxShadow: "0 8px 32px rgba(245,200,66,0.28)", letterSpacing: "0.01em",
          }}
        >
          📱 View Pete's Sample Profile →
        </button>
      </section>

      {/* ── DIVIDER ── */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${C.tealDim}, ${C.goldDim}, transparent)` }} aria-hidden="true" />
      </div>

      {/* ── FAQ ── */}
      <section
        style={{ padding: "80px 24px", maxWidth: "760px", margin: "0 auto" }}
        aria-labelledby="faq-heading"
      >
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2
            id="faq-heading"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textHead, fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, lineHeight: 1.1, marginBottom: "12px" }}
          >
            Common questions
          </h2>
          <p style={{ color: C.textDim, fontSize: "14px" }}>From coordinators who asked before you did.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {FAQS.map(({ q, a }, i) => (
            <div
              key={i}
              style={{
                background: C.bgCard,
                border: `1px solid ${openFaq === i ? C.tealDim : "rgba(255,255,255,0.08)"}`,
                borderRadius: "14px",
                overflow: "hidden",
                transition: "border-color 200ms",
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%", textAlign: "left", background: "none", border: "none",
                  padding: "20px 24px", cursor: "pointer",
                  display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px",
                }}
                aria-expanded={openFaq === i}
              >
                <span style={{ color: C.textHead, fontSize: "15px", fontWeight: 700, lineHeight: 1.4 }}>{q}</span>
                <span style={{ color: C.teal, fontSize: "18px", flexShrink: 0, transition: "transform 200ms", transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 24px 20px" }}>
                  <p style={{ color: C.textBody, fontSize: "14px", lineHeight: 1.75, margin: 0 }}>{a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "32px 24px", textAlign: "center" }}>
        <img
          src="/assets/insync-logo-transparent_9e0df532.png"
          alt="InSync Profiles logo"
          style={{ height: "40px", marginBottom: "10px", objectFit: "contain", display: "block", margin: "0 auto 10px" }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "13px", letterSpacing: "0.14em", textTransform: "uppercase", color: C.textHead, marginBottom: "4px" }}>
          INSYNC PROFILES
        </div>
        <div style={{ fontSize: "11px", color: C.textDim, marginBottom: "10px" }}>
          ABN 54 116 010 622 · © 2026 InSync Profiles. All rights reserved.
        </div>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" style={{ color: C.textDim, fontSize: "12px", textDecoration: "none" }}>Home</Link>
          <Link href="/pricing" style={{ color: C.textDim, fontSize: "12px", textDecoration: "none" }}>Pricing</Link>
          <Link href="/privacy" style={{ color: C.textDim, fontSize: "12px", textDecoration: "none" }}>Terms & Refunds</Link>
          <Link href="/blog" style={{ color: C.textDim, fontSize: "12px", textDecoration: "none" }}>Blog</Link>
        </div>
      </footer>
    </div>
  );
}
