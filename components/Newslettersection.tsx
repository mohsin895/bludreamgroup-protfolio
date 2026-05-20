"use client";

import { motion } from "framer-motion";
import { BookOpen, CheckCircle, Mail, MessageCircle, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await fetch(`${API_BASE}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true); // show success regardless for UX
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Newsletter Section */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #6c7e7f 0%, #7d9192 40%, #95a49a 100%)",
          padding: "50px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "-5%",
            top: "-30%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)",
          }}
        />

        <div
          style={{
            maxWidth: 700,
            margin: "0 auto",
            padding: "0 24px",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
                borderRadius: 40,
                padding: "6px 18px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 24,
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <Mail size={12} /> Newsletter
            </span>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(30px, 4vw, 48px)",
                color: "#ffffff",
                margin: "0 0 16px",
                lineHeight: 1.15,
              }}
            >
              Join the Community
            </h2>
            <p
              style={{
                fontSize: "clamp(14px, 1.5vw, 17px)",
                color: "rgba(255,255,255,0.8)",
                lineHeight: 1.75,
                marginBottom: 40,
              }}
            >
              Get inspiration, new book releases, event invites, and exclusive
              insights delivered straight to your inbox.
            </p>

            {submitted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: 16,
                  padding: "32px",
                }}
              >
                <CheckCircle size={48} color="#fff" />
                <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>
                  You're in!
                </div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
                  Thank you for subscribing. Watch your inbox for updates.
                </div>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                <div
                  style={{ display: "flex", gap: 14 }}
                  className="newsletter-row"
                >
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "15px 20px",
                      borderRadius: 8,
                      border: "none",
                      outline: "none",
                      fontSize: 14,
                      background: "rgba(255,255,255,0.95)",
                      color: "#1f2937",
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Your email address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      flex: 1.5,
                      padding: "15px 20px",
                      borderRadius: 8,
                      border: "none",
                      outline: "none",
                      fontSize: 14,
                      background: "rgba(255,255,255,0.95)",
                      color: "#1f2937",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    background: "#1f2937",
                    color: "#fff",
                    padding: "15px 36px",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.25s",
                  }}
                  className="newsletter-btn"
                >
                  <Send size={15} />{" "}
                  {loading ? "Subscribing..." : "Subscribe Now"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        style={{
          background: "#1f2937",
          padding: "50px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "-5%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(108,126,127,0.15), transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30%",
            right: "-5%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(149,164,154,0.12), transparent 70%)",
          }}
        />

        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "0 24px",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              style={{
                display: "inline-block",
                background: "#6c7e7f22",
                color: "#95a49a",
                borderRadius: 40,
                padding: "6px 20px",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 24,
                border: "1px solid #6c7e7f44",
              }}
            >
              Ready to Begin?
            </span>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(36px, 5vw, 68px)",
                color: "#ffffff",
                margin: "0 0 24px",
                lineHeight: 1.08,
              }}
            >
              Your Transformation
              <br />
              <span style={{ color: "#95a49a", fontStyle: "italic" }}>
                Starts Today
              </span>
            </h2>
            <p
              style={{
                fontSize: "clamp(15px, 1.6vw, 18px)",
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.8,
                maxWidth: 580,
                margin: "0 auto 48px",
              }}
            >
              Whether you want to buy a book, book a consultation, attend an
              event, or collaborate — I'm here to help you grow.
            </p>

            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/books"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#6c7e7f",
                  color: "#fff",
                  padding: "15px 32px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  transition: "all 0.25s",
                  boxShadow: "0 8px 24px rgba(108,126,127,0.35)",
                }}
                className="final-cta-primary"
              >
                <BookOpen size={16} /> Buy Books
              </Link>
              <Link
                href="/contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "transparent",
                  color: "#fff",
                  padding: "15px 32px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  border: "2px solid rgba(255,255,255,0.25)",
                  transition: "all 0.25s",
                }}
                className="final-cta-secondary"
              >
                <MessageCircle size={16} /> Book Consultation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        .newsletter-btn:hover { background: #6c7e7f !important; transform: translateY(-2px); }
        .final-cta-primary:hover { background: #5a6b6c !important; transform: translateY(-3px); box-shadow: 0 16px 40px rgba(108,126,127,0.4) !important; }
        .final-cta-secondary:hover { background: rgba(255,255,255,0.08) !important; border-color: rgba(255,255,255,0.6) !important; transform: translateY(-3px); }
        @media (max-width: 600px) {
          .newsletter-row { flex-direction: column !important; }
        }
      `}</style>
    </>
  );
}
