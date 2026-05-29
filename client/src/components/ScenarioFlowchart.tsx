/* ============================================================
   ScenarioFlowchart.tsx — Animated gradient flowchart
   Steps light up in sequence, gradient pulses flow along
   connectors, loops like a video. Teal/gold palette.
   ============================================================ */
import { useEffect, useRef, useState } from "react";

export interface FlowStep {
  icon: string;
  label: string;
  sublabel?: string;
}

export interface FlowBenefit {
  icon: string;
  text: string;
}

export interface FlowchartData {
  problemIcon: string;
  problem: string;
  steps: FlowStep[];
  benefits: FlowBenefit[];
  accentColor: string;
  accentGlow: string;
}

interface Props {
  data: FlowchartData;
  /** Unique id for SVG gradient ids to avoid collisions */
  uid: string;
}

const STEP_DURATION = 900;   // ms each step stays lit before advancing
const PULSE_DURATION = 600;  // ms the connector pulse takes to travel
const HOLD_BENEFITS = 2200;  // ms benefits stay visible before restart
const TOTAL_STEPS_BEFORE_BENEFITS = (n: number) => n * STEP_DURATION + (n - 1) * PULSE_DURATION;

export default function ScenarioFlowchart({ data, uid }: Props) {
  const isGold = data.accentColor === "#f5c842";
  const gradFrom = isGold ? "#f5c842" : "#2dd4bf";
  const gradTo   = isGold ? "#e8820a" : "#0ea5e9";
  const gradMid  = isGold ? "#f59e0b" : "#14b8a6";

  const n = data.steps.length;

  // activeStep: -1 = problem lit, 0..n-1 = step lit, n = benefits lit
  const [activeStep, setActiveStep] = useState<number>(-2); // -2 = idle before start
  const [pulseIdx, setPulseIdx] = useState<number>(-1);     // which connector is pulsing
  // Benefits are always shown; benefitsVisible = true means they are highlighted/glowing
  const [benefitsVisible, setBenefitsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const runningRef = useRef(false);

  function clearTimer() {
    if (timerRef.current) clearTimeout(timerRef.current);
  }

  function runSequence() {
    if (!runningRef.current) return;
    setActiveStep(-1);
    setPulseIdx(-1);
    // Benefits stay visible — only reset the highlight state

    // Problem box lights up → then step 0
    timerRef.current = setTimeout(() => {
      if (!runningRef.current) return;
      advanceToStep(0);
    }, STEP_DURATION);
  }

  function advanceToStep(idx: number) {
    if (!runningRef.current) return;
    if (idx >= n) {
      // All steps done — highlight benefits, then loop
      setPulseIdx(-1);
      setBenefitsVisible(true);
      timerRef.current = setTimeout(() => {
        if (!runningRef.current) return;
        // Keep benefits visible but dim the highlight before restarting
        setBenefitsVisible(false);
        setActiveStep(-2);
        timerRef.current = setTimeout(() => {
          if (!runningRef.current) return;
          runSequence();
        }, 400);
      }, HOLD_BENEFITS);
      return;
    }

    // Pulse the connector before this step (if not first)
    if (idx > 0) {
      setPulseIdx(idx - 1);
      timerRef.current = setTimeout(() => {
        if (!runningRef.current) return;
        setPulseIdx(-1);
        setActiveStep(idx);
        timerRef.current = setTimeout(() => {
          advanceToStep(idx + 1);
        }, STEP_DURATION);
      }, PULSE_DURATION);
    } else {
      setActiveStep(idx);
      timerRef.current = setTimeout(() => {
        advanceToStep(idx + 1);
      }, STEP_DURATION);
    }
  }

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !runningRef.current) {
          runningRef.current = true;
          runSequence();
        } else if (!entry.isIntersecting && runningRef.current) {
          runningRef.current = false;
          clearTimer();
          setActiveStep(-2);
          setPulseIdx(-1);
          // Keep benefits visible when scrolled away
        }
      },
      { threshold: 0.3 }
    );
    if (containerRef.current) observerRef.current.observe(containerRef.current);
    return () => {
      runningRef.current = false;
      clearTimer();
      observerRef.current?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const problemActive = activeStep === -1;

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        marginTop: "32px",
        borderRadius: "20px",
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${data.accentColor}33`,
        boxShadow: `0 0 40px ${data.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.06)`,
        padding: "28px 20px 24px",
        fontFamily: "'Outfit', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow orb */}
      <div style={{
        position: "absolute",
        top: "-60px",
        right: "-60px",
        width: "200px",
        height: "200px",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${data.accentColor}18 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <div style={{
          width: "6px", height: "6px", borderRadius: "50%",
          background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`,
          boxShadow: `0 0 8px ${data.accentColor}88`,
        }} />
        <span style={{
          fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
          background: `linear-gradient(90deg, ${gradFrom}, ${gradTo})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Real-World Journey
        </span>
        {/* Animated dot indicator */}
        <div style={{ marginLeft: "auto", display: "flex", gap: "4px", alignItems: "center" }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: "5px", height: "5px", borderRadius: "50%",
              background: data.accentColor,
              opacity: activeStep === -2 ? 0.2 : 0.9,
              animation: activeStep !== -2 ? `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite` : "none",
            }} />
          ))}
        </div>
      </div>

      {/* ── PROBLEM BOX ── */}
      <div style={{
        background: problemActive
          ? `linear-gradient(135deg, ${gradFrom}22, ${gradTo}22)`
          : "rgba(255,255,255,0.05)",
        border: `1px solid ${problemActive ? gradFrom + "88" : "rgba(255,255,255,0.10)"}`,
        borderRadius: "14px",
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
        boxShadow: problemActive ? `0 0 24px ${data.accentColor}44` : "none",
      }}>
        <div style={{
          width: "44px", height: "44px", borderRadius: "12px",
          background: problemActive ? `${gradFrom}33` : "rgba(255,255,255,0.06)",
          border: `1px solid ${problemActive ? gradFrom + "66" : "rgba(255,255,255,0.12)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "22px", flexShrink: 0,
          transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
          transform: problemActive ? "scale(1.08)" : "scale(1)",
        }}>
          {data.problemIcon}
        </div>
        <div>
          <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "3px" }}>
            The Challenge
          </div>
          <div style={{ fontSize: "13px", fontWeight: 500, color: problemActive ? "#fff" : "rgba(255,255,255,0.75)", lineHeight: 1.4, transition: "color 0.3s" }}>
            {data.problem}
          </div>
        </div>
      </div>

      {/* Down arrow from problem */}
      <DownArrow gradFrom={gradFrom} gradTo={gradTo} uid={`${uid}-d0`} active={activeStep >= 0} />

      {/* ── STEPS FLOW ── */}
      <div style={{ display: "flex", alignItems: "stretch", gap: "0" }}>
        {data.steps.map((step, i) => {
          const isActive = activeStep === i;
          const isDone   = activeStep > i || benefitsVisible;
          const isPulsing = pulseIdx === i - 1; // connector before this step
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
              {/* Connector before this step */}
              {i > 0 && (
                <FlowConnector
                  gradFrom={gradFrom}
                  gradTo={gradTo}
                  gradMid={gradMid}
                  pulsing={isPulsing}
                  done={isDone || activeStep > i}
                  uid={`${uid}-c${i}`}
                />
              )}

              {/* Step node */}
              <div style={{
                flex: 1, minWidth: 0,
                display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
                padding: "4px 4px",
              }}>
                {/* Circle */}
                <div style={{
                  width: "52px", height: "52px", borderRadius: "50%",
                  background: isActive
                    ? `linear-gradient(135deg, ${gradFrom}44, ${gradTo}44)`
                    : isDone
                    ? `linear-gradient(135deg, ${gradFrom}22, ${gradTo}22)`
                    : "rgba(255,255,255,0.05)",
                  border: `2px solid ${isActive ? gradFrom : isDone ? gradFrom + "55" : "rgba(255,255,255,0.12)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "20px", flexShrink: 0,
                  boxShadow: isActive ? `0 0 20px ${data.accentColor}66, 0 0 40px ${data.accentColor}22` : "none",
                  transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
                  transform: isActive ? "scale(1.12)" : "scale(1)",
                  position: "relative",
                }}>
                  {/* Step number badge */}
                  <div style={{
                    position: "absolute", top: "-6px", right: "-6px",
                    width: "18px", height: "18px", borderRadius: "50%",
                    background: isActive || isDone
                      ? `linear-gradient(135deg, ${gradFrom}, ${gradTo})`
                      : "rgba(255,255,255,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "9px", fontWeight: 800,
                    color: isActive || isDone ? "#0d1b2a" : "rgba(255,255,255,0.4)",
                    transition: "all 0.3s",
                  }}>
                    {i + 1}
                  </div>
                  {step.icon}
                </div>
                {/* Label */}
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    fontSize: "11px", fontWeight: 700, lineHeight: 1.3, marginBottom: "2px",
                    color: isActive ? "#fff" : isDone ? "rgba(255,255,255,0.80)" : "rgba(255,255,255,0.45)",
                    transition: "color 0.3s",
                  }}>
                    {step.label}
                  </div>
                  {step.sublabel && (
                    <div style={{
                      fontSize: "10px", lineHeight: 1.3,
                      color: isActive ? "rgba(255,255,255,0.70)" : "rgba(255,255,255,0.30)",
                      transition: "color 0.3s",
                    }}>
                      {step.sublabel}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Down arrow to benefits — always active */}
      <DownArrow gradFrom={gradFrom} gradTo={gradTo} uid={`${uid}-d1`} active={true} />

      {/* ── BENEFITS GRID — always visible, glows when animation reaches this phase ── */}
      <div style={{
        background: benefitsVisible
          ? `linear-gradient(135deg, ${gradFrom}18, ${gradTo}18)`
          : `linear-gradient(135deg, ${gradFrom}0c, ${gradTo}0c)`,
        border: `1px solid ${benefitsVisible ? gradFrom + "55" : gradFrom + "22"}`,
        borderRadius: "14px",
        padding: "16px",
        transition: "all 0.5s cubic-bezier(0.23,1,0.32,1)",
        boxShadow: benefitsVisible ? `0 0 30px ${data.accentColor}33` : "none",
      }}>
        <div style={{
          fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
          background: `linear-gradient(90deg, ${gradFrom}, ${gradTo})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          marginBottom: "12px",
          opacity: 1,
          transition: "opacity 0.4s",
        }}>
          Real-World Benefits
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "8px",
        }}>
          {data.benefits.map((b, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: "8px",
              padding: "10px 12px",
              background: benefitsVisible ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
              borderRadius: "10px",
              border: `1px solid ${benefitsVisible ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)"}`,
              transition: `all 0.4s cubic-bezier(0.23,1,0.32,1) ${i * 60}ms`,
              transform: "translateY(0)",
              opacity: 1,
            }}>
              <span style={{ fontSize: "16px", flexShrink: 0, lineHeight: 1.4 }}>{b.icon}</span>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.82)", lineHeight: 1.4, fontWeight: 500 }}>{b.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Global keyframes injected once */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.5); opacity: 0.4; }
        }
        @keyframes flow-pulse {
          0% { stroke-dashoffset: 60; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function DownArrow({ gradFrom, gradTo, uid, active }: { gradFrom: string; gradTo: string; uid: string; active: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "6px 0" }}>
      <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
        <defs>
          <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={gradFrom} stopOpacity={active ? 1 : 0.3} />
            <stop offset="100%" stopColor={gradTo} stopOpacity={active ? 1 : 0.3} />
          </linearGradient>
        </defs>
        <path
          d="M10 2 L10 20 M4 14 L10 22 L16 14"
          stroke={`url(#${uid})`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: "stroke-opacity 0.4s" }}
        />
      </svg>
    </div>
  );
}

