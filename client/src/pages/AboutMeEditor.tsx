/* ============================================================
   About Me Editor — Participant / Aged Care Profile Editor
   Free tool for NDIS participants, aged care residents,
   families and carers to create a shareable About Me profile.
   Pale gold design with full accessibility:
   - Dictation (speech-to-text) on every text field
   - Dictation for dropdown selection
   - Large tap targets, high contrast labels
   ============================================================ */
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "wouter";
import { QRCodeSVG } from "qrcode.react";

// ── TYPES ─────────────────────────────────────────────────────

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

interface AboutMeProfile {
  name: string;
  preferredName: string;
  gender: string;
  dob: string;
  diagnosis: string;
  photo: string;
  emergencyContacts: EmergencyContact[];
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
  foodPreferences: string;
  music: string;
  routine: string;
  environment: string;
  goodDayLooksLike: string;
  whatMatters: string;
  ndisNumber: string;
  planDates: string;
  coordinatorName: string;
  coordinatorPhone: string;
  coordinatorEmail: string;
}

const EMPTY: AboutMeProfile = {
  name: "", preferredName: "", gender: "", dob: "", diagnosis: "", photo: "",
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
  // Include photo (Cloudinary URL) in share link
  if (p.photo) sp.set("photo", p.photo);
  const filled = p.emergencyContacts.filter(c => c.name || c.phone);
  if (filled.length) sp.set("ec", JSON.stringify(filled));
  return sp.toString();
}

// ── DICTATION HOOK ────────────────────────────────────────────

function useDictation() {
  const [listeningFor, setListeningFor] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const startDictation = useCallback((fieldId: string, onResult: (text: string) => void) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome on Android or desktop.");
      return;
    }
    // Stop any existing session
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.abort();
    }
    if (listeningFor === fieldId) {
      setListeningFor(null);
      return;
    }
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-AU";
    rec.onresult = (e: any) => {
      const transcript = e.results[0]?.[0]?.transcript || "";
      if (transcript) onResult(transcript);
    };
    rec.onend = () => setListeningFor(null);
    rec.onerror = () => setListeningFor(null);
    recognitionRef.current = rec;
    setListeningFor(fieldId);
    rec.start();
  }, [listeningFor]);

  return { listeningFor, startDictation };
}

// ── COLOURS ───────────────────────────────────────────────────

const C = {
  bg: "#f5f7ff",           // soft blue-white background
  card: "#ffffff",
  border: "#1e40af",       // deep blue border
  borderLight: "#bfdbfe",  // light blue
  accent: "#1e3a8a",       // deep navy blue — high contrast
  accentMid: "#1d4ed8",
  accentLight: "#eff6ff",  // very light blue tint
  teal: "#1d4ed8",         // blue for action buttons
  tealLight: "#dbeafe",
  red: "#991b1b",
  redLight: "#fff7ed",
  redBorder: "#f97316",
  gold: "#b45309",         // deep gold for highlights
  goldLight: "#fef3c7",    // pale gold background
  goldBorder: "#fcd34d",   // gold border
  headFont: "'Nunito', sans-serif" as const,
  bodyFont: "'Nunito', sans-serif" as const,
};

// ── DICTATION BUTTON ──────────────────────────────────────────

function DictationBtn({ fieldId, listeningFor, onStart }: {
  fieldId: string;
  listeningFor: string | null;
  onStart: () => void;
}) {
  const isListening = listeningFor === fieldId;
  return (
    <button
      type="button"
      onClick={onStart}
      title={isListening ? "Stop dictation" : "Tap to dictate"}
      style={{
        width: "40px", height: "40px", borderRadius: "50%", border: "none",
        background: isListening ? "#dc2626" : C.teal,
        color: "#fff", fontSize: "18px", cursor: "pointer", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: isListening ? "0 0 0 4px rgba(220,38,38,0.3)" : "none",
        transition: "all 200ms ease-out",
      }}
      aria-label={isListening ? "Stop dictation" : "Dictate this field"}
    >
      {isListening ? "⏹" : "🎤"}
    </button>
  );
}

// ── FIELD COMPONENT ───────────────────────────────────────────

function Field({ id, label, hint, value, onChange, multiline = false, rows = 3, listeningFor, onDictate }: {
  id: string; label: string; hint?: string; value: string;
  onChange: (v: string) => void; multiline?: boolean; rows?: number;
  listeningFor: string | null; onDictate: (id: string, cb: (t: string) => void) => void;
}) {
  const isListening = listeningFor === id;
  const inputStyle: React.CSSProperties = {
    flex: 1, padding: "12px 14px", borderRadius: "12px",
    border: `2px solid ${isListening ? "#dc2626" : C.border}`,
    fontFamily: C.bodyFont, fontSize: "15px",
    color: "#1c1917", background: isListening ? "#fff5f5" : "#fffdf5",
    outline: "none", boxSizing: "border-box",
    transition: "border-color 200ms ease-out",
  };
  return (
    <div style={{ marginBottom: "22px" }}>
      <label style={{ display: "block", fontFamily: C.headFont, fontWeight: 800, fontSize: "15px", color: C.accent, marginBottom: "6px" }}>
        {label}
      </label>
      {hint && <p style={{ fontFamily: C.bodyFont, fontSize: "13px", color: C.accentMid, margin: "0 0 8px" }}>{hint}</p>}
      {isListening && (
        <p style={{ fontFamily: C.bodyFont, fontSize: "13px", color: "#dc2626", fontWeight: 700, margin: "0 0 6px" }}>
          Listening... speak now
        </p>
      )}
      <div style={{ display: "flex", gap: "10px", alignItems: multiline ? "flex-start" : "center" }}>
        {multiline ? (
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            rows={rows}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            style={inputStyle}
          />
        )}
        <DictationBtn
          fieldId={id}
          listeningFor={listeningFor}
          onStart={() => onDictate(id, text => onChange(value ? value + " " + text : text))}
        />
      </div>
    </div>
  );
}

// ── SELECT WITH DICTATION ─────────────────────────────────────

