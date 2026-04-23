"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Loader2 } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { getFeaturedProducts, imageUrl, formatPrice, lowestPrice, type Product } from "@/lib/api/product";

// ─── Single book card ────────────────────────────────────────────────────────
function BookCard({ book, delay }: { book: Product; delay: number }) {
    const cheapest = lowestPrice(book.formats);
    const imgSrc = imageUrl(book.main_image?.small ?? book.main_image?.original);
    const accent = book.cover_accent ?? "var(--gold)";

    return (
        <AnimatedSection delay={delay}>
            <Link href={`/books/${book.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
                <div
                    className="home-book-card card"
                    style={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        cursor: "pointer",
                    }}
                >
                    {/* Cover */}
                    <div
                        style={{
                            background: book.cover_color
                                ? `linear-gradient(150deg, ${book.cover_color}ee, ${book.cover_accent ?? book.cover_color}99)`
                                : "#111",
                            aspectRatio: "3/4",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "36px",
                            borderBottom: "1px solid rgba(255,255,255,0.04)",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {/* Ambient glow */}
                        {book.cover_color && (
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    background: `radial-gradient(circle at 50% 30%, ${book.cover_color}44, transparent 65%)`,
                                    pointerEvents: "none",
                                }}
                            />
                        )}

                        {/* Badge */}
                        {book.genre && (
                            <div style={{ position: "absolute", top: "16px", right: "16px", zIndex: 2 }}>
                <span
                    className="tag"
                    style={{
                        background: accent !== "var(--gold)" ? `${accent}22` : undefined,
                        borderColor: accent !== "var(--gold)" ? `${accent}55` : undefined,
                        color: accent !== "var(--gold)" ? accent : undefined,
                        fontSize: "9px",
                    }}
                >
                  {book.genre}
                </span>
                            </div>
                        )}

                        {/* Cover image or placeholder */}
                        {imgSrc ? (
                            <div
                                style={{
                                    width: "100%",
                                    height: "200px",
                                    maxWidth: "130px",
                                    position: "relative",
                                    zIndex: 1,
                                }}
                            >
                                <img
                                    src={imgSrc}
                                    alt={book.title}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        borderRadius: "4px",
                                        boxShadow: `0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)`,
                                        display: "block",
                                    }}
                                />
                            </div>
                        ) : (
                            <div
                                style={{
                                    width: "100%",
                                    height: "200px",
                                    maxWidth: "130px",
                                    background: `linear-gradient(135deg, ${book.cover_color ?? "#667eea"}22, ${accent !== "var(--gold)" ? accent : "#f59e0b"}11)`,
                                    border: `1px solid ${accent !== "var(--gold)" ? accent : "rgba(201,168,76,0.2)"}44`,
                                    borderRadius: "4px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    position: "relative",
                                    zIndex: 1,
                                }}
                            >
                                <BookOpen size={36} style={{ color: accent, opacity: 0.3 }} />
                            </div>
                        )}

                        {/* Year chip */}
                        <div
                            style={{
                                position: "absolute",
                                bottom: "14px",
                                left: "14px",
                                fontSize: "10px",
                                color: "rgba(255,255,255,0.3)",
                                letterSpacing: "0.1em",
                                fontWeight: 600,
                            }}
                        >
                            {book.year}
                        </div>
                    </div>

                    {/* Info */}
                    <div
                        style={{
                            padding: "24px",
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {/* Author */}
                        <p
                            style={{
                                fontSize: "10px",
                                color: "var(--text-dim)",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                fontWeight: 600,
                                marginBottom: "6px",
                            }}
                        >
                            {book.author ?? ""}
                        </p>

                        {/* Title */}
                        <h3
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "22px",
                                color: "var(--text)",
                                lineHeight: 1.15,
                            }}
                        >
                            {book.title}
                        </h3>

                        {/* Subtitle */}
                        {book.subtitle && (
                            <p
                                style={{
                                    fontSize: "12px",
                                    color: accent,
                                    marginTop: "4px",
                                    fontStyle: "italic",
                                    opacity: 0.8,
                                }}
                            >
                                {book.subtitle}
                            </p>
                        )}

                        {/* Short description */}
                        {book.short_description && (
                            <p
                                style={{
                                    fontSize: "12px",
                                    color: "var(--text-dim)",
                                    marginTop: "10px",
                                    lineHeight: 1.65,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                }}
                            >
                                {book.short_description}
                            </p>
                        )}

                        {/* Price + CTA */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginTop: "auto",
                                paddingTop: "18px",
                            }}
                        >
                            {cheapest ? (
                                <span style={{ fontSize: "15px", fontWeight: 700, color: accent }}>
                  {formatPrice(cheapest.price)}
                </span>
                            ) : (
                                <span />
                            )}
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    fontSize: "11px",
                                    color: accent,
                                    fontWeight: 700,
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                }}
                            >
                Details <ArrowRight size={11} />
              </span>
                        </div>
                    </div>
                </div>
            </Link>
        </AnimatedSection>
    );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div
            style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "12px",
                overflow: "hidden",
                opacity: 0.4,
            }}
        >
            <div style={{ background: "#111", aspectRatio: "3/4" }} />
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ height: "10px", width: "80px", background: "#222", borderRadius: "4px" }} />
                <div style={{ height: "22px", width: "70%", background: "#1a1a1a", borderRadius: "4px" }} />
                <div style={{ height: "32px", width: "100%", background: "#161616", borderRadius: "4px" }} />
            </div>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Books() {
    const [books, setBooks] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getFeaturedProducts(3).then((data) => {
            setBooks(data);
            setLoading(false);
        });
    }, []);

    return (
        <section className="section" style={{ background: "#0c0c0c" }}>
            <div className="container">
                {/* Header */}
                <AnimatedSection style={{ textAlign: "center", marginBottom: "56px" }}>
                    <div className="section-label" style={{ justifyContent: "center" }}>
                        Published Works
                    </div>
                    <h2
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(40px, 4vw, 56px)",
                        }}
                    >
                        Books That Change Minds
                    </h2>
                    {!loading && books.length > 0 && (
                        <p style={{ color: "var(--text-dim)", fontSize: "14px", marginTop: "12px" }}>
                            {books.length} title{books.length !== 1 ? "s" : ""} available
                        </p>
                    )}
                </AnimatedSection>

                {/* Grid */}
                {loading ? (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "24px",
                        }}
                        className="books-grid"
                    >
                        {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
                    </div>
                ) : books.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-dim)" }}>
                        <BookOpen size={40} style={{ opacity: 0.2, marginBottom: "12px" }} />
                        <p>No books available right now.</p>
                    </div>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "24px",
                        }}
                        className="books-grid"
                    >
                        {books.map((book, i) => (
                            <BookCard key={book.id} book={book} delay={i * 0.1} />
                        ))}
                    </div>
                )}

                {/* Footer CTA */}
                {!loading && books.length > 0 && (
                    <div style={{ textAlign: "center", marginTop: "48px" }}>
                        <Link href="/books" className="btn-outline">
                            View All Books <ArrowRight size={13} style={{ marginLeft: "6px" }} />
                        </Link>
                    </div>
                )}
            </div>

            <style>{`
        .home-book-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.4) !important;
        }
        @media(max-width: 900px) {
          .books-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media(max-width: 560px) {
          .books-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </section>
    );
}