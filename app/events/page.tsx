"use client";

import Footer from "@/components/Footer";
import PageHero from "@/components/HeroPage";
import Navbar from "@/components/Navbar";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

/* ─── ENV ─── */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "";

/* ─── Types ─── */
interface EventItem {
  id: number;
  event_category_id: string;
  title: string;
  description?: string;
  event_date?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  status?: string;
  image?: string | null;
}

interface Category {
  id: number;
  name: string;
}

/* ─── Category config ─── */
const CATEGORY_MAP: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  "1": { label: "Workshop", color: "#ffffff", bg: "#6c7e7f" },
  "2": { label: "Seminar", color: "#ffffff", bg: "#7a9190" },
  "3": { label: "Book Launch", color: "#ffffff", bg: "#95a49a" },
  "4": { label: "Masterclass", color: "#ffffff", bg: "#5a6e6f" },
  "5": { label: "Training", color: "#ffffff", bg: "#9aa6aa" },
  "6": { label: "Conference", color: "#ffffff", bg: "#6c7e7f" },
  default: { label: "Event", color: "#ffffff", bg: "#9aa6aa" },
};

/* ─── Gradient palettes for image placeholders (cycles by id) ─── */
const GRADIENTS = [
  "linear-gradient(140deg,#4a6163 0%,#6c7e7f 40%,#95a49a 100%)",
  "linear-gradient(140deg,#5b7070 0%,#7a9190 40%,#9aa6aa 100%)",
  "linear-gradient(140deg,#3e5657 0%,#6c7e7f 50%,#8a9e99 100%)",
  "linear-gradient(140deg,#607878 0%,#9aa6aa 50%,#c5d0cc 100%)",
  "linear-gradient(140deg,#2d4748 0%,#5b7070 45%,#95a49a 100%)",
  "linear-gradient(140deg,#526a6b 0%,#95a49a 50%,#bcc9c5 100%)",
];

/* ─── Strip HTML ─── */
function stripHtml(html?: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .trim();
}

