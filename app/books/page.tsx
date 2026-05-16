"use client";
import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import PageHero from "@/components/HeroPage";
import Navbar from "@/components/Navbar";
import {
  formatPrice,
  getAllProducts,
  imageUrl,
  lowestPrice,
  type Product,
} from "@/lib/api/product";
import { ArrowRight, BookOpen, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// ─── Tag colours cycle ───────────────────────────────────────────────────────
const TAG_COLORS = [
  "from-amber-950 to-stone-950",
  "from-slate-950 to-zinc-950",
  "from-emerald-950 to-slate-950",
  "from-violet-950 to-indigo-950",
  "from-rose-950 to-slate-950",
];

function coverGradient(book: Product, index: number) {
  if (book.cover_color) {
    return `linear-gradient(135deg, ${book.cover_color}dd, ${book.cover_accent ?? book.cover_color}99)`;
  }
  return undefined;
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
function BookCardSkeleton() {
  return (
    <div
      className="card"
      style={{
        display: "grid",
        gridTemplateColumns: "320px 1fr",
        gap: 0,
        overflow: "hidden",
        opacity: 0.5,
      }}
    >
      <div style={{ background: "#111", height: "400px" }} />
      <div
        style={{
          padding: "48px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          style={{
            height: "12px",
            width: "120px",
            background: "#222",
            borderRadius: "4px",
          }}
        />
        <div
          style={{
            height: "32px",
            width: "80%",
            background: "#222",
            borderRadius: "4px",
          }}
        />
        <div
          style={{
            height: "16px",
            width: "60%",
            background: "#1a1a1a",
            borderRadius: "4px",
          }}
        />
        <div
          style={{
            height: "80px",
            width: "100%",
            background: "#1a1a1a",
            borderRadius: "4px",
            marginTop: "8px",
          }}
        />
        <div style={{ display: "flex", gap: "12px", marginTop: "auto" }}>
          <div
            style={{
              height: "40px",
              width: "140px",
              background: "#222",
              borderRadius: "8px",
            }}
          />
          <div
            style={{
              height: "40px",
              width: "120px",
              background: "#1a1a1a",
              borderRadius: "8px",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Book Card ────────────────────────────────────────────────────────────────
function BookCard({ book, index }: { book: Product; index: number }) {
  const cheapest = lowestPrice(book.formats);
  const imgSrc = imageUrl(book.main_image?.medium ?? book.main_image?.original);
  const hasImage = !!imgSrc;
  const bgGrad = coverGradient(book, index);

  return (
    <div
      className="card book-card"
      style={{
        display: "grid",
        gridTemplateColumns: "320px 1fr",
        gap: 0,
        background: "#648181",
        overflow: "hidden",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      {/* Cover Panel */}
      <div
        style={{
          background: bgGrad ?? `linear-gradient(135deg, #0f0f14, #1a1520)`,
          display: "flex",
          alignItems: "stretch",
          justifyContent: "center",
          padding: "0",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          position: "relative",
          minHeight: "420px",
        }}
      >
        {/* Cover image or placeholder */}
        {hasImage ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "6px",
              overflow: "hidden",
              boxShadow:
                "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
            }}
          >
            <img
              src={imgSrc}
              alt={book.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              loading="lazy"
            />
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              maxWidth: "180px",
              aspectRatio: "2/3",
              background: `linear-gradient(135deg, ${book.cover_color ?? "#667eea"}22, ${book.cover_accent ?? "#f59e0b"}11)`,
              border: `1px solid ${book.cover_color ?? "rgba(201,168,76,0.2)"}44`,
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BookOpen
              size={40}
              style={{
                color: book.cover_accent ?? "var(--gold)",
                opacity: 0.35,
              }}
            />
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div
        style={{
          padding: "44px 48px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            color: "#fff9",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {[book.author, book.year, book.pages ? `${book.pages} pages` : null]
            .filter(Boolean)
            .join(" · ")}
        </div>

        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(26px, 2.5vw, 38px)",
            color: "#fff",
            marginTop: "10px",
            lineHeight: 1.1,
          }}
        >
          {book.title}
        </h2>

        {book.subtitle && (
          <p
            style={{
              fontSize: "15px",
              color: book.cover_accent ?? "#fff",
              marginTop: "6px",
              fontStyle: "italic",
            }}
          >
            {book.subtitle}
          </p>
        )}

        {book.description && (
          <div
            className="book-description"
            style={{
              fontSize: "14px",
              color: "#fff",
              lineHeight: 1.75,
              marginTop: "18px",
              maxWidth: "520px",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
            dangerouslySetInnerHTML={{
              __html: book.description,
            }}
          />
        )}

        {/* Formats pricing pills */}
        {book.formats?.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginTop: "22px",
            }}
          >
            {book.formats.map((f) => (
              <span
                key={f.id}
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  padding: "5px 12px",
                  borderRadius: "20px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  letterSpacing: "0.04em",
                }}
              >
                {f.label}
                <span
                  style={{
                    color: book.cover_accent ?? "var(--gold)",
                    fontWeight: 700,
                  }}
                >
                  {formatPrice(f.price)}
                </span>
                {f.badge && (
                  <span
                    style={{
                      background: book.cover_accent
                        ? `${book.cover_accent}22`
                        : "rgba(201,168,76,0.15)",
                      color: book.cover_accent ?? "var(--gold)",
                      padding: "1px 6px",
                      borderRadius: "10px",
                      fontSize: "9px",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {f.badge}
                  </span>
                )}
              </span>
            ))}
          </div>
        )}

        {/* Praise */}
        {book.praise && (
          <blockquote
            style={{
              borderLeft: `3px solid ${book.cover_accent ?? "var(--gold)"}`,
              paddingLeft: "16px",
              marginTop: "20px",
              color: "var(--text-dim)",
              fontSize: "13px",
              fontStyle: "italic",
              lineHeight: 1.6,
            }}
          >
            &ldquo;{book.praise.slice(0, 120)}
            {book.praise.length > 120 ? "…" : ""}&rdquo;
            {book.praise_author && (
              <cite
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontStyle: "normal",
                  marginTop: "6px",
                  color: book.cover_accent ?? "var(--gold)",
                  letterSpacing: "0.06em",
                }}
              >
                — {book.praise_author}
              </cite>
            )}
          </blockquote>
        )}

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: "14px",
            marginTop: "auto",
            paddingTop: "28px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {cheapest && (
            <a href="#" className="btn-primary" style={{ gap: "8px" }}>
              <ShoppingCart size={14} />
              Buy · {formatPrice(cheapest.price)}
            </a>
          )}
          <Link
            href={`/books/${book.slug}`}
            className="btn-outline"
            style={{ gap: "8px" }}
          >
            View Book <ArrowRight size={13} />
          </Link>

          {book.stock === 0 && (
            <span
              style={{
                fontSize: "11px",
                color: "#ef4444",
                letterSpacing: "0.06em",
                fontWeight: 600,
              }}
            >
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BooksPage() {
  const [books, setBooks] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllProducts()
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((e) => {
        setError("Failed to load books.");
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <PageHero title="Published Books" currentPage="Books" />

      {/* ── Hero ── */}
      <section
        style={{
          paddingBottom: "60px",
          background: "var(--bg)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative blur */}
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "-80px",
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div className="container">
          <AnimatedSection>
            <div className="section-label">Published Works</div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(52px, 6vw, 84px)",
                marginTop: "8px",
                lineHeight: 1,
              }}
            >
              Books
            </h1>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "17px",
                maxWidth: "480px",
                marginTop: "16px",
                lineHeight: 1.7,
              }}
            >
              {loading
                ? "Loading titles…"
                : `${books.length} title${books.length !== 1 ? "s" : ""} available across multiple formats.`}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Book List ── */}
      <section style={{ background: "var(--bg)", paddingBottom: "120px" }}>
        <div className="container">
          {loading && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "40px" }}
            >
              {[1, 2, 3].map((i) => (
                <BookCardSkeleton key={i} />
              ))}
            </div>
          )}

          {error && (
            <div
              style={{
                textAlign: "center",
                padding: "80px 20px",
                color: "var(--text-muted)",
              }}
            >
              <p style={{ fontSize: "17px" }}>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-outline"
                style={{ marginTop: "20px", cursor: "pointer" }}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && books.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "80px 20px",
                color: "var(--text-dim)",
              }}
            >
              <BookOpen
                size={48}
                style={{ opacity: 0.2, marginBottom: "16px" }}
              />
              <p>No books found.</p>
            </div>
          )}

          {!loading && !error && books.length > 0 && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "48px" }}
            >
              {books.map((book, i) => (
                <AnimatedSection key={book.id} delay={i * 0.08}>
                  <BookCard book={book} index={i} />
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>

        <style>{`
          .book-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 24px 60px rgba(0,0,0,0.4) !important;
          }
            .book-description,
.book-description * {
  color: #fff !important;
}

.book-description p,
.book-description span {
  color: #fff !important;
}
          @media(max-width: 900px) {
            .book-card {
              grid-template-columns: 1fr !important;
            }
            .book-card > div:first-child {
              min-height: 260px !important;
              padding: 36px !important;
            }
          }
        `}</style>
      </section>

      <Footer />
    </>
  );
}
