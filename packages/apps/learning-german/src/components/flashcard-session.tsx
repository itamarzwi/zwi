import { useMemo, useState } from "react";
import { Button } from "#/components/ui/button.tsx";
import { Progress } from "#/components/ui/progress.tsx";
import { formatInterval, type Rating, review } from "#/lib/srs.ts";
import { type DictionaryWord, displayGerman, displayPerfect } from "#/lib/vocab.ts";
import type { CardState } from "#/storage/schemas.ts";

/** "perfect" quizzes a verb's infinitive → its Perfekt (only for verbs that have one). */
export type Direction = "de-en" | "en-de" | "perfect";

type Props = {
  words: DictionaryWord[];
  states: Map<string, CardState>;
  direction: Direction;
  onRate: (state: CardState) => void;
  onDone: () => void;
};

const ratings: { rating: Rating; label: string }[] = [
  { rating: "again", label: "Again" },
  { rating: "hard", label: "Hard" },
  { rating: "good", label: "Good" },
  { rating: "easy", label: "Easy" },
];

export function FlashcardSession({ words, states, direction, onRate, onDone }: Props) {
  // Snapshot the queue so the session doesn't reshuffle while ratings are saved.
  const queue = useMemo(() => words, [words]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [now] = useState(() => Date.now());

  const word = queue[index];
  if (!word) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <p className="text-lg font-semibold">Session complete 🎉</p>
        <p className="mt-1 text-muted-foreground">{queue.length} cards reviewed.</p>
        <Button className="mt-4" onClick={onDone}>
          Back to practice
        </Button>
      </div>
    );
  }

  const german = displayGerman(word);
  const english = word.english.join(", ");
  const [front, back] =
    direction === "perfect" && word.perfect
      ? [german, displayPerfect(word.perfect)]
      : direction === "en-de"
        ? [english, german]
        : [german, english];

  const rate = (rating: Rating) => {
    onRate(review(states.get(word.id), word.id, rating, Date.now()));
    setRevealed(false);
    setIndex((i) => i + 1);
  };

  return (
    <div className="space-y-4">
      <Progress value={(index / queue.length) * 100} />
      <p className="text-sm text-muted-foreground">
        Card {index + 1} of {queue.length}
      </p>
      <button
        type="button"
        onClick={() => setRevealed(true)}
        className="flex min-h-48 w-full flex-col items-center justify-center rounded-xl border bg-card p-8 text-center"
      >
        <span className="text-3xl font-semibold">{front}</span>
        {revealed ? (
          <span className="mt-4 text-2xl text-primary">{back}</span>
        ) : (
          <span className="mt-4 text-sm text-muted-foreground">Tap to reveal</span>
        )}
      </button>
      {revealed && (
        <div className="grid grid-cols-4 gap-2">
          {ratings.map(({ rating, label }) => {
            const next = review(states.get(word.id), word.id, rating, now);
            return (
              <Button
                key={rating}
                variant={rating === "good" ? "default" : "outline"}
                onClick={() => rate(rating)}
                className="h-auto flex-col py-2"
              >
                <span>{label}</span>
                <span className="text-xs opacity-70">{formatInterval(now, next.due)}</span>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
