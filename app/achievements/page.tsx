"use client";

import Footer from "@/components/Footer";
import PageHero from "@/components/HeroPage";
import Navbar from "@/components/Navbar";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  Globe,
  Mic,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ─── ENV ─── */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const IMG_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "";

/* ─── Types ─── */
interface Achievement {
  id: number;
  title: string;
  description?: string;
  year?: string | number;
  category?: string;
  value?: string | number;
  icon?: string;
  image?: string | null;
  badge?: string;
}
interface AwardItem {
  id: number;
  title: string;
  organization: string;
  year: string;
  color: string;
  image: string;
}

interface Stat {
  label: string;
  value: number;
  suffix: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  description: string;
}

/* ─── Fallback data ─── */
const FALLBACK_STATS: Stat[] = [
  {
    label: "Books Published",
    value: 30,
    suffix: "+",
    icon: BookOpen,
    description: "Across multiple categories",
  },
  {
    label: "Readers Worldwide",
    value: 50000,
    suffix: "+",
    icon: Users,
    description: "In 50+ countries",
  },
  {
    label: "Events Conducted",
    value: 200,
    suffix: "+",
    icon: Mic,
    description: "Seminars & workshops",
  },
  {
    label: "Years of Impact",
    value: 15,
    suffix: "+",
    icon: Calendar,
    description: "Of consistent leadership",
  },
  {
    label: "Clients Served",
    value: 500,
    suffix: "+",
    icon: TrendingUp,
    description: "Businesses & individuals",
  },
  {
    label: "Countries Reached",
    value: 50,
    suffix: "+",
    icon: Globe,
    description: "Global audience",
  },
];

const CAT_CONFIG: Record<
  string,
  {
    icon: React.ComponentType<{ size?: number; color?: string }>;
    color: string;
    accent: string;
  }
> = {
  Author: { icon: BookOpen, color: "#4a7c7e", accent: "#b2d8da" },
  Speaking: { icon: Mic, color: "#7c6a4a", accent: "#d8c8a0" },
  Impact: { icon: TrendingUp, color: "#5a7a5a", accent: "#b0ccb0" },
  Business: { icon: Zap, color: "#7a4a6a", accent: "#d0a8c4" },
  Media: { icon: Star, color: "#4a5a7a", accent: "#a8b8d8" },
  Award: { icon: Trophy, color: "#7a7a4a", accent: "#d0d0a8" },
  default: { icon: Award, color: "#6c7e7f", accent: "#c0cece" },
};

