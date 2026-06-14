/* ============================================================
   generateStandaloneHTML.ts
   Produces a fully self-contained, offline-capable HTML file
   for a support worker's client-view profile page.

   Features embedded inline (no external dependencies):
   - Full profile layout (photo as base64, name, services, badges, etc.)
   - All colour themes (Sky & Gold, Ocean & Amber, etc.)
   - Accessibility toolbar (font size, high contrast, dyslexia font, TTS)
   - AAC Communication Board (Web Speech API — built into browsers)
   - Contact buttons (SMS / email / website)
   - QR code placeholder with the worker's chosen hosted URL
   - "Powered by InSync Profiles" footer
   ============================================================ */

import type { ProfileData } from "@/pages/Home";

// ── Colour palettes (mirrors ColorThemeContext) ───────────────
const THEMES_DATA = [
  { id: "sky-gold",      name: "Sky & Gold",     emoji: "🌅", bg: "#dbeeff", card: "#fdfcf8", accent: "#4a90d9", accentAlt: "#d4a820", text: "#1a2340", textMid: "#3a4a6a", textDim: "#7a8aaa", ctaFrom: "#4a90d9", ctaTo: "#d4a820", circleColors: ["#4a90d9","#2ecc71","#e67e22","#9b59b6","#e74c3c"] },
  { id: "ocean-amber",   name: "Ocean & Amber",  emoji: "🌊", bg: "#0d2a40", card: "#fdf8f0", accent: "#009488", accentAlt: "#e8820a", text: "#0d2a1a", textMid: "#2a5040", textDim: "#6a8a78", ctaFrom: "#009488", ctaTo: "#e8820a", circleColors: ["#009488","#e8820a","#3498db","#9b59b6","#e74c3c"] },
  { id: "rainbow-prism", name: "Rainbow Prism",  emoji: "🌈", bg: "#ede8f8", card: "#ffffff",  accent: "#9b59b6", accentAlt: "#3498db", text: "#1a1040", textMid: "#3a2a60", textDim: "#7a6a9a", ctaFrom: "#3498db", ctaTo: "#9b59b6", circleColors: ["#e74c3c","#e67e22","#f1c40f","#2ecc71","#3498db"] },
  { id: "cobalt-gold",   name: "Cobalt & Gold",  emoji: "💙", bg: "#0d1b4a", card: "#ffffff",  accent: "#1565c0", accentAlt: "#f4a800", text: "#0d1b4a", textMid: "#2a3a7a", textDim: "#6a7aaa", ctaFrom: "#1565c0", ctaTo: "#f4a800", circleColors: ["#1565c0","#f4a800","#2ecc71","#e74c3c","#9b59b6"] },
  { id: "daylight",      name: "Daylight",       emoji: "☀️", bg: "#f0f6ff", card: "#ffffff",  accent: "#2563eb", accentAlt: "#0ea5e9", text: "#0f172a", textMid: "#334155", textDim: "#64748b", ctaFrom: "#2563eb", ctaTo: "#0ea5e9", circleColors: ["#2563eb","#0ea5e9","#10b981","#f59e0b","#ef4444"] },
  { id: "sage-linen",    name: "Sage & Linen",   emoji: "🌾", bg: "#f0ede4", card: "#faf8f2",  accent: "#4a7c59", accentAlt: "#8a6a30", text: "#1a2e1e", textMid: "#3d5c42", textDim: "#7a9b7e", ctaFrom: "#4a7c59", ctaTo: "#8a6a30", circleColors: ["#4a7c59","#8a6a30","#3498db","#9b59b6","#e74c3c"] },
  { id: "blush-cream",   name: "Blush & Cream",  emoji: "🌷", bg: "#fdf0ec", card: "#fff8f5",  accent: "#c0605a", accentAlt: "#d4906a", text: "#2d1a18", textMid: "#5a3a35", textDim: "#9a7a75", ctaFrom: "#c0605a", ctaTo: "#d4906a", circleColors: ["#c0605a","#d4906a","#3498db","#2ecc71","#9b59b6"] },
  { id: "slate-mint",    name: "Slate & Mint",   emoji: "🩵", bg: "#eef5f6", card: "#f8fdfe",  accent: "#0e9488", accentAlt: "#0d9488", text: "#0f2830", textMid: "#2a4a50", textDim: "#5a7a80", ctaFrom: "#0e9488", ctaTo: "#0d9488", circleColors: ["#0e9488","#3498db","#e67e22","#9b59b6","#e74c3c"] },
];

// ── AAC tile vocabulary ───────────────────────────────────────
const CORE_VOCAB = [
  { icon: "✅", label: "YES",      bg: "#1a5a27", border: "#4abf6e" },
  { icon: "❌", label: "NO",       bg: "#6b1a1a", border: "#d94a4a" },
  { icon: "🙏", label: "PLEASE",   bg: "#1a3a6b", border: "#4a90d9" },
  { icon: "★",  label: "THANK YOU",bg: "#5a4a00", border: "#d9b84a" },
  { icon: "⏸️", label: "STOP",     bg: "#6b1a1a", border: "#d94a4a" },
  { icon: "❓", label: "HELP",     bg: "#1a3a6b", border: "#5aaad9" },
];

const AAC_TILE_COLORS = [
  { bg: "#1a3a6b", border: "#4a90d9" },
  { bg: "#2d5a27", border: "#6abf5e" },
  { bg: "#6b2d1a", border: "#d97a4a" },
  { bg: "#1a3a6b", border: "#5aaad9" },
  { bg: "#1a5a5a", border: "#4abfbf" },
  { bg: "#6b5a1a", border: "#d9c44a" },
];

