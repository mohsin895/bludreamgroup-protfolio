"use client";
import Link from "next/link";
import { Globe, Share2, Link as LinkIcon, Rss, Mail, ArrowRight } from "lucide-react";

const footerLinks = {
  "Quick Links": [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Books", href: "/books" },
    { label: "Services", href: "/services" },
    { label: "Blog", href: "/blog" },
  ],
  "Resources": [
    { label: "Courses", href: "/courses" },
    { label: "Resources", href: "/resources" },
    { label: "Success Stories", href: "/success-stories" },
    { label: "FAQ", href: "/faq" },
    { label: "Shop", href: "/shop" },
  ],
  "Media": [
    { label: "Gallery", href: "/media" },
    { label: "Press", href: "/press" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Events", href: "/events" },
    { label: "Contact", href: "/contact" },
  ],
};

const socials = [
  { icon: Globe, href: "#", label: "Website" },
  { icon: Share2, href: "#", label: "Twitter" },
  { icon: LinkIcon, href: "#", label: "LinkedIn" },
  { icon: Rss, href: "#", label: "YouTube" },
  { icon: Mail, href: "mailto:hello@alexandravoss.com", label: "Email" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#0d0d0d", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "0" }}>
      {/* Newsletter strip */}
      <div style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.03))", borderBottom: "1px solid rgba(201,168,76,0.12)", padding: "48px 0" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" }}>
          <div>
            <div className="section-label">Newsletter</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "32px", color: "var(--text)", marginTop: "4px" }}>
              Wisdom in Your Inbox
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", marginTop: "8px" }}>
              Weekly insights on leadership, growth, and building a life of significance.
            </p>
          </div>
          <form style={{ display: "flex", gap: "0", maxWidth: "400px", width: "100%" }} onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="your@email.com" className="input" style={{ borderRadius: "4px 0 0 4px", borderRight: "none" }} />
            <button type="submit" className="btn-primary" style={{ borderRadius: "0 4px 4px 0", whiteSpace: "nowrap" }}>
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="container" style={{ padding: "60px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "60px", flexWrap: "wrap" }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "var(--text)", textDecoration: "none", display: "block", marginBottom: "20px" }}>
              <span style={{ color: "var(--gold)" }}>A</span>lexandra Voss
            </Link>
            <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.8, maxWidth: "280px" }}>
              Bestselling author, executive coach, and keynote speaker transforming how leaders think, lead, and live.
            </p>
            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  style={{ width: "36px", height: "36px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)"; (e.currentTarget as HTMLElement).style.color = "var(--gold)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "20px", fontFamily: "var(--font-body)" }}>
                {title}
              </h4>
              <ul style={{ listStyle: "none" }}>
                {links.map((link) => (
                  <li key={link.label} style={{ marginBottom: "10px" }}>
                    <Link href={link.href}
                      style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s", display: "flex", alignItems: "center", gap: "6px" }}
                      onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = "var(--text)"}
                      onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "60px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <p style={{ fontSize: "12px", color: "var(--text-dim)" }}>
            © {new Date().getFullYear()} Alexandra Voss. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "24px" }}>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <Link key={item} href="#"
                style={{ fontSize: "12px", color: "var(--text-dim)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = "var(--text-dim)"}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer .container > div:first-of-type { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          footer .container > div:first-of-type { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
