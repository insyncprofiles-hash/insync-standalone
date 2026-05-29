// ============================================================
//  InSync Profiles Skins
//  Two packs × 3 skins each
//  Each skin defines: id, packId, name, description, palette,
//  fonts, cardStyle, and a SHA-256 unlock hash for the pack.
// ============================================================

export interface SkinPalette {
  bg: string;
  card: string;
  accent: string;
  accentSoft: string;
  text: string;
  textMid: string;
  textDim: string;
  border: string;
  borderGold: string;
  gold: string;
  headerBg: string;
  headerText: string;
  badgeBg: string;
  badgeText: string;
}

export interface SkinFonts {
  heading: string;        // Google Font name for headings
  body: string;           // Google Font name for body
  headingWeight: number;
}

export interface SkinCardStyle {
  borderRadius: string;
  borderWidth: string;
  shadow: string;
}

export interface Skin {
  id: string;
  packId: string;
  name: string;
  tagline: string;
  description: string;
  emoji: string;
  palette: SkinPalette;
  fonts: SkinFonts;
  cardStyle: SkinCardStyle;
}

export interface SkinPack {
  id: string;
  name: string;
  description: string;
  emoji: string;
  price: string;
  unlockCodeHint: string;
  // SHA-256 hash of the pack unlock code (ISP-PACK-AWARE-2025, ISP-PACK-CULTR-2025)
  unlockHash: string;
  skins: Skin[];
}

// ── AWARENESS PACK ────────────────────────────────────────────
// Unlock code: ISP-PACK-AWARE-2025
// SHA-256: run `echo -n "ISP-PACK-AWARE-2025" | sha256sum` to get hash
// Pre-computed: 7f3c2a1b4e8d9f6c0a5b2e7d4f1c8a3e6b9d2f5c0e3a7b4d1f8c5a2e9b6d3f0c
const AWARENESS_HASH = "915643b40d4a90bb1d1532236bfb67f736e575926cea7fc5a29b3aa24054cd8e";

// ── CULTURAL PACK ─────────────────────────────────────────────
// Unlock code: ISP-PACK-CULTR-2025
// SHA-256: pre-computed below
const CULTURAL_HASH = "7d41b5d3a8bda21efe0432d429b14f74d1a19941f388e6819a734a76c10c2865";

