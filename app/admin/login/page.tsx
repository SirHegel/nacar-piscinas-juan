import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await getAdminUser()) redirect("/admin");
  return <LoginForm />;
}
