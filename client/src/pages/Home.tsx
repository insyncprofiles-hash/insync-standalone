/* ============================================================
   Home.tsx — InSync Profiles
   Design: Aurora — Three-column layout matching reference image
   Left: Sidebar nav | Centre: Instagram post card | Right: Edit Profile panel
   Fonts: Cormorant Garamond (display) + Outfit (body)
   ============================================================ */
import React, { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { QRCodeSVG } from "qrcode.react";
import SocialPostPreview from "@/components/SocialPostPreview";
import { useColorTheme } from "@/contexts/ColorThemeContext";
import { useIsMobile } from "@/hooks/useMobile";
import { toast } from "sonner";
import WelcomeOverlay from "@/components/WelcomeOverlay";
import AACBoard from "@/components/AACBoard";
import { generateStandaloneHTML } from "@/lib/generateStandaloneHTML";
import { SKIN_PACKS, ALL_SKINS, getActiveSkin, setActiveSkin, getUnlockedPacks, unlockPack, verifyPackCode, ACTIVE_SKIN_KEY } from "@/lib/skins";
import { useA11y } from "@/hooks/useA11y";

export interface VehicleOption {
  id: string;
  label: string;
  checked: boolean;
}
export interface VehicleOptions {
  vehicleType: VehicleOption[];
  wheelchairAccess: VehicleOption[];
  entryHeight: VehicleOption[];
  weightCapacity: VehicleOption[];
}
export interface ProfileData {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  phone: string;
  email: string;
  website: string;
  instagram: string;
  whatsapp: string;
  contactLabel: string;
  profileImage: string | null;
  services: ServiceItem[];
  badges: string[];
  ctaText: string;
  accentColor: string;
  experienceGroups: ExperienceGroup[];
  availability: { [key: string]: boolean };
  availFrom: string;
  availTo: string;
  languages: string[];
  vehicleOptions: VehicleOptions;
  showUpStyle: { communicate: string[]; connect: string[]; presence: string[] };
}

export interface ServiceItem {
  id: string;
  icon: string;
  label: string;
  selected: boolean;
  description: string;
}

export interface ExperienceItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface ExperienceGroup {
  id: string;
  title: string;
  icon: string;
  items: ExperienceItem[];
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DEFAULT_LANGUAGES = ["English"];
const ALL_LANGUAGES = ["English", "Mandarin", "Cantonese", "Arabic", "Vietnamese", "Greek", "Italian", "Hindi", "Punjabi", "Spanish", "Filipino", "Korean", "Auslan", "Turkish", "Portuguese"];

const DEFAULT_EXPERIENCE_GROUPS: ExperienceGroup[] = [
  {
    id: "physical", title: "Physical Disability", icon: "🧑",
    items: [
      { id: "spinal", label: "Spinal Cord Injury", checked: false },
      { id: "cerebral", label: "Cerebral Palsy", checked: false },
      { id: "ms", label: "Multiple Sclerosis (MS)", checked: false },
      { id: "muscular", label: "Muscular Dystrophy", checked: false },
      { id: "acquired-brain", label: "Acquired Brain Injury (ABI)", checked: false },
      { id: "stroke", label: "Stroke Recovery", checked: false },
      { id: "amputation", label: "Limb Difference / Amputation", checked: false },
      { id: "chronic-pain", label: "Chronic Pain Conditions", checked: false },
    ],
  },
  {
    id: "cognitive", title: "Cognitive & Intellectual", icon: "🧠",
    items: [
      { id: "intellectual", label: "Intellectual Disability", checked: false },
      { id: "down-syndrome", label: "Down Syndrome", checked: false },
      { id: "dementia", label: "Dementia / Alzheimer's", checked: false },
      { id: "adhd", label: "ADHD", checked: false },
      { id: "learning", label: "Learning Disabilities", checked: false },
      { id: "prader-willi", label: "Prader-Willi Syndrome", checked: false },
    ],
  },
  {
    id: "autism", title: "Autism & Sensory", icon: "🌈",
    items: [
      { id: "asd", label: "Autism Spectrum Disorder (ASD)", checked: false },
      { id: "sensory", label: "Sensory Processing Disorder", checked: false },
      { id: "non-verbal", label: "Non-verbal / AAC Users", checked: false },
      { id: "pda", label: "Pathological Demand Avoidance (PDA)", checked: false },
    ],
  },
  {
    id: "mental-health", title: "Mental Health", icon: "🧠",
    items: [
      { id: "anxiety", label: "Anxiety Disorders", checked: false },
      { id: "depression", label: "Depression", checked: false },
      { id: "bipolar", label: "Bipolar Disorder", checked: false },
      { id: "ptsd", label: "PTSD / Trauma", checked: false },
      { id: "bpd", label: "Borderline Personality Disorder", checked: false },
      { id: "eating", label: "Eating Disorders", checked: false },
      { id: "ocd", label: "OCD", checked: false },
    ],
  },
  {
    id: "sensory", title: "Sensory Impairment", icon: "👁️",
    items: [
      { id: "vision", label: "Vision Impairment / Blindness", checked: false },
      { id: "hearing", label: "Hearing Impairment / Deafness", checked: false },
      { id: "deafblind", label: "DeafBlind", checked: false },
      { id: "auslan", label: "Auslan / Sign Language", checked: false },
    ],
  },
  {
    id: "elderly", title: "Elderly & Aged Care", icon: "🌸",
    items: [
      { id: "aged-daily", label: "Daily Living Assistance", checked: false },
      { id: "aged-mobility", label: "Mobility & Falls Prevention", checked: false },
      { id: "aged-dementia", label: "Dementia Care", checked: false },
      { id: "aged-palliative", label: "Palliative / End-of-Life Care", checked: false },
      { id: "aged-social", label: "Social Isolation Support", checked: false },
      { id: "aged-medication", label: "Medication Management", checked: false },
      { id: "aged-respite", label: "Respite Care", checked: false },
    ],
  },
  {
    id: "complex", title: "Complex & High Needs", icon: "🏥",
    items: [
      { id: "complex-behaviour", label: "Complex Behaviour Support", checked: false },
      { id: "peg", label: "PEG / Enteral Feeding", checked: false },
      { id: "tracheostomy", label: "Tracheostomy Care", checked: false },
      { id: "ventilator", label: "Ventilator / Respiratory Support", checked: false },
      { id: "catheter", label: "Catheter / Continence Care", checked: false },
      { id: "wound", label: "Wound Management", checked: false },
    ],
  },
  {
    id: "professional-skills", title: "Professional Skills", icon: "🛠",
    items: [
      { id: "safe-transfers", label: "Safe Transfers & Mobility Assistance", checked: false },
      { id: "risk-assessments", label: "Risk Assessments", checked: false },
      { id: "research-advocacy", label: "Research & Advocacy", checked: false },
      { id: "care-planning", label: "Care Planning & Goal Setting", checked: false },
      { id: "incident-reporting", label: "Incident Reporting & Documentation", checked: false },
      { id: "manual-handling", label: "Manual Handling", checked: false },
      { id: "first-aid-cpr", label: "First Aid / CPR Certified", checked: false },
      { id: "medication-admin", label: "Medication Administration", checked: false },
    ],
  },
];

const ALL_AVAILABLE_SERVICES: ServiceItem[] = [
  { id: "personal-care", icon: "🤲", label: "Personal Care", selected: false, description: "Personal hygiene & daily routines" },
  { id: "emotional", icon: "🌿", label: "Emotional Support", selected: false, description: "Mental wellbeing & companionship" },
  { id: "community", icon: "👥", label: "Community Access", selected: false, description: "Social outings & participation" },
  { id: "mental", icon: "🧠", label: "Mental Wellbeing", selected: false, description: "Mindfulness & emotional regulation" },
  { id: "daily-living", icon: "📋", label: "Daily Living Support", selected: false, description: "Household tasks & goal planning" },
  { id: "transport", icon: "🚗", label: "Transport Assistance", selected: false, description: "Driving to appointments & activities" },
  { id: "domestic", icon: "🧹", label: "Domestic Assistance", selected: false, description: "Cleaning, cooking & home tasks" },
  { id: "medication", icon: "💊", label: "Medication Support", selected: false, description: "Prompting & administering medication" },
  { id: "behaviour", icon: "💡", label: "Behaviour Support", selected: false, description: "Positive behaviour strategies" },
  { id: "overnight", icon: "🌙", label: "Overnight / Sleepover", selected: false, description: "Overnight care & active nights" },
  { id: "social-skills", icon: "🤝", label: "Social Skills Development", selected: false, description: "Building confidence & connections" },
  { id: "employment", icon: "💼", label: "Employment Support", selected: false, description: "Job readiness & workplace assistance" },
  { id: "therapy-assist", icon: "🎯", label: "Therapy Assistance", selected: false, description: "Supporting OT, physio & speech goals" },
  { id: "aac-comm", icon: "🗣", label: "AAC Communication", selected: false, description: "Augmentative & alternative communication" },
  { id: "auslan", icon: "🤟", label: "Auslan / Sign Language", selected: false, description: "Auslan-fluent support" },
  { id: "respite", icon: "🏠", label: "In-Home Respite", selected: false, description: "Carer relief & family support" },
  { id: "school-leaver", icon: "🎓", label: "School Leaver Support", selected: false, description: "SLES & transition to adulthood" },
  { id: "plan-management", icon: "📊", label: "Plan Management Support", selected: false, description: "Helping navigate NDIS plans" },
  { id: "exercise", icon: "🏋", label: "Exercise & Fitness", selected: false, description: "Active lifestyle & physical health" },
  { id: "creative", icon: "🎨", label: "Creative Arts Therapy", selected: false, description: "Art, music & expressive therapies" },
];

const DEFAULT_SERVICES: ServiceItem[] = ALL_AVAILABLE_SERVICES.slice(0, 5).map(s => ({ ...s, selected: true }));

const DEFAULT_VEHICLE_OPTIONS: VehicleOptions = {
  vehicleType: [
    { id: "sedan", label: "Standard Sedan", checked: false },
    { id: "station-wagon", label: "Station Wagon", checked: false },
    { id: "suv", label: "SUV", checked: false },
    { id: "minivan", label: "Minivan / People Mover", checked: false },
    { id: "transit-van", label: "Commercial Transit Van", checked: false },
  ],
  wheelchairAccess: [
    { id: "ambulatory", label: "Ambulatory (No wheelchair)", checked: false },
    { id: "collapsible", label: "Collapsible wheelchair (Stored in boot)", checked: false },
    { id: "rear-ramp", label: "Rear-entry ramp (WAV)", checked: false },
    { id: "side-ramp", label: "Side-entry ramp (WAV)", checked: false },
    { id: "hoist", label: "Hydraulic hoist / lift", checked: false },
  ],
  entryHeight: [
    { id: "standard-low", label: "Standard low-rise entry", checked: false },
    { id: "lowered-floor", label: "Lowered-floor entry", checked: false },
    { id: "high-rise", label: "High-rise / High-roof entry", checked: false },
    { id: "kneeling", label: "Automated kneeling suspension", checked: false },
  ],
  weightCapacity: [
    { id: "standard-duty", label: "Standard duty (Under 300kg total combined chair and user weight)", checked: false },
    { id: "heavy-duty", label: "Heavy duty / Bariatric (Over 300kg total combined chair and user weight)", checked: false },
  ],
};

const DEFAULT_PROFILE: ProfileData = {
  name: "Sophie Langford",
  title: "Support Worker",
  tagline: "I get it. I see you. I'm here.",
  bio: "Compassionate support tailored to your unique journey. Here to help you live life on your terms.",
  location: "Melbourne, Australia",
  phone: "",
  email: "",
  website: "",
  instagram: "support.with.soul",
  whatsapp: "",
  contactLabel: "Contact",
  profileImage: null,
  services: DEFAULT_SERVICES,
  badges: ["NDIS Worker Check", "First Aid Certified", "Mental Health Support", "Working With Children Check", "Public Liability Insurance", "Professional Indemnity Insurance"],
  ctaText: "MESSAGE TO BEGIN",
  accentColor: "gold",
  experienceGroups: DEFAULT_EXPERIENCE_GROUPS,
  availability: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false },
  availFrom: "9:00 AM",
  availTo: "5:00 PM",
  languages: DEFAULT_LANGUAGES,
  vehicleOptions: DEFAULT_VEHICLE_OPTIONS,
  showUpStyle: { communicate: [], connect: [], presence: [] },
};

// ── URL param helpers ─────────────────────────────────────────
function encodeProfileToURL(profile: ProfileData, videoUrl?: string | null): string {
  const params = new URLSearchParams();
  params.set("name", profile.name);
  if (profile.title) params.set("title", profile.title);
  params.set("tagline", profile.tagline);
  params.set("bio", profile.bio);
  params.set("location", profile.location);
  if (profile.phone) params.set("phone", profile.phone);
  params.set("email", profile.email);
  params.set("website", profile.website);
  if (profile.instagram) params.set("instagram", profile.instagram);
  if (profile.whatsapp) params.set("whatsapp", profile.whatsapp);
  if (profile.contactLabel && profile.contactLabel !== "Contact") params.set("contactLabel", profile.contactLabel);
  params.set("ctaText", profile.ctaText);
  const selectedServices = profile.services.filter(s => s.selected).map(s => s.id).join(",");
  if (selectedServices) params.set("services", selectedServices);
  const checkedExp = profile.experienceGroups
    .flatMap(g => g.items.filter(i => i.checked).map(i => `${g.id}:${i.id}`));
  if (checkedExp.length > 0) params.set("exp", checkedExp.join(","));
  if (profile.languages && profile.languages.length > 0) params.set("languages", profile.languages.join(","));
  if (profile.badges && profile.badges.length > 0) params.set("badges", profile.badges.join("|"));
  // Availability: encode as "Mon,Tue,Wed" for checked days
  const availDays = Object.entries(profile.availability).filter(([, v]) => v).map(([k]) => k);
  if (availDays.length > 0) params.set("availDays", availDays.join(","));
  if (profile.availFrom) params.set("availFrom", profile.availFrom);
  if (profile.availTo) params.set("availTo", profile.availTo);
  // Vehicle options: encode checked items per category as "vehicleType:sedan,suv|wheelchairAccess:rear-ramp"
  const vehicleParts: string[] = [];
  (Object.keys(profile.vehicleOptions) as (keyof typeof profile.vehicleOptions)[]).forEach(cat => {
    const checked = profile.vehicleOptions[cat].filter(i => i.checked).map(i => i.id);
    if (checked.length > 0) vehicleParts.push(`${cat}:${checked.join(",")}`);
  });
  if (vehicleParts.length > 0) params.set("vehicle", vehicleParts.join("|"));
  if (videoUrl) params.set("video", videoUrl);
  // Include Cloudinary photo URL if present (not base64)
  if (profile.profileImage && profile.profileImage.startsWith("http")) {
    params.set("photo", profile.profileImage);
  }
  // How I Show Up
  if (profile.showUpStyle.communicate.length > 0) params.set("susCom", profile.showUpStyle.communicate.join(","));
  if (profile.showUpStyle.connect.length > 0) params.set("susCon", profile.showUpStyle.connect.join(","));
  if (profile.showUpStyle.presence.length > 0) params.set("susPre", profile.showUpStyle.presence.join(","));
  return `${window.location.origin}/view?${params.toString()}`;
}
function encodeProfileToURLWithSkin(profile: ProfileData, videoUrl?: string | null, skinId?: string): string {
  const base = encodeProfileToURL(profile, videoUrl);
  const url = new URL(base);
  if (skinId && skinId !== "default") url.searchParams.set("skinId", skinId);
  // Include font scale from accessibility settings so client view matches
  try {
    const a11y = JSON.parse(localStorage.getItem("sw-accessibility-settings") || "{}");
    const scale = parseFloat(a11y.fontSize || "1");
    if (scale && scale !== 1) url.searchParams.set("fontScale", String(scale));
  } catch {}
  return url.toString();
}

function loadProfileFromURL(): Partial<ProfileData> | null {
  const params = new URLSearchParams(window.location.search);
  if (!params.get("name")) return null;
  const overrides: Partial<ProfileData> = {};
  if (params.get("name")) overrides.name = params.get("name")!;
  if (params.get("tagline")) overrides.tagline = params.get("tagline")!;
  if (params.get("bio")) overrides.bio = params.get("bio")!;
  if (params.get("location")) overrides.location = params.get("location")!;
  if (params.get("phone")) overrides.phone = params.get("phone")!;
  if (params.get("email")) overrides.email = params.get("email")!;
  if (params.get("website")) overrides.website = params.get("website")!;
  if (params.get("instagram")) overrides.instagram = params.get("instagram")!;
  if (params.get("whatsapp")) overrides.whatsapp = params.get("whatsapp")!;
  if (params.get("contactLabel")) overrides.contactLabel = params.get("contactLabel")!;
  if (params.get("ctaText")) overrides.ctaText = params.get("ctaText")!;
  if (params.get("services")) {
    const ids = params.get("services")!.split(",");
    overrides.services = DEFAULT_SERVICES.map(s => ({ ...s, selected: ids.includes(s.id) }));
  }
  if (params.get("exp")) {
    const pairs = params.get("exp")!.split(",").map(p => p.split(":"));
    overrides.experienceGroups = DEFAULT_EXPERIENCE_GROUPS.map(g => ({
      ...g,
      items: g.items.map(i => ({
        ...i,
        checked: pairs.some(([gid, iid]) => gid === g.id && iid === i.id),
      })),
    }));
  }
  // How I Show Up
  const susCom = params.get("susCom"); const susCon = params.get("susCon"); const susPre = params.get("susPre");
  if (susCom || susCon || susPre) {
    overrides.showUpStyle = {
      communicate: susCom ? susCom.split(",").filter(Boolean) : [],
      connect: susCon ? susCon.split(",").filter(Boolean) : [],
      presence: susPre ? susPre.split(",").filter(Boolean) : [],
    };
  }
  return overrides;
}

// ── Sidebar nav items ─────────────────────────────────────────
const NAV_ITEMS = [
  { id: "home", icon: "⊞", label: "Home" },
];

// ── Right panel tabs ──────────────────────────────────────────
type RightTab = "profile" | "services" | "experience" | "settings";

// ── Time options ──────────────────────────────────────────────
const TIME_OPTIONS = (() => {
  const times: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      const period = h < 12 ? "AM" : "PM";
      const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      times.push(`${hour12}:${m === 0 ? "00" : "30"} ${period}`);
    }
  }
  return times;
})();


