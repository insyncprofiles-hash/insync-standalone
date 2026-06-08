/**
 * Cloudflare Pages Function: /api/og-image
 * Generates a dynamic PNG profile card matching the Jordan Mitchell reference design.
 */

import { ImageResponse } from "./vercel-og-bundle.js";

const SERVICE_MAP = {
  "personal-care":   { symbol: "♥", color: "#E57373", label: "Personal Care",       bg: "#FFF3E0" },
  "emotional":       { symbol: "✦", color: "#66BB6A", label: "Emotional Support",   bg: "#E8F5E9" },
  "community":       { symbol: "◉", color: "#7E57C2", label: "Community Access",    bg: "#EDE7F6" },
  "mental":          { symbol: "◈", color: "#42A5F5", label: "Mental Wellbeing",    bg: "#E3F2FD" },
  "daily-living":    { symbol: "▣", color: "#FFA726", label: "Daily Living",        bg: "#FFF8E1" },
  "transport":       { symbol: "▶", color: "#29B6F6", label: "Transport",           bg: "#E3F2FD" },
  "social-skills":   { symbol: "◆", color: "#AB47BC", label: "Social Skills",       bg: "#F3E5F5" },
  "therapy-assist":  { symbol: "✦", color: "#EC407A", label: "Therapy Assist",      bg: "#FCE4EC" },
  "behaviour":       { symbol: "◉", color: "#5C6BC0", label: "Behaviour Support",   bg: "#E8EAF6" },
  "domestic":        { symbol: "⌂", color: "#66BB6A", label: "Domestic Assist",     bg: "#F1F8E9" },
  "overnight":       { symbol: "★", color: "#5C6BC0", label: "Overnight Support",   bg: "#E8EAF6" },
  "high-care":       { symbol: "✚", color: "#EC407A", label: "High Care",           bg: "#FCE4EC" },
};

const BADGE_ICON = {
  "NDIS Worker Check":                { s: "◈", c: "#1565C0" },
  "NDIS Worker Screened":             { s: "◈", c: "#1565C0" },
  "First Aid Certified":              { s: "✚", c: "#C62828" },
  "Police Check":                     { s: "◉", c: "#37474F" },
  "Working With Children Check":      { s: "★", c: "#F57F17" },
  "Mental Health Support":            { s: "♥", c: "#6A1B9A" },
  "Mental Health First Aid":          { s: "♥", c: "#6A1B9A" },
  "Public Liability Insurance":       { s: "▣", c: "#2E7D32" },
  "Professional Indemnity Insurance": { s: "◆", c: "#1B5E20" },
  "Certificate III":                  { s: "◈", c: "#E65100" },
  "Certificate IV":                   { s: "◈", c: "#BF360C" },
};

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

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

