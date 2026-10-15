import type { CardState, LessonProgress, Progress, UserList, Word, WordState } from "./schemas.ts";

/** Id of the general-purpose list any word can be added to. Created on first use. */
export const MY_WORDS_ID = "my-words";
export const MY_WORDS_NAME = "My words";

/**
 * Everything the app persists goes through this interface. All methods are async so the
 * localStorage implementation can later be swapped for an HTTP/DB-backed one (with accounts)
 * without touching any UI code. Lesson content and the built-in dictionary are NOT stored
 * here; they ship with the app.
 */
export interface Repository {
  getProgress(): Promise<Progress>;
  setLessonProgress(lessonKey: string, progress: LessonProgress): Promise<void>;
  clearLessonProgress(lessonKey: string): Promise<void>;

  /** Words the user created themselves. Built-in words are not stored. */
  listCustomWords(): Promise<Word[]>;
  saveCustomWord(word: Word): Promise<void>;
  /** Also removes the word from every list and deletes its learned flag and card. */
  deleteCustomWord(wordId: string): Promise<void>;

  listUserLists(): Promise<UserList[]>;
  saveUserList(list: UserList): Promise<void>;
  /** Deletes the list only, never the words in it. */
  deleteUserList(listId: string): Promise<void>;
  /** Adds a word to a list (any word, built-in or custom). Creates "My words" if needed. */
  addWordToList(listId: string, wordId: string): Promise<void>;
  removeWordFromList(listId: string, wordId: string): Promise<void>;

  listWordStates(): Promise<WordState[]>;
  saveWordState(state: WordState): Promise<void>;

  listCardStates(): Promise<CardState[]>;
  saveCardState(state: CardState): Promise<void>;
}
