"use client";

// ============================================================
//  FILE: app/books/[slug]/page.tsx
//
//  Everything is in this ONE file:
//  ✅ Book data
//  ✅ Book detail page (hero, tabs, sidebar, author, related)
//  ✅ "Read a Sample" button
//  ✅ Full reading modal (themes, font size, page turn, upsell)
//
//  HOW TO USE:
//  1. Copy this file to: app/books/[slug]/page.tsx
//  2. Replace Navbar / Footer imports with your own
//  3. Add your real book data to the BOOKS array
//  4. Add your sample pages to BOOK_SAMPLES
//  Done ✅
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";

// ──────────────────────────────────────────────
// 1. BOOK DATA  ← Edit this with your real books
// ──────────────────────────────────────────────
const BOOKS = [
    {
        slug: "the-quiet-hours",
        title: "The Quiet Hours",
        subtitle: "A Novel",
        author: "James Whitfield",
        authorBio: "James Whitfield is an award-winning novelist and essayist based in Edinburgh. The Quiet Hours is his debut novel.",
        year: "2025",
        pages: "312",
        genre: "Literary Fiction",
        isbn: "978-1-234567-89-0",
        language: "English",
        publisher: "Canongate Books",
        coverColor: "#1a1612",
        coverAccent: "#b8933a",
        tagline: "Some silences are louder than words.",
        description: [
            "When Thomas Meredith returns to his childhood home after his mother's death, he finds more than he expected — letters he was never meant to read, a neighbor with long memories, and a version of his family that bears little resemblance to the one he constructed in exile.",
            "The Quiet Hours is a novel about the stories families tell themselves to stay intact, and what happens when those stories finally unravel.",
        ],
        praise: "A masterwork of controlled feeling. Whitfield writes grief the way Chekhov wrote longing — obliquely, devastatingly.",
        praiseAuthor: "— Colm Tóibín",
        formats: [
            { label: "Signed Hardcover", price: "$34.00", badge: "Limited" },
            { label: "Paperback",        price: "$18.00" },
            { label: "eBook",            price: "$9.99"  },
        ],
        chapters: [
            "I. The House in Winter",
            "II. Letters Without Postmarks",
            "III. What the Neighbor Knew",
            "IV. The Version We Agreed On",
            "V. The Quiet Hours",
        ],
        reviews: [
            { name: "Sarah K.", location: "Edinburgh", rating: 5, text: "One of those books that changes the temperature of a room." },
            { name: "Daniel M.", location: "New York",  rating: 5, text: "Extraordinary prose. I've already bought three copies to give away." },
        ],
        relatedSlugs: ["essays-on-silence", "the-second-draft"],
    },
    {
        slug: "essays-on-silence",
        title: "Essays on Silence",
        subtitle: "On Writing, Reading & the Space Between",
        author: "James Whitfield",
        authorBio: "James Whitfield's essays have appeared in the London Review of Books, The Paris Review, and Granta.",
        year: "2023",
        pages: "224",
        genre: "Literary Essays",
        isbn: "978-1-234567-00-5",
        language: "English",
        publisher: "Canongate Books",
        coverColor: "#0c1a14",
        coverAccent: "#4a9e6b",
        tagline: "The page is not empty. It is waiting.",
        description: [
            "Fourteen essays on the craft and condition of writing. Ranging across Chekhov, Woolf, Robinson, and Baldwin, these essays are part criticism, part memoir.",
        ],
        praise: "Every writer should read this book twice. Once for what it says. Once for how it says it.",
        praiseAuthor: "— Anne Enright",
        formats: [
            { label: "Hardcover",  price: "$28.00" },
            { label: "Paperback",  price: "$16.00", badge: "Bestseller" },
            { label: "eBook",      price: "$8.99"  },
        ],
        chapters: [
            "On the First Sentence",
            "What Chekhov Knew About Weather",
            "The Silence Woolf Worked In",
            "Against Productivity",
            "Why I Write",
        ],
        reviews: [
            { name: "Tom H.",    location: "Dublin", rating: 5, text: "The essay on Chekhov alone is worth the price of the book." },
            { name: "Miriam L.", location: "Berlin", rating: 5, text: "I keep this on my desk. I open it before I write." },
        ],
        relatedSlugs: ["the-quiet-hours", "the-second-draft"],
    },
    {
        slug: "the-second-draft",
        title: "The Second Draft",
        subtitle: "A Practical Guide to Revision",
        author: "James Whitfield",
        authorBio: "James Whitfield has taught creative writing at the University of Edinburgh for over a decade.",
        year: "2024",
        pages: "186",
        genre: "Writing Craft",
        isbn: "978-1-234567-45-6",
        language: "English",
        publisher: "Self-Published",
        coverColor: "#16101a",
        coverAccent: "#8a6bb8",
        tagline: "The first draft is a private argument. The second is the truth.",
        description: [
            "Most writing guides tell you how to start. The Second Draft tells you how to finish. Built around the principle that revision is not correction but discovery.",
        ],
        praise: "The most useful writing book I have read in years. Clear-eyed, honest, and genuinely practical.",
        praiseAuthor: "— Maggie O'Farrell",
        formats: [
            { label: "Paperback",        price: "$22.00" },
            { label: "eBook",            price: "$10.99", badge: "Popular" },
            { label: "PDF + Worksheets", price: "$14.99" },
        ],
        chapters: [
            "What Is a Second Draft",
            "Reading Your Own Work Coldly",
            "Structure Before Sentences",
            "The Scene That Doesn't Belong",
            "The Final Read",
        ],
        reviews: [
            { name: "Laura F.", location: "Toronto", rating: 5, text: "I've been stuck on my second draft for 8 months. I read this in a weekend and now I know what to do." },
            { name: "Alex B.",  location: "Sydney",  rating: 4, text: "Refreshingly honest about how hard revision actually is." },
        ],
        relatedSlugs: ["essays-on-silence", "the-quiet-hours"],
    },
];

