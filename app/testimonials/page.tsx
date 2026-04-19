"use client";
import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";

/* ─── Data ─────────────────────────────────────────────────── */
const testimonials = [
    {
        id: 1,
        name: "Layla Whitmore",
        role: "Debut Novelist",
        company: "Self-Published",
        avatar: "LW",
        color: "#C9A84C",
        bg: "rgba(201,168,76,0.08)",
        rating: 5,
        featured: true,
        quote:
            "I'd been sitting on my manuscript for three years, paralyzed by the publishing maze. This platform made it feel possible. Six months later, I have a real book with real readers — and my second is already in progress.",
        tag: "Fiction Author",
        joined: "2023",
    },
    {
        id: 2,
        name: "Daniel Osei",
        role: "Senior Brand Designer",
        company: "Freelance",
        avatar: "DO",
        color: "#7DD4B0",
        bg: "rgba(125,212,176,0.08)",
        rating: 5,
        featured: false,
        quote:
            "My old portfolio was a Behance link. Now I have something that actually converts — I've closed two major clients purely from inbound traffic since launching. The craft of the platform matches the craft I sell.",
        tag: "Portfolio User",
        joined: "2024",
    },
    {
        id: 3,
        name: "Mira Bassel",
        role: "Publisher & Editor",
        company: "Lunar Shelf Press",
        avatar: "MB",
        color: "#C97B8C",
        bg: "rgba(201,123,140,0.08)",
        rating: 5,
        featured: false,
        quote:
            "We run a small press of 4 people. The distribution and pre-order tools alone saved us from hiring a logistics coordinator. It genuinely scales with us — it feels like it was built for indie publishers specifically.",
        tag: "Independent Press",
        joined: "2023",
    },
    {
        id: 4,
        name: "Theo Park",
        role: "Documentary Photographer",
        company: "Editorial Freelance",
        avatar: "TP",
        color: "#8BA7E0",
        bg: "rgba(139,167,224,0.08)",
        rating: 5,
        featured: false,
        quote:
            "Every photographer I respect has terrible websites. I wanted mine to be the exception. This gave me that without having to become a web developer. Editors actually comment on it in emails.",
        tag: "Photography Portfolio",
        joined: "2024",
    },
    {
        id: 5,
        name: "Adriana Voss",
        role: "Business Coach & Author",
        company: "Voss Consulting",
        avatar: "AV",
        color: "#C9A84C",
        bg: "rgba(201,168,76,0.08)",
        rating: 5,
        featured: false,
        quote:
            "My book became my best marketing asset. The platform makes it easy to bundle it with my consulting offer. New clients often arrive already trusting me because they read the book first. That's priceless.",
        tag: "Non-Fiction Author",
        joined: "2023",
    },
    {
        id: 6,
        name: "Ren Nakashima",
        role: "Illustrator & Art Director",
        company: "Studio Nakashima",
        avatar: "RN",
        color: "#7DD4B0",
        bg: "rgba(125,212,176,0.08)",
        rating: 5,
        featured: false,
        quote:
            "The print fulfillment integration is the feature no one talks about enough. I can sell art books and signed prints without touching inventory. It just… works. I focus on making things; the platform handles the rest.",
        tag: "Illustrator",
        joined: "2024",
    },
    {
        id: 7,
        name: "Priya Sundaram",
        role: "Literary Agent",
        company: "Sundaram Literary",
        avatar: "PS",
        color: "#C97B8C",
        bg: "rgba(201,123,140,0.08)",
        rating: 5,
        featured: false,
        quote:
            "I send aspiring authors here before we even start working together. The platform teaches them to think professionally about their work — metadata, positioning, audience. It makes my job easier.",
        tag: "Industry Professional",
        joined: "2024",
    },
    {
        id: 8,
        name: "James Calloway",
        role: "Travel Writer",
        company: "Calloway Journals",
        avatar: "JC",
        color: "#8BA7E0",
        bg: "rgba(139,167,224,0.08)",
        rating: 5,
        featured: false,
        quote:
            "I've been writing about travel for a decade across five different platforms. This is the first one where the aesthetic actually matches the quality I try to put into my writing. Readers notice the difference.",
        tag: "Travel Author",
        joined: "2023",
    },
];

const categories = ["All", "Authors", "Designers", "Publishers", "Photographers"];

/* ─── Star Rating ───────────────────────────────────────────── */
function Stars({ count }: { count: number }) {
    return (
        <div style={{ display: "flex", gap: "3px", marginBottom: "20px" }}>
            {Array.from({ length: count }).map((_, i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                        d="M7 1L8.545 4.955L12.5 5.18L9.5 7.855L10.545 11.75L7 9.5L3.455 11.75L4.5 7.855L1.5 5.18L5.455 4.955L7 1Z"
                        fill="#C9A84C"
                    />
                </svg>
            ))}
        </div>
    );
}

