import { getData } from "@/lib/getData";
import { NextResponse } from "next/server";

export const revalidate = 3600;

function escapeCdata(str: string): string {
  // Split on CDATA terminator to prevent injection; rejoin with escaped version
  return str.replace(/]]>/g, "]]]]><![CDATA[>");
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  let posts: Awaited<ReturnType<typeof getData.getPublishedPosts>>;
  try {
    posts = await getData.getPublishedPosts();
  } catch (err) {
    console.error("[rss.xml] Failed to fetch posts:", err);
    return new NextResponse("<?xml version=\"1.0\" encoding=\"UTF-8\"?><rss version=\"2.0\"><channel><title>Harshdeep Singh — Blog</title></channel></rss>", {
      status: 503,
      headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
    });
  }

  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${escapeCdata(post.title)}]]></title>
      <link>https://theharshdeepsingh.com/blog/${post.slug}</link>
      <guid isPermaLink="true">https://theharshdeepsingh.com/blog/${post.slug}</guid>
      <description><![CDATA[${escapeCdata(post.excerpt ?? "")}]]></description>
      <pubDate>${post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date(post.createdAt).toUTCString()}</pubDate>
      <author>harshdeepsingh13@gmail.com (Harshdeep Singh)</author>
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n      ")}
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Harshdeep Singh — Blog</title>
    <link>https://theharshdeepsingh.com/blog</link>
    <description>Articles on full stack development, React, TypeScript, Node.js, and AI automation.</description>
    <language>en-us</language>
    <managingEditor>harshdeepsingh13@gmail.com (Harshdeep Singh)</managingEditor>
    <webMaster>harshdeepsingh13@gmail.com (Harshdeep Singh)</webMaster>
    <atom:link href="https://theharshdeepsingh.com/blog/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
