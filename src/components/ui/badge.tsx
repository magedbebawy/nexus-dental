import { cn } from "@/lib/utils";
import { CASE_STATUS_CONFIG } from "@/lib/constants/dental";
import type { CaseStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: CaseStatus;
  className?: string;
  showDot?: boolean;
}

export function StatusBadge({
  status,
  className,
  showDot = true,
}: StatusBadgeProps) {
  const config = CASE_STATUS_CONFIG[status] || {
    label: status,
    color: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        config.color,
        className
      )}
    >
      {showDot && (
        <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      )}
      {config.label}
    </span>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "cyan" | "outline" | "slate";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-slate-100 text-slate-800 border border-slate-200 font-semibold",
    cyan: "bg-[#E8F8F2] text-[#008F66] border border-[#B6EAD5] font-black",
    outline: "bg-transparent text-slate-700 border border-slate-300 font-medium",
    slate: "bg-slate-50 text-slate-600 border border-slate-200 font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
