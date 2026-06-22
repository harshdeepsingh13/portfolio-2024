import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { clearConnection } from "@/lib/linkedin";

// ---------------------------------------------------------------------------
// POST /api/integrations/linkedin/disconnect
// ---------------------------------------------------------------------------
// Removes the stored LinkedIn connection (token + person URN).
// ---------------------------------------------------------------------------
export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await clearConnection();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[POST /api/integrations/linkedin/disconnect]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
