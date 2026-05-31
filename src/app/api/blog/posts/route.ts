import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import { blogPostSchema } from "../../../../../modals/blogPost";
import { connectToBlogsDB } from "@/lib/mongoose";
import { auth } from "@/auth";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function computeReadingTime(html: string): number {
  const words = html.replace(/<[^>]+>/g, "").trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Preview projection — excludes body_json and body_html to keep list responses light.
const PREVIEW_PROJECTION = {
  title: 1,
  slug: 1,
  author: 1,
  status: 1,
  publishedAt: 1,
  excerpt: 1,
  coverImage: 1,
  tags: 1,
  readingTime: 1,
  createdAt: 1,
  updatedAt: 1,
};

// ---------------------------------------------------------------------------
// GET /api/blog/posts
// ---------------------------------------------------------------------------
// - ?all=true + valid auth  → all posts (drafts + published), full preview fields
// - default                 → published posts only (public)
// - ?tag=tagname            → filter by tag
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  try {
    const conn = await connectToBlogsDB();
    const BlogPost = conn.models.blogPost || conn.model("blogPost", blogPostSchema);

    const { searchParams } = new URL(req.url);
    const tag = searchParams.get("tag") ?? undefined;
    const all = searchParams.get("all") === "true";

    const filter: Record<string, unknown> = {};

    const session = await auth();
    if (all && session) {
      // Authenticated: return all posts regardless of status
    } else {
      // Public: published only
      filter.status = "published";
    }

    if (tag) {
      filter.tags = tag;
    }

    const data = await BlogPost
      .find(filter, PREVIEW_PROJECTION)
      .sort({ publishedAt: -1 })
      .lean();

    return NextResponse.json(JSON.parse(JSON.stringify(data)));
  } catch (err) {
    console.error("[GET /api/blog/posts]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/blog/posts
// ---------------------------------------------------------------------------
// Body: { title, slug?, excerpt?, coverImage?, tags?, body_json?,
//         body_html?, readingTime?, status?, seo?, author? }
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const conn = await connectToBlogsDB();
    const BlogPost = conn.models.blogPost || conn.model("blogPost", blogPostSchema);

    const body = await req.json();

    const {
      title,
      slug: rawSlug,
      excerpt,
      coverImage,
      tags,
      body_json,
      body_html,
      readingTime: rawReadingTime,
      status = "draft",
      seo,
      author,
    } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    // Auto-generate slug if not provided
    const slug = rawSlug
      ? rawSlug
      : slugify(title, { lower: true, strict: true });

    // Guard against titles that produce an empty slug (e.g. all special chars)
    if (!slug) {
      return NextResponse.json(
        { error: "title must contain at least one alphanumeric character to generate a valid slug" },
        { status: 400 }
      );
    }

    // Compute readingTime from body_html if not provided
    const readingTime =
      rawReadingTime != null
        ? rawReadingTime
        : body_html
        ? computeReadingTime(body_html)
        : undefined;

    // Default author to portfolio owner email if not supplied
    const resolvedAuthor = author ?? process.env.UESR_EMAIL ?? "";

    const newPost: Record<string, unknown> = {
      title,
      slug,
      author: resolvedAuthor,
      status,
      excerpt,
      coverImage,
      tags,
      body_json,
      body_html,
      readingTime,
      seo,
    };

    // Set publishedAt when creating as published
    if (status === "published") {
      newPost.publishedAt = new Date();
    }

    const created = await BlogPost.create(newPost);
    return NextResponse.json(JSON.parse(JSON.stringify(created.toObject())), { status: 201 });
  } catch (err: unknown) {
    console.error("[POST /api/blog/posts]", err);

    // Duplicate slug → 409
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: number }).code === 11000
    ) {
      return NextResponse.json(
        { error: "A post with this slug already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
