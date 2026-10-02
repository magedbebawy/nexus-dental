-- ==============================================================================
-- Migration: Add Units, Pricing & Invoices Table
-- ==============================================================================

-- 1. Create invoice_status enum type if it does not exist
DO $$ BEGIN
  CREATE TYPE public.invoice_status AS ENUM ('unpaid', 'paid', 'void');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Create invoices sequence and table
CREATE SEQUENCE IF NOT EXISTS public.invoice_number_seq START WITH 1001;

CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL DEFAULT ('INV-' || TO_CHAR(now(), 'YYYY') || '-' || LPAD(nextval('public.invoice_number_seq')::TEXT, 5, '0')),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount_due NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  amount_paid NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  status public.invoice_status NOT NULL DEFAULT 'unpaid',
  billing_period_start TIMESTAMPTZ NOT NULL DEFAULT date_trunc('month', now()),
  billing_period_end TIMESTAMPTZ NOT NULL DEFAULT (date_trunc('month', now()) + INTERVAL '1 month - 1 second'),
  due_date TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '14 days'),
  stripe_invoice_id TEXT,
  stripe_payment_url TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Add units and pricing columns to cases table
ALTER TABLE public.cases 
  ADD COLUMN IF NOT EXISTS units INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS unit_price NUMERIC(10,2) NOT NULL DEFAULT 6.00,
  ADD COLUMN IF NOT EXISTS total_price NUMERIC(10,2) NOT NULL DEFAULT 6.00,
  ADD COLUMN IF NOT EXISTS admin_verified BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL;

-- 4. Enable RLS on invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Customers can view their own invoices" ON public.invoices;
CREATE POLICY "Customers can view their own invoices"
  ON public.invoices
  FOR SELECT
  USING (customer_id = auth.uid());

DROP POLICY IF EXISTS "Admins have full access to invoices" ON public.invoices;
CREATE POLICY "Admins have full access to invoices"
  ON public.invoices
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 5. Indexes for fast financial reporting
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON public.invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_cases_invoice_id ON public.cases(invoice_id);
CREATE INDEX IF NOT EXISTS idx_cases_customer_status ON public.cases(customer_id, status);
