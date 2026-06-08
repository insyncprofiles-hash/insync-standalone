/**
 * Server-side social card generator.
 * Uses satori (JSX → SVG) + @resvg/resvg-js (SVG → PNG).
 * No Cloudflare CPU limits — runs on the Node.js server.
 *
 * Card design matches the reference:
 *   - Full-bleed photo background
 *   - Location badge top-right (gold)
 *   - "Looking for support that understands:" checklist right side
 *   - Large centred play button
 *   - "Tap to watch my 15 second introduction!" callout
 *   - White panel bottom: name (huge bold navy), title (purple), tagline (italic)
 */

import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

// ── Specialty labels — participant-facing language ───────────────────────────
const SPECIALTY_MAP: Record<string, string> = {
  "autism":           "Autism",
  "neurodiversity":   "Neurodiversity",
  "mental-health":    "Mental Health",
  "mental":           "Mental Health",
  "psychosocial":     "Psychosocial Recovery",
  "physical":         "Physical Disability",
  "complex":          "Complex Needs",
  "intellectual":     "Intellectual Disability",
  "acquired-brain":   "Acquired Brain Injury",
  "non-verbal":       "Non-Verbal Communication",
  "school-leaver":    "School Leavers",
  "aged-care":        "Aged Care",
  "dementia":         "Dementia",
  "sensory":          "Sensory Processing",
  "community":        "Community Participation",
  "daily-living":     "Daily Living",
  "personal-care":    "Personal Care",
  "transport":        "Transport",
  "social-skills":    "Social Skills",
  "therapy-assist":   "Therapy Assist",
  "behaviour":        "Behaviour Support",
  "domestic":         "Domestic Assistance",
  "overnight":        "Overnight Support",
  "high-care":        "High Care",
  "emotional":        "Emotional Support",
};

