"use client";

import Footer from "@/components/Footer";
import PageHero from "@/components/HeroPage";
import Navbar from "@/components/Navbar";
import { motion, useInView } from "framer-motion";
import {
  Award,
  BookOpen,
  Calendar,
  Globe,
  Mic,
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
interface Award {
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

const FALLBACK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 1,
    year: 2009,
    category: "Author",
    title: "First Book Published",
    description:
      "Debut book launched, marking the beginning of an author's journey that would touch millions.",
  },
  {
    id: 2,
    year: 2011,
    category: "Speaking",
    title: "First Keynote Speech",
    description:
      "Delivered a keynote to 500+ audience, establishing credibility as a public speaker.",
  },
  {
    id: 3,
    year: 2013,
    category: "Author",
    title: "10th Book Milestone",
    description:
      "Published the 10th title — spanning self-development, entrepreneurship, and psychology.",
  },
  {
    id: 4,
    year: 2015,
    category: "Impact",
    title: "10,000 Readers Milestone",
    description:
      "Reached 10,000 active readers across Bangladesh, marking a significant growth in influence.",
  },
  {
    id: 5,
    year: 2016,
    category: "Business",
    title: "Consultation Practice Launched",
    description:
      "Officially launched a personal consultation service to directly impact entrepreneurs and leaders.",
  },
  {
    id: 6,
    year: 2018,
    category: "Media",
    title: "National TV Feature",
    description:
      "Featured on national television as a leading voice in entrepreneurship and personal development.",
  },
  {
    id: 7,
    year: 2019,
    category: "Author",
    title: "20th Book Published",
    description:
      "A landmark achievement — 20 books spanning multiple genres and topics of transformation.",
  },
  {
    id: 8,
    year: 2020,
    category: "Impact",
    title: "Online Presence Expanded",
    description:
      "Built a community of 100,000+ followers across social media platforms during the pandemic era.",
  },
  {
    id: 9,
    year: 2021,
    category: "Speaking",
    title: "International Speaking Debut",
    description:
      "First international speaking engagement, connecting with audiences beyond the borders of Bangladesh.",
  },
  {
    id: 10,
    year: 2022,
    category: "Author",
    title: "Bestseller Achievement",
    description:
      "Multiple titles became bestsellers in Bangladeshi bookstores during Ekushey Book Fair.",
  },
  {
    id: 11,
    year: 2023,
    category: "Impact",
    title: "50,000 Readers Worldwide",
    description:
      "The global readership crossed 50,000 — a testament to the universal appeal of the message.",
  },
  {
    id: 12,
    year: 2024,
    category: "Business",
    title: "30th Book Published",
    description:
      "Celebrated the 30-book milestone with a major launch event attended by readers and media.",
  },
];

const CAT_CONFIG: Record<
  string,
  {
    icon: React.ComponentType<{ size?: number; color?: string }>;
    color: string;
    bg: string;
  }
> = {
  Author: { icon: BookOpen, color: "#6c7e7f", bg: "#6c7e7f18" },
  Speaking: { icon: Mic, color: "#95a49a", bg: "#95a49a18" },
  Impact: { icon: TrendingUp, color: "#7a9190", bg: "#7a919018" },
  Business: { icon: Zap, color: "#9aa6aa", bg: "#9aa6aa18" },
  Media: { icon: Star, color: "#5a6e6f", bg: "#5a6e6f18" },
  Award: { icon: Trophy, color: "#6c7e7f", bg: "#6c7e7f18" },
  default: { icon: Award, color: "#6c7e7f", bg: "#6c7e7f18" },
};

/* ─── Animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  },
};
const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.55 } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const slideL = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};
const slideR = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/* ─── CountUp ─── */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    const dur = 2000,
      steps = 60;
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

