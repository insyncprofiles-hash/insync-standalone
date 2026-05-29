/* ============================================================
   Scenarios.tsx — The Wave of Possibility
   Design: Deep navy-to-teal gradient (matches Landing)
           Bold story-driven scenarios, cinematic section headers
   Purpose: Show every person in the support sector exactly
            where InSync Profiles fits their world
   ============================================================ */
import { Link } from "wouter";
import ScenarioFlowchart, { FlowchartData } from "@/components/ScenarioFlowchart";

// ── Design tokens (matches Landing.tsx) ─────────────────────
const C = {
  bgPage:     "linear-gradient(160deg, #0d1b2a 0%, #0f2d3d 40%, #0a2a1e 100%)",
  bgCard:     "rgba(255,255,255,0.06)",
  bgGlass:    "rgba(255,255,255,0.08)",
  bgBand:     "rgba(255,255,255,0.04)",
  textHead:   "#ffffff",
  textBody:   "rgba(255,255,255,0.78)",
  textDim:    "rgba(255,255,255,0.45)",
  gold:       "#f5c842",
  goldGlow:   "rgba(245,200,66,0.22)",
  goldDim:    "rgba(245,200,66,0.55)",
  teal:       "#2dd4bf",
  tealDim:    "rgba(45,212,191,0.55)",
  border:     "rgba(255,255,255,0.10)",
};