// ─────────────────────────────────────────────────────────────────────────────
// SectionThemeCtx — carries theme values to module-level sub-components.
// Defined outside Home so React never sees them as "new" types on re-render,
// which was causing input focus loss and scroll-to-top on every keystroke.
// ─────────────────────────────────────────────────────────────────────────────
interface SectionTheme {
  card: string; gold: string; text: string; textDim: string;
  sectionColors: Record<string, string>;
  sectionSubtitles: Record<string, string>;
  sectionIcons: Record<string, string>;
  threadLabel: React.CSSProperties;
}
const SectionThemeCtx = React.createContext<SectionTheme>({
  card: "#fff", gold: "#F0C040", text: "#1a2a4a", textDim: "#6b7a99",
  sectionColors: {}, sectionSubtitles: {}, sectionIcons: {}, threadLabel: {},
});

let _sectionCounter = 0;

// ══ DEMO CLIENT VIEW OVERLAY ══
const DEMO_THREAD_COLORS = ['#4a90d9','#2ecc71','#e67e22','#9b59b6','#e74c3c','#1abc9c','#f39c12'];

function DemoThreadConnector() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '44px', position: 'relative' }}>
      <div style={{ width: '2px', height: '100%', background: 'linear-gradient(180deg, #f0c040 0%, rgba(240,192,64,0.4) 100%)' }} />
      <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '12px', height: '12px', borderRadius: '50%', background: '#f0c040', border: '2px solid white', boxShadow: '0 0 10px rgba(240,192,64,0.5)' }} />
    </div>
  );
}

