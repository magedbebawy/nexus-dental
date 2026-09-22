"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { ArrowRight, AlertCircle, Shield, User, Palette, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, type LoginFormData } from "@/lib/validation/schemas";
import type { UserRole } from "@/lib/types";

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

  const handleDemoRoleRouting = (email: string) => {
    if (email.includes("admin") || email.includes("nexusdigitaldentallab")) {
      router.push("/dashboard/admin");
    } else if (email.includes("designer") || email.includes("sterling")) {
      router.push("/dashboard/designer");
    } else {
      router.push("/dashboard/customer");
    }
  };

  const setDemoAccount = (role: UserRole) => {
    if (role === "customer") {
      setFormData({
        email: "alex.vance@dentalcare.com",
        password: "Password123!",
      });
    } else if (role === "designer") {
      setFormData({
        email: "marcus.sterling@nexusdental.com",
        password: "Password123!",
      });
    } else if (role === "admin") {
      setFormData({
        email: "nexusdigitaldentallab@gmail.com",
        password: "Password123!",
      });
    }
  };

  return (
    <div className="py-12 sm:py-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
        <div className="text-center space-y-2 mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            Secure Portal
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Sign In to Nexus Portal
          </h1>
          <p className="text-xs text-slate-400">
            Access your customer, designer, or administration console.
          </p>
        </div>

        {/* Demo Fast-Switch Buttons for Testing & Evaluation */}
        <div className="mb-6 p-3 rounded-xl bg-slate-900/80 border border-cyan-500/20 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast Role Testing Switcher</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => setDemoAccount("customer")}
              className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
            >
              <User className="w-3 h-3 text-sky-400" />
              <span>Customer</span>
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount("designer")}
              className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
            >
              <Palette className="w-3 h-3 text-cyan-400" />
              <span>Designer</span>
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount("admin")}
              className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
            >
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {serverError && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
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
              <label className="block text-xs font-medium text-slate-300 tracking-wide uppercase">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                Forgot?
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
            className="w-full gap-2 text-sm mt-2"
            isLoading={isLoading}
          >
            <span>Sign In to Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <div className="pt-4 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              New practice?{" "}
              <Link
                href="/register"
                className="font-semibold text-cyan-400 hover:text-cyan-300"
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
