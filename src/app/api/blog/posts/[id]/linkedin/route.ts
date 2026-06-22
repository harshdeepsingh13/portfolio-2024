import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { blogPostSchema } from "../../../../../../../modals/blogPost";
import { connectToBlogsDB } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import {
  getConnectionDoc,
  getLinkedInConfig,
  generateCommentary,
  shareArticle,
  withUtm,
  LinkedInError,
  type LinkPlacement,
} from "@/lib/linkedin";

type RouteContext = { params: Promise<{ id: string }> };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://theharshdeepsingh.com";

interface BlogPostLean {
  _id: unknown;
  title: string;
  slug: string;
  status: "draft" | "published";
  excerpt?: string;
  tags?: string[];
  linkedInId?: string;
  seo?: { metaTitle?: string; metaDescription?: string; canonicalUrl?: string };
}

// ---------------------------------------------------------------------------
// POST /api/blog/posts/[id]/linkedin
// ---------------------------------------------------------------------------
// Shares a published post to LinkedIn as a member feed update (commentary +
// canonical link card). Requires auth and a valid (non-expired) connection.
//
// Body: { commentary?: string }  — the previewed/edited text. Falls back to an
// auto-generated commentary when omitted.
//
// Responses:
//   200 → { url, linkedInId }
//   409 → { error, code: "not_connected" | "expired" }  (UI prompts to connect)
//   422 → already shared
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest, { params }: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  try {
    const conn = await connectToBlogsDB();
    const BlogPost = conn.models.blogPost || conn.model("blogPost", blogPostSchema);

    const post = (await BlogPost.findById(id).lean()) as BlogPostLean | null;
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    if (post.status !== "published") {
      return NextResponse.json({ error: "Publish the post before sharing it." }, { status: 400 });
    }
    if (post.linkedInId) {
      return NextResponse.json({ error: "This post was already shared to LinkedIn." }, { status: 422 });
    }

    // ── Connection / token check ──────────────────────────────────────────
    const connection = await getConnectionDoc();
    if (!connection) {
      return NextResponse.json(
        { error: "LinkedIn is not connected. Connect it in Settings.", code: "not_connected" },
        { status: 409 },
      );
    }
    if (new Date(connection.expiresAt).getTime() <= Date.now()) {
      return NextResponse.json(
        { error: "Your LinkedIn connection has expired. Reconnect in Settings.", code: "expired" },
        { status: 409 },
      );
    }

    const { apiVersion } = getLinkedInConfig();

    const body = (await req.json().catch(() => ({}))) as {
      commentary?: string;
      linkPlacement?: LinkPlacement;
    };
    const commentary = body.commentary?.trim() || generateCommentary(post);
    const linkPlacement: LinkPlacement = body.linkPlacement === "comment" ? "comment" : "card";

    // Clean canonical drives the page's <link rel=canonical>; the *shared* link
    // gets UTM tags for GA4 attribution. Keep these two separate.
    const canonicalUrl = post.seo?.canonicalUrl || `${SITE_URL}/blog/${post.slug}`;
    const articleUrl = withUtm(canonicalUrl, post.slug);

    const result = await shareArticle({
      accessToken: connection.accessToken,
      personUrn: connection.personUrn,
      apiVersion,
      commentary,
      articleUrl,
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      linkPlacement,
    });

    await BlogPost.findByIdAndUpdate(id, {
      $set: { linkedInId: result.id || "shared", linkedInUrl: result.url },
    });

    return NextResponse.json({ url: result.url, linkedInId: result.id || "shared" });
  } catch (err) {
    const status = err instanceof LinkedInError ? err.status : 500;
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("[POST /api/blog/posts/[id]/linkedin]", err);
    // 401 from LinkedIn → surface as a reconnect prompt
    if (status === 401) {
      return NextResponse.json({ error: message, code: "expired" }, { status: 409 });
    }
    return NextResponse.json({ error: message }, { status });
  }
}
