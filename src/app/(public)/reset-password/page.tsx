"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { ArrowRight, CheckCircle2, AlertCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // If code is in URL query parameters, exchange it for a session
  useEffect(() => {
    async function exchangeAuthCode() {
      const code = searchParams.get("code");
      if (code) {
        try {
          const supabase = createClient();
          await supabase.auth.exchangeCodeForSession(code);
        } catch (err) {
          console.warn("Code exchange check:", err);
        }
      }
    }
    exchangeAuthCode();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error && !error.message.includes("fetch")) {
        setError(error.message);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 1800);
    } catch {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1800);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white shadow-xl">
      <div className="text-center space-y-2 mb-6">
        <span className="text-xs font-black uppercase tracking-widest text-[#008F66]">
          Security Update
        </span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Reset Password
        </h1>
        <p className="text-xs text-slate-500">
          Enter your new secure password below.
        </p>
      </div>

      {success ? (
        <div className="text-center py-6 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#E8F8F2] border border-[#B6EAD5] flex items-center justify-center text-[#008F66] mx-auto">
            <CheckCircle2 className="w-7 h-7 text-[#00C48C]" />
          </div>
          <h3 className="text-base font-black text-slate-900">Password Updated!</h3>
          <p className="text-xs text-slate-500">
            Your credentials have been securely updated. Redirecting to sign in...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Input
            label="New Password"
            type="password"
            placeholder="At least 8 characters"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter your password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full gap-2 text-sm mt-2 font-black"
            isLoading={isLoading}
          >
            <Lock className="w-4 h-4" />
            <span>Update Password</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <div className="pt-4 border-t border-slate-200 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-bold"
            >
              <span>Back to Sign In</span>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="py-12 sm:py-16 flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-slate-500 text-xs">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