/* ─── Format helpers ─── */
function formatDate(d?: string) {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
function formatShortDate(d?: string) {
  if (!d) return { day: "--", month: "---", year: "----" };
  const dt = new Date(d);
  return {
    day: dt.getDate().toString().padStart(2, "0"),
    month: dt.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    year: dt.getFullYear().toString(),
  };
}
function formatTime(t?: string) {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

/* ─── Motion variants ─── */
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 48, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
};
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/* ═══════════════════════════════════════════
   EVENT CARD  (matches reference layout)
═══════════════════════════════════════════ */
function EventCard({ event, index }: { event: EventItem; index: number }) {
  const cat = CATEGORY_MAP[event.event_category_id] ?? CATEGORY_MAP.default;
  const grad = GRADIENTS[event.id % GRADIENTS.length];
  const desc = stripHtml(event.description);
  const imageUrl = getEventImage(event.image);

  const { day, month, year } = formatShortDate(event.event_date);
  const startT = formatTime(event.start_time);
  const endT = formatTime(event.end_time);
  const timeStr = startT && endT ? `${startT} – ${endT}` : startT || endT || "";
  const isActive = event.status === "active";

  return (
    <motion.article
      variants={cardVariants}
      className="ev-card"
      style={{
        background: "#ffffff",
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid #e8eceb",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 16px rgba(108,126,127,0.07)",
        transition: "box-shadow 0.3s, transform 0.3s, border-color 0.3s",
      }}
    >
      {/* ── Image / Gradient ── */}
      <div
        style={{
          position: "relative",
          aspectRatio: "16/10",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={event.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.55s ease",
            }}
            className="ev-img"
          />
        ) : (
          <div
            className="ev-img"
            style={{
              width: "100%",
              height: "100%",
              background: grad,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              transition: "transform 0.55s ease",
            }}
          >
            {/* Decorative patterns */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.06,
                backgroundImage:
                  "radial-gradient(circle, #fff 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "15%",
                right: "10%",
                width: 100,
                height: 100,
                borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.15)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "20%",
                left: "8%",
                width: 60,
                height: 60,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />

            {/* Floating date badge in image */}
            <div
              style={{
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.28)",
                borderRadius: 14,
                padding: "14px 20px",
                textAlign: "center",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1,
                  fontFamily: "Xolonium",
                }}
              >
                {day}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.85)",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  marginTop: 2,
                }}
              >
                {month}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.65)",
                  marginTop: 2,
                }}
              >
                {year}
              </div>
            </div>
          </div>
        )}

        {/* Status badge — bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 12,
            background: isActive ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.5)",
            backdropFilter: "blur(8px)",
            borderRadius: 20,
            padding: "5px 14px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: isActive ? "#6c7e7f" : "#9ca3af",
              boxShadow: isActive ? "0 0 6px #6c7e7f88" : "none",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: isActive ? "#6c7e7f" : "#9ca3af",
              fontFamily: "Xolonium",
            }}
          >
            {isActive ? "Upcoming" : "Ended"}
          </span>
        </div>

        {/* Category badge — bottom-right */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            right: 12,
            background: cat.bg,
            color: cat.color,
            borderRadius: 20,
            padding: "5px 14px",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            boxShadow: `0 4px 12px ${cat.bg}55`,
          }}
        >
          {cat.label}
        </div>
      </div>

      {/* ── Body ── */}
      <div
        style={{
          padding: "22px 24px 24px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Title */}
        <h3
          style={{
            fontFamily: "Venus Rising",
            fontSize: "clamp(12px, 2vw, 18px)",
            fontWeight: 700,
            color: "#1a2427",
            lineHeight: 1.25,
            margin: "0 0 14px",
            letterSpacing: "-0.01em",
          }}
        >
          {event.title}
        </h3>

        {/* Meta row */}
        <div
          className="ev-meta"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px 20px",
            marginBottom: 14,
            fontFamily: "Xolonium",
          }}
        >
          {event.event_date && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: "#6b7280",
                fontWeight: 500,
              }}
            >
              <Calendar size={13} color="#6c7e7f" />
              {formatDate(event.event_date)}
            </span>
          )}
          {timeStr && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: "#6b7280",
                fontWeight: 500,
                fontFamily: "Xolonium",
              }}
            >
              <Clock size={13} color="#95a49a" />
              {timeStr}
            </span>
          )}
          {event.location && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: "#6b7280",
                fontWeight: 500,
                fontFamily: "Xolonium",
              }}
            >
              <MapPin size={13} color="#9aa6aa" />
              {event.location}
            </span>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#f0f2f1", marginBottom: 14 }} />

        {/* Description */}
        {desc && (
          <p
            style={
              {
                fontSize: 13,
                color: "#6b7280",
                lineHeight: 1.75,
                margin: "0 0 20px",
                flex: 1,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                fontFamily: "Xolonium",
              } as React.CSSProperties
            }
          >
            {desc}
          </p>
        )}

        {/* CTA row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            fontFamily: "Xolonium",
          }}
        >
          <Link
            href={`/events/${event.id}`}
            className="ev-details-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "#6c7e7f",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "all 0.25s",
              boxShadow: "0 4px 14px rgba(108,126,127,0.28)",
            }}
          >
            Register
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          {/* Time-to-event chip */}
          {event.event_date && (
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#95a49a",
                background: "#95a49a12",
                borderRadius: 20,
                padding: "5px 12px",
                border: "1px solid #95a49a30",
              }}
            >
              {(() => {
                const diff = new Date(event.event_date).getTime() - Date.now();
                const days = Math.ceil(diff / 86400000);
                if (days < 0) return "Ended";
                if (days === 0) return "Today";
                if (days === 1) return "Tomorrow";
                return `In ${days} days`;
              })()}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

