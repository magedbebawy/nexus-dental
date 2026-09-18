import Link from "next/link";
import { ArrowRight, Check, Clock, Layers, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DENTAL_SERVICES } from "@/lib/constants/dental";

export default function ServicesPage() {
  return (
    <div className="py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Digital CAD/CAM Restorations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Digital Lab Solutions & Clinical Indications
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            All designs are built strictly to your clinical preferences, cement gap tolerances, and occlusal clearance requirements.
          </p>
        </div>

        {/* 8 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DENTAL_SERVICES.map((service, index) => (
            <div
              key={service.id}
              className="glass-panel glass-panel-hover rounded-2xl p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    0{index + 1}
                  </span>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-[11px] font-medium text-slate-300 border border-slate-700">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>{service.turnaround}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2.5">{service.name}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                  {service.description}
                </p>

                <div className="space-y-2 pt-4 border-t border-slate-800/80 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>STL / OBJ / PLY open format compatible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Milling & 3D printing validated</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Link href="/register">
                  <Button variant="outline" size="sm" className="w-full justify-center gap-2 text-xs">
                    <span>Submit {service.name} Case</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Supported Scanners Section */}
        <div className="mt-16 p-8 rounded-2xl bg-[#090e1c] border border-slate-800 text-center space-y-4">
          <h3 className="text-lg font-bold text-white">Universal Intraoral Scanner Compatibility</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            We accept digital scans from all major intraoral scanners including iTero, 3Shape TRIOS, Medit, Dentsply Sirona Primescan, and Carestream Dental. Simply export standard STL, OBJ, or PLY files and upload directly into your portal.
          </p>
        </div>
      </div>
    </div>
  );
}