/* ─── Featured Card ─────────────────────────────────────────── */
function FeaturedCard({ t }: { t: (typeof testimonials)[0] }) {
    return (
        <AnimatedSection>
            <div
                style={{
                    position: "relative",
                    background: "#0f0f0f",
                    border: "1px solid rgba(201,168,76,0.2)",
                    borderRadius: "16px",
                    padding: "clamp(32px, 4vw, 56px)",
                    marginBottom: "20px",
                    overflow: "hidden",
                }}
            >
                {/* Top accent */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "2px",
                        background: "linear-gradient(90deg, var(--gold), transparent)",
                    }}
                />

                {/* Large quote mark */}
                <div
                    style={{
                        position: "absolute",
                        top: "24px",
                        right: "40px",
                        fontFamily: "var(--font-display)",
                        fontSize: "120px",
                        lineHeight: 1,
                        color: "rgba(201,168,76,0.06)",
                        pointerEvents: "none",
                        userSelect: "none",
                    }}
                >
                    "
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        gap: "32px",
                        alignItems: "start",
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontSize: "10px",
                                letterSpacing: "0.18em",
                                textTransform: "uppercase",
                                color: "var(--gold)",
                                marginBottom: "20px",
                            }}
                        >
                            Featured Review
                        </div>
                        <Stars count={t.rating} />
                        <blockquote
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "clamp(20px, 2vw, 26px)",
                                color: "#fff",
                                lineHeight: 1.45,
                                letterSpacing: "-0.01em",
                                margin: "0 0 32px",
                                fontStyle: "italic",
                            }}
                        >
                            "{t.quote}"
                        </blockquote>

                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                            <div
                                style={{
                                    width: "44px",
                                    height: "44px",
                                    borderRadius: "50%",
                                    background: t.bg,
                                    border: `1px solid ${t.color}33`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "13px",
                                    fontWeight: 700,
                                    color: t.color,
                                    letterSpacing: "0.04em",
                                    flexShrink: 0,
                                }}
                            >
                                {t.avatar}
                            </div>
                            <div>
                                <div style={{ fontSize: "15px", fontWeight: 600, color: "#fff" }}>{t.name}</div>
                                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
                                    {t.role} · {t.company}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
}