// ──────────────────────────────────────────────────────────
// 2. SAMPLE PAGES  ← Edit this with your real sample content
//    Each book slug maps to an array of pages.
//    Add as many pages as you want. The reader shows them all,
//    then shows a "Buy the Book" screen at the end.
// ──────────────────────────────────────────────────────────
const BOOK_SAMPLES: Record<string, { pages: Array<{ pageNumber: number; chapter?: string; isChapterStart?: boolean; content: string[] }> }> = {
    "the-quiet-hours": {
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
                ],
            },
            {
                pageNumber: 3,
                content: [
                    "The house was smaller than he remembered. This was always true of houses, he knew — it was the child inside the adult that made them seem diminished — but knowing this did not stop the small shock of it.",
                    "The key was under the third flowerpot from the left, where it had been for forty years. His mother had told people this freely, without embarrassment. \"If anyone wanted to rob me,\" she had said once, \"I wouldn't want them to damage the door.\"",
                    "Inside, the house smelled of her — of the particular soap she used, of old paper, of something faintly floral that he could not identify and had stopped trying to. He stood in the hallway with his bag and did not move.",
                ],
            },
        ],
    },
    "essays-on-silence": {
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
                    "Compare this with the Victorian novel's habit of elaborate scene-setting, its insistence on context, its anxiety that the reader might feel lost. The Victorian first sentence holds your hand. The Chekhovian first sentence lets go immediately.",
                    "I find myself, in my own writing, always working toward the moment when I can let go. The early drafts hold on too tight. They explain. They qualify. They apologize, in a hundred small ways, for having begun.",
                ],
            },
        ],
    },
    "the-second-draft": {
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
                    "The worst thing you can do with a first draft is open it and begin correcting sentences. This is the writer's equivalent of rearranging deckchairs. The sentences may be wrong, but they are not the problem. The structure is the problem.",
                    "Read the whole thing first. Without a pen. Without annotating. Just read it as a reader would, as someone encountering it for the first time, and notice what you feel.",
                    "Where do you slow down, in the bad sense? Where do you lose the thread? Where do you feel the writer trying too hard, compensating with language for a structural uncertainty? These are the places you return to. These are the problems worth solving.",
                ],
            },
        ],
    },
};