export const SKIN_PACKS: SkinPack[] = [
  {
    id: "awareness",
    name: "Awareness Pack",
    description: "Celebrate inclusion and diversity with themes for Autism Acceptance Month, World Down Syndrome Day, and International Day of People with Disability.",
    emoji: "🌈",
    price: "$9.99",
    unlockCodeHint: "ISP-PACK-AWARE-XXXX",
    unlockHash: AWARENESS_HASH,
    skins: [
      {
        id: "autism-acceptance",
        packId: "awareness",
        name: "Autism Acceptance",
        tagline: "Celebrating neurodiversity",
        description: "Warm gold and rainbow-spectrum accents inspired by the infinity symbol of neurodiversity.",
        emoji: "♾️",
        palette: {
          bg: "linear-gradient(135deg, #fdf6e3 0%, #fff8f0 60%, #fef3f8 100%)",
          card: "#ffffff",
          accent: "#e8a020",
          accentSoft: "#fff3d6",
          text: "#2d1a00",
          textMid: "#5a3e10",
          textDim: "#9a7a40",
          border: "rgba(232,160,32,0.18)",
          borderGold: "rgba(232,160,32,0.35)",
          gold: "#e8a020",
          headerBg: "linear-gradient(135deg, #fff8e6 0%, #fef0d0 100%)",
          headerText: "#2d1a00",
          badgeBg: "rgba(232,160,32,0.12)",
          badgeText: "#8a5a00",
        },
        fonts: { heading: "Nunito", body: "Nunito", headingWeight: 800 },
        cardStyle: { borderRadius: "20px", borderWidth: "1.5px", shadow: "0 4px 24px rgba(232,160,32,0.10)" },
      },
      {
        id: "down-syndrome-day",
        packId: "awareness",
        name: "Down Syndrome Day",
        tagline: "Rock your socks — celebrate every chromosome",
        description: "Bold blue and yellow inspired by the World Down Syndrome Day colours and the iconic mismatched socks symbol.",
        emoji: "🧦",
        palette: {
          bg: "linear-gradient(135deg, #f0f6ff 0%, #fff9e6 100%)",
          card: "#ffffff",
          accent: "#1a6fd4",
          accentSoft: "#e6f0ff",
          text: "#0a1a3a",
          textMid: "#1a3a6a",
          textDim: "#5a7aaa",
          border: "rgba(26,111,212,0.15)",
          borderGold: "rgba(230,180,0,0.35)",
          gold: "#e6b400",
          headerBg: "linear-gradient(135deg, #e6f0ff 0%, #fff9e0 100%)",
          headerText: "#0a1a3a",
          badgeBg: "rgba(26,111,212,0.10)",
          badgeText: "#0a3a8a",
        },
        fonts: { heading: "Poppins", body: "Poppins", headingWeight: 700 },
        cardStyle: { borderRadius: "16px", borderWidth: "2px", shadow: "0 4px 20px rgba(26,111,212,0.10)" },
      },
      {
        id: "disability-pride",
        packId: "awareness",
        name: "Disability Pride",
        tagline: "International Day of People with Disability",
        description: "Vibrant purple and teal — bold, proud, and full of life. Inspired by the Disability Pride flag.",
        emoji: "♿",
        palette: {
          bg: "linear-gradient(135deg, #f5f0ff 0%, #f0fffe 100%)",
          card: "#ffffff",
          accent: "#7c3aed",
          accentSoft: "#f0e8ff",
          text: "#1a0a3a",
          textMid: "#3a1a6a",
          textDim: "#7a5aaa",
          border: "rgba(124,58,237,0.15)",
          borderGold: "rgba(20,184,166,0.35)",
          gold: "#14b8a6",
          headerBg: "linear-gradient(135deg, #f0e8ff 0%, #e0fffe 100%)",
          headerText: "#1a0a3a",
          badgeBg: "rgba(124,58,237,0.10)",
          badgeText: "#4a0aaa",
        },
        fonts: { heading: "Space Grotesk", body: "DM Sans", headingWeight: 700 },
        cardStyle: { borderRadius: "18px", borderWidth: "1.5px", shadow: "0 4px 24px rgba(124,58,237,0.10)" },
      },
    ],
  },
  {
    id: "cultural",
    name: "Cultural Pack",
    description: "Celebrate Australia's rich cultural diversity with themes for Harmony Day, NAIDOC Week, and our multicultural community.",
    emoji: "🌏",
    price: "$9.99",
    unlockCodeHint: "SCV-PACK-CULTR-XXXX",
    unlockHash: CULTURAL_HASH,
    skins: [
      {
        id: "harmony-day",
        packId: "cultural",
        name: "Harmony Day",
        tagline: "Everyone belongs",
        description: "Warm orange — the colour of Harmony Day — representing social inclusion, respect, and a sense of belonging.",
        emoji: "🟠",
        palette: {
          bg: "linear-gradient(135deg, #fff5ee 0%, #fff8f0 100%)",
          card: "#ffffff",
          accent: "#e85d04",
          accentSoft: "#fff0e6",
          text: "#2a0e00",
          textMid: "#6a2a00",
          textDim: "#aa6a40",
          border: "rgba(232,93,4,0.15)",
          borderGold: "rgba(232,93,4,0.30)",
          gold: "#e85d04",
          headerBg: "linear-gradient(135deg, #fff0e6 0%, #ffe8d6 100%)",
          headerText: "#2a0e00",
          badgeBg: "rgba(232,93,4,0.10)",
          badgeText: "#8a2a00",
        },
        fonts: { heading: "Lato", body: "Lato", headingWeight: 700 },
        cardStyle: { borderRadius: "14px", borderWidth: "1.5px", shadow: "0 4px 20px rgba(232,93,4,0.08)" },
      },
      {
        id: "naidoc-week",
        packId: "cultural",
        name: "NAIDOC Week",
        tagline: "Honouring Aboriginal and Torres Strait Islander culture",
        description: "Deep ochre and earthy red — inspired by the colours of Country, connection to land, and the strength of First Nations communities.",
        emoji: "🪃",
        palette: {
          bg: "linear-gradient(135deg, #fdf3e7 0%, #fef9f0 100%)",
          card: "#fffdf8",
          accent: "#c2410c",
          accentSoft: "#fef3e6",
          text: "#1c0a00",
          textMid: "#5c2a00",
          textDim: "#9c6a40",
          border: "rgba(194,65,12,0.15)",
          borderGold: "rgba(194,65,12,0.30)",
          gold: "#d97706",
          headerBg: "linear-gradient(135deg, #fef3e6 0%, #fde8cc 100%)",
          headerText: "#1c0a00",
          badgeBg: "rgba(194,65,12,0.10)",
          badgeText: "#7c1a00",
        },
        fonts: { heading: "Merriweather", body: "Open Sans", headingWeight: 700 },
        cardStyle: { borderRadius: "12px", borderWidth: "2px", shadow: "0 4px 20px rgba(194,65,12,0.08)" },
      },
      {
        id: "multicultural",
        packId: "cultural",
        name: "We Are One",
        tagline: "Celebrating our multicultural community",
        description: "A vibrant, celebratory palette drawing from the many flags and cultures that make up Australia's diverse community.",
        emoji: "🌍",
        palette: {
          bg: "linear-gradient(135deg, #f0f9ff 0%, #fdf0ff 100%)",
          card: "#ffffff",
          accent: "#0891b2",
          accentSoft: "#e0f7ff",
          text: "#0a1a2a",
          textMid: "#1a4a6a",
          textDim: "#5a8aaa",
          border: "rgba(8,145,178,0.15)",
          borderGold: "rgba(168,85,247,0.25)",
          gold: "#a855f7",
          headerBg: "linear-gradient(135deg, #e0f7ff 0%, #f5e8ff 100%)",
          headerText: "#0a1a2a",
          badgeBg: "rgba(8,145,178,0.10)",
          badgeText: "#0a3a5a",
        },
        fonts: { heading: "Work Sans", body: "Work Sans", headingWeight: 700 },
        cardStyle: { borderRadius: "16px", borderWidth: "1.5px", shadow: "0 4px 24px rgba(8,145,178,0.10)" },
      },
    ],
  },
];


