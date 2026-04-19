"use client";
import { useEffect, useRef, useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";

/* ─── Data ─────────────────────────────────────────────────── */
const stories = [
    {
        id: 1,
        type: "Author",
        name: "Naomi Ashford",
        title: "From First Draft to Bestseller in 11 Months",
        excerpt:
            "After years of unpublished manuscripts, Naomi used our platform to launch her debut thriller. It debuted at #3 on the national fiction charts and has since sold over 80,000 copies.",
        metric: "80K+ copies sold",
        category: "Fiction · Thriller",
        avatar: "NA",
        color: "#C9A84C",
        bg: "rgba(201,168,76,0.08)",
        tag: "#1 Debut Thriller",
        year: "2024",
    },
    {
        id: 2,
        type: "Designer",
        name: "Marcus Yuen",
        title: "Portfolio That Closed $240K in Contracts",
        excerpt:
            "Marcus redesigned his portfolio through our system. Within 60 days he landed three enterprise clients — including a Fortune 500 rebrand worth $240K — purely from inbound inquiries.",
        metric: "$240K inbound revenue",
        category: "Design · Branding",
        avatar: "MY",
        color: "#7DD4B0",
        bg: "rgba(125,212,176,0.08)",
        tag: "3 Enterprise Clients",
        year: "2024",
    },
    {
        id: 3,
        type: "Publisher",
        name: "Priya & Roel Desai",
        title: "Independent Press, 6-Figure First Year",
        excerpt:
            "The Desais launched a small press specializing in South Asian voices. Our distribution tools and pre-order system helped them hit $120K in revenue in their first 12 months.",
        metric: "$120K Year 1 Revenue",
        category: "Publishing · Indie Press",
        avatar: "PD",
        color: "#C97B8C",
        bg: "rgba(201,123,140,0.08)",
        tag: "Indie Publisher",
        year: "2023",
    },
    {
        id: 4,
        type: "Illustrator",
        name: "Theo Wainwright",
        title: "5,000 Print Sales for a Self-Published Art Book",
        excerpt:
            "Theo's hand-illustrated atlas sold 5,000 copies in pre-orders alone. He credits the portfolio landing page and the one-click print fulfillment integration for making it effortless.",
        metric: "5K pre-orders",
        category: "Illustration · Art Books",
        avatar: "TW",
        color: "#8BA7E0",
        bg: "rgba(139,167,224,0.08)",
        tag: "Sold Out Pre-Order",
        year: "2024",
    },
    {
        id: 5,
        type: "Consultant",
        name: "Sasha Orlova",
        title: "A Book That Became a Business Pipeline",
        excerpt:
            "Sasha published her business playbook through our platform. It now drives 40% of her consulting pipeline — readers become clients after encountering her expertise in print.",
        metric: "40% of revenue attributed",
        category: "Non-Fiction · Business",
        avatar: "SO",
        color: "#C9A84C",
        bg: "rgba(201,168,76,0.08)",
        tag: "Top Business Read",
        year: "2023",
    },
    {
        id: 6,
        type: "Photographer",
        name: "Emre Çelik",
        title: "Portfolio to Pulitzer Shortlist",
        excerpt:
            "Emre's documentary portfolio — built and hosted here — caught the attention of international editors. His subsequent commission was shortlisted for a Pulitzer Prize in Feature Photography.",
        metric: "Pulitzer shortlisted",
        category: "Photography · Documentary",
        avatar: "EÇ",
        color: "#7DD4B0",
        bg: "rgba(125,212,176,0.08)",
        tag: "Award Recognition",
        year: "2024",
    },
];

const stats = [
    { value: "12,400+", label: "Creators Launched" },
    { value: "$18M+", label: "Creator Revenue Generated" },
    { value: "2.1M+", label: "Books Sold" },
    { value: "94%", label: "Would Recommend" },
];

/* ─── Counter Hook ──────────────────────────────────────────── */
function useCountUp(target: string, duration = 1800) {
    const [display, setDisplay] = useState("0");
    const ref = useRef<HTMLDivElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting && !started.current) {
                    started.current = true;
                    const numericPart = parseFloat(target.replace(/[^0-9.]/g, ""));
                    const prefix = target.replace(/[0-9.,+%$M]+.*/, "");
                    const suffix = target.replace(/^[^0-9]*[0-9.,]+/, "");
                    const start = performance.now();
                    const tick = (now: number) => {
                        const p = Math.min((now - start) / duration, 1);
                        const eased = 1 - Math.pow(1 - p, 3);
                        const cur = (numericPart * eased).toFixed(numericPart % 1 !== 0 ? 1 : 0);
                        setDisplay(`${prefix}${parseFloat(cur).toLocaleString()}${suffix}`);
                        if (p < 1) requestAnimationFrame(tick);
                    };
                    requestAnimationFrame(tick);
                }
            },
            { threshold: 0.5 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [target, duration]);

    return { ref, display };
}

