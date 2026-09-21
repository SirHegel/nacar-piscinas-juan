import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type Lead = {
  name: string;
  city: string;
  whatsapp: string;
  email?: string;
  projectType: string;
  projectStage: string;
  poolVolume?: string;
  priority: string;
  message?: string;
  consent: boolean;
  website?: string;
};

const attempts = new Map<string, { count: number; resetAt: number }>();

function clean(value: unknown, max = 240) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

function normalizeLead(body: Record<string, unknown>): Lead {
  return {
    name: clean(body.name, 100),
    city: clean(body.city, 120),
    whatsapp: clean(body.whatsapp, 40),
    email: clean(body.email, 160),
    projectType: clean(body.projectType, 100),
    projectStage: clean(body.projectStage, 100),
    poolVolume: clean(body.poolVolume, 80),
    priority: clean(body.priority, 140),
    message: clean(body.message, 1200),
    consent: body.consent === true,
    website: clean(body.website, 200),
  };
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const current = attempts.get(ip);
  if (!current || current.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }
  current.count += 1;
  return current.count > 6;
}

async function sendToWebhook(lead: Lead, reference: string) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return false;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source: "nacar-web", reference, lead, receivedAt: new Date().toISOString() }),
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error(`Webhook error ${response.status}`);
  return true;
}

async function sendWithResend(lead: Lead, reference: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEADS_TO_EMAIL;
  if (!apiKey || !to) return false;

  const rows = [
    ["Nombre", lead.name],
    ["Ciudad / zona", lead.city],
    ["WhatsApp", lead.whatsapp],
    ["Correo", lead.email || "No indicado"],
    ["Tipo de proyecto", lead.projectType],
    ["Etapa", lead.projectStage],
    ["Volumen", lead.poolVolume || "No indicado"],
    ["Prioridad", lead.priority],
    ["Mensaje", lead.message || "Sin mensaje adicional"],
  ];

  const html = `
    <div style="font-family:Arial,sans-serif;color:#14201e;max-width:620px;margin:auto">
      <p style="letter-spacing:.12em;text-transform:uppercase;color:#6d5a2d">NÁCAR · Nueva solicitud</p>
      <h1 style="font-size:28px">Diagnóstico ${escapeHtml(reference)}</h1>
      <table style="width:100%;border-collapse:collapse">
        ${rows.map(([label, value]) => `<tr><td style="padding:10px;border-bottom:1px solid #ddd;color:#667">${escapeHtml(label)}</td><td style="padding:10px;border-bottom:1px solid #ddd">${escapeHtml(value)}</td></tr>`).join("")}
      </table>
    </div>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.LEADS_FROM_EMAIL || "Nácar <onboarding@resend.dev>",
      to: [to],
      reply_to: lead.email || undefined,
      subject: `Nueva solicitud NÁCAR · ${lead.name} · ${lead.city}`,
      html,
    }),
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error(`Resend error ${response.status}`);
  return true;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, message: "Demasiadas solicitudes. Inténtalo más tarde." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, message: "Solicitud inválida." }, { status: 400 });
  }

  const lead = normalizeLead(body);
  if (lead.website) return NextResponse.json({ ok: true, reference: "NAC-OK" });

  const phoneDigits = lead.whatsapp.replace(/\D/g, "");
  const valid =
    lead.name.length >= 2 &&
    lead.city.length >= 2 &&
    phoneDigits.length >= 7 &&
    lead.projectType.length > 0 &&
    lead.projectStage.length > 0 &&
    lead.priority.length > 0 &&
    lead.consent;

  if (!valid) {
    return NextResponse.json({ ok: false, message: "Completa los campos obligatorios." }, { status: 422 });
  }

  const reference = `NAC-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;

  try {
    const deliveries = await Promise.all([sendToWebhook(lead, reference), sendWithResend(lead, reference)]);
    if (!deliveries.some(Boolean)) {
      console.info("NACAR_LEAD", JSON.stringify({ reference, lead, receivedAt: new Date().toISOString() }));
    }
  } catch (error) {
    console.error("NACAR_LEAD_DELIVERY_ERROR", reference, error);
    return NextResponse.json({ ok: false, message: "No fue posible entregar la solicitud." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, reference }, { status: 201 });
}
