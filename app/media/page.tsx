"use client";

import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect, useCallback } from "react";
import {
    getMediaItems,
    deleteMediaItem,
    type MediaItem,
    type MediaType,
    type MediaStats,
} from "@/lib/api/media";

// ─── Filter config ────────────────────────────────────────────────────────────

const FILTERS: { label: string; value: string }[] = [
    { label: "All",    value: "all"   },
    { label: "Photos", value: "photo" },
    { label: "Videos", value: "video" },
    { label: "Press",  value: "press" },
    { label: "Events", value: "event" },
];

const PRESS_LOGOS = [
    "The New York Times",
    "The Guardian",
    "NPR Books",
    "Lit Hub",
    "The Paris Review",
    "Publishers Weekly",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function typeLabel(type: MediaType) {
    const labels: Record<MediaType, string> = {
        photo: "Photo",
        video: "Video",
        press: "Press",
        event: "Event",
    };
    return labels[type];
}

function bgGradient(item: MediaItem) {
    const palettes: Record<string, string[]> = {
        "#C9A84C": ["#1a1508", "#2e2209", "#3d2f0a"],
        "#7C9A7E": ["#0a130a", "#0f1f10", "#152a16"],
        "#9B8BC4": ["#100e1a", "#181428", "#201a34"],
        "#C47C5A": ["#1a0e08", "#2e180f", "#3d2115"],
    };
    const stops = palettes[item.accent_color] ?? palettes["#C9A84C"];
    return `radial-gradient(ellipse at 30% 40%, ${stops[1]} 0%, ${stops[0]} 60%, ${stops[2]} 100%)`;
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function SkeletonCard() {
    return (
        <div
            style={{
                borderRadius: "8px",
                overflow: "hidden",
                aspectRatio: "4/3",
                background: "linear-gradient(135deg, #1a1a1a 0%, #222 50%, #1a1a1a 100%)",
                border: "1px solid rgba(255,255,255,0.04)",
                animation: "skeleton-pulse 1.6s ease-in-out infinite",
            }}
        />
    );
}

// ─── Media Card ───────────────────────────────────────────────────────────────

function MediaCard({
                       item,
                       delay,
                       onClick,
                       onDelete,
                   }: {
    item: MediaItem;
    delay: number;
    onClick: () => void;
    onDelete?: (id: number) => void;
}) {
    const [hovered, setHovered] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm(`Delete "${item.title}"?`)) return;
        setDeleting(true);
        try {
            await deleteMediaItem(item.id);
            onDelete?.(item.id);
        } catch {
            alert("Failed to delete item.");
            setDeleting(false);
        }
    };

    return (
        <AnimatedSection delay={delay}>
            <div
                onClick={onClick}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    position: "relative",
                    borderRadius: "8px",
                    overflow: "hidden",
                    cursor: "pointer",
                    aspectRatio: item.aspect_ratio,
                    background: bgGradient(item),
                    border: `1px solid rgba(255,255,255,${hovered ? "0.1" : "0.05"})`,
                    transition: "border-color 0.3s ease, transform 0.3s ease",
                    transform: hovered ? "translateY(-3px)" : "translateY(0)",
                    opacity: deleting ? 0.4 : 1,
                }}
            >
                {/* Decorative grid */}
                <svg
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        opacity: hovered ? 0.18 : 0.1,
                        transition: "opacity 0.4s ease",
                        pointerEvents: "none",
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <pattern id={`grid-${item.id}`} width="32" height="32" patternUnits="userSpaceOnUse">
                            <path d="M 32 0 L 0 0 0 32" fill="none" stroke={item.accent_color} strokeWidth="0.4" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#grid-${item.id})`} />
                </svg>

                {/* Accent line */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, ${item.accent_color}99, transparent)` }} />

                {/* Top meta */}
                <div style={{ position: "absolute", top: "16px", left: "16px", right: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: item.accent_color, background: `${item.accent_color}14`, border: `1px solid ${item.accent_color}30`, padding: "4px 10px", borderRadius: "3px" }}>
                        {typeLabel(item.type)}
                    </span>
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>{item.date}</span>
                </div>

                {/* Delete button (hover) */}
                {onDelete && (
                    <button
                        onClick={handleDelete}
                        title="Delete"
                        style={{
                            position: "absolute",
                            top: "12px",
                            right: "12px",
                            zIndex: 10,
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            background: "rgba(220,50,50,0.85)",
                            border: "none",
                            color: "#fff",
                            fontSize: "14px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: hovered ? 1 : 0,
                            transition: "opacity 0.2s ease",
                        }}
                    >
                        ×
                    </button>
                )}

                {/* Featured badge */}
                {item.is_featured && (
                    <div style={{ position: "absolute", top: "46px", left: "16px", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase", color: item.accent_color, opacity: 0.7 }}>
                        ★ Featured
                    </div>
                )}

                {/* Bottom content */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "48px 20px 20px", background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)" }}>
                    <div style={{ fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "6px" }}>
                        {item.category}
                    </div>
                    <h3 style={{ fontSize: "14px", fontWeight: 500, lineHeight: 1.4, color: "#fff", margin: "0 0 6px" }}>
                        {item.title}
                    </h3>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", margin: 0 }}>
                        {item.subtitle}
                    </p>

                    {/* Hover reveal */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "12px", opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(6px)", transition: "opacity 0.25s ease, transform 0.25s ease" }}>
                        <span style={{ fontSize: "11px", color: item.accent_color, letterSpacing: "0.08em" }}>
                            View {typeLabel(item.type)}
                        </span>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: item.accent_color }}>
                            <path d="M2 6H10M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                {/* Video play indicator */}
                {item.type === "video" && (
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: `translate(-50%, -50%) scale(${hovered ? 1.1 : 1})`, width: "48px", height: "48px", borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: `1.5px solid ${hovered ? item.accent_color : item.accent_color + "60"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.3s ease, border-color 0.3s ease" }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill={item.accent_color}>
                            <path d="M4 2.5L11.5 7L4 11.5V2.5Z" />
                        </svg>
                    </div>
                )}
            </div>
        </AnimatedSection>
    );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({ item, onClose, onPrev, onNext }: { item: MediaItem; onClose: () => void; onPrev: () => void; onNext: () => void }) {
    return (
        <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
            <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "760px", width: "100%", background: "#111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ aspectRatio: "16/9", background: bgGradient(item), display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.12 }} xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="lb-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke={item.accent_color} strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#lb-grid)" />
                    </svg>
                    {item.media_url ? (
                        item.type === "video"
                            ? <video src={item.media_url} controls style={{ maxWidth: "100%", maxHeight: "100%", position: "relative" }} />
                            : <img src={item.media_url} alt={item.title} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", position: "relative" }} />
                    ) : (
                        <div style={{ textAlign: "center", position: "relative" }}>
                            <div style={{ fontSize: "48px", marginBottom: "12px", opacity: 0.6 }}>
                                {item.type === "video" ? "▶" : item.type === "press" ? "✦" : "⬛"}
                            </div>
                            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>
                                {item.press_url
                                    ? <a href={item.press_url} target="_blank" rel="noopener noreferrer" style={{ color: item.accent_color }}>Read full article →</a>
                                    : `No media attached`}
                            </p>
                        </div>
                    )}
                </div>

                <div style={{ padding: "24px 28px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
                        <div>
                            <div style={{ fontSize: "10px", letterSpacing: "0.12em", color: item.accent_color, marginBottom: "8px", textTransform: "uppercase" }}>
                                {item.category} · {item.date}
                            </div>
                            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px, 2.5vw, 26px)", margin: "0 0 8px", lineHeight: 1.2 }}>
                                {item.title}
                            </h2>
                            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: 0 }}>{item.subtitle}</p>
                            {item.description && (
                                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginTop: "12px", lineHeight: 1.6 }}>{item.description}</p>
                            )}
                        </div>
                        <button onClick={onClose} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>×</button>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "16px" }}>
                        <button onClick={onPrev} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "8px 20px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", letterSpacing: "0.06em", fontFamily: "inherit" }}>← Prev</button>
                        <button onClick={onNext} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "8px 20px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", letterSpacing: "0.06em", fontFamily: "inherit" }}>Next →</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Error banner ─────────────────────────────────────────────────────────────

