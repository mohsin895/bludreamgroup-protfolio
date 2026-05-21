"use client";

import Footer from "@/components/Footer";
import PageHero from "@/components/HeroPage";
import Navbar from "@/components/Navbar";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  BookOpen,
  Quote,
  Search,
  Tag,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ─── ENV ─── */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

/* ─── API Type (exact structure from /success-story) ─── */
interface Story {
  id: number;
  type: string; // "Designer", "Authors", etc.
  name: string;
  title: string;
  excerpt: string;
  metric: string; // "$240K inbound revenue"
  category: string; // "Design · Branding"
  avatar: string; // initials e.g. "MY"
  color: string; // "#c9a84c"
  bg: string; // "rgba(125,212,176,0.08)"
  tag: string; // "3 Enterprise Clients"
  year: string;
  sort_order: number;
  status: string;
  created_at: string;
  updated_at: string;
}

/* ─── Fallback data matching API shape ─── */
const FALLBACK: Story[] = [
  {
    id: 1,
    type: "Author",
    name: "Naomi Ashford",
    title: "From First Draft to Bestseller in 11 Months",
    excerpt:
      "Followed the writing and mindset framework from the books, rewrote her manuscript twice, and launched a debut thriller that hit #1 in its category within the first week.",
    metric: "80K+ copies sold",
    category: "Fiction · Thriller",
    avatar: "NA",
    color: "#6c7e7f",
    bg: "rgba(108,126,127,0.08)",
    tag: "#1 Debut Thriller",
    year: "2025",
    sort_order: 0,
    status: "active",
    created_at: "",
    updated_at: "",
  },
  {
    id: 2,
    type: "Designer",
    name: "Marcus Yuen",
    title: "Portfolio That Closed $240K in Contracts",
    excerpt:
      "Redesigned his personal brand positioning using the branding frameworks. Within 60 days he landed three enterprise clients including a Fortune 500 rebrand worth $240K.",
    metric: "$240K inbound revenue",
    category: "Design · Branding",
    avatar: "MY",
    color: "#95a49a",
    bg: "rgba(149,164,154,0.08)",
    tag: "3 Enterprise Clients",
    year: "2022",
    sort_order: 1,
    status: "active",
    created_at: "",
    updated_at: "",
  },
  {
    id: 3,
    type: "Entrepreneur",
    name: "Rakibul Islam",
    title: "7-Figure Business in 18 Months",
    excerpt:
      "Applied the Business Mindset Masterclass frameworks to his startup. Identified positioning gaps, rebuilt his team culture, and crossed ৳1 crore revenue within 18 months.",
    metric: "12x revenue growth",
    category: "Business · Startup",
    avatar: "RI",
    color: "#7a9190",
    bg: "rgba(122,145,144,0.08)",
    tag: "Team of 12 Built",
    year: "2024",
    sort_order: 2,
    status: "active",
    created_at: "",
    updated_at: "",
  },
  {
    id: 4,
    type: "Professional",
    name: "Nusrat Jahan",
    title: "Two Promotions in 14 Months",
    excerpt:
      "The leadership psychology books helped her reframe workplace relationships and communication. Her manager noticed within weeks. Two promotions in 14 months followed.",
    metric: "40% salary increase",
    category: "Career · Leadership",
    avatar: "NJ",
    color: "#9aa6aa",
    bg: "rgba(154,166,170,0.08)",
    tag: "2 Promotions Won",
    year: "2023",
    sort_order: 3,
    status: "active",
    created_at: "",
    updated_at: "",
  },
  {
    id: 5,
    type: "Creator",
    name: "Mahmud Al-Hassan",
    title: "500 to 180K Subscribers in One Year",
    excerpt:
      "Used the personal branding workshop insights to find his niche and serve his audience with precision. Authentic positioning converted to real monetization within a year.",
    metric: "৳3 lakh/month earned",
    category: "Content · Branding",
    avatar: "MA",
    color: "#5a6e6f",
    bg: "rgba(90,110,111,0.08)",
    tag: "180K Subscribers",
    year: "2024",
    sort_order: 4,
    status: "active",
    created_at: "",
    updated_at: "",
  },
  {
    id: 6,
    type: "Business Owner",
    name: "Fahmida Akter",
    title: "Home Bakery to Retail Store with 200+ Orders",
    excerpt:
      "The consultation sessions revealed pricing and branding blind spots. Implemented the customer psychology framework and opened a physical store within 10 months.",
    metric: "200+ monthly orders",
    category: "Business · Retail",
    avatar: "FA",
    color: "#6c7e7f",
    bg: "rgba(108,126,127,0.08)",
    tag: "Physical Store Opened",
    year: "2023",
    sort_order: 5,
    status: "active",
    created_at: "",
    updated_at: "",
  },
];

