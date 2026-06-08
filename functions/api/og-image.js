/**
 * Cloudflare Pages Function: /api/og-image
 * Trust-first profile card:
 *   - Video thumbnail feel (photo + play button overlay)
 *   - Suburb/service area PROMINENT
 *   - Specialty tags (disability types) in bold contrasting colours
 *   - Name + tagline as primary trust signals
 *   - Single CTA in banner only
 */

import { ImageResponse } from "./vercel-og-bundle.js";

// Specialty tags — disability types participants recognise instantly
// Mapped from the "services" param for now; workers will choose these in the builder
const SPECIALTY_MAP = {
  "autism":         { label: "AUTISM",           bg: "#1565C0", text: "#FFFFFF" },
  "mental-health":  { label: "MENTAL HEALTH",    bg: "#6A1B9A", text: "#FFFFFF" },
  "psychosocial":   { label: "PSYCHOSOCIAL",     bg: "#6A1B9A", text: "#FFFFFF" },
  "physical":       { label: "PHYSICAL",         bg: "#1B5E20", text: "#FFFFFF" },
  "complex":        { label: "COMPLEX NEEDS",    bg: "#B71C1C", text: "#FFFFFF" },
  "intellectual":   { label: "INTELLECTUAL",     bg: "#E65100", text: "#FFFFFF" },
  "acquired-brain": { label: "ACQUIRED BRAIN",   bg: "#4A148C", text: "#FFFFFF" },
  "non-verbal":     { label: "NON-VERBAL",       bg: "#004D40", text: "#FFFFFF" },
  "school-leaver":  { label: "SCHOOL LEAVERS",   bg: "#1A237E", text: "#FFFFFF" },
  "aged-care":      { label: "AGED CARE",        bg: "#37474F", text: "#FFFFFF" },
  "dementia":       { label: "DEMENTIA",         bg: "#4E342E", text: "#FFFFFF" },
  "sensory":        { label: "SENSORY",          bg: "#006064", text: "#FFFFFF" },
  // Legacy service keys mapped to specialty tags
  "personal-care":  { label: "PERSONAL CARE",   bg: "#C62828", text: "#FFFFFF" },
  "community":      { label: "COMMUNITY",        bg: "#1565C0", text: "#FFFFFF" },
  "daily-living":   { label: "DAILY LIVING",     bg: "#E65100", text: "#FFFFFF" },
  "transport":      { label: "TRANSPORT",        bg: "#0277BD", text: "#FFFFFF" },
  "social-skills":  { label: "SOCIAL SKILLS",   bg: "#6A1B9A", text: "#FFFFFF" },
  "therapy-assist": { label: "THERAPY ASSIST",  bg: "#880E4F", text: "#FFFFFF" },
  "behaviour":      { label: "BEHAVIOUR",        bg: "#1A237E", text: "#FFFFFF" },
  "domestic":       { label: "DOMESTIC",         bg: "#1B5E20", text: "#FFFFFF" },
  "overnight":      { label: "OVERNIGHT",        bg: "#263238", text: "#FFFFFF" },
  "high-care":      { label: "HIGH CARE",        bg: "#B71C1C", text: "#FFFFFF" },
  "emotional":      { label: "EMOTIONAL SUPPORT",bg: "#1B5E20", text: "#FFFFFF" },
  "mental":         { label: "MENTAL HEALTH",    bg: "#6A1B9A", text: "#FFFFFF" },
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

function buildCard({ name, title, location, tagline, photoDataUrl, iconDataUrl, tags }) {
  const PHOTO_SIZE = 220;

  // ── Photo with play button overlay ──────────────────────────────────────────
  const photoEl = h("div", {
    style: {
      position: "relative",
      width: PHOTO_SIZE,
      height: PHOTO_SIZE,
      borderRadius: PHOTO_SIZE / 2,
      borderWidth: 6,
      borderStyle: "solid",
      borderColor: "#F5C842",
      overflow: "hidden",
      display: "flex",
      flexShrink: 0,
    },
  },
    photoDataUrl
      ? h("img", {
          src: photoDataUrl,
          width: PHOTO_SIZE,
          height: PHOTO_SIZE,
          style: { objectFit: "cover", objectPosition: "center top" },
        })
      : h("div", {
          style: {
            width: PHOTO_SIZE,
            height: PHOTO_SIZE,
            background: "#c8d8e8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 80,
            color: "#5a7a9a",
          },
        }, "\u{1F464}"),
    // Play button overlay — signals "this person has a video intro"
    h("div", {
      style: {
        position: "absolute",
        bottom: 10,
        right: 10,
        width: 44,
        height: 44,
        borderRadius: 22,
        background: "rgba(0,0,0,0.72)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    },
      h("div", {
        style: {
          color: "#F5C842",
          fontSize: 20,
          fontWeight: 900,
          marginLeft: 3,
        },
      }, "\u25B6"),
    ),
  );

  // ── Specialty tags — bold, high contrast, immediately scannable ─────────────
  const tagEls = tags.slice(0, 4).map(tag =>
    h("div", {
      style: {
        display: "flex",
        alignItems: "center",
        background: tag.bg,
        borderRadius: 8,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 18,
        paddingRight: 18,
      },
    },
      h("div", {
        style: {
          fontSize: 17,
          color: tag.text,
          fontWeight: 900,
          letterSpacing: 1.2,
        },
      }, tag.label),
    )
  );

  return h("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      width: 900,
      height: 900,
      fontFamily: "sans-serif",
      background: "#1a1a2e",
    },
  },
    // Outer card
    h("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        margin: 16,
        borderRadius: 24,
        overflow: "hidden",
        background: "white",
      },
    },

      // ── TOP BANNER ──────────────────────────────────────────────────────────
      h("div", {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#0a0a0a",
          paddingTop: 20,
          paddingBottom: 20,
          paddingLeft: 28,
          paddingRight: 28,
          flexShrink: 0,
        },
      },
        h("div", { style: { display: "flex", alignItems: "center", gap: 14 } },
          iconDataUrl
            ? h("img", { src: iconDataUrl, width: 52, height: 52, style: { objectFit: "contain", flexShrink: 0 } })
            : null,
          h("div", { style: { display: "flex", flexDirection: "column", gap: 2 } },
            h("div", { style: { color: "#F5C842", fontSize: 26, fontWeight: 900, letterSpacing: 1 } }, "GET TO KNOW ME"),
            h("div", { style: { color: "#888", fontSize: 11, letterSpacing: 3, fontWeight: 600 } }, "\u2022 INTERACTIVE & ACCESSIBLE \u2022"),
          ),
        ),
        h("div", {
          style: {
            background: "#F5C842",
            borderRadius: 50,
            paddingTop: 12,
            paddingBottom: 12,
            paddingLeft: 24,
            paddingRight: 24,
            display: "flex",
            alignItems: "center",
          },
        },
          h("div", { style: { color: "#0a0a0a", fontSize: 16, fontWeight: 900, letterSpacing: 0.5 } }, "OPEN PROFILE \u25B6"),
        ),
      ),

      // ── BODY ────────────────────────────────────────────────────────────────
      h("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          flex: 1,
          background: "linear-gradient(160deg, #0f2044 0%, #1a1060 40%, #2d1b00 100%)",
          paddingTop: 36,
          paddingBottom: 32,
          paddingLeft: 44,
          paddingRight: 44,
        },
      },

        // ── Row: photo left | identity right ──────────────────────────────────
        h("div", {
          style: {
            display: "flex",
            alignItems: "flex-start",
            gap: 36,
            flexShrink: 0,
          },
        },

          // Photo
          photoEl,

          // Identity column
          h("div", {
            style: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 10,
              flex: 1,
              paddingTop: 8,
            },
          },
            // Name — largest, most dominant
            h("div", {
              style: {
                fontSize: 64,
                fontWeight: 900,
                color: "#FFFFFF",
                lineHeight: 1.0,
                letterSpacing: -1,
              },
            }, name),

            // Title — teal, spaced caps
            h("div", {
              style: {
                fontSize: 16,
                fontWeight: 800,
                color: "#2DD4BF",
                letterSpacing: 4,
                marginTop: 4,
              },
            }, title.toUpperCase()),

            // Location — PROMINENT, gold, large
            location
              ? h("div", {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 6,
                  },
                },
                  h("div", {
                    style: {
                      background: "#F5C842",
                      borderRadius: 6,
                      paddingTop: 6,
                      paddingBottom: 6,
                      paddingLeft: 14,
                      paddingRight: 14,
                      display: "flex",
                      alignItems: "center",
                    },
                  },
                    h("div", {
                      style: {
                        fontSize: 17,
                        fontWeight: 900,
                        color: "#0a0a0a",
                        letterSpacing: 0.5,
                      },
                    }, location),
                  ),
                )
              : null,

            // Specialty tags row
            tags.length > 0
              ? h("div", {
                  style: {
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    marginTop: 10,
                  },
                }, ...tagEls)
              : null,
          ),
        ),

        // ── Tagline — their own words, the trust signal ─────────────────────
        tagline
          ? h("div", {
              style: {
                display: "flex",
                flexDirection: "column",
                marginTop: 32,
                paddingTop: 24,
                paddingBottom: 24,
                paddingLeft: 28,
                paddingRight: 28,
                borderRadius: 14,
                background: "rgba(255,255,255,0.08)",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "rgba(245,200,66,0.3)",
                flexShrink: 0,
              },
            },
              h("div", {
                style: {
                  fontSize: 13,
                  color: "#F5C842",
                  fontWeight: 800,
                  letterSpacing: 3,
                  marginBottom: 10,
                },
              }, "IN THEIR OWN WORDS"),
              h("div", {
                style: {
                  fontSize: 22,
                  color: "#F0F0F0",
                  fontStyle: "italic",
                  lineHeight: 1.5,
                },
              }, `"${tagline.slice(0, 140)}${tagline.length > 140 ? "\u2026" : ""}"`)
            )
          : null,

      ),
    ),
  );
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const q = Object.fromEntries(url.searchParams.entries());

  const name     = q.name     || "Support Worker";
  const title    = q.title    || "Support Worker";
  const location = q.location || "";
  const tagline  = q.tagline  || "";
  const photoUrl = q.photo    || "";
  const servicesRaw = q.services || "";

  // Map service/specialty keys to tag objects
  const tags = servicesRaw.split(",").filter(Boolean).slice(0, 4)
    .map(s => SPECIALTY_MAP[s.trim()] || { label: s.trim().toUpperCase(), bg: "#1a237e", text: "#FFFFFF" });

  const photoDataUrl = photoUrl ? await fetchAsBase64(photoUrl) : null;
  const iconDataUrl = await fetchAsBase64(`${url.origin}/accessibility-icon.png`);

  try {
    const card = buildCard({ name, title, location, tagline, photoDataUrl, iconDataUrl, tags });
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