/* ═══════════════════════════════════
   STAT CARD
═══════════════════════════════════ */
function StatCard({ stat }: { stat: Stat }) {
  return (
    <motion.div
      variants={fadeUp}
      className="stat-card"
      style={{
        background: "#ffffff",
        border: "1px solid #e8ecea",
        borderRadius: 20,
        padding: "32px 28px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 16,
        transition: "all 0.3s ease",
        boxShadow: "0 2px 16px rgba(108,126,127,0.05)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative corner */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 80,
          height: 80,
          background: "linear-gradient(135deg, transparent 50%, #6c7e7f08 50%)",
        }}
      />

      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: "#6c7e7f12",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <stat.icon size={24} color="#6c7e7f" />
      </div>

      <div>
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(32px, 3.5vw, 48px)",
            fontWeight: 800,
            color: "#6c7e7f",
            lineHeight: 1,
          }}
        >
          <CountUp target={stat.value} suffix={stat.suffix} />
        </div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "#1a2427",
            marginTop: 6,
          }}
        >
          {stat.label}
        </div>
        <div style={{ fontSize: 12, color: "#9aa6aa", marginTop: 4 }}>
          {stat.description}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════
   TIMELINE ITEM
═══════════════════════════════════ */
function TimelineItem({
  item,
  isLeft,
  isLast,
}: {
  item: Achievement;
  isLeft: boolean;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const cat = CAT_CONFIG[item.category ?? ""] ?? CAT_CONFIG.default;

  return (
    <div
      ref={ref}
      className="timeline-item"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 60px 1fr",
        gap: 0,
        alignItems: "flex-start",
        marginBottom: isLast ? 0 : 0,
      }}
    >
      {/* Left content */}
      <motion.div
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        variants={isLeft ? slideL : fadeIn}
        style={{
          padding: "0 36px 48px 0",
          textAlign: isLeft ? "right" : "left",
          visibility: isLeft ? "visible" : "hidden",
        }}
      >
        {isLeft && <TimelineCard item={item} cat={cat} align="right" />}
      </motion.div>

      {/* Center spine */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Year badge */}
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            flexShrink: 0,
            background: `linear-gradient(135deg, ${cat.color}, ${cat.color}bb)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 8px 24px ${cat.color}44`,
            border: "3px solid #ffffff",
            zIndex: 1,
            position: "relative",
          }}
        >
          <cat.icon size={22} color="#fff" />
        </div>
        <div
          style={{
            background: cat.color,
            color: "#fff",
            borderRadius: 20,
            padding: "3px 10px",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.08em",
            marginTop: 6,
            whiteSpace: "nowrap",
          }}
        >
          {item.year}
        </div>
        {/* Spine line */}
        {!isLast && (
          <div
            style={{
              width: 2,
              flex: 1,
              minHeight: 40,
              marginTop: 8,
              background: "linear-gradient(to bottom, #e8ecea, transparent)",
            }}
          />
        )}
      </div>

      {/* Right content */}
      <motion.div
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        variants={!isLeft ? slideR : fadeIn}
        style={{
          padding: "0 0 48px 36px",
          textAlign: !isLeft ? "left" : "right",
          visibility: !isLeft ? "visible" : "hidden",
        }}
      >
        {!isLeft && <TimelineCard item={item} cat={cat} align="left" />}
      </motion.div>
    </div>
  );
}

