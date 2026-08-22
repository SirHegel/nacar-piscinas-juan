import "server-only";
import { del, get, list, put } from "@vercel/blob";
import { leadStatuses } from "@/lib/admin-model";
import type { LeadStatus } from "@/lib/admin-model";

export { leadStatuses } from "@/lib/admin-model";
export type { LeadStatus } from "@/lib/admin-model";

export type LeadRecord = {
  id: string;
  name: string;
  city: string;
  whatsapp: string;
  email: string;
  projectType: string;
  projectStage: string;
  poolVolume: string;
  priority: string;
  message: string;
  consent: boolean;
  consentAt: string;
  consentVersion: string;
  status: LeadStatus;
  note: string;
  createdAt: string;
  updatedAt: string;
};

async function readLead(pathname: string): Promise<LeadRecord | null> {
  const result = await get(pathname, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200) return null;
  const source = (await new Response(result.stream).json()) as Partial<LeadRecord>;
  if (!source.id || !source.name || !source.createdAt || !source.updatedAt) return null;
  return {
    id: String(source.id),
    name: String(source.name),
    city: String(source.city || ""),
    whatsapp: String(source.whatsapp || ""),
    email: String(source.email || ""),
    projectType: String(source.projectType || ""),
    projectStage: String(source.projectStage || ""),
    poolVolume: String(source.poolVolume || ""),
    priority: String(source.priority || ""),
    message: String(source.message || ""),
    consent: source.consent === true,
    consentAt: String(source.consentAt || source.createdAt),
    consentVersion: String(source.consentVersion || "legacy"),
    status: leadStatuses.includes(source.status as LeadStatus) ? (source.status as LeadStatus) : "new",
    note: String(source.note || ""),
    createdAt: String(source.createdAt),
    updatedAt: String(source.updatedAt),
  };
}

async function writeLead(lead: LeadRecord) {
  const safeId = lead.id.replace(/[^A-Z0-9-]/gi, "");
  await put(`leads/${safeId}/current.json`, JSON.stringify(lead), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}

async function listAll(pathPrefix: string) {
  const blobs: Awaited<ReturnType<typeof list>>["blobs"] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: pathPrefix, limit: 1000, cursor });
    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return blobs;
}

export async function createLead(
  input: Omit<LeadRecord, "status" | "note" | "createdAt" | "updatedAt" | "consentAt" | "consentVersion">,
) {
  const now = new Date().toISOString();
  const lead: LeadRecord = {
    ...input,
    consentAt: now,
    consentVersion: "diagnostic-consent-2026-08-v1",
    status: "new",
    note: "",
    createdAt: now,
    updatedAt: now,
  };
  await writeLead(lead);
  return lead;
}

export async function listLeads(): Promise<LeadRecord[]> {
  const blobs = await listAll("leads/");
  const rows: LeadRecord[] = [];
  let failedReads = 0;

  for (let index = 0; index < blobs.length; index += 30) {
    const batch = await Promise.allSettled(blobs.slice(index, index + 30).map((blob) => readLead(blob.pathname)));
    for (const result of batch) {
      if (result.status === "fulfilled" && result.value) rows.push(result.value);
      if (result.status === "rejected") failedReads += 1;
    }
  }

  if (blobs.length > 0 && rows.length === 0) {
    throw new Error("No fue posible leer las solicitudes guardadas.");
  }
  if (failedReads > 0) console.error("LEAD_PARTIAL_READ_ERROR", failedReads);

  const latest = new Map<string, LeadRecord>();
  for (const lead of rows) {
    const current = latest.get(lead.id);
    if (!current || new Date(lead.updatedAt) > new Date(current.updatedAt)) latest.set(lead.id, lead);
  }
  return [...latest.values()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function getLead(id: string): Promise<LeadRecord | null> {
  const safeId = id.replace(/[^A-Z0-9-]/gi, "");
  if (!safeId) return null;
  const current = await readLead(`leads/${safeId}/current.json`);
  if (current) return current;
  const blobs = await listAll(`leads/${safeId}/`);
  const rows = (await Promise.all(blobs.map((blob) => readLead(blob.pathname)))).filter(
    (lead): lead is LeadRecord => Boolean(lead),
  );
  return rows.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )[0] || null;
}

export async function updateLead(id: string, status: unknown, note: unknown) {
  const current = await getLead(id);
  if (!current) return null;
  const nextStatus = leadStatuses.includes(status as LeadStatus) ? (status as LeadStatus) : current.status;
  const next: LeadRecord = {
    ...current,
    status: nextStatus,
    note: typeof note === "string" ? note.trim().slice(0, 1800) : current.note,
    updatedAt: new Date().toISOString(),
  };
  await writeLead(next);
  return next;
}

export async function deleteLead(id: string) {
  const safeId = id.replace(/[^A-Z0-9-]/gi, "");
  if (!safeId) return false;
  const blobs = await listAll(`leads/${safeId}/`);
  if (!blobs.length) return false;
  for (let index = 0; index < blobs.length; index += 100) {
    await del(blobs.slice(index, index + 100).map((blob) => blob.pathname));
  }
  return true;
}
