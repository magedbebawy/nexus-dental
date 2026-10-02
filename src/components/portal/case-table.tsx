"use client";

import Link from "next/link";
import { ArrowUpRight, Calendar, User, Eye } from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Case, UserRole } from "@/lib/types";

interface CaseTableProps {
  cases: Case[];
  role: UserRole;
  baseDetailPath: string; // e.g. "/dashboard/customer/cases" or "/dashboard/admin/cases"
  onAssignClick?: (c: Case) => void;
  emptyMessage?: string;
}

export function CaseTable({
  cases,
  role,
  baseDetailPath,
  onAssignClick,
  emptyMessage = "No cases found in this view.",
}: CaseTableProps) {
  if (cases.length === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
        <p className="text-sm font-semibold text-slate-500">{emptyMessage}</p>
        {role === "customer" && (
          <Link
            href="/dashboard/customer/new"
            className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-[#008F66] hover:text-[#00C48C]"
          >
            Create your first case &rarr;
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-5 py-4">Case #</th>
            <th className="px-4 py-4">Service</th>
            <th className="px-4 py-4">Patient / Ref</th>
            {role === "admin" && <th className="px-4 py-4">Customer</th>}
            {role !== "designer" && <th className="px-4 py-4">Assigned Designer</th>}
            <th className="px-4 py-4">Due Date</th>
            <th className="px-4 py-4">Status</th>
            <th className="px-5 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {cases.map((c) => {
            const detailHref = `${baseDetailPath}/${c.id}`;

            return (
              <tr
                key={c.id}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                <td className="px-5 py-4 font-mono font-bold text-slate-900">
                  <Link
                    href={detailHref}
                    className="hover:text-[#00C48C] transition-colors inline-flex items-center gap-1"
                  >
                    <span>{c.case_number}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#00C48C]" />
                  </Link>
                </td>
                <td className="px-4 py-4 font-semibold text-slate-800">{c.service}</td>
                <td className="px-4 py-4 text-slate-600">{c.patient_reference}</td>

                {role === "admin" && (
                  <td className="px-4 py-4 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 font-medium">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{c.customer?.name || "Customer"}</span>
                    </div>
                  </td>
                )}

                {role !== "designer" && (
                  <td className="px-4 py-4 text-xs">
                    {c.designer ? (
                      <span className="text-slate-700 font-semibold">{c.designer.name}</span>
                    ) : (
                      <span className="text-amber-600 italic text-[11px] font-medium">Unassigned</span>
                    )}
                  </td>
                )}

                <td className="px-4 py-4 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(c.due_date)}</span>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <StatusBadge status={c.status} />
                </td>

                <td className="px-5 py-4 text-right">
                  <div className="inline-flex items-center gap-2 justify-end">
                    {role === "admin" && c.status === "uploaded" && onAssignClick && (
                      <button
                        onClick={() => onAssignClick(c)}
                        className="px-3 py-1 text-xs font-bold rounded-full bg-[#E8F8F2] text-[#008F66] border border-[#B6EAD5] hover:bg-[#D5F3E7] transition-colors cursor-pointer"
                      >
                        Assign
                      </button>
                    )}
                    <Link
                      href={detailHref}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors inline-flex items-center"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
