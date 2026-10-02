import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "teal" | "mint";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-extrabold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00C48C]/50 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer";

    const variants = {
      primary:
        "bg-[#00C48C] text-white shadow-md shadow-emerald-500/20 hover:bg-[#00A876] hover:shadow-lg hover:shadow-emerald-500/30 active:scale-[0.98]",
      mint:
        "bg-[#00C48C] text-white font-black hover:bg-[#00A876] shadow-md shadow-emerald-500/25 active:scale-[0.98]",
      teal:
        "bg-teal-600 text-white font-bold shadow-md shadow-teal-600/20 hover:bg-teal-700 active:scale-[0.98]",
      secondary:
        "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 active:scale-[0.98]",
      outline:
        "border-2 border-[#00C48C] text-[#008F66] bg-transparent hover:bg-[#E8F8F2] active:scale-[0.98]",
      ghost:
        "text-slate-700 hover:bg-slate-100 active:scale-[0.98]",
      danger:
        "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 active:scale-[0.98]",
    };

    const sizes = {
      sm: "text-xs px-4 py-1.5 gap-1.5 h-8",
      md: "text-sm px-6 py-2.5 gap-2 h-10",
      lg: "text-base px-8 py-3.5 gap-2.5 h-12",
      icon: "h-10 w-10 p-0 flex items-center justify-center",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
