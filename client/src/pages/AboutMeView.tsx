/* ============================================================
   About Me View — Participant / Aged Care Profile
   Warm teal/sage design — distinct from the worker profile.
   Includes full accessibility tools (same as ClientView).
   Data loaded from URL params.
   Font scaling: uses fs(n) helper that multiplies by a11y scale factor.
   This works on ALL browsers including Android tablets (no zoom needed).
   ============================================================ */
import { useRef, useCallback } from "react";
import React from "react";
import { useA11y } from "@/hooks/useA11y";

// ── HELPERS ───────────────────────────────────────────────────

function getYouTubeId(url: string): string {
  try {
    const u = new URL(url);
    const v = u.searchParams.get("v");
    if (v) return v;
    const parts = u.pathname.split("/");
    return parts[parts.length - 1] || "";
  } catch { return ""; }
}

// Font scale helper — uses CSS variable so scaling is instant without React re-render
// Works on ALL browsers including Android tablets
function makeFs(_scale: number) {
  return (px: number) => `calc(${px}px * var(--a11y-font-scale, 1))`;
}

function Pill({ text, color = "#1e3a5f", fs }: { text: string; color?: string; fs: (n: number) => string }) {
  return (
    <span style={{
      display: "inline-block", padding: "5px 14px", borderRadius: "20px",
      background: `${color}18`, border: `1.5px solid ${color}40`,
      fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: fs(13),
      color: color, margin: "4px",
    }}>
      {text}
    </span>
  );
}

function Section({ title, emoji, children, accent = "#1e3a5f", fs }: {
  title: string; emoji: string; children: React.ReactNode; accent?: string; fs: (n: number) => string;
}) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
        <span style={{
          width: "40px", height: "40px", borderRadius: "12px",
          background: `${accent}18`, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: fs(20), flexShrink: 0,
        }}>{emoji}</span>
        <h2 style={{
          fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: fs(18),
          color: "#1e3a5f", margin: 0,
        }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value, fs }: { label: string; value: string; fs: (n: number) => string }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", gap: "12px", marginBottom: "10px", alignItems: "flex-start" }}>
      <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: fs(13), color: "#2563eb", minWidth: "130px", flexShrink: 0 }}>{label}</span>
      <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: fs(14), color: "#1e3a5f", lineHeight: 1.6 }}>{value}</span>
    </div>
  );
}

function TextBlock({ value, fs }: { value: string; fs: (n: number) => string }) {
  if (!value) return null;
  return (
    <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: fs(15), color: "#1e3a5f", lineHeight: 1.7, margin: "0 0 8px", whiteSpace: "pre-wrap" }}>
      {value}
    </p>
  );
}

// ── COMPONENT ─────────────────────────────────────────────────

