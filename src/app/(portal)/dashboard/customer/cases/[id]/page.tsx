import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, FileText, User, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import { PortalHeader } from "@/components/portal/header";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileListView } from "@/components/portal/file-list-view";
import { fetchCaseById } from "@/lib/services/cases";
import { fetchFilesByCaseId } from "@/lib/services/files";
import { formatDate, formatDateTime } from "@/lib/utils";

interface CaseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerCaseDetailPage({ params }: CaseDetailPageProps) {
  const { id } = await params;
  const targetCase = await fetchCaseById(id);

  if (!targetCase) {
    notFound();
  }

  const files = await fetchFilesByCaseId(id);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PortalHeader
        title={`Case ${targetCase.case_number}`}
        description={`${targetCase.service} • Patient Ref: ${targetCase.patient_reference}`}
        breadcrumbs={[
          { label: "My Cases", href: "/dashboard/customer" },
          { label: targetCase.case_number },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge status={targetCase.status} />
            <Link href="/dashboard/customer">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Cases</span>
              </Button>
            </Link>
          </div>
        }
      />

      {/* Case Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Prescription Summary */}
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
              <span className="text-slate-500 font-medium">Patient / Case Reference:</span>
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
              <span className="text-slate-500 font-medium">Created On:</span>
              <p className="text-sm font-semibold text-slate-300 mt-0.5">
                {formatDateTime(targetCase.created_at)}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            <span className="text-xs text-slate-500 font-medium">Clinical Instructions:</span>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed whitespace-pre-wrap bg-[#080d1a] p-3 rounded-xl border border-slate-800">
              {targetCase.instructions || "No special instructions provided."}
            </p>
          </div>
        </div>

        {/* Status / CAD Milestone Timeline */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 pb-3 border-b border-slate-800">
            Lab Progression
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-semibold text-white">Case Uploaded</p>
                <p className="text-slate-400 text-[11px]">{formatDateTime(targetCase.created_at)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  targetCase.status === "assigned" || targetCase.status === "done"
                    ? "bg-sky-500/20 text-sky-400"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div>
                <p
                  className={`font-semibold ${
                    targetCase.status === "assigned" || targetCase.status === "done"
                      ? "text-white"
                      : "text-slate-500"
                  }`}
                >
                  CAD Designer Assigned
                </p>
                <p className="text-slate-400 text-[11px]">
                  {targetCase.designer ? targetCase.designer.name : "Pending Lab Assignment"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  targetCase.status === "done"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <p
                  className={`font-semibold ${
                    targetCase.status === "done" ? "text-white" : "text-slate-500"
                  }`}
                >
                  Completed & Verified
                </p>
                <p className="text-slate-400 text-[11px]">
                  {targetCase.completed_at
                    ? formatDateTime(targetCase.completed_at)
                    : "Awaiting CAD Completion"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Files List: Customer Scans & Completed Design Files */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
          Case Files & Deliverables
        </h3>
        <FileListView files={files} />
      </div>
    </div>
  );
}
