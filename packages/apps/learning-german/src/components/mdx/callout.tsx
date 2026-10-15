import type { ReactNode } from "react";
import { cn } from "#/lib/utils.ts";

const styles = {
  tip: "border-primary/40 bg-primary/5 dark:border-primary/50 dark:bg-primary/15",
  warning: "border-amber-500/50 bg-amber-500/10 dark:border-amber-500/60 dark:bg-amber-500/20",
} as const;

export function Callout({
  type = "tip",
  title,
  children,
}: {
  type?: keyof typeof styles;
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside className={cn("not-prose my-4 rounded-xl border p-4 text-sm", styles[type])}>
      {title && <p className="mb-1 font-semibold">{title}</p>}
      <div className="space-y-2">{children}</div>
    </aside>
  );
}
