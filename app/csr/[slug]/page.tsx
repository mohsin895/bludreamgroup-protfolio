"use client";

import Footer from "@/components/Footer";
import PageHero from "@/components/HeroPage";
import Navbar from "@/components/Navbar";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowLeft, CheckCircle, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type ServiceNote = {
  note_icon: string;
  note_title: string;
  note_description: string;
};

type GalleryItem = {
  id: number;
  image: { original: string };
  type: string;
};

type CsrDetail = {
  id: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  serviceNote: ServiceNote[] | null;
  gallery: GalleryItem[];
};

function parseImage(
  raw: string,
  size: "original" | "medium" | "large" = "large",
): string {
  try {
    const parsed = JSON.parse(raw);
    return `${IMAGE_BASE}${parsed[size] ?? parsed.original}`;
  } catch {
    return raw.startsWith("http") ? raw : `${IMAGE_BASE}${raw}`;
  }
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.88)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <motion.div
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.88, opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "relative",
            maxWidth: "900px",
            width: "100%",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <Image
            src={src}
            alt="Gallery"
            width={900}
            height={600}
            style={{
              objectFit: "contain",
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            <X size={16} />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Gallery Grid ──────────────────────────────────────────────────────────────
function GallerySection({ gallery }: { gallery: GalleryItem[] }) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  if (!gallery.length) return null;

  return (
    <section style={{ padding: "80px 0", background: "#fff" }}>
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "52px" }}
        >
          <p
            className="font-xolonium"
            style={{
              fontSize: "11px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#6c7e7f",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <span
              style={{
                width: "26px",
                height: "2px",
                background: "#6c7e7f",
                display: "inline-block",
                borderRadius: "1px",
              }}
            />
            Photo Gallery
            <span
              style={{
                width: "26px",
                height: "2px",
                background: "#6c7e7f",
                display: "inline-block",
                borderRadius: "1px",
              }}
            />
          </p>
          <h2
            className="font-rising"
            style={{ fontSize: "clamp(28px,3.2vw,40px)", color: "#1a2a2a" }}
          >
            Moments of Impact
          </h2>
        </motion.div>

        {/* Masonry-style grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              gallery.length === 1
                ? "1fr"
                : gallery.length === 2
                  ? "1fr 1fr"
                  : "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          {gallery.map((g, i) => {
            const src = `${IMAGE_BASE}${g.image.original}`;
            // First item spans 2 cols if 3+ images
            const isFeature = i === 0 && gallery.length >= 3;
            return (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                onClick={() => setLightbox(src)}
                style={{
                  gridColumn: isFeature ? "span 2" : "span 1",
                  position: "relative",
                  height: isFeature ? "400px" : "260px",
                  borderRadius: "10px",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                <Image
                  src={src}
                  alt={`Gallery ${i + 1}`}
                  fill
                  style={{
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                  }}
                />
                {/* Hover overlay */}
                <motion.div
                  whileHover={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(108,126,127,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "opacity 0.3s",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      background: "rgba(255,255,255,0.9)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="#6c7e7f"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {lightbox && (
        <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
      )}
    </section>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonDetail() {
  const sk = (w: string, h: string, d = "0s"): React.CSSProperties => ({
    width: w,
    height: h,
    borderRadius: "4px",
    background: "rgba(0,0,0,0.07)",
    animation: `shimmer 1.5s ease-in-out ${d} infinite`,
    display: "block",
  });
  return (
    <div
      className="container"
      style={{
        padding: "80px 0",
        display: "grid",
        gridTemplateColumns: "1.1fr 0.9fr",
        gap: "72px",
        alignItems: "start",
      }}
    >
      <span style={sk("100%", "460px")} />
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <span style={sk("40%", "12px")} />
        <span style={sk("80%", "38px", "0.05s")} />
        <span style={sk("65%", "38px", "0.08s")} />
        {[100, 92, 88, 95, 78].map((w, i) => (
          <span key={i} style={sk(`${w}%`, "13px", `${i * 0.06}s`)} />
        ))}
        {[1, 2, 3].map((n) => (
          <span key={n} style={sk("100%", "64px", `${n * 0.08}s`)} />
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CsrDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [data, setData] = useState<CsrDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/socila-responsibility-details/${slug}`,
        );
        if (!res.ok) throw new Error();
        const json = await res.json();
        const d = json.data;
        setData({
          id: d.id,
          title: d.title,
          slug: d.slug,
          description: d.description ?? "",
          image: d.image ?? "",
          serviceNote: d.serviceNote ? JSON.parse(d.serviceNote) : null,
          gallery: d.gallery ?? [],
        });
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const heroImg = data ? parseImage(data.image, "large") : "";

  return (
    <>
      <style>{`
        @keyframes shimmer { 0%,100%{opacity:0.45} 50%{opacity:1} }
        @media (max-width: 860px) {
          .detail-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .gallery-grid-3 { grid-template-columns: 1fr 1fr !important; }
          .gallery-grid-3 > div:first-child { grid-column: span 2 !important; }
        }
        @media (max-width: 560px) {
          .gallery-grid-3 { grid-template-columns: 1fr !important; }
          .gallery-grid-3 > div:first-child { grid-column: span 1 !important; }
        }
      `}</style>

      <Navbar />
      <PageHero title="CSR Details" currentPage="CSR" />

      <main style={{ background: "#F4F7F6", minHeight: "60vh" }}>
        {/* ── Loading ── */}
        {loading && (
          <section style={{ background: "#fff" }}>
            <SkeletonDetail />
          </section>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <section style={{ padding: "100px 0", textAlign: "center" }}>
            <p
              className="font-xolonium"
              style={{
                color: "#8a9a9a",
                fontSize: "14px",
                marginBottom: "20px",
              }}
            >
              Could not load this initiative.
            </p>
            <Link
              href="/csr"
              style={{
                color: "#6c7e7f",
                fontSize: "13px",
                textDecoration: "underline",
              }}
            >
              ← Back to CSR
            </Link>
          </section>
        )}

        {/* ── Content ── */}
        {!loading && !error && data && (
          <>
            {/* Hero image full-width banner */}
            <motion.div
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              style={{
                position: "relative",
                width: "100%",
                height: "clamp(280px, 45vw, 520px)",
                overflow: "hidden",
              }}
            >
              <Image
                src={heroImg}
                alt={data.title}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(26,42,42,0.7) 0%, rgba(26,42,42,0.2) 50%, transparent 100%)",
                }}
              />
              {/* Title overlay */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                style={{
                  position: "absolute",
                  bottom: "40px",
                  left: 0,
                  right: 0,
                  padding: "0 24px",
                  textAlign: "center",
                }}
              >
                <h1
                  className="font-rising"
                  style={{
                    fontSize: "clamp(28px,4vw,52px)",
                    color: "#fff",
                    textShadow: "0 2px 20px rgba(0,0,0,0.4)",
                    lineHeight: 1.2,
                  }}
                >
                  {data.title}
                </h1>
              </motion.div>
            </motion.div>

            {/* ── Main content ── */}
            <section style={{ background: "#fff", padding: "80px 0" }}>
              <div
                className="container detail-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.1fr 0.9fr",
                  gap: "72px",
                  alignItems: "start",
                }}
              >
                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, x: -28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55 }}
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
                      gap: "10px",
                    }}
                  >
                    <span
                      style={{
                        width: "26px",
                        height: "2px",
                        background: "#6c7e7f",
                        display: "inline-block",
                        borderRadius: "1px",
                      }}
                    />
                    About This Initiative
                  </p>
                  <div
                    className="font-xolonium csr-description"
                    dangerouslySetInnerHTML={{ __html: data.description }}
                    style={{
                      color: "#4a5e5e",
                      lineHeight: 1.85,
                      fontSize: "14.5px",
                    }}
                  />

                  {/* Back button */}
                  <motion.div
                    whileHover={{ x: -4 }}
                    style={{ marginTop: "40px" }}
                  >
                    <Link
                      href="/csr"
                      className="font-xolonium"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "#6c7e7f",
                        fontSize: "12px",
                        textDecoration: "none",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        padding: "12px 24px",
                        border: "1.5px solid #6c7e7f",
                        borderRadius: "4px",
                        transition: "all 0.25s",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLAnchorElement
                        ).style.background = "#6c7e7f";
                        (e.currentTarget as HTMLAnchorElement).style.color =
                          "#fff";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLAnchorElement
                        ).style.background = "transparent";
                        (e.currentTarget as HTMLAnchorElement).style.color =
                          "#6c7e7f";
                      }}
                    >
                      <ArrowLeft size={13} /> Back to CSR
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Notes sidebar */}
                <motion.div
                  initial={{ opacity: 0, x: 28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.1 }}
                >
                  {data.serviceNote && data.serviceNote.length > 0 && (
                    <div
                      style={{
                        background: "#F4F7F6",
                        borderRadius: "10px",
                        padding: "28px",
                        border: "1px solid rgba(108,126,127,0.12)",
                      }}
                    >
                      <p
                        className="font-xolonium"
                        style={{
                          fontSize: "11px",
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          color: "#6c7e7f",
                          marginBottom: "20px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span
                          style={{
                            width: "20px",
                            height: "2px",
                            background: "#6c7e7f",
                            display: "inline-block",
                            borderRadius: "1px",
                          }}
                        />
                        Key Highlights
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "16px",
                        }}
                      >
                        {data.serviceNote.map((note, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            style={{
                              background: "#fff",
                              borderRadius: "8px",
                              padding: "18px 20px",
                              border: "1px solid rgba(108,126,127,0.1)",
                              boxShadow: "0 2px 10px rgba(108,126,127,0.06)",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "12px",
                              }}
                            >
                              <CheckCircle
                                size={17}
                                style={{
                                  color: "#6c7e7f",
                                  flexShrink: 0,
                                  marginTop: "1px",
                                }}
                              />
                              <div>
                                <h4
                                  className="font-rising"
                                  style={{
                                    fontSize: "15px",
                                    color: "#1a2a2a",
                                    marginBottom: "5px",
                                  }}
                                >
                                  {note.note_title}
                                </h4>
                                <p
                                  className="font-xolonium"
                                  style={{
                                    fontSize: "12.5px",
                                    color: "#5a6e6e",
                                    lineHeight: 1.7,
                                    margin: 0,
                                  }}
                                >
                                  {note.note_description}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </section>

            {/* ── Gallery ── */}
            <GallerySection gallery={data.gallery} />

            {/* ── CTA ── */}
            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{
                background: "#6c7e7f",
                padding: "72px 20px",
                textAlign: "center",
              }}
            >
              <h2
                className="font-rising"
                style={{
                  fontSize: "clamp(26px,3vw,38px)",
                  color: "#fff",
                  marginBottom: "12px",
                }}
              >
                Want to Make a Difference?
              </h2>
              <p
                className="font-xolonium"
                style={{
                  color: "rgba(255,255,255,0.72)",
                  maxWidth: "420px",
                  margin: "0 auto 28px",
                  lineHeight: 1.75,
                  fontSize: "13.5px",
                }}
              >
                Join us in creating lasting impact for communities across
                Bangladesh.
              </p>
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="font-xolonium"
                style={{
                  display: "inline-block",
                  background: "#fff",
                  color: "#6c7e7f",
                  padding: "13px 36px",
                  borderRadius: "40px",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textDecoration: "none",
                  textTransform: "uppercase",
                }}
              >
                Get Involved
              </motion.a>
            </motion.section>
          </>
        )}
      </main>

      <Footer />

      <style>{`
        .csr-description p { margin-bottom: 14px; }
        .csr-description span { font-family: inherit !important; font-size: inherit !important; background: transparent !important; color: inherit !important; white-space: normal !important; }
        .csr-description i.fa { display: none; }
      `}</style>
    </>
  );
}
