"use client";

import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

/* ─── Types ─── */
interface SliderImage {
  original: string;
  small: string;
  medium: string;
  large: string;
}

interface SliderItem {
  id: number;
  type: number | null;
  media_type: string | null;
  video: string | null;
  title: string;
  sub_title: string;
  url: string | null;
  image: string | null;
  status: string;
}

/* ─── Env ─── */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const IMG_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "";

const AUTO_PLAY_INTERVAL = 6000;

/* ─── Helpers ─── */
function parseImage(raw: string | null): SliderImage | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SliderImage;
  } catch {
    return null;
  }
}

/* ─── Component ─── */
export default function Hero() {
  const [slides, setSlides] = useState<SliderItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [transitioning, setTransitioning] = useState(false);
  const [muted, setMuted] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [textVisible, setTextVisible] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

  /* ── Fetch slides ── */
  useEffect(() => {
    fetch(`${API_BASE}/sliders`)
      .then((r) => r.json())
      .then((json) => {
        if (json?.data?.length) {
          setSlides(json.data);
          setTimeout(() => {
            setLoaded(true);
            setTimeout(() => setTextVisible(true), 400);
          }, 200);
        }
      })
      .catch(console.error);
  }, []);

  /* ── Progress bar ── */
  const startProgress = useCallback(() => {
    setProgress(0);
    const step = 100 / (AUTO_PLAY_INTERVAL / 50);
    let val = 0;
    progressRef.current && clearInterval(progressRef.current);
    progressRef.current = setInterval(() => {
      val += step;
      setProgress(Math.min(val, 100));
      if (val >= 100) clearInterval(progressRef.current!);
    }, 50);
  }, []);

  /* ── Transition helper ── */
  const goTo = useCallback(
    (nextIdx: number, dir: "next" | "prev") => {
      if (transitioning || nextIdx === current) return;
      setTextVisible(false);
      setTimeout(() => {
        setDirection(dir);
        setPrev(current);
        setCurrent(nextIdx);
        setTransitioning(true);
        setTimeout(() => {
          setPrev(null);
          setTransitioning(false);
          setTextVisible(true);
        }, 800);
      }, 150);
      startProgress();
    },
    [current, transitioning, startProgress],
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length, "next");
  }, [current, slides.length, goTo]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length, "prev");
  }, [current, slides.length, goTo]);

  /* ── Auto-advance ── */
  useEffect(() => {
    if (!slides.length) return;
    startProgress();
    intervalRef.current = setInterval(next, AUTO_PLAY_INTERVAL);
    return () => {
      clearInterval(intervalRef.current!);
      clearInterval(progressRef.current!);
    };
  }, [slides.length, next, startProgress]);

  /* ── Mute toggle propagation ── */
  useEffect(() => {
    videoRefs.current.forEach((v) => {
      v.muted = muted;
    });
  }, [muted]);

  /* ── Keyboard ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, goPrev]);

  /* ── Loading skeleton ── */
  if (!slides.length) {
    return (
      <section style={styles.root}>
        <div style={styles.skeleton}>
          <div style={styles.skeletonGlow} />
          <div style={styles.skeletonLines}>
            <div
              style={{ ...styles.skeletonLine, width: "60%", height: "14px" }}
            />
            <div
              style={{
                ...styles.skeletonLine,
                width: "40%",
                height: "48px",
                marginTop: "16px",
              }}
            />
            <div
              style={{
                ...styles.skeletonLine,
                width: "80%",
                height: "20px",
                marginTop: "20px",
              }}
            />
          </div>
        </div>
        <style>{skeletonCSS}</style>
      </section>
    );
  }

  const slide = slides[current];
  const prevSlide = prev !== null ? slides[prev] : null;

  return (
    <>
      <section style={styles.root}>
        {/* ── Slide layers ── */}
        {slides.map((s, i) => {
          const isActive = i === current;
          const isPrev = i === prev;
          if (!isActive && !isPrev) return null;

          const img = parseImage(s.image);
          const isVideo = s.media_type === "video" && !!s.video;

          return (
            <div
              key={s.id}
              style={{
                ...styles.slideLayer,
                zIndex: isActive ? 2 : 1,
                animation: isActive
                  ? `${direction === "next" ? "slideInRight" : "slideInLeft"} 0.9s cubic-bezier(0.16,1,0.3,1) forwards`
                  : isPrev
                    ? `${direction === "next" ? "slideOutLeft" : "slideOutRight"} 0.9s cubic-bezier(0.16,1,0.3,1) forwards`
                    : "none",
              }}
            >
              {isVideo ? (
                <video
                  ref={(el) => {
                    if (el) videoRefs.current.set(s.id, el);
                    else videoRefs.current.delete(s.id);
                  }}
                  src={`${IMG_BASE}${s.video}`}
                  autoPlay
                  loop
                  muted={muted}
                  playsInline
                  style={styles.media}
                />
              ) : img ? (
                <img
                  src={`${IMG_BASE}${img.large || img.original}`}
                  alt={s.title}
                  style={styles.media}
                />
              ) : (
                <div style={styles.fallbackBg} />
              )}
            </div>
          );
        })}

        {/* ── Noise grain overlay ── */}
        <div style={styles.grain} />

        <div style={styles.content}>
          {/* ── Bottom bar ── */}
          <div style={styles.bottomBar}>
            {/* Dots */}
            <div style={styles.dots}>
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > current ? "next" : "prev")}
                  style={{
                    ...styles.dot,
                    width: i === current ? "32px" : "6px",
                    background:
                      i === current ? "#82c3d8" : "rgba(255,255,255,0.3)",
                    transition: "all 0.4s ease",
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Controls */}
            <div style={styles.controls}>
              {slide.media_type === "video" && (
                <button
                  style={styles.controlBtn}
                  onClick={() => setMuted((m) => !m)}
                  aria-label="Toggle mute"
                >
                  {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              )}
              <button
                style={styles.controlBtn}
                onClick={goPrev}
                aria-label="Previous slide"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                style={styles.controlBtn}
                onClick={next}
                aria-label="Next slide"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Progress line */}
          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressBar,
                width: `${progress}%`,
                transition: progress === 0 ? "none" : "width 0.05s linear",
              }}
            />
          </div>
        </div>

        {/* ── Thumbnail strip (desktop) ── */}
        <div style={styles.thumbnailStrip}>
          {slides.map((s, i) => {
            const img = parseImage(s.image);
            return (
              <button
                key={s.id}
                onClick={() => goTo(i, i > current ? "next" : "prev")}
                style={{
                  ...styles.thumbnail,
                  opacity: i === current ? 1 : 0.45,
                  border:
                    i === current
                      ? "2px solid #82c3d8"
                      : "2px solid transparent",
                  transform: i === current ? "scale(1)" : "scale(0.94)",
                }}
              >
                {s.media_type === "video" && s.video ? (
                  <video
                    src={`${IMG_BASE}${s.video}`}
                    muted
                    style={styles.thumbnailMedia}
                  />
                ) : img ? (
                  <img
                    src={`${IMG_BASE}${img.small || img.original}`}
                    alt={s.title}
                    style={styles.thumbnailMedia}
                  />
                ) : (
                  <div
                    style={{ ...styles.thumbnailMedia, background: "#648181" }}
                  />
                )}
                <div style={styles.thumbnailOverlay}>
                  <span style={styles.thumbnailTitle}>{s.title}</span>
                </div>
              </button>
            );
          })}
        </div>

        <style>{css}</style>
      </section>
    </>
  );
}

