import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 bg-white/[.04] px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-cyan-100",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto mb-10 max-w-3xl text-center", className)}>
      {eyebrow ? <Badge>{eyebrow}</Badge> : null}
      <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.04em] text-white md:text-5xl">{title}</h2>
      {children ? <div className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-7 text-slate-300 md:text-lg">{children}</div> : null}
    </div>
  );
}
