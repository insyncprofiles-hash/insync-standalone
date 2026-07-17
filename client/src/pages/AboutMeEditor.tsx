/* ============================================================
   About Me Editor — Participant / Aged Care Profile Editor
   Free tool for NDIS participants, aged care residents,
   families and carers to create a shareable About Me profile.
   Warm teal/sage design — distinct from the worker profile.
   Data stored in localStorage, shared via URL params.
   ============================================================ */
import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { QRCodeSVG } from "qrcode.react";

// ── TYPES ─────────────────────────────────────────────────────

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

interface AboutMeProfile {
  // Who I Am
  name: string;
  preferredName: string;
  gender: string;
  dob: string;
  diagnosis: string;
  photo: string; // base64
  // Emergency Contacts
  emergencyContacts: EmergencyContact[];
  // Communication
  communicationStyle: string; // verbal/non-verbal/AAC/mixed
  aacDevice: string;
  keyWords: string;
  yesNoSignals: string;
  distressSignals: string;
  // When I'm Well
  videoUrl: string;
  videoDescription: string;
  // What I Can Do
  canDo: string;
  needsHelp: string;
  mobilityAids: string;
  sensoryNeeds: string;
  // Triggers & What Helps
  triggers: string;
  earlyWarnings: string;
  whatHelps: string;
  whatMakesWorse: string;
  // Approaches That Work
  doThis: string;
  neverDo: string;
  culturalConsiderations: string;
  // My Preferences
  foodPreferences: string;
  music: string;
  routine: string;
  environment: string;
  goodDayLooksLike: string;
  whatMatters: string;
  // NDIS Info
  ndisNumber: string;
  planDates: string;
  coordinatorName: string;
  coordinatorPhone: string;
  coordinatorEmail: string;
}

const EMPTY: AboutMeProfile = {
  name: "", preferredName: "",   gender: "", dob: "", diagnosis: "", photo: "",
  emergencyContacts: [{ name: "", relationship: "", phone: "" }],
  communicationStyle: "verbal", aacDevice: "", keyWords: "", yesNoSignals: "", distressSignals: "",
  videoUrl: "", videoDescription: "",
  canDo: "", needsHelp: "", mobilityAids: "", sensoryNeeds: "",
  triggers: "", earlyWarnings: "", whatHelps: "", whatMakesWorse: "",
  doThis: "", neverDo: "", culturalConsiderations: "",
  foodPreferences: "", music: "", routine: "", environment: "", goodDayLooksLike: "", whatMatters: "",
  ndisNumber: "", planDates: "", coordinatorName: "", coordinatorPhone: "", coordinatorEmail: "",
};

const STORAGE_KEY = "insync_aboutme_profile";
const PHOTO_KEY = "insync_aboutme_photo";

function profileToParams(p: AboutMeProfile): string {
  const sp = new URLSearchParams();
  const fields: (keyof AboutMeProfile)[] = [
    "name","preferredName","gender","dob","diagnosis",
    "communicationStyle","aacDevice","keyWords","yesNoSignals","distressSignals",
    "videoUrl","videoDescription",
    "canDo","needsHelp","mobilityAids","sensoryNeeds",
    "triggers","earlyWarnings","whatHelps","whatMakesWorse",
    "doThis","neverDo","culturalConsiderations",
    "foodPreferences","music","routine","environment","goodDayLooksLike","whatMatters",
    "ndisNumber","planDates","coordinatorName","coordinatorPhone","coordinatorEmail",
  ];
  fields.forEach(f => { if (p[f]) sp.set(f, p[f] as string); });
  // Emergency contacts as JSON
  const filled = p.emergencyContacts.filter(c => c.name || c.phone);
  if (filled.length) sp.set("ec", JSON.stringify(filled));
  return sp.toString();
}

// ── COMPONENT ─────────────────────────────────────────────────

