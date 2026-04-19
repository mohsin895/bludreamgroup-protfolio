"use client";
import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ─── Data ─────────────────────────────────────────────────── */
const courses = [
    {
        id: 1,
        title: "Publish Your First Book",
        subtitle: "From manuscript to market in 8 weeks",
        instructor: "Naomi Ashford",
        instructorRole: "Bestselling Author",
        avatar: "NA",
        color: "#C9A84C",
        bg: "rgba(201,168,76,0.08)",
        category: "Publishing",
        level: "Beginner",
        duration: "8 weeks",
        lessons: 24,
        students: "3,200+",
        price: "$129",
        featured: true,
        tags: ["Self-Publishing", "Fiction", "Marketing"],
        description:
            "Everything you need to take your manuscript from draft to a professionally published book — formatting, cover design, distribution, and launch strategy included.",
    },
    {
        id: 2,
        title: "Portfolio That Converts",
        subtitle: "Land clients with a design portfolio that sells",
        instructor: "Marcus Yuen",
        instructorRole: "Senior Brand Designer",
        avatar: "MY",
        color: "#7DD4B0",
        bg: "rgba(125,212,176,0.08)",
        category: "Design",
        level: "Intermediate",
        duration: "5 weeks",
        lessons: 18,
        students: "1,800+",
        price: "$99",
        featured: false,
        tags: ["Portfolio", "Freelance", "Branding"],
        description:
            "Stop sending Behance links. Build a portfolio that positions you as the expert, speaks to the right clients, and converts visitors into paying projects.",
    },
    {
        id: 3,
        title: "Running an Indie Press",
        subtitle: "Build a sustainable small publishing house",
        instructor: "Priya Desai",
        instructorRole: "Founder, Lunar Shelf Press",
        avatar: "PD",
        color: "#C97B8C",
        bg: "rgba(201,123,140,0.08)",
        category: "Publishing",
        level: "Advanced",
        duration: "10 weeks",
        lessons: 32,
        students: "740+",
        price: "$199",
        featured: false,
        tags: ["Indie Press", "Distribution", "Curation"],
        description:
            "The operational playbook for launching and running a small press: acquisitions, editorial workflow, print fulfillment, rights management, and building an audience.",
    },
    {
        id: 4,
        title: "Documentary Photography Portfolio",
        subtitle: "Get your work in front of the right editors",
        instructor: "Emre Çelik",
        instructorRole: "Editorial Photographer",
        avatar: "EÇ",
        color: "#8BA7E0",
        bg: "rgba(139,167,224,0.08)",
        category: "Photography",
        level: "Intermediate",
        duration: "6 weeks",
        lessons: 20,
        students: "920+",
        price: "$119",
        featured: false,
        tags: ["Photography", "Editorial", "Sequencing"],
        description:
            "Learn how to sequence and present documentary work, write artist statements that resonate, and build a web presence that gets you noticed by international editors.",
    },
    {
        id: 5,
        title: "Write the Book That Builds Your Business",
        subtitle: "Non-fiction publishing as a marketing engine",
        instructor: "Sasha Orlova",
        instructorRole: "Consultant & Author",
        avatar: "SO",
        color: "#C9A84C",
        bg: "rgba(201,168,76,0.08)",
        category: "Non-Fiction",
        level: "Beginner",
        duration: "6 weeks",
        lessons: 22,
        students: "2,100+",
        price: "$109",
        featured: false,
        tags: ["Non-Fiction", "Business", "Authority"],
        description:
            "Your book is your best business card. This course teaches consultants, coaches, and professionals how to write, publish, and leverage a book as a client acquisition tool.",
    },
    {
        id: 6,
        title: "Self-Publishing Art Books",
        subtitle: "Print, sell, and ship illustrated editions",
        instructor: "Theo Wainwright",
        instructorRole: "Illustrator & Art Director",
        avatar: "TW",
        color: "#7DD4B0",
        bg: "rgba(125,212,176,0.08)",
        category: "Illustration",
        level: "Beginner",
        duration: "4 weeks",
        lessons: 14,
        students: "1,400+",
        price: "$89",
        featured: false,
        tags: ["Art Books", "Print", "Illustration"],
        description:
            "A practical guide to producing beautiful art books: paper selection, color profiles, print-on-demand vs offset, pre-order campaigns, and fulfillment integrations.",
    },
];

const categories = ["All", "Publishing", "Design", "Photography", "Non-Fiction", "Illustration"];
const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

/* ─── Level Badge ───────────────────────────────────────────── */
const levelColors: Record<string, { bg: string; color: string }> = {
    Beginner: { bg: "rgba(125,212,176,0.1)", color: "#7DD4B0" },
    Intermediate: { bg: "rgba(139,167,224,0.1)", color: "#8BA7E0" },
    Advanced: { bg: "rgba(201,123,140,0.1)", color: "#C97B8C" },
};

