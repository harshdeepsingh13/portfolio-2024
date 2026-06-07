import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { blogPostSchema } from "../../../../../../modals/blogPost";
import { connectToBlogsDB } from "@/lib/mongoose";
import { auth } from "@/auth";

// ---------------------------------------------------------------------------
// Route params type — Next.js 15 requires async params
// ---------------------------------------------------------------------------
type RouteContext = { params: Promise<{ id: string }> };

// ---------------------------------------------------------------------------
// GET /api/blog/posts/[id]
// ---------------------------------------------------------------------------
// - Authenticated → any status (for editing drafts)
// - Public        → published only
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  try {
    const conn = await connectToBlogsDB();
    const BlogPost = conn.models.blogPost || conn.model("blogPost", blogPostSchema);

    const session = await auth();
    const filter: Record<string, unknown> = { _id: id };
    if (!session) {
      filter.status = "published";
    }

    const post = await BlogPost.findOne(filter).lean();
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(JSON.parse(JSON.stringify(post)));
  } catch (err) {
    console.error("[GET /api/blog/posts/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// PUT /api/blog/posts/[id]
// ---------------------------------------------------------------------------
// Requires auth.
// Body: { ...fields, mode?: "save" | "publish" }
//
// mode = "save"  AND post is "published"
//   → write fields to draft.* subdoc, set hasDraft: true. Root fields untouched.
//
// mode = "publish"  OR post is "draft"
//   → promote to root fields, unset draft, hasDraft: false, status: "published",
//     publishedAt (first time only).
// ---------------------------------------------------------------------------
export async function PUT(req: NextRequest, { params }: RouteContext) {
  const session = await auth();
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

    const body = await req.json();
    const { mode = "save", ...rest } = body as { mode?: "save" | "publish" | "discard"; [key: string]: unknown };

    // Fetch existing post to know its current status
    const existing = await BlogPost.findById(id, { status: 1, publishedAt: 1 }).lean() as
      | { status: string; publishedAt?: Date }
      | null;
    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Fields allowed in either path (slug excluded from draft — always immediate)
    const CONTENT_FIELDS = [
      "title", "excerpt", "coverImage", "tags",
      "body_json", "body_html", "readingTime", "seo",
    ] as const;
    const ROOT_ONLY_FIELDS = ["slug"] as const;

    // ── Discard mode → drop draft subdoc, restore post to clean published state ──
    if (mode === "discard" && existing.status === "published") {
      const updated = await BlogPost
        .findByIdAndUpdate(
          id,
          { $unset: { draft: 1 }, $set: { hasDraft: false } },
          { new: true }
        )
        .lean();
      if (!updated) return NextResponse.json({ error: "Post not found" }, { status: 404 });
      return NextResponse.json(JSON.parse(JSON.stringify(updated)));
    }

    // ── Save mode + post is already published → write to draft subdoc only ──
    if (mode === "save" && existing.status === "published") {
      const draftSet: Record<string, unknown> = { hasDraft: true };
      for (const field of CONTENT_FIELDS) {
        if (field in rest) draftSet[`draft.${field}`] = rest[field];
      }
      // Root-only fields (slug, author) always applied to root
      const rootSet: Record<string, unknown> = {};
      for (const field of ROOT_ONLY_FIELDS) {
        if (field in rest) rootSet[field] = rest[field];
      }
      const updated = await BlogPost
        .findByIdAndUpdate(id, { $set: { ...draftSet, ...rootSet } }, { new: true })
        .lean();
      return NextResponse.json(JSON.parse(JSON.stringify(updated)));
    }

    // ── Save mode + post is a draft → write root fields, keep status: "draft" ──
    if (mode === "save" && existing.status === "draft") {
      const updateData: Record<string, unknown> = {};
      for (const field of CONTENT_FIELDS) {
        if (field in rest) updateData[field] = rest[field];
      }
      for (const field of ROOT_ONLY_FIELDS) {
        if (field in rest) updateData[field] = rest[field];
      }
      const updated = await BlogPost
        .findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true })
        .lean();
      if (!updated) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
      return NextResponse.json(JSON.parse(JSON.stringify(updated)));
    }

    // ── Publish mode → promote draft (or current edits) to root, set published ──
    const updateData: Record<string, unknown> = {};
    for (const field of CONTENT_FIELDS) {
      if (field in rest) updateData[field] = rest[field];
    }
    for (const field of ROOT_ONLY_FIELDS) {
      if (field in rest) updateData[field] = rest[field];
    }
    updateData.status = "published";
    updateData.hasDraft = false;
    if (!existing.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const updated = await BlogPost
      .findByIdAndUpdate(
        id,
        { $set: updateData, $unset: { draft: 1 } },
        { new: true, runValidators: true },
      )
      .lean();

    if (!updated) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(JSON.parse(JSON.stringify(updated)));
  } catch (err: unknown) {
    console.error("[PUT /api/blog/posts/[id]]", err);

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

    // Mongoose validation errors → 400
    if (
      typeof err === "object" &&
      err !== null &&
      "name" in err &&
      (err as { name: string }).name === "ValidationError" &&
      "message" in err
    ) {
      return NextResponse.json(
        { error: (err as { name: string; message: string }).message },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/blog/posts/[id]
// ---------------------------------------------------------------------------
// Requires auth. Hard-deletes the post.
// ---------------------------------------------------------------------------
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const session = await auth();
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

    const deleted = await BlogPost.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/blog/posts/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// PATCH /api/blog/posts/[id]
// ---------------------------------------------------------------------------
// Requires auth. Toggles status between "draft" and "published".
// Sets publishedAt when transitioning to published.
// ---------------------------------------------------------------------------
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const session = await auth();
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

    const existing = await BlogPost.findById(id, { status: 1, publishedAt: 1 }).lean();
    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const existingDoc = existing as unknown as { status: string; publishedAt?: Date };
    const currentStatus = existingDoc.status;
    const newStatus = currentStatus === "published" ? "draft" : "published";

    const updatePayload: Record<string, unknown> = { status: newStatus };
    if (newStatus === "published" && !existingDoc.publishedAt) {
      updatePayload.publishedAt = new Date();
    }

    const updated = await BlogPost
      .findByIdAndUpdate(id, { $set: updatePayload }, { new: true })
      .lean();

    if (!updated) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(JSON.parse(JSON.stringify(updated)));
  } catch (err) {
    console.error("[PATCH /api/blog/posts/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