function buildCard({ name, title, location, tagline, photoDataUrl, thumbDataUrl, services, badges }) {
  const W = 900;
  const H = 1125;

  // ── Service chips (small emoji to stay under CF CPU budget) ─────────────────
  const serviceChips = services.slice(0, 5).map(s =>
    h("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        flex: 1,
      },
    },
      h("div", {
        style: {
          width: 82,
          height: 82,
          borderRadius: 41,
          background: s.bg || "#F5F5F5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: s.color || "#555",
          fontWeight: 700,
          fontSize: 36,
        },
      }, s.symbol || "•"),
      h("div", {
        style: {
          fontSize: 12,
          color: "#333",
          textAlign: "center",
          fontWeight: 600,
          lineHeight: 1.3,
        },
      }, s.label),
    )
  );

  // ── Badge rows (simplified — no nested border elements, just flat rows) ────
  const badgeList = badges.slice(0, 6);
  const badgeRows = [];
  for (let i = 0; i < badgeList.length; i += 2) {
    const left = badgeList[i];
    const right = badgeList[i + 1];
    const checkColors = ["#4CAF50", "#F5C842", "#4CAF50", "#F5C842", "#4CAF50", "#F5C842"];
    const checkSymbols = ["✓", "★", "✓", "★", "✓", "★"];

    const makeBadge = (label, idx) =>
      h("div", {
        style: {
          display: "flex",
          alignItems: "center",
          flex: 1,
          gap: 10,
          background: "rgba(255,255,255,0.85)",
          borderRadius: 10,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "#E0E0E0",
          paddingTop: 11,
          paddingBottom: 11,
          paddingLeft: 13,
          paddingRight: 13,
        },
      },
        h("span", { style: { fontSize: 18, flexShrink: 0, color: (BADGE_ICON[label] || {}).c || "#555", fontWeight: 700 } }, (BADGE_ICON[label] || {}).s || "\u25C9"),
        h("span", { style: { fontSize: 13, color: "#222", fontWeight: 600, flex: 1, lineHeight: 1.3 } }, label),
        h("span", { style: { fontSize: 17, color: checkColors[idx] || "#4CAF50", flexShrink: 0 } }, checkSymbols[idx] || "✓"),
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
        h("img", { src: photoDataUrl, width: 170, height: 170, style: { objectFit: "cover" } })
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
          height: 195,
          flexShrink: 0,
          borderWidth: 3,
          borderStyle: "solid",
          borderColor: "#A78BFA",
        },
      },
        h("img", { src: thumbDataUrl, width: W - 60, height: 195, style: { objectFit: "cover", width: "100%", height: "100%" } }),
        h("div", {
          style: {
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.28)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        },
          h("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 10 } },
            h("div", {
              style: {
                width: 64,
                height: 64,
                borderRadius: 32,
                background: "#F5C842",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                color: "#1a1a1a",
                fontWeight: 700,
              },
            }, "▶"),
            h("div", {
              style: {
                background: "rgba(0,0,0,0.72)",
                borderRadius: 20,
                paddingTop: 6,
                paddingBottom: 6,
                paddingLeft: 18,
                paddingRight: 18,
                display: "flex",
                alignItems: "center",
              },
            },
              h("span", { style: { fontSize: 13, color: "#F5C842", fontWeight: 700, letterSpacing: 1 } }, "▶ WATCH INTRO"),
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
        }, `"${tagline.slice(0, 140)}${tagline.length > 140 ? "…" : ""}"`)
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
      background: "#D0D0D0",
    },
  },
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
            h("div", { style: { color: "#F5C842", fontSize: 28, fontWeight: 800, letterSpacing: 1 } }, "GET TO KNOW ME"),
            h("div", { style: { color: "#aaaaaa", fontSize: 11, letterSpacing: 3, fontWeight: 600 } }, "• INTERACTIVE & ACCESSIBLE •"),
          ),
        ),
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
          h("div", { style: { color: "#0a0a0a", fontSize: 17, fontWeight: 800, letterSpacing: 0.5 } }, "OPEN PROFILE ▶"),
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
          paddingBottom: 24,
          paddingLeft: 30,
          paddingRight: 30,
          gap: 0,
          justifyContent: "space-between",
        },
      },
        // ── Name row ─────────────────────────────────────────────────────────
        h("div", { style: { display: "flex", alignItems: "center", gap: 28, flexShrink: 0 } },
          photoEl,
          h("div", { style: { display: "flex", flexDirection: "column", gap: 6 } },
            h("div", { style: { fontSize: 52, fontWeight: 700, color: "#1a2a4a", lineHeight: 1.1 } }, name),
            h("div", { style: { fontSize: 15, fontWeight: 700, color: "#2dd4bf", letterSpacing: 4, marginTop: 2 } }, title.toUpperCase()),
            location
              ? h("div", { style: { display: "flex", alignItems: "center", gap: 6, fontSize: 15, color: "#555", marginTop: 6 } },
                  h("span", { style: { fontSize: 18 } }, "📍"),
                  h("span", {}, location),
                )
              : null,
          ),
        ),

        // ── Services row ─────────────────────────────────────────────────────
        services.length > 0
          ? h("div", { style: { display: "flex", justifyContent: "space-around", flexShrink: 0 } }, ...serviceChips)
          : null,

        // ── Video thumbnail ───────────────────────────────────────────────────
        videoEl,

        // ── Tagline ───────────────────────────────────────────────────────────
        taglineEl,

        // ── Credentials section ────────────────────────────────────────────────
        badges.length > 0
          ? h("div", { style: { display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 } },
              h("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
                h("span", { style: { fontSize: 22 } }, "🏅"),
                h("span", { style: { fontSize: 16, color: "#1a2a4a", fontWeight: 800, letterSpacing: 1 } }, "CREDENTIALS & BADGES"),
                h("span", { style: { fontSize: 13, color: "#888", fontStyle: "italic" } }, "(Self-Reported)"),
              ),
              ...badgeRows,
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
          return ytId ? fetchAsBase64(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`) : null;
        })()
      : Promise.resolve(null),
  ]);

  try {
    const card = buildCard({ name, title, location, tagline, photoDataUrl, thumbDataUrl, services, badges });
    const imgResponse = new ImageResponse(card, { width: 900, height: 1125 });
    const bodyBytes = await imgResponse.arrayBuffer();
    return new Response(bodyBytes, {
      status: 200,
      headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=3600" },
    });
  } catch (err) {
    const errMsg = err?.message || String(err);
    console.error("OG image generation failed:", errMsg);
    if (q.debug === '1') {
      return new Response(`ERROR: ${errMsg}\n\nSTACK:\n${err?.stack || ''}`, {
        status: 500,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
    return Response.redirect("https://insyncprofiles.net/og-image.png", 302);
  }
}