/* ─── Stat Card ─────────────────────────────────────────────── */
function StatCard({ value, label }: { value: string; label: string }) {
    const { ref, display } = useCountUp(value);
    return (
        <div ref={ref} style={{ textAlign: "center", padding: "0 24px" }}>
            <div
                style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(36px, 4vw, 52px)",
                    color: "var(--gold)",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                }}
            >
                {display}
            </div>
            <div
                style={{
                    marginTop: "8px",
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.45)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                }}
            >
                {label}
            </div>
        </div>
    );
}

/* ─── Story Card ─────────────────────────────────────────────── */
function StoryCard({ s, i }: { s: (typeof stories)[0]; i: number }) {
    const [hovered, setHovered] = useState(false);

    return (
        <AnimatedSection delay={i * 0.07}>
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    position: "relative",
                    background: hovered ? "#141414" : "#0f0f0f",
                    border: `1px solid ${hovered ? s.color + "55" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: "12px",
                    padding: "36px",
                    transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                    transform: hovered ? "translateY(-4px)" : "translateY(0)",
                    cursor: "default",
                    overflow: "hidden",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Top accent line */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "2px",
                        background: `linear-gradient(90deg, ${s.color}, transparent)`,
                        opacity: hovered ? 1 : 0,
                        transition: "opacity 0.35s ease",
                    }}
                />

                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
                    {/* Avatar */}
                    <div
                        style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "50%",
                            background: s.bg,
                            border: `1px solid ${s.color}33`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "var(--font-display)",
                            fontSize: "13px",
                            fontWeight: 700,
                            color: s.color,
                            letterSpacing: "0.04em",
                            flexShrink: 0,
                        }}
                    >
                        {s.avatar}
                    </div>

                    {/* Type badge */}
                    <span
                        style={{
                            fontSize: "10px",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.35)",
                            padding: "4px 10px",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "100px",
                        }}
                    >
            {s.type}
          </span>
                </div>

                {/* Name */}
                <div style={{ fontSize: "12px", color: s.color, letterSpacing: "0.06em", marginBottom: "6px" }}>
                    {s.name}
                </div>

                {/* Title */}
                <h3
                    style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(18px, 1.5vw, 22px)",
                        color: "#fff",
                        fontWeight: 700,
                        lineHeight: 1.25,
                        margin: "0 0 16px",
                        letterSpacing: "-0.01em",
                    }}
                >
                    {s.title}
                </h3>

                {/* Excerpt */}
                <p
                    style={{
                        fontSize: "14px",
                        lineHeight: 1.75,
                        color: "rgba(255,255,255,0.5)",
                        margin: "0 0 28px",
                        flex: 1,
                    }}
                >
                    {s.excerpt}
                </p>

                {/* Footer */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                    {/* Metric pill */}
                    <div
                        style={{
                            padding: "8px 16px",
                            background: s.bg,
                            border: `1px solid ${s.color}22`,
                            borderRadius: "100px",
                            fontSize: "12px",
                            color: s.color,
                            fontWeight: 600,
                            letterSpacing: "0.04em",
                        }}
                    >
                        {s.metric}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
                style={{
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.25)",
                    letterSpacing: "0.08em",
                }}
            >
              {s.category}
            </span>
                        <span style={{ color: "rgba(255,255,255,0.12)", fontSize: "10px" }}>·</span>
                        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>{s.year}</span>
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function SuccessStoriesPage() {
    return (
        <>
            {/* ── Hero ── */}
            <section
                style={{
                    paddingTop: "160px",
                    paddingBottom: "100px",
                    background: "var(--bg)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Decorative radial glow */}
                <div
                    style={{
                        position: "absolute",
                        top: "-200px",
                        right: "-300px",
                        width: "700px",
                        height: "700px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
                        pointerEvents: "none",
                    }}
                />

                <div className="container">
                    <AnimatedSection>
                        {/* Label */}
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "10px",
                                marginBottom: "24px",
                            }}
                        >
              <span
                  style={{
                      display: "inline-block",
                      width: "28px",
                      height: "1px",
                      background: "var(--gold)",
                  }}
              />
                            <span
                                style={{
                                    fontSize: "11px",
                                    letterSpacing: "0.18em",
                                    textTransform: "uppercase",
                                    color: "var(--gold)",
                                }}
                            >
                Success Stories
              </span>
                        </div>

                        {/* Headline */}
                        <h1
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "clamp(48px, 7vw, 96px)",
                                lineHeight: 1,
                                letterSpacing: "-0.03em",
                                color: "#fff",
                                maxWidth: "700px",
                                margin: "0 0 24px",
                            }}
                        >
                            Real Creators.
                            <br />
                            <span
                                style={{
                                    color: "transparent",
                                    WebkitTextStroke: "1px rgba(201,168,76,0.6)",
                                }}
                            >
                Real Results.
              </span>
                        </h1>

                        <p
                            style={{
                                fontSize: "17px",
                                lineHeight: 1.75,
                                color: "rgba(255,255,255,0.45)",
                                maxWidth: "500px",
                                marginBottom: "40px",
                            }}
                        >
                            Authors, designers, publishers and photographers who turned their work into income — using the same tools available to you today.
                        </p>

                        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                            <Link
                                href="/get-started"
                                className="btn"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "14px 28px",
                                    background: "var(--gold)",
                                    color: "#0a0a0a",
                                    borderRadius: "6px",
                                    fontWeight: 700,
                                    fontSize: "13px",
                                    letterSpacing: "0.06em",
                                    textDecoration: "none",
                                    textTransform: "uppercase",
                                }}
                            >
                                Start Your Story →
                            </Link>
                            <Link
                                href="/"
                                style={{
                                    fontSize: "13px",
                                    color: "rgba(255,255,255,0.35)",
                                    textDecoration: "none",
                                    letterSpacing: "0.04em",
                                    transition: "color 0.2s",
                                }}
                            >
                                ← Back to Home
                            </Link>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ── Stats Bar ── */}
            <section
                style={{
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    background: "#0a0a0a",
                    padding: "56px 0",
                }}
            >
                <div className="container">
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                            gap: "40px",
                        }}
                    >
                        {stats.map((s) => (
                            <StatCard key={s.label} {...s} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Filter Row ── */}
            <section style={{ background: "#0a0a0a", paddingTop: "72px", paddingBottom: "0" }}>
                <div className="container">
                    <AnimatedSection>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "48px" }}>
                            <h2
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: "clamp(26px, 2.5vw, 34px)",
                                    color: "#fff",
                                    fontWeight: 700,
                                    letterSpacing: "-0.02em",
                                    margin: 0,
                                }}
                            >
                                {stories.length} stories &amp; counting
                            </h2>
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                {["All", "Authors", "Designers", "Publishers"].map((f) => (
                                    <button
                                        key={f}
                                        style={{
                                            padding: "7px 16px",
                                            fontSize: "12px",
                                            letterSpacing: "0.06em",
                                            background: f === "All" ? "rgba(201,168,76,0.12)" : "transparent",
                                            border: `1px solid ${f === "All" ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.08)"}`,
                                            borderRadius: "100px",
                                            color: f === "All" ? "var(--gold)" : "rgba(255,255,255,0.4)",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ── Cards Grid ── */}
            <section style={{ background: "#0a0a0a", padding: "0 0 120px" }}>
                <div className="container">
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                            gap: "20px",
                        }}
                    >
                        {stories.map((s, i) => (
                            <StoryCard key={s.id} s={s} i={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section
                style={{
                    background: "#080808",
                    borderTop: "1px solid rgba(255,255,255,0.04)",
                    padding: "100px 0",
                    textAlign: "center",
                }}
            >
                <div className="container">
                    <AnimatedSection>
                        <div
                            style={{
                                maxWidth: "600px",
                                margin: "0 auto",
                            }}
                        >
                            <div
                                style={{
                                    width: "48px",
                                    height: "1px",
                                    background: "var(--gold)",
                                    margin: "0 auto 32px",
                                }}
                            />
                            <h2
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: "clamp(32px, 4vw, 52px)",
                                    color: "#fff",
                                    letterSpacing: "-0.03em",
                                    lineHeight: 1.1,
                                    margin: "0 0 20px",
                                }}
                            >
                                Your story belongs here.
                            </h2>
                            <p
                                style={{
                                    fontSize: "16px",
                                    color: "rgba(255,255,255,0.4)",
                                    lineHeight: 1.7,
                                    marginBottom: "36px",
                                }}
                            >
                                Join thousands of creators who publish, sell, and build remarkable careers — all from one platform.
                            </p>
                            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                                <Link
                                    href="/get-started"
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        padding: "14px 32px",
                                        background: "var(--gold)",
                                        color: "#0a0a0a",
                                        borderRadius: "6px",
                                        fontWeight: 700,
                                        fontSize: "13px",
                                        letterSpacing: "0.08em",
                                        textDecoration: "none",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Get Started Free
                                </Link>
                                <Link
                                    href="/portfolio"
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        padding: "14px 32px",
                                        border: "1px solid rgba(255,255,255,0.12)",
                                        borderRadius: "6px",
                                        color: "rgba(255,255,255,0.6)",
                                        fontSize: "13px",
                                        letterSpacing: "0.08em",
                                        textDecoration: "none",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    See Portfolio Examples
                                </Link>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>
        </>
    );
}