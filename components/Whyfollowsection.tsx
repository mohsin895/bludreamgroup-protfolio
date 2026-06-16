"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
// import { useLottie } from "lottie-react";
import { useLottie } from "lottie-react";
import {
  BookMarked,
  Brain,
  Briefcase,
  Flame,
  Handshake,
  TrendingUp,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type MouseEvent,
} from "react";

/* ----------------------------- design tokens ---------------------------- */

const palette = {
  bg: "#FAF7F2",
  bgSoft: "#F3EFE7",
  ink: "#16181A",
  inkSoft: "#5B6164",
  sage: "#52666A",
  sageLight: "#92A39C",
  brass: "#B08D57",
  brassSoft: "#D9C293",
  hairline: "#E4DED2",
};

/* -------------------------------- motion --------------------------------- */

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

/* -------------------------------- content --------------------------------- */

interface Reason {
  icon: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  title: string;
  desc: string;
  accent: "sage" | "brass";
  lottieSrc?: string; // e.g. "/lottie/flame.json" — optional, see header comment
}

const reasons: Reason[] = [
  {
    icon: Flame,
    title: "Motivation That Moves",
    desc: "Not just inspiration — actionable fuel to help you take your next step with confidence and clarity.",
    accent: "brass",
  },
  {
    icon: TrendingUp,
    title: "Leadership Thinking",
    desc: "Develop the mindset, habits, and frameworks that separate great leaders from the rest.",
    accent: "sage",
  },
  {
    icon: Briefcase,
    title: "Business Intelligence",
    desc: "Real business strategies drawn from hands-on entrepreneurship and years of market experience.",
    accent: "brass",
  },
  {
    icon: Brain,
    title: "Psychology of Success",
    desc: "Understand the mental models behind achievement, resilience, and peak performance.",
    accent: "sage",
  },
  {
    icon: BookMarked,
    title: "Knowledge-Rich Books",
    desc: "Each book is a complete transformation toolkit — packed with frameworks, stories, and insights.",
    accent: "brass",
  },
  {
    icon: Handshake,
    title: "Personal Mentorship",
    desc: "Direct guidance tailored to your life, career, and business goals through one-on-one sessions.",
    accent: "sage",
  },
];

/* ---------------------------- lottie sub-player ---------------------------- */
/* Only mounted once real animation JSON has loaded, so the hook is always
   called the same way (no conditional-hook violations). */

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

  return <div style={{ width: 30, height: 30 }}>{View}</div>;
}

/* -------------------------------- icon badge -------------------------------- */

function IconBadge({
  icon: Icon,
  lottieSrc,
  accentColor,
  active,
}: {
  icon: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  lottieSrc?: string;
  accentColor: string;
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
      .catch(() => {
        /* silently keep Lucide fallback */
      });
    return () => {
      cancelled = true;
    };
  }, [lottieSrc]);

  return (
    <div className="reason-badge">
      <div
        className="reason-ring"
        style={{ "--ring-color": accentColor } as CSSProperties}
      />
      <div className="reason-badge-inner">
        {animationData ? (
          <LottiePlayer animationData={animationData} active={active} />
        ) : (
          <Icon size={24} color={accentColor} strokeWidth={1.6} />
        )}
      </div>
    </div>
  );
}

/* --------------------------------- card --------------------------------- */

