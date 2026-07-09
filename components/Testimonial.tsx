"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const IMG_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Testimonial {
  id: number;
  name: string;
  role?: string;
  company?: string;
  quote?: string;
  rating?: number;
  avatar?: string | null;
}
const wordFall = {
    hidden: { opacity: 0, y: -40 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] },
    },
};

const wordContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
};

function FallWords({ text, style }: { text: string; style?: React.CSSProperties }) {
    return (
        <>
            {text.split(" ").map((word, i) => (
                <motion.span
                    key={i}
                    variants={wordFall}
                    style={{ display: "inline-block", marginRight: "0.3em", ...style }}
                >
                    {word}
                </motion.span>
            ))}
        </>
    );
}

const charFall = {
    hidden: { opacity: 0, y: -60 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] },
    },
};

const headingContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.045 } },
};

function FallChars({ text, style }: { text: string; style?: React.CSSProperties }) {
    return (
        <>
            {text.split("").map((ch, i) => (
                <motion.span
                    key={i}
                    variants={charFall}
                    style={{ display: "inline-block", whiteSpace: "pre", ...style }}
                >
                    {ch}
                </motion.span>
            ))}
        </>
    );
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

            <motion.h2
                initial="hidden"
                whileInView="show"

                viewport={{ once: true }}
                variants={headingContainer}
                style={{
                    fontFamily: "'Venus Rising'",
                    fontSize: "clamp(24px, 4vw, 44px)",
                    color: "#1f2937",
                    margin: 0,
                    lineHeight: 1.1,
                }}

            >
                <FallChars text="What Readers & Clients   Are Saying" />

            </motion.h2>

        </motion.div>

        {/* Slider */}
        <div style={{ position: "relative", maxWidth: 1020, margin: "0 auto" }}>
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            loop={true}
            speed={1200}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 1,
              },
              1024: {
                slidesPerView: 2,
              },
            }}
          >
            {items.map((current) => {
              const imgSrc = current.avatar
                ? `${IMG_BASE}${current.avatar}`
                : null;

              return (
                <SwiperSlide
                  key={current.id}
                  style={{ height: "auto", display: "flex" }}
                >
                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      padding: "48px 40px",
                      boxShadow: "0 8px 40px rgba(108,126,127,.08)",

                      width: "100%",
                      minHeight: 380, // অথবা 400
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Quote
                      size={52}
                      color="#6c7e7f"
                      style={{ opacity: 0.12 }}
                    />

                    <p
                      style={{
                        fontFamily: "Xolonium",
                        lineHeight: 1.8,
                        margin: "24px 0",
                        fontStyle: "italic",
                        flex: 1,
                      }}
                    >
                      "{current.quote}"
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                      }}
                    >
                      <div
                        style={{
                          width: 54,
                          height: 54,
                          borderRadius: "50%",
                          overflow: "hidden",
                          background: "#6c7e7f",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={current.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <span
                            style={{
                              color: "#fff",
                              fontWeight: 700,
                              fontSize: 18,
                            }}
                          >
                            {current.name.charAt(0)}
                          </span>
                        )}
                      </div>

                      <div>
                        <h4>{current.name}</h4>

                        <p className="mt-10">
                          {current.role}
                          {current.company && ` • ${current.company}`}
                        </p>

                        <Stars count={current.rating ?? 5} />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              marginTop: 40,
            }}
          >
            {" "}
            {/* Dots */}{" "}
            <div style={{ display: "flex", gap: 8 }}>
              {" "}
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
              ))}{" "}
            </div>{" "}
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
