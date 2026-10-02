"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Sparkles,
  CheckCircle2,
  FileCheck,
  Clock,
  Download,
  ShieldCheck,
  ArrowDown,
} from "lucide-react";
import { PortalHeader } from "@/components/portal/header";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileListView } from "@/components/portal/file-list-view";
import { fetchCaseById } from "@/lib/services/cases";
import { fetchFilesByCaseId } from "@/lib/services/files";
import { formatDate, formatDateTime } from "@/lib/utils";
import type { Case, CaseFile } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CustomerCaseDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const caseId = resolvedParams.id;

  const [targetCase, setTargetCase] = useState<Case | null>(null);
  const [files, setFiles] = useState<CaseFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [cData, fData] = await Promise.all([
          fetchCaseById(caseId),
          fetchFilesByCaseId(caseId),
        ]);
        setTargetCase(cData);
        setFiles(fData);
      } catch (err) {
        console.error("Failed to load case", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [caseId]);

  if (isLoading) {
    return (
      <div className="p-16 text-center text-slate-500 text-sm font-medium">
        Loading case details...
      </div>
    );
  }

  if (!targetCase) {
    return (
      <div className="p-16 text-center space-y-3">
        <p className="text-slate-900 font-bold">Case not found</p>
        <Link href="/dashboard/customer">
          <Button variant="outline" size="sm">
            Return to Cases
          </Button>
        </Link>
      </div>
    );
  }

  const isCompleted = targetCase.status === "done";
  const designerFiles = files.filter((f) => f.file_category === "designer_file");

  const scrollToFiles = () => {
    const el = document.getElementById("case-files-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <PortalHeader
        title={`Case ${targetCase.case_number}`}
        description={`Patient Reference: ${targetCase.patient_reference} • ${targetCase.service}`}
        breadcrumbs={[
          { label: "My Cases", href: "/dashboard/customer" },
          { label: targetCase.case_number },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge status={targetCase.status} />
            <Link href="/dashboard/customer">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Cases</span>
              </Button>
            </Link>
          </div>
        }
      />

      {/* Prominent Deliverable Download Banner (When Done) */}
      {isCompleted && (
        <div className="rounded-3xl p-6 sm:p-8 border-2 border-[#00C48C] bg-[#F0FAF5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#E8F8F2] text-[#008F66] shrink-0 border border-[#B6EAD5]">
              <ShieldCheck className="w-6 h-6 text-[#00C48C]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#008F66]">
                  CAD Deliverables Ready
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#E8F8F2] text-[#008F66] border border-[#B6EAD5]">
                  50-Micron Validated
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                Your print-ready dental restoration design is complete.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                {designerFiles.length > 0
                  ? `${designerFiles.length} deliverable file(s) available for immediate download.`
                  : "Validated STL files are ready below for chairside fabrication."}
              </p>
            </div>
          </div>

          <Button
            size="md"
            onClick={scrollToFiles}
            className="gap-2 text-xs font-black shadow-md shadow-emerald-500/20 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download CAD Deliverables</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {/* Grid: Details & Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Prescription Summary */}
        <div className="md:col-span-2 rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white space-y-4 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <Sparkles className="w-4 h-4 text-[#00C48C]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Clinical Prescription
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 font-medium">Restorative Indication:</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{targetCase.service}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Prescribed Units:</span>
              <p className="text-sm font-black text-slate-900 mt-0.5">
                {targetCase.units || 1} unit{(targetCase.units || 1) > 1 ? "s" : ""}
              </p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Patient / Case Reference:</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {targetCase.patient_reference}
              </p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Target Due Date:</span>
              <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-[#00C48C]" />
                <span>{formatDate(targetCase.due_date)}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Created On:</span>
              <p className="text-sm font-bold text-slate-700 mt-0.5">
                {formatDateTime(targetCase.created_at)}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium">Clinical Instructions:</span>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed whitespace-pre-wrap bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              {targetCase.instructions || "No special instructions provided."}
            </p>
          </div>
        </div>

        {/* Status / CAD Milestone Timeline */}
        <div className="rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white space-y-4 shadow-xs">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 pb-3 border-b border-slate-200">
            Lab Progression
          </h3>

          <div className="space-y-4 text-xs font-medium">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#E8F8F2] text-[#008F66] flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Case Submitted</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Intraoral scans received</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  targetCase.status === "assigned" || isCompleted
                    ? "bg-[#E8F8F2] text-[#008F66]"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {targetCase.status === "assigned" || isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Clock className="w-3.5 h-3.5" />
                )}
              </div>
              <div>
                <p
                  className={`font-bold ${
                    targetCase.status === "assigned" || isCompleted
                      ? "text-slate-900"
                      : "text-slate-400"
                  }`}
                >
                  CAD Engineering
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Calibrated to 50-micron tolerance
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  isCompleted
                    ? "bg-[#E8F8F2] text-[#008F66]"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <FileCheck className="w-3.5 h-3.5" />
                )}
              </div>
              <div>
                <p className={`font-bold ${isCompleted ? "text-slate-900" : "text-slate-400"}`}>
                  Validated &amp; Ready
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Finished STL ready for download
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Files Section (Scans + CAD Deliverables) */}
      <div
        id="case-files-section"
        className="rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white space-y-6 shadow-xs"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-base font-black text-slate-900">
              Scans &amp; Completed Deliverables
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Download your validated 3D CAD deliverable files (e.g. print-ready STL)
            </p>
          </div>
        </div>
        <FileListView files={files} />
      </div>
    </div>
  );
}
