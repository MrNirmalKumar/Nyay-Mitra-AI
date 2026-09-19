"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Slim top-of-page progress bar that fires on every route change.
 * Pure CSS — no external dependencies. Makes navigation feel instant.
 */
export function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);

  const start = useCallback(() => {
    setVisible(true);
    setWidth(0);
    // Jump to 15% immediately, then crawl to 85%
    requestAnimationFrame(() => {
      setWidth(15);
      setTimeout(() => setWidth(60), 80);
      setTimeout(() => setWidth(85), 300);
    });
  }, []);

  const finish = useCallback(() => {
    setWidth(100);
    setTimeout(() => {
      setVisible(false);
      setWidth(0);
    }, 250);
  }, []);

  useEffect(() => {
    start();
    const t = setTimeout(finish, 200);
    return () => clearTimeout(t);
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        width: `${width}%`,
        height: 3,
        background: "linear-gradient(90deg, #1E3A5F 0%, #B8935F 100%)",
        transition: width === 100 ? "width 0.15s ease-out" : "width 0.4s ease",
        borderRadius: "0 2px 2px 0",
        boxShadow: "0 0 8px rgba(184,147,95,0.6)",
      }}
    />
  );
}
