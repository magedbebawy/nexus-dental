"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Sparkles, CheckCircle2, ShieldCheck, Check } from "lucide-react";
import { PortalHeader } from "@/components/portal/header";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileListView } from "@/components/portal/file-list-view";
import { fetchCaseById, updateCaseUnitsAndPrice } from "@/lib/services/cases";
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
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyUnits, setVerifyUnits] = useState<number>(1);
  const [verifyPrice, setVerifyPrice] = useState<number>(6);
  const [verifySuccess, setVerifySuccess] = useState(false);

  useEffect(() => {
    async function loadCaseData() {
      setIsLoading(true);
      try {
        const [cData, fData] = await Promise.all([
          fetchCaseById(id),
          fetchFilesByCaseId(id),
        ]);
        setTargetCase(cData);
        if (cData) {
          setVerifyUnits(cData.units || 1);
          setVerifyPrice(cData.unit_price || 6);
        }
        setFiles(fData);
      } catch (err) {
        console.error("Failed to load admin case details", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadCaseData();
  }, [id]);

  const handleVerifyUnits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCase) return;
    setIsVerifying(true);
    setVerifySuccess(false);

    try {
      await updateCaseUnitsAndPrice(targetCase.id, verifyUnits, verifyPrice);
      setTargetCase((prev) =>
        prev
          ? {
              ...prev,
              units: verifyUnits,
              unit_price: verifyPrice,
              total_price: verifyUnits * verifyPrice,
              admin_verified: true,
            }
          : prev
      );
      setVerifySuccess(true);
      setTimeout(() => setVerifySuccess(false), 3000);
    } catch (err) {
      console.error("Failed to verify units", err);
    } finally {
      setIsVerifying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-400 text-sm">
        Loading case management details...
      </div>
    );
  }

  if (!targetCase) {
    return (
      <div className="py-16 text-center space-y-4 rounded-3xl border border-slate-200 bg-white shadow-xs max-w-xl mx-auto my-8">
        <h3 className="text-lg font-black text-slate-900">Case Not Found</h3>
        <p className="text-xs text-slate-500 font-medium">
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
              <span className="text-slate-500 font-medium">Lab Billed Fee:</span>
              <p className="text-sm font-black text-[#008F66] mt-0.5">
                ${(targetCase.total_price || (targetCase.units || 1) * (targetCase.unit_price || 6)).toFixed(2)} (${targetCase.unit_price || 6}/unit)
              </p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Patient Reference:</span>
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
              <span className="text-slate-500 font-medium">Status:</span>
              <div className="mt-1">
                <StatusBadge status={targetCase.status} />
              </div>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Lab Verification:</span>
              <div className="mt-1">
                {targetCase.admin_verified ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#E8F8F2] text-[#008F66] border border-[#B6EAD5]">
                    <CheckCircle2 className="w-3 h-3 text-[#00C48C]" />
                    <span>Units Verified ({targetCase.units || 1})</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    <span>Pending Verification ({targetCase.units || 1} units)</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium">Doctor Instructions:</span>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed whitespace-pre-wrap bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              {targetCase.instructions || "No special instructions provided."}
            </p>
          </div>

          {/* Admin Unit Verification & Fee Adjustment Widget */}
          <div className="pt-4 border-t border-slate-200">
            <form onSubmit={handleVerifyUnits} className="p-5 rounded-2xl bg-[#F0FAF5] border border-[#B6EAD5] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#00C48C]" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Lab Audit: Verify Unit Count &amp; Rate
                  </span>
                </div>
                {verifySuccess && (
                  <span className="text-xs text-[#008F66] font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved &amp; Verified!</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Verified Units
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={32}
                    value={verifyUnits}
                    onChange={(e) => setVerifyUnits(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#00C48C]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Unit Rate ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.5"
                    value={verifyPrice}
                    onChange={(e) => setVerifyPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#00C48C]"
                    required
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="submit"
                    size="sm"
                    className="w-full text-xs gap-1.5 font-black"
                    isLoading={isVerifying}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm &amp; Update Fee</span>
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Stakeholder Details (Customer & Designer) */}
        <div className="space-y-4">
          {/* Customer Card */}
          <div className="rounded-3xl p-6 border border-slate-200 bg-white space-y-2 shadow-xs">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
              Doctor / Customer
            </span>
            <p className="text-base font-black text-slate-900">{targetCase.customer?.name || "Customer"}</p>
            <p className="text-xs text-slate-600 font-medium">{targetCase.customer?.email || "No email"}</p>
            {targetCase.customer?.phone_number && (
              <p className="text-xs text-slate-500">{targetCase.customer.phone_number}</p>
            )}
          </div>

          {/* Designer Assignment Card */}
          <div className="rounded-3xl p-6 border border-slate-200 bg-white space-y-2 shadow-xs">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
              Assigned Designer
            </span>
            {targetCase.designer ? (
              <div className="space-y-1">
                <p className="text-base font-black text-slate-900">{targetCase.designer.name}</p>
                <p className="text-xs text-[#008F66] font-bold">{targetCase.designer.email}</p>
              </div>
            ) : (
              <p className="text-xs text-amber-600 font-bold italic">Unassigned (Action required)</p>
            )}
          </div>
        </div>
      </div>

      {/* Case Files: Customer Scans and Designer Deliverables */}
      <div className="rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white space-y-6 shadow-xs">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
          Case Assets &amp; 3D Deliverables
        </h3>
        <FileListView files={files} />
      </div>
    </div>
  );
}
