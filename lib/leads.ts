import { get, list, put } from "@vercel/blob";

export const leadStatuses = ["new", "contacted", "qualified", "won", "archived"] as const;
export type LeadStatus = (typeof leadStatuses)[number];

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
  status: LeadStatus;
  note: string;
  createdAt: string;
  updatedAt: string;
};

async function readLead(pathname: string): Promise<LeadRecord | null> {
  const result = await get(pathname, { access: "private" });
  if (!result || result.statusCode !== 200) return null;
  return (await new Response(result.stream).json()) as LeadRecord;
}

async function writeLead(lead: LeadRecord) {
  const safeId = lead.id.replace(/[^A-Z0-9-]/gi, "");
  const stamp = lead.updatedAt.replace(/[:.]/g, "-");
  await put(`leads/${safeId}/${stamp}-${crypto.randomUUID()}.json`, JSON.stringify(lead), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    cacheControlMaxAge: 60,
  });
}

export async function createLead(input: Omit<LeadRecord, "status" | "note" | "createdAt" | "updatedAt">) {
  const now = new Date().toISOString();
  const lead: LeadRecord = {
    ...input,
    status: "new",
    note: "",
    createdAt: now,
    updatedAt: now,
  };
  await writeLead(lead);
  return lead;
}

export async function listLeads(): Promise<LeadRecord[]> {
  try {
    const result = await list({ prefix: "leads/", limit: 1000 });
    const rows = (await Promise.all(result.blobs.map((blob) => readLead(blob.pathname)))).filter(
      (lead): lead is LeadRecord => Boolean(lead),
    );
    const latest = new Map<string, LeadRecord>();
    for (const lead of rows) {
      const current = latest.get(lead.id);
      if (!current || new Date(lead.updatedAt) > new Date(current.updatedAt)) latest.set(lead.id, lead);
    }
    return [...latest.values()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } catch (error) {
    console.error("LEAD_LIST_ERROR", error);
    return [];
  }
}

export async function getLead(id: string): Promise<LeadRecord | null> {
  const safeId = id.replace(/[^A-Z0-9-]/gi, "");
  if (!safeId) return null;
  const result = await list({ prefix: `leads/${safeId}/`, limit: 100 });
  const latest = result.blobs.sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
  )[0];
  return latest ? readLead(latest.pathname) : null;
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
