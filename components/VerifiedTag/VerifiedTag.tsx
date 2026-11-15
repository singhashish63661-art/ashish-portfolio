import { BadgeCheck } from "lucide-react";
import { PERSONAL_INFO } from "@/lib/data";

type VerifiedTagProps = {
  className?: string;
};

/**
 * Compact trust signal beside personal details — copy from `PERSONAL_INFO.profileVerification`.
 */
export default function VerifiedTag({ className = "" }: VerifiedTagProps) {
  const { label, hint } = PERSONAL_INFO.profileVerification;

  return (
    <span
      role="status"
      title={hint}
      className={`inline-flex items-center gap-1 rounded-full border border-emerald-200/90 bg-emerald-50 py-0.5 pl-1 pr-2 text-[10px] font-bold uppercase tracking-wider text-emerald-900 shadow-sm dark:border-emerald-500/40 dark:bg-emerald-950/60 dark:text-emerald-200 ${className}`}
    >
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white dark:bg-emerald-500">
        <BadgeCheck className="h-2.5 w-2.5" strokeWidth={2.75} aria-hidden />
      </span>
      {label}
      <span className="sr-only"> — {hint}</span>
    </span>
  );
}
