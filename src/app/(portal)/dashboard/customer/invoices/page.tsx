"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Receipt,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { PortalHeader } from "@/components/portal/header";
import { Button } from "@/components/ui/button";
import { fetchCustomerInvoices } from "@/lib/services/invoices";
import { createClient } from "@/lib/supabase/client";
import { formatDate, formatDateTime } from "@/lib/utils";
import type { Invoice } from "@/lib/types";

export default function CustomerInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadInvoices = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const customerId = user?.id || "u1111111-1111-1111-1111-111111111111";

      const data = await fetchCustomerInvoices(customerId);
      setInvoices(data);
    } catch (err) {
      console.error("Failed to load customer invoices", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const unpaidInvoices = invoices.filter((inv) => inv.status === "unpaid");
  const totalAmountDue = unpaidInvoices.reduce(
    (sum, inv) => sum + Number(inv.amount_due || 0),
    0
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <PortalHeader
        title="Practice Invoices &amp; Billing"
        description="View your daily dental lab statements, pay outstanding balances via Credit Card/ACH, and download receipts."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={loadInvoices}
            isLoading={isLoading}
            className="gap-2 text-xs font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </Button>
        }
      />

      {/* Mint Mobile Style Balance Card (Light) */}
      <div className="rounded-3xl p-6 sm:p-8 border-2 border-[#00C48C] bg-[#F0FAF5] shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-[#E8F8F2] text-[#008F66] border border-[#B6EAD5]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00C48C]" />
              <span>DAILY LAB STATEMENT</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              ${totalAmountDue.toFixed(2)}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {unpaidInvoices.length > 0
                ? `You have ${unpaidInvoices.length} open daily statement awaiting payment.`
                : "Your practice account is in good standing with zero balance due."}
            </p>
          </div>

          {unpaidInvoices.length > 0 && unpaidInvoices[0].stripe_payment_url && (
            <a
              href={unpaidInvoices[0].stripe_payment_url}
              target="_blank"
              rel="noreferrer"
            >
              <Button
                size="lg"
                className="gap-2 text-sm shadow-md shadow-emerald-500/20 font-black"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay Current Statement Now</span>
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Invoices List */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="px-6 py-5 border-b border-slate-200 bg-[#F8FAF9]">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            Statement History
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-5">Invoice #</th>
                <th className="py-3.5 px-4">Billing Period</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4">Settlement Date</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs font-medium">
                    No billing statements have been issued yet.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => {
                  const isPaid = inv.status === "paid";

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-5">
                        <span className="font-mono font-bold text-slate-900">
                          {inv.invoice_number}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-slate-600">
                        {formatDate(inv.billing_period_start)} – {formatDate(inv.billing_period_end)}
                      </td>

                      <td className="py-4 px-4 text-slate-600">
                        {formatDate(inv.due_date)}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <span className="text-sm font-black text-slate-900">
                          ${Number(inv.amount_due).toFixed(2)}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black bg-[#E8F8F2] text-[#008F66] border border-[#B6EAD5]">
                            <CheckCircle2 className="w-3 h-3 text-[#00C48C]" />
                            <span>PAID</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>UNPAID</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-slate-600">
                        {inv.paid_at ? (
                          <span className="text-[#008F66] font-bold">
                            {formatDateTime(inv.paid_at)}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Net 14 Days</span>
                        )}
                      </td>

                      <td className="py-4 px-5 text-right">
                        {!isPaid && inv.stripe_payment_url ? (
                          <a
                            href={inv.stripe_payment_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Button
                              size="sm"
                              className="text-xs font-black gap-1"
                            >
                              <span>Pay Online</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </Button>
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-bold">Paid in Full</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
