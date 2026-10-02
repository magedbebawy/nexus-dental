"use client";

import { useEffect, useState } from "react";
import { PortalHeader } from "@/components/portal/header";
import { CaseTable } from "@/components/portal/case-table";
import { AssignModal } from "@/components/portal/assign-modal";
import { fetchCases } from "@/lib/services/cases";
import { fetchProfilesByRole } from "@/lib/services/users";
import type { Case, CaseStatus, Profile } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function AdminAllCasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [designers, setDesigners] = useState<Profile[]>([]);
  const [statusFilter, setStatusFilter] = useState<CaseStatus | "all">("all");
  const [selectedCaseForAssign, setSelectedCaseForAssign] = useState<Case | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadCases = async () => {
    setIsLoading(true);
    try {
      const [casesData, designersData] = await Promise.all([
        fetchCases({ role: "admin", status: statusFilter }),
        fetchProfilesByRole("designer"),
      ]);
      setCases(casesData);
      setDesigners(designersData);
    } catch (err) {
      console.error("Failed to load admin cases", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, [statusFilter]);

  const handleOpenAssign = (c: Case) => {
    setSelectedCaseForAssign(c);
    setIsAssignModalOpen(true);
  };

  const filterTabs: { label: string; value: CaseStatus | "all" }[] = [
    { label: "All Cases", value: "all" },
    { label: "Uploaded", value: "uploaded" },
    { label: "Assigned", value: "assigned" },
    { label: "Done", value: "done" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <PortalHeader
        title="All Cases"
        description="Comprehensive master log of all incoming dental restorations and digital CAD deliverables."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/admin" },
          { label: "All Cases" },
        ]}
      />

      {/* Filter Tabs - Mint Mobile Light Style */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-full bg-slate-100 border border-slate-200 w-fit">
        {filterTabs.map((tab) => {
          const isSelected = statusFilter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-black transition-all duration-150 cursor-pointer",
                isSelected
                  ? "bg-[#00C48C] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Case Table */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 text-sm">
          Loading cases...
        </div>
      ) : (
        <CaseTable
          cases={cases}
          role="admin"
          baseDetailPath="/dashboard/admin/cases"
          onAssignClick={handleOpenAssign}
          emptyMessage={`No cases currently match the filter: "${statusFilter}".`}
        />
      )}

      {/* Assignment Modal */}
      <AssignModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        targetCase={selectedCaseForAssign}
        designers={designers}
        onAssigned={loadCases}
      />
    </div>
  );
}