/* ─── Animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 38 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: [0.16, 1, 0.3, 1] as const },
  },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const cardVar = {
  hidden: { opacity: 0, y: 44, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.58, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/* ─── Animated counter ─── */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    const dur = 1800,
      steps = 55;
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
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ═══════════════════════════
   FEATURED CARD (first item)
═══════════════════════════ */
function FeaturedCard({ story }: { story: Story }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] as const }}
      className="featured-card"
      style={{
        background:
          "linear-gradient(135deg, #1a2730 0%, #243540 50%, #1f3038 100%)",
        borderRadius: 24,
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "1fr 360px",
        minHeight: 400,
        border: "1px solid rgba(108,126,127,0.25)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
        marginBottom: 56,
        position: "relative",
      }}
    >
      {/* Subtle grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.035,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Left: story content */}
      <div
        style={{
          padding: "52px 52px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 32,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              background: "#6c7e7f",
              color: "#fff",
              borderRadius: 20,
              padding: "5px 16px",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            ✦ Featured Story
          </span>
          <span
            style={{
              background: "rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.75)",
              borderRadius: 20,
              padding: "5px 14px",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.09em",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {story.type}
          </span>
          <span
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.6)",
              borderRadius: 20,
              padding: "5px 14px",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.09em",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {story.category}
          </span>
        </div>

        {/* Giant quote mark */}
        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 110,
            lineHeight: 0.55,
            color: "#6c7e7f",
            opacity: 0.18,
            marginBottom: 20,
            userSelect: "none",
          }}
        >
          "
        </div>

        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(22px, 2.4vw, 32px)",
            color: "#fff",
            lineHeight: 1.2,
            marginBottom: 20,
            fontWeight: 700,
          }}
        >
          {story.title}
        </h2>

        <p
          style={{
            fontSize: "clamp(14px, 1.4vw, 16px)",
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.85,
            marginBottom: 36,
            fontStyle: "italic",
            maxWidth: 520,
          }}
        >
          "{story.excerpt}"
        </p>

        {/* Author row */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${story.color}, ${story.color}99)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              border: "2px solid rgba(255,255,255,0.18)",
              fontSize: 16,
              fontWeight: 800,
              color: "#fff",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            {story.avatar}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
              {story.name}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.5)",
                marginTop: 2,
              }}
            >
              {story.category} · {story.year}
            </div>
          </div>
        </div>
      </div>

      {/* Right: metric panel */}
      <div
        style={{
          background: "rgba(108,126,127,0.12)",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "52px 40px",
          gap: 28,
          textAlign: "center",
        }}
      >
        {/* Metric */}
        <div
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(108,126,127,0.35)",
            borderRadius: 20,
            padding: "32px 28px",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "#95a49a",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Key Result
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(26px, 3vw, 36px)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.1,
              marginBottom: 8,
            }}
          >
            {story.metric.replace(/"/g, "")}
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#6c7e7f33",
              color: "#95a49a",
              borderRadius: 20,
              padding: "5px 14px",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            <Tag size={11} /> {story.tag}
          </div>
        </div>

        {/* Year badge */}
        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16,
            padding: "16px 24px",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: "#9aa6aa",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Year
          </div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 32,
              fontWeight: 800,
              color: "#fff",
            }}
          >
            {story.year}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════
   STORY CARD (grid)
