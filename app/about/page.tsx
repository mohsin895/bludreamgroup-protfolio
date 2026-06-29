"use client";

import Footer from "@/components/Footer";
import PageHero from "@/components/HeroPage";
import Navbar from "@/components/Navbar";
import ServicesSection from "@/components/Service";
import {
  fetchAboutPageData,
  type MappedAbout,
  type MappedMilestone,
} from "@/lib/api/about";
import { motion, useInView } from "framer-motion";
import {
  AlertCircle,
  Award,
  BookOpen,
  CalendarClock,
  Globe,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// ─── CSS ──────────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
@keyframes shimmer {
  0%, 100% { opacity: 0.45; }
  50%       { opacity: 1; }
}
@keyframes pulse-dot {
  0%, 100% { box-shadow: 0 0 0 0 rgba(108,126,127,0.5); }
  50%       { box-shadow: 0 0 0 8px rgba(108,126,127,0); }
}
@media (max-width: 900px) {
  .about-grid {
    grid-template-columns: 1fr !important;
    gap: 56px !important;
  }
  .portrait-wrap {
    padding-right: 0 !important;
    max-width: 420px;
    margin: 0 auto;
  }
  .quote-card {
    right: -8px !important;
    width: 200px !important;
  }

}
  @media (max-width: 768px) {
  .portrait-wrap {
    padding-right: 0 !important;
    padding-bottom: 0 !important;
  }

  .quote-card {
    position: relative !important;
    bottom: auto !important;
    right: auto !important;

    width: 100% !important;
    max-width: 100% !important;

    margin-top: 20px;
    padding: 18px 16px !important;
  }
}
`;

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const skBox = (w: string, h: string, delay = "0s"): React.CSSProperties => ({
  width: w,
  height: h,
  borderRadius: "4px",
  background: "rgba(0,0,0,0.07)",
  animation: `shimmer 1.5s ease-in-out ${delay} infinite`,
  display: "block",
});

function SkeletonBio() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <span style={skBox("40%", "12px")} />
      <span style={skBox("75%", "40px", "0.05s")} />
      <span style={skBox("55%", "40px", "0.08s")} />
      {[100, 92, 96, 78, 84].map((w, i) => (
        <span key={i} style={skBox(`${w}%`, "13px", `${i * 0.06}s`)} />
      ))}
      <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
        <span style={skBox("160px", "44px")} />
        <span style={skBox("130px", "44px", "0.1s")} />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          marginTop: "16px",
        }}
      >
        {[1, 2, 3, 4].map((n) => (
          <span key={n} style={skBox("100%", "50px", `${n * 0.07}s`)} />
        ))}
      </div>
    </div>
  );
}

// ─── Stat Badges ──────────────────────────────────────────────────────────────
const STAT_BADGES = [
  { icon: BookOpen, label: "05+ Books Published" },
  { icon: Users, label: "500,000+ Readers Reached" },
  { icon: Globe, label: "200+ Events Conducted" },
  { icon: CalendarClock, label: "20+ Years Experience" },
  { icon: Award, label: "500+ Mentorship Served " },
];

// ─── Portrait ─────────────────────────────────────────────────────────────────
function Portrait({ quoteText }: { quoteText: string }) {
  return (
    <div
      className="portrait-wrap"
      style={{
        position: "relative",
        paddingRight: "36px",
        paddingBottom: "20px",
      }}
    >
      {/* Corner accents */}
      <div
        style={{
          position: "absolute",
          top: "-12px",
          left: "-12px",
          width: "64px",
          height: "64px",
          borderTop: "3px solid #6c7e7f",
          borderLeft: "3px solid #6c7e7f",
          borderRadius: "4px 0 0 0",
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "6px",
          right: "22px",
          width: "64px",
          height: "64px",
          borderBottom: "3px solid #6c7e7f",
          borderRight: "3px solid #6c7e7f",
          borderRadius: "0 0 4px 0",
          zIndex: 2,
        }}
      />

      {/* Image */}
      <div
        style={{
          borderRadius: "6px",
          overflow: "hidden",
          aspectRatio: "4/5",
          background: "#d0dbdb",
          position: "relative",
        }}
      >
        <Image
          src="/chairman2.jpeg"
          alt="Portrait"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(60,80,80,0.5) 0%, transparent 55%)",
          }}
        />
      </div>

      {/* Quote card */}
      <motion.div
        className="quote-card"
        initial={{ opacity: 0, x: 20, y: 10 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" as const }}
        style={{
          position: "absolute",
          bottom: "48px",
          right: "-22px",
          width: "360px",
          background: "#fff",
          borderRadius: "6px",
          padding: "16px 12px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: "24px",
            height: "2px",
            background: "#6c7e7f",
            borderRadius: "1px",
            marginBottom: "10px",
          }}
        />
        <p
          className="font-rising"
          style={{
            fontSize: "12px",
            // lineHeight: 1.7,
            color: "#2a3535",

            margin: 0,
          }}
        >
          K.S.M Shopnill Chowdhury Shohag
        </p>
        <p
          className="font-xolonium"
          style={{
            fontSize: "12px",
            lineHeight: 1.7,
            color: "#2a3535",

            margin: 0,
          }}
        >
          B.Sc in Computer Science & Engineering <br />
          M.Sc Software Engineer <br />
          PhD in Textile & Business Management ( Germany)
        </p>
        <p
          className="font-xolonium"
          style={{
            marginTop: "10px",
            fontSize: "10px",
            letterSpacing: "0.12em",
            color: "#000",
            textTransform: "uppercase",
          }}
        >
          Founder & Managing Director <br />
          Blue Dream Group
        </p>
      </motion.div>
    </div>
  );
}

// ─── Timeline Item ────────────────────────────────────────────────────────────
function TimelineItem({
  milestone,
  index,
  isLast,
}: {
  milestone: MappedMilestone;
  index: number;
  isLast: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut" as const,
      }}
      style={{
        display: "grid",
        gridTemplateColumns: "90px 24px 1fr",
        marginBottom: isLast ? 0 : "0px",
      }}
    >
      {/* Year */}
      <div
        style={{
          textAlign: "right",
          paddingTop: "8px",
          paddingBottom: "52px",
          paddingRight: "0",
        }}
      >
        <span
          className="font-rising"
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#6c7e7f",
            letterSpacing: "0.05em",
          }}
        >
          {/* {milestone.year} */}
        </span>
      </div>

      {/* Dot + line */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "10px",
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{
            delay: index * 0.1 + 0.2,
            type: "spring",
            stiffness: 300,
          }}
          style={{
            width: "13px",
            height: "13px",
            borderRadius: "50%",
            background: "#6c7e7f",
            border: "3px solid #F4F7F6",
            boxShadow: "0 0 0 3px rgba(108,126,127,0.2)",
            flexShrink: 0,
            animation: "pulse-dot 2.5s ease-in-out infinite",
          }}
        />
        {!isLast && (
          <div
            style={{
              flex: 1,
              width: "1px",
              background:
                "linear-gradient(to bottom, #6c7e7f, rgba(108,126,127,0.12))",
              marginTop: "6px",
            }}
          />
        )}
      </div>

      {/* Content card */}
      <div style={{ paddingLeft: "24px", paddingBottom: "52px" }}>
        <motion.div
          whileHover={{
            y: -3,
            boxShadow: "0 10px 36px rgba(108,126,127,0.14)",
          }}
          style={{
            background: "#fff",
            border: "1px solid rgba(108,126,127,0.14)",
            borderRadius: "8px",
            padding: "20px 24px",
            boxShadow: "0 3px 16px rgba(108,126,127,0.06)",
            transition: "box-shadow 0.3s",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <h3
              className="font-rising"
              style={{
                fontSize: "17px",
                fontWeight: 700,
                color: "#1a2a2a",
                margin: 0,
              }}
            >
              {milestone.title}
            </h3>
          </div>
          <p
            className="font-xolonium"
            style={{
              fontSize: "13px",
              color: "#5a6e6e",
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            {milestone.description}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const [about, setAbout] = useState<MappedAbout | null>(null);
  const [milestones, setMilestones] = useState<MappedMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const { about: a, milestones: m } = await fetchAboutPageData();
      setAbout(a);
      setMilestones(m);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load about page.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09 } },
  };

  // Quote: first sentence of description (strip html tags) or title
  const quoteText = about?.aboutTitle?.slice(0, 70) ?? "";

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <Navbar />
      <PageHero title="About Us" currentPage="About" />

      {/* ── Bio Section ── */}
      <section style={{ background: "#F4F7F6", padding: "100px 0 80px" }}>
        <div
          className="container about-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "start",
          }}
        >
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -36 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
          >
            <Portrait quoteText={quoteText} />
          </motion.div>

          {/* Content */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {/* ── Loading ── */}
            {/* {loading && <SkeletonBio />} */}

            {/* ── Error ── */}
            {!loading && error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  color: "#2a3535",
                  fontSize: "14px",
                }}
              >
                <AlertCircle
                  size={16}
                  style={{ color: "#c47c5a", flexShrink: 0, marginTop: "2px" }}
                />
                <div>
                  <p style={{ margin: "0 0 12px" }}>{error}</p>
                  <button
                    onClick={loadData}
                    style={{
                      padding: "8px 20px",
                      background: "#6c7e7f",
                      border: "none",
                      borderRadius: "4px",
                      color: "#fff",
                      fontSize: "12px",
                      cursor: "pointer",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* ── Data loaded ── */}

            <>
              {/* Label */}
              <motion.p
                variants={fadeUp}
                className="font-xolonium"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#6c7e7f",
                  marginBottom: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "28px",
                    height: "2px",
                    background: "#6c7e7f",
                    borderRadius: "1px",
                  }}
                />
                Who We Are
              </motion.p>

              {/* Title */}
              <motion.h2
                variants={fadeUp}
                className="font-rising text-center"
                style={{
                  fontSize: "clamp(16px, 3.2vw, 28px)",
                  lineHeight: 1.22,
                  color: "#1a2a2a",
                  marginBottom: "20px",
                  textAlign: "start",
                  textWrap: "justify",
                }}
              >
                K.S.M. Shopnill Chowdhury Shohag <br /> Industrial Innovator &
                Philanthropist
              </motion.h2>

              {/* Description */}
              <motion.div
                variants={fadeUp}
                className="font-xolonium"
                style={{
                  color: "#4a5e5e",
                  lineHeight: 1.85,
                  marginBottom: "28px",
                  fontSize: "14px",
                  textAlign: "justify",
                  textJustify: "inter-word",
                }}
                dangerouslySetInnerHTML={{
                  __html: about?.description ?? "<p>Loading content…</p>",
                }}
              />

              {/* Feature rows */}
              <motion.div variants={fadeUp} style={{ marginBottom: "30px" }}>
                {[
                  {
                    title: "Add all blue dream group concern",
                    desc: "11 concern ",
                  },
                ].map((f, i) => (
                  <div
                    key={i}
                    style={{
                      borderTop: "1px solid rgba(108,126,127,0.18)",
                      padding: "16px 0",
                    }}
                  >
                    <h4
                      className="font-rising"
                      style={{
                        fontSize: "15px",
                        color: "#1a2a2a",
                        marginBottom: "5px",
                      }}
                    >
                      {f.title}
                    </h4>
                    <p
                      className="font-xolonium"
                      style={{
                        fontSize: "18px",
                        color: "#5a6e6e",
                        lineHeight: 1.7,
                        margin: 0,
                      }}
                    >
                      {f.desc}
                    </p>
                  </div>
                ))}
              </motion.div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginTop: "40px",
                }}
              >
                {STAT_BADGES.map(({ icon: Icon, label }) => (
                  <div
                    className="font-xolonium"
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "14px",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      borderRadius: "4px",
                    }}
                  >
                    <Icon
                      size={16}
                      style={{ color: "#F59E0B", flexShrink: 0 }}
                    />
                    <span style={{ fontSize: "13px", color: "#000" }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </>
          </motion.div>
        </div>
      </section>

      <ServicesSection />

      {/* ── Career Journey ── */}
      <section style={{ background: "#F4F7F6", padding: "100px 0" }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            style={{ textAlign: "center", marginBottom: "70px" }}
          >
            <p
              className="font-xolonium"
              style={{
                fontSize: "11px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#6c7e7f",
                marginBottom: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "26px",
                  height: "2px",
                  background: "#6c7e7f",
                  borderRadius: "1px",
                }}
              />
              Career Journey
              <span
                style={{
                  display: "inline-block",
                  width: "26px",
                  height: "2px",
                  background: "#6c7e7f",
                  borderRadius: "1px",
                }}
              />
            </p>
            <h2
              className="font-rising"
              style={{
                fontSize: "clamp(34px, 4vw, 52px)",
                color: "#1a2a2a",
                lineHeight: 1.15,
                marginBottom: "14px",
              }}
            >
              A Life Well Built
            </h2>
            <p
              className="font-xolonium"
              style={{
                fontSize: "14px",
                color: "#5a6e6e",
                maxWidth: "500px",
                margin: "0 auto",
                lineHeight: 1.75,
              }}
            >
              Every milestone, a stepping stone toward transforming lives and
              organizations across the globe.
            </p>
          </motion.div>

          {loading && <SkeletonTimeline />}

          {!loading && error && (
            <p
              style={{
                textAlign: "center",
                color: "#8a9e9e",
                fontSize: "14px",
                padding: "40px 0",
              }}
            >
              Could not load career milestones.
            </p>
          )}

          {!loading && milestones.length > 0 && (
            <div style={{ maxWidth: "760px", margin: "0 auto" }}>
              {milestones.map((m, i) => (
                <TimelineItem
                  key={m.id}
                  milestone={m}
                  index={i}
                  isLast={i === milestones.length - 1}
                />
              ))}
            </div>
          )}

          {!loading && !error && milestones.length === 0 && (
            <p
              style={{
                textAlign: "center",
                color: "#8a9e9e",
                fontSize: "14px",
                padding: "40px 0",
              }}
            >
              No milestones available yet.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

// ─── Skeleton Timeline (defined after to avoid hoisting issue) ────────────────
function SkeletonTimeline() {
  const skBox = (w: string, h: string, delay = "0s"): React.CSSProperties => ({
    width: w,
    height: h,
    borderRadius: "4px",
    background: "rgba(0,0,0,0.07)",
    animation: `shimmer 1.5s ease-in-out ${delay} infinite`,
    display: "block",
  });
  return (
    <div style={{ maxWidth: "760px", margin: "0 auto" }}>
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          style={{
            display: "grid",
            gridTemplateColumns: "90px 24px 1fr",
            marginBottom: "52px",
          }}
        >
          <div
            style={{ textAlign: "right", paddingTop: "8px", paddingRight: "0" }}
          >
            <span style={skBox("56px", "18px", `${n * 0.08}s`)} />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "10px",
            }}
          >
            <span style={{ ...skBox("13px", "13px"), borderRadius: "50%" }} />
          </div>
          <div
            style={{
              paddingLeft: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              paddingTop: "4px",
            }}
          >
            <span style={skBox("48%", "20px", `${n * 0.1}s`)} />
            <span style={skBox("86%", "13px", `${n * 0.12}s`)} />
            <span style={skBox("70%", "13px", `${n * 0.14}s`)} />
          </div>
        </div>
      ))}
    </div>
  );
}
