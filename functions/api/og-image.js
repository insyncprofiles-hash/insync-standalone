/**
 * Cloudflare Pages Function: /api/og-image
 *
 * Generates a dynamic PNG profile card for Facebook/LinkedIn OG previews.
 * Uses satori (JSX→SVG) + resvg-wasm (SVG→PNG) — both edge-compatible.
 *
 * Called automatically by the /view page server-side meta injection.
 */

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
  const match = url.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

async function fetchAsBase64(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    const b64 = btoa(binary);
    const ct = res.headers.get("content-type") || "image/jpeg";
    return `data:${ct};base64,${b64}`;
  } catch {
    return null;
  }
}

// Build the SVG string directly (no JSX needed in CF Workers)
function buildSVG(params) {
  const {
    name, title, location, tagline,
    photoDataUrl, thumbDataUrl,
    services, badges,
  } = params;

  const W = 900;
  const H = 1125;

  // Service icons row
  const serviceItems = services.slice(0, 5).map((s, i) => {
    const x = 40 + i * 164;
    return `
      <rect x="${x}" y="235" width="80" height="80" rx="40" fill="rgba(255,255,255,0.8)"/>
      <text x="${x + 40}" y="285" font-size="36" text-anchor="middle" dominant-baseline="middle">${s.emoji}</text>
      <text x="${x + 40}" y="332" font-size="13" text-anchor="middle" fill="#444" font-weight="600">${s.label}</text>
    `;
  }).join("");

  // Badge grid
  const badgeItems = badges.slice(0, 6).map((b, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 40 + col * 420;
    const y = 820 + row * 52;
    const icon = BADGE_ICON[b] || "✔";
    return `
      <rect x="${x}" y="${y}" width="400" height="44" rx="10" fill="rgba(255,255,255,0.85)"/>
      <text x="${x + 16}" y="${y + 26}" font-size="18" dominant-baseline="middle">${icon}</text>
      <text x="${x + 44}" y="${y + 26}" font-size="13" fill="#333" font-weight="600" dominant-baseline="middle">${b}</text>
    `;
  }).join("");

  // Video thumbnail section
  const videoSection = thumbDataUrl ? `
    <image href="${thumbDataUrl}" x="40" y="370" width="820" height="180" preserveAspectRatio="xMidYMid slice" clip-path="url(#videoClip)"/>
    <rect x="40" y="370" width="820" height="180" rx="14" fill="rgba(0,0,0,0.2)"/>
    <circle cx="450" cy="460" r="32" fill="#f5c842"/>
    <text x="450" y="460" font-size="22" text-anchor="middle" dominant-baseline="middle" fill="#0a0a0a">▶</text>
    <rect x="310" y="528" width="280" height="30" rx="15" fill="rgba(0,0,0,0.7)"/>
    <text x="450" y="543" font-size="13" text-anchor="middle" dominant-baseline="middle" fill="#f5c842" font-weight="700">▶ WATCH INTRO</text>
  ` : "";

  // Profile photo
  const photoSection = photoDataUrl ? `
    <circle cx="110" cy="145" r="64" fill="#f5c842"/>
    <circle cx="110" cy="145" r="60" fill="white"/>
    <image href="${photoDataUrl}" x="50" y="85" width="120" height="120" clip-path="url(#photoClip)" preserveAspectRatio="xMidYMid slice"/>
  ` : `
    <circle cx="110" cy="145" r="64" fill="#f5c842"/>
    <circle cx="110" cy="145" r="60" fill="#e0e0e0"/>
    <text x="110" y="145" font-size="48" text-anchor="middle" dominant-baseline="middle">👤</text>
  `;

  const taglineSection = tagline ? `
    <text x="450" y="${thumbDataUrl ? 580 : 390}" font-size="15" text-anchor="middle" fill="#444" font-style="italic">
      "${tagline.slice(0, 80)}${tagline.length > 80 ? "…" : ""}"
    </text>
    <text x="450" y="${thumbDataUrl ? 600 : 410}" font-size="15" text-anchor="middle" fill="#444" font-style="italic">
      ${tagline.length > 80 ? '"' + tagline.slice(80, 150) + (tagline.length > 150 ? "…\"" : '"') : ""}
    </text>
  ` : "";

  const credY = thumbDataUrl ? 630 : (tagline ? 440 : 390);

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}">
  <defs>
    <clipPath id="photoClip"><circle cx="110" cy="145" r="60"/></clipPath>
    <clipPath id="videoClip"><rect x="40" y="370" width="820" height="180" rx="14"/></clipPath>
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e8f4ff"/>
      <stop offset="30%" style="stop-color:#f0e8ff"/>
      <stop offset="60%" style="stop-color:#fff8e8"/>
      <stop offset="100%" style="stop-color:#ffe8f0"/>
    </linearGradient>
  </defs>

  <!-- Black banner -->
  <rect x="0" y="0" width="${W}" height="80" fill="#0a0a0a" rx="0"/>
  <text x="60" y="38" font-size="20" fill="#f5c842" font-weight="800" letter-spacing="1">GET TO KNOW ME</text>
  <text x="60" y="60" font-size="11" fill="#aaaaaa" letter-spacing="2">• INTERACTIVE &amp; ACCESSIBLE •</text>
  <rect x="660" y="20" width="210" height="40" rx="20" fill="#f5c842"/>
  <text x="765" y="40" font-size="14" text-anchor="middle" dominant-baseline="middle" fill="#0a0a0a" font-weight="800">OPEN PROFILE ▶</text>

  <!-- Body gradient -->
  <rect x="0" y="80" width="${W}" height="${H - 80}" fill="url(#bodyGrad)"/>

  <!-- Profile photo -->
  ${photoSection}

  <!-- Name, title, location -->
  <text x="210" y="120" font-size="44" fill="#1a2a4a" font-weight="700" font-family="serif">${name}</text>
  <text x="210" y="150" font-size="14" fill="#2dd4bf" font-weight="700" letter-spacing="3">${title.toUpperCase()}</text>
  ${location ? `<text x="210" y="178" font-size="14" fill="#555">📍 ${location}</text>` : ""}

  <!-- Services -->
  ${serviceItems}

  <!-- Video thumbnail -->
  ${videoSection}

  <!-- Tagline -->
  ${taglineSection}

  <!-- Credentials header -->
  <text x="40" y="${credY}" font-size="16" fill="#1a2a4a" font-weight="800" letter-spacing="1">🏅 CREDENTIALS &amp; BADGES</text>
  <text x="310" y="${credY}" font-size="12" fill="#888" font-style="italic"> (Self-Reported)</text>

  <!-- Badge grid -->
  ${badgeItems.replace(/820/g, String(credY + 10)).replace(/820 \+ row \* 52/g, "")}

  <!-- Footer -->
  <text x="450" y="${H - 20}" font-size="13" text-anchor="middle" fill="#888" font-weight="600">🔗 InSync Profiles · insyncprofiles.net</text>
