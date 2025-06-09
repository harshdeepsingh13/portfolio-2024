import { NextRequest, NextResponse } from "next/server";

const ipVisitCache = new Map();

const DEBOUNCE_MINUTES = 10;

const isLocalHost = (ip: string) => {
  return ["::1", "127.0.0.1", "::ffff:127.0.0.1"].includes(ip);
};

const isRecentlySeen = (ip: string) => {
  const lastSeen = ipVisitCache.get(ip);
  if (!lastSeen) return false;
  const minutesSinceLastSeen = (Date.now() - lastSeen) / (1000 * 60);
  return minutesSinceLastSeen < DEBOUNCE_MINUTES;
};

function isBot(userAgent = "") {
  const botPatterns = [
    /bot/i,
    /spider/i,
    /crawl/i,
    /slurp/i,
    /fetch/i,
    /monitor/i,
    /pingdom/i,
    /facebookexternalhit/i,
    /embedly/i,
    /baidu/i,
    /curl/i,
    /wget/i,
    /python-requests/i,
    /postman/i,
    /python/i,
  ];

  return botPatterns.some((pattern) => pattern.test(userAgent));
}

export function middleware(req: NextRequest) {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();

  const userAgent = req.headers.get("user-agent") || "Unknown";

  if (req.nextUrl.pathname === "/api/track" || isLocalHost(ip) || isRecentlySeen(ip) || isBot(userAgent)) {
    return NextResponse.next();
  }

  const referrer = req.headers.get("Referrer") || "Direct";

  const details = {
    ip,
    userAgent,
    referrer,
    pathname: req.nextUrl.pathname,
    method: req.method,
    timestamp: new Date().toISOString(),
  };
  console.log("[UserTracker] User details:", details);
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL;
  fetch(`${siteURL}/api/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(details),
  }).catch((error) => {
    console.log(error);
    console.warn("[UserTracker] Failed to send tracking info " + `${siteURL}/api/track`);
  });

  ipVisitCache.set(ip, Date.now());

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