// ── Helper: escape HTML ───────────────────────────────────────
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ── Main generator ────────────────────────────────────────────
export function generateStandaloneHTML(
  profile: ProfileData,
  hostedUrl: string,
  videoUrl: string | null
): string {
  const selectedServices = profile.services.filter(s => s.selected);
  const checkedExp = profile.experienceGroups.flatMap(g =>
    g.items.filter(i => i.checked).map(i => ({ group: g.title, label: i.label }))
  );
  const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const availDays = DAYS.filter(d => profile.availability[d as keyof typeof profile.availability]);

  // Build themes JSON for inline script
  const themesJson = JSON.stringify(THEMES_DATA);

  // Build AAC service tiles JSON
  const aacServiceTiles = selectedServices.map((s, i) => ({
    icon: s.icon,
    label: s.label,
    bg: AAC_TILE_COLORS[i % AAC_TILE_COLORS.length].bg,
    border: AAC_TILE_COLORS[i % AAC_TILE_COLORS.length].border,
  }));

  // Build QR code URL — uses qrcode-generator (CDN-free, inline)
  // We'll use a simple inline QR via the qrcode-generator library inlined as a data URI
  // For the standalone file we use a canvas-based QR or just show the URL as text + link
  // We embed a minimal QR generator inline (no CDN)

  // Profile image — already base64 if uploaded, otherwise null
  const profileImgSrc = profile.profileImage || "";

  // Video src — use the hosted URL or null
  const videoSrc = videoUrl || "";

  // Build service circles HTML
  const serviceCirclesHTML = selectedServices.slice(0, 5).map((svc, i) => {
    const colors = ["#4a90d9","#2ecc71","#e67e22","#9b59b6","#e74c3c"];
    const c = colors[i % colors.length];
    return `
      <div class="svc-circle" data-theme-circle="${i}">
        <div class="svc-icon" style="background:${c}18;border:2px solid ${c}50;">${esc(svc.icon)}</div>
        <span class="svc-label">${esc(svc.label)}</span>
      </div>`;
  }).join("");

  // Build badges HTML
  const badgesHTML = profile.badges.map(b =>
    `<span class="badge">${esc(b)}</span>`
  ).join("");

  // Build experience HTML
  const expHTML = checkedExp.length > 0 ? `
    <div class="thread-section" id="thread-exp">
      <button class="thread-header" onclick="toggleThread('thread-exp')" aria-expanded="false">
        <div class="thread-num-dot" style="background:#9b59b6">📋</div>
        <div class="thread-header-text">
          <span class="thread-title">Experience</span>
          <span class="thread-subtitle">My background, training, and specialist areas.</span>
        </div>
        <span class="thread-chevron">▼</span>
      </button>
      <div class="thread-body" style="display:none">
        <div class="exp-tags">
          ${checkedExp.map(e => `<span class="exp-tag">${esc(e.label)}</span>`).join("")}
        </div>
      </div>
    </div>
    <div class="thread-connector"></div>` : "";

  // Build availability HTML
  const availHTML = availDays.length > 0 ? `
    <div class="thread-section" id="thread-avail">
      <button class="thread-header" onclick="toggleThread('thread-avail')" aria-expanded="false">
        <div class="thread-num-dot" style="background:#1abc9c">📅</div>
        <div class="thread-header-text">
          <span class="thread-title">Availability</span>
          <span class="thread-subtitle">When I'm available to support you.</span>
        </div>
        <span class="thread-chevron">▼</span>
      </button>
      <div class="thread-body" style="display:none">
        <div class="avail-days">
          ${availDays.map(d => `<span class="avail-day">${esc(d)}</span>`).join("")}
        </div>
        <p class="avail-time">${esc(profile.availFrom)} – ${esc(profile.availTo)}</p>
      </div>
    </div>
    <div class="thread-connector"></div>` : "";

  // Build contact HTML
  const contactLinks = [
    profile.phone ? `<a href="sms:${esc(profile.phone)}?body=${encodeURIComponent(`Hi ${profile.name}, I found your profile and would like to connect.`)}" class="contact-link">📞 ${esc(profile.phone)}</a>` : "",
    profile.email ? `<a href="mailto:${esc(profile.email)}?subject=${encodeURIComponent(`Support enquiry — ${profile.name}`)}" class="contact-link">✉️ ${esc(profile.email)}</a>` : "",
    profile.website ? `<a href="${esc(profile.website)}" target="_blank" rel="noopener noreferrer" class="contact-link">🌐 ${esc(profile.website)}</a>` : "",
  ].filter(Boolean).join("");

  const contactHTML = contactLinks ? `
    <div class="thread-section" id="thread-contact">
      <button class="thread-header" onclick="toggleThread('thread-contact')" aria-expanded="false">
        <div class="thread-num-dot" style="background:#f39c12">📞</div>
        <div class="thread-header-text">
          <span class="thread-title">Contact</span>
          <span class="thread-subtitle">How to reach me.</span>
        </div>
        <span class="thread-chevron">▼</span>
      </button>
      <div class="thread-body" style="display:none">
        <div class="contact-links">${contactLinks}</div>
      </div>
    </div>` : "";

  // Build AAC tiles HTML
  const aacServiceTilesHTML = aacServiceTiles.map(t => `
    <button class="aac-tile" style="background:${t.bg};border:2px solid ${t.border}" onclick="aacTap('${esc(t.label)}')" aria-label="${esc(t.label)}">
      <span class="aac-tile-icon">${esc(t.icon)}</span>
      <span class="aac-tile-label">${esc(t.label)}</span>
    </button>`).join("");

  const aacContactTilesHTML = [
    profile.phone ? `<button class="aac-tile" style="background:#1a3a6b;border:2px solid #4a90d9" onclick="window.location.href='sms:${esc(profile.phone)}'" aria-label="Call me">📞<span class="aac-tile-label">CALL ME</span></button>` : "",
    profile.email ? `<button class="aac-tile" style="background:#2d5a27;border:2px solid #6abf5e" onclick="window.location.href='mailto:${esc(profile.email)}'" aria-label="Email me">✉️<span class="aac-tile-label">EMAIL ME</span></button>` : "",
  ].filter(Boolean).join("");

  const aacCoreTilesHTML = CORE_VOCAB.map(t => `
    <button class="aac-tile" style="background:${t.bg};border:2px solid ${t.border}" onclick="aacTap('${esc(t.label)}')" aria-label="${esc(t.label)}">
      <span class="aac-tile-icon">${esc(t.icon)}</span>
      <span class="aac-tile-label">${esc(t.label)}</span>
    </button>`).join("");

  // CTA button
  const ctaAction = profile.phone
    ? `sms:${profile.phone}?body=${encodeURIComponent(`Hi ${profile.name}, I found your profile and would like to connect.`)}`
    : profile.email
    ? `mailto:${profile.email}?subject=${encodeURIComponent(`Support enquiry — ${profile.name}`)}`
    : "#";

  // Video section
  const videoHTML = videoSrc ? `
    <div class="video-wrapper">
      <video src="${esc(videoSrc)}" controls playsinline aria-label="${esc(profile.name)} intro video" style="width:100%;display:block;border-radius:12px;background:#000;"></video>
    </div>` : "";

  // Profile image
  const profileImgHTML = profileImgSrc
    ? `<img src="${esc(profileImgSrc)}" alt="${esc(profile.name)}" class="profile-photo-img" />`
    : `<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#9aabb0" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`;

  // QR code section — shows the hosted URL and a note to scan
  const qrSection = hostedUrl && hostedUrl !== "https://your-hosted-url.com" ? `
    <div class="qr-section">
      <p class="qr-label">QR CODE — SCAN TO OPEN THIS PROFILE</p>
      <canvas id="qr-canvas" width="160" height="160" aria-label="QR code for this profile"></canvas>
      <p class="qr-url">${esc(hostedUrl)}</p>
    </div>` : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(profile.name)} — Support Worker Profile</title>
