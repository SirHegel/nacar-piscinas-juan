import "server-only";
import { createHmac, randomUUID, scrypt, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = process.env.NODE_ENV === "production"
  ? "__Host-nacar_admin_session"
  : "nacar_admin_session";
const SESSION_SECONDS = 60 * 60 * 10;
const MIN_PASSWORD_LENGTH = 14;
const MIN_SESSION_SECRET_BYTES = 32;

type AdminConfiguration = {
  username: string;
  passwordSalt: Buffer;
  passwordHash: Buffer;
  sessionSecret: string;
};

function getAdminConfiguration(): AdminConfiguration | null {
  const username = process.env.ADMIN_USERNAME?.trim() || "";
  const storedHash = process.env.ADMIN_PASSWORD_HASH?.trim() || "";
  const sessionSecret = process.env.ADMIN_SESSION_SECRET || "";
  const [salt, hash, ...extra] = storedHash.split(":");

  if (
    username.length < 3 ||
    username.length > 80 ||
    /[\r\n\0]/.test(username) ||
    extra.length > 0 ||
    !/^[a-f0-9]{32,128}$/i.test(salt || "") ||
    (salt?.length || 0) % 2 !== 0 ||
    !/^[a-f0-9]{128}$/i.test(hash || "") ||
    Buffer.byteLength(sessionSecret, "utf8") < MIN_SESSION_SECRET_BYTES ||
    Buffer.byteLength(sessionSecret, "utf8") > 512
  ) {
    return null;
  }

  return {
    username,
    passwordSalt: Buffer.from(salt, "hex"),
    passwordHash: Buffer.from(hash, "hex"),
    sessionSecret,
  };
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest();
}

function getCredentialVersion(configuration: AdminConfiguration) {
  return createHmac("sha256", configuration.sessionSecret)
    .update(configuration.username)
    .update(configuration.passwordHash)
    .digest("base64url");
}

function createToken(configuration: AdminConfiguration) {
  const issuedAt = Date.now();
  const payload = Buffer.from(
    JSON.stringify({
      version: 1,
      issuer: "nacar-admin",
      audience: "nacar-cms",
      sessionId: randomUUID(),
      username: configuration.username,
      credentialVersion: getCredentialVersion(configuration),
      issuedAt,
      expiresAt: issuedAt + SESSION_SECONDS * 1000,
    }),
  ).toString("base64url");
  return `${payload}.${sign(payload, configuration.sessionSecret).toString("base64url")}`;
}

function verifyToken(token: string | undefined) {
  const configuration = getAdminConfiguration();
  if (!token || !configuration) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  if (!payload || !signature) return null;
  const expected = sign(payload, configuration.sessionSecret);
  const received = Buffer.from(signature, "base64url");
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      version?: number;
      issuer?: string;
      audience?: string;
      sessionId?: string;
      username?: string;
      credentialVersion?: string;
      issuedAt?: number;
      expiresAt?: number;
    };
    const now = Date.now();
    if (
      data.version !== 1 ||
      data.issuer !== "nacar-admin" ||
      data.audience !== "nacar-cms" ||
      typeof data.sessionId !== "string" ||
      !/^[0-9a-f-]{36}$/i.test(data.sessionId) ||
      typeof data.username !== "string" ||
      data.username.toLowerCase() !== configuration.username.toLowerCase() ||
      data.credentialVersion !== getCredentialVersion(configuration) ||
      typeof data.issuedAt !== "number" ||
      typeof data.expiresAt !== "number" ||
      data.issuedAt > now + 60_000 ||
      data.expiresAt <= now ||
      data.expiresAt > data.issuedAt + SESSION_SECONDS * 1000
    ) {
      return null;
    }
    return configuration.username;
  } catch {
    return null;
  }
}

function derivePassword(password: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });
}

export async function verifyAdminCredentials(username: unknown, password: unknown) {
  if (typeof username !== "string" || typeof password !== "string") return false;
  if (
    username.length > 80 ||
    password.length < MIN_PASSWORD_LENGTH ||
    password.length > 256
  ) {
    return false;
  }
  const configuration = getAdminConfiguration();
  if (!configuration) return false;

  try {
    const calculated = await derivePassword(password, configuration.passwordSalt);
    const passwordMatches = calculated.length === configuration.passwordHash.length &&
      timingSafeEqual(calculated, configuration.passwordHash);
    const usernameMatches = username.trim().toLowerCase() === configuration.username.toLowerCase();
    return usernameMatches && passwordMatches;
  } catch {
    return false;
  }
}

export function hasAdminConfiguration() {
  return getAdminConfiguration() !== null;
}

export async function createAdminSession() {
  const configuration = getAdminConfiguration();
  if (!configuration) throw new Error("La configuración del administrador no es válida.");
  const store = await cookies();
  store.set(COOKIE_NAME, createToken(configuration), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
    expires: new Date(Date.now() + SESSION_SECONDS * 1000),
    priority: "high",
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
    expires: new Date(0),
    priority: "high",
  });
}

export async function getAdminUser() {
  const store = await cookies();
  return verifyToken(store.get(COOKIE_NAME)?.value);
}

export function hasValidOrigin(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") return false;
  const origin = request.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";
  try {
    const configured = process.env.SITE_URL?.trim();
    const vercelHostname = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
    const expected = configured
      ? new URL(/^https?:\/\//i.test(configured) ? configured : `https://${configured}`).origin
      : vercelHostname
        ? new URL(`https://${vercelHostname}`).origin
        : new URL(request.url).origin;
    return new URL(origin).origin === expected;
  } catch {
    return false;
  }
}
