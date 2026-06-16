"use client";

/**
 * AchievementsSection — premium edition (matches WhyFollowSection system)
 *
 * New dependency required:
 *   npm install lottie-react
 *
 * Works immediately with Lucide icons. Point `lottieSrc` at a real .json
 * in /public/lottie/ to upgrade a stat to an animated icon — if the file
 * is missing/fails, it silently falls back to Lucide. Nothing breaks.
 *
 * Suggested LottieFiles search terms:
 *   Books Published    -> "open book stack", "book page flip"
 *   Readers Reached     -> "people group", "audience icon"
 *   Events Conducted    -> "calendar check", "event icon"
 *   Years Experience    -> "medal award", "trophy badge"
 *   Client Served       -> "star rating", "five star"
 */

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useLottie } from "lottie-react";
import { Award, BookOpen, Calendar, Star, Users } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type MouseEvent,
} from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

/* ----------------------------- design tokens ---------------------------- */

const palette = {
  sageDeep: "#54696B",
  sageMid: "#6c7e7f",
  sageLight: "#95a49a",
  brass: "#D9BD85",
  ink: "#16181A",
  white: "#ffffff",
};

/* -------------------------------- content --------------------------------- */

interface StatItem {
  id?: number;
  label: string;
  value: number;
  suffix?: string;
  icon: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  accent: "sage" | "brass";
  lottieSrc?: string;
}

const defaultStats: StatItem[] = [
  {
    label: "Books Published",
    value: 30,
    suffix: "+",
    icon: BookOpen,
    accent: "brass",
  },
  {
    label: "Readers Reached",
    value: 50000,
    suffix: "+",
    icon: Users,
    accent: "sage",
  },
  {
    label: "Events Conducted",
    value: 200,
    suffix: "+",
    icon: Calendar,
    accent: "brass",
  },
  {
    label: "Years Experience",
    value: 15,
    suffix: "+",
    icon: Award,
    accent: "sage",
  },
  {
    label: "Client Served",
    value: 500,
    suffix: "+",
    icon: Star,
    accent: "brass",
  },
];

/* --------------------------------- counter -------------------------------- */

