"use client"
// app/checkout/page.tsx — Complete checkout using useCheckout hook

import { useState, useEffect } from "react"
import Link from "next/link"
import {
    ShoppingBag, Check, AlertCircle, Loader2, ChevronRight,
} from "lucide-react"
import AnimatedSection from "@/components/AnimatedSection"
import Navbar          from "@/components/Navbar"
import Footer          from "@/components/Footer"
import { useCheckout, resolvePaymentMethods } from "@/hooks/useCheckout"
import { formatPrice } from "@/lib/api/orderApi"
import { useAppSelector } from "@/store/hooks"
import { selectCartItems, selectTotalItems } from "@/store/cartSlice"

// ── Field ─────────────────────────────────────────────────────────────────────

function Field({
                   label, name, value, onChange, type = "text", required = true,
                   placeholder, error,
               }: {
    label: string; name: string; value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    type?: string; required?: boolean; placeholder?: string; error?: string
}) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
                {label}{required && <span style={{ color: "var(--gold)", marginLeft: "2px" }}>*</span>}
            </label>
            <input
                type={type} name={name} value={value} onChange={onChange}
                required={required} placeholder={placeholder ?? label}
                style={{
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "6px", padding: "12px 14px", fontSize: "14px",
                    color: "#fff", outline: "none", fontFamily: "inherit",
                    transition: "border-color 0.2s", width: "100%", boxSizing: "border-box",
                }}
                onFocus={(e)  => { e.currentTarget.style.borderColor = error ? "rgba(239,68,68,0.7)" : "rgba(201,168,76,0.4)" }}
                onBlur={(e)   => { e.currentTarget.style.borderColor = error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)" }}
            />
            {error && <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "2px" }}>{error}</p>}
        </div>
    )
}

// ── Payment icons ─────────────────────────────────────────────────────────────

const PAYMENT_META: Record<string, { label: string; desc: string; emoji: string }> = {
    cod:        { label: "Cash on Delivery", desc: "Pay when your order arrives",    emoji: "💵" },
    card:       { label: "Card",             desc: "Visa, Mastercard, Amex",          emoji: "💳" },
    bkash:      { label: "bKash",            desc: "Mobile banking — fast & secure",  emoji: "📱" },
    nagad:      { label: "Nagad",            desc: "Mobile financial service",        emoji: "📲" },
    bank:       { label: "Bank Transfer",    desc: "Direct bank transfer",            emoji: "🏦" },
    sslcommerz: { label: "SSLCommerz",       desc: "Secure online payment",           emoji: "🔐" },
}

// ── Success ───────────────────────────────────────────────────────────────────

