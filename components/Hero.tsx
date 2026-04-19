"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Star, BookOpen, Users, Mic, Award, ChevronRight, Play, Quote } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import AnimatedHeader from "@/components/AnimatedHeader";

const books = [
    { title: "The Sovereign Leader", subtitle: "A Framework for Fearless Authority", year: "2024", tag: "Bestseller", color: "#1a1210" },
    { title: "Unwritten Rules", subtitle: "What They Never Teach in Business School", year: "2022", tag: "WSJ #1", color: "#10161a" },
    { title: "The Quiet Revolution", subtitle: "How Introverts Change the World", year: "2020", tag: "Award Winner", color: "#0f1a10" },
];

const stats = [
    { number: "3.2M+", label: "Books Sold" },
    { number: "200+", label: "Keynotes" },
    { number: "47", label: "Countries" },
    { number: "18", label: "Years Experience" },
];

const testimonials = [
    { quote: "Alexandra's coaching transformed the way I lead my team. The ROI was evident within 90 days.", name: "James Whitfield", role: "CEO, Meridian Group", rating: 5 },
    { quote: "The most powerful keynote I've experienced in 20 years of attending industry conferences.", name: "Sarah Chen", role: "SVP, Apex Financial", rating: 5 },
    { quote: "Her book 'Sovereign Leader' is required reading for every manager in our organization.", name: "Dr. Marcus Okafor", role: "Head of L&D, GlobalTech", rating: 5 },
];

const services = [
    { icon: Mic, title: "Keynote Speaking", desc: "Transformative talks for conferences, summits, and corporate events worldwide.", href: "/services#speaking" },
    { icon: Users, title: "Executive Coaching", desc: "1:1 coaching programs for C-suite leaders and high-potential executives.", href: "/services#coaching" },
    { icon: BookOpen, title: "Online Courses", desc: "Self-paced learning programs distilling decades of leadership wisdom.", href: "/courses" },
    { icon: Award, title: "Corporate Workshops", desc: "Custom workshops that shift culture and unlock team performance.", href: "/services#workshops" },
];

const logos = ["Forbes", "Harvard Business Review", "Bloomberg", "TED", "The Guardian", "CNBC", "Fast Company", "Wired"];

