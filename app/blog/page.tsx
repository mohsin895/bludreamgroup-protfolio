"use client";

import { useEffect, useState, useMemo } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AlertCircle } from "lucide-react";
import {
    fetchBlogs,
    fetchBlogCategories,
    type MappedBlog,
    type ApiBlogCategory,
} from "@/lib/api/blog";

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
    return (
        <div
            className="post-card"
            style={{ display: "flex", flexDirection: "column", gap: "12px", pointerEvents: "none" }}
        >
            <div style={{ width: "60px",  height: "10px", borderRadius: "2px", background: "rgba(184,147,58,0.15)", animation: "shimmer 1.5s ease-in-out infinite" }} />
            <div style={{ width: "90%",   height: "18px", borderRadius: "2px", background: "rgba(14,13,11,0.08)", animation: "shimmer 1.5s ease-in-out infinite 0.1s" }} />
            <div style={{ width: "75%",   height: "18px", borderRadius: "2px", background: "rgba(14,13,11,0.06)", animation: "shimmer 1.5s ease-in-out infinite 0.15s" }} />
            <div style={{ width: "100%",  height: "13px", borderRadius: "2px", background: "rgba(14,13,11,0.05)", animation: "shimmer 1.5s ease-in-out infinite 0.2s" }} />
            <div style={{ width: "85%",   height: "13px", borderRadius: "2px", background: "rgba(14,13,11,0.05)", animation: "shimmer 1.5s ease-in-out infinite 0.25s" }} />
            <div style={{ height: "1px",  background: "var(--border)", margin: "8px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "120px", height: "11px", borderRadius: "2px", background: "rgba(14,13,11,0.06)", animation: "shimmer 1.5s ease-in-out infinite 0.3s" }} />
                <div style={{ width: "28px",  height: "28px", borderRadius: "50%", background: "rgba(14,13,11,0.06)", animation: "shimmer 1.5s ease-in-out infinite 0.35s" }} />
            </div>
        </div>
    );
}

function SkeletonFeatured() {
    return (
        <section className="featured-strip">
            <div className="container" style={{ padding: 0 }}>
                <div className="featured-inner">
                    {/* Left dark panel */}
                    <div className="featured-left" style={{ justifyContent: "flex-end" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            <div style={{ width: "100px", height: "10px", borderRadius: "2px", background: "rgba(255,255,255,0.1)", animation: "shimmer 1.5s ease-in-out infinite" }} />
                            <div style={{ width: "85%",   height: "28px", borderRadius: "2px", background: "rgba(255,255,255,0.08)", animation: "shimmer 1.5s ease-in-out infinite 0.1s" }} />
                            <div style={{ width: "70%",   height: "28px", borderRadius: "2px", background: "rgba(255,255,255,0.06)", animation: "shimmer 1.5s ease-in-out infinite 0.15s" }} />
                            <div style={{ width: "95%",   height: "13px", borderRadius: "2px", background: "rgba(255,255,255,0.05)", animation: "shimmer 1.5s ease-in-out infinite 0.2s" }} />
                            <div style={{ width: "80%",   height: "13px", borderRadius: "2px", background: "rgba(255,255,255,0.04)", animation: "shimmer 1.5s ease-in-out infinite 0.25s" }} />
                        </div>
                    </div>
                    {/* Right light panel */}
                    <div className="featured-right">
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <div style={{ width: "80px",  height: "10px", borderRadius: "2px", background: "rgba(14,13,11,0.08)", animation: "shimmer 1.5s ease-in-out infinite" }} />
                            <div style={{ width: "90%",   height: "22px", borderRadius: "2px", background: "rgba(14,13,11,0.06)", animation: "shimmer 1.5s ease-in-out infinite 0.1s" }} />
                            <div style={{ width: "70%",   height: "22px", borderRadius: "2px", background: "rgba(14,13,11,0.05)", animation: "shimmer 1.5s ease-in-out infinite 0.15s" }} />
                            <div style={{ width: "100%",  height: "13px", borderRadius: "2px", background: "rgba(14,13,11,0.05)", animation: "shimmer 1.5s ease-in-out infinite 0.2s" }} />
                            <div style={{ width: "85%",   height: "13px", borderRadius: "2px", background: "rgba(14,13,11,0.04)", animation: "shimmer 1.5s ease-in-out infinite 0.25s" }} />
                            <div style={{ width: "130px", height: "44px", borderRadius: "2px", background: "rgba(14,13,11,0.08)", marginTop: "12px", animation: "shimmer 1.5s ease-in-out infinite 0.3s" }} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ─── Post thumbnail ───────────────────────────────────────────────────────────

function PostThumbnail({ url, title }: { url: string | null; title: string }) {
    const [err, setErr] = useState(false);
    if (!url || err) return null;
    return (
        <div style={{ width: "100%", height: "180px", borderRadius: "2px", overflow: "hidden", marginBottom: "4px", background: "rgba(14,13,11,0.05)" }}>
            <Image
                src={url}
                alt={title}
                width={480}
                height={180}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                onError={() => setErr(true)}
            />
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogPage() {
    const [posts,      setPosts]      = useState<MappedBlog[]>([]);
    const [categories, setCategories] = useState<ApiBlogCategory[]>([]);
    const [loading,    setLoading]    = useState(true);
    const [error,      setError]      = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState("All");
    const [email,      setEmail]      = useState("");

    async function loadData() {
        try {
            setLoading(true);
            setError(null);
            const [blogs, cats] = await Promise.all([fetchBlogs(), fetchBlogCategories()]);
            setPosts(blogs);
            setCategories(cats.filter((c) => c.status === "active"));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load blog posts.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { loadData(); }, []);

    const featured = useMemo(() => posts.find((p) => p.featured) ?? posts[0], [posts]);
    const rest      = useMemo(() => posts.filter((p) => p.id !== featured?.id), [posts, featured]);

    // Build category pill labels from API
    const categoryLabels = useMemo(() => {
        const inPosts = new Set(posts.map((p) => p.category));
        return ["All", ...categories.filter((c) => inPosts.has(c.title)).map((c) => c.title)];
    }, [posts, categories]);

    const filtered = useMemo(
        () => activeCategory === "All" ? rest : rest.filter((p) => p.category === activeCategory),
        [rest, activeCategory]
    );

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        :root {
          --ink: #0e0d0b; --parchment: #f7f3ee; --gold: #b8933a;
          --gold-light: rgba(184,147,58,0.15); --muted: #7a7369;
          --card-bg: #ffffff; --border: rgba(14,13,11,0.1); --tag-bg: #f0ece5;
        }
        body { font-family: 'DM Sans', sans-serif; background: var(--parchment); color: var(--ink); }

        .blog-hero { padding: 160px 0 80px; background: var(--ink); position: relative; overflow: hidden; }
        .blog-hero::before {
          content: '"'; position: absolute; right: 5%; top: -40px;
          font-family: 'Playfair Display', serif; font-size: 420px;
          color: rgba(255,255,255,0.03); line-height: 1; pointer-events: none; user-select: none;
        }
        .hero-label {
          font-size: 11px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 16px; display: flex; align-items: center; gap: 10px;
        }
        .hero-label::before { content:''; display:inline-block; width:32px; height:1px; background:var(--gold); }
        .hero-title { font-family:'Playfair Display',serif; font-size:clamp(52px,7vw,96px); color:#fff; line-height:0.95; font-weight:400; margin:0 0 24px; }
        .hero-title em { font-style:italic; color:var(--gold); }
        .hero-sub { color:rgba(255,255,255,0.45); font-size:15px; font-weight:300; max-width:400px; line-height:1.8; margin:0 0 40px; }
        .hero-back { display:inline-flex; align-items:center; gap:8px; color:rgba(255,255,255,0.4); font-size:13px; text-decoration:none; transition:color 0.2s; }
        .hero-back:hover { color:var(--gold); }

        .featured-strip { background:#fff; border-bottom:1px solid var(--border); }
        .featured-inner { display:grid; grid-template-columns:1fr 1fr; min-height:420px; }
        @media(max-width:768px){ .featured-inner { grid-template-columns:1fr; } }
        .featured-left {
          background:var(--ink); padding:56px 48px; display:flex; flex-direction:column;
          justify-content:flex-end; position:relative; overflow:hidden;
        }
        .featured-left::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(135deg,rgba(184,147,58,0.08) 0%,transparent 60%); pointer-events:none;
        }
        .featured-tag {
          display:inline-block; font-size:10px; font-weight:500; letter-spacing:0.18em; text-transform:uppercase;
          color:var(--gold); border:1px solid rgba(184,147,58,0.35); padding:4px 10px; border-radius:2px; margin-bottom:20px; width:fit-content;
        }
        .featured-title { font-family:'Playfair Display',serif; font-size:clamp(24px,3vw,36px); color:#fff; line-height:1.25; font-weight:600; margin:0 0 16px; }
        .featured-excerpt { color:rgba(255,255,255,0.5); font-size:14px; line-height:1.8; font-weight:300; margin:0 0 28px; }
        .featured-meta { display:flex; align-items:center; gap:16px; font-size:12px; color:rgba(255,255,255,0.3); letter-spacing:0.05em; flex-wrap:wrap; }
        .featured-meta span::before { content:'·'; margin-right:16px; }
        .featured-meta span:first-child::before { display:none; }
        .featured-right { padding:56px 48px; display:flex; flex-direction:column; justify-content:center; border-left:1px solid var(--border); }
        .featured-right-label { font-size:10px; font-weight:500; letter-spacing:0.18em; text-transform:uppercase; color:var(--muted); margin-bottom:24px; }
        .read-btn {
          display:inline-flex; align-items:center; gap:10px; background:var(--ink); color:#fff;
          padding:14px 24px; font-size:13px; font-weight:500; letter-spacing:0.06em; text-decoration:none;
          border-radius:2px; transition:background 0.2s, gap 0.2s; width:fit-content; margin-top:24px;
        }
        .read-btn:hover { background:#2a2520; gap:14px; }

        .filter-bar { padding:32px 0; border-bottom:1px solid var(--border); background:var(--parchment); position:sticky; top:0; z-index:10; }
        .filter-scroll { display:flex; gap:4px; overflow-x:auto; scrollbar-width:none; }
        .filter-scroll::-webkit-scrollbar { display:none; }
        .filter-btn {
          flex-shrink:0; background:transparent; border:1px solid transparent; padding:7px 18px;
          font-size:13px; font-weight:400; color:var(--muted); border-radius:2px; cursor:pointer;
          font-family:'DM Sans',sans-serif; letter-spacing:0.02em; transition:all 0.18s;
        }
        .filter-btn:hover { color:var(--ink); border-color:var(--border); }
        .filter-btn.active { background:var(--ink); color:#fff; border-color:var(--ink); }

        .posts-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:1px; background:var(--border); }
        .post-card {
          background:var(--parchment); padding:36px 32px; display:flex; flex-direction:column;
          gap:12px; transition:background 0.2s; cursor:pointer; text-decoration:none; color:inherit;
        }
        .post-card:hover { background:#fff; }
        .post-card-tag {
          display:inline-block; font-size:10px; font-weight:500; letter-spacing:0.15em; text-transform:uppercase;
          color:var(--gold); background:var(--gold-light); padding:3px 8px; border-radius:2px; width:fit-content;
        }
        .post-card-title { font-family:'Playfair Display',serif; font-size:19px; font-weight:600; line-height:1.3; color:var(--ink); margin:4px 0; flex:1; }
        .post-card-excerpt { font-size:14px; color:var(--muted); line-height:1.75; font-weight:300; }
        .post-card-footer { display:flex; align-items:center; justify-content:space-between; margin-top:8px; padding-top:16px; border-top:1px solid var(--border); }
        .post-card-meta { font-size:12px; color:var(--muted); display:flex; gap:12px; }
        .post-arrow {
          width:28px; height:28px; border-radius:50%; border:1px solid var(--border);
          display:flex; align-items:center; justify-content:center; font-size:14px; color:var(--muted);
          transition:all 0.2s; flex-shrink:0;
        }
        .post-card:hover .post-arrow { background:var(--ink); color:#fff; border-color:var(--ink); }
        .empty-state { padding:80px 32px; text-align:center; color:var(--muted); font-size:15px; background:var(--parchment); grid-column:1/-1; }

        .newsletter-strip { background:var(--ink); padding:80px 0; text-align:center; }
        .newsletter-eyebrow { font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:var(--gold); margin-bottom:16px; }
        .newsletter-title { font-family:'Playfair Display',serif; font-size:clamp(28px,4vw,48px); color:#fff; font-weight:400; margin:0 0 12px; }
        .newsletter-title em { font-style:italic; color:var(--gold); }
        .newsletter-sub { color:rgba(255,255,255,0.4); font-size:14px; font-weight:300; margin-bottom:36px; }
        .newsletter-form { display:flex; gap:0; max-width:400px; margin:0 auto; border:1px solid rgba(255,255,255,0.15); border-radius:2px; overflow:hidden; }
        .newsletter-input { flex:1; background:rgba(255,255,255,0.06); border:none; padding:14px 18px; font-size:14px; color:#fff; font-family:'DM Sans',sans-serif; outline:none; }
        .newsletter-input::placeholder { color:rgba(255,255,255,0.25); }
        .newsletter-submit { background:var(--gold); border:none; padding:14px 22px; font-size:13px; font-weight:500; color:#fff; font-family:'DM Sans',sans-serif; cursor:pointer; transition:opacity 0.2s; letter-spacing:0.05em; }
        .newsletter-submit:hover { opacity:0.85; }

        .container { max-width:1160px; margin:0 auto; padding:0 24px; }

        @keyframes shimmer { 0%,100%{opacity:0.5} 50%{opacity:1} }
      `}</style>

            <Navbar />

            {/* ── Hero ── */}
            <section className="blog-hero">
                <div className="container">
                    <AnimatedSection>
                        <div className="hero-label">Words &amp; Ideas</div>
                        <h1 className="hero-title">The<br /><em>Journal</em></h1>
                        <p className="hero-sub">Essays on writing, reading, and the life that happens between drafts.</p>
                        <Link href="/" className="hero-back">← Back to Home</Link>
                    </AnimatedSection>
                </div>
            </section>

            {/* ── Featured Post ── */}
            {loading && <SkeletonFeatured />}

            {!loading && !error && featured && (
                <section className="featured-strip">
                    <div className="container" style={{ padding: 0 }}>
                        <div className="featured-inner">
                            <div className="featured-left">
                                <div className="featured-tag">Featured Essay</div>
                                <h2 className="featured-title">{featured.title}</h2>
                                <p className="featured-excerpt">{featured.excerpt}</p>
                                <div className="featured-meta">
                                    <span>{featured.date}</span>
                                    <span>{featured.readTime}</span>
                                    <span>{featured.category}</span>
                                </div>
                            </div>
                            <div className="featured-right">
                                <div className="featured-right-label">Latest essay</div>
                                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "22px", fontWeight: 600, lineHeight: 1.3, marginBottom: "12px" }}>
                                    {featured.title}
                                </h3>
                                <p style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.75, fontWeight: 300 }}>
                                    {featured.excerpt}
                                </p>
                                <Link href={`/blog/${featured.slug}`} className="read-btn">Read Essay →</Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Error ── */}
            {!loading && error && (
                <div style={{ background: "var(--parchment)", padding: "48px 24px", textAlign: "center" }}>
                    <AlertCircle size={32} style={{ color: "#c0392b", marginBottom: "12px", opacity: 0.6 }} />
                    <p style={{ color: "var(--muted)", fontSize: "15px", marginBottom: "20px" }}>{error}</p>
                    <button
                        onClick={loadData}
                        style={{ padding: "10px 24px", background: "var(--ink)", color: "#fff", border: "none", borderRadius: "2px", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.06em" }}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* ── Filter Bar ── */}
            {!loading && !error && (
                <div className="filter-bar">
                    <div className="container">
                        <div className="filter-scroll">
                            {categoryLabels.map((cat) => (
                                <button
                                    key={cat}
                                    className={`filter-btn${activeCategory === cat ? " active" : ""}`}
                                    onClick={() => setActiveCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Posts Grid ── */}
            <section style={{ background: "var(--parchment)", paddingBottom: "0" }}>
                <div className="container" style={{ padding: 0 }}>
                    {loading ? (
                        <div className="posts-grid">
                            {[1, 2, 3, 4, 5, 6].map((n) => <SkeletonCard key={n} />)}
                        </div>
                    ) : !error && (
                        <div className="posts-grid">
                            {filtered.length === 0 ? (
                                <div className="empty-state">No posts in this category yet.</div>
                            ) : (
                                filtered.map((post, i) => (
                                    <AnimatedSection key={post.id} delay={i * 0.06}>
                                        <Link href={`/blog/${post.slug}`} className="post-card" style={{ display: "flex" }}>
                                            <PostThumbnail url={post.imageUrl} title={post.title} />
                                            <span className="post-card-tag">{post.tag}</span>
                                            <h3 className="post-card-title">{post.title}</h3>
                                            <p className="post-card-excerpt">{post.excerpt}</p>
                                            <div className="post-card-footer">
                                                <div className="post-card-meta">
                                                    <span>{post.date}</span>
                                                    <span>{post.readTime}</span>
                                                </div>
                                                <div className="post-arrow">→</div>
                                            </div>
                                        </Link>
                                    </AnimatedSection>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </section>


            <Footer />
        </>
    );
}