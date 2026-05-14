import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "#/lib/utils.ts";

export type ThemeMode = "light" | "dark" | "auto";

const ROW_REM = 2;

export const MODE_OPTIONS: {
  value: ThemeMode;
  label: string;
  description: string;
  Icon: typeof Sun;
}[] = [
  { value: "light", label: "Light", description: "Always use light appearance", Icon: Sun },
  { value: "dark", label: "Dark", description: "Always use dark appearance", Icon: Moon },
  { value: "auto", label: "System", description: "Match system preferences", Icon: Monitor },
];

function modeTriggerLabel(mode: ThemeMode): string {
  if (mode === "auto") {
    return "Theme: system. Expand to choose appearance.";
  }
  return `Theme: ${mode}. Expand to choose appearance.`;
}

type ThemePickerRailProps = {
  mode: ThemeMode;
  onSelect: (next: ThemeMode) => void;
};

export function ThemePickerRail({ mode, onSelect }: ThemePickerRailProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const groupLabelId = useId();

  const modeIndex = MODE_OPTIONS.findIndex((o) => o.value === mode);
  const safeIndex = modeIndex === -1 ? 2 : modeIndex;

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (e: PointerEvent) => {
      const el = rootRef.current;
      if (el && !el.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const translateYRem = open ? 0 : -safeIndex * ROW_REM;

  const onRowActivate = (value: ThemeMode) => {
    if (!open) {
      setOpen(true);
      return;
    }
    onSelect(value);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative size-8 shrink-0">
      <span id={groupLabelId} className="sr-only">
        {modeTriggerLabel(mode)}
        {open ? " Appearance options shown." : " Press an icon to expand options."}
      </span>
      <fieldset
        aria-labelledby={groupLabelId}
        className={cn(
          "box-border absolute top-0 left-0 z-[70] flex w-8 flex-col overflow-hidden border border-border bg-popover text-popover-foreground shadow-sm transition-[height,border-radius,box-shadow] duration-300 ease-out motion-reduce:duration-150",
          open ? "rounded-2xl shadow-md" : "rounded-full",
        )}
        style={{
          height: open ? `${MODE_OPTIONS.length * ROW_REM}rem` : `${ROW_REM}rem`,
        }}
      >
        <div
          className="flex flex-col transition-transform duration-300 ease-out motion-reduce:duration-150"
          style={{ transform: `translateY(${translateYRem}rem)` }}
        >
          {MODE_OPTIONS.map(({ value, label, description, Icon }) => {
            const selected = mode === value;
            return (
              <button
                key={value}
                type="button"
                title={description}
                aria-label={`${label}. ${description}`}
                aria-pressed={selected}
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground",
                  selected && "text-foreground",
                  selected && open && "bg-muted",
                )}
                onClick={() => onRowActivate(value)}
              >
                <Icon className="size-4" aria-hidden />
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
