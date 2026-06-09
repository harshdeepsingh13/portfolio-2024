"use client";

import { useCallback, useEffect, useState } from "react";

export function useReadingProgress(enabled = true): number {
  const [progress, setProgress] = useState(0);

  const update = useCallback(() => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    setProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [enabled, update]);

  return progress;
}
