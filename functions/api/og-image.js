/**
 * Cloudflare Pages Function: /api/og-image
 *
 * Generates a dynamic PNG profile card matching the Jordan Mitchell reference design.
 * Uses @cloudflare/pages-plugin-vercel-og (bundled ImageResponse with satori + resvg-wasm).
 *
 * SATORI SUPPORTED CSS:
 * - display: flex only (no grid, no block)
 * - flexDirection, alignItems, justifyContent, gap, flex, flexShrink, flexWrap
 * - width, height, minWidth, minHeight, maxWidth, maxHeight
 * - paddingTop/Bottom/Left/Right, marginTop/Bottom/Left/Right (no shorthand)
 * - background (solid, linear-gradient), color, opacity
 * - fontSize, fontWeight, fontStyle, letterSpacing, lineHeight, textAlign
 * - borderRadius, borderWidth, borderStyle, borderColor
 * - overflow: hidden
 * - position: absolute/relative, top, left, right, bottom
 * - objectFit: cover/contain (on img elements)
 * NOT supported: boxShadow, textShadow, backgroundClip, transform (limited)
 */

import { ImageResponse } from "./vercel-og-bundle.js";

const SERVICE_MAP = {
  "personal-care":   { emoji: "🤲", label: "Personal Care",       bg: "#FFF3E0" },
  "emotional":       { emoji: "🌿", label: "Emotional Support",   bg: "#E8F5E9" },
  "community":       { emoji: "👥", label: "Community Access",    bg: "#EDE7F6" },
  "mental":          { emoji: "🧠", label: "Mental Wellbeing",    bg: "#E3F2FD" },
  "daily-living":    { emoji: "📋", label: "Daily Living",        bg: "#FFF8E1" },
  "transport":       { emoji: "🚗", label: "Transport",           bg: "#E3F2FD" },
  "social-skills":   { emoji: "🤝", label: "Social Skills",       bg: "#F3E5F5" },
  "therapy-assist":  { emoji: "🎯", label: "Therapy Assist",      bg: "#FCE4EC" },
  "behaviour":       { emoji: "🧩", label: "Behaviour Support",   bg: "#E8EAF6" },
  "domestic":        { emoji: "🏠", label: "Domestic Assist",     bg: "#F1F8E9" },
  "overnight":       { emoji: "🌙", label: "Overnight Support",   bg: "#E8EAF6" },
  "high-care":       { emoji: "💊", label: "High Care",           bg: "#FCE4EC" },
};

const BADGE_ICON = {
  "NDIS Worker Check":                "🛡️",
  "NDIS Worker Screened":             "🛡️",
  "First Aid Certified":              "🚑",
  "Police Check":                     "🔍",
  "Working With Children Check":      "🧒",
  "Mental Health Support":            "💜",
  "Mental Health First Aid":          "💜",
  "Public Liability Insurance":       "📋",
  "Professional Indemnity Insurance": "🔒",
  "Certificate III":                  "📜",
  "Certificate IV":                   "📜",
};

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

async function fetchAsBase64(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; InSyncProfiles/1.0)",
        "Accept": "image/png,image/jpeg,image/*,*/*",
      },
      signal: AbortSignal.timeout(5000),
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

// Minimal h() helper — builds satori-compatible element trees
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

