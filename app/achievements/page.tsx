"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface Award {
    id: number;
    title: string;
    image: string;
    organization: string;
    color: string;
    year: string;
    status: string;
}

interface CareerJourney {
    id: number;
    title: string;
    description: string;
    year: string;
    status: string;
}

interface ImageUrls {
    original: string;
    small: string;
    medium: string;
    large: string;
}

/* ─── Static Data (unchanged) ───────────────────────────────────────────── */
const stats = [
    { value: 3200000, suffix: "+", label: "Books Sold", prefix: "" },
    { value: 200, suffix: "+", label: "Keynotes Delivered", prefix: "" },
    { value: 47, suffix: "", label: "Countries Reached", prefix: "" },
    { value: 18, suffix: "", label: "Years of Excellence", prefix: "" },
];

/* ─── API Configuration ─────────────────────────────────────────────────── */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ;
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ;

/* ─── Utility Functions ─────────────────────────────────────────────────── */
function parseImageJson(imageJson: string): ImageUrls | null {
    try {
        return JSON.parse(imageJson);
    } catch {
        return null;
    }
}

function getImageUrl(imageJson: string, size: 'original' | 'small' | 'medium' | 'large' = 'medium'): string {
    const parsed = parseImageJson(imageJson);
    if (!parsed) return '';
    return IMAGE_BASE_URL + (parsed[size] || parsed.original || '');
}

/* ─── Hooks ─────────────────────────────────────────────────────────────── */
function useInView(threshold = 0.2) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, inView };
}

function useCounter(target: number, active: boolean, duration = 2000) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!active) return;
        let start: number | null = null;
        const step = (ts: number) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setValue(Math.floor(ease * target));
            if (progress < 1) requestAnimationFrame(step);
            else setValue(target);
        };
        requestAnimationFrame(step);
    }, [active, target, duration]);
    return value;
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function StatCard({ stat, delay }: { stat: typeof stats[0]; delay: number }) {
    const { ref, inView } = useInView(0.3);
    const count = useCounter(stat.value, inView, 2200);

    const display =
        stat.value >= 1_000_000
            ? (count / 1_000_000).toFixed(1) + "M"
            : count.toLocaleString();

    return (
        <div
            ref={ref}
            style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0) scale(1)" : "translateY(40px) scale(0.95)",
                transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
                background: "rgba(130,195,216,0.04)",
                border: "1px solid rgba(130,195,216,0.12)",
                borderRadius: "8px",
                padding: "40px 32px",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <div style={{
                position: "absolute", top: 0, right: 0,
                width: "60px", height: "60px",
                background: "linear-gradient(225deg, rgba(130,195,216,0.15) 0%, transparent 60%)",
                borderRadius: "0 8px 0 0",
            }} />
            <div style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(48px,5vw,72px)",
                lineHeight: 1,
                color: "#82c3d8",
                letterSpacing: "-0.03em",
                fontWeight: 300,
            }}>
                {stat.prefix}{display}{stat.suffix}
            </div>
            <div style={{
                marginTop: "10px",
                fontSize: "11px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
            }}>
                {stat.label}
            </div>
        </div>
    );
}

function TimelineItem({ item, idx }: { item: CareerJourney; idx: number }) {
    const { ref, inView } = useInView(0.25);
    const isEven = idx % 2 === 0;

    return (
        <div
            ref={ref}
            style={{
                display: "grid",
                gridTemplateColumns: "1fr 60px 1fr",
                gap: "0",
                marginBottom: "0",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(30px)",
                transition: `opacity 0.7s ease ${idx * 0.1}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${idx * 0.1}s`,
            }}
        >
            {/* Left content */}
            <div style={{ paddingRight: "32px", paddingBottom: "60px", textAlign: "right", ...(isEven ? {} : { visibility: "hidden" }) }}>
                {isEven && <TimelineCard item={item} align="right" />}
            </div>

            {/* Center spine */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{
                    width: "14px", height: "14px", borderRadius: "50%",
                    background: inView ? "#82c3d8" : "transparent",
                    border: "2px solid #82c3d8",
                    boxShadow: inView ? "0 0 20px rgba(130,195,216,0.5)" : "none",
                    transition: `background 0.4s ease ${idx * 0.1 + 0.3}s, box-shadow 0.4s ease ${idx * 0.1 + 0.3}s`,
                    zIndex: 1, flexShrink: 0, marginTop: "8px",
                }} />
                <div style={{ flex: 1, width: "1px", background: "rgba(130,195,216,0.18)", minHeight: "60px" }} />
            </div>

            {/* Right content */}
            <div style={{ paddingLeft: "32px", paddingBottom: "60px", ...(!isEven ? {} : { visibility: "hidden" }) }}>
                {!isEven && <TimelineCard item={item} align="left" />}
            </div>
        </div>
    );
}