export default function Hero() {
    const [heroLoaded, setHeroLoaded] = useState(false);
    const videoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setHeroLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>

            {/* ── HERO ── */}
            <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
                {/* Bg grid */}
                <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                    maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
                }} />
                {/* Gold orb */}
                <div style={{ position: "absolute", top: "10%", right: "5%", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: "10%", left: "-5%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

                <div className="container" style={{ paddingTop: "100px", paddingBottom: "80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
                    {/* Left */}
                    <div>
                        <div style={{ opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s ease 0.1s" }}>
                            <div className="section-label">Bestselling Author · Speaker · Coach</div>
                        </div>

                        <h1 style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(52px, 6vw, 88px)",
                            lineHeight: 1.05,
                            marginTop: "16px",
                            opacity: heroLoaded ? 1 : 0,
                            transform: heroLoaded ? "translateY(0)" : "translateY(24px)",
                            transition: "all 0.8s ease 0.2s",
                        }}>
                            Lead With<br />
                            <span className="gradient-text">Sovereign</span><br />
                            Confidence
                        </h1>

                        <p style={{
                            fontSize: "17px", color: "var(--text-muted)", lineHeight: 1.75, maxWidth: "480px", marginTop: "24px",
                            opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s ease 0.35s",
                        }}>
                            Alexandra Voss is a 3-time bestselling author, executive coach to Fortune 500 leaders, and one of the most sought-after keynote speakers in leadership and personal transformation.
                        </p>

                        <div style={{
                            display: "flex", gap: "16px", marginTop: "36px", flexWrap: "wrap",
                            opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s ease 0.45s",
                        }}>
                            <Link href="/books" className="btn-primary">
                                Explore Books <ArrowRight size={16} />
                            </Link>
                            <Link href="/services" className="btn-outline">
                                Work With Me
                            </Link>
                        </div>

                        {/* Stats row */}
                        <div style={{
                            display: "flex", gap: "40px", marginTop: "56px",
                            opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s ease 0.55s",
                            borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "32px",
                        }}>
                            {stats.map((s) => (
                                <div key={s.label}>
                                    <div style={{ fontFamily: "var(--font-display)", fontSize: "30px", color: "var(--gold)", lineHeight: 1 }}>{s.number}</div>
                                    <div style={{ fontSize: "11px", color: "var(--text-dim)", letterSpacing: "0.08em", marginTop: "4px", textTransform: "uppercase" }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — portrait card */}
                    <div style={{
                        opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? "translateY(0)" : "translateY(30px)", transition: "all 1s ease 0.3s",
                        position: "relative",
                    }}>
                        <div style={{
                            background: "linear-gradient(135deg, #1a1a1a, #111)",
                            border: "1px solid rgba(201,168,76,0.15)",
                            borderRadius: "8px",
                            overflow: "hidden",
                            aspectRatio: "4/5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                        }}>
                            {/* Placeholder portrait */}
                            <div style={{ textAlign: "center" }}>
                                <div style={{ width: "120px", height: "120px", borderRadius: "50%", background: "linear-gradient(135deg, rgba(201,168,76,0.3), rgba(201,168,76,0.05))", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px", fontFamily: "var(--font-display)", color: "var(--gold)" }}>AV</div>
                                <p style={{ marginTop: "20px", color: "var(--text-muted)", fontSize: "13px" }}>Portrait Photo Here</p>
                            </div>

                            {/* Floating badge */}
                            <div style={{ position: "absolute", bottom: "24px", left: "24px", right: "24px", background: "rgba(10,10,10,0.9)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "6px", padding: "16px 20px", backdropFilter: "blur(10px)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: "12px", color: "var(--gold)", fontWeight: 600, letterSpacing: "0.08em" }}>NEW RELEASE</div>
                                        <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--text)", marginTop: "2px" }}>The Sovereign Leader</div>
                                    </div>
                                    <Link href="/books" style={{ background: "var(--gold)", color: "#0a0a0a", padding: "8px 16px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textDecoration: "none", borderRadius: "3px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                                        Get It
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Decorative corner */}
                        <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "80px", height: "80px", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "4px", pointerEvents: "none" }} />
                    </div>
                </div>

                {/* Scroll indicator */}
                <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: 0.4 }}>
                    <div style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)" }}>Scroll</div>
                    <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, var(--gold), transparent)", animation: "pulse 2s infinite" }} />
                </div>

                <style>{`
          @keyframes pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
          @media (max-width: 900px) {
            section > .container { grid-template-columns: 1fr !important; gap: 40px !important; }
            section > .container > div:last-child { display: none; }
          }
        `}</style>
            </section>

            {/* ── LOGOS MARQUEE ── */}
            <section style={{ background: "#0d0d0d", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "24px 0", overflow: "hidden" }}>
                <div style={{ display: "flex", gap: "0" }}>
                    <div className="marquee-track" style={{ display: "flex", gap: "0", whiteSpace: "nowrap" }}>
                        {[...logos, ...logos].map((logo, i) => (
                            <span key={i} style={{ display: "inline-flex", alignItems: "center", padding: "0 48px", fontSize: "13px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-dim)" }}>
                {logo}
                                <span style={{ display: "inline-block", width: "4px", height: "4px", background: "var(--gold)", borderRadius: "50%", marginLeft: "48px", opacity: 0.4 }} />
              </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── ABOUT STRIP ── */}
            <section className="section" style={{ background: "var(--bg)" }}>
                <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
                    <AnimatedSection direction="left">
                        <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "6px", padding: "48px", position: "relative" }}>
                            <Quote size={40} style={{ color: "rgba(201,168,76,0.2)", marginBottom: "20px" }} />
                            <p style={{ fontFamily: "var(--font-display)", fontSize: "24px", lineHeight: 1.5, color: "var(--text)", fontStyle: "italic" }}>
                                "Great leadership isn't about power — it's about the courage to remain fully yourself while serving others fully."
                            </p>
                            <div style={{ marginTop: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
                                <div style={{ width: "32px", height: "1px", background: "var(--gold)" }} />
                                <span style={{ fontSize: "13px", color: "var(--gold)", letterSpacing: "0.08em" }}>Alexandra Voss</span>
                            </div>
                            <div style={{ position: "absolute", bottom: "-1px", left: "48px", right: "48px", height: "2px", background: "linear-gradient(90deg, var(--gold), transparent)" }} />
                        </div>
                    </AnimatedSection>

                    <AnimatedSection direction="right" delay={0.15}>
                        <div className="section-label">About Alexandra</div>
                        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(38px, 4vw, 52px)", color: "var(--text)", marginTop: "4px" }}>
                            A Life Devoted to<br />Human Potential
                        </h2>
                        <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.8, marginTop: "20px" }}>
                            With over 18 years transforming executives and organizations across 47 countries, Alexandra Voss brings a rare combination of intellectual rigor and practical wisdom to every engagement.
                        </p>
                        <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.8, marginTop: "16px" }}>
                            Her three bestselling books have sold over 3.2 million copies, and her frameworks have been adopted by organizations including Google, Microsoft, and the United Nations.
                        </p>
                        <Link href="/about" className="btn-outline" style={{ marginTop: "32px", display: "inline-flex" }}>
                            Full Biography <ArrowRight size={14} />
                        </Link>
                    </AnimatedSection>
                </div>
                <style>{`@media(max-width:768px){section > .container{grid-template-columns:1fr!important;}}`}</style>
            </section>

            {/* ── BOOKS ── */}
            <section className="section" style={{ background: "#0c0c0c" }}>
                <div className="container">
                    <AnimatedSection style={{ textAlign: "center", marginBottom: "56px" }}>
                        <div className="section-label" style={{ justifyContent: "center" }}>Published Works</div>
                        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 4vw, 56px)" }}>Books That Change Minds</h2>
                    </AnimatedSection>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
                        {books.map((book, i) => (
                            <AnimatedSection key={book.title} delay={i * 0.1}>
                                <div className="card" style={{ height: "100%" }}>
                                    <div style={{ background: book.color, aspectRatio: "3/4", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px", borderBottom: "1px solid rgba(255,255,255,0.05)", position: "relative" }}>
                                        <div style={{ position: "absolute", top: "20px", right: "20px" }}>
                                            <span className="tag">{book.tag}</span>
                                        </div>
                                        <div style={{ width: "100%", height: "220px", background: "linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.03))", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <BookOpen size={40} style={{ color: "var(--gold)", opacity: 0.4 }} />
                                        </div>
                                    </div>
                                    <div style={{ padding: "28px" }}>
                                        <div style={{ fontSize: "11px", color: "var(--text-dim)", letterSpacing: "0.1em", marginBottom: "8px" }}>{book.year}</div>
                                        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "24px", color: "var(--text)" }}>{book.title}</h3>
                                        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "6px" }}>{book.subtitle}</p>
                                        <Link href="/books" style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "20px", fontSize: "12px", color: "var(--gold)", textDecoration: "none", fontWeight: 600, letterSpacing: "0.06em" }}>
                                            Learn More <ArrowRight size={12} />
                                        </Link>
                                    </div>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                    <div style={{ textAlign: "center", marginTop: "40px" }}>
                        <Link href="/books" className="btn-outline">View All Books</Link>
                    </div>
                </div>
                <style>{`@media(max-width:768px){section > .container > div:nth-child(2){grid-template-columns:1fr!important;}}`}</style>
            </section>

            {/* ── SERVICES ── */}
            <section className="section" style={{ background: "var(--bg)" }}>
                <div className="container">
                    <AnimatedSection style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px", flexWrap: "wrap", gap: "20px" }}>
                        <div>
                            <div className="section-label">What I Offer</div>
                            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 4vw, 56px)" }}>Transform Your<br />Leadership</h2>
                        </div>
                        <Link href="/services" className="btn-outline">All Services <ArrowRight size={14} /></Link>
                    </AnimatedSection>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
                        {services.map((s, i) => (
                            <AnimatedSection key={s.title} delay={i * 0.08}>
                                <Link href={s.href} style={{ display: "block", textDecoration: "none" }}>
                                    <div className="card" style={{ padding: "32px", height: "100%", cursor: "pointer" }}>
                                        <div style={{ width: "48px", height: "48px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                                            <s.icon size={22} style={{ color: "var(--gold)" }} />
                                        </div>
                                        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "var(--text)" }}>{s.title}</h3>
                                        <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.7, marginTop: "10px" }}>{s.desc}</p>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "20px", color: "var(--gold)", fontSize: "12px", fontWeight: 600 }}>
                                            Explore <ChevronRight size={12} />
                                        </div>
                                    </div>
                                </Link>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
                <style>{`@media(max-width:900px){section > .container > div:last-child{grid-template-columns:1fr 1fr!important;}}@media(max-width:480px){section > .container > div:last-child{grid-template-columns:1fr!important;}}`}</style>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section className="section" style={{ background: "#0c0c0c" }}>
                <div className="container">
                    <AnimatedSection style={{ textAlign: "center", marginBottom: "56px" }}>
                        <div className="section-label" style={{ justifyContent: "center" }}>Social Proof</div>
                        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 4vw, 56px)" }}>Words From Leaders</h2>
                    </AnimatedSection>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
                        {testimonials.map((t, i) => (
                            <AnimatedSection key={t.name} delay={i * 0.1}>
                                <div className="card" style={{ padding: "36px", height: "100%" }}>
                                    <div style={{ display: "flex", gap: "2px", marginBottom: "20px" }}>
                                        {Array(t.rating).fill(0).map((_, j) => (
                                            <Star key={j} size={14} style={{ fill: "var(--gold)", color: "var(--gold)" }} />
                                        ))}
                                    </div>
                                    <p style={{ fontFamily: "var(--font-display)", fontSize: "18px", lineHeight: 1.6, color: "var(--text)", fontStyle: "italic" }}>
                                        "{t.quote}"
                                    </p>
                                    <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                                        <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>{t.name}</div>
                                        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "3px" }}>{t.role}</div>
                                    </div>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>

                    <div style={{ textAlign: "center", marginTop: "40px" }}>
                        <Link href="/testimonials" className="btn-outline">Read All Testimonials</Link>
                    </div>
                </div>
                <style>{`@media(max-width:768px){section > .container > div:nth-child(2){grid-template-columns:1fr!important;}}`}</style>
            </section>

            {/* ── CTA BAND ── */}
            <section style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02))", borderTop: "1px solid rgba(201,168,76,0.12)", borderBottom: "1px solid rgba(201,168,76,0.12)", padding: "80px 0" }}>
                <div className="container" style={{ textAlign: "center" }}>
                    <AnimatedSection>
                        <div className="section-label" style={{ justifyContent: "center" }}>Ready to Begin?</div>
                        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(44px, 5vw, 68px)", marginTop: "8px" }}>
                            Your Next Chapter<br />Starts Here
                        </h2>
                        <p style={{ fontSize: "16px", color: "var(--text-muted)", maxWidth: "500px", margin: "20px auto 0" }}>
                            Whether through a book, a course, or direct engagement — transformation is one decision away.
                        </p>
                        <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "40px", flexWrap: "wrap" }}>
                            <Link href="/contact" className="btn-primary">Book a Consultation <ArrowRight size={16} /></Link>
                            <Link href="/courses" className="btn-outline">Browse Courses</Link>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ── UPCOMING EVENTS ── */}
            <section className="section" style={{ background: "var(--bg)" }}>
                <div className="container">
                    <AnimatedSection style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
                        <div>
                            <div className="section-label">On Tour</div>
                            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(38px, 4vw, 52px)" }}>Upcoming Events</h2>
                        </div>
                        <Link href="/events" className="btn-outline">All Events</Link>
                    </AnimatedSection>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                        {[
                            { date: "May 12", city: "New York, NY", event: "Leadership Summit 2025", type: "Keynote" },
                            { date: "Jun 3", city: "London, UK", event: "Future of Work Conference", type: "Workshop" },
                            { date: "Jul 18", city: "Singapore", event: "Asia Leadership Forum", type: "Keynote" },
                        ].map((ev, i) => (
                            <AnimatedSection key={ev.event} delay={i * 0.07}>
                                <div style={{ display: "flex", alignItems: "center", gap: "32px", padding: "24px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}
                                     onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.02)"}
                                     onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "transparent"}
                                >
                                    <div style={{ minWidth: "80px" }}>
                                        <div style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "var(--gold)" }}>{ev.date}</div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: "16px", fontWeight: 500, color: "var(--text)" }}>{ev.event}</div>
                                        <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>{ev.city}</div>
                                    </div>
                                    <span className="tag">{ev.type}</span>
                                    <ArrowRight size={16} style={{ color: "var(--text-dim)" }} />
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

        </>
    );
}
