import { useState, useEffect, useRef, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────
export interface VoiceControlCallbacks {
  onScrollTo: (threadId: string) => void;
  onPlayVideo: () => void;
  onOpenAAC: () => void;
  onOpenAccessibility: () => void;
  onMessage: () => void;
  onFeedback: () => void;
  onReadPage: () => void;
  onStopReading: () => void;
  workerEmail?: string;
  workerName?: string;
}

// ── Command definitions ────────────────────────────────────────
interface VoiceCommand {
  triggers: string[];
  action: string;
  description: string;
}

const COMMANDS: VoiceCommand[] = [
  { triggers: ["play video", "watch video", "play intro", "watch intro", "play"], action: "play_video", description: "Playing video" },
  { triggers: ["services", "go to services", "show services", "thread 2"], action: "scroll_services", description: "Going to Services" },
  { triggers: ["experience", "go to experience", "show experience", "background", "thread 3"], action: "scroll_experience", description: "Going to Experience" },
  { triggers: ["how i show up", "show up", "approach", "thread 4"], action: "scroll_approach", description: "Going to How I Show Up" },
  { triggers: ["availability", "available", "when", "schedule", "thread 5"], action: "scroll_availability", description: "Going to Availability" },
  { triggers: ["resources", "go to resources", "show resources", "links", "thread 6"], action: "scroll_resources", description: "Going to Resources" },
  { triggers: ["contact", "contact details", "phone", "email address", "thread 7"], action: "scroll_contact", description: "Going to Contact" },
  { triggers: ["aac board", "aac", "open aac", "communication board", "board"], action: "open_aac", description: "Opening AAC Board" },
  { triggers: ["message", "send message", "message to begin", "contact worker"], action: "message", description: "Opening message" },
  { triggers: ["feedback", "give feedback", "leave feedback"], action: "feedback", description: "Opening feedback" },
  { triggers: ["read page", "read aloud", "read", "read out"], action: "read_page", description: "Reading page aloud" },
  { triggers: ["stop reading", "stop", "quiet", "silence"], action: "stop_reading", description: "Stopped" },
  { triggers: ["scroll down", "down", "next"], action: "scroll_down", description: "Scrolling down" },
  { triggers: ["scroll up", "up", "back up"], action: "scroll_up", description: "Scrolling up" },
  { triggers: ["top", "go to top", "start", "beginning"], action: "scroll_top", description: "Going to top" },
  { triggers: ["help", "commands", "what can i say"], action: "show_help", description: "Showing commands" },
];

function matchCommand(transcript: string): VoiceCommand | null {
  const t = transcript.toLowerCase().trim();
  // Exact or contains match — longest trigger wins
  let best: VoiceCommand | null = null;
  let bestLen = 0;
  for (const cmd of COMMANDS) {
    for (const trigger of cmd.triggers) {
      if (t.includes(trigger) && trigger.length > bestLen) {
        best = cmd;
        bestLen = trigger.length;
      }
    }
  }
  return best;
}

// ── Component ──────────────────────────────────────────────────
export default function VoiceControl({
  onScrollTo,
  onPlayVideo,
  onOpenAAC,
  onOpenAccessibility,
  onMessage,
  onFeedback,
  onReadPage,
  onStopReading,
  workerEmail,
  workerName,
}: VoiceControlCallbacks) {
  // Don't hide on unsupported — show button always, warn on tap instead
  const [supported] = useState(() => true);
  const [active, setActive] = useState(false);
  const [toast, setToast] = useState<string>("");
  const [showHelp, setShowHelp] = useState(false);
  const [lastTranscript, setLastTranscript] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef(false);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(""), 2500);
  }, []);

  const executeCommand = useCallback((action: string) => {
    switch (action) {
      case "play_video": onPlayVideo(); break;
      case "scroll_services": onScrollTo("thread-services"); break;
      case "scroll_experience": onScrollTo("thread-experience"); break;
      case "scroll_approach": onScrollTo("thread-approach"); break;
      case "scroll_availability": onScrollTo("thread-availability"); break;
      case "scroll_resources": onScrollTo("thread-resources"); break;
      case "scroll_contact": onScrollTo("thread-contact"); break;
      case "open_aac": onOpenAAC(); break;
      case "message": onMessage(); break;
      case "feedback": onFeedback(); break;
      case "read_page": onReadPage(); break;
      case "stop_reading": onStopReading(); break;
      case "scroll_down": window.scrollBy({ top: 400, behavior: "smooth" }); break;
      case "scroll_up": window.scrollBy({ top: -400, behavior: "smooth" }); break;
      case "scroll_top": window.scrollTo({ top: 0, behavior: "smooth" }); break;
      case "show_help": setShowHelp(true); break;
    }
  }, [onPlayVideo, onScrollTo, onOpenAAC, onMessage, onFeedback, onReadPage, onStopReading]);

  const startListening = useCallback(() => {
    if (!supported) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = "en-AU";
    rec.maxAlternatives = 3;

    rec.onresult = (e: any) => {
      const results = Array.from(e.results as any[]).slice(e.resultIndex);
      for (const result of results as any[]) {
        const transcripts = Array.from(result as any[]).map((r: any) => r.transcript);
        setLastTranscript(transcripts[0]);
        for (const t of transcripts) {
          const cmd = matchCommand(t);
          if (cmd) {
            showToast(`✓ ${cmd.description}`);
            executeCommand(cmd.action);
            break;
          }
        }
      }
    };

    rec.onerror = (e: any) => {
      if (e.error === "not-allowed") {
        showToast("⚠️ Microphone permission needed");
        setActive(false);
        activeRef.current = false;
      }
      // For other errors (no-speech, network), auto-restart
    };

    rec.onend = () => {
      // Auto-restart if still active
      if (activeRef.current) {
        restartTimerRef.current = setTimeout(() => {
          if (activeRef.current) {
            try { rec.start(); } catch {}
          }
        }, 300);
      }
    };

    recognitionRef.current = rec;
    try {
      rec.start();
    } catch {
      showToast("⚠️ Could not start voice control");
    }
  }, [supported, showToast, executeCommand]);

  const stopListening = useCallback(() => {
    if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
    recognitionRef.current?.stop();
    recognitionRef.current = null;
  }, []);

  const toggle = useCallback(() => {
    // Check at tap time (not init time) — more reliable on Android
    const hasSR = typeof window !== 'undefined' &&
      ((window as any).webkitSpeechRecognition || (window as any).SpeechRecognition);
    if (!hasSR) {
      showToast("Voice needs Chrome or Safari");
      return;
    }
    if (active) {
      activeRef.current = false;
      setActive(false);
      stopListening();
      showToast("Voice control off");
    } else {
      activeRef.current = true;
      setActive(true);
      startListening();
      showToast("🎙 Listening… say a command");
    }
  }, [active, supported, startListening, stopListening, showToast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      activeRef.current = false;
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      recognitionRef.current?.stop();
    };
  }, []);

  return (
    <>
      {/* ── Toast notification ── */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          style={{
            position: "fixed",
            top: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(10,10,10,0.92)",
            border: "1.5px solid #c9a84c",
            borderRadius: "24px",
            padding: "8px 20px",
            color: "#f0d080",
            fontSize: "14px",
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            letterSpacing: "0.04em",
            zIndex: 9999,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          {toast}
        </div>
      )}

      {/* ── Help overlay ── */}
      {showHelp && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Voice control commands"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setShowHelp(false)}
        >
          <div
            style={{
              background: "#0a0a0a",
              border: "1.5px solid #c9a84c",
              borderRadius: "16px",
              padding: "20px",
              maxWidth: "360px",
              width: "100%",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <p style={{ color: "#c9a84c", fontSize: "13px", fontFamily: "'Outfit', sans-serif", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
                🎙 Voice Commands
              </p>
              <button
                onClick={() => setShowHelp(false)}
                aria-label="Close help"
                style={{ background: "transparent", border: "none", color: "#a89060", fontSize: "20px", cursor: "pointer", padding: "4px" }}
              >
                ×
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { emoji: "▶️", label: "Play video", say: '"play video"' },
                { emoji: "🤝", label: "Go to Services", say: '"services"' },
                { emoji: "📋", label: "Go to Experience", say: '"experience"' },
                { emoji: "📅", label: "Go to Availability", say: '"availability"' },
                { emoji: "🔗", label: "Go to Resources", say: '"resources"' },
                { emoji: "📞", label: "Go to Contact", say: '"contact"' },
                { emoji: "💬", label: "Open AAC Board", say: '"AAC board"' },
                { emoji: "✉️", label: "Send a message", say: '"message"' },
                { emoji: "💭", label: "Give feedback", say: '"feedback"' },
                { emoji: "🔊", label: "Read page aloud", say: '"read page"' },
                { emoji: "🔇", label: "Stop reading", say: '"stop"' },
                { emoji: "⬇️", label: "Scroll down", say: '"scroll down"' },
                { emoji: "⬆️", label: "Scroll up", say: '"scroll up"' },
                { emoji: "🔝", label: "Go to top", say: '"top"' },
              ].map(({ emoji, label, say }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #1a1a1a" }}>
                  <span style={{ color: "#e0d0a0", fontSize: "13px", fontFamily: "'Outfit', sans-serif" }}>{emoji} {label}</span>
                  <span style={{ color: "#c9a84c", fontSize: "12px", fontFamily: "'Outfit', sans-serif", fontStyle: "italic" }}>{say}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowHelp(false)}
              style={{
                marginTop: "16px",
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "none",
                background: "#c9a84c",
                color: "#0a0a0a",
                fontSize: "13px",
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* ── Persistent Voice Control button (bottom-left) ── */}
      <div style={{ position: "fixed", bottom: "24px", left: "20px", zIndex: 9000, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
        {/* Last heard — small label above button when active */}
        {active && lastTranscript && (
          <div style={{
            background: "rgba(10,10,10,0.85)",
            border: "1px solid #c9a84c44",
            borderRadius: "12px",
            padding: "3px 10px",
            color: "#a89060",
            fontSize: "11px",
            fontFamily: "'Outfit', sans-serif",
            maxWidth: "120px",
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            "{lastTranscript}"
          </div>
        )}

        <button
          onClick={toggle}
          aria-label={active ? "Turn off voice control" : "Turn on voice control — navigate profile by voice"}
          aria-pressed={active}
          title={active ? "Voice control ON — tap to turn off" : "Voice control — tap to navigate by voice"}
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            border: `3px solid ${active ? "#e05252" : "#F0C040"}`,
            background: active ? "#2a0a0a" : "#1a3a6b",
            color: active ? "#e05252" : "#F0C040",
            fontSize: "26px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: active
              ? "0 0 0 4px rgba(224,82,82,0.25), 0 6px 20px rgba(0,0,0,0.6)"
              : "0 6px 20px rgba(0,0,0,0.45), 0 0 0 3px rgba(240,192,64,0.25)",
            animation: active ? "vc-pulse 1.5s ease-in-out infinite" : "none",
            transition: "border-color 200ms, background 200ms, box-shadow 200ms",
          }}
        >
          {active ? "⏹" : "🎙"}
        </button>

        <span style={{
          color: active ? "#e05252" : "#1a3a6b",
          fontSize: "10px",
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 800,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          background: active ? "transparent" : "#F0C040",
          padding: "2px 8px",
          borderRadius: "10px",
        }}>
          {active ? "LISTENING" : "VOICE"}
        </span>
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes vc-pulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(224,82,82,0.2), 0 4px 16px rgba(0,0,0,0.5); }
          50% { box-shadow: 0 0 0 10px rgba(224,82,82,0.08), 0 4px 16px rgba(0,0,0,0.5); }
        }
      `}</style>
    </>
  );
}
