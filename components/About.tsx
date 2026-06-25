"use client";

import { motion } from "framer-motion";
import { Award, BookOpen, Heart, Lightbulb, Target, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const IMG_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "";

interface AboutData {
  title?: string;
  description?: string;
  logo?: string | null;
  short_bio?: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const values = [
  { icon: BookOpen, label: "30+ Books", sub: "Published & Counting" },
  { icon: Users, label: "50,000+", sub: "Lives Impacted" },
  { icon: Award, label: "200+", sub: "Events Conducted" },
  { icon: Heart, label: "100%", sub: "Passion Driven" },
];

const qualities = [
  {
    icon: Target,
    title: "Mission-Driven",
    desc: "Every book, every session, every word — crafted to help you rise.",
  },
  {
    icon: Lightbulb,
    title: "Practical Wisdom",
    desc: "Real-world insights from genuine experience, not theory alone.",
  },
  {
    icon: Heart,
    title: "People First",
    desc: "Believes every person carries extraordinary untapped potential.",
  },
];

export default function AboutSection() {
  const [about, setAbout] = useState<AboutData | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/about`)
      .then((r) => r.json())
      .then((json) => setAbout(json?.data ?? json))
      .catch(() => {});
  }, []);

  return (
    <section
      style={{
        background: "#f8f9fa",
        paddingTop: "100px",
        paddingBottom: "40px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Section label */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          style={{ textAlign: "center", marginBottom: 34 }}
        >
          <span
            className="font-xolonium"
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
            About The Author
          </span>
          <h2
            className="font-rising"
            style={{
              fontSize: "clamp(22px, 4vw, 36px)",
              color: "#1f2937",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            The Man Behind The{" "}
            <span style={{ color: "#6c7e7f", fontStyle: "italic" }}>
              Vision
            </span>
          </h2>
        </motion.div>

        {/* Two-col layout */}
        <div
          className="about-grid"
          style={{ display: "flex", gap: 64, alignItems: "center" }}
        >
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
            className="about-image-col"
            style={{ flex: "0 0 500px", position: "relative" }}
          >
            <div
              style={{
                width: "100%",
                aspectRatio: "4/5",
                borderRadius: "40% 60% 60% 40% / 40% 40% 60% 60%",
                overflow: "hidden",
                background: "linear-gradient(135deg, #6c7e7f22, #95a49a22)",
                border: "2px solid #6c7e7f1a",
                position: "relative",
              }}
            >
              {about?.logo ? (
                <img
                  src={`${IMG_BASE}${about.logo}`}
                  alt="About"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    inset: 0,
                  }}
                />
              ) : (
                // <img
                //   // src={`${IMG_BASE}${about.image}`}
                //   src="/chairman2.jpeg"
                //   alt="About"
                //   style={{ width: "100%", height: "100%", objectFit: "cover" }}
                // />
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(160deg, #6c7e7f33, #9aa6aa33)",
                  }}
                >
                  <BookOpen
                    size={56}
                    color="#6c7e7f"
                    style={{ opacity: 0.4 }}
                  />
                </div>
              )}
            </div>

            {/* Floating stat card */}
            {/* <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              style={{
                position: "absolute",
                bottom: 30,
                right: -20,
                background: "#ffffff",
                borderRadius: 14,
                padding: "16px 22px",
                boxShadow: "0 16px 48px rgba(108,126,127,0.18)",
                border: "1px solid #6c7e7f1a",
              }}
            >
              <div
                className="font-rising"
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: "#6c7e7f",
                  lineHeight: 1,
                }}
              >
                16+
              </div>
              <div
                className="font-xolonium"
                style={{
                  fontSize: 12,
                  color: "#6b7280",
                  marginTop: 4,
                  fontWeight: 500,
                }}
              >
                Years of Experience
              </div>
            </motion.div> */}
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            style={{ flex: 1 }}
          >
            <motion.div
              variants={fadeUp}
              style={{
                fontSize: "clamp(15px, 1.6vw, 18px)",
                color: "#374151",
                lineHeight: 1.9,
                marginBottom: 24,
              }}
              className="about-description font-xolonium"
              dangerouslySetInnerHTML={{
                __html:
                  about?.description ||
                  `
      <p>
        KSM Shopnill Chowdhury Shohag is a celebrated Bangladeshi author,
        entrepreneur, and life mentor whose writing has inspired thousands.
      </p>
    `,
              }}
            />

            {/* Qualities */}
            <motion.div
              variants={stagger}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                marginBottom: 40,
              }}
            >
              {qualities.map((q) => (
                <motion.div
                  key={q.title}
                  variants={fadeUp}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 16,
                    padding: "16px 20px",
                    background: "#ffffff",
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    transition: "border-color 0.2s, transform 0.2s",
                  }}
                  className="about-quality-card"
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      flexShrink: 0,
                      background: "#6c7e7f15",
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <q.icon size={20} color="#95a49a" />
                  </div>
                  <div>
                    <div
                      className="font-rising"
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: "#1f2937",
                        marginBottom: 2,
                      }}
                    >
                      {q.title}
                    </div>
                    <div
                      className="font-xolonium"
                      style={{
                        fontSize: 13,
                        color: "#6b7280",
                        lineHeight: 1.6,
                      }}
                    >
                      {q.desc}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp}>
              <Link
                href="/about"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#6c7e7f",
                  color: "#ffffff",
                  padding: "14px 28px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  transition: "all 0.25s",
                }}
                className="about-cta font-xolonium"
              >
                Read Full Story →
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .about-cta:hover { background: #5a6b6c !important; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(108,126,127,0.3); }
        .about-quality-card:hover { border-color: #95a49a !important; transform: translateX(4px); }
        .about-stat-card:hover { border-color: #6c7e7f !important; transform: translateY(-4px); box-shadow: 0 12px 32px rgba(108,126,127,0.12); }
        @media (max-width: 900px) {
          .about-grid { flex-direction: column !important; gap: 40px !important; }
          .about-image-col { flex: none !important; width: 100% !important; max-width: 340px; margin: 0 auto; }
          .about-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .about-stats { grid-template-columns: 1fr 1fr !important; }
        }
          .about-description p{
    margin-bottom:16px;
    color:#4b5563;
    font-size:16px;
    line-height:1.9;
  }

  .about-description strong{
    color:#1f2937;
    font-weight:700;
  }

  .about-description h1,
  .about-description h2,
  .about-description h3{
    color:#1f2937;
    margin-bottom:14px;
    margin-top:18px;
  }

  .about-description ul{
    padding-left:20px;
    margin-bottom:16px;
  }

  .about-description li{
    margin-bottom:8px;
  }
      `}</style>
    </section>
  );
}