/* ─── Styles ─── */
const styles: Record<string, React.CSSProperties> = {
  root: {
    position: "relative",
    width: "100%",
    height: "100vh",
    minHeight: "600px",
    overflow: "hidden",
    background: "#F4F7F6",
    fontFamily: "var(--font-sans, sans-serif)",
  },
  slideLayer: {
    position: "absolute",
    inset: 0,
    willChange: "transform, opacity",
  },
  media: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    marginTop: "20px",
    objectPosition: "center",
  },
  fallbackBg: {
    width: "100%",
    height: "100%",
    background: "#fff",
  },
  overlayBottom: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(5,10,15,0.96) 0%, rgba(5,10,15,0.6) 40%, rgba(5,10,15,0.1) 70%, transparent 100%)",
  },
  overlayLeft: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to right, rgba(5,10,15,0.85) 0%, rgba(5,10,15,0.4) 50%, transparent 100%)",
  },
  overlayTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "160px",
    background:
      "linear-gradient(to bottom, rgba(5,10,15,0.7) 0%, transparent 100%)",
  },
  grain: {
    position: "absolute",
    inset: 0,
    zIndex: 3,
    pointerEvents: "none",
    opacity: 0.04,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
    backgroundSize: "200px 200px",
  },
  grid: {
    position: "absolute",
    inset: 0,
    zIndex: 3,
    pointerEvents: "none",
    backgroundImage:
      "linear-gradient(rgba(130,195,216,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(130,195,216,0.03) 1px, transparent 1px)",
    backgroundSize: "80px 80px",
  },
  content: {
    position: "absolute",
    inset: 0,
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: "clamp(24px,5vw,64px)",
    paddingTop: "0",
  },
  counter: {
    position: "absolute",
    top: "clamp(100px,14vh,130px)",
    right: "clamp(24px,5vw,64px)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  counterCurrent: {
    fontFamily: "var(--font-display, serif)",
    fontSize: "56px",
    lineHeight: 1,
    color: "#82c3d8",
    fontWeight: 300,
    letterSpacing: "-0.02em",
  },
  counterDivider: {
    width: "1px",
    height: "40px",
    background: "rgba(130,195,216,0.3)",
    transform: "rotate(20deg)",
  },
  counterTotal: {
    fontSize: "18px",
    color: "rgba(255,255,255,0.3)",
    fontWeight: 400,
    letterSpacing: "0.05em",
  },
  textBlock: {
    maxWidth: "680px",
    marginBottom: "clamp(100px, 14vh, 140px)",
  },
  eyebrow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#82c3d8",
    marginBottom: "16px",
  },
  eyebrowDot: {
    display: "inline-block",
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#82c3d8",
    boxShadow: "0 0 8px #82c3d8",
  },
  title: {
    fontFamily: "var(--font-display, serif)",
    fontSize: "clamp(42px,7vw,96px)",
    lineHeight: 1.02,
    color: "#fff",
    margin: 0,
    letterSpacing: "-0.02em",
    perspective: "800px",
    transformStyle: "preserve-3d",
  },
  subtitle: {
    fontSize: "clamp(14px,1.4vw,18px)",
    color: "rgba(255,255,255,0.6)",
    lineHeight: 1.7,
    marginTop: "16px",
    maxWidth: "500px",
  },
  ctas: {
    display: "flex",
    gap: "16px",
    marginTop: "28px",
    flexWrap: "wrap",
  },
  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "#82c3d8",
    color: "#040d12",
    padding: "13px 26px",
    borderRadius: "3px",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    textDecoration: "none",
    transition: "all 0.3s ease",
  },
  bottomBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "8px",
  },
  dots: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  dot: {
    height: "6px",
    borderRadius: "3px",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  controls: {
    display: "flex",
    alignItems: "center",
    marginTop: "6px",
    gap: "8px",
  },
  controlBtn: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "1px solid rgba(130,195,216,0.25)",
    background: "rgba(130,195,216,0.06)",
    color: "rgba(255,255,255,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.25s ease",
    backdropFilter: "blur(8px)",
  },
  progressTrack: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "rgba(255,255,255,0.08)",
  },

  thumbnailStrip: {
    position: "absolute",
    right: "clamp(24px,5vw,64px)",
    bottom: "100px",
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  thumbnail: {
    width: "100px",
    height: "64px",
    borderRadius: "4px",
    overflow: "hidden",
    cursor: "pointer",
    position: "relative",
    background: "transparent",
    padding: 0,
    transition: "all 0.3s ease",
  },
  thumbnailMedia: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  thumbnailOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "flex-end",
    padding: "6px",
  },
  thumbnailTitle: {
    fontSize: "9px",
    color: "rgba(255,255,255,0.8)",
    letterSpacing: "0.04em",
    fontWeight: 600,
    textTransform: "uppercase",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  } as React.CSSProperties,
  skeleton: {
    width: "100%",
    height: "100%",
    background: "#080c10",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: "64px",
    position: "relative",
  },
  skeletonGlow: {
    position: "absolute",
    top: "30%",
    left: "10%",
    width: "300px",
    height: "300px",
    background:
      "radial-gradient(circle, rgba(130,195,216,0.06) 0%, transparent 70%)",
    borderRadius: "50%",
    animation: "skeletonPulse 2s ease infinite",
  },
  skeletonLines: {
    position: "relative",
    zIndex: 1,
  },
  skeletonLine: {
    borderRadius: "4px",
    background: "rgba(130,195,216,0.08)",
    animation: "skeletonPulse 1.8s ease infinite",
  },
};

