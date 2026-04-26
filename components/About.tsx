"use client";

import AnimatedSection from "@/components/AnimatedSection";
import { fetchAbout, type MappedAbout } from "@/lib/api/about";
import { ArrowRight, Quote } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonQuote() {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid rgba(32,54,71,0.1)",
        borderRadius: "6px",
        padding: "48px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "4px",
          background: "rgba(130,195,216,0.1)",
          marginBottom: "6px",
          animation: "shimmer 1.5s ease-in-out infinite",
        }}
      />
      {[95, 85, 90, 70].map((w, i) => (
        <div
          key={i}
          style={{
            height: "20px",
            width: `${w}%`,
            borderRadius: "3px",
            background: "rgba(255,255,255,0.05)",
            animation: `shimmer 1.5s ease-in-out ${i * 0.08}s infinite`,
          }}
        />
      ))}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginTop: "8px",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "1px",
            background: "rgba(201,168,76,0.2)",
          }}
        />
        <div
          style={{
            width: "100px",
            height: "12px",
            borderRadius: "3px",
            background: "rgba(201,168,76,0.12)",
            animation: "shimmer 1.5s ease-in-out infinite 0.3s",
          }}
        />
      </div>
    </div>
  );
}

function SkeletonBio() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div
        style={{
          width: "80px",
          height: "10px",
          borderRadius: "2px",
          background: "rgba(255,255,255,0.06)",
          animation: "shimmer 1.5s ease-in-out infinite",
        }}
      />
      <div
        style={{
          width: "85%",
          height: "38px",
          borderRadius: "4px",
          background: "rgba(255,255,255,0.07)",
          animation: "shimmer 1.5s ease-in-out infinite 0.05s",
        }}
      />
      <div
        style={{
          width: "70%",
          height: "38px",
          borderRadius: "4px",
          background: "rgba(255,255,255,0.06)",
          animation: "shimmer 1.5s ease-in-out infinite 0.1s",
        }}
      />
      {[100, 90, 95, 80].map((w, i) => (
        <div
          key={i}
          style={{
            height: "14px",
            width: `${w}%`,
            borderRadius: "3px",
            background: "rgba(255,255,255,0.04)",
            animation: `shimmer 1.5s ease-in-out ${i * 0.07 + 0.15}s infinite`,
          }}
        />
      ))}
      <div
        style={{
          width: "140px",
          height: "44px",
          borderRadius: "4px",
          background: "rgba(255,255,255,0.06)",
          marginTop: "8px",
          animation: "shimmer 1.5s ease-in-out infinite 0.4s",
        }}
      />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function About() {
  const [about, setAbout] = useState<MappedAbout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAbout()
      .then(setAbout)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load."),
      )
      .finally(() => setLoading(false));
  }, []);

  // Fallback copy shown if API fields are empty
  const FALLBACK_QUOTE =
    "Great leadership isn't about power — it's about the courage to remain fully yourself while serving others fully.";
  const FALLBACK_DESC =
    "With over 18 years transforming executives and organizations across 47 countries, she brings a rare combination of intellectual rigor and practical wisdom to every engagement.";

  const displayQuote = about?.quote || FALLBACK_QUOTE;
  const displayName = about?.name || "Alexandra Voss";
  const displayTitle = about?.aboutTitle || "A Life Devoted to Human Potential";

  // Strip HTML tags from description for a plain-text homepage teaser
  const plainDesc = about?.description
    ? about.description
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    : FALLBACK_DESC;

  // Cap at ~220 chars
  const excerpt =
    plainDesc.length > 220
      ? plainDesc.slice(0, 220).trimEnd() + "…"
      : plainDesc;

  return (
    <>
      {/* ── ABOUT STRIP ── */}
      <section className="section" style={{ background: "var(--bg)" }}>
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "center",
          }}
        >
          {/* ── Left: quote card ── */}
          <AnimatedSection direction="left">
            {loading ? (
              <SkeletonQuote />
            ) : (
              <div
                style={{
                  background: "#203647",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "6px",
                  padding: "48px",
                  position: "relative",
                }}
              >
                <Quote
                  size={40}
                  style={{
                    color: "#f4f7f6",
                    color: "#f4f7f6",
                    marginBottom: "20px",
                  }}
                />

                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "24px",
                    lineHeight: 1.5,
                    color: "#f4f7f6",
                    fontStyle: "italic",
                    margin: 0,
                  }}
                >
                  &ldquo;{displayQuote}&rdquo;
                </p>

                <div
                  style={{
                    marginTop: "24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "1px",
                      background: "#82c3d8",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "13px",
                      color: "#82c3d8",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {displayName}
                  </span>
                </div>

                {/* Bottom accent */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "-1px",
                    left: "48px",
                    right: "48px",
                    height: "2px",
                    background: "linear-gradient(90deg, #82c3d8, transparent)",
                  }}
                />
              </div>
            )}
          </AnimatedSection>

          {/* ── Right: bio teaser ── */}
          <AnimatedSection direction="right" delay={0.15}>
            {loading ? (
              <SkeletonBio />
            ) : (
              <>
                <div className="section-label">
                  About {displayName.split(" ")[0]}
                </div>

                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(38px, 4vw, 52px)",
                    color: "var(--text)",
                    marginTop: "4px",
                    lineHeight: 1.1,
                  }}
                >
                  {displayTitle}
                </h2>

                <p
                  style={{
                    fontSize: "15px",
                    color: "var(--text-muted)",
                    lineHeight: 1.8,
                    marginTop: "20px",
                  }}
                >
                  {excerpt}
                </p>

                {/* Silent error note — doesn't break layout */}
                {error && !about && (
                  <p
                    style={{
                      fontSize: "11px",
                      color: "rgba(32,54,71,0.4)",
                      marginTop: "6px",
                    }}
                  >
                    Could not reach server — showing cached content.
                  </p>
                )}

                <Link
                  href="/about"
                  className="btn-outline"
                  style={{
                    marginTop: "32px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  Full Biography <ArrowRight size={14} />
                </Link>
              </>
            )}
          </AnimatedSection>
        </div>

        <style>{`
          @media (max-width: 768px) {
            section > .container { grid-template-columns: 1fr !important; }
          }
          @keyframes shimmer {
            0%, 100% { opacity: 0.5; }
            50%       { opacity: 1;   }
          }
        `}</style>
      </section>
    </>
  );
}
