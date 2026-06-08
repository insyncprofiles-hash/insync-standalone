/**
 * og-image.ts — Dynamic OG card generator for InSync Profiles
 *
 * GET /api/og-image?name=Kira&title=Support+Worker&location=Melbourne...
 *
 * Reads the same URL params as the /view page and returns a PNG image
 * in the Jordan Mitchell card style for use as og:image on Facebook/LinkedIn.
 */
import { Router, Request, Response } from "express";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Font loading ────────────────────────────────────────────
const interFont = fs.readFileSync(path.join(__dirname, "fonts", "Inter.ttf"));
const playfairFont = fs.readFileSync(path.join(__dirname, "fonts", "PlayfairDisplay.ttf"));

// ── Service label map ───────────────────────────────────────
const SERVICE_MAP: Record<string, { emoji: string; label: string }> = {
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

// ── Badge icon map ──────────────────────────────────────────
const BADGE_ICON: Record<string, string> = {
  "NDIS Worker Check": "✅",
  "NDIS Worker Screened": "🛡",
  "First Aid Certified": "⭐",
  "Police Check": "🔍",
  "Working With Children Check": "🧒",
  "Mental Health Support": "🤍",
  "Mental Health First Aid": "🤍",
  "Public Liability Insurance": "📋",
  "Professional Indemnity Insurance": "🔒",
};

// ── Fetch image as base64 data URL ──────────────────────────
function fetchImageAsDataUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    protocol.get(url, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const buf = Buffer.concat(chunks);
        const contentType = res.headers["content-type"] || "image/jpeg";
        resolve(`data:${contentType};base64,${buf.toString("base64")}`);
      });
      res.on("error", reject);
    }).on("error", reject);
  });
}

// ── Extract YouTube video ID ────────────────────────────────
function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

// ── Router ──────────────────────────────────────────────────
const ogRouter = Router();

