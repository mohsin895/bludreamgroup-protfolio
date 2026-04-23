"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    removeItem,
    updateQuantity,
    clearCart,
    selectCartItems,
    selectTotalPrice,
    selectTotalItems,
} from "@/store/cartSlice";
import { calcShipping, formatPrice } from "@/lib/api/order";

// ─── Skeleton row ──────────────────────────────────────────────────────────────

function SkeletonRow() {
    return (
        <div style={{ display: "flex", gap: "20px", padding: "24px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", alignItems: "center" }}>
            <div style={{ width: "80px", height: "100px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", flexShrink: 0, animation: "shimmer 1.5s ease-in-out infinite" }} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ width: "60%", height: "14px", borderRadius: "3px", background: "rgba(255,255,255,0.06)", animation: "shimmer 1.5s ease-in-out infinite" }} />
                <div style={{ width: "40%", height: "11px", borderRadius: "3px", background: "rgba(255,255,255,0.04)", animation: "shimmer 1.5s ease-in-out infinite 0.1s" }} />
            </div>
            <div style={{ width: "100px", height: "32px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", animation: "shimmer 1.5s ease-in-out infinite 0.2s" }} />
            <div style={{ width: "60px", height: "16px", borderRadius: "3px", background: "rgba(255,255,255,0.06)", animation: "shimmer 1.5s ease-in-out infinite 0.15s" }} />
        </div>
    );
}

// ─── Cart item row ─────────────────────────────────────────────────────────────

