"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const LIME = "#6C7E7F";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const IMG_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "";

interface HeroImage {
  original: string;
  small: string;
  medium: string;
  large: string;
}

interface HeroData {
  id: number;
  title: string;
  sub_title: string;
  image: string;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

export default function Hero() {
  const [hero, setHero] = useState<HeroData | null>(null);

  const image: HeroImage | null = hero?.image ? JSON.parse(hero.image) : null;

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch(`${API_BASE}/sliders`);

        const json = await res.json();

        if (json.status && json.data.length > 0) {
          setHero(json.data[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchHero();
  }, []);

  return (
    <section
      style={{
        padding: "20px 10px",
      }}
      className="relative my-16 overflow-hidden bg-black pt-32 pb-16 sm:pt-40"
    >
      {/* Ambient grid + glow background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(${LIME} 1px, transparent 1px), linear-gradient(90deg, ${LIME} 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="pointer-events-none absolute -right-40 top-0 h-[560px] w-[560px] rounded-full blur-[120px]"
        style={{ background: `${LIME}22` }}
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-5 sm:px-8 lg:grid-cols-2">
        {/* ── Left: copy ── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10"
        >
          {/* Name with ghost depth text */}
          <div className="relative mb-6">
            <motion.h1 variants={item} className="hero-title">
              {hero?.title}
            </motion.h1>
          </div>

          <motion.p variants={item} className="hero-subtitle">
            {hero?.sub_title}
          </motion.p>

          {/* <motion.div variants={item} className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 rounded-md px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-black transition-transform hover:-translate-y-0.5"
              style={{ background: LIME }}
            >
              <Briefcase size={16} />
              My Portfolio
            </Link>
            <Link
              href="/resume.pdf"
              className="inline-flex items-center gap-2 rounded-md border px-6 py-3.5 text-sm font-bold uppercase tracking-wider transition-colors hover:bg-white/5"
              style={{ borderColor: LIME, color: LIME }}
            >
              <Download size={16} />
              Hire Me
            </Link>
          </motion.div> */}
        </motion.div>

        {/* ── Right: portrait + floating tech badges ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto aspect-[4/5] w-full max-w-md lg:max-w-lg"
        >
          {/* radial glow behind portrait */}
          <div className="hero-person-glow" />

          <div className="relative h-full w-full ">
            {/* Replace src with the real portrait image in /public */}
            {image && (
              <Image
                src={`${IMG_BASE}${image.large || image.original}`}
                alt={hero?.title || ""}
                fill
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover grayscale z-10"
              />
            )}
          </div>
        </motion.div>
      </div>
      <style>{`
      
.hero-person-glow {
    position: absolute;
    width: 95%;
    height: 320px;
    background: #d4ff00;
    border-radius: 50%;
    filter: blur(120px);
    opacity: 0.8;
    z-index: 1;
    animation: glowMove 5s ease-in-out infinite alternate;
}
    .hero-title {
  font-family: "Rising", sans-serif;
  font-size: 120px;
  line-height: 0.9;
  color: #fff;
}

.hero-subtitle {
  max-width: 32rem;
  font-family: "Xolonium", sans-serif;
  font-size: 16px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.6);
}

/* Large Desktop */
@media (max-width: 1400px) {
  .hero-title {
    font-size: 80px;
  }
}

/* Laptop */
@media (max-width: 1200px) {
  .hero-title {
    font-size: 80px;
  }
    .hero-subtitle {
    font-size: 15px;
    margin-top: 20px;
  }
}

/* Tablet */
@media (max-width: 992px) {
  .hero-title {
    font-size: 64px;
    margin-top: 80px;
   
  }

  .hero-subtitle {
    font-size: 15px;
    margin-top: 20px
  }
}

/* Mobile */
@media (max-width: 768px) {
  .hero-title {
    font-size: 48px;
  }

  .hero-subtitle {
    font-size: 14px;
    max-width: 100%;
  }
}

/* Small Mobile */
@media (max-width: 576px) {
  .hero-title {
    font-size: 36px;
  }

  .hero-subtitle {
    font-size: 13px;
  }
}

/* Extra Small Mobile */
@media (max-width: 400px) {
  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 12px;
  }
}
      `}</style>
    </section>
  );
}
