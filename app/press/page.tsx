"use client";
import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import PageHero from "@/components/HeroPage";
import Navbar from "@/components/Navbar";
import { Download, ExternalLink, Quote, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type PressType = "review" | "feature" | "interview" | "mention";

/** Shape returned by the Laravel API */
interface PressItemRaw {
  id: number;
  type: PressType;
  publication: string;
  publication_initials: string;
  accent_color: string;
  author: string;
  title: string;
  pull_quote: string;
  published_date: string; // "YYYY-MM-DD"
  url: string | null;
  is_featured: 0 | 1;
  stars: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

/** Normalised shape used throughout the component */
interface PressItem {
  id: number;
  type: PressType;
  publication: string;
  publicationInitials: string;
  accentColor: string;
  author: string;
  title: string;
  pullQuote: string;
  date: string; // e.g. "April 21, 2026"
  month: string; // e.g. "APR"
  year: string; // e.g. "2026"
  url: string | null;
  isFeatured: boolean;
  stars: number | null;
}

// ─── Helper: normalise a raw API item ────────────────────────────────────────

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MONTH_ABBR = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

function normalise(raw: PressItemRaw): PressItem {
  const d = new Date(raw.published_date);
  const m = d.getUTCMonth();
  const y = d.getUTCFullYear();
  const day = d.getUTCDate();

  return {
    id: raw.id,
    type: raw.type,
    publication: raw.publication,
    publicationInitials: raw.publication_initials,
    accentColor: raw.accent_color,
    author: raw.author,
    title: raw.title,
    pullQuote: raw.pull_quote,
    date: `${MONTH_NAMES[m]} ${day}, ${y}`,
    month: MONTH_ABBR[m],
    year: String(y),
    url: raw.url || null,
    isFeatured: raw.is_featured === 1,
    stars: raw.stars,
  };
}

// ─── Static data ──────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<PressType, string> = {
  review: "Review",
  feature: "Feature",
  interview: "Interview",
  mention: "Mention",
};

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Reviews", value: "review" },
  { label: "Features", value: "feature" },
  { label: "Interviews", value: "interview" },
  { label: "Mentions", value: "mention" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StarRow({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={11}
          fill={i < count ? "#C9A84C" : "transparent"}
          style={{ color: i < count ? "#C9A84C" : "rgba(255,255,255,0.2)" }}
        />
      ))}
    </div>
  );
}

function PublicationBadge({
  initials,
  color,
}: {
  initials: string;
  color: string;
}) {
  return (
    <div
      style={{
        width: "48px",
        height: "48px",
        borderRadius: "8px",
        background: `${color}12`,
        border: `1px solid ${color}28`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.06em",
        color: color,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

function PressCard({ item, delay }: { item: PressItem; delay: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <AnimatedSection delay={delay}>
      <div
        className="card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: "0",
          overflow: "hidden",
          background: "#203647",
          color: "#fff",
          transition: "transform 0.25s ease, border-color 0.25s ease",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          borderColor: hovered
            ? `${item.accentColor}30`
            : "rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            height: "2px",
            background: `linear-gradient(90deg, ${item.accentColor}70, transparent)`,
          }}
        />

        <div
          style={{
            padding: "28px",
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
              marginBottom: "20px",
            }}
          >
            <PublicationBadge
              initials={item.publicationInitials}
              color={item.accentColor}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexWrap: "wrap",
                  marginBottom: "4px",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: item.accentColor,
                    background: `${item.accentColor}10`,
                    border: `1px solid ${item.accentColor}22`,
                    padding: "3px 8px",
                    borderRadius: "3px",
                  }}
                >
                  {TYPE_LABELS[item.type]}
                </span>
                {item.stars != null && <StarRow count={item.stars} />}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#fff",
                  lineHeight: 1.3,
                }}
              >
                {item.publication}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.28)",
                  marginTop: "2px",
                }}
              >
                {item.author} · {item.date}
              </div>
            </div>
          </div>

          {/* Title */}
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: 1.45,
              margin: "0 0 16px",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {item.title}
          </h3>

          {/* Pull quote */}
          <div
            style={{
              flex: 1,
              borderLeft: `2px solid ${item.accentColor}40`,
              paddingLeft: "14px",
              marginBottom: "20px",
            }}
          >
            <Quote
              size={14}
              style={{
                color: item.accentColor,
                opacity: 0.5,
                marginBottom: "6px",
                display: "block",
              }}
            />
            <p
              style={{
                fontSize: "13px",
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.7)",
                margin: 0,
                fontStyle: "italic",
              }}
            >
              {item.pullQuote}
            </p>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "16px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "0.06em",
              }}
            >
              {item.month} {item.year}
            </span>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "11px",
                  color: hovered ? item.accentColor : "#fff7",
                  textDecoration: "none",
                  letterSpacing: "0.06em",
                  transition: "color 0.2s ease",
                }}
              >
                Read Full Article
                <ExternalLink size={11} style={{ color: "#C9A84C" }} />
              </a>
            )}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