function CartRow({ cartKey, product, quantity }: { cartKey: string; product: any; quantity: number }) {
    const dispatch = useAppDispatch();
    const maxQty   = product.stock ?? Infinity;
    const [imgErr, setImgErr] = useState(false);

    return (
        <div
            style={{
                display:       "flex",
                gap:           "20px",
                padding:       "24px 0",
                borderBottom:  "1px solid rgba(255,255,255,0.06)",
                alignItems:    "center",
                flexWrap:      "wrap",
            }}
        >
            {/* Image */}
            <Link href={`/books/${product.slug}`} style={{ textDecoration: "none", flexShrink: 0 }}>
                <div
                    style={{
                        width:        "80px",
                        height:       "100px",
                        borderRadius: "6px",
                        overflow:     "hidden",
                        background:   "rgba(255,255,255,0.04)",
                        border:       "1px solid rgba(255,255,255,0.06)",
                        display:      "flex",
                        alignItems:   "center",
                        justifyContent: "center",
                    }}
                >
                    {product.image && !imgErr ? (
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={80}
                            height={100}
                            style={{ objectFit: "cover", width: "100%", height: "100%" }}
                            onError={() => setImgErr(true)}
                        />
                    ) : (
                        <ShoppingBag size={24} style={{ color: "rgba(255,255,255,0.15)" }} />
                    )}
                </div>
            </Link>

            {/* Info */}
            <div style={{ flex: 1, minWidth: "140px" }}>
                <Link href={`/books/${product.slug}`} style={{ textDecoration: "none" }}>
                    <p style={{ fontSize: "15px", fontWeight: 500, color: "var(--text)", fontFamily: "var(--font-display)", lineHeight: 1.3, marginBottom: "6px" }}>
                        {product.name}
                    </p>
                </Link>
                {product.formatLabel && (
                    <span style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold)", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "3px", padding: "2px 8px" }}>
            {product.formatLabel}
          </span>
                )}
                {product.color && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
                        <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: product.colorHex ?? "#888", display: "inline-block", border: "1px solid rgba(255,255,255,0.1)" }} />
                        <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "capitalize" }}>{product.color}</span>
                        {product.size && <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>/ {product.size}</span>}
                    </div>
                )}
                {/* Unit price */}
                <p style={{ fontSize: "12px", color: "var(--text-dim)", marginTop: "4px" }}>
                    {formatPrice(product.price)} each
                </p>
            </div>

            {/* Quantity stepper */}
            <div
                style={{
                    display:      "flex",
                    alignItems:   "center",
                    gap:          "0",
                    background:   "rgba(255,255,255,0.03)",
                    border:       "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "6px",
                    overflow:     "hidden",
                    flexShrink:   0,
                }}
            >
                <button
                    onClick={() => dispatch(updateQuantity({ cartKey, quantity: quantity - 1 }))}
                    disabled={quantity <= 1}
                    style={{
                        width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center",
                        background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: quantity <= 1 ? "not-allowed" : "pointer",
                        opacity: quantity <= 1 ? 0.3 : 1, transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => { if (quantity > 1) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "none"; }}
                >
                    <Minus size={13} />
                </button>
                <span style={{ width: "32px", textAlign: "center", fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>
          {quantity}
        </span>
                <button
                    onClick={() => dispatch(updateQuantity({ cartKey, quantity: quantity + 1 }))}
                    disabled={quantity >= maxQty}
                    style={{
                        width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center",
                        background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: quantity >= maxQty ? "not-allowed" : "pointer",
                        opacity: quantity >= maxQty ? 0.3 : 1, transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => { if (quantity < maxQty) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "none"; }}
                >
                    <Plus size={13} />
                </button>
            </div>

            {/* Line total */}
            <div style={{ minWidth: "80px", textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--gold)" }}>
                    {formatPrice(product.price * quantity)}
                </p>
                {quantity > 1 && (
                    <p style={{ fontSize: "11px", color: "var(--text-dim)", marginTop: "2px" }}>
                        {formatPrice(product.price)} × {quantity}
                    </p>
                )}
            </div>

            {/* Remove */}
            <button
                onClick={() => dispatch(removeItem(cartKey))}
                title="Remove"
                style={{
                    width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center",
                    background: "none", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "6px",
                    color: "rgba(255,255,255,0.25)", cursor: "pointer", transition: "all 0.2s", flexShrink: 0,
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#C47C5A"; (e.currentTarget as HTMLElement).style.borderColor = "#C47C5A44"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.25)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}
            >
                <Trash2 size={14} />
            </button>
        </div>
    );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CartPage() {
    const dispatch    = useAppDispatch();
    const items       = useAppSelector(selectCartItems);
    const subtotal    = useAppSelector(selectTotalPrice);
    const totalItems  = useAppSelector(selectTotalItems);
    const [mounted,  setMounted]  = useState(false);
    const [clearing, setClearing] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const shipping    = calcShipping(subtotal);
    const total       = subtotal + shipping;
    const freeAt      = 100;
    const progressPct = Math.min((subtotal / freeAt) * 100, 100);

    return (
        <>
            <Navbar />

            {/* ── Hero ── */}
            <section style={{ paddingTop: "120px", paddingBottom: "48px", background: "var(--bg)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="container">
                    <AnimatedSection>
                        <div className="section-label">Shopping</div>
                        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(42px, 5vw, 68px)", marginTop: "6px", letterSpacing: "-0.02em" }}>
                            Your Cart
                            {mounted && totalItems > 0 && (
                                <span style={{ fontSize: "clamp(18px, 2vw, 24px)", color: "var(--gold)", marginLeft: "16px", fontWeight: 400 }}>
                  ({totalItems} item{totalItems !== 1 ? "s" : ""})
                </span>
                            )}
                        </h1>
                        <Link href="/books" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none", marginTop: "12px", letterSpacing: "0.04em" }}>
                            ← Continue Shopping
                        </Link>
                    </AnimatedSection>
                </div>
            </section>

            {/* ── Body ── */}
            <section style={{ background: "#0c0c0c", paddingTop: "48px", paddingBottom: "120px" }}>
                <div className="container">

                    {/* Loading skeletons (before hydration) */}
                    {!mounted && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "48px", alignItems: "start" }}>
                            <div>{[1,2,3].map((n) => <SkeletonRow key={n} />)}</div>
                            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "32px", display: "flex", flexDirection: "column", gap: "14px" }}>
                                {[80, 60, 100, 40].map((w, i) => (
                                    <div key={i} style={{ height: "16px", width: `${w}%`, borderRadius: "3px", background: "rgba(255,255,255,0.05)", animation: "shimmer 1.5s ease-in-out infinite" }} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty state */}
                    {mounted && items.length === 0 && (
                        <AnimatedSection>
                            <div style={{ textAlign: "center", padding: "80px 0" }}>
                                <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                                    <ShoppingBag size={32} style={{ color: "rgba(255,255,255,0.15)" }} />
                                </div>
                                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "var(--text)", marginBottom: "12px" }}>Your cart is empty</h2>
                                <p style={{ color: "var(--text-muted)", fontSize: "15px", marginBottom: "32px" }}>Add some books to get started.</p>
                                <Link href="/books" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                                    Browse Books <ArrowRight size={14} />
                                </Link>
                            </div>
                        </AnimatedSection>
                    )}

                    {/* Cart with items */}
                    {mounted && items.length > 0 && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "48px", alignItems: "start" }} className="cart-grid">

                            {/* ── Left: Items ── */}
                            <div>
                                {/* Free shipping progress */}
                                {subtotal < freeAt && (
                                    <AnimatedSection>
                                        <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "8px", padding: "14px 20px", marginBottom: "24px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                                                <Tag size={14} style={{ color: "var(--gold)" }} />
                                                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>
                          Add <strong style={{ color: "var(--gold)" }}>{formatPrice(freeAt - subtotal)}</strong> more for free shipping!
                        </span>
                                            </div>
                                            <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
                                                <div style={{ height: "100%", width: `${progressPct}%`, background: "var(--gold)", borderRadius: "2px", transition: "width 0.4s ease" }} />
                                            </div>
                                        </div>
                                    </AnimatedSection>
                                )}
                                {subtotal >= freeAt && (
                                    <div style={{ background: "rgba(124,154,126,0.08)", border: "1px solid rgba(124,154,126,0.2)", borderRadius: "8px", padding: "12px 20px", marginBottom: "24px", fontSize: "13px", color: "#7C9A7E", display: "flex", alignItems: "center", gap: "8px" }}>
                                        🎉 You qualify for free shipping!
                                    </div>
                                )}

                                {/* Item rows */}
                                <div>
                                    {items.map((item) => (
                                        <CartRow key={item.cartKey} {...item} />
                                    ))}
                                </div>

                                {/* Clear cart */}
                                <div style={{ paddingTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                                    <button
                                        onClick={() => { setClearing(true); setTimeout(() => { dispatch(clearCart()); setClearing(false); }, 300); }}
                                        style={{
                                            display: "inline-flex", alignItems: "center", gap: "6px",
                                            background: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px",
                                            padding: "8px 16px", fontSize: "12px", color: "rgba(255,255,255,0.3)",
                                            cursor: "pointer", letterSpacing: "0.06em", transition: "all 0.2s",
                                        }}
                                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#C47C5A"; (e.currentTarget as HTMLElement).style.borderColor = "#C47C5A44"; }}
                                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
                                    >
                                        <Trash2 size={12} />
                                        {clearing ? "Clearing…" : "Clear Cart"}
                                    </button>
                                </div>
                            </div>

                            {/* ── Right: Summary ── */}
                            <AnimatedSection delay={0.1}>
                                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "32px", position: "sticky", top: "100px" }}>
                                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", marginBottom: "24px", letterSpacing: "-0.01em" }}>Order Summary</h3>

                                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "var(--text-muted)" }}>
                                            <span>Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})</span>
                                            <span style={{ fontWeight: 600, color: "var(--text)" }}>{formatPrice(subtotal)}</span>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "var(--text-muted)" }}>
                                            <span>Shipping</span>
                                            <span style={{ fontWeight: 600, color: shipping === 0 ? "#7C9A7E" : "var(--text)" }}>
                        {shipping === 0 ? "FREE" : formatPrice(shipping)}
                      </span>
                                        </div>
                                    </div>

                                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px", marginBottom: "24px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: 700 }}>
                                            <span style={{ color: "var(--text)" }}>Total</span>
                                            <span style={{ color: "var(--gold)" }}>{formatPrice(total)}</span>
                                        </div>
                                    </div>

                                    <Link
                                        href="/checkout"
                                        className="btn-primary"
                                        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "14px", fontSize: "14px", textDecoration: "none" }}
                                    >
                                        Proceed to Checkout <ArrowRight size={15} />
                                    </Link>

                                    <Link
                                        href="/books"
                                        style={{ display: "block", textAlign: "center", marginTop: "14px", fontSize: "12px", color: "rgba(255,255,255,0.3)", textDecoration: "none", letterSpacing: "0.04em" }}
                                    >
                                        ← Continue Shopping
                                    </Link>

                                    {/* Trust badges */}
                                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "20px", marginTop: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                        {["🔒 Secure checkout", "📦 Free shipping over $100", "↩️ 30-day returns"].map((b) => (
                                            <p key={b} style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", gap: "6px" }}>
                                                {b}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </AnimatedSection>
                        </div>
                    )}
                </div>
            </section>

            <style>{`
        @keyframes shimmer { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @media(max-width:860px){ .cart-grid{grid-template-columns:1fr!important;} }
      `}</style>

            <Footer />
        </>
    );
}