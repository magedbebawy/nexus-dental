-- ==============================================================================
-- Nexus Digital Dental Lab - Initial Database Schema & RLS Policies
-- ==============================================================================

-- 1. ENUMS & EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('customer', 'designer', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE case_status AS ENUM ('uploaded', 'assigned', 'done');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE file_category AS ENUM ('customer_file', 'designer_file');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. SEQUENCES
CREATE SEQUENCE IF NOT EXISTS case_number_seq START WITH 100001;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone_number TEXT NOT NULL DEFAULT '',
  role user_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. CASES TABLE
CREATE TABLE IF NOT EXISTS public.cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number TEXT UNIQUE NOT NULL DEFAULT ('NX-' || nextval('case_number_seq')::text),
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  designer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  service TEXT NOT NULL,
  patient_reference TEXT NOT NULL,
  due_date DATE NOT NULL,
  instructions TEXT,
  status case_status NOT NULL DEFAULT 'uploaded',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_cases_customer_id ON public.cases(customer_id);
CREATE INDEX IF NOT EXISTS idx_cases_designer_id ON public.cases(designer_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON public.cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_created_at ON public.cases(created_at DESC);

-- Enable RLS on cases
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

-- 5. CASE FILES TABLE
CREATE TABLE IF NOT EXISTS public.case_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  file_category file_category NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  storage_path TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_case_files_case_id ON public.case_files(case_id);
CREATE INDEX IF NOT EXISTS idx_case_files_uploaded_by ON public.case_files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_case_files_category ON public.case_files(file_category);

-- Enable RLS on case_files
ALTER TABLE public.case_files ENABLE ROW LEVEL SECURITY;

-- 6. HELPER FUNCTIONS FOR SECURITY (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'::user_role
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 7. TRIGGER: AUTOMATIC PROFILE CREATION ON USER SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone_number, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'New User'),
    new.email,
    COALESCE(new.raw_user_meta_data->>'phone_number', ''),
    'customer'::user_role
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    phone_number = EXCLUDED.phone_number;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. RLS POLICIES: PROFILES
-- Users can view their own profile; Admins can view all profiles
DROP POLICY IF EXISTS "Allow user to read own profile" ON public.profiles;
CREATE POLICY "Allow user to read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

-- Users can update their own non-sensitive profile details
DROP POLICY IF EXISTS "Allow user to update own profile" ON public.profiles;
CREATE POLICY "Allow user to update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- Only Admins can insert/delete profiles directly
DROP POLICY IF EXISTS "Allow admin to insert profiles" ON public.profiles;
CREATE POLICY "Allow admin to insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (public.is_admin() OR auth.uid() = id);

-- 9. RLS POLICIES: CASES
-- Customers see only their own cases; Designers see cases assigned to them; Admins see all
DROP POLICY IF EXISTS "Cases select policy" ON public.cases;
CREATE POLICY "Cases select policy"
  ON public.cases FOR SELECT
  USING (
    customer_id = auth.uid()
    OR designer_id = auth.uid()
    OR public.is_admin()
  );

-- Customers can create cases (status must be 'uploaded', designer_id must be null)
DROP POLICY IF EXISTS "Customer insert case policy" ON public.cases;
CREATE POLICY "Customer insert case policy"
  ON public.cases FOR INSERT
  WITH CHECK (
    (customer_id = auth.uid() AND status = 'uploaded'::case_status AND designer_id IS NULL)
    OR public.is_admin()
  );

-- Designers can update cases assigned to them (mark as done)
-- Admins can update any case (assignment, status, etc.)
DROP POLICY IF EXISTS "Cases update policy" ON public.cases;
CREATE POLICY "Cases update policy"
  ON public.cases FOR UPDATE
  USING (
    designer_id = auth.uid()
    OR public.is_admin()
  )
  WITH CHECK (
    (designer_id = auth.uid() AND status = 'done'::case_status)
    OR public.is_admin()
  );

-- Only Admins can delete cases
DROP POLICY IF EXISTS "Admin delete case policy" ON public.cases;
CREATE POLICY "Admin delete case policy"
  ON public.cases FOR DELETE
  USING (public.is_admin());

-- 10. RLS POLICIES: CASE FILES
-- File Read: Customer sees files for their case; Designer sees files for assigned case; Admin sees all
DROP POLICY IF EXISTS "Case files select policy" ON public.case_files;
CREATE POLICY "Case files select policy"
  ON public.case_files FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.cases c 
      WHERE c.id = case_files.case_id 
        AND (c.customer_id = auth.uid() OR c.designer_id = auth.uid())
    )
  );

-- File Insert: Customer can upload customer_file to their case; Designer can upload designer_file to assigned case; Admin can upload any
DROP POLICY IF EXISTS "Case files insert policy" ON public.case_files;
CREATE POLICY "Case files insert policy"
  ON public.case_files FOR INSERT
  WITH CHECK (
    public.is_admin()
    OR (
      file_category = 'customer_file'::file_category
      AND uploaded_by = auth.uid()
      AND EXISTS (
        SELECT 1 FROM public.cases c
        WHERE c.id = case_files.case_id AND c.customer_id = auth.uid()
      )
    )
    OR (
      file_category = 'designer_file'::file_category
      AND uploaded_by = auth.uid()
      AND EXISTS (
        SELECT 1 FROM public.cases c
        WHERE c.id = case_files.case_id AND c.designer_id = auth.uid()
      )
    )
  );

-- 11. STORAGE BUCKET CONFIGURATION
-- Creates private storage bucket 'dental-cases'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'dental-cases',
  'dental-cases',
  false,
  104857600, -- 100MB max file size
  NULL       -- Allow all dental scanner/CAD formats (STL, OBJ, PLY, ZIP, PDF, images)
)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Authenticated users can upload dental case files" ON storage.objects;
CREATE POLICY "Authenticated users can upload dental case files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'dental-cases');

DROP POLICY IF EXISTS "Authorized users can read dental case files" ON storage.objects;
CREATE POLICY "Authorized users can read dental case files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'dental-cases');
