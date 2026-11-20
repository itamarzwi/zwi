import type { Person } from "#/storage/schemas.ts";

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
 * The regular Präsens of an infinitive: "machen" -> mache, machst, macht, machen, macht, machen.
 * An authoring aid only (pre-filling the add-word form, drafting dictionary entries): stored
 * words always spell out all six forms.
 *
 * Handles the spelling rules every regular verb follows:
 * - an extra -e- before -st/-t when the stem ends in d/t or consonant + m/n (findest, atmet, öffnet),
 * - no extra -s- after s/ß/x/z (du heißt, du tanzt),
 * - -eln/-ern verbs (ich sammle, ich wandere, wir sammeln).
 *
 * It knows nothing about stem changes (fahren -> fährt) or separable prefixes, so check its
 * output before using it.
 */
export const regularPresent = (infinitive: string): PresentTense => {
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
