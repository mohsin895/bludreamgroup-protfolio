"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const IMG_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "";

interface Testimonial {
  id: number;
  name: string;
  role?: string;
  company?: string;
  quote?: string;
  rating?: number;
  avatar?: string | null;
}

function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < count ? "#6c7e7f" : "#e5e7eb"}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    fetch(`${API_BASE}/testimonial`)
      .then((r) => r.json())
      .then((json) => {
        const data = json?.data ?? [];

        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const go = useCallback(
    (d: 1 | -1) => {
      if (items.length === 0) return;

      setDir(d);
      setIdx((prev) => (prev + d + items.length) % items.length);
    },
    [items.length],
  );

  useEffect(() => {
    const t = setInterval(() => go(1), 6000);
    return () => clearInterval(t);
  }, [go]);

  const current = items[idx];

  if (!current) return null;
  const imgSrc = current.avatar ? `${IMG_BASE}${current.avatar}` : null;

  return (
    <section style={{ background: "#f8f9fa", padding: "100px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <span
            style={{
              display: "inline-block",
              background: "#6c7e7f1a",
              color: "#6c7e7f",
              borderRadius: 40,
              padding: "6px 20px",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Testimonials
          </span>
          <h2
            style={{
              fontFamily: "'Venus Rising'",
              fontSize: "clamp(24px, 4vw, 44px)",
              color: "#1f2937",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            What Readers & Clients{" "}
            <span style={{ color: "#6c7e7f", fontStyle: "italic" }}>
              Are Saying
            </span>
          </h2>
        </motion.div>

        {/* Slider */}
        <div style={{ position: "relative", maxWidth: 860, margin: "0 auto" }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={idx}
              custom={dir}
              initial={{ opacity: 0, x: dir * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -60 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 24,
                padding: "48px 56px",
                position: "relative",
                boxShadow: "0 8px 40px rgba(108,126,127,0.08)",
              }}
            >
              {/* Big quote */}
              <Quote
                size={56}
                color="#6c7e7f"
                style={{
                  opacity: 0.12,
                  position: "absolute",
                  top: 24,
                  left: 36,
                }}
              />

              <p
                style={{
                  fontFamily: "'Xolonium'",
                  fontSize: "clamp(14px, 2vw, 18px)",
                  color: "#1f2937",
                  lineHeight: 1.75,
                  margin: "44px 0 32px",
                  fontStyle: "italic",
                }}
              >
                "
                {current.quote ??
                  "An incredible experience that truly changed my perspective."}
                "
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    overflow: "hidden",
                    background: "linear-gradient(135deg, #6c7e7f, #95a49a)",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {imgSrc ? (
                    <></>
                  ) : (
                    // <img
                    //   src={imgSrc}
                    //   alt={current.name}
                    //   style={{
                    //     width: "100%",
                    //     height: "100%",
                    //     objectFit: "cover",
                    //   }}
                    // />
                    <span
                      className="font-rising"
                      style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}
                    >
                      {current.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <div
                    className="font-rising"
                    style={{ fontSize: 15, fontWeight: 700, color: "#1f2937" }}
                  >
                    {current.name}
                  </div>
                  <div
                    className="font-xolonium"
                    style={{
                      fontSize: 12,
                      color: "#9aa6aa",
                      marginTop: 2,
                      fontWeight: 500,
                    }}
                  >
                    {current.role}{" "}
                    {current.company ? `• ${current.company}` : ""}
                  </div>
                  <div>
                    <Stars count={current.rating ?? 5} />
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              marginTop: 40,
            }}
          >
            <button
              onClick={() => go(-1)}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                color: "#6c7e7f",
              }}
              className="testi-ctrl"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div style={{ display: "flex", gap: 8 }}>
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDir(i > idx ? 1 : -1);
                    setIdx(i);
                  }}
                  style={{
                    width: i === idx ? 28 : 8,
                    height: 8,
                    borderRadius: 4,
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    background: i === idx ? "#6c7e7f" : "#d1d5db",
                    transition: "all 0.35s ease",
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => go(1)}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                color: "#6c7e7f",
              }}
              className="testi-ctrl"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .testi-ctrl:hover { background: #6c7e7f !important; border-color: #6c7e7f !important; color: #fff !important; }
        @media (max-width: 640px) {
          section > div > div:last-child > div { padding: 32px 24px !important; }
        }
      `}</style>
    </section>
  );
}
