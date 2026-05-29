/**
 * Live Wall API — server-side routes for the InSync Profiles Live Wall.
 * 
 * The Live Wall is a publicly accessible, filterable directory of support workers
 * who have opted in to be discoverable. No login required to browse.
 * Workers submit their profile URL + metadata to be listed.
 * 
 * Routes:
 *   GET  /api/wall          — list all opted-in workers (with optional filters)
 *   POST /api/wall          — worker submits their listing
 *   PUT  /api/wall/:pid     — worker updates their listing (requires secret token)
 *   DELETE /api/wall/:pid   — worker removes their listing (requires secret token)
 */

import { Router, Request, Response } from "express";
import { createPool } from "mysql2/promise";

const router = Router();

// DB connection — reuse pool across requests
let pool: ReturnType<typeof createPool> | null = null;
function getPool() {
  if (!pool) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL not set");
    pool = createPool(url);
  }
  return pool;
}

// Ensure the wall_listings table exists
async function ensureTable() {
  const db = getPool();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS wall_listings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      pid VARCHAR(64) NOT NULL UNIQUE,
      profile_url TEXT NOT NULL,
      worker_name VARCHAR(255) NOT NULL DEFAULT '',
      location VARCHAR(255) NOT NULL DEFAULT '',
      services TEXT NOT NULL DEFAULT '',
      availability VARCHAR(16) NOT NULL DEFAULT 'available',
      photo_url TEXT,
      tagline VARCHAR(500) NOT NULL DEFAULT '',
      edit_token VARCHAR(64) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
}

// GET /api/wall — list all wall listings with optional filters
router.get("/", async (req: Request, res: Response) => {
  try {
    await ensureTable();
    const db = getPool();
    
    const { location, availability, services, search } = req.query as Record<string, string>;
    
    let query = `SELECT pid, profile_url, worker_name, location, services, availability, photo_url, tagline, created_at FROM wall_listings WHERE 1=1`;
    const params: string[] = [];
    
    if (location && location.trim()) {
      query += ` AND location LIKE ?`;
      params.push(`%${location.trim()}%`);
    }
    if (availability && availability !== "all") {
      query += ` AND availability = ?`;
      params.push(availability);
    }
    if (services && services.trim()) {
      // services is a comma-separated list — match any
      const svcs = services.split(",").map(s => s.trim()).filter(Boolean);
      if (svcs.length > 0) {
        const clauses = svcs.map(() => `services LIKE ?`).join(" OR ");
        query += ` AND (${clauses})`;
        svcs.forEach(s => params.push(`%${s}%`));
      }
    }
    if (search && search.trim()) {
      query += ` AND (worker_name LIKE ? OR location LIKE ? OR tagline LIKE ? OR services LIKE ?)`;
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s);
    }
    
    query += ` ORDER BY created_at DESC LIMIT 100`;
    
    const [rows] = await db.execute(query, params);
    res.json({ success: true, listings: rows });
  } catch (err) {
    console.error("Wall GET error:", err);
    res.status(500).json({ success: false, error: "Failed to load wall listings" });
  }
});

// POST /api/wall — submit a new wall listing
router.post("/", async (req: Request, res: Response) => {
  try {
    await ensureTable();
    const db = getPool();
    
    const { pid, profile_url, worker_name, location, services, availability, photo_url, tagline } = req.body;
    
    if (!pid || !profile_url) {
      return res.status(400).json({ success: false, error: "pid and profile_url are required" });
    }
    
    // Generate a random edit token so only the worker can update/remove their listing
    const editToken = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    
    await db.execute(
      `INSERT INTO wall_listings (pid, profile_url, worker_name, location, services, availability, photo_url, tagline, edit_token)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         profile_url = VALUES(profile_url),
         worker_name = VALUES(worker_name),
         location = VALUES(location),
         services = VALUES(services),
         availability = VALUES(availability),
         photo_url = VALUES(photo_url),
         tagline = VALUES(tagline),
         updated_at = CURRENT_TIMESTAMP`,
      [
        pid,
        profile_url,
        worker_name || "",
        location || "",
        Array.isArray(services) ? services.join(",") : (services || ""),
        availability || "available",
        photo_url || null,
        tagline || "",
        editToken,
      ]
    );
    
    // Store edit token in response — worker must save this in localStorage
    res.json({ success: true, pid, editToken });
  } catch (err) {
    console.error("Wall POST error:", err);
    res.status(500).json({ success: false, error: "Failed to submit wall listing" });
  }
});

// PUT /api/wall/:pid — update availability status
router.put("/:pid", async (req: Request, res: Response) => {
  try {
    await ensureTable();
    const db = getPool();
    const { pid } = req.params;
    const { availability, editToken } = req.body;
    
    if (!editToken) {
      return res.status(401).json({ success: false, error: "Edit token required" });
    }
    
    const [rows] = await db.execute(
      `SELECT id FROM wall_listings WHERE pid = ? AND edit_token = ?`,
      [pid, editToken]
    ) as [Array<{id: number}>, unknown];
    
    if (!rows || rows.length === 0) {
      return res.status(403).json({ success: false, error: "Invalid token or listing not found" });
    }
    
    await db.execute(
      `UPDATE wall_listings SET availability = ?, updated_at = CURRENT_TIMESTAMP WHERE pid = ?`,
      [availability || "available", pid]
    );
    
    res.json({ success: true });
  } catch (err) {
    console.error("Wall PUT error:", err);
    res.status(500).json({ success: false, error: "Failed to update listing" });
  }
});

// DELETE /api/wall/:pid — remove from wall
router.delete("/:pid", async (req: Request, res: Response) => {
  try {
    await ensureTable();
    const db = getPool();
    const { pid } = req.params;
    const { editToken } = req.body;
    
    if (!editToken) {
      return res.status(401).json({ success: false, error: "Edit token required" });
    }
    
    const [rows] = await db.execute(
      `SELECT id FROM wall_listings WHERE pid = ? AND edit_token = ?`,
      [pid, editToken]
    ) as [Array<{id: number}>, unknown];
    
    if (!rows || rows.length === 0) {
      return res.status(403).json({ success: false, error: "Invalid token or listing not found" });
    }
    
    await db.execute(`DELETE FROM wall_listings WHERE pid = ?`, [pid]);
    res.json({ success: true });
  } catch (err) {
    console.error("Wall DELETE error:", err);
    res.status(500).json({ success: false, error: "Failed to remove listing" });
  }
});

export default router;
