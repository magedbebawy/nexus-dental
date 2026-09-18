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
  Download,
  File,
  ShieldCheck,
} from "lucide-react";
import { PortalHeader } from "@/components/portal/header";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileListView } from "@/components/portal/file-list-view";
import { FileDropzone, type SelectedFile } from "@/components/ui/file-dropzone";
import { fetchCaseById, markCaseAsDone } from "@/lib/services/cases";
import { fetchFilesByCaseId, uploadCaseFile } from "@/lib/services/files";
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
            uploadedBy: "d2222222-2222-2222-2222-222222222222",
            category: "designer_file",
          });
        }
      }

      setStatusMessage("Marking case status as Done...");
      const success = await markCaseAsDone(currentCase.id);

      if (!success) {
        throw new Error("Failed to update case status.");
      }

      setStatusMessage("Case successfully completed!");
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
      <div className="p-16 text-center text-slate-400 text-sm">
        Loading case workbench...
      </div>
    );
  }

  if (!currentCase) {
    return (
      <div className="p-16 text-center space-y-3">
        <p className="text-white font-semibold">Case not found</p>
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
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
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
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Queue</span>
              </Button>
            </Link>
          </div>
        }
      />

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Case Prescription Details */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Prescription & Instructions
          </h3>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-500 font-medium">Service Indication:</span>
            <p className="text-sm font-semibold text-white mt-0.5">{currentCase.service}</p>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Patient Ref:</span>
            <p className="text-sm font-semibold text-white mt-0.5">
              {currentCase.patient_reference}
            </p>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Due Date:</span>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-white mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>{formatDate(currentCase.due_date)}</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800/80">
          <span className="text-xs text-slate-500 font-medium">Doctor Rx Instructions:</span>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed whitespace-pre-wrap bg-[#080d1a] p-3.5 rounded-xl border border-slate-800">
            {currentCase.instructions || "No custom instructions specified."}
          </p>
        </div>
      </div>

      {/* Files Display: Customer Scans & Any Already Uploaded Designs */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
          Customer Scans & Deliverables
        </h3>
        <FileListView files={files} />
      </div>

      {/* Designer Completed Files Upload & Mark as Done Area */}
      {!isAlreadyDone ? (
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-cyan-500/30 bg-gradient-to-b from-[#091224] to-[#080e1d] space-y-6 shadow-2xl">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>Submit Completed CAD Files & Finalize</span>
            </h3>
            <p className="text-xs text-slate-400">
              Upload your validated finished STL/OBJ models, drill guides, or production reports. Once verified, click Mark as Done to notify the clinician.
            </p>
          </div>

          <FileDropzone
            onFilesSelected={setSelectedCompletedFiles}
            selectedFiles={selectedCompletedFiles}
            label="Upload Finished CAD Designs (STL, OBJ, PDF)"
            category="designer_file"
          />

          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              {isSubmitting && (
                <span className="text-cyan-400 font-medium animate-pulse">
                  {statusMessage}
                </span>
              )}
            </div>

            <Button
              size="lg"
              variant="teal"
              className="w-full sm:w-auto gap-2"
              onClick={handleMarkAsDone}
              isLoading={isSubmitting}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark as Done (Status: Done)</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 flex items-center gap-4">
          <CheckCircle2 className="w-8 h-8 shrink-0" />
          <div>
            <h4 className="text-sm font-bold">Case Completed & Verified</h4>
            <p className="text-xs text-slate-400">
              Completed on {formatDateTime(currentCase.completed_at)}. The ordering doctor has immediate access to download all deliverable files.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
