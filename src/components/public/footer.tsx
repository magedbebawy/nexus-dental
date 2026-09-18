import Link from "next/link";
import { NexusLogo } from "@/components/ui/nexus-logo";
import { BRAND } from "@/lib/constants/brand";
import { Mail, Phone, MapPin, ShieldCheck } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#050811] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <NexusLogo href="/" />
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Nexus Digital Dental Lab is a next-generation CAD/CAM design facility providing digital precision restorations, surgical guides, and full-arch solutions for premier clinicians.
            </p>
            <div className="flex items-center gap-2 text-xs text-cyan-400/90 font-medium">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>100% Digital Workflow • HIPAA-Compliant Architecture</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-cyan-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-cyan-400 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-cyan-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cyan-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cyan-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Portal Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Doctor Portal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/login" className="hover:text-cyan-400 transition-colors">
                  Doctor Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-cyan-400 transition-colors">
                  Register Practice
                </Link>
              </li>
              <li>
                <Link href="/forgot-password" className="hover:text-cyan-400 transition-colors">
                  Forgot Password
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Lab Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Lab Contact
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href={`mailto:${BRAND.contact.email}`}
                  className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{BRAND.contact.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${BRAND.contact.phone}`}
                  className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{BRAND.contact.formattedPhone}</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                <span>Digital Lab Network &bull; Serving Nationwide</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Nexus Digital Dental Lab. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Precision Digital Dentistry</span>
            <span>•</span>
            <Link href="/login" className="hover:text-slate-400">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