// ── Fetch a URL as a Buffer ──────────────────────────────────────────────────
function fetchBuffer(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.get(url, { timeout: 6000 }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

// ── Convert a URL or data URI to a base64 data URI ──────────────────────────
async function toDataUri(urlOrDataUri: string): Promise<string | null> {
  if (!urlOrDataUri) return null;
  if (urlOrDataUri.startsWith("data:")) return urlOrDataUri;
  try {
    const buf = await fetchBuffer(urlOrDataUri);
    // Detect mime type from URL extension
    const ext = urlOrDataUri.split("?")[0].split(".").pop()?.toLowerCase() || "jpeg";
    const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

// ── Load a font as ArrayBuffer ───────────────────────────────────────────────
async function loadFont(url: string): Promise<ArrayBuffer> {
  const buf = await fetchBuffer(url);
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

// ── Main card generator ──────────────────────────────────────────────────────
export interface CardOptions {
  name: string;
  title: string;
  location: string;
  tagline: string;
  photoUrl: string | null;
  /** Comma-separated specialty keys or labels */
  specialties: string;
}

export async function generateSocialCard(opts: CardOptions): Promise<Buffer> {
  const { name, title, location, tagline, photoUrl, specialties } = opts;

  // Resolve specialty labels
  const specialtyLabels = specialties
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 5)
    .map((s) => SPECIALTY_MAP[s] || s);

  // Fetch photo as data URI (parallel with font loading)
  const [photoDataUri, fontRegular, fontBold, fontBlack] = await Promise.all([
    photoUrl ? toDataUri(photoUrl) : Promise.resolve(null),
    loadFont("https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4TC1C4G-EiAou6Y.woff2"),
    loadFont("https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4TC1C4G-EiAou6Y.woff2"),
    loadFont("https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4TC1C4G-EiAou6Y.woff2"),
  ]);

  const W = 900;
  const H = 900;

  // Build the JSX tree (satori uses React-like JSX objects)
  // We use plain objects since we can't import React here at runtime
  const jsx = {
    type: "div",
    props: {
      style: {
        display: "flex",
        width: W,
        height: H,
        position: "relative",
        background: "#1a1a2e",
        fontFamily: "Outfit",
        overflow: "hidden",
      },
      children: [
        // ── Full-bleed photo background ──────────────────────────────────────
        photoDataUri
          ? {
              type: "img",
              props: {
                src: photoDataUri,
                style: {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: W,
                  height: H,
                  objectFit: "cover",
                  objectPosition: "center top",
                },
              },
            }
          : {
              type: "div",
              props: {
                style: {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: W,
                  height: H,
                  background: "linear-gradient(135deg, #2d1b69 0%, #11998e 100%)",
                },
              },
            },

        // ── Dark gradient overlay — right side ───────────────────────────────
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              width: W,
              height: H,
              background:
                "linear-gradient(to right, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 38%, rgba(0,0,0,0.90) 100%)",
            },
          },
        },

        // ── Bottom fade to white ─────────────────────────────────────────────
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              bottom: 0,
              left: 0,
              width: W,
              height: 280,
              background:
                "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.97) 55%, rgba(255,255,255,0) 100%)",
            },
          },
        },

        // ── Location badge — top right ───────────────────────────────────────
        location
          ? {
              type: "div",
              props: {
                style: {
                  position: "absolute",
                  top: 28,
                  right: 28,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#F5C842",
                  borderRadius: 14,
                  paddingTop: 12,
                  paddingBottom: 12,
                  paddingLeft: 18,
                  paddingRight: 22,
                  maxWidth: 340,
                },
                children: [
                  {
                    type: "div",
                    props: {
                      style: { fontSize: 22, lineHeight: 1, flexShrink: 0 },
                      children: "📍",
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        fontSize: 20,
                        fontWeight: 900,
                        color: "#1a1a2e",
                        lineHeight: 1.2,
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                      },
                      children: location.toUpperCase(),
                    },
                  },
                ],
              },
            }
          : { type: "div", props: { style: { display: "none" } } },

        // ── Right column: checklist ──────────────────────────────────────────
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: 110,
              right: 28,
              width: 370,
              display: "flex",
              flexDirection: "column",
              gap: 0,
            },
            children: [
              // Heading
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 27,
                    fontWeight: 700,
                    color: "#FFFFFF",
                    lineHeight: 1.3,
                    marginBottom: 18,
                    textShadow: "0 1px 6px rgba(0,0,0,0.8)",
                  },
                  children: "Looking for support\nthat understands:",
                },
              },
              // Checklist items
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", gap: 8 },
                  children: specialtyLabels.map((label) => ({
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                      },
                      children: [
                        {
                          type: "div",
                          props: {
                            style: {
                              color: "#F5C842",
                              fontSize: 30,
                              fontWeight: 900,
                              lineHeight: 1.1,
                              flexShrink: 0,
                            },
                            children: "✔",
                          },
                        },
                        {
                          type: "div",
                          props: {
                            style: {
                              fontSize: 28,
                              fontWeight: 700,
                              color: "#FFFFFF",
                              lineHeight: 1.3,
                              textShadow: "0 1px 6px rgba(0,0,0,0.8)",
                            },
                            children: label,
                          },
                        },
                      ],
                    },
                  })),
                },
              },
            ],
          },
        },

        // ── Play button — centred ────────────────────────────────────────────
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              bottom: 248,
              left: 380,
              width: 140,
              height: 140,
              borderRadius: 70,
              background: "rgba(255,255,255,0.92)",
              borderWidth: 6,
              borderStyle: "solid",
              borderColor: "#F5C842",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
            children: {
              type: "div",
              props: {
                style: {
                  color: "#1a1a2e",
                  fontSize: 54,
                  fontWeight: 900,
                  marginLeft: 10,
                  lineHeight: 1,
                },
                children: "▶",
              },
            },
          },
        },

        // ── "Tap to watch" callout ───────────────────────────────────────────
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              bottom: 268,
              right: 40,
              width: 210,
              display: "flex",
              flexDirection: "column",
            },
            children: {
              type: "div",
              props: {
                style: {
                  fontSize: 21,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  fontStyle: "italic",
                  lineHeight: 1.35,
                  textShadow: "0 1px 6px rgba(0,0,0,0.8)",
                },
                children: "← Tap to watch my 15 second introduction!",
              },
            },
          },
        },

        // ── Bottom white panel ───────────────────────────────────────────────
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              bottom: 0,
              left: 0,
              width: W,
              display: "flex",
              flexDirection: "column",
              paddingTop: 18,
              paddingBottom: 28,
              paddingLeft: 36,
              paddingRight: 36,
              gap: 4,
            },
            children: [
              // Name
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 72,
                    fontWeight: 900,
                    color: "#1a1a2e",
                    lineHeight: 1.0,
                    letterSpacing: -1,
                  },
                  children: name.toUpperCase(),
                },
              },
              // Title
              {
                type: "div",
                props: {
                  style: {
                    fontSize: 26,
                    fontWeight: 700,
                    color: "#6B21A8",
                    lineHeight: 1.2,
                    marginTop: 4,
                  },
                  children: title,
                },
              },
              // Tagline
              tagline
                ? {
                    type: "div",
                    props: {
                      style: {
                        fontSize: 22,
                        fontStyle: "italic",
                        color: "#333",
                        lineHeight: 1.4,
                        marginTop: 6,
                        borderBottomWidth: 3,
                        borderBottomStyle: "solid",
                        borderBottomColor: "#6B21A8",
                        paddingBottom: 4,
                        maxWidth: 600,
                      },
                      children: tagline.slice(0, 100),
                    },
                  }
                : { type: "div", props: { style: { display: "none" } } },
            ],
          },
        },
      ],
    },
  };

  // ── Render SVG via satori ────────────────────────────────────────────────
  const svg = await satori(jsx as Parameters<typeof satori>[0], {
    width: W,
    height: H,
    fonts: [
      { name: "Outfit", data: fontRegular, weight: 400, style: "normal" },
      { name: "Outfit", data: fontBold,    weight: 700, style: "normal" },
      { name: "Outfit", data: fontBlack,   weight: 900, style: "normal" },
    ],
  });

  // ── Render PNG via resvg ─────────────────────────────────────────────────
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: W },
  });
  const pngData = resvg.render();
  return Buffer.from(pngData.asPng());
}
