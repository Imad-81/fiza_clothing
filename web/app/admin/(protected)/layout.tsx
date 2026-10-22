import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/is-admin";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin: admin, session } = await isAdmin();

  if (!session?.user) {
    redirect("/admin/sign-in?callbackURL=%2Fadmin");
  }
  if (!admin) {
    redirect("/admin/sign-in?callbackURL=%2Fadmin&reason=forbidden");
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col md:flex-row gap-6 md:gap-8 px-4 py-6 md:py-10 sm:px-6">
      <AdminSidebar userEmail={session.user.email} />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
