import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { getAdminUser, hasValidOrigin } from "@/lib/auth";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

async function hasValidImageSignature(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 32).arrayBuffer());
  if (file.type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (file.type === "image/png") {
    return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((value, index) => bytes[index] === value);
  }
  if (file.type === "image/webp") {
    return new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP";
  }
  if (file.type === "image/avif") {
    const signature = new TextDecoder().decode(bytes);
    return signature.slice(4, 8) === "ftyp" && /avif|avis/.test(signature);
  }
  return false;
}

export async function POST(request: NextRequest) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ ok: false, message: "Sesión expirada." }, { status: 401 });
  if (!hasValidOrigin(request)) return NextResponse.json({ ok: false }, { status: 403 });

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 6.5 * 1024 * 1024) {
    return NextResponse.json({ ok: false, message: "La imagen supera el máximo de 6 MB." }, { status: 413 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (
    !(file instanceof File) ||
    !allowedTypes.has(file.type) ||
    file.size > 6 * 1024 * 1024 ||
    !(await hasValidImageSignature(file))
  ) {
    return NextResponse.json(
      { ok: false, message: "Usa una imagen JPG, PNG, WebP o AVIF de máximo 6 MB." },
      { status: 422 },
    );
  }

  const extension = extensions[file.type];
  const pathname = `media/hero/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  await put(pathname, file, {
    access: "private",
    contentType: file.type,
    addRandomSuffix: false,
    cacheControlMaxAge: 31536000,
  });

  return NextResponse.json({ ok: true, path: `/api/media/${pathname}` });
}
