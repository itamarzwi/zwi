import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { buildDictionary, buildLists } from "#/lib/vocab.ts";
import { useRepository } from "#/storage/repository-context.tsx";
import type { CardState, LessonProgress, UserList, Word } from "#/storage/schemas.ts";

const keys = {
  progress: ["progress"] as const,
  lists: ["user-lists"] as const,
  words: ["custom-words"] as const,
  states: ["word-states"] as const,
  cards: ["card-states"] as const,
};

export const useProgress = () => {
  const repo = useRepository();
  return useQuery({ queryKey: keys.progress, queryFn: () => repo.getProgress() });
};

export const useCardStates = () => {
  const repo = useRepository();
  return useQuery({ queryKey: keys.cards, queryFn: () => repo.listCardStates() });
};

/** The full dictionary (built-in + custom), all lists (built-in + user) and learned flags. */
export const useVocab = () => {
  const repo = useRepository();
  const lists = useQuery({ queryKey: keys.lists, queryFn: () => repo.listUserLists() });
  const words = useQuery({ queryKey: keys.words, queryFn: () => repo.listCustomWords() });
  const states = useQuery({ queryKey: keys.states, queryFn: () => repo.listWordStates() });

  const dictionary = buildDictionary(words.data ?? []);
  return {
    isLoading: lists.isLoading || words.isLoading || states.isLoading,
    words: dictionary,
    wordsById: new Map(dictionary.map((w) => [w.id, w])),
    lists: buildLists(lists.data ?? []),
    learned: new Set((states.data ?? []).filter((s) => s.learned).map((s) => s.wordId)),
  };
};

const useInvalidatingMutation = <TVars>(
  fn: (vars: TVars) => Promise<void>,
  invalidate: readonly (readonly string[])[],
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => Promise.all(invalidate.map((queryKey) => queryClient.invalidateQueries({ queryKey }))),
  });
};

export const useSetLessonProgress = () => {
  const repo = useRepository();
  return useInvalidatingMutation(
    ({ key, progress }: { key: string; progress: LessonProgress }) => repo.setLessonProgress(key, progress),
    [keys.progress],
  );
};

export const useClearLessonProgress = () => {
  const repo = useRepository();
  return useInvalidatingMutation((key: string) => repo.clearLessonProgress(key), [keys.progress]);
};

export const useSaveUserList = () => {
  const repo = useRepository();
  return useInvalidatingMutation((list: UserList) => repo.saveUserList(list), [keys.lists]);
};

export const useDeleteUserList = () => {
  const repo = useRepository();
  return useInvalidatingMutation((id: string) => repo.deleteUserList(id), [keys.lists]);
};

export const useAddWordToList = () => {
  const repo = useRepository();
  return useInvalidatingMutation(
    ({ listId, wordId }: { listId: string; wordId: string }) => repo.addWordToList(listId, wordId),
    [keys.lists],
  );
};

export const useRemoveWordFromList = () => {
  const repo = useRepository();
  return useInvalidatingMutation(
    ({ listId, wordId }: { listId: string; wordId: string }) => repo.removeWordFromList(listId, wordId),
    [keys.lists],
  );
};

/** Creates a custom word and puts it in a list in one step. */
export const useCreateWord = () => {
  const repo = useRepository();
  return useInvalidatingMutation(
    async ({ word, listId }: { word: Word; listId: string }) => {
      await repo.saveCustomWord(word);
      await repo.addWordToList(listId, word.id);
    },
    [keys.words, keys.lists],
  );
};

export const useDeleteCustomWord = () => {
  const repo = useRepository();
  return useInvalidatingMutation(
    (id: string) => repo.deleteCustomWord(id),
    [keys.words, keys.lists, keys.states, keys.cards],
  );
};

export const useSetLearned = () => {
  const repo = useRepository();
  return useInvalidatingMutation(
    ({ wordId, learned }: { wordId: string; learned: boolean }) =>
      repo.saveWordState({ wordId, learned, updatedAt: Date.now() }),
    [keys.states],
  );
};

export const useSaveCardState = () => {
  const repo = useRepository();
  return useInvalidatingMutation((state: CardState) => repo.saveCardState(state), [keys.cards]);
};