/* ─── CSS ─── */
const css = `
  @keyframes slideInRight {
    from { transform: translateX(6%) scale(1.03); opacity: 0.6; }
    to   { transform: translateX(0)  scale(1);    opacity: 1; }
  }
  @keyframes slideOutLeft {
    from { transform: translateX(0)  scale(1);    opacity: 1; }
    to   { transform: translateX(-6%) scale(0.97); opacity: 0; }
  }
  @keyframes slideInLeft {
    from { transform: translateX(-6%) scale(1.03); opacity: 0.6; }
    to   { transform: translateX(0)   scale(1);    opacity: 1; }
  }
  @keyframes slideOutRight {
    from { transform: translateX(0)  scale(1);    opacity: 1; }
    to   { transform: translateX(6%) scale(0.97); opacity: 0; }
  }
  button:hover > div[style*="controlBtn"] { background: rgba(130,195,216,0.15) !important; }
  a[style*="btnPrimary"]:hover {
    background: #a8d8e8 !important;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(130,195,216,0.25);
  }
  @media (max-width: 768px) {
    /* hide thumbnails & counter on mobile */
  }
`;

const skeletonCSS = `
  @keyframes skeletonPulse {
    0%,100% { opacity: 0.5; } 50% { opacity: 1; }
  }
`;
