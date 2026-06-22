"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { usePathname } from "next/navigation";

export default function ConditionalAnalytics({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  // Honor Google's per-ID opt-out for the case where gtag.js is already loaded
  // (e.g. public blog draft → "Edit post" link into /admin). Set during render so
  // it is in place before gtag sends the navigation hit. Idempotent under double-render.
  if (typeof window !== "undefined" && gaId) {
    (window as unknown as Record<string, boolean>)[`ga-disable-${gaId}`] = isAdmin;
  }

  if (!gaId || isAdmin) return null;
  return <GoogleAnalytics gaId={gaId} />;
}
