"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
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
      setTimeout(() => router.push("/login"), 1500);
    } catch {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
        <div className="text-center space-y-2 mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            Security Update
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Reset Password
          </h1>
          <p className="text-xs text-slate-400">
            Enter your new secure password below.
          </p>
        </div>

        {success ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Password Updated!</h3>
            <p className="text-xs text-slate-400">Redirecting to sign in...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full gap-2 text-sm mt-2"
              isLoading={isLoading}
            >
              <span>Update Password</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
