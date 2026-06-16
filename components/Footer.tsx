"use client";

import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

interface Setting {
  site_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
  footer_description?: string;
}

const footerLinks = {
  "Quick Links": [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Books", href: "/books" },
  ],
  Resources: [
    { label: "Courses", href: "/courses" },
    { label: "Success Stories", href: "/success-stories" },
    { label: "Blog", href: "/blog" },
  ],
  Media: [
    { label: "Gallery", href: "/media" },
    { label: "Contact", href: "/contact" },
    { label: "Events", href: "/events" },
  ],
};

const policyLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
];

export default function Footer() {
  const [setting, setSetting] = useState<Setting>({});

  useEffect(() => {
    fetch(`${API_BASE}/settings`)
      .then((res) => res.json())
      .then((json) => {
        const data = json?.data ?? json;

        if (data && typeof data === "object") {
          setSetting(data);
        }
      })
      .catch(() => {});
  }, []);

  const socials = [
    {
      icon: faFacebookF,
      href: setting.facebook,
      label: "Facebook",
    },
    {
      icon: faInstagram,
      href: setting.instagram,
      label: "Instagram",
    },
    {
      icon: faLinkedinIn,
      href: setting.linkedin,
      label: "LinkedIn",
    },
    {
      icon: faYoutube,
      href: setting.youtube,
      label: "YouTube",
    },
    {
      icon: faTwitter,
      href: setting.twitter,
      label: "Twitter",
    },
  ].filter((s) => !!s.href);

  return (
    <footer
      style={{
        background: "#648181",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        marginTop: 0,
      }}
    >
      {/* Newsletter Section */}
      {/* <div
        style={{
          background: "linear-gradient(135deg, #6c7e7f 0%, #95a49a 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "60px 0",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 30,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 280 }}>
            <div
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "#ffffffcc",
                marginBottom: 10,
                fontWeight: 700,
              }}
            >
              Newsletter
            </div>

            <h2
              style={{
                fontSize: "36px",
                color: "#fff",
                marginBottom: 14,
                fontFamily: "var(--font-display)",
                lineHeight: 1.2,
              }}
            >
              Wisdom in Your Inbox
            </h2>

            <p
              style={{
                fontSize: 15,
                color: "#ffffffd9",
                lineHeight: 1.8,
                maxWidth: 520,
              }}
            >
              Weekly insights on leadership, entrepreneurship, self-development,
              and building a meaningful life.
            </p>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            style={{
              display: "flex",
              width: "100%",
              maxWidth: 460,
              overflow: "hidden",
              borderRadius: 10,
              background: "#fff",
            }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                flex: 1,
                padding: "16px 18px",
                border: "none",
                outline: "none",
                fontSize: 14,
                background: "#fff",
                color: "#1f2937",
              }}
            />

            <button
              type="submit"
              style={{
                background: "#1f2937",
                color: "#fff",
                border: "none",
                padding: "0 26px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                transition: "0.3s",
              }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </div> */}

      {/* Main Footer */}
      <div
        className="container"
        style={{
          padding: "70px 40px 30px",
        }}
      >
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 60,
          }}
        >
          {/* Brand Section */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 78,
                  height: 48,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Image
                  src="/logo.jpeg"
                  alt="Logo"
                  width={68}
                  height={68}
                  style={
                    {
                      // objectFit: "cover",
                    }
                  }
                />
              </div>

              <div>
                <h3
                  style={{
                    fontSize: 12,
                    color: "#fff",
                    margin: 0,
                    fontWeight: 500,
                    lineHeight: 1.6,
                    fontFamily: "Venus Rising",
                  }}
                >
                  {setting.site_name ?? "KSM Shopnil Chowdhury Shohag"}
                </h3>

                <p
                  className="font-xolonium"
                  style={{
                    fontSize: 11,
                    color: "#dbe4e4",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginTop: 4,
                  }}
                >
                  Author • Mentor • Entrepreneur
                </p>
              </div>
            </div>

            <p
              className="font-xolonium"
              style={{
                fontSize: 14,
                color: "#eef3f3",
                lineHeight: 1.9,
                maxWidth: 320,
              }}
            >
              {setting.footer_description ??
                "Bestselling author, speaker, entrepreneur, and mentor helping people transform their mindset, leadership, and life journey."}
            </p>

            {/* Contact Info */}
            <div
              className="font-xolonium"
              style={{
                marginTop: 28,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {setting.phone && (
                <a
                  href={`tel:${setting.phone}`}
                  className="footer-contact"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    color: "#fff",
                    textDecoration: "none",
                    fontSize: 14,
                    transition: "0.3s",
                  }}
                >
                  <Phone size={15} color="#dce7df" />
                  {setting.phone}
                </a>
              )}

              {setting.email && (
                <a
                  href={`mailto:${setting.email}`}
                  className="footer-contact"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    color: "#fff",
                    textDecoration: "none",
                    fontSize: 14,
                    transition: "0.3s",
                  }}
                >
                  <Mail size={15} color="#dce7df" />
                  {setting.email}
                </a>
              )}

              {setting.address && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    color: "#fff",
                    fontSize: 14,
                    lineHeight: 1.7,
                  }}
                >
                  <MapPin
                    size={15}
                    color="#dce7df"
                    style={{ marginTop: 4, flexShrink: 0 }}
                  />
                  {setting.address}
                </div>
              )}
            </div>

            {/* Social Icons */}
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 30,
                flexWrap: "wrap",
              }}
            >
              {socials.map((s) => (
                <motion.a
                  whileHover={{ y: -3 }}
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="footer-social"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    textDecoration: "none",
                    transition: "0.3s",
                  }}
                >
                  <FontAwesomeIcon icon={s.icon} style={{ fontSize: 15 }} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4
                className="font-rising"
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#ffffff",
                  marginBottom: 24,
                }}
              >
                {title}
              </h4>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
              >
                {links.map((link) => (
                  <li key={link.label} style={{ marginBottom: 14 }}>
                    <Link
                      href={link.href}
                      className="footer-link font-xolonium"
                      style={{
                        fontSize: 14,
                        color: "#eef3f3",
                        textDecoration: "none",
                        transition: "0.3s",
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            marginTop: 50,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 18,
          }}
        >
          <p
            className="font-xolonium"
            style={{
              fontSize: "13px",
              color: "#eef3f3",
              margin: 0,
              lineHeight: 1.7,
            }}
          >
            © 2010 - {new Date().getFullYear()}{" "}
            <strong style={{ color: "#fff" }}>
              {setting.site_name ?? "KSM Shopnil Chowdhury Shohag"}
            </strong>
            . All Rights Reserved. Powered by{" "}
            <a
              href="https://nelsistech.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#fff",
                fontWeight: 700,
                textDecoration: "none",
                borderBottom: "1px solid rgba(255,255,255,0.4)",
              }}
            >
              Nelsis Tech
            </a>
          </p>

          <div
            style={{
              display: "flex",
              gap: 22,
              flexWrap: "wrap",
            }}
          >
            {policyLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="footer-link font-xolonium"
                style={{
                  fontSize: 12,
                  color: "#eef3f3",
                  textDecoration: "none",
                  transition: "0.3s",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .footer-link:hover {
          color: #ffffff !important;
          padding-left: 4px;
        }

        .footer-contact:hover {
          opacity: 0.8;
        }

        .footer-social:hover {
          background: #ffffff !important;
          color: #648181 !important;
          border-color: #ffffff !important;
        }

        .footer-btn-main:hover {
          background: #eef3f3 !important;
          transform: translateY(-2px);
        }

        .footer-btn-green:hover {
          background: #1faa56 !important;
          transform: translateY(-2px);
        }

        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }

        @media (max-width: 768px) {
          .container {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
        }

        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
