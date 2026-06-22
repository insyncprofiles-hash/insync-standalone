/* ============================================================
   BlogPost.tsx — InSync Profiles Individual Blog Article Page
   Design: Matches Landing page — deep navy bg, gold accents
   Fonts: Cormorant Garamond (display) + Outfit (body)
   ============================================================ */
import React, { useEffect } from "react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";

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

// ── "Who is going to support me?" Article ─────────────────────
function WhoIsGoingToSupportMeArticle() {
  return (
    <>
      <p>
        It is one of the most important questions a person can ask. And for most NDIS participants, the answer arrives with almost no useful information.
      </p>
      <p>
        A name. A gender. A time slot. That is often all a participant receives before a stranger walks through their front door to provide intimate, personal support. In a sector built on the principle of <strong>choice and control</strong>, this information gap is not a minor inconvenience — it is a structural failure.
      </p>

      <h2>The Gap Is Real</h2>

      <div style={{ margin: "32px 0", borderRadius: "16px", overflow: "hidden" }}>
        <img
          src="/assets/informed_choice_gap_real.jpg"
          alt="The Gap Is Real — InSync Profiles infographic showing 2023 NDIS Review findings and 2026 participant voice on informed choice"
          style={{ width: "100%", display: "block", borderRadius: "16px" }}
        />
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginTop: "10px", fontStyle: "italic", textAlign: "center" }}>
          Source: NDIS Review — What We Have Heard Report (June 2023) · NDIA Supported Decision Making Advisory Group Feedback (February 2026)
        </p>
      </div>

      <p>
        The 2023 NDIS Review found that <em>"participants and their families do not have the support and information they need to find providers, compare what they are offering and make an informed choice about what will work best for them."</em> Three years later, the NDIA's own Supported Decision Making Advisory Group reported that participants were still asking for better information so they could understand what supported decision making is and how to use it.
      </p>
      <p>
        The gap between the right to choose and the information needed to choose has remained largely unchanged. That is the problem InSync Profiles was built to close.
      </p>

      <h2>What Informed Choice Actually Requires</h2>

      <div style={{ margin: "32px 0", borderRadius: "16px", overflow: "hidden" }}>
        <img
          src="/assets/informed_choice_comparison.jpg"
          alt="Which side supports informed choice? Comparison of limited information (name, gender, availability) versus rich information (communication style, interests, experience, personality, video introduction)"
          style={{ width: "100%", display: "block", borderRadius: "16px" }}
        />
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginTop: "10px", fontStyle: "italic", textAlign: "center" }}>
          Limited information leads to high uncertainty. More information leads to stronger choice.
        </p>
      </div>

      <p>
        The comparison above makes the logic plain. When a participant is given only a name, a gender, and an availability window, they are not making a choice — they are making a guess. A guess about whether this person communicates in a way that works for them. A guess about whether their approach to support aligns with how the participant wants to live. A guess about whether they will actually show up.
      </p>
      <p>
        Informed choice requires information about the person, not just the position. That means:
      </p>
      <ul>
        <li><strong>Communication style</strong> — how the worker communicates, and whether that matches the participant's needs</li>
        <li><strong>Interests and personality</strong> — the human dimension that determines whether support becomes a relationship or just a transaction</li>
        <li><strong>Experience areas</strong> — specific conditions, environments, and support types the worker has genuine experience with</li>
        <li><strong>Approach to support</strong> — their values, their boundaries, and how they handle difficult moments</li>
        <li><strong>A video introduction</strong> — because a face and a voice carry information that text never can</li>
      </ul>
      <p>
        None of this is radical. It is the same information you would want before hiring anyone to work in your home. The difference is that in the NDIS sector, this information has historically been inaccessible — not because it doesn't exist, but because there has been no standard way to share it.
      </p>

      <h2>The 2026 Reforms Are Raising the Bar</h2>

      <div style={{ margin: "32px 0", borderRadius: "16px", overflow: "hidden" }}>
        <img
          src="/assets/informed_choice_provider_banner.jpg"
          alt="Can you show how your participants choose their support worker? InSync Profiles helps providers turn 2026 reform principles into practice — supported decision making, participant engagement, transparency and choice."
          style={{ width: "100%", display: "block", borderRadius: "16px" }}
        />
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginTop: "10px", fontStyle: "italic", textAlign: "center" }}>
          2026 reforms are increasing expectations around participant engagement, supported decision-making, transparency and choice.
        </p>
      </div>

      <p>
        The NDIS Future Generations Bill 2026, introduced in June 2026, formally restructures how intermediary services operate. The direction is clear: reduce the layers between participants and their supports, and increase the expectation that participants are genuinely involved in choosing who works with them.
      </p>
      <p>
        For providers, this means the question <em>"Can you show how your participants choose their support worker?"</em> is no longer rhetorical. It is becoming a compliance expectation. Supported decision-making is a priority. Participant engagement is central to quality. Greater provider transparency and oversight are explicitly named reform outcomes.
      </p>
      <p>
        A support worker profile that contains only a name and a roster slot does not meet this standard. A profile that contains a video introduction, a communication style, a set of experience areas, and a clear statement of values — that is a tool for genuine participant choice.
      </p>

      <h2>What This Means in Practice</h2>
      <p>
        For <strong>participants and families</strong>: you have the right to know who is coming. Before you agree to a support arrangement, ask to see the worker's profile. If one doesn't exist, ask why. The reforms are on your side.
      </p>
      <p>
        For <strong>support workers</strong>: your profile is your answer to the question every participant is asking. The workers who build a clear, honest, human profile are the ones who will be chosen — not because they are the cheapest or the closest, but because they are the most knowable.
      </p>
      <p>
        For <strong>providers and coordinators</strong>: the 2026 reforms are shifting accountability toward demonstrable participant engagement. Having a system where workers maintain rich, shareable profiles is not just good practice — it is increasingly what the sector will expect of you.
      </p>

      <blockquote>
        <p>Accessible information about support workers remains largely unavailable. InSync Profiles exists to change that — one profile at a time.</p>
      </blockquote>

      <p>
        The question <em>"Who is going to support me?"</em> deserves a real answer. Not a name on a roster. A person. A profile. A choice.
      </p>

      <p>
        <a href="/view" style={{ color: "#f5c842" }}>See a sample InSync Profile →</a>
      </p>

      <div style={{ marginTop: "48px", padding: "28px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px" }}>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "16px" }}>Related Topics</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {[
            "#NDISInformedChoice",
            "#ChoiceAndControl",
            "#Inclusion",
            "#DisabilityInclusion",
            "#SupportedDecisionMaking",
            "#NDISParticipantRights",
            "#NDIS2026Reforms",
            "#SupportWorker",
            "#NDISParticipant",
            "#InclusiveSupport",
            "#NDISFutureGenerationsBill",
            "#ParticipantEngagement",
            "#InformedChoice",
            "#DisabilityRights",
            "#NDISTransparency",
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
  ogImage?: string;
  keywords?: string;
  content: () => React.ReactElement;
}> = {
  "lanyard-card-benefits": {
    title: "From Invisible to Unmissable: Your Lanyard Card Is a Walking Billboard That Turns Every Moment Into a Client Connection",
    date: "June 2026",
    readTime: "4 min read",
    category: "Tips & Strategy",
    emoji: "🪴",
    metaDescription: "Discover how the InSync Profiles lanyard card helps NDIS support workers go from invisible to unmissable — in the community, on errands, and at events — with a single QR code scan.",
    keywords: "NDIS support worker lanyard card, QR code support worker, NDIS worker marketing, support worker personal brand, NDIS independent worker tips, how to attract NDIS clients, support worker business card alternative, digital profile NDIS worker Australia",
    content: LanyardCardBenefitsArticle,
  },
  "sea-of-sameness": {
    title: `Tearing Down the "Sea of Sameness": Why Traditional Social Media Posts Are Failing Australian Support Workers`,
    date: "May 2026",
    readTime: "5 min read",
    category: "Industry Insights",
    emoji: "🌊",
    metaDescription: "Discover why generic social media posts are failing NDIS support workers and how InSync Profiles's digital profile platform helps workers stand out in the Australian care sector.",
    keywords: "NDIS support worker social media, sea of sameness disability sector, support worker digital profile Australia, NDIS worker stand out, InSync Profiles, disability support worker marketing, NDIS independent worker visibility",
    content: SeaOfSamenessArticle,
  },
  "who-is-going-to-support-me": {
    title: "Who is going to support me?",
    date: "June 2026",
    readTime: "6 min read",
    category: "Informed Choice",
    emoji: "🧭",
    metaDescription: "Informed choice is a right — not a privilege. Yet most NDIS participants are still asked to choose a support worker based on a name, a gender, and a time slot. The 2026 reforms are changing that.",
    ogImage: "https://insyncprofiles.net/assets/informed_choice_gap_real.jpg",
    keywords: "NDIS informed choice, NDIS 2026 reforms participant rights, support worker selection NDIS, supported decision making NDIS, NDIS participant choice and control, NDIS Future Generations Bill 2026, participant engagement NDIS provider, how to choose a support worker Australia, NDIS transparency reforms, disability support worker profile",
    content: WhoIsGoingToSupportMeArticle,
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

  // Dynamic SEO for this article
  useSEO({
    title: `${article.title} | InSync Profiles Blog`,
    description: article.metaDescription,
    canonical: `https://insyncprofiles.net/blog/${slug}`,
  });

  // Inject OG image and keywords dynamically
  useEffect(() => {
    const ogImage = document.querySelector('meta[property="og:image"]') as HTMLMetaElement | null;
    if (ogImage) ogImage.content = article.ogImage || "https://insyncprofiles.net/assets/insync_og_default.jpg";
    const twImage = document.querySelector('meta[name="twitter:image"]') as HTMLMetaElement | null;
    if (twImage) twImage.content = article.ogImage || "https://insyncprofiles.net/assets/insync_og_default.jpg";
    // Keywords
    let kwEl = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null;
    if (!kwEl) {
      kwEl = document.createElement("meta");
      kwEl.name = "keywords";
      document.head.appendChild(kwEl);
    }
    kwEl.content = article.keywords || "NDIS support worker, InSync Profiles, disability support Australia";
    return () => {
      const ogImg = document.querySelector('meta[property="og:image"]') as HTMLMetaElement | null;
      if (ogImg) ogImg.content = "https://insyncprofiles.net/assets/insync_og_default.jpg";
    };
  }, [article]);

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
