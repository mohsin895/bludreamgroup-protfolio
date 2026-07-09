"use client";

import { motion } from "framer-motion";
import {
  BookMarked,
  Brain,
  Briefcase,
  Flame,
  Handshake,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

/* ----------------------------- design tokens ---------------------------- */

const palette = {
  bg: "#0A0B0D",
  cardBg: "rgba(255,255,255,0.02)",
  cardBorder: "rgba(255,255,255,0.08)",
  ink: "#F5F6F5",
  inkSoft: "#9CA3A6",
  accent: "#6C7E7F",
};

/* -------------------------------- motion --------------------------------- */

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
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
/* -------------------------------- content --------------------------------- */
/* content ager WhyFollowSection theke i rakha hoyeche, shudhu design change */

interface Reason {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const reasons: Reason[] = [
  {
    icon: Flame,
    title: "Entrepreneurial Expertise",
    desc: "As Managing Director of Blue Dream Group, he shares invaluable insights into building and scaling successful ventures, offering practical advice for navigating the complex world of modern apparel manufacturing.",
  },
  {
    icon: TrendingUp,
    title: "Mentorship for Beginners",
    desc: "He actively mentors young professionals, breaking down complex business strategies into actionable steps. His guidance helps aspiring entrepreneurs overcome early challenges and build strong foundations for their startup journeys.",
  },
  {
    icon: Briefcase,
    title: "Philanthropic Vision",
    desc: "Leading the Asian Life Foundation demonstrates his deep commitment to social welfare. Following him provides a powerful look at how corporate success can actively fund meaningful community development initiatives.",
  },
  {
    icon: Brain,
    title: "Authorship and Resources",
    desc: "As a published author, he distills years of hands-on experience into accessible reading material. Followers gain direct access to his thought leadership, book updates, and proven frameworks for success.",
  },
  {
    icon: BookMarked,
    title: "Tech-Driven Leadership",
    desc: "Utilizing a software engineering background, he provides unique perspectives on integrating technology into traditional industries. He highlights how digital transformation drives efficiency, modernization, and innovation across corporate business landscapes.",
  },
  {
    icon: Handshake,
    title: "Daily Motivation and Mindset",
    desc: "His journey from technical expert to leading industrialist serves as daily motivation. He consistently posts about maintaining a resilient mindset, balancing dedicated hard work with purpose and ongoing personal growth.",
  },
];

/* --------------------------------- card --------------------------------- */

function ReasonCard({ reason }: { reason: Reason }) {
  const Icon = reason.icon;
  return (
    <motion.div variants={fadeUp} className="wf-card" whileHover={{ y: -6 }}>
      <div className="wf-icon-box">
        <Icon size={26} color={"#fff"} strokeWidth={1.6} />
      </div>
        <motion.h2
            initial="hidden"
            whileInView="show"
            className="wf-title"
            viewport={{ once: true }}
            variants={headingContainer}

        >
            <FallChars text={reason.title} />

        </motion.h2>

      <p className="wf-desc">{reason.desc}</p>
    </motion.div>
  );
}

/* --------------------------------- section -------------------------------- */

export default function WhyFollowSection() {
  return (
    <section className="wf-section">
      <div className="wf-container">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="wf-header"
        >


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
                <FallChars text="Why You Should Follow " />
                <FallChars
                    text=" K.S.M. Shopnill Chowdhury Shohag"
                    style={{ color: "#6c7e7f", fontStyle: "italic" }}
                />
            </motion.h2>

            <motion.p
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={wordContainer}
                className="wf-subhead"
            >
                <FallWords text="Follow K.S.M. Shopnill Chowdhury Shohag for daily inspiration on business, philanthropy, and personal growth from a proven industry leader." />
            </motion.p>


        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          className="wf-grid"
        >
          {reasons.map((reason) => (
            <ReasonCard key={reason.title} reason={reason} />
          ))}
        </motion.div>
      </div>

      <style>{`
        .wf-section {
          position: relative;
          background: #FAF7F2;
          padding: clamp(64px, 10vw, 100px) 0;
          overflow: hidden;
        }

        .wf-container {
          position: relative;
          z-index: 1;
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .wf-header {
          text-align: center;
          margin-bottom: clamp(48px, 6vw, 64px);
        }

        .wf-eyebrow {
        font-family:Xolonium,sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: ${palette.accent};
          text-transform: uppercase;
          margin: 0 0 14px;
        }

        .wf-heading {
          font-family: Venus Rising, sans-serif;
          font-weight: 800;
          font-size: clamp(20px, 4.4vw, 32px);
          line-height: 1.15;
          color: #000;
          margin: 0;
        }

        .wf-heading-accent {
        
          font-style: italic;
          color: ${palette.accent};
        }

        .wf-subhead {
        font-family:Xolonium,sans-serif;
          font-size: clamp(15px, 1.6vw, 17px);
          color: #000;
          max-width: 560px;
          margin: 22px auto 0;
          line-height: 1.7;
        }

        .wf-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .wf-card {
          position: relative;
          background: #677A7B;
          border: 1px solid ${palette.cardBorder};
          border-radius: 4px;
          padding: 40px 32px;
          transition: border-color 0.35s ease, background 0.35s ease;
        }

        // .wf-card:hover {
        //   border-color: color-mix(in srgb, ${palette.accent} 55%, transparent);
        //   background: rgba(255,255,255,0.035);
        // }

        .wf-icon-box {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid color-mix(in srgb, #fff 45%, transparent);
          border-radius: 4px;
          margin-bottom: 26px;
        }

        .wf-title {
          font-family: Venus Rising, sans-serif;
          font-weight: 700;
          font-size: 19px;
          color: ${palette.ink};
          margin: 0 0 14px;
          line-height: 1.3;
        }

        .wf-desc {
        font-family:Xolonium,sans-serif;
          font-size: 14.5px;
          color: #fff9;
          line-height: 1.75;
          margin: 0;
        }

        @media (max-width: 1024px) {
          .wf-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .wf-card { padding: 34px 26px; }
        }

        @media (max-width: 640px) {
          .wf-grid { grid-template-columns: 1fr; gap: 18px; }
          .wf-card { padding: 28px 22px; }
        }
      `}</style>
    </section>
  );
}
