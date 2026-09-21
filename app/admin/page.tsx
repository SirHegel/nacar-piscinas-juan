import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import { getSiteContent } from "@/lib/cms";
import { listLeads } from "@/lib/leads";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  const content = await getSiteContent();
  let leads = [] as Awaited<ReturnType<typeof listLeads>>;
  let leadLoadError = "";
  try {
    leads = await listLeads();
  } catch (error) {
    console.error("LEAD_LIST_ERROR", error instanceof Error ? error.message : "unknown");
    leadLoadError = "No se pudieron cargar las solicitudes. No publiques ni asumas que la bandeja está vacía; vuelve a intentarlo.";
  }
  return (
    <AdminDashboard
      initialContent={content}
      initialLeads={leads}
      initialLeadError={leadLoadError}
      username={user}
    />
  );
}