</svg>`;
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
    // Dynamically import satori and resvg-wasm (edge-compatible)
    const { default: satori } = await import("satori");
    const { initWasm, Resvg } = await import("resvg-wasm");

    // Load WASM
    const wasmUrl = new URL("/resvg_wasm_bg.wasm", url.origin);
    const wasmRes = await fetch(wasmUrl);
    await initWasm(wasmRes);

    // Build card using satori with React-like element objects
    const svg = await satori(
      buildCardElement({ name, title, location, tagline, photoDataUrl, thumbDataUrl, services, badges }),
      {
        width: 900,
        height: 1125,
        fonts: [
          {
            name: "sans-serif",
            data: await (await fetch("https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2")).arrayBuffer(),
            weight: 400,
          },
          {
            name: "sans-serif",
            data: await (await fetch("https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiJ-Ek-_EeA.woff2")).arrayBuffer(),
            weight: 700,
          },
        ],
      }
    );

    const resvg = new Resvg(svg);
    const png = resvg.render().asPng();

    return new Response(png, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err) {
    console.error("OG image generation failed:", err);
    // Fallback: redirect to default OG image
    return Response.redirect("https://insyncprofiles.net/og-image.png", 302);
  }
}

function buildCardElement({ name, title, location, tagline, photoDataUrl, thumbDataUrl, services, badges }) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        width: 900,
        height: 1125,
        fontFamily: "sans-serif",
        background: "#fff",
      },
      children: [
        // Black top banner
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#0a0a0a",
              padding: "18px 28px",
              height: 80,
            },
            children: [
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column" },
                  children: [
                    { type: "div", props: { style: { color: "#f5c842", fontSize: 20, fontWeight: 800 }, children: "GET TO KNOW ME" } },
                    { type: "div", props: { style: { color: "#aaa", fontSize: 11, letterSpacing: 2 }, children: "• INTERACTIVE & ACCESSIBLE •" } },
                  ],
                },
              },
              {
                type: "div",
                props: {
                  style: { background: "#f5c842", borderRadius: 99, padding: "10px 22px", color: "#0a0a0a", fontSize: 14, fontWeight: 800 },
                  children: "OPEN PROFILE \u25b6",
                },
              },
            ],
          },
        },
        // Gradient body
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              flex: 1,
              background: "linear-gradient(135deg, #e8f4ff 0%, #f0e8ff 30%, #fff8e8 60%, #ffe8f0 100%)",
              padding: "24px 32px 16px",
              gap: 14,
            },
            children: [
              // Name row
              {
                type: "div",
                props: {
                  style: { display: "flex", alignItems: "center", gap: 20 },
                  children: [
                    photoDataUrl
                      ? { type: "div", props: { style: { width: 110, height: 110, borderRadius: 55, border: "4px solid #f5c842", overflow: "hidden", display: "flex" }, children: { type: "img", props: { src: photoDataUrl, style: { width: 110, height: 110, objectFit: "cover" } } } } }
                      : { type: "div", props: { style: { width: 110, height: 110, borderRadius: 55, border: "4px solid #f5c842", background: "#e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }, children: "\uD83D\uDC64" } },
                    {
                      type: "div",
                      props: {
                        style: { display: "flex", flexDirection: "column", gap: 4 },
                        children: [
                          { type: "div", props: { style: { fontSize: 40, fontWeight: 700, color: "#1a2a4a" }, children: name } },
                          { type: "div", props: { style: { fontSize: 13, fontWeight: 700, color: "#2dd4bf", letterSpacing: 3 }, children: title.toUpperCase() } },
                          location ? { type: "div", props: { style: { fontSize: 13, color: "#555", marginTop: 4 }, children: "\uD83D\uDCCD " + location } } : { type: "div", props: { style: { display: "none" }, children: "" } },
                        ],
                      },
                    },
                  ],
                },
              },
              // Services
              services.length > 0 ? {
                type: "div",
                props: {
                  style: { display: "flex", gap: 10 },
                  children: services.map(s => ({
                    type: "div",
                    props: {
                      style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 5, width: 156 },
                      children: [
                        { type: "div", props: { style: { width: 52, height: 52, borderRadius: 26, background: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }, children: s.emoji } },
                        { type: "div", props: { style: { fontSize: 11, color: "#444", textAlign: "center", fontWeight: 600 }, children: s.label } },
                      ],
                    },
                  })),
                },
              } : { type: "div", props: { style: { display: "none" }, children: "" } },
              // Video thumbnail
              thumbDataUrl ? {
                type: "div",
                props: {
                  style: { display: "flex", position: "relative", borderRadius: 12, overflow: "hidden", height: 155 },
                  children: [
                    { type: "img", props: { src: thumbDataUrl, style: { width: "100%", height: 155, objectFit: "cover" } } },
                    { type: "div", props: { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.2)" }, children: { type: "div", props: { style: { width: 52, height: 52, borderRadius: 26, background: "#f5c842", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#0a0a0a" }, children: "\u25b6" } } } },
                    { type: "div", props: { style: { position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.7)", borderRadius: 99, padding: "4px 14px", color: "#f5c842", fontSize: 11, fontWeight: 700 }, children: "\u25b6 WATCH INTRO" } },
                  ],
                },
              } : { type: "div", props: { style: { display: "none" }, children: "" } },
              // Tagline
              tagline ? { type: "div", props: { style: { fontSize: 14, color: "#444", fontStyle: "italic", textAlign: "center", lineHeight: 1.5 }, children: `"${tagline.slice(0, 130)}${tagline.length > 130 ? "\u2026" : ""}"` } } : { type: "div", props: { style: { display: "none" }, children: "" } },
              // Credentials
              badges.length > 0 ? {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", gap: 8 },
                  children: [
                    { type: "div", props: { style: { display: "flex", alignItems: "center", gap: 8 }, children: [{ type: "div", props: { style: { fontSize: 14 }, children: "\uD83C\uDFC5" } }, { type: "div", props: { style: { fontSize: 13, fontWeight: 800, color: "#1a2a4a", letterSpacing: 1 }, children: "CREDENTIALS & BADGES" } }, { type: "div", props: { style: { fontSize: 11, color: "#888", fontStyle: "italic" }, children: "(Self-Reported)" } }] } },
                    {
                      type: "div",
                      props: {
                        style: { display: "flex", flexWrap: "wrap", gap: 8 },
                        children: badges.map(b => ({
                          type: "div",
                          props: {
                            style: { display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.85)", borderRadius: 10, padding: "7px 12px", fontSize: 12, color: "#333", fontWeight: 600, width: "calc(50% - 4px)" },
                            children: [{ type: "div", props: { style: { fontSize: 14 }, children: BADGE_ICON[b] || "\u2714" } }, { type: "div", props: { children: b } }],
                          },
                        })),
                      },
                    },
                  ],
                },
              } : { type: "div", props: { style: { display: "none" }, children: "" } },
              // Footer
              { type: "div", props: { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: "auto" }, children: [{ type: "div", props: { style: { fontSize: 13, color: "#888", fontWeight: 600 }, children: "\uD83D\uDD17 InSync Profiles \u00b7 insyncprofiles.net" } }] } },
            ],
          },
        },
      ],
    },
  };
}
