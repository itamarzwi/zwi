import type { Article, Example, Word, WordType } from "#/storage/schemas.ts";

/** A dictionary entry before it gets its id (the key it's stored under) and level (the file it's in). */
export type Entry = Omit<Word, "id" | "level">;

/** ich, du, er/sie/es, wir, ihr, sie/Sie. */
type PresentForms = [ich: string, du: string, er: string, wir: string, ihr: string, sie: string];
/** The Perfekt as it's said in the 3rd person: "hat gemacht", "ist gegangen". */
type PerfectForm = `${"hat" | "ist"} ${string}`;

const meanings = (english: string | string[]) => (Array.isArray(english) ? english : [english]);

/** An example sentence written by a person. */
export const ex = (de: string, en: string): Example => ({ de, en });
/** An example sentence written by an AI. It's shown with an "AI-generated" mark. */
export const aiEx = (de: string, en: string): Example => ({ de, en, aiGenerated: true });

/** `plural` is the plural without article ("Äpfel"), or null for nouns without one. */
export const noun = (
  article: Article,
  german: string,
  plural: string | null,
  english: string | string[],
  ...examples: Example[]
): Entry => ({
  german,
  article,
  ...(plural && { plural }),
  type: "noun",
  english: meanings(english),
  examples,
});

const conjugated = (
  german: string,
  english: string | string[],
  [ich, du, er, wir, ihr, sie]: PresentForms,
  preterite: string,
  perfect: PerfectForm,
  examples: Example[],
  separablePrefix?: string,
): Entry => {
  const [auxiliary, ...participle] = perfect.split(" ");
  return {
    german,
    ...(separablePrefix && { separablePrefix }),
    conjugation: {
      present: { ich, du, er, wir, ihr, sie },
      preterite,
      perfect: { auxiliary: auxiliary === "hat" ? "haben" : "sein", participle: participle.join(" ") },
    },
    type: "verb",
    english: meanings(english),
    examples,
  };
};

/** Every form is spelled out: verb("machen", "to do", ["mache", …], "machte", "hat gemacht", ex(…)). */
export const verb = (
  german: string,
  english: string | string[],
  present: PresentForms,
  preterite: string,
  perfect: PerfectForm,
  ...examples: Example[]
) => conjugated(german, english, present, preterite, perfect, examples);

/** Separable verbs, with their forms split as they're said: "wache auf", "wachte auf", "ist aufgewacht". */
export const sepVerb = (
  prefix: string,
  german: string,
  english: string | string[],
  present: PresentForms,
  preterite: string,
  perfect: PerfectForm,
  ...examples: Example[]
) => conjugated(german, english, present, preterite, perfect, examples, prefix);

/** Anything that isn't a noun or a verb. */
export const word = (
  type: Exclude<WordType, "noun" | "verb">,
  german: string,
  english: string | string[],
  ...examples: Example[]
): Entry => ({ german, type, english: meanings(english), examples });
