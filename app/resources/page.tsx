"use client";
import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";

/* ─── Data ─────────────────────────────────────────────────── */
const featured = {
    id: 1,
    type: "Guide",
    title: "The Complete Self-Publishing Roadmap",
    description:
        "A step-by-step guide covering everything from manuscript preparation and cover design to distribution, pricing, and launch strategy. Built for first-time authors and experienced writers returning to self-publishing.",
    color: "#C9A84C",
    bg: "rgba(201,168,76,0.08)",
    readTime: "22 min read",
    pages: "48 pages",
    format: "PDF + Web",
    tags: ["Publishing", "Strategy", "Launch"],
    href: "/resources/self-publishing-roadmap",
};

const resources = [
    {
        id: 2,
        type: "Template",
        icon: "▤",
        title: "Author Press Kit Template",
        description: "A plug-and-play press kit with bio templates, high-res image placeholders, sample Q&A, and media pitch copy — ready to send to journalists and podcasters.",
        color: "#7DD4B0",
        bg: "rgba(125,212,176,0.08)",
        readTime: "5 min setup",
        format: "DOCX + PDF",
        tags: ["PR", "Media", "Authors"],
        href: "/resources/press-kit",
    },
    {
        id: 3,
        type: "Checklist",
        icon: "✓",
        title: "Portfolio Launch Checklist",
        description: "30 things to verify before you send your portfolio link to a client. Covers copy, image quality, mobile responsiveness, contact forms, and SEO basics.",
        color: "#8BA7E0",
        bg: "rgba(139,167,224,0.08)",
        readTime: "10 min read",
        format: "PDF",
        tags: ["Portfolio", "Design", "Checklist"],
        href: "/resources/portfolio-checklist",
    },
    {
        id: 4,
        type: "Worksheet",
        icon: "◎",
        title: "Book Pricing Strategy Worksheet",
        description: "Calculate optimal pricing across formats — ebook, paperback, hardcover — factoring in royalty tiers, platform fees, and competitive positioning in your genre.",
        color: "#C97B8C",
        bg: "rgba(201,123,140,0.08)",
        readTime: "15 min exercise",
        format: "Google Sheets",
        tags: ["Pricing", "Revenue", "Publishing"],
        href: "/resources/pricing-worksheet",
    },
    {
        id: 5,
        type: "Guide",
        icon: "▣",
        title: "Writing Your Author Bio",
        description: "Short, medium, and long bio frameworks with examples from published authors across fiction, non-fiction, and illustrated books. Includes the 3-sentence formula.",
        color: "#C9A84C",
        bg: "rgba(201,168,76,0.08)",
        readTime: "8 min read",
        format: "Web",
        tags: ["Copywriting", "Author Brand"],
        href: "/resources/author-bio",
    },
    {
        id: 6,
        type: "Video",
        icon: "▶",
        title: "Setting Up Your First Book Pre-Order",
        description: "A recorded walkthrough of the platform's pre-order tools — from setting your release date and cover reveal sequence to configuring reader bonuses.",
        color: "#7DD4B0",
        bg: "rgba(125,212,176,0.08)",
        readTime: "18 min video",
        format: "Video",
        tags: ["Platform", "Pre-Orders", "Tutorial"],
        href: "/resources/preorder-walkthrough",
    },
    {
        id: 7,
        type: "Template",
        icon: "▤",
        title: "Client Proposal Template for Designers",
        description: "A polished proposal structure used by senior designers on the platform. Covers scope, process, timeline, investment, and terms — in a tone that closes.",
        color: "#8BA7E0",
        bg: "rgba(139,167,224,0.08)",
        readTime: "10 min setup",
        format: "DOCX",
        tags: ["Freelance", "Design", "Business"],
        href: "/resources/designer-proposal",
    },
];

const categories = ["All", "Guides", "Templates", "Checklists", "Worksheets", "Videos"];

const typeColors: Record<string, { color: string; bg: string }> = {
    Guide:     { color: "#C9A84C", bg: "rgba(201,168,76,0.1)" },
    Template:  { color: "#7DD4B0", bg: "rgba(125,212,176,0.1)" },
    Checklist: { color: "#8BA7E0", bg: "rgba(139,167,224,0.1)" },
    Worksheet: { color: "#C97B8C", bg: "rgba(201,123,140,0.1)" },
    Video:     { color: "#7DD4B0", bg: "rgba(125,212,176,0.1)" },
};

