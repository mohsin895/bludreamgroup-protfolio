"use client";
import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";
import { useState, useMemo } from "react";

const FAQS = [
    {
        category: "Orders & Payments",
        icon: "💳",
        items: [
            {
                q: "What payment methods do you accept?",
                a: "We accept all major credit and debit cards (Visa, Mastercard, Amex), PayPal, Apple Pay, and Google Pay. All transactions are secured via SSL encryption.",
            },
            {
                q: "Can I modify or cancel my order after placing it?",
                a: "Orders can be modified or cancelled within 12 hours of purchase. After that window, the order enters fulfilment and cannot be changed. Please contact us immediately at orders@yourdomain.com if you need to make changes.",
            },
            {
                q: "Do you offer gift cards or gift wrapping?",
                a: "Yes! We offer digital gift cards in denominations of $10, $25, $50, and $100. Gift wrapping with a handwritten note is available at checkout for physical orders for a small fee.",
            },
        ],
    },
    {
        category: "Books & Editions",
        icon: "📚",
        items: [
            {
                q: "What formats are available — print, eBook, or audiobook?",
                a: "Most titles are available in paperback, hardcover, and DRM-free ePub/PDF eBook. Select titles also have an accompanying audiobook narrated by the author. Format availability is listed on each book's product page.",
            },
            {
                q: "Are signed or limited editions available?",
                a: "Yes. Signed first editions and limited collector prints are released in small batches. Subscribe to the newsletter to be notified the moment a new limited run drops — they typically sell out within 48 hours.",
            },
            {
                q: "Can I request a personalised inscription?",
                a: "Absolutely. When purchasing a signed copy, add your personalisation note in the checkout field. Please allow up to 7 business days for personalised orders before they ship.",
            },
            {
                q: "Do you sell wholesale to bookshops or libraries?",
                a: "We partner with independent bookshops and libraries. Wholesale inquiries — including bulk pricing and consignment arrangements — can be submitted through our Trade page or by emailing wholesale@yourdomain.com.",
            },
        ],
    },
    {
        category: "Shipping & Delivery",
        icon: "📦",
        items: [
            {
                q: "Where do you ship, and how long does delivery take?",
                a: "We ship worldwide. Domestic orders (US) arrive in 3–5 business days with standard shipping, or 1–2 days with express. International orders typically take 7–14 business days depending on the destination and customs processing.",
            },
            {
                q: "How do I track my order?",
                a: "A tracking link is emailed to you once your order is dispatched. You can also log into your account and view live shipment status under 'My Orders'. eBook downloads are available instantly in your account library.",
            },
            {
                q: "My book arrived damaged. What should I do?",
                a: "We're sorry to hear that! Please photograph the damage and email it to support@yourdomain.com within 14 days of delivery. We'll send a replacement copy at no charge, no need to return the damaged item.",
            },
        ],
    },
    {
        category: "Author & Portfolio",
        icon: "✍️",
        items: [
            {
                q: "Are you available for speaking engagements or book clubs?",
                a: "Yes — both in-person and virtual appearances. I speak on topics including creative writing, the publishing journey, and [your genre/theme]. Use the Contact page to submit a booking inquiry with your event details and preferred date.",
            },
            {
                q: "Can I request an interview or press feature?",
                a: "Press and media inquiries are welcome. A full press kit (bio, high-res headshots, book cover assets, and previous coverage) is available on the Press page. Reach out to press@yourdomain.com for quick turnaround.",
            },
            {
                q: "Do you offer manuscript consultations or writing workshops?",
                a: "I run selective manuscript consultations for emerging authors and host quarterly online writing workshops. Spots are limited. Check the Events page for upcoming workshop dates or join the waitlist via the newsletter.",
            },
        ],
    },
    {
        category: "Returns & Refunds",
        icon: "↩️",
        items: [
            {
                q: "What is your return policy for physical books?",
                a: "Unopened physical books can be returned within 30 days of delivery for a full refund. Personalised or signed editions are non-returnable unless they arrived damaged. Return postage is the buyer's responsibility unless the item was defective.",
            },
            {
                q: "Can I get a refund on a digital/eBook purchase?",
                a: "Because digital files are delivered instantly, eBook sales are generally non-refundable. However, if you accidentally purchased the wrong edition or encountered a technical issue preventing you from accessing the file, contact us and we'll make it right.",
            },
        ],
    },
];

