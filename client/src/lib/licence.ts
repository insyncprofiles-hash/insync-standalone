/**
 * InSync Profiles — Licence Key System
 *
 * Keys are validated by comparing their SHA-256 hash against a list of
 * pre-approved hashes baked into the app at build time.
 *
 * To generate a new key hash for a buyer:
 *   1. Generate a random key, e.g. "ISP-XXXX-XXXX-XXXX"
 *   2. Run: echo -n "ISP-XXXX-XXXX-XXXX" | sha256sum
 *   3. Add the resulting hash to VALID_KEY_HASHES below
 *   4. Send the plain-text key to the buyer — they enter it once to unlock
 *
 * The plain-text key is NEVER stored in the app source code.
 * Only the SHA-256 hashes are stored here.
 */

// ── Add new buyer key hashes here ─────────────────────────────────────────────
// Each hash corresponds to one unique licence key you generate per sale.
// Format: sha256(plain-text-key) in lowercase hex.
export const VALID_KEY_HASHES: string[] = [
  // Demo key: ISP-DEMO-0000-0000
  "a3b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
  // Key: ISP-DEMO-2025-WORK
  "60c65cd292d8c279a16e84b52362ef252921e625cc05ed2d6397c96411384ecd",
  // Add real buyer hashes below this line:
  "bdd22b55266b0a1066b80d0550d561687a092095f3a1ff6c23ca874e2686e542", // G — 23 May 2026
  "800568101d3ef987269e964600d66d04a7059bb111732202e392789485cd4c1e", // nadzak3434@gmail.com — SKI-2026-5401 — 7 Jun 2026
  "b42ae14d0edeab593016a835a39c9f0c9d74abdc9cdbf443d6b9eb037731eb14", // sarapumpd6@gmail.com — SKI-2026-7823 — 8 Jun 2026
];

const STORAGE_KEY = "insync_licence_activated";

/** Hash a string using the browser's native SubtleCrypto API */
export async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text.trim().toUpperCase());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

/** Check if this device already has a valid activated licence */
export function isLicenceActivated(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    // Verify the stored hash is still in the valid list
    return VALID_KEY_HASHES.includes(stored);
  } catch {
    return false;
  }
}

/** Validate a key entered by the user and store it if valid */
export async function activateLicence(key: string): Promise<boolean> {
  const hash = await sha256(key);
  if (VALID_KEY_HASHES.includes(hash)) {
    try {
      localStorage.setItem(STORAGE_KEY, hash);
    } catch {
      // localStorage unavailable — still return true so the session works
    }
    return true;
  }
  return false;
}

/** Clear the stored licence (for testing / reset) */
export function clearLicence(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* ignore */ }
}