ogRouter.get("/", async (req: Request, res: Response) => {
  try {
    const q = req.query as Record<string, string>;

    const name = q.name || "Support Worker";
    const title = q.title || "Support Worker";
    const location = q.location || "";
    const tagline = q.tagline || "";
    const photoUrl = q.photo || "";
    const videoUrl = q.video || "";
    const servicesRaw = q.services || "";
    const badgesRaw = q.badges || "";

    const services = servicesRaw
      .split(",")
      .filter(Boolean)
      .slice(0, 5)
      .map((s) => SERVICE_MAP[s.trim()] || { emoji: "✨", label: s.trim() });

    const badges = badgesRaw
      .split("|")
      .filter(Boolean)
      .slice(0, 6);

    // Fetch profile photo
    let photoDataUrl = "";
    if (photoUrl) {
      try {
        photoDataUrl = await fetchImageAsDataUrl(photoUrl);
      } catch {
        photoDataUrl = "";
      }
    }

    // Fetch YouTube thumbnail
    let thumbDataUrl = "";
    if (videoUrl) {
      const ytId = getYouTubeId(videoUrl);
      if (ytId) {
        try {
          thumbDataUrl = await fetchImageAsDataUrl(
            `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
          );
        } catch {
          thumbDataUrl = "";
        }
      }
    }

    // ── Satori JSX-like element tree ────────────────────────
    const svg = await satori(
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            flexDirection: "column",
            width: 900,
            height: 1125,
            fontFamily: "Inter",
            borderRadius: 24,
            overflow: "hidden",
            background: "#fff",
          },
          children: [
            // ── Top black banner ──────────────────────────
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
                      style: { display: "flex", alignItems: "center", gap: 10 },
                      children: [
                        {
                          type: "div",
                          props: {
                            style: {
                              width: 36, height: 36, borderRadius: "50%",
                              border: "2px solid #f5c842",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: "#f5c842", fontSize: 18, fontWeight: 700,
                            },
                            children: "♿",
                          },
                        },
                        {
                          type: "div",
                          props: {
                            style: { display: "flex", flexDirection: "column" },
                            children: [
                              {
                                type: "div",
                                props: {
                                  style: { color: "#f5c842", fontSize: 20, fontWeight: 800, letterSpacing: 1 },
                                  children: "GET TO KNOW ME",
                                },
                              },
                              {
                                type: "div",
                                props: {
                                  style: { color: "#aaa", fontSize: 11, letterSpacing: 2 },
                                  children: "• INTERACTIVE & ACCESSIBLE •",
                                },
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        background: "#f5c842",
                        borderRadius: 99,
                        padding: "10px 22px",
                        color: "#0a0a0a",
                        fontSize: 15,
                        fontWeight: 800,
                        letterSpacing: 0.5,
                      },
                      children: "OPEN PROFILE ▶",
                    },
                  },
                ],
              },
            },

            // ── Pastel gradient body ──────────────────────
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  background: "linear-gradient(135deg, #e8f4ff 0%, #f0e8ff 30%, #fff8e8 60%, #ffe8f0 100%)",
                  padding: "28px 32px 20px",
                  gap: 16,
                },
                children: [
                  // ── Name row ──────────────────────────
                  {
                    type: "div",
                    props: {
                      style: { display: "flex", alignItems: "center", gap: 24 },
                      children: [
                        // Profile photo circle
                        photoDataUrl
                          ? {
                              type: "div",
                              props: {
                                style: {
                                  width: 120, height: 120, borderRadius: "50%",
                                  border: "4px solid #f5c842",
                                  overflow: "hidden", flexShrink: 0,
                                  display: "flex",
                                },
                                children: {
                                  type: "img",
                                  props: {
                                    src: photoDataUrl,
                                    style: { width: 120, height: 120, objectFit: "cover" },
                                  },
                                },
                              },
                            }
                          : {
                              type: "div",
                              props: {
                                style: {
                                  width: 120, height: 120, borderRadius: "50%",
                                  border: "4px solid #f5c842",
                                  background: "#e0e0e0",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  fontSize: 48,
                                },
                                children: "👤",
                              },
                            },
                        // Name + title + location
                        {
                          type: "div",
                          props: {
                            style: { display: "flex", flexDirection: "column", gap: 4 },
                            children: [
                              {
                                type: "div",
                                props: {
                                  style: { fontFamily: "Playfair", fontSize: 42, fontWeight: 700, color: "#1a2a4a", lineHeight: 1.1 },
                                  children: name,
                                },
                              },
                              {
                                type: "div",
                                props: {
                                  style: { fontSize: 14, fontWeight: 700, color: "#2dd4bf", letterSpacing: 3, textTransform: "uppercase" },
                                  children: title,
                                },
                              },
                              location
                                ? {
                                    type: "div",
                                    props: {
                                      style: { fontSize: 14, color: "#555", display: "flex", alignItems: "center", gap: 4, marginTop: 4 },
                                      children: `📍 ${location}`,
                                    },
                                  }
                                : { type: "div", props: { style: { display: "none" }, children: "" } },
                            ],
                          },
                        },
                      ],
                    },
                  },

                  // ── Services row ──────────────────────
                  services.length > 0
                    ? {
                        type: "div",
                        props: {
                          style: { display: "flex", gap: 12, justifyContent: "flex-start", flexWrap: "nowrap" },
                          children: services.map((s) => ({
                            type: "div",
                            props: {
                              style: {
                                display: "flex", flexDirection: "column", alignItems: "center",
                                gap: 6, width: 150,
                              },
                              children: [
                                {
                                  type: "div",
                                  props: {
                                    style: {
                                      width: 56, height: 56, borderRadius: "50%",
                                      background: "rgba(255,255,255,0.8)",
                                      display: "flex", alignItems: "center", justifyContent: "center",
                                      fontSize: 28,
                                    },
                                    children: s.emoji,
                                  },
                                },
                                {
                                  type: "div",
                                  props: {
                                    style: { fontSize: 12, color: "#444", textAlign: "center", fontWeight: 600 },
                                    children: s.label,
                                  },
                                },
                              ],
                            },
                          })),
                        },
                      }
                    : { type: "div", props: { style: { display: "none" }, children: "" } },

                  // ── Video thumbnail ───────────────────
                  thumbDataUrl
                    ? {
                        type: "div",
                        props: {
                          style: {
                            display: "flex",
                            position: "relative",
                            borderRadius: 14,
                            overflow: "hidden",
                            height: 160,
                            border: "3px solid transparent",
                            background: "linear-gradient(90deg,#f5c842,#2dd4bf,#f06,#f5c842) border-box",
                          },
                          children: [
                            {
                              type: "img",
                              props: {
                                src: thumbDataUrl,
                                style: { width: "100%", height: 160, objectFit: "cover" },
                              },
                            },
                            {
                              type: "div",
                              props: {
                                style: {
                                  position: "absolute", inset: 0,
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  background: "rgba(0,0,0,0.25)",
                                },
                                children: {
                                  type: "div",
                                  props: {
                                    style: {
                                      width: 56, height: 56, borderRadius: "50%",
                                      background: "#f5c842",
                                      display: "flex", alignItems: "center", justifyContent: "center",
                                      fontSize: 24, color: "#0a0a0a",
                                    },
                                    children: "▶",
                                  },
                                },
                              },
                            },
                            {
                              type: "div",
                              props: {
                                style: {
                                  position: "absolute", bottom: 10, left: "50%",
                                  transform: "translateX(-50%)",
                                  background: "rgba(0,0,0,0.7)",
                                  borderRadius: 99,
                                  padding: "5px 16px",
                                  color: "#f5c842",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  letterSpacing: 1,
                                },
                                children: "▶ WATCH INTRO",
                              },
                            },
                          ],
                        },
                      }
                    : { type: "div", props: { style: { display: "none" }, children: "" } },

                  // ── Tagline ───────────────────────────
                  tagline
                    ? {
                        type: "div",
                        props: {
                          style: {
                            fontSize: 15, color: "#444", fontStyle: "italic",
                            textAlign: "center", lineHeight: 1.5,
                            padding: "0 16px",
                          },
                          children: `"${tagline.slice(0, 120)}${tagline.length > 120 ? "…" : ""}"`,
                        },
                      }
                    : { type: "div", props: { style: { display: "none" }, children: "" } },

                  // ── Credentials ───────────────────────
                  badges.length > 0
                    ? {
                        type: "div",
                        props: {
                          style: { display: "flex", flexDirection: "column", gap: 8 },
                          children: [
                            {
                              type: "div",
                              props: {
                                style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 4 },
                                children: [
                                  { type: "div", props: { style: { fontSize: 16 }, children: "🏅" } },
                                  {
                                    type: "div",
                                    props: {
                                      style: { fontSize: 13, fontWeight: 800, color: "#1a2a4a", letterSpacing: 1 },
                                      children: "CREDENTIALS & BADGES",
                                    },
                                  },
                                  {
                                    type: "div",
                                    props: {
                                      style: { fontSize: 11, color: "#888", fontStyle: "italic" },
                                      children: "(Self-Reported)",
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              type: "div",
                              props: {
                                style: { display: "flex", flexWrap: "wrap", gap: 8 },
                                children: badges.map((b) => ({
                                  type: "div",
                                  props: {
                                    style: {
                                      display: "flex", alignItems: "center", gap: 8,
                                      background: "rgba(255,255,255,0.85)",
                                      borderRadius: 10, padding: "8px 14px",
                                      fontSize: 12, color: "#333", fontWeight: 600,
                                      width: "calc(50% - 4px)",
                                    },
                                    children: [
                                      { type: "div", props: { style: { fontSize: 16 }, children: BADGE_ICON[b] || "✔" } },
                                      { type: "div", props: { children: b } },
                                    ],
                                  },
                                })),
                              },
                            },
                          ],
                        },
                      }
                    : { type: "div", props: { style: { display: "none" }, children: "" } },

                  // ── Footer branding ───────────────────
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex", alignItems: "center", justifyContent: "center",
                        gap: 8, marginTop: "auto", paddingTop: 8,
                      },
                      children: [
                        { type: "div", props: { style: { fontSize: 16 }, children: "🔗" } },
                        {
                          type: "div",
                          props: {
                            style: { fontSize: 13, color: "#888", fontWeight: 600 },
                            children: "InSync Profiles · insyncprofiles.net",
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        width: 900,
        height: 1125,
        fonts: [
          { name: "Inter", data: interFont, weight: 400, style: "normal" },
          { name: "Inter", data: interFont, weight: 700, style: "normal" },
          { name: "Inter", data: interFont, weight: 800, style: "normal" },
          { name: "Playfair", data: playfairFont, weight: 700, style: "normal" },
        ],
      }
    );

    const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 900 } });
    const png = resvg.render().asPng();

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(png);
  } catch (err) {
    console.error("OG image error:", err);
    res.status(500).send("Failed to generate OG image");
  }
});

export default ogRouter;
