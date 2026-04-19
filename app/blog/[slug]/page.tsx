"use client";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";

// ─── Data ──────────────────────────────────────────────────────────────────
const POSTS = [
    {
        slug: "why-every-writer-needs-a-morning-ritual",
        category: "Writing",
        tag: "Essay",
        title: "Why Every Writer Needs a Morning Ritual",
        subtitle: "The first hour after waking belongs to no one but you.",
        date: "April 12, 2025",
        readTime: "6 min read",
        author: "James Whitfield",
        authorTitle: "Novelist & Essayist",
        content: [
            {
                type: "paragraph",
                text: "There is a particular quality to the mind before the day has had its way with it. Before the inbox, before the errands, before the accumulated small failures that constitute ordinary life — there is a window, no wider than an hour, in which the imagination is still porous and soft.",
            },
            {
                type: "pullquote",
                text: "The page you fill at 6 a.m. is written by a different person than the one who sits down at noon. Both are you. Only one is undefended.",
            },
            {
                type: "paragraph",
                text: "I discovered this not through discipline but through desperation. My first novel stalled for eighteen months. I had evenings — supposedly — but evenings belonged to exhaustion. The words I wrote after dinner were careful, self-conscious things. They knew they were being watched.",
            },
            {
                type: "heading",
                text: "The Science of the Threshold",
            },
            {
                type: "paragraph",
                text: "Sleep researchers have a term for the hypnagogic state — that liminal zone between sleeping and waking where the brain is still bathed in theta waves rather than the beta frequencies of full alertness. Artists and writers have always intuited what neuroscience now confirms: this threshold is creative gold.",
            },
            {
                type: "paragraph",
                text: "Edison famously napped in a chair with steel balls in his hands. The moment he drifted to sleep, the balls would fall and wake him — depositing him at the exact threshold he wanted to harvest. Writers can achieve something similar by moving directly from bed to desk, without checking a phone, without speaking to anyone.",
            },
            {
                type: "heading",
                text: "My Own Practice",
            },
            {
                type: "paragraph",
                text: "I wake at 5:45. I do not check my phone. I make coffee — this is the one permitted ritual before the desk — and I sit down with whatever I am currently drafting. The first ten minutes are often painful. The prose is slow and uncertain. Then something loosens.",
            },
            {
                type: "paragraph",
                text: "By 7:00 I have between 600 and 1,200 words. Not all of them good. But all of them mine, in a way that afternoon words rarely are. The morning page has a recklessness to it that I have learned to protect rather than edit away.",
            },
            {
                type: "pullquote",
                text: "Protect the recklessness. The editor comes later. The writer must arrive first.",
            },
            {
                type: "paragraph",
                text: "If this resonates — and I suspect it will for those of you who find the day eating your pages — I encourage you to try it for two weeks. Not forever. Just two weeks. The experiment costs you only sleep, and what you gain may surprise you.",
            },
        ],
        relatedPosts: [
            {
                slug: "how-i-outline-without-killing-the-surprise",
                tag: "Process",
                title: "How I Outline Without Killing the Surprise",
                date: "Jan 30, 2025",
                readTime: "5 min read",
            },
            {
                slug: "the-sentence-that-changed-how-i-write",
                tag: "Craft",
                title: "The Sentence That Changed How I Write",
                date: "Mar 14, 2025",
                readTime: "4 min read",
            },
        ],
    },
    {
        slug: "my-novel-is-finally-available",
        category: "Books",
        tag: "Announcement",
        title: "My Novel Is Finally Available — Here's the Story Behind It",
        subtitle: "Three years, four drafts, and one complete structural rewrite.",
        date: "March 28, 2025",
        readTime: "9 min read",
        author: "James Whitfield",
        authorTitle: "Novelist & Essayist",
        content: [
            {
                type: "paragraph",
                text: "The first draft of The Quiet Hours was written in grief. My father had died the previous winter, and I found myself writing a novel about a man who does not know how to be present for the people who need him. I did not recognize this as autobiography for nearly a year.",
            },
            {
                type: "pullquote",
                text: "The novel knows what it is before the novelist does. Your job is to keep writing until you catch up.",
            },
            {
                type: "paragraph",
                text: "What followed were three years of revision, two agents, one complete structural overhaul in which I moved the entire second act to the opening, and a small, fierce publisher in Edinburgh who understood the book better than I did after a single conversation.",
            },
            {
                type: "heading",
                text: "Where to Get It",
            },
            {
                type: "paragraph",
                text: "The Quiet Hours is available now through my shop as a signed first edition, through independent bookshops, and via the usual online channels. I am deeply partial to the signed copies — not for vanity, but because each one includes a handwritten note on a specific page that I leave as a small discovery for the reader.",
            },
        ],
        relatedPosts: [
            {
                slug: "signed-copies-limited-run-for-spring",
                tag: "Shop",
                title: "Signed Copies — Limited Run for Spring",
                date: "Jan 18, 2025",
                readTime: "2 min read",
            },
            {
                slug: "10-books-that-shaped-my-voice-as-a-writer",
                tag: "Reading List",
                title: "10 Books That Shaped My Voice as a Writer",
                date: "Feb 22, 2025",
                readTime: "11 min read",
            },
        ],
    },
    {
        slug: "the-sentence-that-changed-how-i-write",
        category: "Craft",
        tag: "Craft",
        title: "The Sentence That Changed How I Write",
        subtitle: "A single line from Marilynne Robinson rewired everything.",
        date: "March 14, 2025",
        readTime: "4 min read",
        author: "James Whitfield",
        authorTitle: "Novelist & Essayist",
        content: [
            {
                type: "paragraph",
                text: "I have read Gilead four times. The first time I was twenty-six and impatient; I admired it without being changed by it. The second time I was thirty-one and the book nearly undid me. The third time I read it with a pencil. The fourth time I read only one sentence, over and over, for three days.",
            },
            {
                type: "pullquote",
                text: "\"There is a reality in blessing. It doesn't enhance sacredness, but it acknowledges it.\"",
            },
            {
                type: "paragraph",
                text: "What Robinson does in that sentence — and throughout the novel — is refuse to perform feeling. The prose simply states, without decoration, and trusts the reader to feel the weight. I had been doing the opposite: ornamenting emotions, as if the reader needed to be convinced of them.",
            },
        ],
        relatedPosts: [
            {
                slug: "why-every-writer-needs-a-morning-ritual",
                tag: "Essay",
                title: "Why Every Writer Needs a Morning Ritual",
                date: "Apr 12, 2025",
                readTime: "6 min read",
            },
        ],
    },
];