function SkeletonCard() {
  return (
    <div
      style={{
        background: "#203647",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px",
        padding: "28px",
        height: "300px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      <div style={{ display: "flex", gap: "14px" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.06)",
            animation: "pulse 1.5s ease-in-out infinite",
            flexShrink: 0,
          }}
        />
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
              width: "60%",
              height: "12px",
              borderRadius: "4px",
              background: "rgba(255,255,255,0.06)",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
          <div
            style={{
              width: "40%",
              height: "10px",
              borderRadius: "4px",
              background: "rgba(255,255,255,0.04)",
              animation: "pulse 1.5s ease-in-out infinite 0.1s",
            }}
          />
        </div>
      </div>
      {[90, 75, 85, 60].map((w, i) => (
        <div
          key={i}
          style={{
            width: `${w}%`,
            height: "11px",
            borderRadius: "4px",
            background: "rgba(255,255,255,0.05)",
            animation: `pulse 1.5s ease-in-out infinite ${i * 0.1}s`,
          }}
        />
      ))}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PressPage() {
  const [items, setItems] = useState<PressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");

  /* Fetch from API */
  useEffect(() => {
    const fetchPress = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const res = await fetch(`${baseUrl}/press`, { cache: "no-store" });

        if (!res.ok)
          throw new Error(`Request failed with status ${res.status}`);

        const json = await res.json();
        if (!json.status)
          throw new Error(json.message || "API returned an error");

        setItems((json.data as PressItemRaw[]).map(normalise));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load press items",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPress();
  }, []);

  /* Derived values */
  const featured = items.find((p) => p.isFeatured);

  const filtered =
    activeFilter === "all"
      ? items
      : items.filter((p) => p.type === activeFilter);

  const counts: Record<string, number> = { all: items.length };
  items.forEach((p) => {
    counts[p.type] = (counts[p.type] ?? 0) + 1;
  });

  const uniquePublications = new Set(items.map((p) => p.publication)).size;
  const starredCount = items.filter((p) => p.stars === 5).length;

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <PageHero title="Press" currentPage="Media" />
      <section
        style={{
          paddingTop: "40px",
          paddingBottom: "60px",
          background: "var(--bg, #0a0a0a)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="container">
          <AnimatedSection>
            <div className="section-label">Press</div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(48px, 6vw, 80px)",
                marginTop: "8px",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
              }}
            >
              Critical Coverage
              <br />
              <span style={{ color: "var(--gold, #C9A84C)" }}>& Reviews</span>
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
              Reviews, features, and interviews from major publications. For
              press inquiries and kit downloads, see below.
            </p>

            {/* Stats — hide while loading */}
            {!loading && !error && (
              <div
                style={{
                  display: "flex",
                  gap: "40px",
                  marginTop: "40px",
                  flexWrap: "wrap",
                }}
              >
                {[
                  { label: "Press Pieces", value: items.length },
                  { label: "Starred Reviews", value: starredCount },
                  { label: "Publications", value: uniquePublications },
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
            )}
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
          {/* Error state */}
          {error && !loading && (
            <div
              style={{
                padding: "64px 0",
                textAlign: "center",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              <p style={{ marginBottom: "16px" }}>
                Could not load press items — {error}
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

          {/* Featured quote hero */}
          {!loading && !error && featured && (
            <AnimatedSection>
              <div
                style={{
                  marginBottom: "72px",
                  padding: "56px 52px",
                  background: "rgba(201,168,76,0.04)",
                  border: "1px solid rgba(201,168,76,0.16)",
                  borderRadius: "12px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: "-20px",
                    right: "40px",
                    fontFamily: "var(--font-display)",
                    fontSize: "240px",
                    lineHeight: 1,
                    color: "rgba(201,168,76,0.06)",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                >
                  "
                </div>
                <div style={{ position: "relative", maxWidth: "680px" }}>
                  <div
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--gold, #C9A84C)",
                      marginBottom: "20px",
                    }}
                  >
                    Editor's Pick · {featured.publication}
                  </div>
                  <blockquote
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(18px, 2.5vw, 26px)",
                      lineHeight: 1.5,
                      letterSpacing: "-0.01em",
                      color: "rgba(255,255,255,0.9)",
                      margin: "0 0 24px",
                      fontStyle: "italic",
                    }}
                  >
                    "{featured.pullQuote}"
                  </blockquote>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "1px",
                        background: "var(--gold, #C9A84C)",
                        opacity: 0.4,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.4)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {featured.author}, <em>{featured.publication}</em> —{" "}
                      {featured.date}
                    </span>
                    {featured.stars != null && (
                      <StarRow count={featured.stars} />
                    )}
                    {featured.url && (
                      <a
                        href={featured.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "11px",
                          color: "var(--gold, #C9A84C)",
                          textDecoration: "none",
                          letterSpacing: "0.06em",
                        }}
                      >
                        Read Review <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* Publication logo strip */}
          {!loading && !error && items.length > 0 && (
            <AnimatedSection delay={0.05}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginBottom: "56px",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#fff",
                    marginRight: "8px",
                    whiteSpace: "nowrap",
                  }}
                >
                  As seen in
                </span>
                {items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: "6px 14px",
                      background: `${item.accentColor}08`,
                      border: `1px solid ${item.accentColor}18`,
                      borderRadius: "4px",
                      fontSize: "11px",
                      letterSpacing: "0.05em",
                      color: "#fff9",
                      whiteSpace: "nowrap",
                      cursor: "default",
                    }}
                  >
                    {item.publication}
                  </div>
                ))}
              </div>
            </AnimatedSection>
          )}

          {/* Filter pills */}
          {!loading && !error && (
            <AnimatedSection delay={0.08}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginBottom: "40px",
                }}
              >
                {FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setActiveFilter(f.value)}
                    style={{
                      padding: "7px 18px",
                      borderRadius: "100px",
                      border: "1px solid",
                      borderColor:
                        activeFilter === f.value ? "#203647" : "#6fb3c8",
                      background:
                        activeFilter === f.value ? "#6fb3c8" : "transparent",
                      color:
                        activeFilter === f.value ? "var(--gold, #fff)" : "#fff",
                      fontSize: "12px",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      fontFamily: "inherit",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {f.label}
                    <span
                      style={{
                        fontSize: "10px",
                        opacity: 0.55,
                        background: "rgba(255,255,255,0.07)",
                        color: "#fff",
                        padding: "1px 6px",
                        borderRadius: "100px",
                      }}
                    >
                      {counts[f.value] ?? 0}
                    </span>
                  </button>
                ))}
              </div>
            </AnimatedSection>
          )}

          {/* Cards grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
              gap: "20px",
            }}
          >
            {/* Loading skeletons */}
            {loading &&
              Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}

            {/* Populated cards */}
            {!loading &&
              !error &&
              filtered.map((item, i) => (
                <PressCard key={item.id} item={item} delay={i * 0.06} />
              ))}

            {/* Empty state */}
            {!loading && !error && filtered.length === 0 && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  padding: "80px 0",
                  textAlign: "center",
                  color: "rgba(255,255,255,0.3)",
                  fontSize: "14px",
                }}
              >
                No press items found for &ldquo;{activeFilter}&rdquo;.
              </div>
            )}
          </div>

          {/* Press Kit + Inquiry CTA */}
          <AnimatedSection delay={0.3}>
            <div
              style={{
                marginTop: "96px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
              {/* Download Kit */}
              <div
                style={{
                  padding: "40px 36px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "8px",
                    background: "rgba(201,168,76,0.1)",
                    border: "1px solid rgba(201,168,76,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                  }}
                >
                  <Download
                    size={18}
                    style={{ color: "var(--gold, #C9A84C)" }}
                  />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "22px",
                    margin: "0 0 10px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Press Kit
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.4)",
                    margin: "0 0 24px",
                  }}
                >
                  Download the full press kit including high-resolution author
                  photos, book cover files, official bio, and previous coverage.
                </p>
                <a
                  href="#"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 20px",
                    background: "rgba(201,168,76,0.08)",
                    border: "1px solid rgba(201,168,76,0.2)",
                    color: "var(--gold, #C9A84C)",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                  }}
                >
                  <Download size={13} />
                  Download Kit (.zip)
                </a>
              </div>

              {/* Contact for press */}
              <div
                style={{
                  padding: "40px 36px",
                  background: "rgba(201,168,76,0.04)",
                  border: "1px solid rgba(201,168,76,0.14)",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "8px",
                    background: "rgba(201,168,76,0.1)",
                    border: "1px solid rgba(201,168,76,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                  }}
                >
                  <Quote size={18} style={{ color: "var(--gold, #C9A84C)" }} />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "22px",
                    margin: "0 0 10px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Press Inquiries
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.4)",
                    margin: "0 0 24px",
                  }}
                >
                  For interview requests, review copies, or media partnerships,
                  reach out directly. Typical response time is one business day.
                </p>
                <Link
                  href="/contact"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 20px",
                    background: "var(--gold, #C9A84C)",
                    color: "#0a0a0a",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                  }}
                >
                  Send Inquiry
                  <ExternalLink size={12} />
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
