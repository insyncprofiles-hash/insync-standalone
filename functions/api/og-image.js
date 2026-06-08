/**
 * Cloudflare Pages Function: /api/og-image
 *
 * Generates a dynamic PNG profile card matching the Jordan Mitchell reference design.
 * Uses @cloudflare/pages-plugin-vercel-og (bundled ImageResponse with satori + resvg-wasm).
 */

import { ImageResponse } from "./vercel-og-bundle.js";

// Service label map with pastel background colours matching the reference
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

// Badge icons matching the reference image
const BADGE_ICON = {
  "NDIS Worker Check":               "🛡️",
  "NDIS Worker Screened":            "🛡️",
  "First Aid Certified":             "🚑",
  "Police Check":                    "🔍",
  "Working With Children Check":     "🧒",
  "Mental Health Support":           "💜",
  "Mental Health First Aid":         "💜",
  "Public Liability Insurance":      "📋",
  "Professional Indemnity Insurance":"🔒",
  "Certificate III":                 "📜",
  "Certificate IV":                  "📜",
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

  // ── Service chips ──────────────────────────────────────────────────────────
  const serviceChips = services.slice(0, 5).map(s =>
    h("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        width: 148,
      },
    },
      h("div", {
        style: {
          width: 80,
          height: 80,
          borderRadius: 40,
          background: s.bg || "#F5F5F5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 38,
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
    badgeRows.push(
      h("div", { style: { display: "flex", gap: 12 } },
        // Left badge
        h("div", {
          style: {
            display: "flex",
            alignItems: "center",
            flex: 1,
            gap: 10,
            background: "white",
            borderRadius: 10,
            border: "1.5px solid #E8E8E8",
            padding: "10px 14px",
          },
        },
          h("span", { style: { fontSize: 22 } }, BADGE_ICON[left] || "✔"),
          h("span", { style: { fontSize: 13, color: "#222", fontWeight: 600, flex: 1 } }, left),
          // Filled checkmark for verified, outline for unverified (visual only)
          h("span", { style: { fontSize: 16, color: "#4CAF50" } }, "✔"),
        ),
        // Right badge (or empty spacer)
        right
          ? h("div", {
              style: {
                display: "flex",
                alignItems: "center",
                flex: 1,
                gap: 10,
                background: "white",
                borderRadius: 10,
                border: "1.5px solid #E8E8E8",
                padding: "10px 14px",
              },
            },
              h("span", { style: { fontSize: 22 } }, BADGE_ICON[right] || "✔"),
              h("span", { style: { fontSize: 13, color: "#222", fontWeight: 600, flex: 1 } }, right),
              h("span", { style: { fontSize: 16, color: "#F5C842" } }, "★"),
            )
          : h("div", { style: { flex: 1 } }),
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
          border: "5px solid #D4A017",
          overflow: "hidden",
          display: "flex",
          flexShrink: 0,
          boxShadow: "0 0 0 3px #F5C842, 0 0 0 6px rgba(245,200,66,0.3)",
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
          border: "5px solid #D4A017",
          background: "linear-gradient(135deg, #e0e0e0, #c8c8c8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 72,
          flexShrink: 0,
        },
      }, "👤");

  // ── Video thumbnail ────────────────────────────────────────────────────────
  const videoEl = thumbDataUrl
    ? h("div", {
        style: {
          display: "flex",
          position: "relative",
          borderRadius: 16,
          overflow: "hidden",
          height: 200,
          flexShrink: 0,
          // Rainbow gradient border via outline
          border: "3px solid transparent",
          backgroundClip: "padding-box",
        },
      },
        h("img", {
          src: thumbDataUrl,
          width: W - 64,
          height: 200,
          style: { objectFit: "cover", width: "100%", height: "100%" },
        }),
        // Dark overlay
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
            // Play button circle
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
            // WATCH INTRO pill
            h("div", {
              style: {
                background: "rgba(0,0,0,0.75)",
                borderRadius: 20,
                padding: "5px 18px",
                display: "flex",
                alignItems: "center",
                gap: 6,
              },
            },
              h("span", { style: { fontSize: 13, color: "#F5C842", fontWeight: 700 } }, "▶ WATCH INTRO"),
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
          flexDirection: "column",
          alignItems: "center",
          padding: "0 20px",
          gap: 2,
        },
      },
        h("div", {
          style: {
            fontSize: 17,
            color: "#444",
            fontStyle: "italic",
            textAlign: "center",
            lineHeight: 1.5,
          },
        }, `"${tagline.slice(0, 100)}${tagline.length > 100 ? "…" : ""}"`),
      )
    : null;

  // ── Full card ──────────────────────────────────────────────────────────────
  return h("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      width: W,
      height: 1125,
      fontFamily: "sans serif",
      background: "#F0F0F0",
      padding: 0,
    },
  },
    // ── Outer card with rounded corners and shadow ──
    h("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        margin: 16,
        borderRadius: 24,
        overflow: "hidden",
        background: "white",
        boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
      },
    },
      // ── TOP BANNER ─────────────────────────────────────────────────────────
      h("div", {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#0a0a0a",
          padding: "16px 28px",
          height: 100,
          flexShrink: 0,
          position: "relative",
        },
      },
        // Left: accessibility icon + title
        h("div", { style: { display: "flex", alignItems: "center", gap: 12 } },
          // Accessibility icon circle
          h("div", {
            style: {
              width: 48,
              height: 48,
              borderRadius: 24,
              border: "2.5px solid #F5C842",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              flexShrink: 0,
            },
          }, "♿"),
          h("div", { style: { display: "flex", flexDirection: "column", gap: 2 } },
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
                color: "#cccccc",
                fontSize: 12,
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
            padding: "12px 26px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            border: "2px solid #D4A017",
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
          background: "linear-gradient(135deg, #dbeeff 0%, #e8d8ff 25%, #fff5d8 55%, #ffd8e8 80%, #ffe8c8 100%)",
          padding: "24px 32px 20px",
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
                    marginTop: 4,
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
                justifyContent: "center",
                gap: 14,
                flexShrink: 0,
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

  // Fetch images in parallel
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

    return new ImageResponse(card, { width: 900, height: 1125 });
  } catch (err) {
    console.error("OG image generation failed:", err?.message || err);
    return Response.redirect("https://insyncprofiles.net/og-image.png", 302);
  }
}
