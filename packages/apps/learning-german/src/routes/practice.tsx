import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { type Direction, FlashcardSession } from "#/components/flashcard-session.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select.tsx";
import { useCardStates, useSaveCardState, useVocab } from "#/hooks/use-data.ts";
import type { DictionaryWord } from "#/lib/vocab.ts";

export const Route = createFileRoute("/practice")({ component: PracticePage });

const ALL = "all";
const NEW_PER_SESSION = 10;

function PracticePage() {
  const { lists, words, wordsById } = useVocab();
  const cards = useCardStates();
  const saveCard = useSaveCardState();
  const [scope, setScope] = useState(ALL);
  const [direction, setDirection] = useState<Direction>("de-en");
  const [queue, setQueue] = useState<DictionaryWord[] | null>(null);

  const states = new Map((cards.data ?? []).map((c) => [c.wordId, c]));
  const scoped =
    scope === ALL ? words : (lists.find((l) => l.id === scope)?.wordIds ?? []).flatMap((id) => wordsById.get(id) ?? []);
  const now = Date.now();
  const due = scoped.filter((w) => {
    const s = states.get(w.id);
    return s && s.due <= now;
  });
  const fresh = scoped.filter((w) => !states.has(w.id)).slice(0, NEW_PER_SESSION);

  if (queue) {
    return (
      <>
        <PageHeader title="Practice" />
        <FlashcardSession
          words={queue}
          states={states}
          direction={direction}
          onRate={(state) => saveCard.mutate(state)}
          onDone={() => setQueue(null)}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Practice"
        description="Flashcards with spaced repetition: cards you find hard come back sooner."
      />
      <div className="space-y-4 rounded-xl border bg-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Select value={scope} onValueChange={setScope}>
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All words</SelectItem>
              {lists.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={direction} onValueChange={(v) => setDirection(v as Direction)}>
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="de-en">German → English</SelectItem>
              <SelectItem value="en-de">English → German</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground">
          {due.length} due · {fresh.length} new (max {NEW_PER_SESSION} per session)
        </p>
        <Button disabled={due.length + fresh.length === 0} onClick={() => setQueue([...due, ...fresh])}>
          Start session
        </Button>
      </div>
    </>
  );
}
