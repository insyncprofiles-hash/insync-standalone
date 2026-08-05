/* ============================================================
   generateAboutMeHTML.ts
   Produces a fully self-contained, offline-capable HTML file
   for a participant's About Me profile.

   All sections mirror AboutMeView.tsx exactly.
   YouTube video plays when online (unlisted embed).
   No external dependencies — works in any browser.
   ============================================================ */

function esc(s: string): string {
  return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function getYouTubeId(url: string): string {
  try {
    const u = new URL(url);
    const v = u.searchParams.get("v");
    if (v) return v;
    const parts = u.pathname.split("/");
    return parts[parts.length - 1] || "";
  } catch { return ""; }
}

function commStyle(s: string): string {
  const map: Record<string, string> = {
    "verbal": "Verbal communication",
    "verbal-limited": "Limited verbal",
    "aac": "AAC device",
    "pecs": "PECS / picture cards",
    "signing": "Auslan / key word signing",
    "non-verbal": "Non-verbal",
    "mixed": "Mixed communication",
  };
  return map[s] || s;
}

function section(title: string, emoji: string, content: string): string {
  if (!content.trim()) return "";
  return `
    <div class="card">
      <div class="section-header">
        <span class="section-icon">${emoji}</span>
        <h2 class="section-title">${esc(title)}</h2>
      </div>
      ${content}
    </div>`;
}

function infoRow(label: string, value: string): string {
  if (!value) return "";
  return `<div class="info-row"><span class="info-label">${esc(label)}</span><span class="info-value">${esc(value)}</span></div>`;
}

function textBlock(value: string): string {
  if (!value) return "";
  return `<p class="text-block">${esc(value).replace(/\n/g, "<br>")}</p>`;
}

function subLabel(label: string, color = "#2563eb"): string {
  return `<p class="sub-label" style="color:${color}">${esc(label)}</p>`;
}

function pill(text: string): string {
  return `<span class="pill">${esc(text)}</span>`;
}

function highlightBox(color: string, labelColor: string, label: string, value: string): string {
  if (!value) return "";
  return `<div class="highlight-box" style="background:${color}">
    ${subLabel(label, labelColor)}
    ${textBlock(value)}
  </div>`;
}

export interface AboutMeExportData {
  name: string;
  preferredName: string;
  gender: string;
  dob: string;
  diagnosis: string;
  photo: string;
  emergencyContacts: { name: string; relationship: string; phone: string }[];
  communicationStyle: string;
  aacDevice: string;
  keyWords: string;
  yesNoSignals: string;
  distressSignals: string;
  videoUrl: string;
  videoDescription: string;
  canDo: string;
  needsHelp: string;
  mobilityAids: string;
  sensoryNeeds: string;
  triggers: string;
  earlyWarnings: string;
  whatHelps: string;
  whatMakesWorse: string;
  doThis: string;
  neverDo: string;
  culturalConsiderations: string;
  languages: string;
  needsInterpreter: string;
  foodPreferences: string;
  music: string;
  routine: string;
  environment: string;
  goodDayLooksLike: string;
  whatMatters: string;
  goals: string;
  ndisNumber: string;
  planDates: string;
  coordinatorName: string;
  coordinatorPhone: string;
  coordinatorEmail: string;
}

export function generateAboutMeHTML(data: AboutMeExportData): string {
  const displayName = data.preferredName || data.name;
  const videoId = data.videoUrl ? getYouTubeId(data.videoUrl) : "";
  const validContacts = (data.emergencyContacts || []).filter(c => c.name || c.phone);

  // ── EMERGENCY CONTACTS ─────────────────────────────────────
  const emergencySection = validContacts.length > 0 ? `
    <div class="emergency-card">
      <h2 class="section-title" style="margin-bottom:16px">🚨 Emergency Contacts</h2>
      ${validContacts.map(ec => `
        <div class="ec-row">
          <div>
            <p class="ec-name">${esc(ec.name)}</p>
            ${ec.relationship ? `<p class="ec-rel">${esc(ec.relationship)}</p>` : ""}
          </div>
          ${ec.phone ? `<a href="tel:${esc(ec.phone)}" class="ec-phone">${esc(ec.phone)}</a>` : ""}
        </div>`).join("")}
    </div>` : "";

  // ── WHO I AM ───────────────────────────────────────────────
  const whoContent = [
    infoRow("Full Name", data.name),
    (data.preferredName && data.preferredName !== data.name) ? infoRow("Preferred Name", data.preferredName) : "",
    infoRow("Date of Birth", data.dob),
    infoRow("Diagnosis", data.diagnosis),
    infoRow("Languages Spoken", data.languages),
    infoRow("Interpreter Needed", data.needsInterpreter),
  ].join("");
  const whoSection = (data.dob || data.diagnosis || data.preferredName)
    ? section("Who I Am", "👤", whoContent) : "";

  // ── PREFERENCES ────────────────────────────────────────────
  const prefsContent = [
    data.foodPreferences ? subLabel("Food") + textBlock(data.foodPreferences) : "",
    data.music ? subLabel("Music and Entertainment") + textBlock(data.music) : "",
    data.routine ? subLabel("Routine") + textBlock(data.routine) : "",
    data.environment ? subLabel("Environment") + textBlock(data.environment) : "",
    data.goodDayLooksLike ? highlightBox("#f0fdf4", "#1e3a5f", "What a Good Day Looks Like", data.goodDayLooksLike) : "",
    data.whatMatters ? subLabel("What Matters Most to Me") + textBlock(data.whatMatters) : "",
  ].join("");
  const prefsSection = (data.foodPreferences || data.music || data.routine || data.environment || data.goodDayLooksLike || data.whatMatters)
    ? section("My Preferences", "🌻", prefsContent) : "";

  // ── VIDEO ──────────────────────────────────────────────────
  // Use a clickable thumbnail link instead of an iframe embed.
  // YouTube blocks iframe embeds when opened from local files (Error 153).
  const videoSection = videoId ? section("When I'm Well", "🎬", `
    ${data.videoDescription ? `<p class="video-desc">${esc(data.videoDescription)}</p>` : ""}
    <a href="https://www.youtube.com/watch?v=${esc(videoId)}" target="_blank" rel="noreferrer" class="video-link">
      <div class="video-thumb-wrap">
        <img
          src="https://img.youtube.com/vi/${esc(videoId)}/hqdefault.jpg"
          alt="Watch video"
          class="video-thumb"
          onerror="this.style.display='none'"
        />
        <div class="video-play-btn">▶</div>
        <div class="video-label">▶ Watch on YouTube</div>
      </div>
    </a>`) : "";

  // ── COMMUNICATION ──────────────────────────────────────────
  const commContent = [
    data.communicationStyle ? pill(commStyle(data.communicationStyle)) + "<br><br>" : "",
    infoRow("AAC Device", data.aacDevice),
    data.keyWords ? subLabel("Key Words") + textBlock(data.keyWords) : "",
    data.yesNoSignals ? subLabel("How I Show Yes and No") + textBlock(data.yesNoSignals) : "",
    data.distressSignals ? subLabel("Signs I'm in Pain or Distress") + textBlock(data.distressSignals) : "",
  ].join("");
  const commSection = (data.communicationStyle || data.aacDevice || data.keyWords || data.yesNoSignals || data.distressSignals)
    ? section("How I Communicate", "💬", commContent) : "";

  // ── WHAT I CAN DO ──────────────────────────────────────────
  const canDoContent = [
    data.canDo ? subLabel("I Can Do Independently") + textBlock(data.canDo) : "",
    data.needsHelp ? subLabel("I Need Help With") + textBlock(data.needsHelp) : "",
    infoRow("Mobility Aids", data.mobilityAids),
    data.sensoryNeeds ? subLabel("Sensory Needs") + textBlock(data.sensoryNeeds) : "",
  ].join("");
  const canDoSection = (data.canDo || data.needsHelp || data.mobilityAids || data.sensoryNeeds)
    ? section("What I Can Do", "💪", canDoContent) : "";

  // ── TRIGGERS & WHAT HELPS ──────────────────────────────────
  const triggersContent = [
    data.triggers ? highlightBox("#fff7ed", "#c2410c", "What Causes Distress", data.triggers) : "",
    data.earlyWarnings ? subLabel("Early Warning Signs") + textBlock(data.earlyWarnings) : "",
    data.whatMakesWorse ? subLabel("What Makes Things Worse") + textBlock(data.whatMakesWorse) : "",
    data.whatHelps ? highlightBox("#f0fdf4", "#1e3a5f", "Strategies that help me Regulate", data.whatHelps) : "",
  ].join("");
  const triggersSection = (data.triggers || data.earlyWarnings || data.whatHelps || data.whatMakesWorse)
    ? section("Triggers and What Helps", "🌿", triggersContent) : "";

  // ── APPROACHES ─────────────────────────────────────────────
  const approachContent = [
    data.doThis ? highlightBox("#f0fdf4", "#1e3a5f", "Please Do This", data.doThis) : "",
    data.neverDo ? highlightBox("#fff7ed", "#c2410c", "Please Never Do This", data.neverDo) : "",
    data.culturalConsiderations ? subLabel("Cultural and Religious Considerations") + textBlock(data.culturalConsiderations) : "",
  ].join("");
  const approachSection = (data.doThis || data.neverDo || data.culturalConsiderations)
    ? section("Approaches That Work", "🤝", approachContent) : "";

  // ── GOALS ──────────────────────────────────────────────────
  const goalsSection = data.goals ? section("Goals", "🎯", textBlock(data.goals)) : "";

  // ── NDIS INFO ──────────────────────────────────────────────
  const ndisContent = [
    infoRow("NDIS Number", data.ndisNumber),
    infoRow("Plan Dates", data.planDates),
    infoRow("Coordinator", data.coordinatorName),
    data.coordinatorPhone ? `<div class="info-row"><span class="info-label">Phone</span><a href="tel:${esc(data.coordinatorPhone)}" class="info-link">${esc(data.coordinatorPhone)}</a></div>` : "",
    data.coordinatorEmail ? `<div class="info-row"><span class="info-label">Email</span><a href="mailto:${esc(data.coordinatorEmail)}" class="info-link">${esc(data.coordinatorEmail)}</a></div>` : "",
  ].join("");
  const ndisSection = (data.ndisNumber || data.planDates || data.coordinatorName)
    ? section("NDIS Information", "📋", ndisContent) : "";

  // ── PHOTO ──────────────────────────────────────────────────
  const photoHtml = data.photo
    ? `<img src="${esc(data.photo)}" alt="${esc(displayName)}" class="profile-photo" />`
    : `<div class="profile-photo-placeholder">👤</div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>About ${esc(displayName)} — InSync Profiles</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Nunito', sans-serif;
      background: #ffffff;
      color: #1e3a5f;
      min-height: 100vh;
    }
    .header {
      background: #ffffff;
      border-bottom: 2px solid #e2e8f0;
      padding: 24px 20px 20px;
    }
    .header-inner {
      max-width: 680px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .profile-photo {
      width: 140px; height: 140px;
      border-radius: 50%;
      object-fit: contain;
      object-position: center;
      background: #f1f5f9;
      border: 3px solid #e2e8f0;
      flex-shrink: 0;
      box-shadow: 0 4px 20px rgba(0,0,0,0.12);
    }
    .profile-photo-placeholder {
      width: 140px; height: 140px;
      border-radius: 50%;
      background: #f1f5f9;
      border: 3px solid #e2e8f0;
      display: flex; align-items: center; justify-content: center;
      font-size: 52px;
      flex-shrink: 0;
      box-shadow: 0 4px 20px rgba(0,0,0,0.12);
    }
    .profile-name {
      font-weight: 900; font-size: 26px; color: #1e3a5f; margin-bottom: 6px;
    }
    .diagnosis-badge {
      display: inline-block;
      padding: 3px 12px; border-radius: 16px;
      background: #f1f5f9; border: 1px solid #cbd5e1;
      font-weight: 700; font-size: 13px; color: #1e3a5f;
    }
    .confidential-banner {
      max-width: 680px; margin: 14px auto 0; padding: 0 20px;
    }
    .confidential-inner {
      display: flex; align-items: center; justify-content: center; gap: 10px;
      background: linear-gradient(135deg, #1e3a78 0%, #1e40af 50%, #1e3a78 100%);
      border: 3px solid #1e2d6b;
      border-radius: 6px;
      padding: 10px 20px;
      box-shadow: 0 2px 8px rgba(30,58,120,0.35);
    }
    .confidential-title {
      font-weight: 900; font-size: 15px; color: #f5c842;
      letter-spacing: 0.18em; text-transform: uppercase;
      text-align: center; line-height: 1.1;
    }
    .confidential-sub {
      font-weight: 600; font-size: 11px; color: #fcd97a;
      letter-spacing: 0.06em; text-align: center; margin-top: 3px;
    }
    .print-btn {
      max-width: 680px; margin: 12px auto 0; padding: 0 20px;
      display: flex; justify-content: flex-end;
    }
    .print-btn button {
      display: inline-flex; align-items: center; gap: 7px;
      background: #fff; border: 1.5px solid #1e3a5f;
      color: #1e3a5f; font-family: 'Nunito', sans-serif;
      font-weight: 800; font-size: 13px;
      padding: 8px 18px; border-radius: 99px;
      cursor: pointer;
    }
    .main {
      max-width: 680px; margin: 0 auto; padding: 24px 20px;
    }
    .emergency-card {
      background: #f0f4fa;
      border: 2px solid #1e3a5f;
      border-radius: 20px;
      padding: 20px;
      margin-bottom: 28px;
    }
    .ec-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #cbd5e1;
    }
    .ec-row:last-child { border-bottom: none; }
    .ec-name { font-weight: 800; font-size: 15px; color: #1e3a5f; margin-bottom: 2px; }
    .ec-rel { font-size: 13px; color: #475569; }
    .ec-phone {
      padding: 10px 18px; border-radius: 20px;
      background: #1e3a5f; color: #fff;
      font-weight: 800; font-size: 14px;
      text-decoration: none;
    }
    .card {
      background: #ffffff;
      border-radius: 20px;
      padding: 20px;
      margin-bottom: 20px;
      border: 1.5px solid #e2e8f0;
    }
    .section-header {
      display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
    }
    .section-icon {
      width: 40px; height: 40px; border-radius: 12px;
      background: #1e3a5f18;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; flex-shrink: 0;
    }
    .section-title {
      font-weight: 900; font-size: 18px; color: #1e3a5f;
    }
    .info-row {
      display: flex; gap: 12px; margin-bottom: 10px; align-items: flex-start;
    }
    .info-label {
      font-weight: 700; font-size: 13px; color: #2563eb;
      min-width: 130px; flex-shrink: 0;
    }
    .info-value { font-size: 14px; color: #1e3a5f; line-height: 1.6; }
    .info-link { font-size: 14px; color: #1e3a5f; font-weight: 700; text-decoration: none; }
    .text-block {
      font-size: 15px; color: #1e3a5f; line-height: 1.7;
      margin-bottom: 8px; white-space: pre-wrap;
    }
    .sub-label {
      font-weight: 700; font-size: 13px; margin-bottom: 6px;
    }
    .pill {
      display: inline-block;
      padding: 5px 14px; border-radius: 20px;
      background: #1e3a5f18; border: 1.5px solid #1e3a5f40;
      font-weight: 700; font-size: 13px; color: #1e3a5f;
      margin: 4px;
    }
    .highlight-box {
      border-radius: 12px; padding: 14px; margin-bottom: 16px;
    }
    .video-desc {
      font-size: 14px; color: #2563eb; font-style: italic; margin-bottom: 14px;
    }
    .video-link { display: block; text-decoration: none; }
    .video-thumb-wrap {
      position: relative; border-radius: 12px; overflow: hidden;
      background: #000; cursor: pointer;
    }
    .video-thumb {
      width: 100%; display: block; border-radius: 12px;
      aspect-ratio: 16/9; object-fit: cover;
    }
    .video-play-btn {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 64px; height: 64px; border-radius: 50%;
      background: rgba(240,192,64,0.95);
      display: flex; align-items: center; justify-content: center;
      font-size: 24px; color: #0a0a0a;
      box-shadow: 0 4px 24px rgba(0,0,0,0.45);
    }
    .video-label {
      position: absolute; bottom: 10px; left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.65);
      border-radius: 20px; padding: 4px 14px;
      font-family: 'Nunito', sans-serif; font-size: 13px;
      font-weight: 700; color: #F0C040; white-space: nowrap;
    }
    .footer {
      background: #f8fafc;
      border-top: 1.5px solid #e2e8f0;
      padding: 20px; text-align: center;
    }
    .footer a {
      font-size: 12px; color: #1e3a5f; font-weight: 700; text-decoration: none;
    }
    .footer-note {
      font-size: 11px; color: #64748b; margin-top: 6px;
    }
    @media print {
      .print-btn { display: none !important; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>

  <div class="header">
    <div class="header-inner">
      ${photoHtml}
      <div>
        <p class="profile-name">About ${esc(displayName)}</p>
        ${data.diagnosis ? `<span class="diagnosis-badge">${esc(data.diagnosis)}</span>` : ""}
      </div>
    </div>
  </div>

  <div class="confidential-banner">
    <div class="confidential-inner">
      <span style="font-size:18px">🔒</span>
      <div>
        <p class="confidential-title">Private &amp; Confidential</p>
        <p class="confidential-sub">For authorised recipients only</p>
      </div>
      <span style="font-size:18px">🔒</span>
    </div>
  </div>

  <div class="print-btn no-print">
    <button onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>

  <div class="main">
    ${emergencySection}
    ${whoSection}
    ${prefsSection}
    ${videoSection}
    ${commSection}
    ${canDoSection}
    ${triggersSection}
    ${approachSection}
    ${goalsSection}
    ${ndisSection}
  </div>

  <div class="footer">
    <a href="https://insyncprofiles.net">insyncprofiles.net</a>
    <p class="footer-note">This profile was created with InSync Profiles — free, always.</p>
    <p class="footer-note">Downloaded on ${new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}</p>
  </div>

</body>
</html>`;
}
