"use client";
import { useState, useEffect, useCallback } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────
type SamplePage = {
    pageNumber: number;
    chapter?: string;
    isChapterStart?: boolean;
    content: string[];
};

type BookSample = {
    title: string;
    author: string;
    coverColor: string;
    coverAccent: string;
    pages: SamplePage[];
};

// ─── Sample Data ─────────────────────────────────────────────────────────────
const BOOK_SAMPLES: Record<string, BookSample> = {
    "the-quiet-hours": {
        title: "The Quiet Hours",
        author: "James Whitfield",
        coverColor: "#1a1612",
        coverAccent: "#b8933a",
        pages: [
            {
                pageNumber: 1,
                chapter: "I. The House in Winter",
                isChapterStart: true,
                content: [
                    "The train arrived twenty minutes late, which gave Thomas time to rehearse the things he would not say. He had a list of them. It had grown considerably since Edinburgh.",
                    "Harwick station had not changed — the same peeling paint on the waiting room door, the same clock that ran seven minutes slow, the same smell of diesel and damp wool that he associated, without warmth, with childhood. He stood on the platform until the train had gone, as though he might still change his mind.",
                    "He had not been back in eleven years. He had counted, more than once.",
                ],
            },
            {
                pageNumber: 2,
                content: [
                    "The taxi driver recognized him, which he had not anticipated. \"You're Margaret's boy,\" the man said, pulling away from the kerb before Thomas had closed the door. It was not a question.",
                    "\"Thomas,\" he said.",
                    "\"I know who you are.\" The driver glanced at him in the mirror. \"She talked about you. Not often, but she did.\"",
                    "Thomas looked out at the town passing in grey strips. The butcher's was still there. The library had become a letting agent. A new coffee shop stood where the ironmonger's had been, its window full of chalkboard menus and reclaimed wood.",
                    "\"When did she—\" he started.",
                    "\"Thursday. It was very quick, they said. She wouldn't have—\" The driver stopped. \"She wouldn't have suffered.\"",
                    "Thomas nodded as though this were useful information.",
                ],
            },
            {
                pageNumber: 3,
                content: [
                    "The house was smaller than he remembered. This was always true of houses, he knew — it was the child inside the adult that made them seem diminished — but knowing this did not stop the small shock of it, the disorientation of standing before a door that had once been level with his eyes and was now level with his chest.",
                    "The key was under the third flowerpot from the left, where it had been for forty years. His mother had told people this freely, without embarrassment. \"If anyone wanted to rob me,\" she had said once, \"I wouldn't want them to damage the door.\"",
                    "He had found this funny, the first time. Later he had found it alarming. Eventually he had stopped thinking about it.",
                    "Inside, the house smelled of her — of the particular soap she used, of old paper, of something faintly floral that he could not identify and had stopped trying to. He stood in the hallway with his bag and did not move.",
                ],
            },
        ],
    },
    "essays-on-silence": {
        title: "Essays on Silence",
        author: "James Whitfield",
        coverColor: "#0c1a14",
        coverAccent: "#4a9e6b",
        pages: [
            {
                pageNumber: 1,
                chapter: "On the First Sentence",
                isChapterStart: true,
                content: [
                    "Every writer I have ever spoken to about first sentences has told me, in some form, that they are terrifying. This is the correct response. A first sentence is a commitment — not only to the piece, but to a particular version of yourself: the one who will write this thing, in this way, now.",
                    "The sentence makes a claim. It says: the writer exists. It says: something is being thought. It says: you are invited to follow.",
                    "What it does not say, but what every first sentence implies, is that the writer has chosen this sentence over all the others that were available to them. The sentence is a declaration of taste, of judgment, of self. This is why it is terrifying.",
                ],
            },
            {
                pageNumber: 2,
                content: [
                    "Chekhov, who knew everything about first sentences, rarely announced himself. His openings are quietly disorienting — they place you inside a situation without explaining it, trust you to locate yourself, and then move on before you have quite settled. \"The bishop,\" begins one story. Two words. A subject. We are already with him.",
                    "Compare this with the Victorian novel's habit of elaborate scene-setting, its insistence on context, its anxiety that the reader might feel lost. The Victorian first sentence holds your hand. The Chekhovian first sentence lets go immediately, in the confidence that you will follow.",
                    "I find myself, in my own writing, always working toward the moment when I can let go. The early drafts hold on too tight. They explain. They qualify. They apologize, in a hundred small ways, for having begun.",
                ],
            },
        ],
    },
    "the-second-draft": {
        title: "The Second Draft",
        author: "James Whitfield",
        coverColor: "#16101a",
        coverAccent: "#8a6bb8",
        pages: [
            {
                pageNumber: 1,
                chapter: "What Is a Second Draft",
                isChapterStart: true,
                content: [
                    "A second draft is not a corrected first draft. This is the most important thing I can tell you, and the thing most writers spend years discovering for themselves.",
                    "A first draft is an argument with yourself. You are finding out what you think, what you have to say, what the piece wants to be. You are, in the most literal sense, drafting — making a provisional version, knowing it is provisional, pressing forward despite not knowing where you are going.",
                    "A second draft is a different document entirely. It is written by a person who has read the first draft. Who knows, now, what was being attempted. Who can see, from the distance of having finished, where the real subject lives — which is almost never where you thought it was.",
                ],
            },
            {
                pageNumber: 2,
                content: [
                    "The worst thing you can do with a first draft is open it and begin correcting sentences. This is the writer's equivalent of rearranging deckchairs. The sentences may be wrong, but they are not the problem. The structure is the problem. The proportion is the problem. The scene in chapter three that you loved writing but that does not, on reflection, belong in this book — that is the problem.",
                    "Read the whole thing first. Without a pen. Without annotating. Just read it as a reader would, as someone encountering it for the first time, and notice what you feel.",
                    "Where do you slow down, in the bad sense? Where do you lose the thread? Where do you feel the writer trying too hard, compensating with language for a structural uncertainty? These are the places you return to. These are the problems worth solving.",
                    "The beautiful sentences, you will notice, are largely looking after themselves.",
                ],
            },
        ],
    },
};

