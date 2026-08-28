const MAKE_WEBHOOK_HOSTS = new Set([
  "hook.eu1.make.com",
  "hook.eu2.make.com",
  "hook.us1.make.com",
  "hook.us2.make.com",
]);

function fixedWebhookOrigin(hostname: string) {
  switch (hostname) {
    case "hooks.zapier.com":
      return "https://hooks.zapier.com";
    case "hook.eu1.make.com":
      return "https://hook.eu1.make.com";
    case "hook.eu2.make.com":
      return "https://hook.eu2.make.com";
    case "hook.us1.make.com":
      return "https://hook.us1.make.com";
    case "hook.us2.make.com":
      return "https://hook.us2.make.com";
    default:
      throw new Error("El webhook debe pertenecer a un proveedor permitido.");
  }
}

function safeWebhookToken(segment: string) {
  let decoded: string;
  try {
    decoded = decodeURIComponent(segment);
  } catch {
    throw new Error("La URL del webhook no es válida.");
  }
  if (!/^[A-Za-z0-9_-]{1,200}$/.test(decoded)) {
    throw new Error("La ruta del webhook no tiene el formato permitido.");
  }
  // encodeURIComponent is also a CodeQL-recognized SSRF barrier: path data can
  // never become a hostname, authority delimiter or traversal component.
  return encodeURIComponent(decoded);
}

/**
 * Converts optional deployment configuration into a provider-owned endpoint.
 * The untrusted URL is never used directly: its host selects a literal origin
 * and only provider tokens survive, after strict validation and encoding.
 */
export function resolveLeadWebhookUrl(configuredUrl: string | undefined) {
  if (!configuredUrl?.trim()) return null;

  let candidate: URL;
  try {
    candidate = new URL(configuredUrl);
  } catch {
    throw new Error("La URL del webhook no es válida.");
  }

  const hostname = candidate.hostname.toLowerCase();
  const origin = fixedWebhookOrigin(hostname);
  if (
    candidate.protocol !== "https:" ||
    candidate.username ||
    candidate.password ||
    candidate.port ||
    candidate.search ||
    candidate.hash
  ) {
    throw new Error("El webhook debe usar HTTPS sin credenciales, puerto, consulta ni fragmento.");
  }

  const segments = candidate.pathname.split("/").filter(Boolean);
  if (hostname === "hooks.zapier.com") {
    if (segments.length !== 4 || segments[0] !== "hooks" || segments[1] !== "catch") {
      throw new Error("La ruta del webhook de Zapier no tiene el formato permitido.");
    }
    const account = safeWebhookToken(segments[2]);
    const token = safeWebhookToken(segments[3]);
    return `${origin}/hooks/catch/${account}/${token}/`;
  }

  if (MAKE_WEBHOOK_HOSTS.has(hostname) && segments.length === 1) {
    return `${origin}/${safeWebhookToken(segments[0])}`;
  }

  throw new Error("La ruta del webhook no tiene el formato permitido.");
}
