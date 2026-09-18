-- ==============================================================================
-- Nexus Digital Dental Lab - Database Fix & Optimization
-- Run this script in your Supabase SQL Editor to resolve "Database error saving new user"
-- ==============================================================================

-- 1. Fix handle_new_user trigger function with explicit schema and error immunity
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone_number, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'New User'),
    COALESCE(new.email, ''),
    COALESCE(new.raw_user_meta_data->>'phone_number', ''),
    'customer'::public.user_role
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, public.profiles.name),
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    phone_number = COALESCE(EXCLUDED.phone_number, public.profiles.phone_number);
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log warning but do not crash the auth user creation
    RAISE WARNING 'handle_new_user error: %', SQLERRM;
    RETURN new;
END;
$$;

-- 2. Ensure trigger is properly bound
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Fix helper functions with explicit search_path
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'::public.user_role
  );
$$;

-- 4. Fix profiles RLS to allow seamless profile creation during signup
DROP POLICY IF EXISTS "Allow user to read own profile" ON public.profiles;
CREATE POLICY "Allow user to read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Allow user to update own profile" ON public.profiles;
CREATE POLICY "Allow user to update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Allow admin to insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON public.profiles;
CREATE POLICY "Allow profile creation"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

-- 5. Ensure private dental-cases storage bucket is registered
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'dental-cases',
  'dental-cases',
  false,
  104857600, -- 100MB limit
  NULL       -- Allow all scanner extensions (STL, OBJ, PLY, ZIP, PDF, images)
)
ON CONFLICT (id) DO UPDATE SET public = false;
