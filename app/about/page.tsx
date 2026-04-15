"use client";
import Link from "next/link";
import { ArrowRight, Download, Award, Globe, BookOpen, Users } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

const milestones = [
  { year: "2006", title: "Founded Leadership Lab", desc: "Launched boutique coaching firm focused on executive transformation." },
  { year: "2010", title: "First Book Published", desc: "'The Quiet Revolution' became a sleeper hit, selling 200k copies in year one." },
  { year: "2015", title: "TEDx Talk Goes Viral", desc: "'The Leadership Myth' accumulated 8M+ views in 60 days." },
  { year: "2019", title: "WSJ Bestseller #1", desc: "'Unwritten Rules' debuted at number one, cementing global authority." },
  { year: "2022", title: "UN Advisory Role", desc: "Appointed advisor to the United Nations Leadership Initiative." },
  { year: "2024", title: "The Sovereign Leader", desc: "Third book published; fastest debut in publisher's history." },
];

export default function AboutPage() {
  return (
    <>
      <section style={{ paddingTop: "140px", paddingBottom: "80px", background: "var(--bg)" }}>
        <div className="container">
          <AnimatedSection>
            <div className="section-label">My Story</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(52px, 6vw, 84px)", maxWidth: "700px", marginTop: "8px" }}>
              The Woman<br />Behind the Work
            </h1>
          </AnimatedSection>
        </div>
      </section>

      <section style={{ background: "#0c0c0c", padding: "80px 0" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px" }}>
          <AnimatedSection direction="left">
            <div style={{ background: "#111", border: "1px solid rgba(201,168,76,0.12)", borderRadius: "6px", aspectRatio: "4/5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(201,168,76,0.1)", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: "28px", color: "var(--gold)" }}>AV</div>
                Portrait Photo
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right" delay={0.1}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "38px", marginBottom: "24px" }}>Eighteen Years. One Mission.</h2>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "16px" }}>
              Born in Vienna and educated at Oxford and Harvard Business School, Alexandra Voss began her career as a management consultant before discovering her true calling: helping leaders unlock their full potential.
            </p>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "16px" }}>
              She has coached over 2,000 executives across 47 countries, authored three international bestsellers, and delivered keynotes at organizations including Google, the United Nations, and the World Economic Forum.
            </p>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "32px" }}>
              Her work is grounded in a simple belief: that great leadership begins with radical self-knowledge and the courage to act from that knowledge every day.
            </p>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <Link href="/contact" className="btn-primary">Work With Alexandra <ArrowRight size={14} /></Link>
              <a href="#" className="btn-outline"><Download size={14} /> Press Kit</a>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "40px" }}>
              {[
                { icon: Award, label: "3 Bestselling Books" },
                { icon: Users, label: "2,000+ Executives Coached" },
                { icon: Globe, label: "47 Countries" },
                { icon: BookOpen, label: "8M+ TED Views" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "4px" }}>
                  <Icon size={16} style={{ color: "var(--gold)", flexShrink: 0 }} />
                  <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{label}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
        <style>{`@media(max-width:768px){section > .container{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* Timeline */}
      <section className="section" style={{ background: "var(--bg)" }}>
        <div className="container">
          <AnimatedSection style={{ textAlign: "center", marginBottom: "60px" }}>
            <div className="section-label" style={{ justifyContent: "center" }}>Career Journey</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(38px, 4vw, 52px)" }}>A Life Well Built</h2>
          </AnimatedSection>

          <div style={{ position: "relative", maxWidth: "700px", margin: "0 auto" }}>
            <div style={{ position: "absolute", left: "80px", top: 0, bottom: 0, width: "1px", background: "linear-gradient(to bottom, transparent, var(--gold), transparent)" }} />
            {milestones.map((m, i) => (
              <AnimatedSection key={m.year} delay={i * 0.08} style={{ display: "flex", gap: "40px", marginBottom: "48px", position: "relative" }}>
                <div style={{ minWidth: "60px", textAlign: "right" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--gold)" }}>{m.year}</span>
                </div>
                <div style={{ position: "absolute", left: "76px", top: "6px", width: "9px", height: "9px", background: "var(--gold)", borderRadius: "50%", border: "2px solid var(--bg)" }} />
                <div style={{ paddingLeft: "24px" }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "var(--text)" }}>{m.title}</h3>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "6px" }}>{m.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
