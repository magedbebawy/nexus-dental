import { redirect } from "next/navigation";
import { getCurrentUserSession } from "./get-user-role";
import type { UserRole } from "@/lib/types";

export async function requireAuth(expectedRole?: UserRole) {
  const { user, profile, role } = await getCurrentUserSession();

  if (!user || !profile || !role) {
    redirect("/login");
  }

  if (expectedRole && role !== expectedRole) {
    // Redirect user to their own role-specific dashboard
    redirect(`/dashboard/${role}`);
  }

  return { user, profile, role };
}
