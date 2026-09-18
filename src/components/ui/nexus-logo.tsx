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
      {/* Precision Geometric Placeholder Icon */}
      <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-sky-600 shadow-md shadow-cyan-500/20">
        <div className="w-3.5 h-3.5 border-2 border-white rounded-sm rotate-45 flex items-center justify-center">
          <div className="w-1 h-1 bg-white rounded-full"></div>
        </div>
      </div>

      {variant !== "mark" && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="font-bold text-lg tracking-wider text-white">NEXUS</span>
            <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400">DIGITAL</span>
          </div>
          <span className="text-[10px] uppercase font-medium tracking-[0.2em] text-slate-400 leading-tight">
            DENTAL LAB
          </span>
        </div>
      )}

      {roleBadge && (
        <span className="ml-1 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
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
