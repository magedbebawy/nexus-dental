"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Clock,
  CheckCircle2,
  Users,
  Palette,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  Receipt,
} from "lucide-react";
import { PortalHeader } from "@/components/portal/header";
import { CaseTable } from "@/components/portal/case-table";
import { AssignModal } from "@/components/portal/assign-modal";
import { Button } from "@/components/ui/button";
import { fetchCases } from "@/lib/services/cases";
import { fetchProfilesByRole } from "@/lib/services/users";
import { fetchCustomerBalanceSummaries, type CustomerBalanceSummary } from "@/lib/services/invoices";
import type { Case, Profile } from "@/lib/types";

export default function AdminDashboardPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [designers, setDesigners] = useState<Profile[]>([]);
  const [balances, setBalances] = useState<CustomerBalanceSummary[]>([]);
  const [selectedCaseForAssign, setSelectedCaseForAssign] = useState<Case | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [casesData, designersData, balancesData] = await Promise.all([
        fetchCases({ role: "admin" }),
        fetchProfilesByRole("designer"),
        fetchCustomerBalanceSummaries(),
      ]);
      setCases(casesData);
      setDesigners(designersData);
      setBalances(balancesData);
    } catch (err) {
      console.error("Failed to load admin dashboard", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalOutstandingOwed = balances.reduce(
    (sum, b) => sum + (b.totalOutstandingOwed || 0),
    0
  );

  const uploadedCases = cases.filter((c) => c.status === "uploaded");
  const assignedCases = cases.filter((c) => c.status === "assigned");
  const doneCases = cases.filter((c) => c.status === "done");

  const handleOpenAssign = (c: Case) => {
    setSelectedCaseForAssign(c);
    setIsAssignModalOpen(true);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <PortalHeader
        title="Lab Operations Dashboard"
        description="Monitor nationwide case intake, triage designer workloads, and track accounts receivable."
        actions={
          <Link href="/dashboard/admin/cases">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <span>View All Cases</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        }
      />

      {/* Accounts Receivable & Billing Quick Banner */}
      <div className="rounded-3xl p-6 border-2 border-[#00C48C] bg-[#F0FAF5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F8F2] border border-[#B6EAD5] flex items-center justify-center text-[#008F66]">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#008F66]">
                Customer Balances Owed
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#E8F8F2] text-[#008F66] font-black border border-[#B6EAD5]">
                Accounts Receivable
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-4xl font-black text-slate-900">
                ${totalOutstandingOwed.toFixed(2)}
              </span>
              <span className="text-xs text-slate-600 font-medium">
                total outstanding across all customer accounts
              </span>
            </div>
          </div>
        </div>

        <Link href="/dashboard/admin/invoices">
          <Button
            size="sm"
            className="gap-2 text-xs font-black shadow-xs"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Manage Invoices &amp; Balances</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl border border-slate-200 bg-white space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-black uppercase tracking-wider">
              Pending Assignment
            </span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-3xl sm:text-4xl font-black text-slate-900">{uploadedCases.length}</p>
          <p className="text-xs text-slate-500 font-medium">Requires CAD technician assignment</p>
        </div>

        <div className="p-6 rounded-3xl border border-slate-200 bg-white space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-sky-600">
            <span className="text-xs font-black uppercase tracking-wider">
              In CAD Design
            </span>
            <FolderKanban className="w-4 h-4" />
          </div>
          <p className="text-3xl sm:text-4xl font-black text-slate-900">{assignedCases.length}</p>
          <p className="text-xs text-slate-500 font-medium">Assigned to active designers</p>
        </div>

        <div className="p-6 rounded-3xl border border-slate-200 bg-white space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[#008F66]">
            <span className="text-xs font-black uppercase tracking-wider">
              Completed Cases
            </span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-3xl sm:text-4xl font-black text-slate-900">{doneCases.length}</p>
          <p className="text-xs text-slate-500 font-medium">Validated and available to doctors</p>
        </div>

        <div className="p-6 rounded-3xl border border-slate-200 bg-white space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-purple-600">
            <span className="text-xs font-black uppercase tracking-wider">
              Active Designers
            </span>
            <Palette className="w-4 h-4" />
          </div>
          <p className="text-3xl sm:text-4xl font-black text-slate-900">{designers.length}</p>
          <p className="text-xs text-slate-500 font-medium">Available on CAD design roster</p>
        </div>
      </div>

      {/* Action Required: Uploaded Cases Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Cases Awaiting Assignment ({uploadedCases.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Triage incoming doctor scans</span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-slate-500 text-xs">Loading queue...</div>
        ) : (
          <CaseTable
            cases={uploadedCases}
            role="admin"
            baseDetailPath="/dashboard/admin/cases"
            onAssignClick={handleOpenAssign}
            emptyMessage="Great news! No cases are currently pending assignment."
          />
        )}
      </div>

      {/* Recent Lab Activity */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900 tracking-tight">All Active Restorations</h2>
          <Link
            href="/dashboard/admin/cases"
            className="text-xs font-bold text-[#008F66] hover:text-[#00C48C] transition-colors"
          >
            View Full Log &rarr;
          </Link>
        </div>

        <CaseTable
          cases={cases.slice(0, 5)}
          role="admin"
          baseDetailPath="/dashboard/admin/cases"
          onAssignClick={handleOpenAssign}
        />
      </div>

      {/* Assignment Modal */}
      <AssignModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        targetCase={selectedCaseForAssign}
        designers={designers}
        onAssigned={loadData}
      />
    </div>
  );
}
