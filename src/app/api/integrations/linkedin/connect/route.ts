import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { buildAuthorizeUrl, LinkedInError } from "@/lib/linkedin";

// ---------------------------------------------------------------------------
// GET /api/integrations/linkedin/connect
// ---------------------------------------------------------------------------
// Starts the LinkedIn OAuth flow. Sets a CSRF `state` cookie and redirects the
// browser to LinkedIn's consent screen. Top-level navigation → not subject to
// the CSP `form-action` restriction.
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.redirect(new URL("/admin/login?callbackUrl=/admin/settings", req.url));
  }

  try {
    const state = randomUUID();
    const res = NextResponse.redirect(buildAuthorizeUrl(state));
    res.cookies.set("li_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 600, // 10 minutes
    });
    return res;
  } catch (err) {
    const status = err instanceof LinkedInError ? err.status : 500;
    console.error("[GET /api/integrations/linkedin/connect]", err);
    return NextResponse.redirect(
      new URL(`/admin/settings?linkedin=error&status=${status}`, req.url),
    );
  }
}
