"use client";
import Footer from "@/components/Footer";
import PageHero from "@/components/HeroPage";
import Navbar from "@/components/Navbar";
import { AnimatePresence, motion, useInView } from "framer-motion";
import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";

/* ─── Type Definitions ──────────────────────────────────────── */
interface ApiCourse {
  id: number;
  title: string;
  short_description: string;
  description: string;
  price: string;
  discount_price: string | null;
  startAt: string | null;
  endAt: string | null;
  thumbnail: string | null;
  course_type: "video" | "pdf" | "online";
  url: string | null;
  video: string | null;
  pdf: string | null;
  curriculum: string;
  what_you_learn: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: ApiCourse[];
}

export interface NormalizedCourse {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  level: "All" | "Beginner" | "Intermediate" | "Advanced";
  lessons: number;
  students: number;
  price: string;
  isFree: boolean;
  originalPrice: string | null;
  thumbnail: string | null;
  rawData: ApiCourse;
}

/* ─── API Configuration ─────────────────────────────────────── */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost/bludreamgroup-protfolio-api/public/api";
const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
  "http://localhost/bludreamgroup-protfolio-api/public/";

/* ─── Level badge colors (pill on image) ────────────────────── */
const levelBadgeStyle: Record<string, { bg: string; color: string }> = {
  All: { bg: "rgba(30,40,80,0.75)", color: "#fff" },
  Beginner: { bg: "rgba(90,160,230,0.85)", color: "#fff" },
  Intermediate: { bg: "rgba(60,130,200,0.85)", color: "#fff" },
  Advanced: { bg: "rgba(200,60,80,0.85)", color: "#fff" },
};

/* ─── Deterministic helpers ──────────────────────────────────── */
function deterministicLessons(id: number): number {
  return 8 + (id % 20);
}
function deterministicStudents(id: number): number {
  return 500 + (id % 3000);
}

/* ─── Normalize API course ───────────────────────────────────── */
function normalizeApiCourse(
  apiCourse: ApiCourse,
  index: number,
): NormalizedCourse {
  const levels: NormalizedCourse["level"][] = [
    "All",
    "Beginner",
    "Intermediate",
    "Advanced",
  ];
  const rawPrice = parseFloat(apiCourse.price) || 0;
  const rawDiscount = apiCourse.discount_price
    ? parseFloat(apiCourse.discount_price)
    : null;
  const hasDiscount = rawDiscount !== null && rawDiscount < rawPrice;
  const sellingPrice = hasDiscount ? rawDiscount! : rawPrice;
  const isFree = sellingPrice === 0;

  return {
    id: apiCourse.id,
    title: apiCourse.title,
    subtitle: apiCourse.short_description || "Learn professional skills",
    category:
      apiCourse.course_type === "video"
        ? "Video Course"
        : apiCourse.course_type === "pdf"
          ? "PDF Course"
          : "Online Learning",
    level: levels[index % levels.length],
    lessons: deterministicLessons(apiCourse.id),
    students: deterministicStudents(apiCourse.id),
    price: isFree ? "FREE" : `৳${sellingPrice.toFixed(2)} `,
    isFree,
    originalPrice: hasDiscount ? `৳${rawPrice.toFixed(2)} ` : null,
    thumbnail: apiCourse.thumbnail
      ? `${IMAGE_BASE_URL}${apiCourse.thumbnail}`
      : null,
    rawData: apiCourse,
  };
}

/* ─── Placeholder image gradient ────────────────────────────── */
const placeholderGradients = [
  "linear-gradient(135deg,#667eea,#764ba2)",
  "linear-gradient(135deg,#f093fb,#f5576c)",
  "linear-gradient(135deg,#4facfe,#00f2fe)",
  "linear-gradient(135deg,#43e97b,#38f9d7)",
  "linear-gradient(135deg,#fa709a,#fee140)",
  "linear-gradient(135deg,#a18cd1,#fbc2eb)",
];