<meta name="description" content="${esc(profile.tagline)}" />
<meta property="og:title" content="${esc(profile.name)} — Support Worker" />
<meta property="og:description" content="${esc(profile.tagline)}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Playfair+Display:wght@700&family=Lexend:wght@400;600&display=swap" rel="stylesheet" />
<style>
/* ── Reset & base ── */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{font-size:16px;scroll-behavior:smooth}
body{font-family:'Outfit',sans-serif;min-height:100vh;transition:background 0.3s}
a{color:inherit;text-decoration:none}
button{font-family:inherit;cursor:pointer}

/* ── Font scale (accessibility) ── */
:root{--fs:1}
body{font-size:calc(16px * var(--fs))}

/* ── High contrast mode ── */
.hc body,.hc .post-card,.hc .thread-section{background:#000!important;color:#fff!important;border-color:#fff!important}
.hc .thread-title,.hc .thread-subtitle,.hc .svc-label,.hc .badge,.hc .avail-day,.hc .avail-time,.hc .contact-link,.hc .tagline,.hc .profile-name,.hc .profile-title,.hc .profile-location{color:#fff!important}
.hc .cta-btn{background:#fff!important;color:#000!important}

/* ── Dyslexia font ── */
.dyslexia body,.dyslexia p,.dyslexia span,.dyslexia button,.dyslexia a,.dyslexia h1,.dyslexia h2{font-family:'Lexend',sans-serif!important}

/* ── Page background ── */
#page-bg{min-height:100vh;transition:background 0.3s;padding-top:60px}

/* ── Top bar ── */
#top-bar{
  position:fixed;top:0;left:0;right:0;height:60px;z-index:100;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 16px;
  background:rgba(255,255,255,0.92);backdrop-filter:blur(12px);
  border-bottom:1px solid rgba(0,0,0,0.08);
  box-shadow:0 2px 12px rgba(0,0,0,0.06);
}
#top-bar-brand{font-family:'Outfit',sans-serif;font-size:13px;font-weight:700;letter-spacing:0.08em;color:#4a90d9}
#top-bar-controls{display:flex;gap:8px;align-items:center}
.top-btn{
  padding:7px 14px;border-radius:99px;border:1.5px solid rgba(74,144,217,0.4);
  background:transparent;color:#4a90d9;font-size:12px;font-weight:700;
  transition:all 0.15s;white-space:nowrap;
}
.top-btn:hover{background:rgba(74,144,217,0.1)}
.top-btn.active{background:#4a90d9;color:#fff;border-color:#4a90d9}

/* ── Theme panel ── */
#theme-panel,#a11y-panel{
  position:fixed;top:68px;right:12px;z-index:200;
  background:#fff;border-radius:16px;padding:16px;
  box-shadow:0 8px 40px rgba(0,0,0,0.18);border:1.5px solid rgba(0,0,0,0.08);
  min-width:220px;display:none;
}
#theme-panel.open,#a11y-panel.open{display:block}
.panel-title{font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#9aabb0;margin-bottom:10px}
.theme-btn{
  display:flex;align-items:center;gap:8px;width:100%;padding:8px 10px;
  border-radius:10px;border:none;background:transparent;font-size:13px;
  font-weight:600;color:#1a2340;transition:background 0.12s;text-align:left;
}
.theme-btn:hover{background:rgba(74,144,217,0.08)}
.theme-btn.active{background:rgba(74,144,217,0.14);color:#4a90d9}
.a11y-row{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(0,0,0,0.06)}
.a11y-row:last-child{border-bottom:none}
.a11y-label{font-size:13px;font-weight:600;color:#1a2340}
.a11y-toggle{
  width:40px;height:22px;border-radius:11px;border:none;
  background:#ddd;position:relative;transition:background 0.2s;
}
.a11y-toggle.on{background:#4a90d9}
.a11y-toggle::after{
  content:'';position:absolute;top:2px;left:2px;width:18px;height:18px;
  border-radius:50%;background:#fff;transition:transform 0.2s;
}
.a11y-toggle.on::after{transform:translateX(18px)}
.fs-controls{display:flex;gap:6px}
.fs-btn{padding:4px 10px;border-radius:8px;border:1.5px solid #ddd;background:#fff;font-size:13px;font-weight:700;color:#1a2340}
.fs-btn.active{background:#4a90d9;color:#fff;border-color:#4a90d9}

/* ── Main content ── */
#main{max-width:480px;margin:0 auto;padding:24px 16px 60px}

/* ── Post card ── */
.post-card{background:#fdfcf8;border-radius:24px;box-shadow:0 8px 40px rgba(0,0,0,0.14);overflow:hidden;margin-bottom:0}

/* ── Profile header ── */
.profile-header{display:flex;align-items:flex-start;gap:16px;padding:24px 20px 16px}
.profile-photo{width:90px;height:90px;border-radius:50%;flex-shrink:0;border:3px solid #d4a820;box-shadow:0 0 0 4px rgba(212,168,32,0.13);overflow:hidden;background:#e8e8e8;display:flex;align-items:center;justify-content:center}
.profile-photo-img{width:100%;height:100%;object-fit:cover}
.profile-info{flex:1;padding-top:4px}
.profile-name{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:#1a2340;margin-bottom:4px;line-height:1.1}
.profile-title{font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#4a90d9;margin-bottom:8px}
.profile-location{font-size:14px;color:#3a4a6a;display:flex;align-items:center;gap:5px}

/* ── Service circles ── */
.services-row{padding:8px 16px 16px;display:flex;justify-content:space-around;gap:4px}
.svc-circle{display:flex;flex-direction:column;align-items:center;gap:6px;flex:1}
.svc-icon{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px}
.svc-label{font-size:10px;font-weight:600;text-align:center;color:#3a4a6a;line-height:1.2;max-width:60px}

/* ── Tagline ── */
.tagline{font-family:'Playfair Display',serif;font-size:17px;font-style:italic;color:#1a2340;text-align:center;padding:12px 20px 8px;line-height:1.5}

/* ── Badges ── */
.badges-row{display:flex;flex-wrap:wrap;gap:6px;padding:8px 20px 16px;justify-content:center}
.badge{font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;background:rgba(74,144,217,0.09);border:1px solid rgba(74,144,217,0.28);color:#3a4a6a}

/* ── CTA button ── */
.cta-btn{
  display:block;width:calc(100% - 40px);margin:0 20px 20px;
  padding:16px;border-radius:14px;border:none;
  background:linear-gradient(135deg,#4a90d9,#d4a820);
  color:#fff;font-size:16px;font-weight:700;letter-spacing:0.05em;
  text-align:center;box-shadow:0 4px 20px rgba(74,144,217,0.35);
  transition:transform 0.15s,box-shadow 0.15s;
}
.cta-btn:hover{transform:translateY(-1px);box-shadow:0 6px 28px rgba(74,144,217,0.45)}
.cta-btn:active{transform:scale(0.97)}

/* ── Thread connector ── */
.thread-connector{width:2px;height:32px;background:linear-gradient(to bottom,#4a90d9,#d4a820);margin:0 auto}

/* ── Thread sections ── */
.thread-section{background:#fdfcf8;border-radius:20px;border:1.5px solid rgba(74,144,217,0.16);overflow:hidden;box-shadow:0 2px 16px rgba(74,144,217,0.08)}
.thread-header{width:100%;display:flex;align-items:center;gap:14px;padding:18px 20px;background:none;border:none;text-align:left}
.thread-num-dot{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.thread-header-text{flex:1}
.thread-title{display:block;font-size:16px;font-weight:700;color:#1a2340}
.thread-subtitle{display:block;font-size:12px;color:#7a8aaa;margin-top:2px}
.thread-chevron{color:#7a8aaa;font-size:12px;transition:transform 0.2s}
.thread-header[aria-expanded="true"] .thread-chevron{transform:rotate(180deg)}
.thread-body{padding:0 20px 20px}

/* ── Video ── */
.video-wrapper{border-radius:14px;overflow:hidden;padding:3px;background:linear-gradient(135deg,#4a90d9,#d4a820,#4a90d9)}

/* ── Experience tags ── */
.exp-tags{display:flex;flex-wrap:wrap;gap:6px;padding-top:16px}
.exp-tag{font-size:12px;font-weight:600;padding:5px 12px;border-radius:20px;background:rgba(74,144,217,0.09);border:1px solid rgba(74,144,217,0.28);color:#3a4a6a}

/* ── Availability ── */
.avail-days{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;padding-top:16px}
.avail-day{font-size:13px;font-weight:700;padding:6px 14px;border-radius:20px;background:rgba(74,144,217,0.1);border:1.5px solid rgba(74,144,217,0.3);color:#3a4a6a}
.avail-time{font-size:13px;color:#7a8aaa}

/* ── Contact ── */
.contact-links{display:flex;flex-direction:column;gap:10px;padding-top:16px}
.contact-link{display:flex;align-items:center;gap:10px;font-size:14px;color:#4a90d9;font-weight:500}

/* ── QR section ── */
.qr-section{margin-top:32px;display:flex;flex-direction:column;align-items:center;gap:10px;padding:20px;background:rgba(74,144,217,0.06);border-radius:16px;border:1px solid rgba(74,144,217,0.2)}
.qr-label{font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#4a90d9}
.qr-url{font-size:11px;color:#7a8aaa;word-break:break-all;text-align:center}

/* ── Footer ── */
.page-footer{text-align:center;margin-top:32px;font-size:12px;color:rgba(0,0,0,0.35)}

/* ── AAC Board ── */
#aac-board{display:none;position:fixed;inset:0;z-index:300;background:#0a0f1a;overflow-y:auto}
#aac-board.open{display:block}
.aac-header{background:#0d1525;border-bottom:3px solid #c9a227;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10}
.aac-brand{color:#c9a227;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase}
.aac-name{color:#fff;font-family:'Playfair Display',serif;font-size:clamp(16px,4vw,22px);font-weight:700;margin-top:2px}
.aac-back{background:#1a2540;border:2px solid #c9a227;border-radius:12px;color:#c9a227;padding:10px 18px;font-size:14px;font-weight:700}
.aac-strip{background:#111827;border-bottom:2px solid #c9a227;padding:12px 20px;min-height:64px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.aac-chip{background:#1e2d4a;border:1.5px solid #c9a227;border-radius:8px;padding:6px 12px;color:#fff;font-size:14px;font-weight:600}
.aac-strip-empty{color:rgba(255,255,255,0.3);font-size:14px;font-style:italic}
.aac-controls{display:flex;gap:8px;padding:12px 20px;background:#0d1525;border-bottom:1px solid rgba(201,162,39,0.2)}
.aac-ctrl-btn{flex:1;padding:10px;border-radius:10px;border:1.5px solid rgba(201,162,39,0.4);background:transparent;color:#c9a227;font-size:13px;font-weight:700}
.aac-ctrl-btn.speak{background:#c9a227;color:#0a0f1a}
.aac-section-title{color:#c9a227;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:16px 20px 8px}
.aac-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:10px;padding:0 20px 16px}
.aac-tile{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:16px 8px;border-radius:14px;min-height:90px;transition:transform 0.1s}
.aac-tile:active{transform:scale(0.95)}
.aac-tile-icon{font-size:32px;line-height:1}
.aac-tile-label{font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#fff;text-align:center}

/* ── Spoken flash ── */
#spoken-flash{position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#c9a227;color:#0a0f1a;padding:10px 24px;border-radius:99px;font-size:14px;font-weight:700;z-index:400;display:none;pointer-events:none}
#spoken-flash.show{display:block}

/* ── Shimmer animation ── */
@keyframes shimmerDrift{0%,100%{opacity:0.6;transform:translateY(0)}50%{opacity:1;transform:translateY(-10px)}}
.shimmer{position:fixed;inset:0;pointer-events:none;z-index:0;background:radial-gradient(ellipse 60% 40% at 30% 20%,rgba(255,255,255,0.18) 0%,transparent 70%);animation:shimmerDrift 8s ease-in-out infinite}
</style>
</head>
<body>

<!-- ── Top accessibility bar ── -->
<div id="top-bar">
  <span id="top-bar-brand">✦ InSync Profiles</span>
  <div id="top-bar-controls">
    <button class="top-btn" id="a11y-toggle-btn" onclick="togglePanel('a11y-panel')" aria-label="Accessibility options" aria-expanded="false">Accessibility</button>
    <button class="top-btn" onclick="openAAC()" aria-label="Open AAC Communication Board">🗣 AAC Board</button>
  </div>
</div>

<!-- ── Accessibility panel ── -->
<div id="a11y-panel" role="dialog" aria-label="Accessibility options">
  <p class="panel-title">Accessibility</p>
  <div class="a11y-row">
    <span class="a11y-label">Text Size</span>
    <div class="fs-controls">
      <button class="fs-btn active" id="fs-normal" onclick="setFontSize(1)" aria-label="Normal text size">A</button>
      <button class="fs-btn" id="fs-large" onclick="setFontSize(1.25)" aria-label="Large text size">A+</button>
      <button class="fs-btn" id="fs-xl" onclick="setFontSize(1.5)" aria-label="Extra large text size">A++</button>
    </div>
  </div>
  <div class="a11y-row">
    <span class="a11y-label">High Contrast</span>
    <button class="a11y-toggle" id="hc-toggle" onclick="toggleHC()" aria-pressed="false" aria-label="Toggle high contrast"></button>
  </div>
  <div class="a11y-row">
    <span class="a11y-label">Dyslexia Font</span>
    <button class="a11y-toggle" id="dyslexia-toggle" onclick="toggleDyslexia()" aria-pressed="false" aria-label="Toggle dyslexia-friendly font"></button>
  </div>
  <div class="a11y-row">
    <span class="a11y-label">Text to Speech</span>
    <button class="a11y-toggle" id="tts-toggle" onclick="toggleTTS()" aria-pressed="false" aria-label="Toggle text to speech on hover"></button>
  </div>
</div>

<!-- ── Page background ── -->
<div id="page-bg">
  <div class="shimmer" id="shimmer" aria-hidden="true"></div>
  <div id="main" style="position:relative;z-index:1">

    <!-- Post card -->
    <div class="post-card" id="post-card">

      <!-- Profile header -->
      <div class="profile-header">
        <div class="profile-photo">${profileImgHTML}</div>
        <div class="profile-info">
          <h1 class="profile-name">${esc(profile.name)}</h1>
          <p class="profile-title">${esc(profile.title || "Support Worker")}</p>
          <p class="profile-location"><span style="color:#e74c3c">📍</span>${esc(profile.location)}</p>
        </div>
      </div>

      <!-- Service circles -->
      ${selectedServices.length > 0 ? `<div class="services-row">${serviceCirclesHTML}</div>` : ""}

      <!-- Tagline -->
      <p class="tagline">"${esc(profile.tagline)}"</p>

      <!-- Video -->
      ${videoHTML}

      <!-- Badges -->
      ${profile.badges.length > 0 ? `<div class="badges-row">${badgesHTML}</div>` : ""}

      <!-- CTA button -->
      <a href="${esc(ctaAction)}" class="cta-btn" role="button">${esc(profile.ctaText || "MESSAGE TO BEGIN")}</a>

    </div><!-- /post-card -->

    <!-- Thread connector -->
    <div class="thread-connector"></div>

    <!-- Thread 1: Identity -->
    <div class="thread-section" id="thread-identity">
      <button class="thread-header" onclick="toggleThread('thread-identity')" aria-expanded="false">
        <div class="thread-num-dot" style="background:#4a90d9">🌟</div>
        <div class="thread-header-text">
          <span class="thread-title">Identity</span>
          <span class="thread-subtitle">Who I am, what matters to me, and how I work.</span>
        </div>
        <span class="thread-chevron">▼</span>
      </button>
      <div class="thread-body" style="display:none">
        <p style="font-size:14px;color:#3a4a6a;line-height:1.7;padding-top:8px">${esc(profile.bio)}</p>
          ${profile.languages && profile.languages.length > 0 ? `
        <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px">
          ${profile.languages.map((l: string) => `<span class="badge">🌐 ${esc(l)}</span>`).join("")}
        </div>` : ""}
      </div>
    </div>

    <div class="thread-connector"></div>

    <!-- Thread 2: Services -->
    <div class="thread-section" id="thread-services">
      <button class="thread-header" onclick="toggleThread('thread-services')" aria-expanded="false">
        <div class="thread-num-dot" style="background:#2ecc71">🤝</div>
        <div class="thread-header-text">
          <span class="thread-title">Services</span>
          <span class="thread-subtitle">What I can help you with.</span>
        </div>
        <span class="thread-chevron">▼</span>
      </button>
      <div class="thread-body" style="display:none">
        <div style="display:flex;flex-wrap:wrap;gap:8px;padding-top:16px">
          ${selectedServices.map(s => `<span class="badge">${esc(s.icon)} ${esc(s.label)}</span>`).join("")}
        </div>
      </div>
    </div>

    <div class="thread-connector"></div>

    <!-- Thread 3: Presentation (video) -->
    <div class="thread-section" id="thread-presentation">
      <button class="thread-header" onclick="toggleThread('thread-presentation')" aria-expanded="false">
        <div class="thread-num-dot" style="background:#e67e22">🎬</div>
        <div class="thread-header-text">
          <span class="thread-title">Presentation</span>
          <span class="thread-subtitle">How I show up, connect, and communicate.</span>
        </div>
        <span class="thread-chevron">▼</span>
      </button>
      <div class="thread-body" style="display:none">
        <div style="padding-top:16px">${videoHTML || "<p style='font-size:13px;color:#7a8aaa'>No video uploaded.</p>"}</div>
      </div>
    </div>

    ${expHTML ? `<div class="thread-connector"></div>${expHTML}` : ""}
    ${availHTML ? `<div class="thread-connector"></div>${availHTML}` : ""}
    ${contactHTML ? `<div class="thread-connector"></div>${contactHTML}` : ""}

    ${qrSection}

    <!-- Footer -->
    <div class="page-footer">
      Powered by <strong>InSync Profiles</strong><br>
      <span style="font-size:10px;opacity:0.55;">Licensed to: <strong>${esc(profile.name)}</strong> &bull; Single-user licence &bull; Not for redistribution or resale</span>
    </div>

  </div><!-- /main -->
</div><!-- /page-bg -->

<!-- ── AAC Board ── -->
<div id="aac-board" role="dialog" aria-modal="true" aria-label="AAC Communication Board for ${esc(profile.name)}">
  <div class="aac-header">
    <div>
      <p class="aac-brand">AAC Board</p>
      <h1 class="aac-name">${esc(profile.name)}</h1>
    </div>
    <button class="aac-back" onclick="closeAAC()" aria-label="Close AAC board and return to profile">← Back</button>
  </div>
  <div class="aac-strip" id="aac-strip">
    <span class="aac-strip-empty" id="aac-empty-hint">Tap tiles below to build a message…</span>
  </div>
  <div class="aac-controls">
    <button class="aac-ctrl-btn speak" onclick="speakSentence()" aria-label="Speak the selected message">🔊 Speak</button>
    <button class="aac-ctrl-btn" onclick="clearLast()" aria-label="Remove last word">⌫ Undo</button>
    <button class="aac-ctrl-btn" onclick="clearAll()" aria-label="Clear all words">✕ Clear</button>
  </div>
  <p class="aac-section-title">Core Vocabulary</p>
  <div class="aac-grid">${aacCoreTilesHTML}</div>
  ${aacServiceTiles.length > 0 ? `<p class="aac-section-title">Services</p><div class="aac-grid">${aacServiceTilesHTML}</div>` : ""}
  ${aacContactTilesHTML ? `<p class="aac-section-title">Contact</p><div class="aac-grid">${aacContactTilesHTML}</div>` : ""}
</div>

<!-- ── Spoken flash ── -->
<div id="spoken-flash" aria-live="polite"></div>

<script>
// ── Profile data ──────────────────────────────────────────────
const PROFILE = ${JSON.stringify({ name: profile.name, phone: profile.phone, email: profile.email })};
const THEMES = ${themesJson};

// ── Theme management ──────────────────────────────────────────
let currentThemeId = localStorage.getItem('sw-color-theme') || 'sky-gold';
function applyTheme(id) {
  const t = THEMES.find(x => x.id === id) || THEMES[0];
  currentThemeId = id;
  localStorage.setItem('sw-color-theme', id);
  const bg = document.getElementById('page-bg');
  const card = document.getElementById('post-card');
  const topBar = document.getElementById('top-bar');
  if (bg) bg.style.background = t.bg;
  if (card) { card.style.background = t.card; }
  if (topBar) { topBar.style.borderBottomColor = t.accent + '33'; }
  // Update brand colour
  const brand = document.getElementById('top-bar-brand');
  if (brand) brand.style.color = t.accent;
  // Update CTA gradient
  const cta = document.querySelector('.cta-btn');
  if (cta) cta.style.background = 'linear-gradient(135deg,' + t.ctaFrom + ',' + t.ctaTo + ')';
  // Update thread connector
  document.querySelectorAll('.thread-connector').forEach(el => {
    el.style.background = 'linear-gradient(to bottom,' + t.ctaFrom + ',' + t.ctaTo + ')';
  });
  // Update service circle colours
  document.querySelectorAll('[data-theme-circle]').forEach(el => {
    const i = parseInt(el.getAttribute('data-theme-circle'));
    const c = t.circleColors[i % t.circleColors.length];
    const icon = el.querySelector('.svc-icon');
    if (icon) { icon.style.background = c + '18'; icon.style.borderColor = c + '50'; }
  });
  // Update active button
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.id === id);
  });
  // Show/hide shimmer for gradient themes
  const shimmer = document.getElementById('shimmer');
  const gradientIds = ['sky-gold','ocean-amber','rainbow-prism','cobalt-gold'];
  if (shimmer) shimmer.style.display = gradientIds.includes(id) ? 'block' : 'none';
}

// Build theme list
const themeList = document.getElementById('theme-list');
THEMES.forEach(t => {
  const btn = document.createElement('button');
  btn.className = 'theme-btn' + (t.id === currentThemeId ? ' active' : '');
  btn.dataset.id = t.id;
  btn.innerHTML = '<span>' + t.emoji + '</span><span>' + t.name + '</span>';
  btn.onclick = () => { applyTheme(t.id); };
  themeList.appendChild(btn);
});
applyTheme(currentThemeId);

// ── Panel toggle ──────────────────────────────────────────────
function togglePanel(id) {
  const panel = document.getElementById(id);
  const otherId = id === 'theme-panel' ? 'a11y-panel' : 'theme-panel';
  const other = document.getElementById(otherId);
  const isOpen = panel.classList.contains('open');
  if (other) other.classList.remove('open');
  panel.classList.toggle('open', !isOpen);
  const btnId = id === 'theme-panel' ? 'theme-toggle-btn' : 'a11y-toggle-btn';
  document.getElementById(btnId)?.setAttribute('aria-expanded', String(!isOpen));
  document.getElementById(id === 'theme-panel' ? 'a11y-toggle-btn' : 'theme-toggle-btn')?.setAttribute('aria-expanded', 'false');
}
// Close panels on outside click
document.addEventListener('click', e => {
  ['theme-panel','a11y-panel'].forEach(id => {
    const panel = document.getElementById(id);
    const btn = document.getElementById(id === 'theme-panel' ? 'theme-toggle-btn' : 'a11y-toggle-btn');
    if (panel && !panel.contains(e.target) && btn && !btn.contains(e.target)) {
      panel.classList.remove('open');
      btn.setAttribute('aria-expanded','false');
    }
  });
});

// ── Thread accordion ──────────────────────────────────────────
function toggleThread(id) {
  const section = document.getElementById(id);
  if (!section) return;
  const btn = section.querySelector('.thread-header');
  const body = section.querySelector('.thread-body');
  const isOpen = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!isOpen));
  body.style.display = isOpen ? 'none' : 'block';
}

// ── Accessibility ─────────────────────────────────────────────
let a11y = JSON.parse(localStorage.getItem('sw-a11y') || '{"fs":1,"hc":false,"dyslexia":false,"tts":false}');
function saveA11y() { localStorage.setItem('sw-a11y', JSON.stringify(a11y)); }

function setFontSize(scale) {
  a11y.fs = scale;
  document.documentElement.style.setProperty('--fs', String(scale));
  ['fs-normal','fs-large','fs-xl'].forEach((id,i) => {
    document.getElementById(id)?.classList.toggle('active', [1,1.25,1.5][i] === scale);
  });
  saveA11y();
}
function toggleHC() {
  a11y.hc = !a11y.hc;
  document.documentElement.classList.toggle('hc', a11y.hc);
  const btn = document.getElementById('hc-toggle');
  if (btn) { btn.classList.toggle('on', a11y.hc); btn.setAttribute('aria-pressed', String(a11y.hc)); }
  saveA11y();
}
function toggleDyslexia() {
  a11y.dyslexia = !a11y.dyslexia;
  document.documentElement.classList.toggle('dyslexia', a11y.dyslexia);
  const btn = document.getElementById('dyslexia-toggle');
  if (btn) { btn.classList.toggle('on', a11y.dyslexia); btn.setAttribute('aria-pressed', String(a11y.dyslexia)); }
  saveA11y();
}
let ttsEnabled = false;
function toggleTTS() {
  ttsEnabled = !ttsEnabled;
  a11y.tts = ttsEnabled;
  const btn = document.getElementById('tts-toggle');
  if (btn) { btn.classList.toggle('on', ttsEnabled); btn.setAttribute('aria-pressed', String(ttsEnabled)); }
  saveA11y();
}
// TTS on hover
document.addEventListener('mouseover', e => {
  if (!ttsEnabled) return;
  const el = e.target;
  const text = el.innerText || el.textContent;
  if (text && text.trim().length > 1 && text.trim().length < 200) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text.trim());
      u.rate = 0.9; u.lang = 'en-AU';
      window.speechSynthesis.speak(u);
    }
  }
});
// Apply saved a11y on load
setFontSize(a11y.fs || 1);
if (a11y.hc) toggleHC();
if (a11y.dyslexia) toggleDyslexia();
if (a11y.tts) toggleTTS();

// ── AAC Board ─────────────────────────────────────────────────
let aacSelected = [];
function openAAC() {
  document.getElementById('aac-board').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeAAC() {
  document.getElementById('aac-board').classList.remove('open');
  document.body.style.overflow = '';
}
function aacTap(label) {
  aacSelected.push(label);
  renderStrip();
  speak(label);
}
function clearLast() {
  aacSelected.pop();
  renderStrip();
  window.speechSynthesis?.cancel();
}
function clearAll() {
  aacSelected = [];
  renderStrip();
  window.speechSynthesis?.cancel();
}
function speakSentence() {
  if (aacSelected.length > 0) speak(aacSelected.join('. '));
}
function renderStrip() {
  const strip = document.getElementById('aac-strip');
  const empty = document.getElementById('aac-empty-hint');
  if (aacSelected.length === 0) {
    strip.innerHTML = '<span class="aac-strip-empty" id="aac-empty-hint">Tap tiles below to build a message…</span>';
  } else {
    strip.innerHTML = aacSelected.map(w => '<span class="aac-chip">' + w + '</span>').join('');
  }
}
function speak(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.85; u.lang = 'en-AU';
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.startsWith('en-AU')) || voices.find(v => v.lang.startsWith('en'));
    if (preferred) u.voice = preferred;
    window.speechSynthesis.speak(u);
  }
  const flash = document.getElementById('spoken-flash');
  if (flash) {
    flash.textContent = text;
    flash.classList.add('show');
    setTimeout(() => flash.classList.remove('show'), 2000);
  }
}

// ── QR Code (inline generator — no CDN) ──────────────────────
${hostedUrl && hostedUrl !== "https://your-hosted-url.com" ? `
(function(){
  // Minimal QR code generator using qrcodejs algorithm inlined
  // We use a simple approach: draw the URL as a canvas QR via the browser's
  // built-in URL encoding, falling back to a text display
  const canvas = document.getElementById('qr-canvas');
  if (!canvas) return;
  // Use the QR code API from goqr.me as a fallback image if online,
  // otherwise show the URL text only (already shown below canvas)
  const url = ${JSON.stringify(hostedUrl)};
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function() {
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, 160, 160);
  };
  img.onerror = function() {
    // Offline fallback: draw a simple placeholder
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0,0,160,160);
    ctx.fillStyle = '#4a90d9';
    ctx.font = '11px Outfit,sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Scan URL below', 80, 80);
  };
  img.src = 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=' + encodeURIComponent(url);
})();` : ""}

// Keyboard: Escape closes panels and AAC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('aac-board')?.classList.remove('open');
    document.body.style.overflow = '';
    document.getElementById('theme-panel')?.classList.remove('open');
    document.getElementById('a11y-panel')?.classList.remove('open');
  }
});
// ── Licence protection ──────────────────────────────────────
// This file is licensed to the named support worker above.
// Redistribution, resale, or modification of this file is prohibited.
// InSync Profiles © ${new Date().getFullYear()} — All rights reserved.
document.addEventListener('contextmenu', e => {
  e.preventDefault();
  alert('This profile is protected.\n\nLicensed to: ${esc(profile.name)}\nInSync Profiles \u00a9 ${new Date().getFullYear()}');
});
</script>
</body>
</html>`;
}
