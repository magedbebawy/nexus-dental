"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { PortalHeader } from "@/components/portal/header";
import { FileDropzone, type SelectedFile } from "@/components/ui/file-dropzone";
import { DENTAL_SERVICES } from "@/lib/constants/dental";
import { newCaseSchema, type NewCaseFormData } from "@/lib/validation/schemas";
import { createNewCase } from "@/lib/services/cases";
import { uploadCaseFile } from "@/lib/services/files";
import { createClient } from "@/lib/supabase/client";

export default function NewCasePage() {
  const router = useRouter();

  const [formData, setFormData] = useState<NewCaseFormData>(() => {
    const defaultDueDate = new Date(Date.now() + 86400000 * 2)
      .toISOString()
      .split("T")[0];
    return {
      service: DENTAL_SERVICES[0].name,
      patient_reference: "",
      due_date: defaultDueDate,
      instructions: "",
    };
  });

  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setErrors({});

    // Validate form fields
    const result = newCaseSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err: any) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    if (selectedFiles.length === 0) {
      setServerError(
        "Please upload at least one 3D scan or case file before submitting.",
      );
      return;
    }

    setIsSubmitting(true);
    setUploadProgressText("Creating case record...");

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const customerId = user?.id;

      if (!customerId) {
        setServerError("You must be logged in to submit a case.");
        setIsSubmitting(false);
        router.push("/login");
        return;
      }

      // 1. Create case in database
      const createdCase = await createNewCase({
        customer_id: customerId,
        service: formData.service,
        patient_reference: formData.patient_reference,
        due_date: formData.due_date,
        instructions: formData.instructions,
      });

      // 2. Upload each file to Supabase Storage / case_files
      for (let i = 0; i < selectedFiles.length; i++) {
        const item = selectedFiles[i];
        setUploadProgressText(
          `Uploading file ${i + 1} of ${selectedFiles.length} (${item.name})...`,
        );

        await uploadCaseFile({
          file: item.file,
          caseId: createdCase.id,
          uploadedBy: customerId,
          category: "customer_file",
        });
      }

      setUploadProgressText("Case created successfully! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard/customer");
      }, 1000);
    } catch (err: any) {
      console.error("Submission failed", err);
      setServerError(
        err.message ||
          "Failed to submit case. Please verify connection and retry.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <PortalHeader
        title="Submit New Digital Case"
        description="Transmit intraoral scanner files, select restorative indication, and set delivery timeline."
        breadcrumbs={[
          { label: "My Cases", href: "/dashboard/customer" },
          { label: "New Case" },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {serverError && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Prescription Metadata Card */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6 border border-slate-800">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Case Prescription Details
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <Select
              label="Dental Service"
              value={formData.service}
              error={errors.service}
              onChange={(e) =>
                setFormData({ ...formData, service: e.target.value })
              }
              required
            >
              {DENTAL_SERVICES.map((srv) => (
                <option
                  key={srv.id}
                  value={srv.name}
                  className="bg-[#0b1329] text-white"
                >
                  {srv.name} (Turnaround: {srv.turnaround})
                </option>
              ))}
            </Select>

            <Input
              label="Patient / Case Reference"
              placeholder="e.g. PT-SMITH-104 or Tooth #19"
              required
              value={formData.patient_reference}
              error={errors.patient_reference}
              onChange={(e) =>
                setFormData({ ...formData, patient_reference: e.target.value })
              }
              helperText="Internal clinical identifier for patient privacy."
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <Input
              label="Required Due Date"
              type="date"
              required
              value={formData.due_date}
              error={errors.due_date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) =>
                setFormData({ ...formData, due_date: e.target.value })
              }
            />

            <div className="flex items-center p-3 rounded-lg bg-slate-900/50 border border-slate-800 text-xs text-slate-400 self-end">
              <span>
                Standard delivery automatically validates CAD clearance 24h
                before seating.
              </span>
            </div>
          </div>

          <Textarea
            label="Clinical Instructions & Prescription Notes"
            rows={4}
            placeholder="Specify shade, occlusal clearance preference, contact tightness, margin depth, or implant platform details..."
            value={formData.instructions}
            error={errors.instructions}
            onChange={(e) =>
              setFormData({ ...formData, instructions: e.target.value })
            }
          />
        </div>

        {/* File Dropzone Card */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6 border border-slate-800">
          <FileDropzone
            onFilesSelected={setSelectedFiles}
            selectedFiles={selectedFiles}
            label="Dental Scanner & Diagnostic Files"
          />
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <Link href="/dashboard/customer">
            <Button type="button" variant="ghost" className="gap-2 text-xs">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Cancel & Return</span>
            </Button>
          </Link>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isSubmitting && (
              <span className="text-xs text-cyan-400 animate-pulse">
                {uploadProgressText}
              </span>
            )}
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto gap-2 text-sm"
              isLoading={isSubmitting}
            >
              <Upload className="w-4 h-4" />
              <span>Submit Case (Status: Uploaded)</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
