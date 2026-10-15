import { Check } from "lucide-react";
import { Button } from "#/components/ui/button.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select.tsx";
import { useAddWordToList, useSetLearned } from "#/hooks/use-data.ts";
import type { WordList } from "#/lib/vocab.ts";

export function LearnedToggle({ wordId, learned }: { wordId: string; learned: boolean }) {
  const setLearned = useSetLearned();
  return (
    <Button
      variant={learned ? "default" : "outline"}
      size="sm"
      aria-pressed={learned}
      onClick={() => setLearned.mutate({ wordId, learned: !learned })}
    >
      {learned && <Check className="size-4" />}
      {learned ? "Learned" : "Mark as learned"}
    </Button>
  );
}

/** Lets the user put the word into any of their (non built-in) lists, including "My words". */
export function AddToList({ wordId, lists }: { wordId: string; lists: WordList[] }) {
  const addToList = useAddWordToList();
  const available = lists.filter((l) => !l.builtin && !l.wordIds.includes(wordId));
  if (available.length === 0) return null;

  return (
    <Select value="" onValueChange={(listId) => addToList.mutate({ listId, wordId })}>
      <SelectTrigger className="w-full sm:w-48" aria-label="Add to list">
        <SelectValue placeholder="Add to list…" />
      </SelectTrigger>
      <SelectContent>
        {available.map((l) => (
          <SelectItem key={l.id} value={l.id}>
            {l.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
