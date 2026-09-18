import { getCurrentUserSession } from "@/lib/auth/get-user-role";
import { PortalSidebar } from "@/components/portal/sidebar";
import { redirect } from "next/navigation";

export default async function DesignerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, role } = await getCurrentUserSession();

  // If a real authenticated session exists and role is not designer, redirect
  if (user && role && role !== "designer") {
    redirect(`/dashboard/${role}`);
  }

  const currentUserName = profile?.name || "Marcus Sterling";
  const currentUserEmail = profile?.email || "marcus.sterling@nexusdental.com";

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#070c18]">
      <PortalSidebar
        role="designer"
        userName={currentUserName}
        userEmail={currentUserEmail}
      />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
