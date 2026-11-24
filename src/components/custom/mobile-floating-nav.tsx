"use client";

import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { navMainItems } from "./navigation-items";

export function MobileFloatingNav() {
  const pathname = useLocation().pathname;

  const isScrollable = navMainItems.length > 5;

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 z-50 mx-auto w-[calc(100%-24px)] max-w-xl md:hidden"
      style={{
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)",
      }}
    >
      <div
        className={cn(
          "border-border/70 flex items-center rounded-2xl border",
          "bg-background/95 p-2 shadow-[0_8px_32px_rgba(0,0,0,0.16)]",
          "backdrop-blur-xl",
          isScrollable
            ? "scrollbar-none overflow-x-auto overscroll-x-contain"
            : "justify-around",
        )}
      >
        {navMainItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            item.url === "/"
              ? pathname === "/"
              : pathname === item.url || pathname.startsWith(`${item.url}/`);

          return (
            <Link
              key={item.url}
              to={item.url}
              aria-label={item.title}
              aria-current={isActive ? "page" : undefined}
              title={item.title}
              className={cn(
                "group flex shrink-0 flex-col items-center justify-center",
                "gap-1 rounded-xl px-3 py-2",
                "text-muted-foreground transition-colors duration-200",
                "hover:bg-accent hover:text-accent-foreground",
                isScrollable ? "min-w-[72px]" : "min-w-0 flex-1",
                isActive &&
                  "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
              )}
            >
              <Icon
                className={cn(
                  "size-5 shrink-0 transition-transform duration-200",
                  isActive && "scale-110",
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />

              <span
                className={cn(
                  "max-w-full truncate text-[10px] leading-tight font-medium",
                  isActive && "font-semibold",
                )}
              >
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
