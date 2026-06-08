/**
 * Cloudflare Pages Function: /api/og-image
 * Simplified profile card: banner + name/title/location + services (text chips) + tagline + CTA
 */

import { ImageResponse } from "./vercel-og-bundle.js";

const SERVICE_MAP = {
  "personal-care":  { color: "#E57373", bg: "#FFF3E0", label: "Personal Care" },
  "emotional":      { color: "#66BB6A", bg: "#E8F5E9", label: "Emotional Support" },
  "community":      { color: "#7E57C2", bg: "#EDE7F6", label: "Community Access" },
  "mental":         { color: "#42A5F5", bg: "#E3F2FD", label: "Mental Wellbeing" },
  "daily-living":   { color: "#FFA726", bg: "#FFF8E1", label: "Daily Living" },
  "transport":      { color: "#29B6F6", bg: "#E1F5FE", label: "Transport" },
  "social-skills":  { color: "#AB47BC", bg: "#F3E5F5", label: "Social Skills" },
  "therapy-assist": { color: "#EC407A", bg: "#FCE4EC", label: "Therapy Assist" },
  "behaviour":      { color: "#5C6BC0", bg: "#E8EAF6", label: "Behaviour Support" },
  "domestic":       { color: "#66BB6A", bg: "#F1F8E9", label: "Domestic Assist" },
  "overnight":      { color: "#5C6BC0", bg: "#E8EAF6", label: "Overnight Support" },
  "high-care":      { color: "#EC407A", bg: "#FCE4EC", label: "High Care" },
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

function buildCard({ name, title, location, tagline, photoDataUrl, services }) {
  // ── Photo element ─────────────────────────────────────────────────────────
  const PHOTO_SIZE = 190;
  const photoEl = photoDataUrl
    ? h("div", {
        style: {
          width: PHOTO_SIZE,
          height: PHOTO_SIZE,
          borderRadius: PHOTO_SIZE / 2,
          borderWidth: 5,
          borderStyle: "solid",
          borderColor: "#D4A017",
          overflow: "hidden",
          display: "flex",
          flexShrink: 0,
        },
      },
        h("img", { src: photoDataUrl, width: PHOTO_SIZE, height: PHOTO_SIZE, style: { objectFit: "cover", objectPosition: "center top" } })
      )
    : h("div", {
        style: {
          width: PHOTO_SIZE,
          height: PHOTO_SIZE,
          borderRadius: PHOTO_SIZE / 2,
          borderWidth: 5,
          borderStyle: "solid",
          borderColor: "#D4A017",
          background: "#c8d8e8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 64,
          flexShrink: 0,
          color: "#5a7a9a",
        },
      }, "\u{1F464}");

  // ── Text-only service chips — cycling blue / green / gold ──────────────────
  const CHIP_PALETTE = [
    { border: "#1E88E5", bg: "rgba(30,136,229,0.12)", text: "#1565C0" },  // blue
    { border: "#2E7D32", bg: "rgba(46,125,50,0.12)",  text: "#1B5E20" },  // green
    { border: "#D4A017", bg: "rgba(212,160,23,0.12)", text: "#7B5800" },  // gold
  ];
  const chips = services.slice(0, 5).map((s, i) => {
    const p = CHIP_PALETTE[i % 3];
    return h("div", {
      style: {
        display: "flex",
        alignItems: "center",
        background: p.bg,
        borderRadius: 16,
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 18,
        paddingRight: 18,
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: p.border,
      },
    },
      h("div", {
        style: {
          fontSize: 15,
          color: p.text,
          fontWeight: 700,
          letterSpacing: 0.3,
        },
      }, s.label),
    );
  });

  return h("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      width: 900,
      height: 900,
      fontFamily: "sans-serif",
      background: "#D0D0D0",
    },
  },
    // Outer card with rounded corners
    h("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        margin: 18,
        borderRadius: 28,
        overflow: "hidden",
        background: "white",
      },
    },

      // ── TOP BANNER ────────────────────────────────────────────────────────
      h("div", {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#0a0a0a",
          paddingTop: 22,
          paddingBottom: 22,
          paddingLeft: 30,
          paddingRight: 30,
          flexShrink: 0,
        },
      },
        // Left: icon + title
        h("div", { style: { display: "flex", alignItems: "center", gap: 14 } },
          h("div", {
            style: {
              width: 52,
              height: 52,
              borderRadius: 26,
              borderWidth: 2,
              borderStyle: "solid",
              borderColor: "#F5C842",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              flexShrink: 0,
              color: "#F5C842",
            },
          }, "\u267F"),
          h("div", { style: { display: "flex", flexDirection: "column", gap: 3 } },
            h("div", { style: { color: "#F5C842", fontSize: 30, fontWeight: 800, letterSpacing: 1 } }, "GET TO KNOW ME"),
            h("div", { style: { color: "#aaaaaa", fontSize: 11, letterSpacing: 3, fontWeight: 600 } }, "\u2022 INTERACTIVE & ACCESSIBLE \u2022"),
          ),
        ),
        // Right: CTA button
        h("div", {
          style: {
            background: "#F5C842",
            borderRadius: 50,
            paddingTop: 14,
            paddingBottom: 14,
            paddingLeft: 28,
            paddingRight: 28,
            display: "flex",
            alignItems: "center",
          },
        },
          h("div", { style: { color: "#0a0a0a", fontSize: 18, fontWeight: 800, letterSpacing: 0.5 } }, "OPEN PROFILE \u25B6"),
        ),
      ),

      // ── GRADIENT BODY ─────────────────────────────────────────────────────
      h("div", {
        style: {
          display: "flex",
          flexDirection: "column",
          flex: 1,
          background: "linear-gradient(180deg, #dbeeff 0%, #c8d8ff 35%, #fff0c0 70%, #ffe8a0 100%)",
          paddingTop: 32,
          paddingBottom: 32,
          paddingLeft: 44,
          paddingRight: 44,
          gap: 28,
          justifyContent: "space-between",
        },
      },

        // ── Main content row: left col (photo + name/title/location) | right col (chips) ──
        h("div", { style: { display: "flex", alignItems: "center", gap: 40, flexShrink: 0 } },

          // Left column: photo stacked above name/title/location
          h("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16, flexShrink: 0, width: 240 } },
            photoEl,
            h("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textAlign: "center" } },
              h("div", { style: { fontSize: 52, fontWeight: 900, color: "#1a1a3a", lineHeight: 1.0 } }, name),
              h("div", { style: { fontSize: 15, fontWeight: 800, color: "#0e9488", letterSpacing: 4, marginTop: 4 } }, title.toUpperCase()),
              location
                ? h("div", { style: { display: "flex", alignItems: "center", gap: 6, fontSize: 15, color: "#333", marginTop: 4 } },
                    h("span", { style: { color: "#1E88E5", fontWeight: 800, fontSize: 18 } }, "-"),
                    h("span", { style: { fontWeight: 600 } }, location),
                  )
                : null,
            ),
          ),

          // Right column: service chips as vertical list
          services.length > 0
            ? h("div", {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  flex: 1,
                },
              }, ...chips)
            : null,
        ),

        // ── Tagline ───────────────────────────────────────────────────────
        tagline
          ? h("div", {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              },
            },
              h("div", {
                style: {
                  fontSize: 20,
                  color: "#444",
                  fontStyle: "italic",
                  textAlign: "center",
                  lineHeight: 1.6,
                },
              }, `"${tagline.slice(0, 160)}${tagline.length > 160 ? "\u2026" : ""}"`)
            )
          : null,

        // ── Bottom CTA bar ────────────────────────────────────────────────
        h("div", {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          },
        },
          h("div", {
            style: {
              background: "#F5C842",
              borderRadius: 50,
              paddingTop: 18,
              paddingBottom: 18,
              paddingLeft: 60,
              paddingRight: 60,
              display: "flex",
              alignItems: "center",
            },
          },
            h("div", { style: { color: "#0a0a0a", fontSize: 22, fontWeight: 800, letterSpacing: 1 } }, "OPEN PROFILE \u25B6"),
          ),
        ),

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

  const services = servicesRaw.split(",").filter(Boolean).slice(0, 5)
    .map(s => SERVICE_MAP[s.trim()] || { color: "#7E57C2", bg: "#EDE7F6", label: s.trim() });

  const photoDataUrl = photoUrl ? await fetchAsBase64(photoUrl) : null;

  try {
    const card = buildCard({ name, title, location, tagline, photoDataUrl, services });
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
