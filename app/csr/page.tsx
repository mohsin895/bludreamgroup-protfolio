"use client";

import Footer from "@/components/Footer";
import PageHero from "@/components/HeroPage";
import Navbar from "@/components/Navbar";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type CsrItem = {
  id: number;
  title: string;
  description: string;
  image: string;
  visits?: string | number;
  category?: string;
};

// ── Static fallback data (Google images) ────────────────────────────────────
const staticCsrData: CsrItem[] = [
  {
    id: 1,
    title: "Clean Water Initiative",
    description:
      "Providing safe drinking water access to rural communities across Bangladesh, ensuring health and well-being for thousands of families.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    visits: "12,400",
    category: "Water & Sanitation",
  },
  {
    id: 2,
    title: "Education for All",
    description:
      "Funding scholarships and building classrooms for underprivileged children, creating pathways to a brighter future through quality education.",
    image:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
    visits: "8,200",
    category: "Education",
  },
  {
    id: 3,
    title: "Women Empowerment Program",
    description:
      "Supporting women entrepreneurs with micro-finance and skill development training to build sustainable livelihoods and independence.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
    visits: "6,700",
    category: "Empowerment",
  },
  {
    id: 4,
    title: "Tree Plantation Drive",
    description:
      "Planting thousands of trees across coastal and urban areas to combat climate change and restore natural ecosystems for future generations.",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
    visits: "9,100",
    category: "Environment",
  },
  {
    id: 5,
    title: "Health Camp for the Underprivileged",
    description:
      "Organizing free medical camps offering checkups, medicines, and specialist consultations to remote communities lacking healthcare access.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80",
    visits: "5,300",
    category: "Healthcare",
  },
  {
    id: 6,
    title: "Flood Relief Operations",
    description:
      "Delivering emergency food, clothing, and shelter to flood-affected families during Bangladesh's monsoon season when communities need help most.",
    image:
      "https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=800&q=80",
    visits: "15,800",
    category: "Disaster Relief",
  },
];

// ── Stat counter component ────────────────────────────────────────────────────
function StatCounter({ end, label }: { end: number; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);

  return (
    <div ref={ref} className="text-center">
      <div
        className="md:text-4xl text-xl font-rising font-bold mb-1 "
        style={{ color: "#6c7e7f" }}
      >
        {count.toLocaleString()}+
      </div>
      <div className="text-sm font-xolonium text-gray-500 font-medium uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

// ── CSR Card ──────────────────────────────────────────────────────────────────
function CsrCard({ item, index }: { item: CsrItem; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const imgSrc = item.image.startsWith("http")
    ? item.image
    : `${IMAGE_BASE}${item.image}`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      whileHover={{ y: -6 }}
      className="group font-xolonium bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col"
    >
      {/* Image */}
      <div className="relative w-full h-56 overflow-hidden">
        <Image
          src={imgSrc}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {item.category && (
          <span
            className="absolute top-3 left-3 text-white text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background: "#6c7e7f" }}
          >
            {item.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          padding: "10px",
          marginTop: "5px",
        }}
        className="p-6 flex flex-col flex-1"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-3 group-hover:text-[#6c7e7f] transition-colors duration-200">
          {item.title}
        </h3>
        <p
          style={{ marginTop: "5px" }}
          className="text-gray-500 text-sm leading-relaxed flex-1"
        >
          {item.description}
        </p>

        {item.visits && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-[#6c7e7f]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span
              style={{
                marginBottom: "10px",
              }}
              className="text-sm text-gray-400"
            >
              <span className="font-semibold text-gray-600">{item.visits}</span>{" "}
              people benefited
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CsrPage() {
  const [csrData, setCsrData] = useState<CsrItem[]>(staticCsrData);
  const [loading, setLoading] = useState(true);

  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/csr`);
        if (!res.ok) throw new Error("API not available");
        const data = await res.json();
        if (data?.data?.length) setCsrData(data.data);
      } catch {
        // keep static data
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f9f9f7]">
        {/* ── Hero ── */}
        <PageHero title="Corporate Social Responsibility" currentPage="csr" />

        {/* ── Stats ── */}
        <section
          style={{
            padding: "10px 20px",
          }}
          className="py-16 bg-white border-y border-gray-100"
        >
          <div className="container mx-auto px-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              <StatCounter end={57600} label="Lives Impacted" />
              <StatCounter end={120} label="Projects Done" />
              <StatCounter end={48} label="Districts Covered" />
              <StatCounter end={14} label="Years of Service" />
            </motion.div>
          </div>
        </section>

        {/* ── Section title ── */}
        <section
          style={{
            marginTop: "40px",
          }}
          className="py-16 px-4"
        >
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl  md:text-4xl font-bold text-gray-800 mb-4 font-xolonium">
                Our Initiatives
              </h2>
              <p
                style={{
                  margin: "auto",
                }}
                className="text-gray-400 text-center max-w-xl mx-auto text-base"
              >
                From education to environment — here's a glimpse into the work
                we do and the communities we serve.
              </p>
              <div
                className="w-16 h-1 mx-auto mt-6 rounded-full"
                style={{ background: "#6c7e7f" }}
              />
            </motion.div>

            {/* ── Grid ── */}
            {loading ? (
              <div
                style={{
                  padding: "10px",
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse"
                  >
                    <div className="h-56 bg-gray-200" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-full" />
                      <div className="h-3 bg-gray-100 rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  margin: "30px 0px",
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {csrData.map((item, i) => (
                  <CsrCard key={item.id} item={item} index={i} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-20 px-4 text-center rounded-2xl"
          style={{
            background: "#6c7e7f",
            margin: "15px",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              padding: "20px",
            }}
            className="text-3xl md:text-4xl font-bold text-white mb-4 font-xolonium"
          >
            Want to Join Our Mission?
          </h2>
          <p
            style={{
              margin: "auto",
            }}
            className="text-white/70 max-w-md mx-auto mb-8 text-base"
          >
            Together we can create lasting change. Reach out to collaborate or
            support our ongoing CSR efforts.
          </p>
          <motion.a
            href="/contact"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block bg-white font-semibold px-8 py-3 rounded-full text-base transition-colors"
            style={{ color: "#6c7e7f", margin: "10px", padding: "10px" }}
          >
            Get Involved
          </motion.a>
        </motion.section>
      </main>

      <Footer />
    </>
  );
}
