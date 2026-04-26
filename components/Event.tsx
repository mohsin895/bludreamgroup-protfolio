"use client";

import AnimatedSection from "@/components/AnimatedSection";
import { fetchMappedEvents, type MappedEvent } from "@/lib/api/event";
import { AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
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
  const [events, setEvents] = useState<MappedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMappedEvents()
      .then((all) => {
        // Only upcoming events, max 3 for the homepage teaser
        const upcoming = all.filter((e) => e.status !== "past").slice(0, 3);
        setEvents(upcoming);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load events."),
      )
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
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(38px, 4vw, 52px)",
                }}
              >
                Upcoming Events
              </h2>
            </div>
            <Link href="/events" className="btn-outline">
              All Events
            </Link>
          </AnimatedSection>

          {/* ── Loading ── */}
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[1, 2, 3].map((n) => (
                <SkeletonRow key={n} />
              ))}
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
              <AlertCircle
                size={16}
                style={{ color: "#C47C5A", flexShrink: 0 }}
              />
              {error}
            </div>
          )}

          {/* ── Empty ── */}
          {!loading && !error && events.length === 0 && (
            <div
              style={{
                padding: "40px 0",
                color: "#000",
                fontSize: "14px",
                borderTop: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              No upcoming events scheduled at this time.
            </div>
          )}

          {/* ── Event rows ── */}
          {!loading && !error && events.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "24px",
              }}
              className="events-grid"
            >
              {events.map((ev, i) => (
                <AnimatedSection key={ev.id} delay={i * 0.08}>
                  <Link href="/events" style={{ textDecoration: "none" }}>
                    <div
                      className="card event-card"
                      style={{
                        padding: "28px",
                        background: "#284b63",
                        border: "1px solid rgba(255,255,255,0.08)",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "14px",
                        cursor: "pointer",
                      }}
                    >
                      {/* Date */}
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "22px",
                          color: "#82C3D8",
                        }}
                      >
                        {ev.month} {ev.day}
                      </div>

                      {/* Title */}
                      <h3
                        style={{
                          fontSize: "18px",
                          color: "#fff",
                          fontWeight: 600,
                          lineHeight: 1.3,
                        }}
                      >
                        {ev.title}
                      </h3>

                      {/* Location */}
                      <p
                        style={{
                          fontSize: "13px",
                          color: "rgba(255,255,255,0.6)",
                        }}
                      >
                        {ev.city} · {ev.year}
                      </p>

                      {/* Tag */}
                      <span
                        className="tag"
                        style={{
                          background: "#82C3D822",
                          color: "#82C3D8",
                          border: "1px solid #82C3D855",
                          width: "fit-content",
                          fontSize: "10px",
                        }}
                      >
                        {ev.categoryTitle}
                      </span>

                      {/* CTA */}
                      <div
                        style={{
                          marginTop: "auto",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          color: "#82C3D8",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        View Details <ArrowRight size={14} />
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
      .event-card {
  transition: all 0.25s ease;
}
.event-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.35);
}
  @media (max-width: 900px) {
  .events-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
@media (max-width: 560px) {
  .events-grid {
    grid-template-columns: 1fr !important;
  }
}
        @keyframes shimmer {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1;   }
        }
      `}</style>
    </>
  );
}
