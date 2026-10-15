import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "#/components/ui/button.tsx";
import { applyTheme, readThemePreference, saveThemePreference, type ThemePreference } from "#/lib/theme.ts";

const order: ThemePreference[] = ["system", "light", "dark"];
const icons = { system: Monitor, light: Sun, dark: Moon } as const;
const labels = { system: "Theme: system", light: "Theme: light", dark: "Theme: dark" } as const;

/** Cycles system → light → dark. "system" follows the OS and reacts when it changes. */
export function ThemeToggle() {
  const [preference, setPreference] = useState(readThemePreference);

  useEffect(() => {
    if (preference !== "system") return;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [preference]);

  const Icon = icons[preference];
  const cycle = () => {
    const next = order[(order.indexOf(preference) + 1) % order.length];
    setPreference(next);
    saveThemePreference(next);
  };

  return (
    <Button variant="ghost" size="icon" onClick={cycle} aria-label={labels[preference]} title={labels[preference]}>
      <Icon className="size-5" />
    </Button>
  );
}
