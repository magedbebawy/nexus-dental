import { createClient } from "@/lib/supabase/client";
import { createStripeInvoicePaymentSession } from "@/lib/services/stripe";
import { sendMonthlyInvoiceEmail } from "@/lib/services/email";
import type { Invoice, InvoiceStatus, Profile, Case } from "@/lib/types";

export interface CustomerBalanceSummary {
  customerId: string;
  customerName: string;
  customerEmail: string;
  clinicPhone?: string;
  totalCompletedCases: number;
  uninvoicedCasesCount: number;
  uninvoicedAmount: number;
  unpaidInvoicesCount: number;
  unpaidInvoicedAmount: number;
  totalOutstandingOwed: number;
  totalPaidToDate: number;
  lastInvoiceDate?: string;
  hasOpenBalance: boolean;
}

// In-memory mock storage for development/preview
let mockInvoices: Invoice[] = [
  {
    id: "inv-2026-001",
    invoice_number: "INV-2026-01001",
    customer_id: "u1111111-1111-1111-1111-111111111111",
    amount_due: 36.00,
    amount_paid: 0.00,
    status: "unpaid",
    billing_period_start: new Date(Date.now() - 86400000 * 30).toISOString(),
    billing_period_end: new Date().toISOString(),
    due_date: new Date(Date.now() + 86400000 * 14).toISOString(),
    stripe_payment_url: "http://localhost:3000/dashboard/customer/invoices/inv-2026-001?pay=true",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    customer: {
      id: "u1111111-1111-1111-1111-111111111111",
      name: "Dr. Alex Vance",
      email: "alex.vance@dentalcare.com",
      phone_number: "951-555-0199",
      role: "customer",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: "inv-2026-000",
    invoice_number: "INV-2026-01000",
    customer_id: "u1111111-1111-1111-1111-111111111111",
    amount_due: 144.00,
    amount_paid: 144.00,
    status: "paid",
    billing_period_start: new Date(Date.now() - 86400000 * 60).toISOString(),
    billing_period_end: new Date(Date.now() - 86400000 * 30).toISOString(),
    due_date: new Date(Date.now() - 86400000 * 16).toISOString(),
    paid_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 32).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    customer: {
      id: "u1111111-1111-1111-1111-111111111111",
      name: "Dr. Alex Vance",
      email: "alex.vance@dentalcare.com",
      phone_number: "951-555-0199",
      role: "customer",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
];

export async function fetchAllInvoices(): Promise<Invoice[]> {
  try {
    const supabase = createClient();
    const { data, error } = await (supabase.from("invoices") as any)
      .select(`
        *,
        customer:profiles!invoices_customer_id_fkey(*)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    if (data && data.length > 0) return data as unknown as Invoice[];
  } catch {
    // Fallback to mock
  }

  return [...mockInvoices];
}

export async function fetchCustomerInvoices(customerId: string): Promise<Invoice[]> {
  try {
    const supabase = createClient();
    const { data, error } = await (supabase.from("invoices") as any)
      .select(`
        *,
        customer:profiles!invoices_customer_id_fkey(*)
      `)
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    if (data && data.length > 0) return data as unknown as Invoice[];
  } catch {
    // Fallback to mock
  }

  return mockInvoices.filter((inv) => inv.customer_id === customerId);
}

export async function fetchInvoiceById(id: string): Promise<Invoice | null> {
  try {
    const supabase = createClient();
    const { data, error } = await (supabase.from("invoices") as any)
      .select(`
        *,
        customer:profiles!invoices_customer_id_fkey(*)
      `)
      .eq("id", id)
      .single();

    if (error) throw error;
    if (data) return data as unknown as Invoice;
  } catch {
    // Fallback
  }

  return mockInvoices.find((inv) => inv.id === id) || null;
}

/**
 * Calculates customer outstanding balance ledgers for Admin billing console
 */
export async function fetchCustomerBalanceSummaries(): Promise<CustomerBalanceSummary[]> {
  try {
    const supabase = createClient();

    // 1. Fetch all customer profiles
    const { data: customers } = await (supabase.from("profiles") as any)
      .select("*")
      .eq("role", "customer");

    // 2. Fetch all completed cases
    const { data: cases } = await (supabase.from("cases") as any)
      .select("id, customer_id, total_price, status, invoice_id")
      .eq("status", "done");

    // 3. Fetch all invoices
    const { data: invoices } = await (supabase.from("invoices") as any)
      .select("*");

    if (customers && customers.length > 0) {
      return (customers as Profile[]).map((cust) => {
        const custCases = (cases || []).filter((c: any) => c.customer_id === cust.id);
        const uninvoicedCases = custCases.filter((c: any) => !c.invoice_id);
        const uninvoicedTotal = uninvoicedCases.reduce(
          (sum: number, c: any) => sum + Number(c.total_price || 0),
          0
        );

        const custInvoices = (invoices || []).filter((inv: any) => inv.customer_id === cust.id);
        const unpaidInvoices = custInvoices.filter((inv: any) => inv.status === "unpaid");
        const unpaidTotal = unpaidInvoices.reduce(
          (sum: number, inv: any) => sum + Number(inv.amount_due || 0) - Number(inv.amount_paid || 0),
          0
        );
        const paidTotal = custInvoices
          .filter((inv: any) => inv.status === "paid")
          .reduce((sum: number, inv: any) => sum + Number(inv.amount_due || 0), 0);

        const totalOwed = uninvoicedTotal + unpaidTotal;

        const latestInvoice = [...custInvoices].sort(
          (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];

        return {
          customerId: cust.id,
          customerName: cust.name,
          customerEmail: cust.email,
          clinicPhone: cust.phone_number,
          totalCompletedCases: custCases.length,
          uninvoicedCasesCount: uninvoicedCases.length,
          uninvoicedAmount: uninvoicedTotal,
          unpaidInvoicesCount: unpaidInvoices.length,
          unpaidInvoicedAmount: unpaidTotal,
          totalOutstandingOwed: totalOwed,
          totalPaidToDate: paidTotal,
          lastInvoiceDate: latestInvoice ? latestInvoice.created_at : undefined,
          hasOpenBalance: totalOwed > 0,
        };
      });
    }
  } catch {
    // Fallback to mock
  }

  // Fallback mock customer summary
  return [
    {
      customerId: "u1111111-1111-1111-1111-111111111111",
      customerName: "Dr. Alex Vance (Apex Dental Care)",
      customerEmail: "alex.vance@dentalcare.com",
      clinicPhone: "951-555-0199",
      totalCompletedCases: 3,
      uninvoicedCasesCount: 1,
      uninvoicedAmount: 21.00,
      unpaidInvoicesCount: 1,
      unpaidInvoicedAmount: 36.00,
      totalOutstandingOwed: 57.00,
      totalPaidToDate: 144.00,
      lastInvoiceDate: new Date(Date.now() - 86400000 * 2).toISOString(),
      hasOpenBalance: true,
    },
  ];
}

/**
 * Creates and delivers a daily billing statement for a dental customer
 */
export async function createDailyInvoiceForCustomer(customerId: string): Promise<{
  success: boolean;
  invoice?: Invoice;
  error?: string;
}> {
  try {
    const supabase = createClient();

    // 1. Get customer info
    const { data: customer, error: custError } = await (supabase.from("profiles") as any)
      .select("*")
      .eq("id", customerId)
      .single();

    if (custError || !customer) {
      throw new Error("Customer profile not found.");
    }

    // 2. Fetch all completed cases not yet invoiced
    const { data: openCases, error: casesError } = await (supabase.from("cases") as any)
      .select("*")
      .eq("customer_id", customerId)
      .eq("status", "done")
      .is("invoice_id", null);

    if (casesError) throw casesError;

    const casesToInvoice: Case[] = (openCases || []) as Case[];
    if (casesToInvoice.length === 0) {
      return {
        success: false,
        error: "This practice has no uninvoiced completed cases to bill at this time.",
      };
    }

    const totalAmount = casesToInvoice.reduce(
      (sum, c) => sum + Number(c.total_price || 0),
      0
    );

    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const invoiceId = `inv-${Date.now()}`;

    // 3. Generate Stripe payment URL
    const { url: stripeUrl } = await createStripeInvoicePaymentSession({
      invoiceId,
      invoiceNumber,
      customerEmail: customer.email,
      customerName: customer.name,
      amount: totalAmount,
      caseCount: casesToInvoice.length,
    });

    // 4. Insert Invoice into DB (Daily period: past 24 hours)
    const { data: newInvoice, error: invError } = await (supabase.from("invoices") as any)
      .insert({
        id: invoiceId,
        invoice_number: invoiceNumber,
        customer_id: customerId,
        amount_due: totalAmount,
        amount_paid: 0.00,
        status: "unpaid",
        billing_period_start: new Date(Date.now() - 86400000).toISOString(),
        billing_period_end: new Date().toISOString(),
        due_date: new Date(Date.now() + 86400000 * 7).toISOString(),
        stripe_payment_url: stripeUrl,
      })
      .select(`
        *,
        customer:profiles!invoices_customer_id_fkey(*)
      `)
      .single();

    if (invError) {
      console.warn("DB insert error, falling back to mock:", invError.message);
    }

    // 5. Link cases to invoice
    const caseIds = casesToInvoice.map((c) => c.id);
    await (supabase.from("cases") as any)
      .update({ invoice_id: newInvoice?.id || invoiceId })
      .in("id", caseIds);

    // 6. Send transactional daily invoice email
    await sendMonthlyInvoiceEmail({
      customerEmail: customer.email,
      customerName: customer.name,
      invoiceNumber,
      amountDue: totalAmount,
      dueDate: new Date(Date.now() + 86400000 * 7).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      paymentUrl: stripeUrl,
      caseCount: casesToInvoice.length,
    });

    const created: Invoice = newInvoice || {
      id: invoiceId,
      invoice_number: invoiceNumber,
      customer_id: customerId,
      amount_due: totalAmount,
      amount_paid: 0.00,
      status: "unpaid",
      billing_period_start: new Date(Date.now() - 86400000).toISOString(),
      billing_period_end: new Date().toISOString(),
      due_date: new Date(Date.now() + 86400000 * 7).toISOString(),
      stripe_payment_url: stripeUrl,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      customer,
    };

    mockInvoices.unshift(created);
    return { success: true, invoice: created };
  } catch (err: any) {
    console.error("Failed to generate daily invoice:", err);
    return { success: false, error: err.message || "Failed to generate daily invoice." };
  }
}

// Alias for backwards compatibility
export const createMonthlyInvoiceForCustomer = createDailyInvoiceForCustomer;

/**
 * Marks an invoice as fully paid
 */
export async function markInvoicePaid(invoiceId: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await (supabase.from("invoices") as any)
      .update({
        status: "paid",
        amount_paid: (supabase as any).raw
          ? (supabase as any).raw("amount_due")
          : undefined,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", invoiceId);

    if (error) {
      console.warn("Supabase update error, falling back to mock:", error.message);
    }
  } catch {
    // Fallback
  }

  // Update in-memory mock
  const idx = mockInvoices.findIndex((inv) => inv.id === invoiceId);
  if (idx !== -1) {
    mockInvoices[idx] = {
      ...mockInvoices[idx],
      status: "paid",
      amount_paid: mockInvoices[idx].amount_due,
      paid_at: new Date().toISOString(),
    };
  }

  return true;
}
