import { Fragment } from "react";
import { cn } from "#/lib/utils.ts";
import { displayPerfect } from "#/lib/vocab.ts";
import type { Word } from "#/storage/schemas.ts";

/** The plural of a noun, or the conjugation table of a verb. Renders nothing for other words. */
export function WordForms({ word, className }: { word: Word; className?: string }) {
  if (word.plural) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        Plural: <span className="font-medium text-foreground">die {word.plural}</span>
      </p>
    );
  }
  if (!word.conjugation) return null;
  return (
    <dl
      className={cn(
        "grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 rounded-xl border bg-card px-4 py-3 text-sm",
        className,
      )}
    >
      {[
        ["Infinitiv", word.german],
        ["ich", word.conjugation.ich],
        ["er/sie/es", word.conjugation.er],
        ["Präteritum", word.conjugation.preterite],
        ["Perfekt", displayPerfect(word.conjugation.perfect)],
      ].map(([label, form]) => (
        <Fragment key={label}>
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="font-medium">{form}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