export default function AboutMeView() {
  const params = new URLSearchParams(window.location.search);

  function p(key: string) {
    const raw = params.get(key) || "";
    try { return decodeURIComponent(raw); } catch { return raw; }
  }

  const name = p("name");
  const preferredName = p("preferredName");
  const gender = p("gender");
  const dob = p("dob");
  const diagnosis = p("diagnosis");
  const communicationStyle = p("communicationStyle");
  const aacDevice = p("aacDevice");
  const keyWords = p("keyWords");
  const yesNoSignals = p("yesNoSignals");
  const distressSignals = p("distressSignals");
  const videoUrl = p("videoUrl");
  const videoDescription = p("videoDescription");
  const canDo = p("canDo");
  const needsHelp = p("needsHelp");
  const mobilityAids = p("mobilityAids");
  const sensoryNeeds = p("sensoryNeeds");
  const triggers = p("triggers");
  const earlyWarnings = p("earlyWarnings");
  const whatHelps = p("whatHelps");
  const whatMakesWorse = p("whatMakesWorse");
  const doThis = p("doThis");
  const neverDo = p("neverDo");
  const culturalConsiderations = p("culturalConsiderations");
  const languages = p("languages");
  const needsInterpreter = p("needsInterpreter");
  const foodPreferences = p("foodPreferences");
  const music = p("music");
  const routine = p("routine");
  const environment = p("environment");
  const goodDayLooksLike = p("goodDayLooksLike");
  const whatMatters = p("whatMatters");
  const ndisNumber = p("ndisNumber");
  const planDates = p("planDates");
  const coordinatorName = p("coordinatorName");
  const coordinatorPhone = p("coordinatorPhone");
  const coordinatorEmail = p("coordinatorEmail");

  let emergencyContacts: { name: string; relationship: string; phone: string }[] = [];
  try { emergencyContacts = JSON.parse(p("ec") || "[]"); } catch {}

  const photo = p("photo") || "";

  const displayName = preferredName || name;
  const videoId = videoUrl ? getYouTubeId(videoUrl) : "";

  const { wrapperStyle: a11yStyle } = useA11y();
  // fs() uses CSS calc() with --a11y-font-scale variable — scales instantly on button press
  const fs = makeFs(1);

  const videoIframeRef = useRef<HTMLIFrameElement | null>(null);

  const handlePlayVideo = useCallback(() => {
    const iframe = videoIframeRef.current;
    if (!iframe) return;
    iframe.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      iframe.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "playVideo", args: [] }),
        "*"
      );
    }, 600);
  }, []);

  // Colours
  const navy = "#1e3a5f";
  const teal = "#1e3a5f";
  const greyWhite = "#ffffff";
  const cardBg = "#ffffff";

  if (!name) {
    return (
      <div style={{ minHeight: "100vh", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: fs(24), color: "#1e3a5f", marginBottom: "12px" }}>No profile found</p>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: fs(15), color: "#2563eb", marginBottom: "24px" }}>
            This link doesn't contain a profile. Create one at the About Me editor.
          </p>
          <a href="/about-me/editor" style={{ padding: "12px 28px", borderRadius: "20px", background: teal, color: "#fff", fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: fs(15), textDecoration: "none" }}>
            Create About Me Profile
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: greyWhite, fontFamily: a11yStyle.fontFamily || "'Nunito', sans-serif", filter: a11yStyle.filter }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Lexend:wght@400;500;600&display=swap" />

      {/* Header banner — white, print-friendly */}
      <div style={{ background: "#ffffff", borderBottom: "2px solid #e2e8f0", padding: "24px 20px 20px", paddingTop: "calc(24px + 80px)" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", display: "flex", alignItems: "center", gap: "20px" }}>
          {photo ? (
            <img src={photo} alt={displayName} style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "2px solid #e2e8f0", flexShrink: 0 }} />
          ) : (
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#f1f5f9", border: "2px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: fs(36), flexShrink: 0 }}>
              👤
            </div>
          )}
          <div>
            <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: fs(26), color: "#1e3a5f", margin: "0 0 6px" }}>
              About {displayName}
            </p>
            {diagnosis && (
              <span style={{ display: "inline-block", padding: "3px 12px", borderRadius: "16px", background: "#f1f5f9", border: "1px solid #cbd5e1", fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: fs(13), color: "#1e3a5f" }}>
                {diagnosis}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Private & Confidential sticker */}
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "14px 20px 0" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
          background: "linear-gradient(135deg, #1e3a78 0%, #1e40af 50%, #1e3a78 100%)",
          border: "3px solid #1e2d6b",
          borderRadius: "6px",
          padding: "10px 20px",
          boxShadow: "0 2px 8px rgba(30,58,120,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Diagonal stripe texture overlay */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.08) 4px, rgba(0,0,0,0.08) 5px)",
            pointerEvents: "none",
          }} />
          <span style={{ fontSize: fs(18), lineHeight: 1 }}>🔒</span>
          <div style={{ textAlign: "center" }}>
            <p style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 900,
              fontSize: fs(15), color: "#f5c842",
              letterSpacing: "0.18em", textTransform: "uppercase",
              margin: 0, lineHeight: 1.1,
              textShadow: "0 1px 2px rgba(0,0,0,0.4)",
            }}>Private &amp; Confidential</p>
            <p style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 600,
              fontSize: fs(11), color: "#fcd97a",
              letterSpacing: "0.06em",
              margin: "3px 0 0", lineHeight: 1,
            }}>For authorised recipients only</p>
          </div>
          <span style={{ fontSize: fs(18), lineHeight: 1 }}>🔒</span>
        </div>
      </div>
      {/* Print button — hidden when printing */}
      <div className="no-print" style={{ maxWidth: "680px", margin: "0 auto", padding: "12px 20px 0", display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={() => window.print()}
          style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            background: "#ffffff", border: `1.5px solid ${teal}`,
            color: teal, fontFamily: "'Nunito', sans-serif", fontWeight: 800,
            fontSize: fs(13), padding: "8px 18px", borderRadius: "99px",
            cursor: "pointer", boxShadow: "0 1px 4px rgba(13,148,136,0.12)",
          }}
        >
          🖨️ Print / Save as PDF
        </button>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "24px 20px" }}>

        {/* EMERGENCY CONTACTS — always first, highlighted */}
        {emergencyContacts.filter(c => c.name || c.phone).length > 0 && (
          <div style={{ background: "#f0f4fa", border: "2px solid #1e3a5f", borderRadius: "20px", padding: "20px", marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: fs(18), color: "#1e3a5f", margin: 0 }}>Emergency Contacts</h2>
            </div>
            {emergencyContacts.filter(c => c.name || c.phone).map((ec, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: i < emergencyContacts.length - 1 ? "1px solid #cbd5e1" : "none" }}>
                <div>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: fs(15), color: "#1e3a5f", margin: "0 0 2px" }}>{ec.name}</p>
                  {ec.relationship && <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: fs(13), color: "#475569", margin: 0 }}>{ec.relationship}</p>}
                </div>
                {ec.phone && (
                  <a href={`tel:${ec.phone}`} style={{
                    padding: "10px 18px", borderRadius: "20px", background: "#1e3a5f", color: "#fff",
                    fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: fs(14), textDecoration: "none",
                  }}>
                    {ec.phone}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* WHO I AM */}
        {(dob || diagnosis || preferredName) && (
          <div style={{ background: cardBg, borderRadius: "20px", padding: "20px", marginBottom: "20px", border: "1.5px solid #e2e8f0" }}>
            <Section title="Who I Am" emoji="👤" accent={teal} fs={fs}>
              <InfoRow label="Full Name" value={name} fs={fs} />
              {preferredName && preferredName !== name && <InfoRow label="Preferred Name" value={preferredName} fs={fs} />}
              <InfoRow label="Date of Birth" value={dob} fs={fs} />
              <InfoRow label="Diagnosis" value={diagnosis} fs={fs} />
              <InfoRow label="Languages Spoken" value={languages} fs={fs} />
              <InfoRow label="Interpreter Needed" value={needsInterpreter} fs={fs} />
            </Section>
          </div>
        )}

        {/* WHEN I'M WELL — video */}
        {videoId && (
          <div style={{ background: cardBg, borderRadius: "20px", padding: "20px", marginBottom: "20px", border: "1.5px solid #e2e8f0" }}>
            <Section title="When I'm Well" emoji="🎬" accent={teal} fs={fs}>
              {videoDescription && <p style={{ fontFamily: "'Nunito', sans-serif", fontSize: fs(14), color: "#2563eb", fontStyle: "italic", marginBottom: "14px" }}>{videoDescription}</p>}
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: "12px", overflow: "hidden" }}>
                <iframe
                  ref={videoIframeRef}
                  src={`https://www.youtube.com/embed/${videoId}?rel=0&enablejsapi=1`}
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="When I'm Well"
                />
              </div>
            </Section>
          </div>
        )}

        {/* COMMUNICATION */}
        {(communicationStyle || aacDevice || keyWords || yesNoSignals || distressSignals) && (
          <div style={{ background: cardBg, borderRadius: "20px", padding: "20px", marginBottom: "20px", border: "1.5px solid #e2e8f0" }}>
            <Section title="How I Communicate" emoji="💬" accent={teal} fs={fs}>
              {communicationStyle && (
                <div style={{ marginBottom: "14px" }}>
                  <Pill text={
                    communicationStyle === "verbal" ? "Verbal communication" :
                    communicationStyle === "verbal-limited" ? "Limited verbal" :
                    communicationStyle === "aac" ? "AAC device" :
                    communicationStyle === "pecs" ? "PECS / picture cards" :
                    communicationStyle === "signing" ? "Auslan / key word signing" :
                    communicationStyle === "non-verbal" ? "Non-verbal" :
                    "Mixed communication"
                  } color={teal} fs={fs} />
                </div>
              )}
              <InfoRow label="AAC Device" value={aacDevice} fs={fs} />
              {keyWords && (
                <div style={{ marginBottom: "12px" }}>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: fs(13), color: "#2563eb", marginBottom: "6px" }}>Key Words</p>
                  <TextBlock value={keyWords} fs={fs} />
                </div>
              )}
              {yesNoSignals && (
                <div style={{ marginBottom: "12px" }}>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: fs(13), color: "#2563eb", marginBottom: "6px" }}>How I Show Yes and No</p>
                  <TextBlock value={yesNoSignals} fs={fs} />
                </div>
              )}
              {distressSignals && (
                <div>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: fs(13), color: "#2563eb", marginBottom: "6px" }}>Signs I'm in Pain or Distress</p>
                  <TextBlock value={distressSignals} fs={fs} />
                </div>
              )}
            </Section>
          </div>
        )}

        {/* WHAT I CAN DO */}
        {(canDo || needsHelp || mobilityAids || sensoryNeeds) && (
          <div style={{ background: cardBg, borderRadius: "20px", padding: "20px", marginBottom: "20px", border: "1.5px solid #e2e8f0" }}>
            <Section title="What I Can Do" emoji="💪" accent={teal} fs={fs}>
              {canDo && (
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: fs(13), color: "#2563eb", marginBottom: "6px" }}>I Can Do Independently</p>
                  <TextBlock value={canDo} fs={fs} />
                </div>
              )}
              {needsHelp && (
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: fs(13), color: "#2563eb", marginBottom: "6px" }}>I Need Help With</p>
                  <TextBlock value={needsHelp} fs={fs} />
                </div>
              )}
              <InfoRow label="Mobility Aids" value={mobilityAids} fs={fs} />
              {sensoryNeeds && (
                <div>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: fs(13), color: "#2563eb", marginBottom: "6px" }}>Sensory Needs</p>
                  <TextBlock value={sensoryNeeds} fs={fs} />
                </div>
              )}
            </Section>
          </div>
        )}

        {/* TRIGGERS & WHAT HELPS */}
        {(triggers || earlyWarnings || whatHelps || whatMakesWorse) && (
          <div style={{ background: cardBg, borderRadius: "20px", padding: "20px", marginBottom: "20px", border: "1.5px solid #e2e8f0" }}>
            <Section title="Triggers and What Helps" emoji="🌿" accent={teal} fs={fs}>
              {triggers && (
                <div style={{ marginBottom: "16px", background: "#fff7ed", borderRadius: "12px", padding: "14px" }}>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: fs(13), color: "#c2410c", marginBottom: "6px" }}>What Causes Distress</p>
                  <TextBlock value={triggers} fs={fs} />
                </div>
              )}
              {earlyWarnings && (
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: fs(13), color: "#2563eb", marginBottom: "6px" }}>Early Warning Signs</p>
                  <TextBlock value={earlyWarnings} fs={fs} />
                </div>
              )}
              {whatHelps && (
                <div style={{ marginBottom: "16px", background: "#f0fdf4", borderRadius: "12px", padding: "14px" }}>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: fs(13), color: teal, marginBottom: "6px" }}>What Helps Me Regulate</p>
                  <TextBlock value={whatHelps} fs={fs} />
                </div>
              )}
              {whatMakesWorse && (
                <div>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: fs(13), color: "#2563eb", marginBottom: "6px" }}>What Makes Things Worse</p>
                  <TextBlock value={whatMakesWorse} fs={fs} />
                </div>
              )}
            </Section>
          </div>
        )}

        {/* APPROACHES */}
        {(doThis || neverDo || culturalConsiderations) && (
          <div style={{ background: cardBg, borderRadius: "20px", padding: "20px", marginBottom: "20px", border: "1.5px solid #e2e8f0" }}>
            <Section title="Approaches That Work" emoji="🤝" accent={teal} fs={fs}>
              {doThis && (
                <div style={{ marginBottom: "16px", background: "#f0fdf4", borderRadius: "12px", padding: "14px" }}>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: fs(13), color: teal, marginBottom: "6px" }}>Please Do This</p>
                  <TextBlock value={doThis} fs={fs} />
                </div>
              )}
              {neverDo && (
                <div style={{ marginBottom: "16px", background: "#fff7ed", borderRadius: "12px", padding: "14px" }}>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: fs(13), color: "#c2410c", marginBottom: "6px" }}>Please Never Do This</p>
                  <TextBlock value={neverDo} fs={fs} />
                </div>
              )}
              {culturalConsiderations && (
                <div>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: fs(13), color: "#2563eb", marginBottom: "6px" }}>Cultural and Religious Considerations</p>
                  <TextBlock value={culturalConsiderations} fs={fs} />
                </div>
              )}
            </Section>
          </div>
        )}

        {/* PREFERENCES */}
        {(foodPreferences || music || routine || environment || goodDayLooksLike || whatMatters) && (
          <div style={{ background: cardBg, borderRadius: "20px", padding: "20px", marginBottom: "20px", border: "1.5px solid #e2e8f0" }}>
            <Section title="My Preferences" emoji="🌻" accent={teal} fs={fs}>
              {foodPreferences && (
                <div style={{ marginBottom: "14px" }}>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: fs(13), color: "#2563eb", marginBottom: "6px" }}>Food</p>
                  <TextBlock value={foodPreferences} fs={fs} />
                </div>
              )}
              {music && (
                <div style={{ marginBottom: "14px" }}>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: fs(13), color: "#2563eb", marginBottom: "6px" }}>Music and Entertainment</p>
                  <TextBlock value={music} fs={fs} />
                </div>
              )}
              {routine && (
                <div style={{ marginBottom: "14px" }}>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: fs(13), color: "#2563eb", marginBottom: "6px" }}>Routine</p>
                  <TextBlock value={routine} fs={fs} />
                </div>
              )}
              {environment && (
                <div style={{ marginBottom: "14px" }}>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: fs(13), color: "#2563eb", marginBottom: "6px" }}>Environment</p>
                  <TextBlock value={environment} fs={fs} />
                </div>
              )}
              {goodDayLooksLike && (
                <div style={{ marginBottom: "14px", background: "#f0fdf4", borderRadius: "12px", padding: "14px" }}>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: fs(13), color: teal, marginBottom: "6px" }}>What a Good Day Looks Like</p>
                  <TextBlock value={goodDayLooksLike} fs={fs} />
                </div>
              )}
              {whatMatters && (
                <div>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: fs(13), color: "#2563eb", marginBottom: "6px" }}>What Matters Most to Me</p>
                  <TextBlock value={whatMatters} fs={fs} />
                </div>
              )}
            </Section>
          </div>
        )}

        {/* NDIS INFO */}
        {(ndisNumber || planDates || coordinatorName) && (
          <div style={{ background: cardBg, borderRadius: "20px", padding: "20px", marginBottom: "20px", border: "1.5px solid #e2e8f0" }}>
            <Section title="NDIS Information" emoji="📋" accent={teal} fs={fs}>
              <InfoRow label="NDIS Number" value={ndisNumber} fs={fs} />
              <InfoRow label="Plan Dates" value={planDates} fs={fs} />
              <InfoRow label="Coordinator" value={coordinatorName} fs={fs} />
              {coordinatorPhone && (
                <div style={{ display: "flex", gap: "12px", marginBottom: "10px", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: fs(13), color: "#2563eb", minWidth: "130px" }}>Phone</span>
                  <a href={`tel:${coordinatorPhone}`} style={{ fontFamily: "'Nunito', sans-serif", fontSize: fs(14), color: teal, textDecoration: "none", fontWeight: 700 }}>{coordinatorPhone}</a>
                </div>
              )}
              {coordinatorEmail && (
                <div style={{ display: "flex", gap: "12px", marginBottom: "10px", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: fs(13), color: "#2563eb", minWidth: "130px" }}>Email</span>
                  <a href={`mailto:${coordinatorEmail}`} style={{ fontFamily: "'Nunito', sans-serif", fontSize: fs(14), color: teal, textDecoration: "none", fontWeight: 700 }}>{coordinatorEmail}</a>
                </div>
              )}
            </Section>
          </div>
        )}

      </div>

      {/* Footer */}
      <div style={{ background: "#f8fafc", borderTop: "1.5px solid #e2e8f0", padding: "20px", textAlign: "center" }}>
        <a href="https://insyncprofiles.net" style={{ fontFamily: "'Nunito', sans-serif", fontSize: fs(12), color: navy, fontWeight: 700, textDecoration: "none" }}>
          insyncprofiles.net
        </a>
      </div>
    </div>
  );
}