/* ═══════════════════════════════════════════
   SKELETON CARD
═══════════════════════════════════════════ */
function SkeletonCard() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #e8eceb",
        overflow: "hidden",
        animation: "pulse 1.8s ease-in-out infinite",
      }}
    >
      <div style={{ aspectRatio: "16/10", background: "#e8ecea" }} />
      <div
        style={{
          padding: "22px 24px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div
          style={{
            height: 24,
            width: "70%",
            background: "#e8ecea",
            borderRadius: 6,
          }}
        />
        <div
          style={{
            height: 14,
            width: "90%",
            background: "#f0f2f1",
            borderRadius: 4,
          }}
        />
        <div
          style={{
            height: 14,
            width: "60%",
            background: "#f0f2f1",
            borderRadius: 4,
          }}
        />
        <div style={{ height: 1, background: "#f0f2f1", margin: "4px 0" }} />
        <div
          style={{
            height: 12,
            width: "95%",
            background: "#f5f6f5",
            borderRadius: 4,
          }}
        />
        <div
          style={{
            height: 12,
            width: "80%",
            background: "#f5f6f5",
            borderRadius: 4,
          }}
        />
        <div
          style={{
            height: 38,
            width: 130,
            background: "#e8ecea",
            borderRadius: 8,
            marginTop: 8,
          }}
        />
      </div>
    </div>
  );
}
function getEventImage(image?: string | null) {
  if (!image) return null;

  try {
    const parsed = JSON.parse(image);

    return `${IMAGE_BASE}${
      parsed.large || parsed.medium || parsed.small || parsed.original
    }`;
  } catch {
    return `${IMAGE_BASE}${image}`;
  }
}
/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
const PER_PAGE = 6;

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [filtered, setFiltered] = useState<EventItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; label: string }[]>(
    [],
  );

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  /* Fetch events */
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/event`)
      .then((r) => r.json())
      .then((json) => {
        const data: EventItem[] = json?.data ?? json;
        if (Array.isArray(data)) {
          setEvents(data);
          setFiltered(data);

          /* Build categories from data */
          const catMap = new Map<string, string>();
          data.forEach((e) => {
            const cat =
              CATEGORY_MAP[e.event_category_id] ?? CATEGORY_MAP.default;
            catMap.set(e.event_category_id, cat.label);
          });
          setCategories(
            Array.from(catMap.entries()).map(([id, label]) => ({ id, label })),
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* Filter */
  useEffect(() => {
    let result = [...events];
    if (activeCat !== "all")
      result = result.filter((e) => e.event_category_id === activeCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          stripHtml(e.description).toLowerCase().includes(q) ||
          (e.location ?? "").toLowerCase().includes(q),
      );
    }
    setFiltered(result);
    setPage(1);
  }, [search, activeCat, events]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      {/* ── Google Fonts ── */}
      <style>{`
        

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {  background: #f4f7f6; }

        .ev-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 52px rgba(108,126,127,0.16) !important;
          border-color: #95a49a !important;
        }
        .ev-card:hover .ev-img { transform: scale(1.05); }
        .ev-details-btn:hover {
          background: #5a6b6c !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(108,126,127,0.38) !important;
        }
        .cat-pill { transition: all 0.22s ease; }
        .cat-pill:hover { background: #6c7e7f !important; color: #fff !important; border-color: #6c7e7f !important; }
        .page-btn { transition: all 0.2s; }
        .page-btn:hover { background: #6c7e7f !important; color: #fff !important; border-color: #6c7e7f !important; }

        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50%       { opacity: 1; }
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .ev-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .hero-inner { padding: 56px 20px 48px !important; }
        }
        @media (max-width: 600px) {
          .ev-grid { grid-template-columns: 1fr !important; }
          .cat-pill{padding: 4px 8px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 500;
    transition: all 0.22s ease;}
          .filter-bar { flex-direction: columns !important; gap: 4px !important; }
          .cat-pills-wrap { overflow-x: auto; padding-bottom: 4px; }
          .cat-pills-wrap::-webkit-scrollbar { display: none; }
          .page-controls { gap: 6px !important; }
        }
      `}</style>
      <Navbar />

      {/* ══════════════════════════════════
          HERO HEADER
      ══════════════════════════════════ */}
      <PageHero title="Events & Programs" currentPage="Events" />
      {/* <section
        style={{
          background:
            "linear-gradient(135deg, #6c7e7f 0%, #7a9190 40%, #95a49a 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.07,
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div style={{ position: "absolute", bottom: -2, left: 0, right: 0 }}>
          <svg
            viewBox="0 0 1440 64"
            preserveAspectRatio="none"
            style={{ width: "100%", height: 64, display: "block" }}
          >
            <path
              d="M0,32 C480,64 960,0 1440,32 L1440,64 L0,64 Z"
              fill="#f4f7f6"
            />
          </svg>
        </div>
      </section> */}

      {/* ══════════════════════════════════
          FILTER BAR
      ══════════════════════════════════ */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e8eceb",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 2px 16px rgba(108,126,127,0.06)",
          fontFamily: "Xolonium",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px" }}>
          <div
            className="filter-bar"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "14px 0",
            }}
          >
            {/* Search */}
            {/* <div style={{ position: "relative", flex: "0 0 260px" }}>
              <Search
                size={15}
                color="#9aa6aa"
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                placeholder="Search events…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px 10px 38px",
                  border: "1px solid #e8eceb",
                  borderRadius: 10,
                  outline: "none",
                  fontSize: 13,
                  color: "#1a2427",
                  background: "#f8faf9",
                  fontFamily: "Xolonium",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#6c7e7f")}
                onBlur={(e) => (e.target.style.borderColor = "#e8eceb")}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9aa6aa",
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div> */}

            {/* Category pills */}
            <div
              className="cat-pills-wrap"
              style={{ flex: 1, display: "flex", gap: 8, alignItems: "center" }}
            >
              {[{ id: "all", label: "All Events" }, ...categories].map((c) => {
                const isActive = activeCat === c.id;
                const catStyle =
                  c.id !== "all"
                    ? (CATEGORY_MAP[c.id] ?? CATEGORY_MAP.default)
                    : null;
                return (
                  <button
                    key={c.id}
                    className="cat-pill"
                    onClick={() => setActiveCat(c.id)}
                    style={{
                      padding: "7px 16px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                      border: `1.5px solid ${isActive ? (catStyle?.bg ?? "#6c7e7f") : "#e8eceb"}`,
                      background: isActive
                        ? (catStyle?.bg ?? "#6c7e7f")
                        : "transparent",
                      color: isActive ? "#fff" : "#6b7280",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      fontFamily: "Xolonium",
                    }}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>

            {/* Results count */}
            <div
              style={{
                fontSize: 12,
                color: "#9aa6aa",
                fontWeight: 600,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {loading
                ? "Loading…"
                : `${filtered.length} event${filtered.length !== 1 ? "s" : ""}`}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          GRID
      ══════════════════════════════════ */}
      <main
        style={{ maxWidth: 1240, margin: "0 auto", padding: "48px 24px 80px" }}
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeleton"
              className="ev-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 28,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "80px 20px" }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <h3
                style={{
                  fontFamily: "Xolonium",
                  fontSize: 24,
                  color: "#1a2427",
                  marginBottom: 10,
                }}
              >
                No events found
              </h3>
              <p style={{ fontSize: 14, color: "#9aa6aa" }}>
                Try adjusting your search or filter.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCat("all");
                }}
                style={{
                  marginTop: 24,
                  background: "#6c7e7f",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "11px 24px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`page-${page}-${activeCat}-${search}`}
              className="ev-grid"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 28,
              }}
            >
              {paginated.map((ev, i) => (
                <EventCard key={ev.id} event={ev} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Pagination ── */}
        {!loading && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="page-controls"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
              marginTop: 56,
            }}
          >
            {/* Prev */}
            <button
              className="page-btn"
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                scrollToTop();
              }}
              disabled={page === 1}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "1.5px solid #e8eceb",
                background: "#fff",
                color: "#6b7280",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: page === 1 ? "not-allowed" : "pointer",
                opacity: page === 1 ? 0.4 : 1,
              }}
            >
              <ChevronLeft size={17} />
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              const isCurrent = p === page;
              const isNear =
                Math.abs(p - page) <= 1 || p === 1 || p === totalPages;
              if (!isNear && p === page - 2)
                return (
                  <span key="dots-l" style={{ fontSize: 14, color: "#9aa6aa" }}>
                    …
                  </span>
                );
              if (!isNear) return null;
              return (
                <button
                  key={p}
                  className="page-btn"
                  onClick={() => {
                    setPage(p);
                    scrollToTop();
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: `1.5px solid ${isCurrent ? "#6c7e7f" : "#e8eceb"}`,
                    background: isCurrent ? "#6c7e7f" : "#fff",
                    color: isCurrent ? "#fff" : "#6b7280",
                    fontWeight: isCurrent ? 700 : 500,
                    fontSize: 13,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontFamily: "Xolonium",
                    boxShadow: isCurrent
                      ? "0 4px 14px rgba(108,126,127,0.3)"
                      : "none",
                  }}
                >
                  {p}
                </button>
              );
            })}

            {/* Next */}
            <button
              className="page-btn"
              onClick={() => {
                setPage((p) => Math.min(totalPages, p + 1));
                scrollToTop();
              }}
              disabled={page === totalPages}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "1.5px solid #e8eceb",
                background: "#fff",
                color: "#6b7280",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: page === totalPages ? "not-allowed" : "pointer",
                opacity: page === totalPages ? 0.4 : 1,
              }}
            >
              <ChevronRight size={17} />
            </button>
          </motion.div>
        )}
      </main>
      <Footer />
    </>
  );
}
