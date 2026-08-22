import { NextRequest, NextResponse } from "next/server";
import {
  createAdminSession,
  hasAdminConfiguration,
  hasValidOrigin,
  verifyAdminCredentials,
} from "@/lib/auth";

const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_TRACKED_CLIENTS = 5_000;

function recordFailedAttempt(ip: string, now: number) {
  const current = loginAttempts.get(ip);
  if (!current || current.resetAt <= now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
  } else {
    current.count += 1;
  }

  if (loginAttempts.size <= MAX_TRACKED_CLIENTS) return;
  for (const [key, attempt] of loginAttempts) {
    if (attempt.resetAt <= now) loginAttempts.delete(key);
  }
  while (loginAttempts.size > MAX_TRACKED_CLIENTS) {
    const oldest = loginAttempts.keys().next().value as string | undefined;
    if (!oldest) break;
    loginAttempts.delete(oldest);
  }
}

export async function POST(request: NextRequest) {
  if (!hasAdminConfiguration()) {
    return NextResponse.json({ ok: false, message: "El acceso privado aún no está configurado." }, { status: 503 });
  }
  const contentType = request.headers.get("content-type") || "";
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (!contentType.includes("application/json") || contentLength > 4 * 1024) {
    return NextResponse.json({ ok: false, message: "Solicitud inválida." }, { status: 415 });
  }
  if (!hasValidOrigin(request)) {
    return NextResponse.json({ ok: false, message: "Origen inválido." }, { status: 403 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const current = loginAttempts.get(ip);
  if (current && current.resetAt > now && current.count >= 8) {
    return NextResponse.json(
      { ok: false, message: "Demasiados intentos. Espera unos minutos." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.max(1, Math.ceil((current.resetAt - now) / 1000))) },
      },
    );
  }

  let body: Record<string, unknown>;
  try {
    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, "utf8") > 4 * 1024) {
      return NextResponse.json({ ok: false, message: "Solicitud inválida." }, { status: 413 });
    }
    body = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, message: "Solicitud inválida." }, { status: 400 });
  }

  if (
    typeof body.username !== "string" ||
    typeof body.password !== "string" ||
    body.username.length > 80 ||
    body.password.length > 256
  ) {
    return NextResponse.json({ ok: false, message: "Solicitud inválida." }, { status: 400 });
  }

  if (!(await verifyAdminCredentials(body.username, body.password))) {
    recordFailedAttempt(ip, now);
    return NextResponse.json({ ok: false, message: "Usuario o contraseña incorrectos." }, { status: 401 });
  }

  loginAttempts.delete(ip);
  await createAdminSession();
  return NextResponse.json({ ok: true });
}