function DemoThreadSection({ num, icon, title, subtitle, children }: { num: number; icon: string; title: string; subtitle: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const color = DEMO_THREAD_COLORS[(num - 1) % DEMO_THREAD_COLORS.length];
  return (
    <div style={{ background: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', borderLeft: `4px solid ${color}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px 16px 16px' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', flexShrink: 0, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>{icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color, margin: '0 0 2px' }}>Thread {num}</p>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 700, color: '#1a2e4a', margin: '0 0 3px', lineHeight: 1.1 }}>{title}</h3>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '12px', color: '#6a7a9a', margin: 0, lineHeight: 1.3 }}>{subtitle}</p>
        </div>
      </div>
      <div style={{ padding: '0 18px 20px 18px', borderTop: `1px solid ${color}18` }}>
        {children}
      </div>
    </div>
  );
}

const DEFAULT_DEMO_VIDEO = "/manus-storage/sw_final_video_new_music_46a119c4.mp4";
function DemoClientViewOverlay({ profile, onClose, videoUrl, isDemo, hostedUrl }: { profile: ProfileData; onClose: () => void; videoUrl?: string | null; isDemo?: boolean; hostedUrl?: string | null }) {
  // Block right-click, text selection, and keyboard copy shortcuts
  React.useEffect(() => {
    const blockCtxMenu = (e: MouseEvent) => e.preventDefault();
    const blockKeyboard = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['c','a','s','p','u'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', blockCtxMenu);
    document.addEventListener('keydown', blockKeyboard);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('contextmenu', blockCtxMenu);
      document.removeEventListener('keydown', blockKeyboard);
      document.body.style.overflow = '';
    };
  }, []);

  // Real accessibility state for buyers
  const [a11yFontSize, setA11yFontSize] = React.useState(1);
  const [a11yHighContrast, setA11yHighContrast] = React.useState(false);
  const [a11yDyslexia, setA11yDyslexia] = React.useState(false);
  const [a11yReducedMotion, setA11yReducedMotion] = React.useState(false);
  const [ttsStatus, setTtsStatus] = React.useState<'idle'|'reading'|'paused'>('idle');
  const [showAACBoard, setShowAACBoard] = React.useState(false);

  const readOverlay = React.useCallback(() => {
    if (!window.speechSynthesis) return;
    if (ttsStatus === 'reading') { window.speechSynthesis.pause(); setTtsStatus('paused'); return; }
    if (ttsStatus === 'paused') { window.speechSynthesis.resume(); setTtsStatus('reading'); return; }
    window.speechSynthesis.cancel();
    const el = document.getElementById('demo-overlay-content');
    const text = el ? el.innerText.slice(0, 5000) : document.body.innerText.slice(0, 5000);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.onstart = () => setTtsStatus('reading');
    utterance.onend = () => setTtsStatus('idle');
    utterance.onerror = () => setTtsStatus('idle');
    window.speechSynthesis.speak(utterance);
  }, [ttsStatus]);

  const stopTTS = React.useCallback(() => {
    window.speechSynthesis?.cancel();
    setTtsStatus('idle');
  }, []);

  // Apply a11y settings to the overlay content container
  React.useEffect(() => {
    const el = document.getElementById('demo-overlay-content');
    if (!el) return;
    el.style.fontSize = `${a11yFontSize}em`;
    el.style.filter = a11yHighContrast ? 'contrast(1.6) saturate(0.5)' : '';
    el.style.fontFamily = a11yDyslexia ? "'Lexend', sans-serif" : '';
  }, [a11yFontSize, a11yHighContrast, a11yDyslexia]);

  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const availDays = days.filter(d => profile.availability?.[d]);
  const selectedServices = (profile.services || []).filter(s => s.selected);
  const checkedExperience = (profile.experienceGroups || []).flatMap(g => g.items.filter(i => i.checked).map(i => ({ group: g.title, label: i.label })));
  const hasShowUp = profile.showUpStyle && (profile.showUpStyle.communicate?.length > 0 || profile.showUpStyle.connect?.length > 0 || profile.showUpStyle.presence?.length > 0);
  const PASTEL_BG = ['#fce4ec','#e3f2fd','#e8f5e9','#fff3e0','#fef9e7'];
  const BADGE_ICONS: Record<string, string> = { 'NDIS Worker Screened': '🛡', 'First Aid Certified': '⭐', 'Mental Health Support': '🤍', 'Working With Children Check': '🧒', 'Police Check': '🔍', 'NDIS Worker Check': '✅', '5+ Years Experience': '👥', 'Mental Health First Aid': '🤍', 'Public Liability Insurance': '📋', 'Professional Indemnity Insurance': '🔒' };
  let threadNum = 0;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'linear-gradient(160deg, #C8E6FA 0%, #e8f4ff 45%, #F7E08A 100%)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        overflowY: 'auto',
        padding: '120px 16px 60px',
        WebkitUserSelect: 'none', userSelect: 'none',
      }}
      aria-modal="true"
      role="dialog"
      aria-label={isDemo ? "Client View Sample — Demo" : "Client View Preview"}
    >
      {/* Watermark layer — demo only */}
      {isDemo && (
        <div
          aria-hidden="true"
          style={{ position: 'fixed', inset: 0, zIndex: 10001, pointerEvents: 'none', overflow: 'hidden' }}
        >
          {Array.from({ length: 25 }).map((_, i) => (
            <span key={i} style={{
              position: 'absolute',
              left: `${(i % 5) * 22 - 5}%`,
              top: `${Math.floor(i / 5) * 22 - 3}%`,
              transform: 'rotate(-35deg)',
              fontFamily: "'Outfit', sans-serif",
              fontSize: '16px', fontWeight: 800,
              color: 'rgba(74,144,217,0.12)',
              letterSpacing: '0.08em', whiteSpace: 'nowrap', textTransform: 'uppercase',
            }}>InSync Profiles · DEMO ONLY</span>
          ))}
        </div>
      )}

      {/* Fixed top bar — brand label + close */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10002, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(74,144,217,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', gap: '8px' }}>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '12px', fontWeight: 800, color: '#4a90d9', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          👁️ {isDemo ? 'Client View · Demo' : 'Client View · Preview'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'flex-end' }}>
          {!isDemo && hostedUrl && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(hostedUrl).then(() => {
                  import('sonner').then(({ toast }) => toast.success('Profile link copied!', { description: 'Paste it in an email or WhatsApp to share.' }));
                }).catch(() => {
                  import('sonner').then(({ toast }) => toast.info('Copy this link', { description: hostedUrl }));
                });
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '99px', background: 'linear-gradient(135deg,#4a90d9,#d4a820)', border: 'none', color: '#fff', fontFamily: "'Outfit', sans-serif", fontSize: '12px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', letterSpacing: '0.03em' }}
              aria-label="Copy profile link"
            >
              🔗 Copy Link
            </button>
          )}
          {!isDemo && !hostedUrl && (
            <button
              onClick={() => { onClose(); setTimeout(() => { document.getElementById('insync-save-btn')?.click(); }, 100); }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '99px', background: 'rgba(230,126,34,0.12)', border: '1.5px solid rgba(230,126,34,0.4)', color: '#e67e22', fontFamily: "'Outfit', sans-serif", fontSize: '12px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
              aria-label="Save profile to unlock share link"
            >
              💾 Save first to share
            </button>
          )}
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '11px', fontWeight: 600, color: isDemo ? '#e67e22' : '#27ae60', background: isDemo ? 'rgba(230,126,34,0.1)' : 'rgba(39,174,96,0.1)', border: isDemo ? '1px solid rgba(230,126,34,0.3)' : '1px solid rgba(39,174,96,0.3)', borderRadius: '99px', padding: '3px 10px', whiteSpace: 'nowrap' }}>
            {isDemo ? 'Watermarked · Demo Only' : 'Your Profile Preview'}
          </div>
        </div>
        <button onClick={onClose} style={{ background: '#1a2e4a', border: 'none', borderRadius: '50%', width: '34px', height: '34px', color: '#fff', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} aria-label="Close client view sample">×</button>
      </div>

      {/* ── PROMINENT GOLD ACCESSIBILITY BAR — second row, full width ── */}
      <div style={{ position: 'fixed', top: '54px', left: 0, right: 0, zIndex: 10002, background: 'linear-gradient(135deg, #b8860b 0%, #f5c842 60%, #ffe680 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', gap: '12px', boxShadow: '0 4px 20px rgba(245,200,66,0.35)', minHeight: '56px' }}>
        <svg width='28' height='28' viewBox='0 0 24 24' fill='none'>
          <circle cx='12' cy='5.5' r='2.2' fill='#0d1b2a'/>
          <path d='M12 9v5' stroke='#0d1b2a' strokeWidth='2.4' strokeLinecap='round'/>
          <path d='M7.5 11h9' stroke='#0d1b2a' strokeWidth='2.4' strokeLinecap='round'/>
          <path d='M12 14l-3 5M12 14l3 5' stroke='#0d1b2a' strokeWidth='2.4' strokeLinecap='round'/>
        </svg>
        <button
          aria-label="Accessibility options"
          style={{
            height: '44px', padding: '0 28px',
            borderRadius: '22px',
            background: 'rgba(13,27,42,0.92)',
            border: '2px solid rgba(255,255,255,0.25)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            color: '#f5c842',
            fontFamily: "'Outfit', sans-serif", fontSize: '15px', fontWeight: 800, letterSpacing: '0.04em',
            boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
            transition: 'transform 0.16s cubic-bezier(0.23,1,0.32,1)',
          }}
          onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
          onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          onClick={() => {
            const panel = document.getElementById('demo-a11y-panel');
            if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
          }}
        >
          <svg width='20' height='20' viewBox='0 0 24 24' fill='none'><circle cx='12' cy='5.5' r='2.2' fill='#f5c842'/><path d='M12 9v5' stroke='#f5c842' strokeWidth='2.4' strokeLinecap='round'/><path d='M7.5 11h9' stroke='#f5c842' strokeWidth='2.4' strokeLinecap='round'/><path d='M12 14l-3 5M12 14l3 5' stroke='#f5c842' strokeWidth='2.4' strokeLinecap='round'/></svg>
          Accessibility
        </button>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '12px', fontWeight: 700, color: 'rgba(13,27,42,0.75)', letterSpacing: '0.03em' }}>Text Size · High Contrast · Dyslexia Font · Read Aloud</span>
      </div>
      {/* Accessibility panel — drops below the gold bar */}
      <div
        id='demo-a11y-panel'
        style={{
          position: 'fixed', top: '118px', left: '50%', transform: 'translateX(-50%)', zIndex: 10004,
          width: '320px', background: 'white', borderRadius: '16px',
          border: '2px solid rgba(245,200,66,0.5)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)', padding: '20px',
          display: 'none', fontFamily: "'Outfit', sans-serif",
        }}
      >
        {isDemo ? (
          // Demo: show purchase pitch
          <>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#1a3a6b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>Accessibility Features</div>
            <div style={{ fontSize: '13px', color: '#1a2e4a', lineHeight: 1.7, marginBottom: '14px' }}>The full accessibility suite is included with every purchase:</div>
            <ul style={{ fontSize: '13px', color: '#1a2e4a', lineHeight: 1.9, paddingLeft: '18px', marginBottom: '16px' }}>
              <li>Text Size — Normal, Large, Extra Large</li>
              <li>High Contrast Mode</li>
              <li>Dyslexia-Friendly Font (Lexend)</li>
              <li>Reduce Motion</li>
              <li>Read Page Aloud (text-to-speech)</li>
              <li>AAC Communication Board</li>
            </ul>
            <a href='/pricing' style={{ display: 'block', textAlign: 'center', padding: '10px 20px', borderRadius: '99px', background: 'linear-gradient(135deg,#b8860b,#f5c842)', color: '#0d1b2a', fontWeight: 800, fontSize: '13px', textDecoration: 'none' }}>Purchase to Unlock →</a>
          </>
        ) : (
          // Buyer: real working controls
          <>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#1a3a6b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '14px' }}>Accessibility Settings</div>

            {/* Text Size */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#5a6a8a', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>Text Size</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[{label:'A', size:0.9},{label:'A', size:1},{label:'A', size:1.15},{label:'A', size:1.3}].map((opt,i) => (
                  <button key={i} onClick={() => setA11yFontSize(opt.size)}
                    style={{ flex:1, padding:'8px 4px', borderRadius:'10px', border: a11yFontSize===opt.size ? '2px solid #4a90d9' : '1.5px solid #e0e8f0', background: a11yFontSize===opt.size ? '#e8f4ff' : 'white', cursor:'pointer', fontSize:`${opt.size * 13}px`, fontWeight:700, color:'#1a2e4a' }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            {[
              { label: 'High Contrast', icon: '◑', value: a11yHighContrast, toggle: () => setA11yHighContrast(v => !v) },
              { label: 'Dyslexia Font (Lexend)', icon: 'Aa', value: a11yDyslexia, toggle: () => setA11yDyslexia(v => !v) },
              { label: 'Reduce Motion', icon: '⏸', value: a11yReducedMotion, toggle: () => setA11yReducedMotion(v => !v) },
            ].map(item => (
              <button key={item.label} onClick={item.toggle}
                style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px', borderRadius:'10px', border:'1.5px solid #e0e8f0', background: item.value ? '#e8f4ff' : 'white', cursor:'pointer', marginBottom:'8px' }}>
                <span style={{ display:'flex', alignItems:'center', gap:'10px', fontFamily:"'Outfit',sans-serif", fontSize:'13px', fontWeight:600, color:'#1a2e4a' }}>
                  <span style={{ fontSize:'16px', width:'20px', textAlign:'center' }}>{item.icon}</span>
                  {item.label}
                </span>
                <span style={{ width:'36px', height:'20px', borderRadius:'10px', background: item.value ? '#4a90d9' : '#d0d8e8', display:'flex', alignItems:'center', padding:'2px', transition:'background 0.2s' }}>
                  <span style={{ width:'16px', height:'16px', borderRadius:'50%', background:'white', boxShadow:'0 1px 4px rgba(0,0,0,0.2)', transform: item.value ? 'translateX(16px)' : 'translateX(0)', transition:'transform 0.2s' }} />
                </span>
              </button>
            ))}

            {/* Read Aloud */}
            <div style={{ marginTop: '4px', marginBottom: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#5a6a8a', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>Read Aloud</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={readOverlay}
                  style={{ flex: 1, padding: '10px 8px', borderRadius: '10px', border: ttsStatus !== 'idle' ? '2px solid #4a90d9' : '1.5px solid #e0e8f0', background: ttsStatus !== 'idle' ? '#e8f4ff' : 'white', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", fontSize: '13px', fontWeight: 700, color: '#1a2e4a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  {ttsStatus === 'reading' ? '⏸ Pause' : ttsStatus === 'paused' ? '▶ Resume' : '🔊 Read Page'}
                </button>
                {ttsStatus !== 'idle' && (
                  <button onClick={stopTTS}
                    style={{ padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #e0e8f0', background: 'white', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", fontSize: '13px', fontWeight: 700, color: '#e74c3c' }}>
                    ⏹
                  </button>
                )}
              </div>
            </div>

            {/* AAC Board */}
            <button onClick={() => setShowAACBoard(true)}
              style={{ width: '100%', marginBottom: '8px', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #e0e8f0', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: "'Outfit',sans-serif", fontSize: '13px', fontWeight: 600, color: '#1a2e4a' }}>
              <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>🗣</span>
              AAC Communication Board
            </button>

            <button onClick={() => { setA11yFontSize(1); setA11yHighContrast(false); setA11yDyslexia(false); setA11yReducedMotion(false); stopTTS(); }}
              style={{ width:'100%', marginTop:'4px', padding:'8px', borderRadius:'10px', border:'1.5px solid #e0e8f0', background:'white', cursor:'pointer', fontFamily:"'Outfit',sans-serif", fontSize:'12px', color:'#9aabcc', fontWeight:600 }}>
              Reset to defaults
            </button>
          </>
        )}
      </div>

      {/* AAC Board overlay */}
      {showAACBoard && !isDemo && (
        <AACBoard profile={profile} onClose={() => setShowAACBoard(false)} />
      )}

      {/* Content — matches real /view layout */}
      <div id='demo-overlay-content' style={{ width: '100%', maxWidth: '480px', position: 'relative', zIndex: 10000 }}>

        {/* Post Card — pastel blue-pink-gold gradient, exact match to ClientView */}
        <div style={{ background: 'linear-gradient(160deg, #dceeff 0%, #f7e0f5 45%, #fff3c8 100%)', borderRadius: '24px', boxShadow: '0 8px 48px rgba(160,120,200,0.18), 0 2px 12px rgba(240,192,64,0.10)', border: '1.5px solid rgba(220,180,240,0.55)', overflow: 'hidden', marginBottom: '0' }}>

          {/* Header: photo + name/title/location */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px', padding: '28px 24px 16px' }}>
            <div style={{ width: '110px', height: '110px', borderRadius: '50%', flexShrink: 0, border: '4px solid #f0c040', boxShadow: '0 0 0 3px rgba(240,192,64,0.20), 0 4px 20px rgba(240,192,64,0.25)', overflow: 'hidden', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {profile.profileImage ? (
                <img src={profile.profileImage} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} />
              ) : (
                <svg width='52' height='52' viewBox='0 0 24 24' fill='none' stroke='#9aabcc' strokeWidth='1.5'><circle cx='12' cy='8' r='4' /><path d='M4 20c0-4 3.6-7 8-7s8 3 8 7' /></svg>
              )}
            </div>
            <div style={{ flex: 1, paddingTop: '8px' }}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '30px', fontWeight: 700, color: '#1a2e4a', margin: '0 0 6px', lineHeight: 1.05 }}>{profile.name || 'Your Name'}</h1>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#4a90d9', margin: '0 0 10px' }}>{profile.title || 'Support Worker'}</p>
              {profile.location && <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '14px', color: '#5a6a8a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}><svg width='14' height='14' viewBox='0 0 24 24' fill='#e74c3c' aria-hidden='true'><path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/></svg>{profile.location}</p>}
            </div>
          </div>

          {/* Service circles */}
          {selectedServices.length > 0 && (
            <div style={{ padding: '8px 20px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-around', gap: '6px' }}>
                {selectedServices.slice(0, 5).map((svc, i) => (
                  <div key={svc.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px', flex: 1 }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: PASTEL_BG[i % PASTEL_BG.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>{svc.icon}</div>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '10px', fontWeight: 600, color: '#5a6a8a', textAlign: 'center', margin: 0, lineHeight: 1.25, maxWidth: '62px' }}>{svc.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Intro Video */}
          {(() => {
            const effectiveVideoUrl = videoUrl && !videoUrl.startsWith('/manus-storage') ? videoUrl : null;
            if (!effectiveVideoUrl) {
              return (
                <div style={{ padding: '0 20px 16px' }}>
                  <div style={{ borderRadius: '16px', padding: '3px', background: 'linear-gradient(135deg, #ff6b9d, #ffd93d, #6bcb77, #4d96ff, #c77dff)' }}>
                    <div style={{ borderRadius: '14px', background: 'linear-gradient(160deg, #0d1b2a 0%, #1a2e4a 60%, #0d2a1a 100%)', padding: '28px 24px', textAlign: 'center' }}>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontStyle: 'italic', fontWeight: 600, color: '#f0c040', margin: '0 0 16px', lineHeight: 1.4 }}>
                        "Good support starts with curiosity — not assumptions."
                      </p>
                      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '12px', color: 'rgba(240,192,64,0.6)', margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Add your intro video in the editor</p>
                    </div>
                  </div>
                </div>
              );
            }
            const isYT = effectiveVideoUrl.includes('youtu.be') || effectiveVideoUrl.includes('youtube.com');
            const toEmbed = (url: string) => {
              try {
                const u = new URL(url);
                if (u.hostname === 'youtu.be') return `https://www.youtube.com/embed/${u.pathname.slice(1).split('?')[0]}`;
                if (u.hostname.includes('youtube.com')) {
                  const v = u.searchParams.get('v');
                  if (v) return `https://www.youtube.com/embed/${v}`;
                }
              } catch {}
              return url;
            };
            return (
              <div style={{ padding: '0 20px 16px' }}>
                <div style={{ borderRadius: '16px', overflow: 'hidden', padding: '3px', background: 'linear-gradient(135deg, #ff6b9d, #ffd93d, #6bcb77, #4d96ff, #c77dff)' }}>
                  {isYT ? (
                    <iframe src={toEmbed(effectiveVideoUrl)} title={`${profile.name} intro video`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ width: '100%', aspectRatio: '16/9', display: 'block', borderRadius: '14px', border: 'none' }} />
                  ) : (
                    <video src={effectiveVideoUrl} controls playsInline style={{ width: '100%', display: 'block', borderRadius: '14px', background: '#000' }} aria-label={`${profile.name} intro video`} />
                  )}
                </div>
              </div>
            );
          })()}

          {/* Tagline */}
          {profile.tagline && (
            <div style={{ padding: '4px 24px 18px', textAlign: 'center' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontStyle: 'italic', fontWeight: 600, color: '#1a2e4a', margin: 0, lineHeight: 1.35 }}>"{profile.tagline}"</p>
            </div>
          )}

          {/* CTA */}
          <div style={{ padding: '0 24px 20px' }}>
            <button
              disabled={isDemo}
              style={{ width: '100%', padding: '18px 24px', background: isDemo ? 'linear-gradient(135deg, rgba(74,144,217,0.4) 0%, rgba(240,192,64,0.4) 100%)' : 'linear-gradient(135deg, #4a90d9 0%, #f0c040 100%)', border: 'none', borderRadius: '50px', cursor: isDemo ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', opacity: isDemo ? 0.6 : 1 }}
              aria-label={isDemo ? 'Contact button disabled in demo' : 'Contact button'}
            >
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '15px', fontWeight: 800, letterSpacing: '0.10em', color: 'white', textTransform: 'uppercase' }}>
                {isDemo ? `${profile.ctaText || 'MESSAGE TO BEGIN'} — Demo Only` : (profile.ctaText || 'MESSAGE TO BEGIN')}
              </span>
            </button>
          </div>

          {/* Badges */}
          {profile.badges && profile.badges.length > 0 && (
            <div style={{ padding: '0 20px 16px' }}>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#9b59b6', margin: '0 0 10px' }}>🏅 Credentials &amp; Badges <span style={{ fontWeight: 400, opacity: 0.7 }}>(Self-Reported)</span></p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {profile.badges.map(badge => (
                  <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: 'rgba(200,160,230,0.12)', border: '1.5px solid rgba(200,140,220,0.30)', borderRadius: '14px' }}>
                    <span style={{ fontSize: '18px', flexShrink: 0 }}>{BADGE_ICONS[badge] || '✶'}</span>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '11px', fontWeight: 700, color: '#6a3a8a', lineHeight: 1.25 }}>{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {profile.languages && profile.languages.length > 0 && (
            <div style={{ padding: '0 20px 16px' }}>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#2ecc71', margin: '0 0 8px' }}>🌐 Languages</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {profile.languages.map(lang => (
                  <span key={lang} style={{ fontFamily: "'Outfit', sans-serif", fontSize: '11px', fontWeight: 600, padding: '5px 12px', borderRadius: '20px', background: 'rgba(46,204,113,0.12)', border: '1.5px solid rgba(46,204,113,0.35)', color: '#1a7a40' }}>{lang}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Threads divider label ── */}
        <div style={{ textAlign: 'center', margin: '8px 0 0' }}>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9aabcc', margin: 0 }}>✦ My Profile Threads ✦</p>
        </div>

        {/* ── Thread 1: Identity ── */}
        <DemoThreadConnector />
        <DemoThreadSection num={++threadNum} icon="🧶" title="Identity" subtitle="Who I am, what matters to me, and how I work." defaultOpen={true}>
          <div style={{ paddingTop: '16px' }}>
            {profile.bio && <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '14px', color: '#3d5c42', lineHeight: 1.6, margin: '0 0 12px' }}>{profile.bio}</p>}
            {profile.languages && profile.languages.length > 0 && (
              <div>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4a90d9', margin: '0 0 8px' }}>Languages</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {profile.languages.map(lang => <span key={lang} style={{ fontFamily: "'Outfit', sans-serif", fontSize: '12px', fontWeight: 600, padding: '4px 12px', borderRadius: '20px', background: 'rgba(74,144,217,0.1)', border: '1px solid rgba(74,144,217,0.3)', color: '#2a4a7a' }}>{lang}</span>)}
                </div>
              </div>
            )}
          </div>
        </DemoThreadSection>

        {/* ── Thread 2: Services ── */}
        <DemoThreadConnector />
        <DemoThreadSection num={++threadNum} icon="🧩" title="Services" subtitle="The supports I provide and who I support.">
          <div style={{ paddingTop: '16px' }}>
            {selectedServices.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedServices.map((svc, i) => (
                  <div key={svc.id} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 14px', borderRadius: '20px', background: `${DEMO_THREAD_COLORS[i % DEMO_THREAD_COLORS.length]}14`, border: `1.5px solid ${DEMO_THREAD_COLORS[i % DEMO_THREAD_COLORS.length]}40` }}>
                    <span style={{ fontSize: '16px' }}>{svc.icon}</span>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '13px', fontWeight: 600, color: '#3d5c42' }}>{svc.label}</span>
                  </div>
                ))}
              </div>
            ) : <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '14px', color: '#7a9b7e', margin: 0 }}>No services listed yet.</p>}
          </div>
        </DemoThreadSection>

        {/* ── Thread 3: Experience (always shown) ── */}
        <DemoThreadConnector />
        <DemoThreadSection num={++threadNum} icon="📋" title="Experience" subtitle="My background, training, and specialist areas.">
          <div style={{ paddingTop: '16px' }}>
            {checkedExperience.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {checkedExperience.map(({ label }) => (
                  <span key={label} style={{ fontFamily: "'Outfit', sans-serif", fontSize: '12px', fontWeight: 600, padding: '5px 12px', borderRadius: '20px', background: 'rgba(74,144,217,0.1)', border: '1px solid rgba(74,144,217,0.3)', color: '#2a4a7a' }}>{label}</span>
                ))}
              </div>
            ) : (
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '13px', color: '#9aabcc', margin: 0, fontStyle: 'italic' }}>Tick your experience areas in the editor to show them here.</p>
            )}
          </div>
        </DemoThreadSection>

        {/* ── Thread: How I Show Up (always shown) ── */}
        <DemoThreadConnector />
        <DemoThreadSection num={++threadNum} icon="✨" title="How I Show Up" subtitle="My communication style, how I connect, and how I approach support.">
          <div style={{ paddingTop: '16px' }}>
            {hasShowUp ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {(['communicate','connect','presence'] as const).map(key => (
                  profile.showUpStyle[key]?.length > 0 ? (
                    <div key={key}>
                      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4a90d9', margin: '0 0 8px' }}>{key === 'communicate' ? 'How I Communicate' : key === 'connect' ? 'How I Connect' : 'How I Show Up'}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {profile.showUpStyle[key].map(chip => <span key={chip} style={{ fontFamily: "'Outfit', sans-serif", fontSize: '12px', fontWeight: 600, padding: '5px 12px', borderRadius: '20px', background: 'rgba(74,144,217,0.1)', border: '1.5px solid rgba(74,144,217,0.25)', color: '#3d5c42' }}>{chip}</span>)}
                      </div>
                    </div>
                  ) : null
                ))}
              </div>
            ) : (
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '13px', color: '#9aabcc', margin: 0, fontStyle: 'italic' }}>Select your communication and connection style in the editor to show them here.</p>
            )}
          </div>
        </DemoThreadSection>

        {/* ── Thread: Availability (always shown) ── */}
        <DemoThreadConnector />
        <DemoThreadSection num={++threadNum} icon="📅" title="Availability" subtitle="When I'm available to support you.">
          <div style={{ paddingTop: '16px' }}>
            {availDays.length > 0 ? (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  {availDays.map(d => <span key={d} style={{ fontFamily: "'Outfit', sans-serif", fontSize: '13px', fontWeight: 700, padding: '6px 14px', borderRadius: '20px', background: 'rgba(74,144,217,0.15)', border: '1.5px solid rgba(74,144,217,0.35)', color: '#2a4a7a' }}>{d}</span>)}
                </div>
                {(profile.availFrom || profile.availTo) && <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '13px', color: '#7a9b7e', margin: 0 }}>{profile.availFrom} – {profile.availTo}</p>}
              </>
            ) : (
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '13px', color: '#9aabcc', margin: 0, fontStyle: 'italic' }}>Set your available days in the editor to show them here.</p>
            )}
          </div>
        </DemoThreadSection>

        {/* ── Thread: Contact ── */}
        <DemoThreadConnector />
        <DemoThreadSection num={++threadNum} icon="✉️" title={profile.contactLabel || 'Contact'} subtitle="How to reach me.">
          <div style={{ paddingTop: '16px' }}>
          {isDemo ? (
            <div style={{ background: 'rgba(74,144,217,0.06)', borderRadius: '12px', padding: '18px', textAlign: 'center', border: '1px dashed rgba(74,144,217,0.25)' }}>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '14px', color: '#6a7a9a', margin: '0 0 8px' }}>🔒 Contact details are hidden in the demo</p>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '12px', color: '#9aabcc', margin: 0 }}>Purchase a licence to share your real contact details with clients.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {profile.phone && (
              <a href={`tel:${profile.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'rgba(74,144,217,0.08)', borderRadius: '12px', border: '1.5px solid rgba(74,144,217,0.2)', textDecoration: 'none' }}>
                <span style={{ fontSize: '20px' }}>📱</span>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a2e4a' }}>{profile.phone}</span>
              </a>
            )}
            {profile.email && (
              <a href={`mailto:${profile.email}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'rgba(74,144,217,0.08)', borderRadius: '12px', border: '1.5px solid rgba(74,144,217,0.2)', textDecoration: 'none' }}>
                <span style={{ fontSize: '20px' }}>✉️</span>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a2e4a' }}>{profile.email}</span>
              </a>
            )}
            {profile.whatsapp && (
              <a href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'rgba(37,211,102,0.08)', borderRadius: '12px', border: '1.5px solid rgba(37,211,102,0.25)', textDecoration: 'none' }}>
                <span style={{ fontSize: '20px' }}>💬</span>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a2e4a' }}>WhatsApp</span>
              </a>
            )}
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'rgba(74,144,217,0.08)', borderRadius: '12px', border: '1.5px solid rgba(74,144,217,0.2)', textDecoration: 'none' }}>
                <span style={{ fontSize: '20px' }}>🌐</span>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '14px', fontWeight: 600, color: '#1a2e4a' }}>{profile.website}</span>
              </a>
            )}
            {!profile.phone && !profile.email && !profile.whatsapp && !profile.website && (
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '13px', color: '#9aabcc', textAlign: 'center', margin: 0, fontStyle: 'italic' }}>Add your phone, email, WhatsApp or website in the editor to show contact details here.</p>
            )}
            </div>
          )}
          </div>
        </DemoThreadSection>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>

          {/* QR Code */}
          {(() => {
            const qrUrl = !isDemo && hostedUrl ? hostedUrl : (typeof window !== 'undefined' ? `${window.location.origin}/pricing` : 'https://insyncprofiles.net/pricing');
            const qrLabel = !isDemo && hostedUrl ? 'Scan to open this profile' : 'Scan to get your own profile';
            return (
              <div id='demo-overlay-qr' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '20px 24px', background: 'white', borderRadius: '20px', boxShadow: '0 4px 24px rgba(74,144,217,0.12)', border: '1.5px solid rgba(74,144,217,0.15)' }}>
                <QRCodeSVG
                  value={qrUrl}
                  size={140}
                  bgColor="#ffffff"
                  fgColor="#1a2e4a"
                  level="M"
                  style={{ borderRadius: '8px' }}
                />
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '12px', fontWeight: 700, color: '#4a90d9', margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{qrLabel}</p>
                {!isDemo && hostedUrl && (
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '11px', color: '#9aabcc', margin: 0, maxWidth: '180px', lineHeight: 1.4, wordBreak: 'break-all' }}>{hostedUrl.replace(/^https?:\/\//, '')}</p>
                )}
                {!isDemo && hostedUrl && (
                  <button
                    onClick={() => {
                      const svg = document.querySelector('#demo-overlay-qr svg') as SVGSVGElement | null;
                      if (!svg) return;
                      const serializer = new XMLSerializer();
                      const svgStr = serializer.serializeToString(svg);
                      const img = new Image();
                      const blob = new Blob([svgStr], { type: 'image/svg+xml' });
                      const url = URL.createObjectURL(blob);
                      img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = 400; canvas.height = 400;
                        const ctx = canvas.getContext('2d');
                        if (!ctx) return;
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(0, 0, 400, 400);
                        ctx.drawImage(img, 30, 30, 340, 340);
                        const a = document.createElement('a');
                        a.href = canvas.toDataURL('image/png');
                        a.download = 'insync-profile-qr.png';
                        a.click();
                        URL.revokeObjectURL(url);
                      };
                      img.src = url;
                    }}
                    style={{ padding: '8px 20px', borderRadius: '99px', background: 'linear-gradient(135deg,#4a90d9,#d4a820)', border: 'none', color: '#fff', fontFamily: "'Outfit',sans-serif", fontSize: '12px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em' }}
                  >
                    ⬇️ Download QR
                  </button>
                )}
                {!isDemo && hostedUrl && (
                  <LanyardPreview profile={profile} qrSelector='#demo-overlay-qr svg' />
                )}
                {!isDemo && hostedUrl && (
                  <button
                    onClick={() => {
                      // Generate personalised lanyard card using Canvas
                      const W = 700, H = 1050;
                      const canvas = document.createElement('canvas');
                      canvas.width = W; canvas.height = H;
                      const ctx = canvas.getContext('2d');
                      if (!ctx) return;

                      // ── MATT BLACK BASE ──
                      ctx.fillStyle = '#121212';
                      ctx.fillRect(0, 0, W, H);

                      // ── DIAGONAL AURORA STRIP (purple → gold) ──
                      // Strip is a parallelogram: enters top-right, exits bottom-left
                      ctx.save();
                      const STRIP_TOP_Y = 200;
                      const STRIP_BOT_Y = 850;
                      const STRIP_W = 320;
                      // Clip to parallelogram shape
                      ctx.beginPath();
                      ctx.moveTo(W, STRIP_TOP_Y);
                      ctx.lineTo(W, STRIP_TOP_Y + STRIP_W);
                      ctx.lineTo(0, STRIP_BOT_Y + STRIP_W);
                      ctx.lineTo(0, STRIP_BOT_Y);
                      ctx.closePath();
                      ctx.clip();
                      // Aurora gradient across the strip (perpendicular to strip direction)
                      const auroraGrad = ctx.createLinearGradient(W, STRIP_TOP_Y, 0, STRIP_BOT_Y + STRIP_W);
                      auroraGrad.addColorStop(0,    '#C8960A');
                      auroraGrad.addColorStop(0.18, '#9A6A10');
                      auroraGrad.addColorStop(0.38, '#7B4A8A');
                      auroraGrad.addColorStop(0.55, '#5C2DA8');
                      auroraGrad.addColorStop(0.72, '#3D1A7A');
                      auroraGrad.addColorStop(1,    '#1A0840');
                      ctx.fillStyle = auroraGrad;
                      ctx.fillRect(0, 0, W, H);
                      // Brushed metal streaks
                      for (let i = 0; i < 120; i++) {
                        const t = Math.random();
                        const yL = STRIP_BOT_Y + t * STRIP_W;
                        const yR = STRIP_TOP_Y + t * STRIP_W;
                        const alpha = (Math.random() * 0.07 + 0.01).toFixed(3);
                        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
                        ctx.lineWidth = Math.random() * 1.5 + 0.3;
                        ctx.beginPath(); ctx.moveTo(0, yL); ctx.lineTo(W, yR); ctx.stroke();
                      }
                      // Diagonal sheen highlight
                      const sheenGrad = ctx.createLinearGradient(W * 0.3, 0, W * 0.7, H);
                      sheenGrad.addColorStop(0,   'rgba(255,255,255,0)');
                      sheenGrad.addColorStop(0.4, 'rgba(255,255,255,0.13)');
                      sheenGrad.addColorStop(0.5, 'rgba(255,255,255,0.22)');
                      sheenGrad.addColorStop(0.6, 'rgba(255,255,255,0.10)');
                      sheenGrad.addColorStop(1,   'rgba(255,255,255,0)');
                      ctx.fillStyle = sheenGrad;
                      ctx.fillRect(0, 0, W, H);
                      ctx.restore();

                      // ── ROUNDED RECT HELPER ──
                      const roundRect = (rx: number, ry: number, rw: number, rh: number, r: number) => {
                        ctx.beginPath();
                        ctx.moveTo(rx + r, ry);
                        ctx.lineTo(rx + rw - r, ry);
                        ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + r);
                        ctx.lineTo(rx + rw, ry + rh - r);
                        ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - r, ry + rh);
                        ctx.lineTo(rx + r, ry + rh);
                        ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - r);
                        ctx.lineTo(rx, ry + r);
                        ctx.quadraticCurveTo(rx, ry, rx + r, ry);
                        ctx.closePath();
                      };

                      // ── SCAN ME pill (top-left dark rounded rect) ──
                      const PILL_PAD = 28;
                      const SCAN_X = 30, SCAN_Y = 60, SCAN_W = 380, SCAN_H = 230;
                      ctx.save();
                      roundRect(SCAN_X, SCAN_Y, SCAN_W, SCAN_H, 32);
                      ctx.fillStyle = 'rgba(14,14,14,0.88)';
                      ctx.fill();
                      ctx.restore();
                      // SCAN ME. text — large gold serif-style
                      ctx.font = 'bold 110px Georgia, serif';
                      ctx.fillStyle = '#D4A017';
                      ctx.textAlign = 'left';
                      ctx.fillText('SCAN', SCAN_X + PILL_PAD, SCAN_Y + 115);
                      ctx.fillText('ME.', SCAN_X + PILL_PAD, SCAN_Y + 220);

                      // ── LANYARD HOLE ──
                      ctx.beginPath();
                      ctx.arc(W/2, 30, 20, 0, Math.PI*2);
                      ctx.fillStyle = '#0a0a0a';
                      ctx.fill();
                      ctx.strokeStyle = '#D4A017';
                      ctx.lineWidth = 3;
                      ctx.stroke();

                      // ── QR CODE — draw from existing SVG ──
                      const svgEl = document.querySelector('#demo-overlay-qr svg') as SVGSVGElement | null;
                      const QR_SIZE = 320;
                      const QR_X = (W - QR_SIZE) / 2;
                      const QR_Y = 360;
                      const drawRest = (qrDataUrl?: string) => {
                        if (qrDataUrl) {
                          const qrImg = new Image();
                          qrImg.onload = () => {
                            // White QR background with rounded corners
                            ctx.save();
                            roundRect(QR_X - 12, QR_Y - 12, QR_SIZE + 24, QR_SIZE + 24, 16);
                            ctx.fillStyle = '#FFFFFF';
                            ctx.fill();
                            ctx.restore();
                            ctx.drawImage(qrImg, QR_X, QR_Y, QR_SIZE, QR_SIZE);
                            // Gold corner scan brackets
                            const bs = 38, bw = 5;
                            ctx.strokeStyle = '#D4A017'; ctx.lineWidth = bw;
                            [[QR_X-16,QR_Y-16],[QR_X+QR_SIZE+16,QR_Y-16],[QR_X-16,QR_Y+QR_SIZE+16],[QR_X+QR_SIZE+16,QR_Y+QR_SIZE+16]].forEach(([bx,by],idx) => {
                              const dx = idx % 2 === 0 ? 1 : -1;
                              const dy = idx < 2 ? 1 : -1;
                              ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + dx*bs, by); ctx.stroke();
                              ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by + dy*bs); ctx.stroke();
                            });
                            finishCard();
                          };
                          qrImg.src = qrDataUrl;
                        } else {
                          finishCard();
                        }
                      };

                      const finishCard = () => {
                        // ── SUPPORT WORKER pill (bottom dark rounded rect) ──
                        const SW_X = 30, SW_Y = 760, SW_W = W - 60, SW_H = 220;
                        ctx.save();
                        roundRect(SW_X, SW_Y, SW_W, SW_H, 32);
                        ctx.fillStyle = 'rgba(14,14,14,0.88)';
                        ctx.fill();
                        ctx.restore();
                        ctx.font = 'bold 96px Georgia, serif';
                        ctx.fillStyle = '#D4A017';
                        ctx.textAlign = 'center';
                        ctx.fillText('SUPPORT', W/2, SW_Y + 105);
                        ctx.fillText('WORKER', W/2, SW_Y + 200);

                        // ── LOGO + URL ──
                        const logoImg = new Image();
                        logoImg.onload = () => {
                          const LOGO_SIZE = 80;
                          ctx.drawImage(logoImg, W/2 - LOGO_SIZE/2, 1000, LOGO_SIZE, LOGO_SIZE);
                          ctx.font = '18px Arial';
                          ctx.fillStyle = '#666666';
                          ctx.textAlign = 'center';
                          ctx.fillText('insyncprofiles.net', W/2, 1030);
                          // Download
                          const a = document.createElement('a');
                          a.href = canvas.toDataURL('image/png');
                          a.download = 'insync-lanyard-card.png';
                          a.click();
                        };
                        logoImg.onerror = () => {
                          ctx.font = '18px Arial';
                          ctx.fillStyle = '#666666';
                          ctx.textAlign = 'center';
                          ctx.fillText('insyncprofiles.net', W/2, 1030);
                          const a = document.createElement('a');
                          a.href = canvas.toDataURL('image/png');
                          a.download = 'insync-lanyard-card.png';
                          a.click();
                        };
                        logoImg.src = '/assets/insync-logo-main.png';
                      };

                      if (svgEl) {
                        const serializer = new XMLSerializer();
                        const svgStr = serializer.serializeToString(svgEl);
                        const blob = new Blob([svgStr], { type: 'image/svg+xml' });
                        const url = URL.createObjectURL(blob);
                        const tmpImg = new Image();
                        tmpImg.onload = () => {
                          const tmpCanvas = document.createElement('canvas');
                          tmpCanvas.width = 370; tmpCanvas.height = 370;
                          const tmpCtx = tmpCanvas.getContext('2d');
                          if (tmpCtx) { tmpCtx.fillStyle='#F5F0E8'; tmpCtx.fillRect(0,0,370,370); tmpCtx.drawImage(tmpImg,0,0,370,370); }
                          URL.revokeObjectURL(url);
                          drawRest(tmpCanvas.toDataURL('image/png'));
                        };
                        tmpImg.src = url;
                      } else {
                        drawRest();
                      }
                    }}
                    style={{ padding: '8px 20px', borderRadius: '99px', background: 'linear-gradient(135deg,#6B21A8,#FFD700)', border: 'none', color: '#fff', fontFamily: "'Outfit',sans-serif", fontSize: '12px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em', marginTop: '4px' }}
                  >
                    🪪 Download Lanyard Card
                  </button>
                )}
              </div>
            );
          })()}

          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '12px', color: 'rgba(0,0,0,0.35)', margin: 0 }}>Powered by <strong>InSync Profiles</strong></p>
          {isDemo && (
            <a href='/pricing' style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', borderRadius: '99px', background: 'linear-gradient(135deg, #4a90d9 0%, #f0c040 100%)', color: 'white', fontFamily: "'Outfit', sans-serif", fontSize: '14px', fontWeight: 800, textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase', boxShadow: '0 6px 24px rgba(74,144,217,0.35)' }}>Purchase a Licence →</a>
          )}
        </div>
      </div>

      {/* Sticky back to top */}
      <button
        onClick={() => { const el = document.querySelector('[aria-modal="true"]'); if (el) el.scrollTop = 0; }}
        style={{ position: 'fixed', bottom: '24px', right: '20px', zIndex: 10003, width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #4a90d9 0%, #f0c040 100%)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(74,144,217,0.45)' }}
        aria-label="Back to top"
      >
        <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
          <polyline points='18 15 12 9 6 15' />
        </svg>
      </button>
    </div>
  );
}

// ── Lanyard Card Preview ─────────────────────────────────────
function LanyardPreview({ profile, qrSelector }: { profile: ProfileData; qrSelector: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = 280, H = 420;
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(0, 0, W, H);
    // Diagonal band
    for (let x = 0; x < W; x++) {
      for (let y = 0; y < H; y++) {
        const d = (x + y) / (W + H);
        if (d > 0.28 && d < 0.58) {
          const t = (d - 0.28) / 0.30;
          const r = Math.round(90 + t * 130);
          const g = Math.round(10 + t * 40);
          const b = Math.round(200 - t * 90);
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }

    // Outer border
    ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 2;
    ctx.strokeRect(3, 3, W - 6, H - 6);

    // Corner brackets
    const s = 14;
    ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 2;
    [[4,4],[W-4,4],[4,H-4],[W-4,H-4]].forEach(([px,py]) => {
      const dx = px < W/2 ? 1 : -1;
      const dy = py < H/2 ? 1 : -1;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px+dx*s, py); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px, py+dy*s); ctx.stroke();
    });

    // Lanyard hole
    ctx.beginPath();
    ctx.arc(W/2, 14, 9, 0, Math.PI*2);
    ctx.fillStyle = '#111111'; ctx.fill();
    ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 2; ctx.stroke();

    // QR area
    const QR_SIZE = 172;
    const QR_X = (W - QR_SIZE) / 2;
    const QR_Y = 30;
    ctx.fillStyle = '#F5F0E8';
    ctx.fillRect(QR_X, QR_Y, QR_SIZE, QR_SIZE);
    ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 2;
    ctx.strokeRect(QR_X - 4, QR_Y - 4, QR_SIZE + 8, QR_SIZE + 8);

    const drawText = () => {
      ctx.textAlign = 'center';
      // SUPPORT WORKER gold
      ctx.font = 'bold 13px Arial';
      ctx.fillStyle = '#FFD700';
      ctx.fillText('SUPPORT WORKER', W/2, 222);
      // Location
      ctx.font = '10px Arial';
      ctx.fillStyle = '#DDDDDD';
      ctx.fillText(profile.location || '', W/2, 238);
      // Rule
      ctx.strokeStyle = '#9955EE'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(20, 250); ctx.lineTo(W-20, 250); ctx.stroke();
      // Support Worker white
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText('Support Worker', W/2, 300);
      // Brand
      ctx.font = '11px Arial';
      ctx.fillStyle = '#BB77FF';
      ctx.fillText('InSync Profiles', W/2, 330);
      // URL
      ctx.font = '9px Arial';
      ctx.fillStyle = '#777777';
      ctx.fillText('insyncprofiles.net', W/2, 348);
    };

    // Try to render QR from SVG
    const svgEl = document.querySelector(qrSelector) as SVGSVGElement | null;
    if (svgEl) {
      const serializer = new XMLSerializer();
      const svgStr = serializer.serializeToString(svgEl);
      const blob = new Blob([svgStr], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const qrImg = new Image();
      qrImg.onload = () => {
        ctx.drawImage(qrImg, QR_X, QR_Y, QR_SIZE, QR_SIZE);
        URL.revokeObjectURL(url);
        drawText();
      };
      qrImg.src = url;
    } else {
      drawText();
    }
  }, [profile.location, qrSelector]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '10px', fontWeight: 700, color: '#9955EE', margin: 0, letterSpacing: '0.08em', textTransform: 'uppercase' }}>🪪 Lanyard Card Preview</p>
      <canvas
        ref={canvasRef}
        style={{ borderRadius: '10px', boxShadow: '0 4px 24px rgba(100,50,200,0.35)', maxWidth: '200px', width: '100%' }}
        aria-label="Preview of your personalised lanyard card"
      />
    </div>
  );
}