/* ─── Featured Course Card ──────────────────────────────────── */
function FeaturedCourse({ c }: { c: (typeof courses)[0] }) {
    return (
        <AnimatedSection>
            <div
                style={{
                    position: "relative",
                    background: "#0f0f0f",
                    border: "1px solid rgba(201,168,76,0.2)",
                    borderRadius: "16px",
                    padding: "clamp(32px, 4vw, 52px)",
                    marginBottom: "20px",
                    overflow: "hidden",
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: "40px",
                    alignItems: "center",
                }}
            >
                {/* Top accent */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, var(--gold), transparent)" }} />

                {/* Bg watermark */}
                <div
                    style={{
                        position: "absolute",
                        right: "clamp(180px, 25vw, 320px)",
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontFamily: "var(--font-display)",
                        fontSize: "160px",
                        lineHeight: 1,
                        color: "rgba(201,168,76,0.03)",
                        pointerEvents: "none",
                        userSelect: "none",
                        letterSpacing: "-0.05em",
                    }}
                >
                    01
                </div>

                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <span style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)" }}>
              Featured Course
            </span>
                        <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "inline-block" }} />
                        <span style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
              {c.category}
            </span>
                    </div>

                    <h2
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(24px, 2.8vw, 36px)",
                            color: "#fff",
                            letterSpacing: "-0.02em",
                            lineHeight: 1.15,
                            margin: "0 0 10px",
                        }}
                    >
                        {c.title}
                    </h2>
                    <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", marginBottom: "20px" }}>{c.subtitle}</p>
                    <p style={{ fontSize: "14px", lineHeight: 1.75, color: "rgba(255,255,255,0.5)", maxWidth: "560px", marginBottom: "28px" }}>
                        {c.description}
                    </p>

                    {/* Meta row */}
                    <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", marginBottom: "28px" }}>
                        {[
                            { icon: "◷", label: c.duration },
                            { icon: "▤", label: `${c.lessons} lessons` },
                            { icon: "◎", label: `${c.students} enrolled` },
                        ].map((m) => (
                            <span key={m.label} style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ color: "var(--gold)", fontSize: "11px" }}>{m.icon}</span>
                                {m.label}
              </span>
                        ))}
                    </div>

                    {/* Instructor */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
                        <div
                            style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                background: c.bg,
                                border: `1px solid ${c.color}33`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "11px",
                                fontWeight: 700,
                                color: c.color,
                                letterSpacing: "0.04em",
                                flexShrink: 0,
                            }}
                        >
                            {c.avatar}
                        </div>
                        <div>
                            <div style={{ fontSize: "13px", color: "#fff", fontWeight: 600 }}>{c.instructor}</div>
                            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{c.instructorRole}</div>
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                        <Link
                            href={`/courses/${c.id}`}
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
                            Enroll Now
                        </Link>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "var(--gold)", fontWeight: 700 }}>
              {c.price}
            </span>
                    </div>
                </div>

                {/* Right: tags */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "140px" }}>
                    <div
                        style={{
                            padding: "8px 14px",
                            background: levelColors[c.level]?.bg,
                            border: `1px solid ${levelColors[c.level]?.color}22`,
                            borderRadius: "6px",
                            fontSize: "11px",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: levelColors[c.level]?.color,
                            textAlign: "center",
                        }}
                    >
                        {c.level}
                    </div>
                    {c.tags.map((tag) => (
                        <div
                            key={tag}
                            style={{
                                padding: "7px 14px",
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

/* ─── Course Card ───────────────────────────────────────────── */
function CourseCard({ c, i }: { c: (typeof courses)[0]; i: number }) {
    const [hovered, setHovered] = useState(false);

    return (
        <AnimatedSection delay={i * 0.07}>
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    position: "relative",
                    background: hovered ? "#141414" : "#0f0f0f",
                    border: `1px solid ${hovered ? c.color + "44" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: "12px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    transition: "all 0.32s cubic-bezier(0.16,1,0.3,1)",
                    transform: hovered ? "translateY(-4px)" : "translateY(0)",
                }}
            >
                {/* Top color bar */}
                <div
                    style={{
                        height: "3px",
                        background: `linear-gradient(90deg, ${c.color}, transparent)`,
                        opacity: hovered ? 1 : 0.4,
                        transition: "opacity 0.3s ease",
                    }}
                />

                <div style={{ padding: "28px 28px 0" }}>
                    {/* Category + Level */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
            <span
                style={{
                    fontSize: "10px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: c.color,
                }}
            >
              {c.category}
            </span>
                        <span
                            style={{
                                fontSize: "10px",
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                padding: "3px 10px",
                                background: levelColors[c.level]?.bg,
                                borderRadius: "100px",
                                color: levelColors[c.level]?.color,
                            }}
                        >
              {c.level}
            </span>
                    </div>

                    {/* Title */}
                    <h3
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(17px, 1.4vw, 20px)",
                            color: "#fff",
                            letterSpacing: "-0.01em",
                            lineHeight: 1.25,
                            margin: "0 0 8px",
                        }}
                    >
                        {c.title}
                    </h3>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginBottom: "16px" }}>{c.subtitle}</p>
                    <p style={{ fontSize: "13px", lineHeight: 1.7, color: "rgba(255,255,255,0.45)", marginBottom: "20px" }}>{c.description}</p>
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "0 28px" }} />

                {/* Meta */}
                <div style={{ padding: "16px 28px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    {[
                        { label: c.duration },
                        { label: `${c.lessons} lessons` },
                        { label: `${c.students} enrolled` },
                    ].map((m) => (
                        <span key={m.label} style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>
              {m.label}
            </span>
                    ))}
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "0 28px" }} />

                {/* Footer */}
                <div style={{ padding: "20px 28px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                    {/* Instructor */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                            style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                background: c.bg,
                                border: `1px solid ${c.color}33`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "10px",
                                fontWeight: 700,
                                color: c.color,
                                letterSpacing: "0.04em",
                                flexShrink: 0,
                            }}
                        >
                            {c.avatar}
                        </div>
                        <div>
                            <div style={{ fontSize: "12px", color: "#fff", fontWeight: 600, lineHeight: 1.2 }}>{c.instructor}</div>
                            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{c.instructorRole}</div>
                        </div>
                    </div>

                    {/* Price + CTA */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--gold)", fontWeight: 700 }}>{c.price}</span>
                        <Link
                            href={`/courses/${c.id}`}
                            style={{
                                padding: "8px 16px",
                                background: hovered ? "var(--gold)" : "rgba(201,168,76,0.1)",
                                border: `1px solid ${hovered ? "var(--gold)" : "rgba(201,168,76,0.2)"}`,
                                borderRadius: "5px",
                                fontSize: "11px",
                                fontWeight: 700,
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                color: hovered ? "#0a0a0a" : "var(--gold)",
                                textDecoration: "none",
                                transition: "all 0.25s ease",
                                whiteSpace: "nowrap",
                            }}
                        >
                            Enroll →
                        </Link>
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function CoursesPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeLevel, setActiveLevel] = useState("All Levels");

    const featured = courses.find((c) => c.featured)!;
    const rest = courses.filter((c) => !c.featured);

    return (
        <>
            <Navbar />

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
                {/* Glow */}
                <div
                    style={{
                        position: "absolute",
                        top: "-100px",
                        right: "-250px",
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
                Courses
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
                            Learn from
                            <br />
                            <span style={{ color: "transparent", WebkitTextStroke: "1px rgba(201,168,76,0.55)" }}>
                those who did it.
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
                            Practical courses on publishing, portfolio building, and creative business — taught by practitioners with real results.
                        </p>

                        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                            <Link
                                href="#courses"
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
                                Browse Courses ↓
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

            {/* ── Stats Bar ── */}
            <section
                style={{
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    background: "#0a0a0a",
                    padding: "32px 0",
                }}
            >
                <div className="container">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(24px, 5vw, 72px)", flexWrap: "wrap" }}>
                        {[
                            { value: `${courses.length}`, label: "Courses Available" },
                            { value: "10,200+", label: "Students Enrolled" },
                            { value: "4.9★", label: "Average Rating" },
                            { value: "Lifetime", label: "Access Included" },
                        ].map((s) => (
                            <div key={s.label} style={{ textAlign: "center" }}>
                                <div style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 700, color: "var(--gold)", letterSpacing: "-0.02em" }}>
                                    {s.value}
                                </div>
                                <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Featured Course ── */}
            <section style={{ background: "#0a0a0a", paddingTop: "80px", paddingBottom: "0" }}>
                <div className="container">
                    <FeaturedCourse c={featured} />
                </div>
            </section>

            {/* ── Grid ── */}
            <section id="courses" style={{ background: "#0a0a0a", padding: "56px 0 120px" }}>
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
                            {/* Category filters */}
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

                            {/* Level filter */}
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                {levels.map((lvl) => (
                                    <button
                                        key={lvl}
                                        onClick={() => setActiveLevel(lvl)}
                                        style={{
                                            padding: "7px 14px",
                                            fontSize: "11px",
                                            letterSpacing: "0.06em",
                                            background: activeLevel === lvl ? "rgba(255,255,255,0.06)" : "transparent",
                                            border: `1px solid ${activeLevel === lvl ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"}`,
                                            borderRadius: "100px",
                                            color: activeLevel === lvl ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",
                                        }}
                                    >
                                        {lvl}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
                        {rest.map((c, i) => (
                            <CourseCard key={c.id} c={c} i={i} />
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
                        <div style={{ maxWidth: "580px", margin: "0 auto" }}>
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
                                Teach what you know.
                            </h2>
                            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "36px" }}>
                                Are you a published author, working designer, or industry professional? Apply to teach on the platform and reach thousands of ambitious creators.
                            </p>
                            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                                <Link
                                    href="/teach"
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
                                    Apply to Teach
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

            <Footer />
        </>
    );
}