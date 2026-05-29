/* ============================================================
   EditorPanel — Right-side editing controls
   Design: Midnight Luxury Accessibility (Navy + Gold)
   ============================================================ */
import { useState } from "react";
import type { ProfileData, ServiceItem, ExperienceGroup } from "@/pages/Home";

interface Props {
  profile: ProfileData;
  activeTab: "profile" | "services" | "experience" | "style" | "preview";
  onTabChange: (tab: "profile" | "services" | "experience" | "style" | "preview") => void;
  onUpdate: (updates: Partial<ProfileData>) => void;
  onServiceToggle: (id: string) => void;
  onServiceUpdate: (id: string, updates: Partial<ServiceItem>) => void;
  onExperienceToggle: (groupId: string, itemId: string) => void;
  onExperienceGroupToggle: (groupId: string, checked: boolean) => void;
}

const TABS = [
  { id: "profile" as const, label: "Profile", icon: "👤" },
  { id: "services" as const, label: "Services", icon: "⚙️" },
  { id: "experience" as const, label: "Experience", icon: "🏅" },
  { id: "style" as const, label: "Style", icon: "🎨" },
  { id: "preview" as const, label: "Caption", icon: "📝" },
];

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold tracking-wide uppercase" style={{ color: "var(--theme-accent)", fontFamily: "'Outfit', sans-serif" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function TextInput({
  value, onChange, placeholder, multiline = false, maxLength,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean; maxLength?: number;
}) {
  const baseStyle: React.CSSProperties = {
    background: "var(--theme-card2)",
    border: "1.5px solid oklch(0.72 0.14 75 / 30%)",
    borderRadius: "8px",
    color: "var(--theme-text-light)",
    padding: "9px 12px",
    fontSize: "14px",
    fontFamily: "'Outfit', sans-serif",
    width: "100%",
    outline: "none",
    transition: "border-color 180ms ease-out",
    resize: multiline ? "vertical" : "none",
  };

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={3}
        style={baseStyle}
        onFocus={e => (e.target.style.borderColor = "var(--theme-accent)")}
        onBlur={e => (e.target.style.borderColor = "oklch(0.72 0.14 75 / 30%)")}
        aria-label={placeholder}
      />
    );
  }
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      style={baseStyle}
      onFocus={e => (e.target.style.borderColor = "var(--theme-accent)")}
      onBlur={e => (e.target.style.borderColor = "oklch(0.72 0.14 75 / 30%)")}
      aria-label={placeholder}
    />
  );
}

