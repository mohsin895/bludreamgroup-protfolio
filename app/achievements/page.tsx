"use client";

import Footer from "@/components/Footer";
import PageHero from "@/components/HeroPage";
import Navbar from "@/components/Navbar";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════════════════ */
interface Award {
  id: number;
  title: string;
  image: string;
  organization: string;
  color: string;
  year: string;
  status: string;
}

interface CareerJourney {
  id: number;
  title: string;
  description: string;
  year: string;
  status: string;
}

interface ImageUrls {
  original: string;
  small: string;
  medium: string;
  large: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
   STATIC DATA
═══════════════════════════════════════════════════════════════════════════ */
const stats = [
  { value: 3200000, suffix: "+", label: "Books Sold", prefix: "" },
  { value: 200, suffix: "+", label: "Keynotes Delivered", prefix: "" },
  { value: 47, suffix: "", label: "Countries Reached", prefix: "" },
  { value: 18, suffix: "", label: "Years of Excellence", prefix: "" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   ENV / UTILS
═══════════════════════════════════════════════════════════════════════════ */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "";

function parseImageJson(imageJson: string): ImageUrls | null {
  try {
    return JSON.parse(imageJson);
  } catch {
    return null;
  }
}

function getImageUrl(
  imageJson: string,
  size: "original" | "small" | "medium" | "large" = "medium",
): string {
  const parsed = parseImageJson(imageJson);
  if (!parsed) return "";
  return IMAGE_BASE_URL + (parsed[size] || parsed.original || "");
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════════════════════════ */
function useCounter(target: number, active: boolean, duration = 2000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
      else setValue(target);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return value;
}

/* ═══════════════════════════════════════════════════════════════════════════
   LOADING SPINNER
═══════════════════════════════════════════════════════════════════════════ */
function LoadingSpinner() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
      style={{
        width: 32,
        height: 32,
        border: "3px solid #e0e0e0",
        borderTopColor: "#82c3d8",
        borderRadius: "50%",
        margin: "0 auto",
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════════════════════════════ */
function StatCard({ stat, delay }: { stat: (typeof stats)[0]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const count = useCounter(stat.value, inView, 2200);

  const display =
    stat.value >= 1_000_000
      ? (count / 1_000_000).toFixed(1) + "M"
      : count.toLocaleString();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const }}
      style={{
        background: "rgba(130,195,216,0.04)",
        border: "1px solid rgba(130,195,216,0.12)",
        borderRadius: "8px",
        padding: "40px 32px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "60px",
          height: "60px",
          background:
            "linear-gradient(225deg, rgba(130,195,216,0.15) 0%, transparent 60%)",
          borderRadius: "0 8px 0 0",
        }}
      />
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(48px,5vw,72px)",
          lineHeight: 1,
          color: "#82c3d8",
          letterSpacing: "-0.03em",
          fontWeight: 300,
        }}
      >
        {stat.prefix}
        {display}
        {stat.suffix}
      </div>
      <div
        style={{
          marginTop: "10px",
          fontSize: "11px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.45)",
        }}
      >
        {stat.label}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TIMELINE
═══════════════════════════════════════════════════════════════════════════ */
function TimelineCard({
  item,
  align,
}: {
  item: CareerJourney;
  align: "left" | "right";
}) {
  const tag = item.title.split(" ")[0];
  return (
    <div style={{ textAlign: align }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          justifyContent: align === "right" ? "flex-end" : "flex-start",
          marginBottom: "8px",
        }}
      >
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#82c3d8",
            background: "rgba(130,195,216,0.1)",
            border: "1px solid rgba(130,195,216,0.25)",
            padding: "3px 10px",
            borderRadius: "20px",
          }}
        >
          {tag}
        </span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "28px",
            color: "#000",
            letterSpacing: "-0.02em",
          }}
        >
          {item.year}
        </span>
      </div>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(20px,2vw,26px)",
          color: "#000",
          margin: "0 0 10px",
          fontWeight: 400,
          letterSpacing: "-0.01em",
        }}
      >
        {item.title}
      </h3>
      <p
        style={{
          fontSize: "14px",
          color: "#0009",
          lineHeight: 1.7,
          margin: 0,
          maxWidth: "340px",
          marginLeft: align === "right" ? "auto" : 0,
        }}
      >
        {item.description}
      </p>
    </div>
  );
}

