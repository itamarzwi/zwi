import type { ReactNode } from "react";

/** A German sentence with its English translation. Usage: <Example de="Ich heiße Anna." en="My name is Anna." /> */
export function Example({ de, en, note }: { de: string; en: string; note?: ReactNode }) {
  return (
    <div className="not-prose my-3 rounded-xl border bg-card px-4 py-3">
      <p className="font-medium">{de}</p>
      <p className="text-sm text-muted-foreground">{en}</p>
      {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}
