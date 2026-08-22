#!/usr/bin/env node

import { randomBytes, scryptSync } from "node:crypto";
import { chmod, readFile, rename, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createInterface } from "node:readline/promises";
import { Writable } from "node:stream";

const ADMIN_KEYS = new Set([
  "ADMIN_USERNAME",
  "ADMIN_PASSWORD_HASH",
  "ADMIN_SESSION_SECRET",
]);

function validateUsername(username) {
  if (!/^[A-Za-z0-9._@+-]{3,80}$/.test(username)) {
    throw new Error("El usuario debe tener entre 3 y 80 caracteres y usar letras, números, punto, guion, + o @.");
  }
}

function validatePassword(password) {
  const categories = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/]
    .filter((pattern) => pattern.test(password)).length;
  if (password.length < 14 || password.length > 256 || categories < 3) {
    throw new Error("La contraseña debe tener de 14 a 256 caracteres y combinar al menos tres tipos: minúsculas, mayúsculas, números y símbolos.");
  }
}

export function createAdminValues(username, password) {
  const normalizedUsername = username.trim();
  validateUsername(normalizedUsername);
  validatePassword(password);

  const salt = randomBytes(24);
  const passwordHash = scryptSync(password, salt, 64);
  return {
    ADMIN_USERNAME: normalizedUsername,
    ADMIN_PASSWORD_HASH: `${salt.toString("hex")}:${passwordHash.toString("hex")}`,
    ADMIN_SESSION_SECRET: randomBytes(48).toString("base64url"),
  };
}

export function mergeEnvironment(current, values) {
  const keptLines = current
    .split(/\r?\n/)
    .filter((line) => {
      const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/);
      return !match || !ADMIN_KEYS.has(match[1]);
    });

  while (keptLines.length && keptLines.at(-1)?.trim() === "") keptLines.pop();
  if (keptLines.length) keptLines.push("");
  keptLines.push(
    "# Acceso privado generado localmente con `npm run setup`.",
    `ADMIN_USERNAME=${values.ADMIN_USERNAME}`,
    `ADMIN_PASSWORD_HASH=${values.ADMIN_PASSWORD_HASH}`,
    `ADMIN_SESSION_SECRET=${values.ADMIN_SESSION_SECRET}`,
    "",
  );
  return keptLines.join("\n");
}

export function hasExistingAdminValues(current) {
  const configured = new Set();
  for (const line of current.split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?(ADMIN_USERNAME|ADMIN_PASSWORD_HASH|ADMIN_SESSION_SECRET)\s*=\s*(.+?)\s*$/);
    if (match?.[2] && match[2] !== '""' && match[2] !== "''") configured.add(match[1]);
  }
  return configured.size > 0;
}

async function readIfPresent(pathname) {
  try {
    return await readFile(pathname, "utf8");
  } catch (error) {
    if (error && typeof error === "object" && error.code === "ENOENT") return "";
    throw error;
  }
}

async function writePrivateEnvironment(pathname, content) {
  const temporaryPath = `${pathname}.${process.pid}.tmp`;
  try {
    await writeFile(temporaryPath, content, { encoding: "utf8", mode: 0o600, flag: "wx" });
    await rename(temporaryPath, pathname);
    await chmod(pathname, 0o600);
  } finally {
    await rm(temporaryPath, { force: true });
  }
}

function createPrompter() {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error("La configuración requiere una terminal interactiva para ocultar la contraseña.");
  }

  let muted = false;
  const output = new Writable({
    write(chunk, encoding, callback) {
      if (!muted) process.stdout.write(chunk, encoding);
      callback();
    },
  });
  const terminal = createInterface({ input: process.stdin, output, terminal: true });

  return {
    async visible(question) {
      return terminal.question(question);
    },
    async hidden(question) {
      process.stdout.write(question);
      muted = true;
      try {
        return await terminal.question("");
      } finally {
        muted = false;
        process.stdout.write("\n");
      }
    },
    close() {
      terminal.close();
    },
  };
}

async function main() {
  const prompter = createPrompter();
  try {
    process.stdout.write("\nConfiguración segura del panel NÁCAR\n");
    process.stdout.write("La contraseña se transforma con scrypt y nunca se guarda en texto plano.\n\n");

    const environmentPath = resolve(process.cwd(), ".env.local");
    const current = await readIfPresent(environmentPath);
    if (hasExistingAdminValues(current)) {
      const rotation = await prompter.visible("Ya existe una configuración de acceso. Escribe ROTAR para reemplazarla: ");
      if (rotation !== "ROTAR") {
        process.stdout.write("\nNo se realizaron cambios.\n");
        return;
      }
      process.stdout.write("\n");
    }

    const username = (await prompter.visible("Usuario administrador: ")).trim();
    const password = await prompter.hidden("Contraseña (oculta): ");
    const confirmation = await prompter.hidden("Repite la contraseña: ");
    if (password !== confirmation) throw new Error("Las contraseñas no coinciden.");

    const values = createAdminValues(username, password);
    await writePrivateEnvironment(environmentPath, mergeEnvironment(current, values));

    process.stdout.write("\nConfiguración creada en .env.local con permisos privados (600).\n");
    process.stdout.write("El siguiente paso es configurar BLOB_READ_WRITE_TOKEN y ejecutar `npm run dev`.\n");
    process.stdout.write("Para producción, copia estas variables mediante el gestor de secretos del proveedor; nunca las confirmes en Git.\n");
  } finally {
    prompter.close();
  }
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";
if (import.meta.url === invokedPath) {
  main().catch((error) => {
    process.stderr.write(`\nNo se completó la configuración: ${error instanceof Error ? error.message : "error desconocido"}\n`);
    process.exitCode = 1;
  });
}
