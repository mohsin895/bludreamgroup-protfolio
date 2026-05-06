"use client";
import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import PageHero from "@/components/HeroPage";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ─── Types ─────────────────────────────────────────────────── */
interface Story {
  id: number;
  type: string;
  name: string;
  title: string;
  excerpt: string;
  metric: string;
  category: string;
  avatar: string;
  color: string;
  bg: string;
  tag: string;
  year: string;
  sort_order?: number;
  status?: string;
}

/* ─── Stats (static) ────────────────────────────────────────── */
const stats = [
  { value: "12,400+", label: "Creators Launched" },
  { value: "$18M+", label: "Creator Revenue Generated" },
  { value: "2.1M+", label: "Books Sold" },
  { value: "94%", label: "Would Recommend" },
];

const FILTER_OPTIONS = ["All", "Authors", "Designers", "Publishers"];

/* ─── Counter Hook ──────────────────────────────────────────── */
function useCountUp(target: string, duration = 1800) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const numericPart = parseFloat(target.replace(/[^0-9.]/g, ""));
          const prefix = target.replace(/[0-9.,+%$M]+.*/, "");
          const suffix = target.replace(/^[^0-9]*[0-9.,]+/, "");
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const cur = (numericPart * eased).toFixed(
              numericPart % 1 !== 0 ? 1 : 0,
            );
            setDisplay(`${prefix}${parseFloat(cur).toLocaleString()}${suffix}`);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return { ref, display };
}

