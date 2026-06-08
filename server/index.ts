import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import wallRouter from "./wall.js";
import ogRouter from "./og-image.js";
import { generateSocialCard } from "./cardGenerator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Security headers via Helmet
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            "https://fonts.googleapis.com",
            "https://www.paypal.com",
          ],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com",
          ],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "blob:", "https:"],
          mediaSrc: ["'self'", "blob:", "https:"],
          connectSrc: [
            "'self'",
            "https:",
            "wss:",
          ],
          frameSrc: ["https://www.paypal.com", "https://www.youtube.com", "https://youtube.com"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginEmbedderPolicy: false,
      hsts: process.env.NODE_ENV === "production"
        ? { maxAge: 31536000, includeSubDomains: true, preload: true }
        : false,
    })
  );

  // Support Deck API routes
  app.use(express.json());
  app.use("/api/deck", wallRouter);
  app.use("/api/og-image", ogRouter);

  // ── Social card generation endpoint ──────────────────────────────────────
  // POST /api/generate-card
  // Body: { name, title, location, tagline, photoUrl, specialties }
  // Returns: { cardDataUrl } — base64 PNG data URL returned directly (no storage)
  app.post("/api/generate-card", async (req, res) => {
    try {
      const { name, title, location, tagline, photoUrl, specialties } = req.body as {
        name?: string;
        title?: string;
        location?: string;
        tagline?: string;
        photoUrl?: string;
        specialties?: string;
      };
      if (!name) {
        res.status(400).json({ error: "name is required" });
        return;
      }
      const pngBuffer = await generateSocialCard({
        name: name || "",
        title: title || "Support Worker",
        location: location || "",
        tagline: tagline || "",
        photoUrl: photoUrl || null,
        specialties: specialties || "",
      });
      const base64 = pngBuffer.toString("base64");
      res.json({ cardDataUrl: `data:image/png;base64,${base64}` });
    } catch (err) {
      console.error("Card generation error:", err);
      res.status(500).json({ error: "Card generation failed", detail: String(err) });
    }
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");
  app.use(express.static(staticPath));

  // Server-side OG meta injection for /view — Facebook scraper doesn't run JS
  app.get("/view", async (req, res) => {
    try {
      const q = req.query as Record<string, string>;
      const name = q.name || "Support Worker";
      const title = q.title || "NDIS Support Worker";
      const location = q.location || "Australia";
      const tagline = q.tagline || "";

      // Build the og-image URL with all profile params forwarded
      const ogParams = new URLSearchParams(req.query as Record<string, string>).toString();
      const ogImageUrl = `https://insyncprofiles.net/api/og-image?${ogParams}`;
      const pageTitle = `${name} — ${title} | InSync Profiles`;
      const pageDesc = tagline
        ? `${tagline.slice(0, 150)} — View ${name}'s full interactive support worker profile.`
        : `View ${name}'s interactive support worker profile. Services, credentials, availability and communication style. ${location}.`;

      const fs2 = await import("fs");
      let html = fs2.default.readFileSync(path.join(staticPath, "index.html"), "utf-8");

      // Replace OG tags with profile-specific values
      html = html
        .replace(
          /<meta property="og:title" content="[^"]*" \/>/,
          `<meta property="og:title" content="${pageTitle.replace(/"/g, "&quot;")}" />`
        )
        .replace(
          /<meta property="og:description" content="[^"]*" \/>/,
          `<meta property="og:description" content="${pageDesc.replace(/"/g, "&quot;")}" />`
        )
        .replace(
          /<meta property="og:url" content="[^"]*" \/>/,
          `<meta property="og:url" content="https://insyncprofiles.net/view?${ogParams}" />`
        )
        .replace(
          /<meta property="og:image" content="[^"]*" \/>/,
          `<meta property="og:image" content="${ogImageUrl}" />`
        )
        .replace(
          /<meta property="og:image:width" content="[^"]*" \/>/,
          `<meta property="og:image:width" content="900" />`
        )
        .replace(
          /<meta property="og:image:height" content="[^"]*" \/>/,
          `<meta property="og:image:height" content="1125" />`
        )
        .replace(
          /<meta property="og:image:alt" content="[^"]*" \/>/,
          `<meta property="og:image:alt" content="${name} — Support Worker Profile | InSync Profiles" />`
        )
        .replace(
          /<meta name="twitter:title" content="[^"]*" \/>/,
          `<meta name="twitter:title" content="${pageTitle.replace(/"/g, "&quot;")}" />`
        )
        .replace(
          /<meta name="twitter:description" content="[^"]*" \/>/,
          `<meta name="twitter:description" content="${pageDesc.replace(/"/g, "&quot;")}" />`
        )
        .replace(
          /<meta name="twitter:image" content="[^"]*" \/>/,
          `<meta name="twitter:image" content="${ogImageUrl}" />`
        );

      res.setHeader("Content-Type", "text/html");
      res.send(html);
    } catch (err) {
      console.error("OG meta injection error:", err);
      res.sendFile(path.join(staticPath, "index.html"));
    }
  });

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