function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
        <div style={{ padding: "20px 24px", background: "rgba(220,50,50,0.08)", border: "1px solid rgba(220,50,50,0.2)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "32px" }}>
            <p style={{ color: "rgba(255,120,120,0.9)", fontSize: "14px", margin: 0 }}>⚠ {message}</p>
            <button onClick={onRetry} style={{ background: "none", border: "1px solid rgba(220,50,50,0.3)", color: "rgba(255,120,120,0.8)", padding: "6px 16px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontFamily: "inherit" }}>Retry</button>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MediaGalleryPage() {
    const [activeFilter, setActiveFilter] = useState("all");
    const [items,        setItems]        = useState<MediaItem[]>([]);
    const [stats,        setStats]        = useState<MediaStats | null>(null);
    const [loading,      setLoading]      = useState(true);
    const [error,        setError]        = useState<string | null>(null);
    const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);

    // ── Fetch from API ──────────────────────────────────────────────
    const fetchItems = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getMediaItems(
                activeFilter !== "all"
                    ? { type: activeFilter as MediaType }
                    : {}
            );
            setItems(res.data as MediaItem[]);
            setStats(res.stats);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to load media items.");
        } finally {
            setLoading(false);
        }
    }, [activeFilter]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    // ── Lightbox navigation ─────────────────────────────────────────
    const lightboxIndex = lightboxItem ? items.findIndex((i) => i.id === lightboxItem.id) : -1;
    const openNext = () => { if (lightboxIndex < items.length - 1) setLightboxItem(items[lightboxIndex + 1]); };
    const openPrev = () => { if (lightboxIndex > 0) setLightboxItem(items[lightboxIndex - 1]); };

    // ── Delete handler ──────────────────────────────────────────────
    const handleDelete = (id: number) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
        if (lightboxItem?.id === id) setLightboxItem(null);
    };

    // ── Filter counts from stats ────────────────────────────────────
    const counts: Record<string, number> = {
        all:   stats?.total ?? 0,
        photo: stats?.photo ?? 0,
        video: stats?.video ?? 0,
        press: stats?.press ?? 0,
        event: stats?.event ?? 0,
    };

    return (
        <>
            <style>{`
                @keyframes skeleton-pulse {
                    0%, 100% { opacity: 0.6; }
                    50%       { opacity: 1;   }
                }
            `}</style>

            <Navbar />

            {/* ── Hero ── */}
            <section style={{ paddingTop: "140px", paddingBottom: "72px", background: "var(--bg, #0a0a0a)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="container">
                    <AnimatedSection>
                        <div className="section-label">Media & Gallery</div>
                        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px, 6vw, 80px)", marginTop: "8px", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
                            Press, Events<br />
                            <span style={{ color: "var(--gold, #C9A84C)" }}>& Gallery</span>
                        </h1>
                        <p style={{ color: "var(--text-muted, rgba(255,255,255,0.5))", fontSize: "16px", maxWidth: "480px", marginTop: "20px", lineHeight: 1.75 }}>
                            Photographs, interviews, press coverage, and event highlights. Click any card to expand.
                        </p>

                        {/* Stats row — live from API */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "32px", marginTop: "40px" }}>
                            {[
                                { label: "Total Items",      value: stats?.total ?? "—" },
                                { label: "Press Features",   value: stats?.press ?? "—" },
                                { label: "Event Photos",     value: stats?.event ?? "—" },
                                { label: "Video Interviews", value: stats?.video ?? "—" },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <div style={{ fontFamily: "var(--font-display)", fontSize: "36px", letterSpacing: "-0.03em", color: "var(--gold, #C9A84C)", lineHeight: 1 }}>
                                        {stat.value}
                                    </div>
                                    <div style={{ fontSize: "11px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", marginTop: "4px", textTransform: "uppercase" }}>
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link href="/" className="btn-outline" style={{ display: "inline-flex", marginTop: "36px" }}>
                            ← Back to Home
                        </Link>
                    </AnimatedSection>
                </div>
            </section>

            {/* ── Gallery Body ── */}
            <section className="section" style={{ background: "#0c0c0c", paddingTop: "64px", paddingBottom: "120px" }}>
                <div className="container">

                    {/* Filter bar */}
                    <AnimatedSection>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "48px" }}>
                            {FILTERS.map((f) => (
                                <button
                                    key={f.value}
                                    onClick={() => setActiveFilter(f.value)}
                                    style={{
                                        padding: "8px 18px",
                                        borderRadius: "100px",
                                        border: "1px solid",
                                        borderColor: activeFilter === f.value ? "var(--gold, #C9A84C)" : "rgba(255,255,255,0.1)",
                                        background:  activeFilter === f.value ? "rgba(201,168,76,0.1)" : "transparent",
                                        color:       activeFilter === f.value ? "var(--gold, #C9A84C)" : "rgba(255,255,255,0.4)",
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
                                    <span style={{ fontSize: "10px", opacity: 0.6, background: "rgba(255,255,255,0.08)", padding: "2px 6px", borderRadius: "100px" }}>
                                        {counts[f.value] ?? 0}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </AnimatedSection>

                    {/* Error state */}
                    {error && <ErrorBanner message={error} onRetry={fetchItems} />}

                    {/* Masonry grid */}
                    {loading ? (
                        <div style={{ columns: "3 280px", columnGap: "20px" }}>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} style={{ breakInside: "avoid", marginBottom: "20px" }}>
                                    <SkeletonCard />
                                </div>
                            ))}
                        </div>
                    ) : items.length === 0 && !error ? (
                        <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.25)", fontSize: "15px" }}>
                            No items found for this filter.
                        </div>
                    ) : (
                        <div style={{ columns: "3 280px", columnGap: "20px" }}>
                            {items.map((item, i) => (
                                <div key={item.id} style={{ breakInside: "avoid", marginBottom: "20px" }}>
                                    <MediaCard
                                        item={item}
                                        delay={i * 0.06}
                                        onClick={() => setLightboxItem(item)}
                                        onDelete={handleDelete}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Press logos */}
                    <AnimatedSection delay={0.3}>
                        <div style={{ marginTop: "96px" }}>
                            <div style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", textAlign: "center", marginBottom: "32px" }}>
                                As Featured In
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "40px" }}>
                                {PRESS_LOGOS.map((pub) => (
                                    <span
                                        key={pub}
                                        style={{ fontFamily: "var(--font-display)", fontSize: "13px", letterSpacing: "0.06em", color: "rgba(255,255,255,0.18)", whiteSpace: "nowrap", transition: "color 0.2s ease", cursor: "default" }}
                                        onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(201,168,76,0.7)")}
                                        onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.18)")}
                                    >
                                        {pub}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Press inquiry CTA */}
                    <AnimatedSection delay={0.4}>
                        <div style={{ marginTop: "80px", padding: "52px 48px", background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: "12px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "32px" }}>
                            <div>
                                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 3vw, 34px)", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
                                    Press & Media Inquiries
                                </h3>
                                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", lineHeight: 1.7, margin: 0, maxWidth: "380px" }}>
                                    High-resolution photos, press kit, interview requests, and event photography are available on request.
                                </p>
                            </div>
                            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                                <Link href="/contact" className="btn-outline" style={{ display: "inline-flex" }}>Request Press Kit</Link>
                                <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", background: "var(--gold, #C9A84C)", color: "#0a0a0a", borderRadius: "4px", fontSize: "13px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none" }}>
                                    Book Interview
                                </Link>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ── Lightbox ── */}
            {lightboxItem && (
                <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} onNext={openNext} onPrev={openPrev} />
            )}

            <Footer />
        </>
    );
}