function buildCard({ name, title, location, tagline, photoDataUrl, thumbDataUrl, services, badges }) {
  const W = 900;
  const H = 1125;

  // ── Service chips ──────────────────────────────────────────────────────────
  const serviceChips = services.slice(0, 5).map(s =>
    h("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        flex: 1,
      },
    },
      h("div", {
        style: {
          width: 90,
          height: 90,
          borderRadius: 45,
          background: s.bg || "#F5F5F5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 42,
        },
      }, s.emoji),
      h("div", {
        style: {
          fontSize: 13,
          color: "#333",
          textAlign: "center",
          fontWeight: 600,
          lineHeight: 1.3,
        },
      }, s.label),
    )
  );

  // ── Badge rows ─────────────────────────────────────────────────────────────
  const badgeList = badges.slice(0, 6);
  const badgeRows = [];
  for (let i = 0; i < badgeList.length; i += 2) {
    const left = badgeList[i];
    const right = badgeList[i + 1];

    // Alternate accent: first badge green checkmark, second gold star
    const makeCheck = (idx) => idx % 2 === 0 ? "✔" : "★";
    const makeColor = (idx) => idx % 2 === 0 ? "#4CAF50" : "#F5C842";

    const makeBadge = (label, idx) =>
      h("div", {
        style: {
          display: "flex",
          alignItems: "center",
          flex: 1,
          gap: 10,
          background: "white",
          borderRadius: 10,
          borderWidth: 1.5,
          borderStyle: "solid",
          borderColor: "#E0E0E0",
          paddingTop: 12,
          paddingBottom: 12,
          paddingLeft: 14,
          paddingRight: 14,
        },
      },
        h("span", { style: { fontSize: 22, flexShrink: 0 } }, BADGE_ICON[label] || "✔"),
        h("span", { style: { fontSize: 13, color: "#222", fontWeight: 600, flex: 1, lineHeight: 1.3 } }, label),
        h("span", { style: { fontSize: 18, color: makeColor(idx), flexShrink: 0 } }, makeCheck(idx)),
      );

    badgeRows.push(
      h("div", { style: { display: "flex", gap: 10, flexShrink: 0 } },
        makeBadge(left, i),
        right ? makeBadge(right, i + 1) : h("div", { style: { flex: 1 } }),
      )
    );
  }

  // ── Photo ──────────────────────────────────────────────────────────────────
  const photoEl = photoDataUrl
    ? h("div", {
        style: {
          width: 170,
          height: 170,
          borderRadius: 85,
          borderWidth: 5,
          borderStyle: "solid",
          borderColor: "#D4A017",
          overflow: "hidden",
          display: "flex",
          flexShrink: 0,
        },
      },
        h("img", {
          src: photoDataUrl,
          width: 170,
          height: 170,
          style: { objectFit: "cover" },
        })
      )
    : h("div", {
        style: {
          width: 170,
          height: 170,
          borderRadius: 85,
          borderWidth: 5,
          borderStyle: "solid",
          borderColor: "#D4A017",
          background: "#c8d8e8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 80,
          flexShrink: 0,
        },
      }, "👤");

  // ── Video thumbnail ────────────────────────────────────────────────────────
  const videoEl = thumbDataUrl
    ? h("div", {
        style: {
          display: "flex",
          position: "relative",
          borderRadius: 14,
          overflow: "hidden",
          height: 200,
          flexShrink: 0,
          borderWidth: 3,
          borderStyle: "solid",
          borderColor: "#A78BFA",
        },
      },
        h("img", {
          src: thumbDataUrl,
          width: W - 60,
          height: 200,
          style: { objectFit: "cover", width: "100%", height: "100%" },
        }),
        // Dark overlay with play button
        h("div", {
          style: {
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        },
          h("div", {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            },
          },
            h("div", {
              style: {
                width: 68,
                height: 68,
                borderRadius: 34,
                background: "#F5C842",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                color: "#1a1a1a",
                fontWeight: 700,
              },
            }, "▶"),
            h("div", {
              style: {
                background: "rgba(0,0,0,0.75)",
                borderRadius: 20,
                paddingTop: 6,
                paddingBottom: 6,
                paddingLeft: 20,
                paddingRight: 20,
                display: "flex",
                alignItems: "center",
              },
            },
              h("span", { style: { fontSize: 14, color: "#F5C842", fontWeight: 700, letterSpacing: 1 } }, "▶ WATCH INTRO"),
            ),
          )
        )
      )
    : null;

  // ── Tagline ────────────────────────────────────────────────────────────────
  const taglineEl = tagline
    ? h("div", {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: 10,
          paddingRight: 10,
          flexShrink: 0,
        },
      },
        h("div", {
          style: {
            fontSize: 17,
            color: "#444",
            fontStyle: "italic",
            textAlign: "center",
            lineHeight: 1.6,
          },
        }, `"${tagline.slice(0, 140)}${tagline.length > 140 ? "…" : ""}"`),
      )
    : null;

  // ── Full card ──────────────────────────────────────────────────────────────
  return h("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      width: W,
      height: H,
      fontFamily: "sans serif",
      background: "#D8D8D8",
    },
  },
    // Inner white card with rounded corners
    h("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        marginTop: 16,
        marginBottom: 16,
        marginLeft: 16,
        marginRight: 16,
        borderRadius: 24,
        overflow: "hidden",
        background: "white",
      },
    },
      // ── TOP BANNER ─────────────────────────────────────────────────────────
      h("div", {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#0a0a0a",
          paddingTop: 18,
          paddingBottom: 18,
          paddingLeft: 28,
          paddingRight: 28,
          height: 100,
          flexShrink: 0,
        },
      },
        // Left: accessibility icon + title stack
        h("div", { style: { display: "flex", alignItems: "center", gap: 14 } },
          h("div", {
            style: {
              width: 50,
              height: 50,
              borderRadius: 25,
              borderWidth: 2,
              borderStyle: "solid",
              borderColor: "#F5C842",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              flexShrink: 0,
            },
          }, "♿"),
          h("div", { style: { display: "flex", flexDirection: "column", gap: 4 } },
            h("div", {
              style: {
                color: "#F5C842",
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: 1,
              },
            }, "GET TO KNOW ME"),
            h("div", {
              style: {
                color: "#aaaaaa",
                fontSize: 11,
                letterSpacing: 3,
                fontWeight: 600,
              },
            }, "• INTERACTIVE & ACCESSIBLE •"),
          ),
        ),
        // Right: OPEN PROFILE button
        h("div", {
          style: {
            background: "#F5C842",
            borderRadius: 50,
            paddingTop: 14,
            paddingBottom: 14,
            paddingLeft: 26,
            paddingRight: 26,
            display: "flex",
            alignItems: "center",
            borderWidth: 2,
            borderStyle: "solid",
            borderColor: "#C8920A",
          },
        },
          h("div", {
            style: {
              color: "#0a0a0a",
              fontSize: 17,
              fontWeight: 800,
              letterSpacing: 0.5,
            },
          }, "OPEN PROFILE ▶"),
        ),
      ),

      // ── GRADIENT BODY ───────────────────────────────────────────────────────
      h("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          flex: 1,
          background: "linear-gradient(135deg, #dbeeff 0%, #e8d8ff 30%, #fff5d8 60%, #ffd8e8 80%, #ffe8c8 100%)",
          paddingTop: 24,
          paddingBottom: 20,
          paddingLeft: 30,
          paddingRight: 30,
          gap: 18,
        },
      },
        // ── Name row ─────────────────────────────────────────────────────────
        h("div", { style: { display: "flex", alignItems: "center", gap: 28, flexShrink: 0 } },
          photoEl,
          h("div", { style: { display: "flex", flexDirection: "column", gap: 6 } },
            h("div", {
              style: {
                fontSize: 52,
                fontWeight: 700,
                color: "#1a2a4a",
                lineHeight: 1.1,
              },
            }, name),
            h("div", {
              style: {
                fontSize: 15,
                fontWeight: 700,
                color: "#2dd4bf",
                letterSpacing: 4,
                marginTop: 2,
              },
            }, title.toUpperCase()),
            location
              ? h("div", {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 15,
                    color: "#555",
                    marginTop: 6,
                  },
                },
                  h("span", { style: { fontSize: 18 } }, "📍"),
                  h("span", {}, location),
                )
              : null,
          ),
        ),

        // ── Services row ─────────────────────────────────────────────────────
        services.length > 0
          ? h("div", {
              style: {
                display: "flex",
                justifyContent: "space-around",
                flexShrink: 0,
                paddingTop: 4,
                paddingBottom: 4,
              },
            }, ...serviceChips)
          : null,

        // ── Video thumbnail ───────────────────────────────────────────────────
        videoEl,

        // ── Tagline ───────────────────────────────────────────────────────────
        taglineEl,

        // ── Credentials header ────────────────────────────────────────────────
        badges.length > 0
          ? h("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexShrink: 0,
              },
            },
              h("span", { style: { fontSize: 22 } }, "🏅"),
              h("span", {
                style: {
                  fontSize: 16,
                  color: "#1a2a4a",
                  fontWeight: 800,
                  letterSpacing: 1,
                },
              }, "CREDENTIALS & BADGES"),
              h("span", {
                style: {
                  fontSize: 13,
                  color: "#888",
                  fontStyle: "italic",
                },
              }, "(Self-Reported)"),
            )
          : null,

        // ── Badge rows ────────────────────────────────────────────────────────
        ...badgeRows,
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
  const videoUrl = q.video    || "";
  const servicesRaw = q.services || "";
  const badgesRaw   = q.badges   || "";

  const services = servicesRaw.split(",").filter(Boolean).slice(0, 5)
    .map(s => SERVICE_MAP[s.trim()] || { emoji: "✨", label: s.trim(), bg: "#F5F5F5" });

  const badges = badgesRaw.split("|").filter(Boolean).slice(0, 6);

  const [photoDataUrl, thumbDataUrl] = await Promise.all([
    photoUrl ? fetchAsBase64(photoUrl) : Promise.resolve(null),
    videoUrl
      ? (async () => {
          const ytId = getYouTubeId(videoUrl);
          return ytId
            ? fetchAsBase64(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`)
            : null;
        })()
      : Promise.resolve(null),
  ]);

  try {
    const card = buildCard({
      name, title, location, tagline,
      photoDataUrl, thumbDataUrl,
      services, badges,
    });

    const imgResponse = new ImageResponse(card, { width: 900, height: 1125 });
    // Await the body to surface any stream-level render errors
    const bodyBytes = await imgResponse.arrayBuffer();
    return new Response(bodyBytes, {
      status: 200,
      headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=3600" },
    });
  } catch (err) {
    const errMsg = err?.message || String(err);
    const errStack = err?.stack || '';
    console.error("OG image generation failed:", errMsg);
    // Debug mode: return error as text when debug=1 param is present
    if (q.debug === '1') {
      return new Response(`ERROR: ${errMsg}\n\nSTACK:\n${errStack}`, {
        status: 500,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
    return Response.redirect("https://insyncprofiles.net/og-image.png", 302);
  }
}
