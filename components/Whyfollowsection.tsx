"use client";

import { motion } from "framer-motion";
import {
  BookMarked,
  Brain,
  Briefcase,
  Flame,
  Handshake,
  TrendingUp,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

const reasons = [
  {
    icon: Flame,
    title: "Motivation That Moves",
    desc: "Not just inspiration — actionable fuel to help you take your next step with confidence and clarity.",
    color: "#6c7e7f",
  },
  {
    icon: TrendingUp,
    title: "Leadership Thinking",
    desc: "Develop the mindset, habits, and frameworks that separate great leaders from the rest.",
    color: "#95a49a",
  },
  {
    icon: Briefcase,
    title: "Business Intelligence",
    desc: "Real business strategies drawn from hands-on entrepreneurship and years of market experience.",
    color: "#6c7e7f",
  },
  {
    icon: Brain,
    title: "Psychology of Success",
    desc: "Understand the mental models behind achievement, resilience, and peak performance.",
    color: "#95a49a",
  },
  {
    icon: BookMarked,
    title: "Knowledge-Rich Books",
    desc: "Each book is a complete transformation toolkit — packed with frameworks, stories, and insights.",
    color: "#6c7e7f",
  },
  {
    icon: Handshake,
    title: "Personal Mentorship",
    desc: "Direct guidance tailored to your life, career, and business goals through one-on-one sessions.",
    color: "#95a49a",
  },
];

export default function WhyFollowSection() {
  return (
    <section style={{ background: "#ffffff", padding: "100px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <motion.span
            variants={fadeUp}
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
            Why Follow This Brand
          </motion.span>
          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(34px, 4vw, 54px)",
              color: "#1f2937",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            What You Get When You{" "}
            <span style={{ color: "#6c7e7f", fontStyle: "italic" }}>
              Follow Along
            </span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            style={{
              fontSize: 16,
              color: "#6b7280",
              maxWidth: 540,
              margin: "20px auto 0",
              lineHeight: 1.75,
            }}
          >
            Every resource, book, and session is designed to give you one thing
            — a measurable step forward in your life and career.
          </motion.p>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="why-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              variants={fadeUp}
              className="why-card"
              style={{
                background: "#f8f9fa",
                border: "1px solid #e5e7eb",
                borderRadius: 16,
                padding: "32px 28px",
                cursor: "default",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Accent corner */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 80,
                  height: 80,
                  background: `linear-gradient(135deg, transparent 50%, ${r.color}10 50%)`,
                }}
              />

              {/* Icon */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  background: `${r.color}18`,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                  transition: "all 0.3s ease",
                }}
                className="why-icon"
              >
                <r.icon size={24} color={r.color} />
              </div>

              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#1f2937",
                  marginBottom: 10,
                  lineHeight: 1.2,
                }}
              >
                {r.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "#6b7280",
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                {r.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        .why-card:hover {
          background: #6c7e7f !important;
          border-color: #6c7e7f !important;
          transform: translateY(-6px);
          box-shadow: 0 20px 48px rgba(108,126,127,0.25);
        }
        .why-card:hover h3, .why-card:hover p {
          color: rgba(255,255,255,0.9) !important;
        }
        .why-card:hover .why-icon {
          background: rgba(255,255,255,0.2) !important;
        }
        @media (max-width: 900px) {
          .why-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .why-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