function ChevronIcon({ open }: { open: boolean }) {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
                flexShrink: 0,
            }}
        >
            <path
                d="M4 7L9 12L14 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function AccordionItem({
                           question,
                           answer,
                           isOpen,
                           onToggle,
                       }: {
    question: string;
    answer: string;
    isOpen: boolean;
    onToggle: () => void;
}) {
    return (
        <div
            style={{
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                transition: "background 0.2s ease",
            }}
        >
            <button
                onClick={onToggle}
                style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    padding: "22px 0",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    color: isOpen ? "var(--gold, #C9A84C)" : "var(--text, #fff)",
                    transition: "color 0.2s ease",
                }}
            >
        <span
            style={{
                fontSize: "15px",
                fontWeight: 500,
                lineHeight: 1.5,
                letterSpacing: "0.01em",
            }}
        >
          {question}
        </span>
                <span
                    style={{
                        color: "var(--gold, #C9A84C)",
                        opacity: isOpen ? 1 : 0.5,
                        transition: "opacity 0.2s ease",
                    }}
                >
          <ChevronIcon open={isOpen} />
        </span>
            </button>

            <div
                style={{
                    overflow: "hidden",
                    maxHeight: isOpen ? "400px" : "0px",
                    transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
            >
                <p
                    style={{
                        fontSize: "14px",
                        lineHeight: 1.8,
                        color: "var(--text-muted, rgba(255,255,255,0.55))",
                        paddingBottom: "22px",
                        margin: 0,
                    }}
                >
                    {answer}
                </p>
            </div>
        </div>
    );
}

