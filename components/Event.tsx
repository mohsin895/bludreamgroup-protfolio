"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const IMG_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "";

interface Event {
  id: number;
  title: string;
  slug?: string;
  description?: string;
  short_description?: string;
  date?: string;
  event_date?: string;
  time?: string;
  event_time?: string;
  location?: string;
  venue?: string;
  image?: string | null;
  type?: string;
  status?: string;
}

function parseImage(raw: string | null | undefined): string | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw);
    return o.medium ?? o.original ?? null;
  } catch {
    return raw;
  }
}

const fallbackEvents: Event[] = [
  {
    id: 1,
    title: "Business Mindset Masterclass",
    date: "2024-12-20",
    time: "10:00 AM",
    location: "Dhaka, Bangladesh",
    type: "Seminar",
    description:
      "A full-day intensive workshop on developing an entrepreneurial mindset for the modern era.",
  },
  {
    id: 2,
    title: "Book Launch: New Release 2024",
    date: "2024-12-28",
    time: "4:00 PM",
    location: "Chittagong, Bangladesh",
    type: "Book Launch",
    description:
      "Join the official launch event for the newest book with signing session and interactive Q&A.",
  },
  {
    id: 3,
    title: "Personal Branding Workshop",
    date: "2025-01-10",
    time: "9:00 AM",
    location: "Online (Zoom)",
    type: "Workshop",
    description:
      "Build your personal brand from scratch with step-by-step guidance in this live online session.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };

const typeColors: Record<string, string> = {
  Seminar: "#6c7e7f",
  Workshop: "#95a49a",
  "Book Launch": "#9aa6aa",
  Training: "#6c7e7f",
  default: "#9aa6aa",
};
function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, "");
}

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/event?status=upcoming&limit=3`)
      .then((r) => r.json())
      .then((json) => {
        const data = json?.data ?? json;
        if (Array.isArray(data) && data.length > 0) setEvents(data.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const display = events.length > 0 ? events : fallbackEvents;

  return (
    <section
      style={{
        background: "linear-gradient(180deg, #f8f9fa 0%, #eef2f2 100%)",
        padding: "100px 0",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          style={{ marginBottom: 64 }}
        >
          <motion.div
            variants={fadeUp}
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 24,
            }}
          >
            <div>
              <span
                style={{
                  display: "inline-block",
                  background: "#6c7e7f1a",
                  color: "#6c7e7f",
                  borderRadius: 40,
                  padding: "6px 20px",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                Upcoming Events
              </span>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(34px, 4vw, 54px)",
                  color: "#1f2937",
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                Where You Can{" "}
                <span style={{ color: "#6c7e7f", fontStyle: "italic" }}>
                  Find Me Next
                </span>
              </h2>
            </div>
            <Link
              href="/events"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                fontWeight: 700,
                color: "#6c7e7f",
                textDecoration: "none",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                transition: "gap 0.2s",
              }}
              className="events-viewall"
            >
              View All <ArrowRight size={13} />
            </Link>
          </motion.div>
        </motion.div>

        {/* Events list */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          {display.map((ev, i) => {
            const imgPath = parseImage(ev.image);
            const imgSrc = imgPath ? `${IMG_BASE}${imgPath}` : null;
            const dateStr = ev.date ?? ev.event_date;
            const timeStr = ev.time ?? ev.event_time;
            const loc = ev.location ?? ev.venue;
            const typeColor =
              typeColors[ev.type ?? "default"] ?? typeColors.default;
            const formattedDate = dateStr
              ? new Date(dateStr).toLocaleDateString("en-US", {
                  weekday: "short",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "";

            return (
              <motion.div
                key={ev.id}
                variants={fadeUp}
                className="event-card"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 16,
                  overflow: "hidden",
                  display: "flex",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Date block */}
                <div
                  style={{
                    width: 90,
                    flexShrink: 0,
                    background: `linear-gradient(160deg, ${typeColor}, ${typeColor}cc)`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "24px 12px",
                    color: "#fff",
                  }}
                >
                  {dateStr ? (
                    <>
                      <div
                        style={{ fontSize: 32, fontWeight: 800, lineHeight: 1 }}
                      >
                        {new Date(dateStr).getDate()}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          opacity: 0.85,
                          marginTop: 4,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {new Date(dateStr).toLocaleString("en-US", {
                          month: "short",
                        })}
                      </div>
                      <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>
                        {new Date(dateStr).getFullYear()}
                      </div>
                    </>
                  ) : (
                    <Calendar size={24} color="#fff" style={{ opacity: 0.8 }} />
                  )}
                </div>

                {/* Image (optional) */}
                {imgSrc && (
                  <div
                    style={{ width: 140, flexShrink: 0, overflow: "hidden" }}
                    className="event-img-wrap"
                  >
                    <img
                      src={imgSrc}
                      alt={ev.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s",
                      }}
                      className="event-img"
                    />
                  </div>
                )}

                {/* Content */}
                <div
                  style={{
                    padding: "24px 28px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  {ev.type && (
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: 10,
                        fontWeight: 700,
                        color: typeColor,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        marginBottom: 8,
                      }}
                    >
                      {ev.type}
                    </span>
                  )}
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "clamp(17px, 2vw, 22px)",
                      color: "#1f2937",
                      margin: "0 0 10px",
                      lineHeight: 1.2,
                    }}
                  >
                    {ev.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#6b7280",
                      lineHeight: 1.7,
                      margin: "0 0 16px",
                    }}
                  >
                    {stripHtml(ev.short_description ?? ev.description ?? "")}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                    {formattedDate && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 12,
                          color: "#9aa6aa",
                          fontWeight: 500,
                        }}
                      >
                        <Calendar size={13} color="#95a49a" /> {formattedDate}
                      </span>
                    )}
                    {timeStr && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 12,
                          color: "#9aa6aa",
                          fontWeight: 500,
                        }}
                      >
                        <Clock size={13} color="#95a49a" /> {timeStr}
                      </span>
                    )}
                    {loc && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 12,
                          color: "#9aa6aa",
                          fontWeight: 500,
                        }}
                      >
                        <MapPin size={13} color="#95a49a" /> {loc}
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "24px",
                    flexShrink: 0,
                  }}
                  className="event-cta-col"
                >
                  <Link
                    href={`/events${ev.slug ? `/${ev.slug}` : ""}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: "#6c7e7f",
                      color: "#fff",
                      padding: "10px 20px",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                      transition: "all 0.2s",
                    }}
                    className="event-register-btn"
                  >
                    Register <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <style>{`
        .event-card:hover { box-shadow: 0 12px 40px rgba(108,126,127,0.12); transform: translateY(-3px); border-color: #95a49a !important; }
        .event-card:hover .event-img { transform: scale(1.06); }
        .event-register-btn:hover { background: #5a6b6c !important; transform: translateY(-1px); }
        .events-viewall:hover { gap: 12px !important; }
        @media (max-width: 768px) {
          .event-img-wrap { display: none !important; }
          .event-cta-col { display: none !important; }
        }
        @media (max-width: 480px) {
          .event-card { flex-direction: column; }
          .event-card > div:first-child { width: 100% !important; flex-direction: row !important; gap: 12px; justify-content: flex-start !important; padding: 16px 20px !important; }
        }
      `}</style>
    </section>
  );
}
