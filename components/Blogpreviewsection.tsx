"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const IMG_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "";

interface BlogPost {
  id: number;
  title: string;
  slug: string;

  short_description?: string;
  description?: string;

  image?: string | null;
  thumbnail?: string | null;

  category?: {
    id: number;
    title: string;
  };

  readingTime?: string | number | null;

  created_at?: string;
  updated_at?: string;

  published_at?: string;
}


function parseImage(raw: string | null | undefined): string | null {
  if (!raw) return null;
  return raw;
}

const fadeUp = {
    hidden: { opacity: 0, y: 36 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };

const charFall = {
    hidden: { opacity: 0, y: -60 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] },
    },
};

const headingContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.045 } },
};

function FallChars({ text, style }: { text: string; style?: React.CSSProperties }) {
    return (
        <>
            {text.split("").map((ch, i) => (
                <motion.span
                    key={i}
                    variants={charFall}
                    style={{ display: "inline-block", whiteSpace: "pre", ...style }}
                >
                    {ch}
                </motion.span>
            ))}
        </>
    );
}


function BlogCard({ post, delay }: { post: BlogPost; delay: number }) {
  const imgPath = parseImage(post.image ?? post.thumbnail);
  const imgSrc = imgPath ? `${IMG_BASE}${imgPath}` : null;
  const date = post.published_at ?? post.created_at;
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <motion.div
      variants={fadeUp}
      className="blog-card"
      style={{
        background: "#ffffff",
        border: "2px solid #e5e7eb",

        overflow: "hidden",
        transition: "all 0.3s ease",
        display: "flex",
          opacity: 1,
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <Link
        href={`/blog/${post.slug}`}
        style={{ display: "block", overflow: "hidden" }}
      >
        <div
          style={{
            aspectRatio: "16/9",
            overflow: "hidden",
            background: "linear-gradient(135deg, #6c7e7f22, #9aa6aa22)",
            position: "relative",
          }}
        >
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={post.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.5s ease",
              }}
              className="blog-img"
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #6c7e7f18, #95a49a18)",
              }}
            >
              <span style={{ fontSize: 40 }}>📚</span>
            </div>
          )}
          {/* Category badge */}
          {/* {post.category?.title && (
            <div
              style={{
                position: "absolute",
                top: 14,
                left: 14,
                background: "#6c7e7f",
                color: "#fff",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "4px 12px",
                borderRadius: 20,
              }}
            >
              {post.category.title}
            </div>
          )} */}
        </div>
      </Link>

      {/* Content */}
      <div
        style={{
          padding: "24px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="font-xolonium"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 14,
          }}
        >
          {formattedDate && (
            <span style={{ fontSize: 11, color: "#9aa6aa", fontWeight: 500 }}>
              {formattedDate}
            </span>
          )}
          {post.readingTime && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 11,
                color: "#9aa6aa",
              }}
            >
              <Clock size={11} /> {post.readingTime} min read
            </span>
          )}
        </div>

        <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
          <h3
            className="blog-title"
            style={{
              fontFamily: "'Venus Rising'",
              fontSize: 18,
              fontWeight: 600,
              color: "#1f2937",
              lineHeight: 1.3,
              marginBottom: 12,
              transition: "color 0.2s",
            }}
          >
            {post.title}
          </h3>
        </Link>

        <p
          className="font-xolonium"
          style={
            {
              fontSize: 14,
              color: "#6b7280",
              lineHeight: 1.75,
              flex: 1,
              marginBottom: 20,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            } as React.CSSProperties
          }
        >
          {post.short_description ?? ""}
        </p>

        <Link
          href={`/blog/${post.slug}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            fontWeight: 700,
            color: "#6c7e7f",
            textDecoration: "none",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            transition: "gap 0.2s",
          }}
          className="blog-readmore font-xolonium"
        >
          Read Article <ArrowRight size={12} />
        </Link>
      </div>
    </motion.div>
  );
}

export default function BlogPreviewSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/blog?limit=3`)
      .then((r) => r.json())
      .then((json) => {
        const data = json?.data ?? json;
        if (Array.isArray(data)) setPosts(data.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const displayPosts =
    posts.length > 0
      ? posts
      : [
          {
            id: 1,
            title: "How to Build a Success Mindset from Scratch",
            slug: "success-mindset",
            category: "Mindset",
            excerpt:
              "Success starts in the mind. Discover the mental frameworks that separate achievers from dreamers in every field of life.",
            reading_time: 6,
          },
          {
            id: 2,
            title:
              "The Psychology of Entrepreneurship: Thinking Like a Founder",
            slug: "entrepreneurship-psychology",
            category: "Business",
            excerpt:
              "Understanding the unique mental patterns of successful entrepreneurs and how you can develop them in your own journey.",
            reading_time: 8,
          },
          {
            id: 3,
            title: "Why Reading Books Is Still the Best Investment in 2024",
            slug: "reading-books-investment",
            category: "Personal Growth",
            excerpt:
              "In an age of reels and podcasts, the power of deep reading remains unmatched. Here is why every leader reads.",
            reading_time: 5,
          },
        ];

  return (
    <section style={{ background: "#ffffff", padding: "100px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <motion.span
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={headingContainer}
            className="font-xolonium"
            style={{
              display: "inline-block",

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
              <FallChars text=" From The Blog " />

          </motion.span>
            <motion.h2
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={headingContainer}
                style={{
                    fontFamily: "'Venus Rising'",
                    fontSize: "clamp(24px, 4vw, 44px)",
                    color: "#1f2937",
                    margin: 0,
                    lineHeight: 1.1,
                }}
            >
                <FallChars text="Ideas That " />
                <FallChars
                    text="Spark Growth"
                    style={{ color: "#6c7e7f", fontStyle: "italic" }}
                />
            </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="blog-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 28,
          }}
        >
          {loading
            ? [1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    background: "#f8f9fa",
                    borderRadius: 16,
                    aspectRatio: "3/4",
                    opacity: 0.5,
                  }}
                />
              ))
            : displayPosts.map((post, i) => (
                <BlogCard
                  key={post.id}
                  post={post as BlogPost}
                  delay={i * 0.1}
                />
              ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          style={{ textAlign: "center", marginTop: 56 }}
        >
          <Link
            href="/blog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: "2px solid #6c7e7f",
              color: "#6c7e7f",
              padding: "13px 30px",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "all 0.25s",
            }}
            className="blog-cta font-xolonium"
          >
            View All Articles <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>

      <style>{`
        .blog-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 48px rgba(108,126,127,0.12);
          border-color: #95a49a !important;
        }
        .blog-card:hover .blog-img { transform: scale(1.06); }
        .blog-card:hover .blog-title { color: #6c7e7f !important; }
        .blog-readmore:hover { gap: 10px !important; }
        .blog-cta:hover { background: #6c7e7f !important; color: #fff !important; transform: translateY(-2px); }
        @media (max-width: 900px) { .blog-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) { .blog-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