/* ─── Featured Resource ─────────────────────────────────────── */
function FeaturedResource() {
    return (
        <AnimatedSection>
            <div
                style={{
                    position: "relative",
                    background: "#0f0f0f",
                    border: "1px solid rgba(201,168,76,0.2)",
                    borderRadius: "16px",
                    padding: "clamp(32px, 4vw, 56px)",
                    overflow: "hidden",
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: "40px",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >
                {/* Top accent */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, var(--gold), transparent)" }} />

                {/* Watermark */}
                <div
                    style={{
                        position: "absolute",
                        right: "clamp(160px, 22vw, 300px)",
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontFamily: "var(--font-display)",
                        fontSize: "140px",
                        lineHeight: 1,
                        color: "rgba(201,168,76,0.03)",
                        pointerEvents: "none",
                        userSelect: "none",
                        letterSpacing: "-0.05em",
                    }}
                >
                    ★
                </div>

                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <span style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)" }}>
              Featured Resource
            </span>
                        <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "inline-block" }} />
                        <span style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
              {featured.type}
            </span>
                    </div>

                    <h2
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(22px, 2.8vw, 34px)",
                            color: "#fff",
                            letterSpacing: "-0.02em",
                            lineHeight: 1.15,
                            margin: "0 0 16px",
                        }}
                    >
                        {featured.title}
                    </h2>

                    <p style={{ fontSize: "15px", lineHeight: 1.75, color: "rgba(255,255,255,0.5)", maxWidth: "560px", marginBottom: "28px" }}>
                        {featured.description}
                    </p>

                    {/* Meta */}
                    <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", marginBottom: "32px" }}>
                        {[featured.readTime, featured.pages, featured.format].map((m) => (
                            <span key={m} style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>
                {m}
              </span>
                        ))}
                    </div>

                    <Link
                        href={featured.href}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "13px 28px",
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
                        Download Free →
                    </Link>
                </div>

                {/* Right: tags */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "130px" }}>
                    {featured.tags.map((tag) => (
                        <div
                            key={tag}
                            style={{
                                padding: "8px 14px",
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                borderRadius: "6px",
                                fontSize: "11px",
                                letterSpacing: "0.06em",
                                color: "rgba(255,255,255,0.35)",
                                textAlign: "center",
                            }}
                        >
                            {tag}
                        </div>
                    ))}
                </div>
            </div>
        </AnimatedSection>
    );
}

