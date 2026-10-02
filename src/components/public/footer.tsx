import Link from "next/link";
import { NexusLogo } from "@/components/ui/nexus-logo";
import { BRAND } from "@/lib/constants/brand";
import { Mail, Phone, MapPin, ShieldCheck } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-[#F8FAF9] text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <NexusLogo href="/" />
            <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
              Nexus Digital Dental Lab is a modern CAD/CAM design facility providing digital precision restorations, surgical guides, and full-arch solutions for premier clinicians.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#008F66] font-bold">
              <ShieldCheck className="w-4 h-4 text-[#00C48C]" />
              <span>100% Digital Workflow • Transparent Unit Pricing</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/" className="hover:text-[#00C48C] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#00C48C] transition-colors">
                  Services &amp; Pricing
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[#00C48C] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#00C48C] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#00C48C] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Portal Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Doctor Portal
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/login" className="hover:text-[#00C48C] transition-colors">
                  Doctor Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#00C48C] transition-colors">
                  Register Practice
                </Link>
              </li>
              <li>
                <Link href="/forgot-password" className="hover:text-[#00C48C] transition-colors">
                  Forgot Password
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Lab Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Lab Contact
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <a
                  href={`mailto:${BRAND.contact.email}`}
                  className="flex items-center gap-2 text-slate-700 hover:text-[#00C48C] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#00C48C] shrink-0" />
                  <span className="truncate">{BRAND.contact.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${BRAND.contact.phone}`}
                  className="flex items-center gap-2 text-slate-700 hover:text-[#00C48C] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#00C48C] shrink-0" />
                  <span>{BRAND.contact.formattedPhone}</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>Digital Lab Network &bull; Serving Nationwide</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Nexus Digital Dental Lab. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Precision Digital Dentistry</span>
            <span>•</span>
            <Link href="/login" className="hover:text-slate-800">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
