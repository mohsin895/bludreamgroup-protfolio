"use client";

import AnimatedSection from "@/components/AnimatedSection";
import {
  fetchMappedTestimonials,
  type MappedTestimonial,
} from "@/lib/api/testimonial";
import { AlertCircle, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      className="card"
      style={{
        padding: "36px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#284b63", // slightly lighter than #648181
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Stars */}
      <div style={{ display: "flex", gap: "3px", marginBottom: "8px" }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "2px",
              background: "rgba(201,168,76,0.12)",
              animation: "shimmer 1.5s ease-in-out infinite",
            }}
          />
        ))}
      </div>
      {/* Quote lines */}
      {[95, 80, 88, 65].map((w) => (
        <div
          key={w}
          style={{
            height: "14px",
            width: `${w}%`,
            borderRadius: "3px",
            background: "rgba(255,255,255,0.05)",
            animation: "shimmer 1.5s ease-in-out infinite",
          }}
        />
      ))}
      {/* Divider */}
      <div
        style={{
          height: "1px",
          background: "rgba(255,255,255,0.05)",
          margin: "8px 0",
        }}
      />
      {/* Author */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            animation: "shimmer 1.5s ease-in-out infinite",
            flexShrink: 0,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div
            style={{
              width: "100px",
              height: "12px",
              borderRadius: "3px",
              background: "rgba(255,255,255,0.06)",
              animation: "shimmer 1.5s ease-in-out infinite",
            }}
          />
          <div
            style={{
              width: "130px",
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

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ t }: { t: MappedTestimonial }) {
  const [imgError, setImgError] = useState(false);
  const showImg = t.avatarUrl && !imgError;

  return (
    <div
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        background: showImg ? "transparent" : t.bg,
        border: `1px solid ${t.color}33`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
        fontSize: "11px",
        fontWeight: 700,
        color: t.color,
        letterSpacing: "0.04em",
      }}
    >
      {showImg ? (
        <Image
          src={t.avatarUrl!}
          alt={t.initials}
          width={36}
          height={36}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
          onError={() => setImgError(true)}
        />
      ) : (
        t.initials
      )}
    </div>
  );
}

// ─── Testimonial card ─────────────────────────────────────────────────────────

function TestimonialCard({ t, i }: { t: MappedTestimonial; i: number }) {
  return (
    <AnimatedSection delay={i * 0.1}>
      <div
        className="card"
        style={{
          padding: "36px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Stars */}
        <div style={{ display: "flex", gap: "2px", marginBottom: "20px" }}>
          {Array.from({ length: t.rating }).map((_, j) => (
            <Star size={14} style={{ fill: "#F59517", color: "#F59517" }} />
          ))}
        </div>

        {/* Quote */}
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "18px",
            lineHeight: 1.6,
            color: "#000",
            fontStyle: "italic",
            flex: 1,
            margin: 0,
          }}
        >
          "{t.quote}"
        </p>

        {/* Author */}
        <div
          style={{
            marginTop: "24px",
            paddingTop: "20px",
            borderTop: "1px solid #f59517",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Avatar t={t} />
          <div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#000",
              }}
            >
              {t.name}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#000",
                marginTop: "3px",
              }}
            >
              {t.role} · {t.company}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Testimonial() {
  const [testimonials, setTestimonials] = useState<MappedTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMappedTestimonials()
      .then(({ testimonials: all }) => {
        // Show max 3 on homepage — featured first, then rest
        setTestimonials(all.slice(0, 3));
      })
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Failed to load testimonials.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* ── TESTIMONIALS ── */}
      <section className="section" style={{ background: "#648181" }}>
        <div className="container">
          {/* Header */}
          <AnimatedSection
            style={{ textAlign: "center", marginBottom: "56px" }}
          >
            <div className="section-label" style={{ justifyContent: "center" }}>
              Social Proof
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px, 4vw, 56px)",
              }}
            >
              Words From Leaders
            </h2>
          </AnimatedSection>

          {/* ── Loading skeletons ── */}
          {loading && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "24px",
              }}
            >
              {[1, 2, 3].map((n) => (
                <SkeletonCard key={n} />
              ))}
            </div>
          )}

          {/* ── Error ── */}
          {!loading && error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "48px 0",
                color: "rgba(255,255,255,0.3)",
                fontSize: "14px",
              }}
            >
              <AlertCircle
                size={16}
                style={{ color: "#C47C5A", flexShrink: 0 }}
              />
              {error}
            </div>
          )}

          {/* ── Empty ── */}
          {!loading && !error && testimonials.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "48px 0",
                color: "rgba(255,255,255,0.2)",
                fontSize: "14px",
              }}
            >
              No testimonials available at this time.
            </div>
          )}

          {/* ── Cards ── */}
          {!loading && !error && testimonials.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "24px",
              }}
            >
              {testimonials.map((t, i) => (
                <TestimonialCard key={t.id} t={t} i={i} />
              ))}
            </div>
          )}

          {/* CTA */}
          {!loading && !error && (
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <Link href="/testimonials" className="btn-outline">
                Read All Testimonials
              </Link>
            </div>
          )}
        </div>

        <style>{`
        .section-label {
  color: #82c3d8;
}
          @media (max-width: 768px) {
            .testimonial-grid { grid-template-columns: 1fr !important; }
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