export default function AboutMeEditor() {
  const [profile, setProfile] = useState<AboutMeProfile>(EMPTY);
  const [activeTab, setActiveTab] = useState("who");
  const [shareUrl, setShareUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setProfile(JSON.parse(stored));
      const photo = localStorage.getItem(PHOTO_KEY);
      if (photo) setProfile(p => ({ ...p, photo }));
    } catch {}
  }, []);

  // Auto-save to localStorage whenever profile changes
  useEffect(() => {
    try {
      const { photo, ...rest } = profile;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
      if (photo) localStorage.setItem(PHOTO_KEY, photo);
    } catch {}
  }, [profile]);

  // Generate share URL
  useEffect(() => {
    if (profile.name) {
      const params = profileToParams(profile);
      setShareUrl(`${window.location.origin}/about-me/view?${params}`);
    } else {
      setShareUrl("");
    }
  }, [profile]);

  function set(field: keyof AboutMeProfile, value: string) {
    setProfile(p => ({ ...p, [field]: value }));
  }

  function setEC(index: number, field: keyof EmergencyContact, value: string) {
    setProfile(p => {
      const contacts = [...p.emergencyContacts];
      contacts[index] = { ...contacts[index], [field]: value };
      return { ...p, emergencyContacts: contacts };
    });
  }

  function addEC() {
    setProfile(p => ({ ...p, emergencyContacts: [...p.emergencyContacts, { name: "", relationship: "", phone: "" }] }));
  }

  function removeEC(index: number) {
    setProfile(p => ({ ...p, emergencyContacts: p.emergencyContacts.filter((_, i) => i !== index) }));
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => set("photo", ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function copyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => { setSaved(true); setTimeout(() => setSaved(false), 2000); });
  }

  // ── STYLES ──────────────────────────────────────────────────
  const teal = "#0d9488";
  const tealLight = "#ccfbf1";
  const sage = "#4ade80";
  const cream = "#fefce8";
  const warmWhite = "#f0fdf4";
  const headFont = "'Nunito', sans-serif";
  const bodyFont = "'Nunito', sans-serif";

  const tabs = [
    { id: "who",        label: "Who I Am",          emoji: "👤" },
    { id: "emergency",  label: "Emergency",          emoji: "🆘" },
    { id: "comms",      label: "Communication",      emoji: "💬" },
    { id: "video",      label: "When I'm Well",      emoji: "🎬" },
    { id: "function",   label: "What I Can Do",      emoji: "💪" },
    { id: "triggers",   label: "Triggers & Help",    emoji: "🌿" },
    { id: "approaches", label: "Approaches",         emoji: "🤝" },
    { id: "prefs",      label: "My Preferences",     emoji: "🌻" },
    { id: "ndis",       label: "NDIS Info",          emoji: "📋" },
    { id: "share",      label: "Share",              emoji: "🔗" },
  ];

  function Field({ label, hint, value, onChange, multiline = false, rows = 3 }: {
    label: string; hint?: string; value: string;
    onChange: (v: string) => void; multiline?: boolean; rows?: number;
  }) {
    return (
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontFamily: headFont, fontWeight: 700, fontSize: "14px", color: "#134e4a", marginBottom: "6px" }}>
          {label}
        </label>
        {hint && <p style={{ fontFamily: bodyFont, fontSize: "12px", color: "#5eead4", margin: "0 0 8px" }}>{hint}</p>}
        {multiline ? (
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            rows={rows}
            style={{
              width: "100%", padding: "12px 14px", borderRadius: "12px",
              border: "1.5px solid #99f6e4", fontFamily: bodyFont, fontSize: "14px",
              color: "#134e4a", background: "#f0fdfa", resize: "vertical",
              outline: "none", boxSizing: "border-box",
            }}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            style={{
              width: "100%", padding: "12px 14px", borderRadius: "12px",
              border: "1.5px solid #99f6e4", fontFamily: bodyFont, fontSize: "14px",
              color: "#134e4a", background: "#f0fdfa",
              outline: "none", boxSizing: "border-box",
            }}
          />
        )}
      </div>
    );
  }

  function Select({ label, hint, value, onChange, options }: {
    label: string; hint?: string; value: string;
    onChange: (v: string) => void; options: { value: string; label: string }[];
  }) {
    return (
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontFamily: headFont, fontWeight: 700, fontSize: "14px", color: "#134e4a", marginBottom: "6px" }}>{label}</label>
        {hint && <p style={{ fontFamily: bodyFont, fontSize: "12px", color: "#5eead4", margin: "0 0 8px" }}>{hint}</p>}
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            width: "100%", padding: "12px 14px", borderRadius: "12px",
            border: "1.5px solid #99f6e4", fontFamily: bodyFont, fontSize: "14px",
            color: "#134e4a", background: "#f0fdfa", outline: "none",
          }}
        >
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    );
  }

  // ── RENDER ──────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: warmWhite, fontFamily: bodyFont }}>
      {/* Google Fonts */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" />

      {/* Header */}
      <div style={{ background: teal, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontFamily: headFont, fontWeight: 900, fontSize: "20px", color: "#ffffff", margin: 0 }}>About Me Editor</p>
          <p style={{ fontFamily: bodyFont, fontSize: "12px", color: "#ccfbf1", margin: "2px 0 0" }}>Free — for participants, families and carers</p>
        </div>
        <Link href="/" style={{ fontFamily: bodyFont, fontSize: "13px", color: "#ccfbf1", textDecoration: "none" }}>
          Back to InSync Profiles
        </Link>
      </div>

      {/* Intro banner */}
      <div style={{ background: "#f0fdfa", borderBottom: "1.5px solid #99f6e4", padding: "14px 20px" }}>
        <p style={{ fontFamily: bodyFont, fontSize: "14px", color: "#134e4a", margin: 0 }}>
          Fill in as much or as little as you like. Everything saves automatically. When you're ready, go to the <strong>Share</strong> tab to get your link and QR code.
        </p>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", overflowX: "auto", background: "#ffffff", borderBottom: "1.5px solid #e0f2fe", padding: "0 8px", gap: "4px" }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "12px 14px", border: "none", cursor: "pointer", whiteSpace: "nowrap",
              fontFamily: headFont, fontWeight: activeTab === tab.id ? 800 : 600, fontSize: "13px",
              color: activeTab === tab.id ? teal : "#5eead4",
              background: "none",
              borderBottom: activeTab === tab.id ? `3px solid ${teal}` : "3px solid transparent",
              transition: "all 150ms ease-out",
            }}
          >
            {tab.emoji} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "24px 20px" }}>

        {/* WHO I AM */}
        {activeTab === "who" && (
          <div>
            <h2 style={{ fontFamily: headFont, fontWeight: 900, fontSize: "22px", color: "#134e4a", marginBottom: "6px" }}>Who I Am</h2>
            <p style={{ fontFamily: bodyFont, fontSize: "14px", color: "#5eead4", marginBottom: "24px" }}>Basic information about the person this profile belongs to.</p>

            {/* Photo */}
            <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "20px" }}>
              <div
                onClick={() => photoInputRef.current?.click()}
                style={{
                  width: "100px", height: "100px", borderRadius: "50%", cursor: "pointer",
                  background: profile.photo ? `url(${profile.photo}) center/cover` : "#ccfbf1",
                  border: `3px solid ${teal}`, display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {!profile.photo && <span style={{ fontSize: "36px" }}>📷</span>}
              </div>
              <div>
                <p style={{ fontFamily: headFont, fontWeight: 700, fontSize: "14px", color: "#134e4a", margin: "0 0 6px" }}>Profile Photo</p>
                <p style={{ fontFamily: bodyFont, fontSize: "12px", color: "#5eead4", margin: "0 0 10px" }}>A warm, recent photo helps new staff connect immediately.</p>
                <button
                  onClick={() => photoInputRef.current?.click()}
                  style={{ padding: "8px 16px", borderRadius: "20px", border: `1.5px solid ${teal}`, background: "white", color: teal, fontFamily: headFont, fontWeight: 700, fontSize: "13px", cursor: "pointer" }}
                >
                  Choose Photo
                </button>
                <input ref={photoInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
              </div>
            </div>

            <Field label="Full Name *" value={profile.name} onChange={v => set("name", v)} />
            <Field label="Preferred Name / Nickname" hint="What they like to be called day-to-day" value={profile.preferredName} onChange={v => set("preferredName", v)} />
            <Select label="Gender" value={profile.gender} onChange={v => set("gender", v)} options={[
              { value: "", label: "Select..." },
              { value: "Female", label: "Female" },
              { value: "Male", label: "Male" },
            ]} />
            <Field label="Date of Birth" value={profile.dob} onChange={v => set("dob", v)} />
            <Field label="Primary Disability / Diagnosis" hint="Broad description only — e.g. Autism, Cerebral Palsy, Dementia. Do not include clinical detail." value={profile.diagnosis} onChange={v => set("diagnosis", v)} multiline rows={2} />
          </div>
        )}

        {/* EMERGENCY */}
        {activeTab === "emergency" && (
          <div>
            <h2 style={{ fontFamily: headFont, fontWeight: 900, fontSize: "22px", color: "#134e4a", marginBottom: "6px" }}>Emergency Contacts</h2>
            <p style={{ fontFamily: bodyFont, fontSize: "14px", color: "#5eead4", marginBottom: "24px" }}>The people to call first. This section is highlighted prominently on the profile.</p>

            {profile.emergencyContacts.map((ec, i) => (
              <div key={i} style={{ background: "#fff7ed", border: "1.5px solid #fed7aa", borderRadius: "16px", padding: "16px", marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <p style={{ fontFamily: headFont, fontWeight: 800, fontSize: "15px", color: "#9a3412", margin: 0 }}>Contact {i + 1}</p>
                  {i > 0 && (
                    <button onClick={() => removeEC(i)} style={{ background: "none", border: "none", color: "#9a3412", cursor: "pointer", fontSize: "18px" }}>✕</button>
                  )}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontFamily: headFont, fontWeight: 700, fontSize: "13px", color: "#9a3412", marginBottom: "6px" }}>Name</label>
                    <input type="text" value={ec.name} onChange={e => setEC(i, "name", e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1.5px solid #fed7aa", fontFamily: bodyFont, fontSize: "14px", color: "#134e4a", background: "#fff", outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontFamily: headFont, fontWeight: 700, fontSize: "13px", color: "#9a3412", marginBottom: "6px" }}>Relationship</label>
                    <input type="text" value={ec.relationship} onChange={e => setEC(i, "relationship", e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1.5px solid #fed7aa", fontFamily: bodyFont, fontSize: "14px", color: "#134e4a", background: "#fff", outline: "none", boxSizing: "border-box" }} />
                  </div>
                </div>
                <div style={{ marginTop: "12px" }}>
                  <label style={{ display: "block", fontFamily: headFont, fontWeight: 700, fontSize: "13px", color: "#9a3412", marginBottom: "6px" }}>Phone</label>
                  <input type="tel" value={ec.phone} onChange={e => setEC(i, "phone", e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "10px", border: "1.5px solid #fed7aa", fontFamily: bodyFont, fontSize: "14px", color: "#134e4a", background: "#fff", outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
            ))}

            <button
              onClick={addEC}
              style={{ padding: "10px 20px", borderRadius: "20px", border: `1.5px solid ${teal}`, background: "white", color: teal, fontFamily: headFont, fontWeight: 700, fontSize: "14px", cursor: "pointer" }}
            >
              + Add Another Contact
            </button>
          </div>
        )}

        {/* COMMUNICATION */}
        {activeTab === "comms" && (
          <div>
            <h2 style={{ fontFamily: headFont, fontWeight: 900, fontSize: "22px", color: "#134e4a", marginBottom: "6px" }}>How I Communicate</h2>
            <p style={{ fontFamily: bodyFont, fontSize: "14px", color: "#5eead4", marginBottom: "24px" }}>Help staff understand how to communicate effectively from the very first interaction.</p>

            <Select
              label="Communication Style"
              value={profile.communicationStyle}
              onChange={v => set("communicationStyle", v)}
              options={[
                { value: "verbal", label: "Verbal — I speak clearly" },
                { value: "verbal-limited", label: "Verbal — limited words or sentences" },
                { value: "aac", label: "AAC device (speech generating device)" },
                { value: "pecs", label: "PECS / picture cards" },
                { value: "signing", label: "Auslan / key word signing" },
                { value: "non-verbal", label: "Non-verbal — no speech" },
                { value: "mixed", label: "Mixed — depends on the day" },
              ]}
            />
            <Field label="AAC Device / Communication Aid" hint="e.g. Proloquo2Go on iPad, PODD book, LAMP Words for Life" value={profile.aacDevice} onChange={v => set("aacDevice", v)} />
            <Field label="Key Words I Use" hint="Words or phrases that are important to know — especially if my speech is hard to understand" value={profile.keyWords} onChange={v => set("keyWords", v)} multiline rows={3} />
            <Field label="How I Show Yes and No" hint="e.g. Nod for yes, turn head for no. Thumbs up/down. Eye gaze up for yes." value={profile.yesNoSignals} onChange={v => set("yesNoSignals", v)} multiline rows={2} />
            <Field label="How to Know I'm in Pain or Distress" hint="Describe the signs — facial expressions, sounds, body language, behaviour changes" value={profile.distressSignals} onChange={v => set("distressSignals", v)} multiline rows={3} />
          </div>
        )}

        {/* WHEN I'M WELL */}
        {activeTab === "video" && (
          <div>
            <h2 style={{ fontFamily: headFont, fontWeight: 900, fontSize: "22px", color: "#134e4a", marginBottom: "6px" }}>When I'm Well</h2>
            <p style={{ fontFamily: bodyFont, fontSize: "14px", color: "#5eead4", marginBottom: "8px" }}>
              This is the most powerful section. Hospital staff and new providers almost never see the person at their best.
              A video of the person laughing, communicating, and engaging changes everything about how they're treated.
            </p>
            <div style={{ background: "#f0fdfa", border: "1.5px solid #99f6e4", borderRadius: "12px", padding: "14px", marginBottom: "24px" }}>
              <p style={{ fontFamily: headFont, fontWeight: 700, fontSize: "13px", color: teal, margin: "0 0 6px" }}>Tip: Use an unlisted YouTube video</p>
              <p style={{ fontFamily: bodyFont, fontSize: "13px", color: "#134e4a", margin: 0 }}>
                Upload to YouTube and set it to <strong>Unlisted</strong> — only people with the link can find it. This keeps it private while still being shareable. Do not set it to Public if the video contains personal information.
              </p>
            </div>

            <Field
              label="YouTube Video URL"
              hint="Paste the full YouTube link here — e.g. https://youtube.com/watch?v=..."
              value={profile.videoUrl}
              onChange={v => set("videoUrl", v)}
            />
            <Field
              label="Describe What's in the Video"
              hint="e.g. 'This is me at home on a good day — laughing with my family, using my AAC device, and doing my favourite puzzle.'"
              value={profile.videoDescription}
              onChange={v => set("videoDescription", v)}
              multiline
              rows={3}
            />

            {profile.videoUrl && (
              <div style={{ marginTop: "16px" }}>
                <p style={{ fontFamily: headFont, fontWeight: 700, fontSize: "13px", color: "#134e4a", marginBottom: "8px" }}>Preview:</p>
                <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: "12px", overflow: "hidden" }}>
                  <iframe
                    src={(() => {
                      try {
                        const u = new URL(profile.videoUrl);
                        const v = u.searchParams.get("v") || u.pathname.split("/").pop();
                        return `https://www.youtube.com/embed/${v}?rel=0`;
                      } catch { return ""; }
                    })()}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* WHAT I CAN DO */}
        {activeTab === "function" && (
          <div>
            <h2 style={{ fontFamily: headFont, fontWeight: 900, fontSize: "22px", color: "#134e4a", marginBottom: "6px" }}>What I Can Do</h2>
            <p style={{ fontFamily: bodyFont, fontSize: "14px", color: "#5eead4", marginBottom: "24px" }}>Cognitive and physical function — what I do independently and what I need support with.</p>

            <Field label="What I Can Do Independently" hint="e.g. Feed myself, communicate basic needs, walk short distances, use my phone" value={profile.canDo} onChange={v => set("canDo", v)} multiline rows={4} />
            <Field label="What I Need Help With" hint="e.g. Transfers, showering, dressing, complex communication, managing medications" value={profile.needsHelp} onChange={v => set("needsHelp", v)} multiline rows={4} />
            <Field label="Mobility Aids / Equipment" hint="e.g. Manual wheelchair, walking frame, CPAP machine, PEG tube, hearing aids" value={profile.mobilityAids} onChange={v => set("mobilityAids", v)} multiline rows={2} />
            <Field label="Sensory Needs" hint="e.g. Sensitive to loud noise, needs dim lighting, dislikes certain textures, requires sensory breaks" value={profile.sensoryNeeds} onChange={v => set("sensoryNeeds", v)} multiline rows={3} />
          </div>
        )}

        {/* TRIGGERS & WHAT HELPS */}
        {activeTab === "triggers" && (
          <div>
            <h2 style={{ fontFamily: headFont, fontWeight: 900, fontSize: "22px", color: "#134e4a", marginBottom: "6px" }}>Triggers and What Helps</h2>
            <p style={{ fontFamily: bodyFont, fontSize: "14px", color: "#5eead4", marginBottom: "24px" }}>This section helps staff prevent distress and respond effectively when it happens.</p>

            <Field label="What Causes Distress (Triggers)" hint="e.g. Unexpected changes to routine, loud environments, being touched without warning, certain foods or smells" value={profile.triggers} onChange={v => set("triggers", v)} multiline rows={4} />
            <Field label="Early Warning Signs" hint="Describe the signs that distress is building — before it becomes a crisis" value={profile.earlyWarnings} onChange={v => set("earlyWarnings", v)} multiline rows={3} />
            <Field label="What Helps Me Regulate" hint="e.g. Quiet space, weighted blanket, my favourite music, a specific person, a walk outside" value={profile.whatHelps} onChange={v => set("whatHelps", v)} multiline rows={3} />
            <Field label="What Makes Things Worse" hint="e.g. Restraint, raised voices, bright lights, being left alone, too many people talking at once" value={profile.whatMakesWorse} onChange={v => set("whatMakesWorse", v)} multiline rows={3} />
          </div>
        )}

        {/* APPROACHES */}
        {activeTab === "approaches" && (
          <div>
            <h2 style={{ fontFamily: headFont, fontWeight: 900, fontSize: "22px", color: "#134e4a", marginBottom: "6px" }}>Approaches That Work</h2>
            <p style={{ fontFamily: bodyFont, fontSize: "14px", color: "#5eead4", marginBottom: "24px" }}>What staff should do, what they should never do, and any cultural or religious considerations.</p>

            <Field label="Please Do This" hint="Specific approaches, strategies, or communication styles that work well" value={profile.doThis} onChange={v => set("doThis", v)} multiline rows={4} />
            <Field label="Please Never Do This" hint="Things that cause harm, distress, or are against the person's wishes or dignity" value={profile.neverDo} onChange={v => set("neverDo", v)} multiline rows={4} />
            <Field label="Cultural or Religious Considerations" hint="e.g. Dietary requirements, prayer times, gender preferences for personal care, cultural practices" value={profile.culturalConsiderations} onChange={v => set("culturalConsiderations", v)} multiline rows={3} />
          </div>
        )}

        {/* PREFERENCES */}
        {activeTab === "prefs" && (
          <div>
            <h2 style={{ fontFamily: headFont, fontWeight: 900, fontSize: "22px", color: "#134e4a", marginBottom: "6px" }}>My Preferences</h2>
            <p style={{ fontFamily: bodyFont, fontSize: "14px", color: "#5eead4", marginBottom: "24px" }}>The things that matter — what makes a good day, what brings comfort, what to know before you arrive.</p>

            <Field label="Food Preferences and Restrictions" hint="Likes, dislikes, allergies, texture needs, mealtime support required" value={profile.foodPreferences} onChange={v => set("foodPreferences", v)} multiline rows={3} />
            <Field label="Music and Entertainment" hint="Favourite music, TV shows, podcasts, games — what they enjoy" value={profile.music} onChange={v => set("music", v)} multiline rows={2} />
            <Field label="Routine" hint="Important daily routines — what order things happen, what time, what must not be skipped" value={profile.routine} onChange={v => set("routine", v)} multiline rows={3} />
            <Field label="Environment" hint="Preferred lighting, temperature, noise level, space requirements" value={profile.environment} onChange={v => set("environment", v)} multiline rows={2} />
            <Field label="What a Good Day Looks Like" hint="Describe what the person is like when they're happy and comfortable" value={profile.goodDayLooksLike} onChange={v => set("goodDayLooksLike", v)} multiline rows={3} />
            <Field label="What Matters Most to Me" hint="Values, relationships, activities, goals — what makes life meaningful for this person" value={profile.whatMatters} onChange={v => set("whatMatters", v)} multiline rows={3} />
          </div>
        )}

        {/* NDIS INFO */}
        {activeTab === "ndis" && (
          <div>
            <h2 style={{ fontFamily: headFont, fontWeight: 900, fontSize: "22px", color: "#134e4a", marginBottom: "6px" }}>NDIS Information</h2>
            <p style={{ fontFamily: bodyFont, fontSize: "14px", color: "#5eead4", marginBottom: "8px" }}>Optional — for sharing with NDIS providers and coordinators.</p>
            <div style={{ background: "#fff7ed", border: "1.5px solid #fed7aa", borderRadius: "12px", padding: "14px", marginBottom: "24px" }}>
              <p style={{ fontFamily: headFont, fontWeight: 700, fontSize: "13px", color: "#9a3412", margin: "0 0 4px" }}>Privacy note</p>
              <p style={{ fontFamily: bodyFont, fontSize: "13px", color: "#9a3412", margin: 0 }}>
                Your NDIS number and plan details will be visible to anyone with your profile link. Only include this information if you're comfortable sharing it with providers and coordinators.
              </p>
            </div>

            <Field label="NDIS Number" value={profile.ndisNumber} onChange={v => set("ndisNumber", v)} />
            <Field label="Plan Dates" hint="e.g. 1 July 2025 – 30 June 2026" value={profile.planDates} onChange={v => set("planDates", v)} />
            <Field label="Support Coordinator Name" value={profile.coordinatorName} onChange={v => set("coordinatorName", v)} />
            <Field label="Support Coordinator Phone" value={profile.coordinatorPhone} onChange={v => set("coordinatorPhone", v)} />
            <Field label="Support Coordinator Email" value={profile.coordinatorEmail} onChange={v => set("coordinatorEmail", v)} />
          </div>
        )}

        {/* SHARE */}
        {activeTab === "share" && (
          <div>
            <h2 style={{ fontFamily: headFont, fontWeight: 900, fontSize: "22px", color: "#134e4a", marginBottom: "6px" }}>Share Your Profile</h2>
            <p style={{ fontFamily: bodyFont, fontSize: "14px", color: "#5eead4", marginBottom: "24px" }}>
              Share this link with hospitals, NDIS providers, aged care facilities, or any new service. They'll see your full About Me profile — no login needed.
            </p>

            {!profile.name ? (
              <div style={{ background: "#f0fdfa", border: "1.5px solid #99f6e4", borderRadius: "16px", padding: "24px", textAlign: "center" }}>
                <p style={{ fontFamily: headFont, fontWeight: 700, fontSize: "16px", color: "#134e4a", margin: "0 0 8px" }}>Add a name first</p>
                <p style={{ fontFamily: bodyFont, fontSize: "14px", color: "#5eead4", margin: 0 }}>Go to the "Who I Am" tab and enter the person's full name to generate your shareable link.</p>
              </div>
            ) : (
              <>
                {/* Link */}
                <div style={{ background: "#f0fdfa", border: "1.5px solid #99f6e4", borderRadius: "16px", padding: "20px", marginBottom: "24px" }}>
                  <p style={{ fontFamily: headFont, fontWeight: 700, fontSize: "14px", color: "#134e4a", margin: "0 0 10px" }}>Your Profile Link</p>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input
                      readOnly
                      value={shareUrl}
                      style={{ flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #99f6e4", fontFamily: bodyFont, fontSize: "12px", color: "#134e4a", background: "#fff", outline: "none" }}
                    />
                    <button
                      onClick={copyLink}
                      style={{
                        padding: "10px 18px", borderRadius: "10px", border: "none",
                        background: saved ? "#4ade80" : teal, color: "#fff",
                        fontFamily: headFont, fontWeight: 700, fontSize: "13px", cursor: "pointer",
                        transition: "background 200ms ease-out", whiteSpace: "nowrap",
                      }}
                    >
                      {saved ? "Copied!" : "Copy Link"}
                    </button>
                  </div>
                </div>

                {/* QR Code */}
                <div style={{ background: "#ffffff", border: "1.5px solid #99f6e4", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                  <p style={{ fontFamily: headFont, fontWeight: 700, fontSize: "14px", color: "#134e4a", margin: 0 }}>QR Code</p>
                  <QRCodeSVG
                    value={shareUrl}
                    size={200}
                    fgColor={teal}
                    bgColor="#ffffff"
                    level="M"
                  />
                  <p style={{ fontFamily: bodyFont, fontSize: "12px", color: "#5eead4", margin: 0, textAlign: "center" }}>
                    Screenshot this QR code to save it. Anyone who scans it will open the About Me profile directly.
                  </p>
                  <button
                    onClick={() => {
                      const svg = document.querySelector(".share-qr-wrapper svg") as SVGSVGElement | null;
                      if (!svg) return;
                      const canvas = document.createElement("canvas");
                      canvas.width = 240; canvas.height = 240;
                      const ctx = canvas.getContext("2d");
                      const img = new Image();
                      const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
                      const url = URL.createObjectURL(blob);
                      img.onload = () => { ctx?.drawImage(img, 0, 0, 240, 240); const a = document.createElement("a"); a.href = canvas.toDataURL("image/png"); a.download = "about-me-qr.png"; a.click(); URL.revokeObjectURL(url); };
                      img.src = url;
                    }}
                    style={{ padding: "10px 20px", borderRadius: "20px", border: `1.5px solid ${teal}`, background: "white", color: teal, fontFamily: headFont, fontWeight: 700, fontSize: "13px", cursor: "pointer" }}
                  >
                    Download QR Code
                  </button>
                </div>

                {/* View profile */}
                <div style={{ marginTop: "24px", textAlign: "center" }}>
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-block", padding: "14px 32px", borderRadius: "24px",
                      background: teal, color: "#fff", fontFamily: headFont, fontWeight: 800,
                      fontSize: "16px", textDecoration: "none",
                    }}
                  >
                    View My Profile
                  </a>
                </div>
              </>
            )}
          </div>
        )}

      </div>

      {/* Footer */}
      <div style={{ background: "#f0fdfa", borderTop: "1.5px solid #99f6e4", padding: "20px", textAlign: "center", marginTop: "40px" }}>
        <p style={{ fontFamily: bodyFont, fontSize: "12px", color: "#5eead4", margin: 0 }}>
          About Me Profiles are free — always. Created by{" "}
          <a href="https://insyncprofiles.net" style={{ color: teal, textDecoration: "none", fontWeight: 700 }}>InSync Profiles</a>.
        </p>
      </div>
    </div>
  );
}
