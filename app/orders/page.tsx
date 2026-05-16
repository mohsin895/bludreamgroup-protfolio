"use client";
// app/orders/page.tsx — Orders list with order cards

import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { formatPrice, orderApi, type Order } from "@/lib/api/orderApi";
import {
  CheckCircle,
  Clock,
  Eye,
  Loader2,
  Package,
  RefreshCw,
  Truck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ReactElement } from "react";

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#6366f1",
  processing: "#8b5cf6",
  shipped: "#0ea5e9",
  delivered: "#22c55e",
  cancelled: "#ef4444",
};

// FIX: Use ReactElement instead of JSX.Element to avoid TS2503
// ("Cannot find namespace 'JSX'") in projects that don't set
// "jsx": "react" or don't have a global JSX namespace available.
const STATUS_ICONS: Record<string, (props: { size: number }) => ReactElement> =
  {
    pending: ({ size }) => <Clock size={size} />,
    confirmed: ({ size }) => <CheckCircle size={size} />,
    processing: ({ size }) => <RefreshCw size={size} />,
    shipped: ({ size }) => <Truck size={size} />,
    delivered: ({ size }) => <CheckCircle size={size} />,
    cancelled: ({ size }) => <XCircle size={size} />,
  };

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await orderApi.listOrders();
      setOrders(result);
    } catch (err: any) {
      setError(err?.message || "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

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
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 4vw, 54px)",
                lineHeight: 1,
                marginBottom: "12px",
              }}
            >
              Your Orders
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
              Track and manage all your orders
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
          {error && (
            <AnimatedSection>
              <div
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "32px",
                  color: "#fca5a5",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            </AnimatedSection>
          )}

          {orders.length === 0 ? (
            <AnimatedSection>
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px",
                }}
              >
                <Package
                  size={40}
                  style={{ color: "var(--text-muted)", margin: "0 auto 16px" }}
                />
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "20px",
                    marginBottom: "8px",
                  }}
                >
                  No orders yet
                </h3>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "14px",
                    marginBottom: "24px",
                  }}
                >
                  Start shopping to see your orders here
                </p>
                <Link
                  href="/shop"
                  style={{
                    display: "inline-block",
                    padding: "10px 20px",
                    background: "var(--gold)",
                    color: "#000",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: 600,
                    transition: "all 0.2s",
                  }}
                >
                  Continue Shopping
                </Link>
              </div>
            </AnimatedSection>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "24px",
              }}
            >
              {orders.map((order, idx) => (
                <AnimatedSection key={order.id} delay={idx * 0.03}>
                  <OrderCard order={order} />
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      <Footer />
    </>
  );
}

function OrderCard({ order }: { order: Order }) {
  const date = new Date(order.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const statusColor = STATUS_COLORS[order.status] || "#999";
  const StatusIcon = STATUS_ICONS[order.status];
  const itemCount = order.items?.length ?? 0;

  return (
    <Link href={`/orders/${order.id}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "12px",
          overflow: "hidden",
          transition: "all 0.3s",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.background = "rgba(255,255,255,0.04)";
          el.style.borderColor = "rgba(255,255,255,0.12)";
          el.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.background = "rgba(255,255,255,0.02)";
          el.style.borderColor = "rgba(255,255,255,0.06)";
          el.style.transform = "translateY(0)";
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "12px",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--text-dim)",
                  marginBottom: "4px",
                }}
              >
                Order #{order.tracking_number || order.id}
              </p>
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                {date}
              </p>
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 10px",
                background: `${statusColor}15`,
                border: `1px solid ${statusColor}40`,
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "capitalize",
                color: statusColor,
              }}
            >
              {StatusIcon && <StatusIcon size={12} />}
              {order.status}
            </div>
          </div>
        </div>

        {/* Items preview */}
        <div style={{ padding: "16px 20px", flex: 1, minHeight: "120px" }}>
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-dim)",
              marginBottom: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Items ({itemCount})
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {(order.items ?? []).slice(0, 3).map((item, idx) => (
              <div
                key={idx}
                style={{
                  width: "48px",
                  height: "64px",
                  borderRadius: "6px",
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
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
                    size={16}
                    style={{ color: "rgba(255,255,255,0.1)" }}
                  />
                )}
              </div>
            ))}
            {itemCount > 3 && (
              <div
                style={{
                  width: "48px",
                  height: "64px",
                  borderRadius: "6px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                }}
              >
                +{order.items!.length - 3}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "11px",
                color: "var(--text-dim)",
                marginBottom: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Total
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--gold)",
              }}
            >
              {formatPrice(order.total)}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "6px",
              background: "rgba(255,255,255,0.06)",
              color: "var(--text-muted)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.background = "var(--gold)";
              el.style.color = "#000";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.background = "rgba(255,255,255,0.06)";
              el.style.color = "var(--text-muted)";
            }}
          >
            <Eye size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}
