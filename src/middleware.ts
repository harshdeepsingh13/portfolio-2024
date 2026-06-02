import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  if (!["GET", "HEAD"].includes(req.method)) {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
  const res = NextResponse.next();
  res.headers.set("x-pathname", req.nextUrl.pathname);
  return res;
}

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
