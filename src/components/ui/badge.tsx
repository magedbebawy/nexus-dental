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
    color: "bg-slate-800 text-slate-300 border-slate-700",
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
    default: "bg-slate-800 text-slate-200 border border-slate-700",
    cyan: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30",
    outline: "bg-transparent text-slate-300 border border-slate-700",
    slate: "bg-slate-900/60 text-slate-400 border border-slate-800",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
