"use client";

import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import PageHero from "@/components/HeroPage";
import Navbar from "@/components/Navbar";
import { getMediaItems, type MediaItem, type MediaType } from "@/lib/api/media";
import { useCallback, useEffect, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

// Provide fallback for missing environment variable
const STORAGE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "/storage";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Photos", value: "photo" },
  { label: "Videos", value: "video" },
  { label: "Press", value: "press" },
  { label: "Events", value: "event" },
] as const;

const SORT_OPTIONS = [
  { label: "Date (newest)", value: "date_desc" },
  { label: "Date (oldest)", value: "date_asc" },
  { label: "Title A-Z", value: "title_asc" },
  { label: "Default order", value: "sort_order" },
] as const;

const FEATURED_IN = [
  "The New York Times",
  "The Guardian",
  "NPR Books",
  "Lit Hub",
  "The Paris Review",
  "Publishers Weekly",
];

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build full media URL from relative path
 */
function getMediaUrl(item: MediaItem): string | null {
  if (!item.media_url) return null;
  if (item.media_url.startsWith("http")) return item.media_url;

  // Remove leading slashes and construct URL
  const cleanPath = item.media_url.replace(/^\/+/, "");
  const baseUrl = STORAGE_URL.replace(/\/$/, "");
  return `${baseUrl}/${cleanPath}`;
}

/**
 * Get human-readable label for media type
 */
function getTypeLabel(type: MediaType): string {
  const labels: Record<MediaType, string> = {
    photo: "Photo",
    video: "Video",
    press: "Press",
    event: "Event",
  };
  return labels[type] || type;
}

/**
 * Get gradient background based on accent color
 */
function getBackgroundGradient(item: MediaItem): string {
  const palettes: Record<string, string[]> = {
    "#C9A84C": ["#1a1508", "#2e2209", "#3d2f0a"],
    "#7C9A7E": ["#0a130a", "#0f1f10", "#152a16"],
    "#9B8BC4": ["#100e1a", "#181428", "#201a34"],
    "#C47C5A": ["#1a0e08", "#2e180f", "#3d2115"],
  };

  const color = item.accent_color || "#C9A84C";
  const stops = palettes[color] || palettes["#C9A84C"];
  return `radial-gradient(ellipse at 30% 40%, ${stops[1]} 0%, ${stops[0]} 60%, ${stops[2]} 100%)`;
}

/**
 * Sort items based on selected sort option
 */
function sortItems(items: MediaItem[], sortBy: string): MediaItem[] {
  const sorted = [...items];

  switch (sortBy) {
    case "date_desc":
      return sorted.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    case "date_asc":
      return sorted.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
    case "title_asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "sort_order":
      return sorted.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    default:
      return sorted;
  }
}

/**
 * Get statistics about media items
 */
