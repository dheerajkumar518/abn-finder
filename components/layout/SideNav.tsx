"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Presentation } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/extract-abn", label: "Extract ABN", icon: Presentation },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex shrink-0 border-r bg-background"
      aria-label="Primary"
    >
      <nav className="flex h-screen sticky top-0 flex-col gap-2 p-4 w-full">
        <div className="px-2 pb-2">
          <span className="text-sm font-medium text-muted-foreground">
            ABN Finder
          </span>
        </div>
        <ul className="flex-1 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    active ? "bg-primary/10 text-primary" : "text-foreground"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      active ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <span className="text-pretty">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="pt-2 flex justify-center items-center border-t">
          <ThemeToggle />
        </div>
      </nav>
    </aside>
  );
}

export function AppTopNav() {
  const pathname = usePathname();
  return (
    <div className="md:hidden flex justify-between items-center border-b bg-background">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-2">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-accent"
              )}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
      <ThemeToggle />
    </div>
  );
}
