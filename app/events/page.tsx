"use client";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";
import { Navigation, MapPin, Calendar, Clock, Users, ExternalLink, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────

type EventStatus = "upcoming" | "past" | "soldout";
type EventType = "reading" | "workshop" | "signing" | "festival" | "talk";

interface Event {
    id: number;
    status: EventStatus;
    type: EventType;
    title: string;
    venue: string;
    city: string;
    address: string;
    date: string;
    day: string;
    month: string;
    year: string;
    time: string;
    capacity?: number;
    spotsLeft?: number;
    description: string;
    ticketUrl?: string;
    isFeatured?: boolean;
}

const EVENTS: Event[] = [
    {
        id: 1,
        status: "upcoming",
        type: "reading",
        title: "An Evening with the Author — 'The Quiet Cartographer'",
        venue: "The Strand Bookstore",
        city: "New York, NY",
        address: "828 Broadway, New York, NY 10003",
        date: "June 14, 2025",
        day: "14",
        month: "JUN",
        year: "2025",
        time: "7:00 PM – 9:00 PM",
        capacity: 120,
        spotsLeft: 34,
        description:
            "A ticketed reading and Q&A at one of New York's most beloved independent bookshops. Includes a post-event signing and complimentary wine.",
        ticketUrl: "#",
        isFeatured: true,
    },
    {
        id: 2,
        status: "upcoming",
        type: "festival",
        title: "Brooklyn Book Festival — Panel: 'Maps & Memory'",
        venue: "Brooklyn Commons",
        city: "Brooklyn, NY",
        address: "1 MetroTech Center, Brooklyn, NY 11201",
        date: "July 3, 2025",
        day: "03",
        month: "JUL",
        year: "2025",
        time: "2:00 PM – 3:30 PM",
        description:
            "Joining three other novelists for a conversation on place, landscape, and the geography of grief. Moderated by Lauren Groff.",
        ticketUrl: "#",
    },
    {
        id: 3,
        status: "soldout",
        type: "workshop",
        title: "Craft Workshop: Writing the Unknowable",
        venue: "The Loft Literary Center",
        city: "Minneapolis, MN",
        address: "1011 Washington Ave S, Minneapolis, MN 55415",
        date: "July 19, 2025",
        day: "19",
        month: "JUL",
        year: "2025",
        time: "10:00 AM – 4:00 PM",
        capacity: 18,
        spotsLeft: 0,
        description:
            "A full-day intensive workshop for emerging writers on navigating ambiguity, silence, and negative space in literary fiction.",
    },
    {
        id: 4,
        status: "upcoming",
        type: "signing",
        title: "Signing Session & Pop-Up Shop",
        venue: "Housing Works Bookshop",
        city: "New York, NY",
        address: "126 Crosby St, New York, NY 10012",
        date: "August 9, 2025",
        day: "09",
        month: "AUG",
        year: "2025",
        time: "12:00 PM – 3:00 PM",
        description:
            "Drop-in signing session with no ticket required. All proceeds from book sales benefit Housing Works' HIV/AIDS services.",
        ticketUrl: "#",
    },
    {
        id: 5,
        status: "upcoming",
        type: "talk",
        title: "Keynote: On the Ethics of Imagined Places",
        venue: "PEN America Annual Gala",
        city: "Los Angeles, CA",
        address: "The Beverly Hilton, 9876 Wilshire Blvd, Beverly Hills, CA 90210",
        date: "September 22, 2025",
        day: "22",
        month: "SEP",
        year: "2025",
        time: "6:30 PM – 10:00 PM",
        description:
            "Delivering the keynote address at PEN America's annual gala. The talk explores what fiction owes to the real places it transforms.",
        ticketUrl: "#",
    },
    {
        id: 6,
        status: "past",
        type: "reading",
        title: "Spring Reading Series",
        venue: "Powell's Books",
        city: "Portland, OR",
        address: "1005 W Burnside St, Portland, OR 97209",
        date: "March 5, 2025",
        day: "05",
        month: "MAR",
        year: "2025",
        time: "7:30 PM – 9:00 PM",
        description:
            "A reading from the first three chapters, followed by a wide-ranging conversation about the writing process and the role of maps in fiction.",
    },
    {
        id: 7,
        status: "past",
        type: "festival",
        title: "AWP 2025 — Featured Author",
        venue: "Los Angeles Convention Center",
        city: "Los Angeles, CA",
        address: "1201 S Figueroa St, Los Angeles, CA 90015",
        date: "February 28, 2025",
        day: "28",
        month: "FEB",
        year: "2025",
        time: "11:00 AM – 12:15 PM",
        description:
            "Featured on the 'Debut Novelists' panel alongside four other authors whose first books were published in 2024.",
    },
];

const TYPE_LABELS: Record<EventType, string> = {
    reading: "Reading",
    workshop: "Workshop",
    signing: "Signing",
    festival: "Festival",
    talk: "Talk / Keynote",
};

const TYPE_COLORS: Record<EventType, string> = {
    reading: "#C9A84C",
    workshop: "#7C9A7E",
    signing: "#9B8BC4",
    festival: "#C47C5A",
    talk: "#5A8EC4",
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: EventStatus }) {
    const styles: Record<EventStatus, { bg: string; color: string; label: string }> = {
        upcoming: { bg: "rgba(124,154,126,0.12)", color: "#7C9A7E", label: "Upcoming" },
        soldout: { bg: "rgba(201,168,76,0.1)", color: "#C9A84C", label: "Sold Out" },
        past: { bg: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)", label: "Past Event" },
    };
    const s = styles[status];
    return (
        <span
            style={{
                fontSize: "10px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                background: s.bg,
                color: s.color,
                padding: "4px 10px",
                borderRadius: "3px",
                fontWeight: 500,
            }}
        >
      {s.label}
    </span>
    );
}

