import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminShell from "./AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Login page must render without the admin shell so unauthenticated users
  // can actually see the form. The middleware handles redirecting all other
  // /admin/* paths to /admin/login when there's no session.
  if (!session) {
    return <>{children}</>;
  }

  return <AdminShell>{children}</AdminShell>;
}
