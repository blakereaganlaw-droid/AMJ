"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_NAV_ITEMS } from "@/lib/constants/app";
import { NavIcon } from "./NavIcon";
import { cn } from "@/lib/utils/cn";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-[var(--card-border)] bg-card px-2 py-2 lg:hidden"
      aria-label="Mobile navigation"
    >
      {MOBILE_NAV_ITEMS.map((item) => {
        const isMore = item.href === "/reminders";
        const active =
          pathname === item.href ||
          pathname.startsWith(`${item.href}/`) ||
          (isMore &&
            ["/tasks", "/goals", "/calendar", "/settings"].some(
              (p) => pathname === p || pathname.startsWith(`${p}/`)
            ));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 rounded-lg py-2 text-xs font-medium",
              active ? "text-sage" : "text-muted"
            )}
            aria-current={active ? "page" : undefined}
          >
            <NavIcon name={item.icon} className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
