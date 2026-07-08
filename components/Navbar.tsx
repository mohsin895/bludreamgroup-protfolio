"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  Award,
  BookOpen,
  Home,
  Mail,
  Menu,
  Rss,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LIME = "#6C7E7F";
type NavChild = {
  label: string;
  href: string;
};

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: NavChild[];
};

const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "About", href: "/about", icon: User },
  { label: "Books", href: "/books", icon: BookOpen },
  { label: "Blog", href: "/blog", icon: Rss },
  { label: "Achievement", href: "/achievements", icon: Award },
  { label: "Contact", href: "/contact", icon: Mail },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";
  // ── Scroll state: solid bg + scroll-to-top button ──
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      setShowTop(window.scrollY > 500);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      const scrollY = window.scrollY;

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";

      return () => {
        const top = document.body.style.top;

        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";

        window.scrollTo(0, parseInt(top || "0") * -1);
      };
    }
  }, [menuOpen]);

  // ── Close on route change ──
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      {/* ── Top bar ── */}
      <header
        style={{
          padding: "10px",
        }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          isHome
            ? scrolled
              ? "bg-white/90 backdrop-blur-md border-b border-gray-200 py-4"
              : "bg-transparent py-6 border-b border-transparent"
            : "bg-white backdrop-blur-md border-b border-gray-200 py-4"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" style={{ marginLeft: "16px" }}>
            <div className="relative w-[200px] h-[60px] sm:w-[250px] sm:h-[38px] md:w-[360px] md:h-[44px]">
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Menu toggle — stays on top of the panel */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="relative z-[110] cursor-pointer flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{ background: LIME }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={26} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={26} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* ── Backdrop + sliding right panel ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[90] bg-black/20 backdrop-blur-sm"
            />

            <motion.aside
              style={{
                padding: "20px 5px",
                right: "40px",
                marginTop: "60px",
              }}
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="fixed right-0 top-0 z-[95] h-full w-full max-w-[240px] overflow-y-auto bg-[#141414] pb-24 pt-28 shadow-2xl"
            >
              <nav className="flex gap-4 flex-col px-6">
                {navItems.map((item, i) => {
                  const active = pathname === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: 0.05 * i }}
                    >
                      <Link
                        href={item.href}
                        className="group flex items-center gap-4  py-6"
                      >
                        <span
                          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border transition-colors"
                          style={{
                            background: active ? `#fff` : "#1f1f1f",
                            borderColor: active
                              ? LIME
                              : "rgba(255,255,255,0.08)",
                            color: active ? LIME : "rgba(255,255,255,0.6)",
                          }}
                        >
                          <item.icon size={18} />
                        </span>
                        <span
                          className="text-sm md:text-lg font-bold uppercase tracking-widest transition-colors"
                          style={{
                            color: active ? LIME : "rgba(255,255,255,0.85)",
                          }}
                        >
                          {item.label}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Scroll-to-top button ── */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="scroll-top"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 right-6 z-[100] flex h-12 w-12 items-center justify-center rounded-full text-black shadow-lg transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{ background: LIME }}
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