/* ─── Stat Card ─────────────────────────────────────────────── */
function StatCard({ value, label }: { value: string; label: string }) {
  const { ref, display } = useCountUp(value);
  return (
    <div ref={ref} style={{ textAlign: "center", padding: "0 24px" }}>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(36px, 4vw, 52px)",
          color: "#ffff",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {display}
      </div>
      <div
        style={{
          marginTop: "8px",
          fontSize: "13px",
          color: "#fff",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ─── Story Card ─────────────────────────────────────────────── */
function StoryCard({ s, i }: { s: Story; i: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <AnimatedSection delay={i * 0.07}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          background: "#203647",
          border: `1px solid ${hovered ? s.color + "55" : "rgba(255,255,255,0.06)"}`,
          borderRadius: "12px",
          padding: "36px",
          transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          cursor: "default",
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: `linear-gradient(90deg, ${s.color}, transparent)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.35s ease",
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: s.bg,
              border: `1px solid ${s.color}33`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontSize: "13px",
              fontWeight: 700,
              color: s.color,
              letterSpacing: "0.04em",
              flexShrink: 0,
            }}
          >
            {s.avatar}
          </div>

          {/* Type badge */}
          <span
            style={{
              fontSize: "10px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              padding: "4px 10px",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "100px",
            }}
          >
            {s.type}
          </span>
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: "12px",
            color: s.color,
            letterSpacing: "0.06em",
            marginBottom: "6px",
          }}
        >
          {s.name}
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(18px, 1.5vw, 22px)",
            color: "#fff",
            fontWeight: 700,
            lineHeight: 1.25,
            margin: "0 0 16px",
            letterSpacing: "-0.01em",
          }}
        >
          {s.title}
        </h3>

        {/* Excerpt */}
        <p
          style={{
            fontSize: "14px",
            lineHeight: 1.75,
            color: "rgba(255,255,255,0.5)",
            margin: "0 0 28px",
            flex: 1,
          }}
        >
          {s.excerpt}
        </p>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          {/* Metric pill */}
          <div
            style={{
              padding: "8px 16px",
              background: s.bg,
              border: `1px solid ${s.color}22`,
              borderRadius: "100px",
              fontSize: "12px",
              color: s.color,
              fontWeight: 600,
              letterSpacing: "0.04em",
            }}
          >
            {s.metric}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "10px",
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.08em",
              }}
            >
              {s.category}
            </span>
            <span style={{ color: "rgba(255,255,255,0.12)", fontSize: "10px" }}>
              ·
            </span>
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>
              {s.year}
            </span>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

/* ─── Skeleton Card ─────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div
      style={{
        background: "#203647",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px",
        padding: "36px",
        height: "320px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            width: "80px",
            height: "24px",
            borderRadius: "100px",
            background: "rgba(255,255,255,0.06)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      </div>
      {[100, 80, 60, 90, 70].map((w, i) => (
        <div
          key={i}
          style={{
            width: `${w}%`,
            height: "12px",
            borderRadius: "4px",
            background: "rgba(255,255,255,0.06)",
            animation: `pulse 1.5s ease-in-out infinite ${i * 0.1}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function SuccessStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  /* Fetch stories from API */
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const res = await fetch(`${baseUrl}/success-story`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const json = await res.json();

        if (!json.status) {
          throw new Error(json.message || "API returned an error");
        }

        setStories(json.data ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load stories");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  /* Filter stories by active tab */
  const filteredStories =
    activeFilter === "All"
      ? stories
      : stories.filter(
          (s) => s.type.toLowerCase() === activeFilter.toLowerCase(),
        );

  return (
    <>
      <Navbar />
      <PageHero title="Our Success Story" currentPage="Success" />

      {/* ── Hero ── */}
      <section
        style={{
          paddingTop: "40px",
          paddingBottom: "60px",
          background: "var(--bg)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative radial glow */}
        <div
          style={{
            position: "absolute",
            top: "-200px",
            right: "-300px",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="container">
          <AnimatedSection>
            {/* Label */}
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
                  background: "var(--gold)",
                }}
              />
              <span
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                }}
              >
                Success Stories
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(48px, 7vw, 96px)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                color: "#000",
                maxWidth: "700px",
                margin: "0 0 24px",
              }}
            >
              Real Creators.
              <br />
              <span
                style={{
                  color: "#000",
                  WebkitTextStroke: "1px rgba(201,168,76,0.6)",
                }}
              >
                Real Results.
              </span>
            </h1>

            <p
              style={{
                fontSize: "17px",
                lineHeight: 1.75,
                color: "#000",
                maxWidth: "500px",
                marginBottom: "40px",
              }}
            >
              Authors, designers, publishers and photographers who turned their
              work into income — using the same tools available to you today.
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/get-started"
                className="btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "14px 28px",
                  background: "var(--gold)",
                  color: "#0a0a0a",
                  borderRadius: "6px",
                  fontWeight: 700,
                  fontSize: "13px",
                  letterSpacing: "0.06em",
                  textDecoration: "none",
                  textTransform: "uppercase",
                }}
              >
                Start Your Story →
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "#203647",
          padding: "56px 0",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "40px",
            }}
          >
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Filter Row ── */}
      <section
        style={{
          background: "#203647",
          paddingTop: "72px",
          paddingBottom: "0",
        }}
      >
        <div className="container">
          <AnimatedSection>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px",
                paddingTop: "10px",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(26px, 2.5vw, 34px)",
                  color: "#fff",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  margin: "0 0 60px 0",
                }}
              >
                {loading
                  ? "Loading stories…"
                  : `${filteredStories.length} ${activeFilter === "All" ? "stories" : activeFilter.toLowerCase()} & counting`}
              </h2>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {FILTER_OPTIONS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    style={{
                      padding: "7px 16px",
                      fontSize: "12px",
                      letterSpacing: "0.06em",
                      background:
                        f === activeFilter
                          ? "rgba(255,255,255,0.12)"
                          : "transparent",
                      border: `1px solid ${f === activeFilter ? "#fff" : "rgba(255,255,255,0.2)"}`,
                      borderRadius: "100px",
                      color: "#fff",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Cards Grid ── */}
      <section style={{ background: "#203647", padding: "0 0 120px" }}>
        <div className="container">
          {/* Error state */}
          {error && !loading && (
            <div
              style={{
                padding: "48px 0",
                textAlign: "center",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              <p style={{ marginBottom: "16px" }}>
                Could not load stories — {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: "8px 20px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "6px",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Try again
              </button>
            </div>
          )}

          {/* Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "20px",
            }}
          >
            {/* Loading skeletons */}
            {loading &&
              Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}

            {/* Populated cards */}
            {!loading &&
              !error &&
              filteredStories.map((s, i) => (
                <StoryCard key={s.id} s={s} i={i} />
              ))}

            {/* Empty state */}
            {!loading && !error && filteredStories.length === 0 && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  padding: "80px 0",
                  textAlign: "center",
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "15px",
                }}
              >
                No stories found for &ldquo;{activeFilter}&rdquo;.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section
        style={{
          background: "#f4f7f6",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          padding: "100px 0",
          textAlign: "center",
        }}
      >
        <div className="container">
          <AnimatedSection>
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
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
                  fontSize: "clamp(32px, 4vw, 52px)",
                  color: "#000",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                  margin: "0 0 20px",
                }}
              >
                Your story belongs here.
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  color: "#000",
                  lineHeight: 1.7,
                  marginBottom: "36px",
                }}
              >
                Join thousands of creators who publish, sell, and build
                remarkable careers — all from one platform.
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
                  href="/get-started"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "14px 32px",
                    background: "var(--gold)",
                    color: "#0a0a0a",
                    borderRadius: "6px",
                    fontWeight: 700,
                    fontSize: "13px",
                    border: "1px solid #000",
                    letterSpacing: "0.08em",
                    textDecoration: "none",
                    textTransform: "uppercase",
                  }}
                >
                  Get Started Free
                </Link>
                <Link
                  href="/portfolio"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "14px 32px",
                    border: "1px solid #000",
                    borderRadius: "6px",
                    color: "#000",
                    fontSize: "13px",
                    letterSpacing: "0.08em",
                    textDecoration: "none",
                    textTransform: "uppercase",
                  }}
                >
                  See Portfolio Examples
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </>
  );
}