function TimelineCard({
  item,
  cat,
  align,
}: {
  item: Achievement;
  cat: { color: string; bg: string };
  align: "left" | "right";
}) {
  return (
    <div
      className="timeline-card"
      style={{
        background: "#ffffff",
        border: "1px solid #e8ecea",
        borderRadius: 16,
        padding: "22px 24px",
        textAlign: "left",
        transition: "all 0.3s ease",
        boxShadow: "0 2px 12px rgba(108,126,127,0.06)",
        position: "relative",
      }}
    >
      {/* Left accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          [align === "left" ? "left" : "right"]: 0,
          width: 4,
          background: `linear-gradient(to bottom, ${cat.color}, ${cat.color}66)`,
          borderRadius: align === "left" ? "4px 0 0 4px" : "0 4px 4px 0",
        }}
      />

      {item.category && (
        <span
          style={{
            display: "inline-block",
            background: cat.bg,
            color: cat.color,
            borderRadius: 20,
            padding: "3px 12px",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          {item.category}
        </span>
      )}

      <h3
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(15px, 1.5vw, 18px)",
          fontWeight: 700,
          color: "#1a2427",
          lineHeight: 1.25,
          marginBottom: 8,
        }}
      >
        {item.title}
      </h3>

      {item.description && (
        <p
          style={{
            fontSize: 13,
            color: "#6b7280",
            lineHeight: 1.75,
            margin: 0,
          }}
        >
          {item.description}
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════
   AWARD CARD (grid view)
═══════════════════════════════════ */
function AwardCard({ item, index }: { item: Achievement; index: number }) {
  const cat = CAT_CONFIG[item.category ?? ""] ?? CAT_CONFIG.default;

  return (
    <motion.div
      variants={fadeUp}
      className="award-card"
      style={{
        background: "#fff",
        border: "1px solid #e8ecea",
        borderRadius: 20,
        padding: "28px 24px",
        transition: "all 0.3s ease",
        boxShadow: "0 2px 16px rgba(108,126,127,0.05)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${cat.color}, ${cat.color}55)`,
        }}
      />

      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 14,
            flexShrink: 0,
            background: cat.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <cat.icon size={22} color={cat.color} />
        </div>
        <div>
          {item.year && (
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: cat.color,
                letterSpacing: "0.1em",
                marginBottom: 4,
              }}
            >
              {item.year}
            </div>
          )}
          {item.category && (
            <span
              style={{
                display: "inline-block",
                fontSize: 10,
                fontWeight: 700,
                color: cat.color,
                background: cat.bg,
                borderRadius: 20,
                padding: "2px 10px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {item.category}
            </span>
          )}
        </div>
      </div>

      <h3
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(15px, 1.5vw, 18px)",
          fontWeight: 700,
          color: "#1a2427",
          lineHeight: 1.25,
          marginBottom: 10,
        }}
      >
        {item.title}
      </h3>

      {item.description && (
        <p
          style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7, margin: 0 }}
        >
          {item.description}
        </p>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════
   MAIN PAGE
═══════════════════════════════════ */
export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<Stat[]>(FALLBACK_STATS);
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"timeline" | "grid">("timeline");
  const getAwardImage = (image: string) => {
    try {
      const parsed = JSON.parse(image);
      return `${IMG_BASE}${parsed.original}`;
    } catch {
      return "";
    }
  };
  useEffect(() => {
    Promise.allSettled([
      fetch(`${API_BASE}/career-journey`).then((r) => r.json()),
      fetch(`${API_BASE}/award`).then((r) => r.json()),
    ])
      .then(([achRes, awardRes]) => {
        // Career Journey
        if (achRes.status === "fulfilled") {
          const data = achRes.value?.data ?? achRes.value;

          if (Array.isArray(data) && data.length > 0) {
            setAchievements(data);
          } else {
            setAchievements(FALLBACK_ACHIEVEMENTS);
          }
        }

        // Awards
        if (awardRes.status === "fulfilled") {
          const data = awardRes.value?.data ?? awardRes.value;

          if (Array.isArray(data)) {
            setAwards(data);
          }
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
        body {  background: #f4f7f6; }

        .stat-card:hover  { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(108,126,127,0.12) !important; border-color: #95a49a !important; }
        .award-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(108,126,127,0.12) !important; border-color: #95a49a !important; }
        .timeline-card:hover { box-shadow: 0 12px 36px rgba(108,126,127,0.12) !important; border-color: #95a49a !important; transform: translateY(-2px); }
        .view-btn { transition: all 0.2s; }
        .view-btn:hover { background: #6c7e7f !important; color: #fff !important; }

        @keyframes pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .hero-inner  { padding: 64px 20px 56px !important; }

          /* Mobile timeline becomes single column */
          .timeline-item {
            grid-template-columns: 28px 1fr !important;
          }
          .timeline-left-col  { display: none !important; }
          .timeline-right-col { padding-left: 20px !important; padding-right: 0 !important; visibility: visible !important; }
          .timeline-center-col { display: flex !important; }

          .awards-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 600px) {
          .stats-grid  { grid-template-columns: repeat(2,1fr) !important; }
          .awards-grid { grid-template-columns: 1fr !important; }
          .hero-stats  { flex-direction: column !important; gap: 24px !important; }
        }
      `}</style>

      {/* ════════════════════════
          HERO
      ════════════════════════ */}
      <Navbar />
      <PageHero
        title="Achievements &
Milestones"
        currentPage="Achievements"
      />

      {/* ════════════════════════
          TIMELINE / GRID TOGGLE
      ════════════════════════ */}
      <section style={{ background: "#ffffff", padding: "72px 0 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          {/* Section header + view toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: 56,
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            <div>
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{
                  display: "inline-block",
                  background: "#6c7e7f18",
                  color: "#6c7e7f",
                  borderRadius: 40,
                  padding: "6px 20px",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                Journey
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(30px, 4vw, 50px)",
                  color: "#1a2427",
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                The Road to{" "}
                <span style={{ color: "#6c7e7f", fontStyle: "italic" }}>
                  Excellence
                </span>
              </motion.h2>
            </div>

            {/* View toggle */}
            <div
              style={{
                display: "flex",
                gap: 4,
                background: "#f4f7f6",
                padding: 4,
                borderRadius: 12,
              }}
            >
              {(["timeline", "grid"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className="view-btn"
                  style={{
                    padding: "8px 18px",
                    borderRadius: 9,
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    border: "none",
                    cursor: "pointer",
                    background: view === v ? "#6c7e7f" : "transparent",
                    color: view === v ? "#fff" : "#6b7280",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.22s",
                  }}
                >
                  {v === "timeline" ? "⟩ Timeline" : "⊞ Grid"}
                </button>
              ))}
            </div>
          </div>

          {/* ── TIMELINE VIEW ── */}
          {view === "timeline" && !loading && (
            <div style={{ position: "relative" }}>
              {/* Center line (desktop) */}
              <div
                className="timeline-spine"
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 0,
                  bottom: 0,
                  width: 2,
                  background: "linear-gradient(to bottom, #6c7e7f44, #e8ecea)",
                  transform: "translateX(-50%)",
                }}
              />

              {sortedAch.map((item, i) => (
                <TimelineItem
                  key={item.id}
                  item={item}
                  isLeft={i % 2 === 0}
                  isLast={i === sortedAch.length - 1}
                />
              ))}
            </div>
          )}

          {/* ── GRID VIEW ── */}
          {view === "grid" && !loading && (
            <motion.div
              key="grid"
              initial="hidden"
              animate="show"
              variants={stagger}
              className="awards-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 24,
              }}
            >
              {sortedAch.map((item, i) => (
                <AwardCard key={item.id} item={item} index={i} />
              ))}
            </motion.div>
          )}

          {/* Skeleton */}
          {loading && (
            <div
              className="awards-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 24,
              }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    background: "#f8f9fa",
                    borderRadius: 20,
                    border: "1px solid #e8ecea",
                    overflow: "hidden",
                    animation: "pulse 1.8s ease-in-out infinite",
                  }}
                >
                  <div style={{ height: 3, background: "#e8ecea" }} />
                  <div
                    style={{
                      padding: 28,
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        height: 44,
                        width: 44,
                        background: "#e8ecea",
                        borderRadius: 12,
                      }}
                    />
                    <div
                      style={{
                        height: 20,
                        width: "70%",
                        background: "#e8ecea",
                        borderRadius: 6,
                      }}
                    />
                    <div
                      style={{
                        height: 14,
                        width: "95%",
                        background: "#f0f2f1",
                        borderRadius: 4,
                      }}
                    />
                    <div
                      style={{
                        height: 14,
                        width: "75%",
                        background: "#f0f2f1",
                        borderRadius: 4,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════
          RECOGNITION STRIP
      ════════════════════════ */}
      <section
        style={{
          background: "linear-gradient(135deg, #1a2730 0%, #243540 100%)",
          padding: "72px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div
          style={{
            maxWidth: 1100,
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
            transition={{ duration: 0.7 }}
            style={{ textAlign: "center", marginBottom: 52 }}
          >
            <span
              style={{
                display: "inline-block",
                background: "rgba(108,126,127,0.2)",
                color: "#fff",
                borderRadius: 40,
                padding: "6px 20px",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 16,
                border: "1px solid rgba(108,126,127,0.3)",
              }}
            >
              Awards
            </span>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(30px, 4vw, 50px)",
                color: "#fff",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Awards &
              <span style={{ color: "#95a49a", fontStyle: "italic" }}>
                Recognition
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 20,
            }}
            className="strengths-grid"
          >
            {awards.map((award) => (
              <motion.div
                key={award.id}
                variants={fadeUp}
                className="strength-card"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  overflow: "hidden",
                }}
              >
                <img
                  src={getAwardImage(award.image)}
                  alt={award.title}
                  style={{
                    width: "100%",
                    height: 220,
                    objectFit: "cover",
                  }}
                />

                <div style={{ padding: 20 }}>
                  <div
                    style={{
                      color: award.color || "#95a49a",
                      fontSize: 12,
                      fontWeight: 700,
                      marginBottom: 8,
                    }}
                  >
                    {award.year}
                  </div>

                  <h3
                    style={{
                      color: "#fff",
                      fontSize: 18,
                      fontWeight: 700,
                      marginBottom: 8,
                    }}
                  >
                    {award.title}
                  </h3>

                  <p
                    style={{
                      color: "rgba(255,255,255,.7)",
                      fontSize: 14,
                    }}
                  >
                    {award.organization}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <style>{`
          .strength-card:hover { background: rgba(108,126,127,0.15) !important; border-color: rgba(108,126,127,0.35) !important; transform: translateY(-4px); }
          @media (max-width: 900px) { .strengths-grid { grid-template-columns: repeat(2,1fr) !important; } }
          @media (max-width: 500px)  { .strengths-grid { grid-template-columns: repeat(2,1fr) !important; } }

          /* Timeline mobile fix */
          @media (max-width: 768px) {
            .timeline-spine { display: none !important; }
            .timeline-item {
              grid-template-columns: 28px 1fr !important;
              gap: 0 !important;
            }
          }
        `}</style>
      </section>

      {/* ════════════════════════
          BOTTOM CTA
      ════════════════════════ */}
      <section
        style={{
          background: "#f4f7f6",
          padding: "72px 24px",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ maxWidth: 700, margin: "0 auto" }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(28px, 4vw, 48px)",
              color: "#1a2427",
              marginBottom: 16,
              lineHeight: 1.1,
            }}
          >
            Be Part of the Next{" "}
            <span style={{ color: "#6c7e7f", fontStyle: "italic" }}>
              Chapter
            </span>
          </h2>
          <p
            style={{
              fontSize: "clamp(14px, 1.6vw, 17px)",
              color: "#6b7280",
              lineHeight: 1.8,
              marginBottom: 36,
            }}
          >
            Explore books, attend events, or book a personal consultation —
            every achievement started with one decision.
          </p>
          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/books"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#6c7e7f",
                color: "#fff",
                padding: "14px 30px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 800,
                textDecoration: "none",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                transition: "all 0.25s",
                boxShadow: "0 8px 24px rgba(108,126,127,0.3)",
              }}
              className="bottom-cta-1"
            >
              <BookOpen size={15} /> Explore Books
            </Link>
            <Link
              href="/contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "transparent",
                color: "#6c7e7f",
                padding: "14px 30px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                border: "2px solid #6c7e7f",
                transition: "all 0.25s",
              }}
              className="bottom-cta-2"
            >
              Book Consultation
            </Link>
          </div>
        </motion.div>

        <style>{`
          .bottom-cta-1:hover { background: #5a6b6c !important; transform: translateY(-3px); box-shadow: 0 14px 36px rgba(108,126,127,0.35) !important; }
          .bottom-cta-2:hover { background: #6c7e7f !important; color: #fff !important; transform: translateY(-3px); }
        `}</style>
      </section>
      <Footer />
    </>
  );
}
