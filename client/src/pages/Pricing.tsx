/* ============================================================
   Pricing.tsx — Purchase & Pricing Page
   Design: Aurora — Immersive Depth (Northern Lights + Frosted Glass)
   Fonts: Cormorant Garamond (display) + Outfit (body)
   ============================================================ */
import { useState } from "react";
import { Link } from "wouter";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import { useColorTheme } from "@/contexts/ColorThemeContext";

// ── PayPal IPN-compatible payment config ─────────────────────
const PAYPAL_BUSINESS = "insyncprofiles@gmail.com";
const PAYPAL_NOTIFY_URL = "https://insyncprofiles.net/generate-key";
const PAYPAL_RETURN_URL = "https://insyncprofiles.net/pricing?success=1";
const PAYPAL_CANCEL_URL = "https://insyncprofiles.net/pricing";

const PURCHASE_AMOUNTS: Record<string, string> = {
  starter: "25.00",
  professional: "105.00",
  bundle: "195.00",
};

const PURCHASE_NAMES: Record<string, string> = {
  starter: "InSync Profiles — Solo (1 user)",
  professional: "InSync Profiles — Team (5 users)",
  bundle: "InSync Profiles — Team Bundle (10 users)",
};

// PayPal Buy Now form button — triggers IPN on payment completion
function PayPalButton({ tierId, label, btnBg, btnColor, btnBorder, disabled, highlight }: {
  tierId: string; label: string; btnBg: string; btnColor: string;
  btnBorder: string; disabled: boolean; highlight: boolean;
}) {
  return (
    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
      <input type="hidden" name="cmd" value="_xclick" />
      <input type="hidden" name="business" value={PAYPAL_BUSINESS} />
      <input type="hidden" name="item_name" value={PURCHASE_NAMES[tierId] || tierId} />
      <input type="hidden" name="amount" value={PURCHASE_AMOUNTS[tierId] || "0"} />
      <input type="hidden" name="currency_code" value="AUD" />
      <input type="hidden" name="notify_url" value={PAYPAL_NOTIFY_URL} />
      <input type="hidden" name="return" value={PAYPAL_RETURN_URL} />
      <input type="hidden" name="cancel_return" value={PAYPAL_CANCEL_URL} />
      <input type="hidden" name="no_shipping" value="1" />
      <input type="hidden" name="no_note" value="1" />
      <input type="hidden" name="rm" value="2" />
      <button
        type={disabled ? "button" : "submit"}
        disabled={disabled}
        style={{
          display: "block", width: "100%",
          textAlign: "center",
          padding: "13px 20px",
          borderRadius: "12px",
          fontSize: "14px",
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 700,
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 160ms ease-out",
          background: disabled ? "rgba(26,58,107,0.12)" : btnBg,
          color: disabled ? "rgba(26,58,107,0.35)" : btnColor,
          border: btnBorder,
          boxShadow: !disabled && highlight ? "0 4px 20px rgba(247,224,138,0.35)" : "none",
        }}
        aria-label={label}
        aria-disabled={disabled}
      >
        {label}
      </button>
    </form>
  );
}

// Fixed palette — always readable on the light blue-gold gradient background
const GOLD = "#b07d0a";          // dark gold — readable on light bg
const TEXT_HEAD = "#0f2336";      // near-black navy
const TEXT_BODY = "#1e3a52";      // dark navy
const TEXT_MID  = "#2d5a7a";      // medium navy-blue
const TEXT_DIM  = "#5a7a9a";      // muted blue-grey
const CARD_BG   = "rgba(255,255,255,0.70)";
const CARD_BG2  = "rgba(255,255,255,0.55)";
const BORDER    = "rgba(100,160,220,0.30)";
const ACCENT_BLUE = "#1a4a8a";    // deep blue for links/accents

// Legacy aliases kept for helper components
const TEXT_LIGHT = TEXT_HEAD;
const NAVY_CARD  = CARD_BG;
const NAVY_CARD2 = CARD_BG2;

// ── Pricing tiers ─────────────────────────────────────────────
const TIERS = [
  {
    id: "starter",
    name: "Solo",
    emoji: "🌱",
    price: "25",
    priceNote: "AUD · one-time · 1 user",
    tagline: "Perfect for individual support workers",
    highlight: false,
    features: [
      "1 support worker profile",
      "Editable social media post template",
      "Profile photo upload (Cloudinary hosted)",
      "All service circles (fully editable)",
      "YouTube / Vimeo intro video embed",
      "Shareable personalised profile URL",
      "Full accessibility toolbar",
      "How I Show Up communication style section",
      "46-item experience checklist (7 categories)",
      "Full professional credentials (self-reported)",
      "Text-to-speech & hover-to-speak",
      "Dyslexia-friendly font mode",
      "AAC communication board",
      "WCAG 2.1 AA accessible",
      "Mobile responsive",
    ],
    notIncluded: [
      "Multi-user licence",
      "Agency branding option",
      "Priority support",
    ],
  },
  {
    id: "professional",
    name: "Team",
    emoji: "⭐",
    price: "105",
    priceNote: "AUD · one-time · up to 5 users",
    tagline: "For small teams & support coordinators",
    highlight: true,
    features: [
      "Up to 5 support worker profiles",
      "Everything in Solo",
      "Auto-generated caption with hashtags",
      "Priority email support",
    ],
    notIncluded: [],
  },
  {
    id: "bundle",
    name: "Team (10 users)",
    emoji: "🏢",
    price: "195",
    priceNote: "AUD · one-time · up to 10 users",
    tagline: "For support agencies & large coordinators",
    highlight: false,
    features: [
      "Up to 10 support worker profiles",
      "Everything in Team (5 users)",
      "Agency logo / branding option",
      "Priority email support",
    ],
    notIncluded: [],
  },
];

