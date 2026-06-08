/**
 * Cloudflare Pages Function: /api/og-image
 * Trust-first card matching reference design:
 *   - Full-bleed photo background (left ~60%)
 *   - Location badge top-right (gold, bold)
 *   - "Looking for support that understands:" checklist right side
 *   - Large centred play button with "Tap to watch my 15 second introduction!" callout
 *   - White panel bottom: name (huge bold navy), title (purple), tagline (italic)
 */

import { ImageResponse } from "./vercel-og-bundle.js";

// Specialty labels — participant-facing language
const SPECIALTY_MAP = {
  "autism":         "Autism",
  "neurodiversity": "Neurodiversity",
  "mental-health":  "Mental Health",
  "mental":         "Mental Health",
  "psychosocial":   "Psychosocial Recovery",
  "physical":       "Physical Disability",
  "complex":        "Complex Needs",
  "intellectual":   "Intellectual Disability",
  "acquired-brain": "Acquired Brain Injury",
  "non-verbal":     "Non-Verbal Communication",
  "school-leaver":  "School Leavers",
  "aged-care":      "Aged Care",
  "dementia":       "Dementia",
  "sensory":        "Sensory Processing",
  "community":      "Community Participation",
  "daily-living":   "Daily Living",
  "personal-care":  "Personal Care",
  "transport":      "Transport",
  "social-skills":  "Social Skills",
  "therapy-assist": "Therapy Assist",
  "behaviour":      "Behaviour Support",
  "domestic":       "Domestic Assistance",
  "overnight":      "Overnight Support",
  "high-care":      "High Care",
  "emotional":      "Emotional Support",
};

async function fetchAsBase64(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0", "Accept": "image/*,*/*" },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = "";
    for (let i = 0; i < bytes.length; i += 8192) {
      const chunk = bytes.subarray(i, Math.min(i + 8192, bytes.length));
      for (let j = 0; j < chunk.length; j++) binary += String.fromCharCode(chunk[j]);
    }
    return `data:${res.headers.get("content-type") || "image/jpeg"};base64,${btoa(binary)}`;
  } catch {
    return null;
  }
}

function h(type, props, ...children) {
  const flat = children.flat(Infinity).filter(c => c !== null && c !== undefined && c !== false);
  return {
    type,
    props: {
      ...props,
      children: flat.length === 0 ? undefined : flat.length === 1 ? flat[0] : flat,
    },
  };
}

