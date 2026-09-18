"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Clock,
  CheckCircle2,
  Users,
  Palette,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { PortalHeader } from "@/components/portal/header";
import { CaseTable } from "@/components/portal/case-table";
import { AssignModal } from "@/components/portal/assign-modal";
import { Button } from "@/components/ui/button";
import { fetchCases } from "@/lib/services/cases";
import { fetchProfilesByRole } from "@/lib/services/users";
import type { Case, Profile } from "@/lib/types";

export default function AdminDashboardPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [designers, setDesigners] = useState<Profile[]>([]);
  const [selectedCaseForAssign, setSelectedCaseForAssign] = useState<Case | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [casesData, designersData] = await Promise.all([
        fetchCases({ role: "admin" }),
        fetchProfilesByRole("designer"),
      ]);
      setCases(casesData);
      setDesigners(designersData);
    } catch (err) {
      console.error("Failed to load admin dashboard", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const uploadedCases = cases.filter((c) => c.status === "uploaded");
  const assignedCases = cases.filter((c) => c.status === "assigned");
  const doneCases = cases.filter((c) => c.status === "done");

  const handleOpenAssign = (c: Case) => {
    setSelectedCaseForAssign(c);
    setIsAssignModalOpen(true);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <PortalHeader
        title="Lab Operations Dashboard"
        description="Monitor nationwide case intake, triage designer workloads, and maintain clinical QA."
        actions={
          <Link href="/dashboard/admin/cases">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <span>View All Cases</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-slate-800 bg-[#090e1c]/70 space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Pending Assignment
            </span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-3xl font-extrabold text-white">{uploadedCases.length}</p>
          <p className="text-[11px] text-slate-400">Requires CAD technician assignment</p>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-[#090e1c]/70 space-y-2">
          <div className="flex items-center justify-between text-sky-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              In CAD Design
            </span>
            <FolderKanban className="w-4 h-4" />
          </div>
          <p className="text-3xl font-extrabold text-white">{assignedCases.length}</p>
          <p className="text-[11px] text-slate-400">Assigned to active designers</p>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-[#090e1c]/70 space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Completed Cases
            </span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-3xl font-extrabold text-white">{doneCases.length}</p>
          <p className="text-[11px] text-slate-400">Validated and available to doctors</p>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-[#090e1c]/70 space-y-2">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Active Designers
            </span>
            <Palette className="w-4 h-4" />
          </div>
          <p className="text-3xl font-extrabold text-white">{designers.length}</p>
          <p className="text-[11px] text-slate-400">Available on CAD design roster</p>
        </div>
      </div>

      {/* Action Required: Uploaded Cases Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h2 className="text-base font-bold text-white">
              Cases Awaiting Assignment ({uploadedCases.length})
            </h2>
          </div>
          <span className="text-xs text-slate-400">Triage incoming doctor scans</span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading queue...</div>
        ) : (
          <CaseTable
            cases={uploadedCases}
            role="admin"
            baseDetailPath="/dashboard/admin/cases"
            onAssignClick={handleOpenAssign}
            emptyMessage="Great news! No cases are currently pending assignment."
          />
        )}
      </div>

      {/* Recent Lab Activity */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">All Active Restorations</h2>
          <Link
            href="/dashboard/admin/cases"
            className="text-xs font-semibold text-cyan-400 hover:underline"
          >
            View Full Log &rarr;
          </Link>
        </div>

        <CaseTable
          cases={cases.slice(0, 5)}
          role="admin"
          baseDetailPath="/dashboard/admin/cases"
          onAssignClick={handleOpenAssign}
        />
      </div>

      {/* Assignment Modal */}
      <AssignModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        targetCase={selectedCaseForAssign}
        designers={designers}
        onAssigned={loadData}
      />
    </div>
  );
}
