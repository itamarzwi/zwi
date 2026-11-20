import type { Level } from "#/storage/schemas.ts";
import { type BuiltinWordId, builtinWords } from "./words.ts";

export type BuiltinList = {
  id: string;
  name: string;
  description: string;
  wordIds: BuiltinWordId[];
};

/** One list per level, with every built-in word of that level. */
const levelList = (level: Level, description: string): BuiltinList => ({
  id: `level-${level.toLowerCase()}`,
  name: `All ${level} words`,
  description,
  wordIds: builtinWords.filter((w) => w.level === level).map((w) => w.id as BuiltinWordId),
});

export const builtinLists: BuiltinList[] = [
  levelList("A1", "Every word from the Goethe A1 word list."),
  levelList("A2", "Every word the Goethe A2 word list adds on top of A1."),
  {
    id: "numbers-1-10",
    name: "Numbers 1-10",
    description: "Counting from one to ten.",
    wordIds: ["eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn"],
  },
  {
    id: "basics",
    name: "Basics & greetings",
    description: "First words and phrases.",
    wordIds: [
      "hallo",
      "guten-morgen",
      "guten-tag",
      "guten-abend",
      "tschüss",
      "danke",
      "bitte",
      "ja",
      "nein",
      "name",
      "frau",
      "mann",
      "kind",
      "land",
      "stadt",
    ],
  },
  {
    id: "basic-verbs",
    name: "Basic verbs",
    description: "Very common verbs in their infinitive form.",
    wordIds: ["sein", "haben", "heißen", "kommen", "wohnen", "machen", "lernen", "sprechen"],
  },
  {
    id: "irregular-perfekt-participles",
    name: "Irregular Partizip II forms",
    description: "Verbs with an irregular Partizip II",
    wordIds: [
      "essen",
      "trinken",
      "sehen",
      "lesen",
      "schreiben",
      "schlafen",
      "finden",
      "nehmen",
      "sprechen",
      "treffen",
      "gehen",
      "fahren",
      "fliegen",
      "kommen",
      "bleiben",
      "werden",
      "wachsen",
      "sterben",
      "stehen",
      "verstehen",
      "bekommen",
      "verschlafen",
      "wissen",
      "kennen",
      "denken",
      "bringen",
    ],
  },
  {
    id: "separable-verbs",
    name: "Separable verbs",
    description: "Verbs whose prefix moves to the end of the sentence.",
    wordIds: ["aufwachen", "einschlafen"],
  },
];
