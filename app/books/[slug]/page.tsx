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

import {
  ArrowLeft,
  BookOpen,
  Building2,
  Calendar,
  ChevronRight,
  CreditCard,
  FileText,
  Globe,
  Hash,
  Mail,
  MapPin,
  Package,
  Phone,
  ShoppingCart,
  Smartphone,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

/* ─────────────────────────────────────────────────────────
   PAYMENT OPTIONS
───────────────────────────────────────────────────────── */
const PAYMENT_OPTIONS = [
  {
    key: "cod",
    emoji: "💵",
    label: "Cash on Delivery",
    desc: "Pay when your order arrives",
  },
  {
    key: "bkash",
    emoji: "📱",
    label: "bKash",
    desc: "Mobile banking — fast & secure",
  },
  {
    key: "nagad",
    emoji: "📲",
    label: "Nagad",
    desc: "Mobile financial service",
  },
  { key: "card", emoji: "💳", label: "Card", desc: "Visa, Mastercard, Amex" },
  {
    key: "bank",
    emoji: "🏦",
    label: "Bank Transfer",
    desc: "Direct bank transfer",
  },
] as const;

type PayMethod = (typeof PAYMENT_OPTIONS)[number]["key"];

/* ─────────────────────────────────────────────────────────
   FORM DATA SHAPE
───────────────────────────────────────────────────────── */
interface OrderForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  zip: string;
  country: string;
  payMethod: PayMethod;
  mobileNumber: string; // for bKash / Nagad
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
  bankRef: string;
  note: string;
}

const EMPTY_FORM: OrderForm = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  street: "",
  city: "",
  zip: "",
  country: "Bangladesh",
  payMethod: "cod",
  mobileNumber: "",
  cardNumber: "",
  cardName: "",
  expiry: "",
  cvv: "",
  bankRef: "",
  note: "",
};

/* ─────────────────────────────────────────────────────────
   NICE INPUT FIELD (same style as original)
───────────────────────────────────────────────────────── */
function NiceField({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = true,
  readOnly,
  accent,
}: {
  icon: any;
  label: string;
  name: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  readOnly?: boolean;
  accent?: string;
}) {
  return (
    <div>
      <label
        className="form-label"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "10px",
          color: "#000",
          fontSize: "13px",
          fontWeight: 600,
        }}
      >
        <Icon size={14} />
        {label}
        {!required && (
          <span style={{ fontWeight: 400, color: "#888", fontSize: "11px" }}>
            (optional)
          </span>
        )}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        readOnly={readOnly}
        placeholder={placeholder ?? label}
        className="nice-input"
        style={
          readOnly
            ? {
                background: accent ? `${accent}14` : "#f5f5f5",
                borderColor: accent ? `${accent}55` : "#ccc",
                fontWeight: 700,
                fontSize: "18px",
                cursor: "default",
              }
            : undefined
        }
      />
    </div>
  );
}

function NiceTextarea({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 3,
}: {
  icon: any;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <label
        className="form-label"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "10px",
          color: "#000",
          fontSize: "13px",
          fontWeight: 600,
        }}
      >
        <Icon size={14} />
        {label}
        {!required && (
          <span style={{ fontWeight: 400, color: "#888", fontSize: "11px" }}>
            (optional)
          </span>
        )}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        rows={rows}
        className="nice-input"
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   FORMAT SELECTOR (unchanged)
───────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────
   META ROW (unchanged)
───────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────
   RELATED CARD (unchanged)
───────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────
   SKELETON (unchanged)
───────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────
   PAYMENT RADIO ROW
───────────────────────────────────────────────────────── */
function PaymentRadio({
  option,
  active,
  onClick,
  accent,
}: {
  option: (typeof PAYMENT_OPTIONS)[number];
  active: boolean;
  onClick: () => void;
  accent: string;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "12px 16px",
        borderRadius: "12px",
        border: `1px solid ${active ? `${accent}55` : "#ddd"}`,
        background: active ? `${accent}0d` : "#fff",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      {/* Radio circle */}
      <div
        style={{
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          flexShrink: 0,
          border: `2px solid ${active ? accent : "#ccc"}`,
          background: active ? accent : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
        }}
      >
        {active && (
          <div
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#fff",
            }}
          />
        )}
      </div>
      <span style={{ fontSize: "20px" }}>{option.emoji}</span>
      <div>
        <p
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: active ? "#000" : "#333",
            margin: 0,
          }}
        >
          {option.label}
        </p>
        <p style={{ fontSize: "11px", color: "#888", margin: 0 }}>
          {option.desc}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────── */