// ── Flowchart data for each scenario ────────────────────────
const FLOWCHARTS: Record<string, FlowchartData> = {
  employment: {
    problemIcon: "📄",
    problem: "Generic résumé lost in a pile of applications — no way to stand out before the interview",
    accentColor: C.teal,
    accentGlow: "rgba(45,212,191,0.18)",
    steps: [
      { icon: "🛠", label: "Build Profile", sublabel: "5 min setup" },
      { icon: "🔗", label: "Copy Link", sublabel: "One shareable URL" },
      { icon: "📧", label: "Attach to Application", sublabel: "Email or job platform" },
      { icon: "👀", label: "Coordinator Views", sublabel: "Photo, services, video" },
      { icon: "📞", label: "Call Same Day", sublabel: "You stood out" },
    ],
    benefits: [
      { icon: "⚡", text: "Faster callbacks — coordinators see you as a person, not a name" },
      { icon: "🎯", text: "Proves sector knowledge before the interview even starts" },
      { icon: "🏆", text: "Stands out on job platforms & direct applications" },
      { icon: "🔄", text: "Reuse the same link for every application — update once, everywhere" },
    ],
  },
  "social-media": {
    problemIcon: "📝",
    problem: "Text-only posts in NDIS Facebook groups get scrolled past — no visual presence, no clicks",
    accentColor: C.gold,
    accentGlow: "rgba(245,200,66,0.18)",
    steps: [
      { icon: "🎨", label: "Generate Post Card", sublabel: "Auto-branded image" },
      { icon: "📲", label: "Post to Facebook Group", sublabel: "NDIS / aged care groups" },
      { icon: "🔗", label: "Pin Profile Link", sublabel: "In comments" },
      { icon: "🛑", label: "Family Stops Scrolling", sublabel: "Visual card stands out" },
      { icon: "🤝", label: "Direct Contact", sublabel: "No friction, no guessing" },
    ],
    benefits: [
      { icon: "📸", text: "Branded image card stops the scroll — looks professional instantly" },
      { icon: "🗣", text: "AAC board in profile means non-verbal families can respond directly" },
      { icon: "🔍", text: "Auto-generated hashtags boost discoverability on Facebook & Instagram" },
      { icon: "📍", text: "Location + services visible at a glance — right match, right area" },
    ],
  },
  "sector-credibility": {
    problemIcon: "🤷",
    problem: "Workers know the sector language but have no way to show it before the first conversation",
    accentColor: C.teal,
    accentGlow: "rgba(45,212,191,0.18)",
    steps: [
      { icon: "🛡", label: "Add Credentials", sublabel: "NDIS check, First Aid, WWCC" },
      { icon: "✅", label: "Select Services", sublabel: "20+ support categories" },
      { icon: "💬", label: "Set Communication Style", sublabel: "How I show up chips" },
      { icon: "📤", label: "Share with Coordinator", sublabel: "One link" },
      { icon: "📋", label: "Referrals Open Up", sublabel: "Trust established instantly" },
    ],
    benefits: [
      { icon: "💼", text: "Coordinators and plan managers see professionalism before a word is spoken" },
      { icon: "🌐", text: "Works across NDIS, Aged Care CHSP, SAH — all sectors recognised" },
      { icon: "🤍", text: "Communication style chips signal person-centred practice immediately" },
      { icon: "📈", text: "More referrals — coordinators share profiles they trust with families" },
    ],
  },
  onboarding: {
    problemIcon: "⏳",
    problem: "Providers spend hours on phone calls and emails introducing new workers to clients before the first shift",
    accentColor: C.gold,
    accentGlow: "rgba(245,200,66,0.18)",
    steps: [
      { icon: "🏢", label: "Worker Gets Profile", sublabel: "Team licence — day one" },
      { icon: "📤", label: "Send Link to Client", sublabel: "48 hrs before first shift" },
      { icon: "👁", label: "Client Explores Profile", sublabel: "Photo, video, services, AAC" },
      { icon: "🤝", label: "First Visit", sublabel: "Not a stranger anymore" },
      { icon: "⭐", label: "Smoother Relationship", sublabel: "Trust starts earlier" },
    ],
    benefits: [
      { icon: "⏱", text: "Cuts onboarding calls and intro emails — profile does the work" },
      { icon: "🧩", text: "AAC board lets non-verbal clients explore and respond before meeting" },
      { icon: "🎨", text: "Team licence — consistent branding across all workers in your agency" },
      { icon: "📊", text: "Clients arrive at first shift already knowing their worker — lower anxiety" },
    ],
  },
  "profile-speaks": {
    problemIcon: "😰",
    problem: "Meeting a new support worker is stressful for many participants — the unknown is genuinely hard",
    accentColor: C.teal,
    accentGlow: "rgba(45,212,191,0.18)",
    steps: [
      { icon: "📤", label: "Worker Shares Profile", sublabel: "Before first visit" },
      { icon: "🖼", label: "Client Sees Face & Name", sublabel: "Photo + intro video" },
      { icon: "🗣", label: "Uses AAC Board", sublabel: "Communicates preferences" },
      { icon: "🏠", label: "Worker Arrives", sublabel: "Already familiar" },
      { icon: "💙", label: "Trust Starts Early", sublabel: "Anxiety is lower" },
    ],
    benefits: [
      { icon: "🧩", text: "Autism, anxiety, communication differences — all supported before hello" },
      { icon: "🗣", text: "Built-in AAC board — participants communicate back in their own way" },
      { icon: "🎬", text: "Intro video makes the worker a real person, not a stranger" },
      { icon: "🌱", text: "Person-centred practice from the very first moment — not just in theory" },
    ],
  },
  "public-awareness": {
    problemIcon: "🔒",
    problem: "Support work happens invisibly — families searching for help don't know where to look or who to trust",
    accentColor: C.gold,
    accentGlow: "rgba(245,200,66,0.18)",
    steps: [
      { icon: "🌐", label: "Publish Profile Publicly", sublabel: "Shareable link + QR code" },
      { icon: "📌", label: "Share Everywhere", sublabel: "Email sig, noticeboard, socials" },
      { icon: "👁", label: "Community Discovers", sublabel: "Families, coordinators, groups" },
      { icon: "📞", label: "Direct Enquiries", sublabel: "No middleman needed" },
      { icon: "🌊", label: "Sector Becomes Visible", sublabel: "The wave grows" },
    ],
    benefits: [
      { icon: "📍", text: "QR code on lanyard or noticeboard — anyone nearby can scan and connect" },
      { icon: "✉️", text: "Email signature link — every email you send is a passive referral" },
      { icon: "🌏", text: "Families who didn't know where to start now have a professional to browse" },
      { icon: "🤝", text: "Builds a visible, human face for the support sector in your community" },
    ],
  },
};

