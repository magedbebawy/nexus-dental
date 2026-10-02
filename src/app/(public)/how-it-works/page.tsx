import Link from "next/link";
import { ArrowRight, CheckCircle, Upload, UserCheck, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      title: "Doctor Captures & Uploads",
      subtitle: "Fast Digital Submission",
      description:
        "Complete your standard patient prep and scan with any intraoral scanner (iTero, Trios, Medit). Log into your Nexus Doctor Portal, select your service (e.g. Crown & Bridge or Surgical Guide), specify patient reference and margin preferences, and upload your raw scans.",
      icon: Upload,
      bulletPoints: [
        "Direct drag-and-drop for STL, OBJ, PLY files up to 100MB",
        "Clear Rx instruction inputs & target due dates",
        "Immediate auto-generated case tracking ID (NX-10000X)",
      ],
    },
    {
      number: "02",
      title: "Lab Triages & Assigns Dedicated CAD Designer",
      subtitle: "Precision Engineering",
      description:
        "Our digital lab operations team reviews prep margins, occlusal clearance, and opposing registration. Cases are assigned to specialized CAD designers trained specifically in your requested restorative discipline.",
      icon: UserCheck,
      bulletPoints: [
        "Margin line inspection & prep validation",
        "Anatomical tooth libraries matching patient morphology",
        "Strict 50-micron cement gap & tight contact calibration",
      ],
    },
    {
      number: "03",
      title: "Design Completed & Ready for Immediate Fabrication",
      subtitle: "Instant Download & In-Office Production",
      description:
        "Once CAD design passes digital verification, the status updates to 'Done'. You receive instant access in your portal to download validated print-ready and mill-ready STL files.",
      icon: Download,
      bulletPoints: [
        "Secure signed URL download prevents data exposure",
        "Direct compatibility with SprintRay, Asiga, Formlabs, VHF, Roland",
        "Archived securely for lifetime record retrieval",
      ],
    },
  ];

  return (
    <div className="py-14 sm:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F8F2] border border-[#B6EAD5] text-[#008F66] text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#00C48C]" />
            <span>Frictionless Case Lifecycle</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            How Nexus Digital Lab Works
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            A transparent, predictable digital partnership built to simplify your lab operations and eliminate chairside delays.
          </p>
        </div>

        {/* Vertical Process Steps */}
        <div className="space-y-8 relative">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-white rounded-3xl p-6 sm:p-10 relative overflow-hidden border border-slate-200 shadow-sm hover:border-[#00C48C] hover:shadow-xl transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Step Num Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-[#E8F8F2] border border-[#B6EAD5] flex items-center justify-center text-[#008F66] shrink-0">
                    <Icon className="w-7 h-7 text-[#00C48C]" />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-mono font-black text-[#008F66] px-2.5 py-0.5 rounded-full bg-[#E8F8F2] border border-[#B6EAD5]">
                        STEP {step.number}
                      </span>
                      <span className="text-xs text-slate-500 font-bold">
                        {step.subtitle}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {step.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {step.description}
                    </p>

                    <div className="pt-3 grid sm:grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                      {step.bulletPoints.map((bp) => (
                        <div key={bp} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-[#00C48C] shrink-0" />
                          <span>{bp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#F0FAF5] border-2 border-[#00C48C] text-center space-y-4 shadow-xs">
          <h3 className="text-2xl font-black text-slate-900">Experience the Nexus Advantage</h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto font-normal">
            Ready to test our turnaround and precision on your next clinical case? Create your customer account in seconds.
          </p>
          <div className="pt-2">
            <Link href="/register">
              <Button size="lg" className="gap-2 text-sm font-black shadow-md shadow-emerald-500/20">
                <span>Register Practice &amp; Upload Scans</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
