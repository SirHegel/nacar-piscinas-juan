import { get } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pathname: string[] }> },
) {
  const { pathname } = await params;
  const safePath = pathname.join("/");
  if (!safePath.startsWith("media/") || safePath.includes("..")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const result = await get(safePath, { access: "private" });
  if (!result || result.statusCode !== 200) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
