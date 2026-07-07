"use client";

import { motion } from "framer-motion";
import { Heart, Lightbulb, Target } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface AboutData {
  id: number;
  name: string;
  quote: string;
  page_title: string;
  about_title: string;
  logo: string;
  resume: string;
  description: string;
}

const LIME = "#6C7E7F";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const IMG_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "";

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
export default function AboutMe() {
  const [about, setAbout] = useState<AboutData | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/about`)
      .then((res) => res.json())
      .then((json) => {
        if (json.status) {
          setAbout(json.data);
        }
      })
      .catch(console.error);
  }, []);
  return (
    <section
      style={{
        padding: "40px 10px",
      }}
      className="relative overflow-hidden bg-[#fff] py-20 sm:py-28"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-16 px-5 sm:px-8 lg:grid-cols-2">
        {/* ── Left: portrait ── */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* corner accent */}
          <span
            aria-hidden
            className="absolute -top-4 right-6 h-10 w-10 border-r-2 border-t-2"
            style={{ borderColor: LIME }}
          />

          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-black bg-neutral-900">
            {/* Replace src with the real photo in /public */}
            <Image
              src={`${IMG_BASE}${about?.logo}`}
              alt={about?.about_title || ""}
              fill
              sizes="(max-width:1024px) 90vw,40vw"
              className="object-cover grayscale"
            />
          </div>

          <span
            aria-hidden
            className="absolute -bottom-4 left-6 h-10 w-10 border-b-2 border-l-2"
            style={{ borderColor: LIME }}
          />
        </motion.div>

        {/* ── Right: content ── */}
        <div className="relative">
          {/* ghost number */}

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            className="mb-3 flex font-xolonium items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em]"
            style={{ color: LIME }}
          >
            <span
              className="h-px w-8 font-xolonium"
              style={{ background: LIME }}
            />
            Who I Am
          </motion.div>

          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            custom={1}
            className="font-rising relative mb-6 text-4xl leading-[0.95] text-black sm:text-5xl"
          >
            ABOUT <span style={{ color: LIME }}>ME</span>
          </motion.h2>

          <h2
            className="font-rising"
            style={{
              fontSize: "clamp(22px,4vw,36px)",
              color: "#000",
              margin: 0,
            }}
          >
            {about?.page_title}
          </h2>

          <motion.p
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            custom={2}
            className="mb-8 font-xolonium max-w-xl text-base leading-relaxed text-black"
          >
            Hello, I&apos;m K.S.M. Shopnill Chowdhury Shohag— a{" "}
            <span className="font-semibold text-black">
              is a multifaceted &amp;
            </span>{" "}
            Bangladeshi entrepreneur, software engineer, and author recognized
            for his significant contributions to the garment industry and social
            development. As the founder and Managing Director of Blue Dream
            Group, he has established a prominent footprint in apparel
            manufacturing. Beyond his business ventures, he demonstrates a
            profound commitment to humanitarian efforts as the chair of the
            Asian Life Foundation. A passionate mentor, he actively guides
            aspiring entrepreneurs and shares his professional insights through
            published books on business success. His work seamlessly bridges the
            gap between technical expertise, industrial leadership, and a
            dedicated spirit of community service.
          </motion.p>

          {/* Info list */}
          <motion.div
            variants={stagger}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              marginBottom: 40,
              marginTop: 20,
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
        </div>
      </div>
    </section>
  );
}
