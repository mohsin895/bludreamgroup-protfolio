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
    title: "One-on-One Consultation",
    icon: "Users",
    desc: "Personalized strategy sessions tailored to your business and life goals.",
    mode: "Online / Offline",
  },
  {
    id: 2,
    title: "Motivational Speaking",
    icon: "Mic",
    desc: "Powerful keynote addresses that energize teams and shift perspectives.",
    mode: "On-site",
  },
  {
    id: 3,
    title: "Business Coaching",
    icon: "Briefcase",
    desc: "Structured mentoring programs for entrepreneurs at every stage.",
    mode: "Online",
  },
  {
    id: 4,
    title: "Workshops & Training",
    icon: "Zap",
    desc: "Hands-on interactive workshops on leadership, mindset, and business.",
    mode: "On-site / Online",
  },
  {
    id: 5,
    title: "Corporate Sessions",
    icon: "Calendar",
    desc: "Customized corporate training programs for teams and organizations.",
    mode: "On-site",
  },
  {
    id: 6,
    title: "Online Masterclass",
    icon: "Video",
    desc: "Recorded and live online sessions for growth-focused professionals.",
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
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(34px, 4vw, 54px)",
              color: "#1f2937",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            How I Can{" "}
            <span style={{ color: "#6c7e7f", fontStyle: "italic" }}>
              Help You Grow
            </span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            style={{
              fontSize: 16,
              color: "#6b7280",
              maxWidth: 480,
              margin: "20px auto 0",
              lineHeight: 1.75,
            }}
          >
            From individual mentoring to large-scale corporate training — every
            service is built around your transformation.
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
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#1f2937",
                    marginBottom: 10,
                    lineHeight: 1.2,
                  }}
                >
                  {s.title}
                </h3>

                <p
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
            className="services-cta"
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