function TimelineItem({ item, idx }: { item: CareerJourney; idx: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const isEven = idx % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: idx * 0.1,
        ease: [0.16, 1, 0.3, 1] as const,
      }}
      style={{ display: "grid", gridTemplateColumns: "1fr 60px 1fr" }}
    >
      {/* Left */}
      <div
        style={{
          paddingRight: "32px",
          paddingBottom: "60px",
          textAlign: "right",
          visibility: isEven ? "visible" : "hidden",
        }}
      >
        {isEven && <TimelineCard item={item} align="right" />}
      </div>

      {/* Spine */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <motion.div
          initial={{ background: "transparent", boxShadow: "none" }}
          animate={
            inView
              ? {
                  background: "#82c3d8",
                  boxShadow: "0 0 20px rgba(130,195,216,0.5)",
                }
              : {}
          }
          transition={{ duration: 0.4, delay: idx * 0.1 + 0.3 }}
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "50%",
            border: "2px solid #82c3d8",
            zIndex: 1,
            flexShrink: 0,
            marginTop: "8px",
          }}
        />
        <div
          style={{
            flex: 1,
            width: "1px",
            background: "rgba(130,195,216,0.18)",
            minHeight: "60px",
          }}
        />
      </div>

      {/* Right */}
      <div
        style={{
          paddingLeft: "32px",
          paddingBottom: "60px",
          visibility: !isEven ? "visible" : "hidden",
        }}
      >
        {!isEven && <TimelineCard item={item} align="left" />}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   AWARD CARD  — gallery style (matches Award-Winners screenshot)
   [large thumbnail]
   Title                         ♥
   BY: ORGANISATION             year
