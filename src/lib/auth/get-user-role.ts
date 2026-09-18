import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/lib/types";

export interface CurrentUserSession {
  user: {
    id: string;
    email: string;
  } | null;
  profile: Profile | null;
  role: UserRole | null;
}

export async function getCurrentUserSession(): Promise<CurrentUserSession> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user || !user.email) {
      return { user: null, profile: null, role: null };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      // Fallback if trigger was delayed or profile row created with email
      return {
        user: { id: user.id, email: user.email },
        profile: {
          id: user.id,
          name: (user.user_metadata?.name as string) || "User",
          email: user.email,
          phone_number: (user.user_metadata?.phone_number as string) || "",
          role: (user.user_metadata?.role as UserRole) || "customer",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        role: (user.user_metadata?.role as UserRole) || "customer",
      };
    }

    return {
      user: { id: user.id, email: user.email },
      profile: profile as Profile,
      role: (profile as Profile).role,
    };
  } catch {
    return { user: null, profile: null, role: null };
  }
}
