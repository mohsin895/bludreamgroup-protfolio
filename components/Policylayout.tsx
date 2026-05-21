"use client";

import { motion, useInView } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  ChevronRight,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

/* ─── ENV ─── */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const IMG_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "";

/* ─── API shape ─── */
interface Setting {
  id?: number;
  site_name?: string;
  logo?: string;
  emails?: string[];
  phones?: string[];
  addresses?: string[];
  fb?: string | null;
  twitter?: string | null;
  youtube?: string | null;
  linkdi?: string | null;
  term_condition?: string;
  privacy_policy?: string;
  updated_at?: string;
}

/* ─── Props ─── */
export interface PolicyLayoutProps {
  type: "terms" | "privacy";
  title: string;
  subtitle: string;
  badgeIcon?: React.ReactNode;
  crumb: string;
}

/* ─── Animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

/* ─── Section observer card (fades each section in) ─── */
function FadeSection({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Strip HTML for TOC heading extraction ─── */
function extractHeadings(html: string): string[] {
  const matches = html.match(/<(h[1-4])[^>]*>(.*?)<\/\1>/gi) ?? [];
  return matches
    .map((m) => m.replace(/<[^>]+>/g, "").trim())
    .filter(Boolean)
    .slice(0, 10);
}

/* ─── Format last updated date ─── */
function formatDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* ═══════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════ */
export default function PolicyLayout({
  type,
  title,
  subtitle,
  badgeIcon,
  crumb,
}: PolicyLayoutProps) {
  const [setting, setSetting] = useState<Setting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/setting`)
      .then((r) => r.json())
      .then((json) => {
        const data = json?.data ?? json;
        setSetting(data);
      })
      .catch(() => setSetting(null))
      .finally(() => setLoading(false));
  }, []);

  const rawHtml =
    type === "terms" ? setting?.term_condition : setting?.privacy_policy;
  const headings = rawHtml ? extractHeadings(rawHtml) : [];
  const updatedAt = setting?.updated_at ? formatDate(setting.updated_at) : "";
  const email = setting?.emails?.[0] ?? "";
  const phone = setting?.phones?.[0] ?? "";
  const address = setting?.addresses?.[0] ?? "";

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {  background: #f4f7f6; }

        /* ── Policy content styles ── */
        .policy-content div,
        .policy-content p {
          font-size: 15px;
          color: #374151;
          line-height: 1.9;
          margin-bottom: 14px;
        }
        .policy-content h1,
        .policy-content h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(20px, 2.2vw, 26px);
          color: #1a2427;
          font-weight: 700;
          margin: 36px 0 14px;
          line-height: 1.25;
          padding-bottom: 10px;
          border-bottom: 2px solid #6c7e7f22;
        }
        .policy-content h3 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(17px, 1.8vw, 21px);
          color: #1a2427;
          font-weight: 700;
          margin: 28px 0 10px;
          line-height: 1.3;
        }
        .policy-content h4 {
          font-size: 15px; font-weight: 700;
          color: #6c7e7f; margin: 22px 0 8px;
          text-transform: uppercase; letter-spacing: 0.06em;
        }
        .policy-content ul,
        .policy-content ol {
          margin: 8px 0 18px 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .policy-content li {
          font-size: 14px;
          color: #374151;
          line-height: 1.7;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 16px;
          background: #f8faf9;
          border-radius: 10px;
          border-left: 3px solid #6c7e7f;
        }
        .policy-content li::before {
          content: "✓";
          color: #6c7e7f;
          font-weight: 800;
          font-size: 13px;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .policy-content a {
          color: #6c7e7f;
          font-weight: 600;
          text-decoration: underline;
        }
        .policy-content strong {
          color: #1a2427;
          font-weight: 700;
        }
        .policy-content blockquote {
          border-left: 4px solid #6c7e7f;
          background: #6c7e7f0a;
          padding: 16px 20px;
          border-radius: 0 10px 10px 0;
          margin: 20px 0;
          font-style: italic;
          color: #4b5563;
        }

        /* ── TOC ── */
        .toc-link { transition: all 0.2s; }
        .toc-link:hover { color: #6c7e7f !important; padding-left: 6px !important; }

        /* ── Scroll progress ── */
        #policy-progress {
          position: fixed; top: 0; left: 0; height: 3px;
          background: linear-gradient(90deg, #6c7e7f, #95a49a);
          z-index: 9999; transition: width 0.1s linear;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .policy-layout { grid-template-columns: 1fr !important; }
          .policy-sidebar { display: none !important; }
          .policy-hero-inner { padding: 64px 20px 56px !important; }
        }
        @media (max-width: 600px) {
          .policy-content div,
          .policy-content p { font-size: 14px !important; }
          .policy-content h2 { font-size: 19px !important; }
        }
      `}</style>

      {/* Scroll progress bar */}
      <ScrollProgress />
      <Navbar />

      {/* ════════════════════════
          HERO
      ════════════════════════ */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #6c7e7f 0%, #7a9190 42%, #95a49a 100%)",
          position: "relative",
          overflow: "hidden",
          paddingTop: 80,
        }}
      >
        {/* Dot grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.07,
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        {/* Glows */}
        <div
          style={{
            position: "absolute",
            top: "-25%",
            right: "-5%",
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.1), transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-35%",
            left: "3%",
            width: 380,
            height: 380,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.06), transparent 70%)",
          }}
        />

        <div
          className="policy-hero-inner"
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "80px 24px 68px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 28,
            }}
          >
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                color: "rgba(255,255,255,0.65)",
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 500,
                transition: "color 0.2s",
              }}
            >
              <ArrowLeft size={13} /> Home
            </Link>
            <ChevronRight size={13} color="rgba(255,255,255,0.4)" />
            <span
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.85)",
                fontWeight: 600,
              }}
            >
              {crumb}
            </span>
          </motion.div>

          <motion.div initial="hidden" animate="show" variants={stagger}>
            {/* Badge */}
            <motion.div variants={fadeUp} style={{ marginBottom: 20 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "#fff",
                  borderRadius: 40,
                  padding: "7px 20px",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                }}
              >
                {badgeIcon ?? <Shield size={13} />}
                &nbsp;Legal Document
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeUp}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(40px, 6vw, 80px)",
                color: "#ffffff",
                lineHeight: 1.05,
                letterSpacing: "-0.022em",
                marginBottom: 18,
              }}
            >
              {title}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              style={{
                fontSize: "clamp(14px, 1.6vw, 18px)",
                color: "rgba(255,255,255,0.75)",
                lineHeight: 1.78,
                maxWidth: 580,
                marginBottom: 36,
              }}
            >
              {subtitle}
            </motion.p>

            {/* Meta chips */}
            <motion.div
              variants={fadeUp}
              style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
            >
              {updatedAt && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: 20,
                    padding: "6px 16px",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.85)",
                    fontWeight: 600,
                  }}
                >
                  <Calendar size={12} /> Last updated: {updatedAt}
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: 20,
                  padding: "6px 16px",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.85)",
                  fontWeight: 600,
                }}
              >
                <CheckCircle size={12} />{" "}
                {setting?.site_name ?? "Shopnill Chowdhury"}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Wave */}
        <div style={{ position: "absolute", bottom: -2, left: 0, right: 0 }}>
          <svg
            viewBox="0 0 1440 72"
            preserveAspectRatio="none"
            style={{ width: "100%", height: 72, display: "block" }}
          >
            <path
              d="M0,36 C480,72 960,0 1440,36 L1440,72 L0,72 Z"
              fill="#f4f7f6"
            />
          </svg>
        </div>
      </section>

      {/* ════════════════════════
          BODY
      ════════════════════════ */}
      <main style={{ background: "#f4f7f6", padding: "60px 0 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div
            className="policy-layout"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 300px",
              gap: 48,
              alignItems: "flex-start",
            }}
          >
            {/* ── Main content ── */}
            <div>
              {/* Loading state */}
              {loading && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 18 }}
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        animation: "pl-pulse 1.8s ease-in-out infinite",
                        opacity: 0.6,
                      }}
                    >
                      <div
                        style={{
                          height: i % 3 === 0 ? 28 : 14,
                          width: i % 3 === 0 ? "55%" : "90%",
                          background: "#e8ecea",
                          borderRadius: 6,
                          marginBottom: 8,
                        }}
                      />
                      <div
                        style={{
                          height: 14,
                          width: "100%",
                          background: "#f0f2f1",
                          borderRadius: 4,
                        }}
                      />
                      <div
                        style={{
                          height: 14,
                          width: "80%",
                          background: "#f0f2f1",
                          borderRadius: 4,
                          marginTop: 6,
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Content card */}
              {!loading && rawHtml && (
                <FadeSection>
                  <div
                    style={{
                      background: "#ffffff",
                      borderRadius: 20,
                      border: "1px solid #e8ecea",
                      padding: "clamp(28px, 4vw, 52px)",
                      boxShadow: "0 2px 20px rgba(108,126,127,0.07)",
                    }}
                  >
                    <div
                      className="policy-content"
                      dangerouslySetInnerHTML={{ __html: rawHtml }}
                    />
                  </div>
                </FadeSection>
              )}

              {/* Empty state */}
              {!loading && !rawHtml && (
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 20,
                    border: "1px solid #e8ecea",
                    padding: "60px 40px",
                    textAlign: "center",
                  }}
                >
                  <Shield
                    size={48}
                    color="#e5e7eb"
                    style={{ marginBottom: 16 }}
                  />
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 22,
                      color: "#1a2427",
                      marginBottom: 10,
                    }}
                  >
                    Content coming soon
                  </h3>
                  <p style={{ fontSize: 14, color: "#9aa6aa" }}>
                    This document is being prepared. Please check back shortly.
                  </p>
                </div>
              )}

              {/* Policy navigation */}
              <FadeSection delay={0.2}>
                <div
                  style={{
                    marginTop: 24,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 16,
                  }}
                >
                  <Link
                    href="/privacy-policy"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: type === "privacy" ? "#6c7e7f" : "#fff",
                      border: `1.5px solid ${type === "privacy" ? "#6c7e7f" : "#e8ecea"}`,
                      borderRadius: 14,
                      padding: "18px 22px",
                      textDecoration: "none",
                      transition: "all 0.25s",
                      color: type === "privacy" ? "#fff" : "#1a2427",
                    }}
                    className="policy-nav-link"
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          opacity: 0.7,
                          marginBottom: 4,
                        }}
                      >
                        {type === "privacy" ? "You are here" : "Read also"}
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>
                        Privacy Policy
                      </div>
                    </div>
                    <Shield size={20} style={{ opacity: 0.6 }} />
                  </Link>

                  <Link
                    href="/terms"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: type === "terms" ? "#6c7e7f" : "#fff",
                      border: `1.5px solid ${type === "terms" ? "#6c7e7f" : "#e8ecea"}`,
                      borderRadius: 14,
                      padding: "18px 22px",
                      textDecoration: "none",
                      transition: "all 0.25s",
                      color: type === "terms" ? "#fff" : "#1a2427",
                    }}
                    className="policy-nav-link"
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          opacity: 0.7,
                          marginBottom: 4,
                        }}
                      >
                        {type === "terms" ? "You are here" : "Read also"}
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>
                        Terms & Conditions
                      </div>
                    </div>
                    <CheckCircle size={20} style={{ opacity: 0.6 }} />
                  </Link>
                </div>
              </FadeSection>
            </div>

            {/* ── Sidebar ── */}
            <aside className="policy-sidebar">
              <div
                style={{
                  position: "sticky",
                  top: 100,
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                }}
              >
                {/* Table of contents */}
                {headings.length > 0 && (
                  <FadeSection>
                    <div
                      style={{
                        background: "#fff",
                        border: "1px solid #e8ecea",
                        borderRadius: 16,
                        overflow: "hidden",
                        boxShadow: "0 2px 12px rgba(108,126,127,0.06)",
                      }}
                    >
                      <div
                        style={{
                          background:
                            "linear-gradient(135deg, #6c7e7f, #95a49a)",
                          padding: "18px 22px",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            background: "rgba(255,255,255,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2.5"
                          >
                            <line x1="8" y1="6" x2="21" y2="6" />
                            <line x1="8" y1="12" x2="21" y2="12" />
                            <line x1="8" y1="18" x2="21" y2="18" />
                            <line x1="3" y1="6" x2="3.01" y2="6" />
                            <line x1="3" y1="12" x2="3.01" y2="12" />
                            <line x1="3" y1="18" x2="3.01" y2="18" />
                          </svg>
                        </div>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 800,
                            color: "#fff",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                          }}
                        >
                          Contents
                        </span>
                      </div>
                      <div style={{ padding: "16px 0" }}>
                        {headings.map((h, i) => (
                          <div
                            key={i}
                            className="toc-link"
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 10,
                              padding: "9px 22px",
                              borderLeft: "3px solid transparent",
                              cursor: "default",
                              transition: "all 0.2s",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 800,
                                color: "#6c7e7f",
                                background: "#6c7e7f15",
                                borderRadius: 20,
                                width: 22,
                                height: 22,
                                flexShrink: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: 1,
                              }}
                            >
                              {i + 1}
                            </span>
                            <span
                              style={{
                                fontSize: 13,
                                color: "#374151",
                                lineHeight: 1.5,
                                fontWeight: 500,
                              }}
                            >
                              {h}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FadeSection>
                )}

                {/* Quick info card */}
                <FadeSection delay={0.1}>
                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid #e8ecea",
                      borderRadius: 16,
                      padding: "24px 22px",
                      boxShadow: "0 2px 12px rgba(108,126,127,0.06)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: "#6c7e7f",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        marginBottom: 16,
                      }}
                    >
                      Quick Info
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}
                    >
                      {[
                        {
                          label: "Document",
                          value:
                            type === "terms"
                              ? "Terms & Conditions"
                              : "Privacy Policy",
                        },
                        {
                          label: "Brand",
                          value: setting?.site_name ?? "Shopnill Chowdhury",
                        },
                        ...(updatedAt
                          ? [{ label: "Updated", value: updatedAt }]
                          : []),
                        { label: "Jurisdiction", value: "Bangladesh" },
                      ].map((row) => (
                        <div
                          key={row.label}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            paddingBottom: 12,
                            borderBottom: "1px solid #f0f2f1",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 800,
                              color: "#9aa6aa",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                            }}
                          >
                            {row.label}
                          </span>
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: "#1a2427",
                            }}
                          >
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeSection>

                {/* Need help */}
                <FadeSection delay={0.15}>
                  <div
                    style={{
                      background: "linear-gradient(135deg, #6c7e7f, #95a49a)",
                      borderRadius: 16,
                      padding: "24px 22px",
                      textAlign: "center",
                    }}
                  >
                    <Shield
                      size={32}
                      color="rgba(255,255,255,0.8)"
                      style={{ marginBottom: 12 }}
                    />
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#fff",
                        marginBottom: 8,
                      }}
                    >
                      Have questions?
                    </div>
                    <p
                      style={{
                        fontSize: 12,
                        color: "rgba(255,255,255,0.75)",
                        lineHeight: 1.7,
                        marginBottom: 16,
                      }}
                    >
                      Our team is happy to clarify any part of our policies.
                    </p>
                    <Link
                      href="/contact"
                      style={{
                        display: "block",
                        background: "rgba(255,255,255,0.2)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        borderRadius: 10,
                        padding: "10px 18px",
                        fontSize: 12,
                        fontWeight: 800,
                        color: "#fff",
                        textDecoration: "none",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        transition: "all 0.2s",
                      }}
                      className="sidebar-contact-btn"
                    >
                      Contact Us →
                    </Link>
                  </div>
                </FadeSection>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <style>{`
        .contact-chip:hover { background: rgba(255,255,255,0.25) !important; transform: translateX(3px); }
        .policy-nav-link:hover { border-color: #6c7e7f !important; box-shadow: 0 6px 20px rgba(108,126,127,0.12); transform: translateY(-2px); }
        .sidebar-contact-btn:hover { background: rgba(255,255,255,0.3) !important; }
        @keyframes pl-pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
      `}</style>
      <Footer />
    </>
  );
}

/* ─── Scroll progress bar ─── */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(pct, 100));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div id="policy-progress" style={{ width: `${progress}%` }} />;
}
