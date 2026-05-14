import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "#/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu.tsx";
import { cn } from "#/lib/utils.ts";

type ThemeMode = "light" | "dark" | "auto";

const getInitialMode = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "auto";
  }

  const stored = window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark" || stored === "auto") {
    return stored;
  }

  return "auto";
};

const applyThemeMode = (mode: ThemeMode) => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolved = mode === "auto" ? (prefersDark ? "dark" : "light") : mode;

  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(resolved);

  if (mode === "auto") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", mode);
  }

  document.documentElement.style.colorScheme = resolved;
};

const MODE_OPTIONS: {
  value: ThemeMode;
  label: string;
  description: string;
  Icon: typeof Sun;
}[] = [
  { value: "light", label: "Light", description: "Always use light appearance", Icon: Sun },
  { value: "dark", label: "Dark", description: "Always use dark appearance", Icon: Moon },
  { value: "auto", label: "System", description: "Match device appearance", Icon: Monitor },
];

function modeTriggerLabel(mode: ThemeMode): string {
  if (mode === "auto") {
    return "Theme: system. Open menu to choose appearance.";
  }
  return `Theme: ${mode}. Open menu to choose appearance.`;
}

function ThemeIcon({ mode, className }: { mode: ThemeMode; className?: string }) {
  const Icon = MODE_OPTIONS.find((o) => o.value === mode)?.Icon ?? Monitor;
  return <Icon className={cn("size-4", className)} aria-hidden />;
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("auto");

  useEffect(() => {
    const initialMode = getInitialMode();
    setMode(initialMode);
    applyThemeMode(initialMode);
  }, []);

  useEffect(() => {
    if (mode !== "auto") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyThemeMode("auto");

    media.addEventListener("change", onChange);
    return () => {
      media.removeEventListener("change", onChange);
    };
  }, [mode]);

  const selectMode = (next: ThemeMode) => {
    setMode(next);
    applyThemeMode(next);
    window.localStorage.setItem("theme", next);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="rounded-full"
          aria-label={modeTriggerLabel(mode)}
        >
          <ThemeIcon mode={mode} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="min-w-44 w-auto data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1"
      >
        <DropdownMenuLabel className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          Appearance
        </DropdownMenuLabel>
        {MODE_OPTIONS.map(({ value, label, description, Icon }) => (
          <DropdownMenuItem
            key={value}
            className="relative cursor-pointer gap-0 py-2.5 pr-9 pl-3"
            title={description}
            onSelect={(e) => {
              e.preventDefault();
              selectMode(value);
            }}
          >
            <span className="flex min-w-0 flex-1 items-center gap-2.5">
              <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="font-medium">{label}</span>
                <span className="wrap-break-word text-xs leading-snug font-normal text-muted-foreground">
                  {description}
                </span>
              </span>
            </span>
            <span className="pointer-events-none absolute top-1/2 right-2 flex size-4 -translate-y-1/2 items-center justify-center">
              {mode === value ? <Check className="size-4" aria-hidden /> : null}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
