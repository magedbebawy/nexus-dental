"use client";

import { useState } from "react";
import { Palette, Save, CheckCircle2 } from "lucide-react";
import { PortalHeader } from "@/components/portal/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DesignerProfilePage() {
  const [profile, setProfile] = useState({
    name: "Marcus Sterling",
    email: "marcus.sterling@nexusdental.com",
    phone_number: "951-334-8942",
    role: "Senior CAD Technician",
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
        title="Designer Profile"
        description="CAD technician bench details and contact profile."
      />

      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {isSaved && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Profile details updated successfully.</span>
            </div>
          )}

          <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
            <div className="w-14 h-14 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 text-lg font-bold">
              MS
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{profile.name}</h2>
              <span className="text-xs text-cyan-400 font-medium">{profile.role}</span>
            </div>
          </div>

          <Input
            label="Technician Name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            required
          />

          <Input
            label="Lab Email"
            type="email"
            value={profile.email}
            disabled
            helperText="Internal technician credentials managed by lab administration."
          />

          <Input
            label="Direct Contact Number"
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
              <span>Save Profile Changes</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
