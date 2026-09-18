"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { PortalHeader } from "@/components/portal/header";
import { CaseTable } from "@/components/portal/case-table";
import { Button } from "@/components/ui/button";
import { fetchCases } from "@/lib/services/cases";
import type { Case } from "@/lib/types";

export default function DesignerCompletedCasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCases() {
      setIsLoading(true);
      try {
        const data = await fetchCases({ role: "designer", status: "done" });
        setCases(data);
      } catch (err) {
        console.error("Failed to load completed cases", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCases();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <PortalHeader
        title="Completed Cases"
        description="Historical log of all CAD restorations and surgical guides you have designed and completed."
        breadcrumbs={[
          { label: "Assigned Cases", href: "/dashboard/designer" },
          { label: "Completed" },
        ]}
        actions={
          <Link href="/dashboard/designer">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Active Queue</span>
            </Button>
          </Link>
        }
      />

      {/* Case Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Delivered Designs</h2>
          <span className="text-xs text-slate-400">{cases.length} Total</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Loading completed records...
          </div>
        ) : (
          <CaseTable
            cases={cases}
            role="designer"
            baseDetailPath="/dashboard/designer/cases"
            emptyMessage="No completed cases in your archive yet."
          />
        )}
      </div>
    </div>
  );
}
