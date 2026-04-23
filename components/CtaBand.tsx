"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";


export default function CtaBand() {
    const [heroLoaded, setHeroLoaded] = useState(false);
    const videoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setHeroLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>



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


        </>
    );
}
