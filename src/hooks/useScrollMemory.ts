"use client";

import { useEffect } from "react";

/**
 * Remembers and restores the reader's scroll position for a page (keyed by
 * `key`, e.g. a blog slug) so that a refresh lands at the top and then scrolls
 * back to where they were — instead of the browser's native restoration
 * misfiring (which, with late-loading images, can strand the viewport at the
 * bottom).
 *
 * Position is stored in sessionStorage, so it survives same-tab refreshes and
 * back-navigation but resets when the tab/browser closes.
 */
const STORAGE_PREFIX = "scrollpos:";
const RESTORE_THRESHOLD = 100; // px — don't bother restoring trivially small offsets
const SETTLE_TIMEOUT = 2500; // ms — cap how long we wait for layout/images to settle
const TOP_HOLD = 150; // ms — let the reader perceive "top" before animating down

export function useScrollMemory(key: string, enabled = true): void {
  useEffect(() => {
    if (!enabled || !key || typeof window === "undefined") return;

    const storageKey = STORAGE_PREFIX + key;
    let isRestoring = false;
    let rafId = 0;
    let saveRaf = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Disable native restoration so the browser doesn't fight us / land at the bottom.
    const prevRestoration = history.scrollRestoration;
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    const save = () => {
      if (isRestoring) return;
      try {
        sessionStorage.setItem(storageKey, String(window.scrollY));
      } catch {
        /* sessionStorage unavailable (private mode quota etc.) — ignore */
      }
    };

    const onScroll = () => {
      if (saveRaf) return;
      saveRaf = requestAnimationFrame(() => {
        saveRaf = 0;
        save();
      });
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") save();
    };

    // --- restore ---
    const hasHash = !!window.location.hash;
    let targetY = 0;
    try {
      targetY = parseInt(sessionStorage.getItem(storageKey) || "0", 10) || 0;
    } catch {
      targetY = 0;
    }

    if (!hasHash && targetY > RESTORE_THRESHOLD) {
      isRestoring = true;
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const startedAt = Date.now();

      const settleAndScroll = () => {
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;
        const ready = maxScroll >= targetY;
        const timedOut = Date.now() - startedAt > SETTLE_TIMEOUT;
        if (ready || timedOut) {
          window.scrollTo({
            top: Math.min(targetY, Math.max(0, maxScroll)),
            behavior: prefersReduced ? "auto" : "smooth",
          });
          // Stop guarding once the (smooth) scroll has had time to finish.
          timers.push(
            setTimeout(() => {
              isRestoring = false;
            }, prefersReduced ? 50 : 900),
          );
          return;
        }
        rafId = requestAnimationFrame(settleAndScroll);
      };

      // Hold at the top briefly so the "remember where you were" animation reads.
      timers.push(
        setTimeout(() => {
          rafId = requestAnimationFrame(settleAndScroll);
        }, TOP_HOLD),
      );
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", save);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", save);
      if (rafId) cancelAnimationFrame(rafId);
      if (saveRaf) cancelAnimationFrame(saveRaf);
      timers.forEach(clearTimeout);
      if ("scrollRestoration" in history) {
        history.scrollRestoration = prevRestoration;
      }
    };
  }, [key, enabled]);
}
