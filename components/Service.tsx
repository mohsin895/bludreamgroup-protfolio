"use client";

import AnimatedSection from "@/components/AnimatedSection";
import { fetchServices, type MappedService } from "@/lib/api/service";
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// ─── FA icon → Lucide fallback map ───────────────────────────────────────────
// We render Font Awesome icons inline since the API uses FA classes.
// A small <i> tag is all we need; Font Awesome CDN must be in layout.

function FaIcon({ icon, size = 22 }: { icon: string; size?: number }) {
  return (
    <i
      className={`fa ${icon}`}
      style={{ fontSize: `${size}px`, color: "#82C3D8" }}
      aria-hidden="true"
    />
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      className="card"
      style={{
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "8px",
          background: "rgba(201,168,76,0.06)",
          animation: "shimmer 1.5s ease-in-out infinite",
        }}
      />
      <div
        style={{
          width: "70%",
          height: "20px",
          borderRadius: "3px",
          background: "rgba(255,255,255,0.06)",
          animation: "shimmer 1.5s ease-in-out infinite 0.1s",
        }}
      />
      <div
        style={{
          width: "100%",
          height: "13px",
          borderRadius: "3px",
          background: "rgba(255,255,255,0.04)",
          animation: "shimmer 1.5s ease-in-out infinite 0.15s",
        }}
      />
      <div
        style={{
          width: "80%",
          height: "13px",
          borderRadius: "3px",
          background: "rgba(255,255,255,0.04)",
          animation: "shimmer 1.5s ease-in-out infinite 0.2s",
        }}
      />
      <div
        style={{
          width: "80px",
          height: "14px",
          borderRadius: "3px",
          background: "rgba(201,168,76,0.08)",
          marginTop: "6px",
          animation: "shimmer 1.5s ease-in-out infinite 0.25s",
        }}
      />
    </div>
  );
}

// ─── Service card ─────────────────────────────────────────────────────────────

function ServiceCard({
  service,
  delay,
}: {
  service: MappedService;
  delay: number;
}) {
  return (
    <AnimatedSection delay={delay}>
      <Link
        href={`/services/${service.slug}`}
        style={{ display: "block", textDecoration: "none", height: "100%" }}
      >
        <div
          className="card service-card"
          style={{
            padding: "32px",
            height: "100%",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            background: "#203647",
            border: "1px solid rgba(130,195,216,0.15)",
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: "48px",
              height: "48px",
              background: "rgba(130,195,216,0.12)",
              border: "1px solid rgba(130,195,216,0.25)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
              flexShrink: 0,
            }}
          >
            <FaIcon icon={service.categoryIcon} size={20} />
          </div>

          {/* Category label */}
          {service.categoryTitle !== "General" && (
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#82C3D8",
                marginBottom: "8px",
                opacity: 0.7,
              }}
            >
              {service.categoryTitle}
            </span>
          )}

          {/* Title */}
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "22px",
              color: "#ffffff",
              lineHeight: 1.2,
              marginBottom: "10px",
            }}
          >
            {service.title}
          </h3>

          {/* Excerpt */}
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-muted)",
              lineHeight: 1.7,
              flex: 1,
            }}
          >
            {service.excerpt}
          </p>

          {/* CTA */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginTop: "20px",
              color: "#82C3D8",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            Explore <ChevronRight size={12} />
          </div>
        </div>
      </Link>
    </AnimatedSection>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Service() {
  const [services, setServices] = useState<MappedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices()
      .then((data) => setServices(data.slice(0, 4))) // max 4 on homepage
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load."),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* ── SERVICES ── */}
      <section className="section" style={{ background: "var(--bg)" }}>
        <div className="container">
          <AnimatedSection
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "48px",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <div>
              <div className="section-label">What I Offer</div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(40px, 4vw, 56px)",
                }}
              >
                Transform Your
                <br />
                Leadership
              </h2>
            </div>
            <Link href="/services" className="btn-outline">
              All Services <ArrowRight size={14} />
            </Link>
          </AnimatedSection>

          {/* ── Loading ── */}
          {loading && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "20px",
              }}
              className="services-grid"
            >
              {[1, 2, 3, 4].map((n) => (
                <SkeletonCard key={n} />
              ))}
            </div>
          )}

          {/* ── Error ── */}
          {!loading && error && (
            <p
              style={{
                color: "rgba(255,255,255,0.25)",
                fontSize: "14px",
                padding: "40px 0",
              }}
            >
              Could not load services — {error}
            </p>
          )}

          {/* ── Cards ── */}
          {!loading && !error && services.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "20px",
              }}
              className="services-grid"
            >
              {services.map((s, i) => (
                <ServiceCard key={s.id} service={s} delay={i * 0.08} />
              ))}
            </div>
          )}
        </div>

        <style>{`
          .service-card { transition: transform 0.25s ease, box-shadow 0.25s ease !important; }
          .service-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  border-color: #82C3D8;
}
          @keyframes shimmer { 0%,100%{opacity:0.5} 50%{opacity:1} }
          @media(max-width:900px){ .services-grid{grid-template-columns:1fr 1fr!important;} }
          @media(max-width:480px){ .services-grid{grid-template-columns:1fr!important;} }
        `}</style>
      </section>
    </>
  );
}
