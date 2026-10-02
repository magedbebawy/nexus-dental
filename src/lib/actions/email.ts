"use server";

import { createClient } from "@/lib/supabase/client";
import { sendCaseAssignedEmail, sendDesignUploadedEmail, sendMonthlyInvoiceEmail } from "@/lib/services/email";
import { fetchCaseById } from "@/lib/services/cases";
import { formatDate } from "@/lib/utils";

/**
 * Server action to notify a CAD designer when an admin assigns them to a case
 */
export async function notifyDesignerAssigned(params: {
  caseId: string;
  designerId: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const c = await fetchCaseById(params.caseId);
    if (!c) {
      return { success: false, error: "Case not found." };
    }

    const designerName = c.designer?.name || "CAD Specialist";
    const designerEmail = c.designer?.email || "designer@nexusdental.com";

    const res = await sendCaseAssignedEmail({
      designerEmail,
      designerName,
      caseNumber: c.case_number,
      service: c.service,
      units: c.units || 1,
      patientReference: c.patient_reference,
      dueDate: formatDate(c.due_date),
    });

    return res;
  } catch (err: any) {
    console.error("notifyDesignerAssigned error:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Server action to notify a customer doctor when a designer completes and uploads the CAD files.
 * PRIVACY GUARANTEE: This runs exclusively on the server, so the designer client never sees
 * the customer's email, name, or contact details.
 */
export async function notifyCustomerDesignUploaded(params: {
  caseId: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const c = await fetchCaseById(params.caseId);
    if (!c) {
      return { success: false, error: "Case not found." };
    }

    const customerEmail = c.customer?.email || "alex.vance@dentalcare.com";
    const customerName = c.customer?.name || "Doctor";

    const res = await sendDesignUploadedEmail({
      customerEmail,
      customerName,
      caseNumber: c.case_number,
      service: c.service,
      patientReference: c.patient_reference,
    });

    return res;
  } catch (err: any) {
    console.error("notifyCustomerDesignUploaded error:", err);
    return { success: false, error: err.message };
  }
}
