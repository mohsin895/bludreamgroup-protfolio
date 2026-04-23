"use client";
import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ─── Data ─────────────────────────────────────────────────── */
const featured = {
    id: 1,
    title: "The Ink & Architecture Collection",
    subtitle: "Limited Edition Hardcover Box Set",
    description:
        "Three volumes bound in cloth, foil-stamped and numbered. Includes original lithograph prints, a handwritten author note, and archival slipcase. Only 500 sets printed worldwide.",
    price: "$189",
    originalPrice: "$240",
    badge: "Limited Edition",
    stock: "47 remaining",
    color: "#C9A84C",
    bg: "rgba(201,168,76,0.08)",
    tags: ["Hardcover", "Signed", "Box Set"],
    formats: ["Box Set", "Ebook Bundle"],
};

const products = [
    {
        id: 2,
        category: "Fiction",
        title: "The Cartographer's Daughter",
        author: "Naomi Ashford",
        price: "$18",
        originalPrice: null,
        badge: "Bestseller",
        color: "#C9A84C",
        bg: "rgba(201,168,76,0.08)",
        format: "Paperback · Ebook",
        pages: "342 pages",
        rating: 4.9,
        reviews: 1240,
        stock: "In Stock",
    },
    {
        id: 3,
        category: "Design",
        title: "Grid Systems & Visual Thought",
        author: "Marcus Yuen",
        price: "$34",
        originalPrice: "$44",
        badge: "Sale",
        color: "#7DD4B0",
        bg: "rgba(125,212,176,0.08)",
        format: "Hardcover · PDF",
        pages: "208 pages",
        rating: 4.8,
        reviews: 620,
        stock: "In Stock",
    },
    {
        id: 4,
        category: "Non-Fiction",
        title: "Publish, Then Polish",
        author: "Sasha Orlova",
        price: "$22",
        originalPrice: null,
        badge: "New",
        color: "#8BA7E0",
        bg: "rgba(139,167,224,0.08)",
        format: "Paperback · Ebook",
        pages: "264 pages",
        rating: 4.7,
        reviews: 390,
        stock: "In Stock",
    },
    {
        id: 5,
        category: "Illustration",
        title: "The Hand-Drawn Atlas",
        author: "Theo Wainwright",
        price: "$54",
        originalPrice: null,
        badge: "Sold Out",
        color: "#C97B8C",
        bg: "rgba(201,123,140,0.08)",
        format: "Hardcover · Print",
        pages: "180 pages",
        rating: 5.0,
        reviews: 214,
        stock: "Sold Out",
    },
    {
        id: 6,
        category: "Photography",
        title: "Borderlands: A Documentary",
        author: "Emre Çelik",
        price: "$48",
        originalPrice: "$60",
        badge: "Sale",
        color: "#7DD4B0",
        bg: "rgba(125,212,176,0.08)",
        format: "Hardcover · Digital",
        pages: "156 pages",
        rating: 4.9,
        reviews: 178,
        stock: "In Stock",
    },
    {
        id: 7,
        category: "Fiction",
        title: "Letters from the Margin",
        author: "Layla Whitmore",
        price: "$16",
        originalPrice: null,
        badge: null,
        color: "#C9A84C",
        bg: "rgba(201,168,76,0.08)",
        format: "Paperback · Ebook",
        pages: "298 pages",
        rating: 4.6,
        reviews: 542,
        stock: "In Stock",
    },
];

const categories = ["All", "Fiction", "Non-Fiction", "Design", "Illustration", "Photography"];
const sortOptions = ["Featured", "Price: Low–High", "Highest Rated", "Newest"];

const badgeColors: Record<string, { color: string; bg: string }> = {
    Bestseller: { color: "#C9A84C", bg: "rgba(201,168,76,0.12)" },
    Sale:       { color: "#7DD4B0", bg: "rgba(125,212,176,0.12)" },
    New:        { color: "#8BA7E0", bg: "rgba(139,167,224,0.12)" },
    "Sold Out": { color: "rgba(255,255,255,0.3)", bg: "rgba(255,255,255,0.04)" },
    "Limited Edition": { color: "#C9A84C", bg: "rgba(201,168,76,0.12)" },
};

/* ─── Star Row ──────────────────────────────────────────────── */
function Stars({ rating, reviews }: { rating: number; reviews: number }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ display: "flex", gap: "2px" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="11" height="11" viewBox="0 0 14 14" fill="none">
                        <path
                            d="M7 1L8.545 4.955L12.5 5.18L9.5 7.855L10.545 11.75L7 9.5L3.455 11.75L4.5 7.855L1.5 5.18L5.455 4.955L7 1Z"
                            fill={i < Math.floor(rating) ? "#C9A84C" : "rgba(255,255,255,0.12)"}
                        />
                    </svg>
                ))}
            </div>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
        {rating} ({reviews.toLocaleString()})
      </span>
        </div>
    );
}

