import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import blogPost from "../../../../../../modals/blogPost";
import { connectToDB } from "@/lib/mongoose";

// ---------------------------------------------------------------------------
// Auth helper
// ---------------------------------------------------------------------------
// TODO (Unit 2): Replace with proper session check once auth is merged:
//   import { auth } from "@/auth";
//   const session = await auth();
//   if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//
// Temporary workaround: use a custom header that the admin panel will send.
function isAuthorized(req: NextRequest): boolean {
  const adminKey = process.env.ADMIN_SECRET_KEY;
  if (!adminKey) return false;
  return req.headers.get("x-admin-key") === adminKey;
}

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
    await connectToDB();

    const filter: Record<string, unknown> = { _id: id };
    if (!isAuthorized(req)) {
      filter.status = "published";
    }

    const post = await blogPost.findOne(filter).lean();
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
// Requires auth. Updates any fields supplied in the body.
// ---------------------------------------------------------------------------
export async function PUT(req: NextRequest, { params }: RouteContext) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  try {
    await connectToDB();

    const body = await req.json();

    // Allowlist updatable fields to prevent setting internal Mongoose fields
    const ALLOWED_FIELDS = [
      "title", "slug", "author", "coAuthors", "status", "publishedAt",
      "excerpt", "coverImage", "tags", "body_json", "body_html",
      "readingTime", "seo",
    ] as const;

    const updateData: Record<string, unknown> = {};
    for (const field of ALLOWED_FIELDS) {
      if (field in body) {
        updateData[field] = body[field];
      }
    }

    // Set publishedAt when transitioning to published if not already set
    if (updateData.status === "published" && !updateData.publishedAt) {
      const existing = await blogPost.findById(id, { publishedAt: 1 }).lean();
      if (!existing) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
      if (!(existing as { publishedAt?: Date }).publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const updated = await blogPost
      .findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true })
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
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  try {
    await connectToDB();

    const deleted = await blogPost.findByIdAndDelete(id).lean();
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
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  try {
    await connectToDB();

    const existing = await blogPost.findById(id, { status: 1, publishedAt: 1 }).lean();
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

    const updated = await blogPost
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
