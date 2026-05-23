import { cn } from "@/lib/utils/cn";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--card-border)] bg-cream/50 px-6 py-12 text-center",
        className
      )}
    >
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-sage-light"
        aria-hidden
      >
        <svg viewBox="0 0 40 40" className="h-8 w-8 text-sage" fill="currentColor">
          <circle cx="20" cy="20" r="8" opacity="0.4" />
          <circle cx="12" cy="14" r="4" opacity="0.25" />
          <circle cx="28" cy="26" r="5" opacity="0.25" />
        </svg>
      </div>
      <h3 className="text-base font-medium text-foreground">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
