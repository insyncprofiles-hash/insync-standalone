/* ============================================================
   ClientView.tsx — InSync Profiles
   Read-only client-facing profile page at /view?...
   Matches the mockup: post card + Thread accordions
   No editing — pure display
   ============================================================ */
import React, { useState, useEffect, useCallback } from "react";
import { useColorTheme } from "@/contexts/ColorThemeContext";
import { getSkinById, ALL_SKINS } from "@/lib/skins";
import {
  ProfileData,
  ServiceItem,
  ExperienceGroup,
} from "./Home";
import { useA11y } from "@/hooks/useA11y";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";

// ── Defaults (same as Home.tsx) ───────────────────────────────
const DEFAULT_VIDEO = "/assets/pete_james_intro_with_music_c9095da0.mp4"; // Pete James demo intro video (with music)

const ALL_AVAILABLE_SERVICES: ServiceItem[] = [
  { id: "personal-care",   icon: "🤲", label: "Personal Care",          selected: false, description: "Personal hygiene & daily routines" },
  { id: "emotional",       icon: "🌿", label: "Emotional Support",       selected: false, description: "Mental wellbeing & companionship" },
  { id: "community",       icon: "👥", label: "Community Access",        selected: false, description: "Social outings & participation" },
  { id: "mental",          icon: "🧠", label: "Mental Wellbeing",        selected: false, description: "Mindfulness & emotional regulation" },
  { id: "daily-living",    icon: "📋", label: "Daily Living Support",    selected: false, description: "Household tasks & goal planning" },
  { id: "transport",       icon: "🚗", label: "Transport Assistance",    selected: false, description: "Driving to appointments & activities" },
  { id: "domestic",        icon: "🧹", label: "Domestic Assistance",     selected: false, description: "Cleaning, cooking & home tasks" },
  { id: "medication",      icon: "💊", label: "Medication Support",      selected: false, description: "Prompting & administering medication" },
  { id: "behaviour",       icon: "💡", label: "Behaviour Support",       selected: false, description: "Positive behaviour strategies" },
  { id: "overnight",       icon: "🌙", label: "Overnight / Sleepover",   selected: false, description: "Overnight care & active nights" },
  { id: "social-skills",   icon: "🤝", label: "Social Skills Development",selected: false, description: "Building confidence & connections" },
  { id: "employment",      icon: "💼", label: "Employment Support",      selected: false, description: "Job readiness & workplace assistance" },
  { id: "therapy-assist",  icon: "🎯", label: "Therapy Assistance",      selected: false, description: "Supporting OT, physio & speech goals" },
  { id: "aac-comm",        icon: "🗣", label: "AAC Communication",       selected: false, description: "Augmentative & alternative communication" },
  { id: "auslan",          icon: "🤟", label: "Auslan / Sign Language",  selected: false, description: "Auslan-fluent support" },
  { id: "respite",         icon: "🏠", label: "In-Home Respite",         selected: false, description: "Carer relief & family support" },
  { id: "school-leaver",   icon: "🎓", label: "School Leaver Support",   selected: false, description: "SLES & transition to adulthood" },
  { id: "plan-management", icon: "📊", label: "Plan Management Support", selected: false, description: "Helping navigate NDIS plans" },
  { id: "exercise",        icon: "🏋", label: "Exercise & Fitness",      selected: false, description: "Active lifestyle & physical health" },
  { id: "creative",        icon: "🎨", label: "Creative Arts Therapy",   selected: false, description: "Art, music & expressive therapies" },
];

const DEFAULT_EXPERIENCE_GROUPS: ExperienceGroup[] = [
  { id: "physical", title: "Physical Disability", icon: "🧑", items: [
    { id: "spinal", label: "Spinal Cord Injury", checked: false },
    { id: "ms", label: "Multiple Sclerosis", checked: false },
    { id: "cp", label: "Cerebral Palsy", checked: false },
    { id: "muscular", label: "Muscular Dystrophy", checked: false },
    { id: "acquired-brain", label: "Acquired Brain Injury", checked: false },
    { id: "stroke", label: "Stroke Recovery", checked: false },
    { id: "amputation", label: "Amputation / Limb Difference", checked: false },
  ]},
  { id: "intellectual", title: "Intellectual Disability", icon: "🌟", items: [
    { id: "down", label: "Down Syndrome", checked: false },
    { id: "intellectual-general", label: "Intellectual Disability (General)", checked: false },
    { id: "global-delay", label: "Global Developmental Delay", checked: false },
    { id: "fragile-x", label: "Fragile X Syndrome", checked: false },
  ]},
  { id: "autism", title: "Autism Spectrum", icon: "🧩", items: [
    { id: "autism-level1", label: "Autism Level 1 (ASD1)", checked: false },
    { id: "autism-level2", label: "Autism Level 2 (ASD2)", checked: false },
    { id: "autism-level3", label: "Autism Level 3 (ASD3)", checked: false },
    { id: "pda", label: "PDA Profile", checked: false },
    { id: "aac-user", label: "AAC User", checked: false },
    { id: "low-demand", label: "Low Demand Approach", checked: false },
  ]},
  { id: "mental-health", title: "Mental Health", icon: "🧠", items: [
    { id: "anxiety", label: "Anxiety Disorders", checked: false },
    { id: "schizophrenia", label: "Schizophrenia / Psychosis", checked: false },
    { id: "depression", label: "Depression", checked: false },
    { id: "bipolar", label: "Bipolar Disorder", checked: false },
    { id: "ptsd", label: "PTSD / Trauma", checked: false },
    { id: "bpd", label: "Borderline Personality Disorder", checked: false },
    { id: "eating", label: "Eating Disorders", checked: false },
    { id: "ocd", label: "OCD", checked: false },
  ]},
  { id: "sensory", title: "Sensory Impairment", icon: "👁️", items: [
    { id: "vision", label: "Vision Impairment / Blindness", checked: false },
    { id: "hearing", label: "Hearing Impairment / Deafness", checked: false },
    { id: "deafblind", label: "DeafBlind", checked: false },
    { id: "auslan", label: "Auslan / Sign Language", checked: false },
  ]},
  { id: "elderly", title: "Elderly & Aged Care", icon: "🌸", items: [
    { id: "aged-daily", label: "Daily Living Assistance", checked: false },
    { id: "aged-mobility", label: "Mobility & Falls Prevention", checked: false },
    { id: "aged-dementia", label: "Dementia Care", checked: false },
    { id: "aged-palliative", label: "Palliative / End-of-Life Care", checked: false },
    { id: "aged-social", label: "Social Isolation Support", checked: false },
    { id: "aged-medication", label: "Medication Management", checked: false },
    { id: "aged-respite", label: "Respite Care", checked: false },
  ]},
  { id: "complex", title: "Complex & High Needs", icon: "🏥", items: [
    { id: "complex-behaviour", label: "Complex Behaviour Support", checked: false },
    { id: "peg", label: "PEG / Enteral Feeding", checked: false },
    { id: "tracheostomy", label: "Tracheostomy Care", checked: false },
    { id: "ventilator", label: "Ventilator / Respiratory Support", checked: false },
    { id: "catheter", label: "Catheter / Continence Care", checked: false },
    { id: "wound", label: "Wound Management", checked: false },
  ]},
  { id: "professional-skills", title: "Professional Skills", icon: "🛠", items: [
    { id: "safe-transfers", label: "Safe Transfers & Mobility Assistance", checked: false },
    { id: "risk-assessments", label: "Risk Assessments", checked: false },
    { id: "research-advocacy", label: "Research & Advocacy", checked: false },
    { id: "care-planning", label: "Care Planning & Goal Setting", checked: false },
    { id: "incident-reporting", label: "Incident Reporting & Documentation", checked: false },
    { id: "manual-handling", label: "Manual Handling", checked: false },
    { id: "first-aid-cpr", label: "First Aid / CPR Certified", checked: false },
    { id: "medication-admin", label: "Medication Administration", checked: false },
  ]},
];

