import Link from "next/link";
import { ArrowRight, Check, Clock, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DENTAL_SERVICES } from "@/lib/constants/dental";

export default function ServicesPage() {
  return (
    <div className="py-14 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Mint Mobile Inspired Light Style */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F8F2] border border-[#B6EAD5] text-[#008F66] text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#00C48C]" />
            <span>DIGITAL RESTORATIVE SERVICES</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Digital Lab Solutions.{" "}
            <span className="text-[#00C48C]">
              Precision CAD Dentistry.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Eliminate traditional lab friction. Built to 50-micron tolerance, calibrated to your clinic preferences, and validated for immediate 3D printing or chairside milling.
          </p>
        </div>

        {/* Mint Mobile Style Plan Grid (Clean Light Cards, No Prices Shown) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DENTAL_SERVICES.map((service, index) => {
            const isCrownOrModel = service.name.includes("Crown") || service.name.includes("Model Only");

            return (
              <div
                key={service.id}
                className={`bg-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300 border ${
                  isCrownOrModel
                    ? "border-2 border-[#00C48C] shadow-lg shadow-emerald-500/10"
                    : "border border-slate-200 shadow-sm hover:border-[#00C48C] hover:shadow-xl"
                }`}
              >
                {/* Popular Pill Badge */}
                {isCrownOrModel && (
                  <div className="absolute top-0 right-0 bg-[#00C48C] text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-bl-xl shadow-xs">
                    MOST POPULAR
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-mono font-bold text-[#008F66]">
                      0{index + 1}
                    </span>
                    <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 text-[11px] font-bold text-slate-700">
                      <Clock className="w-3 h-3 text-[#00C48C]" />
                      <span>{service.turnaround} Express</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mb-2">{service.name}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                    {service.description}
                  </p>

                  {/* Mint-Style Clinical Specification Box (No Prices) */}
                  <div className="p-4 rounded-2xl bg-[#F0FAF5] border border-[#C8EEDD] mb-6 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-[#008F66]">
                        Delivery Speed
                      </span>
                      <span className="text-xs font-black text-slate-900">
                        {service.turnaround}
                      </span>
                    </div>

                    {service.includesModel ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#E8F8F2] text-[#008F66] border border-[#B6EAD5]">
                        <CheckCircle2 className="w-3 h-3 text-[#00C48C]" />
                        <span>Includes 3D Printable Model</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-500 font-medium">
                        Standard anatomical CAD files
                      </div>
                    )}
                  </div>

                  {/* Feature Checkmarks */}
                  <div className="space-y-2.5 pt-2 text-xs text-slate-700 font-medium">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#00C48C] shrink-0" />
                      <span>STL, OBJ, PLY open format compatible</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#00C48C] shrink-0" />
                      <span>Validated for chairside milling &amp; 3D printing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#00C48C] shrink-0" />
                      <span>50-micron anatomical margin precision</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100">
                  <Link href="/register" className="w-full inline-block">
                    <Button
                      variant={isCrownOrModel ? "primary" : "outline"}
                      size="sm"
                      className="w-full justify-center gap-2 text-xs py-2.5 font-extrabold"
                    >
                      <span>Submit {service.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Compatibility and Guarantee banner */}
        <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-[#F8FAF9] border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F8F2] text-[#008F66] text-xs font-black uppercase tracking-wider border border-[#B6EAD5]">
            <ShieldCheck className="w-4 h-4 text-[#00C48C]" />
            <span>UNIVERSAL SCANNER COMPATIBILITY</span>
          </div>
          <h3 className="text-xl sm:text-3xl font-black text-slate-900">
            Compatible With Every Intraoral Scanner in Your Practice
          </h3>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            We natively process intraoral optical scans from iTero, 3Shape TRIOS, Medit, Dentsply Sirona Primescan, and Carestream Dental. Simply export standard open STL or PLY files and upload directly into your Doctor Portal.
          </p>
        </div>
      </div>
    </div>
  );
}
