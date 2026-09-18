"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, FolderKanban, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PortalHeader } from "@/components/portal/header";
import { CaseTable } from "@/components/portal/case-table";
import { fetchCases } from "@/lib/services/cases";
import type { Case } from "@/lib/types";

export default function CustomerCasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCases() {
      setIsLoading(true);
      try {
        const data = await fetchCases({ role: "customer" });
        setCases(data);
      } catch (err) {
        console.error("Failed to load customer cases", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCases();
  }, []);

  const uploadedCount = cases.filter((c) => c.status === "uploaded").length;
  const assignedCount = cases.filter((c) => c.status === "assigned").length;
  const doneCount = cases.filter((c) => c.status === "done").length;

  return (
    <div className="space-y-6">
      <PortalHeader
        title="My Cases"
        description="Track active restorations, monitor CAD progression, and download completed STL files."
        actions={
          <Link href="/dashboard/customer/new">
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              <span>Submit New Case</span>
            </Button>
          </Link>
        }
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-[#090e1c]/70 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Uploaded / Pending
            </p>
            <p className="text-2xl font-bold text-white mt-1">{uploadedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-[#090e1c]/70 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              In CAD Design
            </p>
            <p className="text-2xl font-bold text-white mt-1">{assignedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
            <FolderKanban className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-[#090e1c]/70 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Completed / Ready
            </p>
            <p className="text-2xl font-bold text-white mt-1">{doneCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">All Practice Cases</h2>
          <span className="text-xs text-slate-400">{cases.length} Total</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Loading cases...
          </div>
        ) : (
          <CaseTable
            cases={cases}
            role="customer"
            baseDetailPath="/dashboard/customer/cases"
            emptyMessage="No digital cases have been uploaded yet."
          />
        )}
      </div>
    </div>
  );
}
