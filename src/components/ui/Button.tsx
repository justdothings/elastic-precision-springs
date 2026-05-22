import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "border border-cyan-200/50 bg-cyan-500 text-slate-950 shadow-[0_0_28px_rgba(34,211,238,.25)] hover:border-cyan-100 hover:bg-cyan-400 hover:text-slate-950",
  secondary: "border border-cyan-200/35 bg-cyan-950/35 text-cyan-50 hover:border-cyan-200/70 hover:bg-cyan-900/70 hover:text-white",
  ghost: "border border-transparent bg-transparent text-slate-100 hover:bg-white/[.07] hover:text-white",
};

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: keyof typeof variants;
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

type LinkButtonProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: keyof typeof variants;
};

export function LinkButton({ className, variant = "primary", ...props }: LinkButtonProps) {
  return (
    <Link
      className={cn(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
