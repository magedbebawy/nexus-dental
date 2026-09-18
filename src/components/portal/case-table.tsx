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
      <div className="text-center py-16 px-4 rounded-xl border border-slate-800 bg-[#0a1020]/40">
        <p className="text-sm font-medium text-slate-400">{emptyMessage}</p>
        {role === "customer" && (
          <Link
            href="/dashboard/customer/new"
            className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
          >
            Create your first case &rarr;
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#090e1c]/80 shadow-xl">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-800 bg-[#070b16] text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <tr>
            <th className="px-4 py-3.5">Case #</th>
            <th className="px-4 py-3.5">Service</th>
            <th className="px-4 py-3.5">Patient / Ref</th>
            {role !== "customer" && <th className="px-4 py-3.5">Customer</th>}
            {role !== "designer" && <th className="px-4 py-3.5">Assigned Designer</th>}
            <th className="px-4 py-3.5">Due Date</th>
            <th className="px-4 py-3.5">Status</th>
            <th className="px-4 py-3.5 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/80 text-slate-300">
          {cases.map((c) => {
            const detailHref = `${baseDetailPath}/${c.id}`;

            return (
              <tr
                key={c.id}
                className="hover:bg-slate-800/40 transition-colors group"
              >
                <td className="px-4 py-3.5 font-mono font-semibold text-white">
                  <Link
                    href={detailHref}
                    className="hover:text-cyan-400 transition-colors inline-flex items-center gap-1"
                  >
                    <span>{c.case_number}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                  </Link>
                </td>
                <td className="px-4 py-3.5 font-medium text-slate-200">{c.service}</td>
                <td className="px-4 py-3.5 text-slate-300">{c.patient_reference}</td>

                {role !== "customer" && (
                  <td className="px-4 py-3.5 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>{c.customer?.name || "Customer"}</span>
                    </div>
                  </td>
                )}

                {role !== "designer" && (
                  <td className="px-4 py-3.5 text-xs">
                    {c.designer ? (
                      <span className="text-slate-300 font-medium">{c.designer.name}</span>
                    ) : (
                      <span className="text-amber-400/80 italic text-[11px]">Unassigned</span>
                    )}
                  </td>
                )}

                <td className="px-4 py-3.5 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{formatDate(c.due_date)}</span>
                  </div>
                </td>

                <td className="px-4 py-3.5">
                  <StatusBadge status={c.status} />
                </td>

                <td className="px-4 py-3.5 text-right">
                  <div className="inline-flex items-center gap-2 justify-end">
                    {role === "admin" && c.status === "uploaded" && onAssignClick && (
                      <button
                        onClick={() => onAssignClick(c)}
                        className="px-2.5 py-1 text-xs font-semibold rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
                      >
                        Assign
                      </button>
                    )}
                    <Link
                      href={detailHref}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors inline-flex items-center"
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