// Flat list of all skins for easy lookup
export const ALL_SKINS: Skin[] = SKIN_PACKS.flatMap(p => p.skins);

// Get a skin by id
export function getSkinById(id: string): Skin | undefined {
  return ALL_SKINS.find(s => s.id === id);
}

// Verify a pack unlock code against its stored hash
export async function verifyPackCode(code: string, pack: SkinPack): Promise<boolean> {
  const normalised = code.toUpperCase().trim();
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalised));
  const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  return hash === pack.unlockHash;
}

// localStorage keys
export const UNLOCKED_PACKS_KEY = "insync_unlocked_packs";
export const ACTIVE_SKIN_KEY = "insync_active_skin";

export function getUnlockedPacks(): string[] {
  try { return JSON.parse(localStorage.getItem(UNLOCKED_PACKS_KEY) || "[]"); }
  catch { return []; }
}

export function unlockPack(packId: string): void {
  const current = getUnlockedPacks();
  if (!current.includes(packId)) {
    localStorage.setItem(UNLOCKED_PACKS_KEY, JSON.stringify([...current, packId]));
  }
}

export function getActiveSkin(): string {
  return localStorage.getItem(ACTIVE_SKIN_KEY) || "default";
}

export function setActiveSkin(skinId: string): void {
  localStorage.setItem(ACTIVE_SKIN_KEY, skinId);
}
