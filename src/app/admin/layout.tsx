import { redirect } from "next/navigation";
import AdminShell from "./AdminShell";

// TODO: When Unit 2 (auth) is merged, replace this stub:
// import { auth } from "@/auth";
// const session = await auth();
// if (!session) redirect("/admin/login");
async function getSession() {
  // Stub — always returns null until auth is wired
  return null;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth stub: uncomment when NextAuth (Unit 2) is merged
  // const session = await getSession();
  // if (!session) redirect("/admin/login");

  return <AdminShell>{children}</AdminShell>;
}
