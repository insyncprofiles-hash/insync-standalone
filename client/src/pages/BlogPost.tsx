/* ============================================================
   BlogPost.tsx — InSync Profiles Individual Blog Article Page
   Design: Matches Landing page — deep navy bg, gold accents
   Fonts: Cormorant Garamond (display) + Outfit (body)
   ============================================================ */
import React from "react";
import { Link } from "wouter";

const C = {
  bgPage:    "linear-gradient(160deg, #0d1b2a 0%, #0f2d3d 40%, #0a2a1e 100%)",
  bgCard:    "rgba(255,255,255,0.06)",
  textHead:  "#ffffff",
  textBody:  "rgba(255,255,255,0.82)",
  textDim:   "rgba(255,255,255,0.45)",
  gold:      "#f5c842",
  teal:      "#2dd4bf",
  border:    "rgba(255,255,255,0.10)",
  borderGold:"rgba(245,200,66,0.30)",
};

// ── The article content ─────────────────────────────────────
function SeaOfSamenessArticle() {
  return (
    <>
      <p>
        Open any Facebook Group, LinkedIn feed, or local community board today, and you will see the exact same thing. Hundreds of support worker posts reading from the exact same script:
      </p>
      <blockquote>
        <p>"Hi, I'm an independent support worker with spots available!"</p>
        <p>"I love cooking, community access, and walks in the park."</p>
        <p>"I have a reliable car, ABN, and my First Aid certificate. DM me!"</p>
      </blockquote>
      <p>
        While these qualifications are fantastic, this repetitive way of posting creates a massive problem in the Australian care sector: a <strong>sea of sameness</strong>.
      </p>
      <p>
        When every post looks, sounds, and reads identically, true compatibility becomes impossible to find. People with disability and their families are forced to guess who will actually fit into their lives. Exceptional support workers remain completely invisible, hidden behind generic text updates and algorithms that treat human connection like a classified ad.
      </p>
      <p>
        At InSync Profiles, we believe the support sector deserves better. Here is why relying on basic social media posts is failing workers, participants, and families alike — and how an accessibility and interaction approach is changing the game.
      </p>

      <h2>The Real-World Problem: The Cost of Invisibility on Social Media</h2>
      <p>
        For independent support workers, posting the same generic text as everyone else is bad for business. When you cannot easily showcase your unique skills, lived experience, or personality, you become a commodity. Clients end up choosing support based on price alone, rather than value and fit.
      </p>
      <p>
        For families and NDIS participants, scrolling through endless, identical Facebook posts is exhausting. Inviting a stranger into your home based on a three-sentence social media update is a massive gamble. It leads to high turnover, broken trust, and wasted funding.
      </p>
      <p>
        <strong>The care sector doesn't need more generic text posts. It needs human visibility.</strong>
      </p>

      <h2>Introducing InSync Profiles: The New Standard for Support Professionals</h2>
      <p>
        InSync Profiles eliminates the guesswork by transforming a basic, lifeless social media post into a dynamic, multi-dimensional Digital Support Worker Profile.
      </p>
      <p>
        Instead of dropping a wall of text into a Facebook group, workers can drop a single link that showcases human personality, communication style, and real-world capability. An InSync Profiles profile brings a worker's true identity to light before they ever step through a client's front door.
      </p>

      <h2>🌟 Key Unique Features Built for the Modern Sector</h2>
      <ul>
        <li><strong>True-Identity Multimedia:</strong> Workers can upload video introductions, audio clips, and personalized portfolios so families can instantly gauge energy, tone, and cultural fit from a single link.</li>
        <li><strong>Invisible Skill Mapping:</strong> We highlight the soft skills, sensory sensitivities, specific lived experiences, and compatibility triggers that standard text posts completely ignore.</li>
        <li><strong>Third-Party Professional Integrations:</strong> Workers can neatly aggregate all of their external, third-party professional links in one centralized hub, allowing clients to click through and handle direct verification seamlessly.</li>
        <li><strong>The Hyper-Visibility Engine:</strong> A premium, professional digital link that independent workers fully own, manage, and can paste directly into any social media platform, provider directory, or email.</li>
      </ul>

      <h2>🤝 How the Entire NDIS Eco-System Benefits</h2>

      <h3>🧑‍🦽 For People with Disability: Choice and Control</h3>
      <p>
        You should have the autonomy to see and hear your potential support team beforehand. InSync Profiles helps you find someone who truly shares your interests, respects your boundaries, and matches your lifestyle — with easy access to the worker's third-party professional links for direct verification.
      </p>

      <h3>🏡 For Families &amp; Carers: Peace of Mind, Faster</h3>
      <p>
        Drastically reduce the time spent filtering through random social media comments. By reviewing a rich, transparent digital CV link, you can confidently shortlist support workers who will seamlessly integrate into your family's routine.
      </p>

      <h3>💼 For Support Workers: Stand Out and Earn Your Worth</h3>
      <p>
        Stop fighting the algorithms of noisy social media feeds. InSync Profiles gives you a professional digital asset to justify your hourly rates, showcase your professionalism, and win private clients by letting you display your third-party professional networks proudly.
      </p>

      <h2>Stop Being Invisible. Get InSync.</h2>
      <p>
        The support sector is built on human connection, so why are we still hiring based on flat text posts? Whether you are a worker looking to grow your independent business, or a family searching for the perfect care match, it is time to step out of the sea of sameness.
      </p>
      <p>
        <strong>👉 Ready to transform how you present yourself online?</strong> Create your unique profile today at <a href="https://insyncprofiles.net" style={{ color: "#f5c842" }}>insyncprofiles.net</a>.
      </p>

      <div style={{ marginTop: "48px", padding: "28px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px" }}>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "16px" }}>Related Topics</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {[
            "How to get private NDIS clients on Facebook",
            "Why am I not getting clients from Facebook groups NDIS",
            "Support worker Facebook posts not working",
            "NDIS independent support worker find clients fast",
            "How to stand out in support worker Facebook groups",
            "Getting lost in NDIS Facebook groups",
            "Independent support worker bio examples Australia",
            "Free digital portfolio tool for NDIS workers",
            "Support worker template sounds too generic",
            "How to write a support worker introduction post",
            "Alternative to standard resumes for support workers",
            "Best digital CV platforms for NDIS independent workers",
            "How to justify higher independent support worker rates",
            "NDIS support platforms with high fees alternative",
            "How to build a private support worker brand Australia",
            "Stop fighting agency algorithms support worker",
          ].map(tag => (
            <span key={tag} style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "99px", padding: "4px 12px", lineHeight: 1.5 }}>{tag}</span>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Lanyard Card Benefits Article ──────────────────────────
function LanyardCardBenefitsArticle() {
  return (
    <>
      <div style={{ textAlign: "center", margin: "0 0 40px" }}>
        <img
          src="/assets/lanyard_card_v2.png"
          alt="InSync Profiles lanyard card — matt black with diagonal aurora strip and QR code"
          style={{ maxWidth: "320px", width: "100%", borderRadius: "20px", boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(212,160,23,0.15)" }}
        />
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginTop: "12px", fontStyle: "italic" }}>The InSync Profiles lanyard card — each buyer receives a card with their own unique QR code</p>
      </div>

      <p>
        A matt black card. A diagonal aurora strip flowing from deep purple to warm gold. A QR code sitting right in the centre. Two words at the bottom: <strong style={{ color: "#f5c842" }}>SUPPORT WORKER</strong>.
      </p>
      <p>
        That is all it takes. Support workers wearing the InSync Profiles lanyard card are discovering that the most powerful marketing tool they own is not a Facebook post, not a business card, and not a listing on a platform — it is the thing hanging around their neck.
      </p>

      <h2>In the Local Community</h2>
      <p>
        Support workers are out in the community every day — at supermarkets, parks, cafes, transport hubs, and community centres. The lanyard card turns every outing into a passive marketing moment. When a carer, coordinator, or family member notices <em>"SCAN ME. SUPPORT WORKER"</em> on a lanyard, curiosity does the work. A quick scan delivers a full, polished profile instantly — no business card needed, no fumbling for contact details.
      </p>
      <p>
        The design is intentional. The aurora strip catches the eye. The matt black commands attention without being loud. People notice it and ask about it before the worker has said a single word.
      </p>

      <h2>On Personal Errands</h2>
      <p>
        Even off-duty, a support worker running errands is visible in their community. NDIS participants, family members, and support coordinators are everywhere. A professional, eye-catching lanyard card signals credibility and approachability. It opens conversations that would never happen otherwise — someone in a checkout queue, a neighbour, or a local business owner who knows a family looking for support.
      </p>
      <p>
        The card does not require the worker to introduce themselves, pitch their services, or hand over a number. The QR code handles all of that. One scan and the potential client is already reading the worker's profile, watching their intro video, and reviewing their qualifications.
      </p>

      <h2>At Community Events, Markets &amp; Expos</h2>
      <p>
        Events like disability expos, community markets, NDIS information days, and local fairs are high-value environments. A worker wearing their InSync Profile lanyard card stands out immediately. Coordinators and participants actively looking for workers can scan and shortlist on the spot — no forms, no follow-up emails required.
      </p>
      <p>
        In a room full of people handing out paper flyers, a scannable card that links directly to a rich, interactive profile is a completely different category of professional presence.
      </p>

      <h2>Attracting New Informed Clients</h2>
      <p>
        This is perhaps the most powerful benefit. When a potential client or coordinator scans the QR code, they do not just get a name and phone number. They receive a complete picture:
      </p>
      <ul>
        <li><strong>A photo and introduction video</strong> — immediate personal connection before any conversation</li>
        <li><strong>Qualifications and certifications</strong> — instant trust and credibility verification</li>
        <li><strong>Communication style and personality</strong> — helps clients assess compatibility upfront</li>
        <li><strong>AAC board and accessibility features</strong> — shows the worker understands diverse needs</li>
        <li><strong>Location and availability</strong> — reduces back-and-forth enquiries</li>
        <li><strong>Direct contact or booking link</strong> — frictionless path from interest to engagement</li>
      </ul>
      <p>
        The result is that every client who reaches out via the QR code is already informed, already interested, and already aligned. Conversion rates improve dramatically because the discovery process has already happened — before the first phone call.
      </p>

      <h2>Building a Personal Brand Over Time</h2>
      <p>
        A support worker who consistently wears their lanyard card builds name recognition in their local area. Over months and years, this compounds. Coordinators remember them. Clients refer them. The worker becomes a known, trusted presence in their community rather than an anonymous entry in a database.
      </p>
      <p>
        The InSync Profiles lanyard card is not just an accessory. It is a statement of professional identity — one that works quietly, consistently, and without any ongoing effort from the worker.
      </p>

      <blockquote>
        <p>Your profile goes where you go. Every errand. Every outing. Every event. The QR code is always ready. The conversation can start any time.</p>
      </blockquote>

      <p>
        <strong>Ready to get yours?</strong> Every InSync Profiles licence includes a downloadable lanyard card with your unique QR code, ready to print and wear. <a href="/pricing" style={{ color: "#f5c842" }}>View pricing →</a>
      </p>

      <div style={{ marginTop: "48px", padding: "28px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px" }}>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "16px" }}>Related Topics</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {[
            "NDIS support worker marketing ideas",
            "How to attract private NDIS clients",
            "Support worker personal brand Australia",
            "QR code lanyard for support workers",
            "NDIS independent worker tips",
            "How to get more NDIS clients without social media",
            "Support worker business card alternative",
            "Digital profile for NDIS workers",
            "Passive marketing for support workers",
            "NDIS worker community visibility",
          ].map(tag => (
            <span key={tag} style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "99px", padding: "4px 12px", lineHeight: 1.5 }}>{tag}</span>
          ))}
        </div>
      </div>
    </>
  );
}

