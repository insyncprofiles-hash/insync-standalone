import { Link } from "wouter";
import { useEffect } from "react";
import { useA11y } from "@/hooks/useA11y";

export default function About() {
  const { wrapperStyle: a11yStyle } = useA11y();

  // Force light background
  useEffect(() => {
    const root = document.documentElement;
    const hadDark = root.classList.contains("dark");
    root.classList.remove("dark");
    root.style.background = "#ffffff";
    document.body.style.background = "#ffffff";
    return () => {
      if (hadDark) root.classList.add("dark");
      root.style.background = "";
      document.body.style.background = "";
    };
  }, []);

  return (
    <div data-tts-content="true" style={{ ...a11yStyle, background: "#ffffff", minHeight: "100vh", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif", color: "#111827", paddingTop: "80px" }}>

      {/* Hero strip */}
      <section style={{ background: "linear-gradient(135deg, #0c1f36 0%, #0d9488 100%)", padding: "64px 24px 56px", textAlign: "center" }}>
        <p style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", marginBottom: "12px" }}>Our story</p>
        <h1 style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(1.6rem, 4vw, 2.8rem)", fontWeight: 900, color: "#ffffff", lineHeight: 1.2, marginBottom: "20px", maxWidth: "760px", margin: "0 auto 20px" }}>
          An initiative for self-advocacy and genuine choice and control in navigating support services.
        </h1>
        <div style={{ width: "60px", height: "4px", background: "#f0c040", borderRadius: "2px", margin: "0 auto" }} />
      </section>

      {/* Main content */}
      <section style={{ maxWidth: "760px", margin: "0 auto", padding: "64px 24px 80px" }}>

        {/* Origin */}
        <div style={{ marginBottom: "48px" }}>
          <p style={{ fontSize: "18px", lineHeight: 1.85, color: "#1f2937", marginBottom: "20px" }}>
            InSync Profiles was created by someone who has stood on every side of the support relationship — as a family carer, peer disability support worker and aged care worker.
          </p>
          <p style={{ fontSize: "18px", lineHeight: 1.85, color: "#1f2937", marginBottom: "20px" }}>
            That experience revealed a problem hiding in plain sight.
          </p>
          <p style={{ fontSize: "18px", lineHeight: 1.85, color: "#374151" }}>
            People are expected to choose the people who will enter their homes, support their goals and become part of their daily lives... often from little more than a name, photo, qualifications and availability.
          </p>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "2px solid #e8eef5", marginBottom: "48px" }} />

        {/* Purpose */}
        <div style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", fontWeight: 800, color: "#0c1f36", marginBottom: "20px", lineHeight: 1.3 }}>
            We're here to provide genuine informed choice.
          </h2>
          <p style={{ fontSize: "18px", lineHeight: 1.85, color: "#374151", marginBottom: "20px" }}>
            We're challenging the way support matching has always been done.
          </p>
          <p style={{ fontSize: "18px", lineHeight: 1.85, color: "#374151", marginBottom: "20px" }}>
            Not by replacing people with technology, but by helping people understand each other before support begins.
          </p>
          <p style={{ fontSize: "18px", lineHeight: 1.85, color: "#0c1f36", fontWeight: 700 }}>
            Because better matches aren't built on availability. They're built on understanding.
          </p>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "2px solid #e8eef5", marginBottom: "48px" }} />

        {/* Who we champion */}
        <div style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", fontWeight: 800, color: "#0c1f36", marginBottom: "28px", lineHeight: 1.3 }}>Who we champion</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {[
              { colour: "#0d9488", label: "Participants", text: "We champion self-advocacy by giving participants more meaningful information to make decisions on their own terms." },
              { colour: "#7b5ea7", label: "Support workers", text: "We champion support workers by creating space to show the human behind the compliance." },
              { colour: "#d4a017", label: "Providers", text: "We champion providers by helping create stronger, more sustainable matches that reduce unnecessary change, improve continuity and build trust from day one." },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ width: "6px", minWidth: "6px", height: "100%", minHeight: "60px", background: item.colour, borderRadius: "3px", marginTop: "4px" }} />
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: item.colour, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>{item.label}</div>
                  <p style={{ fontSize: "17px", lineHeight: 1.8, color: "#374151", margin: 0 }}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "2px solid #e8eef5", marginBottom: "48px" }} />

        {/* The conversation we're changing */}
        <div style={{ marginBottom: "48px" }}>
          <p style={{ fontSize: "18px", lineHeight: 1.85, color: "#374151", marginBottom: "20px" }}>
            We're here to change the conversation from <strong style={{ color: "#0c1f36" }}>"Who is available?"</strong> to <strong style={{ color: "#0d9488" }}>"Who is right for me?"</strong>
          </p>
          <p style={{ fontSize: "18px", lineHeight: 1.85, color: "#374151", marginBottom: "20px" }}>
            Every feature we build is guided by accessibility, dignity, human rights and the belief that people deserve to be understood before they are supported.
          </p>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "2px solid #e8eef5", marginBottom: "48px" }} />

        {/* Informed choice quote image */}
        <div style={{ margin: "0 0 48px", lineHeight: 0, borderRadius: "12px", overflow: "hidden" }}>
          <img src="/informed_choice_quote.jpg" alt="A parent watching alongside their child can see it in real time: the lean forward, the smile, the stillness. That's informed choice." style={{ width: "100%", display: "block", borderRadius: "12px" }} />
        </div>
        {/* Closing statement */}
        <div style={{ background: "linear-gradient(135deg, #f0faf9 0%, #fefce8 100%)", borderRadius: "16px", padding: "36px 32px", borderLeft: "5px solid #0d9488" }}>
          <p style={{ fontSize: "18px", lineHeight: 1.85, color: "#374151", marginBottom: "16px" }}>
            We don't exist to fit into the current system.
          </p>
          <p style={{ fontSize: "18px", lineHeight: 1.85, color: "#374151", marginBottom: "20px" }}>
            We exist to challenge the parts of it that no longer serve the people at its centre.
          </p>
          <p style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", fontWeight: 800, color: "#0c1f36", lineHeight: 1.4, margin: 0 }}>
            Self-advocacy doesn't start with finding a support worker.<br />
            It starts with having enough understanding to choose one.
          </p>
        </div>

        {/* CTA */}
        <div style={{ marginTop: "56px", textAlign: "center", display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/about-me/editor" style={{ background: "linear-gradient(135deg, #f0c040 0%, #e6a800 100%)", color: "#1a1a00", fontSize: "16px", fontWeight: 800, padding: "14px 32px", borderRadius: "40px", textDecoration: "none", boxShadow: "0 4px 16px rgba(240,192,64,0.35)" }}>✨ Try About Me — free</Link>
          <Link href="/view" style={{ background: "#0d9488", color: "#fff", fontSize: "16px", fontWeight: 700, padding: "14px 28px", borderRadius: "8px", textDecoration: "none" }}>Explore demo profile</Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#f8fafc", borderTop: "1px solid #e8eef5", padding: "20px 24px", textAlign: "center" }}>
        <Link href="/" style={{ fontSize: "14px", color: "#0d9488", fontWeight: 600, textDecoration: "none" }}>← Back to home</Link>
      </footer>
    </div>
  );
}
