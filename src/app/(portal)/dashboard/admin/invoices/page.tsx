"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  Receipt,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  Search,
  RefreshCw,
  Building,
  Mail,
  Phone,
  ArrowUpRight,
} from "lucide-react";
import { PortalHeader } from "@/components/portal/header";
import { Button } from "@/components/ui/button";
import {
  fetchCustomerBalanceSummaries,
  fetchAllInvoices,
  createMonthlyInvoiceForCustomer,
  markInvoicePaid,
  type CustomerBalanceSummary,
} from "@/lib/services/invoices";
import { formatDate, formatDateTime } from "@/lib/utils";
import type { Invoice } from "@/lib/types";

export default function AdminInvoicesPage() {
  const [balances, setBalances] = useState<CustomerBalanceSummary[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"balances" | "invoices">("balances");
  const [searchQuery, setSearchQuery] = useState("");
  const [processingCustomerId, setProcessingCustomerId] = useState<string | null>(null);
  const [markingPaidId, setMarkingPaidId] = useState<string | null>(null);
  const [statusNotification, setStatusNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const loadBillingData = async () => {
    setIsLoading(true);
    try {
      const [balData, invData] = await Promise.all([
        fetchCustomerBalanceSummaries(),
        fetchAllInvoices(),
      ]);
      setBalances(balData);
      setInvoices(invData);
    } catch (err) {
      console.error("Failed to load invoices", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBillingData();
  }, []);

  // Financial KPI calculations
  const totalOutstandingOwed = balances.reduce(
    (sum, b) => sum + (b.totalOutstandingOwed || 0),
    0
  );
  const totalPaidRevenue = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + Number(inv.amount_paid || inv.amount_due || 0), 0);
  const uninvoicedCasesTotal = balances.reduce(
    (sum, b) => sum + (b.uninvoicedCasesCount || 0),
    0
  );
  const openInvoicesCount = invoices.filter((inv) => inv.status === "unpaid").length;

  // Handle generating and sending monthly invoice to a customer
  const handleGenerateInvoice = async (customerId: string, customerName: string) => {
    setProcessingCustomerId(customerId);
    setStatusNotification(null);

    try {
      const result = await createMonthlyInvoiceForCustomer(customerId);
      if (!result.success) {
        setStatusNotification({
          type: "error",
          message: result.error || "Failed to generate daily invoice.",
        });
        return;
      }

      setStatusNotification({
        type: "success",
        message: `Daily Invoice ${result.invoice?.invoice_number} created and emailed to ${customerName}!`,
      });

      await loadBillingData();
    } catch (err: any) {
      setStatusNotification({
        type: "error",
        message: err.message || "An unexpected error occurred while generating invoice.",
      });
    } finally {
      setProcessingCustomerId(null);
    }
  };

  // Handle manually marking an invoice as paid
  const handleMarkAsPaid = async (invoiceId: string, invoiceNum: string) => {
    setMarkingPaidId(invoiceId);
    setStatusNotification(null);

    try {
      const success = await markInvoicePaid(invoiceId);
      if (success) {
        setStatusNotification({
          type: "success",
          message: `Invoice ${invoiceNum} marked as Paid. Balance updated!`,
        });
        await loadBillingData();
      } else {
        setStatusNotification({
          type: "error",
          message: "Failed to mark invoice as paid.",
        });
      }
    } catch (err: any) {
      setStatusNotification({
        type: "error",
        message: err.message || "Failed to update payment status.",
      });
    } finally {
      setMarkingPaidId(null);
    }
  };

  const filteredBalances = balances.filter(
    (b) =>
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customer?.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      <PortalHeader
        title="Billing & Accounts Receivable"
        description="Track customer balances owed, inspect paid invoices, and generate automated monthly billing statements."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={loadBillingData}
            isLoading={isLoading}
            className="gap-2 text-xs font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Ledger</span>
          </Button>
        }
      />

      {/* Status Notifications */}
      {statusNotification && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs font-bold animate-in fade-in duration-200 ${
            statusNotification.type === "success"
              ? "bg-[#E8F8F2] border-[#B6EAD5] text-[#008F66]"
              : "bg-rose-50 border-rose-200 text-rose-600"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {statusNotification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusNotification.message}</span>
          </div>
          <button
            onClick={() => setStatusNotification(null)}
            className="text-slate-500 hover:text-slate-800"
          >
            &times;
          </button>
        </div>
      )}

      {/* Financial KPI Cards - Mint Mobile Light Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Outstanding Owed */}
        <div className="rounded-3xl p-6 border-2 border-[#00C48C] bg-[#F0FAF5] space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-[#008F66]">
            <span className="text-xs font-black uppercase tracking-wider">
              Total Outstanding Owed
            </span>
            <DollarSign className="w-4 h-4" />
          </div>
          <p className="text-3xl sm:text-4xl font-black text-slate-900">
            ${totalOutstandingOwed.toFixed(2)}
          </p>
          <p className="text-xs text-slate-600 font-medium">
            Uninvoiced completed cases + open unpaid invoices
          </p>
        </div>

        {/* Total Paid Revenue */}
        <div className="rounded-3xl p-6 border border-slate-200 bg-white space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[#008F66]">
            <span className="text-xs font-black uppercase tracking-wider">
              Collected Payments
            </span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-3xl sm:text-4xl font-black text-slate-900">
            ${totalPaidRevenue.toFixed(2)}
          </p>
          <p className="text-xs text-slate-500 font-medium">Total verified lab fees paid</p>
        </div>

        {/* Uninvoiced Restorations */}
        <div className="rounded-3xl p-6 border border-slate-200 bg-white space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-black uppercase tracking-wider">
              Uninvoiced Cases
            </span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-3xl sm:text-4xl font-black text-slate-900">{uninvoicedCasesTotal}</p>
          <p className="text-xs text-slate-500 font-medium">
            Completed restorations ready for daily bill
          </p>
        </div>

        {/* Open Invoices */}
        <div className="rounded-3xl p-6 border border-slate-200 bg-white space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-sky-600">
            <span className="text-xs font-black uppercase tracking-wider">
              Awaiting Payment
            </span>
            <Receipt className="w-4 h-4" />
          </div>
          <p className="text-3xl sm:text-4xl font-black text-slate-900">{openInvoicesCount}</p>
          <p className="text-xs text-slate-500 font-medium">Issued invoices with open balances</p>
        </div>
      </div>

      {/* Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-full border border-slate-200 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("balances")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer ${
              activeTab === "balances"
                ? "bg-[#00C48C] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Customer Balances Owed ({balances.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("invoices")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer ${
              activeTab === "invoices"
                ? "bg-[#00C48C] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>All Invoices &amp; Payment History ({invoices.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              activeTab === "balances" ? "Search customer or email..." : "Search invoice # or clinic..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-full pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#00C48C] shadow-xs"
          />
        </div>
      </div>

      {/* TAB 1: Customer Balance Ledger */}
      {activeTab === "balances" && (
        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="px-6 py-5 border-b border-slate-200 bg-[#F8FAF9]">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Practice Accounts Receivable Ledger
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown of what each dental customer owes and one-click daily statement issuance.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-5">Dental Practice / Customer</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4 text-center">Uninvoiced Cases</th>
                  <th className="py-3.5 px-4 text-right">Uninvoiced Lab Fees</th>
                  <th className="py-3.5 px-4 text-right">Unpaid Invoices</th>
                  <th className="py-3.5 px-5 text-right font-black text-slate-900">
                    Total Balance Owed
                  </th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredBalances.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 text-xs font-medium">
                      No customer account balances match your search.
                    </td>
                  </tr>
                ) : (
                  filteredBalances.map((b) => {
                    const isProcessing = processingCustomerId === b.customerId;
                    const canGenerate = b.uninvoicedCasesCount > 0;

                    return (
                      <tr
                        key={b.customerId}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-4 px-5">
                          <div className="font-bold text-slate-900 text-sm">
                            {b.customerName}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {b.totalCompletedCases} completed restorations to date
                          </div>
                        </td>

                        <td className="py-4 px-4 text-slate-600">
                          <div className="flex items-center gap-1.5 text-[11px] font-medium">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{b.customerEmail}</span>
                          </div>
                          {b.clinicPhone && (
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                              <Phone className="w-3.5 h-3.5" />
                              <span>{b.clinicPhone}</span>
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-4 text-center">
                          {b.uninvoicedCasesCount > 0 ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                              {b.uninvoicedCasesCount} open
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">0</span>
                          )}
                        </td>

                        <td className="py-4 px-4 text-right font-semibold text-slate-700">
                          ${b.uninvoicedAmount.toFixed(2)}
                        </td>

                        <td className="py-4 px-4 text-right">
                          {b.unpaidInvoicedAmount > 0 ? (
                            <span className="font-bold text-rose-600">
                              ${b.unpaidInvoicedAmount.toFixed(2)} ({b.unpaidInvoicesCount} inv)
                            </span>
                          ) : (
                            <span className="text-slate-400">$0.00</span>
                          )}
                        </td>

                        <td className="py-4 px-5 text-right">
                          <span
                            className={`text-base font-black ${
                              b.totalOutstandingOwed > 0
                                ? "text-[#008F66]"
                                : "text-slate-400"
                            }`}
                          >
                            ${b.totalOutstandingOwed.toFixed(2)}
                          </span>
                        </td>

                        <td className="py-4 px-5 text-right">
                          <Button
                            size="sm"
                            variant="primary"
                            disabled={!canGenerate || isProcessing}
                            isLoading={isProcessing}
                            onClick={() =>
                              handleGenerateInvoice(b.customerId, b.customerName)
                            }
                            className="gap-1.5 text-xs font-black shadow-xs"
                            title={
                              canGenerate
                                ? "Creates daily statement and emails payment link to customer"
                                : "All completed cases are already invoiced"
                            }
                          >
                            <Send className="w-3 h-3" />
                            <span>Send Daily Invoice</span>
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Invoices & Payment Ledger */}
      {activeTab === "invoices" && (
        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="px-6 py-5 border-b border-slate-200 bg-[#F8FAF9]">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Issued Invoices &amp; Settlement History
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time tracking of when daily invoices were paid or sent.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-5">Invoice #</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Issued Date</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4">Paid Timestamp</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 text-xs font-medium">
                      No invoices recorded yet.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => {
                    const isPaid = inv.status === "paid";
                    const isMarking = markingPaidId === inv.id;

                    return (
                      <tr
                        key={inv.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-4 px-5">
                          <span className="font-mono font-bold text-slate-900">
                            {inv.invoice_number}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-900">
                            {inv.customer?.name || "Dr. Alex Vance"}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {inv.customer?.email}
                          </div>
                        </td>

                        <td className="py-4 px-4 text-slate-600">
                          {formatDate(inv.created_at)}
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
                            <div className="text-[#008F66] font-bold">
                              {formatDateTime(inv.paid_at)}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Pending settlement</span>
                          )}
                        </td>

                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {inv.stripe_payment_url && (
                              <a
                                href={inv.stripe_payment_url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-[#00C48C] hover:border-[#00C48C] transition-colors"
                                title="Open Stripe Checkout Payment Link"
                              >
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </a>
                            )}

                            {!isPaid && (
                              <Button
                                size="sm"
                                variant="outline"
                                isLoading={isMarking}
                                onClick={() => handleMarkAsPaid(inv.id, inv.invoice_number)}
                                className="text-xs font-bold"
                              >
                                Mark as Paid
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
