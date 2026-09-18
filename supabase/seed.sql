-- ==============================================================================
-- Nexus Digital Dental Lab - Seed Script & Setup Instructions
-- ==============================================================================

-- Example: To promote a signed-up user to Admin or Designer in Supabase:
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE email = 'nexusdigitaldentallab@gmail.com';

-- UPDATE public.profiles
-- SET role = 'designer'
-- WHERE email = 'designer@nexusdental.com';

-- Optional: Initial lab services reference
COMMENT ON TABLE public.cases IS 'Digital dental lab cases submitted by customers and worked on by designers';
COMMENT ON COLUMN public.cases.case_number IS 'Human readable sequence formatted as NX-100001';
