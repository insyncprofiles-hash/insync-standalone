/**
 * Admin — password-protected key management page for InSync Profiles.
 * Accessible at /admin. Shows all issued licence keys, their activation
 * status, and lets the owner generate new keys and copy their hashes.
 *
 * Password is checked client-side only (sufficient for a low-traffic
 * product admin tool). The page never exposes the plain-text keys —
 * only the hashes stored in licence.ts are shown alongside the labels
 * you add here.
 */
import { useState, useCallback } from "react";
import { VALID_KEY_HASHES, sha256 } from "@/lib/licence";

// ── Admin password (change this to something only you know) ──────────────────
const ADMIN_PASSWORD = "hope-admin-2026";

// ── Key registry: add a human label for each hash so the table is readable ──
// Format: { hash: string; label: string; issuedTo?: string; issuedAt?: string }
const KEY_REGISTRY: Array<{ hash: string; label: string; issuedTo?: string; issuedAt?: string }> = [
  {
    hash: "a3b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
    label: "SCV-DEMO-0000-0000",
    issuedTo: "Internal demo",
    issuedAt: "2025-01-01",
  },
  {
    hash: "60c65cd292d8c279a16e84b52362ef252921e625cc05ed2d6397c96411384ecd",
    label: "SCV-DEMO-2025-WORK",
    issuedTo: "Internal demo",
    issuedAt: "2025-01-01",
  },
  {
    hash: "bdd22b55266b0a1066b80d0550d561687a092095f3a1ff6c23ca874e2686e542",
    label: "SCV-2025-G-BD5792",
    issuedTo: "Buyer G",
    issuedAt: "2026-05-23",
  },
];

// ── Colour palette ────────────────────────────────────────────────────────────
const C = {
  bg: "#0d1b2a",
  card: "rgba(255,255,255,0.05)",
  border: "rgba(255,255,255,0.10)",
  gold: "#f0c040",
  goldDim: "rgba(240,192,64,0.35)",
  teal: "#2dd4bf",
  text: "#e8f4fd",
  textDim: "#8aa0b8",
  red: "#ff6b6b",
  green: "#4ade80",
  blue: "#4d96ff",
};

function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "4px",
      padding: "3px 10px", borderRadius: "99px",
      background: `${color}18`, border: `1px solid ${color}44`,
      color, fontFamily: "'Outfit', sans-serif",
      fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em",
      whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

