"use client";
import { Globe, Link as LinkIcon, Mail, Rss, Share2 } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  "Quick Links": [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Books", href: "/books" },
    { label: "Blog", href: "/blog" },
    { label: "Resources", href: "/resources" },
    { label: "Events", href: "/events" },
  ],
  Resources: [
    { label: "Courses", href: "/courses" },
    { label: "Resources", href: "/resources" },
    { label: "Success Stories", href: "/success-stories" },
    { label: "FAQ", href: "/faq" },
    { label: "Success Stories", href: "/success-stories" },
  ],
  Media: [
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
  { icon: Mail, href: "mailto:hello@bluedream.com", label: "Email" },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "#648181",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        marginTop: "0",
      }}
    >
      {/* Newsletter strip */}
      <div
        style={{
          background: "linear-gradient(135deg, #5FA8BF, #648181)",
          borderBottom: "1px solid rgba(201,168,76,0.12)",
          padding: "48px 0",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          <div>
            <div className="section-label">Newsletter</div>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "32px",
                color: "#fff",
                marginTop: "4px",
              }}
            >
              Wisdom in Your Inbox
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#ffff",
                marginTop: "8px",
              }}
            >
              Weekly insights on leadership, growth, and building a life of
              significance.
            </p>
          </div>
          <form
            style={{
              display: "flex",
              gap: "0",
              maxWidth: "400px",
              width: "100%",
            }}
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="input"
              style={{ borderRadius: "4px 0 0 4px", borderRight: "none" }}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{
                background: "#648181",
                color: "#fff",
                borderRadius: "0 4px 4px 0",
              }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="container" style={{ padding: "60px 40px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "60px",
            flexWrap: "wrap",
          }}
        >
          {/* Brand */}
          <div>
            <p
              style={{
                fontSize: "14px",
                color: "#fff",
                lineHeight: 1.8,
                maxWidth: "280px",
              }}
            >
              Bestselling author, executive coach, and keynote speaker
              transforming how leaders think, lead, and live.
            </p>
            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  style={{
                    width: "36px",
                    height: "36px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#F59E0B",
                    background: "rgba(130,195,216,0.05)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "#F59E0B";
                    el.style.color = "#fff";
                    el.style.background = "#F59E0B";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(255,255,255,0.12)";
                    el.style.color = "#F59E0B";
                    el.style.background = "rgba(130,195,216,0.05)";
                  }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#fff",
                  marginBottom: "20px",
                  fontFamily: "var(--font-body)",
                }}
              >
                {title}
              </h4>
              <ul style={{ listStyle: "none" }}>
                {links.map((link) => (
                  <li key={link.label} style={{ marginBottom: "10px" }}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: "13px",
                        color: "#fff",
                        textDecoration: "none",
                        transition: "color 0.2s",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.color =
                          "#F59E0B")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.color = "#fff")
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "60px",
            paddingTop: "14px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <p
            style={{
              fontSize: "0.82rem",
              color: "#ffffffcc",
              margin: 0,
              textAlign: "center",
              lineHeight: 1.7,
            }}
          >
            © 2010 - {new Date().getFullYear()}{" "}
            <strong style={{ color: "#fff" }}>
              KSM Shopnil Chowdhury Shohag
            </strong>
            . All Rights Reserved. <br className="sm:hidden" />
            Powered by{" "}
            <a
              href="https://nelsistech.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#fff",
                fontWeight: 600,
                textDecoration: "none",
                borderBottom: "1px solid rgba(255,255,255,0.4)",
                paddingBottom: "1px",
                transition: "0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              Nelsis Tech
            </a>
          </p>
          <div style={{ display: "flex", gap: "24px" }}>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (item) => (
                <Link
                  key={item}
                  href="#"
                  style={{
                    fontSize: "12px",
                    color: "#fff",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "#F59E0B")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "#fff")
                  }
                >
                  {item}
                </Link>
              ),
            )}
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
