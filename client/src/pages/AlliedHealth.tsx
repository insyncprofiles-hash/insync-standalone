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
              What if the information didn't disappear when the session ended? What if the strategy, the approach, the understanding of who this person is — stayed somewhere the whole support circle could find it?
            </p>
          </div>

          {/* Pull quote */}
          <blockquote style={{ borderLeft: `4px solid ${C.teal}`, paddingLeft: "24px", margin: "0 0 56px", fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(20px, 2.5vw, 26px)", color: C.textHead, fontStyle: "italic", lineHeight: 1.5 }}>
            "The gap between sessions is where things either stick or fall apart."
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

        {/* ── SARAH TORENS DEMO PROFILE ── */}
        <section style={{ padding: "0 24px 80px", maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "64px" }}>
            <p style={{ color: C.gold, fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px", textAlign: "center" }}>Live Demo Profile</p>
            <h2 style={{ color: C.textHead, fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, textAlign: "center", marginBottom: "8px" }}>Meet Sarah Torens, OT</h2>
            <p style={{ color: C.textBody, fontSize: "16px", textAlign: "center", marginBottom: "40px", maxWidth: "560px", margin: "0 auto 40px" }}>See exactly how an allied health profile looks to participants and families — including video, services, availability, and resources.</p>
            <div style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`, borderRadius: "20px", padding: "clamp(20px, 5vw, 32px)", display: "flex", gap: "28px", alignItems: "flex-start", flexWrap: "wrap", justifyContent: "center" }}>
              {/* Photo + name */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", minWidth: "140px" }}>
                <img
                  src="https://insyncprofiles.net/manus-storage/sarah_torens_real_bbb59a2c.jpg"
                  alt="Sarah Torens, Occupational Therapist"
                  style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", border: `3px solid ${C.gold}` }}
                />
                <div style={{ textAlign: "center" }}>
                  <p style={{ color: C.textHead, fontWeight: 700, fontSize: "16px", margin: 0 }}>Sarah Torens</p>
                  <p style={{ color: C.gold, fontSize: "13px", margin: "2px 0 0" }}>Occupational Therapist</p>
                  <p style={{ color: C.textDim, fontSize: "12px", margin: "2px 0 0" }}>Queensland (Remote & Regional)</p>
                  <a
                    href="https://bit.ly/456kq1e"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-block", marginTop: "10px", fontSize: "11px", color: C.gold, fontFamily: "'Outfit', monospace", letterSpacing: "0.04em", textDecoration: "none", background: "rgba(245,200,66,0.08)", border: `1px solid ${C.goldDim}`, borderRadius: "6px", padding: "4px 10px" }}
                  >
                    🔗 bit.ly/456kq1e
                  </a>
                  <p style={{ color: C.textDim, fontSize: "10px", margin: "4px 0 0", fontStyle: "italic" }}>One link. Opens her full profile.</p>
                </div>
              </div>
              {/* Details */}
              <div style={{ flex: 1, minWidth: "min(200px, 100%)", width: "100%" }}>
                <p style={{ color: C.textBody, fontSize: "14px", lineHeight: 1.7, marginBottom: "16px" }}>Specialised in intellectual and developmental disability, flat feet, walking endurance, and remote service delivery. 7 years experience.</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
                  {["AHPRA Registered", "NDIS Worker Screening", "Blue Card", "Remote & Regional", "Telehealth Available"].map(b => (
                    <span key={b} style={{ background: "rgba(245,200,66,0.12)", border: `1px solid ${C.goldDim}`, borderRadius: "99px", padding: "4px 12px", fontSize: "12px", color: C.gold, fontWeight: 600 }}>{b}</span>
                  ))}
                </div>
                <a
                  href="https://insyncprofiles.net/view?name=Sarah+Torens&title=Occupational+Therapist&tagline=I+meet+you+where+you+are+%E2%80%94+and+we+go+from+there.&roleType=allied-health&bio=Hi%2C+I%27m+Sarah+%E2%80%94+an+OT+based+in+Queensland+with+a+special+interest+in+working+with+children+and+young+people+with+intellectual+and+developmental+disabilities.%0A%0AI+believe+the+best+therapy+happens+when+the+person+in+front+of+me+is+actually+part+of+it.+That+means+starting+with+what+they+love%2C+what+lights+them+up%2C+and+what+matters+to+their+family+%E2%80%94+not+a+checklist.%0A%0AAs+an+OT%2C+I+work+on+the+things+that+matter+in+everyday+life+%E2%80%94+building+independence+in+daily+living+tasks%2C+assessing+functional+capacity%2C+recommending+assistive+technology%2C+supporting+sensory+regulation%2C+and+helping+participants+and+their+families+develop+strategies+they+can+use+between+sessions.+I+also+work+closely+with+schools%2C+carers%2C+and+support+teams+to+make+sure+the+plan+carries+through+everywhere+it+needs+to.%0A%0AI+work+across+remote+and+regional+Queensland+and+I%27m+experienced+in+supporting+participants+with+global+developmental+delay%2C+low+muscle+tone%2C+and+building+walking+endurance+through+fun%2C+meaningful+activity.%0A%0ABefore+I+travel+to+your+town%2C+I%27d+love+to+hear+from+Ky+and+the+family.+If+Ky+wants+to+let+me+know+anything+%E2%80%94+what+he%27s+excited+about%2C+what+he%27s+worried+about%2C+or+just+say+hi+%E2%80%94+he+can+use+the+Speak+to+Message+button+or+the+AAC+board+on+this+page.+No+typing+needed.%0A%0AI%27m+registered+with+AHPRA+and+a+member+of+Occupational+Therapy+Australia.+I+hold+a+current+NDIS+Worker+Screening+Check%2C+Blue+Card%2C+and+full+professional+indemnity+insurance.&email=sarah.torens%40example.com.au&phone=0400+000+000&location=Queensland+%28Remote+%26+Regional%29&ctaText=MESSAGE+TO+BEGIN&video=https%3A%2F%2Fyoutube.com%2Fshorts%2F_e1uvuez1NI%3Fsi%3DjGkN2eZw0Zxkdj9z&photo=https%3A%2F%2Finsyncprofiles.net%2Fmanus-storage%2Fsarah_torens_real_bbb59a2c.jpg&services=ot%2Csensory-processing%2Cassistive-tech%2Ccapacity-building%2Chome-visits%2Ctelehealth%2Ccarer-training%2Cearly-intervention&exp=disability%3Aintellectual%2Cdisability%3Aautism%2Cdisability%3Aphysical%2Cage%3Achildren%2Cage%3Ayoung-adults%2Csetting%3Ahome%2Csetting%3Acommunity%2Csetting%3Atelehealth&availDays=Mon%2CTue%2CWed%2CThu%2CFri&availFrom=8%3A00+AM&availTo=5%3A00+PM&susCom=visual-supports%2Csimple-language%2Cwritten-summaries&susCon=sensory-aware%2Cstrengths-based%2Cfamily-centred&susPre=calm%2Cplayful%2Cconsistent&yrsExp=7&customExp=Specialised+in+remote+service+delivery%2C+functional+capacity+assessments%2C+daily+living+skill+building%2C+sensory+processing%2C+assistive+technology+prescription%2C+and+supporting+participants+with+GDD+and+intellectual+disability+to+build+walking+endurance+and+independence.&badges=AHPRA+Registered%7CNDIS+Worker+Screening%7CBlue+Card%7CRemote+%26+Regional%7CTelehealth+Available&resources=NDIS%2520Occupational%2520Therapy%2520Explained%7Chttps%253A%252F%252Fwww.ndis.gov.au%252Fparticipants%252Freasonable-and-necessary-supports%252Ftherapies-and-supports%7COfficial%2520NDIS%2520guide%2520to%2520OT%2520supports%2520and%2520what%27s%2520funded%7EFlat%2520Feet%2520%2526%2520Orthotics%2520in%2520Children%7Chttps%253A%252F%252Fwww.rch.org.au%252Fkidsinfo%252Ffact_sheets%252FFlat_feet%252F%7CRoyal%2520Children%27s%2520Hospital%2520guide%2520for%2520families%7EBuilding%2520Walking%2520Endurance%2520%25E2%2580%2594%2520Tips%2520for%2520Families%7Chttps%253A%252F%252Fwww.cerebralpalsy.org.au%252Fresources%252F%7CPractical%2520strategies%2520to%2520support%2520walking%2520goals%2520at%2520home%7ESensory%2520Processing%2520%2526%2520Intellectual%2520Disability%7Chttps%253A%252F%252Fwww.otaus.com.au%252F%7COT%2520Australia%2520resources%2520for%2520practitioners%2520and%2520families"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: `linear-gradient(135deg, ${C.gold} 0%, #e8a800 100%)`, color: "#0d1b2a", padding: "14px 28px", borderRadius: "99px", fontSize: "15px", fontWeight: 800, textDecoration: "none", boxShadow: `0 4px 20px rgba(245,200,66,0.3)`, width: "100%", boxSizing: "border-box" as const }}
                >
                  View Sarah's Profile →
                </a>
              </div>
            </div>
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
