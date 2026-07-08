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
import { AnimatePresence, motion } from "framer-motion";

import {
  BookOpen,
  Building2,
  Calendar,
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
  deliveryType: "dhaka" | "outside";
  transactionId: string;
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
  deliveryType: "dhaka",
  transactionId: "",
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
                ? `2px solid ${accent ?? "#000"}`
                : "2px solid rgba(255,255,255,0.08)",
              background: isActive
                ? `${accent ?? "#fff"}`
                : "rgba(255,255,255,0.02)",
              color: isActive ? "#fff" : "#000",
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
              className="font-xolonium"
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                opacity: 0.7,
              }}
            >
              {f.label}
            </span>
            <span
              className="font-xolonium"
              style={{ fontSize: "16px", fontWeight: 700 }}
            >
              {formatPrice(f.price)}
            </span>
            {f.badge && (
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  background: accent ? `#fff` : "#fff",
                  color: accent ?? "#000",
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
  className,
}: {
  icon: any;
  label: string;
  value?: string | number | null;
  className?: string;
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
        className="font-xolonium"
        style={{
          fontSize: "12px",
          color: "#000",
          width: "90px",
          flexShrink: 0,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        className="font-xolonium"
        style={{
          fontSize: "14px",
          color: "#000",
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
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "4px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              }}
            />
          ) : (
            <BookOpen
              size={32}
              style={{
                color: book.cover_accent ?? "#000",
                opacity: 0.3,
              }}
            />
          )}
        </div>
        <div style={{ padding: "18px" }}>
          <p
            className="font-xolonium"
            style={{
              fontSize: "14px",
              color: "#000",
              marginBottom: "6px",
              letterSpacing: "0.06em",
            }}
          >
            {book.author}
          </p>
          <h4
            className="font-rising"
            style={{
              fontSize: "20px",
              color: "var(--text)",
              lineHeight: 1.2,
            }}
          >
            {book.title}
          </h4>
          {cheapest && (
            <p
              className="font-xolonium"
              style={{
                fontSize: "16px",
                color: "#000",
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
      <span className="font-xolonium" style={{ fontSize: "20px" }}>
        {option.emoji}
      </span>
      <div>
        <p
          className="font-xolonium"
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: active ? "#000" : "#333",
            margin: 0,
          }}
        >
          {option.label}
        </p>
        <p
          className="font-xolonium"
          style={{ fontSize: "11px", color: "#888", margin: 0 }}
        >
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
  const [previewOpen, setPreviewOpen] = useState(false);

  const previewUrl = product?.preview ? imageUrl(product.preview) : "";

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
          shipping: shippingCost,

          full_order_total: totalPrice,

          total: totalPrice,
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
          shipping: shippingCost,

          full_order_total: totalPrice,

          total: totalPrice,
          tax: 0,
          cod_fee: 0,
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
  const shippingCost = form.deliveryType === "dhaka" ? 60 : 110;

  const totalPrice = Number(selectedFormat?.price || 0) + shippingCost;

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
          <h2 style={{ fontSize: "32px" }}>Book not found</h2>
          <Link href="/books" className="btn-outline font-xolonium">
            ← Back to Books
          </Link>
        </div>
        <Footer />
      </>
    );

  const accent = product.cover_accent ?? "#6FB3C8";

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
          paddingTop: "60px",
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
                  <MetaRow
                    className="font-xolonium"
                    icon={Calendar}
                    label="Year"
                    value={product.year}
                  />
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

              {/* Title — unchanged */}
              <h1
                className="font-rising"
                style={{
                  fontSize: "clamp(28px, 4.5vw, 54px)",
                  lineHeight: 1.0,
                  color: "#000",
                }}
              >
                {product.title}
              </h1>

              {product.subtitle && (
                <p
                  className="font-xolonium"
                  style={{
                    fontSize: "18px",
                    color: "#000",
                    marginTop: "10px",
                    fontStyle: "italic",
                  }}
                >
                  {product.subtitle}
                </p>
              )}
              {product.tagline && (
                <p
                  className="font-xolonium"
                  style={{
                    fontSize: "15px",
                    color: "#000",
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

              <div className="md:flex grid gap-6 md:gap-6">
                {product?.preview && (
                  <button
                    style={{
                      padding: "5px",
                    }}
                    onClick={() => setPreviewOpen(true)}
                    className="flex  cursor-pointer items-center gap-4 rounded-xl border p-3 hover:shadow-lg transition"
                  >
                    <img
                      src={coverImg}
                      alt={product.title}
                      className="w-14 h-20 object-cover rounded"
                    />

                    <div className="text-left">
                      <p className="font-semibold text-black">
                        📖 Read Preview PDF
                      </p>
                      <p className="text-sm text-gray-800">
                        Click to preview this book
                      </p>
                    </div>
                  </button>
                )}

                {/* Format selector — unchanged */}
                {product.formats?.length > 0 && (
                  <div>
                    <p
                      className="font-xolonium "
                      style={{
                        fontSize: "11px",
                        color: "#000",
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
              </div>

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
                    color: "#fff",
                    fontWeight: 600,
                  }}
                >
                  {" "}
                  {product.discount_type === "percent"
                    ? `${product.discount_amount}% OFF`
                    : `${formatPrice(product.discount_amount)} OFF`}
                  {product.discount_end_date && (
                    <span
                      className="font-xolonium"
                      style={{ opacity: 0.7, fontWeight: 400 }}
                    >
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
                    color: "#ffff",
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
                    className="font-xolonium"
                    style={{
                      fontSize: "16px",
                      color: "#000",
                      fontStyle: "italic",
                      lineHeight: 1.7,
                    }}
                  >
                    &ldquo;{product.praise}&rdquo;
                  </p>
                  {product.praise_author && (
                    <cite
                      className="font-xolonium"
                      style={{
                        display: "block",
                        marginTop: "10px",
                        fontSize: "12px",
                        fontStyle: "normal",
                        color: "#fff",
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
                    color={accent === "#000" ? "#000" : "#000"}
                  />
                  <h2
                    className="font-rising"
                    style={{ color: "#000", fontSize: "24px", margin: 0 }}
                  >
                    Place Your Order
                  </h2>
                </div>

                <form onSubmit={handleOrder}>
                  {/* ── STEP 1: Contact — 2 columns ── */}
                  <div
                    className="order-grid font-xolonium"
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
                  <div className="font-xolonium" style={{ marginTop: "18px" }}>
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

                  {/* ── STEP 3: Payment Method ── */}
                  <div style={{ marginTop: "28px" }}>
                    <label
                      className="form-label font-xolonium"
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
                      <div
                        style={{
                          marginTop: "20px",
                          padding: "20px",
                          border: "1px solid #ddd",
                          borderRadius: "12px",
                          background: "#fafafa",
                        }}
                      >
                        <h4
                          className="font-xolonium"
                          style={{
                            marginBottom: "15px",
                            fontSize: "16px",
                            fontWeight: 700,
                          }}
                        >
                          {form.payMethod === "bkash"
                            ? "bKash Payment Information"
                            : "Nagad Payment Information"}
                        </h4>

                        {/* Image */}
                        <img
                          src={
                            form.payMethod === "bkash"
                              ? "/bkash.png"
                              : "/nogod.png"
                          }
                          alt="payment"
                          style={{
                            width: "120px",
                            marginBottom: "15px",
                            borderRadius: "8px",
                          }}
                        />

                        <p className="font-xolonium">
                          <strong>Send Money Number:</strong> 017XXXXXXXX
                        </p>

                        <div style={{ marginTop: "15px" }}>
                          <NiceField
                            icon={Smartphone}
                            label="Your bKash / Nagad Number"
                            name="mobileNumber"
                            value={form.mobileNumber}
                            onChange={setField("mobileNumber")}
                            placeholder="01XXXXXXXXX"
                          />
                        </div>

                        <div style={{ marginTop: "15px" }}>
                          <NiceField
                            icon={Hash}
                            label="Transaction ID"
                            name="transactionId"
                            value={form.transactionId}
                            onChange={setField("transactionId")}
                            placeholder="Enter Transaction ID"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── STEP 4: Delivery Option ── */}

                  <div style={{ marginTop: "24px" }}>
                    <label
                      className="form-label font-xolonium"
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
                      <MapPin size={14} /> Delivery Area
                    </label>

                    <div
                      className="order-grid"
                      style={{
                        display: "grid",

                        gridTemplateColumns: "1fr 1fr",

                        gap: "12px",
                      }}
                    >
                      {/* Dhaka */}
                      <div
                        onClick={() =>
                          setForm((f) => ({ ...f, deliveryType: "dhaka" }))
                        }
                        style={{
                          padding: "16px",

                          borderRadius: "12px",

                          border:
                            form.deliveryType === "dhaka"
                              ? `2px solid ${accent}`
                              : "1px solid #ddd",

                          background:
                            form.deliveryType === "dhaka"
                              ? `${accent}12`
                              : "#fff",

                          cursor: "pointer",

                          transition: "all 0.2s",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            <p
                              className="font-xolonium"
                              style={{ fontWeight: 700, margin: 0 }}
                            >
                              Dhaka City
                            </p>

                            <p
                              className="font-xolonium"
                              style={{
                                fontSize: "12px",
                                color: "#666",
                                margin: "4px 0 0",
                              }}
                            >
                              Inside Dhaka
                            </p>
                          </div>

                          <p
                            className="font-xolonium"
                            style={{
                              fontWeight: 700,
                              margin: 0,
                              color: accent,
                            }}
                          >
                            ৳60
                          </p>
                        </div>
                      </div>{" "}
                      {/* Outside Dhaka */}
                      <div
                        onClick={() =>
                          setForm((f) => ({ ...f, deliveryType: "outside" }))
                        }
                        style={{
                          padding: "16px",

                          borderRadius: "12px",

                          border:
                            form.deliveryType === "outside"
                              ? `2px solid ${accent}`
                              : "1px solid #ddd",

                          background:
                            form.deliveryType === "outside"
                              ? `${accent}12`
                              : "#fff",

                          cursor: "pointer",

                          transition: "all 0.2s",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            <p
                              className="font-xolonium"
                              style={{ fontWeight: 700, margin: 0 }}
                            >
                              Outside Dhaka
                            </p>

                            <p
                              className="font-xolonium"
                              style={{
                                fontSize: "12px",
                                color: "#666",
                                margin: "4px 0 0",
                              }}
                            >
                              Anywhere in Bangladesh
                            </p>
                          </div>

                          <p
                            className="font-xolonium"
                            style={{
                              fontWeight: 700,
                              margin: 0,
                              color: accent,
                            }}
                          >
                            ৳110
                          </p>
                        </div>
                      </div>
                    </div>
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
                        className="form-label font-xolonium"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "20px",
                          color: "#000",
                          fontSize: "13px",
                          fontWeight: 600,
                        }}
                      >
                        <Package size={14} /> Selected Price
                      </label>
                      <div
                        className="font-xolonium"
                        style={{
                          height: "52px",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          padding: "0 18px",
                          color: "#000",
                          fontWeight: 500,
                          fontSize: "14px",
                        }}
                      >
                        {selectedFormat ? (
                          <>
                            Product: {formatPrice(selectedFormat.price)}
                            <br />
                            Delivery: {formatPrice(shippingCost)}
                            <br />
                            Total: {formatPrice(totalPrice)}
                          </>
                        ) : (
                          "Select format"
                        )}
                      </div>
                    </div>

                    {/* Note */}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <label
                        className="form-label font-xolonium"
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
                          className="font-xolonium"
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
                        className="font-xolonium nice-input"
                        name="note"
                        value={form.note}
                        onChange={setField("note")}
                        placeholder="Special instructions, personalisation…"
                        rows={3}
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>

                  {/* ── STEP 5: Submit ── */}
                  <button
                    className="font-xolonium"
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
                    {ordering ? "Processing…" : `Confirm Order`}
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
                    className="font-xolonium"
                    style={{
                      fontSize: "14px",
                      color: "#000",
                      fontWeight: 600,
                    }}
                  >
                    by <span style={{ color: "#000" }}>{product.author}</span>
                  </p>
                  {product.author_bio && (
                    <p
                      className="font-xolonium"
                      style={{
                        fontSize: "14px",
                        color: "#0009",
                        marginTop: "6px",
                        lineHeight: 1.9,
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
                    className="font-xolonium"
                    style={{
                      fontSize: "11px",
                      color: "#000",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      marginBottom: "16px",
                    }}
                  >
                    About This Book
                  </p>
                  <div
                    className="font-xolonium"
                    style={{
                      fontSize: "15px",
                      color: "#0009",
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
              <div
                className="section-label font-xolonium"
                style={{ marginBottom: "8px" }}
              >
                You May Also Like
              </div>
              <h2
                className="font-rising"
                style={{
                  fontSize: "clamp(20px, 3vw, 30px)",
                  marginBottom: "40px",
                }}
              >
                Similar Category Best Selling Books
              </h2>
            </AnimatedSection>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
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
      <AnimatePresence>
        {previewOpen && (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewOpen(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative bg-white rounded-xl w-[95%] max-w-5xl h-[90vh]"
            >
              <button
                onClick={() => setPreviewOpen(false)}
                className="absolute right-4 top-4 z-10"
              >
                ✕
              </button>

              <iframe src={previewUrl} className="w-full h-full rounded-xl" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
      <style>{`@media(max-width:860px){.detail-grid{grid-template-columns:1fr!important;gap:40px!important;}}`}</style>
    </>
  );
}