export default function FAQPage() {
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState<string>("All");

    const categories = ["All", ...FAQS.map((f) => f.category)];

    const filteredFAQs = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        return FAQS.map((section) => ({
            ...section,
            items: section.items.filter(
                (item) =>
                    (activeCategory === "All" || section.category === activeCategory) &&
                    (!q ||
                        item.q.toLowerCase().includes(q) ||
                        item.a.toLowerCase().includes(q))
            ),
        })).filter((s) => s.items.length > 0);
    }, [searchQuery, activeCategory]);

    const totalResults = filteredFAQs.reduce((acc, s) => acc + s.items.length, 0);

    const toggleItem = (key: string) => {
        setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <>
            {/* ── Hero ── */}
            <section
                style={{
                    paddingTop: "140px",
                    paddingBottom: "80px",
                    background: "var(--bg, #0a0a0a)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
            >
                <div className="container">
                    <AnimatedSection>
                        <div className="section-label">Support</div>
                        <h1
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "clamp(48px, 6vw, 80px)",
                                marginTop: "8px",
                                letterSpacing: "-0.02em",
                                lineHeight: 1.05,
                            }}
                        >
                            Frequently Asked
                            <br />
                            <span style={{ color: "var(--gold, #C9A84C)" }}>Questions</span>
                        </h1>
                        <p
                            style={{
                                color: "var(--text-muted, rgba(255,255,255,0.55))",
                                fontSize: "16px",
                                maxWidth: "480px",
                                marginTop: "20px",
                                lineHeight: 1.75,
                            }}
                        >
                            Everything you need to know about orders, books, shipping, and
                            working with me. Can't find an answer?{" "}
                            <Link
                                href="/contact"
                                style={{ color: "var(--gold, #C9A84C)", textDecoration: "underline" }}
                            >
                                Drop me a message.
                            </Link>
                        </p>

                        {/* Search */}
                        <div
                            style={{
                                marginTop: "36px",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                maxWidth: "480px",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "8px",
                                padding: "0 16px",
                            }}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }}
                            >
                                <circle
                                    cx="7"
                                    cy="7"
                                    r="5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                />
                                <path
                                    d="M11 11L14 14"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search questions…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    flex: 1,
                                    background: "none",
                                    border: "none",
                                    outline: "none",
                                    color: "var(--text, #fff)",
                                    fontSize: "14px",
                                    padding: "14px 0",
                                    fontFamily: "inherit",
                                }}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "rgba(255,255,255,0.3)",
                                        cursor: "pointer",
                                        padding: "0",
                                        fontSize: "18px",
                                        lineHeight: 1,
                                    }}
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        {/* Category pills */}
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "8px",
                                marginTop: "20px",
                            }}
                        >
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    style={{
                                        padding: "7px 16px",
                                        borderRadius: "100px",
                                        border: "1px solid",
                                        borderColor:
                                            activeCategory === cat
                                                ? "var(--gold, #C9A84C)"
                                                : "rgba(255,255,255,0.1)",
                                        background:
                                            activeCategory === cat
                                                ? "rgba(201,168,76,0.12)"
                                                : "transparent",
                                        color:
                                            activeCategory === cat
                                                ? "var(--gold, #C9A84C)"
                                                : "rgba(255,255,255,0.45)",
                                        fontSize: "12px",
                                        letterSpacing: "0.06em",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        fontFamily: "inherit",
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <Link
                            href="/"
                            className="btn-outline"
                            style={{ display: "inline-flex", marginTop: "36px" }}
                        >
                            ← Back to Home
                        </Link>
                    </AnimatedSection>
                </div>
            </section>

            {/* ── FAQ Body ── */}
            <section
                className="section"
                style={{ background: "#0c0c0c", paddingTop: "72px", paddingBottom: "120px" }}
            >
                <div className="container">
                    {filteredFAQs.length === 0 ? (
                        <AnimatedSection>
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "80px 0",
                                    color: "var(--text-muted, rgba(255,255,255,0.35))",
                                }}
                            >
                                <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔍</div>
                                <p style={{ fontSize: "16px", margin: 0 }}>
                                    No results for &ldquo;<strong style={{ color: "var(--text, #fff)" }}>{searchQuery}</strong>&rdquo;. Try a different keyword.
                                </p>
                            </div>
                        </AnimatedSection>
                    ) : (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 560px), 1fr))",
                                gap: "48px 64px",
                                alignItems: "start",
                            }}
                        >
                            {filteredFAQs.map((section, si) => (
                                <AnimatedSection key={section.category} delay={si * 0.08}>
                                    {/* Category header */}
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "12px",
                                            marginBottom: "8px",
                                        }}
                                    >
                                        <span style={{ fontSize: "20px" }}>{section.icon}</span>
                                        <h2
                                            style={{
                                                fontSize: "11px",
                                                letterSpacing: "0.14em",
                                                textTransform: "uppercase",
                                                color: "var(--gold, #C9A84C)",
                                                margin: 0,
                                                fontWeight: 600,
                                            }}
                                        >
                                            {section.category}
                                        </h2>
                                        <div
                                            style={{
                                                flex: 1,
                                                height: "1px",
                                                background: "rgba(201,168,76,0.15)",
                                            }}
                                        />
                                        <span
                                            style={{
                                                fontSize: "11px",
                                                color: "rgba(255,255,255,0.2)",
                                                letterSpacing: "0.04em",
                                            }}
                                        >
                      {section.items.length} Q
                    </span>
                                    </div>

                                    {/* Accordion items */}
                                    <div>
                                        {section.items.map((item, ii) => {
                                            const key = `${si}-${ii}`;
                                            return (
                                                <AccordionItem
                                                    key={key}
                                                    question={item.q}
                                                    answer={item.a}
                                                    isOpen={!!openItems[key]}
                                                    onToggle={() => toggleItem(key)}
                                                />
                                            );
                                        })}
                                    </div>
                                </AnimatedSection>
                            ))}
                        </div>
                    )}

                    {/* Still have questions CTA */}
                    {filteredFAQs.length > 0 && (
                        <AnimatedSection delay={0.3}>
                            <div
                                style={{
                                    marginTop: "96px",
                                    padding: "56px 48px",
                                    background: "rgba(201,168,76,0.04)",
                                    border: "1px solid rgba(201,168,76,0.12)",
                                    borderRadius: "12px",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: "32px",
                                }}
                            >
                                <div>
                                    <h3
                                        style={{
                                            fontFamily: "var(--font-display)",
                                            fontSize: "clamp(24px, 3vw, 36px)",
                                            margin: "0 0 12px",
                                            letterSpacing: "-0.02em",
                                        }}
                                    >
                                        Still have questions?
                                    </h3>
                                    <p
                                        style={{
                                            color: "var(--text-muted, rgba(255,255,255,0.5))",
                                            fontSize: "14px",
                                            lineHeight: 1.7,
                                            margin: 0,
                                            maxWidth: "360px",
                                        }}
                                    >
                                        Can't find what you're looking for? I reply to all messages
                                        within one business day.
                                    </p>
                                </div>
                                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                                    <Link
                                        href="/contact"
                                        className="btn-outline"
                                        style={{ display: "inline-flex" }}
                                    >
                                        Contact Me
                                    </Link>
                                    <Link
                                        href="/newsletter"
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            padding: "12px 24px",
                                            background: "var(--gold, #C9A84C)",
                                            color: "#0a0a0a",
                                            borderRadius: "4px",
                                            fontSize: "13px",
                                            fontWeight: 600,
                                            letterSpacing: "0.06em",
                                            textTransform: "uppercase",
                                            textDecoration: "none",
                                            transition: "opacity 0.2s ease",
                                        }}
                                    >
                                        Join Newsletter
                                    </Link>
                                </div>
                            </div>
                        </AnimatedSection>
                    )}
                </div>
            </section>
        </>
    );
}