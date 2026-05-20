"use client";

import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import PageHero from "@/components/HeroPage";
import Navbar from "@/components/Navbar";
import ServicesSection from "@/components/Service";
import {
  fetchAboutPageData,
  type MappedAbout,
  type MappedMilestone,
} from "@/lib/api/about";
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  Download,
  Globe,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// ─── Skeletons ────────────────────────────────────────────────────────────────

function SkeletonBio() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {/* Title */}
      <div
        style={{
          width: "70%",
          height: "32px",
          borderRadius: "4px",
          background: "rgba(255,255,255,0.06)",
          animation: "shimmer 1.5s ease-in-out infinite",
        }}
      />
      {/* Description lines */}
      {[100, 90, 95, 80, 85, 70].map((w, i) => (
        <div
          key={i}
          style={{
            width: `${w}%`,
            height: "14px",
            borderRadius: "3px",
            background: "rgba(255,255,255,0.04)",
            animation: `shimmer 1.5s ease-in-out ${i * 0.07}s infinite`,
          }}
        />
      ))}
      {/* Buttons */}
      <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
        <div
          style={{
            width: "160px",
            height: "44px",
            borderRadius: "4px",
            background: "rgba(255,255,255,0.06)",
            animation: "shimmer 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            width: "120px",
            height: "44px",
            borderRadius: "4px",
            background: "rgba(255,255,255,0.04)",
            animation: "shimmer 1.5s ease-in-out infinite 0.1s",
          }}
        />
      </div>
      {/* Stat grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginTop: "16px",
        }}
      >
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            style={{
              height: "48px",
              borderRadius: "4px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)",
              animation: `shimmer 1.5s ease-in-out ${n * 0.08}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function SkeletonTimeline() {
  return (
    <div style={{ position: "relative", maxWidth: "700px", margin: "0 auto" }}>
      <div
        style={{
          position: "absolute",
          left: "80px",
          top: 0,
          bottom: 0,
          width: "1px",
          background:
            "linear-gradient(to bottom, transparent, rgba(201,168,76,0.3), transparent)",
        }}
      />
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          style={{
            display: "flex",
            gap: "40px",
            marginBottom: "48px",
            position: "relative",
          }}
        >
          <div
            style={{
              minWidth: "60px",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "22px",
                borderRadius: "3px",
                background: "rgba(201,168,76,0.15)",
                animation: `shimmer 1.5s ease-in-out ${n * 0.1}s infinite`,
              }}
            />
          </div>
          <div
            style={{
              paddingLeft: "24px",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "55%",
                height: "20px",
                borderRadius: "3px",
                background: "rgba(255,255,255,0.07)",
                animation: `shimmer 1.5s ease-in-out ${n * 0.1}s infinite`,
              }}
            />
            <div
              style={{
                width: "85%",
                height: "13px",
                borderRadius: "3px",
                background: "rgba(255,255,255,0.04)",
                animation: `shimmer 1.5s ease-in-out ${n * 0.12}s infinite`,
              }}
            />
            <div
              style={{
                width: "70%",
                height: "13px",
                borderRadius: "3px",
                background: "rgba(255,255,255,0.03)",
                animation: `shimmer 1.5s ease-in-out ${n * 0.14}s infinite`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Logo / portrait ──────────────────────────────────────────────────────────

function Portrait({
  logoUrl,
  initials,
}: {
  logoUrl: string | null;
  initials: string;
}) {
  const [err, setErr] = useState(false);

  return (
    <div
      style={{
        border: "1px solid rgba(201,168,76,0.12)",
        borderRadius: "6px",
        aspectRatio: "4/5",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#1b2b2b",
      }}
    >
      <Image
        src="/chairman.jpeg"
        alt="Portrait"
        width={480}
        height={600}
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
        }}
        onError={() => setErr(true)}
        priority
      />
    </div>
  );
}

// ─── Stat badges ─────────────────────────────────────────────────────────────

const STAT_BADGES = [
  { icon: Award, label: "3 Bestselling Books" },
  { icon: Users, label: "2,000+ Executives Coached" },
  { icon: Globe, label: "47 Countries" },
  { icon: BookOpen, label: "8M+ TED Views" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const [about, setAbout] = useState<MappedAbout | null>(null);
  const [milestones, setMilestones] = useState<MappedMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const { about: a, milestones: m } = await fetchAboutPageData();
      setAbout(a);
      setMilestones(m);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load about page.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Derive initials from about title (first letters of first two words)
  const initials =
    about?.aboutTitle
      ?.split(" ")
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") ?? "AV";

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <PageHero title="About Us" currentPage="About" />

      {/* ── Bio section ── */}
      <section style={{ background: "#F4F7F6", padding: "80px 0" }}>
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "start",
          }}
        >
          {/* Portrait */}
          <AnimatedSection direction="left">
            <Portrait logoUrl={about?.logoUrl ?? null} initials={initials} />
          </AnimatedSection>

          {/* Bio content */}
          <AnimatedSection direction="right" delay={0.1}>
            {loading && <SkeletonBio />}

            {!loading && error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  color: "#000",
                  fontSize: "14px",
                }}
              >
                <AlertCircle
                  size={16}
                  style={{ color: "#C47C5A", flexShrink: 0, marginTop: "2px" }}
                />
                <div>
                  <p style={{ margin: "0 0 12px" }}>{error}</p>
                  <button
                    onClick={loadData}
                    style={{
                      padding: "7px 18px",
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "4px",
                      color: "#000",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && about && (
              <>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "38px",
                    marginBottom: "24px",
                    color: "#000",
                  }}
                >
                  {about.aboutTitle}
                </h2>

                {/* Rich text description from API */}
                <div
                  style={{
                    color: "#000",
                    lineHeight: 1.8,
                    marginBottom: "32px",
                    fontSize: "15px",
                  }}
                  dangerouslySetInnerHTML={{ __html: about.description }}
                />

                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  <Link
                    href="/contact"
                    className="btn-primary"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    Work With Me <ArrowRight size={14} />
                  </Link>
                  {about.resumeUrl ? (
                    <a
                      href={about.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Download size={14} /> Press Kit
                    </a>
                  ) : (
                    <a
                      href="#"
                      className="btn-outline"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "#fff",
                      }}
                    >
                      <Download size={14} /> Press Kit
                    </a>
                  )}
                </div>

                {/* Stat badges */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                    marginTop: "40px",
                  }}
                >
                  {STAT_BADGES.map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "14px",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: "4px",
                      }}
                    >
                      <Icon
                        size={16}
                        style={{ color: "#F59E0B", flexShrink: 0 }}
                      />
                      <span style={{ fontSize: "13px", color: "#000" }}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </AnimatedSection>
        </div>

        <style>{`@media(max-width:768px){section > .container{grid-template-columns:1fr!important;}}`}</style>
      </section>

      <ServicesSection />

      {/* ── Timeline ── */}
      <section className="section" style={{ background: "#fff" }}>
        <div className="container">
          <AnimatedSection
            style={{ textAlign: "center", marginBottom: "60px" }}
          >
            <div className="section-label" style={{ justifyContent: "center" }}>
              Career Journey
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(38px, 4vw, 52px)",
              }}
            >
              A Life Well Built
            </h2>
          </AnimatedSection>

          {/* Loading skeleton */}
          {loading && <SkeletonTimeline />}

          {/* Error */}
          {!loading && error && (
            <div
              style={{
                textAlign: "center",
                padding: "40px 0",
                color: "rgba(255,255,255,0.25)",
                fontSize: "14px",
              }}
            >
              Could not load career milestones.
            </div>
          )}

          {/* Timeline */}
          {!loading && !error && milestones.length > 0 && (
            <div
              style={{
                position: "relative",
                maxWidth: "700px",
                margin: "0 auto",
              }}
            >
              {/* Vertical line */}
              <div
                style={{
                  position: "absolute",
                  left: "80px",
                  top: 0,
                  bottom: 0,
                  width: "1px",
                  background:
                    "linear-gradient(to bottom, transparent, var(--gold), transparent)",
                }}
              />

              {milestones.map((m, i) => (
                <AnimatedSection
                  key={m.id}
                  delay={i * 0.08}
                  style={{
                    display: "flex",
                    gap: "40px",
                    marginBottom: "48px",
                    position: "relative",
                  }}
                >
                  {/* Year */}
                  <div style={{ minWidth: "60px", textAlign: "right" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "20px",
                        color: "var(--gold)",
                      }}
                    >
                      {m.year}
                    </span>
                  </div>

                  {/* Dot */}
                  <div
                    style={{
                      position: "absolute",
                      left: "76px",
                      top: "6px",
                      width: "9px",
                      height: "9px",
                      background: "var(--gold)",
                      borderRadius: "50%",
                      border: "2px solid var(--bg)",
                    }}
                  />

                  {/* Content */}
                  <div style={{ paddingLeft: "24px" }}>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "22px",
                        color: "var(--text)",
                      }}
                    >
                      {m.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "var(--text-muted)",
                        marginTop: "6px",
                        lineHeight: 1.7,
                      }}
                    >
                      {m.description}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && milestones.length === 0 && (
            <p
              style={{
                textAlign: "center",
                color: "rgba(255,255,255,0.2)",
                fontSize: "14px",
                padding: "40px 0",
              }}
            >
              No milestones available yet.
            </p>
          )}
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
