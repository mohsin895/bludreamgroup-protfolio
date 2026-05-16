"use client";
// app/orders/[id]/page.tsx — Order detail with status timeline

import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  formatPrice,
  orderApi,
  type Order,
  type OrderStatus,
} from "@/lib/api/orderApi";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Loader2,
  Package,
  RefreshCw,
  Truck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const TIMELINE: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

const STATUS_ICONS: Record<string, any> = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: RefreshCw,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#6366f1",
  processing: "#8b5cf6",
  shipped: "#0ea5e9",
  delivered: "#22c55e",
  cancelled: "#ef4444",
};

function Timeline({ status }: { status: string }) {
  if (status === "cancelled") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "20px 0",
        }}
      >
        <XCircle size={20} style={{ color: "#ef4444" }} />
        <span style={{ fontSize: "15px", color: "#ef4444", fontWeight: 600 }}>
          Order Cancelled
        </span>
      </div>
    );
  }

  const currentIdx = TIMELINE.indexOf(status as OrderStatus);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        width: "100%",
        overflowX: "auto",
        padding: "8px 0",
      }}
    >
      {TIMELINE.map((step, idx) => {
        const Icon = STATUS_ICONS[step];
        const done = idx <= currentIdx;
        const active = idx === currentIdx;
        const color = done ? STATUS_COLORS[step] : "rgba(255,255,255,0.15)";

        return (
          <div
            key={step}
            style={{
              display: "flex",
              alignItems: "center",
              flex: idx < TIMELINE.length - 1 ? 1 : undefined,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: done
                    ? `${STATUS_COLORS[step]}18`
                    : "rgba(255,255,255,0.03)",
                  border: `2px solid ${color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s",
                }}
              >
                <Icon size={16} style={{ color }} />
              </div>
              <span
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.06em",
                  textTransform: "capitalize",
                  color: done ? color : "rgba(255,255,255,0.2)",
                  fontWeight: active ? 700 : 400,
                  whiteSpace: "nowrap",
                }}
              >
                {step}
              </span>
            </div>
            {idx < TIMELINE.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: "2px",
                  background:
                    idx < currentIdx
                      ? STATUS_COLORS[TIMELINE[idx]]
                      : "rgba(255,255,255,0.06)",
                  margin: "0 8px",
                  marginBottom: "22px",
                  transition: "all 0.3s",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    orderApi
      .get(Number(id))
      .then(setOrder)
      .catch(() => setError("Order not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader2
            size={28}
            style={{
              color: "var(--gold)",
              animation: "spin 1s linear infinite",
            }}
          />
          <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Navbar />
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px" }}>
            Order not found
          </h2>
          <Link href="/orders" className="btn-outline">
            ← Back to Orders
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const date = new Date(order.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Navbar />

      <section
        style={{
          paddingTop: "120px",
          paddingBottom: "48px",
          background: "var(--bg)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="container">
          <AnimatedSection>
            <Link
              href="/orders"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                color: "rgba(255,255,255,0.35)",
                textDecoration: "none",
                marginBottom: "20px",
              }}
            >
              <ArrowLeft size={12} /> Back to Orders
            </Link>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 4vw, 54px)",
                lineHeight: 1,
              }}
            >
              Order #{order.tracking_number}
            </h1>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "14px",
                marginTop: "10px",
              }}
            >
              Placed on {date}
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section
        style={{
          background: "#0c0c0c",
          paddingTop: "48px",
          paddingBottom: "120px",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 340px",
              gap: "40px",
              alignItems: "start",
            }}
            className="order-detail-grid"
          >
            {/* ── Left ── */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "28px" }}
            >
              {/* Timeline */}
              <AnimatedSection>
                <Card title="Order Status">
                  <Timeline status={order.status} />
                </Card>
              </AnimatedSection>

              {/* Items */}
              <AnimatedSection delay={0.05}>
                <Card title={`Items (${order.items?.length ?? 0})`}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    {(order.items ?? []).map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          gap: "16px",
                          alignItems: "center",
                          paddingBottom: "16px",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <div
                          style={{
                            width: "56px",
                            height: "72px",
                            borderRadius: "6px",
                            overflow: "hidden",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            flexShrink: 0,
                          }}
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.product_name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <Package
                              size={20}
                              style={{
                                color: "rgba(255,255,255,0.1)",
                                margin: "26px auto",
                                display: "block",
                              }}
                            />
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p
                            style={{
                              fontSize: "15px",
                              fontWeight: 500,
                              color: "var(--text)",
                              marginBottom: "4px",
                            }}
                          >
                            {item.product_name}
                          </p>
                          {item.format && (
                            <p
                              style={{
                                fontSize: "12px",
                                color: "var(--text-dim)",
                              }}
                            >
                              {item.format}
                            </p>
                          )}
                          <p
                            style={{
                              fontSize: "12px",
                              color: "var(--text-dim)",
                            }}
                          >
                            Qty: {item.quantity} × {formatPrice(item.price)}
                          </p>
                        </div>
                        <p
                          style={{
                            fontSize: "15px",
                            fontWeight: 700,
                            color: "var(--gold)",
                          }}
                        >
                          {formatPrice(item.subtotal)}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </AnimatedSection>

              {/* Shipping address */}
              {order.billing_address && (
                <AnimatedSection delay={0.08}>
                  <Card title="Shipping Address">
                    <p
                      style={{
                        fontSize: "14px",
                        color: "var(--text-muted)",
                        lineHeight: 1.8,
                      }}
                    >
                      {order.billing_name && (
                        <>
                          <strong style={{ color: "var(--text)" }}>
                            {order.billing_name}
                          </strong>
                          <br />
                        </>
                      )}
                      {order.billing_address}
                      <br />
                      {order.billing_city && `${order.billing_city}, `}
                      {order.billing_country}
                      {order.billing_phone && (
                        <>
                          <br />
                          {order.billing_phone}
                        </>
                      )}
                    </p>
                  </Card>
                </AnimatedSection>
              )}
            </div>

            {/* ── Right: Summary ── */}
            <AnimatedSection delay={0.06}>
              <div
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px",
                  padding: "24px",
                  position: "sticky",
                  top: "100px",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "18px",
                    marginBottom: "20px",
                  }}
                >
                  Summary
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <SummaryRow
                    label="Subtotal"
                    value={formatPrice(order.subtotal)}
                  />
                  <SummaryRow
                    label="Shipping"
                    value={formatPrice(order.shipping)}
                    valueStyle={
                      Number(order.shipping) === 0 ? { color: "#22c55e" } : {}
                    }
                  />
                  {order.tax && Number(order.tax) > 0 && (
                    <SummaryRow label="Tax" value={formatPrice(order.tax)} />
                  )}
                  <div
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      paddingTop: "12px",
                    }}
                  >
                    <SummaryRow
                      label="Total"
                      value={formatPrice(order.total)}
                      largeValue
                    />
                  </div>
                </div>

                <div
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    paddingTop: "16px",
                    marginTop: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <InfoRow
                    label="Payment"
                    value={order.payment_method?.replace(/_/g, " ")}
                  />
                  <InfoRow
                    label="Pay Status"
                    value={order.payment_status}
                    valueStyle={
                      order.payment_status === "paid"
                        ? { color: "#22c55e" }
                        : {}
                    }
                  />
                  <InfoRow label="Order ID" value={String(order.id)} />
                </div>

                {order.status !== "cancelled" &&
                  order.status !== "delivered" && (
                    <button
                      onClick={async () => {
                        if (!confirm("Cancel this order?")) return;
                        try {
                          await orderApi.cancel(order.id);
                          setOrder((o) =>
                            o ? { ...o, status: "cancelled" } : o,
                          );
                        } catch {
                          alert("Could not cancel order.");
                        }
                      }}
                      style={{
                        marginTop: "20px",
                        width: "100%",
                        padding: "10px",
                        background: "transparent",
                        border: "1px solid rgba(239,68,68,0.3)",
                        borderRadius: "6px",
                        color: "#ef4444",
                        fontSize: "13px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "rgba(239,68,68,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "transparent";
                      }}
                    >
                      Cancel Order
                    </button>
                  )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <style>{`
                @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
                @media(max-width:860px) { .order-detail-grid{grid-template-columns:1fr!important;} }
            `}</style>
      <Footer />
    </>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px",
        padding: "24px 28px",
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "16px",
          marginBottom: "16px",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function SummaryRow({
  label,
  value,
  valueStyle,
  largeValue,
}: {
  label: string;
  value: string;
  valueStyle?: React.CSSProperties;
  largeValue?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: largeValue ? "16px" : "13px",
        fontWeight: largeValue ? 700 : 400,
      }}
    >
      <span style={{ color: largeValue ? "var(--text)" : "var(--text-muted)" }}>
        {label}
      </span>
      <span
        style={{
          color: largeValue ? "var(--gold)" : "var(--text)",
          fontWeight: 600,
          ...valueStyle,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function InfoRow({
  label,
  value,
  valueStyle,
}: {
  label: string;
  value?: string;
  valueStyle?: React.CSSProperties;
}) {
  if (!value) return null;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "12px",
      }}
    >
      <span
        style={{
          color: "var(--text-dim)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontSize: "10px",
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: "var(--text-muted)",
          fontWeight: 500,
          textTransform: "capitalize",
          ...valueStyle,
        }}
      >
        {value}
      </span>
    </div>
  );
}
