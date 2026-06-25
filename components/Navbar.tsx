"use client";

import { selectIsDrawerOpen, selectTotalItems } from "@/store/cartSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { CartDrawer } from "@/components/CartDrawer";
import { useSetting } from "@/hooks/useSetting";
import Image from "next/image";
import { usePathname } from "next/navigation";

type NavChild = {
  label: string;
  href: string;
};

type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Books", href: "/books" },
  { label: "Blog", href: "/blog" },
  { label: "Courses", href: "/courses" },
  { label: "Achievement", href: "/achievements" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const dispatch = useAppDispatch();
  const totalItems = useAppSelector(selectTotalItems);
  const isDrawerOpen = useAppSelector(selectIsDrawerOpen);

  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { setting, logoUrl } = useSetting();

  const isHomePage = pathname === "/";
  const solidNav = !isHomePage || scrolled || isDrawerOpen;

  // ── Hydration guard ────────────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: "all 0.4s ease",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(108,126,127,0.08)",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: scrolled ? "64px" : "80px",
              transition: "height 0.4s ease",
            }}
          >
            {/* Logo */}
            <Link href="/">
              <div className="relative   w-[200px] h-[20px] sm:w-[250px] sm:h-[38px] md:w-[360px] md:h-[44px]">
                <Image
                  src="/logo-removebg-preview.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>

            {/* Desktop Nav */}
            <div
              ref={dropdownRef}
              style={{ display: "flex", alignItems: "center", gap: "1px" }}
              className="desktop-nav"
            >
              {primaryNav.map((item) => (
                <div
                  key={item.label}
                  style={{ position: "relative", color: "#000" }}
                >
                  {item.href && (
                    <Link
                      href={item.href}
                      style={{
                        display: "block",
                        padding: "8px 14px",
                        fontSize: "16px",
                        fontWeight: 500,
                        letterSpacing: "0.04em",
                        color: pathname === item.href ? "#6c7e7f" : "#1f2937",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                    >
                      {item.label}
                    </Link>
                  )}

                  {/* Dropdown */}
                  {item.children && (
                    <div
                      onMouseLeave={() => setActiveDropdown(null)}
                      style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        left: "50%",
                        background: "#648181",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#648181",
                        borderRadius: "6px",
                        padding: "8px",
                        minWidth: "200px",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                        opacity: activeDropdown === item.label ? 1 : 0,
                        pointerEvents:
                          activeDropdown === item.label ? "all" : "none",
                        transform:
                          activeDropdown === item.label
                            ? "translateX(-50%) translateY(0)"
                            : "translateX(-50%) translateY(-8px)",
                        transition: "opacity 0.2s, transform 0.2s",
                        maxHeight: "400px",
                        overflowY: "auto",
                      }}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          style={{
                            display: "block",
                            padding: "9px 16px",
                            fontSize: "14px",
                            fontWeight: 400,
                            color: "#1f2937",
                            textDecoration: "none",
                            borderRadius: "4px",
                            transition: "all 0.15s",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <Link
                href="/books"
                className="hover:bg-[#95a49a] font-xolonium"
                style={{
                  marginLeft: "16px",
                  fontSize: "16px",
                  padding: "10px 16px",
                  background: "#6c7e7f",
                  color: "#fff",
                  border: "1px solid #6c7e7f",
                }}
              >
                Find Your Next Read
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: "none",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#1f2937",
                padding: "8px",
                cursor: "pointer",
                zIndex: 1100,
                borderRadius: "4px",
                display: "none",
              }}
              className="mobile-toggle hover:bg-[#f3f4f6] hover:text-[#6c7e7f]"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Gold line at bottom */}
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg,transparent,rgba(108,126,127,0.3),transparent)",
            opacity: solidNav ? 0 : 0.2,
          }}
        />
      </nav>

      {/* Mobile Menu */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "#ffffff",
          zIndex: 999,
          transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          overflowY: "auto",
          paddingTop: "80px",
        }}
      >
        <div
          className="container"
          style={{ paddingTop: "26px", paddingBottom: "26px" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {primaryNav.map((item, i) => (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <div
                      className="font-xolonium"
                      style={{
                        padding: "14px 0",
                        fontSize: "28px",

                        color: "#ffff",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        animation: mobileOpen
                          ? `fadeIn 0.4s ${i * 0.05}s both`
                          : "none",
                      }}
                    >
                      {item.label}
                    </div>
                    <div style={{ paddingLeft: "16px" }}>
                      {item.children.map((child) => (
                        <Link
                          className="font-xolonium"
                          key={child.label}
                          href={child.href}
                          style={{
                            display: "block",
                            padding: "10px 0",
                            fontSize: "15px",
                            color: "#ffff",
                            textDecoration: "none",
                            borderBottom: "1px solid rgba(255,255,255,0.03)",
                          }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    className="font-xolonium"
                    href={item.href}
                    style={{
                      display: "block",
                      padding: "10px 0",
                      fontSize: "22px",

                      fontWeight: 400,
                      color: pathname === item.href ? "#6c7e7f" : "#1f2937",
                      textDecoration: "none",
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                      animation: mobileOpen
                        ? `slideIn 0.4s ${i * 0.05}s both`
                        : "none",
                    }}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: "40px" }}>
            <Link
              href="/contact"
              className="btn-primary font-xolonium"
              style={{
                display: "inline-flex",
                background: "#6c7e7f",
                color: "#fff",
                border: "1px solid #6c7e7f",
              }}
            >
              Work With Me
            </Link>
          </div>
        </div>
      </div>

      <CartDrawer />

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </>
  );
}
