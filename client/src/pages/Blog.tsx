/* ============================================================
   Blog.tsx — InSync Profiles Blog Index Page
   Design: Matches Landing page — deep navy bg, gold accents
   Fonts: Cormorant Garamond (display) + Outfit (body)
   ============================================================ */
import { Link } from "wouter";

const C = {
  bgPage:    "linear-gradient(160deg, #0d1b2a 0%, #0f2d3d 40%, #0a2a1e 100%)",
  bgCard:    "rgba(255,255,255,0.06)",
  bgCardHov: "rgba(255,255,255,0.10)",
  textHead:  "#ffffff",
  textBody:  "rgba(255,255,255,0.78)",
  textDim:   "rgba(255,255,255,0.45)",
  gold:      "#f5c842",
  goldDim:   "rgba(245,200,66,0.55)",
  teal:      "#2dd4bf",
  border:    "rgba(255,255,255,0.10)",
  borderGold:"rgba(245,200,66,0.30)",
};

const POSTS = [
  {
    slug: "lanyard-card-benefits",
    title: "Your Profile Goes Where You Go: The Surprising Power of the InSync Lanyard Card",
    excerpt: "A matt black card with a diagonal aurora strip and a QR code. That's it. Yet support workers wearing it are sparking conversations, attracting informed clients, and building a personal brand — without saying a word.",
    date: "June 2026",
    readTime: "4 min read",
    category: "Tips & Strategy",
    emoji: "🪪",
  },
  {
    slug: "sea-of-sameness",
    title: "Tearing Down the \"Sea of Sameness\": Why Traditional Social Media Posts Are Failing Australian Support Workers",
    excerpt: "Open any Facebook Group, LinkedIn feed, or local community board today, and you will see the exact same thing. Hundreds of support worker posts reading from the exact same script. Here's why that's a problem — and how InSync Profiles is changing the game.",
    date: "May 2026",
    readTime: "5 min read",
    category: "Industry Insights",
    emoji: "🌊",
  },
];

export default function Blog() {
  return (
    <div style={{ minHeight: "100vh", background: C.bgPage, fontFamily: "'Outfit', sans-serif" }}>
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Outfit:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Hero */}
      <div style={{ paddingTop: "130px", paddingBottom: "60px", textAlign: "center", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "inline-block", background: `rgba(245,200,66,0.12)`, border: `1px solid ${C.borderGold}`, borderRadius: "99px", padding: "6px 18px", marginBottom: "20px" }}>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "12px", fontWeight: 700, color: C.gold, letterSpacing: "0.1em", textTransform: "uppercase" }}>InSync Profiles Blog</span>
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 700, color: C.textHead, margin: "0 0 16px", lineHeight: 1.1 }}>
          Insights for the<br />
          <span style={{ color: C.gold }}>Modern Support Sector</span>
        </h1>
        <p style={{ fontSize: "17px", color: C.textBody, maxWidth: "540px", margin: "0 auto", lineHeight: 1.7 }}>
          Industry perspectives, practical guides, and ideas for support workers, NDIS participants, and families navigating the care landscape.
        </p>
      </div>

      {/* Posts grid */}
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "60px 24px 100px" }}>
        {POSTS.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <div
              style={{
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                borderRadius: "20px",
                padding: "36px",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.23,1,0.32,1)",
                marginBottom: "24px",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.background = C.bgCardHov;
                (e.currentTarget as HTMLDivElement).style.borderColor = C.borderGold;
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.background = C.bgCard;
                (e.currentTarget as HTMLDivElement).style.borderColor = C.border;
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "28px" }}>{post.emoji}</span>
                <span style={{ background: `rgba(45,212,191,0.12)`, border: `1px solid rgba(45,212,191,0.3)`, borderRadius: "99px", padding: "3px 12px", fontSize: "11px", fontWeight: 700, color: C.teal, letterSpacing: "0.06em", textTransform: "uppercase" }}>{post.category}</span>
                <span style={{ fontSize: "12px", color: C.textDim }}>{post.date} · {post.readTime}</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 700, color: C.textHead, margin: "0 0 14px", lineHeight: 1.25 }}>
                {post.title}
              </h2>
              <p style={{ fontSize: "15px", color: C.textBody, lineHeight: 1.75, margin: "0 0 24px" }}>
                {post.excerpt}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: C.gold, fontWeight: 700, fontSize: "14px" }}>
                Read article
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </Link>
        ))}

        {/* CTA */}
        <div style={{ marginTop: "60px", textAlign: "center", padding: "48px 32px", background: `rgba(45,212,191,0.06)`, border: `1px solid rgba(45,212,191,0.25)`, borderRadius: "20px" }}>
          <div style={{ fontSize: "36px", marginBottom: "16px" }}>✨</div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 700, color: C.textHead, margin: "0 0 12px" }}>See it in action</h3>
          <p style={{ fontSize: "15px", color: C.textBody, margin: "0 0 28px", lineHeight: 1.7, maxWidth: "420px", marginLeft: "auto", marginRight: "auto" }}>
            Try the interactive demo and see exactly how a InSync Profiles profile looks to clients — no sign-up required.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/demo">
              <button style={{ padding: "14px 36px", borderRadius: "99px", background: `linear-gradient(135deg, #2dd4bf 0%, #f5c842 100%)`, border: "none", color: "#0d1b2a", fontFamily: "'Outfit', sans-serif", fontSize: "15px", fontWeight: 800, cursor: "pointer", letterSpacing: "0.02em" }}>
                Try Demo →
              </button>
            </Link>
            <Link href="/pricing">
              <button style={{ padding: "14px 36px", borderRadius: "99px", background: "transparent", border: `1.5px solid rgba(245,200,66,0.5)`, color: C.gold, fontFamily: "'Outfit', sans-serif", fontSize: "15px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.02em" }}>
                View Pricing
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