const BADGE_ICONS: Record<string, string> = {
  "NDIS Worker Screened":  "🛡",
  "First Aid Certified":   "⭐",
  "Mental Health Support": "🤍",
  "Working With Children Check": "🧒",
  "Police Check":          "🔍",
  "NDIS Worker Check":     "✅",
  "5+ Years Experience":   "👥",
  "Mental Health First Aid": "🤍",
  "Public Liability Insurance": "📋",
  "Professional Indemnity Insurance": "🔒",
};

// ── Load profile from URL params ──────────────────────────────
function loadProfileFromURL(): Partial<ProfileData> {
  const params = new URLSearchParams(window.location.search);

  // If ?pid= is present, load full profile from localStorage (saved by Home.tsx on Save)
  const pid = params.get("pid");
  if (pid) {
    const stored = localStorage.getItem(`insync_profile_${pid}`);
    if (stored) {
      // stored is the full /view?name=...&... URL — re-parse its query string
      try {
        const storedParams = new URLSearchParams(stored.includes("?") ? stored.split("?")[1] : stored);
        // Recurse with the stored params by temporarily replacing location.search
        const overrides: Partial<ProfileData> = {};
        if (storedParams.get("name"))      overrides.name = storedParams.get("name")!;
        if (storedParams.get("tagline"))   overrides.tagline = storedParams.get("tagline")!;
        if (storedParams.get("bio"))       overrides.bio = storedParams.get("bio")!;
        if (storedParams.get("location"))  overrides.location = storedParams.get("location")!;
        if (storedParams.get("phone"))     overrides.phone = storedParams.get("phone")!;
        if (storedParams.get("email"))     overrides.email = storedParams.get("email")!;
        if (storedParams.get("website"))   overrides.website = storedParams.get("website")!;
        if (storedParams.get("instagram")) overrides.instagram = storedParams.get("instagram")!;
        if (storedParams.get("whatsapp"))  overrides.whatsapp = storedParams.get("whatsapp")!;
        if (storedParams.get("contactLabel")) overrides.contactLabel = storedParams.get("contactLabel")!;
        if (storedParams.get("ctaText"))   overrides.ctaText = storedParams.get("ctaText")!;
        if (storedParams.get("title"))     overrides.title = storedParams.get("title")!;
        if (storedParams.get("services")) {
          const ids = storedParams.get("services")!.split(",");
          overrides.services = ALL_AVAILABLE_SERVICES.map(s => ({ ...s, selected: ids.includes(s.id) }));
        }
        if (storedParams.get("exp")) {
          const pairs = storedParams.get("exp")!.split(",").map((p: string) => p.split(":"));
          overrides.experienceGroups = DEFAULT_EXPERIENCE_GROUPS.map(g => ({
            ...g,
            items: g.items.map(i => ({
              ...i,
              checked: pairs.some(([gid, iid]: string[]) => gid === g.id && iid === i.id),
            })),
          }));
        }
        if (storedParams.get("languages")) {
          overrides.languages = storedParams.get("languages")!.split(",").filter(Boolean);
        }
        if (storedParams.get("badges")) {
          overrides.badges = storedParams.get("badges")!.split("|").filter(Boolean);
        }
        if (storedParams.get("availDays")) {
          const days = storedParams.get("availDays")!.split(",");
          overrides.availability = { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false };
          days.forEach(d => { if (overrides.availability) overrides.availability[d] = true; });
        }
        if (storedParams.get("availFrom")) overrides.availFrom = storedParams.get("availFrom")!;
        if (storedParams.get("availTo"))   overrides.availTo   = storedParams.get("availTo")!;
        if (storedParams.get("vehicle")) {
          const parts = storedParams.get("vehicle")!.split("|");
          const checkedMap: Record<string, string[]> = {};
          parts.forEach(p => {
            const [cat, ids] = p.split(":");
            if (cat && ids) checkedMap[cat] = ids.split(",");
          });
          const base = {
            vehicleType: [{id:"sedan",label:"Standard Sedan",checked:false},{id:"station-wagon",label:"Station Wagon",checked:false},{id:"suv",label:"SUV",checked:false},{id:"minivan",label:"Minivan / People Mover",checked:false},{id:"transit-van",label:"Commercial Transit Van",checked:false}],
            wheelchairAccess: [{id:"ambulatory",label:"Ambulatory (No wheelchair)",checked:false},{id:"collapsible",label:"Collapsible wheelchair (Stored in boot)",checked:false},{id:"rear-ramp",label:"Rear-entry ramp (WAV)",checked:false},{id:"side-ramp",label:"Side-entry ramp (WAV)",checked:false},{id:"hoist",label:"Hydraulic hoist / lift",checked:false}],
            entryHeight: [{id:"standard-low",label:"Standard low-rise entry",checked:false},{id:"lowered-floor",label:"Lowered-floor entry",checked:false},{id:"high-rise",label:"High-rise / High-roof entry",checked:false},{id:"kneeling",label:"Automated kneeling suspension",checked:false}],
            weightCapacity: [{id:"standard-duty",label:"Standard duty (Under 300kg total combined chair and user weight)",checked:false},{id:"heavy-duty",label:"Heavy duty / Bariatric (Over 300kg total combined chair and user weight)",checked:false}],
          };
          overrides.vehicleOptions = {
            vehicleType: base.vehicleType.map(i => ({ ...i, checked: (checkedMap["vehicleType"] || []).includes(i.id) })),
            wheelchairAccess: base.wheelchairAccess.map(i => ({ ...i, checked: (checkedMap["wheelchairAccess"] || []).includes(i.id) })),
            entryHeight: base.entryHeight.map(i => ({ ...i, checked: (checkedMap["entryHeight"] || []).includes(i.id) })),
            weightCapacity: base.weightCapacity.map(i => ({ ...i, checked: (checkedMap["weightCapacity"] || []).includes(i.id) })),
          };
        }
        // Load profile image from separate localStorage key (base64 too large for URL)
        const imgKey = `insync_profile_image_${pid}`;
        const storedImg = localStorage.getItem(imgKey);
        if (storedImg) overrides.profileImage = storedImg;
        // Also check for Cloudinary photo URL in stored params
        if (!overrides.profileImage && storedParams.get("photo")) {
          overrides.profileImage = storedParams.get("photo")!;
        }
        return overrides;
      } catch {
        // Fall through to direct param parsing
      }
    }
  }

  // Direct URL params (legacy ?name=... format)
  const overrides: Partial<ProfileData> = {};
  if (params.get("name"))      overrides.name = params.get("name")!;
  if (params.get("tagline"))   overrides.tagline = params.get("tagline")!;
  if (params.get("bio"))       overrides.bio = params.get("bio")!;
  if (params.get("location"))  overrides.location = params.get("location")!;
  if (params.get("phone"))     overrides.phone = params.get("phone")!;
  if (params.get("email"))     overrides.email = params.get("email")!;
  if (params.get("website"))   overrides.website = params.get("website")!;
    if (params.get("instagram")) overrides.instagram = params.get("instagram")!;
  if (params.get("whatsapp")) overrides.whatsapp = params.get("whatsapp")!;
  if (params.get("contactLabel")) overrides.contactLabel = params.get("contactLabel")!;
  if (params.get("ctaText")) overrides.ctaText = params.get("ctaText")!;
  if (params.get("title")) overrides.title = params.get("title")!;
  if (params.get("services")) {
    const ids = params.get("services")!.split(",");
    overrides.services = ALL_AVAILABLE_SERVICES.map(s => ({ ...s, selected: ids.includes(s.id) }));
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
  if (params.get("languages")) {
    overrides.languages = params.get("languages")!.split(",").filter(Boolean);
  }
  if (params.get("badges")) {
    overrides.badges = params.get("badges")!.split("|").filter(Boolean);
  }
  if (params.get("availDays")) {
    const days = params.get("availDays")!.split(",");
    overrides.availability = { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false };
    days.forEach(d => { if (overrides.availability) overrides.availability[d] = true; });
  }
  if (params.get("availFrom")) overrides.availFrom = params.get("availFrom")!;
  if (params.get("availTo"))   overrides.availTo   = params.get("availTo")!;
  if (params.get("vehicle")) {
    const parts = params.get("vehicle")!.split("|");
    const checkedMap: Record<string, string[]> = {};
    parts.forEach(p => {
      const [cat, ids] = p.split(":");
      if (cat && ids) checkedMap[cat] = ids.split(",");
    });
    const base = {
      vehicleType: [{id:"sedan",label:"Standard Sedan",checked:false},{id:"station-wagon",label:"Station Wagon",checked:false},{id:"suv",label:"SUV",checked:false},{id:"minivan",label:"Minivan / People Mover",checked:false},{id:"transit-van",label:"Commercial Transit Van",checked:false}],
      wheelchairAccess: [{id:"ambulatory",label:"Ambulatory (No wheelchair)",checked:false},{id:"collapsible",label:"Collapsible wheelchair (Stored in boot)",checked:false},{id:"rear-ramp",label:"Rear-entry ramp (WAV)",checked:false},{id:"side-ramp",label:"Side-entry ramp (WAV)",checked:false},{id:"hoist",label:"Hydraulic hoist / lift",checked:false}],
      entryHeight: [{id:"standard-low",label:"Standard low-rise entry",checked:false},{id:"lowered-floor",label:"Lowered-floor entry",checked:false},{id:"high-rise",label:"High-rise / High-roof entry",checked:false},{id:"kneeling",label:"Automated kneeling suspension",checked:false}],
      weightCapacity: [{id:"standard-duty",label:"Standard duty (Under 300kg total combined chair and user weight)",checked:false},{id:"heavy-duty",label:"Heavy duty / Bariatric (Over 300kg total combined chair and user weight)",checked:false}],
    };
    overrides.vehicleOptions = {
      vehicleType: base.vehicleType.map(i => ({ ...i, checked: (checkedMap["vehicleType"] || []).includes(i.id) })),
      wheelchairAccess: base.wheelchairAccess.map(i => ({ ...i, checked: (checkedMap["wheelchairAccess"] || []).includes(i.id) })),
      entryHeight: base.entryHeight.map(i => ({ ...i, checked: (checkedMap["entryHeight"] || []).includes(i.id) })),
      weightCapacity: base.weightCapacity.map(i => ({ ...i, checked: (checkedMap["weightCapacity"] || []).includes(i.id) })),
    };
  }
  // Cloudinary photo URL travels directly in the URL
  if (params.get("photo")) overrides.profileImage = params.get("photo")!;
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

// ── Card palette (mirrors SocialPostPreview) ──────────────────
function useCardPalette() {
  const { theme } = useColorTheme();
  if (theme.id === "sky-gold") return {
    bg: "#fdfcf8", text: "#1a2340", textMid: "#3a4a6a", textDim: "#7a8aaa",
    accent: "#4a90d9", accentAlt: "#d4a820", ringBorder: "#d4a820",
    badgeBg: "rgba(74,144,217,0.09)", badgeBorder: "rgba(74,144,217,0.28)",
    ctaFrom: "#4a90d9", ctaTo: "#d4a820",
    videoBorder: "linear-gradient(135deg,#4a90d9,#d4a820,#4a90d9)",
    circleColors: ["#4a90d9","#2ecc71","#e67e22","#9b59b6","#e74c3c"],
  };
  if (theme.id === "ocean-amber") return {
    bg: "#fdf8f0", text: "#0d2a1a", textMid: "#2a5040", textDim: "#6a8a78",
    accent: "#009488", accentAlt: "#e8820a", ringBorder: "#e8820a",
    badgeBg: "rgba(0,148,136,0.09)", badgeBorder: "rgba(0,148,136,0.28)",
    ctaFrom: "#009488", ctaTo: "#e8820a",
    videoBorder: "linear-gradient(135deg,#009488,#e8820a,#009488)",
    circleColors: ["#009488","#e8820a","#3498db","#9b59b6","#e74c3c"],
  };
  if (theme.id === "rainbow-prism") return {
    bg: "#ffffff", text: "#1a1040", textMid: "#3a2a60", textDim: "#7a6a9a",
    accent: "#9b59b6", accentAlt: "#3498db", ringBorder: "#e74c3c",
    badgeBg: "rgba(155,89,182,0.09)", badgeBorder: "rgba(155,89,182,0.28)",
    ctaFrom: "#3498db", ctaTo: "#9b59b6",
    videoBorder: "linear-gradient(135deg,#e74c3c,#f1c40f,#2ecc71,#3498db,#9b59b6)",
    circleColors: ["#e74c3c","#e67e22","#f1c40f","#2ecc71","#3498db"],
  };
  if (theme.id === "cobalt-gold") return {
    bg: "#ffffff", text: "#0d1b4a", textMid: "#2a3a7a", textDim: "#6a7aaa",
    accent: "#1565c0", accentAlt: "#f4a800", ringBorder: "#f4a800",
    badgeBg: "rgba(21,101,192,0.09)", badgeBorder: "rgba(21,101,192,0.28)",
    ctaFrom: "#1565c0", ctaTo: "#f4a800",
    videoBorder: "linear-gradient(135deg,#1565c0,#f4a800,#1565c0)",
    circleColors: ["#1565c0","#f4a800","#2ecc71","#e74c3c","#9b59b6"],
  };
  return {
    bg: "#faf8f3", text: "#1a2e1e", textMid: "#3d5c42", textDim: "#7a9b7e",
    accent: "#4a90d9", accentAlt: "oklch(0.72 0.14 75)", ringBorder: "oklch(0.72 0.14 75)",
    badgeBg: "oklch(0.82 0.14 75 / 12%)", badgeBorder: "oklch(0.72 0.14 75 / 40%)",
    ctaFrom: "#4a90d9", ctaTo: "oklch(0.72 0.14 75)",
    videoBorder: "linear-gradient(135deg,#4a90d9,oklch(0.72 0.14 75),#4a90d9)",
    circleColors: ["#4a90d9","#2ecc71","#e67e22","#9b59b6","#e74c3c"],
  };
}

// ── Thread accordion section ──────────────────────────────────
const THREAD_COLORS = ["#4a90d9", "#2ecc71", "#e67e22", "#9b59b6", "#e74c3c", "#1abc9c", "#f39c12"];

interface ThreadSectionProps {
  num: number;
  icon: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  textColor: string;
  cardBg: string;
}
function ThreadSection({ num, icon, title, subtitle, children }: ThreadSectionProps) {
  const color = THREAD_COLORS[(num - 1) % THREAD_COLORS.length];
  return (
    <div style={{
      background: "#ffffff",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
      borderLeft: `4px solid ${color}`,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "14px",
        padding: "16px 18px 16px 16px",
      }}>
        {/* Large icon circle */}
        <div style={{
          width: "60px", height: "60px", borderRadius: "50%", flexShrink: 0,
          background: `${color}18`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "26px",
        }}>{icon}</div>
        {/* Text block */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color, margin: "0 0 2px" }}>
            Thread {num}
          </p>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: 700, color: "#1a2e4a", margin: "0 0 3px", lineHeight: 1.1 }}>{title}</h3>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "12px", color: "#6a7a9a", margin: 0, lineHeight: 1.3 }}>{subtitle}</p>
        </div>
      </div>
      <div style={{ padding: "0 18px 20px 18px", borderTop: `1px solid ${color}18` }}>
        {children}
      </div>
    </div>
  );
}