export default function BookDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState<ProductFormat | null>(
    null,
  );
  const [addedToCart, setAddedToCart] = useState(false);

  // ── Order form state ──
  const [form, setForm] = useState<OrderForm>(EMPTY_FORM);
  const [ordering, setOrdering] = useState(false);
  const [success, setSuccess] = useState("");

  const setField =
    (field: keyof OrderForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  useEffect(() => {
    if (!slug) return;
    getProductBySlug(slug)
      .then(({ product: p, related_products }) => {
        console.log("[BookDetail] product data:", p);
        if (p && p.id) {
          setProduct(p);
          setRelated(related_products ?? []);
          if (p.formats?.length) setSelectedFormat(p.formats[0]);
        } else {
          setProduct(null);
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  // ── Add to cart (unchanged) ──
  const handleAddToCart = () => {
    if (!product || !selectedFormat) return;

    const cartItem = {
      id: product.id,
      slug: product.slug,
      name: product.title,
      image:
        imageUrl(product.main_image?.small ?? product.main_image?.original) ||
        null,
      price: Number(selectedFormat.price),
      formatId: selectedFormat.id,
      formatLabel: selectedFormat.label,
      stock: product.stock,
      quantity: 1,
    };

    if (typeof window !== "undefined") {
      const existingCart = localStorage.getItem("cart");

      const cart = existingCart ? JSON.parse(existingCart) : [];

      const existingIndex = cart.findIndex(
        (item: any) =>
          item.id === cartItem.id && item.formatId === cartItem.formatId,
      );

      if (existingIndex !== -1) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push(cartItem);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
    }

    setAddedToCart(true);

    setTimeout(() => {
      setAddedToCart(false);
    }, 1800);
  };

  // ── Place order (POST /api/cart) ──
  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !selectedFormat) return;
    try {
      setOrdering(true);
      setSuccess("");

      const payload = {
        contact: {
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          phone: form.phone,
        },

        address: {
          street: form.street,
          city: form.city,
          zip: form.zip,
          country: form.country,
        },

        items: [
          {
            product_id: product.id,
            quantity: 1,
            format_id: selectedFormat.id,
            format_details: {
              format_label: selectedFormat.label,
            },
          },
        ],

        delivery_method: "standard",

        delivery_detail: {
          method: "standard",
          shipping: 60,
          is_free: false,
        },

        payment_method: form.payMethod,

        payment_payload: {
          mobile_number: form.mobileNumber,
          card_number: form.cardNumber,
          card_name: form.cardName,
          expiry: form.expiry,
          cvv: form.cvv,
          bank_ref: form.bankRef,
        },

        pricing: {
          subtotal: Number(selectedFormat.price),
          shipping: 60,
          tax: 0,
          cod_fee: 0,
          full_order_total: Number(selectedFormat.price) + 60,
          total: Number(selectedFormat.price) + 60,
        },

        note: form.note,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/place`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();
      console.log("[Order response]", data);

      if (res.ok) {
        toast.success("Order placed successfully!");
        setSuccess("✓ Order placed successfully!");
        setForm(EMPTY_FORM);
      } else {
        toast.error(data.message ?? "Something went wrong, please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.");
    } finally {
      setOrdering(false);
    }
  };

  /* ── Loading / not found ── */
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

  /* ══════════════════════════════════════════════════════ */
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
          {/* Breadcrumb — unchanged */}
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

          {/* Main grid — unchanged layout */}
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
            {/* ── LEFT: Cover (unchanged) ── */}
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

            {/* ── RIGHT: Details ── */}
            <AnimatedSection delay={0.1}>
              {/* Tags — unchanged */}
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

              {/* Title — unchanged */}
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

              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  margin: "28px 0",
                }}
              />

              {/* Format selector — unchanged */}
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

              {/* Discount badge — unchanged */}
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

              {/* Pre-order badge — unchanged */}
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

              {/* Praise — unchanged */}
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

              {/* ══════════════════════════════════════════
                  ORDER FORM — same design, checkout data
              ══════════════════════════════════════════ */}
              <div style={{ marginTop: "56px" }}>
                {/* Form header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "28px",
                  }}
                >
                  <ShoppingCart
                    size={22}
                    color={accent === "var(--gold)" ? "#c9a84c" : accent}
                  />
                  <h2 style={{ color: "#000", fontSize: "28px", margin: 0 }}>
                    Place Your Order
                  </h2>
                </div>

                <form onSubmit={handleOrder}>
                  {/* ── STEP 1: Contact — 2 columns ── */}
                  <div
                    className="order-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "18px",
                    }}
                  >
                    <NiceField
                      icon={User}
                      label="First Name"
                      name="firstName"
                      value={form.firstName}
                      onChange={setField("firstName")}
                      placeholder="আপনার প্রথম নাম"
                    />
                    <NiceField
                      icon={User}
                      label="Last Name"
                      name="lastName"
                      value={form.lastName}
                      onChange={setField("lastName")}
                      placeholder="আপনার শেষ নাম"
                    />
                    <NiceField
                      icon={Phone}
                      label="Phone Number"
                      name="phone"
                      value={form.phone}
                      onChange={setField("phone")}
                      placeholder="+8801XXXXXXXXX"
                      type="tel"
                    />
                    <NiceField
                      icon={Mail}
                      label="Email Address"
                      name="email"
                      value={form.email}
                      onChange={setField("email")}
                      placeholder="example@gmail.com"
                      type="email"
                      required={false}
                    />
                  </div>

                  {/* ── STEP 2: Address ── */}
                  <div style={{ marginTop: "18px" }}>
                    <NiceTextarea
                      icon={MapPin}
                      label="Street Address"
                      name="street"
                      value={form.street}
                      onChange={setField("street")}
                      placeholder="বাড়ি নং, রোড নং, এলাকা…"
                      rows={2}
                      required
                    />
                  </div>

                  <div
                    className="order-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: "18px",
                      marginTop: "18px",
                    }}
                  >
                    <NiceField
                      icon={MapPin}
                      label="City / District"
                      name="city"
                      value={form.city}
                      onChange={setField("city")}
                      placeholder="ঢাকা"
                    />
                    <NiceField
                      icon={Hash}
                      label="ZIP / Postal"
                      name="zip"
                      value={form.zip}
                      onChange={setField("zip")}
                      placeholder="1216"
                    />
                    <NiceField
                      icon={Globe}
                      label="Country"
                      name="country"
                      value={form.country}
                      onChange={setField("country")}
                      placeholder="Bangladesh"
                      required={false}
                    />
                  </div>

                  {/* ── STEP 3: Payment Method ── */}
                  <div style={{ marginTop: "28px" }}>
                    <label
                      className="form-label"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "14px",
                        color: "#000",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      <CreditCard size={14} /> Payment Method
                    </label>
                    <div
                      className="order-grid"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "10px",
                      }}
                    >
                      {PAYMENT_OPTIONS.map((opt) => (
                        <PaymentRadio
                          key={opt.key}
                          option={opt}
                          active={form.payMethod === opt.key}
                          onClick={() =>
                            setForm((f) => ({ ...f, payMethod: opt.key }))
                          }
                          accent={accent === "var(--gold)" ? "#c9a84c" : accent}
                        />
                      ))}
                    </div>

                    {/* bKash / Nagad number */}
                    {(form.payMethod === "bkash" ||
                      form.payMethod === "nagad") && (
                      <div style={{ marginTop: "14px" }}>
                        <NiceField
                          icon={Smartphone}
                          label={`${form.payMethod === "bkash" ? "bKash" : "Nagad"} Number`}
                          name="mobileNumber"
                          value={form.mobileNumber}
                          onChange={setField("mobileNumber")}
                          placeholder="01XXXXXXXXX"
                          type="tel"
                        />
                      </div>
                    )}

                    {/* Card fields */}
                    {form.payMethod === "card" && (
                      <div
                        style={{
                          marginTop: "14px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "14px",
                        }}
                      >
                        <NiceField
                          icon={CreditCard}
                          label="Card Number"
                          name="cardNumber"
                          value={form.cardNumber}
                          onChange={setField("cardNumber")}
                          placeholder="•••• •••• •••• ••••"
                        />
                        <NiceField
                          icon={User}
                          label="Cardholder Name"
                          name="cardName"
                          value={form.cardName}
                          onChange={setField("cardName")}
                          placeholder="Name on card"
                        />
                        <div
                          className="order-grid"
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "14px",
                          }}
                        >
                          <NiceField
                            icon={Calendar}
                            label="Expiry"
                            name="expiry"
                            value={form.expiry}
                            onChange={setField("expiry")}
                            placeholder="MM/YY"
                          />
                          <NiceField
                            icon={Hash}
                            label="CVV"
                            name="cvv"
                            value={form.cvv}
                            onChange={setField("cvv")}
                            placeholder="•••"
                          />
                        </div>
                      </div>
                    )}

                    {/* Bank transfer ref */}
                    {form.payMethod === "bank" && (
                      <div style={{ marginTop: "14px" }}>
                        <NiceField
                          icon={Hash}
                          label="Transaction Reference"
                          name="bankRef"
                          value={form.bankRef}
                          onChange={setField("bankRef")}
                          placeholder="Reference / Transaction ID"
                        />
                      </div>
                    )}
                  </div>

                  {/* ── STEP 4: Selected Price + Note ── */}
                  <div
                    className="order-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "18px",
                      marginTop: "18px",
                    }}
                  >
                    {/* Price — read-only display */}
                    <div>
                      <label
                        className="form-label"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "10px",
                          color: "#000",
                          fontSize: "13px",
                          fontWeight: 600,
                        }}
                      >
                        <Package size={14} /> Selected Price
                      </label>
                      <div
                        style={{
                          height: "52px",
                          borderRadius: "12px",
                          background: `${accent === "var(--gold)" ? "#c9a84c" : accent}14`,
                          border: `1px solid ${accent === "var(--gold)" ? "#c9a84c" : accent}55`,
                          display: "flex",
                          alignItems: "center",
                          padding: "0 18px",
                          color: "#000",
                          fontWeight: 700,
                          fontSize: "18px",
                        }}
                      >
                        {selectedFormat
                          ? formatPrice(selectedFormat.price)
                          : "Select format"}
                      </div>
                    </div>

                    {/* Note */}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <label
                        className="form-label"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "10px",
                          color: "#000",
                          fontSize: "13px",
                          fontWeight: 600,
                        }}
                      >
                        <FileText size={14} /> Additional Note
                        <span
                          style={{
                            fontWeight: 400,
                            color: "#888",
                            fontSize: "11px",
                          }}
                        >
                          (optional)
                        </span>
                      </label>
                      <textarea
                        name="note"
                        value={form.note}
                        onChange={setField("note")}
                        className="nice-input"
                        placeholder="Special instructions, personalisation…"
                        rows={3}
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>

                  {/* ── STEP 5: Submit ── */}
                  <button
                    type="submit"
                    disabled={ordering || !selectedFormat}
                    style={{
                      width: "100%",
                      height: "56px",
                      borderRadius: "14px",
                      border: "none",
                      marginTop: "24px",
                      background: "#6FB3C8",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "16px",
                      cursor:
                        ordering || !selectedFormat ? "not-allowed" : "pointer",
                      opacity: ordering || !selectedFormat ? 0.7 : 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    {ordering
                      ? "Processing…"
                      : `Confirm Order${selectedFormat ? ` · ${formatPrice(selectedFormat.price)}` : ""}`}
                  </button>
                </form>
              </div>
              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  margin: "36px 0",
                }}
              />
              {/* Author — unchanged */}
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
                  margin: "36px 0",
                }}
              />
              {/* Description — unchanged */}
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
              {/* ── END ORDER FORM ── */}
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Related books section — unchanged */}
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
                Similar Category Best Selling Books
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

          <style>{`
            .nice-input {
              width: 100%;
              height: 52px;
              border-radius: 12px;
              border: 1px solid #000;
              color: #000;
              padding: 0 18px;
              outline: none;
              transition: 0.25s;
              font-size: 14px;
              background: #fff;
              box-sizing: border-box;
            }
            textarea.nice-input {
              height: auto;
              padding: 16px 18px;
              resize: none;
            }
            .nice-input:focus {
              border-color: #0009;
              box-shadow: 0 0 0 1px #000;
            }
            .form-label {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 10px;
              color: #000;
              font-size: 13px;
              font-weight: 600;
            }
            .related-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.12) !important; }
            @media(max-width:640px) {
              .order-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </section>
      )}

      <Footer />
      <style>{`@media(max-width:860px){.detail-grid{grid-template-columns:1fr!important;gap:40px!important;}}`}</style>
    </>
  );
}
