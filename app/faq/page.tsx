"use client";

import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import PageHero from "@/components/HeroPage";
import Navbar from "@/components/Navbar";
import {
  fetchMappedFaqs,
  type ApiFaqCategory,
  type MappedFaqSection,
} from "@/lib/api/faq";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

// ─── Chevron icon ─────────────────────────────────────────────────────────────

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.3s ease",
        flexShrink: 0,
      }}
    >
      <path
        d="M4 7L9 12L14 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Accordion item ───────────────────────────────────────────────────────────

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        transition: "background 0.2s ease",
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          padding: "22px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          color: isOpen ? "var(--gold, #C9A84C)" : "var(--text, #fff)",
          transition: "color 0.2s ease",
        }}
      >
        <span
          style={{
            fontSize: "15px",
            fontWeight: 500,
            lineHeight: 1.5,
            letterSpacing: "0.01em",
          }}
        >
          {question}
        </span>
        <span
          style={{
            color: "var(--gold, #C9A84C)",
            opacity: isOpen ? 1 : 0.5,
            transition: "opacity 0.2s ease",
          }}
        >
          <ChevronIcon open={isOpen} />
        </span>
      </button>

      <div
        style={{
          overflow: "hidden",
          maxHeight: isOpen ? "400px" : "0px",
          transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            lineHeight: 1.8,
            color: "var(--text-muted, rgba(255,255,255,0.55))",
            paddingBottom: "22px",
            margin: 0,
          }}
        >
          {answer}
        </p>
      </div>
    </div>
  );
}

// ─── Skeleton section ─────────────────────────────────────────────────────────

