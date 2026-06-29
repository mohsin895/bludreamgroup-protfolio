"use client";

import Footer from "@/components/Footer";
import PageHero from "@/components/HeroPage";
import Navbar from "@/components/Navbar";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ExecutiveMember {
  id: number;
  name: string;
  batch: string | null;
  designation?: string;
  position_title: string;
  start_date: string;
  end_date: string;
  company_name: string;
  image: string;
  formatted_range: string;
}
interface CsrItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  category?: string;
  visits?: number;
}
function parseImage(raw: string): string {
  try {
    const parsed = JSON.parse(raw);
    return `${IMAGE_BASE}${parsed.medium ?? parsed.original}`;
  } catch {
    return raw.startsWith("http") ? raw : `${IMAGE_BASE}${raw}`;
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

// ── Stat Counter ──────────────────────────────────────────────────────────────
function StatCounter({ end, label }: { end: number; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (1800 / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);

  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div
        className="font-rising"
        style={{
          fontSize: "clamp(28px,3.5vw,40px)",
          fontWeight: 700,
          color: "#6c7e7f",
          marginBottom: "6px",
        }}
      >
        {count.toLocaleString()}+
      </div>
      <div
        className="font-xolonium"
        style={{
          fontSize: "11px",
          color: "#8a9a9a",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
        }}
      >
        {label}
      </div>
    </div>
  );
}

// ── CSR Card ──────────────────────────────────────────────────────────────────
function CsrCard({ item, index }: { item: CsrItem; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const imgSrc = item.image.startsWith("http")
    ? item.image
    : parseImage(item.image);
  const desc = stripHtml(item.description);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
    >
      <Link href={`/csr/${item.slug}`} style={{ textDecoration: "none" }}>
        <motion.div
          whileHover={{
            y: -6,
            boxShadow: "0 16px 48px rgba(108,126,127,0.15)",
          }}
          transition={{ duration: 0.28 }}
          style={{
            background: "#fff",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 3px 16px rgba(0,0,0,0.07)",
            border: "1px solid rgba(108,126,127,0.1)",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            cursor: "pointer",
          }}
        >
          {/* Image */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "clamp(180px, 28vw, 220px)",
              overflow: "hidden",
            }}
          >
            <Image
              src={imgSrc}
              alt={item.title}
              fill
              style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLImageElement).style.transform =
                  "scale(1.06)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLImageElement).style.transform =
                  "scale(1)")
              }
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 55%)",
              }}
            />
            {item.category && (
              <span
                className="font-xolonium"
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "12px",
                  background: "#6c7e7f",
                  color: "#fff",
                  fontSize: "10px",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  letterSpacing: "0.08em",
                }}
              >
                {item.category}
              </span>
            )}
          </div>

          {/* Content */}
          <div
            style={{
              padding: "22px 24px",
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <h3
              className="font-rising"
              style={{
                fontSize: "17px",
                color: "#1a2a2a",
                marginBottom: "10px",
                lineHeight: 1.35,
              }}
            >
              {item.title}
            </h3>
            <p
              className="font-xolonium"
              style={{
                fontSize: "13px",
                color: "#6a7e7e",
                lineHeight: 1.75,
                flex: 1,
              }}
            >
              {desc.length > 110 ? desc.slice(0, 110) + "…" : desc}
            </p>

            {item.visits && (
              <div
                style={{
                  marginTop: "16px",
                  paddingTop: "14px",
                  borderTop: "1px solid rgba(108,126,127,0.1)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="#6c7e7f"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span
                  className="font-xolonium"
                  style={{ fontSize: "12px", color: "#8a9a9a" }}
                >
                  <span style={{ fontWeight: 700, color: "#4a6262" }}>
                    {item.visits}
                  </span>{" "}
                  people benefited
                </span>
              </div>
            )}

            {/* Read more arrow */}
            <div
              style={{
                marginTop: "14px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span
                className="font-xolonium"
                style={{
                  fontSize: "11px",
                  color: "#6c7e7f",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Learn More
              </span>
              <svg
                width="12"
                height="12"
                fill="none"
                stroke="#6c7e7f"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

// ── Skeleton Card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid rgba(108,126,127,0.08)",
      }}
    >
      <div
        style={{
          height: "220px",
          background: "rgba(0,0,0,0.07)",
          animation: "shimmer 1.5s ease-in-out infinite",
        }}
      />
      <div
        style={{
          padding: "clamp(16px,3vw,22px)",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div
          style={{
            height: "18px",
            width: "60%",
            background: "rgba(0,0,0,0.06)",
            borderRadius: "4px",
            animation: "shimmer 1.5s ease-in-out 0.1s infinite",
          }}
        />
        <div
          style={{
            height: "13px",
            width: "90%",
            background: "rgba(0,0,0,0.04)",
            borderRadius: "4px",
            animation: "shimmer 1.5s ease-in-out 0.15s infinite",
          }}
        />
        <div
          style={{
            height: "13px",
            width: "75%",
            background: "rgba(0,0,0,0.04)",
            borderRadius: "4px",
            animation: "shimmer 1.5s ease-in-out 0.2s infinite",
          }}
        />
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function CsrPage() {
  const [csrData, setCsrData] = useState<CsrItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/socila-responsibility`);
        if (!res.ok) throw new Error();
        const json = await res.json();
        if (json?.data?.length) {
          setCsrData(
            json.data.map((d: any) => ({
              id: d.id,
              title: d.title,
              slug: d.slug,
              description: d.description ?? "",
              image: d.image ?? "",
            })),
          );
        } else {
          setCsrData([]);
        }
      } catch {
        setCsrData([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <style>{`@keyframes shimmer { 0%,100%{opacity:0.45} 50%{opacity:1} }`}</style>
      <Navbar />
      <main style={{ minHeight: "100vh", background: "#F4F7F6" }}>
        <PageHero title="Corporate Social Responsibility" currentPage="CSR" />

        {/* Stats */}
        <section
          style={{
            background: "#fff",
            borderBottom: "1px solid rgba(108,126,127,0.1)",
            padding: "56px 0",
          }}
        >
          <div className="container">
            <div
              className="stat-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: "32px",
              }}
            >
              <StatCounter end={57600} label="Lives Impacted" />
              <StatCounter end={120} label="Projects Done" />
              <StatCounter end={48} label="Districts Covered" />
              <StatCounter end={14} label="Years of Service" />
            </div>
          </div>
        </section>

        {/* Grid */}
        <section style={{ padding: "80px 0" }}>
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ textAlign: "center", marginBottom: "56px" }}
            >
              <p
                className="font-xolonium"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#6c7e7f",
                  marginBottom: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    width: "26px",
                    height: "2px",
                    background: "#6c7e7f",
                    borderRadius: "1px",
                    display: "inline-block",
                  }}
                />
                Our Work
                <span
                  style={{
                    width: "26px",
                    height: "2px",
                    background: "#6c7e7f",
                    borderRadius: "1px",
                    display: "inline-block",
                  }}
                />
              </p>
              <h2
                className="font-rising"
                style={{
                  fontSize: "clamp(32px,4vw,48px)",
                  color: "#1a2a2a",
                  marginBottom: "14px",
                }}
              >
                Our Initiatives
              </h2>
              <p
                className="font-xolonium"
                style={{
                  fontSize: "14px",
                  color: "#6a7e7e",
                  maxWidth: "480px",
                  margin: "0 auto",
                  lineHeight: 1.75,
                }}
              >
                From education to environment — here's a glimpse into the work
                we do and the communities we serve.
              </p>
            </motion.div>

            <div
              className="csr-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: "24px",
              }}
            >
              {loading
                ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
                : csrData.map((item, i) => (
                    <CsrCard key={item.id} item={item} index={i} />
                  ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            background: "#6c7e7f",
            margin: "0 0 0 0",
            padding: "clamp(50px,8vw,80px) 20px",
            textAlign: "center",
          }}
        >
          <h2
            className="font-rising"
            style={{
              fontSize: "clamp(28px,3.5vw,42px)",
              color: "#fff",
              marginBottom: "14px",
            }}
          >
            Want to Join Our Mission?
          </h2>
          <p
            className="font-xolonium"
            style={{
              color: "rgba(255,255,255,0.72)",
              maxWidth: "440px",
              margin: "0 auto 32px",
              lineHeight: 1.75,
              fontSize: "14px",
            }}
          >
            Together we can create lasting change. Reach out to collaborate or
            support our ongoing CSR efforts.
          </p>
          <motion.a
            href="/contact"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="font-xolonium"
            style={{
              display: "inline-block",
              background: "#fff",
              color: "#6c7e7f",
              padding: "13px 36px",
              borderRadius: "40px",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            Get Involved
          </motion.a>
        </motion.section>
      </main>
      <Footer />

      <style>{`
  @media (max-width: 900px) {
    .csr-grid {
      grid-template-columns: repeat(2,1fr) !important;
    }

    .stat-grid {
      grid-template-columns: repeat(2,1fr) !important;
    }
  }

  @media (max-width: 560px) {
    .csr-grid {
      grid-template-columns: 1fr !important;
    }

    .stat-grid {
      grid-template-columns: repeat(2,1fr) !important;
    }
  }
`}</style>
    </>
  );
}
