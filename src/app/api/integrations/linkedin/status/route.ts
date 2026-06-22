import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { getConnectionStatus } from "@/lib/linkedin";

// ---------------------------------------------------------------------------
// GET /api/integrations/linkedin/status
// ---------------------------------------------------------------------------
// Client-safe connection summary for the Settings UI. Never returns the token.
// ---------------------------------------------------------------------------
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const status = await getConnectionStatus();
    return NextResponse.json(status);
  } catch (err) {
    console.error("[GET /api/integrations/linkedin/status]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