function FlowConnector({
  gradFrom, gradTo, gradMid, pulsing, done, uid,
}: {
  gradFrom: string; gradTo: string; gradMid: string;
  pulsing: boolean; done: boolean; uid: string;
}) {
  return (
    <div style={{ flexShrink: 0, display: "flex", alignItems: "center", paddingBottom: "20px", width: "28px" }}>
      <svg width="28" height="14" viewBox="0 0 28 14" fill="none" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id={`${uid}-base`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={gradFrom} stopOpacity={done ? 0.7 : 0.2} />
            <stop offset="100%" stopColor={gradTo} stopOpacity={done ? 0.7 : 0.2} />
          </linearGradient>
          <linearGradient id={`${uid}-pulse`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={gradFrom} />
            <stop offset="50%" stopColor={gradMid} />
            <stop offset="100%" stopColor={gradTo} />
          </linearGradient>
        </defs>
        {/* Base line */}
        <path
          d="M0 7 L22 7 M16 2 L23 7 L16 12"
          stroke={`url(#${uid}-base)`}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: "stroke-opacity 0.3s" }}
        />
        {/* Animated pulse overlay */}
        {pulsing && (
          <path
            d="M0 7 L22 7"
            stroke={`url(#${uid}-pulse)`}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="60"
            strokeDashoffset="60"
            style={{
              animation: "flow-pulse 0.6s cubic-bezier(0.23,1,0.32,1) forwards",
              filter: `drop-shadow(0 0 4px ${gradFrom})`,
            }}
          />
        )}
      </svg>
    </div>
  );
}