/* ─── CountUp ─── */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  useEffect(() => {
    if (!inView) return;
    const dur = 2200,
      steps = 70;
    const step = target / steps;
    let cur = 0;
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) {
        setVal(target);
        clearInterval(t);
      } else setVal(Math.floor(cur));
    }, dur / steps);
    return () => clearInterval(t);
  }, [inView, target]);
  return (
    <span ref={ref}>
      {val >= 1000
        ? `${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}K`
        : val.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─── Floating orb background ─── */
function FloatingOrbs() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {[
        {
          size: 400,
          x: "10%",
          y: "20%",
          color: "rgba(108,126,127,0.06)",
          delay: 0,
        },
        {
          size: 300,
          x: "75%",
          y: "60%",
          color: "rgba(108,126,127,0.04)",
          delay: 2,
        },
        {
          size: 200,
          x: "50%",
          y: "10%",
          color: "rgba(108,126,127,0.05)",
          delay: 4,
        },
      ].map((orb, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -30, 0], x: [0, 10, 0] }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
          style={{
            position: "absolute",
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Stat Card ─── */
function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="stat-card-new"
      style={{
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(108,126,127,0.12)",
        borderRadius: 24,
        padding: "28px 24px",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      {/* Gradient top border */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background:
            "linear-gradient(90deg, transparent, #6c7e7f, transparent)",
          opacity: 0.6,
        }}
      />

      {/* Number */}
      <div
        className="font-rising"
        style={{
          fontSize: "clamp(36px, 3.5vw, 52px)",
          fontWeight: 800,
          color: "#1a2427",
          lineHeight: 1,
          letterSpacing: "-0.02em",
          marginBottom: 6,
        }}
      >
        <CountUp target={stat.value} suffix={stat.suffix} />
      </div>

      {/* Label */}
      <div
        className="font-xolonium"
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#6c7e7f",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: 4,
        }}
      >
        {stat.label}
      </div>

      <div style={{ fontSize: 12, color: "#9aa6aa" }}>{stat.description}</div>

      {/* Icon watermark */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          right: 16,
          opacity: 0.06,
        }}
      >
        <stat.icon size={52} color="#1a2427" />
      </div>
    </motion.div>
  );
}

/* ─── Horizontal Scroll Timeline ─── */
function HorizontalTimeline({ items }: { items: Achievement[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  return (
    <div style={{ position: "relative" }}>
      {/* Year rail */}
      <div
        style={{
          display: "flex",
          gap: 0,
          overflowX: "auto",
          scrollbarWidth: "none",
          paddingBottom: 8,
          position: "relative",
        }}
        className="hide-scroll"
      >
        {/* Spine line */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 0,
            right: 0,
            height: 2,
            background:
              "linear-gradient(90deg, transparent, #6c7e7f44 20%, #6c7e7f44 80%, transparent)",
            zIndex: 0,
          }}
        />

        {items.map((item, i) => {
          const cat = CAT_CONFIG[item.category ?? ""] ?? CAT_CONFIG.default;
          return (
            <div
              key={item.id}
              onClick={() => setActive(i)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: 120,
                cursor: "pointer",
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* Node */}
              <motion.div
                animate={{
                  scale: active === i ? 1.2 : 1,
                  background: active === i ? cat.color : "#e8ecea",
                }}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `2px solid ${active === i ? cat.color : "#dde5e4"}`,
                  transition: "all 0.3s ease",
                  boxShadow:
                    active === i ? `0 8px 24px ${cat.color}44` : "none",
                  cursor: "pointer",
                }}
              >
                <cat.icon size={18} color={active === i ? "#fff" : "#9aa6aa"} />
              </motion.div>

              {/* Year label */}
              <div
                className="font-xolonium"
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: active === i ? cat.color : "#9aa6aa",
                  marginTop: 8,
                  letterSpacing: "0.06em",
                  transition: "color 0.3s",
                }}
              >
                {/* {item.year} */}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Card */}
      <AnimatePresence mode="wait">
        {items.length > 0 && (
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            style={{
              marginTop: 40,
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(108,126,127,0.15)",
              borderRadius: 24,
              padding: 32,
              boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
            }}
          >
            {items[active].category && (
              <span
                className="font-xolonium"
                style={{
                  display: "inline-block",
                  marginBottom: 12,
                  padding: "5px 14px",
                  borderRadius: 20,
                  background: "#6c7e7f15",
                  color: "#6c7e7f",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                }}
              >
                {items[active].category}
              </span>
            )}

            <h3
              className="font-rising"
              style={{
                fontSize: "clamp(22px,2vw,32px)",
                color: "#1a2427",
                marginBottom: 14,
              }}
            >
              {items[active].title}
            </h3>

            <p
              className="font-xolonium"
              style={{
                color: "#6b7280",
                lineHeight: 1.8,
                fontSize: 13,
              }}
            >
              {items[active].description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prev / Next */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          marginTop: 28,
        }}
      >
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: i === active ? 28 : 8,
              height: 8,
              borderRadius: 4,
              background: i === active ? "#6c7e7f" : "#dde5e4",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Vertical Timeline ─── */
function VerticalTimeline({ items }: { items: Achievement[] }) {
  return (
    <div style={{ position: "relative" }}>
      {/* Spine */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          bottom: 0,
          width: 1,
          background:
            "linear-gradient(to bottom, transparent, #6c7e7f33 15%, #6c7e7f33 85%, transparent)",
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
        className="timeline-spine-v"
      />

      {items.map((item, i) => {
        const ref = useRef<HTMLDivElement>(null);
        const inView = useInView(ref, { once: true, margin: "-60px" });
        const isLeft = i % 2 === 0;
        const cat = CAT_CONFIG[item.category ?? ""] ?? CAT_CONFIG.default;

        return (
          <div
            key={item.id}
            ref={ref}
            className="vt-row"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 80px 1fr",
              marginBottom: i === items.length - 1 ? 0 : 56,
              alignItems: "flex-start",
            }}
          >
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -48 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="vt-left"
              style={{
                paddingRight: 32,
                paddingBottom: 0,
                visibility: isLeft ? "visible" : "hidden",
              }}
            >
              {isLeft && <VCard item={item} cat={cat} side="left" />}
            </motion.div>

            {/* Center node */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={inView ? { scale: 1, opacity: 1 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.15,
                  type: "spring",
                  stiffness: 200,
                }}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${cat.color}, ${cat.color}bb)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 8px 32px ${cat.color}40`,
                  border: "3px solid #fff",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <cat.icon size={20} color="#fff" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="font-xolonium"
                style={{
                  marginTop: 8,
                  background: cat.color,
                  color: "#fff",
                  borderRadius: 20,
                  padding: "3px 12px",
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  whiteSpace: "nowrap",
                }}
              >
                {/* {item.year} */}
              </motion.div>
            </div>

            {/* Right */}
            <motion.div
              initial={{ opacity: 0, x: 48 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="vt-right"
              style={{
                paddingLeft: 32,
                visibility: !isLeft ? "visible" : "hidden",
              }}
            >
              {!isLeft && <VCard item={item} cat={cat} side="right" />}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

function VCard({
  item,
  cat,
  side,
}: {
  item: Achievement;
  cat: { color: string; accent: string };
  side: "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -4, boxShadow: `0 20px 48px ${cat.color}20` }}
      className="vcard"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        border: `1px solid ${cat.color}18`,
        borderRadius: 20,
        padding: "24px 28px",
        position: "relative",
        overflow: "hidden",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Side accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          [side === "right" ? "left" : "right"]: 0,
          width: 3,
          background: `linear-gradient(to bottom, ${cat.color}, ${cat.color}44)`,
        }}
      />

      {/* Watermark number */}
      <div
        className="font-rising"
        style={{
          position: "absolute",
          top: -10,
          right: 16,
          fontSize: 72,
          color: `${cat.color}08`,
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {item.year}
      </div>

      {item.category && (
        <span
          className="font-xolonium"
          style={{
            display: "inline-block",
            background: `${cat.color}14`,
            color: cat.color,
            borderRadius: 20,
            padding: "3px 12px",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          {item.category}
        </span>
      )}

      <h3
        className="font-rising"
        style={{
          fontSize: "clamp(15px, 1.6vw, 19px)",
          color: "#1a2427",
          lineHeight: 1.25,
          marginBottom: 8,
        }}
      >
        {item.title}
      </h3>

      {item.description && (
        <p
          className="font-xolonium"
          style={{
            fontSize: 12,
            color: "#6b7280",
            lineHeight: 1.8,
            margin: 0,
          }}
        >
          {item.description}
        </p>
      )}
    </motion.div>
  );
}

/* ─── Award Card ─── */
function AwardCard({ item, index }: { item: AwardItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const getImage = (img: string) => {
    try {
      const p = JSON.parse(img);
      return `${IMG_BASE}${p.original}`;
    } catch {
      return "";
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.65,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="award-card-new"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 24,
        overflow: "hidden",
        transition: "all 0.35s ease",
        cursor: "default",
      }}
    >
      <div style={{ position: "relative", overflow: "hidden", height: 220 }}>
        <img
          src={getImage(item.image)}
          alt={item.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease",
          }}
          className="award-img"
        />
        {/* Overlay gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(20,32,38,0.7), transparent 50%)",
          }}
        />
        {/* Year chip */}
        <div
          className="font-xolonium"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 20,
            padding: "4px 12px",
            color: "#fff",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.1em",
          }}
        >
          {item.year}
        </div>
      </div>

      <div style={{ padding: "24px 24px 28px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
          }}
        >
          <Trophy size={14} color="#95a49a" />
          <span
            className="font-xolonium"
            style={{
              fontSize: 10,
              color: "#95a49a",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {item.organization}
          </span>
        </div>
        <h3
          className="font-rising"
          style={{
            color: "#fff",
            fontSize: "clamp(10px, 1.6vw, 14px)",
            lineHeight: 1.3,
          }}
        >
          {item.title}
        </h3>
      </div>
    </motion.div>
  );
}

/* ─── Skeleton ─── */
function Skeleton() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 24,
      }}
      className="skel-grid"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          style={{
            background: "rgba(255,255,255,0.5)",
            borderRadius: 24,
            border: "1px solid #e8ecea",
            overflow: "hidden",
            animation: "shimmer 1.8s ease-in-out infinite",
          }}
        >
          <div style={{ height: 3, background: "#e8ecea" }} />
          <div
            style={{
              padding: 28,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div
              style={{
                height: 48,
                width: 48,
                background: "#e8ecea",
                borderRadius: 14,
              }}
            />
            <div
              style={{
                height: 22,
                width: "60%",
                background: "#e8ecea",
                borderRadius: 8,
              }}
            />
            <div
              style={{
                height: 13,
                width: "95%",
                background: "#f0f2f1",
                borderRadius: 4,
              }}
            />
            <div
              style={{
                height: 13,
                width: "75%",
                background: "#f0f2f1",
                borderRadius: 4,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════
   MAIN PAGE
════════════════════════════════ */
export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [awards, setAwards] = useState<AwardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"vertical" | "horizontal">("vertical");

  useEffect(() => {
    Promise.allSettled([
      fetch(`${API_BASE}/career-journey`).then((r) => r.json()),
      fetch(`${API_BASE}/award`).then((r) => r.json()),
    ])
      .then(([achRes, awardRes]) => {
        if (achRes.status === "fulfilled") {
          const data = achRes.value?.data ?? achRes.value;

          setAchievements(Array.isArray(data) ? data : []);
        } else {
          setAchievements([]);
        }
        if (awardRes.status === "fulfilled") {
          const data = awardRes.value?.data ?? awardRes.value;
          if (Array.isArray(data)) setAwards(data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const sortedAch = [...achievements].sort(
    (a, b) => Number(b.year ?? 0) - Number(a.year ?? 0),
  );

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes shimmer { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .hide-scroll::-webkit-scrollbar { display: none; }

        .stat-card-new:hover {
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 20px 48px rgba(108,126,127,0.14) !important;
          border-color: rgba(108,126,127,0.25) !important;
        }
        .award-card-new:hover .award-img { transform: scale(1.06); }
        .vcard { box-shadow: 0 4px 20px rgba(108,126,127,0.06); }

        /* Responsive */
        @media (max-width: 960px) {
  .vt-row {
    grid-template-columns: 1fr !important;
    margin-bottom: 40px !important;
  }

  .vt-left,
  .vt-right {
    display: block !important;
    visibility: visible !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  /* timeline spine adjust */
  .timeline-spine-v {
    left: 16px !important;
  }

  /* center node adjust */
  .vt-row > div:nth-child(2) {
    display: none !important;
  }
}
        @media (max-width: 640px) {
          .stats-grid-new { grid-template-columns: repeat(2, 1fr) !important; }
          .awards-grid-new { grid-template-columns: 1fr !important; }
          .skel-grid { grid-template-columns: 1fr !important; }
          .hero-cta-row { flex-direction: column !important; align-items: stretch !important; }
          .view-toggle-wrap { flex-wrap: wrap; }
        }
      `}</style>

      <Navbar />
      <PageHero
        title={"Achievements &\nMilestones"}
        currentPage="Achievements"
      />

      {/* ── JOURNEY SECTION ── */}
      <section
        style={{
          background: "#fff",
          padding: "88px 0 100px",
          position: "relative",
        }}
      >
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px" }}>
          {/* Header row */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 64,
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            <div>
              <motion.span
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-xolonium"
                style={{
                  display: "inline-block",
                  background: "#6c7e7f14",
                  color: "#6c7e7f",
                  borderRadius: 40,
                  padding: "6px 20px",
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                  border: "1px solid #6c7e7f20",
                }}
              >
                Career Journey
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-rising"
                style={{
                  fontSize: "clamp(22px, 4vw, 38px)",
                  color: "#1a2427",
                  lineHeight: 1.1,
                }}
              >
                The Road to <em style={{ color: "#6c7e7f" }}>Excellence</em>
              </motion.h2>
            </div>

            {/* View toggle */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="view-toggle-wrap"
              style={{
                display: "flex",
                gap: 4,
                background: "#f4f7f6",
                padding: 4,
                borderRadius: 14,
              }}
            >
              {(
                [
                  { key: "vertical", label: "Timeline" },
                  { key: "horizontal", label: "Journey" },
                ] as const
              ).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setView(key)}
                  className="font-xolonium"
                  style={{
                    padding: "9px 20px",
                    borderRadius: 10,
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    border: "none",
                    cursor: "pointer",
                    background: view === key ? "#6c7e7f" : "transparent",
                    color: view === key ? "#fff" : "#9aa6aa",
                    transition: "all 0.25s",
                  }}
                >
                  {label}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {loading ? (
              <Skeleton key="skel" />
            ) : view === "vertical" ? (
              <motion.div
                key="vertical"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <VerticalTimeline items={sortedAch} />
              </motion.div>
            ) : (
              <motion.div
                key="horizontal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <HorizontalTimeline items={sortedAch} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── AWARDS SECTION ── */}
      {awards.length > 0 && (
        <section
          style={{
            background: "linear-gradient(160deg, #141e26 0%, #1c2c38 100%)",
            padding: "96px 0 104px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Dot pattern */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          {/* Glow */}
          <div
            style={{
              position: "absolute",
              top: "30%",
              left: "50%",
              width: 600,
              height: 600,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(108,126,127,0.08), transparent 70%)",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "0 24px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ textAlign: "center", marginBottom: 64 }}
            >
              <span
                className="font-xolonium"
                style={{
                  display: "inline-block",
                  background: "rgba(108,126,127,0.18)",
                  border: "1px solid rgba(108,126,127,0.3)",
                  color: "#95a49a",
                  borderRadius: 40,
                  padding: "6px 22px",
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginBottom: 18,
                }}
              >
                Recognition
              </span>
              <h2
                className="font-rising"
                style={{
                  fontSize: "clamp(20px, 4vw, 38px)",
                  color: "#fff",
                  lineHeight: 1.1,
                }}
              >
                Awards & <em style={{ color: "#95a49a" }}>Honors</em>
              </h2>
            </motion.div>

            <div
              className="awards-grid-new"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 24,
              }}
            >
              {awards.map((award, i) => (
                <AwardCard key={award.id} item={award} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section
        style={{
          background: "linear-gradient(160deg, #f4f7f6 0%, #eef2f1 100%)",
          padding: "96px 24px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <FloatingOrbs />
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            maxWidth: 680,
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Icon accent */}
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 20,
              background: "rgba(108,126,127,0.1)",
              border: "1px solid rgba(108,126,127,0.2)",
              marginBottom: 28,
            }}
          >
            <Sparkles size={28} color="#6c7e7f" />
          </motion.div>

          <h2
            className="font-rising"
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              color: "#1a2427",
              marginBottom: 18,
              lineHeight: 1.1,
            }}
          >
            Begin Your Own <em style={{ color: "#6c7e7f" }}>Story</em>
          </h2>
          <p
            className="font-xolonium"
            style={{
              fontSize: "clamp(13px, 1.5vw, 15px)",
              color: "#6b7280",
              lineHeight: 1.9,
              marginBottom: 40,
            }}
          >
            Explore books, attend transformative events, or book a personal
            consultation —<br />
            every achievement started with a single bold decision.
          </p>
          <div
            className="hero-cta-row"
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
            }}
          >
            <Link
              href="/books"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "#1a2427",
                color: "#fff",
                padding: "15px 32px",
                borderRadius: 12,
                fontSize: 11,
                fontWeight: 800,
                textDecoration: "none",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                transition: "all 0.28s",
                boxShadow: "0 8px 28px rgba(26,36,39,0.22)",
              }}
              className="cta-dark"
            >
              <BookOpen size={14} /> Explore Books <ArrowRight size={13} />
            </Link>
            <Link
              href="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "transparent",
                color: "#6c7e7f",
                padding: "15px 32px",
                borderRadius: 12,
                fontSize: 11,
                fontWeight: 800,
                textDecoration: "none",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                border: "1.5px solid #6c7e7f",
                transition: "all 0.28s",
              }}
              className="cta-outline"
            >
              Book Consultation
            </Link>
          </div>
        </motion.div>
        <style>{`
          .cta-dark:hover { background: #6c7e7f !important; transform: translateY(-3px); box-shadow: 0 16px 40px rgba(108,126,127,0.3) !important; }
          .cta-outline:hover { background: #6c7e7f !important; color: #fff !important; transform: translateY(-3px); }
        `}</style>
      </section>

      <Footer />
    </>
  );
}