function SkeletonSection() {
  return (
    <div>
      {/* Category header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "4px",
            background: "rgba(255,255,255,0.06)",
            animation: "shimmer 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            width: "130px",
            height: "10px",
            borderRadius: "3px",
            background: "rgba(201,168,76,0.12)",
            animation: "shimmer 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            flex: 1,
            height: "1px",
            background: "rgba(201,168,76,0.08)",
          }}
        />
      </div>
      {/* Accordion rows */}
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            padding: "22px 0",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div
            style={{
              height: "14px",
              width: `${60 + n * 8}%`,
              borderRadius: "3px",
              background: "rgba(255,255,255,0.06)",
              animation: "shimmer 1.5s ease-in-out infinite",
            }}
          />
          <div
            style={{
              height: "14px",
              width: `${40 + n * 5}%`,
              borderRadius: "3px",
              background: "rgba(255,255,255,0.04)",
              animation: `shimmer 1.5s ease-in-out ${n * 0.1}s infinite`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FAQPage() {
  const [sections, setSections] = useState<MappedFaqSection[]>([]);
  const [categories, setCategories] = useState<ApiFaqCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const { sections: s, categories: c } = await fetchMappedFaqs();
      setSections(s);
      setCategories(c);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load FAQs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Category pills: "All" + active categories that have FAQs
  const categoryLabels = useMemo(() => {
    const titlesWithFaqs = new Set(sections.map((s) => s.category));
    const filtered = categories.filter((c) => titlesWithFaqs.has(c.title));
    return ["All", ...filtered.map((c) => c.title)];
  }, [sections, categories]);

  // Filter sections by search + active category
  const filteredSections = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return sections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          const catMatch =
            activeCategory === "All" || section.category === activeCategory;
          const textMatch =
            !q ||
            item.question.toLowerCase().includes(q) ||
            item.answer.toLowerCase().includes(q);
          return catMatch && textMatch;
        }),
      }))
      .filter((s) => s.items.length > 0);
  }, [sections, searchQuery, activeCategory]);

  const toggleItem = (key: string) =>
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <>
      <Navbar />
      <PageHero title="FAQ" currentPage="FAQ" />

      {/* ── Hero ── */}
      <section
        style={{
          paddingTop: "40px",
          paddingBottom: "60px",
          background: "var(--bg, #0a0a0a)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="container">
          <AnimatedSection>
            <div className="section-label">Support</div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(48px, 6vw, 80px)",
                marginTop: "8px",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
              }}
            >
              Frequently Asked
              <br />
              <span style={{ color: "var(--gold, #C9A84C)" }}>Questions</span>
            </h1>
            <p
              style={{
                color: "var(--text-muted, rgba(255,255,255,0.55))",
                fontSize: "16px",
                maxWidth: "480px",
                marginTop: "20px",
                lineHeight: 1.75,
              }}
            >
              Everything you need to know about orders, books, shipping, and
              working with me. Can't find an answer?{" "}
              <Link
                href="/contact"
                style={{
                  color: "var(--gold, #C9A84C)",
                  textDecoration: "underline",
                }}
              >
                Drop me a message.
              </Link>
            </p>

            {/* Search */}
            <div
              style={{
                marginTop: "36px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                maxWidth: "480px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "0 16px",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }}
              >
                <circle
                  cx="7"
                  cy="7"
                  r="5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M11 11L14 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Search questions…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "var(--text, #fff)",
                  fontSize: "14px",
                  padding: "14px 0",
                  fontFamily: "inherit",
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.3)",
                    cursor: "pointer",
                    padding: "0",
                    fontSize: "18px",
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              )}
            </div>

            {/* Category pills */}
            {!loading && !error && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginTop: "20px",
                }}
              >
                {categoryLabels.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      padding: "7px 16px",
                      borderRadius: "100px",
                      border: "1px solid",
                      borderColor:
                        activeCategory === cat
                          ? "var(--gold, #C9A84C)"
                          : "rgba(255,255,255,0.1)",
                      background:
                        activeCategory === cat
                          ? "rgba(201,168,76,0.12)"
                          : "transparent",
                      color:
                        activeCategory === cat
                          ? "var(--gold, #C9A84C)"
                          : "rgba(255,255,255,0.45)",
                      fontSize: "12px",
                      letterSpacing: "0.06em",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      fontFamily: "inherit",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* ── FAQ Body ── */}
      <section
        className="section"
        style={{
          background: "#0c0c0c",
          paddingTop: "72px",
          paddingBottom: "120px",
        }}
      >
        <div className="container">
          {/* ── Loading skeletons ── */}
          {loading && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(min(100%, 560px), 1fr))",
                gap: "48px 64px",
                alignItems: "start",
              }}
            >
              {[1, 2, 3, 4].map((n) => (
                <SkeletonSection key={n} />
              ))}
            </div>
          )}

          {/* ── Error ── */}
          {!loading && error && (
            <AnimatedSection>
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <AlertCircle
                  size={36}
                  style={{
                    color: "#C47C5A",
                    marginBottom: "16px",
                    opacity: 0.7,
                  }}
                />
                <p
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    fontSize: "15px",
                    margin: "0 0 24px",
                  }}
                >
                  {error}
                </p>
                <button
                  onClick={loadData}
                  style={{
                    padding: "10px 24px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "4px",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "12px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Try Again
                </button>
              </div>
            </AnimatedSection>
          )}

          {/* ── No search results ── */}
          {!loading && !error && filteredSections.length === 0 && (
            <AnimatedSection>
              <div
                style={{
                  textAlign: "center",
                  padding: "80px 0",
                  color: "var(--text-muted, rgba(255,255,255,0.35))",
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔍</div>
                <p style={{ fontSize: "16px", margin: 0 }}>
                  {searchQuery ? (
                    <>
                      No results for &ldquo;
                      <strong style={{ color: "var(--text, #fff)" }}>
                        {searchQuery}
                      </strong>
                      &rdquo;. Try a different keyword.
                    </>
                  ) : (
                    "No FAQs available in this category."
                  )}
                </p>
              </div>
            </AnimatedSection>
          )}

          {/* ── FAQ sections grid ── */}
          {!loading && !error && filteredSections.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(min(100%, 560px), 1fr))",
                gap: "48px 64px",
                alignItems: "start",
              }}
            >
              {filteredSections.map((section, si) => (
                <AnimatedSection key={section.categoryId} delay={si * 0.08}>
                  {/* Category header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>{section.icon}</span>
                    <h2
                      style={{
                        fontSize: "11px",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "var(--gold, #C9A84C)",
                        margin: 0,
                        fontWeight: 600,
                      }}
                    >
                      {section.category}
                    </h2>
                    <div
                      style={{
                        flex: 1,
                        height: "1px",
                        background: "rgba(201,168,76,0.15)",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.2)",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {section.items.length} Q
                    </span>
                  </div>

                  {/* Accordion */}
                  <div>
                    {section.items.map((item, ii) => {
                      const key = `${si}-${ii}`;
                      return (
                        <AccordionItem
                          key={item.id}
                          question={item.question}
                          answer={item.answer}
                          isOpen={!!openItems[key]}
                          onToggle={() => toggleItem(key)}
                        />
                      );
                    })}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}

          {/* ── Still have questions CTA ── */}
          {!loading && !error && filteredSections.length > 0 && (
            <AnimatedSection delay={0.3}>
              <div
                style={{
                  marginTop: "96px",
                  padding: "56px 48px",
                  background: "rgba(201,168,76,0.04)",
                  border: "1px solid rgba(201,168,76,0.12)",
                  borderRadius: "12px",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "32px",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(24px, 3vw, 36px)",
                      margin: "0 0 12px",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Still have questions?
                  </h3>
                  <p
                    style={{
                      color: "var(--text-muted, rgba(255,255,255,0.5))",
                      fontSize: "14px",
                      lineHeight: 1.7,
                      margin: 0,
                      maxWidth: "360px",
                    }}
                  >
                    Can't find what you're looking for? I reply to all messages
                    within one business day.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <Link
                    href="/contact"
                    className="btn-outline"
                    style={{ display: "inline-flex" }}
                  >
                    Contact Me
                  </Link>
                  <Link
                    href="/newsletter"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "12px 24px",
                      background: "var(--gold, #C9A84C)",
                      color: "#0a0a0a",
                      borderRadius: "4px",
                      fontSize: "13px",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      textDecoration: "none",
                    }}
                  >
                    Join Newsletter
                  </Link>
                </div>
              </div>
            </AnimatedSection>
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