function getMediaStats(items: MediaItem[]) {
  return {
    total: items.length,
    photo: items.filter((i) => i.type === "photo").length,
    video: items.filter((i) => i.type === "video").length,
    press: items.filter((i) => i.type === "press").length,
    event: items.filter((i) => i.type === "event").length,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON LOADER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      style={{
        borderRadius: 8,
        overflow: "hidden",
        aspectRatio: "4/3",
        background:
          "linear-gradient(135deg, #1a1a1a 0%, #222 50%, #1a1a1a 100%)",
        border: "1px solid rgba(255,255,255,0.04)",
        animation: "skeleton-pulse 1.6s ease-in-out infinite",
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MEDIA CARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface MediaCardProps {
  item: MediaItem;
  delay: number;
  onClick: () => void;
}

function MediaCard({ item, delay, onClick }: MediaCardProps) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const mediaUrl = getMediaUrl(item);

  // Check if this is a text-only press item
  const isTextPress =
    item.type === "press" &&
    (!mediaUrl || imgError) &&
    (item.press_url || item.description);

  const typeLabel = getTypeLabel(item.type);

  return (
    <AnimatedSection delay={delay}>
      <div
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          borderRadius: 8,
          overflow: "hidden",
          cursor: "pointer",
          aspectRatio:
            item.aspect_ratio || (item.type === "press" ? "1/1.2" : "4/3"),
          background: getBackgroundGradient(item),
          border: `1px solid rgba(255,255,255,${hovered ? 0.15 : 0.05})`,
          transition: "all 0.3s ease",
          transform: hovered ? "scale(1.02)" : "scale(1)",
          boxShadow: hovered
            ? "0 20px 40px rgba(201,168,76,0.15)"
            : "0 8px 24px rgba(0,0,0,0.3)",
        }}
      >
        {/* Grid overlay */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.1,
            pointerEvents: "none",
          }}
        >
          <defs>
            <pattern
              id={`grid-${item.id}`}
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 32 0 L 0 0 0 32"
                fill="none"
                stroke={item.accent_color || "#C9A84C"}
                strokeWidth="0.4"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-${item.id})`} />
        </svg>

        {/* Media Content */}
        {!isTextPress && mediaUrl && !imgError ? (
          item.type === "video" ? (
            <video
              src={mediaUrl}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              muted
              preload="metadata"
              onError={() => setImgError(true)}
            />
          ) : (
            <img
              src={mediaUrl}
              alt={item.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={() => setImgError(true)}
              loading="lazy"
            />
          )
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              padding: "32px 24px",
              textAlign: "center",
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)",
            }}
          >
            <div style={{ fontSize: 42, marginBottom: 16, opacity: 0.7 }}>
              📰
            </div>
          </div>
        )}

        {/* Top meta */}

        {/* Featured badge */}

        {/* Bottom content */}

        {/* Video play icon */}
        {item.type === "video" && !imgError && mediaUrl && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.6)",
              border: `1.5px solid ${item.accent_color || "#C9A84C"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(4px)",
              pointerEvents: "none",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill={item.accent_color || "#C9A84C"}
            >
              <path d="M4 2.5L11.5 7L4 11.5V2.5Z" />
            </svg>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LIGHTBOX COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface LightboxProps {
  item: MediaItem;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function Lightbox({ item, onClose, onPrev, onNext }: LightboxProps) {
  const mediaUrl = getMediaUrl(item);
  const [error, setError] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.96)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 900,
          width: "100%",
          maxHeight: "90vh",
          background: "#0f0f0f",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 16,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Media area */}
        <div
          style={{
            aspectRatio: item.type === "press" ? "auto" : "16/9",
            minHeight: 300,
            background: getBackgroundGradient(item),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            flex: item.type === "press" ? "0 0 auto" : 1,
          }}
        >
          {item.type === "press" && item.press_url ? (
            <iframe
              src={item.press_url}
              style={{
                width: "100%",
                height: "60vh",
                minHeight: 400,
                border: "none",
              }}
              title={item.title}
            />
          ) : mediaUrl && !error ? (
            item.type === "video" ? (
              <video
                src={mediaUrl}
                controls
                autoPlay
                playsInline
                style={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
                onError={() => setError(true)}
              />
            ) : (
              <img
                src={mediaUrl}
                alt={item.title}
                style={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
                onError={() => setError(true)}
              />
            )
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: 60,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              <div style={{ fontSize: 64, marginBottom: 16 }}>📄</div>
              {item.press_url ? (
                <a
                  href={item.press_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: item.accent_color || "#C9A84C",
                    textDecoration: "none",
                    borderBottom: `1px solid ${item.accent_color || "#C9A84C"}`,
                  }}
                >
                  Open original article →
                </a>
              ) : item.description ? (
                <div
                  style={{
                    maxWidth: 500,
                    textAlign: "left",
                    padding: 20,
                    background: "rgba(0,0,0,0.4)",
                    borderRadius: 8,
                  }}
                >
                  <p>{item.description}</p>
                </div>
              ) : (
                "No preview available"
              )}
            </div>
          )}
        </div>

        {/* Content area */}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function MediaGalleryPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getMediaItems(
        activeFilter !== "all" ? { type: activeFilter as MediaType } : {},
      );
      setItems(res.data || []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load media";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const stats = getMediaStats(items);
  const sortedItems = sortItems(items, sortBy);

  const lightboxIndex = lightboxItem
    ? sortedItems.findIndex((i) => i.id === lightboxItem.id)
    : -1;

  const openNext = () => {
    if (lightboxIndex < sortedItems.length - 1) {
      setLightboxItem(sortedItems[lightboxIndex + 1]);
    }
  };

  const openPrev = () => {
    if (lightboxIndex > 0) {
      setLightboxItem(sortedItems[lightboxIndex - 1]);
    }
  };

  return (
    <>
      <style>{`
                @keyframes skeleton-pulse {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 1; }
                }
                .container {
                    max-width: 1280px;
                    margin: 0 auto;
                    padding: 0 24px;
                }
                .btn-outline {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 20px;
                    border: 1px solid rgba(201, 168, 76, 0.3);
                    border-radius: 4px;
                    font-size: 12px;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    color: #C9A84C;
                    background: transparent;
                    transition: all 0.2s ease;
                    text-decoration: none;
                    cursor: pointer;
                }
                .btn-outline:hover {
                    border-color: #C9A84C;
                    background: rgba(201, 168, 76, 0.05);
                }
                @media (max-width: 768px) {
                    .container {
                        padding: 0 16px;
                    }
                }
            `}</style>

      <Navbar />

      {/* Hero Section */}
      <PageHero title="Media & Gallery" currentPage="Media" />

      {/* Gallery Section */}
      <section style={{ background: "#F4F7F6", padding: "64px 0 120px" }}>
        <div className="container">
          <AnimatedSection>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 48,
                gap: 16,
                fontFamily: "Xolonium",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                {FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setActiveFilter(f.value)}
                    style={{
                      padding: "8px 20px",
                      borderRadius: 100,
                      border: "1px solid",
                      borderColor:
                        activeFilter === f.value ? "#C9A84C" : "#6c7e7f",
                      background:
                        activeFilter === f.value ? "#6c7e7f" : "transparent",
                      color: activeFilter === f.value ? "#fff" : "#6c7e7f",
                      fontSize: 12,
                      letterSpacing: "0.06em",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      fontWeight: activeFilter === f.value ? 500 : 400,
                    }}
                  >
                    {f.label}{" "}
                    <span
                      style={{
                        fontSize: 10,
                        opacity: 0.7,
                        marginLeft: 6,
                      }}
                    >
                      {stats[f.value as keyof typeof stats] || 0}
                    </span>
                  </button>
                ))}
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: "#6c7e7f",
                  border: "1px solid #fff",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: 6,
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </AnimatedSection>

          {error && (
            <div
              style={{
                padding: 24,
                background: "rgba(220,50,50,0.1)",
                border: "1px solid rgba(220,50,50,0.25)",
                borderRadius: 12,
                marginBottom: 32,
                textAlign: "center",
              }}
            >
              <span style={{ color: "#ff6b6b" }}>⚠ {error}</span>
              <button
                onClick={fetchItems}
                style={{
                  marginLeft: 20,
                  background: "none",
                  border: "1px solid rgba(255,255,255,0.2)",
                  padding: "6px 16px",
                  borderRadius: 4,
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div style={{ columns: "3 280px", columnGap: 24 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    breakInside: "avoid",
                    marginBottom: 24,
                  }}
                >
                  <SkeletonCard />
                </div>
              ))}
            </div>
          ) : sortedItems.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "100px 20px",
                color: "rgba(255,255,255,0.35)",
                fontSize: 15,
              }}
            >
              No {activeFilter !== "all" ? ` ${activeFilter}` : ""} items found.
              Try another filter.
            </div>
          ) : (
            <div style={{ columns: "3 280px", columnGap: 24 }}>
              {sortedItems.map((item, i) => (
                <div
                  key={item.id}
                  style={{
                    breakInside: "avoid",
                    marginBottom: 24,
                  }}
                >
                  <MediaCard
                    item={item}
                    delay={Math.min(i * 0.05, 0.6)}
                    onClick={() => setLightboxItem(item)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {lightboxItem && (
        <Lightbox
          item={lightboxItem}
          onClose={() => setLightboxItem(null)}
          onPrev={openPrev}
          onNext={openNext}
        />
      )}

      <Footer />
    </>
  );
}
