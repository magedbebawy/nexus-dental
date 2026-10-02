import Link from "next/link";
import { ArrowRight, ShieldCheck, Award, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/constants/brand";

export default function AboutPage() {
  return (
    <div className="py-14 sm:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F8F2] border border-[#B6EAD5] text-[#008F66] text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#00C48C]" />
            <span>About Nexus Digital Dental Lab</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Precision CAD Dentistry Engineered for Clinical Confidence
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Nexus was established on a single core principle: digital dentistry should be dependable, exact, and completely free of friction. We combine elite CAD engineering expertise with dedicated laboratory software to give dental clinicians full visibility and rapid turnarounds.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-3 border border-slate-200 shadow-sm hover:border-[#00C48C] hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F8F2] border border-[#B6EAD5] flex items-center justify-center text-[#008F66]">
              <Zap className="w-6 h-6 text-[#00C48C]" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Rapid Turnaround</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Standard 24 to 48-hour turnarounds ensure your patients get seated on schedule without unnecessary follow-up visits or delayed restorations.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-3 border border-slate-200 shadow-sm hover:border-[#00C48C] hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F8F2] border border-[#B6EAD5] flex items-center justify-center text-[#008F66]">
              <Award className="w-6 h-6 text-[#00C48C]" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Micron Precision</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Our CAD parameters are calibrated to 50-micron cement margins and natural emergence profiles, minimizing chairside adjustments.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-3 border border-slate-200 shadow-sm hover:border-[#00C48C] hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F8F2] border border-[#B6EAD5] flex items-center justify-center text-[#008F66]">
              <ShieldCheck className="w-6 h-6 text-[#00C48C]" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Direct Visibility</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              No lost phone calls or missed emails. Track case status in real-time from upload through designer assignment to completion.
            </p>
          </div>
        </div>

        {/* Lab Facility Details */}
        <div className="rounded-3xl bg-[#F0FAF5] border-2 border-[#00C48C] p-8 sm:p-10 space-y-6 shadow-xs">
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900">Lab Direct Contact & Inquiries</h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Have clinical questions on prep design, complex full-arch implants, or surgical guide sleeve compatibility? Contact our technical team directly.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
              <span className="text-slate-500 font-medium">Direct Telephone:</span>
              <p className="text-sm font-black text-slate-900">{BRAND.contact.formattedPhone}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
              <span className="text-slate-500 font-medium">Direct Email:</span>
              <p className="text-sm font-black text-[#008F66]">{BRAND.contact.email}</p>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/register">
              <Button size="md" className="font-extrabold shadow-md shadow-emerald-500/20">
                <span>Register Practice Account</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
