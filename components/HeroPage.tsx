"use client";

import { useState } from "react";

interface PageHeroProps {
  title: string;
  currentPage: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
}

export default function PageHero({
  title,
  currentPage,
  showSearch = false,
  searchPlaceholder = "Search here",
  onSearch,
}: PageHeroProps) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch?.(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <section className="page-hero">
      {/* Decorative shapes */}
      <span className="deco deco-triangle md:block hidden" aria-hidden="true" />
      <span className="deco deco-plus md:block hidden" aria-hidden="true">
        +
      </span>
      <div className="deco deco-circle" aria-hidden="true" />
      <div className="deco deco-circle-sm" aria-hidden="true" />

      {/* Main content */}
      <div className="hero-content">
        <h1 className="hero-title font-rising">{title}</h1>

        <nav className="breadcrumb font-xolonium" aria-label="Breadcrumb">
          <span>Home</span>
          <span className="sep" aria-hidden="true">
            »
          </span>
          <span className="active">{currentPage}</span>
        </nav>

        {showSearch && (
          <div className="search-bar">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Search"
            />
            <button onClick={handleSearch} aria-label="Search">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Wave bottom */}
      <div className="wave-wrapper" aria-hidden="true">
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
            fill="#F4F7F6"
          />
        </svg>
      </div>

      <style jsx>{`
        .page-hero {
          position: relative;
          background: linear-gradient(
            180deg,
            #46595a 0%,
            #6c7e7f 45%,
            #8d9b9c 75%,
            #c7d1d2 100%
          );
          overflow: hidden;
          padding: 4rem 1.5rem 5rem;
          text-align: center;
          min-height: 360px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 60px;
        }

        /* ── Decorative elements ── */
        .deco {
          position: absolute;
          pointer-events: none;
          user-select: none;
        }

        .deco-triangle {
          left: 10%;
          top: 38%;
          width: 0;
          height: 0;
          border-top: 14px solid transparent;
          border-bottom: 14px solid transparent;
          border-right: 22px solid #fff9;
        }

        .deco-plus {
          right: 12%;
          top: 45%;
          color: #fff9;
          font-size: 2.4rem;
          font-weight: 200;
          line-height: 1;
        }

        .deco-circle {
          width: 260px;
          height: 260px;
          border-radius: 50%;
          border: 1.5px solid #fff;
          right: -60px;
          top: -60px;
        }

        .deco-circle-sm {
          width: 160px;
          height: 160px;
          border-radius: 50%;
          border: 1.5px solid #ffff;
          left: -30px;
          bottom: 50px;
        }

        /* ── Content ── */
        .hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          width: 100%;
          max-width: 720px;
          margin: 0 auto;
          padding-top: 40px;
        }

        .hero-title {
          font-size: clamp(1.2rem, 4vw, 2.5rem);
          font-weight: 500;
          color: #ffffff;
          margin: 20px 0 0; /* top margin */
          line-height: 1.15;
          letter-spacing: -0.5px;
        }

        .breadcrumb {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.85);
          font-size: 0.92rem;
        }

        .breadcrumb .sep {
          opacity: 0.6;
          font-size: 0.8rem;
        }

        .breadcrumb .active {
          color: #ffffff;
        }

        /* ── Search bar ── */
        .search-bar {
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 600px;
          background: #ffffff;
          border-radius: 999px;
          padding: 6px 6px 6px 24px;
          margin-top: 0.5rem;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
        }

        .search-bar input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 0.97rem;
          color: #333;
          padding: 6px 0;
        }

        .search-bar input::placeholder {
          color: #aaa;
        }

        .search-bar button {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #6c47f5;
          border: none;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          cursor: pointer;
          color: #fff;
          flex-shrink: 0;
          transition:
            background 0.2s ease,
            transform 0.15s ease;
        }

        .search-bar button:hover {
          background: #5a38d4;
          transform: scale(1.05);
        }

        .search-bar button:active {
          transform: scale(0.96);
        }

        /* ── Wave ── */
        // .wave-wrapper {
        //   position: absolute;
        //   bottom: -1px;
        //   left: 0;
        //   right: 0;
        //   z-index: 1;
        //   line-height: 0;
        // }

        // .wave-wrapper svg {
        //   display: block;
        //   width: 100%;
        //   height: 80px;
        // }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .page-hero {
            padding: 3rem 1.25rem 4.5rem;
            min-height: 260px;
          }

          .hero-title {
            font-size: clamp(1.6rem, 5vw, 2.4rem);
          }

          .search-bar {
            padding: 4px 4px 4px 18px;
          }

          .search-bar button {
            width: 40px;
            height: 40px;
          }

          .deco-circle {
            width: 180px;
            height: 180px;
            right: -40px;
            top: -40px;
          }

          .deco-circle-sm {
            width: 110px;
            height: 110px;
          }

          .deco-plus {
            font-size: 1.8rem;
            right: 8%;
          }
        }

        @media (max-width: 480px) {
          .page-hero {
            padding: 2.5rem 1rem 4rem;
          }

          .hero-title {
            font-size: clamp(1.4rem, 5vw, 2rem);
          }

          .breadcrumb {
            font-size: 0.82rem;
          }

          .search-bar {
            padding: 3px 3px 3px 14px;
          }
          .deco-circle {
            width: 180px;
            height: 180px;
            right: -90px;
            top: -40px;
          }

          .deco-circle-sm {
            width: 80px;
            height: 80px;
            left: -25px;
            bottom: 20px;
            opacity: 0.6;
          }

          .deco-triangle {
            left: 5%;
          }
        }
      `}</style>
    </section>
  );
}