// ── Scenarios ────────────────────────────────────────────────
const SCENARIOS = [
  {
    id: "employment",
    tag: "Job Seekers",
    accent: C.teal,
    accentGlow: "rgba(45,212,191,0.18)",
    icon: "🎯",
    headline: "Applying for Support Work Just Got a Whole Lot Easier",
    subhead: "Your profile link is your new cover letter.",
    body: `Forget the generic résumé. When you apply for a support role, attach your InSync Profiles Profile link alongside your application. Hiring managers see your photo, your services, your communication style, your credentials, and a personal intro video — before they've even opened your email.

You're not just another name in a pile. You're a person with a presence. You show up before the interview. You demonstrate that you understand accessibility, communication, and professionalism from the very first touchpoint.

Support agencies are actively looking for workers who "get it." Your profile proves you already do.`,
    quote: "I sent my profile link with my application and got a call the same afternoon. The coordinator said she'd never seen anything like it.",
    quoteBy: "Support worker, Melbourne",
    tags: ["NDIS", "Aged Care", "Disability Support", "Job Applications"],
  },
  {
    id: "social-media",
    tag: "Social Media",
    accent: C.gold,
    accentGlow: "rgba(245,200,66,0.18)",
    icon: "📲",
    headline: "Turn Heads in Every Support Group Online",
    subhead: "While others post text walls, you post a professional card.",
    body: `Facebook groups for NDIS, aged care, and disability support are full of people searching for the right worker. Most posts are a paragraph of text and a phone number. Yours is different.

Post your InSync Profiles Profile card — a polished, branded image with your photo, services, and communication style — and pin your profile link in the comments. Families scroll past dozens of posts. Yours stops them.

The auto-generated caption with hashtags means you're also discoverable. The shareable link means they can tap through to your full interactive profile, use the AAC board if they need it, and contact you directly. No friction. No guessing.

You're not just posting. You're making a statement.`,
    quote: "I posted my profile card in three Facebook groups on a Tuesday. By Thursday I had two new clients.",
    quoteBy: "Support worker, Brisbane",
    tags: ["Facebook Groups", "Instagram", "NDIS Community", "Disability Support"],
  },
  {
    id: "sector-credibility",
    tag: "Sector Credibility",
    accent: C.teal,
    accentGlow: "rgba(45,212,191,0.18)",
    icon: "💼",
    headline: "You Get It. And Now the Sector Knows It.",
    subhead: "Professionalism that speaks the language of the sector.",
    body: `The support sector has a language — NDIS Worker Check, Working with Children, First Aid, police clearance, person-centred practice, communication styles, sensory preferences. Most workers know this language. Very few show it.

Your InSync Profiles Profile shows it. Every badge, every service circle, every "How I Show Up" chip communicates that you understand the sector's values — before you've said a word.

When a support coordinator, a plan manager, or a family carer opens your profile, they see someone who takes their role seriously. Someone who has thought about how they communicate, what they offer, and how they show up for the people they support.

That's not just a profile. That's a statement of professional identity.`,
    quote: "My coordinator said my profile was the most professional thing she'd seen from an independent worker. It opened three referrals.",
    quoteBy: "Independent support worker, Sydney",
    tags: ["NDIS", "Aged Care CHSP", "SAH", "Professional Identity"],
  },
  {
    id: "onboarding",
    tag: "Providers & Coordinators",
    accent: C.gold,
    accentGlow: "rgba(245,200,66,0.18)",
    icon: "🏢",
    headline: "Onboard New Staff in Minutes, Not Days",
    subhead: "Every new worker, a complete profile from day one.",
    body: `Support providers and coordinators spend hours introducing new workers to clients, families, and teams. Phone calls, emails, introductory meetings — all before the first shift.

With InSync Profiles, every new worker has a complete, accessible profile ready from day one. Send the link to the client before the first visit. The client sees the worker's photo, their services, their communication style, and their credentials. They can even use the AAC board to communicate their preferences back.

The first meeting isn't an introduction. It's a continuation.

For agencies managing 5 or 10 workers, the Team licence means every person on your team has a consistent, professional presence — with your branding, your colour theme, and your standards. Onboarding becomes a system, not a scramble.`,
    quote: "We now send every new worker's profile link to clients 48 hours before their first shift. The difference in how clients receive them is remarkable.",
    quoteBy: "Support coordinator, Adelaide",
    tags: ["Providers", "Support Coordinators", "Team Onboarding", "Client Matching"],
  },
  {
    id: "profile-speaks",
    tag: "Client Connection",
    accent: C.teal,
    accentGlow: "rgba(45,212,191,0.18)",
    icon: "🤝",
    headline: "Your Profile Speaks to Your Recipients Before You Do",
    subhead: "The first impression happens before the first hello.",
    body: `For many people who receive support — especially those with communication differences, cognitive disabilities, or anxiety — meeting a new support worker is genuinely stressful. The unknown is hard.

Your InSync Profiles Profile changes that. Before the first visit, your client can open your profile, see your face, hear your intro video, read how you communicate, and tap through your services. If they use AAC, the built-in communication board lets them explore and respond in their own way.

By the time you arrive at the door, you're not a stranger. You're someone they already know a little. The anxiety is lower. The trust is already starting.

That's not just good practice. That's person-centred support from the very first moment.`,
    quote: "My client with autism opened my profile three times before our first session. When I arrived, she already knew my name and what we'd be doing. It was the smoothest first meeting I've ever had.",
    quoteBy: "Support worker, Perth",
    tags: ["Person-Centred", "AAC", "Autism", "Anxiety Support", "First Impressions"],
  },
  {
    id: "public-awareness",
    tag: "Public Awareness",
    accent: C.gold,
    accentGlow: "rgba(245,200,66,0.18)",
    icon: "🌊",
    headline: "A New Wave of Support Awareness in the Public Domain",
    subhead: "The sector is going visible. Be part of the wave.",
    body: `Support work has always happened behind closed doors. In homes, in facilities, in community spaces — quietly, professionally, invisibly. The public rarely sees it. Families searching for support rarely know where to look.

That's changing.

As support workers share their profiles publicly — on social media, in community groups, on local notice boards, in email signatures — the sector becomes visible in a way it never has been before. Families who didn't know where to start now have a directory of professionals they can browse, read, and connect with directly.

InSync Profiles is part of that wave. Every worker who publishes their profile is adding to a growing public presence for the support sector — professional, accessible, human.

Stand out. Be visible. Be part of the wave.`,
    quote: "I put my profile link in my email signature and on my local community Facebook page. I've had three families contact me who had no idea how to find a support worker before.",
    quoteBy: "Support worker, Hobart",
    tags: ["Public Awareness", "Community", "Visibility", "Sector Growth"],
  },
];

