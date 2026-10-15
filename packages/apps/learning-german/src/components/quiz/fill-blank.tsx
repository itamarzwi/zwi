import { useState } from "react";
import { Input } from "#/components/ui/input.tsx";
import { cn } from "#/lib/utils.ts";
import { useQuizQuestion } from "./quiz-context.tsx";

type Props = {
  /** Use ___ to mark the blank, e.g. "Ich ___ aus Deutschland." */
  prompt: string;
  /** Accepted answers (case-insensitive, trimmed). */
  answer: string | string[];
  /** The English sentence the student is translating. Shown above the German sentence. */
  translation?: string;
  hint?: string;
};

const normalize = (value: string) => value.trim().toLowerCase();

export function FillBlank({ prompt, answer, translation, hint }: Props) {
  const { report, checked } = useQuizQuestion();
  const [value, setValue] = useState("");
  const accepted = (Array.isArray(answer) ? answer : [answer]).map(normalize);
  const [before, after] = prompt.split("___");
  const isCorrect = accepted.includes(normalize(value));

  return (
    <div className="not-prose my-4 rounded-xl border bg-card p-4">
      {translation && <p className="mb-2 text-sm text-muted-foreground">{translation}</p>}
      <div className="flex flex-wrap items-center gap-2">
        <span>{before}</span>
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            report(e.target.value.trim() ? accepted.includes(normalize(e.target.value)) : undefined);
          }}
          disabled={checked}
          className={cn("w-32", checked && (isCorrect ? "border-green-600" : "border-destructive"))}
          aria-label="Your answer"
        />
        <span>{after}</span>
      </div>
      {hint && <p className="mt-2 text-sm text-muted-foreground">Hint: {hint}</p>}
      {checked && isCorrect && <p className="mt-2 text-sm text-green-700 dark:text-green-400">Richtig!</p>}
      {checked && !isCorrect && (
        <p className="mt-2 text-sm text-destructive">Correct answer: {Array.isArray(answer) ? answer[0] : answer}</p>
      )}
    </div>
  );
}
