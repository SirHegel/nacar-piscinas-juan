import { redirect } from "next/navigation";
import { getAdminUser, hasAdminConfiguration } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await getAdminUser()) redirect("/admin");
  return <LoginForm configured={hasAdminConfiguration()} />;
}