// ── Thread connector ──────────────────────────────────────────
function ThreadConnector() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "44px", position: "relative" }}>
      <div style={{ width: "2px", height: "100%", background: "linear-gradient(180deg, #f0c040 0%, rgba(240,192,64,0.4) 100%)" }} />
      <div style={{
        position: "absolute", top: "50%", transform: "translateY(-50%)",
        width: "12px", height: "12px", borderRadius: "50%",
        background: "#f0c040", border: "2px solid white",
        boxShadow: "0 0 10px rgba(240,192,64,0.5)",
      }} />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export default function ClientView() {
  const { theme } = useColorTheme();
  const P = useCardPalette();
  const { wrapperStyle: a11yStyle } = useA11y();

  // Load profile from URL params
  const urlOverrides = React.useMemo(() => loadProfileFromURL(), []);

  // Skin + font scale from URL params
  const urlParams = React.useMemo(() => new URLSearchParams(window.location.search), []);
  const skinId = urlParams.get("skinId") || "default";
  const fontScale = parseFloat(urlParams.get("fontScale") || "1") || 1;
  const activeSkin = getSkinById(skinId);

  // Dynamically load Google Font for the active skin
  useEffect(() => {
    if (!activeSkin) return;
    const fonts = [activeSkin.fonts.heading, activeSkin.fonts.body].filter((v, i, a) => a.indexOf(v) === i);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?${fonts.map(f => `family=${f.replace(/ /g, "+")}:wght@400;600;700;800`).join("&")}&display=swap`;
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch {} };
  }, [activeSkin]);
  const profile: ProfileData = {
    name: "Pete James",
    title: "Support Worker",
    tagline: "Real support delivered, every time.",
    bio: "I actively research, source, and advocate for accessible and inclusive activities — because the right experience changes everything. Whether it's finding a surf lesson with adaptive equipment, a sensory-friendly event, or a local trail that actually works, I make it happen. Support that matters starts with showing up and doing the work.",
    location: "Central Coast, NSW",
    phone: "",
    email: "pete.james@example.com.au",
    website: "",
    instagram: "support.with.soul",
    whatsapp: "",
    contactLabel: "Contact",
    profileImage: "/assets/pete_james_headshot_c42b5c10.png",
    services: ALL_AVAILABLE_SERVICES.slice(0, 5).map(s => ({ ...s, selected: true })),
    badges: ["NDIS Worker Check", "First Aid Certified", "Mental Health Support", "Working With Children Check"],
    ctaText: "MESSAGE TO BEGIN",
    accentColor: "gold",
    experienceGroups: DEFAULT_EXPERIENCE_GROUPS.map(g => ({
      ...g,
      items: g.items.map(i => ({
        ...i,
        checked: (
          // Physical
          i.id === "cp" || i.id === "acquired-brain" ||
          // Intellectual
          i.id === "intellectual-general" ||
          // Autism
          i.id === "autism-level1" || i.id === "autism-level2" || i.id === "low-demand" ||
          // Mental health
          i.id === "anxiety" || i.id === "ptsd" ||
          // Professional skills
          i.id === "research-advocacy" || i.id === "safe-transfers" || i.id === "first-aid-cpr"
        ),
      })),
    })),
    availability: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false },
    availFrom: "9:00 AM",
    availTo: "5:00 PM",
    languages: ["English"],
    vehicleOptions: {
      vehicleType: [],
      wheelchairAccess: [],
      entryHeight: [],
      weightCapacity: [],
    },
    showUpStyle: {
      communicate: ["Plain language", "Written summaries", "Visual supports"],
      connect: ["Warm & patient", "Humour when appropriate", "Non-judgmental"],
      presence: ["Calm & grounded", "Consistent", "Strengths-based"],
    },
    ...urlOverrides,
  };

  const selectedServices = profile.services.filter(s => s.selected);
  const isGradient = ["sky-gold","ocean-amber","rainbow-prism","cobalt-gold"].includes(theme.id);
  const isDark = ["aurora","midnight","forest"].includes(theme.id);

  // Apply skin background if active, otherwise use theme-aware gradient
  const THEME_BG_GRADIENTS: Record<string, string> = {
    "sky-gold":       "linear-gradient(160deg, #C8E6FA 0%, #e8f4ff 45%, #F7E08A 100%)",
    "ocean-amber":    "linear-gradient(160deg, #0d2a3a 0%, #1a4a5a 45%, #3a2800 100%)",
    "rainbow-prism":  "linear-gradient(160deg, #e8e0ff 0%, #ffe8f8 45%, #fff8d0 100%)",
    "cobalt-gold":    "linear-gradient(160deg, #0d1b4a 0%, #1a2a6a 45%, #3a2800 100%)",
    "daylight":       "linear-gradient(160deg, #e8f0f8 0%, #f0f6ff 45%, #d0e4f4 100%)",
    "sage-linen":     "linear-gradient(160deg, #e8ede0 0%, #f0f4e8 45%, #d8e8cc 100%)",
    "blush-cream":    "linear-gradient(160deg, #f5e8e0 0%, #fdf0e8 45%, #f0d8cc 100%)",
    "slate-mint":     "linear-gradient(160deg, #ddeef0 0%, #eaf6f8 45%, #c8e8ec 100%)",
  };
  const bgStyle: React.CSSProperties = {
    background: activeSkin
      ? activeSkin.palette.bg
      : (THEME_BG_GRADIENTS[theme.id] || "linear-gradient(160deg, #C8E6FA 0%, #e8f4ff 45%, #F7E08A 100%)"),
  };

  const handleCTA = () => {
    const name = profile.name || "this support worker";
    if (profile.email) {
      const subject = encodeURIComponent(`Support enquiry — ${name}`);
      const body = encodeURIComponent(`Hi ${name},\n\nI found your profile on InSync Profiles and would like to connect.`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    } else {
      alert("No contact details have been added to this profile yet. Please ask the support worker to add their email in their profile settings.");
    }
  };

  const checkedExperience = profile.experienceGroups
    .flatMap(g => g.items.filter(i => i.checked).map(i => ({ group: g.title, label: i.label })));

  const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const availDays = DAYS.filter(d => profile.availability[d]);

  // Convert any YouTube URL format to an embed URL
  function toEmbedUrl(url: string): string {
    try {
      const u = new URL(url);
      // youtu.be/ID
      if (u.hostname === 'youtu.be') {
        const id = u.pathname.slice(1).split('?')[0];
        if (id) return `https://www.youtube.com/embed/${id}`;
      }
      // youtube.com/watch?v=ID or youtube.com/shorts/ID or youtube.com/embed/ID
      if (u.hostname.includes('youtube.com')) {
        const v = u.searchParams.get('v');
        if (v) return `https://www.youtube.com/embed/${v}`;
        const parts = u.pathname.split('/');
        const shortIdx = parts.indexOf('shorts');
        if (shortIdx !== -1 && parts[shortIdx + 1]) return `https://www.youtube.com/embed/${parts[shortIdx + 1]}`;
        const embedIdx = parts.indexOf('embed');
        if (embedIdx !== -1 && parts[embedIdx + 1]) return url; // already embed
      }
    } catch { /* not a valid URL */ }
    return url;
  }

  function isYouTubeUrl(url: string): boolean {
    return url.includes('youtu.be') || url.includes('youtube.com');
  }

  // Video URL — read from stored profile (pid) or direct ?video= param, fallback to default demo
  const videoUrl = React.useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const pid = params.get("pid");
    if (pid) {
      const stored = localStorage.getItem(`insync_profile_${pid}`);
      if (stored) {
        const sp = new URLSearchParams(stored.includes("?") ? stored.split("?")[1] : stored);
        const v = sp.get("video");
        if (v) return v;
      }
    }
    const directVideo = params.get("video");
    if (directVideo) return directVideo;
    return DEFAULT_VIDEO;
  }, []);


  // Read Aloud (TTS)
  const [ttsStatus, setTtsStatus] = useState<"idle" | "reading" | "paused">("idle");
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const stopReading = useCallback(() => {
    window.speechSynthesis?.cancel();
    setTtsStatus("idle");
  }, []);
  const handleReadAloud = useCallback(() => {
    if (!window.speechSynthesis) return;
    if (ttsStatus === "reading") {
      window.speechSynthesis.pause();
      setTtsStatus("paused");
      return;
    }
    if (ttsStatus === "paused") {
      window.speechSynthesis.resume();
      setTtsStatus("reading");
      return;
    }
    window.speechSynthesis.cancel();
    const text = document.body.innerText.slice(0, 5000);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.onstart = () => setTtsStatus("reading");
    utterance.onend = () => setTtsStatus("idle");
    utterance.onerror = () => setTtsStatus("idle");
    window.speechSynthesis.speak(utterance);
  }, [ttsStatus]);

  return (
    <>
    <AccessibilityToolbar />
    <div style={{
      ...bgStyle,
      minHeight: "100vh",
      fontFamily: activeSkin ? `'${activeSkin.fonts.body}', sans-serif` : (a11yStyle.fontFamily || "'Outfit', sans-serif"),
      paddingTop: "110px",
      fontSize: a11yStyle.fontSize ? `calc(${fontScale}rem * ${a11yStyle.fontSize})` : `${fontScale}rem`,
      filter: a11yStyle.filter,
    }}>
      {/* ── Read Aloud — vibrant solid contrast button at very top ─── */}
      <div data-no-print="true" style={{ padding: "12px 16px 0", maxWidth: "480px", margin: "0 auto" }}>
        <button
          onClick={handleReadAloud}
          style={{
            width: "100%",
            padding: "16px 24px",
            borderRadius: "50px",
            background: ttsStatus === "reading"
              ? "#e53935"
              : ttsStatus === "paused"
              ? "#f57c00"
              : "#6200ea",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            boxShadow: ttsStatus === "reading"
              ? "0 4px 20px rgba(229,57,53,0.55)"
              : ttsStatus === "paused"
              ? "0 4px 20px rgba(245,124,0,0.55)"
              : "0 4px 20px rgba(98,0,234,0.45)",
            transform: "scale(1)",
            transition: "transform 0.16s cubic-bezier(0.23,1,0.32,1)",
          }}
          onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
          onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
          aria-label={ttsStatus === "reading" ? "Pause reading aloud" : ttsStatus === "paused" ? "Resume reading aloud" : "Read this page aloud"}
        >
          <span style={{ fontSize: "22px", lineHeight: 1 }} aria-hidden="true">
            {ttsStatus === "reading" ? "⏸" : ttsStatus === "paused" ? "▶" : "🔊"}
          </span>
          <span style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "15px",
            fontWeight: 900,
            letterSpacing: "0.10em",
            color: "#ffffff",
            textTransform: "uppercase",
          }}>
            {ttsStatus === "reading" ? "Pause Reading" : ttsStatus === "paused" ? "Resume Reading" : "Read Page Aloud"}
          </span>
        </button>
        {ttsStatus !== "idle" && (
          <button
            onClick={stopReading}
            style={{
              marginTop: "8px",
              width: "100%",
              padding: "10px 24px",
              borderRadius: "50px",
              background: "#b71c1c",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Outfit', sans-serif",
              fontSize: "13px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
            aria-label="Stop reading aloud"
          >
            ⏹ Stop Reading
          </button>
        )}
      </div>
      {/* Shimmer overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 60% 40% at 30% 20%, rgba(255,255,255,0.18) 0%, transparent 70%)",
        animation: "shimmerDrift 8s ease-in-out infinite",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "480px", margin: "0 auto", padding: "24px 16px 60px" }}>

        {/* ── Post Card — theme-aware gradient card ─── */}
        <div style={{
          background: P.bg,
          borderRadius: "24px",
          boxShadow: `0 8px 48px ${P.accentAlt}22, 0 2px 12px ${P.accent}18`,
          border: `1.5px solid ${P.ringBorder}55`,
          overflow: "hidden",
          marginBottom: "0",
        }}>
          {/* Header: large circular photo + name/title/location */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: "18px", padding: "28px 24px 16px" }}>
            {/* Large circular photo with gold ring */}
            <div style={{
              width: "110px", height: "110px", borderRadius: "50%", flexShrink: 0,
              border: `4px solid ${P.ringBorder}`,
              boxShadow: `0 0 0 3px ${P.ringBorder}33, 0 4px 20px ${P.ringBorder}40`,
              overflow: "hidden", background: "#f0f4f8",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {profile.profileImage ? (
                <img src={profile.profileImage} alt={`${profile.name || 'Support worker'} — NDIS support worker aged care personal care disability support profile`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#9aabcc" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              )}
            </div>
            {/* Name / title / location */}
            <div style={{ flex: 1, paddingTop: "8px" }}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "30px", fontWeight: 700, color: P.text, margin: "0 0 6px", lineHeight: 1.05 }}>
                {profile.name}
              </h1>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: P.accent, margin: "0 0 10px" }}>
                {profile.title}
              </p>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "14px", color: P.textMid, margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#e74c3c" aria-hidden="true">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {profile.location}
              </p>
            </div>
          </div>

          {/* Service circles — pastel bg, larger, matching reference */}
          {selectedServices.length > 0 && (
            <div style={{ padding: "8px 20px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-around", gap: "6px" }}>
                {selectedServices.slice(0, 5).map((svc, i) => {
                  const PASTEL_BG = ["#fce4ec","#e3f2fd","#e8f5e9","#fff3e0","#fef9e7"];
                  const PASTEL_ICON = ["#e91e63","#1e88e5","#43a047","#fb8c00","#f9a825"];
                  return (
                    <div key={svc.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "7px", flex: 1 }}>
                      <div style={{
                        width: "60px", height: "60px", borderRadius: "50%",
                        background: PASTEL_BG[i % PASTEL_BG.length],
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "26px",
                      }}>
                        {svc.icon}
                      </div>
                      <p style={{
                        fontFamily: "'Outfit', sans-serif", fontSize: "10px", fontWeight: 600,
                        color: "#5a6a8a", textAlign: "center", margin: 0, lineHeight: 1.25,
                        maxWidth: "62px",
                      }}>
                        {svc.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Video — rainbow border matching reference */}
          <div style={{ padding: "0 20px 16px" }}>
            <div style={{
              borderRadius: "16px", overflow: "hidden",
              padding: "3px",
              background: "linear-gradient(135deg, #ff6b9d, #ffd93d, #6bcb77, #4d96ff, #c77dff)",
            }}>
              {videoUrl && isYouTubeUrl(videoUrl) ? (
                <iframe
                  src={toEmbedUrl(videoUrl)}
                  title={`${profile.name} intro video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ width: "100%", aspectRatio: "16/9", display: "block", borderRadius: "14px", border: "none" }}
                />
              ) : videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  playsInline
                  style={{ width: "100%", display: "block", borderRadius: "14px", background: "#000" }}
                  aria-label={`${profile.name} intro video`}
                />
              ) : (
                /* No video — show quote card placeholder */
                <div style={{
                  borderRadius: "14px",
                  background: "linear-gradient(160deg, #0d1b2a 0%, #1a2e4a 100%)",
                  padding: "32px 28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                  minHeight: "180px",
                  justifyContent: "center",
                }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "17px", fontStyle: "italic", fontWeight: 600, color: "rgba(255,255,255,0.92)", margin: 0, lineHeight: 1.5 }}>
                    "I think good support starts with curiosity."
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[
                      "What matters to you?",
                      "What have people assumed you can't do?",
                      "What would make life feel bigger?",
                    ].map(q => (
                      <p key={q} style={{ fontFamily: "'Outfit', sans-serif", fontSize: "14px", fontWeight: 600, color: "rgba(245,200,66,0.90)", margin: 0, paddingLeft: "14px", borderLeft: "2px solid rgba(245,200,66,0.45)" }}>{q}</p>
                    ))}
                  </div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontStyle: "italic", fontWeight: 600, color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.5 }}>
                    "That's where the real work starts."
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tagline — italic serif, matching reference */}
          <div style={{ padding: "4px 24px 18px", textAlign: "center" }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: "24px",
              fontStyle: "italic", fontWeight: 600, color: P.text, margin: 0,
              lineHeight: 1.35,
            }}>
              “{profile.tagline}”
            </p>
          </div>

          {/* CTA button — blue-to-gold gradient pill, matching reference */}
          <div style={{ padding: "0 24px 20px" }}>
            <button
              onClick={handleCTA}
              style={{
                width: "100%", padding: "18px 24px",
                background: `linear-gradient(135deg, ${P.ctaFrom} 0%, ${P.ctaTo} 100%)`,
                border: "none", borderRadius: "50px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
                boxShadow: `0 6px 24px ${P.accent}55`,
                transform: "scale(1)", transition: "transform 0.16s cubic-bezier(0.23,1,0.32,1)",
              }}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
              aria-label={`${profile.ctaText} — contact ${profile.name}`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white" opacity="0.95" aria-hidden="true">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "15px", fontWeight: 800, letterSpacing: "0.10em", color: "white", textTransform: "uppercase" }}>
                {profile.ctaText}
              </span>
            </button>
          </div>

          {/* Badges — 2-column grid, light border, matching reference */}
          {profile.badges.length > 0 && (
            <div style={{ padding: "0 20px 16px" }}>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: P.accent, margin: "0 0 10px" }}>
                🏅 Credentials &amp; Badges{" "}
                <span style={{ fontWeight: 400, opacity: 0.6 }}>(Self-Reported)</span>
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {profile.badges.map(badge => (
                  <div key={badge} style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "12px 14px",
                    background: P.badgeBg,
                    border: `1.5px solid ${P.badgeBorder}`,
                    borderRadius: "14px",
                  }}>
                    <span style={{ fontSize: "18px", flexShrink: 0 }}>{BADGE_ICONS[badge] || "✦"}</span>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "11px", fontWeight: 700, color: P.textMid, lineHeight: 1.25 }}>
                      {badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages — pill row on main card */}
          {profile.languages && profile.languages.length > 0 && (
            <div style={{ padding: "0 20px 16px" }}>
              <p style={{
                fontFamily: "'Outfit', sans-serif", fontSize: "10px", fontWeight: 700,
                letterSpacing: "0.10em", textTransform: "uppercase",
                color: "#2ecc71", margin: "0 0 8px",
              }}>🌐 Languages</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {profile.languages.map(lang => (
                  <span key={lang} style={{
                    fontFamily: "'Outfit', sans-serif", fontSize: "11px", fontWeight: 600,
                    padding: "5px 12px", borderRadius: "20px",
                    background: "rgba(46,204,113,0.12)",
                    border: "1.5px solid rgba(46,204,113,0.35)",
                    color: "#1a7a40",
                  }}>{lang}</span>
                ))}
              </div>
            </div>
          )}


        </div>




        {/* ── Threads divider label ─────────────────────── */}
        <div style={{ textAlign: 'center', margin: '8px 0 0' }}>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9aabcc', margin: 0 }}>✦ My Profile Threads ✦</p>
        </div>

        {/* ── Thread connector ─────────────────────────────── */}
        <ThreadConnector />

        {/* ── Thread 1: Identity ───────────────────────────── */}
        <ThreadSection num={1} icon="🫆" title="Identity" subtitle="Who I am, what matters to me, and how I work." textColor={P.text} cardBg={P.bg}>
          <div style={{ paddingTop: "16px" }}>
            {profile.bio && (
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "14px", color: P.textMid, lineHeight: 1.6, margin: "0 0 12px" }}>
                {profile.bio}
              </p>
            )}
            {profile.languages.length > 0 && (
              <div>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: P.accent, margin: "0 0 8px" }}>
                  Languages
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {profile.languages.map(lang => (
                    <span key={lang} style={{
                      fontFamily: "'Outfit', sans-serif", fontSize: "12px", fontWeight: 600,
                      padding: "4px 12px", borderRadius: "20px",
                      background: P.badgeBg, border: `1px solid ${P.badgeBorder}`,
                      color: P.textMid,
                    }}>{lang}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ThreadSection>

        <ThreadConnector />

        {/* ── Thread 2: Services ───────────────────────────── */}
        <ThreadSection num={2} icon="🧩" title="Services" subtitle="The supports I provide and who I support." textColor={P.text} cardBg={P.bg}>
          <div style={{ paddingTop: "16px" }}>
            {selectedServices.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {selectedServices.map((svc, i) => (
                  <div key={svc.id} style={{
                    display: "flex", alignItems: "center", gap: "7px",
                    padding: "8px 14px", borderRadius: "20px",
                    background: `${P.circleColors[i % P.circleColors.length]}14`,
                    border: `1.5px solid ${P.circleColors[i % P.circleColors.length]}40`,
                  }}>
                    <span style={{ fontSize: "16px" }}>{svc.icon}</span>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: 600, color: P.textMid }}>{svc.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "14px", color: P.textDim, margin: 0 }}>No services listed.</p>
            )}
          </div>
          {/* Vehicle Details — shown when transport or community access is selected */}
          {profile.services.some((s: { id: string; selected: boolean }) => s.selected && (s.id === "transport" || s.id === "community")) && (
            <div style={{ marginTop: "16px", padding: "14px", background: "rgba(100,160,255,0.06)", border: "1px solid rgba(100,160,255,0.18)", borderRadius: "14px" }}>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: P.accent, marginBottom: "12px" }}>🚗 Vehicle Details</p>
              {([
                { key: "vehicleType", label: "Vehicle Type" },
                { key: "wheelchairAccess", label: "Wheelchair Accessibility" },
                { key: "entryHeight", label: "Entry Height & Clearance" },
                { key: "weightCapacity", label: "Weight Capacity" },
              ] as { key: keyof typeof profile.vehicleOptions; label: string }[]).map(({ key, label }) => {
                const checked = profile.vehicleOptions[key].filter((i: { checked: boolean; label: string }) => i.checked);
                if (checked.length === 0) return null;
                return (
                  <div key={key} style={{ marginBottom: "10px" }}>
                    <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "11px", fontWeight: 600, color: P.textDim, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {checked.map((item: { label: string }) => (
                        <span key={item.label} style={{ fontFamily: "'Outfit', sans-serif", fontSize: "12px", fontWeight: 600, padding: "4px 10px", borderRadius: "20px", background: `${P.accent}18`, border: `1px solid ${P.accent}40`, color: P.textMid }}>
                          {item.label}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ThreadSection>
        {/* ── Thread connector + Experience ────────────────── */}
        {checkedExperience.length > 0 && (
          <>
            <ThreadConnector />
            <ThreadSection num={3} icon="📋" title="Experience" subtitle="My background, training, and specialist areas." textColor={P.text} cardBg={P.bg}>
              <div style={{ paddingTop: "16px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {checkedExperience.map(({ label }) => (
                  <span key={label} style={{
                    fontFamily: "'Outfit', sans-serif", fontSize: "12px", fontWeight: 600,
                    padding: "5px 12px", borderRadius: "20px",
                    background: P.badgeBg, border: `1px solid ${P.badgeBorder}`,
                    color: P.textMid,
                  }}>{label}</span>
                ))}
              </div>
            </ThreadSection>
          </>
        )}


        {/* ── How I Show Up ────────────────────────────────── */}
        {(profile.showUpStyle.communicate.length > 0 || profile.showUpStyle.connect.length > 0 || profile.showUpStyle.presence.length > 0) && (
          <>
            <ThreadConnector />
            <ThreadSection num={checkedExperience.length > 0 ? 4 : 3} icon="✨" title="How I Show Up" subtitle="My communication style, how I connect, and how I approach support." textColor={P.text} cardBg={P.bg}>
              <div style={{ paddingTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {([
                  { key: "communicate" as const, label: "How I Communicate" },
                  { key: "connect" as const, label: "How I Connect" },
                  { key: "presence" as const, label: "How I Show Up" },
                ] as { key: "communicate" | "connect" | "presence"; label: string }[]).map(group => (
                  profile.showUpStyle[group.key].length > 0 ? (
                    <div key={group.key}>
                      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: P.accent, margin: "0 0 8px" }}>
                        {group.label}
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {profile.showUpStyle[group.key].map(chip => (
                          <span key={chip} style={{
                            fontFamily: "'Outfit', sans-serif", fontSize: "12px", fontWeight: 600,
                            padding: "5px 12px", borderRadius: "20px",
                            background: `${P.ctaFrom}14`, border: `1.5px solid ${P.ctaFrom}35`,
                            color: P.textMid,
                          }}>{chip}</span>
                        ))}
                      </div>
                    </div>
                  ) : null
                ))}
              </div>
            </ThreadSection>
          </>
        )}

        {/* ── Availability ─────────────────────────────────── */}
        {availDays.length > 0 && (
          <>
            <ThreadConnector />
            <ThreadSection num={checkedExperience.length > 0 ? 4 : 3} icon="📅" title="Availability" subtitle="When I'm available to support you." textColor={P.text} cardBg={P.bg}>
              <div style={{ paddingTop: "16px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                  {availDays.map(d => (
                    <span key={d} style={{
                      fontFamily: "'Outfit', sans-serif", fontSize: "13px", fontWeight: 700,
                      padding: "6px 14px", borderRadius: "20px",
                      background: `${P.ctaFrom}18`, border: `1.5px solid ${P.ctaFrom}40`,
                      color: P.textMid,
                    }}>{d}</span>
                  ))}
                </div>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "13px", color: P.textDim, margin: 0 }}>
                  {profile.availFrom} – {profile.availTo}
                </p>
              </div>
            </ThreadSection>
          </>
        )}

        {/* ── Contact ──────────────────────────────────────── */}
        {(profile.phone || profile.email || profile.whatsapp || profile.website) && (
          <>
            <ThreadConnector />
            <ThreadSection num={checkedExperience.length > 0 ? 5 : 4} icon="✉️" title={profile.contactLabel || 'Contact'} subtitle="How to reach me." textColor={P.text} cardBg={P.bg}>
              <div style={{ paddingTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {profile.phone && (
                  <a href={`tel:${profile.phone}`} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                    <span style={{ fontSize: "18px" }}>📱</span>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "14px", color: P.accent }}>{profile.phone}</span>
                  </a>
                )}
                {profile.email && (
                  <a href={`mailto:${profile.email}`} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                    <span style={{ fontSize: "18px" }}>✉️</span>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "14px", color: P.accent }}>{profile.email}</span>
                  </a>
                )}
                {profile.whatsapp && (
                  <a href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                    <span style={{ fontSize: "18px" }}>💬</span>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "14px", color: P.accent }}>WhatsApp</span>
                  </a>
                )}
                {profile.website && (
                  <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                    <span style={{ fontSize: "18px" }}>🌐</span>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "14px", color: P.accent }}>Professional Web Link</span>
                  </a>
                )}
              </div>
            </ThreadSection>
          </>
        )}

        {/* ── Footer ───────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginTop: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          {/* Print / Save as PDF button */}
          <button
            data-no-print="true"
            onClick={() => {
              try {
                setTimeout(() => {
                  try {
                    window.print();
                  } catch {
                    // Cross-origin or blocked — guide user to use browser print
                    import("sonner").then(({ toast }) => {
                      toast.info("Use your browser print dialog", {
                        description: "Press Ctrl+P (Windows) or Cmd+P (Mac) to print or save as PDF.",
                        duration: 6000,
                      });
                    });
                  }
                }, 80);
              } catch {
                // Fallback silent
              }
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '14px 28px', borderRadius: '99px',
              background: `linear-gradient(135deg, ${P.ctaFrom} 0%, ${P.ctaTo} 100%)`,
              border: 'none', cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif", fontSize: '14px', fontWeight: 800,
              color: 'white', letterSpacing: '0.06em', textTransform: 'uppercase',
              boxShadow: `0 6px 24px ${P.accent}55`,
              transform: 'scale(1)', transition: 'transform 0.16s cubic-bezier(0.23,1,0.32,1)',
            }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            aria-label="Save or print this profile"
          >
            <span style={{ fontSize: '18px' }}>🖨️</span>
            Save / Print Profile
          </button>
          {/* Disclaimer */}
          <p style={{
            fontFamily: "'Outfit', sans-serif", fontSize: '11px', lineHeight: '1.6',
            color: isDark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.38)',
            margin: '0 auto', maxWidth: '520px', textAlign: 'center', padding: '0 16px',
          }}>
            <strong style={{ display: 'block', marginBottom: '4px', fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Profile Disclaimer</strong>
            The information presented in this profile is self-reported and has not been independently verified. InSync Profiles makes no representation as to the accuracy, completeness, or currency of any skills, experience, qualifications, credentials, or other claims contained herein. It is the sole responsibility of the recipient or any appointing party to verify all profile content directly with the individual or through their nominated professional references and registrations.
          </p>
          {/* Brand footer */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', paddingTop: '16px', borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)', width: '100%', maxWidth: '520px' }}>
            <img src="/assets/insync-logo-transparent_9e0df532.png" alt="InSync Profiles" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '13px', fontWeight: 800, color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)', margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>InSync Profiles</p>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '11px', color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)', margin: 0 }}>&copy; {new Date().getFullYear()} InSync Profiles. All rights reserved. &nbsp;·&nbsp; ABN 54 116 010 622</p>
            <a href="/privacy" style={{ fontFamily: "'Outfit', sans-serif", fontSize: '11px', color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)', textDecoration: 'underline', marginTop: '2px' }}>Terms of Sale &amp; Refund Policy</a>
          </div>
        </div>
      </div>

      {/* ── Sticky Back to Top button ────────────────────────── */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed', bottom: '24px', right: '20px', zIndex: 200,
            width: '48px', height: '48px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #4a90d9 0%, #f0c040 100%)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(74,144,217,0.45)',
            transform: 'scale(1)', transition: 'transform 0.16s cubic-bezier(0.23,1,0.32,1)',
          }}
          onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.92)')}
          onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          data-no-print="true"
          aria-label="Back to top"
        >
          <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
            <polyline points='18 15 12 9 6 15' />
          </svg>
        </button>
      )}
    </div>
    </>
  );
}
