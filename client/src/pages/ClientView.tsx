/* ============================================================
   ClientView.tsx — InSync Profiles
   Read-only client-facing profile page at /view?...
   Matches the mockup: post card + Thread accordions
   No editing — pure display
   ============================================================ */
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useColorTheme } from "@/contexts/ColorThemeContext";
import { getSkinById, ALL_SKINS } from "@/lib/skins";
import {
  ProfileData,
  ServiceItem,
  ExperienceGroup,
} from "./Home";
import { useA11y } from "@/hooks/useA11y";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import VoiceControl from "@/components/VoiceControl";
import AACBoard from "@/components/AACBoard";

// ── Defaults (same as Home.tsx) ───────────────────────────────
const DEFAULT_VIDEO = "/assets/pete_james_intro_with_music_c9095da0.mp4"; // Pete James demo intro video (with music)

const ALLIED_HEALTH_SERVICES: ServiceItem[] = [
  { id: "ot", icon: "🖐", iconImg: "/assets/icons/svc-ot.png", label: "OT", selected: false, description: "Functional assessments, home modifications & daily living" },
  { id: "speech", icon: "🗣", iconImg: "/assets/icons/svc-speech.png", label: "Speech Pathology", selected: false, description: "Communication, AAC, feeding & swallowing" },
  { id: "physio", icon: "💪", iconImg: "/assets/icons/svc-physio.png", label: "Physio", selected: false, description: "Movement, pain management & rehabilitation" },
  { id: "psych", icon: "🧠", iconImg: "/assets/icons/svc-psychology.png", label: "Psychology", selected: false, description: "Mental health assessment, therapy & support" },
  { id: "sw-allied", icon: "🤝", iconImg: "/assets/icons/svc-social-work.png", label: "Social Work", selected: false, description: "Psychosocial support, advocacy & coordination" },
  { id: "dietitian", icon: "🥗", iconImg: "/assets/icons/svc-dietitian.png", label: "Dietitian", selected: false, description: "Nutrition, meal planning & feeding support" },
  { id: "music-therapy", icon: "🎵", iconImg: "/assets/icons/svc-music-therapy.png", label: "Music Therapy", selected: false, description: "Therapeutic music for communication & wellbeing" },
  { id: "art-therapy", icon: "🎨", iconImg: "/assets/icons/svc-art-therapy.png", label: "Art Therapy", selected: false, description: "Creative expression & emotional processing" },
  { id: "exercise-phys", icon: "🏃", iconImg: "/assets/icons/svc-exercise-physiology.png", label: "Exercise Physiology", selected: false, description: "Therapeutic exercise & physical rehabilitation" },
  { id: "behaviour-support", icon: "💡", iconImg: "/assets/icons/svc-behaviour-support-ah.png", label: "Behaviour Support", selected: false, description: "Positive behaviour strategies & PBS plans" },
  { id: "early-intervention", icon: "🌱", iconImg: "/assets/icons/svc-early-intervention.png", label: "Early Intervention", selected: false, description: "Developmental support for children 0–7" },
  { id: "aac-specialist", icon: "📲", iconImg: "/assets/icons/svc-aac-specialist.png", label: "AAC Specialist", selected: false, description: "Augmentative & alternative communication assessment" },
  { id: "telehealth", icon: "💻", iconImg: "/assets/icons/svc-telehealth.png", label: "Telehealth", selected: false, description: "Remote sessions via video call" },
  { id: "home-visits", icon: "🏠", iconImg: "/assets/icons/svc-home-visits.png", label: "Home Visits", selected: false, description: "In-home assessment & therapy delivery" },
  { id: "school-visits", icon: "🏫", iconImg: "/assets/icons/svc-school-visits.png", label: "School Visits", selected: false, description: "Therapy delivered in school settings" },
  { id: "group-therapy", icon: "👥", iconImg: "/assets/icons/svc-group-therapy.png", label: "Group Therapy", selected: false, description: "Therapeutic group programs" },
  { id: "sensory-processing", icon: "✨", iconImg: "/assets/icons/svc-sensory.png", label: "Sensory Processing", selected: false, description: "Sensory integration & regulation strategies" },
  { id: "assistive-tech", icon: "🦾", iconImg: "/assets/icons/svc-assistive-tech.png", label: "Assistive Tech", selected: false, description: "AT assessment, prescription & training" },
  { id: "capacity-building", icon: "📈", iconImg: "/assets/icons/svc-capacity-building.png", label: "Capacity Building", selected: false, description: "Building independence & functional skills" },
  { id: "carer-training", icon: "📚", iconImg: "/assets/icons/svc-carer-training.png", label: "Carer Training", selected: false, description: "Coaching families & carers in therapeutic strategies" },
];

const ALL_AVAILABLE_SERVICES: ServiceItem[] = [
  { id: "personal-care",   icon: "🤲", iconImg: "/assets/icons/svc-personal-care.png",        label: "Personal Care",      selected: false, description: "Personal hygiene & daily routines" },
  { id: "emotional",       icon: "🌿", iconImg: "/assets/icons/svc-emotional.png",    label: "Emotional Support",  selected: false, description: "Mental wellbeing & companionship" },
  { id: "community",       icon: "👥", iconImg: "/assets/icons/svc-community.png",     label: "Community Access",   selected: false, description: "Social outings & participation" },
  { id: "mental",          icon: "🧠", iconImg: "/assets/icons/svc-mental.png",        label: "Mental Health",      selected: false, description: "Mindfulness & emotional regulation" },
  { id: "daily-living",    icon: "📋", iconImg: "/assets/icons/svc-daily-living.png",         label: "Daily Living",       selected: false, description: "Household tasks & goal planning" },
  { id: "transport",       icon: "🚗", iconImg: "/assets/icons/svc-transport.png",            label: "Transport",          selected: false, description: "Driving to appointments & activities" },
  { id: "domestic",        icon: "🧹", iconImg: "/assets/icons/svc-domestic.png",             label: "Domestic",           selected: false, description: "Cleaning, cooking & home tasks" },
  { id: "medication",      icon: "💊", iconImg: "/assets/icons/svc-medication.png",           label: "Medication",         selected: false, description: "Prompting & administering medication" },
  { id: "behaviour",       icon: "💡", iconImg: "/assets/icons/svc-behaviour.png",            label: "Behaviour Support",  selected: false, description: "Positive behaviour strategies" },
  { id: "overnight",       icon: "🌙", iconImg: "/assets/icons/svc-overnight.png",            label: "Overnight",          selected: false, description: "Overnight care & active nights" },
  { id: "meal-prep",       icon: "🍽️", iconImg: "/assets/icons/svc-meal-prep.png",            label: "Meal Prep",          selected: false, description: "Planning & preparing nutritious meals" },
  { id: "social-skills",   icon: "🤝", iconImg: "/assets/icons/svc-social-skills.png",        label: "Social Skills",      selected: false, description: "Building confidence & connections" },
  { id: "employment",      icon: "💼", iconImg: "/assets/icons/svc-employment.png",           label: "Employment",         selected: false, description: "Job readiness & workplace assistance" },
  { id: "therapy-assist",  icon: "🎯", iconImg: "/assets/icons/svc-therapy.png",             label: "Therapy",            selected: false, description: "Supporting OT, physio & speech goals" },
  { id: "aac-comm",        icon: "🗣", iconImg: "/assets/icons/svc-aac.png",                  label: "AAC",                selected: false, description: "Augmentative & alternative communication" },
  { id: "auslan",          icon: "🤟", iconImg: "/assets/icons/svc-auslan.png",               label: "Auslan",             selected: false, description: "Auslan-fluent support" },
  { id: "respite",         icon: "🏠", iconImg: "/assets/icons/svc-respite.png",      label: "In-Home Respite",    selected: false, description: "Carer relief & family support" },
  { id: "school-leaver",   icon: "🎓", iconImg: "/assets/icons/svc-school-leaver.png",        label: "School Leaver",      selected: false, description: "SLES & transition to adulthood" },
  { id: "plan-management", icon: "📊", iconImg: "/assets/icons/svc-plan-management.png",      label: "Plan Management",    selected: false, description: "Helping navigate NDIS plans" },
  { id: "exercise",        icon: "🏋", iconImg: "/assets/icons/svc-exercise.png",             label: "Exercise",           selected: false, description: "Active lifestyle & physical health" },
  { id: "creative",        icon: "🎨", iconImg: "/assets/icons/svc-creative.png",        label: "Creative Arts",      selected: false, description: "Art, music & expressive therapies" },
  { id: "household-tasks", icon: "🧹", iconImg: "/assets/icons/svc-household-tasks.png",      label: "Household Tasks",    selected: false, description: "Home organisation & household management" },
  { id: "life-skills",     icon: "📈", iconImg: "/assets/icons/svc-life-skills.png",          label: "Life Skills",        selected: false, description: "Building independence & everyday skills" },
  { id: "supported-employment", icon: "🏢", iconImg: "/assets/icons/svc-supported-employment.png", label: "Supported Employment", selected: false, description: "Workplace support & job coaching" },
];

