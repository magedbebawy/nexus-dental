"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, type LoginFormData } from "@/lib/validation/schemas";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setErrors({});

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err: any) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setServerError(
          error.message === "Invalid login credentials"
            ? "Invalid email or password. Please check your credentials and try again."
            : error.message
        );
        return;
      }

      if (data.user) {
        // Fetch role from profile
        const { data: profile } = await (supabase.from("profiles") as any)
          .select("role")
          .eq("id", data.user.id)
          .single();

        const role = (profile as any)?.role || "customer";
        router.push(redirectPath || `/dashboard/${role}`);
        router.refresh();
      }
    } catch (err: any) {
      setServerError(err?.message || "An unexpected login error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white shadow-xl">
        <div className="text-center space-y-2 mb-6">
          <span className="text-xs font-black uppercase tracking-widest text-[#008F66]">
            Secure Portal
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Sign In to Nexus Portal
          </h1>
          <p className="text-xs text-slate-500">
            Access your customer, designer, or administration console.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {serverError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="doctor@practice.com"
            required
            value={formData.email}
            error={errors.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#008F66] hover:text-[#00C48C] font-bold"
              >
                Forgot Password?
              </Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              error={errors.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full gap-2 text-sm mt-2 font-black"
            isLoading={isLoading}
          >
            <span>Sign In to Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <div className="pt-4 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-500 font-medium">
              New practice?{" "}
              <Link
                href="/register"
                className="font-bold text-[#008F66] hover:text-[#00C48C]"
              >
                Register Customer Account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-slate-400 text-sm">
          Loading portal authentication...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
