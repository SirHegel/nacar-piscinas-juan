import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import { getSiteContent } from "@/lib/cms";
import { listLeads } from "@/lib/leads";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  const [content, leads] = await Promise.all([getSiteContent(), listLeads()]);
  return <AdminDashboard initialContent={content} initialLeads={leads} username={user} />;
}
