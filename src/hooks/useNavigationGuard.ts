"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

type NavGuardWindow = Window & { __adminNavGuard?: () => boolean };

const MSG = "You have unsaved changes. Leave without saving?";

/**
 * Guards against accidental navigation when the form is dirty.
 *
 * Covers three surfaces:
 *  a) beforeunload  — browser reload / close / external URL
 *  b) popstate      — browser Back/Forward button
 *  c) window.__adminNavGuard — checked by AdminShell sidebar links
 *
 * Returns `guardedNavigate(href)` for use in Back buttons inside the editor.
 */
export function useNavigationGuard(isDirtyRef: React.MutableRefObject<boolean>) {
  const router = useRouter();

  useEffect(() => {
    // a) External navigation / reload
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current) e.preventDefault();
    };

    // b) Browser Back / Forward
    // Push a sentinel entry so the first Back press fires popstate here
    // instead of silently leaving the page.
    history.pushState(null, "", window.location.href);
    const onPopState = () => {
      if (!isDirtyRef.current) return;
      // Re-push to restore position, then ask the user.
      history.pushState(null, "", window.location.href);
      if (window.confirm(MSG)) {
        // go(-2): past our re-push AND the original sentinel
        history.go(-2);
      }
    };

    // c) Window signal for AdminShell sidebar links
    (window as NavGuardWindow).__adminNavGuard = () =>
      !isDirtyRef.current || window.confirm(MSG);

    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("popstate", onPopState);
      delete (window as NavGuardWindow).__adminNavGuard;
    };
  }, [isDirtyRef]);

  const guardedNavigate = useCallback(
    (href: string) => {
      if (!isDirtyRef.current || window.confirm(MSG)) {
        router.push(href);
      }
    },
    [isDirtyRef, router],
  );

  return { guardedNavigate };
}
