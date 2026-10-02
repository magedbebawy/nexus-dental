import { Resend } from "resend";
import { BRAND } from "@/lib/constants/brand";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromEmail = process.env.RESEND_FROM_EMAIL || "Nexus Dental Lab <notifications@nexusdental.com>";

export interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Sends an email notification to the assigned CAD designer
 */
export async function sendCaseAssignedEmail(params: {
  designerEmail: string;
  designerName: string;
  caseNumber: string;
  service: string;
  units: number;
  patientReference: string;
  dueDate: string;
}): Promise<EmailResult> {
  const subject = `New Case Assigned: ${params.caseNumber} • ${params.service}`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #080e1a; color: #f1f5f9; margin: 0; padding: 24px; }
          .container { max-width: 580px; margin: 0 auto; background-color: #0b1426; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; }
          .logo { color: #00c48c; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 24px; }
          h1 { font-size: 20px; font-weight: 700; color: #ffffff; margin-top: 0; }
          p { font-size: 14px; line-height: 1.6; color: #94a3b8; }
          .card { background-color: #0f1c35; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin: 24px 0; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #1e293b; font-size: 13px; }
          .row:last-child { border-bottom: none; }
          .label { color: #64748b; font-weight: 500; }
          .val { color: #ffffff; font-weight: 600; text-align: right; }
          .btn { display: inline-block; background-color: #00c48c; color: #080e1a; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 24px; border-radius: 10px; margin-top: 16px; }
          .footer { font-size: 12px; color: #475569; margin-top: 32px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">NEXUS DIGITAL DENTAL LAB</div>
          <h1>New CAD Case Assigned</h1>
          <p>Hello ${params.designerName},</p>
          <p>You have been assigned a new clinical restorative case in your CAD workbench.</p>
          
          <div class="card">
            <div class="row"><span class="label">Case Number:</span><span class="val">${params.caseNumber}</span></div>
            <div class="row"><span class="label">Restorative Indication:</span><span class="val">${params.service}</span></div>
            <div class="row"><span class="label">Units:</span><span class="val">${params.units} unit${params.units > 1 ? "s" : ""}</span></div>
            <div class="row"><span class="label">Patient / Ref:</span><span class="val">${params.patientReference}</span></div>
            <div class="row"><span class="label">Required Due Date:</span><span class="val" style="color: #00c48c;">${params.dueDate}</span></div>
          </div>

          <p>Please log in to your designer bench to download raw intraoral scans and initiate the digital restoration.</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://nexus-dental.vercel.app"}/dashboard/designer" class="btn">Open CAD Workbench &rarr;</a>

          <div class="footer">
            Nexus Digital Dental Lab • 50-Micron Precision Standard
          </div>
        </div>
      </body>
    </html>
  `;

  if (!resend) {
    console.log(`[Email Preview - Resend Not Configured] To: ${params.designerEmail} | Subject: ${subject}`);
    return { success: true, id: "mock-email-assigned" };
  }

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: params.designerEmail,
      subject,
      html,
    });
    return { success: true, id: data.data?.id };
  } catch (err: any) {
    console.error("Resend error (Case Assigned):", err);
    return { success: false, error: err.message };
  }
}

/**
 * Sends an email notification to the customer when the designer uploads the completed design
 */
export async function sendDesignUploadedEmail(params: {
  customerEmail: string;
  customerName: string;
  caseNumber: string;
  service: string;
  patientReference: string;
}): Promise<EmailResult> {
  const subject = `CAD Deliverable Ready: ${params.caseNumber} • ${params.service}`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #080e1a; color: #f1f5f9; margin: 0; padding: 24px; }
          .container { max-width: 580px; margin: 0 auto; background-color: #0b1426; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; }
          .logo { color: #00c48c; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 24px; }
          h1 { font-size: 20px; font-weight: 700; color: #ffffff; margin-top: 0; }
          p { font-size: 14px; line-height: 1.6; color: #94a3b8; }
          .badge { display: inline-block; background-color: rgba(0, 196, 140, 0.15); border: 1px solid #00c48c; color: #00c48c; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 20px; margin-bottom: 16px; }
          .card { background-color: #0f1c35; border: 1px solid #1e293b; border-radius: 12px; padding: 20px; margin: 24px 0; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #1e293b; font-size: 13px; }
          .row:last-child { border-bottom: none; }
          .label { color: #64748b; font-weight: 500; }
          .val { color: #ffffff; font-weight: 600; text-align: right; }
          .btn { display: inline-block; background-color: #00c48c; color: #080e1a; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 24px; border-radius: 10px; margin-top: 16px; }
          .footer { font-size: 12px; color: #475569; margin-top: 32px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">NEXUS DIGITAL DENTAL LAB</div>
          <div class="badge">DESIGN COMPLETED &amp; VERIFIED</div>
          <h1>Your CAD Restoration Is Ready</h1>
          <p>Dear ${params.customerName},</p>
          <p>The digital design for Case <strong>${params.caseNumber}</strong> has been finalized by our CAD team and is ready for immediate chairside or lab download.</p>
          
          <div class="card">
            <div class="row"><span class="label">Case Number:</span><span class="val">${params.caseNumber}</span></div>
            <div class="row"><span class="label">Restorative Indication:</span><span class="val">${params.service}</span></div>
            <div class="row"><span class="label">Patient Reference:</span><span class="val">${params.patientReference}</span></div>
            <div class="row"><span class="label">Status:</span><span class="val" style="color: #00c48c;">Done (Ready for MIlling / Printing)</span></div>
          </div>

          <p>Click below to log in to your Doctor Portal and download your print-ready STL deliverables.</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://nexus-dental.vercel.app"}/dashboard/customer" class="btn">Download Finished CAD Files &rarr;</a>

          <div class="footer">
            Nexus Digital Dental Lab • questions? contact us at ${BRAND.contact.email}
          </div>
        </div>
      </body>
    </html>
  `;

  if (!resend) {
    console.log(`[Email Preview - Resend Not Configured] To: ${params.customerEmail} | Subject: ${subject}`);
    return { success: true, id: "mock-email-completed" };
  }

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: params.customerEmail,
      subject,
      html,
    });
    return { success: true, id: data.data?.id };
  } catch (err: any) {
    console.error("Resend error (Design Uploaded):", err);
    return { success: false, error: err.message };
  }
}

/**
/**
 * Sends a daily billing invoice notice to the customer with direct payment link
 */
export async function sendDailyInvoiceEmail(params: {
  customerEmail: string;
  customerName: string;
  invoiceNumber: string;
  amountDue: number;
  dueDate: string;
  paymentUrl: string;
  caseCount: number;
}): Promise<EmailResult> {
  const subject = `Your Daily Dental Lab Invoice: ${params.invoiceNumber} ($${params.amountDue.toFixed(2)})`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 24px; }
          .container { max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 36px; box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05); }
          .logo { color: #00c48c; font-size: 18px; font-weight: 900; letter-spacing: -0.5px; margin-bottom: 20px; }
          h1 { font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 0; letter-spacing: -0.5px; }
          p { font-size: 14px; line-height: 1.6; color: #475569; }
          .price-banner { background: #f0faf5; border: 2px solid #00c48c; border-radius: 20px; padding: 24px; text-align: center; margin: 24px 0; }
          .amount { font-size: 38px; font-weight: 900; color: #0f172a; }
          .due { font-size: 13px; color: #008f66; font-weight: 700; margin-top: 4px; }
          .card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin: 20px 0; }
          .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
          .row:last-child { border-bottom: none; }
          .label { color: #64748b; font-weight: 600; }
          .val { color: #0f172a; font-weight: 700; text-align: right; }
          .btn { display: block; text-align: center; background-color: #00c48c; color: #ffffff; font-weight: 800; font-size: 15px; text-decoration: none; padding: 14px 28px; border-radius: 9999px; margin-top: 24px; box-shadow: 0 4px 14px rgba(0, 196, 140, 0.35); }
          .footer { font-size: 12px; color: #94a3b8; margin-top: 32px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">NEXUS DIGITAL DENTAL LAB</div>
          <h1>Daily Practice Billing Statement</h1>
          <p>Dear ${params.customerName},</p>
          <p>Here is your daily statement for completed digital dental lab restorations.</p>
          
          <div class="price-banner">
            <div style="font-size: 11px; font-weight: 800; color: #008f66; text-transform: uppercase; letter-spacing: 0.5px;">Amount Due</div>
            <div class="amount">$${params.amountDue.toFixed(2)}</div>
            <div class="due">Payment Due by ${params.dueDate}</div>
          </div>

          <div class="card">
            <div class="row"><span class="label">Invoice Number:</span><span class="val">${params.invoiceNumber}</span></div>
            <div class="row"><span class="label">Completed Restorations:</span><span class="val">${params.caseCount} Case(s)</span></div>
            <div class="row"><span class="label">Billing Cycle:</span><span class="val">Daily Statement</span></div>
          </div>

          <a href="${params.paymentUrl}" class="btn">Pay Online via Credit Card or ACH &rarr;</a>

          <div class="footer">
            Nexus Digital Dental Lab • 951-334-8942 • ${BRAND.contact.email}
          </div>
        </div>
      </body>
    </html>
  `;

  if (!resend) {
    console.log(`[Email Preview - Resend Not Configured] To: ${params.customerEmail} | Subject: ${subject} | Pay: ${params.paymentUrl}`);
    return { success: true, id: "mock-email-invoice" };
  }

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: params.customerEmail,
      subject,
      html,
    });
    return { success: true, id: data.data?.id };
  } catch (err: any) {
    console.error("Resend error (Daily Invoice):", err);
    return { success: false, error: err.message };
  }
}

// Backwards compatibility alias
export const sendMonthlyInvoiceEmail = sendDailyInvoiceEmail;
