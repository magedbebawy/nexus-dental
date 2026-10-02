import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DENTAL_SERVICES } from "@/lib/constants/dental";

export default function HomePage() {
  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section - Mint Mobile Inspired Light Theme */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-28 lg:pb-36 bg-gradient-to-b from-[#F2FBF7] via-white to-white">
        {/* Soft mint ambient glow in background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#00C48C]/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
              Direct-to-Doctor CAD Restorations.{" "}
              <span className="text-[#00C48C]">
                Designed for Clinical Precision.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              No middleman markup. No surprise lab invoices. Upload your digital scans directly to our certified dental technicians and receive validated, print-and-mill ready STL designs in express 24 hours.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2 text-base shadow-lg shadow-emerald-500/25">
                  <span>Register Practice &amp; Submit Case</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/services" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base">
                  Explore Restorative Services
                </Button>
              </Link>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 font-semibold">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00C48C]" />
                <span>Open STL / OBJ / PLY Scans</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00C48C]" />
                <span>Express 24-Hour Crown Turnaround</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00C48C]" />
                <span>Model Included in Crown &amp; Bridge</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Workflow Highlight */}
      <section className="py-20 bg-[#F8FAF9] border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#008F66]">
              HOW IT WORKS
            </h2>
            <p className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Three Steps from Intraoral Scan to Seating
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:border-[#00C48C] hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F8F2] border border-[#B6EAD5] flex items-center justify-center text-[#008F66] font-black text-lg mb-5">
                01
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Upload Scan &amp; Rx</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Log into your Doctor Portal, attach your intraoral scan (STL/OBJ/PLY), specify restorative indications and units, and submit your digital prescription in seconds.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:border-[#00C48C] hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F8F2] border border-[#B6EAD5] flex items-center justify-center text-[#008F66] font-black text-lg mb-5">
                02
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Anonymous CAD Design</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Cases are assigned to vetted CAD designers with strict customer privacy. Margins, contacts, and occlusion are calibrated to 50-micron tolerance.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:border-[#00C48C] hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F8F2] border border-[#B6EAD5] flex items-center justify-center text-[#008F66] font-black text-lg mb-5">
                03
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Download &amp; Mill</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Receive an automated email notification when your design is uploaded. Download validated STL deliverables immediately for chairside printing or in-office milling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mint Mobile Style Services Preview Grid (No Prices Shown) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-[#008F66] mb-2">
              RESTORATIVE SERVICES
            </h2>
            <p className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Precision Digital Restorations. Calibrated for Your Practice.
            </p>
          </div>
          <Link href="/services">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold">
              <span>View All 7 Indications</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DENTAL_SERVICES.slice(0, 4).map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl p-6 flex flex-col justify-between border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#00C48C] transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E8F8F2] text-[#008F66] border border-[#B6EAD5]">
                    {service.turnaround}
                  </span>
                  {service.includesModel && (
                    <span className="text-[10px] font-bold text-slate-500">
                      Model Included
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-black text-slate-900 mb-1.5">{service.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{service.description}</p>

                <div className="p-3.5 rounded-2xl bg-[#F0FAF5] border border-[#C8EEDD] space-y-1">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00C48C]" />
                    <span>50-Micron Margin Accuracy</span>
                  </div>
                  <p className="text-[11px] text-[#008F66] font-medium">Validated for Chairside Milling</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href="/register"
                  className="w-full inline-block"
                >
                  <Button variant="primary" size="sm" className="w-full text-xs font-extrabold justify-center gap-1.5">
                    <span>Submit Case</span>
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="py-20 bg-gradient-to-b from-white to-[#F0FAF5] border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8F8F2] text-[#008F66] text-xs font-black uppercase border border-[#B6EAD5]">
            <span>GET STARTED TODAY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Stop Overpaying for Dental CAD Designs.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
            Create your practice account today. No long-term contracts. Upload your first case in less than 2 minutes and receive print-ready STLs in 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto text-base shadow-lg shadow-emerald-500/25">
                Register Your Practice
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base">
                Speak with Lab Director
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
