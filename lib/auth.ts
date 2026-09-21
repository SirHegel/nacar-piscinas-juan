import "server-only";
import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "nacar_admin_session";
const SESSION_SECONDS = 60 * 60 * 10;

function sign(value: string) {
  const secret = process.env.ADMIN_SESSION_SECRET || "";
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function createToken(username: string) {
  const payload = Buffer.from(
    JSON.stringify({ username, expiresAt: Date.now() + SESSION_SECONDS * 1000 }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string | undefined) {
  if (!token || !process.env.ADMIN_SESSION_SECRET) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      username?: string;
      expiresAt?: number;
    };
    if (!data.username || !data.expiresAt || data.expiresAt < Date.now()) return null;
    return data.username;
  } catch {
    return null;
  }
}

export function verifyAdminCredentials(username: unknown, password: unknown) {
  if (typeof username !== "string" || typeof password !== "string") return false;
  if (username.length > 80 || password.length < 8 || password.length > 256) return false;
  const configuredUser = process.env.ADMIN_USERNAME || "juan";
  const stored = process.env.ADMIN_PASSWORD_HASH || "";
  const [salt, hash] = stored.split(":");
  if (username.trim().toLowerCase() !== configuredUser.toLowerCase() || !salt || !hash) return false;
  try {
    const calculated = scryptSync(password, Buffer.from(salt, "hex"), 64);
    const expected = Buffer.from(hash, "hex");
    return calculated.length === expected.length && timingSafeEqual(calculated, expected);
  } catch {
    return false;
  }
}

export function hasAdminConfiguration() {
  return Boolean(
    process.env.ADMIN_USERNAME &&
    process.env.ADMIN_PASSWORD_HASH &&
    process.env.ADMIN_SESSION_SECRET,
  );
}

export async function createAdminSession(username: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, createToken(username), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

export async function getAdminUser() {
  const store = await cookies();
  return verifyToken(store.get(COOKIE_NAME)?.value);
}

export function hasValidOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
    const requestHost = forwardedHost || request.headers.get("host") || new URL(request.url).host;
    return new URL(origin).host === requestHost;
  } catch {
    return false;
  }
}