function TimelineCard({ item, align }: { item: CareerJourney; align: "left" | "right" }) {
    // Auto-generate tag from title (first word or key phrase)
    const tag = item.title.split(' ')[0];

    return (
        <div style={{ textAlign: align }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: align === "right" ? "flex-end" : "flex-start", marginBottom: "8px" }}>
                <span style={{
                    fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em",
                    textTransform: "uppercase", color: "#82c3d8",
                    background: "rgba(130,195,216,0.1)", border: "1px solid rgba(130,195,216,0.25)",
                    padding: "3px 10px", borderRadius: "20px",
                }}>{tag}</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "rgba(255,255,255,0.15)", letterSpacing: "-0.02em" }}>{item.year}</span>
            </div>
            <h3 style={{
                fontFamily: "var(--font-display)", fontSize: "clamp(20px,2vw,26px)",
                color: "#fff", margin: "0 0 10px", fontWeight: 400, letterSpacing: "-0.01em",
            }}>{item.title}</h3>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0, maxWidth: "340px", marginLeft: align === "right" ? "auto" : 0 }}>
                {item.description}
            </p>
        </div>
    );
}

function AwardCard({ award, idx }: { award: Award; idx: number }) {
    const { ref, inView } = useInView(0.2);
    const [hovered, setHovered] = useState(false);

    // Icon mapping based on award type
    const getIcon = () => {
        const icons = ["◈", "◆", "◉", "◈", "◆", "◉"];
        return icons[idx % icons.length];
    };

    return (
        <div
            ref={ref}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                opacity: inView ? 1 : 0,
                transform: inView
                    ? hovered ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)"
                    : "translateY(40px) scale(0.95)",
                transition: `opacity 0.6s ease ${idx * 0.08}s, transform ${inView ? "0.35s cubic-bezier(0.16,1,0.3,1)" : `0.6s cubic-bezier(0.16,1,0.3,1) ${idx * 0.08}s`}`,
                background: hovered ? "rgba(130,195,216,0.07)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${hovered ? "rgba(130,195,216,0.3)" : "rgba(255,255,255,0.07)"}`,
                borderRadius: "8px",
                padding: "28px 24px",
                cursor: "default",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Glow bg on hover */}
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                background: hovered ? `linear-gradient(90deg, transparent, ${award.color}, transparent)` : "transparent",
                transition: "background 0.35s ease",
            }} />

            <div style={{
                width: "60px",
                height: "60px",
                marginBottom: "16px",
                borderRadius: "8px",
                overflow: "hidden",
                border: `1px solid ${hovered ? award.color : "rgba(255,255,255,0.1)"}`,
            }}>
                <img
                    src={getImageUrl(award.image, 'small')}
                    alt={award.title}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "#fff", marginBottom: "6px", fontWeight: 400 }}>
                {award.title}
            </div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "12px" }}>{award.organization}</div>
            <div style={{
                fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em",
                color: award.color, textTransform: "uppercase",
            }}>{award.year}</div>
        </div>
    );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function AchievementsPage() {
    const [awards, setAwards] = useState<Award[]>([]);
    const [careerJourney, setCareerJourney] = useState<CareerJourney[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const heroRef = useRef<HTMLDivElement>(null);
    const [heroVisible, setHeroVisible] = useState(false);
    const { ref: quoteRef, inView: quoteInView } = useInView(0.3);
    const { ref: timelineHeadRef, inView: timelineHeadInView } = useInView(0.3);
    const { ref: awardsHeadRef, inView: awardsHeadInView } = useInView(0.3);

    // Fetch data from API
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);

                const [awardsRes, journeyRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/award`),
                    fetch(`${API_BASE_URL}/career-journey`)
                ]);

                if (!awardsRes.ok || !journeyRes.ok) {
                    throw new Error('Failed to fetch data');
                }

                const awardsData = await awardsRes.json();
                const journeyData = await journeyRes.json();

                if (awardsData.status && awardsData.data) {
                    // Filter only active awards
                    setAwards(awardsData.data.filter((a: Award) => a.status === 'active'));
                }

                if (journeyData.status && journeyData.data) {
                    // Filter only active journey items and sort by year descending
                    const activeJourney = journeyData.data
                        .filter((j: CareerJourney) => j.status === 'active')
                        .sort((a: CareerJourney, b: CareerJourney) => parseInt(b.year) - parseInt(a.year));
                    setCareerJourney(activeJourney);
                }

                setError(null);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load achievements data. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        const t = setTimeout(() => setHeroVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    return (
        <>
            <Navbar />

            <main style={{ background: "#080c10", minHeight: "100vh", color: "#fff", fontFamily: "var(--font-body, sans-serif)", overflow: "hidden" }}>

                {/* ── HERO ─────────────────────────────────────────────────── */}
                <section style={{ position: "relative", paddingTop: "160px", paddingBottom: "120px", overflow: "hidden" }}>
                    {/* Decorative orbs */}
                    <div style={{ position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)", width: "800px", height: "500px", background: "radial-gradient(ellipse, rgba(130,195,216,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
                    <div style={{ position: "absolute", bottom: 0, right: "-200px", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(200,169,110,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

                    {/* Grid lines */}
                    <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(130,195,216,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(130,195,216,0.025) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

                    <div ref={heroRef} className="container" style={{ textAlign: "center", position: "relative" }}>
                        {/* Label */}
                        <div style={{
                            display: "inline-flex", alignItems: "center", gap: "10px",
                            fontSize: "11px", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase",
                            color: "#82c3d8", marginBottom: "28px",
                            opacity: heroVisible ? 1 : 0,
                            transform: heroVisible ? "translateY(0)" : "translateY(16px)",
                            transition: "all 0.7s ease 0.1s",
                        }}>
                            <span style={{ display: "block", width: "32px", height: "1px", background: "#82c3d8" }} />
                            Milestones & Recognition
                            <span style={{ display: "block", width: "32px", height: "1px", background: "#82c3d8" }} />
                        </div>

                        {/* Headline */}
                        <h1 style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(52px, 8vw, 110px)",
                            lineHeight: 0.95,
                            margin: "0 0 32px",
                            letterSpacing: "-0.03em",
                            opacity: heroVisible ? 1 : 0,
                            transform: heroVisible ? "translateY(0)" : "translateY(30px)",
                            transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s",
                        }}>
                            <span style={{ display: "block", color: "#fff" }}>A Legacy</span>
                            <span style={{ display: "block", background: "linear-gradient(135deg, #82c3d8 0%, #c8a96e 60%, #82c3d8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                                of Impact
                            </span>
                        </h1>

                        <p style={{
                            fontSize: "clamp(15px,1.5vw,18px)", color: "rgba(255,255,255,0.5)",
                            maxWidth: "560px", margin: "0 auto", lineHeight: 1.75,
                            opacity: heroVisible ? 1 : 0,
                            transform: heroVisible ? "translateY(0)" : "translateY(20px)",
                            transition: "all 0.8s ease 0.4s",
                        }}>
                            Two decades of transforming leaders, shaping organisations, and
                            leaving an indelible mark on the global conversation around leadership.
                        </p>

                        {/* Scroll cue */}
                        <div style={{
                            marginTop: "60px",
                            display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
                            opacity: heroVisible ? 0.4 : 0,
                            transition: "opacity 0.8s ease 0.9s",
                        }}>
                            <span style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>Scroll</span>
                            <div style={{ width: "1px", height: "48px", background: "linear-gradient(to bottom, #82c3d8, transparent)", animation: "scrollPulse 2s ease infinite" }} />
                        </div>
                    </div>
                </section>

                {/* ── STATS ────────────────────────────────────────────────── */}
                <section style={{ padding: "80px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="container">
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                            {stats.map((s, i) => <StatCard key={s.label} stat={s} delay={i * 0.1} />)}
                        </div>
                    </div>
                </section>

                {/* ── QUOTE ────────────────────────────────────────────────── */}
                <section style={{ padding: "100px 0" }}>
                    <div className="container">
                        <div
                            ref={quoteRef}
                            style={{
                                borderLeft: "3px solid #82c3d8",
                                paddingLeft: "48px",
                                maxWidth: "780px",
                                margin: "0 auto",
                                opacity: quoteInView ? 1 : 0,
                                transform: quoteInView ? "translateX(0)" : "translateX(-40px)",
                                transition: "all 0.9s cubic-bezier(0.16,1,0.3,1)",
                            }}
                        >
                            <div style={{ fontSize: "80px", lineHeight: 0.6, color: "rgba(130,195,216,0.25)", fontFamily: "var(--font-display)", marginBottom: "16px" }}>"</div>
                            <blockquote style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px,3vw,36px)", color: "#fff", lineHeight: 1.4, fontWeight: 300, margin: "0 0 24px", letterSpacing: "-0.01em" }}>
                                Leadership is not a position you hold — it is a standard you set, every single day.
                            </blockquote>
                            <cite style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", fontStyle: "normal" }}>
                                — Alexandra Voss, The Sovereign Leader
                            </cite>
                        </div>
                    </div>
                </section>

                {/* ── TIMELINE ─────────────────────────────────────────────── */}
                <section style={{ padding: "100px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="container">
                        {/* Heading */}
                        <div
                            ref={timelineHeadRef}
                            style={{
                                textAlign: "center", marginBottom: "80px",
                                opacity: timelineHeadInView ? 1 : 0,
                                transform: timelineHeadInView ? "translateY(0)" : "translateY(30px)",
                                transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)",
                            }}
                        >
                            <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#82c3d8", marginBottom: "16px" }}>The Journey</div>
                            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px,4vw,56px)", color: "#fff", margin: 0, fontWeight: 300, letterSpacing: "-0.02em" }}>
                                Career Milestones
                            </h2>
                        </div>

                        {/* Timeline */}
                        {loading ? (
                            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.5)" }}>
                                Loading journey...
                            </div>
                        ) : error ? (
                            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(235,64,52,0.8)" }}>
                                {error}
                            </div>
                        ) : careerJourney.length > 0 ? (
                            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                                {careerJourney.map((item, i) => (
                                    <TimelineItem key={item.id} item={item} idx={i} />
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.5)" }}>
                                No journey data available
                            </div>
                        )}
                    </div>
                </section>

                {/* ── AWARDS ───────────────────────────────────────────────── */}
                <section style={{ padding: "100px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="container">
                        <div
                            ref={awardsHeadRef}
                            style={{
                                textAlign: "center", marginBottom: "64px",
                                opacity: awardsHeadInView ? 1 : 0,
                                transform: awardsHeadInView ? "translateY(0)" : "translateY(30px)",
                                transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)",
                            }}
                        >
                            <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#82c3d8", marginBottom: "16px" }}>Awards & Honours</div>
                            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px,4vw,56px)", color: "#fff", margin: 0, fontWeight: 300, letterSpacing: "-0.02em" }}>
                                Recognised Worldwide
                            </h2>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.5)" }}>
                                Loading awards...
                            </div>
                        ) : error ? (
                            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(235,64,52,0.8)" }}>
                                {error}
                            </div>
                        ) : awards.length > 0 ? (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
                                {awards.map((a, i) => <AwardCard key={a.id} award={a} idx={i} />)}
                            </div>
                        ) : (
                            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.5)" }}>
                                No awards available
                            </div>
                        )}
                    </div>
                </section>

                {/* ── CLOSING CTA ──────────────────────────────────────────── */}
                <ClosingCTA />

                <style>{`
                    @keyframes scrollPulse {
                        0%,100% { opacity: 0.4; transform: scaleY(1); }
                        50% { opacity: 1; transform: scaleY(1.1); }
                    }
                    @media (max-width: 700px) {
                        /* Mobile optimizations */
                    }
                `}</style>
            </main>

            <Footer />
        </>
    );
}

/* ─── Closing CTA ────────────────────────────────────────────────────────── */
function ClosingCTA() {
    const { ref, inView } = useInView(0.3);
    return (
        <section style={{ padding: "120px 0", borderTop: "1px solid rgba(255,255,255,0.05)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 70% at 50% 100%, rgba(130,195,216,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div
                ref={ref}
                className="container"
                style={{
                    textAlign: "center",
                    opacity: inView ? 1 : 0,
                    transform: inView ? "translateY(0)" : "translateY(40px)",
                    transition: "all 0.9s cubic-bezier(0.16,1,0.3,1)",
                }}
            >
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px,5vw,72px)", color: "#fff", margin: "0 0 20px", fontWeight: 300, letterSpacing: "-0.02em" }}>
                    Ready to Write<br />
                    <span style={{ color: "#82c3d8" }}>Your Chapter?</span>
                </h2>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "16px", maxWidth: "480px", margin: "0 auto 40px", lineHeight: 1.7 }}>
                    Join thousands of leaders who have transformed their approach with Alexandra's coaching and programmes.
                </p>
                <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                    <a href="/services" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#82c3d8", color: "#040d12", padding: "14px 32px", borderRadius: "3px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>
                        Work With Me
                    </a>
                    <a href="/books" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "transparent", color: "#82c3d8", padding: "14px 32px", borderRadius: "3px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", border: "1px solid rgba(130,195,216,0.4)" }}>
                        Explore Books
                    </a>
                </div>
            </div>
        </section>
    );
}