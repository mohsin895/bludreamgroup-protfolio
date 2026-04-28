"use client";

import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  fetchEventCategories,
  fetchMappedEvents,
  type ApiEventCategory,
  type EventStatus,
  type EventType,
  type MappedEvent,
} from "@/lib/api/event";
import {
  AlertCircle,
  Calendar,
  ChevronRight,
  Clock,
  Loader2,
  MapPin,
  Navigation,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// ─── Type / color maps ────────────────────────────────────────────────────────

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

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: EventStatus }) {
  const styles: Record<
    EventStatus,
    { bg: string; color: string; label: string }
  > = {
    upcoming: {
      bg: "rgba(124,154,126,0.12)",
      color: "#7C9A7E",
      label: "Upcoming",
    },
    soldout: {
      bg: "rgba(201,168,76,0.1)",
      color: "#C9A84C",
      label: "Sold Out",
    },
    past: {
      bg: "rgba(255,255,255,0.05)",
      color: "rgba(255,255,255,0.3)",
      label: "Past Event",
    },
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
  const color =
    left === 0 ? "#C9A84C" : left < total * 0.25 ? "#C47C5A" : "#7C9A7E";
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
          background: "#fff",
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

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "8px",
        padding: "28px",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", gap: "20px" }}>
        <div
          style={{
            width: "56px",
            height: "76px",
            borderRadius: "6px",
            background: "rgba(255,255,255,0.06)",
            animation: "shimmer 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div
            style={{
              height: "14px",
              width: "40%",
              borderRadius: "3px",
              background: "rgba(255,255,255,0.06)",
              animation: "shimmer 1.5s ease-in-out infinite",
            }}
          />
          <div
            style={{
              height: "16px",
              width: "85%",
              borderRadius: "3px",
              background: "rgba(255,255,255,0.06)",
              animation: "shimmer 1.5s ease-in-out infinite 0.1s",
            }}
          />
          <div
            style={{
              height: "12px",
              width: "60%",
              borderRadius: "3px",
              background: "rgba(255,255,255,0.06)",
              animation: "shimmer 1.5s ease-in-out infinite 0.2s",
            }}
          />
        </div>
      </div>
      <div
        style={{
          marginTop: "18px",
          height: "40px",
          borderRadius: "3px",
          background: "rgba(255,255,255,0.04)",
          animation: "shimmer 1.5s ease-in-out infinite 0.3s",
        }}
      />
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div style={{ textAlign: "center", padding: "80px 0" }}>
      <AlertCircle
        size={40}
        style={{ color: "#C47C5A", marginBottom: "16px", opacity: 0.7 }}
      />
      <p
        style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: "15px",
          margin: "0 0 24px",
        }}
      >
        {message}
      </p>
      <button
        onClick={onRetry}
        style={{
          padding: "10px 24px",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "4px",
          color: "rgba(255,255,255,0.6)",
          fontSize: "12px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Try Again
      </button>
    </div>
  );
}

// ─── Event Card ───────────────────────────────────────────────────────────────

function EventCard({ event, delay }: { event: MappedEvent; delay: number }) {
  const typeColor = TYPE_COLORS[event.type] ?? "#C9A84C";
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
        {/* Colour bar */}
        <div
          style={{
            height: "3px",
            background: `linear-gradient(90deg, ${typeColor}80, transparent)`,
          }}
        />

        <div style={{ padding: "28px" }}>
          {/* Header */}
          <div
            style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}
          >
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
              <div
                style={{
                  fontSize: "22px",
                  fontFamily: "var(--font-display)",
                  color: typeColor,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {event.day}
              </div>
              <div
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.14em",
                  color: "rgba(255,255,255,0.35)",
                  marginTop: "4px",
                  textTransform: "uppercase",
                }}
              >
                {event.month}
              </div>
              <div
                style={{
                  fontSize: "9px",
                  color: "rgba(255,255,255,0.2)",
                  marginTop: "2px",
                }}
              >
                {event.year}
              </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexWrap: "wrap",
                  marginBottom: "8px",
                }}
              >
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
                  {TYPE_LABELS[event.type] ?? event.categoryTitle}
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

              <div
                style={{ display: "flex", flexDirection: "column", gap: "5px" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  <MapPin
                    size={11}
                    style={{ color: typeColor, flexShrink: 0 }}
                  />
                  <span>{event.venue}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  <Clock
                    size={11}
                    style={{ color: typeColor, flexShrink: 0 }}
                  />
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

          {/* Footer */}
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
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = typeColor)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  "rgba(255,255,255,0.25)")
              }
            >
              <Navigation size={11} />
              Get Directions
            </a>

            {isPast ? (
              <span
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.2)",
                  letterSpacing: "0.05em",
                }}
              >
                Event Concluded
              </span>
            ) : event.status === "soldout" ? (
              <button
                disabled
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  background: "transparent",
                  color: typeColor,
                  border: `1px solid ${typeColor}`,
                  borderRadius: "4px",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: "not-allowed",
                  opacity: 0.6,
                  fontFamily: "inherit",
                }}
              >
                Join Waitlist
              </button>
            ) : (
              <span
                style={{
                  fontSize: "11px",
                  color: typeColor,
                  letterSpacing: "0.05em",
                }}
              >
                Free Entry
              </span>
            )}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type FilterTab = "all" | "upcoming" | "past";

