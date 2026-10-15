import { builtinWords } from "#/data/dictionary.ts";
import { builtinLists } from "#/data/lists.ts";
import { MY_WORDS_ID, MY_WORDS_NAME } from "#/storage/repository.ts";
import type { UserList, Word } from "#/storage/schemas.ts";

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

export const matchesQuery = (word: Word, query: string) => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [word.german, word.plural ?? "", ...word.english].some((t) => t.toLowerCase().includes(q));
};