function OrderSuccess({ orderNumber }: { orderNumber: string }) {
    return (
        <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", textAlign: "center" }}>
            <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(124,154,126,0.15)", border: "2px solid #7C9A7E", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "28px" }}>
                <Check size={32} style={{ color: "#7C9A7E" }} />
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3vw, 42px)", marginBottom: "12px" }}>Order Placed!</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "16px", marginBottom: "6px" }}>Thank you for your purchase.</p>
            <p style={{ color: "var(--gold)", fontSize: "14px", letterSpacing: "0.06em", marginBottom: "36px" }}>Order #{orderNumber}</p>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "14px", maxWidth: "400px", lineHeight: 1.7, marginBottom: "36px" }}>
                A confirmation email will be sent to you shortly.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                <Link href="/orders" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>View My Orders</Link>
                <Link href="/books"  className="btn-outline" style={{ display: "inline-flex" }}>Continue Shopping</Link>
            </div>
        </div>
    )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
    const [agree, setAgree]     = useState(false)
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    const items      = useAppSelector(selectCartItems)
    const totalItems = useAppSelector(selectTotalItems)

    const {
        contact, setContact,
        address, setAddress,
        selectedZoneIndex, setSelectedZoneIndex,
        payMethod, setPayMethod,
        cardForm, setCardForm,
        mobileNumber, setMobileNumber,
        bankRef, setBankRef,
        notes, setNotes,
        pricing, orderAmountError,
        settings, settingsLoading,
        loading, error, fieldErrors, orderResult,
        submit,
    } = useCheckout({ agree })

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
        )
    }

    if (orderResult) {
        return (
            <>
                <Navbar />
                <OrderSuccess orderNumber={orderResult.tracking_number ?? String(orderResult.order_id)} />
                <Footer />
            </>
        )
    }

    const enabledMethods = resolvePaymentMethods(settings)
    const zones          = settings.shipping_zones ?? []

    return (
        <>
            <Navbar />

            <section style={{ paddingTop: "120px", paddingBottom: "48px", background: "var(--bg)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="container">
                    <AnimatedSection>
                        <div className="section-label">Checkout</div>
                        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(42px, 5vw, 68px)", marginTop: "6px" }}>
                            Complete Your Order
                        </h1>
                        <Link href="/cart" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none", marginTop: "12px" }}>
                            ← Back to Cart
                        </Link>
                    </AnimatedSection>
                </div>
            </section>

            <section style={{ background: "#0c0c0c", paddingTop: "48px", paddingBottom: "120px" }}>
                <div className="container">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "48px", alignItems: "start" }} className="checkout-grid">

                        {/* ── LEFT ── */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

                            {/* Contact */}
                            <AnimatedSection>
                                <SectionCard title="Contact Information">
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                        <Field label="First Name" name="firstName" value={contact.firstName} onChange={(e) => setContact(p => ({ ...p, firstName: e.target.value }))} error={fieldErrors.first_name} />
                                        <Field label="Last Name"  name="lastName"  value={contact.lastName}  onChange={(e) => setContact(p => ({ ...p, lastName: e.target.value }))}  error={fieldErrors.last_name} />
                                        <Field label="Email"  name="email" value={contact.email} onChange={(e) => setContact(p => ({ ...p, email: e.target.value }))} type="email" error={fieldErrors.email} />
                                        <Field label="Phone"  name="phone" value={contact.phone} onChange={(e) => setContact(p => ({ ...p, phone: e.target.value }))} type="tel"   error={fieldErrors.phone} />
                                    </div>
                                </SectionCard>
                            </AnimatedSection>

                            {/* Address */}
                            <AnimatedSection delay={0.04}>
                                <SectionCard title="Shipping Address">
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                        <div style={{ gridColumn: "1 / -1" }}>
                                            <Field label="Street Address" name="street" value={address.street} onChange={(e) => setAddress(p => ({ ...p, street: e.target.value }))} error={fieldErrors.street} />
                                        </div>
                                        <Field label="City"          name="city"    value={address.city}    onChange={(e) => setAddress(p => ({ ...p, city: e.target.value }))}    error={fieldErrors.city} />
                                        <Field label="State / Region" name="state"   value={address.state}   onChange={(e) => setAddress(p => ({ ...p, state: e.target.value }))}   required={false} />
                                        <Field label="ZIP / Postal"  name="zip"     value={address.zip}     onChange={(e) => setAddress(p => ({ ...p, zip: e.target.value }))}     required={false} />
                                        <Field label="Country"       name="country" value={address.country} onChange={(e) => setAddress(p => ({ ...p, country: e.target.value }))} />
                                    </div>
                                </SectionCard>
                            </AnimatedSection>

                            {/* Shipping Zone */}
                            {zones.length > 0 && (
                                <AnimatedSection delay={0.06}>
                                    <SectionCard title="Delivery Area">
                                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                            {zones.map((zone, idx) => (
                                                <label key={zone.name} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: selectedZoneIndex === idx ? "rgba(201,168,76,0.06)" : "transparent", border: `1px solid ${selectedZoneIndex === idx ? "rgba(201,168,76,0.25)" : "rgba(255,255,255,0.07)"}`, borderRadius: "8px", cursor: "pointer" }} onClick={() => setSelectedZoneIndex(idx)}>
                                                    <Radio active={selectedZoneIndex === idx} />
                                                    <span style={{ flex: 1, fontSize: "14px", color: "var(--text-muted)" }}>{zone.name}</span>
                                                    <span style={{ fontSize: "14px", fontWeight: 700, color: zone.charge === 0 ? "#7C9A7E" : "var(--gold)" }}>
                                                        {zone.charge === 0 ? "FREE" : formatPrice(zone.charge)}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </SectionCard>
                                </AnimatedSection>
                            )}

                            {/* Payment */}
                            <AnimatedSection delay={0.08}>
                                <SectionCard title="Payment Method">
                                    {settingsLoading ? (
                                        <div style={{ color: "var(--text-dim)", fontSize: "13px" }}>Loading payment options…</div>
                                    ) : (
                                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                            {enabledMethods.map((method) => {
                                                const meta = PAYMENT_META[method]
                                                if (!meta) return null
                                                const isActive = payMethod === method
                                                return (
                                                    <label key={method} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px", background: isActive ? "rgba(201,168,76,0.06)" : "transparent", border: `1px solid ${isActive ? "rgba(201,168,76,0.25)" : "rgba(255,255,255,0.07)"}`, borderRadius: "8px", cursor: "pointer", transition: "all 0.2s" }} onClick={() => setPayMethod(method as any)}>
                                                        <Radio active={isActive} circle />
                                                        <span style={{ fontSize: "22px" }}>{meta.emoji}</span>
                                                        <div>
                                                            <p style={{ fontSize: "14px", fontWeight: 600, color: isActive ? "var(--gold)" : "var(--text)", margin: 0 }}>{meta.label}</p>
                                                            <p style={{ fontSize: "12px", color: "var(--text-dim)", margin: 0 }}>{meta.desc}</p>
                                                        </div>
                                                    </label>
                                                )
                                            })}

                                            {/* bKash extra field */}
                                            {payMethod === "bkash" && (
                                                <div style={{ marginTop: "8px" }}>
                                                    <Field label="bKash Number" name="bkash" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} type="tel" placeholder="01XXXXXXXXX" />
                                                </div>
                                            )}
                                            {/* Nagad extra field */}
                                            {payMethod === "nagad" && (
                                                <div style={{ marginTop: "8px" }}>
                                                    <Field label="Nagad Number" name="nagad" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} type="tel" placeholder="01XXXXXXXXX" />
                                                </div>
                                            )}
                                            {/* Bank extra field */}
                                            {payMethod === "bank" && (
                                                <div style={{ marginTop: "8px" }}>
                                                    <Field label="Transaction Reference" name="bankRef" value={bankRef} onChange={(e) => setBankRef(e.target.value)} placeholder="Reference / Transaction ID" />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </SectionCard>
                            </AnimatedSection>

                            {/* Notes */}
                            <AnimatedSection delay={0.1}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <label style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>Order Notes (optional)</label>
                                    <textarea
                                        placeholder="Special instructions, personalisation requests…"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={3}
                                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "12px 14px", fontSize: "14px", color: "#fff", outline: "none", fontFamily: "inherit", resize: "vertical" }}
                                    />
                                </div>
                            </AnimatedSection>

                            {/* Terms */}
                            <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }} onClick={() => setAgree(p => !p)}>
                                <CheckBox active={agree} />
                                <span style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>
                                    I agree to the <Link href="/terms" style={{ color: "var(--gold)", textDecoration: "underline" }}>Terms & Conditions</Link> and <Link href="/privacy" style={{ color: "var(--gold)", textDecoration: "underline" }}>Privacy Policy</Link>.
                                </span>
                            </label>

                            {/* Order amount error */}
                            {orderAmountError && (
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", padding: "14px 18px", color: "#f87171", fontSize: "14px" }}>
                                    <AlertCircle size={16} />
                                    {orderAmountError}
                                </div>
                            )}

                            {/* Error */}
                            {error && (
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(196,124,90,0.08)", border: "1px solid rgba(196,124,90,0.2)", borderRadius: "8px", padding: "14px 18px", color: "#C47C5A", fontSize: "14px" }}>
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            {/* Mobile submit */}
                            <SubmitButton loading={loading} total={pricing.total} onClick={submit} className="checkout-desktop-hide" />
                        </div>

                        {/* ── RIGHT: Summary ── */}
                        <AnimatedSection delay={0.05}>
                            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "28px", position: "sticky", top: "100px" }}>
                                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", marginBottom: "20px" }}>
                                    Your Order ({totalItems})
                                </h3>

                                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px", maxHeight: "300px", overflowY: "auto" }}>
                                    {items.map((item) => (
                                        <div key={item.cartKey} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                            <div style={{ width: "44px", height: "56px", borderRadius: "4px", overflow: "hidden", background: "rgba(255,255,255,0.04)", flexShrink: 0 }}>
                                                {item.product.image ? (
                                                    <img src={item.product.image} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                ) : (
                                                    <ShoppingBag size={16} style={{ color: "rgba(255,255,255,0.1)", margin: "20px auto", display: "block" }} />
                                                )}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.product.name}</p>

                                                {/* Format Information */}
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
                                                    {item.product.color && (
                                                        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "var(--text-dim)" }}>
                                                            <div style={{
                                                                width: "12px",
                                                                height: "12px",
                                                                borderRadius: "50%",
                                                                background: item.product.colorHex || "#ccc",
                                                                border: "1px solid rgba(255,255,255,0.2)",
                                                            }} />
                                                            {item.product.color}
                                                        </div>
                                                    )}
                                                    {item.product.size && (
                                                        <div style={{ fontSize: "10px", color: "var(--text-dim)" }}>
                                                            Size: {item.product.size}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Format Label */}
                                                {item.product.formatLabel && (
                                                    <p style={{ fontSize: "11px", color: "var(--text-dim)", margin: "4px 0 0 0" }}>
                                                        {item.product.formatLabel}
                                                    </p>
                                                )}

                                                <p style={{ fontSize: "11px", color: "var(--text-dim)", margin: "4px 0 0 0" }}>
                                                    Qty: {item.quantity}
                                                </p>
                                            </div>
                                            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--gold)", flexShrink: 0 }}>
                                                {formatPrice(item.product.price * item.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Pricing breakdown */}
                                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                                    <PriceLine label="Subtotal" value={formatPrice(pricing.subtotal)} />
                                    <PriceLine label="Shipping" value={pricing.shipping === 0 ? "FREE" : formatPrice(pricing.shipping)} valueStyle={pricing.shipping === 0 ? { color: "#7C9A7E" } : {}} />
                                    {pricing.tax > 0 && <PriceLine label="Tax" value={formatPrice(pricing.tax)} />}
                                    {pricing.isPreOrder && (
                                        <>
                                            <PriceLine label="Pre-order Payment" value={formatPrice(pricing.preOrderFee)} valueStyle={{ color: "var(--gold)" }} />
                                            <PriceLine label="Due on Delivery"   value={formatPrice(pricing.dueOnDelivery)} valueStyle={{ color: "rgba(255,255,255,0.4)" }} />
                                        </>
                                    )}
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "17px", fontWeight: 700, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
                                        <span style={{ color: "var(--text)" }}>Total</span>
                                        <span style={{ color: "var(--gold)" }}>{formatPrice(pricing.total)}</span>
                                    </div>
                                </div>

                                <SubmitButton loading={loading} total={pricing.total} onClick={submit} style={{ marginTop: "20px" }} className="checkout-mobile-hide" />

                                <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                                    {["🔒 SSL encrypted", "📦 Tracked shipping", "↩️ 30-day returns"].map((b) => (
                                        <p key={b} style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", margin: 0 }}>{b}</p>
                                    ))}
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>
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
    )
}

