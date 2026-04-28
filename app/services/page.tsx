"use client";

import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  fetchServicesPageData,
  type MappedService,
  type MappedServiceCategory,
} from "@/lib/api/service";
import { AlertCircle, ArrowRight, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

// ─── FA icon component ────────────────────────────────────────────────────────

function FaIcon({ icon, size = 20 }: { icon: string; size?: number }) {
  return (
    <i
      className={`fa ${icon}`}
      style={{ fontSize: `${size}px`, color: "var(--gold)" }}
      aria-hidden="true"
    />
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      style={{
        background: "#203647",
        border: "1px solid rgba(130,195,216,0.15)",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "200px",
          background: "rgba(255,255,255,0.04)",
          animation: "shimmer 1.5s ease-in-out infinite",
        }}
      />
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
            width: "55%",
            height: "18px",
            borderRadius: "3px",
            background: "rgba(255,255,255,0.07)",
            animation: "shimmer 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            width: "100%",
            height: "12px",
            borderRadius: "3px",
            background: "rgba(255,255,255,0.04)",
            animation: "shimmer 1.5s ease-in-out infinite 0.1s",
          }}
        />
        <div
          style={{
            width: "80%",
            height: "12px",
            borderRadius: "3px",
            background: "rgba(255,255,255,0.04)",
            animation: "shimmer 1.5s ease-in-out infinite 0.15s",
          }}
        />
        <div
          style={{
            width: "70px",
            height: "12px",
            borderRadius: "3px",
            background: "rgba(201,168,76,0.1)",
            marginTop: "4px",
            animation: "shimmer 1.5s ease-in-out infinite 0.2s",
          }}
        />
      </div>
    </div>
  );
}

// ─── Service card ─────────────────────────────────────────────────────────────