function CapacityBar({ total, left }: { total: number; left: number }) {
    const pct = Math.round(((total - left) / total) * 100);
    const color = left === 0 ? "#C9A84C" : left < total * 0.25 ? "#C47C5A" : "#7C9A7E";
    return (
        <div style={{ marginTop: "14px" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.3)",
                    marginBottom: "6px",
                    letterSpacing: "0.05em",
                }}
            >
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Users size={11} />
            {left === 0 ? "Fully booked" : `${left} spots remaining`}
        </span>
                <span>{pct}% filled</span>
            </div>
            <div
                style={{
                    height: "3px",
                    background: "rgba(255,255,255,0.07)",
                    borderRadius: "2px",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: color,
                        borderRadius: "2px",
                        transition: "width 0.6s ease",
                    }}
                />
            </div>
        </div>
    );
}

function EventCard({ event, delay }: { event: Event; delay: number }) {
    const typeColor = TYPE_COLORS[event.type];
    const isPast = event.status === "past";

    return (
        <AnimatedSection delay={delay}>
            <div
                className="card"
                style={{
                    padding: "0",
                    overflow: "hidden",
                    opacity: isPast ? 0.65 : 1,
                    transition: "opacity 0.2s ease",
                    position: "relative",
                }}
            >
                {/* Top color bar */}
                <div style={{ height: "3px", background: `linear-gradient(90deg, ${typeColor}80, transparent)` }} />

                <div style={{ padding: "28px" }}>
                    {/* Header row */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                        {/* Date block */}
                        <div
                            style={{
                                flexShrink: 0,
                                width: "56px",
                                textAlign: "center",
                                background: `${typeColor}10`,
                                border: `1px solid ${typeColor}25`,
                                borderRadius: "6px",
                                padding: "10px 0",
                            }}
                        >
                            <div style={{ fontSize: "22px", fontFamily: "var(--font-display)", color: typeColor, lineHeight: 1, letterSpacing: "-0.02em" }}>
                                {event.day}
                            </div>
                            <div style={{ fontSize: "9px", letterSpacing: "0.14em", color: "rgba(255,255,255,0.35)", marginTop: "4px", textTransform: "uppercase" }}>
                                {event.month}
                            </div>
                            <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", marginTop: "2px" }}>
                                {event.year}
                            </div>
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
                <span
                    style={{
                        fontSize: "10px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: typeColor,
                        background: `${typeColor}10`,
                        border: `1px solid ${typeColor}25`,
                        padding: "3px 8px",
                        borderRadius: "3px",
                    }}
                >
                  {TYPE_LABELS[event.type]}
                </span>
                                <StatusBadge status={event.status} />
                            </div>

                            <h3
                                style={{
                                    fontSize: "15px",
                                    fontWeight: 500,
                                    lineHeight: 1.4,
                                    margin: "0 0 10px",
                                    color: isPast ? "rgba(255,255,255,0.55)" : "#fff",
                                }}
                            >
                                {event.title}
                            </h3>

                            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                                    <MapPin size={11} style={{ color: typeColor, flexShrink: 0 }} />
                                    <span>{event.venue} — {event.city}</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                                    <Clock size={11} style={{ color: typeColor, flexShrink: 0 }} />
                                    <span>{event.time}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <p
                        style={{
                            fontSize: "13px",
                            lineHeight: 1.75,
                            color: "rgba(255,255,255,0.4)",
                            margin: "18px 0 0",
                        }}
                    >
                        {event.description}
                    </p>

                    {/* Capacity bar */}
                    {event.capacity !== undefined && event.spotsLeft !== undefined && !isPast && (
                        <CapacityBar total={event.capacity} left={event.spotsLeft} />
                    )}

                    {/* Footer row */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: "20px",
                            paddingTop: "18px",
                            borderTop: "1px solid rgba(255,255,255,0.06)",
                            flexWrap: "wrap",
                            gap: "12px",
                        }}
                    >
                        <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(event.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "5px",
                                fontSize: "11px",
                                color: "rgba(255,255,255,0.25)",
                                textDecoration: "none",
                                letterSpacing: "0.05em",
                                transition: "color 0.2s ease",
                            }}
                            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = typeColor)}
                            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.25)")}
                        >
                            <Navigation size={11} />
                            Get Directions
                        </a>

                        {!isPast && event.ticketUrl ? (
                            <a
                                href={event.ticketUrl}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    padding: "8px 16px",
                                    background: event.status === "soldout" ? "transparent" : `${typeColor}`,
                                    color: event.status === "soldout" ? typeColor : "#0a0a0a",
                                    border: `1px solid ${typeColor}`,
                                    borderRadius: "4px",
                                    fontSize: "11px",
                                    fontWeight: 600,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    textDecoration: "none",
                                    cursor: event.status === "soldout" ? "not-allowed" : "pointer",
                                    opacity: event.status === "soldout" ? 0.6 : 1,
                                    transition: "opacity 0.2s ease",
                                }}
                            >
                                {event.status === "soldout" ? "Join Waitlist" : "Get Tickets"}
                                <ExternalLink size={11} />
                            </a>
                        ) : isPast ? (
                            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em" }}>
                Event Concluded
              </span>
                        ) : (
                            <span style={{ fontSize: "11px", color: typeColor, letterSpacing: "0.05em" }}>
                Free Entry
              </span>
                        )}
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
}

