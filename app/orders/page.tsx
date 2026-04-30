"use client"
// app/orders/page.tsx — Orders history page

import { useEffect, useState } from "react"
import Link from "next/link"
import {
    Package, ChevronRight, Search, Loader2,
    CheckCircle, Clock, Truck, XCircle, RefreshCw,
} from "lucide-react"
import AnimatedSection from "@/components/AnimatedSection"
import Navbar  from "@/components/Navbar"
import Footer  from "@/components/Footer"
import { orderApi, formatPrice, type Order, type OrderStatus } from "@/lib/api/orderApi"

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; Icon: any }> = {
    pending:    { label: "Pending",    color: "#f59e0b", bg: "rgba(245,158,11,0.12)",    Icon: Clock       },
    confirmed:  { label: "Confirmed",  color: "#6366f1", bg: "rgba(99,102,241,0.12)",   Icon: CheckCircle },
    processing: { label: "Processing", color: "#8b5cf6", bg: "rgba(139,92,246,0.12)",   Icon: RefreshCw   },
    shipped:    { label: "Shipped",    color: "#0ea5e9", bg: "rgba(14,165,233,0.12)",   Icon: Truck       },
    delivered:  { label: "Delivered",  color: "#22c55e", bg: "rgba(34,197,94,0.12)",    Icon: CheckCircle },
    cancelled:  { label: "Cancelled",  color: "#ef4444", bg: "rgba(239,68,68,0.12)",    Icon: XCircle     },
}

function StatusBadge({ status }: { status: string }) {
    const cfg = STATUS_CONFIG[status as OrderStatus] ?? {
        label: status, color: "var(--text-dim)", bg: "rgba(255,255,255,0.05)", Icon: Package,
    }
    const { Icon } = cfg
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: "5px",
            padding: "4px 10px", borderRadius: "100px", fontSize: "11px",
            fontWeight: 600, letterSpacing: "0.06em",
            background: cfg.bg, color: cfg.color,
        }}>
            <Icon size={11} /> {cfg.label}
        </span>
    )
}

// ── Order Row ─────────────────────────────────────────────────────────────────