function Counter({
  target,
  suffix = "",
  onDone,
}: {
  target: number;
  suffix?: string;
  onDone?: () => void;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!isInView) return;
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
        onDone?.();
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ---------------------------- lottie sub-player ---------------------------- */

function LottiePlayer({
  animationData,
  active,
}: {
  animationData: object;
  active: boolean;
}) {
  const { View, play, stop } = useLottie({
    animationData,
    loop: false,
    autoplay: false,
  });

  useEffect(() => {
    if (active) play();
    else stop();
  }, [active, play, stop]);

  return <div style={{ width: 26, height: 26 }}>{View}</div>;
}

/* -------------------------------- icon badge -------------------------------- */

function IconBadge({
  icon: Icon,
  lottieSrc,
  ringColor,
  active,
}: {
  icon: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  lottieSrc?: string;
  ringColor: string;
  active: boolean;
}) {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    if (!lottieSrc) return;
    let cancelled = false;
    fetch(lottieSrc)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setAnimationData(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [lottieSrc]);

  return (
    <div className="stat-badge">
      <span
        className="stat-ring"
        style={{ "--ring-color": ringColor } as CSSProperties}
      />
      <span className="stat-badge-inner">
        {animationData ? (
          <LottiePlayer animationData={animationData} active={active} />
        ) : (
          <Icon size={24} color={palette.white} strokeWidth={1.7} />
        )}
      </span>
    </div>
  );
}

/* --------------------------------- card --------------------------------- */

function StatCard({ stat }: { stat: StatItem }) {
  const [hovered, setHovered] = useState(false);
  const [finished, setFinished] = useState(false);
  const [finePointer, setFinePointer] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setFinePointer(window.matchMedia("(pointer: fine)").matches);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [6, -6]);
  const rotateY = useTransform(x, [-50, 50], [-6, 6]);
  const spring = { stiffness: 170, damping: 18, mass: 0.4 };
  const rX = useSpring(rotateX, spring);
  const rY = useSpring(rotateY, spring);

  const ringColor = stat.accent === "brass" ? palette.brass : palette.white;

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!finePointer || reduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
    setHovered(false);
  }

  return (
    <motion.div
      ref={cardRef}
      variants={{
        hidden: { opacity: 0, y: 32, scale: 0.94, filter: "blur(6px)" },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      className="achievement-card"
      style={{
        rotateX: finePointer && !reduceMotion ? rX : 0,
        rotateY: finePointer && !reduceMotion ? rY : 0,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      onFocus={() => setHovered(true)}
      onBlur={handleLeave}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setTimeout(handleLeave, 600)}
      tabIndex={0}
      whileTap={{ scale: 0.97 }}
    >
      <IconBadge
        icon={stat.icon}
        lottieSrc={stat.lottieSrc}
        ringColor={ringColor}
        active={hovered}
      />

      <motion.div
        className="achievement-value"
        animate={finished ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <Counter
          target={stat.value}
          suffix={stat.suffix}
          onDone={() => setFinished(true)}
        />
      </motion.div>

      <span className="achievement-divider" style={{ background: ringColor }} />

      <div className="achievement-label font-xolonium">{stat.label}</div>
    </motion.div>
  );
}

/* ------------------------------ ambient backdrop ------------------------------ */

function AmbientBackdrop() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="ach-ambient" aria-hidden="true">
      <div className="ach-grid" />
      <motion.div
        className="ach-blob ach-blob-a"
        animate={reduceMotion ? {} : { x: [0, 30, -15, 0], y: [0, -20, 15, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="ach-blob ach-blob-b"
        animate={reduceMotion ? {} : { x: [0, -25, 20, 0], y: [0, 20, -10, 0] }}
        transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* --------------------------------- section -------------------------------- */

export default function AchievementsSection() {
  const [stats, setStats] = useState<StatItem[]>(defaultStats);

  useEffect(() => {
    fetch(`${API_BASE}/achievements`)
      .then((r) => r.json())
      .then((json) => {
        const data: any[] = json?.data ?? json;
        if (Array.isArray(data) && data.length > 0) {
          setStats(
            data.slice(0, 5).map((item: any, i: number) => ({
              id: item.id,
              label:
                item.label ??
                item.title ??
                defaultStats[i]?.label ??
                "Achievement",
              value: parseInt(
                item.value ?? item.count ?? defaultStats[i]?.value ?? "0",
                10,
              ),
              suffix: item.suffix ?? "+",
              icon: defaultStats[i]?.icon ?? Award,
              accent: defaultStats[i]?.accent ?? "sage",
            })),
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="ach-section">
      <AmbientBackdrop />

      <div className="ach-container">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="ach-header"
        >
          <div className="ach-eyebrow font-xolonium">
            <span className="ach-rule" />
            <span>By The Numbers</span>
            <span className="ach-rule" />
          </div>
          <h2 className="ach-heading">
            A Legacy Built on{" "}
            <span className="ach-heading-accent">Results</span>
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
          }}
          className="achievements-grid"
        >
          {stats.map((s, i) => (
            <StatCard key={s.label + i} stat={s} />
          ))}
        </motion.div>
      </div>

      <style>{`
        .ach-section {
          position: relative;
          background: linear-gradient(135deg, ${palette.sageDeep} 0%, ${palette.sageMid} 45%, ${palette.sageLight} 100%);
          padding: clamp(64px, 10vw, 110px) 0;
          overflow: hidden;
        }

        .ach-ambient { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .ach-grid {
          position: absolute;
          inset: 0;
          opacity: 0.07;
          background-image: radial-gradient(circle, #fff 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .ach-blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.5; }
        .ach-blob-a {
          width: 560px; height: 560px; top: -22%; right: -12%;
          background: radial-gradient(circle, rgba(255,255,255,0.16), transparent 70%);
        }
        .ach-blob-b {
          width: 420px; height: 420px; bottom: -18%; left: -10%;
          background: radial-gradient(circle, ${palette.brass}33, transparent 70%);
        }

        .ach-container {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .ach-header { text-align: center; margin-bottom: clamp(52px, 7vw, 76px); }
        .ach-eyebrow {
          display: flex; align-items: center; justify-content: center; gap: 14px;
          color: rgba(255,255,255,0.85);
          font-size: 12px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
          margin-bottom: 18px;
        }
        .ach-rule { width: 28px; height: 1px; background: ${palette.brass}; opacity: 0.8; }
        .ach-heading {
          font-family: 'Venus Rising';
          font-size: clamp(22px, 4.2vw, 36px);
          color: #fff; margin: 0; line-height: 1.12; font-weight: 600;
        }
        .ach-heading-accent { font-style: italic; color: ${palette.brass}; }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 22px;
        }

        .achievement-card {
          position: relative;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 20px;
          padding: 34px 22px;
          text-align: center;
          transform-style: preserve-3d;
          perspective: 900px;
          outline: none;
          cursor: default;
          transition: background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
          box-shadow: 0 16px 36px -22px rgba(0,0,0,0.3);
        }
        .achievement-card:hover,
        .achievement-card:focus-visible {
          background: rgba(255,255,255,0.16);
          border-color: rgba(255,255,255,0.32);
          box-shadow: 0 26px 56px -18px rgba(0,0,0,0.4);
        }

        .stat-badge {
          position: relative;
          width: 58px; height: 58px;
          margin: 0 auto 18px;
          display: flex; align-items: center; justify-content: center;
        }
        .stat-ring {
          position: absolute; inset: 0; border-radius: 50%;
          background: conic-gradient(from 0deg, var(--ring-color), transparent 65%, var(--ring-color));
          opacity: 0.6;
          animation: ach-spin 14s linear infinite;
        }
        .stat-badge-inner {
          position: relative;
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(255,255,255,0.16);
          display: flex; align-items: center; justify-content: center;
        }

        .achievement-value {
          font-family: 'Venus Rising';
          font-size: clamp(14px, 3.6vw, 30px);
          font-weight: 800;
          color: #fff;
          line-height: 1;
        }
        .achievement-divider {
          display: block;
          width: 28px; height: 2px;
          margin: 14px auto 12px;
          border-radius: 2px;
          opacity: 0.7;
        }
        .achievement-label {
          font-size: 13px;
          color: rgba(255,255,255,0.8);
          font-weight: 500;
          letter-spacing: 0.05em;
        }

        @keyframes ach-spin { to { transform: rotate(360deg); } }

        @media (prefers-reduced-motion: reduce) {
          .stat-ring { animation: none; }
          .ach-blob { display: none; }
        }

        @media (max-width: 1023px) {
          .achievements-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
          .achievement-card { padding: 28px 18px; }
        }

        @media (max-width: 640px) {
          .achievements-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
          .achievement-card { padding: 24px 14px; border-radius: 16px; }
          .achievement-card:last-child { grid-column: 1 / -1; max-width: 220px; margin: 0 auto; }
          .ach-blob-a, .ach-blob-b { width: 280px; height: 280px; filter: blur(60px); }
        }
      `}</style>
    </section>
  );
}
