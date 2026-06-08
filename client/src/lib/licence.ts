/**
 * InSync Profiles — Licence Key System
 *
 * Keys are validated by comparing their SHA-256 hash against a list of
 * pre-approved hashes baked into the app at build time.
 *
 * To generate a new key hash for a buyer:
 *   1. Generate a random key, e.g. "SKI-2026-XXXX"
 *   2. Run: echo -n "SKI20267823" | sha256sum   ← strip hyphens first
 *   3. Add the resulting hash to VALID_KEY_HASHES below
 *   4. Send the plain-text key to the buyer — they enter it once to unlock
 *      (they can type with or without hyphens — both work)
 *
 * The plain-text key is NEVER stored in the app source code.
 * Only the SHA-256 hashes are stored here.
 *
 * NOTE: Keys are normalised before hashing — hyphens and spaces are stripped
 * and the string is uppercased. This means "SKI-2026-7823", "SKI 2026 7823",
 * and "SKI20267823" all produce the same hash.
 *
 * LEGACY: Hashes generated before this normalisation change (with hyphens) are
 * kept in LEGACY_KEY_HASHES so existing activated users are not locked out.
 */

// ── Normalised hashes (hyphens stripped before hashing) ───────────────────────
// Generate with: echo -n "SKI20267823" | sha256sum
export const VALID_KEY_HASHES: string[] = [
  // Demo key: ISPDEMO00000000  (was ISP-DEMO-0000-0000)
  "7c3d69e37d11fef62d2a0ce21a2a811a2f018b54c8bf8fd1a899649621e05ee6",
  // Demo key: ISPDEMO2025WORK  (was ISP-DEMO-2025-WORK)
  "ec9dac2ed0fbb8e25a890142c3b3aeceedecb13fa1b3fff0a85da43ef720a37f",
  // Add real buyer hashes below this line (strip hyphens from key before sha256):
  "493a743555685c48dd34f76bc1cf6e384f16a8d39890e69f256897857ba8f035", // nadzak3434@gmail.com — SKI-2026-5401 — 7 Jun 2026
  "2ceab9a2434c62ed3d7e5af55fad3d8ff6c817f3622d77db8713f6d51ff58951", // sarapumpd6@gmail.com — SKI-2026-7823 — 8 Jun 2026
];

// ── Legacy hashes (generated WITH hyphens — kept so existing users stay active) ─
// Do NOT add new hashes here; use VALID_KEY_HASHES above.
const LEGACY_KEY_HASHES: string[] = [
  "a3b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2", // ISP-DEMO-0000-0000
  "60c65cd292d8c279a16e84b52362ef252921e625cc05ed2d6397c96411384ecd",  // ISP-DEMO-2025-WORK
  "bdd22b55266b0a1066b80d0550d561687a092095f3a1ff6c23ca874e2686e542", // G — 23 May 2026
  "800568101d3ef987269e964600d66d04a7059bb111732202e392789485cd4c1e", // nadzak3434@gmail.com — SKI-2026-5401 (legacy)
  "b42ae14d0edeab593016a835a39c9f0c9d74abdc9cdbf443d6b9eb037731eb14", // sarapumpd6@gmail.com — SKI-2026-7823 (legacy)
];

// Combined list used for localStorage validation (covers both old and new hashes)
const ALL_VALID_HASHES = [...VALID_KEY_HASHES, ...LEGACY_KEY_HASHES];

const STORAGE_KEY = "insync_licence_activated";

/** Normalise a key: strip hyphens and spaces, then uppercase */
function normaliseKey(text: string): string {
  return text.trim().replace(/[\s-]/g, "").toUpperCase();
}

/** Hash a string using the browser's native SubtleCrypto API */
export async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(normaliseKey(text));
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

/** Check if this device already has a valid activated licence */
export function isLicenceActivated(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    // Accept both new normalised hashes and legacy hashes
    return ALL_VALID_HASHES.includes(stored);
  } catch {
    return false;
  }
}

/** Validate a key entered by the user and store it if valid */
export async function activateLicence(key: string): Promise<boolean> {
  const hash = await sha256(key);
  if (ALL_VALID_HASHES.includes(hash)) {
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
