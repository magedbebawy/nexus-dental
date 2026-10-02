import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2025-02-24.acacia" as any,
    })
  : null;

/**
 * Creates a Stripe checkout session or payment URL for a dental lab invoice
 */
export async function createStripeInvoicePaymentSession(params: {
  invoiceId: string;
  invoiceNumber: string;
  customerEmail: string;
  customerName: string;
  amount: number;
  caseCount: number;
}): Promise<{ url: string; stripeSessionId?: string }> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nexus-dental.vercel.app";

  if (!stripe) {
    // Graceful fallback URL for preview / local testing
    return {
      url: `${siteUrl}/dashboard/customer/invoices/${params.invoiceId}?pay=true`,
    };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: params.customerEmail,
      client_reference_id: params.invoiceId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Dental Lab Restorations - Invoice ${params.invoiceNumber}`,
              description: `Monthly balance for ${params.caseCount} completed CAD/CAM restoration case(s).`,
            },
            unit_amount: Math.round(params.amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${siteUrl}/dashboard/customer/invoices/${params.invoiceId}?success=true`,
      cancel_url: `${siteUrl}/dashboard/customer/invoices/${params.invoiceId}?canceled=true`,
      metadata: {
        invoice_id: params.invoiceId,
        invoice_number: params.invoiceNumber,
        customer_name: params.customerName,
      },
    });

    return {
      url: session.url || `${siteUrl}/dashboard/customer/invoices/${params.invoiceId}?pay=true`,
      stripeSessionId: session.id,
    };
  } catch (error: any) {
    console.error("Stripe session creation error:", error);
    return {
      url: `${siteUrl}/dashboard/customer/invoices/${params.invoiceId}?pay=true`,
    };
  }
}