═══════════════════════════ */
function StoryCard({ story }: { story: Story }) {
  const [expanded, setExpanded] = useState(false);
  const excerpt = story.excerpt ?? "";
  const truncated = excerpt.length > 160;

  return (
    <motion.div
      variants={cardVar}
      className="story-card"
      style={{
        background: "#ffffff",
        border: "1px solid #e8ecea",
        borderRadius: 20,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        boxShadow: "0 2px 16px rgba(108,126,127,0.06)",
      }}
    >
      {/* Top color bar */}
      <div
        style={{
          height: 4,
          background: `linear-gradient(90deg, ${story.color}, ${story.color}66)`,
        }}
      />

      <div
        style={{
          padding: "26px 26px 22px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Type + Category row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <span
            style={{
              background: story.bg || `${story.color}15`,
              color: story.color,
              borderRadius: 20,
              padding: "4px 14px",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {story.type}
          </span>
          <span style={{ fontSize: 11, color: "#9aa6aa", fontWeight: 500 }}>
            {story.category}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(16px, 1.5vw, 19px)",
            fontWeight: 700,
            color: "#1a2427",
            lineHeight: 1.25,
            marginBottom: 14,
          }}
        >
          {story.title}
        </h3>

        {/* Quote excerpt */}
        <div style={{ position: "relative", flex: 1 }}>
          <Quote
            size={28}
            color={story.color}
            style={{ opacity: 0.13, position: "absolute", top: -4, left: -4 }}
          />
          <p
            style={{
              fontSize: 13,
              color: "#6b7280",
              lineHeight: 1.8,
              paddingLeft: 6,
              fontStyle: "italic",
            }}
          >
            {expanded
              ? excerpt
              : truncated
                ? excerpt.slice(0, 160) + "…"
                : excerpt}
          </p>
          {truncated && (
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: story.color,
                fontSize: 11,
                fontWeight: 800,
                padding: "6px 0 0",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {expanded ? "Show Less ↑" : "Read More ↓"}
            </button>
          )}
        </div>

        {/* Metric chip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: story.bg || `${story.color}10`,
            borderRadius: 10,
            padding: "10px 14px",
            marginTop: 18,
            border: `1px solid ${story.color}22`,
          }}
        >
          <TrendingUp size={14} color={story.color} />
          <span style={{ fontSize: 13, fontWeight: 800, color: story.color }}>
            {story.metric.replace(/"/g, "")}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid #f0f2f1",
          padding: "16px 26px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${story.color}, ${story.color}bb)`,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 800,
              color: "#fff",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            {story.avatar}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1a2427" }}>
              {story.name}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#9aa6aa",
                marginTop: 1,
                fontWeight: 500,
              }}
            >
              {story.year}
            </div>
          </div>
        </div>

        {story.tag && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: 10,
              fontWeight: 800,
              color: story.color,
              background: story.bg || `${story.color}12`,
              borderRadius: 20,
              padding: "4px 12px",
              border: `1px solid ${story.color}25`,
              whiteSpace: "nowrap",
            }}
          >
            <Tag size={9} /> {story.tag}
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════
   SKELETON
═══════════════════════════ */
function SkeletonCard() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        border: "1px solid #e8ecea",
        overflow: "hidden",
        animation: "ss-pulse 1.8s ease-in-out infinite",
      }}
    >
      <div style={{ height: 4, background: "#e8ecea" }} />
      <div
        style={{
          padding: 26,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              height: 22,
              width: "35%",
              background: "#e8ecea",
              borderRadius: 20,
            }}
          />
          <div
            style={{
              height: 16,
              width: "30%",
              background: "#f0f2f1",
              borderRadius: 4,
            }}
          />
        </div>
        <div
          style={{
            height: 22,
            width: "80%",
            background: "#e8ecea",
            borderRadius: 6,
          }}
        />
        <div
          style={{
            height: 14,
            width: "100%",
            background: "#f0f2f1",
            borderRadius: 4,
          }}
        />
        <div
          style={{
            height: 14,
            width: "85%",
            background: "#f0f2f1",
            borderRadius: 4,
          }}
        />
        <div
          style={{
            height: 14,
            width: "70%",
            background: "#f5f6f5",
            borderRadius: 4,
          }}
        />
        <div
          style={{
            height: 38,
            background: "#e8ecea",
            borderRadius: 10,
            marginTop: 6,
          }}
        />
      </div>
      <div
        style={{
          borderTop: "1px solid #f0f2f1",
          padding: "14px 26px",
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#e8ecea",
          }}
        />
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}
        >
          <div
            style={{
              height: 14,
              width: "50%",
              background: "#e8ecea",
              borderRadius: 4,
            }}
          />
          <div
            style={{
              height: 11,
              width: "30%",
              background: "#f0f2f1",
              borderRadius: 4,
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════
   MAIN PAGE
═══════════════════════════ */
export default function SuccessStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [filtered, setFiltered] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [types, setTypes] = useState<string[]>([]);

  /* ── Fetch ── */
  useEffect(() => {
    fetch(`${API_BASE}/success-story`)
      .then((r) => r.json())
      .then((json) => {
        const data: Story[] = json?.data ?? [];
        const list = data.length > 0 ? data : FALLBACK;
        setStories(list);
        setFiltered(list);
        // Extract unique types
        const unique = Array.from(new Set(list.map((s) => s.type)));
        setTypes(unique);
      })
      .catch(() => {
        setStories(FALLBACK);
        setFiltered(FALLBACK);
        setTypes(Array.from(new Set(FALLBACK.map((s) => s.type))));
      })
      .finally(() => setLoading(false));
  }, []);

  /* ── Filter ── */
  useEffect(() => {
    let r = [...stories];
    if (activeType !== "All") r = r.filter((s) => s.type === activeType);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.title.toLowerCase().includes(q) ||
          s.excerpt.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q),
      );
    }
    setFiltered(r);
  }, [search, activeType, stories]);

  const featured = filtered[0];
  const gridStories = filtered.slice(1);
  const allFilters = ["All", ...types];

  return (
    <>
      <style>{`
        
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
       

        .story-card:hover {
          transform: translateY(-7px);
          box-shadow: 0 24px 56px rgba(108,126,127,0.14) !important;
          border-color: #95a49a !important;
        }
        .ss-filter-btn { transition: all 0.22s ease; cursor: pointer; }
        .ss-filter-btn:hover { background: #6c7e7f !important; color: #fff !important; border-color: #6c7e7f !important; }

        .featured-card .featured-right {
          background: rgba(108,126,127,0.12);
          border-left: 1px solid rgba(255,255,255,0.06);
        }

        @keyframes ss-pulse { 0%,100%{opacity:0.65} 50%{opacity:1} }

        /* ── RESPONSIVE ── */
        @media (max-width: 960px) {
          .featured-card { grid-template-columns: 1fr !important; }
          .featured-right-col { display: none !important; }
          .ss-hero-inner { padding: 64px 20px 56px !important; }
          .ss-stories-grid { grid-template-columns: repeat(2,1fr) !important; }
          .ss-filter-bar { flex-direction: column !important; gap: 12px !important; align-items: stretch !important; }
          .ss-search-wrap { flex: none !important; width: 100% !important; }
        }
        @media (max-width: 600px) {
          .ss-stories-grid { grid-template-columns: 1fr !important; }
          .ss-hero-stats   { flex-wrap: wrap !important; gap: 24px 40px !important; }
          .ss-cat-pills    { flex-wrap: wrap !important; }
        }
      `}</style>
      <Navbar />

      {/* ══════════════════════
          HERO
      ══════════════════════ */}
      <PageHero title="Success Stories" currentPage="Success" />

      {/* ══════════════════════
          MAIN CONTENT
      ══════════════════════ */}
      <main style={{ background: "#f4f7f6", minHeight: "50vh" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "60px 24px 80px",
          }}
        >
          {/* Filter bar */}
          <div
            className="ss-filter-bar"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginBottom: 48,
            }}
          >
            {/* Search */}
            <div
              className="ss-search-wrap"
              style={{ position: "relative", flex: "0 0 280px" }}
            >
              <Search
                size={14}
                color="#9aa6aa"
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search stories…"
                style={{
                  width: "100%",
                  padding: "11px 14px 11px 38px",
                  border: "1.5px solid #e8ecea",
                  borderRadius: 12,
                  outline: "none",
                  fontSize: 13,
                  color: "#1a2427",
                  background: "#fff",
                  fontFamily: "'DM Sans',sans-serif",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#6c7e7f")}
                onBlur={(e) => (e.target.style.borderColor = "#e8ecea")}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9aa6aa",
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Type pills */}
            <div
              className="ss-cat-pills"
              style={{
                display: "flex",
                gap: 8,
                flex: 1,
                overflowX: "auto",
                paddingBottom: 2,
              }}
            >
              {allFilters.map((f) => {
                const isActive = activeType === f;
                return (
                  <button
                    key={f}
                    onClick={() => setActiveType(f)}
                    className="ss-filter-btn"
                    style={{
                      padding: "8px 18px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      border: `1.5px solid ${isActive ? "#6c7e7f" : "#e8ecea"}`,
                      background: isActive ? "#6c7e7f" : "transparent",
                      color: isActive ? "#fff" : "#6b7280",
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    {f}
                  </button>
                );
              })}
            </div>

            {/* Count */}
            <div
              style={{
                fontSize: 12,
                color: "#9aa6aa",
                fontWeight: 600,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {loading
                ? "Loading…"
                : `${filtered.length} stor${filtered.length !== 1 ? "ies" : "y"}`}
            </div>
          </div>

          {/* Featured card */}
          {!loading && featured && !search && activeType === "All" && (
            <FeaturedCard story={featured} />
          )}

          {/* Grid */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="skel"
                className="ss-stories-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 24,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </motion.div>
            ) : filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ textAlign: "center", padding: "80px 20px" }}
              >
                <Users size={52} color="#e5e7eb" style={{ marginBottom: 16 }} />
                <h3
                  style={{
                    fontFamily: "'Playfair Display',serif",
                    fontSize: 24,
                    color: "#1a2427",
                    marginBottom: 10,
                  }}
                >
                  No stories found
                </h3>
                <p style={{ fontSize: 14, color: "#9aa6aa" }}>
                  Try adjusting your search or filter.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setActiveType("All");
                  }}
                  style={{
                    marginTop: 24,
                    background: "#6c7e7f",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "12px 26px",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Reset Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={`${activeType}-${search}`}
                className="ss-stories-grid"
                variants={stagger}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 24,
                }}
              >
                {(search || activeType !== "All" ? filtered : gridStories).map(
                  (s) => (
                    <StoryCard key={s.id} story={s} />
                  ),
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ══════════════════════
          BOTTOM CTA
      ══════════════════════ */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #6c7e7f 0%, #7a9190 45%, #95a49a 100%)",
          padding: "80px 24px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.06,
            backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 28 }}
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
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(30px,4vw,52px)",
              color: "#fff",
              marginBottom: 16,
              lineHeight: 1.1,
            }}
          >
            Ready to Write Your
            <br />
            <span
              style={{ fontStyle: "italic", color: "rgba(255,255,255,0.85)" }}
            >
              Own Story?
            </span>
          </h2>
          <p
            style={{
              fontSize: "clamp(14px,1.6vw,17px)",
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.8,
              marginBottom: 40,
            }}
          >
            Every great story began with a single decision. Start yours through
            books, mentorship, or a personal consultation.
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
                background: "#fff",
                color: "#6c7e7f",
                padding: "14px 30px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 800,
                textDecoration: "none",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                transition: "all 0.25s",
                boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
              }}
              className="ss-cta-books"
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
                color: "#fff",
                padding: "14px 30px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
                border: "2px solid rgba(255,255,255,0.55)",
                transition: "all 0.25s",
              }}
              className="ss-cta-consult"
            >
              Book Consultation
            </Link>
          </div>
        </motion.div>
        <style>{`
          .ss-cta-books:hover   { transform:translateY(-3px); box-shadow:0 16px 40px rgba(0,0,0,0.2) !important; }
          .ss-cta-consult:hover { background:rgba(255,255,255,0.12) !important; border-color:rgba(255,255,255,0.85) !important; transform:translateY(-3px); }
        `}</style>
      </section>
      <Footer />
    </>
  );
}
