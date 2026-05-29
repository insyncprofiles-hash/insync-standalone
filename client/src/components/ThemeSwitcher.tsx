/* ============================================================
   ThemeSwitcher — floating colour palette picker
   Shows 6 theme swatches, saves preference to localStorage
   ============================================================ */
import { useState } from "react";
import { useColorTheme } from "@/contexts/ColorThemeContext";

export default function ThemeSwitcher() {
  const { theme, setThemeId, themes } = useColorTheme();
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "80px",
        right: "20px",
        zIndex: 9998,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "8px",
      }}
    >
      {/* Expanded palette panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Choose colour theme"
          style={{
            background: "var(--theme-card, oklch(0.13 0.06 155))",
            border: "1.5px solid var(--theme-border, oklch(0.72 0.14 75 / 25%))",
            borderRadius: "20px",
            padding: "16px",
            width: "240px",
            boxShadow: "0 8px 32px oklch(0 0 0 / 50%)",
            animation: "fadeInUp 180ms cubic-bezier(0.23,1,0.32,1)",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--theme-text-dim, oklch(0.50 0.04 155))",
              marginBottom: "12px",
            }}
          >
            🎨 Colour Theme
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => { setThemeId(t.id); }}
                aria-pressed={theme.id === t.id}
                aria-label={`${t.name} theme — ${t.description}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 10px",
                  borderRadius: "12px",
                  border: theme.id === t.id
                    ? `1.5px solid ${t.accent}`
                    : "1.5px solid transparent",
                  background: theme.id === t.id
                    ? `${t.accent}18`
                    : "transparent",
                  cursor: "pointer",
                  transition: "all 150ms ease-out",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                {/* Colour swatch */}
                <div
                  aria-hidden="true"
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "8px",
                    background: `linear-gradient(135deg, ${t.postBg} 0%, ${t.accent} 100%)`,
                    border: "1px solid oklch(1 0 0 / 15%)",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                  }}
                >
                  {t.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      fontFamily: "'Outfit', sans-serif",
                      color: theme.id === t.id
                        ? t.accent
                        : "var(--theme-text-light, oklch(0.96 0.01 78))",
                      margin: 0,
                      lineHeight: 1.2,
                    }}
                  >
                    {t.name}
                  </p>
                  <p
                    style={{
                      fontSize: "10px",
                      fontFamily: "'Outfit', sans-serif",
                      color: "var(--theme-text-dim, oklch(0.50 0.04 155))",
                      margin: 0,
                      lineHeight: 1.3,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {t.description}
                  </p>
                </div>
                {theme.id === t.id && (
                  <span aria-hidden="true" style={{ fontSize: "14px", flexShrink: 0 }}>✓</span>
                )}
              </button>
            ))}
          </div>

          <p
            style={{
              fontSize: "10px",
              fontFamily: "'Outfit', sans-serif",
              color: "var(--theme-text-dim, oklch(0.50 0.04 155))",
              marginTop: "12px",
              textAlign: "center",
            }}
          >
            Theme saves automatically
          </p>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? "Close colour theme picker" : "Open colour theme picker"}
        aria-expanded={open}
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: "var(--theme-card, oklch(0.13 0.06 155))",
          border: `1.5px solid var(--theme-accent, oklch(0.72 0.14 75))`,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          boxShadow: `0 4px 16px var(--theme-accent-glow, oklch(0.72 0.14 75 / 30%))`,
          transition: "transform 150ms ease-out, box-shadow 150ms ease-out",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
        onMouseDown={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.95)";
        }}
        onMouseUp={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
        }}
      >
        🎨
      </button>
    </div>
  );
}