function OrderRow({ order }: { order: Order }) {
    const date = new Date(order.created_at).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
    })

    return (
        <Link href={`/orders/${order.id}`} style={{ textDecoration: "none", display: "block" }}>
            <div
                className="order-row"
                style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "10px",
                    padding: "20px 24px",
                    display: "grid",
                    gridTemplateColumns: "1fr auto auto auto",
                    alignItems: "center",
                    gap: "24px",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                }}
            >
                {/* Order info */}
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                        <Package size={14} style={{ color: "var(--gold)", flexShrink: 0 }} />
                        <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", letterSpacing: "0.04em" }}>
                            #{order.tracking_number}
                        </span>
                        <StatusBadge status={order.status} />
                    </div>
                    <p style={{ fontSize: "12px", color: "var(--text-dim)", marginBottom: "4px" }}>
                        {date} · {order.items?.length ?? 0} item{order.items?.length !== 1 ? "s" : ""}
                    </p>
                    <p style={{ fontSize: "12px", color: "var(--text-dim)" }}>
                        Payment: <span style={{ color: order.payment_status === "paid" ? "#22c55e" : "var(--text-muted)", fontWeight: 500 }}>
                            {order.payment_status}
                        </span>
                    </p>
                </div>

                {/* Items preview */}
                <div style={{ display: "flex", gap: "6px" }}>
                    {(order.items ?? []).slice(0, 3).map((item) => (
                        <div key={item.id} style={{ width: "40px", height: "52px", borderRadius: "4px", overflow: "hidden", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
                            {item.image ? (
                                <img src={item.image} alt={item.product_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                <Package size={14} style={{ color: "rgba(255,255,255,0.15)", margin: "19px auto", display: "block" }} />
                            )}
                        </div>
                    ))}
                    {(order.items?.length ?? 0) > 3 && (
                        <div style={{ width: "40px", height: "52px", borderRadius: "4px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "var(--text-dim)", fontWeight: 600 }}>
                            +{order.items.length - 3}
                        </div>
                    )}
                </div>

                {/* Total */}
                <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--gold)" }}>{formatPrice(order.total)}</p>
                    <p style={{ fontSize: "11px", color: "var(--text-dim)", textTransform: "capitalize" }}>{order.payment_method}</p>
                </div>

                <ChevronRight size={16} style={{ color: "rgba(255,255,255,0.2)" }} />
            </div>
        </Link>
    )
}

// ── Track Form ────────────────────────────────────────────────────────────────

function TrackForm() {
    const [query,   setQuery]   = useState("")
    const [result,  setResult]  = useState<Order | null>(null)
    const [loading, setLoading] = useState(false)
    const [error,   setError]   = useState<string | null>(null)

    async function handleTrack(e: React.FormEvent) {
        e.preventDefault()
        if (!query.trim()) return
        setLoading(true); setError(null); setResult(null)
        try {
            const order = await orderApi.track(query.trim())
            setResult(order)
        } catch {
            setError("Order not found. Please check your tracking number.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "28px" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "18px", marginBottom: "16px" }}>Track an Order</h3>
            <form onSubmit={handleTrack} style={{ display: "flex", gap: "12px" }}>
                <input
                    value={query} onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter tracking number…"
                    style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "11px 14px", fontSize: "14px", color: "#fff", outline: "none", fontFamily: "inherit" }}
                />
                <button type="submit" disabled={loading} className="btn-primary" style={{ gap: "8px", padding: "11px 20px", fontSize: "13px", cursor: loading ? "not-allowed" : "pointer" }}>
                    {loading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Search size={14} />}
                    Track
                </button>
            </form>
            {error  && <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "12px" }}>{error}</p>}
            {result && (
                <div style={{ marginTop: "16px" }}>
                    <OrderRow order={result} />
                </div>
            )}
        </div>
    )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function OrdersPage() {
    const [orders,  setOrders]  = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error,   setError]   = useState<string | null>(null)
    const [page,    setPage]    = useState(1)
    const [lastPage, setLastPage] = useState(1)

    async function load(p = 1) {
        setLoading(true)
        try {
            const res = await orderApi.list(p)
            setOrders(res.data ?? [])
            setLastPage(res.last_page ?? 1)
            setPage(p)
        } catch {
            setError("Could not load orders. Please sign in or try again.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    return (
        <>
            <Navbar />

            <section style={{ paddingTop: "130px", paddingBottom: "60px", background: "var(--bg)" }}>
                <div className="container">
                    <AnimatedSection>
                        <div className="section-label">Account</div>
                        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(44px, 5vw, 72px)", marginTop: "8px", lineHeight: 1 }}>
                            My Orders
                        </h1>
                        <p style={{ color: "var(--text-muted)", fontSize: "15px", marginTop: "14px" }}>
                            {loading ? "Loading…" : `${orders.length} order${orders.length !== 1 ? "s" : ""} found`}
                        </p>
                    </AnimatedSection>
                </div>
            </section>

            <section style={{ background: "#0c0c0c", paddingBottom: "120px" }}>
                <div className="container" style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

                    {/* Track form */}
                    <AnimatedSection delay={0.05}>
                        <TrackForm />
                    </AnimatedSection>

                    {/* Orders list */}
                    <div>
                        {loading && (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px", gap: "12px", color: "var(--text-dim)" }}>
                                <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
                                Loading your orders…
                            </div>
                        )}

                        {!loading && error && (
                            <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>
                                <p style={{ marginBottom: "16px" }}>{error}</p>
                                <button onClick={() => load()} className="btn-outline" style={{ cursor: "pointer" }}>Try Again</button>
                            </div>
                        )}

                        {!loading && !error && orders.length === 0 && (
                            <div style={{ textAlign: "center", padding: "80px" }}>
                                <Package size={48} style={{ color: "rgba(255,255,255,0.1)", marginBottom: "16px" }} />
                                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "22px", marginBottom: "10px" }}>No orders yet</h3>
                                <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>Start shopping to see your orders here.</p>
                                <Link href="/books" className="btn-primary" style={{ display: "inline-flex" }}>Browse Books</Link>
                            </div>
                        )}

                        {!loading && !error && orders.length > 0 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {orders.map((order, i) => (
                                    <AnimatedSection key={order.id} delay={i * 0.05}>
                                        <OrderRow order={order} />
                                    </AnimatedSection>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {lastPage > 1 && (
                            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "32px" }}>
                                {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
                                    <button key={p} onClick={() => load(p)} style={{ width: "36px", height: "36px", borderRadius: "6px", background: p === page ? "var(--gold)" : "rgba(255,255,255,0.04)", border: `1px solid ${p === page ? "var(--gold)" : "rgba(255,255,255,0.08)"}`, color: p === page ? "#0a0a0a" : "var(--text-muted)", fontSize: "13px", fontWeight: p === page ? 700 : 400, cursor: "pointer" }}>
                                        {p}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <style>{`
                @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
                .order-row:hover { border-color: rgba(255,255,255,0.12) !important; transform: translateY(-2px); }
            `}</style>
            <Footer />
        </>
    )
}