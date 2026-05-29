/* ============================================================
   VideoModal — Video player with personal upload support
   Design: Midnight Luxury Accessibility (Navy + Gold)
   Features: Sample video OR personal uploaded video
   ============================================================ */
import { useEffect, useRef, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  personalVideoUrl?: string | null;
  onPersonalVideoUpload?: (url: string) => void;
}

export default function VideoModal({ open, onClose, personalVideoUrl, onPersonalVideoUpload }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<"sample" | "personal">("sample");
  const [dragOver, setDragOver] = useState(false);

  const activeSrc = tab === "personal" && personalVideoUrl
    ? personalVideoUrl
    : "/assets/sw_final_video_787cdcd6.mp4";

  const activePoster = tab === "personal" && personalVideoUrl
    ? undefined
    : "/assets/sw_video_poster_0e4a9721.png";

  useEffect(() => {
    if (open) {
      videoRef.current?.load();
      videoRef.current?.play().catch(() => {});
      dialogRef.current?.focus();
    } else {
      videoRef.current?.pause();
      if (videoRef.current) videoRef.current.currentTime = 0;
    }
  }, [open, tab, activeSrc]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("video/")) return;
    const url = URL.createObjectURL(file);
    onPersonalVideoUpload?.(url);
    setTab("personal");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange(file);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "oklch(0.05 0.04 155 / 92%)", backdropFilter: "blur(8px)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Support worker video player"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative w-full max-w-3xl rounded-2xl overflow-hidden animate-fade-in-up"
        style={{
          background: "oklch(0.10 0.06 155)",
          border: "2px solid oklch(0.72 0.14 75 / 50%)",
          boxShadow: "0 0 60px oklch(0.72 0.14 75 / 25%), 0 30px 80px oklch(0.05 0.04 155 / 80%)",
          outline: "none",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid oklch(0.72 0.14 75 / 20%)" }}
        >
          <div>
            <p className="text-xs tracking-widest uppercase mb-0.5" style={{ color: "oklch(0.72 0.14 75 / 70%)", fontFamily: "'Outfit', sans-serif" }}>
              Video Showcase
            </p>
            <h2 className="text-lg font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "oklch(0.96 0.01 78)" }}>
              Meet Your Support Worker
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              background: "oklch(0.72 0.14 75 / 15%)",
              border: "1px solid oklch(0.72 0.14 75 / 35%)",
              color: "oklch(0.82 0.14 75)",
              fontSize: "18px",
              lineHeight: 1,
            }}
            aria-label="Close video"
          >
            ×
          </button>
        </div>

        {/* Tab switcher */}
        <div
          style={{
            display: "flex",
            gap: "0",
            borderBottom: "1px solid oklch(0.72 0.14 75 / 20%)",
            background: "oklch(0.12 0.06 155)",
          }}
          role="tablist"
          aria-label="Video source"
        >
          {[
            { id: "sample" as const, label: "🎬 Sample Video" },
            { id: "personal" as const, label: "📹 My Video" },
          ].map(t => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1,
                padding: "12px 16px",
                fontSize: "13px",
                fontFamily: "'Outfit', sans-serif",
                fontWeight: tab === t.id ? 700 : 500,
                color: tab === t.id ? "oklch(0.82 0.14 75)" : "oklch(0.60 0.04 155)",
                background: "transparent",
                border: "none",
                borderBottom: tab === t.id ? "2px solid oklch(0.82 0.14 75)" : "2px solid transparent",
                cursor: "pointer",
                transition: "all 160ms ease-out",
              }}
            >
              {t.label}
              {t.id === "personal" && personalVideoUrl && (
                <span
                  style={{
                    marginLeft: "6px",
                    background: "oklch(0.82 0.14 75)",
                    color: "oklch(0.10 0.06 155)",
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "1px 6px",
                    borderRadius: "99px",
                  }}
                >
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Video area */}
        <div style={{ background: "black", position: "relative" }}>
          {tab === "personal" && !personalVideoUrl ? (
            /* Upload drop zone */
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                aspectRatio: "16/9",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                background: dragOver ? "oklch(0.72 0.14 75 / 12%)" : "oklch(0.12 0.06 155)",
                border: `2px dashed ${dragOver ? "oklch(0.82 0.14 75)" : "oklch(0.72 0.14 75 / 40%)"}`,
                cursor: "pointer",
                transition: "all 200ms ease-out",
                padding: "32px",
              }}
              role="button"
              tabIndex={0}
              aria-label="Upload your personal video — click or drag and drop"
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "oklch(0.72 0.14 75 / 15%)",
                  border: "2px solid oklch(0.72 0.14 75 / 50%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                }}
                aria-hidden="true"
              >
                📹
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "oklch(0.88 0.04 130)", fontSize: "16px", fontFamily: "'Outfit', sans-serif", fontWeight: 600, margin: "0 0 6px" }}>
                  Upload Your Personal Video
                </p>
                <p style={{ color: "oklch(0.60 0.04 155)", fontSize: "13px", fontFamily: "'Outfit', sans-serif", margin: "0 0 4px" }}>
                  Drag &amp; drop or click to browse
                </p>
                <p style={{ color: "oklch(0.50 0.04 155)", fontSize: "12px", fontFamily: "'Outfit', sans-serif", margin: 0 }}>
                  MP4, MOV, WebM · Max 15 seconds recommended
                </p>
              </div>
              <div
                style={{
                  background: "oklch(0.82 0.14 75)",
                  color: "oklch(0.10 0.06 155)",
                  padding: "10px 24px",
                  borderRadius: "99px",
                  fontSize: "14px",
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                }}
              >
                Choose Video File
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="sr-only"
                aria-label="Upload personal video file"
                onChange={handleInputChange}
              />
            </div>
          ) : (
            <video
              ref={videoRef}
              key={activeSrc}
              src={activeSrc}
              poster={activePoster}
              controls
              playsInline
              className="w-full"
              style={{ maxHeight: "60vh", display: "block" }}
              aria-label={
                tab === "personal"
                  ? "Your personal support worker profile video"
                  : "15-second sample support worker profile video showing experiences, knowledge and human connection"
              }
            >
              <track kind="captions" label="English captions" srcLang="en" default />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Replace video button (when personal video is loaded) */}
        {tab === "personal" && personalVideoUrl && (
          <div style={{ padding: "10px 16px", borderTop: "1px solid oklch(0.72 0.14 75 / 15%)", display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: "transparent",
                border: "1.5px solid oklch(0.72 0.14 75 / 40%)",
                borderRadius: "8px",
                color: "oklch(0.65 0.04 155)",
                padding: "6px 14px",
                fontSize: "12px",
                fontFamily: "'Outfit', sans-serif",
                cursor: "pointer",
              }}
              aria-label="Replace your personal video with a different file"
            >
              ↺ Replace Video
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="sr-only"
              aria-label="Replace personal video file"
              onChange={handleInputChange}
            />
          </div>
        )}

        {/* Description */}
        <div className="px-5 py-4">
          <p className="text-sm leading-relaxed" style={{ color: "oklch(0.70 0.04 155)", fontFamily: "'Outfit', sans-serif" }}>
            {tab === "personal" && personalVideoUrl ? (
              <>
                <strong style={{ color: "oklch(0.88 0.04 130)" }}>Your video:</strong> This is your personal profile video. Clients and support coordinators will see this when they tap your profile.
              </>
            ) : (
              <>
                <strong style={{ color: "oklch(0.88 0.04 130)" }}>Sample video:</strong> A cinematic eye-opener — support can look like this. Surfing at golden hour, tandem ATV through the bush, calm low-demand moments for autism, and real AAC communication in action. Uplifting, real, and human.
              </>
            )}
          </p>
          <div className="flex flex-wrap gap-2 mt-3" role="list" aria-label="Video themes">
            {["Surfing", "Tandem ATV", "Autism Support", "AAC Communication", "Human Connection", "Person-Centred"].map(tag => (
              <span
                key={tag}
                role="listitem"
                className="text-xs px-2.5 py-1 rounded-full"
                style={{
                  background: "oklch(0.72 0.14 75 / 10%)",
                  border: "1px solid oklch(0.72 0.14 75 / 25%)",
                  color: "oklch(0.72 0.14 75 / 80%)",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
