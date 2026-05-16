// components/SmoothScroll.tsx
"use client";

import { useEffect } from "react";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    let currentY = window.scrollY;
    let targetY = window.scrollY;
    let rafId: number;

    const ease = 0.08; // lower = slower/smoother

    const update = () => {
      targetY = window.scrollY;
      currentY += (targetY - currentY) * ease;

      // No native override needed — just for Framer Motion sync
      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <>{children}</>;
}