/* ─── Fade-up wrapper using Framer Motion + InView ─────────── */
function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}): ReactNode {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Skeleton card ──────────────────────────────────────────── */
function SkeletonCard(): ReactNode {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          height: 200,
          background:
            "linear-gradient(90deg,#eef0f3 25%,#e2e5e8 50%,#eef0f3 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.4s infinite",
        }}
      />
      <div
        style={{
          padding: "20px 22px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div
          style={{
            height: 18,
            borderRadius: 6,
            background: "#eef0f3",
            width: "80%",
          }}
        />
        <div
          style={{
            height: 14,
            borderRadius: 6,
            background: "#eef0f3",
            width: "60%",
          }}
        />
        <div
          style={{
            height: 12,
            borderRadius: 6,
            background: "#eef0f3",
            width: "40%",
            marginTop: 4,
          }}
        />
      </div>
    </div>
  );
}

/* ─── Course Card ────────────────────────────────────────────── */
export function CourseCard({
  c,
  index,
}: {
  c: NormalizedCourse;
  index: number;
}): ReactNode {
  const [hovered, setHovered] = useState(false);
  const lvl = levelBadgeStyle[c.level] || levelBadgeStyle.All;
  const bg = placeholderGradients[index % placeholderGradients.length];

  return (
    <FadeUp delay={index * 0.06}>
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        style={{
          background: "#fff",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: hovered
            ? "0 16px 48px rgba(60,100,200,0.15)"
            : "0 2px 16px rgba(0,0,0,0.07)",
          transition: "box-shadow 0.3s ease",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          cursor: "pointer",
        }}
      >
        {/* ── Image area ── */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          {/* Image or gradient placeholder */}
          <div
            style={{
              height: 200,
              background: c.thumbnail
                ? `url(${c.thumbnail}) center/cover no-repeat`
                : bg,
              transition: "transform 0.5s ease",
              transform: hovered ? "scale(1.04)" : "scale(1)",
            }}
          />

          {/* Overlay gradient */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.32) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Level badge — top-left */}
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              padding: "4px 12px",
              borderRadius: "100px",
              background: lvl.bg,
              color: lvl.color,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.04em",
              backdropFilter: "blur(4px)",
            }}
          >
            {c.level}
          </div>

          {/* Price badge — bottom-right */}
          <motion.div
            animate={{ scale: hovered ? 1.08 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
              position: "absolute",
              bottom: 4,
              right: 6,
              width: 52,
              height: 52,
              padding: "5px",
              borderRadius: "50%",
              background: c.isFree
                ? "linear-gradient(135deg,#4a5dd4,#3a4fc0)"
                : "linear-gradient(135deg,#3a8bd4,#2a75c0)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: c.isFree ? 11 : 12,
              fontWeight: 800,
              letterSpacing: c.isFree ? "0.04em" : "0",
              boxShadow: "0 4px 16px rgba(60,90,200,0.35)",
              zIndex: 2,
            }}
          >
            {c.price}
          </motion.div>
        </div>

        {/* ── Content ── */}
        <div
          style={{
            padding: "28px 22px 22px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3
            style={{
              fontSize: "clamp(15px,1.2vw,17px)",
              fontWeight: 800,
              color: "#1a1f3c",
              lineHeight: 1.35,
              margin: "0 0 10px",
              letterSpacing: "-0.01em",
              fontFamily: "'Sora', 'DM Sans', system-ui, sans-serif",
            }}
          >
            {c.title}
          </h3>

          <p
            style={{
              fontSize: 13,
              color: "#7a869a",
              lineHeight: 1.55,
              margin: "0 0 auto",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {c.subtitle}
          </p>

          {/* Divider */}
          <div
            style={{ height: 1, background: "#f0f2f5", margin: "16px 0 14px" }}
          />

          {/* Meta row */}
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 12.5,
                color: "#5a6478",
                fontWeight: 500,
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
              {c.lessons} Lessons
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 12.5,
                color: "#5a6478",
                fontWeight: 500,
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              {c.students.toLocaleString()} Students
            </span>
          </div>
        </div>

        {/* Enroll hover bar */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 46, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{ overflow: "hidden" }}
            >
              <Link
                href={`/enrollment?courseId=${c.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 46,
                  background: "linear-gradient(90deg,#4a5dd4,#3a8bd4)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 12.5,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  gap: 8,
                }}
              >
                Enroll Now →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </FadeUp>
  );
}

/* ─── Stats counter ──────────────────────────────────────────── */
function StatBadge({ value, label }: { value: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, ease: "backOut" }}
      style={{ textAlign: "center" }}
    >
      <div
        style={{
          fontSize: "clamp(26px,3vw,36px)",
          fontWeight: 800,
          color: "#1a1f3c",
          letterSpacing: "-0.03em",
          fontFamily: "'Sora',system-ui,sans-serif",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 12,
          color: "#8492a6",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginTop: 4,
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}

/* ─── Filter Tab ─────────────────────────────────────────────── */
function FilterTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      style={{
        padding: "8px 22px",
        borderRadius: "100px",
        border: active ? "none" : "1.5px solid #dde2ec",
        background: active ? "linear-gradient(90deg,#4a5dd4,#3a8bd4)" : "#fff",
        color: active ? "#fff" : "#5a6478",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        letterSpacing: "0.02em",
        transition: "all 0.22s ease",
        boxShadow: active ? "0 4px 16px rgba(74,93,212,0.28)" : "none",
      }}
    >
      {label}
    </motion.button>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function CoursesPage(): ReactNode {
  const [courses, setCourses] = useState<NormalizedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLevel, setActiveLevel] = useState<string>("All");
  const [visibleCount, setVisibleCount] = useState(6);

  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  /* Fetch */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE_URL}/course`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ApiResponse = await res.json();
        if (data.status && Array.isArray(data.data)) {
          setCourses(
            data.data
              .filter((c) => c.status === "active")
              .map((c, i) => normalizeApiCourse(c, i)),
          );
        } else throw new Error(data.message || "Invalid response");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* Filter */
  const filtered = courses.filter(
    (c) => activeLevel === "All" || c.level === activeLevel,
  );
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const totalStudents = courses.reduce((s, c) => s + c.students, 0);

  return (
    <>
      <Navbar />

      {/* ── Hero Section ── */}
      <PageHero title="Our Courses" currentPage="Course" />

      {/* ── Main Section ── */}
      <section
        style={{
          background: "linear-gradient(180deg,#f0f4fc 0%,#f7f9ff 100%)",
          padding: "clamp(40px,6vw,80px) 0 clamp(60px,8vw,120px)",
        }}
      >
        <div className="container">
          {/* Filter tabs */}
          {!loading && courses.length > 0 && (
            <FadeUp>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 10,
                  flexWrap: "wrap",
                  marginBottom: 48,
                }}
              >
                {levels.map((lvl) => (
                  <FilterTab
                    key={lvl}
                    label={lvl}
                    active={activeLevel === lvl}
                    onClick={() => {
                      setActiveLevel(lvl);
                      setVisibleCount(6);
                    }}
                  />
                ))}
              </div>
            </FadeUp>
          )}

          {/* Error */}
          {error && (
            <FadeUp>
              <div
                style={{
                  padding: 32,
                  background: "rgba(220,53,69,0.07)",
                  border: "1px solid rgba(220,53,69,0.2)",
                  borderRadius: 12,
                  textAlign: "center",
                  marginBottom: 40,
                }}
              >
                <p
                  style={{ color: "#c0392b", margin: "0 0 12px", fontSize: 14 }}
                >
                  Failed to load courses: {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    padding: "8px 20px",
                    background: "transparent",
                    border: "1px solid rgba(220,53,69,0.35)",
                    borderRadius: 8,
                    color: "#c0392b",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  Retry
                </button>
              </div>
            </FadeUp>
          )}

          {/* Grid */}
          {loading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
                gap: 24,
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : visible.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLevel}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
                  gap: 24,
                }}
              >
                {visible.map((c, i) => (
                  <CourseCard key={c.id} c={c} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>
          ) : !error ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
              <p style={{ color: "#8492a6", fontSize: 15 }}>
                No courses found for this level.
              </p>
              <button
                onClick={() => setActiveLevel("All")}
                style={{
                  marginTop: 16,
                  padding: "10px 24px",
                  background: "transparent",
                  border: "1.5px solid #4a5dd4",
                  borderRadius: 8,
                  color: "#4a5dd4",
                  fontSize: 13,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Show All
              </button>
            </div>
          ) : null}

          {/* Browse More / Load More button */}
          {!loading && (hasMore || filtered.length > 0) && (
            <FadeUp delay={0.1}>
              <div style={{ textAlign: "center", marginTop: 52 }}>
                {hasMore ? (
                  <motion.button
                    onClick={() => setVisibleCount((v) => v + 6)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "15px 40px",
                      background: "linear-gradient(90deg,#4a5dd4,#3a8bd4)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "100px",
                      fontFamily: "'Sora',system-ui,sans-serif",
                      fontSize: 14,
                      fontWeight: 700,
                      letterSpacing: "0.03em",
                      cursor: "pointer",
                      boxShadow: "0 8px 28px rgba(74,93,212,0.32)",
                    }}
                  >
                    Browse More Courses
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.4,
                        ease: "easeInOut",
                      }}
                    >
                      ›
                    </motion.span>
                  </motion.button>
                ) : filtered.length >= 6 ? (
                  <p style={{ color: "#b0b8cc", fontSize: 13 }}>
                    All {filtered.length} courses shown.
                  </p>
                ) : null}
              </div>
            </FadeUp>
          )}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      {!loading && (
        <section
          style={{
            background: "#fff",
            borderTop: "1px solid #eef0f5",
            padding: "clamp(60px,8vw,100px) 0",
          }}
        >
          <div className="container">
            <FadeUp>
              <div
                style={{ maxWidth: 580, margin: "0 auto", textAlign: "center" }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 24,
                  }}
                >
                  <div
                    style={{ width: 28, height: 1, background: "#4a5dd4" }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "#4a5dd4",
                      fontWeight: 700,
                    }}
                  >
                    Become an Instructor
                  </span>
                  <div
                    style={{ width: 28, height: 1, background: "#4a5dd4" }}
                  />
                </div>
                <h2
                  style={{
                    fontFamily: "'Sora',system-ui,sans-serif",
                    fontSize: "clamp(28px,3.5vw,44px)",
                    fontWeight: 900,
                    color: "#1a1f3c",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.15,
                    margin: "0 0 16px",
                  }}
                >
                  Teach what you know.
                </h2>
                <p
                  style={{
                    fontSize: 15,
                    color: "#7a869a",
                    lineHeight: 1.75,
                    marginBottom: 36,
                  }}
                >
                  Are you a published author, working designer, or industry
                  professional? Apply to teach and reach thousands of ambitious
                  creators.
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Link
                      href="/teach"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "13px 32px",
                        background: "linear-gradient(90deg,#4a5dd4,#3a8bd4)",
                        color: "#fff",
                        borderRadius: "100px",
                        fontWeight: 700,
                        fontSize: 13,
                        letterSpacing: "0.05em",
                        textDecoration: "none",
                        boxShadow: "0 6px 20px rgba(74,93,212,0.28)",
                      }}
                    >
                      Apply to Teach →
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Link
                      href="/success-stories"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "13px 32px",
                        border: "1.5px solid #dde2ec",
                        borderRadius: "100px",
                        color: "#5a6478",
                        fontSize: 13,
                        letterSpacing: "0.05em",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      Success Stories
                    </Link>
                  </motion.div>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>
      )}

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap');

        * { box-sizing: border-box; }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 40px);
        }

        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        @media (max-width: 640px) {
          /* stack grid to single column */
        }
      `}</style>
    </>
  );
}
