import { NextRequest, NextResponse } from "next/server";

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
// Extract the Cloudinary cloud name from NEXT_PUBLIC_CLOUDINARY_RES_LINK.
// Expected format: https://res.cloudinary.com/<cloud-name>/...
// ---------------------------------------------------------------------------
function getCloudName(): string | null {
  const baseUrl = process.env.NEXT_PUBLIC_CLOUDINARY_RES_LINK ?? "";
  // Match the segment after res.cloudinary.com/
  const match = baseUrl.match(/res\.cloudinary\.com\/([^/]+)/);
  return match ? match[1] : null;
}

// ---------------------------------------------------------------------------
// POST /api/blog/upload
// ---------------------------------------------------------------------------
// Accepts multipart/form-data with an "image" field.
// Uploads to Cloudinary using an unsigned preset named "portfolio".
// Returns { url: "https://res.cloudinary.com/..." }
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cloudName = getCloudName();
    if (!cloudName) {
      return NextResponse.json(
        { error: "Cloudinary is not configured (missing NEXT_PUBLIC_CLOUDINARY_RES_LINK)" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const imageField = formData.get("image");

    if (!imageField) {
      return NextResponse.json({ error: "image field is required" }, { status: 400 });
    }

    // Validate file type and size for File/Blob uploads
    const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/avif"];
    const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

    if (typeof imageField !== "string") {
      // It's a File/Blob — validate type and size
      const file = imageField as File;
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Unsupported file type: ${file.type}. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}` },
          { status: 400 }
        );
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: `File too large (${Math.round(file.size / 1024 / 1024)}MB). Maximum allowed: 10MB` },
          { status: 400 }
        );
      }
    }

    // imageField can be a File (Blob) or a string (base64 data URL)
    const uploadFormData = new FormData();
    uploadFormData.append("upload_preset", "portfolio");

    if (typeof imageField === "string") {
      // Assume it's a base64 data URL or a raw base64 string
      uploadFormData.append("file", imageField);
    } else {
      // It's a File/Blob
      uploadFormData.append("file", imageField);
    }

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const cloudinaryRes = await fetch(cloudinaryUrl, {
      method: "POST",
      body: uploadFormData,
    });

    if (!cloudinaryRes.ok) {
      const errorBody = await cloudinaryRes.text();
      console.error("[POST /api/blog/upload] Cloudinary error:", errorBody);
      return NextResponse.json(
        { error: "Failed to upload image to Cloudinary" },
        { status: 502 }
      );
    }

    const cloudinaryData = await cloudinaryRes.json() as { secure_url?: string };
    const url = cloudinaryData.secure_url;

    if (!url) {
      return NextResponse.json(
        { error: "Cloudinary did not return a URL" },
        { status: 502 }
      );
    }

    return NextResponse.json({ url });
  } catch (err) {
    console.error("[POST /api/blog/upload]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
