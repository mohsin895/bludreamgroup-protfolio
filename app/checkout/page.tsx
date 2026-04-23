"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Check, AlertCircle, Loader2, ChevronDown } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCart, selectCartItems, selectTotalPrice, selectTotalItems } from "@/store/cartSlice";
import { placeOrder, calcShipping, formatPrice, type PlaceOrderPayload } from "@/lib/api/order";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BillingForm {
    name: string; email: string; phone: string;
    address: string; city: string; state: string; zip: string; country: string;
}

const EMPTY_FORM: BillingForm = {
    name: "", email: "", phone: "",
    address: "", city: "", state: "", zip: "", country: "US",
};

type PaymentMethod = "cod" | "card" | "bkash" | "nagad";

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({
                   label, name, value, onChange, type = "text", required = true, placeholder,
               }: {
    label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string; required?: boolean; placeholder?: string;
}) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
                {label}{required && <span style={{ color: "var(--gold)", marginLeft: "2px" }}>*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder ?? label}
                style={{
                    background:   "rgba(255,255,255,0.04)",
                    border:       "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    padding:      "12px 14px",
                    fontSize:     "14px",
                    color:        "#fff",
                    outline:      "none",
                    fontFamily:   "inherit",
                    transition:   "border-color 0.2s",
                    width:        "100%",
                    boxSizing:    "border-box",
                }}
                onFocus={(e)  => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)")}
                onBlur={(e)   => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            />
        </div>
    );
}

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; desc: string; emoji: string }[] = [
    { id: "cod",   label: "Cash on Delivery",  desc: "Pay when your order arrives",       emoji: "💵" },
    { id: "card",  label: "Credit / Debit Card",desc: "Visa, Mastercard, Amex",            emoji: "💳" },
    { id: "bkash", label: "bKash",              desc: "Mobile banking — fast & secure",    emoji: "📱" },
    { id: "nagad", label: "Nagad",              desc: "Mobile financial service",          emoji: "📲" },
];

// ─── Success screen ───────────────────────────────────────────────────────────

