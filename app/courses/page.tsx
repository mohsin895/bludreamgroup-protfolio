"use client";
import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import PageHero from "@/components/HeroPage";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

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

interface NormalizedCourse {
  id: number;
  title: string;
  subtitle: string;
  instructor: string;
  instructorRole: string;
  avatar: string;
  color: string;
  bg: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  lessons: number;
  students: number;
  price: string;
  originalPrice: string | null;
  discountPrice: string | null;
  featured: boolean;
  tags: string[];
  description: string;
  thumbnail: string | null;
  rawData: ApiCourse;
}

interface ColorSet {
  color: string;
  bg: string;
}

interface LevelColor {
  bg: string;
  color: string;
}

interface LevelColors {
  [key: string]: LevelColor;
}

interface SortOption {
  value: "newest" | "price-low" | "price-high" | "name";
  label: string;
}

interface MetaItem {
  icon: string;
  label: string;
}

interface StatItem {
  value: string;
  label: string;
}

/* ─── API Configuration ─────────────────────────────────────── */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost/bludreamgroup-protfolio-api/public/api";
const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
  "http://localhost/bludreamgroup-protfolio-api/public/";

/* ─── Color Palette ─────────────────────────────────────────── */
const colors: ColorSet[] = [
  { color: "#C9A84C", bg: "rgba(201,168,76,0.08)" },
  { color: "#7DD4B0", bg: "rgba(125,212,176,0.08)" },
  { color: "#C97B8C", bg: "rgba(201,123,140,0.08)" },
  { color: "#8BA7E0", bg: "rgba(139,167,224,0.08)" },
];

/* ─── Level Badge Colors ────────────────────────────────────── */
const levelColors: LevelColors = {
  Beginner: { bg: "rgba(125,212,176,0.1)", color: "#7DD4B0" },
  Intermediate: { bg: "rgba(139,167,224,0.1)", color: "#8BA7E0" },
  Advanced: { bg: "rgba(201,123,140,0.1)", color: "#C97B8C" },
};

/* ─── Sort Options ──────────────────────────────────────────── */
const sortOptions: SortOption[] = [
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name", label: "Name: A-Z" },
];

/* ─── Deterministic helpers (no Math.random in render) ─────── */
function deterministicLessons(id: number): number {
  return 8 + (id % 20);
}
function deterministicStudents(id: number): number {
  return 500 + (id % 3000);
}

/* ─── Helper: Format Course Data ────────────────────────────── */
function normalizeApiCourse(
  apiCourse: ApiCourse,
  index: number,
): NormalizedCourse {
  const colorSet = colors[index % colors.length];
  const instructorNames = [
    "Dr. Sarah Chen",
    "Marcus Sterling",
    "Elena Rodriguez",
    "James Mitchell",
    "Priya Desai",
  ];
  const instructorRoles = [
    "Course Instructor",
    "Senior Educator",
    "Subject Expert",
    "Industry Professional",
    "Master Teacher",
  ];

  const rawPrice = parseFloat(apiCourse.price) || 0;
  const rawDiscount = apiCourse.discount_price
    ? parseFloat(apiCourse.discount_price)
    : null;

  /* If API gives discount_price < price, treat price as original (crossed-out)
       and discount_price as the actual selling price.
       If discount_price >= price or is null, just show price. */
  const hasDiscount = rawDiscount !== null && rawDiscount < rawPrice;

  return {
    id: apiCourse.id,
    title: apiCourse.title,
    subtitle: apiCourse.short_description || "Learn professional skills",
    instructor: instructorNames[index % instructorNames.length],
    instructorRole: instructorRoles[index % instructorRoles.length],
    avatar: apiCourse.title.substring(0, 2).toUpperCase(),
    color: colorSet.color,
    bg: colorSet.bg,
    category:
      apiCourse.course_type === "video"
        ? "Video Course"
        : apiCourse.course_type === "pdf"
          ? "PDF Course"
          : "Online Learning",
    level: (index % 3 === 0
      ? "Beginner"
      : index % 3 === 1
        ? "Intermediate"
        : "Advanced") as "Beginner" | "Intermediate" | "Advanced",
    duration: "6 weeks",
    lessons: deterministicLessons(apiCourse.id),
    students: deterministicStudents(apiCourse.id),
    /* selling price */
    price: hasDiscount
      ? `$${rawDiscount!.toFixed(2)}`
      : `$${rawPrice.toFixed(2)}`,
    /* original price shown crossed-out when discount applies */
    originalPrice: hasDiscount ? `$${rawPrice.toFixed(2)}` : null,
    /* kept for backwards-compat but now unused in display */
    discountPrice: null,
    featured: index === 0,
    tags: [
      apiCourse.course_type === "video" ? "Video" : "Online",
      "Professional",
      "Practical",
    ],
    description:
      apiCourse.description?.replace(/<[^>]*>/g, "") ||
      apiCourse.short_description ||
      "Professional course",
    thumbnail: apiCourse.thumbnail
      ? `${IMAGE_BASE_URL}${apiCourse.thumbnail}`
      : null,
    rawData: apiCourse,
  };
}

