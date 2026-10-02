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

      {/* Metric Cards - Mint Mobile Clean Light Style */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-amber-600">
              Uploaded / Pending
            </p>
            <p className="text-3xl font-black text-slate-900 mt-1">{uploadedCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-sky-600">
              In CAD Design
            </p>
            <p className="text-3xl font-black text-slate-900 mt-1">{assignedCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200/60 flex items-center justify-center">
            <FolderKanban className="w-5 h-5" />
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-[#008F66]">
              Completed / Ready
            </p>
            <p className="text-3xl font-black text-slate-900 mt-1">{doneCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#E8F8F2] text-[#008F66] border border-[#B6EAD5] flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900">All Practice Cases</h2>
          <span className="text-xs font-semibold text-slate-500">{cases.length} Total</span>
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
