import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  Cpu,
  CheckCircle2,
  FileCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DENTAL_SERVICES } from "@/lib/constants/dental";
import { BRAND } from "@/lib/constants/brand";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-28 lg:pb-36">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-sky-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Next-Gen Dental CAD/CAM Facility</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Precision Digital Restorations.{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                Engineered for Dentists.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Eliminate remakes and chairside adjustments. Send your digital scans directly to our elite CAD team and receive validated, print-and-mill ready designs in 24–48 hours.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2 text-sm shadow-xl shadow-cyan-500/25">
                  <span>Register Practice & Submit Case</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/services" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm">
                  Explore Services & Pricing
                </Button>
              </Link>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>STL, OBJ, PLY, DICOM</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>24-Hour Express Turnaround</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Certified Dental Technicians</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Workflow Highlight */}
      <section className="py-16 bg-[#060a14] border-y border-white/[0.06] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Streamlined Case Protocol
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Three Clicks from Scan to Seat
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 relative group hover:border-cyan-500/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold mb-5 group-hover:scale-110 transition-transform">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Upload Case & Scans</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Log into your Doctor Portal, attach your intraoral scan (STL/OBJ/PLY) or CBCT archive, specify restoration parameters, and submit.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 relative group hover:border-cyan-500/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-bold mb-5 group-hover:scale-110 transition-transform">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Lab Assignment & CAD</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Nexus CAD designers calibrate margins, contacts, and occlusion to anatomical standards with state-of-the-art dental engineering suites.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 relative group hover:border-cyan-500/40 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold mb-5 group-hover:scale-110 transition-transform">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Download & Fabricate</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Case status updates to Done. Securely download your verified STL design files ready for chairside 3D printing or milling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Showcase Preview */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">
              Digital Restorative Portfolio
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Specialized Solutions for Every Indication
            </p>
          </div>
          <Link href="/services">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <span>View All 8 Services</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DENTAL_SERVICES.slice(0, 4).map((service) => (
            <div
              key={service.id}
              className="glass-panel glass-panel-hover rounded-xl p-6 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {service.turnaround}
                </span>
                <h3 className="text-base font-bold text-white mt-3 mb-2">{service.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{service.description}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <Link
                  href="/register"
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
                >
                  <span>Submit Case</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="py-16 bg-gradient-to-b from-transparent to-[#050811] border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Ready to Accelerate Your Practice's Digital Workflow?
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Create your account today. No long-term contracts. Upload your first case in less than 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto text-sm">
                Register Your Practice
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto text-sm">
                Speak with Lab Director
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
