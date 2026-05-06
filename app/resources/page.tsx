"use client";
import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import PageHero from "@/components/HeroPage";
import Navbar from "@/components/Navbar";
import {
  getAllResources,
  typeStyle,
  type Resource,
} from "@/lib/api/resourceapi";
import { useEffect, useState } from "react";

const CATEGORIES = [
  "All",
  "Guide",
  "Template",
  "Checklist",
  "Worksheet",
  "Video",
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// FEATURED RESOURCE
// ─────────────────────────────────────────────────────────────────────────────
function FeaturedResource({ resource }: { resource: Resource }) {
  const ts = typeStyle(resource.type);
  const color = resource.color ?? ts.color;

  return (
    <AnimatedSection>
      <div
        style={{
          position: "relative",
          background: "#203647",
          border: `1px solid ${color}33`,
          borderRadius: "16px",
          padding: "clamp(32px,4vw,56px)",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "40px",
          alignItems: "center",
          paddingBottom: "30px",
        }}
        className="featured-card"
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: `linear-gradient(90deg, ${color}, transparent)`,
          }}
        />

        {/* Left content */}
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
                color: color,
              }}
            >
              Featured Resource
            </span>
            <span
              style={{
                width: "3px",
                height: "3px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              {resource.type}
            </span>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(22px,2.8vw,34px)",
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              margin: "0 0 16px",
            }}
          >
            {resource.title}
          </h2>

          {resource.description && (
            <p
              style={{
                fontSize: "15px",
                lineHeight: 1.75,
                color: "#fff9",
                maxWidth: "560px",
                marginBottom: "28px",
              }}
            >
              {resource.description}
            </p>
          )}

          {/* Meta */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
              marginBottom: "32px",
            }}
          >
            {[resource.read_time, resource.pages, resource.format]
              .filter(Boolean)
              .map((m) => (
                <span
                  key={m}
                  style={{
                    fontSize: "12px",
                    color: "#fff7",
                    letterSpacing: "0.04em",
                  }}
                >
                  {m}
                </span>
              ))}
          </div>

          <a
            href={resource.href ?? "#"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "13px 28px",
              background: "#82c3d8",
              color: "#fff",
              borderRadius: "6px",
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "0.06em",
              textDecoration: "none",
              textTransform: "uppercase" as const,
            }}
          >
            {resource.type === "Video" ? "Watch Free →" : "Download Free →"}
          </a>
        </div>

        {/* Right: tags */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            minWidth: "130px",
          }}
        >
          {(resource.tags ?? []).map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 10px",
                background: "#82c3d8",
                border: "1px solid #fff",
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

      <style>{`
        @media(max-width: 640px) {
          .featured-card {
            grid-template-columns: 1fr !important;
          }
          .featured-card > div:last-child {
            flex-direction: row !important;
            flex-wrap: wrap;
          }
        }
      `}</style>
    </AnimatedSection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESOURCE CARD
// ─────────────────────────────────────────────────────────────────────────────
function ResourceCard({ r, i }: { r: Resource; i: number }) {
  const [hovered, setHovered] = useState(false);
  const ts = typeStyle(r.type);
  const color = r.color ?? ts.color;
  const bg = r.bg ?? ts.bg;
  const icon = r.icon ?? ts.icon;

  return (
    <AnimatedSection delay={i * 0.07}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          background: hovered ? "#141414" : "#0f0f0f",
          border: `1px solid ${hovered ? color + "44" : "rgba(255,255,255,0.06)"}`,
          borderRadius: "12px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          transition: "all 0.32s cubic-bezier(0.16,1,0.3,1)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            height: "3px",
            background: `linear-gradient(90deg, ${color}, transparent)`,
            opacity: hovered ? 1 : 0.35,
            transition: "opacity 0.3s ease",
          }}
        />

        <div
          style={{
            padding: "28px 28px 0",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Icon + type badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "18px",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: bg,
                border: `1px solid ${color}33`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                color: color,
              }}
            >
              {icon}
            </div>
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "4px 12px",
                background: bg,
                borderRadius: "100px",
                color: color,
              }}
            >
              {r.type}
            </span>
          </div>

          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(16px, 1.3vw, 19px)",
              color: "#fff",
              letterSpacing: "-0.01em",
              lineHeight: 1.25,
              margin: "0 0 10px",
            }}
          >
            {r.title}
          </h3>

          <p
            style={{
              fontSize: "13px",
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.45)",
              margin: "0 0 20px",
              flex: 1,
            }}
          >
            {r.description}
          </p>

          {/* Tags */}
          {(r.tags ?? []).length > 0 && (
            <div
              style={{
                display: "flex",
                gap: "6px",
                flexWrap: "wrap",
                marginBottom: "20px",
              }}
            >
              {(r.tags ?? []).map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.06em",
                    padding: "3px 8px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "4px",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
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
            padding: "16px 28px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.04em",
            }}
          >
            {[r.read_time, r.format].filter(Boolean).join(" · ")}
          </span>
          <a
            href={r.href ?? "#"}
            style={{
              padding: "8px 16px",
              background: hovered ? bg : "transparent",
              border: `1px solid ${hovered ? color + "55" : "rgba(255,255,255,0.08)"}`,
              borderRadius: "5px",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              color: hovered ? color : "rgba(255,255,255,0.35)",
              textDecoration: "none",
              transition: "all 0.25s ease",
              whiteSpace: "nowrap" as const,
            }}
          >
            {r.type === "Video" ? "Watch →" : "Download →"}
          </a>
        </div>
      </div>
    </AnimatedSection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div
      style={{
        background: "#0f0f0f",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: "12px",
        overflow: "hidden",
        opacity: 0.4,
      }}
    >
      <div style={{ height: "3px", background: "#222" }} />
      <div
        style={{
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            background: "#1a1a1a",
          }}
        />
        <div
          style={{
            height: "18px",
            width: "75%",
            background: "#1a1a1a",
            borderRadius: "4px",
          }}
        />
        <div
          style={{
            height: "60px",
            width: "100%",
            background: "#161616",
            borderRadius: "4px",
          }}
        />
        <div style={{ display: "flex", gap: "6px" }}>
          {[60, 50, 40].map((w) => (
            <div
              key={w}
              style={{
                height: "18px",
                width: `${w}px`,
                background: "#161616",
                borderRadius: "4px",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ResourcesPage() {
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [featured, setFeatured] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<string>("All");

  useEffect(() => {
    getAllResources().then((data) => {
      const feat = data.find((r) => r.is_featured) ?? data[0] ?? null;
      setFeatured(feat);
      setAllResources(data);
      setLoading(false);
    });
  }, []);

  // grid = all non-featured, filtered by type
  const gridResources = allResources
    .filter((r) => !featured || r.id !== featured.id)
    .filter((r) => activeType === "All" || r.type === activeType);

  return (
    <>
      <Navbar />
      <PageHero title="Resources" currentPage="Resources" />
      {/* ── HERO ── */}
      <section
        style={{
          paddingTop: "10px",
          paddingBottom: "40px",
          background: "var(--bg)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-200px",
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
                Resources
              </span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(44px,6.5vw,88px)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                color: "#000",
                maxWidth: "700px",
                margin: "0 0 24px",
              }}
            >
              Tools to
              <br />
              <span
                style={{
                  color: "#0009",
                  WebkitTextStroke: "1px rgba(201,168,76,0.55)",
                }}
              >
                do the work.
              </span>
            </h1>

            <p
              style={{
                fontSize: "17px",
                lineHeight: 1.75,
                color: "#0009",
                maxWidth: "480px",
                marginBottom: "40px",
              }}
            >
              Free guides, templates, checklists, and worksheets built for
              authors, designers, and publishers — no fluff, only what works.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ── STATS BAR ── */}
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
              gap: "clamp(24px,5vw,72px)",
              flexWrap: "wrap",
            }}
          >
            {[
              {
                value: loading ? "…" : String(allResources.length),
                label: "Free Resources",
              },
              { value: "40,000+", label: "Downloads" },
              { value: "5 Formats", label: "PDF, Video, Sheets & More" },
              { value: "Always Free", label: "No Email Required" },
            ].map((s) => (
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
                    letterSpacing: "0.08em",
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

      {/* ── FEATURED ── */}
      <section
        style={{
          background: "#203647",
          paddingTop: "80px",
          paddingBottom: "0",
        }}
      >
        <div className="container">
          {loading ? (
            <div
              style={{
                background: "#0f0f0f",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "16px",
                height: "220px",
                opacity: 0.4,
              }}
            />
          ) : featured ? (
            <FeaturedResource resource={featured} />
          ) : null}
        </div>
      </section>

      {/* ── GRID ── */}
      <section
        id="resources"
        style={{ background: "#203647", padding: "56px 0 120px" }}
      >
        <div className="container">
          {/* Filter bar */}
          <AnimatedSection>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(20px,2vw,26px)",
                  color: "#fff",
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}
              >
                All resources
                {!loading && (
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#fff9",
                      fontFamily: "inherit",
                      fontWeight: 400,
                      marginLeft: "12px",
                    }}
                  >
                    ({gridResources.length})
                  </span>
                )}
              </h2>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveType(cat)}
                    style={{
                      padding: "7px 16px",
                      fontSize: "12px",
                      letterSpacing: "0.06em",
                      background:
                        activeType === cat ? "#82c3d8" : "transparent",
                      border: `1px solid ${activeType === cat ? "rgba(201,168,76,0.35)" : "#82c3d8"}`,
                      borderRadius: "100px",
                      color: activeType === cat ? "#fff" : "#fff9",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Cards */}
          {loading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
                gap: "20px",
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : gridResources.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 20px",
                color: "rgba(255,255,255,0.2)",
              }}
            >
              <p style={{ fontSize: "16px" }}>
                No resources found for &quot;{activeType}&quot;
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
                gap: "20px",
              }}
            >
              {gridResources.map((r, i) => (
                <ResourceCard key={r.id} r={r} i={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── NEWSLETTER CTA ── */}
      <section
        style={{
          background: "#f4f7f6",
          borderTop: "1px solid #0009",
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
                  fontSize: "clamp(28px,3.5vw,44px)",
                  color: "#000",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                  margin: "0 0 20px",
                }}
              >
                New resources, monthly.
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  color: "#0009",
                  lineHeight: 1.7,
                  marginBottom: "36px",
                }}
              >
                We publish new guides, templates, and tools every month.
                Subscribe and we'll send them straight to your inbox — no noise,
                no upsells.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "0",
                  maxWidth: "420px",
                  margin: "0 auto",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid #82c3d8",
                }}
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  style={{
                    flex: 1,
                    padding: "14px 18px",
                    background: "rgba(255,255,255,0.03)",
                    border: "none",
                    color: "#0009",
                    fontSize: "14px",
                    outline: "none",
                    minWidth: 0,
                  }}
                />
                <button
                  style={{
                    padding: "14px 22px",
                    background: "#82c3d8",
                    color: "#fff",
                    border: "none",
                    fontWeight: 700,
                    fontSize: "12px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase" as const,
                    cursor: "pointer",
                    whiteSpace: "nowrap" as const,
                    flexShrink: 0,
                  }}
                >
                  Subscribe
                </button>
              </div>
              <p
                style={{
                  fontSize: "11px",
                  color: "#0009",
                  marginTop: "14px",
                  letterSpacing: "0.04em",
                }}
              >
                No spam. Unsubscribe any time.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </>
  );
}
