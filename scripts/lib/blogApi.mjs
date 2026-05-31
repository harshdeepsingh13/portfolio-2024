/**
 * Shared helpers for seed scripts that POST blog articles via the Next.js API.
 * Requires Node.js 18+ (native fetch).
 *
 * Usage:
 *   import { authenticate, createPost } from "./lib/blogApi.mjs";
 *   const cookie = await authenticate(BASE_URL, EMAIL, PASSWORD);
 *   const post   = await createPost(BASE_URL, cookie, { title, slug, ... });
 */

/**
 * Authenticate against NextAuth Credentials and return a cookie string
 * that can be forwarded as the `Cookie` header on subsequent API calls.
 *
 * Throws if authentication fails (wrong credentials, server unreachable, etc.).
 */
export async function authenticate(baseUrl, email, password) {
  // 1. Fetch CSRF token — NextAuth v5 requires both the token value AND the
  //    csrf cookie to be sent back together on the sign-in POST.
  let csrfToken;
  let csrfCookie;
  try {
    const csrfRes = await fetch(`${baseUrl}/api/auth/csrf`);
    if (!csrfRes.ok) {
      throw new Error(`HTTP ${csrfRes.status} ${csrfRes.statusText}`);
    }
    ({ csrfToken } = await csrfRes.json());
    // Capture the csrf cookie that NextAuth set — must be forwarded on the sign-in POST
    const setCookies =
      typeof csrfRes.headers.getSetCookie === "function"
        ? csrfRes.headers.getSetCookie()
        : [csrfRes.headers.get("set-cookie")].filter(Boolean);
    csrfCookie = setCookies.map((c) => c.split(";")[0]).join("; ");
  } catch (err) {
    throw new Error(
      `Could not reach dev server at ${baseUrl}. Is "npm run dev" running?\n  ${err.message}`
    );
  }

  // 2. Submit credentials — include the csrf cookie so NextAuth can verify it
  const signInRes = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...(csrfCookie ? { Cookie: csrfCookie } : {}),
    },
    body: new URLSearchParams({ email, password, csrfToken }).toString(),
    redirect: "manual", // capture Set-Cookie without following the redirect
  });

  // 3. Extract session cookies from the response
  const setCookies =
    typeof signInRes.headers.getSetCookie === "function"
      ? signInRes.headers.getSetCookie()
      : [signInRes.headers.get("set-cookie")].filter(Boolean);

  // NextAuth v5 uses "authjs.session-token"; v4 uses "next-auth.session-token"
  const hasSession = setCookies.some(
    (c) =>
      c.startsWith("authjs.session-token=") ||
      c.startsWith("__Secure-authjs.session-token=") ||
      c.startsWith("next-auth.session-token=") ||
      c.startsWith("__Secure-next-auth.session-token=")
  );

  if (!hasSession) {
    throw new Error(
      "Authentication failed — no session cookie returned.\n" +
        "  Check UESR_EMAIL and ADMIN_PASSWORD in .env."
    );
  }

  // Return just "name=value" pairs (strip path/domain/httponly/etc.)
  return setCookies.map((c) => c.split(";")[0]).join("; ");
}

/**
 * POST a blog post to the API.
 *
 * Returns the created post object on success (201).
 * Returns null if the slug already exists (409) — caller should skip.
 * Throws on any other error.
 */
export async function createPost(baseUrl, cookieHeader, postData) {
  const res = await fetch(`${baseUrl}/api/blog/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    },
    body: JSON.stringify(postData),
  });

  if (res.status === 409) {
    return null; // slug already exists
  }

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.error ?? JSON.stringify(body);
    } catch {}
    throw new Error(`POST /api/blog/posts → ${res.status}: ${detail}`);
  }

  return res.json();
}