/* ─── Testimonial Card ──────────────────────────────────────── */
function TestimonialCard({ t, i }: { t: (typeof testimonials)[0]; i: number }) {
    const [hovered, setHovered] = useState(false);

    return (
        <AnimatedSection delay={i * 0.06}>
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    position: "relative",
                    background: hovered ? "#141414" : "#0f0f0f",
                    border: `1px solid ${hovered ? t.color + "44" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: "12px",
                    padding: "32px",
                    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                    transform: hovered ? "translateY(-3px)" : "translateY(0)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                }}
            >
                {/* Hover top line */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "2px",
                        background: `linear-gradient(90deg, ${t.color}, transparent)`,
                        opacity: hovered ? 1 : 0,
                        transition: "opacity 0.3s ease",
                    }}
                />

                <Stars count={t.rating} />

                <blockquote
                    style={{
                        fontSize: "15px",
                        lineHeight: 1.75,
                        color: "rgba(255,255,255,0.55)",
                        margin: "0 0 28px",
                        fontStyle: "italic",
                        flex: 1,
                    }}
                >
                    "{t.quote}"
                </blockquote>

                {/* Footer */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div
                            style={{
                                width: "38px",
                                height: "38px",
                                borderRadius: "50%",
                                background: t.bg,
                                border: `1px solid ${t.color}33`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "11px",
                                fontWeight: 700,
                                color: t.color,
                                letterSpacing: "0.04em",
                                flexShrink: 0,
                            }}
                        >
                            {t.avatar}
                        </div>
                        <div>
                            <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>{t.name}</div>
                            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{t.company}</div>
                        </div>
                    </div>

                    <span
                        style={{
                            fontSize: "10px",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            padding: "4px 10px",
                            background: t.bg,
                            border: `1px solid ${t.color}22`,
                            borderRadius: "100px",
                            color: t.color,
                            whiteSpace: "nowrap",
                        }}
                    >
            {t.tag}
          </span>
                </div>
            </div>
        </AnimatedSection>
    );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function TestimonialsPage() {
    const [activeFilter, setActiveFilter] = useState("All");
    const featured = testimonials.find((t) => t.featured)!;
    const rest = testimonials.filter((t) => !t.featured);

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
                {/* Decorative glow */}
                <div
                    style={{
                        position: "absolute",
                        top: "-180px",
                        left: "-200px",
                        width: "600px",
                        height: "600px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)",
                        pointerEvents: "none",
                    }}
                />

                <div className="container">
                    <AnimatedSection>
                        {/* Label */}
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                            <span style={{ display: "inline-block", width: "28px", height: "1px", background: "var(--gold)" }} />
                            <span style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)" }}>
                Testimonials
              </span>
                        </div>

                        {/* Two-line headline */}
                        <h1
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "clamp(44px, 6.5vw, 88px)",
                                lineHeight: 1,
                                letterSpacing: "-0.03em",
                                color: "#fff",
                                maxWidth: "680px",
                                margin: "0 0 24px",
                            }}
                        >
                            Voices from
                            <br />
                            <span
                                style={{
                                    color: "transparent",
                                    WebkitTextStroke: "1px rgba(201,168,76,0.55)",
                                }}
                            >
                the community.
              </span>
                        </h1>

                        <p
                            style={{
                                fontSize: "17px",
                                lineHeight: 1.75,
                                color: "rgba(255,255,255,0.45)",
                                maxWidth: "480px",
                                marginBottom: "40px",
                            }}
                        >
                            Authors, designers, and publishers share what it's actually like to build their creative practice here.
                        </p>

                        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                            <Link
                                href="/get-started"
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
                                Join Them →
                            </Link>
                            <Link
                                href="/"
                                style={{
                                    fontSize: "13px",
                                    color: "rgba(255,255,255,0.35)",
                                    textDecoration: "none",
                                    letterSpacing: "0.04em",
                                }}
                            >
                                ← Back to Home
                            </Link>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ── Trust Bar ── */}
            <section
                style={{
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    background: "#0a0a0a",
                    padding: "28px 0",
                }}
            >
                <div className="container">
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "clamp(24px, 4vw, 64px)",
                            flexWrap: "wrap",
                        }}
                    >
                        {[
                            { value: "4.97", label: "Average Rating" },
                            { value: "12,400+", label: "Happy Creators" },
                            { value: "94%", label: "Recommend Us" },
                        ].map((item) => (
                            <div key={item.label} style={{ textAlign: "center" }}>
                                <div
                                    style={{
                                        fontFamily: "var(--font-display)",
                                        fontSize: "28px",
                                        fontWeight: 700,
                                        color: "var(--gold)",
                                        letterSpacing: "-0.02em",
                                    }}
                                >
                                    {item.value}
                                </div>
                                <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>
                                    {item.label}
                                </div>
                            </div>
                        ))}

                        {/* Star row */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                            <div style={{ display: "flex", gap: "4px" }}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <svg key={i} width="16" height="16" viewBox="0 0 14 14" fill="none">
                                        <path d="M7 1L8.545 4.955L12.5 5.18L9.5 7.855L10.545 11.75L7 9.5L3.455 11.75L4.5 7.855L1.5 5.18L5.455 4.955L7 1Z" fill="#C9A84C" />
                                    </svg>
                                ))}
                            </div>
                            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}>
                                From 12,400+ verified reviews
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Featured ── */}
            <section style={{ background: "#0a0a0a", paddingTop: "80px", paddingBottom: "0" }}>
                <div className="container">
                    <FeaturedCard t={featured} />
                </div>
            </section>

            {/* ── Filter + Grid ── */}
            <section style={{ background: "#0a0a0a", padding: "56px 0 120px" }}>
                <div className="container">
                    {/* Filter row */}
                    <AnimatedSection>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                                gap: "16px",
                                marginBottom: "40px",
                            }}
                        >
                            <h2
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: "clamp(22px, 2vw, 28px)",
                                    color: "#fff",
                                    letterSpacing: "-0.02em",
                                    margin: 0,
                                }}
                            >
                                All reviews
                            </h2>
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveFilter(cat)}
                                        style={{
                                            padding: "7px 16px",
                                            fontSize: "12px",
                                            letterSpacing: "0.06em",
                                            background: activeFilter === cat ? "rgba(201,168,76,0.12)" : "transparent",
                                            border: `1px solid ${activeFilter === cat ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.08)"}`,
                                            borderRadius: "100px",
                                            color: activeFilter === cat ? "var(--gold)" : "rgba(255,255,255,0.4)",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Cards grid */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                            gap: "20px",
                        }}
                    >
                        {rest.map((t, i) => (
                            <TestimonialCard key={t.id} t={t} i={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
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
                        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
                            <div style={{ width: "48px", height: "1px", background: "var(--gold)", margin: "0 auto 32px" }} />
                            <h2
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: "clamp(30px, 3.5vw, 48px)",
                                    color: "#fff",
                                    letterSpacing: "-0.03em",
                                    lineHeight: 1.1,
                                    margin: "0 0 20px",
                                }}
                            >
                                Ready to add your voice?
                            </h2>
                            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "36px" }}>
                                Join thousands of creators who already trust this platform with their work, their words, and their livelihood.
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
                                    href="/success-stories"
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
                                    Read Success Stories
                                </Link>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>
        </>
    );
}