"use client";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";
import { useState } from "react";
import { ExternalLink, Quote, Download, Star } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

type PressType = "review" | "feature" | "interview" | "mention";

interface PressItem {
    id: number;
    type: PressType;
    publication: string;
    publicationInitials: string;
    accentColor: string;
    author: string;
    title: string;
    pullQuote: string;
    date: string;
    month: string;
    year: string;
    url?: string;
    isFeatured?: boolean;
    stars?: number; // out of 5
}

const PRESS_ITEMS: PressItem[] = [
    {
        id: 1,
        type: "review",
        publication: "The New York Times",
        publicationInitials: "NYT",
        accentColor: "#C9A84C",
        author: "Dwight Garner",
        title: "A Rare, Luminous Debut That Refuses Easy Categorisation",
        pullQuote:
            "A debut so assured, so formally daring, it reads less like a first novel than a career-defining statement. The prose moves like water over glass.",
        date: "February 14, 2025",
        month: "FEB",
        year: "2025",
        url: "#",
        isFeatured: true,
        stars: 5,
    },
    {
        id: 2,
        type: "feature",
        publication: "The Guardian",
        publicationInitials: "GRD",
        accentColor: "#7C9A7E",
        author: "Claire Armitstead",
        title: "The Author Who Maps What Cannot Be Mapped",
        pullQuote:
            "In a season crowded with debuts, this one arrives with the quiet authority of a book that knows exactly what it is and who it is for.",
        date: "April 3, 2025",
        month: "APR",
        year: "2025",
        url: "#",
        stars: 5,
    },
    {
        id: 3,
        type: "interview",
        publication: "The Paris Review",
        publicationInitials: "TPR",
        accentColor: "#9B8BC4",
        author: "The Editors",
        title: '"I Write Toward the Silence": The Art of Negative Space in Fiction',
        pullQuote:
            "What I am most interested in is the weight of what is left out — the sentence that was never written but that the reader feels pressing against the page.",
        date: "March 22, 2025",
        month: "MAR",
        year: "2025",
        url: "#",
    },
    {
        id: 4,
        type: "review",
        publication: "Publishers Weekly",
        publicationInitials: "PW",
        accentColor: "#C9A84C",
        author: "Staff Review",
        title: "Starred Review — The Quiet Cartographer",
        pullQuote:
            "A starred debut. The writing is stripped back to its essential marrow, and yet it contains multitudes. A book about geography that is really about grief.",
        date: "January 6, 2025",
        month: "JAN",
        year: "2025",
        url: "#",
        stars: 5,
    },
    {
        id: 5,
        type: "feature",
        publication: "Lit Hub",
        publicationInitials: "LH",
        accentColor: "#C47C5A",
        author: "Emily Temple",
        title: "Ten Debut Novels to Read in 2025",
        pullQuote:
            "Among the year's most anticipated debuts, this novel stands apart for its refusal to offer comfort where none honestly exists.",
        date: "January 2, 2025",
        month: "JAN",
        year: "2025",
        url: "#",
    },
    {
        id: 6,
        type: "interview",
        publication: "NPR Books",
        publicationInitials: "NPR",
        accentColor: "#5A8EC4",
        author: "Scott Simon",
        title: "On Writing Silence — Weekend Edition Interview",
        pullQuote:
            "The interview touched on maps, memory, and why the author spent three years rewriting the same opening paragraph — and why it was worth every draft.",
        date: "February 28, 2025",
        month: "FEB",
        year: "2025",
        url: "#",
    },
    {
        id: 7,
        type: "mention",
        publication: "Kirkus Reviews",
        publicationInitials: "KR",
        accentColor: "#C9A84C",
        author: "Staff",
        title: "Best Fiction of February 2025",
        pullQuote:
            "Included in Kirkus's curated list of the best new fiction of the month, praised for its 'uncommon precision and emotional intelligence'.",
        date: "February 1, 2025",
        month: "FEB",
        year: "2025",
        url: "#",
    },
    {
        id: 8,
        type: "review",
        publication: "The Atlantic",
        publicationInitials: "ATL",
        accentColor: "#7C9A7E",
        author: "Judith Shulevitz",
        title: "The New Geography of Grief",
        pullQuote:
            "There is a tradition of novels that use landscape as a mirror for the interior life. This novel belongs to that tradition — and extends it somewhere genuinely new.",
        date: "March 10, 2025",
        month: "MAR",
        year: "2025",
        url: "#",
        stars: 4,
    },
    {
        id: 9,
        type: "feature",
        publication: "Vogue",
        publicationInitials: "VG",
        accentColor: "#9B8BC4",
        author: "Naomi Fry",
        title: "The Books We Are Obsessed With Right Now",
        pullQuote:
            "Quietly devastating and unexpectedly funny, this is the kind of novel you press into the hands of everyone you know.",
        date: "April 10, 2025",
        month: "APR",
        year: "2025",
        url: "#",
    },
];