const DEFAULT_EXPERIENCE_GROUPS: ExperienceGroup[] = [
  { id: "physical", title: "Physical Disability", icon: "🧑", items: [
    { id: "spinal", label: "Spinal Cord Injury", checked: false },
    { id: "cerebral", label: "Cerebral Palsy", checked: false },
    { id: "ms", label: "Multiple Sclerosis (MS)", checked: false },
    { id: "muscular", label: "Muscular Dystrophy", checked: false },
    { id: "acquired-brain", label: "Acquired Brain Injury (ABI)", checked: false },
    { id: "stroke", label: "Stroke Recovery", checked: false },
    { id: "amputation", label: "Limb Difference / Amputation", checked: false },
    { id: "chronic-pain", label: "Chronic Pain Conditions", checked: false },
  ]},
  { id: "cognitive", title: "Cognitive & Intellectual", icon: "🧠", items: [
    { id: "intellectual", label: "Intellectual Disability", checked: false },
    { id: "down-syndrome", label: "Down Syndrome", checked: false },
    { id: "dementia", label: "Dementia / Alzheimer's", checked: false },
    { id: "adhd", label: "ADHD", checked: false },
    { id: "learning", label: "Learning Disabilities", checked: false },
    { id: "prader-willi", label: "Prader-Willi Syndrome", checked: false },
  ]},
  { id: "autism", title: "Autism & Sensory", icon: "🌈", items: [
    { id: "asd", label: "Autism Spectrum Disorder (ASD)", checked: false },
    { id: "sensory", label: "Sensory Processing Disorder", checked: false },
    { id: "non-verbal", label: "Non-verbal / AAC Users", checked: false },
    { id: "pda", label: "Pathological Demand Avoidance (PDA)", checked: false },
  ]},
  { id: "mental-health", title: "Mental Health", icon: "🧠", items: [
    { id: "anxiety", label: "Anxiety Disorders", checked: false },
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
  { id: "professional-skills", title: "Specialised Skills", icon: "🛠", items: [
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
  "First Aid Certified":   "__RED_CROSS__",
  "Mental Health Support": "🤍",
  "Working With Children Check": "🧒",
  "Police Check":          "🔍",
  "NDIS Worker Check":     "✅",
  "5+ Years Experience":   "👥",
  "Mental Health First Aid": "🤍",
  "Public Liability Insurance": "📋",
  "Professional Indemnity Insurance": "🔒",
  "Auslan Interpreter": "🤟",
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
          const storedRole = storedParams.get("roleType") || "support-worker";
          const storedCatalogue = storedRole === "allied-health" ? ALLIED_HEALTH_SERVICES : ALL_AVAILABLE_SERVICES;
          overrides.services = storedCatalogue.map(s => ({ ...s, selected: ids.includes(s.id) }));
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
        if (storedParams.get("dayHours")) {
          const dh: { [day: string]: { from: string; to: string } } = {};
          storedParams.get("dayHours")!.split(",").forEach(part => {
            const colonIdx = part.indexOf(":");
            if (colonIdx === -1) return;
            const day = part.slice(0, colonIdx);
            const range = part.slice(colonIdx + 1);
            const dashIdx = range.lastIndexOf("-");
            if (dashIdx === -1) return;
            const from = range.slice(0, dashIdx).replace(/([0-9])([AP]M)/, "$1 $2");
            const to = range.slice(dashIdx + 1).replace(/([0-9])([AP]M)/, "$1 $2");
            dh[day] = { from, to };
          });
          overrides.dayHours = dh;
        }
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
        if (storedParams.get("customExp")) overrides.customExperience = storedParams.get("customExp")!;
        const rRaw = storedParams.get("roleType");
        if (rRaw && ["support-worker","allied-health","coordinator","other"].includes(rRaw)) {
          overrides.roleType = rRaw as ProfileData["roleType"];
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
    const roleForServices = params.get("roleType") || "support-worker";
    const serviceCatalogue = roleForServices === "allied-health" ? ALLIED_HEALTH_SERVICES : ALL_AVAILABLE_SERVICES;
    overrides.services = serviceCatalogue.map(s => ({ ...s, selected: ids.includes(s.id) }));
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
  if (params.get("dayHours")) {
    const dh: { [day: string]: { from: string; to: string } } = {};
    params.get("dayHours")!.split(",").forEach(part => {
      const colonIdx = part.indexOf(":");
      if (colonIdx === -1) return;
      const day = part.slice(0, colonIdx);
      const range = part.slice(colonIdx + 1);
      const dashIdx = range.lastIndexOf("-");
      if (dashIdx === -1) return;
      const from = range.slice(0, dashIdx).replace(/([0-9])([AP]M)/, "$1 $2");
      const to = range.slice(dashIdx + 1).replace(/([0-9])([AP]M)/, "$1 $2");
      dh[day] = { from, to };
    });
    overrides.dayHours = dh;
  }
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
  if (params.get("customExp")) overrides.customExperience = params.get("customExp")!;
  if (params.get("resources")) {
    try {
      overrides.resources = params.get("resources")!.split("~").map((part, i) => {
        const [t, u, d] = part.split("|");
        return { id: `res-${i}`, title: decodeURIComponent(t || ""), url: decodeURIComponent(u || ""), description: d ? decodeURIComponent(d) : undefined };
      }).filter((r: { title: string; url: string }) => r.title && r.url);
    } catch {}
  }
  const roleRaw = params.get("roleType");
  if (roleRaw && ["support-worker","allied-health","coordinator","other"].includes(roleRaw)) {
    overrides.roleType = roleRaw as ProfileData["roleType"];
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
  id?: string;
}
function ThreadSection({ num, icon, title, subtitle, children, id }: ThreadSectionProps) {
  const color = THREAD_COLORS[(num - 1) % THREAD_COLORS.length];
  const [open, setOpen] = React.useState(true);
  return (
    <div id={id} style={{
      background: "#ffffff",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
      borderLeft: `4px solid ${color}`,
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: "14px",
          padding: "16px 18px 16px 16px",
          background: "none", border: "none", cursor: "pointer", textAlign: "left",
        }}
        aria-expanded={open}
      >
        {/* Large icon circle */}
        <div style={{
          width: "60px", height: "60px", borderRadius: "50%", flexShrink: 0,
          background: `${color}18`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.625em",
        }}>{icon}</div>
        {/* Text block */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.8125em", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color, margin: "0 0 2px" }}>
            Thread {num}
          </p>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.625em", fontWeight: 700, color: "#1a2e4a", margin: "0 0 4px", lineHeight: 1.1 }}>{title}</h3>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.875em", color: "#4a5a7a", margin: 0, lineHeight: 1.3 }}>{subtitle}</p>
        </div>
        {/* Chevron — distinct circle button */}
        <div style={{
          flexShrink: 0,
          width: "36px", height: "36px", borderRadius: "50%",
          background: `${color}18`,
          border: `2px solid ${color}60`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.25s, background 0.2s",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>
      {open && (
        <div style={{ padding: "0 18px 20px 18px", borderTop: `1px solid ${color}18` }}>
          {children}
        </div>
      )}
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
// ── Translate Button ────────────────────────────────────────────────────────

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
    roleType: "support-worker",
    name: "Pete James",
    title: "Support Worker",
    tagline: "Real support delivered, every time.",
    bio: "I actively research, source, and advocate for accessible and inclusive activities — because the right experience changes everything. Whether it's finding a surf lesson with adaptive equipment, a sensory-friendly event, or a local trail that actually works, I make it happen. Support that matters starts with showing up and doing the work.",
    location: "Central Coast, NSW",
    phone: "",
    email: "pete.james@example.com.au",
    website: "insyncprofiles.net",
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
    dayHours: {},
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
    yearsExperience: "",
    customExperience: "",
    resources: [],
    ...urlOverrides,
  };

  const selectedServices = profile.services.filter(s => s.selected);
  const isGradient = ["sky-gold","ocean-amber","rainbow-prism","cobalt-gold"].includes(theme.id);
  const isDark = ["aurora","midnight","forest"].includes(theme.id);

  // Apply skin background if active, otherwise use theme-aware gradient
  const THEME_BG_GRADIENTS: Record<string, string> = {
    "sky-gold":       "linear-gradient(145deg, #c8e6fa 0%, #e8f4fd 25%, #fdfcf8 55%, #fef9e7 80%, #fef3c7 100%)",
    "ocean-amber":    "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"200\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.85\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3CfeColorMatrix type=\"saturate\" values=\"0\"/%3E%3CfeBlend in=\"SourceGraphic\" mode=\"multiply\"/%3E%3C/filter%3E%3Crect width=\"200\" height=\"200\" filter=\"url(%23n)\" opacity=\"0.06\"/%3E%3C/svg%3E') #fef9c0",
    "rainbow-prism":  "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"200\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.85\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3CfeColorMatrix type=\"saturate\" values=\"0\"/%3E%3CfeBlend in=\"SourceGraphic\" mode=\"multiply\"/%3E%3C/filter%3E%3Crect width=\"200\" height=\"200\" filter=\"url(%23n)\" opacity=\"0.06\"/%3E%3C/svg%3E') #fef9c0",
    "cobalt-gold":    "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"200\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.85\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3CfeColorMatrix type=\"saturate\" values=\"0\"/%3E%3CfeBlend in=\"SourceGraphic\" mode=\"multiply\"/%3E%3C/filter%3E%3Crect width=\"200\" height=\"200\" filter=\"url(%23n)\" opacity=\"0.06\"/%3E%3C/svg%3E') #fef9c0",
    "daylight":       "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"200\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.85\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3CfeColorMatrix type=\"saturate\" values=\"0\"/%3E%3CfeBlend in=\"SourceGraphic\" mode=\"multiply\"/%3E%3C/filter%3E%3Crect width=\"200\" height=\"200\" filter=\"url(%23n)\" opacity=\"0.06\"/%3E%3C/svg%3E') #fef9c0",
    "sage-linen":     "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"200\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.85\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3CfeColorMatrix type=\"saturate\" values=\"0\"/%3E%3CfeBlend in=\"SourceGraphic\" mode=\"multiply\"/%3E%3C/filter%3E%3Crect width=\"200\" height=\"200\" filter=\"url(%23n)\" opacity=\"0.06\"/%3E%3C/svg%3E') #fef9c0",
    "blush-cream":    "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"200\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.85\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3CfeColorMatrix type=\"saturate\" values=\"0\"/%3E%3CfeBlend in=\"SourceGraphic\" mode=\"multiply\"/%3E%3C/filter%3E%3Crect width=\"200\" height=\"200\" filter=\"url(%23n)\" opacity=\"0.06\"/%3E%3C/svg%3E') #fef9c0",
    "slate-mint":     "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"200\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.85\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3CfeColorMatrix type=\"saturate\" values=\"0\"/%3E%3CfeBlend in=\"SourceGraphic\" mode=\"multiply\"/%3E%3C/filter%3E%3Crect width=\"200\" height=\"200\" filter=\"url(%23n)\" opacity=\"0.06\"/%3E%3C/svg%3E') #fef9c0",
  };
  const bgStyle: React.CSSProperties = {
    background: activeSkin
      ? activeSkin.palette.bg
      : (THEME_BG_GRADIENTS[theme.id] || "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"200\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.85\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3CfeColorMatrix type=\"saturate\" values=\"0\"/%3E%3CfeBlend in=\"SourceGraphic\" mode=\"multiply\"/%3E%3C/filter%3E%3Crect width=\"200\" height=\"200\" filter=\"url(%23n)\" opacity=\"0.06\"/%3E%3C/svg%3E') #fef9c0"),
  };

  const handleCTA = () => {
    const name = profile.name || (profile.roleType === "allied-health" ? "this practitioner" : profile.roleType === "coordinator" ? "this coordinator" : "this support worker");
    const roleLabel = profile.roleType === "allied-health" ? "allied health practitioner" : profile.roleType === "coordinator" ? "support coordinator" : "support worker";
    if (profile.email) {
      const subject = encodeURIComponent(profile.roleType === "allied-health" ? `Referral enquiry — ${name}` : `Support enquiry — ${name}`);
      window.location.href = `mailto:${profile.email}?subject=${subject}`;
    } else {
      alert(`No contact details have been added to this profile yet. Please ask the ${roleLabel} to add their email in their profile settings.`);
    }
  };

  const checkedExperience = profile.experienceGroups
    .flatMap(g => g.items.filter(i => i.checked).map(i => ({ group: g.title, label: i.label })));
  const hasExperience = checkedExperience.length > 0 || !!profile.customExperience;

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

  function getYouTubeId(url: string): string | null {
    try {
      const u = new URL(url);
      if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('?')[0] || null;
      if (u.hostname.includes('youtube.com')) {
        const v = u.searchParams.get('v');
        if (v) return v;
        const parts = u.pathname.split('/');
        const shortIdx = parts.indexOf('shorts');
        if (shortIdx !== -1 && parts[shortIdx + 1]) return parts[shortIdx + 1];
        const embedIdx = parts.indexOf('embed');
        if (embedIdx !== -1 && parts[embedIdx + 1]) return parts[embedIdx + 1];
      }
    } catch {}
    return null;
  }

  function isIframeUrl(url: string): boolean {
    return isYouTubeUrl(url) || url.includes('drive.google.com') || url.includes('dropbox.com');
  }

  function toEmbedUrlFull(url: string): string {
    // Google Drive: normalise to /preview
    if (url.includes('drive.google.com')) {
      try {
        const u = new URL(url);
        const match = u.pathname.match(/\/file\/d\/([^/]+)/);
        if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
      } catch {}
      return url;
    }
    return toEmbedUrl(url);
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
  const [showAACBoard, setShowAACBoard] = useState(false);
  const videoPlayRef = useRef<(() => void) | null>(null);
  const [videoPlaying, setVideoPlaying] = React.useState(false);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  // Wire videoPlayRef at component level — handles both YouTube and mp4
  React.useEffect(() => {
    videoPlayRef.current = () => {
      // If there's a native video element (mp4), play it directly
      if (videoElementRef.current) {
        videoElementRef.current.play().catch(() => {});
      } else {
        // YouTube path — set playing state to swap thumbnail for iframe
        setVideoPlaying(true);
      }
    };
  }, []);
  // Voice control — toggle fn exposed from VoiceControl via onToggleReady
  const [voiceActive, setVoiceActive] = useState(false);
  const voiceToggleFnRef = useRef<(() => void) | null>(null);
  const [hasShownVoiceTip, setHasShownVoiceTip] = useState(false);
  const [showVoiceTip, setShowVoiceTip] = useState(false);
  const voiceTipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleVoiceToggle = useCallback(() => {
    // Always toggle immediately — tooltip is informational only, not a gate
    if (voiceTipTimerRef.current) clearTimeout(voiceTipTimerRef.current);
    setShowVoiceTip(false);
    voiceToggleFnRef.current?.();
    const nowActive = !voiceActive;
    setVoiceActive(nowActive);
    // Show tip on first activation only, auto-dismiss after 4s
    if (!hasShownVoiceTip && nowActive) {
      setShowVoiceTip(true);
      setHasShownVoiceTip(true);
      voiceTipTimerRef.current = setTimeout(() => setShowVoiceTip(false), 4000);
    }
  }, [hasShownVoiceTip, voiceActive]);
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
    const synth = window.speechSynthesis;
    if (!synth) return;

    // If already reading, stop completely (pause is unreliable on Android)
    if (ttsStatus === "reading" || ttsStatus === "paused") {
      synth.cancel();
      setTtsStatus("idle");
      return;
    }

    // Collect text from main content only
    const mainEl = document.getElementById('main-content');
    const rawText = mainEl ? mainEl.innerText : document.body.innerText;
    const text = rawText.replace(/\s+/g, ' ').trim().slice(0, 4000);
    if (!text) return;

    // Mark reading immediately so button updates right away
    setTtsStatus("reading");

    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.lang = 'en-AU';

      // Pick an English voice if available
      const voices = synth.getVoices();
      const voice = voices.find(v => v.lang.startsWith('en-AU'))
        || voices.find(v => v.lang.startsWith('en'))
        || null;
      if (voice) utterance.voice = voice;

      utterance.onend = () => setTtsStatus("idle");
      utterance.onerror = (e: any) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') setTtsStatus("idle");
      };

      // Android Chrome keepAlive: re-trigger every 10s to prevent stalling
      let keepAlive: ReturnType<typeof setInterval> | null = setInterval(() => {
        if (!synth.speaking) { if (keepAlive) clearInterval(keepAlive); return; }
        if (!synth.paused) { synth.pause(); synth.resume(); }
      }, 10000);
      const cleanup = () => { if (keepAlive) { clearInterval(keepAlive); keepAlive = null; } };
      utterance.onend = () => { cleanup(); setTtsStatus("idle"); };
      utterance.onerror = (e: any) => {
        cleanup();
        if (e.error !== 'interrupted' && e.error !== 'canceled') setTtsStatus("idle");
      };

      synth.speak(utterance);
    };

    // Android Chrome: voices may not be ready on first call
    const voices = synth.getVoices();
    if (voices.length > 0) {
      speak();
    } else {
      const handler = () => { synth.removeEventListener('voiceschanged', handler); speak(); };
      synth.addEventListener('voiceschanged', handler);
      // Safety fallback — try after 600ms regardless
      setTimeout(() => { synth.removeEventListener('voiceschanged', handler); speak(); }, 600);
    }
  }, [ttsStatus]);

  return (
    <>
    <AccessibilityToolbar
      workerEmail={profile.email || undefined}
      workerName={profile.name || undefined}
      voiceActive={voiceActive}
      onVoiceToggle={() => {
        // Delegate to VoiceControl's internal toggle
        voiceToggleFnRef.current?.();
        // Optimistically flip the visual state (VoiceControl will confirm)
        setVoiceActive(v => !v);
      }}
    />
    {/* High-contrast filter applied as a pointer-events-none overlay so it never traps position:fixed children */}
    {a11yStyle.filter && (
      <div style={{
        position: "fixed", inset: 0, zIndex: 9990,
        filter: a11yStyle.filter,
        pointerEvents: "none",
        background: "transparent",
      }} aria-hidden="true" />
    )}
    <div style={{
      ...bgStyle,
      minHeight: "100vh",
      fontFamily: activeSkin ? `'${activeSkin.fonts.body}', sans-serif` : (a11yStyle.fontFamily || "'Outfit', sans-serif"),
      paddingTop: "110px",
      fontSize: `calc(${fontScale}rem * ${a11yStyle.fontSize ? parseFloat(a11yStyle.fontSize as string) / 100 : 1})`,
    }}>
      <main id="main-content" aria-label={profile.roleType === "allied-health" ? "Allied health practitioner profile" : profile.roleType === "coordinator" ? "Support coordinator profile" : "Support worker profile"}>
      {/* Read Aloud + Accessibility + Voice Control are now in the black GET TO KNOW ME banner above */}
      {/* Shimmer overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 60% 40% at 30% 20%, rgba(255,255,255,0.18) 0%, transparent 70%)",
        animation: "shimmerDrift 8s ease-in-out infinite",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "680px", margin: "0 auto", padding: "24px clamp(0px, 2vw, 16px) 60px" }}>

        {/* ── Post Card — theme-aware gradient card ─── */}
        <div style={{
          background: P.bg,
          borderRadius: "24px",
          boxShadow: `0 8px 48px ${P.accentAlt}22, 0 2px 12px ${P.accent}18`,
          border: `1.5px solid ${P.ringBorder}55`,
          overflow: "hidden",
          marginBottom: "0",
        }}>
          {/* ── GET TO KNOW ME — top CTA banner ── */}
          <div style={{
            background: "#0a0a0a",
            padding: "12px 16px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: "10px",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Shimmer sweep */}
            <style>{`
              @keyframes shimmerSweep {
                0% { transform: translateX(-100%) skewX(-15deg); }
                100% { transform: translateX(350%) skewX(-15deg); }
              }
              @media (prefers-reduced-motion: no-preference) {
                .insync-shimmer { animation: shimmerSweep 2.4s ease-in-out infinite; }
              }
            `}</style>
            <div className="insync-shimmer" style={{
              position: "absolute", top: 0, left: 0,
              width: "40%", height: "100%",
              background: "linear-gradient(90deg, transparent 0%, rgba(240,192,64,0.35) 50%, transparent 100%)",
              pointerEvents: "none",
            }} />
            {/* Left: icon + text — all on one row, no wrapping */}
            <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
              <img src="/assets/accessibility-icon-gold.svg" alt="Accessible" style={{ width: "34px", height: "34px", flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.0em", fontWeight: 900, color: "#F0C040", margin: 0, letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>GET TO KNOW ME</p>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.625em", fontWeight: 800, color: "#F0C040", margin: "2px 0 0", letterSpacing: "0.10em", textTransform: "uppercase", textShadow: "0 0 8px rgba(240,192,64,0.7)", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ display: "inline-block", width: "5px", height: "5px", borderRadius: "50%", background: "#F0C040", boxShadow: "0 0 5px #F0C040", flexShrink: 0 }} />
                  Interactive &amp; Accessible
                  <span style={{ display: "inline-block", width: "5px", height: "5px", borderRadius: "50%", background: "#F0C040", boxShadow: "0 0 5px #F0C040", flexShrink: 0 }} />
                </p>
              </div>
            </div>

            {/* Right: Read Aloud + Accessibility + Voice Control buttons */}
            <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>

              {/* Shared button style — all 3 buttons identical size */}
              {/* Read Aloud */}
              <button
                onClick={handleReadAloud}
                aria-label={ttsStatus === "reading" ? "Pause reading aloud" : ttsStatus === "paused" ? "Resume reading aloud" : "Read this page aloud"}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px",
                  background: ttsStatus === "reading" ? "#e53935" : ttsStatus === "paused" ? "#f57c00" : "#6200ea",
                  border: "2px solid #F0C040",
                  borderRadius: "12px",
                  padding: "0",
                  cursor: "pointer",
                  width: "58px", height: "58px",
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: "22px", lineHeight: 1 }} aria-hidden="true">
                  {ttsStatus === "reading" ? "⏸" : ttsStatus === "paused" ? "▶" : "🔊"}
                </span>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "9px", fontWeight: 800, color: "#ffffff", letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                  {ttsStatus === "reading" ? "PAUSE" : ttsStatus === "paused" ? "RESUME" : "READ"}
                </span>
              </button>

              {/* Stop reading — only when active */}
              {ttsStatus !== "idle" && (
                <button
                  onClick={stopReading}
                  aria-label="Stop reading aloud"
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px",
                    background: "#b71c1c",
                    border: "2px solid #F0C040",
                    borderRadius: "12px",
                    padding: "0",
                    cursor: "pointer",
                    width: "58px", height: "58px",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: "22px", lineHeight: 1 }} aria-hidden="true">⏹</span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "9px", fontWeight: 800, color: "#ffffff", letterSpacing: "0.04em", textTransform: "uppercase" }}>STOP</span>
                </button>
              )}

              {/* Accessibility settings */}
              <button
                onClick={() => {
                  document.dispatchEvent(new CustomEvent("insync:open-a11y-panel"));
                }}
                aria-label="Accessibility options"
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px",
                  background: "transparent",
                  border: "2px solid #F0C040",
                  borderRadius: "12px",
                  padding: "0",
                  cursor: "pointer",
                  width: "58px", height: "58px",
                  flexShrink: 0,
                }}
              >
                <img src="/assets/accessibility-icon-gold-circle.png" alt="" aria-hidden="true" style={{ width: "34px", height: "34px", objectFit: "contain" }} />
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "9px", fontWeight: 800, color: "#F0C040", letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap" }}>ACCESS</span>
              </button>

              {/* Voice Control */}
              <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                {/* First-tap onboarding tooltip */}
                {showVoiceTip && (
                  <div style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    right: 0,
                    width: "220px",
                    background: "rgba(13,27,42,0.97)",
                    border: "2px solid #F0C040",
                    borderRadius: "14px",
                    padding: "14px 16px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
                    zIndex: 10000,
                    fontFamily: "'Outfit', sans-serif",
                  }}>
                    <p style={{ color: "#F0C040", fontSize: "12px", fontWeight: 800, margin: "0 0 10px", letterSpacing: "0.05em", textTransform: "uppercase" }}>Try saying...</p>
                    {[
                      { cmd: '"services"', desc: "jump to Services" },
                      { cmd: '"play video"', desc: "start the intro video" },
                      { cmd: '"read page"', desc: "read the profile aloud" },
                      { cmd: '"help"', desc: "see all commands" },
                    ].map(({ cmd, desc }) => (
                      <div key={cmd} style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "7px" }}>
                        <span style={{ color: "#ffffff", fontSize: "14px", fontWeight: 800, whiteSpace: "nowrap" }}>{cmd}</span>
                        <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px" }}>{desc}</span>
                      </div>
                    ))}
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", margin: "10px 0 0", fontStyle: "italic" }}>Starting in a moment...</p>
                  </div>
                )}
                <button
                  onClick={handleVoiceToggle}
                  aria-label={voiceActive ? "Turn off voice control" : "Turn on voice control"}
                  aria-pressed={voiceActive}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px",
                    background: voiceActive ? "#1565C0" : "#b71c1c",
                    border: `2px solid ${voiceActive ? "#90CAF9" : "#ef9a9a"}`,
                    borderRadius: "12px",
                    padding: "0",
                    cursor: "pointer",
                    width: "58px", height: "58px",
                    flexShrink: 0,
                    animation: voiceActive ? "vc-pulse-a11y 1.5s ease-in-out infinite" : "none",
                  }}
                >
                  <span style={{ fontSize: "20px", lineHeight: 1 }} aria-hidden="true">{voiceActive ? "⏹" : "🎤"}</span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "9px", fontWeight: 800, color: "#ffffff", letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                    {voiceActive ? "LISTENING" : "VOICE"}
                  </span>
                </button>
                {/* Persistent hint for low vision */}
                {!voiceActive && (
                  <span style={{
                    fontSize: "10px",
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    color: "#ffffff",
                    background: "#1565C0",
                    border: "1.5px solid #90CAF9",
                    borderRadius: "6px",
                    padding: "3px 7px",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                    lineHeight: 1.4,
                  }}>Say “help”</span>
                )}
              </div>

            </div>

          </div>

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
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.875em", fontWeight: 700, color: P.text, margin: "0 0 6px", lineHeight: 1.05 }}>
                {profile.name}
              </h1>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.875em", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: P.accent === "#4a90d9" ? "#1a5fa8" : P.accent, margin: "0 0 10px" }}>
                {profile.title}
              </p>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.0em", color: P.text, margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#e74c3c" aria-hidden="true">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {profile.location}
              </p>
            </div>
          </div>

          {/* Service circles — pastel circle + label, matching reference image */}
          {selectedServices.length > 0 && (
            <div style={{ padding: "8px 10px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-around", gap: "6px", flexWrap: "wrap" }}>
                {selectedServices.slice(0, 4).map((svc) => (
                  <div key={svc.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", flex: "1 1 68px", minWidth: "60px", maxWidth: "80px" }}>
                    <img
                      src={svc.iconImg || `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='64' height='64' rx='12' fill='%231a5fa8'/><text x='32' y='44' font-size='28' text-anchor='middle'>${encodeURIComponent(svc.icon)}</text></svg>`}
                      alt={svc.label}
                      style={{ width: "64px", height: "64px", borderRadius: "12px", objectFit: "cover", display: "block" }}
                    />
                    <p style={{
                      fontFamily: "'Outfit', sans-serif", fontSize: "0.7em", fontWeight: 700,
                      color: "#1a5fa8", textAlign: "center",
                      margin: 0, lineHeight: 1.25, maxWidth: "76px",
                    }}>{svc.label}</p>
                  </div>
                ))}
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
              {videoUrl && isIframeUrl(videoUrl) ? (
                (() => {
                  const ytId = isYouTubeUrl(videoUrl) ? getYouTubeId(videoUrl) : null;
                  // Use component-level videoPlaying state (wired to videoPlayRef for VoiceControl)
                  const playing = videoPlaying;
                  const setPlaying = setVideoPlaying;
                  if (ytId && !playing) {
                    return (
                      <div
                        onClick={() => setPlaying(true)}
                        style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: "14px", overflow: "hidden", cursor: "pointer", background: "#000" }}
                        role="button"
                        aria-label={`Play ${profile.name} intro video`}
                      >
                        <img
                          src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`}
                          alt={`${profile.name} intro video thumbnail`}
                          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
                          onError={(e) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`; }}
                        />
                        {/* Dark overlay */}
                        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)" }} />
                        {/* Play button */}
                        <div style={{
                          position: "absolute", top: "50%", left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: "64px", height: "64px", borderRadius: "50%",
                          background: "rgba(240,192,64,0.95)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: "0 4px 24px rgba(0,0,0,0.45), 0 0 0 4px rgba(240,192,64,0.3)",
                        }}>
                          <svg width="26" height="26" viewBox="0 0 24 24" fill="#0a0a0a">
                            <polygon points="8,5 19,12 8,19" />
                          </svg>
                        </div>
                        {/* Label */}
                        <div style={{
                          position: "absolute", bottom: "10px", left: "50%",
                          transform: "translateX(-50%)",
                          background: "rgba(0,0,0,0.65)",
                          borderRadius: "20px", padding: "4px 14px",
                          fontFamily: "'Outfit', sans-serif", fontSize: "0.6875em",
                          fontWeight: 700, color: "#F0C040", letterSpacing: "0.06em",
                          whiteSpace: "nowrap",
                        }}>▶ WATCH INTRO</div>
                      </div>
                    );
                  }
                  return (
                    <iframe
                      src={playing ? toEmbedUrlFull(videoUrl) + "?autoplay=1&loop=0&rel=0" : toEmbedUrlFull(videoUrl) + "?loop=0&rel=0"}
                      title={`${profile.name} intro video`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ width: "100%", aspectRatio: "16/9", display: "block", borderRadius: "14px", border: "none" }}
                    />
                  );
                })()
              ) : videoUrl ? (
                <video
                  ref={videoElementRef}
                  src={videoUrl}
                  controls
                  playsInline
                  style={{ width: "100%", display: "block", borderRadius: "14px", background: "#000" }}
                  aria-label={`${profile.name} intro video`}
                  onEnded={() => document.dispatchEvent(new CustomEvent("insync:video-ended"))}
                  onPause={() => document.dispatchEvent(new CustomEvent("insync:video-paused"))}
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
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.0625em", fontStyle: "italic", fontWeight: 600, color: "rgba(255,255,255,0.92)", margin: 0, lineHeight: 1.5 }}>
                    "I think good support starts with curiosity."
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[
                      "What matters to you?",
                      "What have people assumed you can't do?",
                      "What would make life feel bigger?",
                    ].map(q => (
                      <p key={q} style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.875em", fontWeight: 600, color: "rgba(245,200,66,0.90)", margin: 0, paddingLeft: "14px", borderLeft: "2px solid rgba(245,200,66,0.45)" }}>{q}</p>
                    ))}
                  </div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.0em", fontStyle: "italic", fontWeight: 600, color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.5 }}>
                    "That's where the real work starts."
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tagline — italic serif, matching reference */}
          <div style={{ padding: "4px 24px 18px", textAlign: "center" }}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5em",
              fontStyle: "italic", fontWeight: 600, color: P.text, margin: 0,
              lineHeight: 1.35,
            }}>
              “{profile.tagline}”
            </p>
          </div>

          {/* CTA button — blue-to-gold gradient pill */}
          <div style={{ padding: "0 24px 16px" }}>
            <button
              onClick={handleCTA}
              style={{
                width: "100%", padding: "22px 24px",
                background: P.ctaFrom === "#4a90d9" ? "#1a5fa8" : P.ctaFrom,
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
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "19px", fontWeight: 800, letterSpacing: "0.08em", color: "white", textTransform: "uppercase" }}>
                {profile.ctaText}
              </span>
            </button>
          </div>

          {/* Feedback — secondary CTA */}
          {profile.email && (
            <div style={{ padding: "12px 24px 36px" }}>
              <a
                href={`mailto:${profile.email}?subject=${encodeURIComponent("Feedback")}`}
                style={{
                  width: "100%", padding: "22px 24px",
                  background: P.ctaFrom === "#4a90d9" ? "#1a5fa8" : P.ctaFrom,
                  border: "none",
                  borderRadius: "50px", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
                  textDecoration: "none",
                  boxShadow: `0 4px 20px ${P.ctaFrom}55`,
                  transform: "scale(1)", transition: "transform 0.16s cubic-bezier(0.23,1,0.32,1)",
                }}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
                onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
                aria-label={`Send feedback to ${profile.name}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "19px", fontWeight: 800, letterSpacing: "0.08em", color: "white", textTransform: "uppercase" }}>
                  Feedback
                </span>
              </a>
            </div>
          )}

          {/* Badges — 2-column grid, light border, matching reference */}
          {profile.badges.length > 0 && (
            <div style={{ padding: "0 20px 16px" }}>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.8125em", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: P.accent, margin: "0 0 10px" }}>
                🏅 Professional Credentials{" "}
                <span style={{ fontWeight: 400, opacity: 0.6 }}></span>
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
                    {BADGE_ICONS[badge] === "__RED_CROSS__" ? (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }} aria-hidden="true">
                        <circle cx="10" cy="10" r="10" fill="#e53935"/>
                        <rect x="8.5" y="4" width="3" height="12" rx="1" fill="white"/>
                        <rect x="4" y="8.5" width="12" height="3" rx="1" fill="white"/>
                      </svg>
                    ) : (
                      <span style={{ fontSize: "1.125em", flexShrink: 0 }}>{BADGE_ICONS[badge] || "✦"}</span>
                    )}
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.875em", fontWeight: 700, color: P.text, lineHeight: 1.25 }}>
                      {badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages removed from credentials card — shown in Identity thread instead */}



        </div>




        {/* ── Threads divider label ─────────────────────── */}
        <div style={{ textAlign: 'center', margin: '8px 0 0' }}>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.8125em', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7a8fbb', margin: 0 }}>✦ My Profile Threads ✦</p>
        </div>

        {/* ── Thread connector ─────────────────────────────── */}
        <ThreadConnector />

        {/* ── Thread 1: Identity ───────────────────────────── */}
        <ThreadSection id="thread-identity" num={1} icon="🫆" title="Identity" subtitle="Who I am, what matters to me, and how I work." textColor={P.text} cardBg={P.bg}>
          <div style={{ paddingTop: "16px" }}>
            {profile.bio && (
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.0em", color: P.text, lineHeight: 1.6, margin: "0 0 12px" }}>
                {profile.bio}
              </p>
            )}
            {profile.languages.length > 0 && (
              <div>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.8125em", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: P.accent, margin: "0 0 8px" }}>
                  Languages
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {profile.languages.map(lang => (
                    <span key={lang} style={{
                      fontFamily: "'Outfit', sans-serif", fontSize: "0.875em", fontWeight: 600,
                      padding: "6px 14px", borderRadius: "20px",
                      background: P.badgeBg, border: `1px solid ${P.badgeBorder}`,
                      color: P.text,
                    }}>{lang}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ThreadSection>

        <ThreadConnector />

        {/* ── Thread 2: Services ───────────────────────────── */}
        <ThreadSection id="thread-services" num={2} icon="🤝" title="Services" subtitle="The supports I provide and who I support." textColor={P.text} cardBg={P.bg}>
          <div style={{ paddingTop: "16px" }}>
            {selectedServices.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {selectedServices.map((svc) => (
                  <div key={svc.id} style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                    width: "80px",
                  }}>
                    {svc.iconImg ? (
                      <img src={svc.iconImg} alt={svc.label} style={{ width: "64px", height: "64px", borderRadius: "14px", objectFit: "cover", display: "block" }} />
                    ) : (
                      <div style={{ width: "64px", height: "64px", borderRadius: "14px", background: "#1a5fa8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75em" }}>{svc.icon}</div>
                    )}
                    <span style={{
                      fontFamily: "'Outfit', sans-serif", fontSize: "0.7em", fontWeight: 700,
                      color: P.text, textAlign: "center", lineHeight: 1.25,
                    }}>{svc.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.0em", color: P.textMid, margin: 0 }}>No services listed.</p>
            )}
          </div>
          {/* Vehicle Details — shown when transport is selected */}
          {profile.services.some((s: { id: string; selected: boolean }) => s.selected && s.id === "transport") && (() => {
            const vehicleCats = [
              { key: "vehicleType" as keyof typeof profile.vehicleOptions, label: "Vehicle Type" },
              { key: "wheelchairAccess" as keyof typeof profile.vehicleOptions, label: "Wheelchair Accessibility" },
              { key: "entryHeight" as keyof typeof profile.vehicleOptions, label: "Entry Height & Clearance" },
              { key: "weightCapacity" as keyof typeof profile.vehicleOptions, label: "Weight Capacity" },
            ];
            const hasAnyChecked = vehicleCats.some(({ key }) =>
              (profile.vehicleOptions[key] || []).some((i: { checked: boolean }) => i.checked)
            );
            return (
              <div style={{ marginTop: "16px", padding: "14px", background: "rgba(100,160,255,0.06)", border: "1px solid rgba(100,160,255,0.18)", borderRadius: "14px" }}>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.8125em", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: P.accent, marginBottom: "12px" }}>🚗 Vehicle Details</p>
                {hasAnyChecked ? vehicleCats.map(({ key, label }) => {
                  const checked = (profile.vehicleOptions[key] || []).filter((i: { checked: boolean; label: string }) => i.checked);
                  if (checked.length === 0) return null;
                  return (
                    <div key={key} style={{ marginBottom: "10px" }}>
                      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.8125em", fontWeight: 600, color: P.textMid, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {checked.map((item: { label: string }) => (
                          <span key={item.label} style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.875em", fontWeight: 600, padding: "6px 12px", borderRadius: "20px", background: `${P.accent}18`, border: `1px solid ${P.accent}40`, color: P.text }}>
                            {item.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                }) : (
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.9375em", color: P.textMid, margin: 0 }}>Transport is available — contact me for vehicle details.</p>
                )}
              </div>
            );
          })()}
        </ThreadSection>
        {/* ── Thread connector + Experience ────────────────── */}
        {hasExperience && (
          <>
            <ThreadConnector />
            <ThreadSection id="thread-experience" num={3} icon="📋" title="Experience" subtitle="My background, training, and specialist areas." textColor={P.text} cardBg={P.bg}>
              <div style={{ paddingTop: "16px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {checkedExperience.map(({ label }) => (
                  <span key={label} style={{
                    fontFamily: "'Outfit', sans-serif", fontSize: "0.875em", fontWeight: 600,
                    padding: "6px 14px", borderRadius: "20px",
                    background: "#dbeafe", border: "1.5px solid #93c5fd",
                    color: "#1e3a5f",
                  }}>{label}</span>
                ))}
                {profile.customExperience && (
                  <span style={{
                    fontFamily: "'Outfit', sans-serif", fontSize: "0.875em", fontWeight: 600,
                    padding: "6px 14px", borderRadius: "20px",
                    background: "#fef3c7", border: "1.5px solid #fcd34d",
                    color: "#78350f",
                  }}>{profile.customExperience}</span>
                )}
              </div>
            </ThreadSection>
          </>
        )}


        {/* ── How I Show Up ────────────────────────────────── */}
        {(profile.showUpStyle.communicate.length > 0 || profile.showUpStyle.connect.length > 0 || profile.showUpStyle.presence.length > 0) && (
          <>
            <ThreadConnector />
            <ThreadSection id="thread-approach" num={hasExperience ? 4 : 3} icon="✨" title="How I Show Up" subtitle="My communication style, how I connect, and how I approach support." textColor={P.text} cardBg={P.bg}>
              <div style={{ paddingTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {([
                  { key: "communicate" as const, label: "How I Communicate" },
                  { key: "connect" as const, label: "How I Connect" },
                  { key: "presence" as const, label: "How I Show Up" },
                ] as { key: "communicate" | "connect" | "presence"; label: string }[]).map(group => (
                  profile.showUpStyle[group.key].length > 0 ? (
                    <div key={group.key}>
                      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.8125em", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: P.accent, margin: "0 0 8px" }}>
                        {group.label}
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {profile.showUpStyle[group.key].map(chip => (
                          <span key={chip} style={{
                            fontFamily: "'Outfit', sans-serif", fontSize: "0.875em", fontWeight: 600,
                            padding: "6px 14px", borderRadius: "20px",
                            background: "#f3e8ff", border: "1.5px solid #c4b5fd",
                            color: "#4c1d95",
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
            <ThreadSection id="thread-availability" num={hasExperience ? 5 : 4} icon="📅" title="Availability" subtitle="When I'm available to support you." textColor={P.text} cardBg={P.bg}>
              <div style={{ paddingTop: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {availDays.map(d => {
                    const dh = (profile.dayHours || {})[d];
                    const from = dh?.from || profile.availFrom || "9:00 AM";
                    const to = dh?.to || profile.availTo || "5:00 PM";
                    return (
                      <div key={d} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{
                          fontFamily: "'Outfit', sans-serif", fontSize: "0.9375em", fontWeight: 700,
                          padding: "6px 14px", borderRadius: "20px",
                          background: "#ccfbf1", border: "1.5px solid #5eead4",
                          color: "#134e4a", minWidth: "52px", textAlign: "center", flexShrink: 0,
                        }}>{d}</span>
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.875em", color: P.textMid }}>{from} – {to}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ThreadSection>
          </>
        )}

        {/* ── Contact ──────────────────────────────────────── */}
        {(profile.phone || profile.email || profile.whatsapp || profile.website) && (
          <>
            <ThreadConnector />
            <ThreadSection id="thread-contact" num={hasExperience ? 6 : 5} icon="✉️" title={profile.contactLabel || 'Contact'} subtitle="How to reach me." textColor={P.text} cardBg={P.bg}>
              <div style={{ paddingTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {profile.phone && (
                  <a href={`tel:${profile.phone}`} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                    <span style={{ fontSize: "1.125em" }}>📱</span>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.0em", color: P.accent }}>{profile.phone}</span>
                  </a>
                )}
                {profile.email && (
                  <a href={`mailto:${profile.email}`} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                    <span style={{ fontSize: "1.125em" }}>✉️</span>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.0em", color: P.accent }}>{profile.email}</span>
                  </a>
                )}
                {profile.whatsapp && (
                  <a href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                    <span style={{ fontSize: "1.125em" }}>💬</span>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.0em", color: P.accent }}>WhatsApp</span>
                  </a>
                )}
                {profile.website && (
                  <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                    <span style={{ fontSize: "1.125em" }}>🌐</span>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.0em", color: P.accent, wordBreak: "break-all" }}>
                      {profile.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                    </span>
                  </a>
                )}
              </div>
            </ThreadSection>
          </>
        )}

        {/* ── Resources ───────────────────────────────────────── */}
        {(profile.resources && profile.resources.filter((r: { title: string; url: string }) => r.title && r.url).length > 0) && (
          <>
            <ThreadConnector />
            <ThreadSection id="thread-resources" num={99} icon="📎" title="Resources" subtitle="Guides and information for participants and families." textColor={P.text} cardBg={P.bg}>
              <div style={{ paddingTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {profile.resources.filter((r: { title: string; url: string }) => r.title && r.url).map((res: { id: string; title: string; url: string; description?: string }) => (
                  <a
                    key={res.id}
                    href={res.url.startsWith('http') ? res.url : `https://${res.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 16px', background: P.badgeBg, borderRadius: '12px', border: `1.5px solid ${P.badgeBorder}`, textDecoration: 'none' }}
                  >
                    <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '1px' }}>📄</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '14px', fontWeight: 700, color: P.text, margin: '0 0 2px' }}>{res.title}</p>
                      {res.description && <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '12px', color: P.textDim, margin: 0, lineHeight: 1.4 }}>{res.description}</p>}
                    </div>
                    <span style={{ flexShrink: 0, fontSize: '12px', color: P.accent, fontWeight: 700, alignSelf: 'center' }}>View →</span>
                  </a>
                ))}
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
              background: P.ctaFrom === "#4a90d9" ? "#1a5fa8" : P.ctaFrom,
              border: 'none', cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif", fontSize: '0.875em', fontWeight: 800,
              color: 'white', letterSpacing: '0.06em', textTransform: 'uppercase',
              boxShadow: `0 6px 24px ${P.accent}55`,
              transform: 'scale(1)', transition: 'transform 0.16s cubic-bezier(0.23,1,0.32,1)',
            }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            aria-label="Save or print this profile"
          >
            <span style={{ fontSize: '1.125em' }}>🖨️</span>
            Save / Print Profile
          </button>
          {/* Disclaimer */}
          <p style={{
            fontFamily: "'Outfit', sans-serif", fontSize: '0.6875em', lineHeight: '1.6',
            color: isDark ? 'rgba(255,255,255,0.38)' : 'rgba(0,0,0,0.38)',
            margin: '0 auto', maxWidth: '680px', textAlign: 'center', padding: '0 16px',
          }}>
            <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.6875em', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Profile Disclaimer</strong>
            {"This profile is owned and managed by "}{profile.name || (profile.roleType === "allied-health" ? "this practitioner" : profile.roleType === "coordinator" ? "this coordinator" : "this support worker")}{". It represents their own voice and is not created or controlled by any provider or organisation. The information presented in this profile is self-reported and has not been independently verified by InSync Profiles. It is the responsibility of the "}{profile.roleType === "allied-health" ? "practitioner" : profile.roleType === "coordinator" ? "coordinator" : "support worker"}{" to ensure all credentials, experience, and claims are accurate and supported by evidence upon request."}
          </p>
          {/* Feedback button */}
          {profile.email && (
          <div style={{ padding: '16px 24px 8px', width: '100%', maxWidth: '520px', textAlign: 'center' }}>
            <a
              href={`mailto:${profile.email}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '10px 24px', borderRadius: '99px',
                background: 'transparent',
                border: isDark ? '1.5px solid rgba(255,255,255,0.25)' : '1.5px solid rgba(0,0,0,0.18)',
                textDecoration: 'none', cursor: 'pointer',
                fontFamily: "'Outfit', sans-serif", fontSize: '17px', fontWeight: 700,
                color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.7)',
                letterSpacing: '0.06em', textTransform: 'uppercase',
                transition: 'opacity 0.16s',
              }}
              aria-label={`Send feedback to ${profile.name}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Feedback
            </a>
          </div>
          )}

          {/* Brand footer */}
          <footer role="contentinfo" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', paddingTop: '16px', borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)', width: '100%', maxWidth: '680px' }}>
            <img src="/assets/insync-logo-transparent_9e0df532.png" alt="InSync Profiles" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.8125em', fontWeight: 800, color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)', margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>InSync Profiles</p>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.6875em', color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)', margin: 0 }}>&copy; {new Date().getFullYear()} InSync Profiles. All rights reserved. &nbsp;·&nbsp; ABN 54 116 010 622</p>
            <a href="/privacy" style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.6875em', color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)', textDecoration: 'underline', marginTop: '2px' }}>Terms of Sale &amp; Refund Policy</a>
          </footer>
        </div>
      </div>

      {/* ── Google Translate floating button ─────────────────── */}
      

      </main>

      {/* ── VoiceControl — logic only, button is now inside AccessibilityToolbar ── */}
      <VoiceControl
        onScrollTo={(id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
        onPlayVideo={() => { videoPlayRef.current?.(); }}
        onOpenAAC={() => setShowAACBoard(true)}
        onOpenAccessibility={() => {
          const btn = document.querySelector<HTMLButtonElement>('[aria-label="Accessibility options — text size, contrast, text to speech"]');
          btn?.click();
        }}
        onMessage={() => {
          const email = profile.email || 'support@insyncprofiles.net';
          window.location.href = `mailto:${email}?subject=${encodeURIComponent('Hi, I\'d like to get started')}`;
        }}
        onFeedback={() => {
          if (profile.email) window.location.href = `mailto:${profile.email}`;
        }}
        onReadPage={handleReadAloud}
        onStopReading={() => { window.speechSynthesis?.cancel(); setTtsStatus('idle'); }}
        workerEmail={profile.email || undefined}
        workerName={profile.name || undefined}
        onToggleReady={(fn) => { voiceToggleFnRef.current = fn; }}
      />

      {/* ── AAC Board — opened via VoiceControl or accessibility panel ── */}
      {showAACBoard && (
        <AACBoard profile={profile} onClose={() => setShowAACBoard(false)} />
      )}

      {/* ── Sticky Back to Top button ────────────────────────── */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed', bottom: '24px', right: '20px', zIndex: 200,
            width: '48px', height: '48px', borderRadius: '50%',
            background: '#1a5fa8',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(26,95,168,0.45)',
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