// ── Feature comparison rows ───────────────────────────────────
// Each row shows what's included per tier for shareable/variant options
const COMPARISON_ROWS = [
  {
    category: "Profile & Sharing",
    label: "Shareable profile URL",
    starter: "1 unique link",
    professional: "Up to 5 unique links",
    bundle: "Up to 10 unique links",
  },
  {
    category: "Profile & Sharing",
    label: "Profile photo",
    starter: "1 photo",
    professional: "1 photo per worker",
    bundle: "1 photo per worker",
  },
  {
    category: "Profile & Sharing",
    label: "Intro video",
    starter: "1 YouTube/Vimeo embed",
    professional: "1 embed per worker",
    bundle: "1 embed per worker",
  },

  {
    category: "Profile & Sharing",
    label: "Agency branding",
    starter: false,
    professional: false,
    bundle: "Logo + branding",
  },
  {
    category: "Content Sections",
    label: "Service circles",
    starter: "6 editable",
    professional: "6 editable per worker",
    bundle: "6 editable per worker",
  },
  {
    category: "Content Sections",
    label: "Experience checklist",
    starter: "46 items · 7 categories",
    professional: "46 items · 7 categories",
    bundle: "46 items · 7 categories",
  },
  {
    category: "Content Sections",
    label: "How I Show Up section",
    starter: true,
    professional: true,
    bundle: true,
  },
  {
    category: "Content Sections",
    label: "Professional Credentials (Self-Reported)",
    starter: "Full credential set",
    professional: "Full credential set",
    bundle: "Full credential set",
  },
  {
    category: "Content Sections",
    label: "Availability schedule",
    starter: "Days + 24hr time slots",
    professional: "Days + 24hr time slots",
    bundle: "Days + 24hr time slots",
  },
  {
    category: "Accessibility",
    label: "Accessibility toolbar",
    starter: "Full toolbar",
    professional: "Full toolbar",
    bundle: "Full toolbar",
  },
  {
    category: "Accessibility",
    label: "Text-to-speech & hover-to-speak",
    starter: true,
    professional: true,
    bundle: true,
  },
  {
    category: "Accessibility",
    label: "Dyslexia-friendly font",
    starter: true,
    professional: true,
    bundle: true,
  },
  {
    category: "Accessibility",
    label: "AAC communication board",
    starter: true,
    professional: true,
    bundle: true,
  },
  {
    category: "Support",
    label: "Number of users",
    starter: "1 worker",
    professional: "Up to 5 workers",
    bundle: "Up to 10 workers",
  },
  {
    category: "Support",
    label: "Email support",
    starter: "Standard",
    professional: "Priority",
    bundle: "Priority",
  },
];

// ── Testimonials ──────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Sarah M.",
    role: "NDIS Support Worker · Melbourne",
    quote: "I set up my profile in under 10 minutes and had three new enquiries the same week. The AAC board is a game-changer for my clients who use alternative communication.",
    stars: 5,
  },
  {
    name: "James T.",
    role: "Support Coordinator · Brisbane",
    quote: "I recommend this template to every support worker I work with. It's professional, accessible, and the shareable link means I can send client profiles directly to families.",
    stars: 5,
  },
  {
    name: "Priya K.",
    role: "Disability Support Worker · Sydney",
    quote: "As someone who works with elderly clients, the large text and high contrast mode means my clients can actually read and interact with my profile themselves.",
    stars: 5,
  },
];

