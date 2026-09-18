import { createClient } from "@/lib/supabase/client";
import type { Profile, UserRole } from "@/lib/types";

// In-memory fallback mock profiles
const mockProfiles: Profile[] = [
  {
    id: "u1111111-1111-1111-1111-111111111111",
    name: "Dr. Alex Vance",
    email: "alex.vance@dentalcare.com",
    phone_number: "951-555-0199",
    role: "customer",
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: "u2222222-2222-2222-2222-222222222222",
    name: "Dr. Sarah Jenkins",
    email: "dr.jenkins@scenicdental.com",
    phone_number: "951-555-0248",
    role: "customer",
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: "d2222222-2222-2222-2222-222222222222",
    name: "Marcus Sterling",
    email: "marcus.sterling@nexusdental.com",
    phone_number: "951-334-8942",
    role: "designer",
    created_at: new Date(Date.now() - 86400000 * 60).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 60).toISOString(),
  },
  {
    id: "d3333333-3333-3333-3333-333333333333",
    name: "Elena Rostova",
    email: "elena.rostova@nexusdental.com",
    phone_number: "951-334-8942",
    role: "designer",
    created_at: new Date(Date.now() - 86400000 * 45).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 45).toISOString(),
  },
  {
    id: "a1111111-1111-1111-1111-111111111111",
    name: "Lab Operations Admin",
    email: "nexusdigitaldentallab@gmail.com",
    phone_number: "951-334-8942",
    role: "admin",
    created_at: new Date(Date.now() - 86400000 * 90).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 90).toISOString(),
  },
];

export async function fetchProfilesByRole(role: UserRole): Promise<Profile[]> {
  try {
    const supabase = createClient();
    const { data, error } = await (supabase.from("profiles") as any)
      .select("*")
      .eq("role", role)
      .order("name", { ascending: true });

    if (error) throw error;
    if (data && data.length > 0) return data as Profile[];
  } catch {
    // Fallback
  }

  return mockProfiles.filter((p) => p.role === role);
}

export async function fetchAllProfiles(): Promise<Profile[]> {
  try {
    const supabase = createClient();
    const { data, error } = await (supabase.from("profiles") as any)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    if (data && data.length > 0) return data as Profile[];
  } catch {
    // Fallback
  }

  return mockProfiles;
}

export async function fetchProfileById(id: string): Promise<Profile | null> {
  try {
    const supabase = createClient();
    const { data, error } = await (supabase.from("profiles") as any)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (data) return data as Profile;
  } catch {
    // Fallback
  }

  return mockProfiles.find((p) => p.id === id) || null;
}

export async function createDesignerAccount(params: {
  name: string;
  email: string;
  phone_number: string;
}): Promise<Profile> {
  try {
    const supabase = createClient();
    const { data, error } = await (supabase.from("profiles") as any)
      .insert({
        id: crypto.randomUUID(),
        name: params.name,
        email: params.email,
        phone_number: params.phone_number,
        role: "designer",
      })
      .select()
      .single();

    if (error) throw error;
    if (data) return data as Profile;
  } catch {
    // Fallback
  }

  const newDesigner: Profile = {
    id: `d-${Date.now()}`,
    name: params.name,
    email: params.email,
    phone_number: params.phone_number,
    role: "designer",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  mockProfiles.push(newDesigner);
  return newDesigner;
}

export async function updateProfileDetails(
  id: string,
  updates: Partial<Pick<Profile, "name" | "phone_number">>
): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await (supabase.from("profiles") as any)
      .update(updates)
      .eq("id", id);

    if (error) throw error;
    return true;
  } catch {
    // Fallback
  }

  const found = mockProfiles.find((p) => p.id === id);
  if (found) {
    if (updates.name) found.name = updates.name;
    if (updates.phone_number) found.phone_number = updates.phone_number;
    found.updated_at = new Date().toISOString();
    return true;
  }
  return false;
}
