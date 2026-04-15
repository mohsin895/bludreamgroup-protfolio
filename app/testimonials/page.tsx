"use client";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <section style={{ paddingTop: "140px", paddingBottom: "80px", background: "var(--bg)" }}>
        <div className="container">
          <AnimatedSection>
            <div className="section-label">Testimonials</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(52px, 6vw, 84px)", marginTop: "8px", textTransform: "capitalize" }}>
              Testimonials
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "17px", maxWidth: "540px", marginTop: "20px", lineHeight: 1.7 }}>
              This section is ready for your real content. Replace these placeholder cards with your actual data.
            </p>
            <Link href="/" className="btn-outline" style={{ display: "inline-flex", marginTop: "32px" }}>← Back to Home</Link>
          </AnimatedSection>
        </div>
      </section>

      <section className="section" style={{ background: "#0c0c0c" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <AnimatedSection key={i} delay={i * 0.07}>
                <div className="card" style={{ padding: "32px" }}>
                  <div style={{ width: "48px", height: "6px", background: "rgba(201,168,76,0.3)", borderRadius: "3px", marginBottom: "20px" }} />
                  <div style={{ width: "80%", height: "20px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", marginBottom: "12px" }} />
                  <div style={{ width: "100%", height: "14px", background: "rgba(255,255,255,0.03)", borderRadius: "3px", marginBottom: "8px" }} />
                  <div style={{ width: "70%", height: "14px", background: "rgba(255,255,255,0.03)", borderRadius: "3px" }} />
                  <div style={{ marginTop: "24px", padding: "10px 18px", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.1)", borderRadius: "4px", display: "inline-block", fontSize: "12px", color: "var(--gold)", letterSpacing: "0.08em" }}>
                    Item {i + 1}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
