"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderKanban, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { PortalHeader } from "@/components/portal/header";
import { CaseTable } from "@/components/portal/case-table";
import { fetchCases } from "@/lib/services/cases";
import type { Case } from "@/lib/types";

export default function DesignerAssignedCasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCases() {
      setIsLoading(true);
      try {
        const data = await fetchCases({ role: "designer", status: "assigned" });
        setCases(data);
      } catch (err) {
        console.error("Failed to load designer cases", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCases();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <PortalHeader
        title="Assigned CAD Cases"
        description="Cases assigned to your CAD bench. Download patient scans, design restorations, and submit finished files."
        actions={
          <Link href="/dashboard/designer/completed">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008F66] hover:text-[#00C48C] transition-colors">
              <span>View Completed Cases</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        }
      />

      {/* Metric Bar */}
      <div className="p-5 rounded-3xl border border-slate-200 bg-white shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F8F2] border border-[#B6EAD5] text-[#008F66] flex items-center justify-center">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-[#008F66]">
              Active In-Queue Workload
            </p>
            <p className="text-sm font-semibold text-slate-700">
              {cases.length} restorations currently in CAD modeling
            </p>
          </div>
        </div>
      </div>

      {/* Case Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900 tracking-tight">Active Queue</h2>
          <span className="text-xs text-slate-500 font-medium">{cases.length} Cases</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            Loading assigned CAD cases...
          </div>
        ) : (
          <CaseTable
            cases={cases}
            role="designer"
            baseDetailPath="/dashboard/designer/cases"
            emptyMessage="You have no active cases assigned right now. Great work keeping your queue clear!"
          />
        )}
      </div>
    </div>
  );
}
