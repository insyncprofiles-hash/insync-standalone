/**
 * Cloudflare Pages Function: POST /api/generate-card
 * Generates the trust-first social card PNG and returns it as a base64 data URL.
 * Body (JSON): { name, title, location, tagline, photoUrl, specialties }
 * Returns: { cardDataUrl: "data:image/png;base64,..." }
 *
 * Reuses the same card layout as /api/og-image but:
 *  - Accepts POST with JSON body (not GET with query params)
 *  - Returns JSON with base64 data URL (not raw image bytes)
 *  - Used by the in-editor Generate Social Card button
 */
import { ImageResponse } from "./vercel-og-bundle.js";

const SPECIALTY_MAP = {
  "autism":              "Autism",
  "neurodiversity":      "Neurodiversity",
  "mental-health":       "Mental Health",
  "mental":              "Mental Health",
  "psychosocial":        "Psychosocial Recovery",
  "physical":            "Physical Disability",
  "complex":             "Complex Needs",
  "intellectual":        "Intellectual Disability",
  "acquired-brain":      "Acquired Brain Injury",
  "non-verbal":          "Non-Verbal Communication",
  "school-leaver":       "School Leavers",
  "aged-care":           "Aged Care",
  "dementia":            "Dementia",
  "sensory":             "Sensory Processing",
  "community":           "Community Participation",
  "daily-living":        "Daily Living",
  "personal-care":       "Personal Care",
  "transport":           "Transport",
  "social-skills":       "Social Skills",
  "therapy-assist":      "Therapy Assist",
  "behaviour":           "Behaviour Support",
  "domestic":            "Domestic Assistance",
  "overnight":           "Overnight Support",
  "high-care":           "High Care",
  "emotional":           "Emotional Support",
  "Autism Spectrum Disorder (ASD)": "Autism",
  "Mental Health":       "Mental Health",
  "Anxiety Disorders":   "Anxiety",
  "Community Access":    "Community Participation",
  "Daily Living Support":"Daily Living",
  "Personal Care":       "Personal Care",
  "Transport Assistance":"Transport",
  "Behaviour Support":   "Behaviour Support",
  "Emotional Support":   "Emotional Support",
  "Overnight Support":   "Overnight Support",
  "Therapy Assistance":  "Therapy Assist",
  "Social Skills Development": "Social Skills",
  "Domestic Assistance": "Domestic Assistance",
};

async function fetchAsBase64(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0", "Accept": "image/*,*/*" },
      signal: AbortSignal.timeout(4500),
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
  return { type, props: { ...props, children: flat.length === 1 ? flat[0] : flat.length === 0 ? undefined : flat } };
}

