import { auth } from "@/auth";
import AdminShell from "./AdminShell";
import ReactQueryProvider from "./ReactQueryProvider";

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

  return (
    <ReactQueryProvider>
      <AdminShell>{children}</AdminShell>
    </ReactQueryProvider>
  );
}
