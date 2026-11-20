import { Fragment } from "react";
import { personLabels } from "#/lib/conjugation.ts";
import { cn } from "#/lib/utils.ts";
import { displayPerfect } from "#/lib/vocab.ts";
import { persons, type Word } from "#/storage/schemas.ts";

/** The plural of a noun, or the conjugation table of a verb. Renders nothing for other words. */
export function WordForms({ word, className }: { word: Word; className?: string }) {
  if (word.plural) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        Plural: <span className="font-medium text-foreground">die {word.plural}</span>
      </p>
    );
  }
  const c = word.conjugation;
  if (!c) return null;
  // Infinitiv, then the Präsens table, then the past forms, separated by rules.
  const groups = [
    [["Infinitiv", word.german]],
    persons.map((p) => [personLabels[p], c.present[p]]),
    [
      ["Präteritum", c.preterite],
      ["Perfekt", displayPerfect(c.perfect)],
    ],
  ];
  return (
    <dl
      className={cn(
        "grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 rounded-xl border bg-card px-4 py-3 text-sm",
        className,
      )}
    >
      {groups.map((rows, i) => (
        <Fragment key={rows[0][0]}>
          {i > 0 && <hr className="col-span-2 my-1" />}
          {rows.map(([label, form]) => (
            <Fragment key={label}>
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="font-medium">{form}</dd>
            </Fragment>
          ))}
        </Fragment>
      ))}
    </dl>
  );
}
