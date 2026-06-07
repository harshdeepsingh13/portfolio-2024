/**
 * Serialize data for a <script type="application/ld+json"> block.
 *
 * JSON.stringify does not escape the sequence "</" so a value like
 * "</script><script>…" would break out of the enclosing script tag.
 * Replacing "</" with "<\/" is valid JSON and prevents that.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/<\//g, "<\\/");
}
