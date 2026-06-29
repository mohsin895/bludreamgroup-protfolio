"use client";

import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import PageHero from "@/components/HeroPage";
import Navbar from "@/components/Navbar";
import {
  fetchBlogBySlug,
  fetchBlogs,
  type MappedBlog,
  type MappedWriter,
} from "@/lib/api/blog";
import { AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// ─── Reading progress ─────────────────────────────────────────────────────────

function useReadingProgress() {
  useEffect(() => {
    function update() {
      const article = document.getElementById("article-body");
      const bar = document.getElementById("reading-bar");
      if (!article || !bar) return;
      const { top, height } = article.getBoundingClientRect();
      const scrolled = Math.max(0, -top);
      const pct = Math.min(
        100,
        (scrolled / (height - window.innerHeight)) * 100,
      );
      bar.style.width = pct + "%";
    }
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
}

// ─── Hero image ───────────────────────────────────────────────────────────────

function HeroImage({ url, title }: { url: string | null; title: string }) {
  const [err, setErr] = useState(false);
  if (!url || err) return null;
  return (
    <div
      style={{
        width: "100%",
        height: "320px",
        overflow: "hidden",
        marginBottom: "48px",
        borderRadius: "2px",
      }}
    >
      <Image
        src={url}
        alt={title}
        width={800}
        height={320}
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
        onError={() => setErr(true)}
        priority
      />
    </div>
  );
}

// ─── Writer avatar ────────────────────────────────────────────────────────────

function WriterAvatar({
  writer,
  size = 38,
}: {
  writer: MappedWriter;
  size?: number;
}) {
  const [err, setErr] = useState(false);
  const showImg = writer.imageUrl && !err;
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: showImg
          ? "transparent"
          : "linear-gradient(135deg,#b8933a,#7a5f1e)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
        fontSize: `${Math.round(size * 0.33)}px`,
        fontWeight: 600,
        color: "#fff",
        letterSpacing: "0.05em",
      }}
    >
      {showImg ? (
        <Image
          src={writer.imageUrl!}
          alt={writer.name}
          width={size}
          height={size}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
          onError={() => setErr(true)}
        />
      ) : (
        writer.initials
      )}
    </div>
  );
}

// ─── Related card ─────────────────────────────────────────────────────────────

