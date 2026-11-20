import type { Level, Word } from "#/storage/schemas.ts";
import a1 from "./a1.ts";
import a2 from "./a2.ts";
import b1 from "./b1.ts";
import type { Entry } from "./build.ts";

/**
 * The built-in dictionary, one file per level.
 * A word's level is the file it lives in. Levels come from the Goethe-Institut word lists
 * (Start Deutsch 1 / Goethe-Zertifikat A2 / B1): a word belongs to the lowest list it's on.
 * The few words on no list say so in a comment next to them.
 *
 * Ids are the dictionary form in lowercase, with "-" for spaces ("guten-morgen"). When a noun
 * and another word share a spelling, the noun gets its article as a prefix ("das-essen").
 *
 * Casing rule: `german` is the dictionary form. Nouns are capitalised, everything else is
 * lowercase, even greetings ("hallo", "guten Morgen"). The exceptions are formal "Sie" and
 * phrases that start with a noun ("Rad fahren").
 * Capital letters at the start of a sentence only appear in the examples.
 *
 * This module is big: app code only reaches it through the dynamic import in `useVocab`
 * (hooks/use-data.ts), never statically, so it stays out of the main bundle.
 */
const files = [
  ["A1", a1],
  ["A2", a2],
  ["B1", b1],
] as const satisfies readonly (readonly [Level, Record<string, Entry>])[];

type KeysOf<T> = T extends readonly [Level, infer R] ? keyof R : never;
export type BuiltinWordId = KeysOf<(typeof files)[number]>;

// Flattened, not merged: an id defined in two files shows up twice and fails the uniqueness test.
export const builtinWords: Word[] = files.flatMap(([level, entries]) =>
  Object.entries(entries).map(([id, entry]: [string, Entry]) => ({ id, level, ...entry })),
);
