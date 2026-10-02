"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Upload, AlertCircle } from "lucide-react";
import { PortalHeader } from "@/components/portal/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileDropzone, type SelectedFile } from "@/components/ui/file-dropzone";
import { DENTAL_SERVICES, getServiceByName } from "@/lib/constants/dental";
import { newCaseSchema } from "@/lib/validation/schemas";
import { createNewCase } from "@/lib/services/cases";
import { uploadCaseFile } from "@/lib/services/files";
import { createClient } from "@/lib/supabase/client";

export default function NewCasePage() {
  const router = useRouter();

  const [formData, setFormData] = useState<{
    service: string;
    units: number;
    patient_reference: string;
    due_date: string;
    instructions: string;
  }>(() => {
    const defaultDueDate = new Date(Date.now() + 86400000 * 2)
      .toISOString()
      .split("T")[0];
    return {
      service: DENTAL_SERVICES[0].name as string,
      units: 1,
      patient_reference: "",
      due_date: defaultDueDate,
      instructions: "",
    };
  });

  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [uploadProgressText, setUploadProgressText] = useState("");
  const selectedServiceObj = getServiceByName(formData.service);
  const calculatedTotal = selectedServiceObj.unitPrice * Math.max(1, Number(formData.units) || 1);

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
      setServerError("Please attach at least one dental scan or prescription file.");
      return;
    }

    setIsSubmitting(true);

    try {
      setUploadProgressText("Authenticating customer session...");
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const customerUserId = user?.id || "u1111111-1111-1111-1111-111111111111";

      setUploadProgressText("Registering clinical case prescription in database...");

      // 1. Create the case record in Supabase
      const createdCase = await createNewCase({
        customer_id: customerUserId,
        service: formData.service,
        units: Number(formData.units) || 1,
        patient_reference: formData.patient_reference,
        due_date: formData.due_date,
        instructions: formData.instructions,
      });

      if (!createdCase) {
        throw new Error("Failed to create case in database. Please check your connection.");
      }

      // 2. Upload each selected file to Supabase Storage & record in case_files
      for (let i = 0; i < selectedFiles.length; i++) {
        const item = selectedFiles[i];
        setUploadProgressText(
          `Uploading file ${i + 1} of ${selectedFiles.length}: ${item.name}...`
        );

        await uploadCaseFile({
          file: item.file,
          caseId: createdCase.id,
          uploadedBy: customerUserId,
          category: "customer_file",
        });
      }

      setUploadProgressText("Finalizing case submission...");
      router.push(`/dashboard/customer/cases/${createdCase.id}`);
    } catch (err: any) {
      console.error("Submission failed", err);
      setServerError(
        err.message || "Failed to submit case. Please check your connection and try again."
      );
      setIsSubmitting(false);
      setUploadProgressText("");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <PortalHeader
        title="Submit New CAD Restoration"
        description="Prescribe indication parameters, specify unit count, and upload digital scans directly to our CAD engineering team."
        breadcrumbs={[
          { label: "My Cases", href: "/dashboard/customer" },
          { label: "New Case" },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {serverError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Prescription Metadata Card */}
        <div className="rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-200">
            <Sparkles className="w-4 h-4 text-[#00C48C]" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Case Prescription &amp; Indication
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <div className="sm:col-span-2">
              <Select
                label="Restorative Indication / Service"
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
                  >
                    {srv.name} ({srv.turnaround} turnaround)
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Input
                label="Number of Units"
                type="number"
                min={1}
                max={32}
                required
                value={formData.units}
                error={errors.units}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    units: Math.max(1, parseInt(e.target.value, 10) || 1),
                  })
                }
                helperText="e.g. 1 for crown, 3 for 3-unit bridge"
              />
            </div>
          </div>

          {/* Service Specifications Card (No Prices Shown To Customer) */}
          <div className="p-4 rounded-2xl bg-[#F0FAF5] border border-[#B6EAD5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#E8F8F2] text-[#008F66] flex items-center justify-center font-bold text-xs shrink-0">
                <Sparkles className="w-4 h-4 text-[#00C48C]" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {selectedServiceObj.name} • {formData.units} unit{formData.units > 1 ? "s" : ""}
                </p>
                <p className="text-[11px] text-slate-500">
                  Standard delivery turnaround: {selectedServiceObj.turnaround}
                </p>
              </div>
            </div>
            {selectedServiceObj.includesModel && (
              <span className="self-start sm:self-auto px-3 py-1 rounded-full text-[11px] font-black bg-[#E8F8F2] text-[#008F66] border border-[#B6EAD5]">
                Includes 3D Printable Model
              </span>
            )}
          </div>

          <div>
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

            <div className="flex items-center p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 self-end font-medium">
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
        <div className="rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-200 bg-white shadow-xs">
          <FileDropzone
            onFilesSelected={setSelectedFiles}
            selectedFiles={selectedFiles}
            label="Dental Scanner & Diagnostic Files"
          />
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <Link href="/dashboard/customer">
            <Button type="button" variant="ghost" className="gap-2 text-xs font-bold">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Cancel &amp; Return</span>
            </Button>
          </Link>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isSubmitting && (
              <span className="text-xs text-[#008F66] font-bold animate-pulse">
                {uploadProgressText}
              </span>
            )}
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto gap-2 text-sm font-black shadow-md shadow-emerald-500/20"
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
