import { NextRequest, NextResponse } from "next/server";
import { getAdminUser, hasValidOrigin } from "@/lib/auth";
import { ContentValidationError, saveSiteContent } from "@/lib/cms";

export async function POST(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ ok: false, message: "Sesión expirada." }, { status: 401 });
  if (!hasValidOrigin(request)) return NextResponse.json({ ok: false }, { status: 403 });

  try {
    const body = await request.json();
    const content = await saveSiteContent(body);
    return NextResponse.json({ ok: true, content, publishedAt: content.updatedAt });
  } catch (error) {
    if (error instanceof ContentValidationError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 422 });
    }
    console.error("CMS_SAVE_ERROR", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ ok: false, message: "No se pudo publicar el contenido." }, { status: 500 });
  }
}