function RelatedCard({ post, i }: { post: MappedBlog; i: number }) {
  return (
    <AnimatedSection delay={i * 0.08}>
      <Link
        href={`/blog/${post.slug}`}
        className="related-card"
        style={{ display: "flex" }}
      >
        <span className="related-card-tag font-xolonium">{post.tag}</span>
        <span className="related-card-title font-rising">{post.title}</span>
        <div className="related-card-meta font-xolonium">
          <span>{post.date}</span>
          <span>{post.readTime}</span>
        </div>
        <span className="related-card-arrow">→</span>
      </Link>
    </AnimatedSection>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogDetailPage() {
  const params = useParams();
  const slug =
    typeof params?.slug === "string"
      ? params.slug
      : Array.isArray(params?.slug)
        ? params.slug[0]
        : "";

  const [post, setPost] = useState<MappedBlog | null>(null);
  const [related, setRelated] = useState<MappedBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useReadingProgress();

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [p, all] = await Promise.all([
          fetchBlogBySlug(slug),
          fetchBlogs(),
        ]);
        if (!p) {
          setError("Post not found.");
          return;
        }
        setPost(p);
        // Related: same category, different post, max 2
        setRelated(
          all
            .filter((b) => b.id !== p.id && b.category === p.category)
            .slice(0, 2),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load post.");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const primaryWriter = post?.writers?.[0] ?? null;

  return (
    <>
      <style>{`
       
        :root {
          --ink:#E3EFF1; --parchment:#F4F7F6; --gold:#b8933a;
          --gold-light:rgba(184,147,58,0.13); --muted:#7a7369;
          --border:rgba(14,13,11,0.1); --reading-col:980px;
        }
        background:var(--parchment); color:var(--ink); margin:0; }

        #reading-bar-track { position:fixed; top:0; left:0; right:0; height:2px; z-index:200; }
        #reading-bar { height:100%; width:0%; background:var(--gold); transition:width 0.1s linear; }

        .detail-hero { background:var(--ink); padding:60px 24px 0; position:relative; overflow:hidden; }
        .detail-hero::before {
          content:''; position:absolute; top:0; left:0; right:0; bottom:0;
          background:radial-gradient(ellipse 60% 50% at 70% 40%,rgba(184,147,58,0.06) 0%,transparent 70%);
          pointer-events:none;
        }
        .hero-inner { max-width:var(--reading-col); margin:0 auto; }
        .detail-breadcrumb { display:flex; align-items:center; gap:8px; font-size:12px; color:rgba(255,255,255,0.3); letter-spacing:0.05em; margin-bottom:36px; }
        .detail-breadcrumb a { color:rgba(255,255,255,0.3); text-decoration:none; transition:color 0.2s; }
        .detail-breadcrumb a:hover { color:var(--gold); }
        .detail-tag { display:inline-block; font-size:10px; font-weight:500; letter-spacing:0.18em; text-transform:uppercase; color:var(--gold); border:1px solid rgba(184,147,58,0.3); padding:4px 10px; border-radius:2px; margin-bottom:24px; }
        .detail-title {  font-size:clamp(36px,5.5vw,64px); color:#fff; line-height:1.1; font-weight:600; margin:0 0 18px; }
        .detail-subtitle {  font-style:italic; font-size:clamp(17px,2vw,22px); color:rgba(255,255,255,0.45); font-weight:400; margin:0 0 48px; line-height:1.5; }
        .detail-meta-row { display:flex; align-items:center; gap:24px; padding:24px 0; border-top:1px solid rgba(255,255,255,0.08); flex-wrap:wrap; }
        .author-chip { display:flex; align-items:center; gap:12px; }
        .author-name { font-size:13px; font-weight:500; color:rgba(255,255,255,0.85); }
        .author-role { font-size:11px; color:rgba(255,255,255,0.3); margin-top:1px; }
        .meta-divider { width:1px; height:28px; background:rgba(255,255,255,0.1); }
        .meta-item { font-size:12px; color:rgba(255,255,255,0.3); letter-spacing:0.04em; }
        .hero-notch { height:48px; background:var(--ink); clip-path:polygon(0 0,100% 0,100% 30%,0 100%); margin-bottom:-1px; }

        .article-wrap { background:#F4F7F6; padding:42px 24px 80px; }
        .article-inner { max-width:var(--reading-col); margin:0 auto; }
        .article-p {  font-size:18px; font-family: "Xolonium"; font-weight:300; line-height:1.85; color:#fff; margin:0 0 28px; }
        .article-h2 {  font-size:26px; font-weight:600; color:#000; margin:52px 0 20px; line-height:1.25; }
        .article-h2::before { content:''; display:block; width:32px; height:2px; background:var(--gold); margin-bottom:14px; }
        .article-pullquote { border-left:3px solid var(--gold); padding:4px 0 4px 28px; margin:48px 0; }
        .article-pullquote p {  font-style:italic; font-size:clamp(20px,2.8vw,26px); color:var(--ink); line-height:1.5; font-weight:400; margin:0; }

        .share-strip { max-width:var(--reading-col); margin:0 auto; padding:32px 0; border-top:1px solid var(--border); border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px; }
        .share-label { font-size:12px; letter-spacing:0.12em; text-transform:uppercase; color:#000; font-weight:500; }
        .share-btns { display:flex; gap:8px; flex-wrap:wrap; }
        .share-btn { display:inline-flex; align-items:center; gap:7px; padding:8px 16px; background:transparent; border:1px solid #6FB3C8; border-radius:2px; font-size:12px; font-weight:500; color:var(--muted);  cursor:pointer; letter-spacing:0.05em; transition:all 0.18s; text-decoration:none; }
        .share-btn:hover { border-color:#6FB3C8; color:#000; }

        .author-card { max-width:var(--reading-col); margin:64px auto 0; background:#6FB3C8; border-radius:4px; padding:40px 44px; display:flex; gap:28px; align-items:flex-start; }
        @media(max-width:600px){ .author-card{flex-direction:column;padding:28px 24px;} }
        .author-card-name {  font-size:20px; color:#fff; font-weight:600; margin:0 0 4px; }
        .author-card-role { font-size:12px; letter-spacing:0.1em; text-transform:uppercase; color:#fff9; margin-bottom:14px; }
        .author-card-bio { font-size:14px; color:#dfdd; line-height:1.75; font-weight:300; margin:0; }
        .author-card-social { display:flex; gap:10px; margin-top:16px; flex-wrap:wrap; }
        .author-social-link { font-size:11px; color:rgba(255,255,255,0.3); text-decoration:none; border:1px solid rgba(255,255,255,0.1); padding:4px 10px; border-radius:2px; letter-spacing:0.08em; transition:all 0.2s; }
        .author-social-link:hover { color:var(--gold); border-color:rgba(184,147,58,0.4); }

        .related-section { background:#fff; padding:80px 24px; }
        .related-inner { max-width:1000px; margin:0 auto; }
        .related-eyebrow { font-size:10px; font-weight:500; letter-spacing:0.2em; text-transform:uppercase; color:#000; margin-bottom:32px; display:flex; align-items:center; gap:10px; }
        .related-eyebrow::before { content:''; display:inline-block; width:28px; height:1px; background:var(--gold); }
        .related-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:8px; background:#fff; }
        .related-card { background:var(--ink); padding:32px 28px; display:flex; flex-direction:column; gap:10px; text-decoration:none;  transition:background 0.2s; }
        .related-card:hover { background:#fff; }
        .related-card-tag { font-size:10px; font-weight:500; letter-spacing:0.15em; text-transform:uppercase; color:#000; background:#6FB3C8; padding:3px 8px; border-radius:2px; width:fit-content; }
        .related-card-title {  font-size:18px; font-weight:600; color:#000; line-height:1.3; flex:1; }
        .related-card-meta { font-size:12px; color:#0008; display:flex; gap:12px; }
        .related-card-arrow { width:26px; height:26px; border-radius:50%; border:1px solid #000; display:flex; align-items:center; justify-content:center; font-size:13px; color:#000; transition:all 0.2s; align-self:flex-end; }
        .related-card:hover .related-card-arrow { background:#fff; color:#000; border-color:#fff; }

        .back-bar { background:var(--parchment); padding:24px; border-top:1px solid var(--border); text-align:center; }
        .back-link { display:inline-flex; align-items:center; gap:8px; font-size:13px; font-weight:500; color:var(--muted); text-decoration:none; letter-spacing:0.04em; transition:color 0.2s; }
        .back-link:hover { color:var(--ink); }
        .blog-container { max-width:1160px; margin:0 auto; padding:0 24px; }
      `}</style>

      <Navbar />
      <PageHero title={post?.title} currentPage="Blog Details" />
      {/* ── Loading ── */}
      {loading && (
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--ink)",
          }}
        >
          <Loader2
            size={28}
            style={{
              color: "var(--gold)",
              animation: "spin 1s linear infinite",
            }}
          />
          <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
      )}

      {/* ── Error ── */}
      {!loading && error && (
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "12px",
            gap: "16px",
            background: "var(--parchment)",
            padding: "40px 24px",
            textAlign: "center",
          }}
        >
          <AlertCircle size={36} style={{ color: "#c0392b", opacity: 0.6 }} />
          <p
            style={{
              color: "#fff",
              fontSize: "16px",
            }}
          >
            {error}
          </p>
          <Link
            href="/blog"
            style={{
              fontSize: "13px",
              color: "var(--ink)",
              fontWeight: 500,

              textDecoration: "underline",
            }}
          >
            ← Back to the Journal
          </Link>
        </div>
      )}

      {/* ── Post content ── */}
      {!loading && !error && post && (
        <>
          {/* Hero */}

          {/* Article body */}
          <div className="article-wrap">
            <article id="article-body">
              <div className="article-inner">
                <AnimatedSection>
                  <h2
                    className="font-rising text-black"
                    style={{
                      margin: "0px 0px 50px 0px",
                      fontSize: "clamp(18px, 4vw, 28px)",
                      fontWeight: 400,
                      lineHeight: 1.6,
                      color: "#000",
                    }}
                  >
                    {post.title}
                  </h2>
                  {/* Hero image */}
                  <HeroImage url={post.imageUrl} title={post.title} />

                  {/* Description (HTML from API) */}
                  {post.description ? (
                    <div
                      className="article-p font-xolonium"
                      style={{
                        fontSize: "18px",
                        fontWeight: 300,
                        lineHeight: 1.85,
                        color: "#000",
                      }}
                      dangerouslySetInnerHTML={{ __html: post.description }}
                    />
                  ) : (
                    <p
                      className="article-p font-xolonium"
                      style={{ color: "#000", fontStyle: "italic" }}
                    >
                      Full content coming soon.
                    </p>
                  )}

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                        margin: "32px 0",
                      }}
                    >
                      {post.tags.map((tag) => (
                        <span
                          font-xolonium
                          key={tag}
                          style={{
                            fontSize: "11px",
                            fontWeight: 500,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "#000",
                            background: "var(--gold-light)",
                            padding: "4px 10px",
                            borderRadius: "2px",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </AnimatedSection>

                {/* Share strip */}
              </div>
            </article>
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <section className="related-section">
              <div className="related-inner">
                <div className="related-eyebrow font-xolonium">
                  Continue Reading
                </div>
                <div className="related-grid">
                  {related.map((r, i) => (
                    <RelatedCard key={r.id} post={r} i={i} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <Footer />
    </>
  );
}