const TYPE_LABELS: Record<PressType, string> = {
    review: "Review",
    feature: "Feature",
    interview: "Interview",
    mention: "Mention",
};

const FILTERS = [
    { label: "All", value: "all" },
    { label: "Reviews", value: "review" },
    { label: "Features", value: "feature" },
    { label: "Interviews", value: "interview" },
    { label: "Mentions", value: "mention" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StarRow({ count }: { count: number }) {
    return (
        <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    size={11}
                    fill={i < count ? "#C9A84C" : "transparent"}
                    style={{ color: i < count ? "#C9A84C" : "rgba(255,255,255,0.15)" }}
                />
            ))}
        </div>
    );
}

function PublicationBadge({
                              initials,
                              color,
                          }: {
    initials: string;
    color: string;
}) {
    return (
        <div
            style={{
                width: "48px",
                height: "48px",
                borderRadius: "8px",
                background: `${color}12`,
                border: `1px solid ${color}28`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: color,
                flexShrink: 0,
            }}
        >
            {initials}
        </div>
    );
}

function PressCard({ item, delay }: { item: PressItem; delay: number }) {
    const [hovered, setHovered] = useState(false);

    return (
        <AnimatedSection delay={delay}>
            <div
                className="card"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    padding: "0",
                    overflow: "hidden",
                    transition: "transform 0.25s ease, border-color 0.25s ease",
                    transform: hovered ? "translateY(-3px)" : "translateY(0)",
                    borderColor: hovered
                        ? `${item.accentColor}30`
                        : "rgba(255,255,255,0.06)",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Top accent bar */}
                <div
                    style={{
                        height: "2px",
                        background: `linear-gradient(90deg, ${item.accentColor}70, transparent)`,
                    }}
                />

                <div style={{ padding: "28px", display: "flex", flexDirection: "column", flex: 1 }}>
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "20px" }}>
                        <PublicationBadge initials={item.publicationInitials} color={item.accentColor} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                <span
                    style={{
                        fontSize: "10px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: item.accentColor,
                        background: `${item.accentColor}10`,
                        border: `1px solid ${item.accentColor}22`,
                        padding: "3px 8px",
                        borderRadius: "3px",
                    }}
                >
                  {TYPE_LABELS[item.type]}
                </span>
                                {item.stars && <StarRow count={item.stars} />}
                            </div>
                            <div style={{ fontSize: "13px", fontWeight: 500, color: "#fff", lineHeight: 1.3 }}>
                                {item.publication}
                            </div>
                            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)", marginTop: "2px" }}>
                                {item.author} · {item.date}
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h3
                        style={{
                            fontSize: "14px",
                            fontWeight: 500,
                            lineHeight: 1.45,
                            margin: "0 0 16px",
                            color: "rgba(255,255,255,0.85)",
                        }}
                    >
                        {item.title}
                    </h3>

                    {/* Pull quote */}
                    <div
                        style={{
                            flex: 1,
                            borderLeft: `2px solid ${item.accentColor}40`,
                            paddingLeft: "14px",
                            marginBottom: "20px",
                        }}
                    >
                        <Quote
                            size={14}
                            style={{ color: item.accentColor, opacity: 0.5, marginBottom: "6px", display: "block" }}
                        />
                        <p
                            style={{
                                fontSize: "13px",
                                lineHeight: 1.75,
                                color: "rgba(255,255,255,0.45)",
                                margin: 0,
                                fontStyle: "italic",
                            }}
                        >
                            {item.pullQuote}
                        </p>
                    </div>

                    {/* Footer */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingTop: "16px",
                            borderTop: "1px solid rgba(255,255,255,0.06)",
                        }}
                    >
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em" }}>
              {item.month} {item.year}
            </span>
                        {item.url && (
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    fontSize: "11px",
                                    color: hovered ? item.accentColor : "rgba(255,255,255,0.25)",
                                    textDecoration: "none",
                                    letterSpacing: "0.06em",
                                    transition: "color 0.2s ease",
                                }}
                            >
                                Read Full Article
                                <ExternalLink size={11} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PressPage() {
    const [activeFilter, setActiveFilter] = useState("all");

    const filtered = PRESS_ITEMS.filter(
        (p) => activeFilter === "all" || p.type === activeFilter
    );

    const featured = PRESS_ITEMS.find((p) => p.isFeatured);

    const counts: Record<string, number> = { all: PRESS_ITEMS.length };
    PRESS_ITEMS.forEach((p) => {
        counts[p.type] = (counts[p.type] ?? 0) + 1;
    });

    return (
        <>
            {/* ── Hero ── */}
            <section
                style={{
                    paddingTop: "140px",
                    paddingBottom: "72px",
                    background: "var(--bg, #0a0a0a)",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
            >
                <div className="container">
                    <AnimatedSection>
                        <div className="section-label">Press</div>
                        <h1
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "clamp(48px, 6vw, 80px)",
                                marginTop: "8px",
                                letterSpacing: "-0.02em",
                                lineHeight: 1.05,
                            }}
                        >
                            Critical Coverage
                            <br />
                            <span style={{ color: "var(--gold, #C9A84C)" }}>& Reviews</span>
                        </h1>
                        <p
                            style={{
                                color: "var(--text-muted, rgba(255,255,255,0.5))",
                                fontSize: "16px",
                                maxWidth: "460px",
                                marginTop: "20px",
                                lineHeight: 1.75,
                            }}
                        >
                            Reviews, features, and interviews from major publications. For
                            press inquiries and kit downloads, see below.
                        </p>

                        {/* Stats */}
                        <div style={{ display: "flex", gap: "40px", marginTop: "40px", flexWrap: "wrap" }}>
                            {[
                                { label: "Press Pieces", value: PRESS_ITEMS.length },
                                { label: "Starred Reviews", value: PRESS_ITEMS.filter((p) => p.stars === 5).length },
                                { label: "Publications", value: new Set(PRESS_ITEMS.map((p) => p.publication)).size },
                            ].map((s) => (
                                <div key={s.label}>
                                    <div
                                        style={{
                                            fontFamily: "var(--font-display)",
                                            fontSize: "38px",
                                            color: "var(--gold, #C9A84C)",
                                            letterSpacing: "-0.03em",
                                            lineHeight: 1,
                                        }}
                                    >
                                        {s.value}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "11px",
                                            letterSpacing: "0.1em",
                                            textTransform: "uppercase",
                                            color: "rgba(255,255,255,0.28)",
                                            marginTop: "4px",
                                        }}
                                    >
                                        {s.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link
                            href="/"
                            className="btn-outline"
                            style={{ display: "inline-flex", marginTop: "36px" }}
                        >
                            ← Back to Home
                        </Link>
                    </AnimatedSection>
                </div>
            </section>

            {/* ── Body ── */}
            <section
                className="section"
                style={{ background: "#0c0c0c", paddingTop: "64px", paddingBottom: "120px" }}
            >
                <div className="container">

                    {/* Featured quote hero */}
                    {featured && (
                        <AnimatedSection>
                            <div
                                style={{
                                    marginBottom: "72px",
                                    padding: "56px 52px",
                                    background: "rgba(201,168,76,0.04)",
                                    border: "1px solid rgba(201,168,76,0.16)",
                                    borderRadius: "12px",
                                    position: "relative",
                                    overflow: "hidden",
                                }}
                            >
                                {/* Large decorative quote mark */}
                                <div
                                    aria-hidden
                                    style={{
                                        position: "absolute",
                                        top: "-20px",
                                        right: "40px",
                                        fontFamily: "var(--font-display)",
                                        fontSize: "240px",
                                        lineHeight: 1,
                                        color: "rgba(201,168,76,0.06)",
                                        pointerEvents: "none",
                                        userSelect: "none",
                                    }}
                                >
                                    "
                                </div>

                                <div style={{ position: "relative", maxWidth: "680px" }}>
                                    <div
                                        style={{
                                            fontSize: "10px",
                                            letterSpacing: "0.14em",
                                            textTransform: "uppercase",
                                            color: "var(--gold, #C9A84C)",
                                            marginBottom: "20px",
                                        }}
                                    >
                                        Editor's Pick · {featured.publication}
                                    </div>
                                    <blockquote
                                        style={{
                                            fontFamily: "var(--font-display)",
                                            fontSize: "clamp(18px, 2.5vw, 26px)",
                                            lineHeight: 1.5,
                                            letterSpacing: "-0.01em",
                                            color: "rgba(255,255,255,0.9)",
                                            margin: "0 0 24px",
                                            fontStyle: "italic",
                                        }}
                                    >
                                        "{featured.pullQuote}"
                                    </blockquote>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "14px",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "32px",
                                                height: "1px",
                                                background: "var(--gold, #C9A84C)",
                                                opacity: 0.4,
                                            }}
                                        />
                                        <span
                                            style={{
                                                fontSize: "12px",
                                                color: "rgba(255,255,255,0.4)",
                                                letterSpacing: "0.05em",
                                            }}
                                        >
                      {featured.author}, <em>{featured.publication}</em> — {featured.date}
                    </span>
                                        {featured.stars && <StarRow count={featured.stars} />}
                                        {featured.url && (
                                            <a
                                                href={featured.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "5px",
                                                    fontSize: "11px",
                                                    color: "var(--gold, #C9A84C)",
                                                    textDecoration: "none",
                                                    letterSpacing: "0.06em",
                                                }}
                                            >
                                                Read Review <ExternalLink size={10} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>
                    )}

                    {/* Publication logo strip */}
                    <AnimatedSection delay={0.05}>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "10px",
                                marginBottom: "56px",
                                alignItems: "center",
                            }}
                        >
              <span
                  style={{
                      fontSize: "11px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.2)",
                      marginRight: "8px",
                      whiteSpace: "nowrap",
                  }}
              >
                As seen in
              </span>
                            {PRESS_ITEMS.map((item) => (
                                <div
                                    key={item.id}
                                    style={{
                                        padding: "6px 14px",
                                        background: `${item.accentColor}08`,
                                        border: `1px solid ${item.accentColor}18`,
                                        borderRadius: "4px",
                                        fontSize: "11px",
                                        letterSpacing: "0.05em",
                                        color: "rgba(255,255,255,0.28)",
                                        whiteSpace: "nowrap",
                                        transition: "color 0.2s ease, border-color 0.2s ease",
                                        cursor: "default",
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLElement).style.color = item.accentColor;
                                        (e.currentTarget as HTMLElement).style.borderColor = `${item.accentColor}40`;
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.28)";
                                        (e.currentTarget as HTMLElement).style.borderColor = `${item.accentColor}18`;
                                    }}
                                >
                                    {item.publication}
                                </div>
                            ))}
                        </div>
                    </AnimatedSection>

                    {/* Filter pills */}
                    <AnimatedSection delay={0.08}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "40px" }}>
                            {FILTERS.map((f) => (
                                <button
                                    key={f.value}
                                    onClick={() => setActiveFilter(f.value)}
                                    style={{
                                        padding: "7px 18px",
                                        borderRadius: "100px",
                                        border: "1px solid",
                                        borderColor:
                                            activeFilter === f.value
                                                ? "var(--gold, #C9A84C)"
                                                : "rgba(255,255,255,0.1)",
                                        background:
                                            activeFilter === f.value
                                                ? "rgba(201,168,76,0.1)"
                                                : "transparent",
                                        color:
                                            activeFilter === f.value
                                                ? "var(--gold, #C9A84C)"
                                                : "rgba(255,255,255,0.35)",
                                        fontSize: "12px",
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        fontFamily: "inherit",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                    }}
                                >
                                    {f.label}
                                    <span
                                        style={{
                                            fontSize: "10px",
                                            opacity: 0.55,
                                            background: "rgba(255,255,255,0.07)",
                                            padding: "1px 6px",
                                            borderRadius: "100px",
                                        }}
                                    >
                    {counts[f.value] ?? 0}
                  </span>
                                </button>
                            ))}
                        </div>
                    </AnimatedSection>

                    {/* Cards grid */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
                            gap: "20px",
                        }}
                    >
                        {filtered.map((item, i) => (
                            <PressCard key={item.id} item={item} delay={i * 0.06} />
                        ))}
                    </div>

                    {/* Press Kit + Inquiry CTA */}
                    <AnimatedSection delay={0.3}>
                        <div
                            style={{
                                marginTop: "96px",
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                                gap: "20px",
                            }}
                        >
                            {/* Download Kit */}
                            <div
                                style={{
                                    padding: "40px 36px",
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: "12px",
                                }}
                            >
                                <div
                                    style={{
                                        width: "44px",
                                        height: "44px",
                                        borderRadius: "8px",
                                        background: "rgba(201,168,76,0.1)",
                                        border: "1px solid rgba(201,168,76,0.2)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginBottom: "20px",
                                    }}
                                >
                                    <Download size={18} style={{ color: "var(--gold, #C9A84C)" }} />
                                </div>
                                <h3
                                    style={{
                                        fontFamily: "var(--font-display)",
                                        fontSize: "22px",
                                        margin: "0 0 10px",
                                        letterSpacing: "-0.02em",
                                    }}
                                >
                                    Press Kit
                                </h3>
                                <p
                                    style={{
                                        fontSize: "13px",
                                        lineHeight: 1.7,
                                        color: "rgba(255,255,255,0.4)",
                                        margin: "0 0 24px",
                                    }}
                                >
                                    Download the full press kit including high-resolution author
                                    photos, book cover files, official bio, and previous
                                    coverage.
                                </p>
                                <a
                                    href="#"
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        padding: "10px 20px",
                                        background: "rgba(201,168,76,0.08)",
                                        border: "1px solid rgba(201,168,76,0.2)",
                                        color: "var(--gold, #C9A84C)",
                                        borderRadius: "4px",
                                        fontSize: "12px",
                                        fontWeight: 600,
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        textDecoration: "none",
                                        transition: "background 0.2s ease",
                                    }}
                                >
                                    <Download size={13} />
                                    Download Kit (.zip)
                                </a>
                            </div>

                            {/* Contact for press */}
                            <div
                                style={{
                                    padding: "40px 36px",
                                    background: "rgba(201,168,76,0.04)",
                                    border: "1px solid rgba(201,168,76,0.14)",
                                    borderRadius: "12px",
                                }}
                            >
                                <div
                                    style={{
                                        width: "44px",
                                        height: "44px",
                                        borderRadius: "8px",
                                        background: "rgba(201,168,76,0.1)",
                                        border: "1px solid rgba(201,168,76,0.2)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginBottom: "20px",
                                    }}
                                >
                                    <Quote size={18} style={{ color: "var(--gold, #C9A84C)" }} />
                                </div>
                                <h3
                                    style={{
                                        fontFamily: "var(--font-display)",
                                        fontSize: "22px",
                                        margin: "0 0 10px",
                                        letterSpacing: "-0.02em",
                                    }}
                                >
                                    Press Inquiries
                                </h3>
                                <p
                                    style={{
                                        fontSize: "13px",
                                        lineHeight: 1.7,
                                        color: "rgba(255,255,255,0.4)",
                                        margin: "0 0 24px",
                                    }}
                                >
                                    For interview requests, review copies, or media partnerships,
                                    reach out directly. Typical response time is one business day.
                                </p>
                                <Link
                                    href="/contact"
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        padding: "10px 20px",
                                        background: "var(--gold, #C9A84C)",
                                        color: "#0a0a0a",
                                        borderRadius: "4px",
                                        fontSize: "12px",
                                        fontWeight: 700,
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        textDecoration: "none",
                                    }}
                                >
                                    Send Inquiry
                                    <ExternalLink size={12} />
                                </Link>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>
        </>
    );
}