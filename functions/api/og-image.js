/**
 * Cloudflare Pages Function: /api/og-image
 *
 * Generates a dynamic PNG profile card for Facebook/LinkedIn OG previews.
 * Uses @cloudflare/pages-plugin-vercel-og (bundled ImageResponse with satori + resvg-wasm).
 * The WASM files are co-located in this directory for static import support.
 */

import { ImageResponse } from "./vercel-og-bundle.js";

// Service label map
const SERVICE_MAP = {
  "personal-care":   { emoji: "🤲", label: "Personal Care" },
  "emotional":       { emoji: "🌿", label: "Emotional Support" },
  "community":       { emoji: "👥", label: "Community Access" },
  "mental":          { emoji: "🧠", label: "Mental Wellbeing" },
  "daily-living":    { emoji: "📋", label: "Daily Living" },
  "transport":       { emoji: "🚗", label: "Transport" },
  "social-skills":   { emoji: "🤝", label: "Social Skills" },
  "therapy-assist":  { emoji: "🎯", label: "Therapy Assist" },
  "behaviour":       { emoji: "🧩", label: "Behaviour Support" },
  "domestic":        { emoji: "🏠", label: "Domestic Assist" },
  "overnight":       { emoji: "🌙", label: "Overnight Support" },
  "high-care":       { emoji: "💊", label: "High Care" },
};

const BADGE_ICON = {
  "NDIS Worker Check": "✅",
  "NDIS Worker Screened": "🛡️",
  "First Aid Certified": "⭐",
  "Police Check": "🔍",
  "Working With Children Check": "🧒",
  "Mental Health Support": "🤍",
  "Mental Health First Aid": "🤍",
  "Public Liability Insurance": "📋",
  "Professional Indemnity Insurance": "🔒",
  "Certificate III": "📜",
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
    // Process in 8KB chunks to avoid call stack overflow
    for (let i = 0; i < bytes.length; i += 8192) {
      const chunk = bytes.subarray(i, Math.min(i + 8192, bytes.length));
      for (let j = 0; j < chunk.length; j++) binary += String.fromCharCode(chunk[j]);
    }
    const b64 = btoa(binary);
    const ct = res.headers.get("content-type") || "image/jpeg";
    return `data:${ct};base64,${b64}`;
  } catch {
    return null;
  }
}

// Build the card as a React element tree (plain objects, no JSX)
function h(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.length === 1 ? children[0] : children.length > 1 ? children : undefined,
    },
  };
}

