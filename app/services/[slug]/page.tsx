"use client";

import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  fetchServiceBySlug,
  fetchServices,
  type MappedService,
} from "@/lib/api/service";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// ─── FA icon ──────────────────────────────────────────────────────────────────

function FaIcon({ icon, size = 18 }: { icon: string; size?: number }) {
  return (
    <i
      className={`fa ${icon}`}
      style={{ fontSize: `${size}px`, color: "var(--gold)" }}
      aria-hidden="true"
    />
  );
}

// ─── Hero image ───────────────────────────────────────────────────────────────

function HeroImage({ service }: { service: MappedService }) {
  const [err, setErr] = useState(false);
  const src = service.imageSet?.large ?? service.imageUrl;

  if (!src || err) {
    return (
      <div
        style={{
          width: "100%",
          height: "420px",
          background:
            "linear-gradient(135deg, rgba(201,168,76,0.06), rgba(201,168,76,0.02))",
          border: "1px solid rgba(201,168,76,0.1)",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "rgba(201,168,76,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FaIcon icon={service.categoryIcon} size={32} />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "420px",
        borderRadius: "12px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Image
        src={src}
        alt={service.title}
        fill
        style={{ objectFit: "cover" }}
        onError={() => setErr(true)}
        priority
      />
    </div>
  );
}

// ─── Related card ─────────────────────────────────────────────────────────────

function RelatedCard({ service, i }: { service: MappedService; i: number }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <AnimatedSection delay={i * 0.08}>
      <Link
        href={`/services/${service.slug}`}
        style={{ textDecoration: "none", display: "block" }}
      >
        <div
          className="related-svc-card"
          style={{
            background: "#203647",
            border: "1px solid rgba(130,195,216,0.15)",
            borderRadius: "10px",
            overflow: "hidden",
            transition: "transform 0.2s, border-color 0.2s",
          }}
        >
          {/* Thumb */}
          <div
            style={{
              height: "140px",
              background: "#111",
              position: "relative",
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
                <FaIcon icon={service.categoryIcon} size={24} />
              </div>
            )}
          </div>
          <div style={{ padding: "20px" }}>
            <h4
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "17px",
                color: "var(--text)",
                lineHeight: 1.3,
                marginBottom: "8px",
              }}
            >
              {service.title}
            </h4>
            <p
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.65,
              }}
            >
              {service.excerpt.slice(0, 90)}
              {service.excerpt.length > 90 ? "…" : ""}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                marginTop: "12px",
                color: "var(--gold)",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              View <ChevronRight size={11} />
            </div>
          </div>
        </div>
      </Link>
    </AnimatedSection>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ServiceDetailPage() {
  const params = useParams();
  const slug =
    typeof params?.slug === "string"
      ? params.slug
      : Array.isArray(params?.slug)
        ? params.slug[0]
        : "";

  const [service, setService] = useState<MappedService | null>(null);
  const [related, setRelated] = useState<MappedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [svc, all] = await Promise.all([
          fetchServiceBySlug(slug),
          fetchServices(),
        ]);
        if (!svc) {
          setError("Service not found.");
          return;
        }
        setService(svc);
        setRelated(
          all
            .filter((s) => s.id !== svc.id && s.categoryId === svc.categoryId)
            .slice(0, 3),
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load service.",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  return (
    <>
      <Navbar />

      {/* ── Loading ── */}
      {loading && (
        <div
          style={{
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bg)",
          }}
        >
          <Loader2
            size={28}
            style={{
              color: "var(--gold)",
              animation: "spin 1s linear infinite",
            }}
          />
          <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
        </div>
      )}

      {/* ── Error ── */}
      {!loading && error && (
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            padding: "60px 24px",
            background: "var(--bg)",
          }}
        >
          <AlertCircle size={36} style={{ color: "#C47C5A", opacity: 0.7 }} />
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "16px" }}>
            {error}
          </p>
          <Link
            href="/services"
            className="btn-outline"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
          >
            <ArrowLeft size={13} /> Back to Services
          </Link>
        </div>
      )}

      {/* ── Content ── */}
      {!loading && !error && service && (
        <>
          {/* ── Hero ── */}
          <section
            style={{
              paddingTop: "120px",
              paddingBottom: "0",
              background: "var(--bg)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Ambient */}
            <div
              style={{
                position: "absolute",
                top: "-100px",
                left: "-100px",
                width: "500px",
                height: "500px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            <div className="container" style={{ position: "relative" }}>
              {/* Breadcrumb */}
              <nav
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.3)",
                  marginBottom: "40px",
                  letterSpacing: "0.05em",
                }}
              >
                <Link
                  href="/services"
                  style={{
                    color: "rgba(255,255,255,0.3)",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--gold)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(255,255,255,0.3)")
                  }
                >
                  <ArrowLeft size={12} /> Services
                </Link>
                <ChevronRight size={10} />
                <span style={{ color: "rgba(255,255,255,0.5)" }}>
                  {service.title}
                </span>
              </nav>

              {/* Two-column layout */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 440px",
                  gap: "72px",
                  alignItems: "start",
                  paddingBottom: "80px",
                }}
                className="detail-grid"
              >
                {/* Left */}
                <AnimatedSection>
                  {/* Category badge */}
                  {service.categoryTitle !== "General" && (
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "11px",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "var(--gold)",
                        marginBottom: "20px",
                      }}
                    >
                      <FaIcon icon={service.categoryIcon} size={12} />
                      {service.categoryTitle}
                    </div>
                  )}

                  <h1
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(38px, 5vw, 68px)",
                      lineHeight: 1.0,
                      letterSpacing: "-0.02em",
                      color: "#fff",
                      marginBottom: "24px",
                    }}
                  >
                    {service.title}
                  </h1>

                  {/* Description — rich HTML */}
                  {service.description ? (
                    <div
                      className="service-description"
                      style={{
                        fontSize: "16px",
                        color: "#fff",
                        lineHeight: 1.85,
                        maxWidth: "600px",
                      }}
                      dangerouslySetInnerHTML={{ __html: service.description }}
                    />
                  ) : (
                    <p
                      style={{
                        fontSize: "16px",
                        color: "rgba(255,255,255,0.7)",
                        lineHeight: 1.85,
                        fontStyle: "italic",
                      }}
                    >
                      Full description coming soon.
                    </p>
                  )}

                  {/* Service notes */}
                  {service.notes.length > 0 && (
                    <div style={{ marginTop: "40px" }}>
                      <p
                        style={{
                          fontSize: "11px",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.3)",
                          marginBottom: "18px",
                        }}
                      >
                        What's Included
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "14px",
                        }}
                      >
                        {service.notes.map((note, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              gap: "14px",
                              alignItems: "flex-start",
                            }}
                          >
                            <div
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "6px",
                                background: "rgba(201,168,76,0.08)",
                                border: "1px solid rgba(201,168,76,0.15)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                marginTop: "2px",
                              }}
                            >
                              <FaIcon icon={note.icon} size={14} />
                            </div>
                            <div>
                              <p
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 600,
                                  color: "var(--text)",
                                  marginBottom: "4px",
                                }}
                              >
                                {note.title}
                              </p>
                              <p
                                style={{
                                  fontSize: "13px",
                                  color: "rgba(255,255,255,0.7)",
                                  lineHeight: 1.65,
                                }}
                              >
                                {note.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA row */}
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                      marginTop: "40px",
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
                      Book This Service <ArrowRight size={14} />
                    </Link>
                    <Link
                      href="/services"
                      className="btn-outline"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <ArrowLeft size={13} /> All Services
                    </Link>
                  </div>
                </AnimatedSection>

                {/* Right — sticky image + meta */}
                <AnimatedSection delay={0.1}>
                  <div style={{ position: "sticky", top: "100px" }}>
                    <HeroImage service={service} />

                    {/* Meta card */}
                    <div
                      style={{
                        marginTop: "24px",
                        background: "#203647",
                        border: "1px solid rgba(130,195,216,0.15)",
                        borderRadius: "10px",
                        padding: "20px 24px",
                      }}
                    >
                      {[
                        { label: "Category", value: service.categoryTitle },
                        { label: "Added", value: service.createdAt },
                        {
                          label: "Format",
                          value:
                            service.notes.length > 0
                              ? `${service.notes.length} module${service.notes.length !== 1 ? "s" : ""}`
                              : "Full service",
                        },
                      ].map(({ label, value }) => (
                        <div
                          key={label}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px 0",
                            borderBottom: "1px solid rgba(255,255,255,0.04)",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "11px",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              color: "rgba(255,255,255,0.25)",
                            }}
                          >
                            {label}
                          </span>
                          <span
                            style={{
                              fontSize: "13px",
                              color: "rgba(255,255,255,0.7)",
                              fontWeight: 500,
                            }}
                          >
                            {value}
                          </span>
                        </div>
                      ))}
                      <Link
                        href="/contact"
                        className="btn-primary"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          width: "100%",
                          padding: "12px",
                          fontSize: "13px",
                          marginTop: "16px",
                          textDecoration: "none",
                        }}
                      >
                        Get in Touch <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </section>

          {/* ── Related services ── */}
          {related.length > 0 && (
            <section style={{ background: "#203647", padding: "80px 0" }}>
              <div className="container">
                <AnimatedSection>
                  <div
                    className="section-label"
                    style={{ marginBottom: "8px" }}
                  >
                    More Services
                  </div>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(26px, 3vw, 36px)",
                      marginBottom: "36px",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    You May Also Like
                  </h2>
                </AnimatedSection>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {related.map((s, i) => (
                    <RelatedCard key={s.id} service={s} i={i} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <style>{`
        .service-description p { margin-bottom: 1em; }
        .service-description i[class*="fa"] { margin: 0 4px; color: var(--gold); }
        .related-svc-card:hover { transform: translateY(-3px) !important; border-color: rgba(201,168,76,0.18) !important; }
        @media(max-width:900px){ .detail-grid{grid-template-columns:1fr!important; gap:40px!important;} }
      `}</style>

      <Footer />
    </>
  );
}