// ──────────────────────────────────────────────
// 3. READING MODAL COMPONENT (internal)
// ──────────────────────────────────────────────
function ReadingModal({
                          slug,
                          isOpen,
                          onClose,
                      }: {
    slug: string;
    isOpen: boolean;
    onClose: () => void;
}) {
    const sample = BOOK_SAMPLES[slug];
    const book   = BOOKS.find((b) => b.slug === slug);
    const [currentPage, setCurrentPage] = useState(0);
    const [flipping,    setFlipping]    = useState<"next" | "prev" | null>(null);
    const [theme,       setTheme]       = useState<"parchment" | "white" | "night">("parchment");
    const [fontSize,    setFontSize]    = useState<"sm" | "md" | "lg">("md");

    const totalPages = sample?.pages.length ?? 0;

    const goNext = useCallback(() => {
        if (flipping) return;
        setFlipping("next");
        setTimeout(() => { setCurrentPage((p) => Math.min(p + 1, totalPages)); setFlipping(null); }, 300);
    }, [flipping, totalPages]);

    const goPrev = useCallback(() => {
        if (flipping || currentPage === 0) return;
        setFlipping("prev");
        setTimeout(() => { setCurrentPage((p) => p - 1); setFlipping(null); }, 300);
    }, [flipping, currentPage]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;
        const fn = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft")  goPrev();
            if (e.key === "Escape")     onClose();
        };
        window.addEventListener("keydown", fn);
        return () => window.removeEventListener("keydown", fn);
    }, [isOpen, goNext, goPrev, onClose]);

    // Lock body scroll while open
    useEffect(() => {
        if (isOpen) {
            setCurrentPage(0);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen || !sample || !book) return null;

    const isLastPage = currentPage >= totalPages;
    const page       = sample.pages[currentPage];

    // Theme colours
    const T = {
        parchment: { bg: "#f7f3ee", page: "#faf7f2", text: "#1a1612", muted: "#7a7369", border: "rgba(14,13,11,0.1)"  },
        white:     { bg: "#ffffff", page: "#ffffff", text: "#111111", muted: "#888888", border: "rgba(0,0,0,0.08)"    },
        night:     { bg: "#12100e", page: "#1a1714", text: "#e8e0d4", muted: "#7a7066", border: "rgba(255,255,255,0.08)" },
    }[theme];

    const FS = { sm: "15px", md: "17px", lg: "20px" }[fontSize];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Lora:ital,wght@0,400;1,400&display=swap');

        @keyframes __overlayIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes __modalIn    { from { opacity:0; transform:scale(0.96) } to { opacity:1; transform:scale(1) } }
        @keyframes __flipNext   { 0%{opacity:1;transform:translateX(0)} 50%{opacity:0;transform:translateX(-24px)} 100%{opacity:1;transform:translateX(0)} }
        @keyframes __flipPrev   { 0%{opacity:1;transform:translateX(0)} 50%{opacity:0;transform:translateX(24px)}  100%{opacity:1;transform:translateX(0)} }

        .__overlay {
          position:fixed; inset:0; z-index:9999;
          background:rgba(0,0,0,0.85);
          display:flex; align-items:center; justify-content:center;
          padding:16px;
          animation: __overlayIn .2s ease;
        }
        .__modal {
          width:100%; max-width:760px; max-height:92vh;
          display:flex; flex-direction:column;
          border-radius:8px; overflow:hidden;
          animation: __modalIn .3s cubic-bezier(.34,1.2,.64,1);
          box-shadow: 0 40px 100px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.06);
        }
        .__header {
          display:flex; align-items:center; justify-content:space-between;
          padding:12px 20px; flex-shrink:0; gap:12px;
          border-bottom:1px solid;
        }
        .__hLeft  { display:flex; align-items:center; gap:10px; min-width:0; }
        .__miniCover {
          width:26px; height:38px; border-radius:2px 3px 3px 2px;
          flex-shrink:0; display:flex; align-items:flex-end; padding:4px 5px;
          position:relative; overflow:hidden;
        }
        .__miniCover::before {
          content:''; position:absolute; left:0; top:0; bottom:0;
          width:3px; background:rgba(0,0,0,.35);
        }
        .__hTitle  { font-family:'Playfair Display',serif; font-size:13px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .__hAuthor { font-size:11px; margin-top:1px; }
        .__badge   {
          font-size:9px; font-weight:600; letter-spacing:.14em; text-transform:uppercase;
          padding:3px 8px; border-radius:2px; flex-shrink:0; border:1px solid;
        }
        .__hRight { display:flex; align-items:center; gap:5px; flex-shrink:0; }
        .__cb {
          width:28px; height:28px; border-radius:4px; border:1px solid;
          background:transparent; cursor:pointer; font-size:11px;
          display:flex; align-items:center; justify-content:center;
          transition:all .15s; font-family:inherit;
        }
        .__sep { width:1px; height:18px; margin:0 3px; }
        .__body { flex:1; overflow-y:auto; padding:56px 68px; }
        @media(max-width:560px){ .__body{padding:32px 24px;} .__header{padding:10px 14px;} }
        .__page { max-width:540px; margin:0 auto; }
        .__flipNext { animation:__flipNext .3s ease; }
        .__flipPrev { animation:__flipPrev .3s ease; }
        .__chapterHead { text-align:center; margin-bottom:44px; }
        .__chRule  { width:40px; height:1px; margin:0 auto 14px; }
        .__chLabel { font-size:9px; font-weight:600; letter-spacing:.22em; text-transform:uppercase; margin-bottom:8px; }
        .__chTitle { font-family:'Playfair Display',serif; font-size:clamp(20px,3.5vw,26px); font-weight:600; }
        .__para {
          font-family:'Lora',serif;
          line-height:1.9; margin-bottom:22px;
          text-align:justify; hyphens:auto;
        }
        .__para:first-of-type::first-letter {
          float:left;
          font-family:'Playfair Display',serif;
          font-size:4em; line-height:.78;
          margin:8px 10px -4px 0; font-weight:600;
        }
        .__nodrop::first-letter { all:unset; }
        .__ornament { text-align:center; margin-top:36px; font-size:14px; opacity:.35; }
        .__footer {
          display:flex; align-items:center; justify-content:space-between;
          padding:12px 20px; border-top:1px solid; flex-shrink:0;
        }
        .__navBtn {
          width:36px; height:36px; border-radius:50%; border:1px solid;
          background:transparent; cursor:pointer; font-size:15px;
          display:flex; align-items:center; justify-content:center;
          transition:all .18s;
        }
        .__navBtn:disabled { opacity:.2; cursor:not-allowed; }
        .__dots { display:flex; align-items:center; gap:6px; }
        .__dot  { border:none; cursor:pointer; border-radius:3px; transition:all .2s; background:transparent; }
        .__pageNum { font-size:11px; letter-spacing:.1em; margin-top:5px; text-align:center; }

        .__upsell { text-align:center; padding:48px 24px 56px; }
        .__upsellRule { width:36px; height:1px; margin:0 auto 24px; }
        .__upsellTitle { font-family:'Playfair Display',serif; font-size:clamp(20px,3.5vw,28px); font-weight:600; margin-bottom:12px; }
        .__upsellSub   { font-size:14px; font-weight:300; line-height:1.75; max-width:360px; margin:0 auto 28px; }
        .__upsellBtn   {
          display:inline-flex; align-items:center; gap:10px;
          padding:13px 30px; border-radius:3px; border:none;
          font-size:13px; font-weight:600; letter-spacing:.08em; text-transform:uppercase;
          cursor:pointer; font-family:inherit; text-decoration:none;
          transition:opacity .2s;
        }
        .__upsellBtn:hover { opacity:.85; }
      `}</style>

            {/* Overlay — click outside to close */}
            <div className="__overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
                <div className="__modal" style={{ background: T.bg }}>

                    {/* ── Header ── */}
                    <div className="__header" style={{ background: T.page, borderColor: T.border }}>
                        <div className="__hLeft">
                            {/* Mini book cover */}
                            <div className="__miniCover" style={{ background: book.coverColor }}>
                <span style={{ fontSize: "5px", color: book.coverAccent, fontWeight: 700, position: "relative", zIndex: 1, lineHeight: 1, letterSpacing: ".04em" }}>
                  {book.title.split(" ").map((w) => w[0]).join("").slice(0, 3)}
                </span>
                            </div>
                            <div>
                                <div className="__hTitle"  style={{ color: T.text    }}>{book.title}</div>
                                <div className="__hAuthor" style={{ color: T.muted   }}>{book.author}</div>
                            </div>
                            <div
                                className="__badge"
                                style={{ color: book.coverAccent, borderColor: `${book.coverAccent}44`, background: `${book.coverColor}22` }}
                            >
                                Free Sample
                            </div>
                        </div>

                        <div className="__hRight">
                            {/* Theme buttons */}
                            {(["parchment", "white", "night"] as const).map((th) => {
                                const bg = th === "parchment" ? "#f7f3ee" : th === "white" ? "#ffffff" : "#12100e";
                                return (
                                    <button
                                        key={th}
                                        className="__cb"
                                        title={`${th} theme`}
                                        onClick={() => setTheme(th)}
                                        style={{
                                            background: bg,
                                            borderColor: theme === th ? book.coverAccent : T.border,
                                            outline: theme === th ? `2px solid ${book.coverAccent}` : "none",
                                            outlineOffset: "1px",
                                        }}
                                    />
                                );
                            })}

                            <div className="__sep" style={{ background: T.border }} />

                            {/* Font-size buttons */}
                            {(["sm", "md", "lg"] as const).map((sz, i) => (
                                <button
                                    key={sz}
                                    className="__cb"
                                    title={`${sz === "sm" ? "Small" : sz === "md" ? "Medium" : "Large"} text`}
                                    onClick={() => setFontSize(sz)}
                                    style={{
                                        color: T.text,
                                        borderColor: fontSize === sz ? book.coverAccent : T.border,
                                        fontSize: ["10px", "12px", "14px"][i],
                                        fontWeight: fontSize === sz ? 700 : 400,
                                    }}
                                >
                                    A
                                </button>
                            ))}

                            <div className="__sep" style={{ background: T.border }} />

                            {/* Close */}
                            <button
                                className="__cb"
                                onClick={onClose}
                                title="Close"
                                style={{ color: T.muted, borderColor: T.border, fontSize: "15px" }}
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* ── Page body ── */}
                    <div className="__body" style={{ background: T.page }}>
                        {!isLastPage ? (
                            <div className={`__page ${flipping === "next" ? "__flipNext" : flipping === "prev" ? "__flipPrev" : ""}`}>
                                {/* Chapter heading on chapter-start pages */}
                                {page.isChapterStart && page.chapter && (
                                    <div className="__chapterHead">
                                        <div className="__chRule"  style={{ background: book.coverAccent }} />
                                        <div className="__chLabel" style={{ color: book.coverAccent }}>
                                            {page.chapter.split(".")[0].trim()}
                                        </div>
                                        <div className="__chTitle" style={{ color: T.text }}>
                                            {page.chapter.split(". ").slice(1).join(". ")}
                                        </div>
                                    </div>
                                )}

                                {/* Paragraphs */}
                                {page.content.map((para, i) => (
                                    <p
                                        key={i}
                                        className={`__para ${i === 0 && page.isChapterStart ? "" : "__nodrop"}`}
                                        style={{ fontSize: FS, color: T.text }}
                                    >
                                        {para}
                                    </p>
                                ))}

                                <div className="__ornament" style={{ color: T.text }}>✦</div>
                            </div>
                        ) : (
                            /* ── End-of-sample upsell ── */
                            <div className="__upsell">
                                <div className="__upsellRule"  style={{ background: book.coverAccent }} />
                                <h2 className="__upsellTitle"  style={{ color: T.text }}>
                                    The sample ends here.
                                </h2>
                                <p  className="__upsellSub"    style={{ color: T.muted }}>
                                    Continue reading{" "}
                                    <em style={{ fontFamily: "'Playfair Display',serif" }}>{book.title}</em>
                                    {" "}— available as signed hardcover, paperback, and ebook.
                                </p>
                                <a
                                    href={`/books/${slug}`}
                                    className="__upsellBtn"
                                    style={{ background: book.coverAccent, color: "#fff" }}
                                    onClick={onClose}
                                >
                                    Buy the Book →
                                </a>
                            </div>
                        )}
                    </div>

                    {/* ── Footer nav ── */}
                    {!isLastPage && (
                        <div className="__footer" style={{ background: T.page, borderColor: T.border }}>
                            {/* Prev */}
                            <button
                                className="__navBtn"
                                style={{ borderColor: T.border, color: T.muted }}
                                onClick={goPrev}
                                disabled={currentPage === 0}
                                title="Previous page"
                            >←</button>

                            {/* Page dots + number */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <div className="__dots">
                                    {sample.pages.map((_, i) => (
                                        <button
                                            key={i}
                                            className="__dot"
                                            onClick={() => setCurrentPage(i)}
                                            style={{
                                                width:   i === currentPage ? "20px" : "6px",
                                                height:  "6px",
                                                background: i === currentPage ? book.coverAccent : T.border,
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className="__pageNum" style={{ color: T.muted }}>
                                    Page {page.pageNumber} of {totalPages}
                                </div>
                            </div>

                            {/* Next */}
                            <button
                                className="__navBtn"
                                style={{ borderColor: T.border, color: T.muted }}
                                onClick={goNext}
                                title="Next page"
                            >→</button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

// ──────────────────────────────────────────────
// 4. BOOK DETAIL PAGE  (the main page component)
// ──────────────────────────────────────────────
export default function BookDetailPage() {
    const params = useParams();
    const slug   = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : "";
    const book   = BOOKS.find((b) => b.slug === slug);
    if (!book) return notFound();

    const [selectedFormat, setSelectedFormat] = useState(0);
    const [qty,            setQty]            = useState(1);
    const [addedToCart,    setAddedToCart]    = useState(false);
    const [activeTab,      setActiveTab]      = useState<"about" | "chapters" | "reviews">("about");

    // ★ This one state controls the modal open/close ★
    const [sampleOpen, setSampleOpen] = useState(false);

    const relatedBooks = BOOKS.filter((b) => book.relatedSlugs.includes(b.slug));
    const hasSample    = !!BOOK_SAMPLES[slug];

    function handleAddToCart() {
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2200);
    }

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'DM Sans',sans-serif;background:#f7f3ee;color:#0e0d0b;}

        .bc{background:#0e0d0b;}
        .bc-inner{max-width:1200px;margin:0 auto;padding:140px 40px 0;display:flex;align-items:center;gap:8px;font-size:12px;color:rgba(255,255,255,.3);letter-spacing:.05em;}
        .bc-inner a{color:rgba(255,255,255,.3);text-decoration:none;transition:color .2s;}
        .bc-inner a:hover{color:#b8933a;}

        .bk-hero{background:#0e0d0b;padding:48px 40px 0;position:relative;overflow:hidden;}
        .bk-hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 55% 70% at 80% 30%,rgba(184,147,58,.07) 0%,transparent 65%);pointer-events:none;}
        .bk-grid{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:320px 1fr;gap:72px;align-items:end;}
        @media(max-width:860px){.bk-grid{grid-template-columns:1fr;gap:40px;}.bk-hero{padding:40px 24px 0;}.bc-inner{padding:120px 24px 0;}}

        .cover-wrap{padding-bottom:40px;position:relative;}
        .cover-book{width:100%;aspect-ratio:2/3;border-radius:4px 8px 8px 4px;position:relative;display:flex;flex-direction:column;justify-content:space-between;padding:32px 24px;overflow:hidden;
          box-shadow:-8px 0 0 rgba(0,0,0,.4),-12px 4px 24px rgba(0,0,0,.6),0 20px 60px rgba(0,0,0,.5);
          transform:perspective(1000px) rotateY(-4deg);transition:transform .4s ease;}
        .cover-book:hover{transform:perspective(1000px) rotateY(0deg);}
        .cover-spine{position:absolute;left:0;top:0;bottom:0;width:7px;background:rgba(0,0,0,.45);border-radius:4px 0 0 4px;}
        .cover-pattern{position:absolute;inset:0;opacity:.06;background-image:repeating-linear-gradient(45deg,currentColor 0,currentColor 1px,transparent 0,transparent 50%);background-size:12px 12px;}
        .cover-genre{font-size:9px;font-weight:500;letter-spacing:.22em;text-transform:uppercase;opacity:.55;position:relative;z-index:1;}
        .cover-titles{position:relative;z-index:1;}
        .cover-title-txt{font-family:'Playfair Display',serif;font-size:clamp(22px,4vw,30px);font-weight:600;color:#fff;line-height:1.1;margin-bottom:6px;}
        .cover-author-txt{font-size:11px;font-weight:300;letter-spacing:.12em;color:rgba(255,255,255,.5);}
        .limited-badge{position:absolute;bottom:52px;right:-10px;width:68px;height:68px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:8px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#fff;line-height:1.4;text-align:center;padding:8px;z-index:10;}

        .hero-r{padding-bottom:52px;display:flex;flex-direction:column;}
        .genre-pill{display:inline-flex;align-items:center;font-size:10px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;padding:4px 12px;border-radius:2px;margin-bottom:18px;width:fit-content;border:1px solid;}
        .book-title-h{font-family:'Playfair Display',serif;font-size:clamp(34px,5vw,58px);color:#fff;font-weight:600;line-height:1.05;margin-bottom:8px;}
        .book-sub-h{font-family:'Playfair Display',serif;font-style:italic;font-size:clamp(16px,2.2vw,21px);color:rgba(255,255,255,.4);margin-bottom:26px;}
        .tagline-strip{font-size:15px;font-weight:300;color:rgba(255,255,255,.5);line-height:1.75;margin-bottom:32px;max-width:480px;border-left:2px solid;padding-left:16px;}
        .praise-box{background:rgba(184,147,58,.07);border:1px solid rgba(184,147,58,.18);border-radius:4px;padding:18px 22px;margin-bottom:32px;}
        .praise-txt{font-family:'Playfair Display',serif;font-style:italic;font-size:15px;color:rgba(255,255,255,.6);line-height:1.65;margin-bottom:8px;}
        .praise-by{font-size:11px;letter-spacing:.06em;}
        .meta-chips{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:36px;}
        .mchip{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:2px;padding:5px 11px;font-size:11px;color:rgba(255,255,255,.35);letter-spacing:.04em;}
        .mchip span{color:rgba(255,255,255,.65);margin-left:4px;}
        .fmt-label{font-size:10px;font-weight:500;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:9px;}
        .fmt-grid{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:22px;}
        .fmt-btn{position:relative;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:3px;padding:9px 16px;font-size:13px;font-weight:400;color:rgba(255,255,255,.5);cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .18s;display:flex;flex-direction:column;gap:2px;}
        .fmt-btn:hover{border-color:rgba(184,147,58,.4);color:rgba(255,255,255,.8);}
        .fmt-btn.sel{background:rgba(184,147,58,.1);border-color:#b8933a;color:#fff;}
        .fmt-price{font-size:15px;font-weight:500;color:#b8933a;}
        .fmt-badge{position:absolute;top:-7px;right:-7px;background:#b8933a;color:#fff;font-size:8px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;padding:2px 6px;border-radius:2px;}

        /* ★ CTA row — contains both Add to Cart and Read Sample ★ */
        .cta-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
        .qty-ctrl{display:flex;align-items:center;border:1px solid rgba(255,255,255,.12);border-radius:3px;overflow:hidden;}
        .qty-btn{background:rgba(255,255,255,.05);border:none;color:rgba(255,255,255,.6);width:34px;height:42px;font-size:17px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:background .15s;display:flex;align-items:center;justify-content:center;}
        .qty-btn:hover{background:rgba(255,255,255,.1);}
        .qty-val{width:38px;text-align:center;color:#fff;font-size:14px;font-weight:500;border-left:1px solid rgba(255,255,255,.08);border-right:1px solid rgba(255,255,255,.08);height:42px;display:flex;align-items:center;justify-content:center;}
        .add-btn{flex:1;min-width:160px;background:#b8933a;border:none;border-radius:3px;height:42px;padding:0 24px;font-size:13px;font-weight:500;color:#fff;font-family:'DM Sans',sans-serif;cursor:pointer;letter-spacing:.07em;text-transform:uppercase;transition:all .2s;}
        .add-btn:hover{background:#a07d2e;}
        .add-btn.added{background:#2d6a4a;pointer-events:none;}

        /* ★ Read Sample button ★ */
        .sample-btn{display:inline-flex;align-items:center;gap:8px;padding:0 20px;height:42px;background:transparent;border-radius:3px;font-size:12px;font-weight:500;font-family:'DM Sans',sans-serif;cursor:pointer;letter-spacing:.07em;text-transform:uppercase;transition:all .2s;border:1px solid;}

        .notch{height:52px;background:#0e0d0b;clip-path:polygon(0 0,100% 0,100% 20%,0 100%);}

        .content-sec{background:#f7f3ee;padding:80px 40px;}
        @media(max-width:860px){.content-sec{padding:56px 24px;}}
        .content-grid{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 340px;gap:72px;}
        @media(max-width:980px){.content-grid{grid-template-columns:1fr;gap:48px;}}

        .tab-nav{display:flex;border-bottom:1px solid rgba(14,13,11,.1);margin-bottom:36px;}
        .tab-btn{background:none;border:none;border-bottom:2px solid transparent;padding:10px 18px 13px;font-size:13px;font-weight:500;color:#7a7369;font-family:'DM Sans',sans-serif;cursor:pointer;letter-spacing:.04em;transition:all .18s;margin-bottom:-1px;}
        .tab-btn:hover{color:#0e0d0b;}
        .tab-btn.active{color:#0e0d0b;border-bottom-color:#b8933a;}

        .about-p{font-size:17px;font-weight:300;line-height:1.85;color:#2a2720;margin-bottom:22px;}
        .ch-list{list-style:none;counter-reset:ch;}
        .ch-item{counter-increment:ch;display:flex;align-items:baseline;gap:14px;padding:13px 0;border-bottom:1px solid rgba(14,13,11,.08);font-size:15px;color:#2a2720;}
        .ch-item::before{content:counter(ch,upper-roman);font-family:'Playfair Display',serif;font-size:11px;color:#b8933a;min-width:22px;letter-spacing:.06em;}
        .rv-card{background:#fff;border:1px solid rgba(14,13,11,.08);border-radius:4px;padding:22px 26px;margin-bottom:14px;}
        .rv-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
        .rv-name{font-size:14px;font-weight:500;color:#0e0d0b;}
        .rv-loc{font-size:11px;color:#7a7369;margin-top:1px;}
        .rv-txt{font-size:14px;font-weight:300;line-height:1.75;color:#4a4540;}
        .stars{display:flex;gap:2px;}

        .sb-card{background:#fff;border:1px solid rgba(14,13,11,.08);border-radius:4px;padding:24px;margin-bottom:18px;}
        .sb-lbl{font-size:10px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:#7a7369;margin-bottom:16px;}
        .spec-row{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid rgba(14,13,11,.06);font-size:13px;}
        .spec-row:last-child{border-bottom:none;}
        .spec-l{color:#7a7369;} .spec-v{font-weight:500;}
        .guar-row{display:flex;align-items:flex-start;gap:10px;padding:8px 0;font-size:13px;color:#4a4540;font-weight:300;}
        .guar-icon{width:19px;height:19px;border-radius:50%;background:rgba(184,147,58,.12);display:flex;align-items:center;justify-content:center;font-size:9px;color:#b8933a;flex-shrink:0;margin-top:1px;}

        .author-sec{background:#0e0d0b;padding:72px 40px;}
        @media(max-width:860px){.author-sec{padding:52px 24px;}}
        .author-grid{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:auto 1fr;gap:44px;align-items:center;}
        @media(max-width:640px){.author-grid{grid-template-columns:1fr;}}
        .author-av{width:96px;height:96px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:30px;font-weight:600;color:#fff;flex-shrink:0;border:3px solid rgba(184,147,58,.22);}
        .author-eyebrow{font-size:9px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:#b8933a;margin-bottom:8px;}
        .author-name{font-family:'Playfair Display',serif;font-size:26px;color:#fff;font-weight:600;margin-bottom:10px;}
        .author-bio{font-size:15px;font-weight:300;color:rgba(255,255,255,.4);line-height:1.8;max-width:540px;}

        .rel-sec{background:#f7f3ee;padding:72px 40px;border-top:1px solid rgba(14,13,11,.08);}
        @media(max-width:860px){.rel-sec{padding:52px 24px;}}
        .rel-inner{max-width:1200px;margin:0 auto;}
        .sec-eyebrow{font-size:10px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:#b8933a;margin-bottom:28px;display:flex;align-items:center;gap:9px;}
        .sec-eyebrow::before{content:'';display:inline-block;width:26px;height:1px;background:#b8933a;}
        .rel-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:18px;}
        .rel-card{background:#fff;border:1px solid rgba(14,13,11,.08);border-radius:4px;overflow:hidden;text-decoration:none;color:inherit;display:flex;flex-direction:column;transition:transform .2s,box-shadow .2s;}
        .rel-card:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(14,13,11,.1);}
        .rel-cover{aspect-ratio:16/9;display:flex;align-items:flex-end;padding:16px 18px;position:relative;overflow:hidden;}
        .rel-cover::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.65) 0%,transparent 60%);}
        .rel-cover-title{font-family:'Playfair Display',serif;font-size:15px;font-weight:600;color:#fff;position:relative;z-index:1;line-height:1.2;}
        .rel-body{padding:14px 18px 18px;flex:1;display:flex;flex-direction:column;gap:5px;}
        .rel-genre{font-size:10px;font-weight:500;letter-spacing:.15em;text-transform:uppercase;color:#b8933a;}
        .rel-title{font-family:'Playfair Display',serif;font-size:14px;font-weight:600;line-height:1.3;}
        .rel-price{font-size:13px;color:#7a7369;margin-top:3px;}
        .rel-cta{font-size:12px;font-weight:500;color:#b8933a;margin-top:6px;display:inline-flex;align-items:center;gap:5px;transition:gap .2s;}
        .rel-card:hover .rel-cta{gap:9px;}

        .back-bar{background:#0e0d0b;padding:18px 40px;text-align:center;}
        .back-lnk{font-size:13px;color:rgba(255,255,255,.28);text-decoration:none;letter-spacing:.04em;transition:color .2s;}
        .back-lnk:hover{color:#b8933a;}
      `}</style>

            <Navbar />

            {/* ── Breadcrumb ── */}
            <div className="bc">
                <nav className="bc-inner">
                    <Link href="/">Home</Link>
                    <span style={{ opacity: .3 }}>›</span>
                    <Link href="/books">Books</Link>
                    <span style={{ opacity: .3 }}>›</span>
                    <span style={{ color: "rgba(255,255,255,.5)" }}>{book.title}</span>
                </nav>
            </div>

            {/* ── Hero ── */}
            <section className="bk-hero">
                <div className="bk-grid">

                    {/* Left: 3-D book cover */}
                    <AnimatedSection>
                        <div className="cover-wrap">
                            <div className="cover-book" style={{ background: book.coverColor, color: book.coverAccent }}>
                                <div className="cover-spine" />
                                <div className="cover-pattern" style={{ color: book.coverAccent }} />
                                <div className="cover-genre" style={{ color: book.coverAccent }}>{book.genre}</div>
                                <div className="cover-titles">
                                    <div className="cover-title-txt">{book.title}</div>
                                    <div className="cover-author-txt">{book.author}</div>
                                </div>
                            </div>
                            {book.formats[0].badge && (
                                <div
                                    className="limited-badge"
                                    style={{ background: book.coverAccent, boxShadow: `0 4px 16px ${book.coverAccent}55` }}
                                >
                                    {book.formats[0].badge}<br />Edition
                                </div>
                            )}
                        </div>
                    </AnimatedSection>

                    {/* Right: info + buy + READ SAMPLE */}
                    <AnimatedSection delay={0.1}>
                        <div className="hero-r">
                            <div
                                className="genre-pill"
                                style={{ color: book.coverAccent, borderColor: `${book.coverAccent}44` }}
                            >
                                {book.genre}
                            </div>
                            <h1 className="book-title-h">{book.title}</h1>
                            <p  className="book-sub-h">{book.subtitle}</p>
                            <p  className="tagline-strip" style={{ borderColor: book.coverAccent }}>
                                {book.tagline}
                            </p>

                            <div className="praise-box">
                                <p  className="praise-txt">"{book.praise}"</p>
                                <div className="praise-by" style={{ color: book.coverAccent }}>{book.praiseAuthor}</div>
                            </div>

                            <div className="meta-chips">
                                {[["Pages", book.pages], ["Year", book.year], ["Language", book.language], ["Publisher", book.publisher]].map(([l, v]) => (
                                    <span key={l} className="mchip">{l}<span>{v}</span></span>
                                ))}
                            </div>

                            {/* Format selector */}
                            <div className="fmt-label">Choose format</div>
                            <div className="fmt-grid">
                                {book.formats.map((fmt, i) => (
                                    <button
                                        key={i}
                                        className={`fmt-btn${selectedFormat === i ? " sel" : ""}`}
                                        onClick={() => setSelectedFormat(i)}
                                    >
                                        {fmt.badge && <span className="fmt-badge">{fmt.badge}</span>}
                                        <span style={{ fontSize: "13px" }}>{fmt.label}</span>
                                        <span className="fmt-price">{fmt.price}</span>
                                    </button>
                                ))}
                            </div>

                            {/* ───────────────────────────────────────────────────────────
                  CTA ROW
                  • Qty stepper
                  • Add to Cart button
                  • ★ READ A SAMPLE button — onClick={() => setSampleOpen(true)} ★
              ─────────────────────────────────────────────────────────── */}
                            <div className="cta-row">
                                {/* Qty */}
                                <div className="qty-ctrl">
                                    <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                                    <div className="qty-val">{qty}</div>
                                    <button className="qty-btn" onClick={() => setQty((q) => q + 1)}>+</button>
                                </div>

                                {/* Add to cart */}
                                <button
                                    className={`add-btn${addedToCart ? " added" : ""}`}
                                    onClick={handleAddToCart}
                                >
                                    {addedToCart ? "✓ Added" : `Add to Cart — ${book.formats[selectedFormat].price}`}
                                </button>

                                {/* ★ READ A SAMPLE — opens the modal ★ */}
                                {hasSample && (
                                    <button
                                        className="sample-btn"
                                        onClick={() => setSampleOpen(true)}   /* ← this opens the modal */
                                        style={{
                                            color:        book.coverAccent,
                                            borderColor: `${book.coverAccent}55`,
                                        }}
                                        onMouseEnter={(e) => {
                                            (e.currentTarget as HTMLButtonElement).style.background    = `${book.coverAccent}14`;
                                            (e.currentTarget as HTMLButtonElement).style.borderColor   = book.coverAccent;
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.currentTarget as HTMLButtonElement).style.background    = "transparent";
                                            (e.currentTarget as HTMLButtonElement).style.borderColor   = `${book.coverAccent}55`;
                                        }}
                                    >
                                        📖 Read Sample
                                    </button>
                                )}
                            </div>
                        </div>
                    </AnimatedSection>
                </div>

                <div className="notch" />
            </section>

            {/* ── Reading modal — renders when sampleOpen === true ── */}
            <ReadingModal
                slug={slug}
                isOpen={sampleOpen}
                onClose={() => setSampleOpen(false)}   /* ← this closes the modal */
            />

            {/* ── Content tabs + sidebar ── */}
            <section className="content-sec">
                <div className="content-grid">
                    {/* Tabs */}
                    <div>
                        <div className="tab-nav">
                            {(["about", "chapters", "reviews"] as const).map((t) => (
                                <button
                                    key={t}
                                    className={`tab-btn${activeTab === t ? " active" : ""}`}
                                    onClick={() => setActiveTab(t)}
                                >
                                    {t === "about" ? "About the Book" : t === "chapters" ? "Contents" : `Reviews (${book.reviews.length})`}
                                </button>
                            ))}
                        </div>

                        {activeTab === "about" && book.description.map((p, i) => (
                            <p key={i} className="about-p">{p}</p>
                        ))}

                        {activeTab === "chapters" && (
                            <ol className="ch-list">
                                {book.chapters.map((ch, i) => (
                                    <li key={i} className="ch-item">{ch}</li>
                                ))}
                            </ol>
                        )}

                        {activeTab === "reviews" && book.reviews.map((rv, i) => (
                            <div key={i} className="rv-card">
                                <div className="rv-hd">
                                    <div>
                                        <div className="rv-name">{rv.name}</div>
                                        <div className="rv-loc">{rv.location}</div>
                                    </div>
                                    <div className="stars">
                                        {[1,2,3,4,5].map((s) => (
                                            <span key={s} style={{ fontSize: "12px", color: s <= rv.rating ? "#b8933a" : "rgba(184,147,58,.2)" }}>★</span>
                                        ))}
                                    </div>
                                </div>
                                <p className="rv-txt">{rv.text}</p>
                            </div>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <aside>
                        <div className="sb-card">
                            <div className="sb-lbl">Book Details</div>
                            {[["Author", book.author], ["Publisher", book.publisher], ["Year", book.year], ["Pages", book.pages], ["Genre", book.genre], ["ISBN", book.isbn]].map(([l, v]) => (
                                <div key={l} className="spec-row"><span className="spec-l">{l}</span><span className="spec-v">{v}</span></div>
                            ))}
                        </div>

                        <div className="sb-card">
                            <div className="sb-lbl">Why Buy Direct</div>
                            {["Signed copies on select editions", "Ships within 2 business days", "30-day hassle-free returns", "Secure checkout via Stripe"].map((t) => (
                                <div key={t} className="guar-row">
                                    <div className="guar-icon">✦</div>
                                    <span>{t}</span>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </section>

            {/* ── Author ── */}
            <section className="author-sec">
                <div className="author-grid">
                    <AnimatedSection>
                        <div className="author-av" style={{ background: `linear-gradient(135deg,${book.coverAccent},${book.coverColor})` }}>
                            {book.author.split(" ").map((n) => n[0]).join("")}
                        </div>
                    </AnimatedSection>
                    <AnimatedSection delay={0.08}>
                        <div className="author-eyebrow">About the Author</div>
                        <div className="author-name">{book.author}</div>
                        <p   className="author-bio">{book.authorBio}</p>
                    </AnimatedSection>
                </div>
            </section>

            {/* ── Related books ── */}
            {relatedBooks.length > 0 && (
                <section className="rel-sec">
                    <div className="rel-inner">
                        <div className="sec-eyebrow">You May Also Like</div>
                        <div className="rel-grid">
                            {relatedBooks.map((rb, i) => (
                                <AnimatedSection key={rb.slug} delay={i * 0.08}>
                                    <Link href={`/books/${rb.slug}`} className="rel-card">
                                        <div className="rel-cover" style={{ background: rb.coverColor }}>
                                            <span className="rel-cover-title">{rb.title}</span>
                                        </div>
                                        <div className="rel-body">
                                            <span className="rel-genre">{rb.genre}</span>
                                            <span className="rel-title">{rb.title}</span>
                                            <span className="rel-price">From {rb.formats[0].price}</span>
                                            <span className="rel-cta">View Book →</span>
                                        </div>
                                    </Link>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <div className="back-bar">
                <Link href="/books" className="back-lnk">← Back to all books</Link>
            </div>

            <Footer />
        </>
    );
}