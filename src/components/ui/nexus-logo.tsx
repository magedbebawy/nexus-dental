import Link from "next/link";
import { cn } from "@/lib/utils";

interface NexusLogoProps {
  className?: string;
  href?: string;
  variant?: "full" | "mark" | "portal";
  roleBadge?: string;
}

export function NexusLogo({
  className,
  href = "/",
  variant = "full",
  roleBadge,
}: NexusLogoProps) {
  const content = (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      {/* Precision Mint Geometric Icon */}
      <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-[#00C48C] to-[#00A876] shadow-sm shadow-emerald-500/20">
        <div className="w-3.5 h-3.5 border-2 border-white rounded-sm rotate-45 flex items-center justify-center">
          <div className="w-1 h-1 bg-white rounded-full"></div>
        </div>
      </div>

      {variant !== "mark" && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-black text-lg tracking-wider text-slate-900">NEXUS</span>
            <span className="text-xs font-black uppercase tracking-widest text-[#00C48C]">DIGITAL</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500 leading-tight">
            DENTAL LAB
          </span>
        </div>
      )}

      {roleBadge && (
        <span className="ml-1 px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide uppercase rounded-full bg-[#E8F8F2] text-[#008F66] border border-[#B6EAD5]">
          {roleBadge}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