function Section({ icon: _icon, title, children, id }: { icon: string; title: string; children: React.ReactNode; id?: string }) {
  const t = React.useContext(SectionThemeCtx);
  const threadNum = ++_sectionCounter;
  const [open, setOpen] = useState(true);
  const color = t.sectionColors[title] || t.gold;
  const subtitle = t.sectionSubtitles[title] || "";
  const displayIcon = t.sectionIcons[title] || _icon;
  return (
    <section
      id={id}
      style={{ background: t.card, backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderRadius: "20px", border: `1.5px solid ${color}30`, marginBottom: "0", boxShadow: `0 2px 16px ${color}18`, position: "relative", zIndex: 100 - threadNum }}
      aria-label={title}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: "14px", padding: "18px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
        aria-expanded={open}
        aria-controls={`${id}-content`}
      >
        <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: `${color}18`, border: `2px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }} aria-hidden="true">
          {displayIcon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color, margin: "0 0 2px" }}>Thread {threadNum}</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700, color: t.text, margin: "0 0 3px", lineHeight: 1.1 }}>{title}</h2>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "12px", color: t.textDim, margin: 0, lineHeight: 1.3 }}>{subtitle}</p>
        </div>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, transition: "transform 0.25s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div id={`${id}-content`} style={{ padding: "0 20px 22px", borderTop: `1px solid ${color}18` }}>
          {children}
        </div>
      )}
    </section>
  );
}

function ThreadConnector({ height = 32 }: { height?: number }) {
  const { gold } = React.useContext(SectionThemeCtx);
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: `${height}px`, position: "relative", flexDirection: "column" }} aria-hidden="true">
      <div style={{ width: "2px", flex: 1, background: `linear-gradient(180deg, ${gold}cc 0%, ${gold}88 100%)`, borderRadius: "1px 1px 0 0", boxShadow: `0 0 6px ${gold}55` }} />
      <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: gold, boxShadow: `0 0 14px ${gold}cc, 0 0 6px ${gold}88`, flexShrink: 0, zIndex: 1 }} />
      <div style={{ width: "2px", flex: 1, background: `linear-gradient(180deg, ${gold}88 0%, ${gold}33 100%)`, borderRadius: "0 0 1px 1px", boxShadow: `0 0 6px ${gold}44` }} />
    </div>
  );
}

function FieldRow({ label, htmlFor, tooltip, children }: { label: string; htmlFor?: string; tooltip?: string; children: React.ReactNode }) {
  const { threadLabel } = React.useContext(SectionThemeCtx);
  const [tipVisible, setTipVisible] = React.useState(false);
  const iconRef = React.useRef<HTMLSpanElement>(null);
  const [tipPos, setTipPos] = React.useState({ top: 0, left: 0 });

  const showTip = React.useCallback(() => {
    if (iconRef.current) {
      const r = iconRef.current.getBoundingClientRect();
      setTipPos({
        top: r.top + window.scrollY - 8,
        left: r.left + r.width / 2 + window.scrollX,
      });
    }
    setTipVisible(true);
  }, []);

  const hideTip = React.useCallback(() => setTipVisible(false), []);

  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
        <label style={{ ...threadLabel, marginBottom: 0 }} htmlFor={htmlFor}>{label}</label>
        {tooltip && (
          <span
            ref={iconRef}
            role="button"
            tabIndex={0}
            aria-label={tooltip}
            onMouseEnter={showTip}
            onMouseLeave={hideTip}
            onFocus={showTip}
            onBlur={hideTip}
            style={{ cursor: "help", lineHeight: 1, flexShrink: 0 }}
          >
            <span style={{ fontSize: "13px", opacity: 0.65 }}>ℹ️</span>
          </span>
        )}
      </div>
      {children}
      {tooltip && tipVisible && createPortal(
        <span style={{
          position: "absolute",
          top: tipPos.top,
          left: tipPos.left,
          transform: "translate(-50%, -100%)",
          background: "rgba(20,30,20,0.96)", color: "#e8f0e8",
          fontSize: "11px", fontWeight: 400, lineHeight: 1.5,
          padding: "7px 11px", borderRadius: "8px",
          whiteSpace: "normal", maxWidth: "240px",
          fontFamily: "'Outfit', sans-serif", letterSpacing: "0",
          textTransform: "none", zIndex: 999999,
          boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
          pointerEvents: "none",
          display: "block",
        }}>{tooltip}</span>,
        document.body
      )}
    </div>
  );
}

export default function Home({ isDemo = false }: { isDemo?: boolean }) {
  const urlOverrides = loadProfileFromURL();
  const [profile, setProfile] = useState<ProfileData>({
    ...DEFAULT_PROFILE,
    ...(urlOverrides ?? {}),
  });
  const [activeNav, setActiveNav] = useState("home");
  const [rightTab, setRightTab] = useState<RightTab>("profile");
  const [personalVideoUrl, setPersonalVideoUrl] = useState<string | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [langInput, setLangInput] = useState("");
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSkinId, setActiveSkinId] = useState<string>(() => getActiveSkin());
  const [unlockedPacks, setUnlockedPacks] = useState<string[]>(() => getUnlockedPacks());
  const [skinUnlockInput, setSkinUnlockInput] = useState("");
  const [skinUnlocking, setSkinUnlocking] = useState(false);
  const [showDemoClientView, setShowDemoClientView] = useState(false);

  // Unique profile ID — generated once on first Save, persisted in localStorage
  const [profileId, setProfileId] = useState<string>(() => {
    return localStorage.getItem("insync_profile_id") || "";
  });
  const [hostedUrl, setHostedUrl] = useState<string>(() => {
    // Restore the last saved full URL from localStorage (cross-device safe)
    return localStorage.getItem("insync_hosted_url") || "";
  });
  const [downloadReady, setDownloadReady] = useState(false);
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null);
  const [clientPreview, setClientPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isClientView = !!urlOverrides;

  const { theme } = useColorTheme();
  const { wrapperStyle: a11yStyle } = useA11y();
  const isAurora = theme.id === "aurora";
  const isDark = ['aurora','ocean-amber','cobalt-gold'].includes(theme.id);
  const isGradient = ['sky-gold','ocean-amber','rainbow-prism','cobalt-gold'].includes(theme.id);
  const isMobile = useIsMobile();
  const [mobilePanel, setMobilePanel] = useState<"none" | "nav" | "edit">("none");

  // ── Copy protection ──────────────────────────────────────────────────────
  useEffect(() => {
    // Buyers have full access — copy-protection is demo-only
    if (!isDemo) return;
    const blockCtx = (e: MouseEvent) => {
      e.preventDefault();
      toast.info("🔒 This editor is protected.", { description: "InSync Profiles © — personal use only." });
    };
    const blockKeys = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['u','s','p'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        toast.info("🔒 Keyboard shortcut blocked.", { description: "This editor is copy-protected." });
      }
    };
    document.addEventListener('contextmenu', blockCtx);
    document.addEventListener('keydown', blockKeys);
    return () => {
      document.removeEventListener('contextmenu', blockCtx);
      document.removeEventListener('keydown', blockKeys);
    };
  }, [isDemo]);

  const updateProfile = useCallback((updates: Partial<ProfileData>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const toggleService = useCallback((id: string) => {
    setProfile(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, selected: !s.selected } : s),
    }));
  }, []);

  const updateService = useCallback((id: string, updates: Partial<ServiceItem>) => {
    setProfile(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, ...updates } : s),
    }));
  }, []);

  const toggleExperienceItem = useCallback((groupId: string, itemId: string) => {
    setProfile(prev => ({
      ...prev,
      experienceGroups: prev.experienceGroups.map(g =>
        g.id === groupId
          ? { ...g, items: g.items.map(i => i.id === itemId ? { ...i, checked: !i.checked } : i) }
          : g
      ),
    }));
  }, []);

  const toggleExperienceGroup = useCallback((groupId: string, checked: boolean) => {
    setProfile(prev => ({
      ...prev,
      experienceGroups: prev.experienceGroups.map(g =>
        g.id === groupId ? { ...g, items: g.items.map(i => ({ ...i, checked })) } : g
      ),
    }));
  }, []);
  const toggleVehicleOption = useCallback((category: keyof VehicleOptions, itemId: string) => {
    setProfile(prev => ({
      ...prev,
      vehicleOptions: {
        ...prev.vehicleOptions,
        [category]: prev.vehicleOptions[category].map((item: { id: string; label: string; checked: boolean }) =>
          item.id === itemId ? { ...item, checked: !item.checked } : item
        ),
      },
    }));
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const url = (e as CustomEvent<string>).detail;
      updateProfile({ profileImage: url });
    };
    window.addEventListener("profileImageChange", handler);
    return () => window.removeEventListener("profileImageChange", handler);
  }, [updateProfile]);

  const [photoUploading, setPhotoUploading] = React.useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      updateProfile({ profileImage: data.secure_url });
      toast.success("Photo uploaded!", { description: "Your photo will appear on all devices." });
    } catch {
      toast.error("Photo upload failed", { description: "Please try again or use a smaller image." });
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleSaveChanges = () => {
    // Encode full profile data (including video URL and active skin) into the URL
    // The full URL is the shareable link — works on any device without localStorage
    const fullUrl = encodeProfileToURLWithSkin(profile, personalVideoUrl, activeSkinId);

    // Photo is now a Cloudinary URL — it's already encoded in fullUrl via encodeProfileToURL
    const shareUrl = fullUrl;

    // Persist the share URL so it survives page refresh
    localStorage.setItem("insync_hosted_url", shareUrl);
    setHostedUrl(shareUrl);
    setSaved(true);
    toast.success("Profile saved!", { description: "Your unique shareable link and QR code are ready in Thread 7." });
    setTimeout(() => setSaved(false), 2500);
  };

  const handleShareProfile = () => {
    const url = encodeProfileToURL(profile);
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Shareable profile link copied!", { description: "Send this link to clients or support coordinators." });
    });
  };

  const handleDownloadProfile = () => {
    const html = generateStandaloneHTML(profile, hostedUrl, personalVideoUrl);
    const filename = `${(profile.name || "profile").replace(/\s+/g, "-").toLowerCase()}-profile.html`;
    try {
      // Primary: Blob URL (most reliable for large files)
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1000);
    } catch {
      // Fallback: open in new tab so user can File > Save As
      const win = window.open("", "_blank");
      if (win) {
        win.document.write(html);
        win.document.close();
        toast.info("Opened in new tab", { description: `Use File > Save As and save as "${filename}" to download.` });
        return;
      }
    }
    setDownloadReady(true);
    toast.success("Profile downloaded!", { description: "Open the .html file in any browser — it works offline with all features." });
    setTimeout(() => setDownloadReady(false), 3000);
  };
  const addLanguage = (lang: string) => {
    if (!profile.languages.includes(lang)) {
      updateProfile({ languages: [...profile.languages, lang] });
    }
    setLangInput("");
    setShowLangDropdown(false);
  };

  const removeLanguage = (lang: string) => {
    updateProfile({ languages: profile.languages.filter(l => l !== lang) });
  };


  const auroraHeroBg = "https://d2xsxph8kpxj0f.cloudfront.net/310519663667622901/gWmRdghKtSE2FgXT3tXRNV/aurora_hero_bg-e4eMWrBetgW5Gqzw5JcZfc.webp";

  // ── Theme-aware palette — adapts to selected colour theme ──
  const A = {
    bg:         theme.bg,
    bgDeep:     theme.bg,
    card:       theme.bgCard,
    card2:      theme.bgCard2,
    border:     theme.border,
    borderGold: `${theme.accent}55`,
    gold:       theme.accent,
    goldLight:  theme.accent,
    goldDim:    `${theme.accent}88`,
    green:      theme.accent,
    greenDim:   `${theme.accent}55`,
    greenGlow:  `${theme.accent}22`,
    purple:     theme.accent,
    purpleDim:  `${theme.accent}55`,
    text:       theme.textLight,
    textMid:    theme.textMid,
    textDim:    theme.textDim,
  };

  // (clientPreview state kept for future use but preview now opens in new tab)

  const GLASS = isAurora
    ? { background: "var(--theme-card)", backdropFilter: "blur(20px)", border: "1px solid rgba(100,220,130,0.15)" }
    : { background: theme.bgCard, border: `1px solid ${theme.border}` };

  const GLASS2 = isAurora
    ? { background: "rgba(8,18,35,0.70)", backdropFilter: "blur(24px)", border: "1px solid rgba(100,160,255,0.18)" }
    : { background: theme.bgCard2, border: `1px solid ${theme.border}` };

  const INPUT_STYLE: React.CSSProperties = {
    width: "100%",
    background: isAurora ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.05)",
    border: `1px solid ${isAurora ? "rgba(100,220,130,0.18)" : theme.border}`,
    borderRadius: "8px",
    padding: "9px 12px",
    color: theme.textLight,
    fontFamily: "'Outfit', sans-serif",
    fontSize: "13px",
    outline: "none",
    transition: "border-color 0.15s",
  };

  const LABEL_STYLE: React.CSSProperties = {
    display: "block",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    color: theme.accent,
    marginBottom: "5px",
    fontFamily: "'Outfit', sans-serif",
  };

  const filteredLangs = ALL_LANGUAGES.filter(l =>
    l.toLowerCase().includes(langInput.toLowerCase()) && !profile.languages.includes(l)
  );


  const THREAD_INPUT: React.CSSProperties = {
    width: "100%",
    background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
    border: `1px solid ${theme.border}`,
    borderRadius: "10px",
    padding: "11px 14px",
    color: A.text,
    fontFamily: "'Outfit', sans-serif",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.15s",
  };

  const THREAD_LABEL: React.CSSProperties = {
    display: "block",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.09em",
    textTransform: "uppercase",
    color: A.gold,
    marginBottom: "6px",
    fontFamily: "'Outfit', sans-serif",
  };

  // Section wrapper — accordion style matching mockup
  const SECTION_SUBTITLES: Record<string, string> = {
    "Identity":         "Who I am, what matters to me, and how I work.",
    "Services":         "The supports I provide and who I support.",
    "Availability":     "When I'm available and how to reach me.",
    "Contact":          "How clients and coordinators can reach me.",
    "Experience":       "My background, training, and specialist areas.",
    "Presentation":     "How I show up, connect, and communicate.",
    "Share & Distribute": "Share your profile with clients and coordinators.",
  };
  const SECTION_ICONS: Record<string, string> = {
    "Identity":         "✦",
    "Services":         "🧩",
    "Availability":     "📅",
    "Contact":          "✉️",
    "Experience":       "📋",
    "Presentation":     "🎬",
    "Share & Distribute": "📤",
  };
  const SECTION_COLORS: Record<string, string> = {
    "Identity":         theme.accent || "#4a90d9",
    "Services":         "#2ecc71",
    "Availability":     "#e67e22",
    "Contact":          "#9b59b6",
    "Experience":       "#e74c3c",
    "Presentation":     "#1abc9c",
    "Share & Distribute": A.gold,
  };
  _sectionCounter = 0; // reset per render — Section is defined at module level
  const _sectionTheme = React.useMemo<SectionTheme>(() => ({
    card: A.card, gold: A.gold, text: A.text, textDim: A.textDim,
    sectionColors: SECTION_COLORS, sectionSubtitles: SECTION_SUBTITLES,
    sectionIcons: SECTION_ICONS, threadLabel: THREAD_LABEL,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [theme.id, theme.accent]);

  return (
    <SectionThemeCtx.Provider value={_sectionTheme}>
    <div
      style={{
        minHeight: "100vh",
        background: isGradient
          ? `linear-gradient(160deg, ${theme.postBg} 0%, ${theme.postBg}cc 45%, ${theme.postBg2} 100%)`
          : theme.bg,
        paddingTop: "110px",
        ...a11yStyle,
      }}
    >
      <WelcomeOverlay buyerName={profile.name || undefined} />
      <a href="#thread-start" className="skip-link">Skip to main content</a>

      {/* ── Demo mode conversion banner ── */}
      {isDemo && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: 'linear-gradient(90deg, #1a2e4a 0%, #0d3b2e 50%, #1a2e4a 100%)',
            borderBottom: '2px solid rgba(212,175,55,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            padding: '10px 16px',
            flexWrap: 'wrap',
            boxShadow: '0 2px 16px rgba(0,0,0,0.35)',
          }}
          role="banner"
          aria-label="Demo mode notice"
        >
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>
            ✦ You're exploring the <strong style={{ color: '#f0c040' }}>InSync Profiles Demo</strong> — all fields are editable, but your profile won't be saved.
          </span>
          <a
            href="/pricing"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '7px 18px', borderRadius: '99px',
              background: 'linear-gradient(135deg, #d4af37, #f0c040)',
              color: '#1a2e1e', fontFamily: "'Outfit', sans-serif",
              fontSize: '12px', fontWeight: 800,
              textDecoration: 'none', letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 12px rgba(212,175,55,0.45)',
              flexShrink: 0,
            }}
          >
            Purchase a Licence →
          </a>
        </div>
      )}

      {/* Animated shimmer glow — all gradient themes */}
      {isGradient && (
        <div aria-hidden="true" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
          <div style={{ position: "absolute", width: "600px", height: "600px", borderRadius: "50%", background: `radial-gradient(circle, ${A.greenGlow} 0%, transparent 70%)`, top: "-100px", left: "50%", transform: "translateX(-50%)", animation: "shimmerDrift 8s ease-in-out infinite alternate" }} />
          <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: `radial-gradient(circle, ${A.greenGlow} 0%, transparent 70%)`, bottom: "10%", right: "-80px", animation: "shimmerDrift 11s ease-in-out infinite alternate-reverse" }} />
        </div>
      )}

      {/* Hidden file inputs */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} aria-label="Upload profile photo file" />
      <input ref={videoInputRef} type="file" accept="video/*" style={{ display: "none" }} onChange={e => {
          const f = e.target.files?.[0];
          if (!f) return;
          // Convert to base64 for portability (works in standalone HTML)
          const reader = new FileReader();
          reader.onload = ev => setPersonalVideoUrl(ev.target?.result as string);
          reader.readAsDataURL(f);
        }} aria-label="Upload intro video file" />

      {/* ══ THE THREAD — single scroll column ══ */}
      <main
        id="thread-start"
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          padding: isMobile ? "24px 16px 120px" : "40px 24px 80px",
          display: "flex",
          flexDirection: "column",
          gap: "0",
        }}
        aria-label="Profile editor"
      >

                {/* ── HERO: Profile Header + Post to Social ── */}
        <div style={{
          background: A.card,
          borderRadius: "20px",
          border: `1.5px solid ${A.borderGold}`,
          padding: "20px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "0",
          boxShadow: `0 4px 24px ${A.gold}18`,
        }}>
          {/* Photo */}
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: `${A.gold}22`, border: `2.5px solid ${A.gold}`, overflow: "hidden", flexShrink: 0, boxShadow: `0 0 16px ${A.gold}44` }}>
            {profile.profileImage
              ? <img src={profile.profileImage} alt={`${profile.name || 'Support worker'} — NDIS and aged care support worker profile photo`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px" }}>👤</div>
            }
          </div>
          {/* Name + title */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700, color: A.text, margin: "0 0 2px", lineHeight: 1.15 }}>{profile.name || "Your Name"}</h1>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: A.gold, margin: "0 0 3px" }}>{profile.title || "Support Worker"}</p>
            {profile.location && <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "12px", color: A.textDim, margin: 0 }}>📍 {profile.location}</p>}
          </div>
          {/* Post to Social Media button */}
          <button
            onClick={() => {
              const url = encodeProfileToURL(profile);
              if (navigator.share) {
                navigator.share({ title: `${profile.name} — Support Worker Profile`, text: profile.tagline || "Check out my support worker profile", url }).catch(() => {});
              } else {
                navigator.clipboard.writeText(url).then(() => toast.success("Profile link copied — paste it into your social media post!"));
              }
            }}
            style={{
              flexShrink: 0,
              padding: "10px 16px",
              borderRadius: "14px",
              background: `linear-gradient(135deg, #4a9fd4 0%, ${A.gold} 100%)`,
              border: "none",
              color: "#fff",
              fontFamily: "'Outfit', sans-serif",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              boxShadow: `0 4px 16px ${A.gold}44`,
              transition: "transform 0.15s, box-shadow 0.15s",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = `0 6px 24px ${A.gold}66`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = `0 4px 16px ${A.gold}44`; }}
            aria-label="Post profile to social media"
          >
            <span style={{ fontSize: "18px" }}>📲</span>
            <span>Post to</span>
            <span>Social Media</span>
          </button>
        </div>

        {/* Only show editor sections if not client view */}
        {!isClientView && (
          <>
            <ThreadConnector height={36} />

            {/* ══ 1. IDENTITY ══ */}
            <Section icon="✦" title="Identity" id="section-identity">
              {/* Photo */}
              <FieldRow label="Profile Photo">
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{
                    width: "72px", height: "72px", borderRadius: "50%",
                    background: A.greenGlow,
                    border: `2px solid ${A.gold}`,
                    overflow: "hidden", flexShrink: 0,
                    boxShadow: `0 0 20px ${A.gold}44`,
                  }}>
                    {profile.profileImage
                      ? <img src={profile.profileImage} alt={`${profile.name || 'Support worker'} — qualified support worker personal care and disability support`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>👤</div>
                    }
                  </div>
                  <button
                    onClick={() => !photoUploading && fileInputRef.current?.click()}
                    disabled={photoUploading}
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: `1px solid ${A.borderGold}`,
                      borderRadius: "10px",
                      color: photoUploading ? A.textDim : A.goldLight,
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      padding: "10px 18px",
                      cursor: photoUploading ? "not-allowed" : "pointer",
                      transition: "all 0.15s",
                      opacity: photoUploading ? 0.7 : 1,
                    }}
                    aria-label="Upload profile photo"
                  >
                    {photoUploading ? "⏳ Uploading..." : "↑ Change Photo"}
                  </button>
                </div>
              </FieldRow>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px" }}>
                <FieldRow label="Name" htmlFor="h-name">
                  <input id="h-name" style={THREAD_INPUT} value={profile.name} onChange={e => updateProfile({ name: e.target.value })} placeholder="Your name" />
                </FieldRow>
                <FieldRow label="Title" htmlFor="h-title">
                  <input id="h-title" style={THREAD_INPUT} value={profile.title} onChange={e => updateProfile({ title: e.target.value })} placeholder="e.g. Support Worker" />
                </FieldRow>
              </div>

              <FieldRow label="Location" htmlFor="h-location">
                <input id="h-location" style={THREAD_INPUT} value={profile.location} onChange={e => updateProfile({ location: e.target.value })} placeholder="City, State" />
              </FieldRow>

              <FieldRow label="Tagline" htmlFor="h-tagline">
                <input id="h-tagline" style={THREAD_INPUT} value={profile.tagline} onChange={e => updateProfile({ tagline: e.target.value })} placeholder="I get it. I see you. I'm here." />
              </FieldRow>

              <FieldRow label="Bio" htmlFor="h-bio">
                <textarea
                  id="h-bio"
                  style={{ ...THREAD_INPUT, minHeight: "90px", resize: "vertical" }}
                  value={profile.bio}
                  onChange={e => updateProfile({ bio: e.target.value })}
                  maxLength={280}
                  placeholder="Write a short bio..."
                />
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "10px", color: A.textDim, textAlign: "right", marginTop: "3px" }}>{profile.bio.length}/280</p>
              </FieldRow>
            </Section>

            <ThreadConnector height={32} />

            {/* ══ 2. SERVICES ══ */}
            <Section icon="⚙" title="Services" id="section-services">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13px", color: A.textMid, margin: 0 }}>
                  Up to 5 services appear on your post card.
                </p>
                <span style={{
                  padding: "3px 10px",
                  borderRadius: "20px",
                  background: `${A.gold}22`,
                  border: `1px solid ${A.gold}55`,
                  color: A.gold,
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  flexShrink: 0,
                  marginLeft: "10px",
                }}>
                  {profile.services.filter(s => s.selected).length}/5
                </span>
              </div>

              {/* Active services */}
              {profile.services.filter(s => s.selected).length > 0 && (
                <div style={{ marginBottom: "18px" }}>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: A.green, marginBottom: "8px" }}>Active</p>
                  {profile.services.filter(s => s.selected).map(svc => {
                    const isExpanded = expandedServiceId === svc.id;
                    return (
                      <div key={svc.id} style={{ marginBottom: "6px" }}>
                        <div style={{
                          display: "flex", alignItems: "center", gap: "10px",
                          padding: "10px 14px",
                          borderRadius: isExpanded ? "12px 12px 0 0" : "12px",
                          background: "rgba(60,200,100,0.10)",
                          border: "1px solid rgba(60,200,100,0.28)",
                        }}>
                          <span style={{ fontSize: "18px", flexShrink: 0 }}>{svc.icon}</span>
                          <span style={{ flex: 1, fontFamily: "'Outfit', sans-serif", fontSize: "14px", fontWeight: 600, color: A.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{svc.label}</span>
                          <button onClick={() => setExpandedServiceId(isExpanded ? null : svc.id)}
                            style={{ background: isExpanded ? "rgba(60,200,100,0.25)" : "transparent", border: "1px solid rgba(60,200,100,0.35)", borderRadius: "6px", color: A.green, fontSize: "11px", padding: "3px 9px", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontWeight: 700, flexShrink: 0 }}
                            aria-label={isExpanded ? "Collapse" : `Edit ${svc.label}`}
                          >{isExpanded ? "done" : "edit"}</button>
                          <button onClick={() => { updateProfile({ services: profile.services.map(s => s.id === svc.id ? { ...s, selected: false } : s) }); if (expandedServiceId === svc.id) setExpandedServiceId(null); }}
                            style={{ background: "rgba(255,80,80,0.10)", border: "1px solid rgba(255,80,80,0.25)", borderRadius: "6px", color: "#ff7070", fontSize: "14px", lineHeight: 1, padding: "3px 8px", cursor: "pointer", flexShrink: 0 }}
                            aria-label={`Remove ${svc.label}`}
                          >✕</button>
                        </div>
                        {isExpanded && (
                          <div style={{
                            padding: "12px 14px",
                            background: "rgba(60,200,100,0.05)",
                            border: "1px solid rgba(60,200,100,0.20)",
                            borderTop: "none",
                            borderRadius: "0 0 12px 12px",
                          }}>
                            <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                              <input type="text" value={svc.icon} onChange={e => updateService(svc.id, { icon: e.target.value })} style={{ ...THREAD_INPUT, width: "48px", textAlign: "center", fontSize: "18px", padding: "8px 4px", flexShrink: 0 }} maxLength={2} aria-label="Service icon" />
                              <input type="text" value={svc.label} onChange={e => updateService(svc.id, { label: e.target.value })} style={{ ...THREAD_INPUT, flex: 1, fontWeight: 600 }} placeholder="Service name" aria-label="Service label" />
                            </div>
                            <input type="text" value={svc.description} onChange={e => updateService(svc.id, { description: e.target.value })} style={{ ...THREAD_INPUT, fontSize: "13px" }} placeholder="Short description (optional)" aria-label="Service description" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add services catalogue */}
              {(() => {
                const available = ALL_AVAILABLE_SERVICES.filter(s => !profile.services.find(ps => ps.id === s.id && ps.selected));
                if (available.length === 0) return null;
                return (
                  <div>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: A.textDim, marginBottom: "10px" }}>Add a Service</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginBottom: "12px" }}>
                      {available.map(svc => (
                        <button key={svc.id} onClick={() => updateProfile({ services: [...profile.services, { ...svc, selected: true }] })}
                          style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(100,160,255,0.08)", border: "1px solid rgba(100,160,255,0.22)", borderRadius: "20px", color: A.text, fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: 500, padding: "6px 12px", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" }}
                          title={svc.description}
                          aria-label={`Add ${svc.label}`}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(100,160,255,0.18)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(100,160,255,0.45)"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(100,160,255,0.08)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(100,160,255,0.22)"; }}
                        >
                          <span style={{ fontSize: "14px" }}>{svc.icon}</span>{svc.label}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => { const id = `custom-${Date.now()}`; const ns = { id, icon: "✨", label: "My Service", selected: true, description: "Describe what you offer" }; updateProfile({ services: [...profile.services, ns] }); setExpandedServiceId(id); }}
                      style={{ display: "flex", alignItems: "center", gap: "8px", background: "transparent", border: `1px dashed ${A.gold}55`, borderRadius: "20px", color: A.gold, fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: 600, padding: "6px 14px", cursor: "pointer" }}
                      aria-label="Add a custom service"
                    >✨ Custom service</button>
                  </div>
                );
                            })()}

              {/* ── Vehicle Details (shown when transport or community access selected) ── */}
              {profile.services.some(s => s.selected && (s.id === "transport" || s.id === "community")) && (
                <div style={{ marginTop: "20px", padding: "16px", background: "rgba(100,160,255,0.06)", border: "1px solid rgba(100,160,255,0.18)", borderRadius: "14px" }}>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: A.gold, marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>🚗 Vehicle Details</p>
                  {([
                    { key: "vehicleType" as keyof VehicleOptions, label: "Vehicle Type" },
                    { key: "wheelchairAccess" as keyof VehicleOptions, label: "Wheelchair Accessibility" },
                    { key: "entryHeight" as keyof VehicleOptions, label: "Entry Height & Vertical Clearance" },
                    { key: "weightCapacity" as keyof VehicleOptions, label: "Weight Capacity" },
                  ] as { key: keyof VehicleOptions; label: string }[]).map(({ key, label }) => (
                    <div key={key} style={{ marginBottom: "14px" }}>
                      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "12px", fontWeight: 600, color: A.textDim, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {profile.vehicleOptions[key].map((item: VehicleOption) => (
                          <label key={item.id} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: "14px", color: A.text }}>
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={() => toggleVehicleOption(key, item.id)}
                              style={{ width: "18px", height: "18px", accentColor: A.gold, cursor: "pointer", flexShrink: 0 }}
                            />
                            {item.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>
            <ThreadConnector height={32} />

            {/* ══ 3. HOW I SHOW UP ══ */}
            <Section icon="✨" title="How I Show Up" id="section-show-up">
              {([
                {
                  key: "communicate" as const,
                  label: "How I Communicate",
                  chips: ["Direct & clear","Gentle & patient","Visual cues","AAC-friendly","Written prompts","Humour & lightness","Simple language","Non-verbal aware"],
                },
                {
                  key: "connect" as const,
                  label: "How I Connect",
                  chips: ["Side-by-side","Routine-led","Interest-led","Quiet presence","Active & energetic","Culturally aware","Strengths-based","Person-centred"],
                },
                {
                  key: "presence" as const,
                  label: "How I Show Up",
                  chips: ["Calm & grounded","Consistent & reliable","Flexible & adaptive","Trauma-informed","Neurodiversity-affirming","Empowering","Playful","Professional","Pet friendly","Non-smoker"],
                },
              ] as { key: "communicate" | "connect" | "presence"; label: string; chips: string[] }[]).map(group => (
                <FieldRow key={group.key} label={group.label}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {group.chips.map(chip => {
                      const active = profile.showUpStyle[group.key].includes(chip);
                      return (
                        <button
                          key={chip}
                          onClick={() => {
                            const current = profile.showUpStyle[group.key];
                            const next = active ? current.filter(c => c !== chip) : [...current, chip];
                            updateProfile({ showUpStyle: { ...profile.showUpStyle, [group.key]: next } });
                          }}
                          style={{
                            padding: "8px 14px",
                            borderRadius: "20px",
                            background: active ? A.gold : "rgba(255,255,255,0.06)",
                            color: active ? "oklch(0.08 0.05 155)" : A.textMid,
                            border: `1.5px solid ${active ? A.gold : "rgba(255,255,255,0.12)"}`,
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: "12px",
                            fontWeight: active ? 700 : 500,
                            cursor: "pointer",
                            transition: "all 0.15s",
                            boxShadow: active ? `0 0 12px ${A.gold}44` : "none",
                          }}
                          aria-pressed={active}
                        >
                          {chip}
                        </button>
                      );
                    })}
                  </div>
                </FieldRow>
              ))}
            </Section>

            <ThreadConnector height={32} />
            {/* ══ 4. AVAILABILITY ══ */}
            <Section icon="📅" title="Availability" id="section-availability">
              <FieldRow label="Days Available">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {DAYS.map(day => (
                    <button
                      key={day}
                      onClick={() => updateProfile({ availability: { ...profile.availability, [day]: !profile.availability[day] } })}
                      style={{
                        padding: "10px 16px",
                        borderRadius: "12px",
                        background: profile.availability[day] ? A.gold : "rgba(255,255,255,0.06)",
                        color: profile.availability[day] ? "oklch(0.08 0.05 155)" : A.textMid,
                        border: `1.5px solid ${profile.availability[day] ? A.gold : "rgba(255,255,255,0.12)"}`,
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 0.15s",
                        boxShadow: profile.availability[day] ? `0 0 14px ${A.gold}55` : "none",
                        minWidth: "52px",
                        textAlign: "center",
                      }}
                      aria-pressed={profile.availability[day]}
                      aria-label={`Toggle ${day} availability`}
                    >{day}</button>
                  ))}
                </div>
              </FieldRow>
              <FieldRow label="Hours">
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <select value={profile.availFrom} onChange={e => updateProfile({ availFrom: e.target.value })} style={{ ...THREAD_INPUT, flex: 1, width: "auto" }} aria-label="Available from time">
                    {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <span style={{ color: A.textDim, fontFamily: "'Outfit', sans-serif", fontSize: "13px", flexShrink: 0 }}>to</span>
                  <select value={profile.availTo} onChange={e => updateProfile({ availTo: e.target.value })} style={{ ...THREAD_INPUT, flex: 1, width: "auto" }} aria-label="Available to time">
                    {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </FieldRow>
            </Section>

            <ThreadConnector height={32} />

            {/* ══ 4. CONTACT ══ */}
            <Section icon="✉️" title="Contact" id="section-contact">
              {/* Thread label */}
              <FieldRow label="Section Label" htmlFor="h-contact-label">
                <input id="h-contact-label" style={THREAD_INPUT} value={profile.contactLabel || "Contact"} onChange={e => updateProfile({ contactLabel: e.target.value || "Contact" })} placeholder="Contact" />
              </FieldRow>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px", marginTop: "12px" }}>
                <FieldRow label="📱 Phone" htmlFor="h-phone">
                  <input id="h-phone" style={THREAD_INPUT} type="tel" value={profile.phone} onChange={e => updateProfile({ phone: e.target.value })} placeholder="+61 4XX XXX XXX" />
                </FieldRow>
                <FieldRow label="✉️ Email" htmlFor="h-email">
                  <input id="h-email" style={THREAD_INPUT} type="email" value={profile.email} onChange={e => updateProfile({ email: e.target.value })} placeholder="hello@yourname.com.au" />
                </FieldRow>
                <FieldRow label="💬 WhatsApp" htmlFor="h-whatsapp">
                  <input id="h-whatsapp" style={THREAD_INPUT} type="tel" value={profile.whatsapp} onChange={e => updateProfile({ whatsapp: e.target.value })} placeholder="+61 4XX XXX XXX (WhatsApp number)" />
                </FieldRow>
                <FieldRow label="🌐 Professional Web Link" htmlFor="h-website">
                  <input id="h-website" style={THREAD_INPUT} value={profile.website} onChange={e => updateProfile({ website: e.target.value })} placeholder="LinkedIn, NDIS provider page, or personal site" />
                </FieldRow>
              </div>

              {/* Languages */}
              <FieldRow label="Languages Spoken">
                <div style={{ position: "relative", overflow: "visible" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", marginBottom: "8px" }}>
                    {profile.languages.map(lang => (
                      <span key={lang} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "5px 12px", borderRadius: "20px", background: "rgba(60,200,100,0.15)", color: A.green, border: "1px solid rgba(60,200,100,0.35)", fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: 600 }}>
                        {lang}
                        <button onClick={() => removeLanguage(lang)} style={{ background: "none", border: "none", color: A.green, cursor: "pointer", fontSize: "14px", lineHeight: 1, padding: "0 0 0 2px" }} aria-label={`Remove ${lang}`}>×</button>
                      </span>
                    ))}
                    <button onClick={() => setShowLangDropdown(v => !v)}
                      style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(60,200,100,0.15)", border: "1px solid rgba(60,200,100,0.35)", color: A.green, cursor: "pointer", fontSize: "18px", lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}
                      aria-label="Add language" aria-expanded={showLangDropdown}
                    >+</button>
                  </div>
                  {showLangDropdown && (
                    <div style={{ position: "absolute", zIndex: 9999, top: "100%", left: 0, right: 0, background: A.card2, border: `1px solid ${A.border}`, borderRadius: "12px", backdropFilter: "blur(20px)", overflow: "hidden", boxShadow: "0 8px 32px oklch(0 0 0 / 40%)" }}>
                      <input autoFocus value={langInput} onChange={e => setLangInput(e.target.value)} placeholder="Search language..." style={{ ...THREAD_INPUT, borderRadius: "12px 12px 0 0", borderBottom: `1px solid ${A.border}` }} />
                      <div style={{ maxHeight: "160px", overflowY: "auto" }}>
                        {filteredLangs.map(lang => (
                          <button key={lang} onClick={() => addLanguage(lang)}
                            style={{ width: "100%", textAlign: "left", padding: "10px 16px", background: "transparent", border: "none", color: A.text, fontFamily: "'Outfit', sans-serif", fontSize: "14px", cursor: "pointer" }}
                            onMouseEnter={e => (e.currentTarget.style.background = "rgba(60,200,100,0.12)")}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                          >{lang}</button>
                        ))}
                        {langInput.trim() &&
                          !ALL_LANGUAGES.some(l => l.toLowerCase() === langInput.toLowerCase().trim()) &&
                          !profile.languages.includes(langInput.trim()) && (
                          <button
                            onClick={() => { addLanguage(langInput.trim()); setLangInput(""); setShowLangDropdown(false); }}
                            style={{ width: "100%", textAlign: "left", padding: "10px 16px", background: "transparent", border: "none", borderTop: `1px solid ${A.border}`, color: A.green, fontFamily: "'Outfit', sans-serif", fontSize: "14px", cursor: "pointer", fontWeight: 600 }}
                            onMouseEnter={e => (e.currentTarget.style.background = "rgba(60,200,100,0.12)")}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                          >+ Add "{langInput.trim()}"</button>
                        )}
                        {filteredLangs.length === 0 && !langInput.trim() && (
                          <p style={{ padding: "10px 16px", color: A.textMid, fontFamily: "'Outfit', sans-serif", fontSize: "13px", margin: 0 }}>Type to search or add a language…</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </FieldRow>
            </Section>

            <ThreadConnector height={32} />

            {/* ══ 5. EXPERIENCE ══ */}
            <Section icon="📋" title="Experience" id="section-experience">
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13px", color: A.textMid, marginBottom: "16px", lineHeight: 1.6 }}>
                Select all areas of experience — these appear in your shareable caption.
              </p>
              {profile.experienceGroups.map(group => {
                const allChecked = group.items.every(i => i.checked);
                const checkedCount = group.items.filter(i => i.checked).length;
                return (
                  <details key={group.id} style={{ marginBottom: "8px", borderRadius: "14px", overflow: "hidden", border: `1px solid ${A.border}` }}>
                    <summary style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "14px 16px",
                      background: "rgba(100,160,255,0.08)",
                      color: A.text,
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                      listStyle: "none",
                      userSelect: "none",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "18px" }} aria-hidden="true">{group.icon}</span>
                        {group.title}
                        {checkedCount > 0 && (
                          <span style={{ padding: "2px 8px", borderRadius: "20px", background: A.gold, color: "oklch(0.08 0.05 155)", fontFamily: "'Outfit', sans-serif", fontSize: "11px", fontWeight: 700 }}>{checkedCount}</span>
                        )}
                      </div>
                      <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: A.textDim, cursor: "pointer" }} onClick={e => e.stopPropagation()}>
                        <input type="checkbox" checked={allChecked} onChange={e => toggleExperienceGroup(group.id, e.target.checked)} style={{ accentColor: A.gold, width: "15px", height: "15px" }} aria-label={`Select all ${group.title}`} />
                        All
                      </label>
                    </summary>
                    <div style={{ padding: "12px 16px 14px", background: "rgba(100,160,255,0.04)", display: "flex", flexDirection: "column", gap: "10px" }}>
                      {group.items.map(item => (
                        <label key={item.id} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: "14px", color: item.checked ? A.text : A.textMid, lineHeight: 1.4 }}>
                          <input type="checkbox" checked={item.checked} onChange={() => toggleExperienceItem(group.id, item.id)} style={{ accentColor: A.gold, width: "16px", height: "16px", flexShrink: 0 }} />
                          {item.label}
                        </label>
                      ))}
                    </div>
                  </details>
                );
                            })}

              {/* Copy-to-Caption button */}
              {(() => {
                const allChecked = profile.experienceGroups.flatMap((g: ExperienceGroup) => g.items.filter((i: ExperienceItem) => i.checked).map((i: ExperienceItem) => i.label));
                if (allChecked.length === 0) return null;
                return (
                  <button
                    onClick={() => {
                      const caption = `📌 Specialist areas: ${allChecked.join(", ")}. #SupportWorker #NDIS #InSyncProfiles`;
                      navigator.clipboard.writeText(caption);
                      toast.success("Caption copied!", { description: "Paste it into your social media post." });
                    }}
                    style={{
                      marginTop: "14px", width: "100%", padding: "12px 16px", borderRadius: "12px",
                      background: `linear-gradient(135deg, ${A.gold}22, ${A.green}22)`,
                      border: `1px solid ${A.gold}55`, color: A.gold,
                      fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: 700,
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    }}
                    aria-label="Copy experience list as social media caption"
                  >
                    📱 Copy as Social Caption ({allChecked.length} items)
                  </button>
                );
              })()}
            </Section>
            <ThreadConnector height={32} />
            {/* ══ 6. PRESENTATION ══ */}
            <Section icon="🎨" title="Presentation" id="section-presentation">
                            <FieldRow label="CTA Button Text" htmlFor="h-cta">
                <input id="h-cta" style={THREAD_INPUT} value={profile.ctaText} onChange={e => updateProfile({ ctaText: e.target.value })} placeholder="MESSAGE TO BEGIN" />
              </FieldRow>
              <FieldRow label="Credentials & Badges (Self-Reported)" tooltip="These credentials are entered by the support worker and have not been independently verified. Always confirm qualifications directly with the individual.">
                {profile.badges.map((badge, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <input
                      style={{ ...THREAD_INPUT, flex: 1 }}
                      value={badge}
                      onChange={e => { const updated = [...profile.badges]; updated[i] = e.target.value; updateProfile({ badges: updated }); }}
                      aria-label={`Badge ${i + 1}`}
                    />
                    <button onClick={() => updateProfile({ badges: profile.badges.filter((_, j) => j !== i) })}
                      style={{ background: "rgba(255,80,80,0.10)", border: "1px solid rgba(255,80,80,0.25)", borderRadius: "8px", color: "#ff7070", fontSize: "16px", lineHeight: 1, padding: "8px 10px", cursor: "pointer" }}
                      aria-label={`Remove badge ${badge}`}
                    >×</button>
                  </div>
                ))}
                {/* Quick-add suggestions */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
                  {["NDIS Worker Check", "Police Check", "Working With Children Check", "First Aid Certified", "Mental Health First Aid", "Public Liability Insurance", "Professional Indemnity Insurance"].filter(s => !profile.badges.includes(s)).map(suggestion => (
                    <button key={suggestion} onClick={() => updateProfile({ badges: [...profile.badges, suggestion] })}
                      style={{ fontFamily: "'Outfit', sans-serif", fontSize: "11px", fontWeight: 600, color: A.gold, background: "rgba(210,175,80,0.07)", border: `1px solid ${A.gold}44`, borderRadius: "20px", padding: "4px 10px", cursor: "pointer", whiteSpace: "nowrap" }}
                    >+ {suggestion}</button>
                  ))}
                </div>
                <button onClick={() => updateProfile({ badges: [...profile.badges, "New Badge"] })}
                  style={{ ...THREAD_INPUT, textAlign: "center", cursor: "pointer", color: A.gold, background: "rgba(210,175,80,0.07)", border: `1px dashed ${A.gold}55` }}
                >+ Add Custom Badge</button>
              </FieldRow>

              {/* Intro video */}
              <FieldRow label="Your Intro Video">
                {/* Sample video — always shown so worker can see what it looks like */}
                <div style={{ borderRadius: "14px", overflow: "hidden", border: `1px solid ${A.borderGold}`, marginBottom: "14px" }}>
                  <video
                    src="/manus-storage/sw_final_video_new_music_46a119c4.mp4"
                    controls
                    playsInline
                    style={{ width: "100%", display: "block", background: "#000" }}
                    aria-label="Sample intro video"
                  />
                  <div style={{ padding: "10px 14px", background: `${A.gold}0d`, borderTop: `1px solid ${A.border}` }}>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "12px", fontWeight: 700, color: A.gold, margin: 0, marginBottom: "2px" }}>Sample Video</p>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "12px", color: A.textDim, margin: 0, lineHeight: 1.5 }}>This is an example of a 15-second intro video. Your clients will see your video in this exact spot.</p>
                  </div>
                </div>

                {/* How to attach your own video */}
                <div style={{ background: `rgba(210,175,80,0.06)`, border: `1px solid ${A.gold}33`, borderRadius: "14px", padding: "16px" }}>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: 700, color: A.text, margin: 0, marginBottom: "10px" }}>How to add your own video</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[
                      { icon: "📱", title: "Record on your phone", desc: "Open your camera app, record 15 seconds, upload to Google Drive or Dropbox, then paste the share link into the Video URL field below." },
                      { icon: "🎬", title: "Upload to YouTube (unlisted)", desc: "Upload your video to YouTube as Unlisted. Copy the video URL and paste it below. Clients won't find it by searching — only people with your link can view it." },
                      { icon: "☁️", title: "Use Google Drive", desc: "Upload to Google Drive, right-click → Share → Anyone with the link → Viewer. Copy the link and paste it below." },
                      { icon: "💡", title: "Example of what to say", desc: "Hey, I'm [name]. I've been doing support work for [X] years and I'm based in [location]. I got into this because [one honest reason — e.g. my sister has a disability and I saw how much the right support changed things for her]. The bit I love most is [one real thing — e.g. the moment someone does something they didn't think they could]. I'm not here to tick boxes. If that sounds like what you're looking for, reach out." },
                      { icon: "🎬", title: "Freeze on camera? Try this instead", desc: "Don't script it. Just answer one question out loud: why do you do this work? Hit record, answer it honestly, stop. That's your video. One take is fine. Imperfect is real." },
                    ].map(({ icon, title, desc }) => (
                      <div key={title} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                        <span style={{ fontSize: "20px", flexShrink: 0, marginTop: "1px" }}>{icon}</span>
                        <div>
                          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: 600, color: A.text, margin: 0 }}>{title}</p>
                          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "12px", color: A.textDim, margin: 0, marginTop: "3px", lineHeight: 1.5 }}>{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Video URL input */}
                <div style={{ marginTop: "14px" }}>
                  <label style={{ fontFamily: "'Outfit', sans-serif", fontSize: "12px", fontWeight: 600, color: A.textDim, display: "block", marginBottom: "6px" }}>Paste your video link here (YouTube, Google Drive, Dropbox, etc.)</label>
                  <input
                    style={{ ...THREAD_INPUT, width: "100%" }}
                    value={personalVideoUrl && !personalVideoUrl.startsWith("/manus-storage") ? personalVideoUrl : ""}
                    onChange={e => setPersonalVideoUrl(e.target.value || null)}
                    placeholder="https://youtu.be/your-video-id"
                    aria-label="Video URL"
                  />
                  {personalVideoUrl && !personalVideoUrl.startsWith("/manus-storage") && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "6px" }}>
                      {(personalVideoUrl.includes('youtu.be') || personalVideoUrl.includes('youtube.com')) ? (
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "12px", color: "#4caf50" }}>✅ YouTube link detected — will embed inline for clients</span>
                      ) : (
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "12px", color: A.textDim }}>Direct video file or other link</span>
                      )}
                      <button
                        onClick={() => setPersonalVideoUrl(null)}
                        style={{ background: "none", border: "none", color: A.textDim, fontFamily: "'Outfit', sans-serif", fontSize: "12px", cursor: "pointer", padding: 0 }}
                      >Remove</button>
                    </div>
                  )}
                                </div>
              </FieldRow>

            </Section>
            <ThreadConnector height={32} />
            {/* ══ CLIENT VIEW SAMPLE BUTTON ══ */}
            {showDemoClientView && (
              <DemoClientViewOverlay profile={profile} onClose={() => setShowDemoClientView(false)} videoUrl={personalVideoUrl} isDemo={isDemo} hostedUrl={hostedUrl} />
            )}
            <div
              style={{
                background: A.card,
                borderRadius: "20px",
                border: `1.5px solid ${A.gold}40`,
                padding: "28px 20px",
                textAlign: "center",
                boxShadow: `0 2px 16px ${A.gold}18`,
                marginBottom: "16px",
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "10px" }}>👁️</div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: 700, color: A.text, margin: "0 0 6px" }}>
                {isDemo ? 'See Client View Sample' : 'Preview Your Profile'}
              </p>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13px", color: A.textDim, margin: "0 0 20px", lineHeight: 1.6 }}>
                {isDemo
                  ? 'Preview exactly what a client or coordinator sees when they open your profile link.'
                  : 'See exactly how your profile looks to clients and coordinators.'}
              </p>
              <button
                onClick={() => setShowDemoClientView(true)}
                style={{
                  padding: "14px 32px",
                  borderRadius: "99px",
                  background: `linear-gradient(135deg, ${A.gold} 0%, oklch(0.72 0.18 65) 100%)`,
                  border: "none",
                  color: "oklch(0.08 0.05 155)",
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "15px",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: `0 6px 24px ${A.gold}55`,
                  transition: "all 0.2s cubic-bezier(0.23,1,0.32,1)",
                }}
                aria-label={isDemo ? 'Open client view sample demo' : 'Preview your profile'}
              >
                {isDemo ? '👁️ Open Client View Sample' : '👁️ Preview Your Profile'}
              </button>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "11px", color: A.textDim, marginTop: "12px" }}>
                {isDemo ? 'Demo only · watermarked · contact details hidden' : 'Live preview — exactly what your clients see.'}
              </p>
            </div>
            {/* hidden section to keep counter correct */}
            <div style={{ display: "none" }} aria-hidden="true">
            <Section icon="📤" title="Share & Distribute" id="section-share">
              {/* ══ SAVE BUTTON ══ */}
              <button
                onClick={handleSaveChanges}
                style={{
                  width: "100%",
                  padding: "18px",
                  borderRadius: "16px",
                  background: saved
                    ? `linear-gradient(135deg, ${A.green} 0%, oklch(0.55 0.18 145) 100%)`
                    : `linear-gradient(135deg, ${A.gold} 0%, oklch(0.72 0.18 65) 100%)`,
                  border: "none",
                  color: "oklch(0.08 0.05 155)",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "20px",
                  fontStyle: "italic",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: saved
                    ? `0 6px 32px rgba(60,200,100,0.45)`
                    : `0 6px 32px ${A.gold}55`,
                  transition: "all 0.25s cubic-bezier(0.23,1,0.32,1)",
                  letterSpacing: "0.02em",
                  marginBottom: "16px",
                }}
                aria-label="Save profile changes"
              >
                {saved ? "✓ Profile Saved" : "Save Changes"}
              </button>

              {/* Preview as Client */}
              <button
                onClick={() => {
                  // Build the full encoded URL — works on any device
                  const fullUrl = encodeProfileToURLWithSkin(profile, personalVideoUrl, activeSkinId);
                  let previewLink = fullUrl;
                  if (profile.profileImage) {
                    try {
                      let pid = profileId;
                      if (!pid) {
                        pid = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
                        setProfileId(pid);
                        localStorage.setItem("insync_profile_id", pid);
                      }
                      localStorage.setItem(`insync_profile_image_${pid}`, profile.profileImage);
                      const urlObj = new URL(fullUrl);
                      urlObj.searchParams.set("pid", pid);
                      previewLink = urlObj.toString();
                    } catch {
                      toast.warning("Photo too large for local storage — try an image under 500KB.", { duration: 5000 });
                    }
                  }
                  localStorage.setItem("insync_hosted_url", previewLink);
                  setHostedUrl(previewLink);
                  toast.success("Profile saved — opening client view…", { description: "This is exactly what your client sees when they open your link." });
                  window.open(previewLink, "_blank");
                }}
                style={{ width: "100%", padding: "14px", borderRadius: "12px", background: `${A.gold}18`, border: `1px solid ${A.gold}55`, color: A.gold, fontFamily: "'Outfit', sans-serif", fontSize: "14px", fontWeight: 700, cursor: "pointer", marginBottom: "16px", transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                aria-label="Preview your profile as a client would see it"
              >
                <span style={{ fontSize: "18px" }}>👁️</span> Preview as Client
              </button>

              {/* ── Unique Link & QR Code ── */}
              <div style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.85)", borderRadius: "16px", border: `1.5px solid ${A.gold}44`, padding: "18px", marginBottom: "16px" }}>
                <p style={{ margin: "0 0 4px", fontFamily: "'Outfit', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: A.gold }}>🔗 Your Unique Profile Link</p>
                {hostedUrl ? (
                  <>
                    {/* Link display */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", marginTop: "8px" }}>
                      <div style={{
                        flex: 1, padding: "10px 12px", borderRadius: "10px",
                        background: isDark ? "rgba(255,255,255,0.07)" : "rgba(240,248,255,0.9)",
                        border: `1.5px solid ${A.gold}44`,
                        fontFamily: "'Outfit', sans-serif", fontSize: "11px", color: A.textMid,
                        wordBreak: "break-all", lineHeight: 1.4,
                      }}>
                        {hostedUrl}
                      </div>
                      <button
                        onClick={() => { navigator.clipboard.writeText(hostedUrl); toast.success("Link copied!", { description: "Share this link with your client or paste it into an email." }); }}
                        style={{ flexShrink: 0, padding: "10px 14px", borderRadius: "10px", background: A.gold, border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: "12px", fontWeight: 700, color: "#1a2e1e" }}
                        aria-label="Copy unique profile link"
                      >Copy</button>
                    </div>
                    {/* QR Code */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <div id="insync-share-qr" style={{ background: "#ffffff", borderRadius: "12px", padding: "10px", boxShadow: `0 4px 20px ${A.gold}44` }}>
                        <QRCodeSVG
                          value={hostedUrl}
                          size={160}
                          bgColor="#ffffff"
                          fgColor="#1a2e1e"
                          level="M"
                          aria-label="Unique QR code for this profile"
                        />
                      </div>
                      <p style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontSize: "11px", color: A.textDim, textAlign: "center", maxWidth: "220px", lineHeight: 1.5 }}>
                        Scan to open your profile. Share this QR code on flyers, emails, or social media.
                      </p>
                      <button
                        id="insync-download-qr-btn"
                        onClick={() => {
                          const container = document.getElementById('insync-share-qr');
                          const svg = container?.querySelector('svg') as SVGSVGElement | null;
                          if (!svg) return;
                          const serializer = new XMLSerializer();
                          const svgStr = serializer.serializeToString(svg);
                          const blob = new Blob([svgStr], { type: 'image/svg+xml' });
                          const url = URL.createObjectURL(blob);
                          const img = new Image();
                          img.onload = () => {
                            const canvas = document.createElement('canvas');
                            canvas.width = 400; canvas.height = 400;
                            const ctx = canvas.getContext('2d');
                            if (!ctx) return;
                            ctx.fillStyle = '#ffffff';
                            ctx.fillRect(0, 0, 400, 400);
                            ctx.drawImage(img, 30, 30, 340, 340);
                            const a = document.createElement('a');
                            a.href = canvas.toDataURL('image/png');
                            a.download = 'insync-profile-qr.png';
                            a.click();
                            URL.revokeObjectURL(url);
                          };
                          img.src = url;
                        }}
                        style={{ padding: '9px 22px', borderRadius: '99px', background: `linear-gradient(135deg, ${A.gold} 0%, oklch(0.72 0.18 65) 100%)`, border: 'none', color: '#1a2e1e', fontFamily: "'Outfit', sans-serif", fontSize: '13px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}
                        aria-label="Download QR code as PNG image"
                      >
                        ⬇️ Download QR as Image
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: "16px 0 4px", textAlign: "center" }}>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13px", color: A.textDim, margin: "0 0 12px", lineHeight: 1.6 }}>
                      Hit <strong style={{ color: A.text }}>Save Changes</strong> below to generate your unique shareable link and QR code.
                    </p>
                    <div style={{ width: "120px", height: "120px", borderRadius: "12px", background: `${A.gold}12`, border: `2px dashed ${A.gold}55`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", fontSize: "36px" }}>📲</div>
                  </div>
                )}
              </div>

              {/* ── Send to Client email + WhatsApp buttons ── */}
              <div style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)", borderRadius: "16px", border: "1px solid rgba(77,150,255,0.2)", padding: "18px" }}>
                <p style={{ margin: "0 0 4px", fontFamily: "'Outfit', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "#4d96ff" }}>📤 Send to Client</p>
                <p style={{ margin: "0 0 14px", fontFamily: "'Outfit', sans-serif", fontSize: "12px", color: A.textDim, lineHeight: 1.6 }}>
                  {hostedUrl ? "Share your profile link with a client via email or WhatsApp." : "Save your profile first to generate your shareable link."}
                </p>
                {!hostedUrl && (
                  <div style={{ padding: "12px", borderRadius: "10px", background: "rgba(255,180,0,0.10)", border: "1px solid rgba(255,180,0,0.25)", marginBottom: "12px", fontFamily: "'Outfit', sans-serif", fontSize: "13px", color: A.textMid, textAlign: "center" as const }}>
                    ⚠️ Click <strong>Save Changes</strong> above to generate your profile link first.
                  </div>
                )}
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => {
                      if (!hostedUrl) return;
                      const subject = encodeURIComponent(`Meet ${profile.name || "Your Support Worker"} — InSync Profiles Profile`);
                      const body = encodeURIComponent(
                        `Hi there,\n\nI'd like to introduce you to ${profile.name || "your support worker"}${profile.title ? `, ${profile.title}` : ""}${profile.location ? ` based in ${profile.location}` : ""}.\n\nYou can view their full profile, including services, availability, and how to get in touch, by clicking the link below:\n\n${hostedUrl}\n\nThe profile includes accessibility tools and a "Message to Begin" button so you can reach out directly.\n\nWarm regards,\n${profile.name || "Your Support Worker"}`
                      );
                      window.location.href = `mailto:?subject=${subject}&body=${body}`;
                    }}
                    disabled={!hostedUrl}
                    style={{
                      flex: 1, padding: "14px", borderRadius: "12px", border: "none",
                      background: hostedUrl ? `linear-gradient(135deg, #4d96ff, #6bcbff)` : "rgba(77,150,255,0.3)",
                      color: "#fff", fontFamily: "'Outfit', sans-serif",
                      fontSize: "14px", fontWeight: 700, cursor: hostedUrl ? "pointer" : "not-allowed",
                      boxShadow: hostedUrl ? "0 4px 20px rgba(77,150,255,0.35)" : "none",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    }}
                    aria-label="Send profile link to client via email"
                  >✉️ Email</button>
                  <button
                    onClick={() => {
                      if (!hostedUrl) return;
                      const msg = encodeURIComponent(`Hi! I'd like to share my support worker profile with you. You can view my services, availability, and how to get in touch here: ${hostedUrl}`);
                      window.open(`https://wa.me/?text=${msg}`, "_blank");
                    }}
                    disabled={!hostedUrl}
                    style={{
                      flex: 1, padding: "14px", borderRadius: "12px", border: "none",
                      background: hostedUrl ? `linear-gradient(135deg, #25d366, #128c7e)` : "rgba(37,211,102,0.3)",
                      color: "#fff", fontFamily: "'Outfit', sans-serif",
                      fontSize: "14px", fontWeight: 700, cursor: hostedUrl ? "pointer" : "not-allowed",
                      boxShadow: hostedUrl ? "0 4px 20px rgba(37,211,102,0.35)" : "none",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    }}
                    aria-label="Send profile link to client via WhatsApp"
                  >💬 WhatsApp</button>
                </div>
              </div>

              {/* ── Share to Social / Web Share API ── */}
              {hostedUrl && (
                <div style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)", borderRadius: "16px", border: "1px solid rgba(255,100,180,0.25)", padding: "18px" }}>
                  <p style={{ margin: "0 0 4px", fontFamily: "'Outfit', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "#e040a0" }}>📲 Share to Social Media</p>
                  <p style={{ margin: "0 0 14px", fontFamily: "'Outfit', sans-serif", fontSize: "12px", color: A.textDim, lineHeight: 1.6 }}>
                    Share your profile link directly to WhatsApp, Instagram, Facebook, or any app on your device in one tap.
                  </p>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {/* Native Web Share (mobile) */}
                    {typeof navigator !== "undefined" && navigator.share && (
                      <button
                        onClick={() => {
                          navigator.share({
                            title: `${profile.name || "Support Worker"} — InSync Profiles Profile`,
                            text: profile.tagline || `Check out ${profile.name || "this support worker"}'s profile`,
                            url: hostedUrl,
                          }).catch(() => {});
                        }}
                        style={{
                          flex: 1, minWidth: "140px", padding: "13px", borderRadius: "12px", border: "none",
                          background: "linear-gradient(135deg, #e040a0, #ff6bcb)",
                          color: "#fff", fontFamily: "'Outfit', sans-serif",
                          fontSize: "13px", fontWeight: 700, cursor: "pointer",
                          boxShadow: "0 4px 16px rgba(224,64,160,0.35)",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                        }}
                        aria-label="Share profile via device share sheet"
                      >📲 Share via Device</button>
                    )}
                    {/* WhatsApp */}
                    <button
                      onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Hi! Check out ${profile.name || "my"} support worker profile: ${hostedUrl}`)}`, "_blank")}
                      style={{
                        flex: 1, minWidth: "120px", padding: "13px", borderRadius: "12px", border: "none",
                        background: "linear-gradient(135deg, #25d366, #128c7e)",
                        color: "#fff", fontFamily: "'Outfit', sans-serif",
                        fontSize: "13px", fontWeight: 700, cursor: "pointer",
                        boxShadow: "0 4px 16px rgba(37,211,102,0.35)",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                      }}
                      aria-label="Share profile via WhatsApp"
                    >💬 WhatsApp</button>
                    {/* Facebook */}
                    <button
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(hostedUrl)}`, "_blank")}
                      style={{
                        flex: 1, minWidth: "120px", padding: "13px", borderRadius: "12px", border: "none",
                        background: "linear-gradient(135deg, #1877f2, #0d5dbf)",
                        color: "#fff", fontFamily: "'Outfit', sans-serif",
                        fontSize: "13px", fontWeight: 700, cursor: "pointer",
                        boxShadow: "0 4px 16px rgba(24,119,242,0.35)",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                      }}
                      aria-label="Share profile on Facebook"
                    >📘 Facebook</button>
                  </div>
                </div>
              )}

            </Section>

            </div>{/* end hidden share section */}
          </>
        )}

        {/* Client view — read-only, no editor */}
        {isClientView && (
          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "14px", color: A.textMid, lineHeight: 1.7 }}>
              {profile.tagline}
            </p>
            <button onClick={handleShareProfile}
              style={{ marginTop: "16px", padding: "12px 28px", borderRadius: "12px", background: `${A.gold}22`, border: `1px solid ${A.gold}55`, color: A.gold, fontFamily: "'Outfit', sans-serif", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
            >🔗 Share This Profile</button>
          </div>
        )}

      </main>

      {/* ══ VERTICAL COMPLETION PROGRESS BAR ══ */}
      {!isMobile && (() => {
        const steps = [
          { label: "Name",       done: !!profile.name.trim(),                                   anchor: "section-identity" },
          { label: "Photo",      done: !!profile.profileImage,                                   anchor: "section-identity" },
          { label: "Bio",        done: profile.bio.trim().length > 20,                           anchor: "section-identity" },
          { label: "Services",   done: profile.services.filter(s => s.selected).length >= 2,    anchor: "section-services" },
          { label: "Show Up",    done: (
              profile.showUpStyle.communicate.length +
              profile.showUpStyle.connect.length +
              profile.showUpStyle.presence.length
            ) >= 2,                                                                              anchor: "section-show-up" },
          { label: "Hours",      done: !!profile.availFrom,                                     anchor: "section-availability" },
          { label: "Contact",    done: !!(profile.email || profile.website),                    anchor: "section-contact" },
          { label: "Saved",      done: !!hostedUrl,                                             anchor: "section-share" },
        ];
        const doneCount = steps.filter(s => s.done).length;
        const pct = Math.round((doneCount / steps.length) * 100);
        return (
          <div
            aria-label={`Profile completion: ${pct}%`}
            style={{
              position: "fixed",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 9990,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0",
            }}
          >
            {/* Track */}
            <div style={{
              width: "6px",
              height: `${steps.length * 36}px`,
              borderRadius: "6px",
              background: "rgba(0,0,0,0.10)",
              position: "relative",
              overflow: "visible",
            }}>
              {/* Fill */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: `${pct}%`,
                borderRadius: "6px",
                background: pct === 100
                  ? "linear-gradient(180deg, #4caf50, #2e7d32)"
                  : "linear-gradient(180deg, #4a90d9, #d4a820)",
                transition: "height 0.4s cubic-bezier(0.23,1,0.32,1)",
              }} />
              {/* Step dots */}
              {steps.map((step, i) => {
                const topPx = i * 36 + 15;
                return (
                  <button
                    key={step.label}
                    onClick={() => {
                      const el = document.getElementById(step.anchor);
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    title={`${step.label}${step.done ? " ✓" : " — incomplete"}`}
                    aria-label={`${step.label}${step.done ? " complete" : " incomplete"}`}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: `${topPx}px`,
                      transform: "translate(-50%, -50%)",
                      width: step.done ? "14px" : "10px",
                      height: step.done ? "14px" : "10px",
                      borderRadius: "50%",
                      background: step.done ? (pct === 100 ? "#4caf50" : "#4a90d9") : "rgba(255,255,255,0.8)",
                      border: step.done ? "2px solid white" : "2px solid rgba(0,0,0,0.20)",
                      boxShadow: step.done ? "0 0 6px rgba(74,144,217,0.5)" : "none",
                      cursor: "pointer",
                      padding: 0,
                      transition: "all 0.25s ease",
                      zIndex: 1,
                    }}
                  />
                );
              })}
            </div>
            {/* Percentage label */}
            <div style={{
              marginTop: "8px",
              fontFamily: "'Outfit', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              color: pct === 100 ? "#4caf50" : "#4a90d9",
              textAlign: "center",
              letterSpacing: "0.02em",
            }}>
              {pct}%
            </div>
          </div>
        );
      })()}

      {/* ══ STICKY SAVE BUTTON (desktop only — mobile uses bottom nav) ══ */}
      {!isDemo && (
        <button
          id="insync-save-btn"
          onClick={handleSaveChanges}
          aria-label="Save profile changes"
          style={{
            position: 'fixed',
            bottom: isMobile ? '80px' : '28px',
            right: '18px',
            zIndex: 9980,
            padding: '14px 28px',
            borderRadius: '99px',
            background: saved
              ? 'linear-gradient(135deg, #2ecc71 0%, oklch(0.55 0.18 145) 100%)'
              : `linear-gradient(135deg, ${A.gold} 0%, oklch(0.72 0.18 65) 100%)`,
            border: 'none',
            color: 'oklch(0.08 0.05 155)',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '15px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: saved
              ? '0 6px 32px rgba(46,204,113,0.5)'
              : `0 6px 32px ${A.gold}66`,
            transition: 'all 0.25s cubic-bezier(0.23,1,0.32,1)',
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
          onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {saved ? '✓ Saved' : '💾 Save Profile'}
        </button>
      )}

      {/* ══ MOBILE BOTTOM NAV ══ */}
      {isMobile && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-2"
          style={{
            background: A.card,
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderTop: `1px solid ${A.border}`,
            boxShadow: "0 -4px 24px oklch(0 0 0 / 30%)",
            paddingBottom: "env(safe-area-inset-bottom, 8px)",
          }}
          aria-label="Mobile navigation"
        >
          {[
            { icon: "⊞", label: "Profile", onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
            { icon: "👤", label: "Client", onClick: () => { if (hostedUrl) window.open(hostedUrl, "_blank"); else toast.error("Save your profile first to preview the client view."); } },
            { icon: "➤", label: "Share", onClick: handleShareProfile },
            { icon: "🔖", label: "Save", onClick: handleSaveChanges },
          ].map(btn => (
            <button key={btn.label} onClick={btn.onClick}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", padding: "6px 12px", background: "none", border: "none", color: A.textDim, fontFamily: "'Outfit', sans-serif", fontSize: "10px", cursor: "pointer", minWidth: "52px" }}
              aria-label={btn.label}
            >
              <span style={{ fontSize: "20px" }}>{btn.icon}</span>
              <span>{btn.label}</span>
            </button>
          ))}
        </nav>
      )}

      {/* ── Brand Footer ─────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '32px 16px 40px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <img src="/assets/insync-logo-main.png" alt="InSync Profiles" style={{ width: '96px', height: '96px', objectFit: 'contain', borderRadius: '50%' }} />
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.65)', margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>InSync Profiles</p>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.3)', margin: 0 }}>&copy; {new Date().getFullYear()} InSync Profiles. All rights reserved. &nbsp;·&nbsp; ABN 54 116 010 622</p>
        <a href="/privacy" style={{ fontFamily: "'Outfit', sans-serif", fontSize: '11px', color: 'rgba(255,255,255,0.35)', textDecoration: 'underline', marginTop: '2px' }}>Terms of Sale &amp; Refund Policy</a>
      </div>
    </div>

      {/* ══ PERSONALISE STICKER — removed ══ */}
      {false && !isClientView && createPortal(
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            right: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 9998,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "0",
            pointerEvents: "none",
          }}
          className="hidden lg:flex"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0", marginBottom: "-2px" }}>
            <div style={{
              width: 0, height: 0,
              borderTop: "12px solid transparent",
              borderBottom: "12px solid transparent",
              borderRight: "12px solid #ff4ecb",
              flexShrink: 0,
            }} />
            <div style={{
              background: "linear-gradient(135deg, #ff4ecb 0%, #ff8c00 50%, #ffe600 100%)",
              borderRadius: "20px",
              padding: "20px 22px",
              maxWidth: "190px",
              boxShadow: "0 8px 40px rgba(255,78,203,0.55), 0 4px 16px rgba(255,140,0,0.40), 0 0 0 3px rgba(255,255,255,0.25)",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 60%)", borderRadius: "20px", pointerEvents: "none" }} />
              <div style={{ fontSize: "36px", marginBottom: "10px", lineHeight: 1, filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.25))" }}>🪄</div>
              <p style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "14px",
                fontWeight: 900,
                color: "#fff",
                margin: "0 0 8px",
                letterSpacing: "0.05em",
                lineHeight: 1.2,
                textTransform: "uppercase",
                textShadow: "0 1px 4px rgba(0,0,0,0.30)",
              }}>Make it yours!</p>
              <p style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.92)",
                margin: 0,
                lineHeight: 1.55,
                textShadow: "0 1px 3px rgba(0,0,0,0.25)",
              }}>Upload your photo, add your name &amp; tagline — watch your profile come alive ✨</p>
            </div>
          </div>
          <div style={{
            fontSize: "30px",
            marginRight: "148px",
            marginTop: "6px",
            transform: "scaleX(-1) rotate(-15deg)",
            color: "#ff4ecb",
            filter: "drop-shadow(0 2px 4px rgba(255,78,203,0.5))",
            lineHeight: 1,
          }}>↖</div>
        </div>
      , document.body)}
    </SectionThemeCtx.Provider>
  );
}
