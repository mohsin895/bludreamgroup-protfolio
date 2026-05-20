"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const IMG_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "";

interface Product {
  id: number;
  title: string;
  slug: string;
  subtitle?: string;
  author?: string;
  short_description?: string;
  main_image?: { small?: string; original?: string } | string | null;
  formats?: Array<{ price: number; format?: string }>;
  cover_color?: string;
  cover_accent?: string;
}

function imageUrl(path?: string): string | null {
  if (!path) return null;
  return `${IMG_BASE}${path}`;
}

function lowestPrice(
  formats?: Array<{ price: number }>,
): { price: number } | null {
  if (!formats?.length) return null;
  return formats.reduce((a, b) => (a.price < b.price ? a : b));
}

function formatPrice(price: number): string {
  return `৳${price.toLocaleString()}`;
}

function parseMainImage(
  raw: unknown,
): { small?: string; original?: string } | null {
  if (!raw) return null;
  if (typeof raw === "object")
    return raw as { small?: string; original?: string };
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return null;
}

async function getFeaturedProducts(count = 3): Promise<Product[]> {
  try {
    const r = await fetch(`${API_BASE}/products?featured=1&limit=${count}`);
    const json = await r.json();
    const data = json?.data ?? json;
    return Array.isArray(data) ? data.slice(0, count) : [];
  } catch {
    return [];
  }
}

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.13 } } };

function BookCard({ book }: { book: Product }) {
  const img = parseMainImage(book.main_image);
  const imgSrc = imageUrl(img?.small ?? img?.original);
  const cheapest = lowestPrice(book.formats);

  return (
    <motion.div variants={fadeUp}>
      <Link
        href={`/books/${book.slug}`}
        style={{ textDecoration: "none", display: "block", height: "100%" }}
      >
        <div
          className="book-card"
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            overflow: "hidden",
            transition: "all 0.3s ease",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Cover */}
          <div
            style={{
              aspectRatio: "3/4",
              overflow: "hidden",
              background: book.cover_color
                ? `linear-gradient(160deg, ${book.cover_color}22, ${book.cover_color}08)`
                : "linear-gradient(160deg, #6c7e7f15, #95a49a10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={book.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.5s ease",
                }}
                className="book-img"
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  opacity: 0.3,
                }}
              >
                <BookOpen size={48} color="#6c7e7f" />
                <span
                  style={{
                    fontSize: 11,
                    color: "#6c7e7f",
                    letterSpacing: "0.1em",
                    fontWeight: 600,
                  }}
                >
                  NO COVER
                </span>
              </div>
            )}

            {/* Price overlay */}
            {cheapest && (
              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  background: "#6c7e7f",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 800,
                  padding: "6px 14px",
                  borderRadius: 20,
                  boxShadow: "0 4px 12px rgba(108,126,127,0.4)",
                }}
              >
                {formatPrice(cheapest.price)}
              </div>
            )}
          </div>

          {/* Info */}
          <div
            style={{
              padding: "20px",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {book.author && (
              <p
                style={{
                  fontSize: 10,
                  color: "#9aa6aa",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                {book.author}
              </p>
            )}

            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 18,
                color: "#1f2937",
                lineHeight: 1.2,
                marginBottom: 6,
                fontWeight: 700,
              }}
            >
              {book.title}
            </h3>

            {book.subtitle && (
              <p
                style={{
                  fontSize: 12,
                  color: "#95a49a",
                  fontStyle: "italic",
                  marginBottom: 8,
                  opacity: 0.9,
                }}
              >
                {book.subtitle}
              </p>
            )}

            {book.short_description && (
              <p
                style={
                  {
                    fontSize: 12,
                    color: "#6b7280",
                    lineHeight: 1.7,
                    flex: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    marginBottom: 16,
                  } as React.CSSProperties
                }
              >
                {book.short_description}
              </p>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "auto",
                paddingTop: 14,
                borderTop: "1px solid #f3f4f6",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: "#95a49a",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                View Details <ArrowRight size={10} />
              </span>
              <button
                className="book-buy-btn"
                style={{
                  background: "#95a49a",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div
      style={{
        background: "#f8f9fa",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        overflow: "hidden",
        opacity: 0.6,
      }}
    >
      <div style={{ aspectRatio: "3/4", background: "#e5e7eb" }} />
      <div
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div
          style={{
            height: 10,
            width: "50%",
            background: "#e5e7eb",
            borderRadius: 4,
          }}
        />
        <div
          style={{
            height: 20,
            width: "80%",
            background: "#e9e9e9",
            borderRadius: 4,
          }}
        />
        <div style={{ height: 32, background: "#f0f0f0", borderRadius: 4 }} />
      </div>
    </div>
  );
}

export default function BooksSection() {
  const [books, setBooks] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedProducts(3).then((data) => {
      setBooks(data);
      setLoading(false);
    });
  }, []);

  return (
    <section style={{ background: "#f8f9fa", padding: "50px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <motion.span
            variants={fadeUp}
            style={{
              display: "inline-block",
              background: "#6c7e7f1a",
              color: "#6c7e7f",
              borderRadius: 40,
              padding: "6px 20px",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Published Works
          </motion.span>
          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(34px, 4vw, 54px)",
              color: "#1f2937",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Books That{" "}
            <span style={{ color: "#6c7e7f", fontStyle: "italic" }}>
              Change Minds
            </span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            style={{
              fontSize: 16,
              color: "#6b7280",
              maxWidth: 480,
              margin: "20px auto 0",
              lineHeight: 1.75,
            }}
          >
            Every book is a complete toolkit for transformation — built on real
            experience, research, and deep human understanding.
          </motion.p>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div
            className="books-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 28,
            }}
          >
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : books.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}
          >
            <BookOpen size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p>No books available right now.</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="books-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 28,
            }}
          >
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </motion.div>
        )}

        {!loading && books.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            style={{ textAlign: "center", marginTop: 56 }}
          >
            <Link
              href="/books"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#6c7e7f",
                color: "#fff",
                padding: "14px 32px",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "all 0.25s",
                boxShadow: "0 4px 16px rgba(108,126,127,0.25)",
              }}
              className="books-cta"
            >
              View All Books <ArrowRight size={14} />
            </Link>
          </motion.div>
        )}
      </div>

      <style>{`
        .book-card:hover { transform: translateY(-8px); box-shadow: 0 24px 56px rgba(108,126,127,0.14); border-color: #95a49a !important; }
        .book-card:hover .book-img { transform: scale(1.05); }
        .book-buy-btn:hover { background: #6c7e7f !important; transform: translateY(-1px); }
        .books-cta:hover { background: #5a6b6c !important; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(108,126,127,0.3) !important; }
        @media (max-width: 900px) { .books-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) { .books-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
