"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Upload,
  Clock,
  RotateCcw,
} from "lucide-react";
import { PortalHeader } from "@/components/portal/header";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileListView } from "@/components/portal/file-list-view";
import { FileDropzone, type SelectedFile } from "@/components/ui/file-dropzone";
import { fetchCaseById, markCaseAsDone, reopenCase } from "@/lib/services/cases";
import { fetchFilesByCaseId, uploadCaseFile } from "@/lib/services/files";
import { notifyCustomerDesignUploaded } from "@/lib/actions/email";
import { createClient } from "@/lib/supabase/client";
import { formatDate, formatDateTime } from "@/lib/utils";
import type { Case, CaseFile } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DesignerCaseDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const caseId = resolvedParams.id;
  const router = useRouter();

  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [files, setFiles] = useState<CaseFile[]>([]);
  const [selectedCompletedFiles, setSelectedCompletedFiles] = useState<SelectedFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReopening, setIsReopening] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadCaseData = async () => {
    setIsLoading(true);
    try {
      const [cData, fData] = await Promise.all([
        fetchCaseById(caseId),
        fetchFilesByCaseId(caseId),
      ]);
      setCurrentCase(cData);
      setFiles(fData);
    } catch (err) {
      console.error("Failed to load case data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCaseData();
  }, [caseId]);

  const designerFiles = files.filter((f) => f.file_category === "designer_file");

  const handleReopenCase = async () => {
    if (!currentCase) return;
    setIsReopening(true);
    setError(null);
    try {
      const success = await reopenCase(currentCase.id);
      if (!success) {
        throw new Error("Failed to reopen case.");
      }
      await loadCaseData();
    } catch (err: any) {
      console.error("Failed to reopen case", err);
      setError(err.message || "Failed to reopen case. Please try again.");
    } finally {
      setIsReopening(false);
    }
  };

  const handleMarkAsDone = async () => {
    if (!currentCase) return;
    setError(null);

    // Rule: Must have completed design files uploaded (either already in DB or currently staged)
    if (designerFiles.length === 0 && selectedCompletedFiles.length === 0) {
      setError(
        "You must upload at least one finished CAD design file (e.g. print-ready STL) before marking the case as Done."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const designerUserId = user?.id || "d2222222-2222-2222-2222-222222222222";

      // If there are staged files to upload, upload them first
      if (selectedCompletedFiles.length > 0) {
        for (let i = 0; i < selectedCompletedFiles.length; i++) {
          const item = selectedCompletedFiles[i];
          setStatusMessage(
            `Uploading deliverable ${i + 1} of ${selectedCompletedFiles.length} (${item.name})...`
          );

          await uploadCaseFile({
            file: item.file,
            caseId: currentCase.id,
            uploadedBy: designerUserId,
            category: "designer_file",
          });
        }
      }

      setStatusMessage("Finalizing case as Done...");
      const success = await markCaseAsDone(currentCase.id);

      if (!success) {
        throw new Error("Failed to update case status.");
      }

      // Notify customer that their CAD design is ready for download
      try {
        await notifyCustomerDesignUploaded({ caseId: currentCase.id });
      } catch (notifyErr) {
        console.warn("Notice to customer failed:", notifyErr);
      }

      setStatusMessage("Case successfully finalized!");
      await loadCaseData();
      setSelectedCompletedFiles([]);
    } catch (err: any) {
      console.error("Failed to complete case", err);
      setError(err.message || "Failed to finalize case. Please try again.");
    } finally {
      setIsSubmitting(false);
      setStatusMessage("");
    }
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center text-slate-500 text-sm font-medium">
        Loading case workbench...
      </div>
    );
  }

  if (!currentCase) {
    return (
      <div className="p-16 text-center space-y-3">
        <p className="text-slate-900 font-bold">Case not found</p>
        <Link href="/dashboard/designer">
          <Button variant="outline" size="sm">
            Return to Active Queue
          </Button>
        </Link>
      </div>
    );
  }

  const isAlreadyDone = currentCase.status === "done";

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <PortalHeader
        title={`CAD Bench: Case ${currentCase.case_number}`}
        description={`${currentCase.service} • Patient: ${currentCase.patient_reference}`}
        breadcrumbs={[
          { label: "Assigned Cases", href: "/dashboard/designer" },
          { label: currentCase.case_number },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge status={currentCase.status} />
            <Link href="/dashboard/designer">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Queue</span>
              </Button>
            </Link>
          </div>
        }
      />

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Case Prescription Details (Strictly Anonymized) */}
      <div className="rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white space-y-4 shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
          <Sparkles className="w-4 h-4 text-[#00C48C]" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
            Prescription &amp; Instructions
          </h3>
        </div>

        <div className="grid sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 font-medium">Service Indication:</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{currentCase.service}</p>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Units:</span>
            <p className="text-sm font-black text-[#008F66] mt-0.5">
              {currentCase.units || 1} unit{(currentCase.units || 1) > 1 ? "s" : ""}
            </p>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Patient Ref:</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              {currentCase.patient_reference}
            </p>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Due Date:</span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-[#00C48C]" />
              <span>{formatDate(currentCase.due_date)}</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-medium">Doctor Rx Instructions:</span>
          <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed whitespace-pre-wrap bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            {currentCase.instructions || "No custom instructions specified."}
          </p>
        </div>
      </div>

      {/* Files Display: Doctor Scans & Any Already Uploaded Designs (Strictly Anonymized) */}
      <div className="rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white space-y-6 shadow-xs">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
          Clinical Scans &amp; CAD Deliverables
        </h3>
        <FileListView files={files} />
      </div>

      {/* Designer Completed Files Upload & Mark as Done Area */}
      {!isAlreadyDone ? (
        <div className="rounded-3xl p-6 sm:p-8 border-2 border-[#00C48C] bg-[#F0FAF5] space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#C8EEDD]">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#008F66]" />
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Upload CAD Deliverables &amp; Mark Case Done
              </h3>
            </div>
            <span className="text-xs text-[#008F66] font-bold">
              Finalizes Case &bull; Notifies Doctor
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Attach the finished STL design files, print-ready drill guides, or CAD restorations.
            Once confirmed, the case will automatically be finalized as <strong>Done</strong> and
            available to the doctor.
          </p>

          <FileDropzone
            onFilesSelected={setSelectedCompletedFiles}
            selectedFiles={selectedCompletedFiles}
            label="Finished CAD Design Deliverables (STL, OBJ, Guides)"
            category="designer_file"
          />

          <div className="flex items-center justify-between pt-4 border-t border-[#C8EEDD]">
            {statusMessage ? (
              <span className="text-xs text-[#008F66] font-bold animate-pulse">
                {statusMessage}
              </span>
            ) : (
              <span className="text-xs text-slate-500 font-medium">
                {selectedCompletedFiles.length} file(s) staged for delivery
              </span>
            )}

            <Button
              type="button"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              onClick={handleMarkAsDone}
              className="gap-2 font-black shadow-md shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Upload &amp; Finalize Case as Done</span>
            </Button>
          </div>
        </div>
      ) : (
        /* Completed Notice with Reopen Action */
        <div className="rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F8F2] text-[#008F66] flex items-center justify-center shrink-0 border border-[#B6EAD5]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">
                Restoration Design Completed &amp; Finalized
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                The doctor has been notified and can download the CAD deliverables.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            isLoading={isReopening}
            onClick={handleReopenCase}
            className="gap-2 text-xs font-bold"
            title="Reopen case to upload revisions or modified STL designs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reopen Case for Adjustments</span>
          </Button>
        </div>
      )}
    </div>
  );
}
