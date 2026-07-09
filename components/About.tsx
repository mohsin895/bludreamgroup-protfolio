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
                    style={{ display: "inline-block" }}
                >
                    {ch}
                </motion.span>
            ))}
        </>
    );
}
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
        padding: "60px 20px",
      }}
      className="relative overflow-hidden bg-[#F8F9FA] py-20 sm:py-28"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-16 px-5 sm:px-8 lg:grid-cols-2">
        {/* ── Left: portrait ── */}


          <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative group"   // 👈 added group here (portrait-frame)
          >
              {/* corner accents unchanged */}
              <span
                  aria-hidden
                  style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      width: '50px',
                      height: '50px',
                      borderTop: '2px solid rgb(108, 126, 127)',
                      borderRight: '2px solid rgb(108, 126, 127)',
                      borderRadius: '0 var(--r-md) 0 0',
                      zIndex: 2,
                  }}
              />

              <div className="relative aspect-[4/5] w-full overflow-hidden border border-black bg-neutral-900">
                  <Image
                      src={`${IMG_BASE}${about?.logo}`}
                      alt={about?.about_title || ""}
                      fill
                      sizes="(max-width:1024px) 90vw,40vw"
                      className="object-cover grayscale transition-transform duration-500 ease-out group-hover:scale-[1.08]"
                      // 👆 zoom on hover of the group (portrait-frame)
                  />
              </div>

              <span
                  aria-hidden
                  style={{
                      position: 'absolute',
                      bottom: '16px',
                      left: '16px',
                      width: '50px',
                      height: '50px',
                      borderBottom: `2px solid ${LIME}`, // or '#d4ff00'
                      borderLeft: `2px solid ${LIME}`,   // or '#d4ff00'
                      borderRadius: '0 0 0 var(--r-md)',
                      zIndex: 2,
                  }}
              />
          </motion.div>


        {/* ── Right: content ── */}
        <div className="relative">
          {/* ghost number */}



            <motion.h2
                initial="hidden"
                whileInView="show"
                className="mb-3 flex font-xolonium items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em]"
                viewport={{ once: true }}
                variants={headingContainer}

            >
                <FallChars text="Who I Am" />

            </motion.h2>
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
            custom={1}
            className="font-rising relative mb-6 text-4xl mt-[20px] leading-[0.95] text-black sm:text-5xl"
            style={{

                marginTop: "15px",
            }}
          >
            ABOUT <span style={{ color: LIME }}>ME</span>
          </motion.h2>

          <h2
            className="font-rising"
            style={{
              fontSize: "clamp(22px,4vw,36px)",
              color: "#000",
              marginTop: "15px",
                marginBottom: "15px",
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
                className="mb-[30px] max-w-xl pb-10 mb-[10px] text-justify font-xolonium text-[18px] font-normal leading-[37px] text-black"
            >
                Hello, I&apos;m K.S.M. Shopnill Chowdhury Shohag— a{" "}
                <span className="font-semibold text-black">
    multifaceted
  </span>{" "}
                Bangladeshi entrepreneur, software engineer, and author recognized for his
                significant contributions to the garment industry and social development. As
                the founder and Managing Director of Blue Dream Group, he has established a
                prominent footprint in apparel manufacturing. Beyond his business ventures,
                he demonstrates a profound commitment to humanitarian efforts as the chair of
                the Asian Life Foundation. A passionate mentor, he actively guides aspiring
                entrepreneurs and shares his professional insights through published books on
                business success. His work seamlessly bridges the gap between technical
                expertise, industrial leadership, and a dedicated spirit of community service.
            </motion.p>

          {/* Info list */}
          {/*<motion.div*/}
          {/*  variants={stagger}*/}
          {/*  style={{*/}
          {/*    display: "flex",*/}
          {/*    flexDirection: "column",*/}
          {/*    gap: 16,*/}
          {/*    marginBottom: 40,*/}
          {/*    marginTop: "15px",*/}
          {/*  }}*/}
          {/*>*/}
          {/*  {qualities.map((q) => (*/}
          {/*    <motion.div*/}
          {/*      key={q.title}*/}
          {/*      variants={fadeUp}*/}
          {/*      style={{*/}
          {/*        display: "flex",*/}
          {/*        alignItems: "flex-start",*/}
          {/*        gap: 16,*/}
          {/*        padding: "16px 20px",*/}
          {/*        background: "#ffffff",*/}
          {/*        borderRadius: 12,*/}
          {/*        border: "1px solid #e5e7eb",*/}
          {/*        transition: "border-color 0.2s, transform 0.2s",*/}
          {/*      }}*/}
          {/*      className="about-quality-card"*/}
          {/*    >*/}
          {/*      <div*/}
          {/*        style={{*/}
          {/*          width: 40,*/}
          {/*          height: 40,*/}
          {/*          flexShrink: 0,*/}
          {/*          background: "#6c7e7f15",*/}
          {/*          borderRadius: 10,*/}
          {/*          display: "flex",*/}
          {/*          alignItems: "center",*/}
          {/*          justifyContent: "center",*/}
          {/*        }}*/}
          {/*      >*/}
          {/*        <q.icon size={20} color="#95a49a" />*/}
          {/*      </div>*/}
          {/*      <div>*/}
          {/*        <div*/}
          {/*          className="font-rising"*/}
          {/*          style={{*/}
          {/*            fontSize: 12,*/}
          {/*            fontWeight: 500,*/}
          {/*            color: "#1f2937",*/}
          {/*            marginBottom: 2,*/}
          {/*          }}*/}
          {/*        >*/}
          {/*          {q.title}*/}
          {/*        </div>*/}
          {/*        <div*/}
          {/*          className="font-xolonium"*/}
          {/*          style={{*/}
          {/*            fontSize: 13,*/}
          {/*            color: "#6b7280",*/}
          {/*            lineHeight: 1.6,*/}
          {/*          }}*/}
          {/*        >*/}
          {/*          {q.desc}*/}
          {/*        </div>*/}
          {/*      </div>*/}
          {/*    </motion.div>*/}
          {/*  ))}*/}
          {/*</motion.div>*/}

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
                  marginTop:'15px',
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