// ── FAQ ───────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: "Do I need any technical skills to use this?",
    a: "None at all. You fill in your details in the editor panel, the post preview updates live, and you copy the caption to paste into Instagram or Facebook. No coding, no design software.",
  },
  {
    q: "Can I use this on Instagram and Facebook?",
    a: "Yes. Screenshot the post preview and upload it as an image post on Instagram or Facebook. Paste the auto-generated caption below it. For Instagram Stories, add a link sticker pointing to your shareable profile URL so clients can tap through to the full interactive version.",
  },
  {
    q: "What is the AAC Communication Board?",
    a: "AAC stands for Augmentative and Alternative Communication. The board is a full-screen, high-contrast grid of large emoji tiles that clients can tap to communicate their support needs. Each tile speaks aloud in Australian English. It's designed for clients who are non-verbal, use eye gaze, switch access, or simply prefer visual communication.",
  },
  {
    q: "Can clients interact with the post on social media?",
    a: "Social media posts are static images — clients can't tap circles inside a photo. The interactivity happens when clients open your shareable profile URL (which you put in your Instagram bio or Story link sticker). On that page, they can tap service circles, use the AAC board, and tap contact buttons directly.",
  },
  {
    q: "What happens after I purchase?",
    a: "You receive a link to your personal copy of the template. Open it in any browser, fill in your details, upload your photo and video, then copy your shareable profile link. No installation, no app download.",
  },
  {
    q: "Can I make changes after I've set it up?",
    a: "Yes — your profile link always reflects your latest saved details. Come back any time to update your bio, add new services, or change your contact details. The shareable URL updates automatically.",
  },
  {
    q: "Is this template NDIS compliant?",
    a: "The template is designed to meet WCAG 2.1 AA accessibility standards, which aligns with NDIS quality and safeguarding requirements around accessible communication. It is not a substitute for formal NDIS registration.",
  },
  {
    q: "Can I get a refund?",
    a: "Due to the digital nature of this product, refunds are not available once the template has been accessed. Please review the demo carefully before purchasing.",
  },
];

