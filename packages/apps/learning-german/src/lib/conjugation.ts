import { type Person, persons } from "#/storage/schemas.ts";

export type PresentTense = Record<Person, string>;

/** Pronoun labels for the conjugation table. */
export const personLabels: Record<Person, string> = {
  ich: "ich",
  du: "du",
  er: "er/sie/es",
  wir: "wir",
  ihr: "ihr",
  sie: "sie/Sie",
};

/**
 * Prefixes that are always separable. Longer ones first, so "zurück" wins over "zu".
 * durch-, über-, um-, unter-, wider- and wieder- are left out: they can be either
 * (übersetzen is inseparable as "to translate", separable as "to ferry across"),
 * so those need the checkbox ticked by hand.
 */
const separablePrefixes = [
  "zusammen",
  "herein",
  "heraus",
  "hinaus",
  "vorbei",
  "weiter",
  "zurück",
  "fest",
  "fort",
  "heim",
  "fern",
  "auf",
  "aus",
  "bei",
  "ein",
  "her",
  "hin",
  "los",
  "mit",
  "nach",
  "teil",
  "vor",
  "weg",
  "ab",
  "an",
  "zu",
].sort((a, b) => b.length - a.length);

/** Verbs that start like a separable verb but aren't one. */
const notSeparable = new Set(["antworten", "angeln", "zucken", "hinken", "abonnieren", "analysieren"]);

/** The separable prefix an infinitive most likely has: "aufwachen" -> "auf", "machen" -> undefined. */
export const guessSeparablePrefix = (infinitive: string) => {
  if (notSeparable.has(infinitive)) return undefined;
  // The rest must still look like a verb: "ab" + "en" alone isn't one.
  return separablePrefixes.find((p) => infinitive.startsWith(p) && /^.{2,}n$/.test(infinitive.slice(p.length)));
};

/**
 * The regular Präsens of an infinitive: "machen" -> mache, machst, macht, machen, macht, machen.
 * With a separable prefix the base verb is conjugated and the prefix goes after it:
 * "aufwachen", "auf" -> wache auf, wachst auf, …
 *
 * An authoring aid only (pre-filling the add-word form, drafting dictionary entries): stored
 * words always spell out all six forms.
 *
 * Handles the spelling rules every regular verb follows:
 * - an extra -e- before -st/-t when the stem ends in d/t or consonant + m/n (findest, atmet, öffnet),
 * - no extra -s- after s/ß/x/z (du heißt, du tanzt),
 * - -eln/-ern verbs (ich sammle, ich wandere, wir sammeln).
 *
 * It knows nothing about stem changes (fahren -> fährt), so check its output before using it.
 */
export const regularPresent = (infinitive: string, separablePrefix?: string): PresentTense => {
  if (separablePrefix && infinitive.startsWith(separablePrefix)) {
    const base = regularPresent(infinitive.slice(separablePrefix.length));
    return Object.fromEntries(persons.map((p) => [p, `${base[p]} ${separablePrefix}`])) as PresentTense;
  }
  const elnErn = /e[lr]n$/.test(infinitive);
  const stem = infinitive.endsWith("en") && !elnErn ? infinitive.slice(0, -2) : infinitive.slice(0, -1);
  const linkingE = /(?:[dt]|[^aeiouäöülrhmn][mn]|ch[mn])$/.test(stem) ? "e" : "";
  const st = /[sßxz]$/.test(stem) ? "t" : "st";
  return {
    // "sammeln" drops its -e- in ich (sammle); "wandern" keeps it and adds one (wandere).
    ich: infinitive.endsWith("eln") ? `${stem.slice(0, -2)}le` : `${stem}e`,
    du: `${stem}${linkingE}${st}`,
    er: `${stem}${linkingE}t`,
    wir: infinitive,
    ihr: `${stem}${linkingE}t`,
    sie: infinitive,
  };
};
