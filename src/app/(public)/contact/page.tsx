"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BRAND } from "@/lib/constants/brand";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    practice: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-14 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details Side */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F8F2] border border-[#B6EAD5] text-[#008F66] text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#00C48C]" />
                <span>Direct Lab Communication</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Contact Our Technical Lab Team
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Connect with our lab directors and CAD design specialists for custom case prescriptions, turnaround inquiries, and practice onboarding.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href={`mailto:${BRAND.contact.email}`}
                className="p-5 rounded-2xl border border-slate-200 bg-[#F8FAF9] hover:bg-white hover:border-[#00C48C] hover:shadow-md transition-all flex items-center gap-4 block shadow-2xs"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#E8F8F2] border border-[#B6EAD5] flex items-center justify-center text-[#008F66] shrink-0">
                  <Mail className="w-5 h-5 text-[#00C48C]" />
                </div>
                <div>
                  <p className="text-[11px] uppercase font-bold text-slate-500">Lab Email</p>
                  <p className="text-sm font-black text-slate-900">{BRAND.contact.email}</p>
                </div>
              </a>

              <a
                href={`tel:${BRAND.contact.phone}`}
                className="p-5 rounded-2xl border border-slate-200 bg-[#F8FAF9] hover:bg-white hover:border-[#00C48C] hover:shadow-md transition-all flex items-center gap-4 block shadow-2xs"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#E8F8F2] border border-[#B6EAD5] flex items-center justify-center text-[#008F66] shrink-0">
                  <Phone className="w-5 h-5 text-[#00C48C]" />
                </div>
                <div>
                  <p className="text-[11px] uppercase font-bold text-slate-500">Direct Telephone</p>
                  <p className="text-sm font-black text-slate-900">{BRAND.contact.formattedPhone}</p>
                </div>
              </a>

              <div className="p-5 rounded-2xl border border-slate-200 bg-[#F8FAF9] flex items-center gap-4 shadow-2xs">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F8F2] border border-[#B6EAD5] flex items-center justify-center text-[#008F66] shrink-0">
                  <MapPin className="w-5 h-5 text-[#00C48C]" />
                </div>
                <div>
                  <p className="text-[11px] uppercase font-bold text-slate-500">Digital Lab Facility</p>
                  <p className="text-sm font-black text-slate-900">Serving Dental Practices Nationwide</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl p-6 sm:p-10 border border-slate-200 bg-white shadow-xl">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#E8F8F2] border border-[#B6EAD5] flex items-center justify-center text-[#008F66] mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-[#00C48C]" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Message Received</h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out to Nexus Digital Dental Lab. A senior lab technician will respond to your inquiry shortly.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 font-bold"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 mb-2">Send an Inquiry</h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Doctor / Contact Name"
                      placeholder="Dr. Sarah Jenkins"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                    <Input
                      label="Practice Name"
                      placeholder="Apex Dental Studio"
                      value={formData.practice}
                      onChange={(e) =>
                        setFormData({ ...formData, practice: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="doctor@apexdental.com"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="(951) 555-0199"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  <Textarea
                    label="Clinical or Case Question"
                    rows={4}
                    placeholder="Provide details about your upcoming case or scanner setup..."
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />

                  <Button type="submit" size="lg" className="w-full gap-2 text-sm mt-4 font-black">
                    <Send className="w-4 h-4" />
                    <span>Transmit Inquiry to Lab</span>
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
