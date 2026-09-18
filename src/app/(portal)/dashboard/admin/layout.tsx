import { getCurrentUserSession } from "@/lib/auth/get-user-role";
import { PortalSidebar } from "@/components/portal/sidebar";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, role } = await getCurrentUserSession();

  // If a real authenticated session exists and role is not admin, redirect
  if (user && role && role !== "admin") {
    redirect(`/dashboard/${role}`);
  }

  const currentUserName = profile?.name || "Lab Admin";
  const currentUserEmail = profile?.email || "nexusdigitaldentallab@gmail.com";

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#070c18]">
      <PortalSidebar
        role="admin"
        userName={currentUserName}
        userEmail={currentUserEmail}
      />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
