/**
 * LicenceGate — wraps the Home editor route.
 * Shows a full-screen activation screen until a valid licence key is entered.
 * The /view and /pricing pages are never gated.
 */
import { useState, useEffect, useCallback } from "react";
import { isLicenceActivated, activateLicence } from "@/lib/licence";

/**
 * Fire-and-forget owner notification via a configurable webhook URL.
 * Set VITE_NOTIFICATION_WEBHOOK_URL in your .env to receive activation alerts.
 * Supports any POST webhook (e.g. Make.com, Zapier, n8n, Discord, Slack).
 */
async function notifyOwnerOfActivation(keyFragment: string) {
  try {
    const webhookUrl = import.meta.env.VITE_NOTIFICATION_WEBHOOK_URL;
    if (!webhookUrl) return;
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "🔓 New InSync Profiles Licence Activated",
        content: `A buyer just activated their licence key (ending …${keyFragment}) at ${new Date().toLocaleString("en-AU", { timeZone: "Australia/Sydney" })} AEST.`,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch {
    // Notification failure is non-critical — silently ignore
  }
}

const FIRST_ACTIVATION_KEY = "insync_first_activation_done";

interface LicenceGateProps {
  children: React.ReactNode;
}

export default function LicenceGate({ children }: LicenceGateProps) {
  const [activated, setActivated] = useState<boolean | null>(null); // null = loading
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    setActivated(isLicenceActivated());
  }, []);

  const handleActivate = useCallback(async () => {
    if (!key.trim()) { setError("Please enter your licence key."); return; }
    setLoading(true);
    setError("");
    const trimmedKey = key.trim();
    const valid = await activateLicence(trimmedKey);
    setLoading(false);
    if (valid) {
      // Check if this is the very first activation on this device
      const isFirstTime = !localStorage.getItem(FIRST_ACTIVATION_KEY);
      if (isFirstTime) {
        localStorage.setItem(FIRST_ACTIVATION_KEY, "1");
        // Notify owner (fire-and-forget)
        const fragment = trimmedKey.slice(-6);
        notifyOwnerOfActivation(fragment);
        // Signal Home to show welcome overlay on next render
        sessionStorage.setItem("insync-welcome-seen", ""); // clear so WelcomeOverlay shows
        sessionStorage.removeItem("insync-welcome-seen"); // ensure it's absent
        // Add ?welcome=1 to trigger WelcomeOverlay (it checks for ?name= but we'll update it)
        sessionStorage.setItem("insync_show_welcome", "1");
      }
      setActivated(true);
    } else {
      setError("Invalid licence key. Please check your key and try again.");
    }
  }, [key]);

  // Still checking localStorage
  if (activated === null) return null;

  // Already activated — render children
  if (activated) return <>{children}</>;

  // Show activation screen
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #c8e6fa 0%, #e8f4fd 30%, #fdf6e3 60%, #fce8b2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "'Outfit', sans-serif",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "440px",
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px)",
        borderRadius: "24px",
        padding: "40px 32px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 4px 20px rgba(210,175,80,0.18)",
        border: "1.5px solid rgba(210,175,80,0.25)",
        textAlign: "center",
      }}>
        {/* Logo mark */}
        <img src="/assets/insync-logo-transparent_9e0df532.png" alt="InSync Profiles" style={{ width: "72px", height: "72px", objectFit: "contain", margin: "0 auto 20px", display: "block" }} />

        <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#1a2e4a", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
          Activate Your Profile
        </h1>
        <p style={{ fontSize: "14px", color: "#6b7a8d", margin: "0 0 28px", lineHeight: 1.6 }}>
          Enter your licence key to unlock your InSync Profiles profile editor.
        </p>

        {/* Key input */}
        <div style={{ position: "relative", marginBottom: "12px" }}>
          <input
            type={showKey ? "text" : "password"}
            value={key}
            onChange={e => { setKey(e.target.value.toUpperCase()); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleActivate()}
            placeholder="ISP-XXXX-XXXX-XXXX"
            autoComplete="off"
            spellCheck={false}
            style={{
              width: "100%",
              padding: "14px 48px 14px 16px",
              borderRadius: "12px",
              border: error ? "1.5px solid #ff6b6b" : "1.5px solid rgba(210,175,80,0.4)",
              background: "rgba(255,255,255,0.8)",
              fontFamily: "'Outfit', monospace",
              fontSize: "16px",
              fontWeight: 600,
              color: "#1a2e4a",
              letterSpacing: "0.08em",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.15s",
            }}
            aria-label="Licence key"
          />
          <button
            onClick={() => setShowKey(v => !v)}
            style={{
              position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", fontSize: "18px",
              color: "#6b7a8d", padding: 0, lineHeight: 1,
            }}
            aria-label={showKey ? "Hide key" : "Show key"}
          >{showKey ? "🙈" : "👁"}</button>
        </div>

        {/* Error message */}
        {error && (
          <p style={{ fontSize: "13px", color: "#ff6b6b", margin: "0 0 12px", lineHeight: 1.5 }}>
            ⚠️ {error}
          </p>
        )}

        {/* Activate button */}
        <button
          onClick={handleActivate}
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "12px",
            border: "none",
            background: loading
              ? "rgba(210,175,80,0.4)"
              : "linear-gradient(135deg, #d4af37, #f0c040)",
            color: loading ? "#999" : "#1a2e1e",
            fontFamily: "'Outfit', sans-serif",
            fontSize: "15px",
            fontWeight: 800,
            cursor: loading ? "not-allowed" : "pointer",
            letterSpacing: "0.04em",
            boxShadow: loading ? "none" : "0 4px 20px rgba(210,175,80,0.4)",
            transition: "all 0.15s cubic-bezier(0.23,1,0.32,1)",
            transform: loading ? "scale(0.98)" : "scale(1)",
          }}
          aria-label="Activate licence"
        >
          {loading ? "Checking…" : "🔓 Activate Profile Editor"}
        </button>

        {/* Help text */}
        <p style={{ fontSize: "12px", color: "#9ba8b5", margin: "20px 0 0", lineHeight: 1.6 }}>
          Purchased but don't have a key?{" "}
          <a href="mailto:insyncprofiles@gmail.com" style={{ color: "#4d96ff", textDecoration: "none", fontWeight: 600 }}>
            Contact support
          </a>
          {" "}and we'll help you out.
        </p>
        <p style={{ fontSize: "11px", color: "#b0bcc8", margin: "8px 0 0" }}>
          Single-user licence · Non-transferable
        </p>
      </div>
    </div>
  );
}