function ExperienceGroupCard({
  group,
  onItemToggle,
  onGroupToggle,
}: {
  group: ExperienceGroup;
  onItemToggle: (itemId: string) => void;
  onGroupToggle: (checked: boolean) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const checkedCount = group.items.filter(i => i.checked).length;
  const allChecked = checkedCount === group.items.length;
  const someChecked = checkedCount > 0 && !allChecked;

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: checkedCount > 0 ? "oklch(0.72 0.14 75 / 7%)" : "var(--theme-card2)",
        border: `1.5px solid ${checkedCount > 0 ? "oklch(0.72 0.14 75 / 40%)" : "oklch(0.72 0.14 75 / 18%)"}`,
      }}
    >
      {/* Group header */}
      <div className="flex items-center gap-3 p-3">
        {/* Select-all checkbox */}
        <button
          role="checkbox"
          aria-checked={allChecked ? true : someChecked ? "mixed" : false}
          aria-label={`Select all ${group.title}`}
          onClick={() => onGroupToggle(!allChecked)}
          className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-all duration-150"
          style={{
            background: allChecked ? "var(--theme-accent)" : someChecked ? "oklch(0.72 0.14 75 / 40%)" : "var(--theme-bg)",
            border: `2px solid ${allChecked || someChecked ? "var(--theme-accent)" : "oklch(0.72 0.14 75 / 30%)"}`,
          }}
        >
          {allChecked && <span style={{ color: "var(--theme-accent-text)", fontSize: "11px", lineHeight: 1 }}>✓</span>}
          {someChecked && <span style={{ color: "var(--theme-accent-text)", fontSize: "11px", lineHeight: 1 }}>−</span>}
        </button>

        <span className="text-base" aria-hidden="true">{group.icon}</span>

        <button
          onClick={() => setExpanded(e => !e)}
          className="flex-1 text-left flex items-center justify-between"
          aria-expanded={expanded}
          aria-controls={`exp-group-${group.id}`}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <span className="text-sm font-semibold" style={{ color: "var(--theme-text-light)", fontFamily: "'Outfit', sans-serif" }}>
            {group.title}
          </span>
          <span className="flex items-center gap-2">
            {checkedCount > 0 && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: "oklch(0.72 0.14 75 / 20%)", color: "var(--theme-accent)" }}
              >
                {checkedCount}/{group.items.length}
              </span>
            )}
            <span
              className="text-xs transition-transform duration-200"
              style={{
                color: "var(--theme-text-dim)",
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                display: "inline-block",
              }}
              aria-hidden="true"
            >
              ▾
            </span>
          </span>
        </button>
      </div>

      {/* Expandable items */}
      {expanded && (
        <div
          id={`exp-group-${group.id}`}
          className="px-3 pb-3 grid grid-cols-1 gap-1.5"
          role="group"
          aria-label={`${group.title} options`}
        >
          {group.items.map(item => (
            <button
              key={item.id}
              role="checkbox"
              aria-checked={item.checked}
              onClick={() => onItemToggle(item.id)}
              className="flex items-center gap-2.5 p-2 rounded-lg text-left transition-all duration-150 hover:bg-white/5"
              style={{ background: "none", border: "none", cursor: "pointer", width: "100%" }}
              aria-label={item.label}
            >
              {/* Checkbox visual */}
              <span
                className="flex-shrink-0 w-4 h-4 rounded flex items-center justify-center transition-all duration-150"
                style={{
                  background: item.checked ? "var(--theme-accent)" : "var(--theme-bg)",
                  border: `2px solid ${item.checked ? "var(--theme-accent)" : "oklch(0.72 0.14 75 / 30%)"}`,
                }}
                aria-hidden="true"
              >
                {item.checked && <span style={{ color: "var(--theme-accent-text)", fontSize: "9px", lineHeight: 1 }}>✓</span>}
              </span>
              <span
                className="text-sm"
                style={{
                  color: item.checked ? "var(--theme-text-light)" : "var(--theme-text-dim)",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EditorPanel({
  profile, activeTab, onTabChange, onUpdate,
  onServiceToggle, onServiceUpdate,
  onExperienceToggle, onExperienceGroupToggle,
}: Props) {
  const [editingBadge, setEditingBadge] = useState<number | null>(null);

  const updateBadge = (i: number, val: string) => {
    const badges = [...profile.badges];
    badges[i] = val;
    onUpdate({ badges });
  };

  const addBadge = () => {
    if (profile.badges.length < 6) {
      onUpdate({ badges: [...profile.badges, "New Badge"] });
      setEditingBadge(profile.badges.length);
    }
  };

  const removeBadge = (i: number) => {
    onUpdate({ badges: profile.badges.filter((_, idx) => idx !== i) });
  };

  const totalChecked = profile.experienceGroups.reduce(
    (acc, g) => acc + g.items.filter(i => i.checked).length, 0
  );

  const generateCaption = () => {
    const checkedExp = profile.experienceGroups
      .flatMap(g => g.items.filter(i => i.checked).map(i => i.label));
    const expLine = checkedExp.length > 0
      ? `\n\n💼 Experience with: ${checkedExp.slice(0, 6).join(", ")}${checkedExp.length > 6 ? " & more" : ""}`
      : "";
    return `✨ ${profile.tagline}

Choose how I can support you today.

${profile.services.filter(s => s.selected).map(s => `${s.icon} ${s.label} — ${s.description}`).join("\n")}${expLine}

📍 ${profile.location}${profile.phone ? `\n📞 ${profile.phone}` : ""}\n📧 ${profile.email}
${profile.website ? `🌐 ${profile.website}` : ""}

${profile.ctaText} ★

#SupportWorker #NDIS #Accessibility #Inclusion #DisabilitySupport #PersonCentredCare #NDIS2024 #SupportWorkerLife`;
  };

  const panelStyle: React.CSSProperties = {
    background: "var(--theme-card)",
    border: "1.5px solid oklch(0.72 0.14 75 / 25%)",
    borderRadius: "16px",
    overflow: "hidden",
  };

  return (
    <div style={panelStyle} role="region" aria-label="Template editor">
      {/* Tab bar — scrollable on mobile */}
      <div
        className="flex border-b overflow-x-auto"
        style={{ borderColor: "oklch(0.72 0.14 75 / 20%)", padding: "8px 12px 0", gap: "4px", scrollbarWidth: "none" }}
        role="tablist"
        aria-label="Editor sections"
      >
        {TABS.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className="panel-tab flex-shrink-0"
            style={activeTab === tab.id ? {
              color: "var(--theme-accent)",
              background: "oklch(0.72 0.14 75 / 15%)",
              border: "1px solid oklch(0.72 0.14 75 / 40%)",
              borderRadius: "8px 8px 0 0",
              borderBottom: "none",
              marginBottom: "-1px",
            } : {}}
          >
            <span aria-hidden="true" className="mr-1">{tab.icon}</span>
            {tab.label}
            {tab.id === "experience" && totalChecked > 0 && (
              <span
                className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-semibold"
                style={{ background: "oklch(0.72 0.14 75 / 25%)", color: "var(--theme-accent)" }}
              >
                {totalChecked}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Panel content */}
      <div className="p-5" style={{ maxHeight: "600px", overflowY: "auto" }}>

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div id="panel-profile" role="tabpanel" aria-label="Profile editor" className="flex flex-col gap-4 animate-fade-in-up">
            <FieldRow label="Your Name">
              <TextInput value={profile.name} onChange={v => onUpdate({ name: v })} placeholder="Your full name" maxLength={50} />
            </FieldRow>
            <FieldRow label="Tagline">
              <TextInput value={profile.tagline} onChange={v => onUpdate({ tagline: v })} placeholder="e.g. I get it. I see you. I'm here." maxLength={60} />
            </FieldRow>
            <FieldRow label="About You">
              <TextInput value={profile.bio} onChange={v => onUpdate({ bio: v })} placeholder="A short bio about your approach and values..." multiline maxLength={280} />
            </FieldRow>
            <FieldRow label="Location">
              <TextInput value={profile.location} onChange={v => onUpdate({ location: v })} placeholder="City, State" maxLength={40} />
            </FieldRow>
            <FieldRow label="Phone (optional)">
              <TextInput value={profile.phone} onChange={v => onUpdate({ phone: v })} placeholder="Leave blank to hide call button" maxLength={20} />
            </FieldRow>
            <FieldRow label="Email">
              <TextInput value={profile.email} onChange={v => onUpdate({ email: v })} placeholder="hello@yourname.com.au" maxLength={60} />
            </FieldRow>
            <FieldRow label="Website (optional)">
              <TextInput value={profile.website} onChange={v => onUpdate({ website: v })} placeholder="www.yourname.com.au" maxLength={60} />
            </FieldRow>
            <FieldRow label="Instagram Handle (optional)">
              <TextInput value={profile.instagram} onChange={v => onUpdate({ instagram: v })} placeholder="@yourhandle" maxLength={40} />
            </FieldRow>
            <FieldRow label="CTA Button Text">
              <TextInput value={profile.ctaText} onChange={v => onUpdate({ ctaText: v })} placeholder="MESSAGE TO BEGIN" maxLength={30} />
            </FieldRow>

            {/* Badges */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold tracking-wide uppercase" style={{ color: "var(--theme-accent)", fontFamily: "'Outfit', sans-serif" }}>
                  Certifications &amp; Badges
                </label>
                {profile.badges.length < 6 && (
                  <button
                    onClick={addBadge}
                    className="text-xs px-2 py-1 rounded-lg transition-all duration-150 active:scale-95"
                    style={{ background: "oklch(0.72 0.14 75 / 15%)", color: "var(--theme-accent)", fontFamily: "'Outfit', sans-serif" }}
                    aria-label="Add new certification badge"
                  >
                    + Add
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-2" role="list" aria-label="Your certifications">
                {profile.badges.map((badge, i) => (
                  <div key={i} className="flex items-center gap-2" role="listitem">
                    {editingBadge === i ? (
                      <input
                        autoFocus
                        type="text"
                        value={badge}
                        onChange={e => updateBadge(i, e.target.value)}
                        onBlur={() => setEditingBadge(null)}
                        onKeyDown={e => { if (e.key === "Enter") setEditingBadge(null); }}
                        maxLength={40}
                        className="flex-1 text-sm px-3 py-2 rounded-lg"
                        style={{
                          background: "var(--theme-card2)",
                          border: "1.5px solid oklch(0.82 0.14 75)",
                          color: "var(--theme-text-light)",
                          fontFamily: "'Outfit', sans-serif",
                          outline: "none",
                        }}
                        aria-label={`Edit badge: ${badge}`}
                      />
                    ) : (
                      <button
                        onClick={() => setEditingBadge(i)}
                        className="flex-1 text-left text-sm px-3 py-2 rounded-lg transition-all duration-150"
                        style={{
                          background: "var(--theme-card2)",
                          border: "1.5px solid oklch(0.72 0.14 75 / 25%)",
                          color: "oklch(0.82 0.04 130)",
                          fontFamily: "'Outfit', sans-serif",
                        }}
                        aria-label={`Edit badge: ${badge}`}
                      >
                        {badge}
                      </button>
                    )}
                    <button
                      onClick={() => removeBadge(i)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 hover:bg-red-500/20"
                      style={{ color: "var(--theme-text-dim)", flexShrink: 0 }}
                      aria-label={`Remove badge: ${badge}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SERVICES TAB */}
        {activeTab === "services" && (
          <div id="panel-services" role="tabpanel" aria-label="Services editor" className="flex flex-col gap-4 animate-fade-in-up">
            <p className="text-sm" style={{ color: "var(--theme-text-dim)", fontFamily: "'Outfit', sans-serif" }}>
              Toggle services on/off and customise their labels and descriptions. Selected services appear in your post.
            </p>
            {profile.services.map(service => (
              <div
                key={service.id}
                className="rounded-xl p-4 flex flex-col gap-3"
                style={{
                  background: service.selected ? "oklch(0.72 0.14 75 / 8%)" : "var(--theme-card2)",
                  border: `1.5px solid ${service.selected ? "oklch(0.72 0.14 75 / 45%)" : "oklch(0.72 0.14 75 / 18%)"}`,
                  transition: "all 200ms ease-out",
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl" aria-hidden="true">{service.icon}</span>
                    <span className="font-semibold text-sm" style={{ color: service.selected ? "oklch(0.85 0.12 78)" : "oklch(0.70 0.04 155)", fontFamily: "'Outfit', sans-serif" }}>
                      {service.label}
                    </span>
                  </div>
                  <button
                    role="switch"
                    aria-checked={service.selected}
                    aria-label={`${service.selected ? "Disable" : "Enable"} ${service.label} service`}
                    onClick={() => onServiceToggle(service.id)}
                    className="relative rounded-full transition-all duration-200 flex-shrink-0"
                    style={{
                      width: "44px", height: "24px",
                      background: service.selected ? "var(--theme-accent)" : "var(--theme-bg)",
                      border: "none", cursor: "pointer",
                    }}
                  >
                    <span
                      className="absolute top-1 rounded-full transition-all duration-200"
                      style={{ width: "16px", height: "16px", background: "white", left: service.selected ? "24px" : "4px" }}
                      aria-hidden="true"
                    />
                  </button>
                </div>
                {service.selected && (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-xs" style={{ color: "var(--theme-text-dim)", fontFamily: "'Outfit', sans-serif" }}>Icon</label>
                        <input
                          type="text"
                          value={service.icon}
                          onChange={e => onServiceUpdate(service.id, { icon: e.target.value })}
                          maxLength={2}
                          className="w-full text-center text-lg rounded-lg py-1"
                          style={{
                            background: "var(--theme-card2)",
                            border: "1.5px solid oklch(0.72 0.14 75 / 30%)",
                            color: "var(--theme-text-light)",
                            outline: "none",
                            fontFamily: "'Outfit', sans-serif",
                          }}
                          aria-label={`Icon for ${service.label} service`}
                        />
                      </div>
                      <div className="flex-[2]">
                        <label className="text-xs" style={{ color: "var(--theme-text-dim)", fontFamily: "'Outfit', sans-serif" }}>Label</label>
                        <input
                          type="text"
                          value={service.label}
                          onChange={e => onServiceUpdate(service.id, { label: e.target.value.toUpperCase() })}
                          maxLength={10}
                          className="w-full text-sm rounded-lg px-3 py-1"
                          style={{
                            background: "var(--theme-card2)",
                            border: "1.5px solid oklch(0.72 0.14 75 / 30%)",
                            color: "var(--theme-text-light)",
                            outline: "none",
                            fontFamily: "'Outfit', sans-serif",
                          }}
                          aria-label={`Label for ${service.label} service`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs" style={{ color: "var(--theme-text-dim)", fontFamily: "'Outfit', sans-serif" }}>Description</label>
                      <input
                        type="text"
                        value={service.description}
                        onChange={e => onServiceUpdate(service.id, { description: e.target.value })}
                        maxLength={50}
                        className="w-full text-sm rounded-lg px-3 py-1.5"
                        style={{
                          background: "var(--theme-card2)",
                          border: "1.5px solid oklch(0.72 0.14 75 / 30%)",
                          color: "var(--theme-text-light)",
                          outline: "none",
                          fontFamily: "'Outfit', sans-serif",
                        }}
                        aria-label={`Description for ${service.label} service`}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* EXPERIENCE TAB */}
        {activeTab === "experience" && (
          <div id="panel-experience" role="tabpanel" aria-label="Experience editor" className="flex flex-col gap-3 animate-fade-in-up">
            {/* Header */}
            <div className="rounded-xl p-3" style={{ background: "oklch(0.72 0.14 75 / 8%)", border: "1.5px solid oklch(0.72 0.14 75 / 25%)" }}>
              <p className="text-sm font-semibold mb-1" style={{ color: "oklch(0.85 0.12 78)", fontFamily: "'Outfit', sans-serif" }}>
                🏅 Your Experience Areas
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--theme-text-dim)", fontFamily: "'Outfit', sans-serif" }}>
                Tick the disability types and support areas you have experience with. These will appear in your social media caption and help clients find the right match.
              </p>
              {totalChecked > 0 && (
                <p className="text-xs mt-2 font-semibold" style={{ color: "var(--theme-accent)" }}>
                  ✓ {totalChecked} area{totalChecked !== 1 ? "s" : ""} selected
                </p>
              )}
            </div>

            {/* Groups */}
            {profile.experienceGroups.map(group => (
              <ExperienceGroupCard
                key={group.id}
                group={group}
                onItemToggle={(itemId) => onExperienceToggle(group.id, itemId)}
                onGroupToggle={(checked) => onExperienceGroupToggle(group.id, checked)}
              />
            ))}

            {/* Clear all */}
            {totalChecked > 0 && (
              <button
                onClick={() => profile.experienceGroups.forEach(g => onExperienceGroupToggle(g.id, false))}
                className="text-xs py-2 rounded-xl transition-all duration-150 active:scale-95"
                style={{
                  background: "transparent",
                  border: "1.5px solid oklch(0.72 0.14 75 / 20%)",
                  color: "var(--theme-text-dim)",
                  fontFamily: "'Outfit', sans-serif",
                  cursor: "pointer",
                }}
                aria-label="Clear all experience selections"
              >
                Clear all selections
              </button>
            )}
          </div>
        )}

        {/* STYLE TAB */}
        {activeTab === "style" && (
          <div id="panel-style" role="tabpanel" aria-label="Style options" className="flex flex-col gap-5 animate-fade-in-up">
            <div>
              <p className="text-sm mb-3" style={{ color: "var(--theme-text-dim)", fontFamily: "'Outfit', sans-serif" }}>
                Accessibility &amp; Display Options
              </p>
              <div className="flex flex-col gap-3">
              </div>
            </div>

            <div className="rounded-xl p-4" style={{ background: "oklch(0.72 0.14 75 / 8%)", border: "1.5px solid oklch(0.72 0.14 75 / 30%)" }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: "oklch(0.85 0.12 78)", fontFamily: "'Outfit', sans-serif" }}>
                ◎ Accessibility Features
              </h3>
              <ul className="flex flex-col gap-2" role="list">
                {[
                  "WCAG 2.1 AA colour contrast on all text",
                  "Full keyboard navigation support",
                  "ARIA labels on all interactive elements",
                  "Screen reader compatible markup",
                  "Reduced motion support (prefers-reduced-motion)",
                  "Skip to main content link",
                  "Semantic HTML structure",
                  "Alt text on all images",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "oklch(0.70 0.04 155)", fontFamily: "'Outfit', sans-serif" }} role="listitem">
                    <span style={{ color: "var(--theme-accent)", flexShrink: 0 }} aria-hidden="true">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl p-4" style={{ background: "var(--theme-card2)", border: "1.5px solid oklch(0.72 0.14 75 / 20%)" }}>
              <h3 className="text-sm font-semibold mb-2" style={{ color: "oklch(0.85 0.12 78)", fontFamily: "'Outfit', sans-serif" }}>
                ✓ Inclusion Statement
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--theme-text-dim)", fontFamily: "'Outfit', sans-serif" }}>
                This template is designed to celebrate diversity and inclusion. It supports workers of all backgrounds, abilities, and identities. The design prioritises dignity, respect, and person-centred communication.
              </p>
            </div>
          </div>
        )}

        {/* CAPTION TAB */}
        {activeTab === "preview" && (
          <div id="panel-preview" role="tabpanel" aria-label="Caption preview" className="flex flex-col gap-4 animate-fade-in-up">
            <p className="text-sm" style={{ color: "var(--theme-text-dim)", fontFamily: "'Outfit', sans-serif" }}>
              Your ready-to-post social media caption, generated from your profile details.
            </p>
            <div
              className="rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap"
              style={{
                background: "var(--theme-card2)",
                border: "1.5px solid oklch(0.72 0.14 75 / 25%)",
                color: "oklch(0.82 0.04 130)",
                fontFamily: "'Outfit', sans-serif",
                fontSize: "13px",
                maxHeight: "320px",
                overflowY: "auto",
              }}
              role="region"
              aria-label="Generated social media caption"
              aria-live="polite"
            >
              {generateCaption()}
            </div>
            <button
              onClick={() => { navigator.clipboard.writeText(generateCaption()); }}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95"
              style={{ background: "var(--theme-accent)", color: "var(--theme-accent-text)", fontFamily: "'Outfit', sans-serif" }}
              aria-label="Copy caption to clipboard"
            >
              📋 Copy Caption to Clipboard
            </button>

            <div>
              <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "oklch(0.72 0.14 75 / 70%)", fontFamily: "'Outfit', sans-serif" }}>
                Suggested Hashtags
              </p>
              <div className="flex flex-wrap gap-1.5" role="list" aria-label="Suggested hashtags">
                {["#SupportWorker", "#NDIS", "#Accessibility", "#Inclusion", "#DisabilitySupport", "#PersonCentredCare", "#SupportWorkerLife", "#DisabilityInclusion", "#NDISProvider", "#CommunitySupport"].map(tag => (
                  <span
                    key={tag}
                    role="listitem"
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      background: "oklch(0.72 0.14 75 / 10%)",
                      border: "1px solid oklch(0.72 0.14 75 / 25%)",
                      color: "var(--theme-accent)",
                      fontFamily: "'Outfit', sans-serif",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
