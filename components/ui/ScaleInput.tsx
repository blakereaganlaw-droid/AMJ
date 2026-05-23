"use client";

import { cn } from "@/lib/utils/cn";

export function ScaleInput({
  name,
  label,
  value,
  defaultValue,
  lowLabel = "Low",
  highLabel = "High",
}: {
  name: string;
  label: string;
  value?: number | null;
  defaultValue?: number | null;
  lowLabel?: string;
  highLabel?: string;
}) {
  const selected = value ?? defaultValue ?? null;

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-foreground">{label}</legend>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <label
            key={n}
            className={cn(
              "flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border text-sm font-medium transition-colors",
              selected === n
                ? "border-sage bg-sage text-white"
                : "border-[var(--card-border)] bg-card hover:border-sage/50"
            )}
          >
            <input
              type="radio"
              name={name}
              value={n}
              defaultChecked={defaultValue === n}
              className="sr-only"
            />
            {n}
          </label>
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </fieldset>
  );
}