/* ─── Resource Card ─────────────────────────────────────────── */
function ResourceCard({ r, i }: { r: (typeof resources)[0]; i: number }) {
    const [hovered, setHovered] = useState(false);
    const tc = typeColors[r.type] ?? { color: "#C9A84C", bg: "rgba(201,168,76,0.1)" };

    return (
        <AnimatedSection delay={i * 0.07}>
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    position: "relative",
                    background: hovered ? "#141414" : "#0f0f0f",
                    border: `1px solid ${hovered ? r.color + "44" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: "12px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    transition: "all 0.32s cubic-bezier(0.16,1,0.3,1)",
                    transform: hovered ? "translateY(-4px)" : "translateY(0)",
                }}
            >
                {/* Top bar */}
                <div
                    style={{
                        height: "3px",
                        background: `linear-gradient(90deg, ${r.color}, transparent)`,
                        opacity: hovered ? 1 : 0.35,
                        transition: "opacity 0.3s ease",
                    }}
                />

                <div style={{ padding: "28px 28px 0", flex: 1, display: "flex", flexDirection: "column" }}>
                    {/* Icon + type */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
                        <div
                            style={{
                                width: "42px",
                                height: "42px",
                                borderRadius: "50%",
                                background: r.bg,
                                border: `1px solid ${r.color}33`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "16px",
                                color: r.color,
                            }}
                        >
                            {r.icon}
                        </div>
                        <span
                            style={{
                                fontSize: "10px",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                padding: "4px 12px",
                                background: tc.bg,
                                borderRadius: "100px",
                                color: tc.color,
                            }}
                        >
              {r.type}
            </span>
                    </div>

                    <h3
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(16px, 1.3vw, 19px)",
                            color: "#fff",
                            letterSpacing: "-0.01em",
                            lineHeight: 1.25,
                            margin: "0 0 10px",
                        }}
                    >
                        {r.title}
                    </h3>

                    <p style={{ fontSize: "13px", lineHeight: 1.75, color: "rgba(255,255,255,0.45)", margin: "0 0 20px", flex: 1 }}>
                        {r.description}
                    </p>

                    {/* Tags */}
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
                        {r.tags.map((tag) => (
                            <span
                                key={tag}
                                style={{
                                    fontSize: "10px",
                                    letterSpacing: "0.06em",
                                    padding: "3px 8px",
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    borderRadius: "4px",
                                    color: "rgba(255,255,255,0.3)",
                                }}
                            >
                {tag}
              </span>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "0 28px" }} />

                {/* Footer */}
                <div style={{ padding: "16px 28px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>
            {r.readTime} · {r.format}
          </span>
                    <Link
                        href={r.href}
                        style={{
                            padding: "8px 16px",
                            background: hovered ? r.bg : "transparent",
                            border: `1px solid ${hovered ? r.color + "55" : "rgba(255,255,255,0.08)"}`,
                            borderRadius: "5px",
                            fontSize: "11px",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: hovered ? r.color : "rgba(255,255,255,0.35)",
                            textDecoration: "none",
                            transition: "all 0.25s ease",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {r.type === "Video" ? "Watch →" : "Download →"}
                    </Link>
                </div>
            </div>
        </AnimatedSection>
    );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function ResourcesPage() {
    const [activeCategory, setActiveCategory] = useState("All");

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
                <div
                    style={{
                        position: "absolute",
                        top: "-150px",
                        right: "-200px",
                        width: "600px",
                        height: "600px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)",
                        pointerEvents: "none",
                    }}
                />

                <div className="container">
                    <AnimatedSection>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                            <span style={{ display: "inline-block", width: "28px", height: "1px", background: "var(--gold)" }} />
                            <span style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)" }}>
                Resources
              </span>
                        </div>

                        <h1
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "clamp(44px, 6.5vw, 88px)",
                                lineHeight: 1,
                                letterSpacing: "-0.03em",
                                color: "#fff",
                                maxWidth: "700px",
                                margin: "0 0 24px",
                            }}
                        >
                            Tools to
                            <br />
                            <span style={{ color: "transparent", WebkitTextStroke: "1px rgba(201,168,76,0.55)" }}>
                do the work.
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
                            Free guides, templates, checklists, and worksheets built for authors, designers, and publishers — no fluff, only what works.
                        </p>

                        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                            <Link
                                href="#resources"
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
                                Browse Resources ↓
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

            {/* ── Stats bar ── */}
            <section
                style={{
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    background: "#0a0a0a",
                    padding: "28px 0",
                }}
            >
                <div className="container">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(24px, 5vw, 72px)", flexWrap: "wrap" }}>
                        {[
                            { value: `${resources.length + 1}`, label: "Free Resources" },
                            { value: "40,000+", label: "Downloads" },
                            { value: "5 Formats", label: "PDF, Video, Sheets & More" },
                            { value: "Always Free", label: "No Email Required" },
                        ].map((s) => (
                            <div key={s.label} style={{ textAlign: "center" }}>
                                <div style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 700, color: "var(--gold)", letterSpacing: "-0.02em" }}>
                                    {s.value}
                                </div>
                                <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Featured ── */}
            <section style={{ background: "#0a0a0a", paddingTop: "80px", paddingBottom: "0" }}>
                <div className="container">
                    <FeaturedResource />
                </div>
            </section>

            {/* ── Grid ── */}
            <section id="resources" style={{ background: "#0a0a0a", padding: "56px 0 120px" }}>
                <div className="container">
                    {/* Filter */}
                    <AnimatedSection>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "40px" }}>
                            <h2
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: "clamp(20px, 2vw, 26px)",
                                    color: "#fff",
                                    letterSpacing: "-0.02em",
                                    margin: 0,
                                }}
                            >
                                All resources
                            </h2>
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        style={{
                                            padding: "7px 16px",
                                            fontSize: "12px",
                                            letterSpacing: "0.06em",
                                            background: activeCategory === cat ? "rgba(201,168,76,0.12)" : "transparent",
                                            border: `1px solid ${activeCategory === cat ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.08)"}`,
                                            borderRadius: "100px",
                                            color: activeCategory === cat ? "var(--gold)" : "rgba(255,255,255,0.4)",
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

                    {/* Cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                        {resources.map((r, i) => (
                            <ResourceCard key={r.id} r={r} i={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Newsletter CTA ── */}
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
                                    fontSize: "clamp(28px, 3.5vw, 44px)",
                                    color: "#fff",
                                    letterSpacing: "-0.03em",
                                    lineHeight: 1.1,
                                    margin: "0 0 20px",
                                }}
                            >
                                New resources, monthly.
                            </h2>
                            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "36px" }}>
                                We publish new guides, templates, and tools every month. Subscribe and we'll send them straight to your inbox — no noise, no upsells.
                            </p>
                            <div style={{ display: "flex", gap: "0", maxWidth: "420px", margin: "0 auto", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    style={{
                                        flex: 1,
                                        padding: "14px 18px",
                                        background: "rgba(255,255,255,0.03)",
                                        border: "none",
                                        color: "#fff",
                                        fontSize: "14px",
                                        outline: "none",
                                        minWidth: 0,
                                    }}
                                />
                                <button
                                    style={{
                                        padding: "14px 22px",
                                        background: "var(--gold)",
                                        color: "#0a0a0a",
                                        border: "none",
                                        fontWeight: 700,
                                        fontSize: "12px",
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        cursor: "pointer",
                                        whiteSpace: "nowrap",
                                        flexShrink: 0,
                                    }}
                                >
                                    Subscribe
                                </button>
                            </div>
                            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "14px", letterSpacing: "0.04em" }}>
                                No spam. Unsubscribe any time.
                            </p>
                        </div>
                    </AnimatedSection>
                </div>
            </section>
        </>
    );
}