═══════════════════════════════════════════════════════════════════════════ */
function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function AwardCard({ award, idx }: { award: Award; idx: number }) {
  const [liked, setLiked] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 48, scale: 0.94 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.55,
        delay: idx * 0.07,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hovered"
      style={{
        background: "#ffffff",
        borderRadius: "6px",
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        border: "1px solid rgba(0,0,0,0.07)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "66%" /* 3:2 */,
          overflow: "hidden",
          background: "#f0f0f0",
          flexShrink: 0,
        }}
      >
        <motion.img
          src={getImageUrl(award.image, "medium")}
          alt={award.title}
          variants={{
            hovered: {
              scale: 1.06,
              transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
            },
          }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          loading="lazy"
        />
        {/* colour accent bar on hover */}
        <motion.div
          variants={{ hovered: { opacity: 1 } }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: award.color || "#82c3d8",
            opacity: 0,
            transition: "opacity 0.3s ease",
          }}
        />
      </div>

      {/* Card body */}
      <div
        style={{
          padding: "13px 16px 11px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "8px",
          flex: 1,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif",
              fontSize: "15px",
              fontWeight: 600,
              color: "#111",
              marginBottom: "3px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {award.title}
          </div>
          <div
            style={{
              fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#999",
            }}
          >
            BY: {award.organization}
          </div>
        </div>

        {/* Heart + year */}
        <motion.button
          onClick={() => setLiked((p) => !p)}
          whileTap={{ scale: 0.75 }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
            padding: "2px 0",
            flexShrink: 0,
          }}
        >
          <motion.span
            animate={{ color: liked ? "#e74c3c" : "#ccc" }}
            transition={{ duration: 0.2 }}
            style={{ display: "flex", lineHeight: 1 }}
          >
            <HeartIcon filled={liked} />
          </motion.span>
          <span
            style={{
              fontFamily: "'DM Sans','Helvetica Neue',Arial,sans-serif",
              fontSize: "11px",
              color: "#bbb",
              fontWeight: 500,
              lineHeight: 1,
            }}
          >
            {award.year}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */
export default function AchievementsPage() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [careerJourney, setCareerJourney] = useState<CareerJourney[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const quoteRef = useRef<HTMLDivElement>(null);
  const timelineHeadRef = useRef<HTMLDivElement>(null);
  const awardsHeadRef = useRef<HTMLDivElement>(null);

  const quoteInView = useInView(quoteRef, { once: true, margin: "-80px" });
  const timelineHeadInView = useInView(timelineHeadRef, {
    once: true,
    margin: "-80px",
  });
  const awardsHeadInView = useInView(awardsHeadRef, {
    once: true,
    margin: "-80px",
  });

  const gridVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [awardsRes, journeyRes] = await Promise.all([
          fetch(`${API_BASE_URL}/award`),
          fetch(`${API_BASE_URL}/career-journey`),
        ]);
        if (!awardsRes.ok || !journeyRes.ok) throw new Error("Failed to fetch");

        const awardsData = await awardsRes.json();
        const journeyData = await journeyRes.json();

        if (awardsData.status && awardsData.data)
          setAwards(
            awardsData.data.filter((a: Award) => a.status === "active"),
          );

        if (journeyData.status && journeyData.data)
          setCareerJourney(
            journeyData.data
              .filter((j: CareerJourney) => j.status === "active")
              .sort(
                (a: CareerJourney, b: CareerJourney) =>
                  parseInt(b.year) - parseInt(a.year),
              ),
          );

        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load achievements data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <Navbar />

      <main
        style={{
          background: "#F4F4F4",
          minHeight: "100vh",
          color: "#000",
          fontFamily: "var(--font-body, sans-serif)",
          overflow: "hidden",
        }}
      >
        {/* ══ HERO ══════════════════════════════════════════════════════ */}
        <PageHero title="Our Achievements" currentPage="Achievements" />

        {/* ══ QUOTE ═════════════════════════════════════════════════════ */}
        <section style={{ padding: "50px 0" }}>
          <div className="container">
            <motion.div
              ref={quoteRef}
              initial={{ opacity: 0, x: -40 }}
              animate={quoteInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as const }}
              style={{
                borderLeft: "3px solid #82c3d8",

                paddingLeft: "48px",
                maxWidth: "780px",
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  fontSize: "80px",
                  lineHeight: 0.6,
                  color: "#0009",
                  fontFamily: "var(--font-display)",
                  marginBottom: "16px",
                }}
              >
                "
              </div>
              <blockquote
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(22px,3vw,36px)",
                  color: "#000",
                  lineHeight: 1.4,
                  fontWeight: 300,
                  margin: "0 0 24px",
                  letterSpacing: "-0.01em",
                }}
              >
                Leadership is not a position you hold — it is a standard you
                set, every single day.
              </blockquote>
              <cite
                style={{
                  fontSize: "13px",
                  color: "#0005",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontStyle: "normal",
                }}
              >
                — Alexandra Voss, The Sovereign Leader
              </cite>
            </motion.div>
          </div>
        </section>

        {/* ══ TIMELINE ══════════════════════════════════════════════════ */}
        <section
          style={{
            padding: "100px 0",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            background: "#fff",
          }}
        >
          <div className="container">
            <motion.div
              ref={timelineHeadRef}
              initial={{ opacity: 0, y: 30 }}
              animate={timelineHeadInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
              style={{ textAlign: "center", marginBottom: "80px" }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#000",
                  marginBottom: "16px",
                }}
              >
                The Journey
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(36px,4vw,56px)",
                  color: "#000",
                  margin: 0,
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                }}
              >
                Career Milestones
              </h2>
            </motion.div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 0",
                  color: "rgba(235,64,52,0.8)",
                }}
              >
                {error}
              </div>
            ) : careerJourney.length > 0 ? (
              <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                {careerJourney.map((item, i) => (
                  <TimelineItem key={item.id} item={item} idx={i} />
                ))}
              </div>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 0",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                No journey data available
              </div>
            )}
          </div>
        </section>

        {/* ══ AWARDS ════════════════════════════════════════════════════
            Light bg so white cards pop — matches Award-Winners screenshot
        ══════════════════════════════════════════════════════════════════ */}
        <section style={{ padding: "100px 0 120px", background: "#f4f4f4" }}>
          <div className="container">
            {/* Heading */}
            <motion.div
              ref={awardsHeadRef}
              initial={{ opacity: 0, y: 30 }}
              animate={awardsHeadInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
              style={{ textAlign: "center", marginBottom: "56px" }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#82c3d8",
                  marginBottom: "14px",
                }}
              >
                Awards & Honours
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(36px,4vw,56px)",
                  color: "#111",
                  margin: "0 0 12px",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                }}
              >
                Recognised Worldwide
              </h2>
              <p style={{ fontSize: "14px", color: "#888", margin: 0 }}>
                Most celebrated achievements across the globe. Evaluation is
                closed.
              </p>
            </motion.div>

            {/* Grid */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ textAlign: "center", padding: "60px 0" }}
                >
                  <LoadingSpinner />
                  <p
                    style={{
                      marginTop: "16px",
                      fontSize: "14px",
                      color: "#999",
                    }}
                  >
                    Loading awards…
                  </p>
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    textAlign: "center",
                    padding: "60px 0",
                    color: "#e74c3c",
                    fontSize: "14px",
                  }}
                >
                  {error}
                </motion.div>
              ) : awards.length > 0 ? (
                <motion.div
                  key="grid"
                  variants={gridVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  className="awards-gallery-grid"
                >
                  {awards.map((a, i) => (
                    <AwardCard key={a.id} award={a} idx={i} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    textAlign: "center",
                    padding: "60px 0",
                    color: "#999",
                    fontSize: "14px",
                  }}
                >
                  No awards available
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ══ CLOSING CTA ═══════════════════════════════════════════════ */}
        {/* <ClosingCTA /> */}
      </main>

      <Footer />

      {/* ── Responsive styles ── */}
      <style>{`
        /* Awards: 3-col → 2-col → 1-col */
        .awards-gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) {
          .awards-gallery-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 520px) {
          .awards-gallery-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
