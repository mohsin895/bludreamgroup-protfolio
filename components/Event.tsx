"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { fetchMappedEvents, type MappedEvent } from "@/lib/api/event";

// ─── Skeleton row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "32px",
                padding: "24px 0",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
        >
            {/* date */}
            <div
                style={{
                    minWidth: "80px",
                    height: "24px",
                    borderRadius: "4px",
                    background: "rgba(255,255,255,0.06)",
                    animation: "shimmer 1.5s ease-in-out infinite",
                }}
            />
            {/* title + city */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                <div
                    style={{
                        height: "16px",
                        width: "55%",
                        borderRadius: "3px",
                        background: "rgba(255,255,255,0.06)",
                        animation: "shimmer 1.5s ease-in-out infinite 0.1s",
                    }}
                />
                <div
                    style={{
                        height: "12px",
                        width: "30%",
                        borderRadius: "3px",
                        background: "rgba(255,255,255,0.04)",
                        animation: "shimmer 1.5s ease-in-out infinite 0.2s",
                    }}
                />
            </div>
            {/* tag */}
            <div
                style={{
                    width: "72px",
                    height: "22px",
                    borderRadius: "100px",
                    background: "rgba(255,255,255,0.05)",
                    animation: "shimmer 1.5s ease-in-out infinite 0.3s",
                }}
            />
            {/* arrow */}
            <div
                style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "3px",
                    background: "rgba(255,255,255,0.04)",
                    animation: "shimmer 1.5s ease-in-out infinite 0.4s",
                }}
            />
        </div>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Event() {
    const [events,  setEvents]  = useState<MappedEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState<string | null>(null);

    useEffect(() => {
        fetchMappedEvents()
            .then((all) => {
                // Only upcoming events, max 3 for the homepage teaser
                const upcoming = all
                    .filter((e) => e.status !== "past")
                    .slice(0, 3);
                setEvents(upcoming);
            })
            .catch((err) => setError(err instanceof Error ? err.message : "Failed to load events."))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            {/* ── UPCOMING EVENTS ── */}
            <section className="section" style={{ background: "var(--bg)" }}>
                <div className="container">

                    {/* Header row */}
                    <AnimatedSection
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                            marginBottom: "40px",
                            flexWrap: "wrap",
                            gap: "16px",
                        }}
                    >
                        <div>
                            <div className="section-label">On Tour</div>
                            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(38px, 4vw, 52px)" }}>
                                Upcoming Events
                            </h2>
                        </div>
                        <Link href="/events" className="btn-outline">All Events</Link>
                    </AnimatedSection>

                    {/* ── Loading ── */}
                    {loading && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                            {[1, 2, 3].map((n) => <SkeletonRow key={n} />)}
                        </div>
                    )}

                    {/* ── Error ── */}
                    {!loading && error && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                padding: "24px 0",
                                color: "rgba(255,255,255,0.3)",
                                fontSize: "14px",
                            }}
                        >
                            <AlertCircle size={16} style={{ color: "#C47C5A", flexShrink: 0 }} />
                            {error}
                        </div>
                    )}

                    {/* ── Empty ── */}
                    {!loading && !error && events.length === 0 && (
                        <div
                            style={{
                                padding: "40px 0",
                                color: "rgba(255,255,255,0.25)",
                                fontSize: "14px",
                                borderTop: "1px solid rgba(255,255,255,0.05)",
                            }}
                        >
                            No upcoming events scheduled at this time.
                        </div>
                    )}

                    {/* ── Event rows ── */}
                    {!loading && !error && events.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                            {events.map((ev, i) => (
                                <AnimatedSection key={ev.id} delay={i * 0.07}>
                                    <Link
                                        href="/events"
                                        style={{ textDecoration: "none", display: "block" }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "32px",
                                                padding: "24px 0",
                                                borderBottom: "1px solid rgba(255,255,255,0.05)",
                                                cursor: "pointer",
                                                transition: "background 0.2s ease",
                                            }}
                                            onMouseEnter={(e) =>
                                                ((e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.02)")
                                            }
                                            onMouseLeave={(e) =>
                                                ((e.currentTarget as HTMLElement).style.background = "transparent")
                                            }
                                        >
                                            {/* Date */}
                                            <div style={{ minWidth: "80px" }}>
                                                <div
                                                    style={{
                                                        fontFamily: "var(--font-display)",
                                                        fontSize: "22px",
                                                        color: "var(--gold)",
                                                        lineHeight: 1.1,
                                                    }}
                                                >
                                                    {ev.month} {ev.day}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: "11px",
                                                        color: "rgba(255,255,255,0.2)",
                                                        letterSpacing: "0.06em",
                                                        marginTop: "2px",
                                                    }}
                                                >
                                                    {ev.year}
                                                </div>
                                            </div>

                                            {/* Title + location */}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div
                                                    style={{
                                                        fontSize: "16px",
                                                        fontWeight: 500,
                                                        color: "var(--text)",
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {ev.title}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: "13px",
                                                        color: "var(--text-muted)",
                                                        marginTop: "2px",
                                                    }}
                                                >
                                                    {ev.city}
                                                </div>
                                            </div>

                                            {/* Type tag */}
                                            <span className="tag">{ev.categoryTitle}</span>

                                            {/* Arrow */}
                                            <ArrowRight size={16} style={{ color: "var(--text-dim)", flexShrink: 0 }} />
                                        </div>
                                    </Link>
                                </AnimatedSection>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1;   }
        }
      `}</style>
        </>
    );
}