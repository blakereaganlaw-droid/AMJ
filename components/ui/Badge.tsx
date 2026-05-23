import { cn } from "@/lib/utils/cn";

type BadgeVariant = "sage" | "sky" | "lavender" | "teal" | "neutral";

const variantStyles: Record<BadgeVariant, string> = {
  sage: "bg-sage-light text-sage",
  sky: "bg-sky-light text-sky",
  lavender: "bg-lavender-light text-lavender",
  teal: "bg-teal-light text-teal",
  neutral: "bg-cream text-muted",
};

export function Badge({
  children,
  variant = "neutral",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
