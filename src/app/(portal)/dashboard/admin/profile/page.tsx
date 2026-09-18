"use client";

import { useState } from "react";
import { Shield, Save, CheckCircle2 } from "lucide-react";
import { PortalHeader } from "@/components/portal/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BRAND } from "@/lib/constants/brand";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState({
    name: "Lab Operations Admin",
    email: BRAND.contact.email,
    phone_number: BRAND.contact.phone,
    role: "System Administrator",
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

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

          <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 text-lg font-bold">
              LA
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
            value={profile.phone_number}
            onChange={(e) =>
              setProfile({ ...profile, phone_number: e.target.value })
            }
            required
          />

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <Button type="submit" size="md" className="gap-2 text-xs">
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
