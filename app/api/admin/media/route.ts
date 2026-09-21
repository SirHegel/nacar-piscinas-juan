import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { getAdminUser, hasValidOrigin } from "@/lib/auth";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export async function POST(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ ok: false, message: "Sesión expirada." }, { status: 401 });
  if (!hasValidOrigin(request)) return NextResponse.json({ ok: false }, { status: 403 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || !allowedTypes.has(file.type) || file.size > 6 * 1024 * 1024) {
    return NextResponse.json(
      { ok: false, message: "Usa una imagen JPG, PNG, WebP o AVIF de máximo 6 MB." },
      { status: 422 },
    );
  }

  const extension = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "").toLowerCase() || "webp";
  const pathname = `media/hero/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  await put(pathname, file, {
    access: "private",
    contentType: file.type,
    addRandomSuffix: false,
    cacheControlMaxAge: 31536000,
  });

  return NextResponse.json({ ok: true, path: `/api/media/${pathname}` });
}
