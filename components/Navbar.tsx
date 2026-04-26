"use client";
import { selectIsAuth, selectUser } from "@/store/authSlice";
import {
  selectIsDrawerOpen,
  selectTotalItems,
  toggleDrawer,
} from "@/store/cartSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ChevronDown, Menu, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { CartDrawer } from "@/components/CartDrawer";

import { useSetting } from "@/hooks/useSetting";

import { usePathname } from "next/navigation";

const primaryNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Books", href: "/books" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Executive Coaching", href: "/services#coaching" },
      { label: "Keynote Speaking", href: "/services#speaking" },
      { label: "Corporate Workshops", href: "/services#workshops" },
      { label: "Brand Strategy", href: "/services#strategy" },
    ],
  },
  { label: "Blog", href: "/blog" },
  {
    label: "More",
    href: "#",
    children: [
      { label: "Media / Gallery", href: "/media" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "Events", href: "/events" },
      // { label: "Courses", href: "/courses" },
      { label: "Success Stories", href: "/success-stories" },
      { label: "Shop", href: "/shop" },
      { label: "FAQ", href: "/faq" },
      { label: "Press", href: "/press" },
      { label: "Resources", href: "/resources" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const dispatch = useAppDispatch();
  const totalItems = useAppSelector(selectTotalItems);
  const isAuth = useAppSelector(selectIsAuth);
  const user = useAppSelector(selectUser);
  const isDrawerOpen = useAppSelector(selectIsDrawerOpen);

  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { setting, logoUrl } = useSetting();

  const solidNav = scrolled || isDrawerOpen;

  // ── Hydration guard ───────────────────────────────────────────────────────

  useEffect(() => {
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
          zIndex: 1,
          transition: "all 0.4s ease",
          background: solidNav ? "#203647" : "#203647",
          backdropFilter: solidNav ? "blur(20px)" : "none",
          borderBottom: solidNav
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid transparent",
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
            <Link
              href="/"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "24px",
                fontWeight: 500,
                color: "#ffff",
                textDecoration: "none",
                letterSpacing: "-0.01em",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ color: "var(--gold)" }}>
                {setting?.site_name ?? "Blue dream"}
              </span>
            </Link>

            {/* Desktop Nav */}
            <div
              ref={dropdownRef}
              style={{ display: "flex", alignItems: "center", gap: "2px" }}
              className="desktop-nav"
            >
              {primaryNav.map((item) => (
                <div key={item.label} style={{ position: "relative" }}>
                  {item.children ? (
                    <button
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === item.label ? null : item.label,
                        )
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "8px 14px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "13px",
                        zIndex: "999",
                        fontWeight: 500,
                        letterSpacing: "0.04em",
                        color:
                          activeDropdown === item.label ? "#82c3d8" : "#ffffff",
                        transition: "color 0.2s",
                        fontFamily: "var(--font-body)",
                      }}
                      onMouseEnter={() => setActiveDropdown(item.label)}
                    >
                      {item.label}
                      <ChevronDown
                        size={12}
                        style={{
                          transition: "transform 0.2s",
                          transform:
                            activeDropdown === item.label
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                        }}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      style={{
                        display: "block",
                        padding: "8px 14px",
                        fontSize: "13px",
                        fontWeight: 500,
                        letterSpacing: "0.04em",
                        color: pathname === item.href ? "#82c3d8" : "#ffffff",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (pathname !== item.href)
                          (e.target as HTMLElement).style.color = "#82c3d8";
                      }}
                      onMouseLeave={(e) => {
                        if (pathname !== item.href)
                          (e.target as HTMLElement).style.color =
                            "var(--text-muted)";
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
                        background: "#203647",
                        border: "1px solid rgba(255,255,255,0.08)",
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
                      }}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          style={{
                            display: "block",
                            padding: "9px 16px",
                            fontSize: "13px",
                            fontWeight: 400,
                            color: "var(--text-muted)",
                            textDecoration: "none",
                            borderRadius: "4px",
                            transition: "all 0.15s",
                            whiteSpace: "nowrap",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background =
                              "rgba(201,168,76,0.08)";
                            (e.currentTarget as HTMLElement).style.color =
                              "#82c3d8";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background =
                              "transparent";
                            (e.currentTarget as HTMLElement).style.color =
                              "var(--text-muted)";
                          }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Auth — guarded by mounted to prevent hydration mismatch */}
              {/*{mounted && isAuth ? (*/}
              {/*    <a href="/profile" className="flex items-center gap-2 text-sm text-gray-700 hover:text-red-600 transition-colors">*/}
              {/*        {user?.avatar ? (*/}
              {/*            <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover border border-gray-200" />*/}
              {/*        ) : (*/}
              {/*            <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white text-[11px] font-bold">*/}
              {/*                {user?.name?.charAt(0).toUpperCase() ?? "U"}*/}
              {/*            </div>*/}
              {/*        )}*/}
              {/*        <span>{user?.name?.split(" ")[0]}</span>*/}
              {/*    </a>*/}
              {/*) : (*/}
              {/*    <a href="/login" className="flex items-center gap-2 text-sm text-gray-700 hover:text-red-600 transition-colors">*/}
              {/*        <User className="w-5 h-5" />*/}
              {/*        <span>Login</span>*/}
              {/*    </a>*/}
              {/*)}*/}

              {/* Cart — guarded by mounted to prevent hydration mismatch */}
              <button
                onClick={() => dispatch(toggleDrawer())}
                className="relative flex items-center gap-2 cursor-pointer text-sm text-white hover:text-[#82c3d8] transition-colors"
                aria-label="Open cart"
              >
                <div className="relative">
                  <ShoppingCart className="w-6 h-6" />
                  {mounted && totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </div>
                <span>Cart</span>
              </button>

              <Link
                href="/contact"
                className="btn-primary"
                style={{
                  marginLeft: "16px",
                  fontSize: "12px",
                  padding: "10px 24px",
                }}
              >
                Work With Me
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: "none",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "var(--text)",
                padding: "8px",
                cursor: "pointer",
                borderRadius: "4px",
                display: "none",
              }}
              className="mobile-toggle"
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
              "linear-gradient(90deg, transparent, var(--gold), transparent)",
            opacity: solidNav ? 0 : 0.3,
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
          background: "rgba(10,10,10,0.98)",
          zIndex: 999,
          transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          overflowY: "auto",
          paddingTop: "80px",
        }}
      >
        <div
          className="container"
          style={{ paddingTop: "32px", paddingBottom: "32px" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {primaryNav.map((item, i) => (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <div
                      style={{
                        padding: "14px 0",
                        fontSize: "28px",
                        fontFamily: "var(--font-display)",
                        color: "var(--text-muted)",
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
                          key={child.label}
                          href={child.href}
                          style={{
                            display: "block",
                            padding: "10px 0",
                            fontSize: "15px",
                            color: "var(--text-muted)",
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
                    href={item.href}
                    style={{
                      display: "block",
                      padding: "14px 0",
                      fontSize: "32px",
                      fontFamily: "var(--font-display)",
                      fontWeight: 400,
                      color:
                        pathname === item.href ? "var(--gold)" : "var(--text)",
                      textDecoration: "none",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
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
              className="btn-primary"
              style={{ display: "inline-flex" }}
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
