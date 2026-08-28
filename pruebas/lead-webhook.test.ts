import assert from "node:assert/strict";
import test from "node:test";

import { resolveLeadWebhookUrl } from "../lib/lead-webhook.ts";

test("canonicaliza únicamente webhooks HTTPS de Zapier y Make", () => {
  assert.equal(resolveLeadWebhookUrl(undefined), null);
  assert.equal(resolveLeadWebhookUrl("   "), null);
  assert.equal(
    resolveLeadWebhookUrl("https://hooks.zapier.com/hooks/catch/123456/AbC_-9"),
    "https://hooks.zapier.com/hooks/catch/123456/AbC_-9/",
  );
  assert.equal(
    resolveLeadWebhookUrl("https://hook.eu2.make.com/AbC_123-xyz"),
    "https://hook.eu2.make.com/AbC_123-xyz",
  );
});

test("rechaza destinos internos, suplantaciones y cambios de autoridad", () => {
  for (const unsafeUrl of [
    "http://hooks.zapier.com/hooks/catch/123/token",
    "https://127.0.0.1/hooks/catch/123/token",
    "https://169.254.169.254/latest/meta-data",
    "https://hooks.zapier.com.example.test/hooks/catch/123/token",
    "https://hooks.zapier.com@127.0.0.1/hooks/catch/123/token",
    `https://${["usuario", "clave"].join(":")}@hooks.zapier.com/hooks/catch/123/token`,
    "https://hooks.zapier.com:8443/hooks/catch/123/token",
  ]) {
    assert.throws(() => resolveLeadWebhookUrl(unsafeUrl));
  }
});

test("rechaza rutas ambiguas, travesías y datos fuera del token", () => {
  for (const unsafeUrl of [
    "https://hooks.zapier.com/hooks/catch/123",
    "https://hooks.zapier.com/hooks/catch/123/token/extra",
    "https://hooks.zapier.com/hooks/catch/123/%2e%2e",
    "https://hooks.zapier.com/hooks/catch/123/%2Fadmin",
    "https://hook.us1.make.com/token?next=http://127.0.0.1",
    "https://hook.us1.make.com/token#fragment",
    "https://hook.us1.make.com/one/two",
  ]) {
    assert.throws(() => resolveLeadWebhookUrl(unsafeUrl));
  }
});
