"use client";

import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  fetchMappedTestimonials,
  type ApiTestimonialCategory,
  type MappedTestimonial,
} from "@/lib/api/testimonial";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// ─── Stars ────────────────────────────────────────────────────────────────────

function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: "3px", marginBottom: "20px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M7 1L8.545 4.955L12.5 5.18L9.5 7.855L10.545 11.75L7 9.5L3.455 11.75L4.5 7.855L1.5 5.18L5.455 4.955L7 1Z"
            fill="#C9A84C"
          />
        </svg>
      ))}
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({
  url,
  initials,
  color,
  bg,
  size = 44,
}: {
  url: string | null;
  initials: string;
  color: string;
  bg: string;
  size?: number;
}) {
  const [imgError, setImgError] = useState(false);
  const showImg = url && !imgError;

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: showImg ? "transparent" : bg,
        border: `1px solid ${color}33`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
        fontSize: `${Math.round(size * 0.3)}px`,
        fontWeight: 700,
        color,
        letterSpacing: "0.04em",
      }}
    >
      {showImg ? (
        <Image
          src={url}
          alt={initials}
          width={size}
          height={size}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
          onError={() => setImgError(true)}
        />
      ) : (
        initials
      )}
    </div>
  );
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

function FeaturedSkeleton() {
  return (
    <div
      style={{
        background: "#203647",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "16px",
        padding: "clamp(32px, 4vw, 56px)",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          width: "100px",
          height: "10px",
          borderRadius: "3px",
          background: "rgba(255,255,255,0.06)",
          marginBottom: "20px",
          animation: "shimmer 1.5s ease-in-out infinite",
        }}
      />
      <div style={{ display: "flex", gap: "3px", marginBottom: "20px" }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "2px",
              background: "rgba(201,168,76,0.15)",
              animation: "shimmer 1.5s ease-in-out infinite",
            }}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "32px",
        }}
      >
        {[90, 75, 60].map((w) => (
          <div
            key={w}
            style={{
              height: "20px",
              width: `${w}%`,
              borderRadius: "4px",
              background: "rgba(255,255,255,0.05)",
              animation: "shimmer 1.5s ease-in-out infinite",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            animation: "shimmer 1.5s ease-in-out infinite",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div
            style={{
              width: "120px",
              height: "14px",
              borderRadius: "3px",
              background: "rgba(255,255,255,0.06)",
              animation: "shimmer 1.5s ease-in-out infinite",
            }}
          />
          <div
            style={{
              width: "160px",
              height: "11px",
              borderRadius: "3px",
              background: "rgba(255,255,255,0.04)",
              animation: "shimmer 1.5s ease-in-out infinite 0.1s",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div
      style={{
        background: "#0f0f0f",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px",
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", gap: "3px", marginBottom: "8px" }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "2px",
              background: "rgba(201,168,76,0.1)",
              animation: "shimmer 1.5s ease-in-out infinite",
            }}
          />
        ))}
      </div>
      {[95, 80, 70, 55].map((w) => (
        <div
          key={w}
          style={{
            height: "13px",
            width: `${w}%`,
            borderRadius: "3px",
            background: "rgba(255,255,255,0.05)",
            animation: "shimmer 1.5s ease-in-out infinite",
          }}
        />
      ))}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginTop: "12px",
        }}
      >
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            animation: "shimmer 1.5s ease-in-out infinite",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div
            style={{
              width: "90px",
              height: "12px",
              borderRadius: "3px",
              background: "rgba(255,255,255,0.06)",
              animation: "shimmer 1.5s ease-in-out infinite",
            }}
          />
          <div
            style={{
              width: "110px",
              height: "10px",
              borderRadius: "3px",
              background: "rgba(255,255,255,0.04)",
              animation: "shimmer 1.5s ease-in-out infinite 0.1s",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Featured Card ────────────────────────────────────────────────────────────

function FeaturedCard({ t }: { t: MappedTestimonial }) {
  return (
    <AnimatedSection>
      <div
        style={{
          position: "relative",
          background: "#0f0f0f",
          border: "1px solid rgba(201,168,76,0.2)",
          borderRadius: "16px",
          padding: "clamp(32px, 4vw, 56px)",
          marginBottom: "20px",
          overflow: "hidden",
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
            background: "linear-gradient(90deg, var(--gold), transparent)",
          }}
        />

        {/* Large quote mark */}
        <div
          style={{
            position: "absolute",
            top: "24px",
            right: "40px",
            fontFamily: "var(--font-display)",
            fontSize: "120px",
            lineHeight: 1,
            color: "rgba(201,168,76,0.06)",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          "
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "32px",
            alignItems: "start",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "10px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--gold)",
                marginBottom: "20px",
              }}
            >
              Featured Review
            </div>

            <Stars count={t.rating} />

            <blockquote
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(20px, 2vw, 26px)",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.45,
                letterSpacing: "-0.01em",
                margin: "0 0 32px",
                fontStyle: "italic",
              }}
            >
              "{t.quote}"
            </blockquote>

            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <Avatar
                url={t.avatarUrl}
                initials={t.initials}
                color={t.color}
                bg={t.bg}
                size={44}
              />
              <div>
                <div
                  style={{ fontSize: "15px", fontWeight: 600, color: "#fff" }}
                >
                  {t.name}
                </div>
                <div
                  style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}
                >
                  {t.role} · {t.company}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

// ─── Testimonial Card ─────────────────────────────────────────────────────────

function TestimonialCard({ t, i }: { t: MappedTestimonial; i: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <AnimatedSection delay={i * 0.06}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          background: "#f4f7f6",
          border: `1px solid ${hovered ? t.color + "44" : "rgba(255,255,255,0.06)"}`,
          borderRadius: "12px",
          padding: "32px",
          transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Hover top line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: `linear-gradient(90deg, ${t.color}, transparent)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />

        <Stars count={t.rating} />

        <blockquote
          style={{
            fontSize: "15px",
            lineHeight: 1.75,
            color: "#000",
            margin: "0 0 28px",
            fontStyle: "italic",
            flex: 1,
          }}
        >
          "{t.quote}"
        </blockquote>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Avatar
              url={t.avatarUrl}
              initials={t.initials}
              color={t.color}
              bg={t.bg}
              size={38}
            />
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#000",
                  lineHeight: 1.2,
                }}
              >
                {t.name}
              </div>
              <div style={{ fontSize: "11px", color: "#000" }}>{t.company}</div>
            </div>
          </div>

          <span
            style={{
              fontSize: "10px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "4px 10px",
              background: "#82c3d8",
              border: `1px solid ${t.color}22`,
              borderRadius: "100px",
              color: "#fff",
              whiteSpace: "nowrap",
            }}
          >
            {t.tag}
          </span>
        </div>
      </div>
    </AnimatedSection>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<MappedTestimonial[]>([]);
  const [categories, setCategories] = useState<ApiTestimonialCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const { testimonials: mapped, categories: cats } =
        await fetchMappedTestimonials();
      setTestimonials(mapped);
      setCategories(cats);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load testimonials.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const featured = testimonials.find((t) => t.featured);
  const rest = testimonials.filter((t) => !t.featured);

  const filteredRest =
    activeFilter === "All"
      ? rest
      : rest.filter((t) => t.categoryTitle === activeFilter);

  // Dynamic category labels from API + "All"
  const categoryLabels = ["All", ...categories.map((c) => c.title)];

  // Aggregate stats
  const totalCount = testimonials.length;
  const avgRating = totalCount
    ? (testimonials.reduce((s, t) => s + t.rating, 0) / totalCount).toFixed(2)
    : "—";

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section
        style={{
          paddingTop: "160px",
          paddingBottom: "100px",
          background: "var(--bg)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative glow */}
        <div
          style={{
            position: "absolute",
            top: "-180px",
            left: "-200px",
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
                Testimonials
              </span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(44px, 6.5vw, 88px)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                color: "#000",
                maxWidth: "680px",
                margin: "0 0 24px",
              }}
            >
              Voices from
              <br />
              <span
                style={{
                  color: "#000",
                  WebkitTextStroke: "1px rgba(201,168,76,0.55)",
                }}
              >
                the community.
              </span>
            </h1>

            <p
              style={{
                fontSize: "17px",
                lineHeight: 1.75,
                color: "#000",
                maxWidth: "480px",
                marginBottom: "40px",
              }}
            >
              Authors, designers, and publishers share what it's actually like
              to build their creative practice here.
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
                Join Them →
              </Link>
              <Link
                href="/"
                style={{
                  fontSize: "13px",
                  color: "#000",
                  textDecoration: "none",
                  letterSpacing: "0.04em",
                }}
              >
                ← Back to Home
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "#203647",
          padding: "28px 0",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "clamp(24px, 4vw, 64px)",
              flexWrap: "wrap",
            }}
          >
            {[
              { value: loading ? "—" : avgRating, label: "Average Rating" },
              {
                value: loading ? "—" : `${totalCount}+`,
                label: "Happy Creators",
              },
              { value: "94%", label: "Recommend Us" },
            ].map((item) => (
              <div key={item.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "28px",
                    fontWeight: 700,
                    color: "#ffff",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {item.value}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#ffff",
                    marginTop: "4px",
                  }}
                >
                  {item.label}
                </div>
              </div>
            ))}

            {/* Stars */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <div style={{ display: "flex", gap: "4px" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    width="16"
                    height="16"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M7 1L8.545 4.955L12.5 5.18L9.5 7.855L10.545 11.75L7 9.5L3.455 11.75L4.5 7.855L1.5 5.18L5.455 4.955L7 1Z"
                      fill="#C9A84C"
                    />
                  </svg>
                ))}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#f4f7f6",
                  letterSpacing: "0.08em",
                }}
              >
                From verified reviews
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured ── */}
      <section
        style={{
          background: "#f4f7f6",
          paddingTop: "80px",
          paddingBottom: "0",
        }}
      >
        <div className="container">
          {loading && <FeaturedSkeleton />}
          {!loading && error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "40px 0",
                color: "rgba(255,255,255,0.3)",
                fontSize: "14px",
              }}
            >
              <AlertCircle
                size={16}
                style={{ color: "#C47C5A", flexShrink: 0 }}
              />
              {error}
              <button
                onClick={loadData}
                style={{
                  marginLeft: "12px",
                  padding: "6px 16px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "4px",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "12px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  letterSpacing: "0.06em",
                }}
              >
                Retry
              </button>
            </div>
          )}
          {!loading && !error && featured && <FeaturedCard t={featured} />}
        </div>
      </section>

      {/* ── Filter + Grid ── */}
      <section style={{ background: "#203647", padding: "56px 0 120px" }}>
        <div className="container">
          {/* Filter row */}
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
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(22px, 2vw, 28px)",
                  color: "#fff",
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}
              >
                All reviews
              </h2>

              {/* Category pills — built from API */}
              {!loading && !error && (
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {categoryLabels.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveFilter(cat)}
                      style={{
                        padding: "7px 16px",
                        fontSize: "12px",
                        letterSpacing: "0.06em",
                        background:
                          activeFilter === cat ? "#82c3d8" : "transparent",
                        border: `1px solid ${activeFilter === cat ? "rgba(201,168,76,0.35)" : "#82c3d8"}`,
                        borderRadius: "100px",
                        color: activeFilter === cat ? "var(--gold)" : "#fff",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </AnimatedSection>

          {/* Skeleton grid */}
          {loading && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <CardSkeleton key={n} />
              ))}
            </div>
          )}

          {/* Empty filtered state */}
          {!loading && !error && filteredRest.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 0",
                color: "rgba(255,255,255,0.2)",
                fontSize: "14px",
              }}
            >
              No reviews found for this category.
            </div>
          )}

          {/* Cards grid */}
          {!loading && !error && filteredRest.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {filteredRest.map((t, i) => (
                <TestimonialCard key={t.id} t={t} i={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
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
            <div style={{ maxWidth: "560px", margin: "0 auto" }}>
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
                Ready to add your voice?
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  color: "#000",
                  lineHeight: 1.7,
                  marginBottom: "36px",
                }}
              >
                Join thousands of creators who already trust this platform with
                their work, their words, and their livelihood.
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
                    letterSpacing: "0.08em",
                    textDecoration: "none",
                    textTransform: "uppercase",
                  }}
                >
                  Get Started Free
                </Link>
                <Link
                  href="/success-stories"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "14px 32px",
                    border: "1px solid rgba(255,255,255,0.12)",
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

      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1;   }
        }
      `}</style>

      <Footer />
    </>
  );
}
