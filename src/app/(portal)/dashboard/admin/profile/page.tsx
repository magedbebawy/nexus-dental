"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { PortalHeader } from "@/components/portal/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BRAND } from "@/lib/constants/brand";
import { createClient } from "@/lib/supabase/client";

export default function AdminProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    id: "",
    name: "",
    email: "",
    phone_number: "",
    role: "System Administrator",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: dbProfile } = await (supabase.from("profiles") as any)
            .select("*")
            .eq("id", user.id)
            .single();

          setProfile({
            id: user.id,
            name: dbProfile?.name || (user.user_metadata?.name as string) || "Lab Operations Admin",
            email: user.email || dbProfile?.email || BRAND.contact.email,
            phone_number: dbProfile?.phone_number || (user.user_metadata?.phone_number as string) || BRAND.contact.phone,
            role: "System Administrator",
          });
        } else {
          // Demo fallback
          setProfile({
            id: "demo-admin",
            name: "Lab Operations Admin",
            email: BRAND.contact.email,
            phone_number: BRAND.contact.phone,
            role: "System Administrator",
          });
        }
      } catch (err) {
        console.error("Error loading admin profile:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setIsSaved(false);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error: dbError } = await (supabase.from("profiles") as any)
          .update({
            name: profile.name,
            phone_number: profile.phone_number,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        if (dbError) throw dbError;

        await supabase.auth.updateUser({
          data: {
            name: profile.name,
            phone_number: profile.phone_number,
          },
        });
      }

      setIsSaved(true);
      router.refresh();
      setTimeout(() => setIsSaved(false), 4000);
    } catch (err: any) {
      console.error("Failed to update admin profile", err);
      setErrorMessage(err.message || "Failed to update admin records. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const initials =
    profile.name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "LA";

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
        <span>Loading administration profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <PortalHeader
        title="Admin Profile"
        description="System administration preferences and master lab contact records."
      />

      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {isSaved && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Admin records updated successfully.</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 text-lg font-bold">
              {initials}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{profile.name}</h2>
              <span className="text-xs text-emerald-400 font-medium">{profile.role}</span>
            </div>
          </div>

          <Input
            label="Administrator Name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            required
          />

          <Input
            label="Lab Primary Email"
            type="email"
            value={profile.email}
            disabled
            helperText="System email mapped to Nexus Digital Dental Lab."
          />

          <Input
            label="Contact Phone Number"
            type="tel"
            placeholder="(555) 000-0000"
            value={profile.phone_number}
            onChange={(e) =>
              setProfile({ ...profile, phone_number: e.target.value })
            }
          />

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <Button type="submit" size="md" disabled={isSaving} className="gap-2 text-xs">
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