function buildCard({ name, title, location, tagline, photoDataUrl, specialties }) {
  const W = 900;
  const H = 900;

  // ── Checklist items ─────────────────────────────────────────────────────────
  const checkItems = specialties.slice(0, 5).map(label =>
    h("div", {
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        marginBottom: 4,
      },
    },
      // Gold checkmark
      h("div", {
        style: {
          color: "#F5C842",
          fontSize: 32,
          fontWeight: 900,
          lineHeight: 1.1,
          flexShrink: 0,
          marginTop: 0,
        },
      }, "\u2714"),
      h("div", {
        style: {
          fontSize: 28,
          fontWeight: 700,
          color: "#FFFFFF",
          lineHeight: 1.3,
          textShadow: "0 1px 6px rgba(0,0,0,0.8)",
        },
      }, label),
    )
  );

  return h("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      width: W,
      height: H,
      fontFamily: "sans-serif",
      position: "relative",
      background: "#111",
      overflow: "hidden",
    },
  },

    // ── FULL-BLEED PHOTO BACKGROUND ──────────────────────────────────────────
    photoDataUrl
      ? h("img", {
          src: photoDataUrl,
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            width: W,
            height: H,
            objectFit: "cover",
            objectPosition: "center top",
          },
        })
      : h("div", {
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            width: W,
            height: H,
            background: "linear-gradient(135deg, #2d1b69 0%, #11998e 100%)",
          },
        }),

    // ── DARK GRADIENT OVERLAY — right side for text readability ─────────────
    h("div", {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: W,
        height: H,
        background: "linear-gradient(to right, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.88) 100%)",
      },
    }),

    // ── BOTTOM FADE for white panel ──────────────────────────────────────────
    h("div", {
      style: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: W,
        height: 260,
        background: "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.97) 60%, rgba(255,255,255,0) 100%)",
      },
    }),

    // ── LOCATION BADGE — top right ───────────────────────────────────────────
    location
      ? h("div", {
          style: {
            position: "absolute",
            top: 28,
            right: 28,
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#F5C842",
            borderRadius: 14,
            paddingTop: 12,
            paddingBottom: 12,
            paddingLeft: 18,
            paddingRight: 22,
            maxWidth: 320,
          },
        },
          // Pin icon
          h("div", {
            style: {
              fontSize: 24,
              lineHeight: 1,
              flexShrink: 0,
            },
          }, "\uD83D\uDCCD"),
          h("div", {
            style: {
              fontSize: 20,
              fontWeight: 900,
              color: "#1a1a2e",
              lineHeight: 1.2,
              letterSpacing: 0.5,
              textTransform: "uppercase",
            },
          }, location.toUpperCase()),
        )
      : null,

    // ── RIGHT COLUMN: checklist + play button ────────────────────────────────
    h("div", {
      style: {
        position: "absolute",
        top: 100,
        right: 28,
        width: 360,
        display: "flex",
        flexDirection: "column",
        gap: 0,
      },
    },

      // "Looking for support that understands:" heading
      h("div", {
        style: {
          fontSize: 27,
          fontWeight: 700,
          color: "#FFFFFF",
          lineHeight: 1.3,
          marginBottom: 18,
          textShadow: "0 1px 6px rgba(0,0,0,0.8)",
        },
      }, "Looking for support\nthat understands:"),

      // Checklist
      h("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: 6,
        },
      }, ...checkItems),

    ),

    // ── PLAY BUTTON — centred, overlapping photo/panel boundary ─────────────
    h("div", {
      style: {
        position: "absolute",
        bottom: 215,
        left: "50%",
        marginLeft: -70,
        width: 140,
        height: 140,
        borderRadius: 70,
        background: "rgba(255,255,255,0.92)",
        borderWidth: 6,
        borderStyle: "solid",
        borderColor: "#F5C842",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    },
      h("div", {
        style: {
      color: "#1a1a2e",
        fontSize: 56,
        fontWeight: 900,
        marginLeft: 8,
        lineHeight: 1,
        },
      }, "\u25B6"),
    ),

    // ── "Tap to watch" callout arrow ─────────────────────────────────────────
    h("div", {
      style: {
        position: "absolute",
        bottom: 238,
        right: 40,
        width: 220,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 0,
      },
    },
      h("div", {
        style: {
          fontSize: 22,
          fontWeight: 700,
          color: "#FFFFFF",
          fontStyle: "italic",
          lineHeight: 1.35,
          textShadow: "0 1px 6px rgba(0,0,0,0.8)",
        },
      }, "\u2190 Tap to watch my 15 second introduction!"),
    ),

    // ── BOTTOM WHITE PANEL ───────────────────────────────────────────────────
    h("div", {
      style: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: W,
        display: "flex",
        flexDirection: "column",
        paddingTop: 20,
        paddingBottom: 28,
        paddingLeft: 36,
        paddingRight: 36,
        gap: 4,
      },
    },

      // Name — huge, bold, navy
      h("div", {
        style: {
          fontSize: 72,
          fontWeight: 900,
          color: "#1a1a2e",
          lineHeight: 1.0,
          letterSpacing: -1,
        },
      }, name.toUpperCase()),

      // Title — purple
      h("div", {
        style: {
          fontSize: 26,
          fontWeight: 700,
          color: "#6B21A8",
          lineHeight: 1.2,
          marginTop: 4,
        },
      }, title),

      // Tagline — italic, dark, with gold underline accent
      tagline
        ? h("div", {
            style: {
              fontSize: 22,
              fontStyle: "italic",
              color: "#333",
              lineHeight: 1.4,
              marginTop: 6,
              borderBottomWidth: 3,
              borderBottomStyle: "solid",
              borderBottomColor: "#6B21A8",
              paddingBottom: 4,
              maxWidth: 600,
            },
          }, tagline.slice(0, 100))
        : null,

    ),

  );
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const q = Object.fromEntries(url.searchParams.entries());

  const name        = q.name     || "Support Worker";
  const title       = q.title    || "Support Worker";
  const location    = q.location || "";
  const tagline     = q.tagline  || "";
  const photoUrl    = q.photo    || "";
  const servicesRaw = q.services || "";

  // Map keys to human-readable specialty labels
  const specialties = servicesRaw.split(",").filter(Boolean).slice(0, 5)
    .map(s => SPECIALTY_MAP[s.trim()] || s.trim());

  const photoDataUrl = photoUrl ? await fetchAsBase64(photoUrl) : null;

  try {
    const card = buildCard({ name, title, location, tagline, photoDataUrl, specialties });
    const imgResponse = new ImageResponse(card, { width: 900, height: 900 });
    const bodyBytes = await imgResponse.arrayBuffer();
    return new Response(bodyBytes, {
      status: 200,
      headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=3600" },
    });
  } catch (err) {
    const errMsg = err?.message || String(err);
    console.error("OG image generation failed:", errMsg);
    if (q.debug === "1") {
      return new Response(`ERROR: ${errMsg}\n\nSTACK:\n${err?.stack || ""}`, {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }
    return Response.redirect("https://insyncprofiles.net/og-image.png", 302);
  }
}
