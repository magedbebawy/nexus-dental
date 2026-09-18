import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      id,
      children,
      options,
      ...props
    },
    ref
  ) => {
    const selectId = id || React.useId();

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-medium text-slate-300 tracking-wide uppercase"
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            "w-full rounded-lg bg-[#0c1425] border border-slate-700/80 px-3.5 py-2.5 text-sm text-white",
            "transition-all duration-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50",
            "disabled:opacity-50 disabled:bg-slate-900/40 disabled:cursor-not-allowed",
            error && "border-rose-500/70 focus:border-rose-500 focus:ring-rose-500/30",
            className
          )}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#0b1329] text-white">
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {helperText && !error && (
          <p className="text-xs text-slate-400">{helperText}</p>
        )}
        {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
