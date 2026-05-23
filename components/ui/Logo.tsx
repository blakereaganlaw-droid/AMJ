import { APP_NAME } from "@/lib/constants/app";
import { cn } from "@/lib/utils/cn";

export function Logo({ className, showName = true }: { className?: string; showName?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage text-sm font-bold text-white"
        aria-hidden
      >
        HJ
      </div>
      {showName && (
        <span className="text-base font-semibold text-foreground">{APP_NAME}</span>
      )}
    </div>
  );
}
