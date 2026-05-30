/**
 * Server-only HTML sanitizer.
 * Uses isomorphic-dompurify (JSDOM-backed) on the Node.js runtime.
 * This module must never be imported on the client.
 */
import "server-only";

export async function sanitizeHtml(html: string): Promise<string> {
  if (!html) return "";
  // Dynamic import keeps jsdom out of the initial bundle and defers
  // resolution to the Node.js runtime where JSDOM is available.
  const DOMPurify = (await import("isomorphic-dompurify")).default;
  return DOMPurify.sanitize(html);
}