function buildCard({ name, title, location, tagline, photoDataUrl, specialties }) {
  const W = 900, H = 1125;
  const GOLD = "#F5C842";
  const NAVY = "#1a1a2e";
  const WHITE = "#FFFFFF";

  const checks = specialties.slice(0, 5);

  return h("div", {
    style: {
      width: W, height: H,
      display: "flex", flexDirection: "column",
      position: "relative",
      background: NAVY,
      fontFamily: "sans-serif",
      overflow: "hidden",
    },
  },
    // ── Photo background (full bleed) ──────────────────────────────────────
    photoDataUrl
      ? h("img", {
          src: photoDataUrl,
          style: {
            position: "absolute", top: 0, left: 0,
            width: W, height: H,
            objectFit: "cover", objectPosition: "center top",
          },
        })
      : h("div", {
          style: {
            position: "absolute", top: 0, left: 0, width: W, height: H,
            background: `linear-gradient(135deg, ${NAVY} 0%, #2d1b69 100%)`,
          },
        }),

    // ── Dark gradient overlay (right side + bottom) ────────────────────────
    h("div", {
      style: {
        position: "absolute", top: 0, left: 0, width: W, height: H,
        background: "linear-gradient(to right, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.72) 48%, rgba(0,0,0,0.82) 100%)",
        display: "flex",
      },
    }),
    h("div", {
      style: {
        position: "absolute", bottom: 0, left: 0, width: W, height: 340,
        background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)",
        display: "flex",
      },
    }),

    // ── Location badge (top-right) ─────────────────────────────────────────
    location && h("div", {
      style: {
        position: "absolute", top: 36, right: 36,
        background: GOLD,
        borderRadius: 16,
        paddingTop: 10, paddingBottom: 10, paddingLeft: 18, paddingRight: 18,
        display: "flex", alignItems: "center", gap: 8,
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      },
    },
      h("div", { style: { fontSize: 22, lineHeight: 1 } }, "📍"),
      h("div", {
        style: {
          fontSize: 22, fontWeight: 900, color: NAVY,
          lineHeight: 1.2, letterSpacing: 0.5,
          textTransform: "uppercase",
          maxWidth: 260,
        },
      }, location.toUpperCase()),
    ),

    // ── "Looking for support that understands:" + checklist (right side) ───
    checks.length > 0 && h("div", {
      style: {
        position: "absolute",
        top: 130, right: 40,
        width: 340,
        display: "flex", flexDirection: "column", gap: 6,
      },
    },
      h("div", {
        style: {
          fontSize: 28, fontWeight: 700, color: WHITE,
          lineHeight: 1.3, marginBottom: 14,
          textShadow: "0 2px 8px rgba(0,0,0,0.8)",
        },
      }, "Looking for support\nthat understands:"),
      ...checks.map(label =>
        h("div", {
          style: {
            display: "flex", alignItems: "center", gap: 12,
          },
        },
          h("div", {
            style: {
              fontSize: 28, color: GOLD, fontWeight: 900, lineHeight: 1,
              textShadow: "0 1px 4px rgba(0,0,0,0.6)",
            },
          }, "✓"),
          h("div", {
            style: {
              fontSize: 26, fontWeight: 700, color: WHITE,
              lineHeight: 1.25,
              textShadow: "0 1px 6px rgba(0,0,0,0.7)",
            },
          }, label),
        )
      ),
    ),

    // ── Play button (centred lower) ────────────────────────────────────────
    h("div", {
      style: {
        position: "absolute",
        bottom: 270, left: 370,
        width: 150, height: 150,
        borderRadius: 75,
        background: "rgba(255,255,255,0.92)",
        border: `6px solid ${GOLD}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 0 4px ${GOLD}44`,
      },
    },
      h("div", {
        style: {
          color: NAVY, fontSize: 58, fontWeight: 900,
          marginLeft: 12, lineHeight: 1,
        },
      }, "▶"),
    ),

    // ── "Tap to watch" callout ─────────────────────────────────────────────
    h("div", {
      style: {
        position: "absolute",
        bottom: 290, right: 44,
        width: 220,
        display: "flex", flexDirection: "column",
      },
    },
      h("div", {
        style: {
          fontSize: 22, fontWeight: 700, color: WHITE,
          fontStyle: "italic", lineHeight: 1.35,
          textShadow: "0 1px 6px rgba(0,0,0,0.8)",
        },
      }, "← Tap to watch my\n15 second introduction!"),
    ),

    // ── Bottom white panel ─────────────────────────────────────────────────
    h("div", {
      style: {
        position: "absolute",
        bottom: 0, left: 0, width: W,
        background: "rgba(255,255,255,0.95)",
        borderRadius: "24px 24px 0 0",
        paddingTop: 20, paddingBottom: 30,
        paddingLeft: 36, paddingRight: 36,
        display: "flex", flexDirection: "column", gap: 4,
      },
    },
      h("div", {
        style: {
          fontSize: 68, fontWeight: 900, color: NAVY,
          lineHeight: 1.0, letterSpacing: -1,
        },
      }, name.toUpperCase()),
      h("div", {
        style: {
          fontSize: 26, fontWeight: 700, color: "#6B21A8",
          lineHeight: 1.2, marginTop: 4,
        },
      }, title || "Support Worker"),
      tagline && h("div", {
        style: {
          fontSize: 22, fontStyle: "italic", color: "#333",
          lineHeight: 1.4, marginTop: 6,
          borderBottom: `3px solid #6B21A8`,
          paddingBottom: 4, maxWidth: 600,
        },
      }, tagline.slice(0, 100)),
    ),
  );
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { name, title, location, tagline, photoUrl, specialties: specialtiesRaw } = body;

    if (!name) {
      return new Response(JSON.stringify({ error: "name is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Map specialty labels to display names
    const specialties = (specialtiesRaw || "")
      .split(",")
      .filter(Boolean)
      .slice(0, 5)
      .map(s => SPECIALTY_MAP[s.trim()] || s.trim());

    const photoDataUrl = photoUrl ? await fetchAsBase64(photoUrl) : null;

    const card = buildCard({
      name,
      title: title || "Support Worker",
      location: location || "",
      tagline: tagline || "",
      photoDataUrl,
      specialties,
    });

    const imgResponse = new ImageResponse(card, { width: 900, height: 1125 });
    const bodyBytes = await imgResponse.arrayBuffer();

    // Convert to base64
    const bytes = new Uint8Array(bodyBytes);
    let binary = "";
    for (let i = 0; i < bytes.length; i += 8192) {
      const chunk = bytes.subarray(i, Math.min(i + 8192, bytes.length));
      for (let j = 0; j < chunk.length; j++) binary += String.fromCharCode(chunk[j]);
    }
    const cardDataUrl = `data:image/png;base64,${btoa(binary)}`;

    return new Response(JSON.stringify({ cardDataUrl }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("generate-card error:", err);
    return new Response(JSON.stringify({ error: "Card generation failed", detail: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