function ReasonCard({ reason }: { reason: Reason }) {
  const [hovered, setHovered] = useState(false);
  const [finePointer, setFinePointer] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setFinePointer(window.matchMedia("(pointer: fine)").matches);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-60, 60], [7, -7]);
  const rotateY = useTransform(x, [-60, 60], [-7, 7]);
  const springConfig = { stiffness: 160, damping: 18, mass: 0.4 };
  const rX = useSpring(rotateX, springConfig);
  const rY = useSpring(rotateY, springConfig);

  const accentColor = reason.accent === "brass" ? palette.brass : palette.sage;

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
      variants={fadeUp}
      className="reason-card"
      style={
        {
          rotateX: finePointer && !reduceMotion ? rX : 0,
          rotateY: finePointer && !reduceMotion ? rY : 0,
          "--accent": accentColor,
        } as CSSProperties
      }
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      onFocus={() => setHovered(true)}
      onBlur={handleLeave}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setTimeout(handleLeave, 600)}
      tabIndex={0}
      whileTap={{ scale: 0.98 }}
    >
      <span className="reason-border" />

      <IconBadge
        icon={reason.icon}
        lottieSrc={reason.lottieSrc}
        accentColor={accentColor}
        active={hovered}
      />

      <h3 className="reason-title">{reason.title}</h3>
      <p className="reason-desc font-xolonium">{reason.desc}</p>

      <AnimatePresence>
        {hovered && (
          <motion.span
            className="reason-glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------ ambient backdrop ------------------------------ */

function AmbientBackdrop() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="why-ambient" aria-hidden="true">
      <motion.div
        className="why-blob why-blob-a"
        animate={reduceMotion ? {} : { x: [0, 40, -20, 0], y: [0, -30, 10, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="why-blob why-blob-b"
        animate={reduceMotion ? {} : { x: [0, -30, 20, 0], y: [0, 20, -25, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* --------------------------------- section -------------------------------- */

export default function WhyFollowSection() {
  return (
    <section className="why-section">
      <AmbientBackdrop />

      <div className="why-container">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="why-header"
        >
          <motion.div variants={fadeUp} className="why-eyebrow font-xolonium">
            <span className="why-rule " />
            <span>Why Follow This Brand</span>
            <span className="why-rule" />
          </motion.div>

          <motion.h2 variants={fadeUp} className="why-heading">
            What You Get When You{" "}
            <span className="why-heading-accent">Follow Along</span>
          </motion.h2>

          <motion.p variants={fadeUp} className="why-subhead font-xolonium">
            Every resource, book, and session is designed to give you one thing
            — a measurable step forward in your life and career.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="why-grid"
        >
          {reasons.map((reason) => (
            <ReasonCard key={reason.title} reason={reason} />
          ))}
        </motion.div>
      </div>

      <style>{`
        .why-section {
          position: relative;
          background: ${palette.bg};
          padding: clamp(64px, 10vw, 120px) 0;
          overflow: hidden;
        }

        .why-ambient {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .why-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.35;
        }
        .why-blob-a {
          width: 420px;
          height: 420px;
          top: -120px;
          left: -100px;
          background: radial-gradient(circle, ${palette.sageLight}, transparent 70%);
        }
        .why-blob-b {
          width: 380px;
          height: 380px;
          bottom: -140px;
          right: -100px;
          background: radial-gradient(circle, ${palette.brassSoft}, transparent 70%);
        }

        .why-container {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .why-header {
          text-align: center;
          margin-bottom: clamp(48px, 6vw, 72px);
        }
        .why-eyebrow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          color: ${palette.brass};
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .why-rule {
          width: 28px;
          height: 1px;
          background: ${palette.brass};
          opacity: 0.6;
        }
        .why-heading {
          font-family: 'Venus Rising';
          font-size: clamp(22px, 4.2vw, 32px);
          color: ${palette.ink};
          margin: 0;
          line-height: 1.12;
          font-weight: 600;
        }
        .why-heading-accent {
          font-style: italic;
          background: linear-gradient(100deg, ${palette.sage}, ${palette.brass});
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .why-subhead {
          font-size: 16px;
          color: ${palette.inkSoft};
          max-width: 540px;
          margin: 20px auto 0;
          line-height: 1.75;
        }

        .why-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .reason-card {
          position: relative;
          background: linear-gradient(165deg, rgba(255,255,255,0.78), rgba(255,255,255,0.45));
          backdrop-filter: blur(14px);
          border-radius: 20px;
          padding: 36px 30px;
          transform-style: preserve-3d;
          perspective: 900px;
          cursor: default;
          outline: none;
          box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset, 0 18px 40px -24px rgba(22,24,26,0.18);
          transition: box-shadow 0.4s ease;
        }
        .reason-card:hover,
        .reason-card:focus-visible {
          box-shadow: 0 1px 0 rgba(255,255,255,0.7) inset, 0 28px 60px -20px rgba(22,24,26,0.28);
        }

        .reason-border {
          position: absolute;
          inset: 0;
          border-radius: 20px;
          padding: 1px;
          background: linear-gradient(140deg, ${palette.hairline}, transparent 40%, ${palette.hairline});
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          transition: background 0.4s ease;
        }
        .reason-card:hover .reason-border {
          background: linear-gradient(140deg, var(--accent), transparent 45%, var(--accent));
          opacity: 0.55;
        }

        .reason-glow {
          position: absolute;
          inset: -1px;
          border-radius: 20px;
          background: radial-gradient(120px 90px at 30% 0%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 70%);
          pointer-events: none;
        }

        .reason-badge {
          position: relative;
          width: 60px;
          height: 60px;
          margin-bottom: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .reason-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: conic-gradient(from 0deg, var(--ring-color), transparent 65%, var(--ring-color));
          opacity: 0.55;
          animation: why-spin 14s linear infinite;
        }
        .reason-badge-inner {
          position: relative;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: ${palette.bg};
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(22,24,26,0.08);
        }

        .reason-title {
          font-family: 'Venus Rising';
          font-size: 18px;
          font-weight: 500;
          color: ${palette.ink};
          margin-bottom: 10px;
          line-height: 1.2;
        }
        .reason-desc {
          font-size: 14px;
          color: ${palette.inkSoft};
          line-height: 1.75;
          margin: 0;
        }

        @keyframes why-spin {
          to { transform: rotate(360deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .reason-ring { animation: none; }
          .why-blob { display: none; }
        }

        @media (max-width: 1024px) {
          .why-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .reason-card { padding: 30px 24px; }
        }

        @media (max-width: 640px) {
          .why-grid { grid-template-columns: 1fr; gap: 18px; }
          .why-eyebrow { font-size: 11px; gap: 10px; }
          .reason-card { padding: 26px 22px; border-radius: 18px; }
          .why-blob-a, .why-blob-b { width: 240px; height: 240px; filter: blur(50px); }
        }
      `}</style>
    </section>
  );
}
