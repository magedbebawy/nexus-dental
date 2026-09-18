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
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors">
              <span>View Completed Cases</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        }
      />

      {/* Metric Bar */}
      <div className="p-4 rounded-xl border border-sky-500/20 bg-sky-950/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Active In-Queue Workload
            </p>
            <p className="text-sm text-slate-300">
              {cases.length} restorations currently in CAD modeling
            </p>
          </div>
        </div>
      </div>

      {/* Case Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Active Queue</h2>
          <span className="text-xs text-slate-400">{cases.length} Cases</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
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
