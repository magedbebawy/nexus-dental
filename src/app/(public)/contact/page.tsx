"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
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
    <div className="py-14 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details Side */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                Direct Lab Communication
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Contact Our Technical Lab Team
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Connect with our lab directors and CAD design specialists for custom case prescriptions, turnaround inquiries, and practice onboarding.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href={`mailto:${BRAND.contact.email}`}
                className="glass-panel glass-panel-hover p-4 rounded-xl flex items-center gap-4 block"
              >
                <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] uppercase font-semibold text-slate-400">Lab Email</p>
                  <p className="text-sm font-semibold text-white">{BRAND.contact.email}</p>
                </div>
              </a>

              <a
                href={`tel:${BRAND.contact.phone}`}
                className="glass-panel glass-panel-hover p-4 rounded-xl flex items-center gap-4 block"
              >
                <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] uppercase font-semibold text-slate-400">Direct Telephone</p>
                  <p className="text-sm font-semibold text-white">{BRAND.contact.formattedPhone}</p>
                </div>
              </a>

              <div className="glass-panel p-4 rounded-xl flex items-center gap-4">
                <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] uppercase font-semibold text-slate-400">Digital Lab Facility</p>
                  <p className="text-sm font-semibold text-white">Serving Dental Practices Nationwide</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-2xl p-6 sm:p-10 border border-slate-800">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Message Received</h3>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                    Thank you for reaching out to Nexus Digital Dental Lab. A senior lab technician will respond to your inquiry shortly.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSubmitted(false)}
                    className="mt-4"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold text-white mb-2">Send an Inquiry</h3>

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

                  <Button type="submit" size="lg" className="w-full gap-2 text-sm mt-4">
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