export default function Scenarios() {
  return (
    <div style={{ background: C.bgPage, minHeight: "100vh", fontFamily: "'Outfit', sans-serif", color: C.textBody }}>
      <a href="#main-content" style={{ position: "absolute", left: "-9999px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }}>Skip to main content</a>

      <main id="main-content" style={{ paddingTop: "110px" }}>

        {/* ── HERO ── */}
        <section
          style={{ textAlign: "center", padding: "96px 24px 72px", maxWidth: "820px", margin: "0 auto", position: "relative" }}
          aria-labelledby="scenarios-hero-heading"
        >
          {/* Glow */}
          <div aria-hidden="true" style={{ position: "absolute", top: "40px", left: "50%", transform: "translateX(-50%)", width: "700px", height: "320px", background: `radial-gradient(ellipse at center, rgba(45,212,191,0.15) 0%, transparent 70%)`, pointerEvents: "none" }} />
          <div aria-hidden="true" style={{ position: "absolute", top: "100px", right: "10%", width: "300px", height: "200px", background: `radial-gradient(ellipse at center, ${C.goldGlow} 0%, transparent 70%)`, pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Tag */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: C.bgGlass, border: `1px solid ${C.border}`, borderRadius: "99px", padding: "6px 18px", marginBottom: "28px" }}>
              <span style={{ fontSize: "16px" }} aria-hidden="true">🌊</span>
              <span style={{ color: C.teal, fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>The New Wave</span>
            </div>

            <h1
              id="scenarios-hero-heading"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textHead, fontSize: "clamp(38px, 6vw, 62px)", fontWeight: 700, lineHeight: 1.08, marginBottom: "24px", letterSpacing: "-0.01em" }}
            >
              One Profile.<br />
              <span style={{ background: `linear-gradient(90deg, ${C.teal} 0%, ${C.gold} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontStyle: "italic" }}>
                Unlimited Possibilities.
              </span>
            </h1>

            <p style={{ color: C.textBody, fontSize: "clamp(15px, 2.2vw, 18px)", lineHeight: 1.8, maxWidth: "600px", margin: "0 auto 40px" }}>
              InSync Profiles isn't just a template. It's a shift in how the support sector presents itself — to employers, to clients, to families, to the world. Here's what that looks like in practice.
            </p>

            {/* Scenario quick-nav */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
              {SCENARIOS.map(s => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  style={{
                    background: C.bgGlass,
                    border: `1px solid ${C.border}`,
                    borderRadius: "99px",
                    color: C.textBody,
                    fontSize: "12px",
                    fontWeight: 600,
                    padding: "7px 16px",
                    textDecoration: "none",
                    transition: "all 150ms ease-out",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span aria-hidden="true">{s.icon}</span>
                  {s.tag}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── SCENARIO CARDS ── */}
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px 80px" }}>
          {SCENARIOS.map((s, i) => (
            <section
              key={s.id}
              id={s.id}
              style={{
                marginBottom: "64px",
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                borderRadius: "24px",
                overflow: "hidden",
                position: "relative",
              }}
              aria-labelledby={`scenario-${s.id}-heading`}
            >
              {/* Accent bar top */}
              <div aria-hidden="true" style={{ height: "3px", background: `linear-gradient(90deg, ${s.accent}, transparent)` }} />

              {/* Glow behind card */}
              <div aria-hidden="true" style={{ position: "absolute", top: "-40px", left: "-40px", width: "300px", height: "200px", background: `radial-gradient(ellipse at center, ${s.accentGlow} 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />

              <div style={{ padding: "40px 40px 36px", position: "relative", zIndex: 1 }}>

                {/* Scenario header */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", marginBottom: "28px", flexWrap: "wrap" }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: `${s.accentGlow}`, border: `1.5px solid ${s.accent}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", flexShrink: 0 }} aria-hidden="true">
                    {s.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "inline-block", background: `${s.accentGlow}`, border: `1px solid ${s.accent}50`, borderRadius: "99px", padding: "3px 12px", marginBottom: "8px" }}>
                      <span style={{ color: s.accent, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.tag}</span>
                    </div>
                    <h2
                      id={`scenario-${s.id}-heading`}
                      style={{ fontFamily: "'Cormorant Garamond', serif", color: C.textHead, fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 700, lineHeight: 1.15, margin: "0 0 6px" }}
                    >
                      {s.headline}
                    </h2>
                    <p style={{ color: s.accent, fontSize: "14px", fontWeight: 600, margin: 0, fontStyle: "italic" }}>{s.subhead}</p>
                  </div>
                </div>

                {/* Body text */}
                <div style={{ marginBottom: "28px" }}>
                  {s.body.trim().split("\n\n").map((para, pi) => (
                    <p key={pi} style={{ color: C.textBody, fontSize: "15px", lineHeight: 1.85, margin: "0 0 16px" }}>
                      {para}
                    </p>
                  ))}
                </div>

                {/* Quote */}
                <blockquote
                  style={{
                    background: `${s.accentGlow}`,
                    border: `1px solid ${s.accent}30`,
                    borderLeft: `4px solid ${s.accent}`,
                    borderRadius: "0 12px 12px 0",
                    padding: "16px 20px",
                    margin: "0 0 24px",
                  }}
                >
                  <p style={{ color: C.textHead, fontSize: "14px", fontStyle: "italic", lineHeight: 1.7, margin: "0 0 8px" }}>
                    "{s.quote}"
                  </p>
                  <footer>
                    <cite style={{ fontStyle: "normal", color: s.accent, fontSize: "12px", fontWeight: 600 }}>— {s.quoteBy}</cite>
                  </footer>
                </blockquote>

                {/* ── ANIMATED FLOWCHART ── */}
                <ScenarioFlowchart
                  data={FLOWCHARTS[s.id]}
                  uid={`fc-${s.id}`}
                />

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "24px" }}>
                  {s.tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: `1px solid ${C.border}`,
                        borderRadius: "99px",
                        color: C.textDim,
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "4px 12px",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Scenario number */}
              <div aria-hidden="true" style={{ position: "absolute", bottom: "20px", right: "28px", fontFamily: "'Cormorant Garamond', serif", fontSize: "80px", fontWeight: 700, color: "rgba(255,255,255,0.04)", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>
                {String(i + 1).padStart(2, "0")}
              </div>
            </section>
          ))}
        </div>

        {/* ── WAVE CTA ── */}
        <section
          style={{
            padding: "96px 24px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            background: C.bgBand,
            borderTop: `1px solid ${C.border}`,
          }}
          aria-labelledby="wave-cta-heading"
        >
          <div aria-hidden="true" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "800px", height: "400px", background: `radial-gradient(ellipse at center, rgba(45,212,191,0.12) 0%, transparent 70%)`, pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: "640px", margin: "0 auto" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700, color: C.textHead, lineHeight: 1.1, marginBottom: "20px" }}>
              Ready to be part<br />
              <span style={{ background: `linear-gradient(90deg, ${C.teal} 0%, ${C.gold} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontStyle: "italic" }}>
                of the wave?
              </span>
            </div>
            <p style={{ color: C.textBody, fontSize: "16px", lineHeight: 1.75, marginBottom: "36px" }}>
              One profile. Every scenario. Every sector. From $25 AUD — one-time payment, yours forever.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/demo"
                style={{
                  background: `linear-gradient(135deg, ${C.teal} 0%, #0ea5e9 100%)`,
                  color: "#0d1b2a",
                  fontWeight: 700,
                  fontSize: "15px",
                  padding: "16px 36px",
                  borderRadius: "99px",
                  textDecoration: "none",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  boxShadow: `0 4px 24px rgba(45,212,191,0.35)`,
                  transition: "transform 160ms ease-out, box-shadow 160ms ease-out",
                  display: "inline-block",
                }}
              >
                Try Free Demo
              </Link>
              <Link
                href="/pricing"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: `1px solid ${C.border}`,
                  color: C.textHead,
                  fontWeight: 600,
                  fontSize: "15px",
                  padding: "16px 36px",
                  borderRadius: "99px",
                  textDecoration: "none",
                  transition: "background 160ms ease-out",
                  display: "inline-block",
                }}
              >
                See Pricing →
              </Link>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ background: "rgba(0,0,0,0.3)", borderTop: `1px solid ${C.border}`, padding: "32px 24px" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: C.textDim, fontSize: "13px" }}>© 2026 InSync Profiles · ABN 54 116 010 622</span>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {[
                { href: "/",           label: "Home" },
                { href: "/pricing",    label: "Pricing" },
                { href: "/how-to-use", label: "How It Works" },
                { href: "/privacy",    label: "Legal & Privacy" },
                { href: "/demo",      label: "Try Demo" },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ color: C.textDim, fontSize: "13px", textDecoration: "none", transition: "color 150ms" }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
