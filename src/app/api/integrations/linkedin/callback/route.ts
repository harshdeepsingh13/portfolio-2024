import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import {
  exchangeCodeForToken,
  fetchUserInfo,
  saveConnection,
} from "@/lib/linkedin";

// ---------------------------------------------------------------------------
// GET /api/integrations/linkedin/callback
// ---------------------------------------------------------------------------
// LinkedIn redirects here with ?code & ?state. We verify the CSRF state cookie,
// exchange the code for a member token, resolve the person URN via /userinfo,
// persist the connection, then bounce back to the Settings page.
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const settingsUrl = (params: string) =>
    new URL(`/admin/settings?${params}`, req.url);

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.redirect(new URL("/admin/login?callbackUrl=/admin/settings", req.url));
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const cookieState = req.cookies.get("li_oauth_state")?.value;

  // User declined consent, or LinkedIn returned an error
  if (error) {
    return NextResponse.redirect(settingsUrl(`linkedin=error&reason=${encodeURIComponent(error)}`));
  }

  // CSRF check
  if (!code || !state || !cookieState || state !== cookieState) {
    return NextResponse.redirect(settingsUrl("linkedin=error&reason=invalid_state"));
  }

  try {
    const token = await exchangeCodeForToken(code);
    const info = await fetchUserInfo(token.access_token);
    const expiresAt = new Date(Date.now() + token.expires_in * 1000);

    await saveConnection({
      accessToken: token.access_token,
      personUrn: `urn:li:person:${info.sub}`,
      displayName: info.name,
      scope: token.scope,
      expiresAt,
    });

    const res = NextResponse.redirect(settingsUrl("linkedin=connected"));
    res.cookies.delete("li_oauth_state");
    return res;
  } catch (err) {
    console.error("[GET /api/integrations/linkedin/callback]", err);
    return NextResponse.redirect(settingsUrl("linkedin=error&reason=exchange_failed"));
  }
}
