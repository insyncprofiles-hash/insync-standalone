import { useState, useEffect } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      style={{
        position: "fixed",
        bottom: "28px",
        right: "24px",
        zIndex: 9990,
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #ff4ecb 0%, #ff8c00 60%, #ffe600 100%)",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 20px rgba(255,78,203,0.45), 0 2px 8px rgba(0,0,0,0.20)",
        transition: "transform 0.16s cubic-bezier(0.23,1,0.32,1), box-shadow 0.16s cubic-bezier(0.23,1,0.32,1)",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.12)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 28px rgba(255,78,203,0.60), 0 2px 10px rgba(0,0,0,0.25)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(255,78,203,0.45), 0 2px 8px rgba(0,0,0,0.20)";
      }}
      onMouseDown={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.94)";
      }}
      onMouseUp={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.12)";
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