// ── Mini components ───────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "28px 32px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "18px", marginBottom: "20px" }}>{title}</h2>
            {children}
        </div>
    )
}

function Radio({ active, circle }: { active: boolean; circle?: boolean }) {
    return circle ? (
        <div style={{ width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0, border: `2px solid ${active ? "var(--gold)" : "rgba(255,255,255,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", background: active ? "var(--gold)" : "transparent", transition: "all 0.2s" }}>
            {active && <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#0a0a0a" }} />}
        </div>
    ) : (
        <div style={{ width: "18px", height: "18px", borderRadius: "4px", flexShrink: 0, background: active ? "var(--gold)" : "transparent", border: `2px solid ${active ? "var(--gold)" : "rgba(255,255,255,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
            {active && <Check size={11} style={{ color: "#0a0a0a" }} />}
        </div>
    )
}

function CheckBox({ active }: { active: boolean }) {
    return (
        <div style={{ width: "18px", height: "18px", borderRadius: "4px", flexShrink: 0, background: active ? "var(--gold)" : "transparent", border: `2px solid ${active ? "var(--gold)" : "rgba(255,255,255,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", marginTop: "2px" }}>
            {active && <Check size={11} style={{ color: "#0a0a0a" }} />}
        </div>
    )
}

function PriceLine({ label, value, valueStyle }: { label: string; value: string; valueStyle?: React.CSSProperties }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--text-muted)" }}>
            <span>{label}</span>
            <span style={{ fontWeight: 600, color: "var(--text)", ...valueStyle }}>{value}</span>
        </div>
    )
}

function SubmitButton({
                          loading, total, onClick, style, className,
                      }: {
    loading: boolean; total: number
    onClick: () => void
    style?:  React.CSSProperties
    className?: string
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={loading}
            className={`btn-primary ${className ?? ""}`}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "14px", fontSize: "14px", width: "100%", opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer", ...style }}
        >
            {loading
                ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Placing Order…</>
                : `Place Order · ${formatPrice(total)}`}
        </button>
    )
}