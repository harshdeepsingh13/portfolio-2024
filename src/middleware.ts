import NextAuth from "next-auth";
import type { NextAuthRequest } from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth(function middleware(req: NextAuthRequest) {
  // 1. Block non-GET/HEAD methods for all matched routes
  if (!["GET", "HEAD"].includes(req.method)) {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  // 2. Auth checks for /admin routes
  const isLoggedIn = !!req.auth?.user;
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/admin", req.nextUrl));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/admin/login", req.nextUrl);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /**
     * Match all paths EXCEPT:
     * - /api (API routes, including /api/auth/* for NextAuth callbacks)
     * - /_next/static (framework internals)
     * - /_next/image (image optimization)
     * - /favicon.ico, /sitemap.xml, /robots.txt (meta files)
     * - /assets/* (static assets like logos/images/fonts)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets|\\.).*)",
  ],
};
