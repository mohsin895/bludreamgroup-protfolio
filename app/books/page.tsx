"use client";

import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import PageHero from "@/components/HeroPage";
import Navbar from "@/components/Navbar";
// import PageHero from "@/components/PageHero";
import {
  formatPrice,
  getAllProducts,
  imageUrl,
  lowestPrice,
  type Product,
} from "@/lib/api/product";

import { motion } from "framer-motion";
import { BookOpen, Eye, ShoppingCart } from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";

// ─────────────────────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────────────────────
function BookCardSkeleton() {
  return (
    <div className="modern-book-card skeleton-card">
      <div className="modern-book-image-wrap skeleton-img" />

      <div className="modern-book-content">
        <div className="skeleton-line short" />
        <div className="skeleton-line title" />
        <div className="skeleton-line medium" />

        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 20,
          }}
        >
          <div className="skeleton-price old" />
          <div className="skeleton-price new" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Book Card
// ─────────────────────────────────────────────────────────────
export function BookCard({ book, index }: { book: Product; index: number }) {
  const cheapest = lowestPrice(book.formats);

  const imgSrc = imageUrl(book.main_image?.medium ?? book.main_image?.original);

  return (
    <motion.div
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="modern-book-card"
    >
      {/* IMAGE */}
      <div className="modern-book-image-wrap">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={book.title}
            className="modern-book-image"
            loading="lazy"
          />
        ) : (
          <div className="placeholder-book">
            <BookOpen size={48} />
          </div>
        )}

        {/* Discount Badge */}
        {book.has_discount === "yes" &&
          book.discount_amount &&
          cheapest?.price && (
            <div className="discount-badge font-xolonium">
              -
              {Math.round(
                (Number(book.discount_amount) / Number(cheapest.price)) * 100,
              )}
              %
            </div>
          )}

        {/* Overlay */}
        <div className="modern-book-overlay">
          <div className="modern-book-icons">
            <Link href={`/books/${book.slug}`}>
              <button>
                <ShoppingCart size={18} />
              </button>
            </Link>

            <Link href={`/books/${book.slug}`}>
              <Eye size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="modern-book-content">
        <div className="modern-book-category">
          {/* {book.category?.name || "Motivation"} */}
        </div>

        <h3 className="font-rising">{book.title}</h3>

        <p className="author font-xolonium">
          By {book.author || "Unknown Author"}
        </p>

        <div className="price-row font-xolonium">
          {book.has_discount === "yes" &&
          book.discount_amount &&
          cheapest?.price ? (
            <>
              <span className="old-price">{formatPrice(cheapest.price)}</span>

              <span className="new-price">
                {formatPrice(
                  Number(cheapest.price) - Number(book.discount_amount),
                )}
              </span>
            </>
          ) : (
            <span className="new-price">
              {formatPrice(cheapest?.price || 0)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────
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
      .catch(() => {
        setError("Failed to load books.");
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />

      <PageHero title="Published Books" currentPage="Books" />

      {/* HERO */}
      <section
        style={{
          paddingBottom: "60px",
          background: "var(--bg)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="container">
          <AnimatedSection>
            <div className="section-label font-xolonium">Published Works</div>

            <h1
              style={{
                fontFamily: "Venus Rising",
                fontSize: "clamp(22px, 6vw, 44px)",
                marginTop: "8px",
                lineHeight: 1,
              }}
            >
              Books
            </h1>

            <p
              className="font-xolonium"
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
                : `${books.length} title${
                    books.length !== 1 ? "s" : ""
                  } available across multiple formats.`}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* BOOK GRID */}
      <section
        style={{
          background: "var(--bg)",
          paddingBottom: "120px",
        }}
      >
        <div className="container">
          {/* Loading */}
          {loading && (
            <div className="books-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <BookCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              style={{
                textAlign: "center",
                padding: "80px 20px",
              }}
            >
              <p>{error}</p>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && books.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "80px 20px",
              }}
            >
              <BookOpen
                size={48}
                style={{
                  opacity: 0.2,
                  marginBottom: "16px",
                }}
              />

              <p>No books found.</p>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && books.length > 0 && (
            <div className="books-grid">
              {books.map((book, i) => (
                <BookCard key={book.id} book={book} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* STYLES */}
        <style>{`
        
          .books-grid{
            display:grid;
            grid-template-columns:repeat(3,1fr);
            gap:40px;
          }

          .modern-book-card{
            background:#fff;
            overflow:hidden;
            transition:all .35s ease;
            position:relative;
          }

          .modern-book-card:hover{
            transform:translateY(-8px);
          }

          .modern-book-image-wrap{
            position:relative;
            overflow:hidden;
            background:#f3f4f6;
          }

          .modern-book-image{
            width:100%;
            height:520px;
            object-fit:cover;
            display:block;
            transition:transform .6s ease;
          }

          .modern-book-card:hover .modern-book-image{
            transform:scale(1.08);
          }

          .modern-book-overlay{
            position:absolute;
            inset:0;
            background:rgba(0,0,0,.25);
            display:flex;
            align-items:center;
            justify-content:center;
            opacity:0;
            transition:.35s ease;
          }

          .modern-book-card:hover .modern-book-overlay{
            opacity:1;
          }

          .modern-book-icons{
            display:flex;
            gap:12px;
          }

          .modern-book-icons button,
          .modern-book-icons a{
            width:50px;
            height:50px;
            border:none;
            background:#fff;
            color:#111827;
            border-radius:10px;
            display:flex;
            align-items:center;
            justify-content:center;
            cursor:pointer;
            transition:.25s ease;
            text-decoration:none;
          }

          .modern-book-icons button:hover,
          .modern-book-icons a:hover{
            background:#ef8e7f;
            color:#fff;
            transform:translateY(-4px);
          }

          .discount-badge{
            position:absolute;
            top:18px;
            left:0;
            background:#ef8e7f;
            color:#fff;
            font-size:13px;
            font-weight:700;
            padding:8px 16px;
            border-radius:0 6px 6px 0;
            z-index:5;
          }

          .modern-book-content{
            padding:24px;
          }

          .modern-book-category{
            font-size:14px;
            color:#6b7280;
            margin-bottom:10px;
          }

          .modern-book-content h3{
            font-size:22px;
            line-height:1.3;
            color:#111827;
            margin-bottom:10px;
            
            transition:.25s ease;
          }

          .modern-book-content h3:hover{
            color:#648181;
          }

          .author{
            color:#6b7280;
            font-size:15px;
            margin-bottom:20px;
          }

          .price-row{
            display:flex;
            gap:12px;
            align-items:center;
            flex-wrap:wrap;
          }

          .old-price{
            color:#d1d5db;
            text-decoration:line-through;
            font-size:12px;
          }

          .new-price{
            color:#000;
            font-size:22px;
            font-weight:500;
            
            line-height:1;
          }

          .placeholder-book{
            width:100%;
            height:520px;
            display:flex;
            align-items:center;
            justify-content:center;
            background:linear-gradient(135deg,#64818122,#95a49a22);
            color:#648181;
          }

          /* Skeleton */

          .skeleton-card{
            pointer-events:none;
          }

          .skeleton-img{
            height:520px;
            background:#e5e7eb;
          }

          .skeleton-line{
            height:14px;
            background:#e5e7eb;
            border-radius:4px;
            margin-bottom:12px;
          }

          .skeleton-line.short{
            width:100px;
          }

          .skeleton-line.medium{
            width:160px;
          }

          .skeleton-line.title{
            width:80%;
            height:28px;
          }

          .skeleton-price{
            height:24px;
            border-radius:4px;
            background:#e5e7eb;
          }

          .skeleton-price.old{
            width:80px;
          }

          .skeleton-price.new{
            width:120px;
          }

          /* Responsive */

          @media(max-width:1100px){

            .books-grid{
              grid-template-columns:repeat(2,1fr);
            }

          }

          @media(max-width:768px){

            .books-grid{
              grid-template-columns:1fr;
              gap:28px;
            }

            .modern-book-image{
              height:420px;
            }

            .placeholder-book{
              height:420px;
            }

            .modern-book-content{
              padding:20px;
            }

            .modern-book-content h3{
              font-size:28px;
            }

            .new-price{
              font-size:34px;
            }

          }

        `}</style>
      </section>

      <Footer />
    </>
  );
}
