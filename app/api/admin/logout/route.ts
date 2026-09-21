import { NextRequest, NextResponse } from "next/server";
import { clearAdminSession, hasValidOrigin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!hasValidOrigin(request)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  await clearAdminSession();
  return NextResponse.json({ ok: true });
}