function SelectField({ id, label, hint, value, onChange, options, listeningFor, onDictate }: {
  id: string; label: string; hint?: string; value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  listeningFor: string | null; onDictate: (id: string, cb: (t: string) => void) => void;
}) {
  const isListening = listeningFor === id;
  return (
    <div style={{ marginBottom: "22px" }}>
      <label style={{ display: "block", fontFamily: C.headFont, fontWeight: 800, fontSize: "15px", color: C.accent, marginBottom: "6px" }}>
        {label}
      </label>
      {hint && <p style={{ fontFamily: C.bodyFont, fontSize: "13px", color: C.accentMid, margin: "0 0 8px" }}>{hint}</p>}
      {isListening && (
        <p style={{ fontFamily: C.bodyFont, fontSize: "13px", color: "#dc2626", fontWeight: 700, margin: "0 0 6px" }}>
          Listening... say an option name
        </p>
      )}
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            flex: 1, padding: "12px 14px", borderRadius: "12px",
            border: `2px solid ${isListening ? "#dc2626" : C.border}`,
            fontFamily: C.bodyFont, fontSize: "15px", color: "#1c1917",
            background: isListening ? "#fff5f5" : "#fffdf5", outline: "none",
          }}
        >
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <DictationBtn
          fieldId={id}
          listeningFor={listeningFor}
          onStart={() => onDictate(id, text => {
            // Match spoken text to nearest option
            const lower = text.toLowerCase();
            const match = options.find(o => o.label.toLowerCase().includes(lower) || lower.includes(o.label.toLowerCase()));
            if (match && match.value) onChange(match.value);
          })}
        />
      </div>
      <p style={{ fontFamily: C.bodyFont, fontSize: "12px", color: C.accentMid, margin: "6px 0 0" }}>
        Options: {options.filter(o => o.value).map(o => o.label).join(", ")}
      </p>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────

