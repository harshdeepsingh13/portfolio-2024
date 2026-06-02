/**
 * Server-only HTML sanitizer + post-processor.
 * Uses isomorphic-dompurify (JSDOM-backed) on the Node.js runtime.
 * This module must never be imported on the client.
 */
import "server-only";

// Decode HTML entities so we can pass raw source to highlight.js,
// then re-encode the result for safe innerHTML insertion.
function decodeEntities(html: string): string {
  return html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function encodeEntities(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function sanitizeHtml(html: string): Promise<string> {
  if (!html) return "";

  const DOMPurify = (await import("isomorphic-dompurify")).default;
  let clean = DOMPurify.sanitize(html);

  // Annotate <pre> with data-language for the CSS language badge,
  // then syntax-highlight the code content with highlight.js.
  const hljs = (await import("highlight.js")).default;

  clean = clean.replace(
    /<pre>\s*<code(?:\s+class="language-([a-z0-9]+)")?>([\s\S]*?)<\/code>\s*<\/pre>/gi,
    (_match, lang: string | undefined, rawCode: string) => {
      const source = decodeEntities(rawCode);

      let highlighted: string;
      try {
        if (lang && hljs.getLanguage(lang)) {
          highlighted = hljs.highlight(source, { language: lang, ignoreIllegals: true }).value;
        } else {
          // Plain pre/code with no language (ASCII diagrams etc) — no colouring, just encode
          highlighted = encodeEntities(source);
        }
      } catch {
        highlighted = encodeEntities(source);
      }

      const dataLang = lang ? ` data-language="${lang}"` : "";
      const codeClass = lang ? ` class="language-${lang}"` : "";
      return `<pre${dataLang}><code${codeClass}>${highlighted}</code></pre>`;
    }
  );

  return clean;
}
