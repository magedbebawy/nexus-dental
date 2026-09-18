import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 4, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-slate-300 tracking-wide uppercase"
          >
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          rows={rows}
          className={cn(
            "w-full rounded-lg bg-[#0c1425] border border-slate-700/80 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500",
            "transition-all duration-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 resize-y",
            "disabled:opacity-50 disabled:bg-slate-900/40 disabled:cursor-not-allowed",
            error && "border-rose-500/70 focus:border-rose-500 focus:ring-rose-500/30",
            className
          )}
          {...props}
        />
        {helperText && !error && (
          <p className="text-xs text-slate-400">{helperText}</p>
        )}
        {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
