"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Sparkles } from "lucide-react";
import { PortalHeader } from "@/components/portal/header";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileListView } from "@/components/portal/file-list-view";
import { fetchCaseById } from "@/lib/services/cases";
import { fetchFilesByCaseId } from "@/lib/services/files";
import { formatDate } from "@/lib/utils";
import type { Case, CaseFile } from "@/lib/types";

interface AdminCaseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function AdminCaseDetailPage({ params }: AdminCaseDetailPageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [targetCase, setTargetCase] = useState<Case | null>(null);
  const [files, setFiles] = useState<CaseFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCaseData() {
      setIsLoading(true);
      try {
        const [cData, fData] = await Promise.all([
          fetchCaseById(id),
          fetchFilesByCaseId(id),
        ]);
        setTargetCase(cData);
        setFiles(fData);
      } catch (err) {
        console.error("Failed to load admin case details", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadCaseData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-400 text-sm">
        Loading case management details...
      </div>
    );
  }

  if (!targetCase) {
    return (
      <div className="py-16 text-center space-y-4 glass-panel rounded-2xl border border-slate-800 max-w-xl mx-auto my-8">
        <h3 className="text-lg font-bold text-white">Case Not Found</h3>
        <p className="text-xs text-slate-400">
          The requested case could not be located in lab records.
        </p>
        <Link href="/dashboard/admin/cases">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to All Cases</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PortalHeader
        title={`Case Management: ${targetCase.case_number}`}
        description={`${targetCase.service} • Ref: ${targetCase.patient_reference}`}
        breadcrumbs={[
          { label: "All Cases", href: "/dashboard/admin/cases" },
          { label: targetCase.case_number },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge status={targetCase.status} />
            <Link href="/dashboard/admin/cases">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to List</span>
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Case Info */}
        <div className="md:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Clinical Prescription
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 font-medium">Restorative Indication:</span>
              <p className="text-sm font-semibold text-white mt-0.5">{targetCase.service}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Patient Reference:</span>
              <p className="text-sm font-semibold text-white mt-0.5">
                {targetCase.patient_reference}
              </p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Target Due Date:</span>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-white mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>{formatDate(targetCase.due_date)}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Status:</span>
              <div className="mt-1">
                <StatusBadge status={targetCase.status} />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            <span className="text-xs text-slate-500 font-medium">Doctor Instructions:</span>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed whitespace-pre-wrap bg-[#080d1a] p-3 rounded-xl border border-slate-800">
              {targetCase.instructions || "No special instructions provided."}
            </p>
          </div>
        </div>

        {/* Stakeholder Details (Customer & Designer) */}
        <div className="space-y-4">
          {/* Customer Card */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Doctor / Customer
            </span>
            <p className="text-sm font-bold text-white">{targetCase.customer?.name || "Customer"}</p>
            <p className="text-xs text-slate-300">{targetCase.customer?.email || "No email"}</p>
            {targetCase.customer?.phone_number && (
              <p className="text-xs text-slate-400">{targetCase.customer.phone_number}</p>
            )}
          </div>

          {/* Designer Assignment Card */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Assigned Designer
            </span>
            {targetCase.designer ? (
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">{targetCase.designer.name}</p>
                <p className="text-xs text-cyan-400">{targetCase.designer.email}</p>
              </div>
            ) : (
              <p className="text-xs text-amber-400/80 italic">Unassigned (Action required)</p>
            )}
          </div>
        </div>
      </div>

      {/* Case Files: Customer Scans and Designer Deliverables */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
          Case Assets & 3D Deliverables
        </h3>
        <FileListView files={files} />
      </div>
    </div>
  );
}