// ── Helper components ─────────────────────────────────────────
function CheckIcon({ color = "#c9a84c" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="oklch(0.45 0.04 155)" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24"           fill={i < count ? "#b07d0a" : "#c8d8e8"} aria-hidden="true">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderBottom: `1px solid rgba(26,74,138,0.18)`,
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left py-4 flex items-center justify-between gap-4 transition-colors duration-150"
        style={{ background: "transparent", border: "none", cursor: "pointer" }}
        aria-expanded={open}
      >
        <span style={{ color: TEXT_HEAD, fontSize: "15px", fontFamily: "'Outfit', sans-serif", fontWeight: 600, lineHeight: 1.4 }}>
          {q}
        </span>
        <span
          style={{
            color: GOLD,
            fontSize: "20px",
            lineHeight: 1,
            flexShrink: 0,
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 200ms ease-out",
            display: "inline-block",
          }}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      {open && (
        <p style={{ color: TEXT_BODY, fontSize: "14px", fontFamily: "'Outfit', sans-serif", lineHeight: 1.7, paddingBottom: "16px", margin: 0 }}>
          {a}
        </p>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function Pricing() {
  useColorTheme(); // keep context alive for nav bar
  // Pricing is always light — hardcoded for consistent readability
  const ACCENT = "#2563eb";
  const ACCENT_TEXT = "#ffffff";
  const TEXT_MID = "#2a3a4a";
  const TEXT_DIM = "#4a6080";
  // Per-card consent checkbox state
  const [agreed, setAgreed] = useState<Record<string, boolean>>({});
  const toggleAgreed = (id: string) => setAgreed(prev => ({ ...prev, [id]: !prev[id] }));
  return (
    <div style={{ background: "linear-gradient(160deg, #C8E6FA 0%, #e8f4ff 45%, #F7E08A 100%)", minHeight: "100vh" }}>
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <main id="main-content" style={{ paddingTop: "110px" }}>

        {/* ── HERO ── */}
        <section
          style={{ textAlign: "center", padding: "72px 24px 56px", maxWidth: "720px", margin: "0 auto" }}
          aria-labelledby="hero-heading"
        >
          <h1
            id="hero-heading"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: TEXT_HEAD, fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 700, lineHeight: 1.15, marginBottom: "20px" }}
          >
            The Support Worker<br />
            <span style={{ color: ACCENT_BLUE, fontStyle: "italic" }}>Profile Template</span>
          </h1>
          <p style={{ color: TEXT_BODY, fontSize: "clamp(15px, 2.5vw, 18px)", fontFamily: "'Outfit', sans-serif", lineHeight: 1.7, marginBottom: "32px", maxWidth: "560px", margin: "0 auto 32px" }}>
            A fully editable, accessibility-first social media profile for support workers. Designed for NDIS, aged care, and disability support — with a shareable profile link, YouTube intro video, and How I Show Up communication style section built in.
          </p>

          {/* Social proof bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", flexWrap: "wrap", marginBottom: "40px" }}>
            {[
      { icon: "⭐", text: "5.0 rating" },
            { icon: "✦", text: "WCAG 2.1 AA" },
            { icon: "🇦🇺", text: "Made in Australia" },
            { icon: "🔒", text: "One-time payment · Pay via PayPal" },
            ].map(item => (
              <div key={item.text} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "14px" }} aria-hidden="true">{item.icon}</span>
                <span style={{ color: TEXT_MID, fontSize: "13px", fontFamily: "'Outfit', sans-serif" }}>{item.text}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="#pricing"
              style={{
                background: ACCENT_BLUE, color: "#ffffff",
                padding: "14px 32px", borderRadius: "99px",
                fontSize: "15px", fontFamily: "'Outfit', sans-serif", fontWeight: 700,
                textDecoration: "none", display: "inline-block",
                boxShadow: `0 4px 24px rgba(26,74,138,0.35)`,
                transition: "transform 160ms ease-out",
              }}
            >
              See Pricing →
            </a>
            <Link
              href="/demo"
              style={{
                background: "transparent", color: ACCENT_BLUE,
                padding: "14px 32px", borderRadius: "99px",
                fontSize: "15px", fontFamily: "'Outfit', sans-serif", fontWeight: 600,
                textDecoration: "none", display: "inline-block",
                border: `1.5px solid rgba(26,74,138,0.50)`,
              }}
            >
              Try the Demo
            </Link>
          </div>
        </section>

        {/* ── PRICING CARDS ── */}
        <section
          id="pricing"
          style={{ padding: "64px 24px", maxWidth: "1100px", margin: "0 auto" }}
          aria-labelledby="pricing-heading"
        >
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2
              id="pricing-heading"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: TEXT_HEAD, fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700, marginBottom: "12px" }}
          >
            Simple, One-Time Pricing
          </h2>
          <p style={{ color: TEXT_BODY, fontSize: "15px", fontFamily: "'Outfit', sans-serif" }}>
              No subscriptions. No hidden fees. Pay once, use forever.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
              gap: "20px",
              alignItems: "start",
            }}
            role="list"
            aria-label="Pricing plans"
          >
            {TIERS.map(tier => (
              <div
                key={tier.id}
                role="listitem"
                style={{
                  background: tier.highlight
                    ? "linear-gradient(160deg, #1a3a6b 0%, #1e5fa8 60%, #2d7dd2 100%)"
                    : tier.id === "bundle"
                    ? "linear-gradient(160deg, #3d2a00 0%, #7a5200 60%, #b87a00 100%)"
                    : "linear-gradient(160deg, #f0f7ff 0%, #dbeafe 60%, #bfdbfe 100%)",
                  border: tier.highlight
                    ? `2px solid ${GOLD}`
                    : tier.id === "bundle"
                    ? `2px solid rgba(247,224,138,0.6)`
                    : `2px solid rgba(100,160,220,0.5)`,
                  borderRadius: "20px",
                  padding: "32px 28px",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: tier.highlight
                    ? `0 8px 40px rgba(26,58,107,0.35), 0 0 0 1px rgba(247,224,138,0.2)`
                    : tier.id === "bundle"
                    ? `0 8px 32px rgba(61,42,0,0.30)`
                    : `0 4px 24px rgba(100,160,220,0.18)`,
                }}
              >
                {tier.highlight && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-14px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: ACCENT,
                      color: ACCENT_TEXT,
                      fontSize: "11px",
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      padding: "4px 16px",
                      borderRadius: "99px",
                      whiteSpace: "nowrap",
                    }}
                    aria-label="Most popular plan"
                  >
                    ⭐ MOST POPULAR
                  </div>
                )}

                {/* Per-card text colours: Solo = dark blue on light, Team = white on dark blue, Bundle = white on gold-brown */}
                {(() => {
                  const isDark = tier.highlight || tier.id === "bundle";
                  const headingColor = isDark ? "#ffffff" : "#1a2e4a";
                  const bodyColor = isDark ? "rgba(255,255,255,0.82)" : "#2d4a6b";
                  const dimColor = isDark ? "rgba(255,255,255,0.55)" : "#5a7a9a";
                  const priceColor = tier.highlight ? GOLD : tier.id === "bundle" ? "#fde68a" : "#1a3a6b";
                  const btnBg = tier.highlight ? GOLD : tier.id === "bundle" ? "#7a5200" : "#1a3a6b";
                  // Gold bg (#b07d0a) needs dark text; dark blue and dark brown need white
                  const btnColor = tier.highlight ? "#1a2e4a" : "#ffffff";
                  const btnBorder = "none";
                  const checkColor = isDark ? "#86efac" : "#1a6b3a";
                  return (
                    <>
                      <div style={{ marginBottom: "20px" }}>
                        <span style={{ fontSize: "28px" }} aria-hidden="true">{tier.emoji}</span>
                        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: headingColor, fontSize: "22px", fontWeight: 700, margin: "8px 0 4px" }}>
                          {tier.name}
                        </h3>
                        <p style={{ color: dimColor, fontSize: "13px", fontFamily: "'Outfit', sans-serif", margin: "0 0 16px" }}>
                          {tier.tagline}
                        </p>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                          <span style={{ color: priceColor, fontSize: "42px", fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, lineHeight: 1 }}>
                            ${tier.price}
                          </span>
                          <span style={{ color: dimColor, fontSize: "13px", fontFamily: "'Outfit', sans-serif" }}>
                            {tier.priceNote}
                          </span>
                        </div>
                        {tier.id !== "starter" && (
                          <p style={{
                            display: "inline-block",
                            marginTop: "8px",
                            padding: "3px 10px",
                            borderRadius: "99px",
                            background: isDark ? "rgba(255,255,255,0.12)" : "rgba(26,58,107,0.10)",
                            border: `1px solid ${isDark ? "rgba(255,255,255,0.25)" : "rgba(26,58,107,0.25)"}`,
                            color: isDark ? "rgba(255,255,255,0.85)" : "#1a3a6b",
                            fontSize: "12px",
                            fontFamily: "'Outfit', sans-serif",
                            fontWeight: 600,
                          }}>
                            = {tier.id === "professional" ? "$21" : "$19.50"}/user
                          </p>
                        )}
                      </div>

                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px", flex: 1 }}>
                        {tier.features.map(f => (
                          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                            <span style={{ flexShrink: 0, marginTop: "1px" }}><CheckIcon color={checkColor} /></span>
                            <span style={{ color: bodyColor, fontSize: "13px", fontFamily: "'Outfit', sans-serif", lineHeight: 1.5 }}>{f}</span>
                          </li>
                        ))}
                        {tier.notIncluded.map(f => (
                          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "10px", opacity: 0.5 }}>
                            <span style={{ flexShrink: 0, marginTop: "2px" }}><CrossIcon /></span>
                            <span style={{ color: dimColor, fontSize: "13px", fontFamily: "'Outfit', sans-serif", lineHeight: 1.5 }}>{f}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Consent checkbox */}
                      <label
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "10px",
                          marginBottom: "14px",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={!!agreed[tier.id]}
                          onChange={() => toggleAgreed(tier.id)}
                          aria-label={`I agree to the Terms of Sale for the ${tier.name} plan`}
                          style={{
                            width: "16px",
                            height: "16px",
                            flexShrink: 0,
                            marginTop: "2px",
                            accentColor: isDark ? "#86efac" : "#1a6b3a",
                            cursor: "pointer",
                          }}
                        />
                        <span style={{ color: bodyColor, fontSize: "12px", fontFamily: "'Outfit', sans-serif", lineHeight: 1.5 }}>
                          I have read and agree to the{" "}
                          <a href="/privacy#terms" style={{ color: isDark ? "#86efac" : "#1a6b3a", textDecoration: "underline" }}>Terms of Sale</a>
                          {" "}— all sales are final once the licence key is issued.
                        </span>
                      </label>

                      {/* Buy button — disabled until checkbox ticked */}
                      <PayPalButton
                        tierId={tier.id}
                        label={agreed[tier.id] ? `Get ${tier.name} — $${tier.price} AUD` : `Agree to Terms to Continue`}
                        btnBg={agreed[tier.id] ? btnBg : (isDark ? "rgba(255,255,255,0.12)" : "rgba(26,58,107,0.12)")}
                        btnColor={agreed[tier.id] ? btnColor : (isDark ? "rgba(255,255,255,0.35)" : "rgba(26,58,107,0.35)")}
                        btnBorder={btnBorder}
                        disabled={!agreed[tier.id]}
                        highlight={tier.highlight}
                      />
                    </>
                  );
                })()}
              </div>
            ))}
          </div>

          <p style={{ textAlign: "center", color: TEXT_DIM, fontSize: "12px", fontFamily: "'Outfit', sans-serif", marginTop: "24px" }}>
            All prices in AUD · Secure checkout via PayPal
          </p>

          {/* ── PERSONAL USE LICENCE REMINDER ── */}
          <div
            style={{
              marginTop: "20px",
              background: "rgba(192,57,43,0.06)",
              border: "1.5px solid rgba(192,57,43,0.30)",
              borderRadius: "12px",
              padding: "14px 20px",
              maxWidth: "680px",
              marginLeft: "auto",
              marginRight: "auto",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
            }}
            role="note"
            aria-label="Licence terms notice"
          >
            <span style={{ fontSize: "18px", flexShrink: 0, lineHeight: 1.4 }} aria-hidden="true">⛔</span>
            <p style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontSize: "13px", color: "#c0392b", lineHeight: 1.7 }}>
              <strong>Personal use licence only — reselling is strictly prohibited.</strong> This template is licensed for your own professional profile. It may not be on-sold, redistributed, gifted to third parties, or commercially exploited in any form. See our{" "}
              <a href="/privacy" style={{ color: "#c0392b", fontWeight: 700, textDecoration: "underline" }}>Terms &amp; Conditions</a>{" "}
              for full licence terms.
            </p>
          </div>

          {/* ── WHAT HAPPENS AFTER PURCHASE ── */}
          <div
            style={{
              marginTop: "40px",
              background: "rgba(255,255,255,0.85)",
              border: "1.5px solid rgba(100,160,220,0.25)",
              borderRadius: "16px",
              padding: "32px 36px",
              maxWidth: "680px",
              marginLeft: "auto",
              marginRight: "auto",
              boxShadow: "0 4px 24px rgba(100,160,220,0.10)",
            }}
            role="note"
            aria-label="What happens after purchase"
          >
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: TEXT_HEAD, fontSize: "22px", fontWeight: 700, marginBottom: "16px", textAlign: "center" }}>
              What happens after purchase?
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <span style={{ fontSize: "20px", flexShrink: 0, marginTop: "2px" }}>🔑</span>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "15px", color: TEXT_BODY, lineHeight: 1.65, margin: 0 }}>
                  <strong style={{ color: TEXT_HEAD }}>You'll receive your licence key.</strong> Once payment is confirmed, you'll receive a licence key to activate your InSync Profiles profile editor.
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <span style={{ fontSize: "20px", flexShrink: 0, marginTop: "2px" }}>🚀</span>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "15px", color: TEXT_BODY, lineHeight: 1.65, margin: 0 }}>
                  <strong style={{ color: TEXT_HEAD }}>Activate and start building.</strong> Enter your key at insyncprofiles.net/editor — your profile editor unlocks instantly. No downloads, no installs.
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <span style={{ fontSize: "20px", flexShrink: 0, marginTop: "2px" }}>❓</span>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "15px", color: TEXT_BODY, lineHeight: 1.65, margin: 0 }}>
                  <strong style={{ color: TEXT_HEAD }}>Need help?</strong> Contact us at <span style={{ color: ACCENT_BLUE }}>insyncprofiles@gmail.com</span> and we'll sort it out.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURE COMPARISON TABLE ── */}
        <section
          style={{ padding: "48px 24px 64px", maxWidth: "900px", margin: "0 auto" }}
          aria-labelledby="comparison-heading"
        >
          <h2
            id="comparison-heading"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: TEXT_HEAD, fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 700, textAlign: "center", marginBottom: "32px" }}
          >
            Full Feature Comparison
          </h2>

          <div style={{ overflowX: "auto", borderRadius: "16px", border: "2px solid rgba(100,160,220,0.35)", background: "rgba(255,255,255,0.92)", boxShadow: "0 4px 32px rgba(100,160,220,0.12)" }}>
            <table
              style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Outfit', sans-serif" }}
              aria-label="Feature comparison between Solo, Team, and Team 10 plans"
            >
              <thead>
                <tr style={{ background: "linear-gradient(135deg, #1a3a6b 0%, #2563a8 100%)", borderBottom: "2px solid rgba(247,224,138,0.5)" }}>
                  <th scope="col" style={{ padding: "18px 20px", textAlign: "left", color: "rgba(255,255,255,0.75)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", minWidth: "160px" }}>
                    What you get
                  </th>
                  {TIERS.map(t => (
                    <th key={t.id} scope="col" style={{ padding: "18px 20px", textAlign: "center", color: t.highlight ? GOLD : "rgba(255,255,255,0.90)", fontSize: "14px", fontWeight: 700, minWidth: "140px", borderLeft: "1px solid rgba(255,255,255,0.12)" }}>
                      <div>{t.emoji} {t.name}</div>
                      <div style={{ fontSize: "12px", fontWeight: 500, color: t.highlight ? GOLD : "rgba(255,255,255,0.60)", marginTop: "3px" }}>${t.price} AUD</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const categories = Array.from(new Set(COMPARISON_ROWS.map(r => r.category)));
                  return categories.flatMap((cat, ci) => [
                    // Category header row
                    <tr key={`cat-${cat}`} style={{ background: "linear-gradient(90deg, #dbeafe 0%, #fef9c3 100%)", borderTop: ci > 0 ? "2px solid rgba(100,160,220,0.25)" : undefined }}>
                      <td colSpan={4} style={{ padding: "10px 20px", color: "#1a3a6b", fontSize: "11px", fontWeight: 800, letterSpacing: "0.10em", textTransform: "uppercase" }}>
                        {cat}
                      </td>
                    </tr>,
                    // Data rows for this category
                    ...COMPARISON_ROWS.filter(r => r.category === cat).map((row, i) => (
                      <tr key={row.label} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.95)" : "rgba(240,248,255,0.80)", borderBottom: "1px solid rgba(100,160,220,0.15)" }}>
                        <td style={{ padding: "13px 20px", color: "#1a2e4a", fontSize: "13px", fontWeight: 500 }}>{row.label}</td>
                        {(["starter", "professional", "bundle"] as const).map((key, ki) => {
                          const val = row[key];
                          return (
                            <td key={key} style={{ padding: "13px 20px", textAlign: "center", borderLeft: "1px solid rgba(100,160,220,0.12)" }}>
                              {val === true ? (
                                <span style={{ display: "inline-flex", justifyContent: "center" }}><CheckIcon color="#1a6b3a" /></span>
                              ) : val === false ? (
                                <span style={{ display: "inline-flex", justifyContent: "center" }}><CrossIcon /></span>
                              ) : (
                                <span style={{ color: ki === 1 ? "#1a3a6b" : ki === 2 ? "#6b4a00" : "#2d5a27", fontSize: "12px", fontWeight: 600, lineHeight: 1.4 }}>{val}</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    )),
                  ]);
                })()}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section
          style={{ padding: "48px 24px", maxWidth: "1000px", margin: "0 auto" }}
          aria-labelledby="testimonials-heading"
        >
          <h2
            id="testimonials-heading"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: TEXT_HEAD, fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 700, textAlign: "center", marginBottom: "36px" }}
          >
            What Support Workers Say
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
              gap: "20px",
            }}
          >
            {TESTIMONIALS.map(t => (
              <blockquote
                key={t.name}
              style={{
                background: CARD_BG,
                border: `1.5px solid ${BORDER}`,
                borderRadius: "16px",
                padding: "24px",
                margin: 0,
              }}
            >
              <StarRow count={t.stars} />
              <p style={{ color: TEXT_BODY, fontSize: "14px", fontFamily: "'Outfit', sans-serif", lineHeight: 1.7, margin: "12px 0 16px", fontStyle: "italic" }}>
                "{t.quote}"
              </p>
              <footer>
                <cite style={{ fontStyle: "normal" }}>
                  <p style={{ color: TEXT_HEAD, fontSize: "13px", fontFamily: "'Outfit', sans-serif", fontWeight: 600, margin: "0 0 2px" }}>{t.name}</p>
                  <p style={{ color: TEXT_DIM, fontSize: "12px", fontFamily: "'Outfit', sans-serif", margin: 0 }}>{t.role}</p>
                  </cite>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section
          style={{ padding: "48px 24px 64px", maxWidth: "720px", margin: "0 auto" }}
          aria-labelledby="faq-heading"
        >
          <h2
            id="faq-heading"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: TEXT_HEAD, fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: 700, textAlign: "center", marginBottom: "36px" }}
          >
            Frequently Asked Questions
          </h2>
          <div>
            {FAQ_ITEMS.map(item => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section
          style={{
            padding: "64px 24px",
            textAlign: "center",
            background: CARD_BG,
            borderTop: `1px solid ${BORDER}`,
          }}
          aria-labelledby="cta-heading"
        >
          <h2
            id="cta-heading"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: TEXT_HEAD, fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 700, marginBottom: "16px" }}
          >
            Ready to Stand Out?
          </h2>
          <p style={{ color: TEXT_BODY, fontSize: "16px", fontFamily: "'Outfit', sans-serif", marginBottom: "32px", maxWidth: "480px", margin: "0 auto 32px" }}>
            Join support workers across Australia who are connecting with clients through accessible, professional profiles.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "16px" }}>
            {/* Solo */}
            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
              <input type="hidden" name="cmd" value="_xclick" />
              <input type="hidden" name="business" value={PAYPAL_BUSINESS} />
              <input type="hidden" name="item_name" value={PURCHASE_NAMES.starter} />
              <input type="hidden" name="amount" value={PURCHASE_AMOUNTS.starter} />
              <input type="hidden" name="currency_code" value="AUD" />
              <input type="hidden" name="notify_url" value={PAYPAL_NOTIFY_URL} />
              <input type="hidden" name="return" value={PAYPAL_RETURN_URL} />
              <input type="hidden" name="cancel_return" value={PAYPAL_CANCEL_URL} />
              <input type="hidden" name="no_shipping" value="1" />
              <input type="hidden" name="no_note" value="1" />
              <input type="hidden" name="rm" value="2" />
              <button type="submit" style={{ display: "flex", alignItems: "center", gap: "8px", background: "#ffffff", color: "#1a3a6b", padding: "12px 24px", borderRadius: "10px", fontSize: "14px", fontFamily: "'Outfit', sans-serif", fontWeight: 700, border: "2px solid #1a3a6b", boxShadow: "0 2px 12px rgba(26,58,107,0.18)", cursor: "pointer" }} aria-label="Purchase the Solo plan for $25 AUD via PayPal">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 11C7 8.23858 9.23858 6 12 6H17C19.7614 6 22 8.23858 22 11C22 13.7614 19.7614 16 17 16H16" stroke="#003087" strokeWidth="2" strokeLinecap="round"/><path d="M5 13C5 10.2386 7.23858 8 10 8H15C17.7614 8 20 10.2386 20 13C20 15.7614 17.7614 18 15 18H7C4.23858 18 2 15.7614 2 13Z" fill="#009cde"/></svg>
                <span>Solo — $25 AUD</span>
              </button>
            </form>
            {/* Team */}
            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
              <input type="hidden" name="cmd" value="_xclick" />
              <input type="hidden" name="business" value={PAYPAL_BUSINESS} />
              <input type="hidden" name="item_name" value={PURCHASE_NAMES.professional} />
              <input type="hidden" name="amount" value={PURCHASE_AMOUNTS.professional} />
              <input type="hidden" name="currency_code" value="AUD" />
              <input type="hidden" name="notify_url" value={PAYPAL_NOTIFY_URL} />
              <input type="hidden" name="return" value={PAYPAL_RETURN_URL} />
              <input type="hidden" name="cancel_return" value={PAYPAL_CANCEL_URL} />
              <input type="hidden" name="no_shipping" value="1" />
              <input type="hidden" name="no_note" value="1" />
              <input type="hidden" name="rm" value="2" />
              <button type="submit" style={{ display: "flex", alignItems: "center", gap: "8px", background: "#003087", color: "#ffffff", padding: "12px 24px", borderRadius: "10px", fontSize: "14px", fontFamily: "'Outfit', sans-serif", fontWeight: 700, border: "2px solid #003087", boxShadow: "0 4px 20px rgba(0,48,135,0.40)", cursor: "pointer" }} aria-label="Purchase the Team plan for $105 AUD via PayPal">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 11C7 8.23858 9.23858 6 12 6H17C19.7614 6 22 8.23858 22 11C22 13.7614 19.7614 16 17 16H16" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/><path d="M5 13C5 10.2386 7.23858 8 10 8H15C17.7614 8 20 10.2386 20 13C20 15.7614 17.7614 18 15 18H7C4.23858 18 2 15.7614 2 13Z" fill="#009cde"/></svg>
                <span>Team — $105 AUD ⭐ Popular</span>
              </button>
            </form>
            {/* Bundle */}
            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
              <input type="hidden" name="cmd" value="_xclick" />
              <input type="hidden" name="business" value={PAYPAL_BUSINESS} />
              <input type="hidden" name="item_name" value={PURCHASE_NAMES.bundle} />
              <input type="hidden" name="amount" value={PURCHASE_AMOUNTS.bundle} />
              <input type="hidden" name="currency_code" value="AUD" />
              <input type="hidden" name="notify_url" value={PAYPAL_NOTIFY_URL} />
              <input type="hidden" name="return" value={PAYPAL_RETURN_URL} />
              <input type="hidden" name="cancel_return" value={PAYPAL_CANCEL_URL} />
              <input type="hidden" name="no_shipping" value="1" />
              <input type="hidden" name="no_note" value="1" />
              <input type="hidden" name="rm" value="2" />
              <button type="submit" style={{ display: "flex", alignItems: "center", gap: "8px", background: "#b07d0a", color: "#ffffff", padding: "12px 24px", borderRadius: "10px", fontSize: "14px", fontFamily: "'Outfit', sans-serif", fontWeight: 700, border: "2px solid #b07d0a", boxShadow: "0 4px 20px rgba(176,125,10,0.40)", cursor: "pointer" }} aria-label="Purchase the Team 10 users Bundle for $195 AUD via PayPal">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 11C7 8.23858 9.23858 6 12 6H17C19.7614 6 22 8.23858 22 11C22 13.7614 19.7614 16 17 16H16" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><path d="M5 13C5 10.2386 7.23858 8 10 8H15C17.7614 8 20 10.2386 20 13C20 15.7614 17.7614 18 15 18H7C4.23858 18 2 15.7614 2 13Z" fill="#f7e08a"/></svg>
                <span>Bundle — $195 AUD</span>
              </button>
            </form>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
            <Link
              href="/demo"
              style={{
                background: "transparent", color: ACCENT_BLUE,
                padding: "10px 28px", borderRadius: "99px",
                fontSize: "14px", fontFamily: "'Outfit', sans-serif", fontWeight: 600,
                textDecoration: "none",
                border: `1.5px solid rgba(26,74,138,0.40)`,
              }}
            >
              Try Demo First
            </Link>
          </div>
          <p style={{ color: TEXT_DIM, fontSize: "12px", fontFamily: "'Outfit', sans-serif", marginTop: "20px" }}>
            🔒 Secure checkout · One-time payment · No subscription
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: `1px solid oklch(0.72 0.14 75 / 15%)`,
          padding: "24px",
          textAlign: "center",
        }}
        role="contentinfo"
      >
        <p style={{ color: TEXT_DIM, fontSize: "12px", fontFamily: "'Outfit', sans-serif", margin: "0 0 10px" }}>
          InSync Profiles · ABN 54 116 010 622 · Accessibility &amp; Inclusion Focused · Made in Australia
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          <Link href="/how-to-use" style={{ color: ACCENT_BLUE, fontSize: "12px", fontFamily: "'Outfit', sans-serif", textDecoration: "none" }}>How to Use</Link>
          <span style={{ color: TEXT_DIM }}>·</span>
          <Link href="/scenarios" style={{ color: ACCENT_BLUE, fontSize: "12px", fontFamily: "'Outfit', sans-serif", textDecoration: "none" }}>Scenarios</Link>
          <span style={{ color: TEXT_DIM }}>·</span>
          <Link href="/privacy" style={{ color: ACCENT_BLUE, fontSize: "12px", fontFamily: "'Outfit', sans-serif", textDecoration: "none" }}>Legal &amp; Privacy</Link>
          <span style={{ color: TEXT_DIM }}>·</span>
          <Link href="/" style={{ color: ACCENT_BLUE, fontSize: "12px", fontFamily: "'Outfit', sans-serif", textDecoration: "none" }}>Try Template</Link>
        </div>
      </footer>

      <AccessibilityToolbar />
    </div>
  );
}
