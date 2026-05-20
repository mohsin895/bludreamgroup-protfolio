"use client";

import { motion, useInView } from "framer-motion";
import { Award, BookOpen, Calendar, Star, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

interface StatItem {
  id?: number;
  label: string;
  value: number;
  suffix?: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
}

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const defaultStats: StatItem[] = [
  {
    label: "Books Published",
    value: 30,
    suffix: "+",
    icon: BookOpen,
    color: "#6c7e7f",
  },
  {
    label: "Readers Reached",
    value: 50000,
    suffix: "+",
    icon: Users,
    color: "#95a49a",
  },
  {
    label: "Events Conducted",
    value: 200,
    suffix: "+",
    icon: Calendar,
    color: "#6c7e7f",
  },
  {
    label: "Years Experience",
    value: 15,
    suffix: "+",
    icon: Award,
    color: "#95a49a",
  },
  {
    label: "Client Served",
    value: 500,
    suffix: "+",
    icon: Star,
    color: "#6c7e7f",
  },
];

export default function AchievementsSection() {
  const [stats, setStats] = useState<StatItem[]>(defaultStats);

  useEffect(() => {
    fetch(`${API_BASE}/achievements`)
      .then((r) => r.json())
      .then((json) => {
        const data: any[] = json?.data ?? json;
        if (Array.isArray(data) && data.length > 0) {
          setStats(
            data.slice(0, 5).map((item: any, i: number) => ({
              id: item.id,
              label:
                item.label ??
                item.title ??
                defaultStats[i]?.label ??
                "Achievement",
              value: parseInt(
                item.value ?? item.count ?? defaultStats[i]?.value ?? "0",
                10,
              ),
              suffix: item.suffix ?? "+",
              icon: defaultStats[i]?.icon ?? Award,
              color: defaultStats[i]?.color ?? "#6c7e7f",
            })),
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section
      style={{
        background:
          "linear-gradient(135deg, #6c7e7f 0%, #7a9190 40%, #95a49a 100%)",
        padding: "100px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.06,
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-30%",
          right: "-10%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.07), transparent 70%)",
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: 72 }}
        >
          <span
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.15)",
              color: "#ffffff",
              borderRadius: 40,
              padding: "6px 20px",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 16,
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            By The Numbers
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(34px, 4vw, 54px)",
              color: "#ffffff",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            A Legacy Built on{" "}
            <span
              style={{ fontStyle: "italic", color: "rgba(255,255,255,0.8)" }}
            >
              Results
            </span>
          </h2>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          className="achievements-grid"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            justifyContent: "center",
          }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label + i}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.92 },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="achievement-card"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 20,
                padding: "36px 32px",
                textAlign: "center",
                flex: "1 1 180px",
                maxWidth: 220,
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: "rgba(255,255,255,0.18)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 18px",
                }}
              >
                <s.icon size={24} color="#ffffff" />
              </div>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(36px, 4vw, 52px)",
                  fontWeight: 800,
                  color: "#ffffff",
                  lineHeight: 1,
                }}
              >
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.75)",
                  marginTop: 10,
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                }}
              >
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        .achievement-card:hover {
          background: rgba(255,255,255,0.2) !important;
          transform: translateY(-6px);
          box-shadow: 0 20px 48px rgba(0,0,0,0.15);
        }
        @media (max-width: 640px) {
          .achievements-grid { flex-direction: column; align-items: center; }
          .achievement-card { max-width: 100% !important; width: 100%; }
        }
      `}</style>
    </section>
  );
}
