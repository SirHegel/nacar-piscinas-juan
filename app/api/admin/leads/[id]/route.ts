import { NextRequest, NextResponse } from "next/server";
import { getAdminUser, hasValidOrigin } from "@/lib/auth";
import { deleteLead, updateLead } from "@/lib/leads";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ ok: false, message: "Sesión expirada." }, { status: 401 });
  if (!hasValidOrigin(request)) return NextResponse.json({ ok: false }, { status: 403 });

  const { id } = await params;
  const body = (await request.json()) as { status?: unknown; note?: unknown };
  const lead = await updateLead(id, body.status, body.note);
  if (!lead) return NextResponse.json({ ok: false, message: "Solicitud no encontrada." }, { status: 404 });
  return NextResponse.json({ ok: true, lead });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ ok: false, message: "Sesión expirada." }, { status: 401 });
  if (!hasValidOrigin(request)) return NextResponse.json({ ok: false }, { status: 403 });

  const { id } = await params;
  const deleted = await deleteLead(id);
  if (!deleted) return NextResponse.json({ ok: false, message: "Solicitud no encontrada." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
