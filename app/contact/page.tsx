"use client";
import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import PageHero from "@/components/HeroPage";
import Navbar from "@/components/Navbar";
import { useState } from "react";

const faqs = [
  {
    q: "How long does it take to get a reply?",
    a: "General enquiries are answered within one business day. Author and design support aim for same-day responses Monday–Friday.",
  },
  {
    q: "Do you offer phone support?",
    a: "We're currently email-first. This lets us give every creator a thorough, written record of the help they receive.",
  },
  {
    q: "Can I book a demo or walkthrough?",
    a: "Yes — select 'General Enquiries' and mention you'd like a walkthrough. We'll arrange a short call with the right team member.",
  },
  {
    q: "I'm a journalist — who should I contact?",
    a: "Please use the Press & Media channel above. Include your publication, deadline, and the topic you're covering.",
  },
];

/* ─── FAQ Item ──────────────────────────────────────────────── */
function FaqItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <AnimatedSection delay={i * 0.06}>
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "0px 10px",
        }}
      >
        <button
          onClick={() => setOpen(!open)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            padding: "22px 0",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <span
            style={{
              fontSize: "15px",
              color: open ? "#fff" : "#fff",
              fontWeight: 500,
              lineHeight: 1.4,
              transition: "color 0.2s ease",
            }}
          >
            {q}
          </span>
          <span
            style={{
              fontSize: "18px",
              color: "#fff",
              fontWeight: 300,
              flexShrink: 0,
              transition: "transform 0.25s ease",
              transform: open ? "rotate(45deg)" : "rotate(0deg)",
              display: "inline-block",
              lineHeight: 1,
            }}
          >
            +
          </span>
        </button>
        <div
          style={{
            maxHeight: open ? "200px" : "0",
            overflow: "hidden",
            transition: "max-height 0.35s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.75,
              color: "#fff9",
              paddingBottom: "22px",
              margin: 0,
            }}
          >
            {a}
          </p>
        </div>
      </div>
    </AnimatedSection>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const inputStyle = (field: string) => ({
    width: "100%",
    background: focused === field ? "#648181" : "#648181",
    border: `1px solid ${focused === field ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.08)"}`,
    borderRadius: "8px",
    padding: "14px 18px",
    fontSize: "14px",
    color: "#fff",
    outline: "none",
    transition: "all 0.2s ease",
    boxSizing: "border-box" as const,
  });

  const labelStyle = {
    display: "block",
    fontSize: "11px",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "#000",
    marginBottom: "8px",
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <PageHero title="Contact Us" currentPage="Contact" />

      {/* ── Contact Form + FAQ ── */}
      <section
        style={{
          background: "#F4F7F6",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          // padding: "40px 0",
          paddingBottom: "60px",
        }}
      >
        <div className="container">
          <div
            className="contact-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(40px, 6vw, 100px)",
              alignItems: "start",
            }}
          >
            {/* Left: Form */}
            <div>
              <AnimatedSection>
                <div style={{ marginBottom: "40px" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "16px",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "20px",
                        height: "1px",
                        background: "#000",
                      }}
                    />
                    <span
                      className="font-xolonium"
                      style={{
                        fontSize: "11px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "#000",
                      }}
                    >
                      Send a Message
                    </span>
                  </div>
                  <h2
                    style={{
                      fontFamily: "Venus Rising",
                      fontSize: "clamp(28px, 2.5vw, 32px)",
                      color: "#000",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.15,
                      margin: 0,
                    }}
                  >
                    We read every message.
                  </h2>
                </div>
              </AnimatedSection>

              {submitted ? (
                <AnimatedSection>
                  <div
                    style={{
                      padding: "40px",
                      background: "rgba(125,212,176,0.06)",
                      border: "1px solid rgba(125,212,176,0.2)",
                      borderRadius: "12px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "32px", marginBottom: "16px" }}>
                      ✓
                    </div>
                    <h3
                      style={{
                        fontFamily: "Venus Rising",
                        fontSize: "22px",
                        color: "#fff",
                        margin: "0 0 10px",
                      }}
                    >
                      Message sent.
                    </h3>
                    <p
                      className="font-xolonium"
                      style={{
                        fontSize: "14px",
                        color: "rgba(255,255,255,0.45)",
                        lineHeight: 1.7,
                        margin: "0 0 24px",
                      }}
                    >
                      Thanks for reaching out. We will be back in touch within
                      one business day.
                    </p>
                    <button
                      className="font-xolonium"
                      onClick={() => {
                        setSubmitted(false);
                        setFormState({
                          name: "",
                          email: "",
                          subject: "",
                          message: "",
                        });
                      }}
                      style={{
                        padding: "10px 20px",
                        background: "transparent",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "6px",
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "12px",
                        letterSpacing: "0.08em",
                        cursor: "pointer",
                      }}
                    >
                      Send another
                    </button>
                  </div>
                </AnimatedSection>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  <AnimatedSection delay={0.05}>
                    <div
                      className="name-email-grid font-xolonium"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "16px",
                      }}
                    >
                      <div>
                        <label style={labelStyle}>Your Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Jane Smith"
                          value={formState.name}
                          onChange={(e) =>
                            setFormState({ ...formState, name: e.target.value })
                          }
                          onFocus={() => setFocused("name")}
                          onBlur={() => setFocused(null)}
                          style={inputStyle("name")}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="jane@example.com"
                          value={formState.email}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              email: e.target.value,
                            })
                          }
                          onFocus={() => setFocused("email")}
                          onBlur={() => setFocused(null)}
                          style={inputStyle("email")}
                        />
                      </div>
                    </div>
                  </AnimatedSection>

                  <AnimatedSection className="font-xolonium" delay={0.1}>
                    <label className="font-xolonium" style={labelStyle}>
                      Subject
                    </label>
                    <select
                      required
                      value={formState.subject}
                      onChange={(e) =>
                        setFormState({ ...formState, subject: e.target.value })
                      }
                      onFocus={() => setFocused("subject")}
                      onBlur={() => setFocused(null)}
                      style={{
                        ...inputStyle("subject"),
                        color: formState.subject ? "#fff" : "#fff9",
                      }}
                    >
                      <option
                        value=""
                        disabled
                        style={{ background: "#648181" }}
                      >
                        Select a topic…
                      </option>
                      <option value="general" style={{ background: "#648181" }}>
                        General Enquiry
                      </option>
                      <option value="author" style={{ background: "#648181" }}>
                        Author Support
                      </option>
                      <option
                        value="portfolio"
                        style={{ background: "#648181" }}
                      >
                        Portfolio & Design
                      </option>
                      <option value="press" style={{ background: "#648181" }}>
                        Press & Media
                      </option>
                      <option
                        value="partnership"
                        style={{ background: "#648181" }}
                      >
                        Partnership
                      </option>
                      <option value="other" style={{ background: "#648181" }}>
                        Other
                      </option>
                    </select>
                  </AnimatedSection>

                  <AnimatedSection className="font-xolonium" delay={0.15}>
                    <label style={labelStyle}>Message</label>
                    <textarea
                      required
                      rows={6}
                      placeholder="Tell us what you're working on, or what you need help with…"
                      value={formState.message}
                      onChange={(e) =>
                        setFormState({ ...formState, message: e.target.value })
                      }
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused(null)}
                      style={{
                        ...inputStyle("message"),
                        resize: "vertical",
                        fontFamily: "inherit",
                        lineHeight: 1.6,
                      }}
                    />
                  </AnimatedSection>

                  <AnimatedSection className="font-xolonium" delay={0.2}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "16px",
                      }}
                    >
                      <p
                        className="font-xolonium"
                        style={{
                          fontSize: "12px",
                          color: "#000",
                          margin: 0,
                          lineHeight: 1.6,
                        }}
                      >
                        We reply within one business day.
                        <br />
                        Your information is never shared.
                      </p>
                      <button
                        type="submit"
                        style={{
                          padding: "14px 32px",
                          background: "var(--gold)",
                          color: "#000",
                          border: "1px solid #82c3d8",

                          borderRadius: "6px",
                          fontWeight: 700,
                          fontSize: "13px",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          cursor: "pointer",
                          transition: "opacity 0.2s ease",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Send Message →
                      </button>
                    </div>
                  </AnimatedSection>
                </form>
              )}
            </div>

            {/* Right: FAQ */}
            <div className="font-xolonium">
              <AnimatedSection>
                <div style={{ marginBottom: "40px" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "16px",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "20px",
                        height: "1px",
                        background: "#648181",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "11px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "#000",
                      }}
                    >
                      Common Questions
                    </span>
                  </div>
                  <h2
                    style={{
                      fontFamily: "Venus Rising",
                      fontSize: "clamp(18px, 2.5vw, 28px)",
                      color: "#000",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.15,
                      margin: "0 0 8px",
                    }}
                  >
                    Before you write,
                    <br />
                    <span style={{ color: "#000" }}>check here first.</span>
                  </h2>
                </div>
              </AnimatedSection>

              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  background: "#648181",
                  padding: "10px",
                  borderRadius: "10px",
                }}
              >
                {faqs.map((f, i) => (
                  <FaqItem key={i} q={f.q} a={f.a} i={i} />
                ))}
              </div>

              {/* Office hours */}
              <AnimatedSection delay={0.3}>
                <div
                  style={{
                    marginTop: "40px",
                    padding: "24px",
                    background: "#648181",
                    border: "1px solid #fff",
                    borderRadius: "10px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#fff",
                      marginBottom: "12px",
                    }}
                  >
                    Support Hours
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {[
                      {
                        day: "Monday – Friday",
                        hours: "9:00 AM – 6:00 PM GMT",
                      },
                      { day: "Saturday", hours: "10:00 AM – 2:00 PM GMT" },
                      { day: "Sunday", hours: "Closed" },
                    ].map((row) => (
                      <div
                        key={row.day}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "16px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "13px",
                            color: "#fff",
                          }}
                        >
                          {row.day}
                        </span>
                        <span
                          style={{
                            fontSize: "13px",
                            color:
                              row.hours === "Closed"
                                ? "#f00"
                                : "rgba(255,255,255,0.65)",
                            fontWeight: 500,
                          }}
                        >
                          {row.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <style jsx>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }

          .contact-grid form > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .name-email-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