function NdisCutsArticle() {
  return (
    <>
      <p>
        The government just cut billions from the NDIS. Plans are shrinking. Hours are being reduced. And participants — already navigating a system that was never easy — are now being asked to do more with less.
      </p>
      <p>
        When funding is tight, participants can't afford to take a chance on someone they know nothing about. Every support hour matters. Every match matters. A bad fit doesn't just waste money — it costs trust, stability, and sometimes safety.
      </p>
      <p>
        That's the reality support workers are walking into right now.
      </p>
      <h2>The Hidden Cost of Being Unknown</h2>
      <p>
        Most support workers are invisible before the first conversation. A name. A phone number. Maybe a three-line bio in a coordinator's spreadsheet. That's it.
      </p>
      <p>
        In a well-funded environment, participants could afford to take a chance — trial a few workers, find the right fit over time. In a cut environment, that luxury is gone. Coordinators and families are making faster, more careful decisions. They're choosing workers they can already see, already understand, already trust — before any conversation happens.
      </p>
      <p>
        If you're invisible, you're not being chosen.
      </p>
      <h2>What an InSync Profile Changes</h2>
      <p>
        An InSync Profile gives a participant everything they need to decide <em>yes, this is my person</em> before a single phone call is made.
      </p>
      <p>
        They can see how you communicate. They can hear your voice in a 15-second intro video. They can read your experience areas, your values, your availability. They can use the AAC board to ask a question without having to type or speak. They can adjust the text size, switch to high contrast, or turn on text-to-speech — because the profile was built to work for them, not just for you.
      </p>
      <p>
        That's not a small thing. That's a support worker saying: <em>I thought about you before we even met.</em>
      </p>
      <h2>In a Funding Crisis, That Signal Matters More Than Ever</h2>
      <p>
        When participants have less to spend, they spend it on workers who feel safe, known, and right. An InSync Profile doesn't just make you visible — it makes you the kind of worker a participant can confidently choose, even when they can't afford to get it wrong.
      </p>
      <p>
        The NDIS cuts are real. The pressure on participants is real. But so is the opportunity for support workers who are willing to show up differently — not with more credentials or a longer resume, but with genuine visibility and a profile that puts the participant first.
      </p>
      <blockquote>
        <p>A support worker built InSync Profiles. Because we know what it's like to be invisible — just a name on a spreadsheet handed to a stranger. That's not good enough. Not now. Not ever.</p>
      </blockquote>
      <p>
        <strong>Ready to show up differently?</strong> <a href="/pricing" style={{ color: "#f5c842" }}>View pricing →</a>
      </p>
      <div style={{ marginTop: "48px", padding: "28px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px" }}>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "16px" }}>Related Topics</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {[
            "NDIS budget cuts 2026 support workers",
            "NDIS funding cuts impact participants",
            "Support worker visibility NDIS",
            "How to stand out as an NDIS support worker",
            "NDIS participant choice support worker",
            "Digital profile NDIS worker Australia",
            "NDIS cuts what support workers can do",
            "Accessible support worker profile",
            "NDIS independent support worker tips",
            "Support worker personal brand Australia",
          ].map(tag => (
            <span key={tag} style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "99px", padding: "4px 12px", lineHeight: 1.5 }}>{tag}</span>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Article metadata registry ────────────────────────────────
const ARTICLES: Record<string, {
  title: string;
  date: string;
  readTime: string;
  category: string;
  emoji: string;
  metaDescription: string;
  content: () => React.ReactElement;
}> = {
  "lanyard-card-benefits": {
    title: "From Invisible to Unmissable: Your Lanyard Card Is a Walking Billboard That Turns Every Moment Into a Client Connection",
    date: "June 2026",
    readTime: "4 min read",
    category: "Tips & Strategy",
    emoji: "🪪",
    metaDescription: "Discover how the InSync Profiles lanyard card helps NDIS support workers go from invisible to unmissable — in the community, on errands, and at events — with a single QR code scan.",
    content: LanyardCardBenefitsArticle,
  },
  "ndis-cuts-support-workers": {
    title: "When Every Hour Counts: What the NDIS Cuts Mean for Support Workers Who Want to Be Chosen",
    date: "June 2026",
    readTime: "4 min read",
    category: "Industry Insights",
    emoji: "✊",
    metaDescription: "The 2026 NDIS budget cuts are making participants more selective. Here's why support workers with an InSync Profile are the ones being chosen — and what visibility means when funding is tight.",
    content: NdisCutsArticle,
  },
  "sea-of-sameness": {
    title: `Tearing Down the "Sea of Sameness": Why Traditional Social Media Posts Are Failing Australian Support Workers`,
    date: "May 2026",
    readTime: "5 min read",
    category: "Industry Insights",
    emoji: "🌊",
    metaDescription: "Discover why generic social media posts are failing NDIS support workers and how InSync Profiles's digital profile platform helps workers stand out in the Australian care sector.",
    content: SeaOfSamenessArticle,
  },
};

interface BlogPostProps {
  slug?: string;
}

export default function BlogPost({ slug = "sea-of-sameness" }: BlogPostProps) {
  const article = ARTICLES[slug];

  if (!article) {
    return (
      <div style={{ minHeight: "100vh", background: C.bgPage, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', sans-serif" }}>
        <div style={{ textAlign: "center", color: C.textBody }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📄</div>
          <h1 style={{ color: C.textHead, marginBottom: "12px" }}>Article not found</h1>
          <Link href="/blog"><span style={{ color: C.gold, cursor: "pointer" }}>← Back to Blog</span></Link>
        </div>
      </div>
    );
  }

  const ArticleContent = article.content;

  return (
    <div style={{ minHeight: "100vh", background: C.bgPage, fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Outfit:wght@400;500;600;700;800&display=swap');
        .article-body h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(22px, 3vw, 30px);
          font-weight: 700;
          color: ${C.textHead};
          margin: 40px 0 16px;
          line-height: 1.25;
        }
        .article-body h3 {
          font-family: 'Outfit', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: ${C.gold};
          margin: 28px 0 12px;
        }
        .article-body p {
          font-size: 17px;
          color: ${C.textBody};
          line-height: 1.85;
          margin: 0 0 20px;
        }
        .article-body blockquote {
          border-left: 3px solid ${C.gold};
          margin: 24px 0;
          padding: 16px 24px;
          background: rgba(245,200,66,0.06);
          border-radius: 0 12px 12px 0;
        }
        .article-body blockquote p {
          font-style: italic;
          color: rgba(255,255,255,0.65);
          margin: 0 0 8px;
          font-size: 16px;
        }
        .article-body blockquote p:last-child { margin: 0; }
        .article-body ul {
          margin: 0 0 24px;
          padding-left: 0;
          list-style: none;
        }
        .article-body ul li {
          font-size: 16px;
          color: ${C.textBody};
          line-height: 1.75;
          margin-bottom: 14px;
          padding-left: 20px;
          position: relative;
        }
        .article-body ul li::before {
          content: '✦';
          position: absolute;
          left: 0;
          color: ${C.gold};
          font-size: 10px;
          top: 6px;
        }
        .article-body strong { color: ${C.textHead}; }
        .article-body a { color: ${C.gold}; text-decoration: underline; }
      `}</style>

      {/* Article header */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "130px 24px 0" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px", fontSize: "13px", color: C.textDim }}>
          <Link href="/"><span style={{ color: C.textDim, cursor: "pointer", textDecoration: "none" }}>Home</span></Link>
          <span>›</span>
          <Link href="/blog"><span style={{ color: C.textDim, cursor: "pointer", textDecoration: "none" }}>Blog</span></Link>
          <span>›</span>
          <span style={{ color: C.textBody }}>Article</span>
        </div>

        {/* Category + meta */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "28px" }}>{article.emoji}</span>
          <span style={{ background: `rgba(45,212,191,0.12)`, border: `1px solid rgba(45,212,191,0.3)`, borderRadius: "99px", padding: "3px 12px", fontSize: "11px", fontWeight: 700, color: C.teal, letterSpacing: "0.06em", textTransform: "uppercase" }}>{article.category}</span>
          <span style={{ fontSize: "13px", color: C.textDim }}>{article.date} · {article.readTime}</span>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 700, color: C.textHead, margin: "0 0 32px", lineHeight: 1.15 }}>
          {article.title}
        </h1>

        {/* Divider */}
        <div style={{ height: "1px", background: `linear-gradient(90deg, ${C.gold} 0%, transparent 100%)`, marginBottom: "40px", opacity: 0.4 }} />
      </div>

      {/* Article body */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 24px 100px" }}>
        <div className="article-body">
          <ArticleContent />
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: C.border, margin: "60px 0 48px" }} />

        {/* CTA */}
        <div style={{ textAlign: "center", padding: "48px 32px", background: `rgba(245,200,66,0.06)`, border: `1px solid ${C.borderGold}`, borderRadius: "20px", marginBottom: "48px" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>💼</div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 700, color: C.textHead, margin: "0 0 12px" }}>Ready to stand out?</h3>
          <p style={{ fontSize: "15px", color: C.textBody, margin: "0 0 24px", lineHeight: 1.7 }}>
            Build your InSync Profiles profile and stop being invisible in the support sector.
          </p>
          <Link href="/pricing">
            <button style={{ padding: "14px 36px", borderRadius: "99px", background: `linear-gradient(135deg, #f5c842 0%, #e6a817 100%)`, border: "none", color: "#0d1b2a", fontFamily: "'Outfit', sans-serif", fontSize: "15px", fontWeight: 800, cursor: "pointer", letterSpacing: "0.02em" }}>
              Get Started →
            </button>
          </Link>
        </div>

        {/* Back to blog */}
        <div style={{ textAlign: "center" }}>
          <Link href="/blog">
            <span style={{ color: C.gold, fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to all articles
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
