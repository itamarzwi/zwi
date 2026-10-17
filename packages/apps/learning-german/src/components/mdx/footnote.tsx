import type { ReactNode } from "react";

/** Small muted text for notes that belong to a marker like `*` earlier on the page. */
export function Footnote({ children }: { children: ReactNode }) {
  return <p className="text-xs text-muted-foreground">{children}</p>;
}