// ─── Page ────────────────────────────────────────────────────────────────────

type FilterTab = "all" | "upcoming" | "past";

export default function EventsPage() {
    const [activeTab, setActiveTab] = useState<FilterTab>("upcoming");
    const [activeType, setActiveType] = useState<string>("all");

    const upcomingCount = EVENTS.filter((e) => e.status !== "past").length;
    const pastCount = EVENTS.filter((e) => e.status === "past").length;

    const filtered = EVENTS.filter((e) => {
        const tabMatch =
            activeTab === "all" ||
            (activeTab === "upcoming" && e.status !== "past") ||
            (activeTab === "past" && e.status === "past");
        const typeMatch = activeType === "all" || e.type === activeType;
        return tabMatch && typeMatch;
    });

    const featured = EVENTS.find((e) => e.isFeatured);

    return (
        <>
            <Navbar />

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
                        <div className="section-label">Events</div>
                        <h1
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "clamp(48px, 6vw, 80px)",
                                marginTop: "8px",
                                letterSpacing: "-0.02em",
                                lineHeight: 1.05,
                            }}
                        >
                            Readings, Signings
                            <br />
                            <span style={{ color: "var(--gold, #C9A84C)" }}>& Workshops</span>
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
                            Catch a live reading, join a craft workshop, or grab a signed copy.
                            All upcoming events are listed below.
                        </p>

                        {/* Quick stats */}
                        <div style={{ display: "flex", gap: "40px", marginTop: "40px", flexWrap: "wrap" }}>
                            {[
                                { label: "Upcoming Events", value: upcomingCount },
                                { label: "Cities This Year", value: 6 },
                                { label: "Past Events", value: pastCount },
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

                        <Link href="/" className="btn-outline" style={{ display: "inline-flex", marginTop: "36px" }}>
                            ← Back to Home
                        </Link>
                    </AnimatedSection>
                </div>
            </section>

            {/* ── Body ── */}
            <section className="section" style={{ background: "#0c0c0c", paddingTop: "64px", paddingBottom: "120px" }}>
                <div className="container">

                    {/* Featured Event Banner */}
                    {featured && (
                        <AnimatedSection>
                            <div
                                style={{
                                    marginBottom: "64px",
                                    padding: "40px 44px",
                                    background: "rgba(201,168,76,0.05)",
                                    border: "1px solid rgba(201,168,76,0.18)",
                                    borderRadius: "12px",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "32px",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    position: "relative",
                                    overflow: "hidden",
                                }}
                            >
                                {/* Decorative */}
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "-60px",
                                        right: "-60px",
                                        width: "240px",
                                        height: "240px",
                                        borderRadius: "50%",
                                        background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)",
                                        pointerEvents: "none",
                                    }}
                                />

                                <div style={{ position: "relative" }}>
                                    <div
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "7px",
                                            fontSize: "10px",
                                            letterSpacing: "0.14em",
                                            textTransform: "uppercase",
                                            color: "var(--gold, #C9A84C)",
                                            marginBottom: "14px",
                                        }}
                                    >
                    <span
                        style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "var(--gold, #C9A84C)",
                            display: "inline-block",
                            animation: "pulse 2s infinite",
                        }}
                    />
                                        Featured Upcoming Event
                                    </div>
                                    <h2
                                        style={{
                                            fontFamily: "var(--font-display)",
                                            fontSize: "clamp(20px, 2.5vw, 28px)",
                                            margin: "0 0 10px",
                                            letterSpacing: "-0.02em",
                                            maxWidth: "480px",
                                        }}
                                    >
                                        {featured.title}
                                    </h2>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "12px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>
                      <Calendar size={12} style={{ color: "var(--gold, #C9A84C)" }} />
                        {featured.date}
                    </span>
                                        <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>
                      <MapPin size={12} style={{ color: "var(--gold, #C9A84C)" }} />
                                            {featured.venue}, {featured.city}
                    </span>
                                        <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>
                      <Users size={12} style={{ color: "var(--gold, #C9A84C)" }} />
                                            {featured.spotsLeft} spots left
                    </span>
                                    </div>
                                </div>
                                <a
                                    href={featured.ticketUrl}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        padding: "14px 28px",
                                        background: "var(--gold, #C9A84C)",
                                        color: "#0a0a0a",
                                        borderRadius: "4px",
                                        fontSize: "12px",
                                        fontWeight: 700,
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        textDecoration: "none",
                                        flexShrink: 0,
                                    }}
                                >
                                    Reserve Your Seat
                                    <ChevronRight size={14} />
                                </a>
                            </div>
                        </AnimatedSection>
                    )}

                    {/* Tabs + Type filter */}
                    <AnimatedSection delay={0.05}>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "16px",
                                marginBottom: "36px",
                            }}
                        >
                            {/* Tabs */}
                            <div
                                style={{
                                    display: "flex",
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: "6px",
                                    padding: "4px",
                                    gap: "2px",
                                }}
                            >
                                {(
                                    [
                                        { key: "upcoming", label: `Upcoming (${upcomingCount})` },
                                        { key: "past", label: `Past (${pastCount})` },
                                        { key: "all", label: "All" },
                                    ] as { key: FilterTab; label: string }[]
                                ).map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        style={{
                                            padding: "7px 16px",
                                            borderRadius: "4px",
                                            border: "none",
                                            background:
                                                activeTab === tab.key
                                                    ? "rgba(201,168,76,0.12)"
                                                    : "transparent",
                                            color:
                                                activeTab === tab.key
                                                    ? "var(--gold, #C9A84C)"
                                                    : "rgba(255,255,255,0.35)",
                                            fontSize: "12px",
                                            letterSpacing: "0.05em",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",
                                            fontFamily: "inherit",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Type pills */}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                {["all", "reading", "workshop", "signing", "festival", "talk"].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setActiveType(t)}
                                        style={{
                                            padding: "5px 12px",
                                            borderRadius: "100px",
                                            border: "1px solid",
                                            borderColor:
                                                activeType === t
                                                    ? TYPE_COLORS[t as EventType] ?? "var(--gold, #C9A84C)"
                                                    : "rgba(255,255,255,0.08)",
                                            background:
                                                activeType === t
                                                    ? `${TYPE_COLORS[t as EventType] ?? "rgba(201,168,76"}10)`
                                                    : "transparent",
                                            color:
                                                activeType === t
                                                    ? TYPE_COLORS[t as EventType] ?? "var(--gold, #C9A84C)"
                                                    : "rgba(255,255,255,0.3)",
                                            fontSize: "11px",
                                            letterSpacing: "0.08em",
                                            textTransform: "capitalize",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",
                                            fontFamily: "inherit",
                                        }}
                                    >
                                        {t === "all" ? "All Types" : TYPE_LABELS[t as EventType]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Events grid */}
                    {filtered.length === 0 ? (
                        <AnimatedSection>
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "80px 0",
                                    color: "rgba(255,255,255,0.2)",
                                }}
                            >
                                <Calendar size={36} style={{ marginBottom: "16px", opacity: 0.4 }} />
                                <p style={{ fontSize: "15px", margin: 0 }}>No events match this filter.</p>
                            </div>
                        </AnimatedSection>
                    ) : (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 480px), 1fr))",
                                gap: "20px",
                            }}
                        >
                            {filtered.map((event, i) => (
                                <EventCard key={event.id} event={event} delay={i * 0.07} />
                            ))}
                        </div>
                    )}

                    {/* Newsletter CTA */}
                    <AnimatedSection delay={0.3}>
                        <div
                            style={{
                                marginTop: "96px",
                                padding: "52px 48px",
                                background: "rgba(201,168,76,0.04)",
                                border: "1px solid rgba(201,168,76,0.12)",
                                borderRadius: "12px",
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "32px",
                            }}
                        >
                            <div>
                                <h3
                                    style={{
                                        fontFamily: "var(--font-display)",
                                        fontSize: "clamp(22px, 3vw, 34px)",
                                        margin: "0 0 10px",
                                        letterSpacing: "-0.02em",
                                    }}
                                >
                                    Never miss an event
                                </h3>
                                <p
                                    style={{
                                        color: "rgba(255,255,255,0.4)",
                                        fontSize: "14px",
                                        lineHeight: 1.7,
                                        margin: 0,
                                        maxWidth: "360px",
                                    }}
                                >
                                    New events are announced first via the newsletter. Subscribers
                                    also get early access to limited workshop spots and signed editions.
                                </p>
                            </div>
                            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                                <Link href="/contact" className="btn-outline" style={{ display: "inline-flex" }}>
                                    Request a Booking
                                </Link>
                                <Link
                                    href="/newsletter"
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        padding: "12px 24px",
                                        background: "var(--gold, #C9A84C)",
                                        color: "#0a0a0a",
                                        borderRadius: "4px",
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        letterSpacing: "0.06em",
                                        textTransform: "uppercase",
                                        textDecoration: "none",
                                    }}
                                >
                                    Join Newsletter
                                </Link>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
      `}</style>

            <Footer />
        </>
    );
}