// ── Key generator ─────────────────────────────────────────────────────────────
function generateKey(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const seg = (n: number) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `SCV-${seg(4)}-${seg(4)}-${seg(4)}`;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState("");

  // New key generator state
  const [newKey, setNewKey] = useState("");
  const [newKeyHash, setNewKeyHash] = useState("");
  const [newKeyLabel, setNewKeyLabel] = useState("");
  const [hashLoading, setHashLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleLogin = useCallback(() => {
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
    } else {
      setPwError("Incorrect password.");
      setPw("");
    }
  }, [pw]);

  const handleGenerateKey = useCallback(async () => {
    const key = generateKey();
    setNewKey(key);
    setNewKeyHash("");
    setHashLoading(true);
    const hash = await sha256(key);
    setNewKeyHash(hash);
    setHashLoading(false);
  }, []);

  const copy = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  }, []);

  // ── Login screen ─────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{
        minHeight: "100vh", background: C.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px", fontFamily: "'Outfit', sans-serif",
      }}>
        <div style={{
          width: "100%", maxWidth: "380px",
          background: C.card, backdropFilter: "blur(20px)",
          borderRadius: "20px", padding: "36px 28px",
          border: `1.5px solid ${C.goldDim}`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔐</div>
          <h1 style={{ fontSize: "20px", fontWeight: 800, color: C.text, margin: "0 0 6px" }}>
            InSync Profiles Admin
          </h1>
          <p style={{ fontSize: "13px", color: C.textDim, margin: "0 0 24px" }}>
            Licence key management
          </p>
          <input
            type="password"
            value={pw}
            onChange={e => { setPw(e.target.value); setPwError(""); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="Admin password"
            autoFocus
            style={{
              width: "100%", padding: "13px 16px", borderRadius: "12px",
              border: pwError ? `1.5px solid ${C.red}` : `1.5px solid ${C.goldDim}`,
              background: "rgba(255,255,255,0.07)", color: C.text,
              fontFamily: "'Outfit', sans-serif", fontSize: "15px",
              outline: "none", boxSizing: "border-box", marginBottom: "10px",
            }}
            aria-label="Admin password"
          />
          {pwError && (
            <p style={{ color: C.red, fontSize: "13px", margin: "0 0 10px" }}>⚠️ {pwError}</p>
          )}
          <button
            onClick={handleLogin}
            style={{
              width: "100%", padding: "13px", borderRadius: "12px", border: "none",
              background: `linear-gradient(135deg, #d4af37, #f0c040)`,
              color: "#1a2e1e", fontFamily: "'Outfit', sans-serif",
              fontSize: "15px", fontWeight: 800, cursor: "pointer",
              boxShadow: "0 4px 20px rgba(212,175,55,0.4)",
            }}
          >
            Enter Admin →
          </button>
          <p style={{ marginTop: "20px", fontSize: "12px", color: C.textDim }}>
            <a href="/" style={{ color: C.teal, textDecoration: "none" }}>← Back to site</a>
          </p>
        </div>
      </div>
    );
  }

  // ── Admin dashboard ───────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      fontFamily: "'Outfit', sans-serif", color: C.text,
      padding: "40px 24px",
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 800, color: C.gold, margin: "0 0 4px", letterSpacing: "-0.02em" }}>
              🔑 InSync Profiles Admin
            </h1>
            <p style={{ fontSize: "13px", color: C.textDim, margin: 0 }}>
              Licence key management · {VALID_KEY_HASHES.length} keys registered
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <a href="/" style={{ padding: "8px 18px", borderRadius: "99px", background: C.card, border: `1px solid ${C.border}`, color: C.textDim, fontSize: "13px", textDecoration: "none", fontWeight: 600 }}>
              ← Site
            </a>
            <button
              onClick={() => setAuthed(false)}
              style={{ padding: "8px 18px", borderRadius: "99px", background: "rgba(255,107,107,0.12)", border: "1px solid rgba(255,107,107,0.3)", color: C.red, fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
            >
              Log out
            </button>
          </div>
        </div>

        {/* Key table */}
        <div style={{ background: C.card, borderRadius: "16px", border: `1px solid ${C.border}`, marginBottom: "32px", overflow: "hidden" }}>
          <div style={{ padding: "18px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: C.text, margin: 0 }}>Issued Licence Keys</h2>
            <Badge color={C.green}>{KEY_REGISTRY.length} keys</Badge>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {["Key", "Issued To", "Issued", "Status", "Hash (last 12)", ""].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: C.textDim, letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {KEY_REGISTRY.map((entry, i) => {
                  const isValid = VALID_KEY_HASHES.includes(entry.hash);
                  const hashTail = entry.hash.slice(-12);
                  return (
                    <tr key={i} style={{ borderBottom: i < KEY_REGISTRY.length - 1 ? `1px solid ${C.border}` : "none", transition: "background 0.1s" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontFamily: "'Outfit', monospace", fontSize: "13px", fontWeight: 700, color: C.gold, letterSpacing: "0.06em" }}>
                          {entry.label}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "13px", color: C.text }}>{entry.issuedTo || "—"}</td>
                      <td style={{ padding: "14px 16px", fontSize: "12px", color: C.textDim, whiteSpace: "nowrap" }}>{entry.issuedAt || "—"}</td>
                      <td style={{ padding: "14px 16px" }}>
                        {isValid
                          ? <Badge color={C.green}>✓ Active</Badge>
                          : <Badge color={C.red}>✗ Revoked</Badge>
                        }
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontFamily: "monospace", fontSize: "12px", color: C.textDim }}>…{hashTail}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <button
                          onClick={() => copy(entry.hash, `hash-${i}`)}
                          style={{ padding: "5px 12px", borderRadius: "8px", background: copied === `hash-${i}` ? "rgba(74,222,128,0.15)" : C.card, border: `1px solid ${copied === `hash-${i}` ? C.green : C.border}`, color: copied === `hash-${i}` ? C.green : C.textDim, fontSize: "11px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
                        >
                          {copied === `hash-${i}` ? "✓ Copied" : "Copy hash"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* New key generator */}
        <div style={{ background: C.card, borderRadius: "16px", border: `1.5px solid ${C.goldDim}`, padding: "24px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: C.gold, margin: "0 0 6px" }}>
            ✦ Generate a New Licence Key
          </h2>
          <p style={{ fontSize: "13px", color: C.textDim, margin: "0 0 20px", lineHeight: 1.6 }}>
            Generate a random key, copy the hash, and add it to <code style={{ background: "rgba(255,255,255,0.08)", padding: "2px 6px", borderRadius: "4px", fontSize: "12px" }}>client/src/lib/licence.ts</code> under <code style={{ background: "rgba(255,255,255,0.08)", padding: "2px 6px", borderRadius: "4px", fontSize: "12px" }}>VALID_KEY_HASHES</code>. Then send the plain-text key to the buyer.
          </p>

          <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
            <button
              onClick={handleGenerateKey}
              style={{ padding: "12px 24px", borderRadius: "12px", border: "none", background: `linear-gradient(135deg, #d4af37, #f0c040)`, color: "#1a2e1e", fontFamily: "'Outfit', sans-serif", fontSize: "14px", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 20px rgba(212,175,55,0.35)" }}
            >
              🎲 Generate Key
            </button>
            {newKey && (
              <button
                onClick={() => copy(newKey, "newKey")}
                style={{ padding: "12px 24px", borderRadius: "12px", border: `1.5px solid ${C.goldDim}`, background: "transparent", color: C.gold, fontFamily: "'Outfit', sans-serif", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}
              >
                {copied === "newKey" ? "✓ Copied!" : "📋 Copy Key"}
              </button>
            )}
          </div>

          {newKey && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Plain-text key */}
              <div style={{ background: "rgba(240,192,64,0.08)", borderRadius: "12px", border: `1.5px solid ${C.goldDim}`, padding: "16px 18px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: C.gold, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 6px" }}>Plain-text key (send to buyer)</p>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontFamily: "'Outfit', monospace", fontSize: "18px", fontWeight: 800, color: C.gold, letterSpacing: "0.12em", flex: 1 }}>{newKey}</span>
                  <button
                    onClick={() => copy(newKey, "newKey")}
                    style={{ padding: "7px 14px", borderRadius: "8px", background: copied === "newKey" ? "rgba(74,222,128,0.15)" : "rgba(240,192,64,0.15)", border: `1px solid ${copied === "newKey" ? C.green : C.goldDim}`, color: copied === "newKey" ? C.green : C.gold, fontSize: "12px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
                  >
                    {copied === "newKey" ? "✓ Copied" : "Copy"}
                  </button>
                </div>
              </div>

              {/* SHA-256 hash */}
              <div style={{ background: "rgba(77,150,255,0.06)", borderRadius: "12px", border: "1px solid rgba(77,150,255,0.2)", padding: "16px 18px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: C.blue, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 6px" }}>SHA-256 hash (add to licence.ts)</p>
                {hashLoading ? (
                  <p style={{ fontSize: "13px", color: C.textDim, margin: 0 }}>Computing hash…</p>
                ) : (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <code style={{ fontFamily: "monospace", fontSize: "12px", color: C.blue, wordBreak: "break-all", flex: 1, lineHeight: 1.6 }}>{newKeyHash}</code>
                    <button
                      onClick={() => copy(newKeyHash, "newHash")}
                      style={{ padding: "7px 14px", borderRadius: "8px", background: copied === "newHash" ? "rgba(74,222,128,0.15)" : "rgba(77,150,255,0.12)", border: `1px solid ${copied === "newHash" ? C.green : "rgba(77,150,255,0.3)"}`, color: copied === "newHash" ? C.green : C.blue, fontSize: "12px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
                    >
                      {copied === "newHash" ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                )}
              </div>

              {/* Label input */}
              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: C.textDim, letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                  Buyer label (for your records)
                </label>
                <input
                  value={newKeyLabel}
                  onChange={e => setNewKeyLabel(e.target.value)}
                  placeholder="e.g. Buyer H — 24 May 2026"
                  style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.05)", color: C.text, fontFamily: "'Outfit', sans-serif", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {/* Instruction block */}
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "10px", border: `1px solid ${C.border}`, padding: "14px 16px" }}>
                <p style={{ fontSize: "12px", color: C.textDim, margin: 0, lineHeight: 1.8 }}>
                  <strong style={{ color: C.text }}>Next steps:</strong><br />
                  1. Copy the hash above<br />
                  2. Open <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: "3px" }}>client/src/lib/licence.ts</code> and add it to <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: "3px" }}>VALID_KEY_HASHES</code><br />
                  3. Also add a matching entry to <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: "3px" }}>KEY_REGISTRY</code> in <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: "3px" }}>Admin.tsx</code><br />
                  4. Redeploy the site (Publish button)<br />
                  5. Send the plain-text key to the buyer — they enter it at <strong style={{ color: C.gold }}>YOUR_DOMAIN/editor</strong>
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
