import type { BuiltinWordId } from "./dictionary.ts";

export type BuiltinList = {
  id: string;
  name: string;
  description: string;
  wordIds: BuiltinWordId[];
};

export const builtinLists: BuiltinList[] = [
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
    name: "Irregular Perfekt participles",
    description: "Verbs with an irregular Perfekt participle",
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
    ],
  },
];
