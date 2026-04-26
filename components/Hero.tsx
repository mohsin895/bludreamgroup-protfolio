"use client";
import { ArrowRight, Award, BookOpen, Mic, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const books = [
  {
    title: "The Sovereign Leader",
    subtitle: "A Framework for Fearless Authority",
    year: "2024",
    tag: "Bestseller",
    color: "#1a1210",
  },
  {
    title: "Unwritten Rules",
    subtitle: "What They Never Teach in Business School",
    year: "2022",
    tag: "WSJ #1",
    color: "#10161a",
  },
  {
    title: "The Quiet Revolution",
    subtitle: "How Introverts Change the World",
    year: "2020",
    tag: "Award Winner",
    color: "#0f1a10",
  },
];

const stats = [
  { number: "3.2M+", label: "Books Sold" },
  { number: "200+", label: "Keynotes" },
  { number: "47", label: "Countries" },
  { number: "18", label: "Years Experience" },
];

const testimonials = [
  {
    quote:
      "Alexandra's coaching transformed the way I lead my team. The ROI was evident within 90 days.",
    name: "James Whitfield",
    role: "CEO, Meridian Group",
    rating: 5,
  },
  {
    quote:
      "The most powerful keynote I've experienced in 20 years of attending industry conferences.",
    name: "Sarah Chen",
    role: "SVP, Apex Financial",
    rating: 5,
  },
  {
    quote:
      "Her book 'Sovereign Leader' is required reading for every manager in our organization.",
    name: "Dr. Marcus Okafor",
    role: "Head of L&D, GlobalTech",
    rating: 5,
  },
];

const services = [
  {
    icon: Mic,
    title: "Keynote Speaking",
    desc: "Transformative talks for conferences, summits, and corporate events worldwide.",
    href: "/services#speaking",
  },
  {
    icon: Users,
    title: "Executive Coaching",
    desc: "1:1 coaching programs for C-suite leaders and high-potential executives.",
    href: "/services#coaching",
  },
  {
    icon: BookOpen,
    title: "Online Courses",
    desc: "Self-paced learning programs distilling decades of leadership wisdom.",
    href: "/courses",
  },
  {
    icon: Award,
    title: "Corporate Workshops",
    desc: "Custom workshops that shift culture and unlock team performance.",
    href: "/services#workshops",
  },
];

const logos = [
  "Forbes",
  "Harvard Business Review",
  "Bloomberg",
  "TED",
  "The Guardian",
  "CNBC",
  "Fast Company",
  "Wired",
];

export default function Hero() {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* ── HERO ── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Bg grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage:
              "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          }}
        />
        {/* Gold orb */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "5%",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(130,195,216,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "-5%",
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(130,195,216,0.05) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div
          className="container"
          style={{
            paddingTop: "100px",
            paddingBottom: "80px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "center",
          }}
        >
          {/* Left */}
          <div>
            <div
              style={{
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s ease 0.1s",
              }}
            >
              <div className="section-label">
                Bestselling Author · Speaker · Coach
              </div>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(52px, 6vw, 88px)",
                lineHeight: 1.05,
                marginTop: "16px",
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? "translateY(0)" : "translateY(24px)",
                transition: "all 0.8s ease 0.2s",
              }}
            >
              Lead With
              <br />
              <span className="gradient-text">Sovereign</span>
              <br />
              Confidence
            </h1>

            <p
              style={{
                fontSize: "17px",
                color: "var(--text-muted)",
                lineHeight: 1.75,
                maxWidth: "480px",
                marginTop: "24px",
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s ease 0.35s",
              }}
            >
              Alexandra Voss is a 3-time bestselling author, executive coach to
              Fortune 500 leaders, and one of the most sought-after keynote
              speakers in leadership and personal transformation.
            </p>

            <div
              style={{
                display: "flex",
                gap: "16px",
                marginTop: "36px",
                flexWrap: "wrap",
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s ease 0.45s",
              }}
            >
              <Link href="/books" className="btn-primary">
                Explore Books <ArrowRight size={16} />
              </Link>
              <Link href="/services" className="btn-outline">
                Work With Me
              </Link>
            </div>

            {/* Stats row */}
            <div
              style={{
                display: "flex",
                gap: "40px",
                marginTop: "56px",
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s ease 0.55s",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                paddingTop: "32px",
              }}
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "30px",
                      color: "#82c3d8",
                      lineHeight: 1,
                    }}
                  >
                    {s.number}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--text-dim)",
                      letterSpacing: "0.08em",
                      marginTop: "4px",
                      textTransform: "uppercase",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — portrait card */}
          <div
            style={{
              opacity: heroLoaded ? 1 : 0,
              transform: heroLoaded ? "translateY(0)" : "translateY(30px)",
              transition: "all 1s ease 0.3s",
              position: "relative",
            }}
          >
            <div
              style={{
                background: "#203647",
                border: "1px solid rgba(130,195,216,0.2)",
                borderRadius: "8px",
                overflow: "hidden",
                aspectRatio: "4/5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              {/* Placeholder portrait */}
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, rgba(130,195,216,0.3), rgba(130,195,216,0.05))",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "48px",
                    fontFamily: "var(--font-display)",
                    color: "#82c3d8",
                  }}
                >
                  AV
                </div>
                <p
                  style={{
                    marginTop: "20px",
                    color: "var(--text-muted)",
                    fontSize: "13px",
                  }}
                >
                  Portrait Photo Here
                </p>
              </div>

              {/* Floating badge */}
              <div
                style={{
                  position: "absolute",
                  bottom: "24px",
                  left: "24px",
                  right: "24px",
                  background: "#203647",
                  border: "1px solid rgba(130,195,216,0.25)",
                  borderRadius: "6px",
                  padding: "16px 20px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#82c3d8",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                      }}
                    >
                      NEW RELEASE
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "18px",
                        color: "var(--text)",
                        marginTop: "2px",
                      }}
                    >
                      The Sovereign Leader
                    </div>
                  </div>
                  <Link
                    href="/books"
                    style={{
                      background: "#82c3d8",
                      color: "#ffffff",
                      padding: "8px 16px",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textDecoration: "none",
                      borderRadius: "3px",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Get It
                  </Link>
                </div>
              </div>
            </div>

            {/* Decorative corner */}
            <div
              style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                width: "80px",
                height: "80px",
                border: "1px solid rgba(130,195,216,0.25)",
                borderRadius: "4px",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            opacity: 0.4,
          }}
        >
          <div
            style={{
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            Scroll
          </div>
          <div
            style={{
              width: "1px",
              height: "40px",
              background: "linear-gradient(to bottom, #82c3d8, transparent)",
              animation: "pulse 2s infinite",
            }}
          />
        </div>

        <style>{`
          @keyframes pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
          @media (max-width: 900px) {
            section > .container { grid-template-columns: 1fr !important; gap: 40px !important; }
            section > .container > div:last-child { display: none; }
          }
        `}</style>
      </section>
    </>
  );
}
