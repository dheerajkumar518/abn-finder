"use client";

import * as React from "react";
import { SunIcon, MoonIcon, LaptopIcon, CheckIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const themes = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: LaptopIcon },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // When mounted on client, now we can show the UI
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-md border bg-popover p-2 text-sm font-medium text-popover-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none transition-all",
          theme === "light"
            ? "border-slate-200 dark:border-slate-700"
            : "border-slate-700 dark:border-slate-200"
        )}
      >
        {theme === "light" ? (
          <SunIcon className="size-5" />
        ) : theme === "dark" ? (
          <MoonIcon className="size-5" />
        ) : (
          <LaptopIcon className="size-5" />
        )}
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[160px] bg-popover text-popover-foreground shadow-lg rounded-md border p-1.5 space-y-1.5"
        sideOffset={8}
      >
        {themes.map(({ value, label, icon: Icon }) => (
          <DropdownMenuRadioItem
            key={value}
            className={cn(
              "focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              theme === value && "bg-accent text-accent-foreground"
            )}
            value={value}
            onSelect={() => setTheme(value)}
          >
            <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
              {theme === value ? <CheckIcon className="size-4" /> : null}
            </span>
            <Icon className="size-4 mr-2" />
            {label}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
