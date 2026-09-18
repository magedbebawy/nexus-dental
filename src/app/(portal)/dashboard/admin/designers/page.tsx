"use client";

import { useEffect, useState } from "react";
import { Palette, Mail, Phone, Plus, UserPlus, CheckCircle2, AlertCircle } from "lucide-react";
import { PortalHeader } from "@/components/portal/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { fetchProfilesByRole, createDesignerAccount } from "@/lib/services/users";
import { formatDate } from "@/lib/utils";
import type { Profile } from "@/lib/types";

export default function AdminDesignersPage() {
  const [designers, setDesigners] = useState<Profile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // New Designer Form State
  const [newDesigner, setNewDesigner] = useState({
    name: "",
    email: "",
    phone_number: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDesigners = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProfilesByRole("designer");
      setDesigners(data);
    } catch (err) {
      console.error("Failed to load designers", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDesigners();
  }, []);

  const handleCreateDesigner = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await createDesignerAccount(newDesigner);
      await loadDesigners();
      setIsModalOpen(false);
      setNewDesigner({ name: "", email: "", phone_number: "" });
    } catch {
      setError("Failed to create designer account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <PortalHeader
        title="CAD Designers"
        description="Qualified dental CAD technicians available for case assignment and quality verification."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/admin" },
          { label: "Designers" },
        ]}
        actions={
          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="gap-2 text-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add CAD Designer</span>
          </Button>
        }
      />

      {/* Designers Table */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 text-sm">
          Loading CAD technicians...
        </div>
      ) : designers.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-slate-800 bg-[#090e1c] text-slate-400 text-sm">
          No designer accounts currently registered.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#090e1c]/80 shadow-xl">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-800 bg-[#070b16] text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Technician Name</th>
                <th className="px-5 py-3.5">Internal Email</th>
                <th className="px-5 py-3.5">Contact Number</th>
                <th className="px-5 py-3.5">Role Designation</th>
                <th className="px-5 py-3.5">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {designers.map((designer) => (
                <tr key={designer.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4 font-semibold text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-bold">
                        {designer.name.charAt(0)}
                      </div>
                      <span>{designer.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-300">
                    <a
                      href={`mailto:${designer.email}`}
                      className="hover:text-cyan-400 inline-flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>{designer.email}</span>
                    </a>
                  </td>
                  <td className="px-5 py-4 text-slate-300">
                    <a
                      href={`tel:${designer.phone_number}`}
                      className="hover:text-cyan-400 inline-flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{designer.phone_number || "951-334-8942"}</span>
                    </a>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/25">
                      CAD Specialist
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-400">
                    {formatDate(designer.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Designer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add CAD Designer Account"
        description="Provision an internal designer account for case routing and STL uploads."
      >
        <form onSubmit={handleCreateDesigner} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Input
            label="Designer Full Name"
            placeholder="Elena Rostova"
            required
            value={newDesigner.name}
            onChange={(e) =>
              setNewDesigner({ ...newDesigner, name: e.target.value })
            }
          />

          <Input
            label="Internal Email Address"
            type="email"
            placeholder="elena.rostova@nexusdental.com"
            required
            value={newDesigner.email}
            onChange={(e) =>
              setNewDesigner({ ...newDesigner, email: e.target.value })
            }
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="951-334-8942"
            value={newDesigner.phone_number}
            onChange={(e) =>
              setNewDesigner({ ...newDesigner, phone_number: e.target.value })
            }
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              Create Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
