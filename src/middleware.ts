import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (!["GET", "HEAD"].includes(req.method)) {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /**
     * Match all paths EXCEPT:
     * - /api (API routes)
     * - /_next/static (framework internals)
     * - /_next/image (image optimization)
     * - /favicon.ico, /sitemap.xml, /robots.txt (meta files)
     * - /assets/* (static assets like logos/images/fonts)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets|\\.).*)",
  ],
};
