import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  deleteField,
  doc,
  type Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  type WriteBatch,
  where,
  writeBatch,
} from "firebase/firestore";
import type { z } from "zod";
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

/**
 * Layout, all under `users/{uid}`:
 * - `data/progress`: one doc, `{ lessons: { [lessonKey]: LessonProgress } }`
 * - `words/{wordId}`: custom words
 * - `lists/{listId}`: user lists
 * - `wordStates/{wordId}` and `cards/{wordId}`: one doc per word, so devices never overwrite
 *   each other's reviews of different words.
 */
type CollectionName = "words" | "lists" | "wordStates" | "cards";

/**
 * Firestore only resolves a write once the server acknowledges it, which never happens offline.
 * The local cache applies the write right away, so don't wait for the server, just report failures.
 */
const fireAndForget = (write: Promise<void>) => {
  write.catch((error: unknown) => console.error("Firestore write failed", error));
};

const parseAll = <T>(docs: { data: () => unknown }[], schema: z.ZodType<T>): T[] =>
  docs.flatMap((d) => {
    const parsed = schema.safeParse(d.data());
    return parsed.success ? [parsed.data] : [];
  });

const createRefs = (db: Firestore, uid: string) => ({
  progress: () => doc(db, "users", uid, "data", "progress"),
  collection: (name: CollectionName) => collection(db, "users", uid, name),
  doc: (name: CollectionName, id: string) => doc(db, "users", uid, name, id),
});

const readProgress = async (refs: ReturnType<typeof createRefs>): Promise<Progress> => {
  const parsed = progressSchema.safeParse((await getDoc(refs.progress())).data());
  return parsed.success ? parsed.data : { lessons: {} };
};

const readAll = async <T>(refs: ReturnType<typeof createRefs>, name: CollectionName, schema: z.ZodType<T>) =>
  parseAll((await getDocs(refs.collection(name))).docs, schema);

export const createFirestoreRepository = (db: Firestore, uid: string): Repository => {
  const refs = createRefs(db, uid);

  return {
    getProgress: () => readProgress(refs),

    setLessonProgress: async (lessonKey: string, progress: LessonProgress) => {
      // Keys of a nested object passed to setDoc are taken literally, so "/" or "." in a key is fine.
      fireAndForget(setDoc(refs.progress(), { lessons: { [lessonKey]: progress } }, { merge: true }));
    },

    clearLessonProgress: async (lessonKey: string) => {
      fireAndForget(setDoc(refs.progress(), { lessons: { [lessonKey]: deleteField() } }, { merge: true }));
    },

    listCustomWords: () => readAll(refs, "words", wordSchema),
    saveCustomWord: async (word: Word) => {
      fireAndForget(setDoc(refs.doc("words", word.id), word));
    },
    deleteCustomWord: async (wordId: string) => {
      const listsWithWord = await getDocs(query(refs.collection("lists"), where("wordIds", "array-contains", wordId)));
      const batch = writeBatch(db);
      batch.delete(refs.doc("words", wordId));
      batch.delete(refs.doc("cards", wordId));
      batch.delete(refs.doc("wordStates", wordId));
      for (const list of listsWithWord.docs) batch.update(list.ref, { wordIds: arrayRemove(wordId) });
      fireAndForget(batch.commit());
    },

    listUserLists: async () => (await readAll(refs, "lists", userListSchema)).sort((a, b) => a.createdAt - b.createdAt),
    saveUserList: async (list: UserList) => {
      fireAndForget(setDoc(refs.doc("lists", list.id), list));
    },
    deleteUserList: async (listId: string) => {
      if (listId === MY_WORDS_ID) throw new Error(`"${MY_WORDS_NAME}" cannot be deleted`);
      fireAndForget(deleteDoc(refs.doc("lists", listId)));
    },
    addWordToList: async (listId: string, wordId: string) => {
      const ref = refs.doc("lists", listId);
      if ((await getDoc(ref)).exists()) {
        fireAndForget(updateDoc(ref, { wordIds: arrayUnion(wordId) }));
        return;
      }
      if (listId !== MY_WORDS_ID) throw new Error(`Unknown list: ${listId}`);
      const myWords: UserList = { id: MY_WORDS_ID, name: MY_WORDS_NAME, wordIds: [wordId], createdAt: Date.now() };
      fireAndForget(setDoc(ref, myWords));
    },
    removeWordFromList: async (listId: string, wordId: string) => {
      fireAndForget(updateDoc(refs.doc("lists", listId), { wordIds: arrayRemove(wordId) }));
    },

    listWordStates: () => readAll(refs, "wordStates", wordStateSchema),
    saveWordState: async (state: WordState) => {
      fireAndForget(setDoc(refs.doc("wordStates", state.wordId), state));
    },

    listCardStates: () => readAll(refs, "cards", cardStateSchema),
    saveCardState: async (state: CardState) => {
      fireAndForget(setDoc(refs.doc("cards", state.wordId), state));
    },
  };
};

