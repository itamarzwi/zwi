import { builtinWords } from "#/data/dictionary.ts";
import { builtinLists } from "#/data/lists.ts";
import { MY_WORDS_ID, MY_WORDS_NAME } from "#/storage/repository.ts";
import type { Perfect, UserList, Word } from "#/storage/schemas.ts";

export type DictionaryWord = Word & { builtin: boolean };

export type WordList = {
  id: string;
  name: string;
  description?: string;
  builtin: boolean;
  wordIds: string[];
};

export const buildDictionary = (customWords: Word[]): DictionaryWord[] => [
  ...builtinWords.map((w) => ({ ...w, builtin: true })),
  ...customWords.map((w) => ({ ...w, builtin: false })),
];

/** Built-in lists, then "My words" (always present), then the user's other lists. */
export const buildLists = (userLists: UserList[]): WordList[] => {
  const myWords = userLists.find((l) => l.id === MY_WORDS_ID);
  const others = userLists.filter((l) => l.id !== MY_WORDS_ID);
  return [
    ...builtinLists.map((l) => ({ ...l, builtin: true })),
    {
      id: MY_WORDS_ID,
      name: MY_WORDS_NAME,
      description: "Any word you want to keep track of.",
      builtin: false,
      wordIds: myWords?.wordIds ?? [],
    },
    ...others.map((l) => ({ id: l.id, name: l.name, builtin: false, wordIds: l.wordIds })),
  ];
};

/** "der Name" for nouns, plain German otherwise. */
export const displayGerman = (word: Pick<Word, "german" | "article">) =>
  word.article ? `${word.article} ${word.german}` : word.german;

/** "hat gemacht" / "ist gekommen": the Perfekt as dictionaries list it. */
export const displayPerfect = ({ auxiliary, participle }: Perfect) =>
  `${auxiliary === "haben" ? "hat" : "ist"} ${participle}`;

/** "bin · ist · ist gewesen" for verbs, "die Namen" for nouns: the forms at a glance, without labels. */
export const formsPreview = (word: Word) => {
  if (word.plural) return `die ${word.plural}`;
  const c = word.conjugation;
  return c && [c.ich, c.er, displayPerfect(c.perfect)].join(" · ");
};

export const matchesQuery = (word: Word, query: string) => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const c = word.conjugation;
  const forms = c ? [c.ich, c.er, c.preterite, c.perfect.participle] : [];
  return [word.german, word.plural ?? "", ...forms, ...word.english].some((t) => t.toLowerCase().includes(q));
};
