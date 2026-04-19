"use client";
import Link from "next/link";
import { Star, ShoppingCart, ArrowRight, BookOpen } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const books = [
  {
    title: "The Sovereign Leader",
      slug:'the-quiet-hours',
    subtitle: "A Framework for Fearless Authority",
    year: "2024", pages: "312", tag: "Bestseller",
    desc: "The definitive guide to leading from a place of wholeness and conviction. Drawing on neuroscience, philosophy, and thousands of coaching hours, Voss reveals the path to unshakeable leadership presence.",
    reviews: 4.9, reviewCount: 2847,
    color: "from-amber-950 to-stone-950",
  },
  {
    title: "Unwritten Rules",
    subtitle: "What They Never Teach in Business School",
    year: "2022", pages: "278", tag: "WSJ #1",
    desc: "The hidden playbook of exceptional leaders. Voss exposes the invisible codes that separate the merely successful from the truly extraordinary, drawing on interviews with 200 top executives.",
    reviews: 4.8, reviewCount: 4211,
    color: "from-slate-950 to-zinc-950",
  },
  {
    title: "The Quiet Revolution",
    subtitle: "How Introverts Change the World",
    year: "2020", pages: "254", tag: "Award Winner",
    desc: "A manifesto for the quietly powerful. This groundbreaking book helped millions of introverted leaders reclaim their unique strengths and stop performing extroversion as a prerequisite for success.",
    reviews: 4.7, reviewCount: 6083,
    color: "from-emerald-950 to-slate-950",
  },
];

export default function BooksPage() {
  return (
    <>
        <Navbar />
      <section style={{ paddingTop: "140px", paddingBottom: "60px", background: "var(--bg)" }}>
        <div className="container">
          <AnimatedSection>
            <div className="section-label">Published Works</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(52px, 6vw, 84px)", marginTop: "8px" }}>Books</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "17px", maxWidth: "500px", marginTop: "16px" }}>
              Three international bestsellers. Translated into 28 languages. Read by millions of leaders worldwide.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section style={{ background: "var(--bg)", paddingBottom: "100px" }}>
        <div className="container">
          <div style={{ display: "flex", flexDirection: "column", gap: "60px" }}>
            {books.map((book, i) => (
              <AnimatedSection key={book.title} delay={i * 0.1}>
                <div className="card" style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "0", overflow: "hidden" }}>
                  <div style={{ background: "#0f0f0f", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px", borderRight: "1px solid rgba(255,255,255,0.05)", position: "relative" }}>
                    <div style={{ width: "100%", maxWidth: "200px", aspectRatio: "2/3", background: "linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.03))", border: "1px solid rgba(201,168,76,0.15)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <BookOpen size={40} style={{ color: "var(--gold)", opacity: 0.3 }} />
                    </div>
                    <div style={{ position: "absolute", top: "20px", left: "20px" }}><span className="tag">{book.tag}</span></div>
                  </div>
                  <div style={{ padding: "48px" }}>
                    <div style={{ fontSize: "11px", color: "var(--text-dim)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{book.year} · {book.pages} pages</div>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "36px", color: "var(--text)", marginTop: "8px" }}>{book.title}</h2>
                    <p style={{ fontSize: "15px", color: "var(--gold)", marginTop: "4px", fontStyle: "italic" }}>{book.subtitle}</p>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "16px" }}>
                      {Array(5).fill(0).map((_, j) => (
                        <Star key={j} size={13} style={{ fill: j < Math.floor(book.reviews) ? "var(--gold)" : "none", color: "var(--gold)" }} />
                      ))}
                      <span style={{ fontSize: "13px", color: "var(--text-muted)", marginLeft: "4px" }}>{book.reviews} ({book.reviewCount.toLocaleString()} reviews)</span>
                    </div>

                    <p style={{ fontSize: "15px", color: "var(--text-muted)", lineHeight: 1.75, marginTop: "20px", maxWidth: "500px" }}>{book.desc}</p>

                    <div style={{ display: "flex", gap: "14px", marginTop: "32px", flexWrap: "wrap" }}>
                      <a href="#" className="btn-primary"><ShoppingCart size={14} /> Buy on Amazon</a>
                      <Link href={`/books/${book.slug}`} className="btn-outline">Read Sample <ArrowRight size={13} /></Link>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:768px){.card{grid-template-columns:1fr!important;} .card > div:first-child{aspect-ratio:unset!important;padding:40px 40px 20px!important;}}`}</style>
      </section>
        <Footer />
    </>
  );
}
