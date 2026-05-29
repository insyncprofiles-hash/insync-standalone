/* ============================================================
   TemplateHeader — uses ColorThemeContext for dynamic theming
   ============================================================ */
import { Link } from "wouter";
import { useColorTheme } from "@/contexts/ColorThemeContext";

export default function TemplateHeader() {
  const { theme } = useColorTheme();

  return (
    <header
      className="w-full py-4 px-6 flex items-center justify-between"
      style={{
        background: theme.bgCard,
        borderBottom: `1px solid ${theme.accent}33`,
        backdropFilter: "blur(10px)",
      }}
      role="banner"
    >
      <div className="flex items-center gap-3">
        {/* Logo mark */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: theme.accent, flexShrink: 0 }}
          aria-hidden="true"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.accentText} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold leading-tight" style={{ color: theme.accent, fontFamily: "'Outfit', sans-serif", letterSpacing: "0.05em" }}>
            SUPPORT WORKER
          </p>
          <p className="text-xs leading-tight" style={{ color: theme.textDim, fontFamily: "'Outfit', sans-serif" }}>
            Profile Template
          </p>
        </div>
      </div>

      <nav className="flex items-center gap-2" aria-label="Main navigation">
        {/* How to Use link */}
        <Link href="/how-to-use">
          <a
            className="hidden md:inline-flex"
            style={{
              color: theme.textMid,
              fontSize: "12px",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 500,
              textDecoration: "none",
              padding: "6px 10px",
              borderRadius: "8px",
              transition: "color 150ms",
              whiteSpace: "nowrap",
            }}
            aria-label="How to use the template"
          >
            How to Use
          </a>
        </Link>

        {/* Accessibility badge */}
        <span
          className="hidden sm:inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
          style={{
            background: `${theme.accent}1f`,
            border: `1px solid ${theme.accent}4d`,
            color: theme.accent,
            fontFamily: "'Outfit', sans-serif",
          }}
          aria-label="WCAG 2.1 AA Accessible"
        >
          <span aria-hidden="true">✶</span> WCAG 2.1 AA
        </span>

        {/* Editable badge */}
        <span
          className="hidden sm:inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
          style={{
            background: `${theme.accent}1f`,
            border: `1px solid ${theme.accent}4d`,
            color: theme.accent,
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          <span aria-hidden="true">✏️</span> Editable
        </span>

        {/* Pricing CTA */}
        <Link href="/pricing">
          <a
            style={{
              background: theme.accent,
              color: theme.accentText,
              fontSize: "12px",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              letterSpacing: "0.04em",
              padding: "8px 18px",
              borderRadius: "99px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: `0 2px 12px ${theme.accentGlow}`,
              transition: "opacity 150ms",
              whiteSpace: "nowrap",
            }}
            aria-label="View pricing and purchase options"
          >
            <span aria-hidden="true">🛒</span>
            <span className="hidden sm:inline">Buy Template</span>
            <span className="sm:hidden">Buy</span>
          </a>
        </Link>
      </nav>
    </header>
  );
}
