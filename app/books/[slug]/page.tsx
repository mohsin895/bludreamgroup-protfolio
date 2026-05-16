"use client";
import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import PageHero from "@/components/HeroPage";
import Navbar from "@/components/Navbar";
import {
  formatPrice,
  getProductBySlug,
  imageUrl,
  type Product,
  type ProductFormat,
} from "@/lib/api/product";
import { addItem } from "@/store/cartSlice";
import { useAppDispatch } from "@/store/hooks";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Calendar,
  ChevronRight,
  FileText,
  Globe,
  Hash,
  Package,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function FormatSelector({
  formats,
  selected,
  onSelect,
  accent,
}: {
  formats: ProductFormat[];
  selected: ProductFormat | null;
  onSelect: (f: ProductFormat) => void;
  accent?: string;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
      {formats.map((f) => {
        const isActive = selected?.id === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onSelect(f)}
            style={{
              padding: "12px 20px",
              borderRadius: "8px",
              border: isActive
                ? `2px solid ${accent ?? "var(--gold)"}`
                : "2px solid rgba(255,255,255,0.08)",
              background: isActive
                ? `${accent ?? "var(--gold)"}14`
                : "rgba(255,255,255,0.02)",
              color: isActive ? (accent ?? "var(--gold)") : "var(--text-muted)",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "13px",
              transition: "all 0.2s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "4px",
              minWidth: "110px",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                opacity: 0.7,
              }}
            >
              {f.label}
            </span>
            <span style={{ fontSize: "16px", fontWeight: 700 }}>
              {formatPrice(f.price)}
            </span>
            {f.badge && (
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  background: accent ? `${accent}22` : "rgba(201,168,76,0.2)",
                  color: accent ?? "var(--gold)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                }}
              >
                {f.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function MetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value?: string | number | null;
}) {
  if (!value) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 0",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <Icon size={15} style={{ color: "var(--text-dim)", flexShrink: 0 }} />
      <span
        style={{
          fontSize: "12px",
          color: "var(--text-dim)",
          width: "90px",
          flexShrink: 0,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "14px",
          color: "var(--text-muted)",
          fontWeight: 500,
        }}
      >
        {String(value)}
      </span>
    </div>
  );
}

function RelatedCard({ book }: { book: Product }) {
  const imgSrc = imageUrl(book.main_image?.small ?? book.main_image?.original);
  const cheapest = book.formats?.[0];
  return (
    <Link
      href={`/books/${book.slug}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        className="related-card"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "12px",
          overflow: "hidden",
          transition: "all 0.25s ease",
        }}
      >
        <div
          style={{
            background: book.cover_color
              ? `linear-gradient(135deg, ${book.cover_color}cc, ${book.cover_accent ?? book.cover_color}88)`
              : "#111",
            aspectRatio: "3/2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={book.title}
              style={{
                width: "80px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "4px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              }}
            />
          ) : (
            <BookOpen
              size={32}
              style={{
                color: book.cover_accent ?? "var(--gold)",
                opacity: 0.3,
              }}
            />
          )}
        </div>
        <div style={{ padding: "18px" }}>
          <p
            style={{
              fontSize: "11px",
              color: "var(--text-dim)",
              marginBottom: "6px",
              letterSpacing: "0.06em",
            }}
          >
            {book.author}
          </p>
          <h4
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "17px",
              color: "var(--text)",
              lineHeight: 1.2,
            }}
          >
            {book.title}
          </h4>
          {cheapest && (
            <p
              style={{
                fontSize: "13px",
                color: book.cover_accent ?? "var(--gold)",
                marginTop: "8px",
                fontWeight: 600,
              }}
            >
              From {formatPrice(cheapest.price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

function DetailSkeleton() {
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "3px solid rgba(255,255,255,0.1)",
          borderTopColor: "var(--gold)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

export default function BookDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState<ProductFormat | null>(
    null,
  );
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (!slug) return;
    getProductBySlug(slug)
      .then(({ product: p, related_products }) => {
        // Debug: log the raw product so you can inspect API shape in browser console
        console.log("[BookDetail] product data:", p);
        // Guard: only set if we got something with an id
        if (p && p.id) {
          setProduct(p);
          setRelated(related_products ?? []);
          if (p.formats?.length) setSelectedFormat(p.formats[0]);
        } else {
          console.warn("[BookDetail] Product missing or no id — raw:", p);
          setProduct(null);
        }
      })
      .catch((err) => {
        console.error("[BookDetail] fetch error:", err);
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product || !selectedFormat) return;
    dispatch(
      addItem({
        product: {
          id: product.id,
          slug: product.slug,
          name: product.title,
          // resolve relative path → absolute URL so cart images display correctly
          image:
            imageUrl(
              product.main_image?.small ?? product.main_image?.original,
            ) || null,
          price: Number(selectedFormat.price),
          formatId: selectedFormat.id,
          formatLabel: selectedFormat.label,
          stock: product.stock,
        },
        quantity: 1,
      }),
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  };

  if (loading)
    return (
      <>
        <Navbar />
        <DetailSkeleton />
        <Footer />
      </>
    );

  if (!product)
    return (
      <>
        <Navbar />
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "32px" }}>
            Book not found
          </h2>
          <Link href="/books" className="btn-outline">
            ← Back to Books
          </Link>
        </div>
        <Footer />
      </>
    );

  const accent = product.cover_accent ?? "var(--gold)";
  const coverImg = imageUrl(
    product.main_image?.large ?? product.main_image?.original,
  );
  const hasDiscount = product.has_discount === "yes" && product.discount_amount;
  const isOutOfStock = product.stock === 0 && product.has_pre_order !== "yes";

  return (
    <>
      <Navbar />
      <PageHero title={product.title} currentPage="Book Details" />
      <section
        style={{
          paddingTop: "100px",
          background: `linear-gradient(180deg, ${product.cover_color ?? "#0f0f14"}33 0%, transparent 100%), var(--bg)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${product.cover_color ?? "#4f46e5"}18, transparent)`,
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative" }}>
          {/* Breadcrumb */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              color: "var(--text-dim)",
              marginBottom: "40px",
              letterSpacing: "0.06em",
            }}
          >
            <Link
              href="/books"
              style={{
                color: "var(--text-dim)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <ArrowLeft size={12} /> Books
            </Link>
            <ChevronRight size={10} />
            <span style={{ color: "var(--text-muted)" }}>{product.title}</span>
          </div>

          {/* Main grid */}
          <div
            className="detail-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "300px 1fr",
              gap: "72px",
              alignItems: "start",
              paddingBottom: "80px",
            }}
          >
            {/* LEFT: Cover */}
            <AnimatedSection>
              <div style={{ position: "sticky", top: "100px" }}>
                <div
                  style={{
                    position: "relative",
                    maxWidth: "260px",
                    margin: "0 auto",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-20px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "80%",
                      height: "40px",
                      background: `radial-gradient(ellipse, ${product.cover_color ?? "#000"}88, transparent)`,
                      filter: "blur(12px)",
                    }}
                  />
                  {coverImg ? (
                    <img
                      src={coverImg}
                      alt={product.title}
                      style={{
                        width: "100%",
                        aspectRatio: "2/3",
                        objectFit: "cover",
                        borderRadius: "8px",
                        display: "block",
                        boxShadow:
                          "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
                        position: "relative",
                        zIndex: 1,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "2/3",
                        background: `linear-gradient(135deg, ${product.cover_color ?? "#1e1b4b"}, ${product.cover_accent ?? "#312e81"})`,
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      <BookOpen
                        size={56}
                        style={{ color: "rgba(255,255,255,0.2)" }}
                      />
                    </div>
                  )}
                </div>
                <div
                  style={{
                    marginTop: "36px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "10px",
                    padding: "16px 20px",
                  }}
                >
                  <MetaRow
                    icon={Globe}
                    label="Language"
                    value={product.language}
                  />
                  <MetaRow icon={Hash} label="ISBN" value={product.isbn} />
                  <MetaRow
                    icon={Building2}
                    label="Publisher"
                    value={product.publisher}
                  />
                  <MetaRow icon={Calendar} label="Year" value={product.year} />
                  <MetaRow
                    icon={FileText}
                    label="Pages"
                    value={product.pages}
                  />
                  <MetaRow
                    icon={Package}
                    label="Stock"
                    value={
                      product.stock > 0
                        ? `${product.stock} left`
                        : "Out of stock"
                    }
                  />
                </div>
              </div>
            </AnimatedSection>

            {/* RIGHT: Details */}
            <AnimatedSection delay={0.1}>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  marginBottom: "16px",
                }}
              >
                {product.category && (
                  <span className="tag">{product.category.name}</span>
                )}
                {product.genre && (
                  <span
                    className="tag"
                    style={{
                      background:
                        accent !== "var(--gold)" ? `${accent}14` : undefined,
                      borderColor:
                        accent !== "var(--gold)" ? `${accent}44` : undefined,
                      color: accent !== "var(--gold)" ? accent : undefined,
                    }}
                  >
                    {product.genre}
                  </span>
                )}
                {product.status === "inactive" && (
                  <span
                    className="tag"
                    style={{
                      background: "rgba(239,68,68,0.1)",
                      borderColor: "#ef444444",
                      color: "#ef4444",
                    }}
                  >
                    Unavailable
                  </span>
                )}
              </div>

              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(38px, 4.5vw, 64px)",
                  lineHeight: 1.0,
                  color: "var(--text)",
                }}
              >
                {product.title}
              </h1>

              {product.subtitle && (
                <p
                  style={{
                    fontSize: "18px",
                    color: accent,
                    marginTop: "10px",
                    fontStyle: "italic",
                  }}
                >
                  {product.subtitle}
                </p>
              )}
              {product.tagline && (
                <p
                  style={{
                    fontSize: "15px",
                    color: "var(--text-dim)",
                    marginTop: "12px",
                    fontStyle: "italic",
                    letterSpacing: "0.02em",
                  }}
                >
                  &ldquo;{product.tagline}&rdquo;
                </p>
              )}

              {product.author && (
                <div style={{ marginTop: "20px" }}>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--text-muted)",
                      fontWeight: 600,
                    }}
                  >
                    by <span style={{ color: accent }}>{product.author}</span>
                  </p>
                  {product.author_bio && (
                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--text-dim)",
                        marginTop: "6px",
                        lineHeight: 1.6,
                        maxWidth: "520px",
                      }}
                    >
                      {product.author_bio}
                    </p>
                  )}
                </div>
              )}

              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  margin: "28px 0",
                }}
              />

              {product.formats?.length > 0 && (
                <div>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "var(--text-dim)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      marginBottom: "14px",
                    }}
                  >
                    Choose Format
                  </p>
                  <FormatSelector
                    formats={product.formats}
                    selected={selectedFormat}
                    onSelect={setSelectedFormat}
                    accent={product.cover_accent ?? undefined}
                  />
                </div>
              )}

              {hasDiscount && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    marginTop: "16px",
                    fontSize: "13px",
                    color: "#f87171",
                    fontWeight: 600,
                  }}
                >
                  🎉{" "}
                  {product.discount_type === "percent"
                    ? `${product.discount_amount}% OFF`
                    : `${formatPrice(product.discount_amount)} OFF`}
                  {product.discount_end_date && (
                    <span style={{ opacity: 0.7, fontWeight: 400 }}>
                      · ends{" "}
                      {new Date(product.discount_end_date).toLocaleDateString(
                        "en-GB",
                        { day: "numeric", month: "short" },
                      )}
                    </span>
                  )}
                </div>
              )}

              {product.has_pre_order === "yes" && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(99,102,241,0.12)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    marginTop: "16px",
                    marginLeft: hasDiscount ? "8px" : "0",
                    fontSize: "13px",
                    color: "#a5b4fc",
                    fontWeight: 600,
                  }}
                >
                  📦 Pre-order available
                  {product.pre_order_amount
                    ? ` · ${formatPrice(product.pre_order_amount)}`
                    : ""}
                </div>
              )}

              {/* Buy CTA */}
              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  marginTop: "28px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <button
                  className="btn-primary"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "14px 28px",
                    fontSize: "15px",
                    opacity: isOutOfStock ? 0.4 : 1,
                    cursor: isOutOfStock ? "not-allowed" : "pointer",
                    transition: "background 0.2s",
                    background: addedToCart ? "#22c55e" : undefined,
                  }}
                >
                  <ShoppingCart size={16} />
                  {isOutOfStock
                    ? "Out of Stock"
                    : product.has_pre_order === "yes"
                      ? "Pre-Order Now"
                      : addedToCart
                        ? "Added ✓"
                        : selectedFormat
                          ? `Add to Cart · ${formatPrice(selectedFormat.price)}`
                          : "Add to Cart"}
                </button>
                <Link
                  href="/books"
                  className="btn-outline"
                  style={{
                    gap: "8px",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  <ArrowLeft size={13} /> All Books
                </Link>
                {!isOutOfStock && (
                  <Link
                    href="/cart"
                    style={{
                      fontSize: "13px",
                      color: "var(--text-dim)",
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    View Cart
                  </Link>
                )}
              </div>

              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  margin: "36px 0",
                }}
              />

              {product.description && (
                <div>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "var(--text-dim)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      marginBottom: "16px",
                    }}
                  >
                    About This Book
                  </p>
                  <div
                    style={{
                      fontSize: "15px",
                      color: "var(--text-muted)",
                      lineHeight: 1.85,
                      maxWidth: "600px",
                    }}
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}

              {product.praise && (
                <blockquote
                  style={{
                    borderLeft: `3px solid ${accent}`,
                    paddingLeft: "24px",
                    marginTop: "36px",
                    maxWidth: "560px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "16px",
                      color: "var(--text-muted)",
                      fontStyle: "italic",
                      lineHeight: 1.7,
                    }}
                  >
                    &ldquo;{product.praise}&rdquo;
                  </p>
                  {product.praise_author && (
                    <cite
                      style={{
                        display: "block",
                        marginTop: "10px",
                        fontSize: "12px",
                        fontStyle: "normal",
                        color: accent,
                        letterSpacing: "0.08em",
                        fontWeight: 600,
                      }}
                    >
                      — {product.praise_author}
                    </cite>
                  )}
                </blockquote>
              )}
            </AnimatedSection>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section style={{ background: "#fff9", padding: "80px 0" }}>
          <div className="container">
            <AnimatedSection>
              <div className="section-label" style={{ marginBottom: "8px" }}>
                You May Also Like
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(28px, 3vw, 40px)",
                  marginBottom: "40px",
                }}
              >
                More Titles
              </h2>
            </AnimatedSection>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "24px",
              }}
            >
              {related.map((r, i) => (
                <AnimatedSection key={r.id} delay={i * 0.08}>
                  <RelatedCard book={r} />
                </AnimatedSection>
              ))}
            </div>
          </div>
          <style>{`.related-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.12) !important; }`}</style>
        </section>
      )}

      <Footer />
      <style>{`@media(max-width:860px){.detail-grid{grid-template-columns:1fr!important;gap:40px!important;}}`}</style>
    </>
  );
}