// ─── Helpers ───────────────────────────────────────────────────────────────
function getPost(slug: string) {
    return POSTS.find((p) => p.slug === slug) ?? null;
}

function readingProgress() {
    if (typeof window === "undefined") return;
    const article = document.getElementById("article-body");
    const bar = document.getElementById("reading-bar");
    if (!article || !bar) return;
    const { top, height } = article.getBoundingClientRect();
    const scrolled = Math.max(0, -top);
    const pct = Math.min(100, (scrolled / (height - window.innerHeight)) * 100);
    bar.style.width = pct + "%";
}

if (typeof window !== "undefined") {
    window.addEventListener("scroll", readingProgress, { passive: true });
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function BlogDetailPage() {
    const params = useParams();
    const slug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : "";
    const post = getPost(slug);

    if (!post) return notFound();

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500&family=DM+Serif+Display:ital@0;1&display=swap');

        :root {
          --ink: #0e0d0b;
          --parchment: #f7f3ee;
          --gold: #b8933a;
          --gold-light: rgba(184,147,58,0.13);
          --muted: #7a7369;
          --border: rgba(14,13,11,0.1);
          --reading-col: 680px;
        }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--parchment);
          color: var(--ink);
          margin: 0;
        }

        /* ── Reading progress bar ── */
        #reading-bar-track {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: transparent;
          z-index: 200;
        }
        #reading-bar {
          height: 100%;
          width: 0%;
          background: var(--gold);
          transition: width 0.1s linear;
        }

        /* ── Hero ── */
        .detail-hero {
          background: var(--ink);
          padding: 160px 24px 0;
          position: relative;
          overflow: hidden;
        }

        .detail-hero::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(ellipse 60% 50% at 70% 40%, rgba(184,147,58,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-inner {
          max-width: var(--reading-col);
          margin: 0 auto;
        }

        .detail-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.05em;
          margin-bottom: 36px;
        }

        .detail-breadcrumb a {
          color: rgba(255,255,255,0.3);
          text-decoration: none;
          transition: color 0.2s;
        }

        .detail-breadcrumb a:hover { color: var(--gold); }

        .detail-breadcrumb .sep { opacity: 0.3; }

        .detail-tag {
          display: inline-block;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold);
          border: 1px solid rgba(184,147,58,0.3);
          padding: 4px 10px;
          border-radius: 2px;
          margin-bottom: 24px;
        }

        .detail-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 5.5vw, 64px);
          color: #fff;
          line-height: 1.1;
          font-weight: 600;
          margin: 0 0 18px;
        }

        .detail-subtitle {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(17px, 2vw, 22px);
          color: rgba(255,255,255,0.45);
          font-weight: 400;
          margin: 0 0 48px;
          line-height: 1.5;
        }

        .detail-meta-row {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 24px 0;
          border-top: 1px solid rgba(255,255,255,0.08);
          flex-wrap: wrap;
        }

        .author-chip {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .author-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #b8933a, #7a5f1e);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          flex-shrink: 0;
          letter-spacing: 0.05em;
        }

        .author-name {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.85);
        }

        .author-role {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          margin-top: 1px;
        }

        .meta-divider {
          width: 1px;
          height: 28px;
          background: rgba(255,255,255,0.1);
        }

        .meta-item {
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.04em;
        }

        /* ── Dark notch bridge ── */
        .hero-notch {
          height: 48px;
          background: var(--ink);
          clip-path: polygon(0 0, 100% 0, 100% 30%, 0 100%);
          margin-bottom: -1px;
        }

        /* ── Article body ── */
        .article-wrap {
          background: var(--parchment);
          padding: 72px 24px 80px;
        }

        .article-inner {
          max-width: var(--reading-col);
          margin: 0 auto;
        }

        .article-p {
          font-family: 'DM Sans', sans-serif;
          font-size: 18px;
          font-weight: 300;
          line-height: 1.85;
          color: #2a2720;
          margin: 0 0 28px;
        }

        .article-h2 {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 600;
          color: var(--ink);
          margin: 52px 0 20px;
          line-height: 1.25;
        }

        .article-h2::before {
          content: '';
          display: block;
          width: 32px;
          height: 2px;
          background: var(--gold);
          margin-bottom: 14px;
        }

        .article-pullquote {
          border-left: 3px solid var(--gold);
          padding: 4px 0 4px 28px;
          margin: 48px 0 48px -4px;
        }

        .article-pullquote p {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(20px, 2.8vw, 26px);
          color: var(--ink);
          line-height: 1.5;
          font-weight: 400;
          margin: 0;
        }

        /* ── Share strip ── */
        .share-strip {
          max-width: var(--reading-col);
          margin: 0 auto;
          padding: 32px 0;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .share-label {
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          font-weight: 500;
        }

        .share-btns {
          display: flex;
          gap: 8px;
        }

        .share-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 16px;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 2px;
          font-size: 12px;
          font-weight: 500;
          color: var(--muted);
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          letter-spacing: 0.05em;
          transition: all 0.18s;
          text-decoration: none;
        }

        .share-btn:hover {
          border-color: var(--ink);
          color: var(--ink);
        }

        /* ── Author card ── */
        .author-card {
          max-width: var(--reading-col);
          margin: 64px auto 0;
          background: var(--ink);
          border-radius: 4px;
          padding: 40px 44px;
          display: flex;
          gap: 28px;
          align-items: flex-start;
        }

        @media (max-width: 600px) {
          .author-card { flex-direction: column; padding: 28px 24px; }
        }

        .author-card-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #b8933a, #7a5f1e);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 600;
          color: #fff;
          flex-shrink: 0;
          letter-spacing: 0.05em;
        }

        .author-card-name {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          color: #fff;
          font-weight: 600;
          margin: 0 0 4px;
        }

        .author-card-role {
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 14px;
        }

        .author-card-bio {
          font-size: 14px;
          color: rgba(255,255,255,0.45);
          line-height: 1.75;
          font-weight: 300;
          margin: 0;
        }

        /* ── Related posts ── */
        .related-section {
          background: var(--ink);
          padding: 80px 24px;
        }

        .related-inner {
          max-width: 1000px;
          margin: 0 auto;
        }

        .related-eyebrow {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .related-eyebrow::before {
          content: '';
          display: inline-block;
          width: 28px;
          height: 1px;
          background: var(--gold);
        }

        .related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1px;
          background: rgba(255,255,255,0.06);
        }

        .related-card {
          background: var(--ink);
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          text-decoration: none;
          color: inherit;
          transition: background 0.2s;
        }

        .related-card:hover { background: #1a1915; }

        .related-card-tag {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--gold);
          background: rgba(184,147,58,0.1);
          padding: 3px 8px;
          border-radius: 2px;
          width: fit-content;
        }

        .related-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 600;
          color: #fff;
          line-height: 1.3;
          flex: 1;
        }

        .related-card-meta {
          font-size: 12px;
          color: rgba(255,255,255,0.25);
          display: flex;
          gap: 12px;
        }

        .related-card-arrow {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          transition: all 0.2s;
          align-self: flex-end;
        }

        .related-card:hover .related-card-arrow {
          background: var(--gold);
          color: #fff;
          border-color: var(--gold);
        }

        /* ── Back to blog ── */
        .back-bar {
          background: var(--parchment);
          padding: 24px;
          border-top: 1px solid var(--border);
          text-align: center;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 500;
          color: var(--muted);
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: color 0.2s;
        }

        .back-link:hover { color: var(--ink); }

        .container { max-width: 1160px; margin: 0 auto; padding: 0 24px; }
      `}</style>

            {/* Reading progress bar */}
            <div id="reading-bar-track">
                <div id="reading-bar" />
            </div>

            <Navbar />

            {/* ── Hero ── */}
            <section className="detail-hero">
                <div className="hero-inner">
                    <AnimatedSection>
                        {/* Breadcrumb */}
                        <nav className="detail-breadcrumb">
                            <Link href="/">Home</Link>
                            <span className="sep">›</span>
                            <Link href="/blog">Journal</Link>
                            <span className="sep">›</span>
                            <span style={{ color: "rgba(255,255,255,0.5)" }}>{post.category}</span>
                        </nav>

                        <div className="detail-tag">{post.tag}</div>
                        <h1 className="detail-title">{post.title}</h1>
                        <p className="detail-subtitle">{post.subtitle}</p>

                        <div className="detail-meta-row">
                            <div className="author-chip">
                                <div className="author-avatar">
                                    {post.author.split(" ").map((n) => n[0]).join("")}
                                </div>
                                <div>
                                    <div className="author-name">{post.author}</div>
                                    <div className="author-role">{post.authorTitle}</div>
                                </div>
                            </div>
                            <div className="meta-divider" />
                            <div className="meta-item">{post.date}</div>
                            <div className="meta-divider" />
                            <div className="meta-item">{post.readTime}</div>
                            <div className="meta-divider" />
                            <div className="meta-item">{post.category}</div>
                        </div>
                    </AnimatedSection>
                </div>

                {/* Diagonal notch */}
                <div className="hero-notch" />
            </section>

            {/* ── Article Body ── */}
            <div className="article-wrap">
                <article id="article-body">
                    <div className="article-inner">
                        <AnimatedSection>
                            {post.content.map((block, i) => {
                                if (block.type === "paragraph") {
                                    return <p key={i} className="article-p">{block.text}</p>;
                                }
                                if (block.type === "heading") {
                                    return <h2 key={i} className="article-h2">{block.text}</h2>;
                                }
                                if (block.type === "pullquote") {
                                    return (
                                        <blockquote key={i} className="article-pullquote">
                                            <p>{block.text}</p>
                                        </blockquote>
                                    );
                                }
                                return null;
                            })}
                        </AnimatedSection>

                        {/* Share strip */}
                        <div className="share-strip">
                            <span className="share-label">Share this essay</span>
                            <div className="share-btns">
                                <a
                                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`/blog/${post.slug}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="share-btn"
                                >
                                    𝕏 Twitter
                                </a>
                                <a
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`/blog/${post.slug}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="share-btn"
                                >
                                    in LinkedIn
                                </a>
                                <button
                                    className="share-btn"
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                    }}
                                >
                                    ⎘ Copy link
                                </button>
                            </div>
                        </div>

                        {/* Author card */}
                        <div className="author-card">
                            <div className="author-card-avatar">
                                {post.author.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <div>
                                <h3 className="author-card-name">{post.author}</h3>
                                <div className="author-card-role">{post.authorTitle}</div>
                                <p className="author-card-bio">
                                    James Whitfield is the author of The Quiet Hours and two collections of essays on writing and reading. He writes from Edinburgh, teaches creative nonfiction online, and occasionally sells signed books from this website.
                                </p>
                            </div>
                        </div>
                    </div>
                </article>
            </div>

            {/* ── Related Posts ── */}
            {post.relatedPosts && post.relatedPosts.length > 0 && (
                <section className="related-section">
                    <div className="related-inner">
                        <div className="related-eyebrow">Continue Reading</div>
                        <div className="related-grid">
                            {post.relatedPosts.map((related, i) => (
                                <AnimatedSection key={i} delay={i * 0.08}>
                                    <Link href={`/blog/${related.slug}`} className="related-card" style={{ display: "flex" }}>
                                        <span className="related-card-tag">{related.tag}</span>
                                        <span className="related-card-title">{related.title}</span>
                                        <div className="related-card-meta">
                                            <span>{related.date}</span>
                                            <span>{related.readTime}</span>
                                        </div>
                                        <span className="related-card-arrow">→</span>
                                    </Link>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Back bar ── */}
            <div className="back-bar">
                <Link href="/blog" className="back-link">
                    ← Back to the Journal
                </Link>
            </div>

            <Footer />
        </>
    );
}