function ServiceCard({ service, i }: { service: MappedService; i: number }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <AnimatedSection delay={i * 0.07}>
      <Link
        href={`/services/${service.slug}`}
        style={{ textDecoration: "none", display: "block", height: "100%" }}
      >
        <div
          className="svc-card"
          style={{
            background: "#203647",
            border: "1px solid rgba(130,195,216,0.15)",
            borderRadius: "10px",
            overflow: "hidden",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            transition:
              "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
          }}
        >
          {/* Cover image */}
          <div
            style={{
              height: "200px",
              background: "#111",
              position: "relative",
              flexShrink: 0,
            }}
          >
            {service.imageUrl && !imgErr ? (
              <Image
                src={service.imageUrl}
                alt={service.title}
                fill
                style={{ objectFit: "cover" }}
                onError={() => setImgErr(true)}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginTop: "18px",
                  }}
                >
                  <Link
                    href={`/services/${service.slug}`}
                    style={{
                      gap: "6px",
                      padding: "8px 14px",
                      border: "1px solid #82c3d8",
                      borderRadius: "6px",
                      color: "#ffff",
                      fontSize: "12px",
                      fontWeight: 600,
                      textDecoration: "none",
                      transition: "all 0.25s ease",
                    }}
                    className="svc-btn"
                  >
                    Learn More <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            )}
            {/* Category badge */}
            {service.categoryTitle !== "General" && (
              <div style={{ position: "absolute", top: "14px", left: "14px" }}>
                <span
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    background: "rgba(10,10,10,0.8)",
                    border: "1px solid rgba(201,168,76,0.25)",
                    padding: "3px 10px",
                    borderRadius: "3px",
                  }}
                >
                  {service.categoryTitle}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div
            style={{
              padding: "28px",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "20px",
                color: "#ffffff",
                lineHeight: 1.2,
                marginBottom: "10px",
              }}
            >
              {service.title}
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.75,
                flex: 1,
              }}
            >
              {service.excerpt}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "18px",
                color: "var(--gold)",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.04em",
              }}
            >
              Learn More <ChevronRight size={12} />
            </div>
          </div>
        </div>
      </Link>
    </AnimatedSection>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  const [services, setServices] = useState<MappedService[]>([]);
  const [categories, setCategories] = useState<MappedServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<number | "all">("all");

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const { services: s, categories: c } = await fetchServicesPageData();
      setServices(s);
      setCategories(c);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load services.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () =>
      activeFilter === "all"
        ? services
        : services.filter((s) => s.categoryId === activeFilter),
    [services, activeFilter],
  );

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section
        style={{
          paddingTop: "140px",
          paddingBottom: "80px",
          background: "var(--bg)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div className="container">
          <AnimatedSection>
            <div className="section-label">What I Offer</div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(52px, 6vw, 84px)",
                marginTop: "8px",
                letterSpacing: "-0.02em",
                lineHeight: 1.0,
              }}
            >
              Transform Your
              <br />
              <span style={{ color: "var(--gold)" }}>Leadership</span>
            </h1>
            <p
              style={{
                color: "#fff",
                fontSize: "17px",
                maxWidth: "540px",
                marginTop: "20px",
                lineHeight: 1.7,
              }}
            >
              Keynotes, coaching, workshops, and courses — built for leaders who
              refuse to settle.
            </p>

            {/* Stats */}
            <div
              style={{
                display: "flex",
                gap: "40px",
                marginTop: "36px",
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "Services", value: loading ? "—" : services.length },
                {
                  label: "Categories",
                  value: loading ? "—" : categories.length,
                },
                { label: "Countries", value: "47+" },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "36px",
                      color: "var(--gold)",
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
                      color: "rgba(255,255,255,0.28)",
                      marginTop: "4px",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/"
              className="btn-outline"
              style={{ display: "inline-flex", marginTop: "32px" }}
            >
              ← Back to Home
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Category filter ── */}
      {!loading && !error && categories.length > 0 && (
        <div
          style={{
            background: "#1b3140",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            padding: "20px 0",
            position: "sticky",
            top: 0,
            zIndex: 10,
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            className="container"
            style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
          >
            <button
              onClick={() => setActiveFilter("all")}
              style={{
                padding: "7px 18px",
                borderRadius: "100px",
                border: "1px solid",
                borderColor:
                  activeFilter === "all"
                    ? "var(--gold)"
                    : "rgba(255,255,255,0.1)",
                background:
                  activeFilter === "all"
                    ? "rgba(201,168,76,0.12)"
                    : "transparent",
                color:
                  activeFilter === "all" ? "#fff" : "rgba(255,255,255,0.45)",
                fontSize: "12px",
                letterSpacing: "0.06em",
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
            >
              All Services
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                style={{
                  padding: "7px 18px",
                  borderRadius: "100px",
                  border: "1px solid",
                  borderColor:
                    activeFilter === cat.id
                      ? "var(--gold)"
                      : "rgba(255,255,255,0.1)",
                  background:
                    activeFilter === cat.id
                      ? "rgba(201,168,76,0.12)"
                      : "transparent",
                  color: activeFilter === cat.id ? "var(--gold)" : "#fff",
                  fontSize: "12px",
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <FaIcon icon={cat.icon} size={11} />
                {cat.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Services grid ── */}
      <section
        style={{
          background: "#203647",
          paddingTop: "64px",
          paddingBottom: "120px",
        }}
      >
        <div className="container">
          {/* Loading */}
          {loading && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "24px",
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <SkeletonCard key={n} />
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <AlertCircle
                size={32}
                style={{ color: "#C47C5A", marginBottom: "16px", opacity: 0.7 }}
              />
              <p
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: "15px",
                  marginBottom: "20px",
                }}
              >
                {error}
              </p>
              <button
                onClick={load}
                style={{
                  padding: "10px 24px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "4px",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "12px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 0",
                color: "rgba(255,255,255,0.2)",
                fontSize: "14px",
              }}
            >
              No services in this category.
            </div>
          )}

          {/* Cards */}
          {!loading && !error && filtered.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "24px",
              }}
            >
              {filtered.map((s, i) => (
                <ServiceCard key={s.id} service={s} i={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          background: "var(--bg)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "80px 0",
        }}
      >
        <div className="container" style={{ textAlign: "center" }}>
          <AnimatedSection>
            <div
              style={{
                width: "40px",
                height: "1px",
                background: "var(--gold)",
                margin: "0 auto 24px",
              }}
            />
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 3vw, 42px)",
                marginBottom: "16px",
                letterSpacing: "-0.02em",
              }}
            >
              Ready to Begin?
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "15px",
                lineHeight: 1.7,
                maxWidth: "400px",
                margin: "0 auto 32px",
              }}
            >
              Let's build something that shifts how you lead, communicate, and
              grow.
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
                href="/contact"
                className="btn-primary"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                Book a Discovery Call <ArrowRight size={14} />
              </Link>
              <Link
                href="/about"
                className="btn-outline"
                style={{ display: "inline-flex" }}
              >
                Learn About Me
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <style>{`
        .svc-card:hover {
  transform: translateY(-5px);
  border-color: #82c3d8;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
} }
        @keyframes shimmer { 0%,100%{opacity:0.5} 50%{opacity:1} }
      `}</style>

      <Footer />
    </>
  );
}
