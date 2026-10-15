import { z } from "zod";
import { MY_WORDS_ID, MY_WORDS_NAME, type Repository } from "./repository.ts";
import {
  type CardState,
  cardStateSchema,
  type LessonProgress,
  type Progress,
  progressSchema,
  type UserList,
  userListSchema,
  type Word,
  type WordState,
  wordSchema,
  wordStateSchema,
} from "./schemas.ts";

const PREFIX = "learning-german:v2:";

const listsSchema = z.array(userListSchema);
const wordsSchema = z.array(wordSchema);
const cardsSchema = z.array(cardStateSchema);
const statesSchema = z.array(wordStateSchema);

const read = <T>(key: string, schema: z.ZodType<T>, fallback: T): T => {
  const raw = localStorage.getItem(PREFIX + key);
  if (raw === null) return fallback;
  try {
    const parsed = schema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown) => {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
};

const readProgress = (): Progress => read("progress", progressSchema, { lessons: {} });

export const createLocalStorageRepository = (): Repository => ({
  getProgress: async () => readProgress(),

  setLessonProgress: async (lessonKey: string, progress: LessonProgress) => {
    write("progress", { lessons: { ...readProgress().lessons, [lessonKey]: progress } });
  },

  clearLessonProgress: async (lessonKey: string) => {
    const { [lessonKey]: _removed, ...rest } = readProgress().lessons;
    write("progress", { lessons: rest });
  },

  listCustomWords: async () => read("words", wordsSchema, []),
  saveCustomWord: async (word: Word) => {
    const words = read("words", wordsSchema, []);
    write("words", [...words.filter((w) => w.id !== word.id), word]);
  },
  deleteCustomWord: async (wordId: string) => {
    write(
      "words",
      read("words", wordsSchema, []).filter((w) => w.id !== wordId),
    );
    write(
      "lists",
      read("lists", listsSchema, []).map((l) => ({ ...l, wordIds: l.wordIds.filter((id) => id !== wordId) })),
    );
    write(
      "cards",
      read("cards", cardsSchema, []).filter((c) => c.wordId !== wordId),
    );
    write(
      "word-states",
      read("word-states", statesSchema, []).filter((s) => s.wordId !== wordId),
    );
  },

  listUserLists: async () => read("lists", listsSchema, []),
  saveUserList: async (list: UserList) => {
    const lists = read("lists", listsSchema, []);
    write(
      "lists",
      lists.some((l) => l.id === list.id) ? lists.map((l) => (l.id === list.id ? list : l)) : [...lists, list],
    );
  },
  deleteUserList: async (listId: string) => {
    if (listId === MY_WORDS_ID) throw new Error(`"${MY_WORDS_NAME}" cannot be deleted`);
    write(
      "lists",
      read("lists", listsSchema, []).filter((l) => l.id !== listId),
    );
  },
  addWordToList: async (listId: string, wordId: string) => {
    const lists = read("lists", listsSchema, []);
    const existing = lists.find((l) => l.id === listId);
    if (!existing && listId !== MY_WORDS_ID) throw new Error(`Unknown list: ${listId}`);
    if (!existing) {
      write("lists", [...lists, { id: MY_WORDS_ID, name: MY_WORDS_NAME, wordIds: [wordId], createdAt: Date.now() }]);
      return;
    }
    if (existing.wordIds.includes(wordId)) return;
    write(
      "lists",
      lists.map((l) => (l.id === listId ? { ...l, wordIds: [...l.wordIds, wordId] } : l)),
    );
  },
  removeWordFromList: async (listId: string, wordId: string) => {
    write(
      "lists",
      read("lists", listsSchema, []).map((l) =>
        l.id === listId ? { ...l, wordIds: l.wordIds.filter((id) => id !== wordId) } : l,
      ),
    );
  },

  listWordStates: async () => read("word-states", statesSchema, []),
  saveWordState: async (state: WordState) => {
    const states = read("word-states", statesSchema, []);
    write("word-states", [...states.filter((s) => s.wordId !== state.wordId), state]);
  },

  listCardStates: async () => read("cards", cardsSchema, []),
  saveCardState: async (state: CardState) => {
    const cards = read("cards", cardsSchema, []);
    write("cards", [...cards.filter((c) => c.wordId !== state.wordId), state]);
  },
});
