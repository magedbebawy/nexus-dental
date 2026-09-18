"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error && !error.message.includes("fetch")) {
        setError(error.message);
        return;
      }

      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
        <div className="text-center space-y-2 mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            Account Recovery
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Forgot Password
          </h1>
          <p className="text-xs text-slate-400">
            Enter your practice email to receive a password reset link.
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Reset Link Sent</h3>
            <p className="text-xs text-slate-400">
              If an account exists for {email}, a recovery email has been dispatched.
            </p>
            <div className="pt-4">
              <Link href="/login">
                <Button variant="outline" size="sm" className="w-full">
                  Return to Sign In
                </Button>
              </Link>
            </div>
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
              label="Email Address"
              type="email"
              placeholder="doctor@practice.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full gap-2 text-sm mt-2"
              isLoading={isLoading}
            >
              <Send className="w-4 h-4" />
              <span>Send Recovery Link</span>
            </Button>

            <div className="pt-4 border-t border-slate-800 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
