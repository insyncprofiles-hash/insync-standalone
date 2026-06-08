/**
 * Cloudflare Pages Function: /api/og-image
 * Simplified profile card: banner + name/title/location + services + tagline + CTA
 */

import { ImageResponse } from "./vercel-og-bundle.js";

const SERVICE_MAP = {
  "personal-care":  { symbol: "\u2665", color: "#E57373", label: "Personal Care",     bg: "#FFF3E0" },
  "emotional":      { symbol: "\u2665", color: "#66BB6A", label: "Emotional Support", bg: "#E8F5E9" },
  "community":      { symbol: "\u25B6", color: "#7E57C2", label: "Community Access",  bg: "#EDE7F6" },
  "mental":         { symbol: "\u2665", color: "#42A5F5", label: "Mental Wellbeing",  bg: "#E3F2FD" },
  "daily-living":   { symbol: "\u25B6", color: "#FFA726", label: "Daily Living",      bg: "#FFF8E1" },
  "transport":      { symbol: "\u25B6", color: "#29B6F6", label: "Transport",         bg: "#E3F2FD" },
  "social-skills":  { symbol: "\u2665", color: "#AB47BC", label: "Social Skills",     bg: "#F3E5F5" },
  "therapy-assist": { symbol: "\u2665", color: "#EC407A", label: "Therapy Assist",    bg: "#FCE4EC" },
  "behaviour":      { symbol: "\u25B6", color: "#5C6BC0", label: "Behaviour Support", bg: "#E8EAF6" },
  "domestic":       { symbol: "\u25B6", color: "#66BB6A", label: "Domestic Assist",   bg: "#F1F8E9" },
  "overnight":      { symbol: "\u2665", color: "#5C6BC0", label: "Overnight Support", bg: "#E8EAF6" },
  "high-care":      { symbol: "\u2665", color: "#EC407A", label: "High Care",         bg: "#FCE4EC" },
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
  const photoEl = photoDataUrl
    ? h("div", {
        style: {
          width: 160,
          height: 160,
          borderRadius: 80,
          borderWidth: 5,
          borderStyle: "solid",
          borderColor: "#D4A017",
          overflow: "hidden",
          display: "flex",
          flexShrink: 0,
        },
      },
        h("img", { src: photoDataUrl, width: 160, height: 160, style: { objectFit: "cover" } })
      )
    : h("div", {
        style: {
          width: 160,
          height: 160,
          borderRadius: 80,
          borderWidth: 5,
          borderStyle: "solid",
          borderColor: "#D4A017",
          background: "#c8d8e8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 72,
          flexShrink: 0,
          color: "#5a7a9a",
        },
      }, "\u{1F464}");

  // ── Service chips ─────────────────────────────────────────────────────────
  const chips = services.slice(0, 5).map(s =>
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
          fontSize: 38,
          color: s.color || "#555",
          fontWeight: 700,
        },
      }, s.symbol || "\u25CF"),
      h("div", {
        style: {
          fontSize: 14,
          color: "#333",
          textAlign: "center",
          fontWeight: 600,
          lineHeight: 1.3,
        },
      }, s.label),
    )
  );

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
          paddingTop: 20,
          paddingBottom: 20,
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
          background: "linear-gradient(135deg, #dbeeff 0%, #e8d8ff 30%, #fff5d8 60%, #ffd8e8 80%, #ffe8c8 100%)",
          paddingTop: 36,
          paddingBottom: 36,
          paddingLeft: 40,
          paddingRight: 40,
          justifyContent: "space-between",
        },
      },

        // ── Name row ─────────────────────────────────────────────────────
        h("div", { style: { display: "flex", alignItems: "center", gap: 32, flexShrink: 0 } },
          photoEl,
          h("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
            h("div", { style: { fontSize: 58, fontWeight: 700, color: "#1a2a4a", lineHeight: 1.1 } }, name),
            h("div", { style: { fontSize: 16, fontWeight: 700, color: "#2dd4bf", letterSpacing: 4 } }, title.toUpperCase()),
            location
              ? h("div", { style: { display: "flex", alignItems: "center", gap: 8, fontSize: 16, color: "#555", marginTop: 4 } },
                  h("span", { style: { color: "#E57373", fontWeight: 700 } }, "-"),
                  h("span", {}, location),
                )
              : null,
          ),
        ),

        // ── Services row ─────────────────────────────────────────────────
        services.length > 0
          ? h("div", { style: { display: "flex", justifyContent: "space-around", flexShrink: 0 } }, ...chips)
          : null,

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
              gap: 12,
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
    .map(s => SERVICE_MAP[s.trim()] || { symbol: "\u25CF", color: "#888", label: s.trim(), bg: "#F5F5F5" });

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
