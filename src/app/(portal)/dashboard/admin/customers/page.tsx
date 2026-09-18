"use client";

import { useEffect, useState } from "react";
import { Users, Mail, Phone, Calendar, Search } from "lucide-react";
import { PortalHeader } from "@/components/portal/header";
import { Input } from "@/components/ui/input";
import { fetchProfilesByRole } from "@/lib/services/users";
import { formatDate } from "@/lib/utils";
import type { Profile } from "@/lib/types";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      setIsLoading(true);
      try {
        const data = await fetchProfilesByRole("customer");
        setCustomers(data);
      } catch (err) {
        console.error("Failed to load customers", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCustomers();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone_number.includes(searchTerm)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <PortalHeader
        title="Customer Directory"
        description="Registered dental practices, ordering doctors, and primary contact records."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/admin" },
          { label: "Customers" },
        ]}
      />

      {/* Search Input */}
      <div className="max-w-md">
        <Input
          placeholder="Search by doctor name, practice email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Customers Table */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 text-sm">
          Loading customer directory...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-slate-800 bg-[#090e1c] text-slate-400 text-sm">
          No customer accounts found matching "{searchTerm}".
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#090e1c]/80 shadow-xl">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-800 bg-[#070b16] text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Doctor / Practice Name</th>
                <th className="px-5 py-3.5">Email Address</th>
                <th className="px-5 py-3.5">Phone Number</th>
                <th className="px-5 py-3.5">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4 font-semibold text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <span>{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-300">
                    <a
                      href={`mailto:${customer.email}`}
                      className="hover:text-cyan-400 inline-flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>{customer.email}</span>
                    </a>
                  </td>
                  <td className="px-5 py-4 text-slate-300">
                    <a
                      href={`tel:${customer.phone_number}`}
                      className="hover:text-cyan-400 inline-flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{customer.phone_number || "Not provided"}</span>
                    </a>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{formatDate(customer.created_at)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
