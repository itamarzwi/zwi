import type { ReactNode } from "react";
import { cn } from "#/lib/utils.ts";

const styles = {
  tip: "border-primary/40 bg-primary/5 dark:border-primary/50 dark:bg-primary/15",
  warning: "border-amber-500/50 bg-amber-500/10 dark:border-amber-500/60 dark:bg-amber-500/20",
} as const;

// The callout is not-prose, so markdown tables inside it need the prose table look restored by hand.
const tableClasses = cn(
  "[&_table]:text-left",
  "[&_thead]:border-b [&_thead]:border-foreground/30 [&_th]:font-semibold [&_th]:align-bottom",
  "[&_tbody_tr]:border-b [&_tbody_tr]:border-foreground/15 [&_tbody_tr:last-child]:border-b-0",
  "[&_th]:px-2 [&_th]:pb-2 [&_td]:p-2 [&_td:first-child]:pl-0 [&_td:last-child]:pr-0 [&_th:first-child]:pl-0 [&_th:last-child]:pr-0",
);

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
    <aside className={cn("not-prose my-4 rounded-xl border p-4 text-sm", tableClasses, styles[type])}>
      {title && <p className="mb-1 font-semibold">{title}</p>}
      <div className="space-y-2">{children}</div>
    </aside>
  );
}