export default function EventsPage() {
  const [events, setEvents] = useState<MappedEvent[]>([]);
  const [categories, setCategories] = useState<ApiEventCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("upcoming");
  const [activeType, setActiveType] = useState<string>("all");

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const [mappedEvents, cats] = await Promise.all([
        fetchMappedEvents(),
        fetchEventCategories(),
      ]);
      setEvents(mappedEvents);
      setCategories(cats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Derived counts
  const upcomingCount = events.filter((e) => e.status !== "past").length;
  const pastCount = events.filter((e) => e.status === "past").length;

  // Active categories (only what's in the current event list)
  const activeCategories = categories.filter((cat) =>
    events.some(
      (e) => e.categoryTitle.toLowerCase() === cat.title.toLowerCase(),
    ),
  );

  const filtered = events.filter((e) => {
    const tabMatch =
      activeTab === "all" ||
      (activeTab === "upcoming" && e.status !== "past") ||
      (activeTab === "past" && e.status === "past");
    const typeMatch = activeType === "all" || e.type === activeType;
    return tabMatch && typeMatch;
  });

  const featured = events.find((e) => e.isFeatured);

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section
        style={{
          paddingTop: "140px",
          paddingBottom: "72px",
          background: "#fff",
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
              <span style={{ color: "var(--gold, #C9A84C)" }}>
                &amp; Workshops
              </span>
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
              Catch a live reading, join a craft workshop, or grab a signed
              copy. All upcoming events are listed below.
            </p>

            {/* Quick stats */}
            <div
              style={{
                display: "flex",
                gap: "40px",
                marginTop: "40px",
                flexWrap: "wrap",
              }}
            >
              {[
                {
                  label: "Upcoming Events",
                  value: loading ? "—" : upcomingCount,
                },
                { label: "Past Events", value: loading ? "—" : pastCount },
                {
                  label: "Event Types",
                  value: loading ? "—" : activeCategories.length,
                },
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
                      color: "#000",
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
        style={{
          background: "#203647",
          paddingTop: "64px",
          paddingBottom: "120px",
        }}
      >
        <div className="container">
          {/* ── Featured Banner (only when data loaded) ── */}
          {!loading && !error && featured && (
            <AnimatedSection>
              <div
                style={{
                  marginBottom: "64px",
                  padding: "40px 44px",
                  background: "#82c3d8",
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
                {/* Decorative glow */}
                <div
                  style={{
                    position: "absolute",
                    top: "-60px",
                    right: "-60px",
                    width: "240px",
                    height: "240px",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)",
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

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "16px",
                      marginTop: "12px",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.45)",
                      }}
                    >
                      <Calendar
                        size={12}
                        style={{ color: "var(--gold, #C9A84C)" }}
                      />
                      {featured.date}
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.45)",
                      }}
                    >
                      <MapPin
                        size={12}
                        style={{ color: "var(--gold, #C9A84C)" }}
                      />
                      {featured.venue}
                    </span>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.45)",
                      }}
                    >
                      <Clock
                        size={12}
                        style={{ color: "var(--gold, #C9A84C)" }}
                      />
                      {featured.time}
                    </span>
                  </div>
                </div>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(featured.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
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
                  View on Map
                  <ChevronRight size={14} />
                </a>
              </div>
            </AnimatedSection>
          )}

          {/* ── Tabs + Type filters ── */}
          {!loading && !error && (
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
                {/* Status tabs */}
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

                {/* Category / type pills — built from API categories */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {/* "All" pill */}
                  <button
                    onClick={() => setActiveType("all")}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "100px",
                      border: "1px solid",
                      borderColor:
                        activeType === "all"
                          ? "var(--gold, #C9A84C)"
                          : "rgba(255,255,255,0.08)",
                      background:
                        activeType === "all"
                          ? "rgba(201,168,76,0.1)"
                          : "transparent",
                      color:
                        activeType === "all"
                          ? "var(--gold, #C9A84C)"
                          : "rgba(255,255,255,0.3)",
                      fontSize: "11px",
                      letterSpacing: "0.08em",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      fontFamily: "inherit",
                    }}
                  >
                    All Types
                  </button>

                  {/* One pill per API category */}
                  {activeCategories.map((cat) => {
                    const typeKey = cat.title.toLowerCase() as EventType;
                    const color =
                      TYPE_COLORS[typeKey] ?? "var(--gold, #C9A84C)";
                    const isActive = activeType === typeKey;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveType(typeKey)}
                        style={{
                          padding: "5px 12px",
                          borderRadius: "100px",
                          border: "1px solid",
                          borderColor: isActive
                            ? color
                            : "rgba(255,255,255,0.08)",
                          background: isActive ? `${color}18` : "transparent",
                          color: isActive ? color : "rgba(255,255,255,0.3)",
                          fontSize: "11px",
                          letterSpacing: "0.08em",
                          textTransform: "capitalize",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          fontFamily: "inherit",
                        }}
                      >
                        {TYPE_LABELS[typeKey] ?? cat.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* ── Loading skeletons ── */}
          {loading && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(min(100%, 480px), 1fr))",
                gap: "20px",
              }}
            >
              {[1, 2, 3, 4].map((n) => (
                <SkeletonCard key={n} />
              ))}
            </div>
          )}

          {/* ── Loading spinner (inline) ── */}
          {loading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "40px",
                color: "rgba(255,255,255,0.2)",
              }}
            >
              <Loader2
                size={20}
                style={{ animation: "spin 1s linear infinite" }}
              />
            </div>
          )}

          {/* ── Error ── */}
          {!loading && error && (
            <ErrorState message={error} onRetry={loadData} />
          )}

          {/* ── Empty state ── */}
          {!loading && !error && filtered.length === 0 && (
            <AnimatedSection>
              <div
                style={{
                  textAlign: "center",
                  padding: "80px 0",
                  color: "rgba(255,255,255,0.2)",
                }}
              >
                <Calendar
                  size={36}
                  style={{ marginBottom: "16px", opacity: 0.4 }}
                />
                <p style={{ fontSize: "15px", margin: 0 }}>
                  No events match this filter.
                </p>
              </div>
            </AnimatedSection>
          )}

          {/* ── Event grid ── */}
          {!loading && !error && filtered.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(min(100%, 480px), 1fr))",
                gap: "20px",
              }}
            >
              {filtered.map((event, i) => (
                <EventCard key={event.id} event={event} delay={i * 0.07} />
              ))}
            </div>
          )}

          {/* ── Newsletter CTA ── */}
          {!loading && !error && (
            <AnimatedSection delay={0.3}>
              <div
                style={{
                  marginTop: "96px",
                  padding: "52px 48px",
                  background: "#f4f7f6ff",
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
                      color: "#000",
                      fontSize: "14px",
                      lineHeight: 1.7,
                      margin: 0,
                      maxWidth: "360px",
                    }}
                  >
                    New events are announced first via the newsletter.
                    Subscribers also get early access to limited workshop spots
                    and signed editions.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <Link
                    href="/contact"
                    className="btn-outline"
                    style={{ display: "inline-flex" }}
                  >
                    Request a Booking
                  </Link>
                  <Link
                    href="/newsletter"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "12px 24px",
                      background: "#6FB3C8",
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
          )}
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      <Footer />
    </>
  );
}