/* ─── Book Cover Placeholder ────────────────────────────────── */
function BookCover({ color, title, category }: { color: string; title: string; category: string }) {
    return (
        <div
            style={{
                width: "100%",
                aspectRatio: "2/3",
                background: `linear-gradient(135deg, ${color}18 0%, ${color}06 100%)`,
                border: `1px solid ${color}22`,
                borderRadius: "6px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Spine line */}
            <div style={{ position: "absolute", left: "12px", top: 0, bottom: 0, width: "3px", background: `${color}30`, borderRadius: "2px" }} />
            {/* Category */}
            <div style={{ fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: `${color}80`, marginBottom: "12px" }}>{category}</div>
            {/* Title lines */}
            <div style={{ width: "70%", height: "2px", background: `${color}40`, borderRadius: "1px", marginBottom: "6px" }} />
            <div style={{ width: "50%", height: "2px", background: `${color}25`, borderRadius: "1px", marginBottom: "6px" }} />
            <div style={{ width: "40%", height: "2px", background: `${color}15`, borderRadius: "1px" }} />
            {/* Center ornament */}
            <div style={{ marginTop: "20px", width: "32px", height: "32px", borderRadius: "50%", border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: `${color}30` }} />
            </div>
        </div>
    );
}

/* ─── Featured Product ──────────────────────────────────────── */
function FeaturedProduct() {
    const [added, setAdded] = useState(false);
    return (
        <AnimatedSection>
            <div
                style={{
                    position: "relative",
                    background: "#0f0f0f",
                    border: "1px solid rgba(201,168,76,0.2)",
                    borderRadius: "16px",
                    padding: "clamp(28px, 4vw, 52px)",
                    overflow: "hidden",
                    display: "grid",
                    gridTemplateColumns: "240px 1fr",
                    gap: "clamp(28px, 4vw, 56px)",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, var(--gold), transparent)" }} />

                {/* Book cover */}
                <BookCover color={featured.color} title={featured.title} category="Limited Edition" />

                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)" }}>Featured</span>
                        <span style={{ fontSize: "10px", padding: "3px 10px", background: badgeColors["Limited Edition"].bg, borderRadius: "100px", color: badgeColors["Limited Edition"].color, letterSpacing: "0.08em" }}>
              {featured.badge}
            </span>
                    </div>

                    <h2
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(20px, 2.5vw, 30px)",
                            color: "#fff",
                            letterSpacing: "-0.02em",
                            lineHeight: 1.15,
                            margin: "0 0 8px",
                        }}
                    >
                        {featured.title}
                    </h2>
                    <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", marginBottom: "16px" }}>{featured.subtitle}</p>
                    <p style={{ fontSize: "14px", lineHeight: 1.75, color: "rgba(255,255,255,0.5)", marginBottom: "24px", maxWidth: "480px" }}>{featured.description}</p>

                    {/* Stock warning */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#C9A84C" }} />
                        <span style={{ fontSize: "12px", color: "rgba(201,168,76,0.8)", letterSpacing: "0.04em" }}>{featured.stock}</span>
                    </div>

                    {/* Formats */}
                    <div style={{ display: "flex", gap: "8px", marginBottom: "28px", flexWrap: "wrap" }}>
                        {featured.formats.map((f, idx) => (
                            <div
                                key={f}
                                style={{
                                    padding: "7px 14px",
                                    background: idx === 0 ? "rgba(201,168,76,0.1)" : "transparent",
                                    border: `1px solid ${idx === 0 ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.1)"}`,
                                    borderRadius: "6px",
                                    fontSize: "12px",
                                    color: idx === 0 ? "var(--gold)" : "rgba(255,255,255,0.4)",
                                    cursor: "pointer",
                                }}
                            >
                                {f}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
                        <div>
                            <span style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700, color: "var(--gold)" }}>{featured.price}</span>
                            <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.25)", textDecoration: "line-through", marginLeft: "8px" }}>{featured.originalPrice}</span>
                        </div>
                        <button
                            onClick={() => setAdded(true)}
                            style={{
                                padding: "13px 28px",
                                background: added ? "rgba(125,212,176,0.15)" : "var(--gold)",
                                border: added ? "1px solid rgba(125,212,176,0.4)" : "none",
                                borderRadius: "6px",
                                fontWeight: 700,
                                fontSize: "13px",
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                color: added ? "#7DD4B0" : "#0a0a0a",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                            }}
                        >
                            {added ? "✓ Added to Cart" : "Add to Cart"}
                        </button>
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
}

/* ─── Product Card ──────────────────────────────────────────── */
function ProductCard({ p, i }: { p: (typeof products)[0]; i: number }) {
    const [hovered, setHovered] = useState(false);
    const [added, setAdded] = useState(false);
    const soldOut = p.stock === "Sold Out";
    const bc = p.badge ? (badgeColors[p.badge] ?? { color: "var(--gold)", bg: "rgba(201,168,76,0.1)" }) : null;

    return (
        <AnimatedSection delay={i * 0.07}>
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    position: "relative",
                    background: hovered ? "#141414" : "#0f0f0f",
                    border: `1px solid ${hovered && !soldOut ? p.color + "44" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: "12px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    transition: "all 0.32s cubic-bezier(0.16,1,0.3,1)",
                    transform: hovered && !soldOut ? "translateY(-4px)" : "translateY(0)",
                    opacity: soldOut ? 0.65 : 1,
                }}
            >
                {/* Top bar */}
                <div style={{ height: "3px", background: `linear-gradient(90deg, ${p.color}, transparent)`, opacity: hovered && !soldOut ? 1 : 0.3, transition: "opacity 0.3s ease" }} />

                {/* Cover area */}
                <div style={{ padding: "24px 24px 0", position: "relative" }}>
                    {bc && (
                        <div
                            style={{
                                position: "absolute",
                                top: "32px",
                                right: "32px",
                                zIndex: 1,
                                fontSize: "9px",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                padding: "4px 10px",
                                background: bc.bg,
                                borderRadius: "100px",
                                color: bc.color,
                                fontWeight: 600,
                            }}
                        >
                            {p.badge}
                        </div>
                    )}
                    <BookCover color={p.color} title={p.title} category={p.category} />
                </div>

                <div style={{ padding: "20px 24px 0", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: p.color, marginBottom: "6px" }}>{p.category}</div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(15px, 1.2vw, 17px)", color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.25, margin: "0 0 4px" }}>
                        {p.title}
                    </h3>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginBottom: "12px" }}>{p.author}</p>
                    <Stars rating={p.rating} reviews={p.reviews} />
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "8px", marginBottom: "0" }}>
                        {p.format} · {p.pages}
                    </p>
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "16px 24px 0" }} />

                {/* Footer */}
                <div style={{ padding: "16px 24px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                    <div>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 700, color: soldOut ? "rgba(255,255,255,0.25)" : "var(--gold)" }}>{p.price}</span>
                        {p.originalPrice && (
                            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", textDecoration: "line-through", marginLeft: "6px" }}>{p.originalPrice}</span>
                        )}
                    </div>
                    {soldOut ? (
                        <span style={{ fontSize: "11px", letterSpacing: "0.08em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>Sold Out</span>
                    ) : (
                        <button
                            onClick={() => setAdded(true)}
                            style={{
                                padding: "9px 16px",
                                background: added ? "rgba(125,212,176,0.1)" : hovered ? "var(--gold)" : "rgba(201,168,76,0.1)",
                                border: added ? "1px solid rgba(125,212,176,0.3)" : `1px solid ${hovered ? "var(--gold)" : "rgba(201,168,76,0.2)"}`,
                                borderRadius: "5px",
                                fontSize: "11px",
                                fontWeight: 700,
                                letterSpacing: "0.07em",
                                textTransform: "uppercase",
                                color: added ? "#7DD4B0" : hovered ? "#0a0a0a" : "var(--gold)",
                                cursor: "pointer",
                                transition: "all 0.25s ease",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {added ? "✓ Added" : "Add to Cart"}
                        </button>
                    )}
                </div>
            </div>
        </AnimatedSection>
    );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function ShopPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeSort, setActiveSort] = useState("Featured");
    const [cartCount, setCartCount] = useState(0);

    return (
        <>
            <Navbar />
            {/* ── Hero ── */}
            <section
                style={{
                    paddingTop: "160px",
                    paddingBottom: "100px",
                    background: "var(--bg)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div style={{ position: "absolute", top: "-150px", right: "-200px", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

                <div className="container">
                    <AnimatedSection>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                            <span style={{ display: "inline-block", width: "28px", height: "1px", background: "var(--gold)" }} />
                            <span style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)" }}>Shop</span>
                        </div>

                        <h1
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "clamp(44px, 6.5vw, 88px)",
                                lineHeight: 1,
                                letterSpacing: "-0.03em",
                                color: "#fff",
                                maxWidth: "700px",
                                margin: "0 0 24px",
                            }}
                        >
                            Books worth
                            <br />
                            <span style={{ color: "transparent", WebkitTextStroke: "1px rgba(201,168,76,0.55)" }}>
                owning.
              </span>
                        </h1>

                        <p style={{ fontSize: "17px", lineHeight: 1.75, color: "rgba(255,255,255,0.45)", maxWidth: "460px", marginBottom: "40px" }}>
                            Curated titles across fiction, design, illustration, and photography — from independent authors and small presses worldwide.
                        </p>

                        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                            <Link
                                href="#shop"
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: "8px",
                                    padding: "14px 28px", background: "var(--gold)", color: "#0a0a0a",
                                    borderRadius: "6px", fontWeight: 700, fontSize: "13px",
                                    letterSpacing: "0.06em", textDecoration: "none", textTransform: "uppercase",
                                }}
                            >
                                Browse Books ↓
                            </Link>
                            <Link href="/" style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none", letterSpacing: "0.04em" }}>
                                ← Back to Home
                            </Link>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ── Stats Bar ── */}
            <section style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "#0a0a0a", padding: "28px 0" }}>
                <div className="container">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(24px, 5vw, 72px)", flexWrap: "wrap" }}>
                        {[
                            { value: "2.1M+", label: "Books Sold" },
                            { value: "480+", label: "Titles Available" },
                            { value: "Free", label: "Shipping over $60" },
                            { value: "30 Days", label: "Return Policy" },
                        ].map((s) => (
                            <div key={s.label} style={{ textAlign: "center" }}>
                                <div style={{ fontFamily: "var(--font-display)", fontSize: "26px", fontWeight: 700, color: "var(--gold)", letterSpacing: "-0.02em" }}>{s.value}</div>
                                <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Featured ── */}
            <section style={{ background: "#0a0a0a", paddingTop: "80px", paddingBottom: "0" }}>
                <div className="container">
                    <FeaturedProduct />
                </div>
            </section>

            {/* ── Grid ── */}
            <section id="shop" style={{ background: "#0a0a0a", padding: "56px 0 120px" }}>
                <div className="container">
                    {/* Filter + Sort row */}
                    <AnimatedSection>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "40px" }}>
                            {/* Category filters */}
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        style={{
                                            padding: "7px 16px", fontSize: "12px", letterSpacing: "0.06em",
                                            background: activeCategory === cat ? "rgba(201,168,76,0.12)" : "transparent",
                                            border: `1px solid ${activeCategory === cat ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.08)"}`,
                                            borderRadius: "100px",
                                            color: activeCategory === cat ? "var(--gold)" : "rgba(255,255,255,0.4)",
                                            cursor: "pointer", transition: "all 0.2s ease",
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {/* Sort */}
                            <select
                                value={activeSort}
                                onChange={(e) => setActiveSort(e.target.value)}
                                style={{
                                    padding: "7px 14px",
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: "6px",
                                    color: "rgba(255,255,255,0.5)",
                                    fontSize: "12px",
                                    letterSpacing: "0.04em",
                                    cursor: "pointer",
                                    outline: "none",
                                }}
                            >
                                {sortOptions.map((o) => (
                                    <option key={o} value={o} style={{ background: "#111" }}>{o}</option>
                                ))}
                            </select>
                        </div>
                    </AnimatedSection>

                    {/* Cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
                        {products.map((p, i) => (
                            <ProductCard key={p.id} p={p} i={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section style={{ background: "#080808", borderTop: "1px solid rgba(255,255,255,0.04)", padding: "100px 0", textAlign: "center" }}>
                <div className="container">
                    <AnimatedSection>
                        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
                            <div style={{ width: "48px", height: "1px", background: "var(--gold)", margin: "0 auto 32px" }} />
                            <h2
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: "clamp(28px, 3.5vw, 44px)",
                                    color: "#fff",
                                    letterSpacing: "-0.03em",
                                    lineHeight: 1.1,
                                    margin: "0 0 20px",
                                }}
                            >
                                Sell your book here.
                            </h2>
                            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "36px" }}>
                                Are you an author or small press? List your titles in our curated shop and reach readers who care about craft.
                            </p>
                            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                                <Link
                                    href="/publish"
                                    style={{
                                        display: "inline-flex", alignItems: "center", gap: "8px",
                                        padding: "14px 32px", background: "var(--gold)", color: "#0a0a0a",
                                        borderRadius: "6px", fontWeight: 700, fontSize: "13px",
                                        letterSpacing: "0.08em", textDecoration: "none", textTransform: "uppercase",
                                    }}
                                >
                                    Start Selling
                                </Link>
                                <Link
                                    href="/success-stories"
                                    style={{
                                        display: "inline-flex", alignItems: "center", gap: "8px",
                                        padding: "14px 32px", border: "1px solid rgba(255,255,255,0.12)",
                                        borderRadius: "6px", color: "rgba(255,255,255,0.6)", fontSize: "13px",
                                        letterSpacing: "0.08em", textDecoration: "none", textTransform: "uppercase",
                                    }}
                                >
                                    Read Success Stories
                                </Link>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            <Footer/>
        </>
    );
}