export default function AboutMeEditor() {
  const [profile, setProfile] = useState<AboutMeProfile>(EMPTY);
  const [profileType, setProfileType] = useState<"disability" | "agedcare" | null>(null);
  const [activeTab, setActiveTab] = useState("who");
  const [shareUrl, setShareUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [shorteningUrl, setShorteningUrl] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedShort, setCopiedShort] = useState(false);
  const [saved, setSaved] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const { listeningFor, startDictation } = useDictation();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setProfile(JSON.parse(stored));
      const photo = localStorage.getItem(PHOTO_KEY);
      if (photo) setProfile(p => ({ ...p, photo }));
      const pt = localStorage.getItem("insync_aboutme_type");
      if (pt === "disability" || pt === "agedcare") setProfileType(pt);
    } catch {}
  }, []);

  // Debounced save — only write to localStorage 600ms after last change
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      try {
        const { photo, ...rest } = profile;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
        if (photo) localStorage.setItem(PHOTO_KEY, photo);
        setSaved(true);
        if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
        savedTimerRef.current = setTimeout(() => setSaved(false), 2000);
      } catch {}
    }, 600);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [profile]);

  // Debounced share URL update — same pattern
  const urlTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (urlTimerRef.current) clearTimeout(urlTimerRef.current);
    urlTimerRef.current = setTimeout(() => {
      if (profile.name) {
        const params = profileToParams(profile);
        setShareUrl(`${window.location.origin}/about-me/view?${params}`);
        // Clear cached short URL when profile changes — it's stale
        setShortUrl("");
        localStorage.removeItem("aboutme_short_url");
      } else {
        setShareUrl("");
        setShortUrl("");
      }
    }, 600);
    return () => { if (urlTimerRef.current) clearTimeout(urlTimerRef.current); };
  }, [profile]);

  // Restore cached short URL on mount
  useEffect(() => {
    const cached = localStorage.getItem("aboutme_short_url");
    if (cached) setShortUrl(cached);
  }, []);

  const set = useCallback((field: keyof AboutMeProfile, value: string) => {
    setProfile(p => ({ ...p, [field]: value }));
  }, []);

  const setEC = useCallback((index: number, field: keyof EmergencyContact, value: string) => {
    setProfile(p => {
      const contacts = [...p.emergencyContacts];
      contacts[index] = { ...contacts[index], [field]: value };
      return { ...p, emergencyContacts: contacts };
    });
  }, []);

  const addEC = useCallback(() => {
    setProfile(p => ({ ...p, emergencyContacts: [...p.emergencyContacts, { name: "", relationship: "", phone: "" }] }));
  }, []);

  const removeEC = useCallback((index: number) => {
    setProfile(p => ({ ...p, emergencyContacts: p.emergencyContacts.filter((_, i) => i !== index) }));
  }, []);

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Insync_profiles");
      const res = await fetch("https://api.cloudinary.com/v1_1/dqacbq4qp/image/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      set("photo", data.secure_url);
    } catch {
      alert("Photo upload failed. Please try again or use a smaller image.");
    } finally {
      setPhotoUploading(false);
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  function copyShortLink() {
    navigator.clipboard.writeText(shortUrl).then(() => { setCopiedShort(true); setTimeout(() => setCopiedShort(false), 2000); });
  }

  async function generateShortUrl() {
    if (!shareUrl) return;
    setShorteningUrl(true);
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: shareUrl }),
      });
      const data = await res.json();
      if (data.short) {
        setShortUrl(data.short);
        localStorage.setItem("aboutme_short_url", data.short);
      }
    } catch {}
    setShorteningUrl(false);
  }

  // Shared dictation props helper — memoised so Field props are stable
  const dp = useCallback((id: string) => {
    return { id, listeningFor, onDictate: startDictation };
  }, [listeningFor, startDictation]);

  function chooseProfileType(type: "disability" | "agedcare") {
    setProfileType(type);
    try { localStorage.setItem("insync_aboutme_type", type); } catch {}
  }

  const isAgedCare = profileType === "agedcare";

  const tabs = [
    { id: "who",        label: "Who I Am",                        emoji: "👤" },
    { id: "emergency",  label: "Emergency",                       emoji: "🆘" },
    { id: "comms",      label: "Communication",                   emoji: "💬" },
    { id: "video",      label: "When I'm Well",                   emoji: "🎬" },
    { id: "function",   label: "What I Can Do",                   emoji: "💪" },
    { id: "triggers",   label: "Triggers",                        emoji: "🌿" },
    { id: "approaches", label: "Approaches",                      emoji: "🤝" },
    { id: "prefs",      label: "Preferences",                     emoji: "🌻" },
    { id: "ndis",       label: isAgedCare ? "Care Info" : "NDIS Info", emoji: "📋" },
    { id: "share",      label: "Share",                           emoji: "🔗" },
  ];

  // Helper: prev/next tab navigation buttons rendered at the bottom of each tab
  function TabNav({ current }: { current: string }) {
    const idx = tabs.findIndex(t => t.id === current);
    const prev = idx > 0 ? tabs[idx - 1] : null;
    const next = idx < tabs.length - 1 ? tabs[idx + 1] : null;
    return (
      <div style={{ display: "flex", gap: "12px", marginTop: "36px", paddingTop: "24px", borderTop: `2px solid ${C.borderLight}` }}>
        {prev ? (
          <button
            onClick={() => { setActiveTab(prev.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            style={{
              flex: 1, padding: "16px 20px", borderRadius: "16px",
              border: `2px solid ${C.border}`, background: C.accentLight,
              color: C.accent, fontFamily: C.headFont, fontWeight: 900,
              fontSize: "16px", cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center", gap: "8px",
            }}
          >
            <span style={{ fontSize: "20px" }}>←</span> {prev.emoji} {prev.label}
          </button>
        ) : <div style={{ flex: 1 }} />}
        {next && (
          <button
            onClick={() => { setActiveTab(next.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            style={{
              flex: 1, padding: "16px 20px", borderRadius: "16px",
              border: "none", background: C.accent,
              color: "#fffbeb", fontFamily: C.headFont, fontWeight: 900,
              fontSize: "16px", cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center", gap: "8px",
              boxShadow: "0 4px 14px rgba(15,76,69,0.25)",
            }}
          >
            {next.emoji} {next.label} <span style={{ fontSize: "20px" }}>→</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: C.bodyFont }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" />

      {/* Header */}
      <div style={{ background: C.accent, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontFamily: C.headFont, fontWeight: 900, fontSize: "20px", color: "#fffbeb", margin: 0 }}>About Me Editor</p>
          <p style={{ fontFamily: C.bodyFont, fontSize: "12px", color: "#fde68a", margin: "2px 0 0" }}>Free — for participants, families and carers</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {saved && (
            <span style={{ fontFamily: C.bodyFont, fontSize: "13px", color: "#86efac", fontWeight: 700, transition: "opacity 300ms" }}>
              Saved
            </span>
          )}
          {profileType !== null && (
            <button
              onClick={() => { setProfileType(null); try { localStorage.removeItem("insync_aboutme_type"); } catch {} }}
              style={{
                background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.5)",
                fontFamily: C.headFont, fontWeight: 800, fontSize: "13px",
                color: "#fffbeb", cursor: "pointer", padding: "6px 14px",
                borderRadius: "20px",
              }}
            >
              ↩ Change type
            </button>
          )}
          <Link href="/" style={{ fontFamily: C.bodyFont, fontSize: "13px", color: "#fde68a", textDecoration: "none" }}>
            Back to InSync Profiles
          </Link>
        </div>
      </div>

      {/* Accessibility notice */}
      <div style={{ background: C.accent, borderBottom: `2px solid ${C.accentMid}`, padding: "12px 20px", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "20px" }}>🎤</span>
        <p style={{ fontFamily: C.bodyFont, fontSize: "13px", color: "#ffffff", margin: 0, fontWeight: 700 }}>
          Every field has a microphone button — tap it to dictate instead of type. Everything saves automatically.
        </p>
      </div>

      {/* ── INTRO / PURPOSE SCREEN ─────────────────────────────── */}
      {profileType === null && (
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 20px" }}>

          {/* Prelude */}
          <div style={{ background: C.bgCard, border: `1px solid ${C.borderLight}`, borderRadius: "16px", padding: "28px 24px", marginBottom: "36px" }}>
            <p style={{ fontFamily: C.bodyFont, fontSize: "17px", fontWeight: 800, color: C.accent, margin: "0 0 14px", lineHeight: 1.4 }}>
              Sometimes the biggest improvements aren't complicated.
            </p>
            <p style={{ fontFamily: C.bodyFont, fontSize: "15px", color: C.textBody, margin: "0 0 12px", lineHeight: 1.7 }}>
              They're the simple things that remove a frustration people have been carrying for years.
            </p>
            <p style={{ fontFamily: C.bodyFont, fontSize: "15px", color: C.textBody, margin: 0, lineHeight: 1.7 }}>
              The About Me Profile was created to reduce one of those frustrations: having to repeatedly explain your life, your needs and your preferences every time support changes.
            </p>
          </div>

          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <p style={{ fontFamily: C.headFont, fontWeight: 900, fontSize: "26px", color: C.accent, margin: "0 0 10px" }}>
              Who is this profile for?
            </p>
            <p style={{ fontFamily: C.bodyFont, fontSize: "15px", color: C.accentMid, margin: 0 }}>
              Choose the type that best describes the person. You can always change this later.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Card 1 — Disability / NDIS */}
            <button
              onClick={() => chooseProfileType("disability")}
              style={{
                width: "100%", textAlign: "left", background: "#ffffff",
                border: `3px solid ${C.border}`, borderRadius: "20px",
                padding: "28px 28px", cursor: "pointer",
                boxShadow: "0 4px 16px rgba(15,76,69,0.10)",
                transition: "transform 150ms ease-out, box-shadow 150ms ease-out",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
                <span style={{ fontSize: "36px" }}>♿</span>
                <div>
                  <p style={{ fontFamily: C.headFont, fontWeight: 900, fontSize: "22px", color: C.accent, margin: 0 }}>
                    Disability / NDIS
                  </p>
                  <p style={{ fontFamily: C.bodyFont, fontSize: "16px", color: "#1c1917", margin: "4px 0 0", fontWeight: 700 }}>
                    For NDIS participants, people with disability, and their families
                  </p>
                </div>
              </div>
              <p style={{ fontFamily: C.headFont, fontWeight: 900, fontSize: "14px", color: C.accent, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Example uses
              </p>
              <ul style={{ fontFamily: C.bodyFont, fontSize: "15px", color: "#1c1917", margin: 0, paddingLeft: "20px", lineHeight: "1.9", fontWeight: 700 }}>
                <li>Hospital admission — give nursing staff instant context about communication and care needs</li>
                <li>New support worker introduction — share before the first shift so they arrive prepared</li>
                <li>NDIS provider intake — replace lengthy intake forms with a personal, human profile</li>
                <li>School or therapy transition — help new teachers and therapists understand the person quickly</li>
                <li>Respite or short-term accommodation — ensure consistent care from day one</li>
              </ul>
              <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                <span style={{ fontFamily: C.headFont, fontWeight: 900, fontSize: "15px", color: "#ffffff", background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)", padding: "10px 24px", borderRadius: "20px", boxShadow: "0 2px 8px rgba(30,58,138,0.30)" }}>
                  Start your Profile
                </span>
              </div>
            </button>

            {/* Card 2 — Aged Care */}
            <button
              onClick={() => chooseProfileType("agedcare")}
              style={{
                width: "100%", textAlign: "left", background: "#ffffff",
                border: "3px solid #b45309", borderRadius: "20px",
                padding: "28px 28px", cursor: "pointer",
                boxShadow: "0 4px 16px rgba(180,83,9,0.12)",
                transition: "transform 150ms ease-out, box-shadow 150ms ease-out",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
                <span style={{ fontSize: "36px" }}>🌿</span>
                <div>
                  <p style={{ fontFamily: C.headFont, fontWeight: 900, fontSize: "22px", color: "#92400e", margin: 0 }}>
                    Aged Care
                  </p>
                  <p style={{ fontFamily: C.bodyFont, fontSize: "16px", color: "#1c1917", margin: "4px 0 0", fontWeight: 700 }}>
                    For aged care residents, Support at Home (SAH) recipients, and people transitioning to home
                  </p>
                </div>
              </div>
              <p style={{ fontFamily: C.headFont, fontWeight: 900, fontSize: "14px", color: "#92400e", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Example uses
              </p>
              <ul style={{ fontFamily: C.bodyFont, fontSize: "15px", color: "#1c1917", margin: 0, paddingLeft: "20px", lineHeight: "1.9", fontWeight: 700 }}>
                <li>New home care worker — share before the first visit so they know routines, preferences and needs</li>
                <li>Hospital stay — give ward staff key information about communication, mobility and daily care</li>
                <li>Transition to Home — share needs and routines with incoming home support workers as the person returns home</li>
                <li>Transition between services — carry personal context across providers without repeating everything</li>
                <li>Respite care — ensure consistent, person-centred care during short stays</li>
                <li>Residential care admission — help facility staff understand the person before they arrive</li>
              </ul>
              <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                <span style={{ fontFamily: C.headFont, fontWeight: 900, fontSize: "15px", color: "#ffffff", background: "linear-gradient(135deg, #92400e 0%, #b45309 100%)", padding: "10px 24px", borderRadius: "20px", boxShadow: "0 2px 8px rgba(146,64,14,0.30)" }}>
                  Start your Profile
                </span>
              </div>
            </button>

          </div>

          <p style={{ fontFamily: C.bodyFont, fontSize: "14px", color: "#1c1917", textAlign: "center", marginTop: "24px", fontWeight: 700 }}>
            Both profile types are completely free. No login required.
          </p>
        </div>
      )}

      {/* Tab bar — only shown once a type is selected */}
      {profileType !== null && (
        <>
      <div style={{ display: "flex", overflowX: "auto", background: "#ffffff", borderBottom: `2px solid ${C.borderLight}`, padding: "8px 8px", gap: "4px" }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "10px 14px", border: "none", cursor: "pointer", whiteSpace: "nowrap",
              fontFamily: C.headFont, fontWeight: activeTab === tab.id ? 900 : 600, fontSize: "13px",
              color: activeTab === tab.id ? "#ffffff" : "#57534e",
              background: activeTab === tab.id ? C.accent : "transparent",
              borderRadius: "12px",
              transition: "all 150ms ease-out",
              boxShadow: activeTab === tab.id ? "0 2px 8px rgba(30,58,138,0.30)" : "none",
            }}
          >
            {tab.emoji} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "24px 20px" }}>

        {/* Profile type indicator — always visible so user knows what mode they're in */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: isAgedCare ? "#fef3c7" : C.accentLight,
          border: `2px solid ${isAgedCare ? "#a16207" : C.border}`,
          borderRadius: "14px", padding: "12px 18px", marginBottom: "24px",
        }}>
          <span style={{ fontFamily: C.headFont, fontWeight: 800, fontSize: "14px", color: isAgedCare ? "#92400e" : C.accent }}>
            {isAgedCare ? "🏥 Aged Care profile" : "♿ Disability / NDIS profile"}
          </span>
          <button
            onClick={() => { setProfileType(null); try { localStorage.removeItem("insync_aboutme_type"); } catch {} }}
            style={{
              background: isAgedCare ? "#92400e" : C.accent,
              border: "none", fontFamily: C.headFont, fontWeight: 800,
              fontSize: "13px", color: "#fffbeb", cursor: "pointer",
              padding: "6px 16px", borderRadius: "20px",
            }}
          >
            ↩ Change
          </button>
        </div>

        {/* WHO I AM */}
        {activeTab === "who" && (
          <div>
            <h2 style={{ fontFamily: C.headFont, fontWeight: 900, fontSize: "22px", color: C.accent, marginBottom: "6px" }}>Who I Am</h2>
            <p style={{ fontFamily: C.bodyFont, fontSize: "14px", color: C.accentMid, marginBottom: "24px" }}>Basic information about the person this profile belongs to.</p>

            {/* Photo */}
            <div style={{ marginBottom: "28px", display: "flex", alignItems: "center", gap: "20px" }}>
              <div
                onClick={() => photoInputRef.current?.click()}
                style={{
                  width: "100px", height: "100px", borderRadius: "50%", cursor: "pointer",
                  background: profile.photo ? `url(${profile.photo}) center/cover` : C.accentLight,
                  border: `3px solid ${C.border}`, display: "flex", alignItems: "center",
                  justifyContent: "center", flexShrink: 0,
                }}
              >
                {!profile.photo && <span style={{ fontSize: "36px" }}>📷</span>}
              </div>
              <div>
                <p style={{ fontFamily: C.headFont, fontWeight: 800, fontSize: "15px", color: C.accent, margin: "0 0 6px" }}>Profile Photo</p>
                <p style={{ fontFamily: C.bodyFont, fontSize: "13px", color: C.accentMid, margin: "0 0 10px" }}>A warm, recent photo helps new staff connect immediately.</p>
                <button
                  onClick={() => photoInputRef.current?.click()}
                  disabled={photoUploading}
                  style={{
                    padding: "12px 28px", borderRadius: "16px",
                    border: `2px solid ${C.border}`, background: photoUploading ? C.accentLight : C.accent,
                    color: "#fffbeb", fontFamily: C.headFont, fontWeight: 900,
                    fontSize: "15px", cursor: photoUploading ? "not-allowed" : "pointer",
                    opacity: photoUploading ? 0.7 : 1,
                  }}
                >
                  {photoUploading ? "⏳ Uploading..." : "📷 Choose Photo"}
                </button>
                <input ref={photoInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
              </div>
            </div>

            <Field label="Full Name *" value={profile.name} onChange={v => set("name", v)} {...dp("name")} />
            <Field label="Preferred Name / Nickname" hint="What they like to be called day-to-day" value={profile.preferredName} onChange={v => set("preferredName", v)} {...dp("preferredName")} />
            <Field label="Date of Birth" hint="e.g. 12 March 1985" value={profile.dob} onChange={v => set("dob", v)} {...dp("dob")} />
            <Field
              label={isAgedCare ? "Health and Mobility Notes" : "Primary Disability / Diagnosis"}
              hint={isAgedCare ? "Broad description only — e.g. Dementia, Parkinson's, post-stroke. Do not include clinical detail." : "Broad description only — e.g. Autism, Cerebral Palsy, Dementia. Do not include clinical detail."}
              value={profile.diagnosis}
              onChange={v => set("diagnosis", v)}
              multiline rows={2}
              {...dp("diagnosis")}
            />
            <TabNav current="who" />
          </div>
        )}

        {/* EMERGENCY */}
        {activeTab === "emergency" && (
          <div>
            <h2 style={{ fontFamily: C.headFont, fontWeight: 900, fontSize: "22px", color: C.accent, marginBottom: "6px" }}>Emergency Contacts</h2>
            <p style={{ fontFamily: C.bodyFont, fontSize: "14px", color: C.accentMid, marginBottom: "24px" }}>The people to call first. This section is highlighted prominently on the profile.</p>

            {profile.emergencyContacts.map((ec, i) => (
              <div key={i} style={{ background: C.redLight, border: `2px solid ${C.redBorder}`, borderRadius: "16px", padding: "16px", marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <p style={{ fontFamily: C.headFont, fontWeight: 900, fontSize: "16px", color: C.red, margin: 0 }}>Contact {i + 1}</p>
                  {i > 0 && (
                    <button onClick={() => removeEC(i)} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: "20px", padding: "4px 8px" }}>✕</button>
                  )}
                </div>
                {/* Name */}
                <div style={{ marginBottom: "12px" }}>
                  <label style={{ display: "block", fontFamily: C.headFont, fontWeight: 800, fontSize: "14px", color: C.red, marginBottom: "6px" }}>Name</label>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input type="text" value={ec.name} onChange={e => setEC(i, "name", e.target.value)}
                      style={{ flex: 1, padding: "12px 14px", borderRadius: "12px", border: `2px solid ${C.redBorder}`, fontFamily: C.bodyFont, fontSize: "15px", color: "#1c1917", background: "#fff", outline: "none" }} />
                    <DictationBtn fieldId={`ec-${i}-name`} listeningFor={listeningFor} onStart={() => startDictation(`ec-${i}-name`, t => setEC(i, "name", t))} />
                  </div>
                </div>
                {/* Relationship */}
                <div style={{ marginBottom: "12px" }}>
                  <label style={{ display: "block", fontFamily: C.headFont, fontWeight: 800, fontSize: "14px", color: C.red, marginBottom: "6px" }}>Relationship</label>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input type="text" value={ec.relationship} onChange={e => setEC(i, "relationship", e.target.value)}
                      style={{ flex: 1, padding: "12px 14px", borderRadius: "12px", border: `2px solid ${C.redBorder}`, fontFamily: C.bodyFont, fontSize: "15px", color: "#1c1917", background: "#fff", outline: "none" }} />
                    <DictationBtn fieldId={`ec-${i}-rel`} listeningFor={listeningFor} onStart={() => startDictation(`ec-${i}-rel`, t => setEC(i, "relationship", t))} />
                  </div>
                </div>
                {/* Phone */}
                <div>
                  <label style={{ display: "block", fontFamily: C.headFont, fontWeight: 800, fontSize: "14px", color: C.red, marginBottom: "6px" }}>Phone</label>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input type="tel" value={ec.phone} onChange={e => setEC(i, "phone", e.target.value)}
                      style={{ flex: 1, padding: "12px 14px", borderRadius: "12px", border: `2px solid ${C.redBorder}`, fontFamily: C.bodyFont, fontSize: "15px", color: "#1c1917", background: "#fff", outline: "none" }} />
                    <DictationBtn fieldId={`ec-${i}-phone`} listeningFor={listeningFor} onStart={() => startDictation(`ec-${i}-phone`, t => setEC(i, "phone", t))} />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addEC}
              style={{
                width: "100%", padding: "16px 24px", borderRadius: "16px",
                border: `2px dashed ${C.border}`, background: C.accentLight,
                color: C.accent, fontFamily: C.headFont, fontWeight: 900,
                fontSize: "16px", cursor: "pointer", marginBottom: "8px",
              }}
            >
              + Add Another Emergency Contact
            </button>
            <TabNav current="emergency" />
          </div>
        )}

        {/* COMMUNICATION */}
        {activeTab === "comms" && (
          <div>
            <h2 style={{ fontFamily: C.headFont, fontWeight: 900, fontSize: "22px", color: C.accent, marginBottom: "6px" }}>How I Communicate</h2>
            <p style={{ fontFamily: C.bodyFont, fontSize: "14px", color: C.accentMid, marginBottom: "24px" }}>Help staff understand how to communicate effectively from the very first interaction.</p>

            <SelectField
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
              {...dp("communicationStyle")}
            />
            <Field label="AAC Device / Communication Aid" hint="e.g. Proloquo2Go on iPad, PODD book" value={profile.aacDevice} onChange={v => set("aacDevice", v)} {...dp("aacDevice")} />
            <Field label="Key Words I Use" hint="Words or phrases that are important to know" value={profile.keyWords} onChange={v => set("keyWords", v)} multiline rows={3} {...dp("keyWords")} />
            <Field label="How I Show Yes and No" hint="e.g. Nod for yes, turn head for no. Thumbs up/down." value={profile.yesNoSignals} onChange={v => set("yesNoSignals", v)} multiline rows={2} {...dp("yesNoSignals")} />
            <Field label="How to Know I'm in Pain or Distress" hint="Signs — facial expressions, sounds, body language, behaviour changes" value={profile.distressSignals} onChange={v => set("distressSignals", v)} multiline rows={3} {...dp("distressSignals")} />
            <TabNav current="comms" />
          </div>
        )}

        {/* WHEN I'M WELL */}
        {activeTab === "video" && (
          <div>
            <h2 style={{ fontFamily: C.headFont, fontWeight: 900, fontSize: "22px", color: C.accent, marginBottom: "6px" }}>When I'm Well</h2>
            <p style={{ fontFamily: C.bodyFont, fontSize: "14px", color: C.accentMid, marginBottom: "8px" }}>
              A video of the person at their best changes how staff treat them. Hospital staff almost never see this.
            </p>
            <div style={{ background: C.accentLight, border: `2px solid ${C.borderLight}`, borderRadius: "12px", padding: "14px", marginBottom: "24px" }}>
              <p style={{ fontFamily: C.headFont, fontWeight: 800, fontSize: "14px", color: C.accent, margin: "0 0 4px" }}>Use an unlisted YouTube video</p>
              <p style={{ fontFamily: C.bodyFont, fontSize: "13px", color: C.accentMid, margin: 0 }}>
                Upload to YouTube and set it to <strong>Unlisted</strong> — only people with the link can find it. Do not set it to Public if the video contains personal information.
              </p>
            </div>

            <Field label="YouTube Video URL" hint="Paste the full YouTube link — e.g. https://youtube.com/watch?v=..." value={profile.videoUrl} onChange={v => set("videoUrl", v)} {...dp("videoUrl")} />
            <Field label="Describe What's in the Video" hint="e.g. 'This is me at home on a good day — laughing with my family, using my AAC device.'" value={profile.videoDescription} onChange={v => set("videoDescription", v)} multiline rows={3} {...dp("videoDescription")} />

            {profile.videoUrl && (
              <div style={{ marginTop: "16px" }}>
                <p style={{ fontFamily: C.headFont, fontWeight: 800, fontSize: "14px", color: C.accent, marginBottom: "8px" }}>Preview:</p>
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
            <TabNav current="video" />
          </div>
        )}

        {/* WHAT I CAN DO */}
        {activeTab === "function" && (
          <div>
            <h2 style={{ fontFamily: C.headFont, fontWeight: 900, fontSize: "22px", color: C.accent, marginBottom: "6px" }}>What I Can Do</h2>
            <p style={{ fontFamily: C.bodyFont, fontSize: "14px", color: C.accentMid, marginBottom: "24px" }}>Cognitive and physical function — what I do independently and what I need support with.</p>

            <Field label="What I Can Do Independently" hint="e.g. Feed myself, communicate basic needs, walk short distances" value={profile.canDo} onChange={v => set("canDo", v)} multiline rows={4} {...dp("canDo")} />
            <Field label="What I Need Help With" hint="e.g. Transfers, showering, dressing, complex communication" value={profile.needsHelp} onChange={v => set("needsHelp", v)} multiline rows={4} {...dp("needsHelp")} />
            <Field label="Mobility Aids / Equipment" hint="e.g. Manual wheelchair, walking frame, CPAP machine, hearing aids" value={profile.mobilityAids} onChange={v => set("mobilityAids", v)} multiline rows={2} {...dp("mobilityAids")} />
            <Field label="Sensory Needs" hint="e.g. Sensitive to loud noise, needs dim lighting, dislikes certain textures" value={profile.sensoryNeeds} onChange={v => set("sensoryNeeds", v)} multiline rows={3} {...dp("sensoryNeeds")} />
            <TabNav current="function" />
          </div>
        )}

        {/* TRIGGERS */}
        {activeTab === "triggers" && (
          <div>
            <h2 style={{ fontFamily: C.headFont, fontWeight: 900, fontSize: "22px", color: C.accent, marginBottom: "6px" }}>Triggers and What Helps</h2>
            <p style={{ fontFamily: C.bodyFont, fontSize: "14px", color: C.accentMid, marginBottom: "24px" }}>Helps staff prevent distress and respond effectively when it happens.</p>

            <Field label="What Causes Distress (Triggers)" hint="e.g. Unexpected changes, loud environments, being touched without warning" value={profile.triggers} onChange={v => set("triggers", v)} multiline rows={4} {...dp("triggers")} />
            <Field label="Early Warning Signs" hint="Signs that distress is building — before it becomes a crisis" value={profile.earlyWarnings} onChange={v => set("earlyWarnings", v)} multiline rows={3} {...dp("earlyWarnings")} />
            <Field label="What Helps Me Regulate" hint="e.g. Quiet space, weighted blanket, favourite music, a specific person" value={profile.whatHelps} onChange={v => set("whatHelps", v)} multiline rows={3} {...dp("whatHelps")} />
            <Field label="What Makes Things Worse" hint="e.g. Restraint, raised voices, bright lights, being left alone" value={profile.whatMakesWorse} onChange={v => set("whatMakesWorse", v)} multiline rows={3} {...dp("whatMakesWorse")} />
            <TabNav current="triggers" />
          </div>
        )}

        {/* APPROACHES */}
        {activeTab === "approaches" && (
          <div>
            <h2 style={{ fontFamily: C.headFont, fontWeight: 900, fontSize: "22px", color: C.accent, marginBottom: "6px" }}>Approaches That Work</h2>
            <p style={{ fontFamily: C.bodyFont, fontSize: "14px", color: C.accentMid, marginBottom: "24px" }}>What staff should do, what they should never do, and cultural or religious considerations.</p>

            <Field label="Please Do This" hint="Approaches, strategies, or communication styles that work well" value={profile.doThis} onChange={v => set("doThis", v)} multiline rows={4} {...dp("doThis")} />
            <Field label="Please Never Do This" hint="Things that cause harm, distress, or are against the person's wishes" value={profile.neverDo} onChange={v => set("neverDo", v)} multiline rows={4} {...dp("neverDo")} />
            <Field label="Cultural or Religious Considerations" hint="e.g. Dietary requirements, prayer times, gender preferences for personal care" value={profile.culturalConsiderations} onChange={v => set("culturalConsiderations", v)} multiline rows={3} {...dp("culturalConsiderations")} />
            <TabNav current="approaches" />
          </div>
        )}

        {/* PREFERENCES */}
        {activeTab === "prefs" && (
          <div>
            <h2 style={{ fontFamily: C.headFont, fontWeight: 900, fontSize: "22px", color: C.accent, marginBottom: "6px" }}>My Preferences</h2>
            <p style={{ fontFamily: C.bodyFont, fontSize: "14px", color: C.accentMid, marginBottom: "24px" }}>What makes a good day, what brings comfort, what to know before you arrive.</p>

            <Field label="Food Preferences and Restrictions" hint="Likes, dislikes, allergies, texture needs, mealtime support" value={profile.foodPreferences} onChange={v => set("foodPreferences", v)} multiline rows={3} {...dp("foodPreferences")} />
            <Field label="Music and Entertainment" hint="Favourite music, TV shows, podcasts, games" value={profile.music} onChange={v => set("music", v)} multiline rows={2} {...dp("music")} />
            <Field label="Routine" hint="Important daily routines — order, timing, what must not be skipped" value={profile.routine} onChange={v => set("routine", v)} multiline rows={3} {...dp("routine")} />
            <Field label="Environment" hint="Preferred lighting, temperature, noise level, space requirements" value={profile.environment} onChange={v => set("environment", v)} multiline rows={2} {...dp("environment")} />
            <Field label="What a Good Day Looks Like" hint="Describe what the person is like when happy and comfortable" value={profile.goodDayLooksLike} onChange={v => set("goodDayLooksLike", v)} multiline rows={3} {...dp("goodDayLooksLike")} />
            <Field label="What Matters Most to Me" hint="Values, relationships, activities, goals — what makes life meaningful" value={profile.whatMatters} onChange={v => set("whatMatters", v)} multiline rows={3} {...dp("whatMatters")} />
            <TabNav current="prefs" />
          </div>
        )}

        {/* NDIS INFO */}
        {activeTab === "ndis" && (
          <div>
            <h2 style={{ fontFamily: C.headFont, fontWeight: 900, fontSize: "22px", color: C.accent, marginBottom: "6px" }}>
              {isAgedCare ? "Care Information" : "NDIS Information"}
            </h2>
            <p style={{ fontFamily: C.bodyFont, fontSize: "14px", color: C.accentMid, marginBottom: "8px" }}>
              {isAgedCare ? "Optional — for sharing with aged care providers and case managers." : "Optional — for sharing with NDIS providers and coordinators."}
            </p>
            <div style={{ background: C.redLight, border: `2px solid ${C.redBorder}`, borderRadius: "12px", padding: "14px", marginBottom: "24px" }}>
              <p style={{ fontFamily: C.headFont, fontWeight: 800, fontSize: "14px", color: C.red, margin: "0 0 4px" }}>Privacy note</p>
              <p style={{ fontFamily: C.bodyFont, fontSize: "13px", color: C.red, margin: 0 }}>
                {isAgedCare
                  ? "Your care ID and plan details will be visible to anyone with your profile link. Only include this if you're comfortable sharing it with providers."
                  : "Your NDIS number and plan details will be visible to anyone with your profile link. Only include this if you're comfortable sharing it with providers."}
              </p>
            </div>

            <Field
              label={isAgedCare ? "Care ID / Reference Number" : "NDIS Number"}
              value={profile.ndisNumber}
              onChange={v => set("ndisNumber", v)}
              {...dp("ndisNumber")}
            />
            <Field
              label={isAgedCare ? "Care Plan Dates" : "Plan Dates"}
              hint="e.g. 1 July 2025 to 30 June 2026"
              value={profile.planDates}
              onChange={v => set("planDates", v)}
              {...dp("planDates")}
            />
            <Field
              label={isAgedCare ? "Case Manager Name" : "Support Coordinator Name"}
              value={profile.coordinatorName}
              onChange={v => set("coordinatorName", v)}
              {...dp("coordinatorName")}
            />
            <Field
              label={isAgedCare ? "Case Manager Phone" : "Support Coordinator Phone"}
              value={profile.coordinatorPhone}
              onChange={v => set("coordinatorPhone", v)}
              {...dp("coordinatorPhone")}
            />
            <Field
              label={isAgedCare ? "Case Manager Email" : "Support Coordinator Email"}
              value={profile.coordinatorEmail}
              onChange={v => set("coordinatorEmail", v)}
              {...dp("coordinatorEmail")}
            />
            <TabNav current="ndis" />
          </div>
        )}

        {/* SHARE */}
        {activeTab === "share" && (
          <div>
            <h2 style={{ fontFamily: C.headFont, fontWeight: 900, fontSize: "22px", color: C.accent, marginBottom: "6px" }}>Share Your Profile</h2>
            <p style={{ fontFamily: C.bodyFont, fontSize: "14px", color: C.accentMid, marginBottom: "24px" }}>
              Share this link with hospitals, NDIS providers, aged care facilities, or any new service. No login needed.
            </p>

            {!profile.name ? (
              <div style={{ background: C.accentLight, border: `2px solid ${C.borderLight}`, borderRadius: "16px", padding: "24px", textAlign: "center" }}>
                <p style={{ fontFamily: C.headFont, fontWeight: 800, fontSize: "16px", color: C.accent, margin: "0 0 8px" }}>Add a name first</p>
                <p style={{ fontFamily: C.bodyFont, fontSize: "14px", color: C.accentMid, margin: 0 }}>Go to the "Who I Am" tab and enter the person's full name to generate your shareable link.</p>
              </div>
            ) : (
              <>
                {/* Short URL section */}
                <div style={{ background: C.accentLight, border: `2px solid ${C.borderLight}`, borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
                  <p style={{ fontFamily: C.headFont, fontWeight: 800, fontSize: "15px", color: C.accent, margin: "0 0 10px" }}>Short Link (TinyURL)</p>
                  {!shortUrl ? (
                    <button
                      onClick={generateShortUrl}
                      disabled={shorteningUrl}
                      style={{
                        width: "100%", padding: "14px", borderRadius: "12px", border: "none",
                        background: shorteningUrl ? "#5eead4" : C.teal, color: "#fff",
                        fontFamily: C.headFont, fontWeight: 800, fontSize: "15px", cursor: shorteningUrl ? "default" : "pointer",
                      }}
                    >
                      {shorteningUrl ? "Generating..." : "Generate Short Link"}
                    </button>
                  ) : (
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <input
                        readOnly
                        value={shortUrl}
                        style={{ flex: 1, padding: "12px 14px", borderRadius: "12px", border: `2px solid ${C.border}`, fontFamily: C.bodyFont, fontSize: "13px", color: "#1c1917", background: "#fff", outline: "none", fontWeight: 700 }}
                      />
                      <button
                        onClick={copyShortLink}
                        style={{
                          padding: "12px 20px", borderRadius: "12px", border: "none",
                          background: copiedShort ? "#16a34a" : C.teal, color: "#fff",
                          fontFamily: C.headFont, fontWeight: 800, fontSize: "14px", cursor: "pointer",
                          transition: "background 200ms ease-out", whiteSpace: "nowrap",
                        }}
                      >
                        {copiedShort ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  )}
                  {shortUrl && (
                    <p style={{ fontFamily: C.bodyFont, fontSize: "11px", color: C.accentMid, margin: "8px 0 0" }}>
                      Short link is cached. It will reset if you edit the profile.
                    </p>
                  )}
                </div>


                <div style={{ background: "#ffffff", border: `2px solid ${C.borderLight}`, borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                  <p style={{ fontFamily: C.headFont, fontWeight: 800, fontSize: "15px", color: C.accent, margin: 0 }}>QR Code</p>
                  <QRCodeSVG value={shortUrl || shareUrl} size={200} fgColor={C.accent} bgColor="#ffffff" level="M" />
                  <p style={{ fontFamily: C.bodyFont, fontSize: "12px", color: C.accentMid, margin: 0, textAlign: "center" }}>
                    {shortUrl ? "QR code uses your short link." : "Generate a short link above to use it in the QR code."} Screenshot to save.
                  </p>
                </div>

                <div style={{ marginTop: "24px" }}>
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "block", width: "100%", padding: "18px 36px",
                      borderRadius: "16px", boxSizing: "border-box",
                      background: C.accent, color: "#fffbeb", fontFamily: C.headFont, fontWeight: 900,
                      fontSize: "18px", textDecoration: "none", textAlign: "center",
                      boxShadow: "0 4px 16px rgba(15,76,69,0.30)",
                    }}
                  >
                    View My Profile →
                  </a>
                </div>
              </>
            )}
            <TabNav current="share" />
          </div>
        )}

      </div>
        </>
      )} {/* end profileType !== null */}

      {/* Footer */}
      {/* Privacy notice */}
      <div style={{ background: "#ffffff", border: `2px solid ${C.accent}`, borderRadius: "12px", margin: "0 16px 24px", padding: "18px 20px" }}>
        <p style={{ fontFamily: C.headFont, fontWeight: 900, fontSize: "14px", color: C.accent, margin: "0 0 8px", display: "flex", alignItems: "center", gap: "6px" }}>
          🔒 Your privacy is protected
        </p>
        <p style={{ fontFamily: C.bodyFont, fontSize: "13px", color: C.accent, margin: "0 0 6px", lineHeight: 1.7, fontWeight: 700 }}>
          <strong>InSync Profiles does not store, collect, or have access to any information you enter here.</strong>
        </p>
        <p style={{ fontFamily: C.bodyFont, fontSize: "13px", color: C.accent, margin: 0, lineHeight: 1.7 }}>
          Everything you fill in is saved <strong>only on this device</strong>, privately in your browser's local storage. Nothing is sent to any server. To access your profile again, return to this page on the same device and browser — your information will be waiting exactly as you left it.
        </p>
        <p style={{ fontFamily: C.bodyFont, fontSize: "12px", color: C.accentMid, margin: "8px 0 0", lineHeight: 1.6 }}>
          💡 <em>Tip: Save your short link or QR code from the Share tab — this is the only way to access your profile on a different device or after clearing your browser.</em>
        </p>
      </div>

      <div style={{ background: C.accentLight, borderTop: `2px solid ${C.borderLight}`, padding: "28px 20px", textAlign: "center", marginTop: "40px" }}>
        <a href="https://insyncprofiles.net" style={{ display: "inline-block", marginBottom: "12px" }}>
          <img
            src="/assets/insync-logo-transparent_9e0df532.png"
            alt="InSync Profiles"
            style={{ width: "72px", height: "72px", objectFit: "contain" }}
          />
        </a>
        <p style={{ fontFamily: C.bodyFont, fontSize: "12px", color: C.accentMid, margin: 0 }}>
          About Me Profiles are free — always. Created by{" "}
          <a href="https://insyncprofiles.net" style={{ color: C.accent, textDecoration: "none", fontWeight: 800 }}>InSync Profiles</a>.
        </p>
      </div>
    </div>
  );
}