/* ─── Loading Skeleton ──────────────────────────────────────── */
function CourseSkeleton(): ReactNode {
  return (
    <div
      style={{
        position: "relative",
        background: "#0f0f0f",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "400px",
        animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
      }}
    >
      <div style={{ height: "3px", background: "rgba(201,168,76,0.2)" }} />
      <div
        style={{
          padding: "28px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div
          style={{
            height: "16px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "4px",
          }}
        />
        <div
          style={{
            height: "24px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "4px",
          }}
        />
        <div
          style={{
            height: "12px",
            background: "rgba(255,255,255,0.03)",
            borderRadius: "4px",
            width: "80%",
          }}
        />
      </div>
    </div>
  );
}

/* ─── Featured Course Card ──────────────────────────────────── */
interface FeaturedCourseProps {
  c: NormalizedCourse;
}

function FeaturedCourse({ c }: FeaturedCourseProps): ReactNode {
  return (
    <AnimatedSection>
      <div
        style={{
          position: "relative",
          background: "#fff1",
          border: "1px solid rgba(201,168,76,0.2)",
          borderRadius: "16px",
          padding: "clamp(32px, 4vw, 52px)",
          //   marginBottom: "20px",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "40px",
          alignItems: "center",
        }}
      >
        {/* Top accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "#fff",
          }}
        />

        {/* Bg watermark */}
        <div
          style={{
            position: "absolute",
            right: "clamp(180px, 25vw, 320px)",
            top: "50%",
            transform: "translateY(-50%)",
            fontFamily: "var(--font-display)",
            fontSize: "160px",
            lineHeight: 1,
            color: "#fff",
            pointerEvents: "none",
            userSelect: "none",
            letterSpacing: "-0.05em",
          }}
        >
          01
        </div>

        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#fff",
              }}
            >
              Featured Course
            </span>
            <span
              style={{
                width: "3px",
                height: "3px",
                borderRadius: "50%",
                background: "#fff8",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#fff9",
              }}
            >
              {c.category}
            </span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(24px, 2.8vw, 36px)",
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              margin: "0 0 10px",
            }}
          >
            {c.title}
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "#fff8",
              marginBottom: "20px",
            }}
          >
            {c.subtitle}
          </p>
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.5)",
              maxWidth: "560px",
              marginBottom: "28px",
            }}
          >
            {c.description.length > 200
              ? c.description.substring(0, 200) + "..."
              : c.description}
          </p>

          {/* Meta row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
              marginBottom: "28px",
            }}
          >
            {(
              [
                { icon: "◷", label: c.duration },
                { icon: "▤", label: `${c.lessons} lessons` },
                { icon: "◎", label: `${c.students.toLocaleString()} enrolled` },
              ] as MetaItem[]
            ).map((m) => (
              <span
                key={m.label}
                style={{
                  fontSize: "18px",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span style={{ color: "#6FB3C8", fontSize: "11px" }}>
                  {m.icon}
                </span>
                {m.label}
              </span>
            ))}
          </div>

          {/* Instructor */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "#6FB3C8",
                border: `1px solid #fff`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: 700,
                color: " #fff",
                letterSpacing: "0.04em",
                flexShrink: 0,
              }}
            >
              {c.avatar}
            </div>
            <div>
              <div style={{ fontSize: "18px", color: "#fff", fontWeight: 600 }}>
                {c.instructor}
              </div>
              <div style={{ fontSize: "14px", color: "#fff9" }}>
                {c.instructorRole}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              flexWrap: "wrap",
            }}
          >
            <Link
              href={`/enrollment?courseId=${c.id}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "13px 28px",
                background: "#6FB3C8",
                color: "#fff",
                borderRadius: "6px",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "0.06em",
                textDecoration: "none",
                textTransform: "uppercase",
              }}
            >
              Enroll Now
            </Link>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "22px",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              {c.price}
            </span>
            {c.originalPrice && (
              <span
                style={{
                  fontSize: "14px",
                  color: "#fff9",
                  textDecoration: "line-through",
                }}
              >
                {c.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Right: tags */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            minWidth: "140px",
          }}
        >
          <div
            style={{
              padding: "8px 14px",
              background: "#6FB3C8",
              border: `1px solid #fff9`,
              borderRadius: "6px",
              fontSize: "11px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#fff",
              textAlign: "center",
            }}
          >
            {c.level}
          </div>
          {c.tags.map((tag: string) => (
            <div
              key={tag}
              style={{
                padding: "7px 14px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid #6FB3C8",
                borderRadius: "6px",
                fontSize: "11px",
                letterSpacing: "0.06em",
                color: "#fff",
                textAlign: "center",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

/* ─── Course Card ───────────────────────────────────────────── */
interface CourseCardProps {
  c: NormalizedCourse;
  i: number;
}

function CourseCard({ c, i }: CourseCardProps): ReactNode {
  const [hovered, setHovered] = useState<boolean>(false);

  return (
    <AnimatedSection delay={i * 0.07}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          background: hovered ? "#203647" : "#203647",
          border: `1px solid ${
            hovered ? c.color + "44" : "rgba(255,255,255,0.06)"
          }`,
          borderRadius: "12px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          transition: "all 0.32s cubic-bezier(0.16,1,0.3,1)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
        }}
      >
        {/* Top color bar */}
        <div
          style={{
            height: "3px",
            background: `linear-gradient(90deg, ${c.color}, transparent)`,
            opacity: hovered ? 1 : 0.4,
            transition: "opacity 0.3s ease",
          }}
        />

        {c.thumbnail && (
          <div
            style={{
              width: "100%",
              height: "180px",
              background: `url(${c.thumbnail}) center/cover no-repeat`,
              opacity: hovered ? 0.7 : 1,
              transition: "opacity 0.3s ease",
            }}
          />
        )}

        <div style={{ padding: "28px 28px 0" }}>
          {/* Category + Level */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: c.color,
              }}
            >
              {c.category}
            </span>
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "3px 10px",
                background: levelColors[c.level]?.bg,
                borderRadius: "100px",
                color: levelColors[c.level]?.color,
              }}
            >
              {c.level}
            </span>
          </div>

          {/* Title */}
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(17px, 1.4vw, 20px)",
              color: "#fff",
              letterSpacing: "-0.01em",
              lineHeight: 1.25,
              margin: "0 0 8px",
            }}
          >
            {c.title}
          </h3>
          <p
            style={{
              fontSize: "13px",
              color: "#fff9",
              marginBottom: "16px",
            }}
          >
            {c.subtitle}
          </p>
          <p
            style={{
              fontSize: "13px",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.45)",
              marginBottom: "20px",
              minHeight: "40px",
            }}
          >
            {c.description.length > 80
              ? c.description.substring(0, 80) + "..."
              : c.description}
          </p>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "rgba(255,255,255,0.05)",
            margin: "0 28px",
          }}
        />

        {/* Meta */}
        <div
          style={{
            padding: "16px 28px",
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          {[
            { label: c.duration },
            { label: `${c.lessons} lessons` },
            { label: `${c.students.toLocaleString()}+ enrolled` },
          ].map((m) => (
            <span
              key={m.label}
              style={{
                fontSize: "13px",
                color: "#fff8",
                letterSpacing: "0.04em",
              }}
            >
              {m.label}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "rgba(255,255,255,0.05)",
            margin: "0 28px",
          }}
        />

        {/* Footer */}
        <div
          style={{
            padding: "20px 28px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
          }}
        >
          {/* Instructor */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: c.bg,
                border: `1px solid ${c.color}33`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: 700,
                color: c.color,
                letterSpacing: "0.04em",
                flexShrink: 0,
              }}
            >
              {c.avatar}
            </div>
            <div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#fff",
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}
              >
                {c.instructor}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#fff7",
                }}
              >
                {c.instructorRole}
              </div>
            </div>
          </div>

          {/* Price + CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ textAlign: "right" }}>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "18px",
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                {c.price}
              </span>
              {c.originalPrice && (
                <div
                  style={{
                    fontSize: "10px",
                    color: "#fff8",
                    textDecoration: "line-through",
                  }}
                >
                  {c.originalPrice}
                </div>
              )}
            </div>
            <Link
              href={`/enrollment?courseId=${c.id}`}
              style={{
                padding: "8px 16px",
                background: hovered ? "#6FB3C8" : "#6FB3C8",
                border: `1px solid ${hovered ? "#fff" : "#000"}`,
                borderRadius: "5px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: hovered ? "#FFF" : "#fff",
                textDecoration: "none",
                transition: "all 0.25s ease",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              Enroll →
            </Link>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

/* ─── Main Page Component ───────────────────────────────────── */
export default function CoursesPage(): ReactNode {
  const [courses, setCourses] = useState<NormalizedCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState<
    "newest" | "price-low" | "price-high" | "name"
  >("newest");
  const [activeLevel, setActiveLevel] = useState<string>("All Levels");

  const levels: string[] = [
    "All Levels",
    "Beginner",
    "Intermediate",
    "Advanced",
  ];

  /* ─── Fetch courses from API ────────────────────────────── */
  useEffect(() => {
    async function fetchCourses(): Promise<void> {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/course`);
        if (!response.ok)
          throw new Error(`Failed to fetch courses (${response.status})`);

        const data: ApiResponse = await response.json();
        if (data.status && Array.isArray(data.data)) {
          const normalized = data.data
            .filter((c) => c.status === "active")
            .map((course, index) => normalizeApiCourse(course, index));
          setCourses(normalized);
        } else {
          throw new Error(data.message || "Invalid API response");
        }
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(msg);
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  /* ─── Sort courses ──────────────────────────────────────── */
  const sortedCourses = [...courses].sort((a, b) => {
    const priceA = parseFloat(a.price.replace("$", ""));
    const priceB = parseFloat(b.price.replace("$", ""));
    switch (activeSort) {
      case "price-low":
        return priceA - priceB;
      case "price-high":
        return priceB - priceA;
      case "name":
        return a.title.localeCompare(b.title);
      case "newest":
      default:
        return b.id - a.id;
    }
  });

  /* ─── Filter by level ───────────────────────────────────── */
  const filteredCourses = sortedCourses.filter(
    (c) => activeLevel === "All Levels" || c.level === activeLevel,
  );

  const featured = filteredCourses[0] || null;
  const rest = featured ? filteredCourses.slice(1) : filteredCourses;

  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);

  return (
    <>
      <Navbar />
      <PageHero title="Our Courses" currentPage="Courses" />
      {/* ── Hero ── */}
      <section
        style={{
          paddingTop: "40px",
          paddingBottom: "60px",
          background: "#F4F7F6",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-250px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="container">
          <AnimatedSection>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "24px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "28px",
                  height: "1px",
                  background: "#000",
                }}
              />
              <span
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#000",
                }}
              >
                Courses
              </span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(44px, 6.5vw, 88px)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                color: "#000",
                maxWidth: "700px",
                margin: "0 0 24px",
              }}
            >
              Learn from
              <br />
              <span
                style={{
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(201,168,76,0.55)",
                }}
              >
                those who did it.
              </span>
            </h1>

            <p
              style={{
                fontSize: "17px",
                lineHeight: 1.75,
                color: "#0009",
                maxWidth: "500px",
                marginBottom: "40px",
              }}
            >
              Practical courses on publishing, portfolio building, and creative
              business — taught by practitioners with real results.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      {!loading && courses.length > 0 && (
        <section
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            background: "#203647",
            padding: "32px 0",
          }}
        >
          <div className="container">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "clamp(24px, 5vw, 72px)",
                flexWrap: "wrap",
              }}
            >
              {(
                [
                  { value: `${courses.length}`, label: "Courses Available" },
                  {
                    value: `${totalStudents.toLocaleString()}+`,
                    label: "Students Enrolled",
                  },
                  { value: "4.9★", label: "Average Rating" },
                  { value: "Lifetime", label: "Access Included" },
                ] as StatItem[]
              ).map((s) => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "26px",
                      fontWeight: 700,
                      color: "#fff",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#fff9",
                      marginTop: "4px",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Course ── */}
      {!loading && featured && (
        <section
          style={{
            background: "#203647",
            paddingTop: "80px",
            paddingBottom: "0",
          }}
        >
          <div className="container">
            <FeaturedCourse c={featured} />
          </div>
        </section>
      )}

      {/* ── Main Grid Section ── */}
      <section
        id="courses"
        style={{ background: "#203647", padding: "56px 0 120px" }}
      >
        <div className="container">
          {/* Error State */}
          {error && (
            <AnimatedSection>
              <div
                style={{
                  padding: "32px",
                  background: "rgba(255, 79, 79, 0.1)",
                  border: "1px solid rgba(255, 79, 79, 0.2)",
                  borderRadius: "8px",
                  textAlign: "center",
                  marginBottom: "40px",
                }}
              >
                <p style={{ color: "rgba(255, 79, 79, 0.8)", margin: 0 }}>
                  Error loading courses: {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    marginTop: "12px",
                    padding: "8px 20px",
                    background: "transparent",
                    border: "1px solid rgba(255,79,79,0.4)",
                    borderRadius: "6px",
                    color: "rgba(255,79,79,0.8)",
                    fontSize: "12px",
                    cursor: "pointer",
                    letterSpacing: "0.06em",
                  }}
                >
                  Retry
                </button>
              </div>
            </AnimatedSection>
          )}

          {/* Filter row */}
          {!loading && courses.length > 0 && (
            <AnimatedSection>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "16px",
                  marginBottom: "40px",
                }}
              >
                {/* Sort buttons */}
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <label
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    Sort by:
                  </label>
                  {sortOptions.map((opt: SortOption) => (
                    <button
                      key={opt.value}
                      onClick={() => setActiveSort(opt.value)}
                      style={{
                        padding: "7px 16px",
                        fontSize: "12px",
                        letterSpacing: "0.06em",
                        background:
                          activeSort === opt.value ? "#6FB3C8" : "transparent",
                        border: `1px solid ${
                          activeSort === opt.value
                            ? "rgba(201,168,76,0.35)"
                            : "#6FB3C8"
                        }`,
                        borderRadius: "100px",
                        color: activeSort === opt.value ? "#fff" : "#fff",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Level filter */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {levels.map((lvl: string) => (
                    <button
                      key={lvl}
                      onClick={() => setActiveLevel(lvl)}
                      style={{
                        padding: "7px 14px",
                        fontSize: "11px",
                        letterSpacing: "0.06em",
                        background: activeLevel === lvl ? "#6FB3C8" : "#203647",
                        border: `1px solid ${
                          activeLevel === lvl ? "#6FB3C8" : "#6FB3C8"
                        }`,
                        borderRadius: "100px",
                        color: activeLevel === lvl ? "#fff" : "#Fff",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* Loading State */}
          {loading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "20px",
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <CourseSkeleton key={i} />
              ))}
            </div>
          ) : rest.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "20px",
              }}
            >
              {rest.map((c: NormalizedCourse, i: number) => (
                <CourseCard key={c.id} c={c} i={i} />
              ))}
            </div>
          ) : !error ? (
            <AnimatedSection>
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)" }}>
                  No courses found matching your filters.
                </p>
                <button
                  onClick={() => {
                    setActiveLevel("All Levels");
                    setActiveSort("newest");
                  }}
                  style={{
                    marginTop: "16px",
                    padding: "10px 24px",
                    background: "transparent",
                    border: "1px solid rgba(201,168,76,0.3)",
                    borderRadius: "6px",
                    color: "var(--gold)",
                    fontSize: "12px",
                    cursor: "pointer",
                    letterSpacing: "0.06em",
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </AnimatedSection>
          ) : null}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      {!loading && (
        <section
          style={{
            background: "#fff",
            borderTop: "1px solid rgba(255,255,255,0.04)",
            padding: "100px 0",
            textAlign: "center",
          }}
        >
          <div className="container">
            <AnimatedSection>
              <div style={{ maxWidth: "580px", margin: "0 auto" }}>
                <div
                  style={{
                    width: "48px",
                    height: "1px",
                    background: "var(--gold)",
                    margin: "0 auto 32px",
                  }}
                />
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(30px, 3.5vw, 48px)",
                    color: "#000",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.1,
                    margin: "0 0 20px",
                  }}
                >
                  Teach what you know.
                </h2>
                <p
                  style={{
                    fontSize: "16px",
                    color: "#0009",
                    lineHeight: 1.7,
                    marginBottom: "36px",
                  }}
                >
                  Are you a published author, working designer, or industry
                  professional? Apply to teach on the platform and reach
                  thousands of ambitious creators.
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Link
                    href="/teach"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "14px 32px",
                      background: "#6FB3C8",
                      color: "#fff",
                      borderRadius: "6px",
                      fontWeight: 700,
                      fontSize: "13px",
                      letterSpacing: "0.08em",
                      textDecoration: "none",
                      textTransform: "uppercase",
                    }}
                  >
                    Apply to Teach
                  </Link>
                  <Link
                    href="/success-stories"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "14px 32px",
                      border: "1px solid #6FB3C8",
                      borderRadius: "6px",
                      color: "#000",
                      fontSize: "13px",
                      letterSpacing: "0.08em",
                      textDecoration: "none",
                      textTransform: "uppercase",
                    }}
                  >
                    Read Success Stories
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      <Footer />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 40px);
        }
      `}</style>
    </>
  );
}
