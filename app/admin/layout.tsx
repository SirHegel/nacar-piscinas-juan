import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "Panel privado | NÁCAR",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