function OrderSuccess({ orderNumber }: { orderNumber: string }) {
    return (
        <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center" }}>
            <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(124,154,126,0.15)", border: "2px solid #7C9A7E", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "28px" }}>
                <Check size={32} style={{ color: "#7C9A7E" }} />
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3vw, 42px)", marginBottom: "12px", letterSpacing: "-0.02em" }}>
                Order Placed!
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "16px", marginBottom: "6px" }}>
                Thank you for your purchase.
            </p>
            <p style={{ color: "var(--gold)", fontSize: "14px", letterSpacing: "0.06em", marginBottom: "36px" }}>
                Order #{orderNumber}
            </p>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px", maxWidth: "400px", lineHeight: 1.7, marginBottom: "36px" }}>
                A confirmation email will be sent to you shortly. You can track your order from the orders page.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                <Link href="/orders" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                    View My Orders
                </Link>
                <Link href="/books" className="btn-outline" style={{ display: "inline-flex" }}>
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
    const dispatch   = useAppDispatch();
    const items      = useAppSelector(selectCartItems);
    const subtotal   = useAppSelector(selectTotalPrice);
    const totalItems = useAppSelector(selectTotalItems);
    const router     = useRouter();

    const [mounted,   setMounted]   = useState(false);
    const [billing,   setBilling]   = useState<BillingForm>(EMPTY_FORM);
    const [shipDiff,  setShipDiff]  = useState(false);
    const [shipping2, setShipping2] = useState<BillingForm>(EMPTY_FORM);
    const [payment,   setPayment]   = useState<PaymentMethod>("cod");
    const [notes,     setNotes]     = useState("");
    const [loading,   setLoading]   = useState(false);
    const [error,     setError]     = useState<string | null>(null);
    const [success,   setSuccess]   = useState<string | null>(null);   // order number

    useEffect(() => { setMounted(true); }, []);
    useEffect(() => { if (mounted && items.length === 0 && !success) router.replace("/cart"); }, [mounted, items]);

    const shippingCost = calcShipping(subtotal);
    const total        = subtotal + shippingCost;

    function handleBilling(e: React.ChangeEvent<HTMLInputElement>) {
        setBilling((p) => ({ ...p, [e.target.name]: e.target.value }));
    }
    function handleShipping2(e: React.ChangeEvent<HTMLInputElement>) {
        setShipping2((p) => ({ ...p, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const payload: PlaceOrderPayload = {
            billing_name:    billing.name,
            billing_email:   billing.email,
            billing_phone:   billing.phone,
            billing_address: billing.address,
            billing_city:    billing.city,
            billing_state:   billing.state,
            billing_zip:     billing.zip,
            billing_country: billing.country,
            ship_to_different: shipDiff,
            ...(shipDiff ? {
                shipping_name:    shipping2.name,
                shipping_address: shipping2.address,
                shipping_city:    shipping2.city,
                shipping_state:   shipping2.state,
                shipping_zip:     shipping2.zip,
                shipping_country: shipping2.country,
            } : {}),
            payment_method: payment,
            notes: notes || undefined,
            items: items.map((i) => ({
                product_id: i.product.id,
                format_id:  i.product.formatId ?? null,
                name:       i.product.name,
                price:      i.product.price,
                quantity:   i.quantity,
            })),
        };

        try {
            const order = await placeOrder(payload);
            dispatch(clearCart());
            setSuccess(order.orderNumber);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Order failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if (!mounted) {
        return (
            <>
                <Navbar />
                <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Loader2 size={28} style={{ color: "var(--gold)", animation: "spin 1s linear infinite" }} />
                    <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            {/* ── Hero ── */}
            <section style={{ paddingTop: "120px", paddingBottom: "48px", background: "var(--bg)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="container">
                    <AnimatedSection>
                        <div className="section-label">Checkout</div>
                        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(42px, 5vw, 68px)", marginTop: "6px", letterSpacing: "-0.02em" }}>
                            Complete Your Order
                        </h1>
                        <Link href="/cart" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none", marginTop: "12px" }}>
                            ← Back to Cart
                        </Link>
                    </AnimatedSection>
                </div>
            </section>

            {/* ── Body ── */}
            <section style={{ background: "#0c0c0c", paddingTop: "48px", paddingBottom: "120px" }}>
                <div className="container">

                    {/* Success screen */}
                    {success && <OrderSuccess orderNumber={success} />}

                    {/* Checkout form */}
                    {!success && (
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "48px", alignItems: "start" }} className="checkout-grid">

                                {/* ── Left: Forms ── */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>

                                    {/* Billing */}
                                    <AnimatedSection>
                                        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "32px" }}>
                                            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", marginBottom: "24px", letterSpacing: "-0.01em" }}>
                                                Billing Information
                                            </h2>
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                                <div style={{ gridColumn: "1 / -1" }}>
                                                    <Field label="Full Name"     name="name"    value={billing.name}    onChange={handleBilling} />
                                                </div>
                                                <Field label="Email Address"   name="email"   value={billing.email}   onChange={handleBilling} type="email" />
                                                <Field label="Phone Number"    name="phone"   value={billing.phone}   onChange={handleBilling} type="tel" />
                                                <div style={{ gridColumn: "1 / -1" }}>
                                                    <Field label="Street Address" name="address" value={billing.address} onChange={handleBilling} />
                                                </div>
                                                <Field label="City"            name="city"    value={billing.city}    onChange={handleBilling} />
                                                <Field label="State / Region"  name="state"   value={billing.state}   onChange={handleBilling} required={false} />
                                                <Field label="ZIP / Postal"    name="zip"     value={billing.zip}     onChange={handleBilling} required={false} />
                                                <Field label="Country"         name="country" value={billing.country} onChange={handleBilling} />
                                            </div>
                                        </div>
                                    </AnimatedSection>

                                    {/* Ship to different address toggle */}
                                    <AnimatedSection delay={0.05}>
                                        <label
                                            style={{
                                                display: "flex", alignItems: "center", gap: "12px",
                                                padding: "16px 20px",
                                                background: shipDiff ? "rgba(201,168,76,0.06)" : "rgba(255,255,255,0.02)",
                                                border: `1px solid ${shipDiff ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.06)"}`,
                                                borderRadius: "8px", cursor: "pointer", transition: "all 0.2s",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "18px", height: "18px", borderRadius: "4px", flexShrink: 0,
                                                    background: shipDiff ? "var(--gold)" : "transparent",
                                                    border: `2px solid ${shipDiff ? "var(--gold)" : "rgba(255,255,255,0.2)"}`,
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    transition: "all 0.2s",
                                                }}
                                                onClick={() => setShipDiff((p) => !p)}
                                            >
                                                {shipDiff && <Check size={11} style={{ color: "#0a0a0a" }} />}
                                            </div>
                                            <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                        Ship to a different address
                      </span>
                                        </label>

                                        {shipDiff && (
                                            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "32px", marginTop: "16px" }}>
                                                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", marginBottom: "20px" }}>Shipping Address</h3>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                                    <div style={{ gridColumn: "1 / -1" }}>
                                                        <Field label="Full Name"     name="name"    value={shipping2.name}    onChange={handleShipping2} />
                                                    </div>
                                                    <div style={{ gridColumn: "1 / -1" }}>
                                                        <Field label="Street Address" name="address" value={shipping2.address} onChange={handleShipping2} />
                                                    </div>
                                                    <Field label="City"           name="city"    value={shipping2.city}    onChange={handleShipping2} />
                                                    <Field label="State / Region" name="state"   value={shipping2.state}   onChange={handleShipping2} required={false} />
                                                    <Field label="ZIP / Postal"   name="zip"     value={shipping2.zip}     onChange={handleShipping2} required={false} />
                                                    <Field label="Country"        name="country" value={shipping2.country} onChange={handleShipping2} />
                                                </div>
                                            </div>
                                        )}
                                    </AnimatedSection>

                                    {/* Payment */}
                                    <AnimatedSection delay={0.08}>
                                        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "32px" }}>
                                            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", marginBottom: "24px", letterSpacing: "-0.01em" }}>
                                                Payment Method
                                            </h2>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                                {PAYMENT_OPTIONS.map((opt) => (
                                                    <label
                                                        key={opt.id}
                                                        style={{
                                                            display: "flex", alignItems: "center", gap: "14px",
                                                            padding: "16px 20px",
                                                            background: payment === opt.id ? "rgba(201,168,76,0.06)" : "transparent",
                                                            border: `1px solid ${payment === opt.id ? "rgba(201,168,76,0.25)" : "rgba(255,255,255,0.07)"}`,
                                                            borderRadius: "8px", cursor: "pointer", transition: "all 0.2s",
                                                        }}
                                                        onClick={() => setPayment(opt.id)}
                                                    >
                                                        <div
                                                            style={{
                                                                width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
                                                                border: `2px solid ${payment === opt.id ? "var(--gold)" : "rgba(255,255,255,0.2)"}`,
                                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                                background: payment === opt.id ? "var(--gold)" : "transparent",
                                                                transition: "all 0.2s",
                                                            }}
                                                        >
                                                            {payment === opt.id && <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#0a0a0a" }} />}
                                                        </div>
                                                        <span style={{ fontSize: "22px" }}>{opt.emoji}</span>
                                                        <div>
                                                            <p style={{ fontSize: "14px", fontWeight: 600, color: payment === opt.id ? "var(--gold)" : "var(--text)", margin: 0 }}>
                                                                {opt.label}
                                                            </p>
                                                            <p style={{ fontSize: "12px", color: "var(--text-dim)", margin: 0, marginTop: "2px" }}>
                                                                {opt.desc}
                                                            </p>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </AnimatedSection>

                                    {/* Notes */}
                                    <AnimatedSection delay={0.1}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                            <label style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
                                                Order Notes (optional)
                                            </label>
                                            <textarea
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                placeholder="Special instructions, personalisation requests…"
                                                rows={3}
                                                style={{
                                                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                                                    borderRadius: "6px", padding: "12px 14px", fontSize: "14px", color: "#fff",
                                                    outline: "none", fontFamily: "inherit", resize: "vertical", transition: "border-color 0.2s",
                                                }}
                                                onFocus={(e)  => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)")}
                                                onBlur={(e)   => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                                            />
                                        </div>
                                    </AnimatedSection>

                                    {/* Error */}
                                    {error && (
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(196,124,90,0.08)", border: "1px solid rgba(196,124,90,0.2)", borderRadius: "8px", padding: "14px 18px", color: "#C47C5A", fontSize: "14px" }}>
                                            <AlertCircle size={16} style={{ flexShrink: 0 }} />
                                            {error}
                                        </div>
                                    )}

                                    {/* Submit (mobile) */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary checkout-desktop-hide"
                                        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "16px", fontSize: "15px", width: "100%", opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
                                    >
                                        {loading ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Placing Order…</> : `Place Order · ${formatPrice(total)}`}
                                    </button>
                                </div>

                                {/* ── Right: Order summary ── */}
                                <AnimatedSection delay={0.05}>
                                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "28px", position: "sticky", top: "100px" }}>
                                        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", marginBottom: "20px" }}>
                                            Your Order ({totalItems})
                                        </h3>

                                        {/* Items list */}
                                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px", maxHeight: "300px", overflowY: "auto" }}>
                                            {items.map((item) => {
                                                const [imgErr, setImgErr] = [false, () => {}]; // simplified; errors silently hide image
                                                return (
                                                    <div key={item.cartKey} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                                        <div style={{ width: "44px", height: "56px", borderRadius: "4px", overflow: "hidden", background: "rgba(255,255,255,0.04)", flexShrink: 0 }}>
                                                            {item.product.image ? (
                                                                <img src={item.product.image} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                            ) : (
                                                                <ShoppingBag size={16} style={{ color: "rgba(255,255,255,0.1)", margin: "auto", display: "block", marginTop: "20px" }} />
                                                            )}
                                                        </div>
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                                {item.product.name}
                                                            </p>
                                                            {item.product.formatLabel && (
                                                                <p style={{ fontSize: "11px", color: "var(--text-dim)" }}>{item.product.formatLabel}</p>
                                                            )}
                                                            <p style={{ fontSize: "11px", color: "var(--text-dim)" }}>Qty: {item.quantity}</p>
                                                        </div>
                                                        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--gold)", flexShrink: 0 }}>
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--text-muted)" }}>
                                                <span>Subtotal</span><span style={{ fontWeight: 600, color: "var(--text)" }}>{formatPrice(subtotal)}</span>
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--text-muted)" }}>
                                                <span>Shipping</span>
                                                <span style={{ fontWeight: 600, color: shippingCost === 0 ? "#7C9A7E" : "var(--text)" }}>
                          {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
                        </span>
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "17px", fontWeight: 700, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
                                                <span style={{ color: "var(--text)" }}>Total</span>
                                                <span style={{ color: "var(--gold)" }}>{formatPrice(total)}</span>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn-primary checkout-mobile-hide"
                                            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "14px", fontSize: "14px", width: "100%", marginTop: "20px", opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
                                        >
                                            {loading
                                                ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Placing Order…</>
                                                : `Place Order · ${formatPrice(total)}`}
                                        </button>

                                        {/* Trust */}
                                        <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                                            {["🔒 SSL encrypted", "📦 Tracked shipping", "↩️ 30-day returns"].map((b) => (
                                                <p key={b} style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", margin: 0 }}>{b}</p>
                                            ))}
                                        </div>
                                    </div>
                                </AnimatedSection>
                            </div>
                        </form>
                    )}
                </div>
            </section>

            <style>{`
        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @media(max-width:860px){
          .checkout-grid{grid-template-columns:1fr!important;}
          .checkout-desktop-hide{display:flex!important;}
          .checkout-mobile-hide{display:none!important;}
        }
        @media(min-width:861px){
          .checkout-desktop-hide{display:none!important;}
          .checkout-mobile-hide{display:flex!important;}
        }
      `}</style>

            <Footer />
        </>
    );
}