// ─── Reading Sample Modal ─────────────────────────────────────────────────────
interface ReadingSampleProps {
    slug: string;
    isOpen: boolean;
    onClose: () => void;
}

export function ReadingSampleModal({ slug, isOpen, onClose }: ReadingSampleProps) {
    const sample = BOOK_SAMPLES[slug];
    const [currentPage, setCurrentPage] = useState(0);
    const [turning, setTurning] = useState<"left" | "right" | null>(null);
    const [theme, setTheme] = useState<"parchment" | "white" | "night">("parchment");
    const [fontSize, setFontSize] = useState<"sm" | "md" | "lg">("md");

    const totalPages = sample?.pages.length ?? 0;

    const goNext = useCallback(() => {
        if (currentPage < totalPages - 1 && !turning) {
            setTurning("right");
            setTimeout(() => {
                setCurrentPage((p) => p + 1);
                setTurning(null);
            }, 320);
        }
    }, [currentPage, totalPages, turning]);

    const goPrev = useCallback(() => {
        if (currentPage > 0 && !turning) {
            setTurning("left");
            setTimeout(() => {
                setCurrentPage((p) => p - 1);
                setTurning(null);
            }, 320);
        }
    }, [currentPage, turning]);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") goNext();
            if (e.key === "ArrowLeft" || e.key === "ArrowUp") goPrev();
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isOpen, goNext, goPrev, onClose]);

    useEffect(() => {
        if (isOpen) {
            setCurrentPage(0);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen || !sample) return null;

    const page = sample.pages[currentPage];

    const themes = {
        parchment: { bg: "#f7f3ee", text: "#1a1612", muted: "#7a7369", border: "rgba(14,13,11,0.1)", pageBg: "#faf7f2" },
        white:     { bg: "#ffffff", text: "#111111", muted: "#888888", border: "rgba(0,0,0,0.08)", pageBg: "#ffffff" },
        night:     { bg: "#12100e", text: "#e8e0d4", muted: "#7a7066", border: "rgba(255,255,255,0.08)", pageBg: "#1a1714" },
    };

    const t = themes[theme];
    const fontSizes = { sm: "15px", md: "17px", lg: "20px" };
    const fs = fontSizes[fontSize];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');

        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes overlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pageFlipRight {
          0%   { transform: rotateY(0deg);    opacity: 1; }
          50%  { transform: rotateY(-8deg);   opacity: 0.4; }
          100% { transform: rotateY(0deg);    opacity: 1; }
        }
        @keyframes pageFlipLeft {
          0%   { transform: rotateY(0deg);    opacity: 1; }
          50%  { transform: rotateY(8deg);    opacity: 0.4; }
          100% { transform: rotateY(0deg);    opacity: 1; }
        }

        .reader-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.82);
          z-index: 9000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: overlayIn 0.25s ease;
          padding: 20px;
        }

        .reader-modal {
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          border-radius: 6px;
          overflow: hidden;
          animation: modalIn 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
          box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05);
        }

        .reader-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 24px;
          border-bottom: 1px solid;
          flex-shrink: 0;
          gap: 16px;
        }

        .reader-book-info {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .reader-cover-mini {
          width: 28px;
          height: 42px;
          border-radius: 2px 3px 3px 2px;
          flex-shrink: 0;
          display: flex;
          align-items: flex-end;
          padding: 5px 6px;
          position: relative;
          overflow: hidden;
        }

        .reader-cover-mini::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: rgba(0,0,0,0.35);
          border-radius: 2px 0 0 2px;
        }

        .reader-title-mini {
          font-family: 'Playfair Display', serif;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .reader-sample-badge {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 2px;
          flex-shrink: 0;
        }

        .reader-controls {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .ctrl-btn {
          width: 30px;
          height: 30px;
          border-radius: 4px;
          border: 1px solid;
          background: transparent;
          cursor: pointer;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
          font-family: inherit;
        }

        .reader-page-body {
          flex: 1;
          overflow-y: auto;
          padding: 56px 72px;
          position: relative;
        }

        @media (max-width: 600px) {
          .reader-page-body { padding: 36px 28px; }
          .reader-header { padding: 12px 16px; }
        }

        .page-content {
          max-width: 560px;
          margin: 0 auto;
        }

        .page-turning-right {
          animation: pageFlipRight 0.32s ease;
        }
        .page-turning-left {
          animation: pageFlipLeft 0.32s ease;
        }

        .chapter-ornament {
          text-align: center;
          margin-bottom: 40px;
        }

        .chapter-rule {
          width: 48px;
          height: 1px;
          margin: 0 auto 16px;
        }

        .chapter-label {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .chapter-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(22px, 4vw, 28px);
          font-weight: 600;
          line-height: 1.2;
        }

        .prose-p {
          font-family: 'Lora', serif;
          line-height: 1.9;
          margin-bottom: 22px;
          text-align: justify;
          hyphens: auto;
        }

        .prose-p:first-of-type::first-letter {
          float: left;
          font-family: 'Playfair Display', serif;
          font-size: 4.2em;
          line-height: 0.75;
          margin: 6px 10px -4px 0;
          font-weight: 600;
        }

        .drop-cap-disabled::first-letter {
          float: none;
          font-size: inherit;
          line-height: inherit;
          margin: 0;
          font-weight: inherit;
        }

        .reader-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 24px;
          border-top: 1px solid;
          flex-shrink: 0;
        }

        .nav-arrow {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid;
          background: transparent;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.18s;
        }

        .nav-arrow:disabled {
          opacity: 0.2;
          cursor: not-allowed;
        }

        .page-dots {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .page-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
          background: transparent;
        }

        .reader-upsell {
          text-align: center;
          padding: 40px 32px 48px;
        }

        .upsell-ornament {
          width: 40px;
          height: 1px;
          margin: 0 auto 24px;
        }

        .upsell-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 10px;
          line-height: 1.3;
        }

        .upsell-sub {
          font-size: 14px;
          font-weight: 300;
          line-height: 1.7;
          margin-bottom: 28px;
          max-width: 380px;
          margin-left: auto;
          margin-right: auto;
        }

        .upsell-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 28px;
          border-radius: 3px;
          border: none;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          font-family: inherit;
          transition: opacity 0.2s;
          text-decoration: none;
        }

        .upsell-btn:hover { opacity: 0.85; }

        .page-number-display {
          font-size: 12px;
          letter-spacing: 0.1em;
        }
      `}</style>

            <div className="reader-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
                <div
                    className="reader-modal"
                    style={{ background: t.bg }}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Reading sample: ${sample.title}`}
                >
                    {/* ── Header ── */}
                    <div
                        className="reader-header"
                        style={{ background: t.pageBg, borderColor: t.border }}
                    >
                        <div className="reader-book-info">
                            <div
                                className="reader-cover-mini"
                                style={{ background: sample.coverColor }}
                            >
                <span style={{ fontSize: "6px", color: sample.coverAccent, fontWeight: 700, letterSpacing: "0.05em", lineHeight: 1, position: "relative", zIndex: 1 }}>
                  {sample.title.split(" ").map(w => w[0]).join("").slice(0,3)}
                </span>
                            </div>
                            <div>
                                <div className="reader-title-mini" style={{ color: t.text }}>
                                    {sample.title}
                                </div>
                                <div style={{ fontSize: "11px", color: t.muted }}>{sample.author}</div>
                            </div>
                            <div
                                className="reader-sample-badge"
                                style={{ background: `${sample.coverColor}22`, color: sample.coverAccent, border: `1px solid ${sample.coverAccent}44` }}
                            >
                                Free Sample
                            </div>
                        </div>

                        <div className="reader-controls">
                            {/* Theme */}
                            {(["parchment", "white", "night"] as const).map((th) => (
                                <button
                                    key={th}
                                    className="ctrl-btn"
                                    title={`${th} theme`}
                                    style={{
                                        borderColor: theme === th ? sample.coverAccent : t.border,
                                        background: th === "parchment" ? "#f7f3ee" : th === "white" ? "#fff" : "#12100e",
                                        outline: theme === th ? `2px solid ${sample.coverAccent}` : "none",
                                        outlineOffset: "1px",
                                    }}
                                    onClick={() => setTheme(th)}
                                />
                            ))}

                            <div style={{ width: "1px", height: "20px", background: t.border, margin: "0 4px" }} />

                            {/* Font size */}
                            {(["sm", "md", "lg"] as const).map((size, i) => (
                                <button
                                    key={size}
                                    className="ctrl-btn"
                                    title={`${size === "sm" ? "Small" : size === "md" ? "Medium" : "Large"} text`}
                                    style={{
                                        borderColor: fontSize === size ? sample.coverAccent : t.border,
                                        color: t.text,
                                        fontSize: ["10px", "12px", "15px"][i],
                                        fontWeight: fontSize === size ? 700 : 400,
                                    }}
                                    onClick={() => setFontSize(size)}
                                >
                                    A
                                </button>
                            ))}

                            <div style={{ width: "1px", height: "20px", background: t.border, margin: "0 4px" }} />

                            {/* Close */}
                            <button
                                className="ctrl-btn"
                                onClick={onClose}
                                title="Close reader"
                                style={{ borderColor: t.border, color: t.muted, fontSize: "16px" }}
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* ── Page body ── */}
                    <div
                        className="reader-page-body"
                        style={{ background: t.pageBg }}
                    >
                        {currentPage < totalPages ? (
                            <div
                                className={`page-content ${
                                    turning === "right"
                                        ? "page-turning-right"
                                        : turning === "left"
                                            ? "page-turning-left"
                                            : ""
                                }`}
                            >
                                {page.isChapterStart && page.chapter && (
                                    <div className="chapter-ornament">
                                        <div className="chapter-rule" style={{ background: sample.coverAccent }} />
                                        <div className="chapter-label" style={{ color: sample.coverAccent }}>
                                            {page.chapter.split(".")[0].trim()}
                                        </div>
                                        <div className="chapter-title" style={{ color: t.text }}>
                                            {page.chapter.split(". ").slice(1).join(". ")}
                                        </div>
                                    </div>
                                )}

                                {page.content.map((para, i) => (
                                    <p
                                        key={i}
                                        className={`prose-p ${i === 0 && page.isChapterStart ? "" : "drop-cap-disabled"}`}
                                        style={{
                                            fontSize: fs,
                                            color: t.text,
                                        }}
                                    >
                                        {para}
                                    </p>
                                ))}

                                {/* Bottom page decoration */}
                                <div style={{ textAlign: "center", marginTop: "40px", color: t.muted, fontSize: "13px", fontFamily: "'Playfair Display', serif" }}>
                                    ✦
                                </div>
                            </div>
                        ) : (
                            /* Upsell page */
                            <div className="reader-upsell">
                                <div className="upsell-ornament" style={{ background: sample.coverAccent }} />
                                <h3 className="upsell-title" style={{ color: t.text }}>
                                    The sample ends here.
                                </h3>
                                <p className="upsell-sub" style={{ color: t.muted }}>
                                    Continue reading <em style={{ fontFamily: "'Playfair Display', serif" }}>{sample.title}</em> — available as a signed hardcover, paperback, ebook, and audiobook.
                                </p>
                                <a
                                    href={`/books/${slug}`}
                                    className="upsell-btn"
                                    style={{ background: sample.coverAccent, color: "#fff" }}
                                    onClick={onClose}
                                >
                                    Buy the Book →
                                </a>
                            </div>
                        )}
                    </div>

                    {/* ── Footer ── */}
                    {currentPage < totalPages && (
                        <div
                            className="reader-footer"
                            style={{ background: t.pageBg, borderColor: t.border }}
                        >
                            <button
                                className="nav-arrow"
                                style={{ borderColor: t.border, color: t.muted }}
                                onClick={goPrev}
                                disabled={currentPage === 0}
                                title="Previous page"
                            >
                                ←
                            </button>

                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                                <div className="page-dots">
                                    {sample.pages.map((_, i) => (
                                        <button
                                            key={i}
                                            className="page-dot"
                                            onClick={() => setCurrentPage(i)}
                                            style={{
                                                background: i === currentPage ? sample.coverAccent : t.border,
                                                width: i === currentPage ? "20px" : "6px",
                                                borderRadius: i === currentPage ? "3px" : "50%",
                                            }}
                                        />
                                    ))}
                                </div>
                                <span className="page-number-display" style={{ color: t.muted }}>
                  Page {page.pageNumber} of {totalPages}
                </span>
                            </div>

                            <button
                                className="nav-arrow"
                                style={{ borderColor: t.border, color: t.muted }}
                                onClick={goNext}
                                title={currentPage === totalPages - 1 ? "See purchase options" : "Next page"}
                            >
                                →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

// ─── Trigger Button ──────────────────────────────────────────────────────────
interface ReadSampleButtonProps {
    slug: string;
    accentColor?: string;
}

export function ReadSampleButton({ slug, accentColor = "#b8933a" }: ReadSampleButtonProps) {
    const [open, setOpen] = useState(false);
    const hasSample = !!BOOK_SAMPLES[slug];

    if (!hasSample) return null;

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "9px",
                    padding: "11px 22px",
                    background: "transparent",
                    border: `1px solid ${accentColor}55`,
                    borderRadius: "3px",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: accentColor,
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: "pointer",
                    letterSpacing: "0.06em",
                    transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = `${accentColor}12`;
                    (e.currentTarget as HTMLButtonElement).style.borderColor = accentColor;
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = `${accentColor}55`;
                }}
            >
                <span style={{ fontSize: "16px" }}>📖</span>
                Read a Sample
            </button>

            <ReadingSampleModal
                slug={slug}
                isOpen={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
}

// ─── Default export for demo ─────────────────────────────────────────────────
export default function BookSampleDemo() {
    const [activeSlug, setActiveSlug] = useState<string | null>(null);

    const books = [
        { slug: "the-quiet-hours", title: "The Quiet Hours", cover: "#1a1612", accent: "#b8933a" },
        { slug: "essays-on-silence", title: "Essays on Silence", cover: "#0c1a14", accent: "#4a9e6b" },
        { slug: "the-second-draft", title: "The Second Draft", cover: "#16101a", accent: "#8a6bb8" },
    ];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #0e0d0b; color: #f7f3ee; min-height: 100vh; }
      `}</style>

            <div style={{ minHeight: "100vh", background: "#0e0d0b", padding: "80px 40px" }}>
                <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                    <div style={{ marginBottom: "12px", fontSize: "10px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#b8933a" }}>
                        Reading Samples
                    </div>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 600, marginBottom: "48px", lineHeight: 1.1 }}>
                        Try Before You Buy
                    </h1>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
                        {books.map((book) => (
                            <div
                                key={book.slug}
                                style={{
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: "6px",
                                    overflow: "hidden",
                                    background: "rgba(255,255,255,0.02)",
                                }}
                            >
                                {/* Mini cover */}
                                <div
                                    style={{
                                        background: book.cover,
                                        aspectRatio: "16/9",
                                        display: "flex",
                                        alignItems: "flex-end",
                                        padding: "20px 24px",
                                        position: "relative",
                                        overflow: "hidden",
                                    }}
                                >
                                    <div
                                        style={{
                                            position: "absolute",
                                            inset: 0,
                                            backgroundImage: "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)",
                                            backgroundSize: "12px 12px",
                                            color: book.accent,
                                            opacity: 0.07,
                                        }}
                                    />
                                    <div style={{ position: "relative", zIndex: 1 }}>
                                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>
                                            {book.title}
                                        </div>
                                    </div>
                                </div>

                                {/* Card body */}
                                <div style={{ padding: "20px 24px 24px" }}>
                                    <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", fontWeight: 300, marginBottom: "16px" }}>
                                        Read the opening pages free — no signup required.
                                    </div>
                                    <button
                                        onClick={() => setActiveSlug(book.slug)}
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            padding: "10px 20px",
                                            background: "transparent",
                                            border: `1px solid ${book.accent}55`,
                                            borderRadius: "3px",
                                            fontSize: "12px",
                                            fontWeight: 500,
                                            color: book.accent,
                                            fontFamily: "'DM Sans', sans-serif",
                                            cursor: "pointer",
                                            letterSpacing: "0.07em",
                                            transition: "all 0.18s",
                                        }}
                                        onMouseEnter={(e) => {
                                            (e.currentTarget as HTMLButtonElement).style.background = `${book.accent}14`;
                                            (e.currentTarget as HTMLButtonElement).style.borderColor = book.accent;
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                                            (e.currentTarget as HTMLButtonElement).style.borderColor = `${book.accent}55`;
                                        }}
                                    >
                                        📖 Read Sample
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {activeSlug && (
                <ReadingSampleModal
                    slug={activeSlug}
                    isOpen={!!activeSlug}
                    onClose={() => setActiveSlug(null)}
                />
            )}
        </>
    );
}