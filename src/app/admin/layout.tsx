import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import AdminShell from "./AdminShell";
import ReactQueryProvider from "./ReactQueryProvider";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isLoginPage = pathname === "/admin/login";

  if (!session && !isLoginPage) {
    redirect(`/admin/login?callbackUrl=${encodeURIComponent(pathname)}`);
  }

  if (session && isLoginPage) {
    redirect("/admin");
  }

  if (!session) {
    return <>{children}</>;
  }

  return (
    <ReactQueryProvider>
      <AdminShell>{children}</AdminShell>
    </ReactQueryProvider>
  );
}