function buildCard({ name, title, location, tagline, photoDataUrl, thumbDataUrl, services, badges }) {
  const W = 900;
  const H = 1125;

  // Service chips
  const serviceChips = services.slice(0, 5).map(s =>
    h("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        width: 156,
      },
    },
      h("div", {
        style: {
          width: 56,
          height: 56,
          borderRadius: 28,
          background: "rgba(255,255,255,0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          border: "2px solid rgba(255,255,255,0.6)",
        },
      }, s.emoji),
      h("div", {
        style: {
          fontSize: 11,
          color: "#444",
          textAlign: "center",
          fontWeight: 600,
          maxWidth: 140,
        },
      }, s.label),
    )
  );

  // Badge items
  const badgeItems = badges.slice(0, 6).map(b => {
    const icon = BADGE_ICON[b] || "✔";
    return h("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "rgba(255,255,255,0.85)",
        borderRadius: 10,
        padding: "8px 14px",
        flex: 1,
        minWidth: 0,
      },
    },
      h("span", { style: { fontSize: 16 } }, icon),
      h("span", { style: { fontSize: 12, color: "#333", fontWeight: 600 } }, b),
    );
  });

  // Pair badges into rows of 2
  const badgeRows = [];
  for (let i = 0; i < badgeItems.length; i += 2) {
    badgeRows.push(
      h("div", { style: { display: "flex", gap: 12 } },
        badgeItems[i],
        badgeItems[i + 1] || h("div", { style: { flex: 1 } }),
      )
    );
  }

  // Photo element
  const photoEl = photoDataUrl
    ? h("div", {
        style: {
          width: 110,
          height: 110,
          borderRadius: 55,
          border: "4px solid #f5c842",
          overflow: "hidden",
          display: "flex",
          flexShrink: 0,
        },
      },
        h("img", {
          src: photoDataUrl,
          width: 110,
          height: 110,
          style: { objectFit: "cover" },
        })
      )
    : h("div", {
        style: {
          width: 110,
          height: 110,
          borderRadius: 55,
          border: "4px solid #f5c842",
          background: "#e0e0e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 44,
          flexShrink: 0,
        },
      }, "👤");

  // Video thumbnail section
  const videoEl = thumbDataUrl
    ? h("div", {
        style: {
          display: "flex",
          position: "relative",
          borderRadius: 14,
          overflow: "hidden",
          height: 160,
          flexShrink: 0,
        },
      },
        h("img", {
          src: thumbDataUrl,
          width: W - 64,
          height: 160,
          style: { objectFit: "cover", width: "100%", height: "100%" },
        }),
        // Dark overlay
        h("div", {
          style: {
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.25)",
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
              gap: 8,
            },
          },
            h("div", {
              style: {
                width: 60,
                height: 60,
                borderRadius: 30,
                background: "#f5c842",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                color: "#0a0a0a",
              },
            }, "▶"),
            h("div", {
              style: {
                background: "rgba(0,0,0,0.75)",
                borderRadius: 14,
                padding: "4px 14px",
                fontSize: 12,
                color: "#f5c842",
                fontWeight: 700,
              },
            }, "▶ WATCH INTRO"),
          )
        )
      )
    : null;

  // Tagline
  const taglineEl = tagline
    ? h("div", {
        style: {
          fontSize: 14,
          color: "#555",
          fontStyle: "italic",
          textAlign: "center",
          padding: "0 20px",
        },
      }, `"${tagline.slice(0, 120)}${tagline.length > 120 ? "…" : ""}"`)
    : null;

  // Build body children array (filter nulls)
  const bodyChildren = [
    // Name row
    h("div", { style: { display: "flex", alignItems: "center", gap: 20, flexShrink: 0 } },
      photoEl,
      h("div", { style: { display: "flex", flexDirection: "column", gap: 5 } },
        h("div", { style: { fontSize: 38, fontWeight: 700, color: "#1a2a4a" } }, name),
        h("div", { style: { fontSize: 13, fontWeight: 700, color: "#2dd4bf", letterSpacing: 3 } }, title.toUpperCase()),
        location ? h("div", { style: { fontSize: 13, color: "#555", marginTop: 2 } }, "📍 " + location) : null,
      )
    ),
    // Services row
    services.length > 0
      ? h("div", { style: { display: "flex", gap: 8, flexShrink: 0 } }, ...serviceChips)
      : null,
    // Video
    videoEl,
    // Tagline
    taglineEl,
    // Credentials header
    h("div", { style: { display: "flex", alignItems: "center", gap: 10, flexShrink: 0 } },
      h("div", { style: { fontSize: 15, color: "#1a2a4a", fontWeight: 800, letterSpacing: 1 } }, "🏅 CREDENTIALS & BADGES"),
      h("div", { style: { fontSize: 11, color: "#888", fontStyle: "italic" } }, "(Self-Reported)"),
    ),
    // Badge rows
    ...badgeRows,
  ].filter(Boolean);

  return h("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      width: W,
      height: H,
      fontFamily: "sans serif",
      background: "#fff",
    },
  },
    // Top black banner
    h("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#0a0a0a",
        padding: "0 28px",
        height: 80,
        flexShrink: 0,
      },
    },
      h("div", { style: { display: "flex", flexDirection: "column", gap: 4 } },
        h("div", { style: { color: "#f5c842", fontSize: 20, fontWeight: 700 } }, "GET TO KNOW ME"),
        h("div", { style: { color: "#aaa", fontSize: 11, letterSpacing: 2 } }, "• INTERACTIVE & ACCESSIBLE •"),
      ),
      h("div", {
        style: {
          background: "#f5c842",
          borderRadius: 99,
          padding: "10px 22px",
          color: "#0a0a0a",
          fontSize: 14,
          fontWeight: 700,
          display: "flex",
        },
      }, "OPEN PROFILE ▶"),
    ),
    // Gradient body
    h("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        background: "linear-gradient(135deg, #e8f4ff 0%, #f0e8ff 30%, #fff8e8 60%, #ffe8f0 100%)",
        padding: "20px 32px 12px",
        gap: 14,
      },
    },
      ...bodyChildren,
    ),
    // Footer
    h("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        height: 40,
        flexShrink: 0,
      },
    },
      h("div", { style: { fontSize: 12, color: "#888", fontWeight: 600 } }, "🔗 InSync Profiles · insyncprofiles.net"),
    ),
  );
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const q = Object.fromEntries(url.searchParams.entries());

  const name = q.name || "Support Worker";
  const title = q.title || "Support Worker";
  const location = q.location || "";
  const tagline = q.tagline || "";
  const photoUrl = q.photo || "";
  const videoUrl = q.video || "";
  const servicesRaw = q.services || "";
  const badgesRaw = q.badges || "";

  const services = servicesRaw.split(",").filter(Boolean).slice(0, 5)
    .map(s => SERVICE_MAP[s.trim()] || { emoji: "✨", label: s.trim() });

  const badges = badgesRaw.split("|").filter(Boolean).slice(0, 6);

  // Fetch images in parallel
  const [photoDataUrl, thumbDataUrl] = await Promise.all([
    photoUrl ? fetchAsBase64(photoUrl) : Promise.resolve(null),
    videoUrl ? (async () => {
      const ytId = getYouTubeId(videoUrl);
      return ytId ? fetchAsBase64(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`) : null;
    })() : Promise.resolve(null),
  ]);

  try {
    const card = buildCard({ name, title, location, tagline, photoDataUrl, thumbDataUrl, services, badges });

    return new ImageResponse(card, {
      width: 900,
      height: 1125,
    });
  } catch (err) {
    console.error("OG image generation failed:", err?.message || err);
    // Fallback: redirect to default OG image
    return Response.redirect("https://insyncprofiles.net/og-image.png", 302);
  }
}
