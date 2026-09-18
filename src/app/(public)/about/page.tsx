import Link from "next/link";
import { ArrowRight, ShieldCheck, Award, Zap, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/constants/brand";

export default function AboutPage() {
  return (
    <div className="py-14 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            About Nexus Digital Dental Lab
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Precision CAD Dentistry Engineered for Clinical Confidence
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Nexus was established on a single core principle: digital dentistry should be dependable, exact, and completely free of friction. We combine elite CAD engineering expertise with dedicated laboratory software to give dental clinicians full visibility and rapid turnarounds.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Rapid Turnaround</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standard 24 to 48-hour turnarounds ensure your patients get seated on schedule without unnecessary follow-up visits or delayed restorations.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Micron Precision</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our CAD parameters are calibrated to 50-micron cement margins and natural emergence profiles, minimizing chairside adjustments.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Direct Visibility</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No lost phone calls or missed emails. Track case status in real-time from upload through designer assignment to completion.
            </p>
          </div>
        </div>

        {/* Lab Facility Details */}
        <div className="rounded-2xl bg-[#090e1c] border border-slate-800 p-8 sm:p-10 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Lab Direct Contact & Inquiries</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Have clinical questions on prep design, complex full-arch implants, or surgical guide sleeve compatibility? Contact our technical team directly.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-slate-500 font-medium">Direct Telephone:</span>
              <p className="text-sm font-bold text-white">{BRAND.contact.formattedPhone}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-slate-500 font-medium">Direct Email:</span>
              <p className="text-sm font-bold text-cyan-400">{BRAND.contact.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
