"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  Mic,
  Users,
  Video,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

interface Service {
  id: number;
  title: string;
  description?: string;
  short_description?: string;
  icon?: string;
  slug?: string;
  mode?: string;
}

const fallbackServices = [
  {
    id: 1,
    title: "Entrepreneurial Expertise ",
    icon: "Users",
    desc: "As Managing Director of Blue Dream Group, he shares invaluable insights into building and scaling successful ventures, offering practical advice for navigating the complex world of modern apparel manufacturing.",
    mode: "Online / Offline",
  },
  {
    id: 2,
    title: "Mentorship for Beginners",
    icon: "Mic",
    desc: "He actively mentors young professionals, breaking down complex business strategies into actionable steps. His guidance helps aspiring entrepreneurs overcome early challenges and build strong foundations for their startup journeys.",
    mode: "On-site",
  },
  {
    id: 3,
    title: "Philanthropic Vision",
    icon: "Briefcase",
    desc: "Leading the Asian Life Foundation demonstrates his deep commitment to social welfare. Following him provides a powerful look at how corporate success can actively fund meaningful community development initiatives.",
    mode: "Online",
  },
  {
    id: 4,
    title: "Authorship and Resources ",
    icon: "Zap",
    desc: "As a published author, he distills years of hands-on experience into accessible reading material. Followers gain direct access to his thought leadership, book updates, and proven frameworks for success.",
    mode: "On-site / Online",
  },
  {
    id: 5,
    title: "Tech-Driven Leadership ",
    icon: "Calendar",
    desc: "Utilizing a software engineering background, he provides unique perspectives on integrating technology into traditional industries. He highlights how digital transformation drives efficiency, modernization, and innovation across corporate business landscapes.",
    mode: "On-site",
  },
  {
    id: 6,
    title: "Daily Motivation and Mindset ",
    icon: "Video",
    desc: "His journey from technical expert to leading industrialist serves as daily motivation. He consistently posts about maintaining a resilient mindset, balancing dedicated hard work with purpose and ongoing personal growth.",
    mode: "Online",
  },
];

const iconMap: Record<
  string,
  React.ComponentType<{ size?: number; color?: string }>
> = {
  Users,
  Mic,
  Briefcase,
  Zap,
  Calendar,
  Video,
};

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
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/services`)
      .then((r) => r.json())
      .then((json) => {
        const data = json?.data ?? json;
        if (Array.isArray(data) && data.length > 0)
          setServices(data.slice(0, 6));
        else setServices([]);
      })
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  const displayServices =
    services.length > 0
      ? services
      : fallbackServices.map((s) => ({
          id: s.id,
          title: s.title,
          short_description: s.desc,
          slug: s.title.toLowerCase().replace(/\s+/g, "-"),
          icon: s.icon,
        }));

  return (
    <section
      style={{
        background: "linear-gradient(180deg, #f8f9fa 0%, #eef2f2 100%)",
        padding: "100px 0",
      }}
    >
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
            Services
          </motion.span>
          <motion.h2
            variants={fadeUp}
            style={{
              fontFamily: "Venus Rising",
              fontSize: "clamp(24px, 4vw, 34px)",
              color: "#1f2937",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Why You Should Follow <br />
            <span style={{ color: "#6c7e7f", fontStyle: "italic" }}>
              K.S.M. Shopnill Chowdhury Shohag
            </span>
          </motion.h2>
          <motion.p
            className="font-xolonium"
            variants={fadeUp}
            style={{
              fontSize: 16,
              color: "#6b7280",
              maxWidth: 680,
              margin: "20px auto 0",
              lineHeight: 1.75,
            }}
          >
            Follow K.S.M. Shopnill Chowdhury Shohag for daily inspiration on
            business, philanthropy, and personal growth from a proven industry
            leader.
          </motion.p>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="services-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {displayServices.map((s, i) => {
            const fb = fallbackServices[i];
            const IconComp =
              iconMap[s.icon ?? fb?.icon ?? "Briefcase"] ?? Briefcase;
            const mode = (s as any).mode ?? fb?.mode ?? "Online";

            return (
              <motion.div
                key={s.id}
                variants={fadeUp}
                className="service-card"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 16,
                  padding: "32px 28px",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                  cursor: "default",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Top accent line */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: "linear-gradient(90deg, #6c7e7f, #95a49a)",
                    opacity: 0,
                    transition: "opacity 0.3s",
                  }}
                  className="service-top-line"
                />

                {/* Icon */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    background: "#6c7e7f15",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <IconComp size={24} color="#6c7e7f" />
                </div>

                <h3
                  style={{
                    fontFamily: "Venus Rising",
                    fontSize: 16,
                    fontWeight: 500,
                    color: "#1f2937",
                    marginBottom: 10,
                    lineHeight: 1.2,
                  }}
                >
                  {s.title}
                </h3>

                <p
                  className="font-xolonium"
                  style={{
                    fontSize: 14,
                    color: "#6b7280",
                    lineHeight: 1.75,
                    flex: 1,
                    marginBottom: 20,
                  }}
                >
                  {(s as any).short_description ??
                    (s as any).description ??
                    "Tailored sessions designed to accelerate your personal and professional growth."}
                </p>

                {/* Mode badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "end",
                  }}
                >
                  <span
                    className="font-xolonium"
                    style={{
                      fontSize: 11,
                      color: "#9aa6aa",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {mode}
                  </span>
                  {/* <Link
                    href={`/services${s.slug ? `/${s.slug}` : ""}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#6c7e7f",
                      textDecoration: "none",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    Learn More <ArrowRight size={12} />
                  </Link> */}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ textAlign: "center", marginTop: 56 }}
        >
          <Link
            href="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#6c7e7f",
              color: "#ffffff",
              padding: "14px 32px",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "all 0.25s",
            }}
            className="services-cta font-xolonium"
          >
            Book a Service <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>

      <style>{`
        .service-card:hover {
          border-color: #6c7e7f !important;
          transform: translateY(-6px);
          box-shadow: 0 20px 48px rgba(108,126,127,0.15);
        }
        .service-card:hover .service-top-line { opacity: 1 !important; }
        .service-card:hover h3 { color: #6c7e7f !important; }
        .services-cta:hover { background: #5a6b6c !important; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(108,126,127,0.3); }
        @media (max-width: 900px) { .services-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) { .services-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
