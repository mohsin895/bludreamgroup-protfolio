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
import Link from "next/link";
import { useEffect, useState } from "react";

/* ─── API Configuration ─────────────────────────────────────── */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost/bludreamgroup-protfolio-api/public/api";
const IMAGE_BASE_URL =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
  "http://localhost/bludreamgroup-protfolio-api/public/";

/* ─── Unified Color Palette ─────────────────────────────────── */
const colors = [
  { color: "#C9A84C", bg: "rgba(201,168,76,0.08)" },
  { color: "#7DD4B0", bg: "rgba(125,212,176,0.08)" },
  { color: "#C97B8C", bg: "rgba(201,123,140,0.08)" },
  { color: "#8BA7E0", bg: "rgba(139,167,224,0.08)" },
];

const levelColors = {
  Beginner: { bg: "rgba(125,212,176,0.1)", color: "#7DD4B0" },
  Intermediate: { bg: "rgba(139,167,224,0.1)", color: "#8BA7E0" },
  Advanced: { bg: "rgba(201,123,140,0.1)", color: "#C97B8C" },
};

/* ─── Book Card Component ────────────────────────────────────── */
function BookCard({ book, index }: { book: Product; index: number }) {
  const colorSet = colors[index % colors.length];
  const cheapest = lowestPrice(book.formats);
  const imgSrc = imageUrl(book.main_image?.medium ?? book.main_image?.original);
  const hasImage = !!imgSrc;
  const bgGrad = book.cover_color
    ? `linear-gradient(135deg, ${book.cover_color}dd, ${book.cover_accent ?? book.cover_color}99)`
    : undefined;

  return (
    <AnimatedSection delay={index * 0.06}>
      <div
        className="card book-card"
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          gap: 0,
          background: "#648181",
          overflow: "hidden",
          borderRadius: "12px",
          transition: "all 0.32s cubic-bezier(0.16,1,0.3,1)",
          border: `1px solid rgba(255,255,255,0.06)`,
        }}
      >
        {/* Cover Panel */}
        <div
          style={{
            background: bgGrad ?? `linear-gradient(135deg, #0f0f14, #1a1520)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            borderRight: "1px solid rgba(255,255,255,0.05)",
            position: "relative",
            minHeight: "300px",
          }}
        >
          {hasImage ? (
            <img
              src={imgSrc}
              alt={book.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                borderRadius: "6px",
              }}
              loading="lazy"
            />
          ) : (
            <div
              style={{
                width: "100%",
                maxWidth: "140px",
                aspectRatio: "2/3",
                background: `linear-gradient(135deg, ${book.cover_color ?? "#667eea"}22, ${book.cover_accent ?? "#f59e0b"}11)`,
                border: `1px solid ${book.cover_color ?? "rgba(201,168,76,0.2)"}44`,
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          )}
        </div>

        {/* Info Panel */}
        <div
          style={{
            padding: "28px",
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
              marginBottom: "8px",
            }}
          >
            {[book.author, book.year, book.pages ? `${book.pages} pages` : null]
              .filter(Boolean)
              .join(" · ")}
          </div>

          <h3
            style={{
              fontSize: "clamp(16px, 1.5vw, 20px)",
              color: "#fff",
              letterSpacing: "-0.01em",
              lineHeight: 1.25,
              margin: "0 0 8px",
            }}
          >
            {book.title}
          </h3>

          {book.subtitle && (
            <p
              style={{
                fontSize: "13px",
                color: book.cover_accent ?? "#fff",
                marginBottom: "12px",
                fontStyle: "italic",
              }}
            >
              {book.subtitle}
            </p>
          )}

          {book.description && (
            <p
              style={{
                fontSize: "12px",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.6)",
                marginBottom: "16px",
                flex: 1,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
              dangerouslySetInnerHTML={{
                __html: book.description,
              }}
            />
          )}

          {/* Formats */}
          {book.formats?.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                marginBottom: "16px",
              }}
            >
              {book.formats.map((f) => (
                <span
                  key={f.id}
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    padding: "4px 10px",
                    borderRadius: "16px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#fff",
                    letterSpacing: "0.04em",
                  }}
                >
                  {f.label} · {formatPrice(f.price)}
                </span>
              ))}
            </div>
          )}

          {/* Divider */}
          <div
            style={{
              height: "1px",
              background: "rgba(255,255,255,0.05)",
              margin: "12px 0",
            }}
          />

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            {cheapest && (
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {formatPrice(cheapest.price)}
              </span>
            )}
            <Link
              href={`/books/${book.slug}`}
              style={{
                padding: "8px 14px",
                background: colorSet.color,
                border: `1px solid ${colorSet.color}44`,
                borderRadius: "5px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: "#fff",
                textDecoration: "none",
                cursor: "pointer",
                transition: "all 0.25s ease",
                whiteSpace: "nowrap",
                display: "inline-block",
              }}
            >
              View Book
            </Link>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

/* ─── Course Card Component ──────────────────────────────────── */
function CourseCard({ course, index }) {
  const colorSet = colors[index % colors.length];
  const levelColor = levelColors[course.level] || levelColors.Beginner;

  return (
    <AnimatedSection delay={index * 0.06}>
      <div
        style={{
          position: "relative",
          background: "#648181",
          border: `1px solid rgba(255,255,255,0.06)`,
          borderRadius: "12px",
          overflow: "hidden",
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          transition: "all 0.32s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            height: "3px",
            background: `linear-gradient(90deg, ${colorSet.color}, transparent)`,
            marginBottom: "16px",
            borderRadius: "2px",
          }}
        />

        {/* Category + Level */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: colorSet.color,
            }}
          >
            {course.category}
          </span>
          <span
            style={{
              fontSize: "9px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "3px 10px",
              background: levelColor.bg,
              borderRadius: "100px",
              color: levelColor.color,
            }}
          >
            {course.level}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: "clamp(17px, 1.2vw, 20px)",
            color: "#fff",
            letterSpacing: "-0.01em",
            lineHeight: 1.25,
            margin: "0 0 8px",
          }}
        >
          {course.title}
        </h3>

        {/* Subtitle */}
        <p style={{ fontSize: "13px", color: "#fff9", marginBottom: "12px" }}>
          {course.subtitle}
        </p>

        {/* Meta */}
        <div
          style={{
            fontSize: "12px",
            color: "#fff8",
            marginBottom: "16px",
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <span>◷ {course.duration}</span>
          <span>▤ {course.lessons} lessons</span>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: "13px",
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.6)",
            marginBottom: "20px",
            flex: 1,
          }}
        >
          {course.description.substring(0, 100)}...
        </p>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "rgba(255,255,255,0.05)",
            margin: "16px 0",
          }}
        />

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {course.price}
            </span>
            {course.originalPrice && (
              <div
                style={{
                  fontSize: "11px",
                  color: "#fff8",
                  textDecoration: "line-through",
                }}
              >
                {course.originalPrice}
              </div>
            )}
          </div>
          <Link
            href={`/enrollment?courseId=${course.id}`}
            style={{
              padding: "9px 16px",
              background: colorSet.color,
              border: `1px solid ${colorSet.color}44`,
              borderRadius: "5px",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              color: "#fff",
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 0.25s ease",
              whiteSpace: "nowrap",
              display: "inline-block",
            }}
          >
            Enroll
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
}

/* ─── Skeleton Loader ────────────────────────────────────────── */
function CardSkeleton() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        gap: 0,
        background: "#648181",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px",
        overflow: "hidden",
        animation: "pulse 2s infinite",
      }}
    >
      {/* Left panel (image) */}
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          minHeight: "300px",
        }}
      />
      {/* Right panel (info) */}
      <div
        style={{
          padding: "28px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          style={{
            height: "12px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "4px",
            width: "80px",
          }}
        />
        <div
          style={{
            height: "20px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "4px",
            width: "60%",
          }}
        />
        <div
          style={{
            height: "12px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "4px",
            width: "40%",
            marginTop: "8px",
          }}
        />
        <div
          style={{
            height: "60px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "4px",
            marginTop: "auto",
          }}
        />
      </div>
    </div>
  );
}

/* ─── Main Shop Page Component ───────────────────────────────── */
export default function UnifiedShopPage() {
  const [books, setBooks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [errorBooks, setErrorBooks] = useState(null);
  const [errorCourses, setErrorCourses] = useState(null);

  /* ─── Fetch Books from Product API ──────────────────────── */
  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoadingBooks(true);
        const data = await getAllProducts();
        setBooks(data);
      } catch (err) {
        setErrorBooks("Failed to load books");
        console.error("Error fetching books:", err);
      } finally {
        setLoadingBooks(false);
      }
    }
    fetchBooks();
  }, []);

  /* ─── Fetch Courses ──────────────────────────────────────── */
  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoadingCourses(true);
        const response = await fetch(`${API_BASE_URL}/course`);
        if (!response.ok) throw new Error("Failed to fetch courses");

        const data = await response.json();
        if (data.status && Array.isArray(data.data)) {
          const normalized = data.data
            .filter((c) => c.status === "active")
            .slice(0, 4)
            .map((course, index) => ({
              id: course.id,
              title: course.title,
              subtitle: course.short_description || "Learn professional skills",
              category:
                course.course_type === "video"
                  ? "Video Course"
                  : course.course_type === "pdf"
                    ? "PDF Course"
                    : "Online Learning",
              level: ["Beginner", "Intermediate", "Advanced"][index % 3],
              duration: "6 weeks",
              lessons: 8 + (course.id % 20),
              price: `$${parseFloat(course.price || 0).toFixed(2)}`,
              originalPrice:
                course.discount_price &&
                parseFloat(course.discount_price) < parseFloat(course.price)
                  ? `$${parseFloat(course.price).toFixed(2)}`
                  : null,
              description:
                course.description?.replace(/<[^>]*>/g, "") ||
                course.short_description ||
                "Professional course",
            }));
          setCourses(normalized);
        }
      } catch (err) {
        setErrorCourses("Failed to load courses");
      } finally {
        setLoadingCourses(false);
      }
    }
    fetchCourses();
  }, []);

  return (
    <>
      <Navbar />
      <PageHero title="Shop" currentPage="Shop" />

      {/* ── Hero Section ── */}
      <section
        style={{
          paddingTop: "20px",
          paddingBottom: "20px",
          background: "var(--bg)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-200px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="container">
          <AnimatedSection>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "24px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "28px",
                  height: "1px",
                  background: "var(--gold)",
                }}
              />
              <span
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                }}
              >
                Shop
              </span>
            </div>

            <h1
              style={{
                fontSize: "clamp(44px, 6.5vw, 88px)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                color: "#000",
                maxWidth: "700px",
                margin: "0 0 24px",
              }}
            >
              Books & Courses
              <br />
              <span
                style={{
                  color: "#000",
                  WebkitTextStroke: "1px rgba(201,168,76,0.55)",
                }}
              >
                worth exploring.
              </span>
            </h1>

            <p
              style={{
                fontSize: "17px",
                lineHeight: 1.75,
                color: "#000",
                maxWidth: "460px",
                marginBottom: "40px",
              }}
            >
              Curated titles and courses on creative publishing, design,
              illustration, and digital craft — from independent creators and
              professionals worldwide.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Books Section ── */}
      <section
        style={{
          background: "#648181",
          paddingTop: "80px",
          paddingBottom: "80px",
        }}
      >
        <div className="container">
          <AnimatedSection>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "40px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "24px",
                  height: "1px",
                  background: "var(--gold)",
                }}
              />
              <span
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                }}
              >
                Published Books
              </span>
            </div>
          </AnimatedSection>

          <h2
            style={{
              fontSize: "clamp(32px, 4vw, 52px)",
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "48px",
            }}
          >
            Discover Our Collection
          </h2>

          {errorBooks && (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              <p>{errorBooks}</p>
            </div>
          )}

          {loadingBooks ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "40px",
              }}
            >
              {[1, 2, 3, 4].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "48px",
              }}
            >
              {books.map((book, i) => (
                <BookCard key={book.id} book={book} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Courses Section ── */}
      <section
        style={{
          background: "#648181",
          paddingTop: "80px",
          paddingBottom: "120px",
        }}
      >
        <div className="container">
          <AnimatedSection>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "40px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "24px",
                  height: "1px",
                  background: "var(--gold)",
                }}
              />
              <span
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                }}
              >
                Learn & Master
              </span>
            </div>
          </AnimatedSection>

          <h2
            style={{
              fontSize: "clamp(32px, 4vw, 52px)",
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "48px",
            }}
          >
            Professional Courses
          </h2>

          {errorCourses && (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              <p>{errorCourses}</p>
            </div>
          )}

          {loadingCourses ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
              {[1, 2, 3, 4].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
              {courses.map((course, i) => (
                <CourseCard key={course.id} course={course} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section
        style={{
          background: "#fff",
          borderTop: "1px solid #fff",
          padding: "100px 0",
          textAlign: "center",
        }}
      >
        <div className="container">
          <AnimatedSection>
            <div style={{ maxWidth: "560px", margin: "0 auto" }}>
              <div
                style={{
                  width: "48px",
                  height: "1px",
                  background: "#fff",
                  margin: "0 auto 32px",
                }}
              />
              <h2
                style={{
                  fontSize: "clamp(28px, 3.5vw, 44px)",
                  color: "#000",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                  margin: "0 0 20px",
                }}
              >
                Create with us.
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  color: "#000",
                  lineHeight: 1.7,
                  marginBottom: "36px",
                }}
              >
                Are you an author, designer, or educator? List your books and
                teach courses to reach a community of creative professionals.
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
                  href="/publish"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "14px 32px",
                    background: "#6fb3c8",
                    color: "#fff",
                    borderRadius: "6px",
                    fontWeight: 700,
                    fontSize: "13px",
                    letterSpacing: "0.08em",
                    textDecoration: "none",
                    textTransform: "uppercase",
                  }}
                >
                  Start Selling
                </Link>
                <Link
                  href="/teach"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "14px 32px",
                    border: "1px solid #000",
                    borderRadius: "6px",
                    color: "#000",
                    fontSize: "13px",
                    letterSpacing: "0.08em",
                    textDecoration: "none",
                    textTransform: "uppercase",
                  }}
                >
                  Teach a Course
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />

      <style>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 40px);
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .book-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 24px 60px rgba(0,0,0,0.4) !important;
        }
        @media(max-width: 768px) {
          .book-card {
            grid-template-columns: 1fr !important;
          }
          .book-card > div:first-child {
            min-height: 260px !important;
          }
        }
      `}</style>
    </>
  );
}