/** Everything a signed-out user has in localStorage. */
export interface LocalSnapshot {
  progress: Progress;
  words: Word[];
  lists: UserList[];
  wordStates: WordState[];
  cards: CardState[];
}

const isNewer = <T>(local: T, remote: T | undefined, time: (value: T) => number) =>
  remote === undefined || time(local) > time(remote);

/** Firestore allows at most 500 writes per batch. */
const BATCH_LIMIT = 500;

/**
 * Merges data from a signed-out session into the account, so signing in never loses anything.
 * Lists are unioned, and for progress, learned flags and cards the newer entry wins.
 */
export const importIntoFirestore = async (db: Firestore, uid: string, local: LocalSnapshot) => {
  const refs = createRefs(db, uid);
  const [progress, lists, wordStates, cards] = await Promise.all([
    readProgress(refs),
    readAll(refs, "lists", userListSchema),
    readAll(refs, "wordStates", wordStateSchema),
    readAll(refs, "cards", cardStateSchema),
  ]);
  const remoteLists = new Map(lists.map((l) => [l.id, l]));
  const remoteStates = new Map(wordStates.map((s) => [s.wordId, s]));
  const remoteCards = new Map(cards.map((c) => [c.wordId, c]));

  const writes: ((batch: WriteBatch) => void)[] = [];

  const newerLessons = Object.fromEntries(
    Object.entries(local.progress.lessons).filter(([key, lesson]) =>
      isNewer(lesson, progress.lessons[key], (l) => l.completedAt),
    ),
  );
  if (Object.keys(newerLessons).length > 0) {
    writes.push((b) => b.set(refs.progress(), { lessons: newerLessons }, { merge: true }));
  }
  for (const word of local.words) writes.push((b) => b.set(refs.doc("words", word.id), word));
  for (const list of local.lists) {
    const ref = refs.doc("lists", list.id);
    if (remoteLists.has(list.id)) {
      if (list.wordIds.length > 0) writes.push((b) => b.update(ref, { wordIds: arrayUnion(...list.wordIds) }));
    } else {
      writes.push((b) => b.set(ref, list));
    }
  }
  for (const state of local.wordStates) {
    if (isNewer(state, remoteStates.get(state.wordId), (s) => s.updatedAt)) {
      writes.push((b) => b.set(refs.doc("wordStates", state.wordId), state));
    }
  }
  for (const card of local.cards) {
    if (isNewer(card, remoteCards.get(card.wordId), (c) => c.lastReviewedAt)) {
      writes.push((b) => b.set(refs.doc("cards", card.wordId), card));
    }
  }

  // Awaited (unlike normal writes): local data is only cleared once the server has it.
  for (let i = 0; i < writes.length; i += BATCH_LIMIT) {
    const batch = writeBatch(db);
    for (const write of writes.slice(i, i + BATCH_LIMIT)) write(batch);
    await batch.commit();
  }
};
