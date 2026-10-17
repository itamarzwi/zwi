import { useState } from "react";
import { Button } from "#/components/ui/button.tsx";
import { cn } from "#/lib/utils.ts";
import { useQuizQuestion } from "./quiz-context.tsx";

type Props = {
  question: string;
  /** The English sentence the student is translating. Shown above the question. */
  translation?: string;
  options: string[];
  /** Index of the correct option, or an array of indexes when several options are correct (select all). */
  answer: number | number[];
  explanation?: string;
};

export function MultipleChoice({ question, translation, options, answer, explanation }: Props) {
  const { report, checked } = useQuizQuestion();
  const correctIndexes = Array.isArray(answer) ? answer : [answer];
  const multiple = Array.isArray(answer);
  const [picked, setPicked] = useState<number[]>([]);

  const pick = (index: number) => {
    if (checked) return;
    const next = multiple ? (picked.includes(index) ? picked.filter((i) => i !== index) : [...picked, index]) : [index];
    setPicked(next);
    report(
      next.length === 0
        ? undefined
        : next.length === correctIndexes.length && next.every((i) => correctIndexes.includes(i)),
    );
  };

  return (
    <div className="not-prose my-4 rounded-xl border bg-card p-4">
      {translation && <p className="mb-2 text-sm text-muted-foreground">{translation}</p>}
      <p className="mb-3 font-medium">{question}</p>
      {multiple && <p className="-mt-2 mb-3 text-sm text-muted-foreground">Select all that apply.</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => (
          <Button
            key={option}
            type="button"
            variant="outline"
            onClick={() => pick(index)}
            disabled={checked}
            className={cn(
              // Disabled once checked, but keep the green/red result colors at full strength.
              "disabled:opacity-100",
              !checked && picked.includes(index) && "border-primary bg-primary/10",
              checked &&
                correctIndexes.includes(index) &&
                "border-green-600 bg-green-600/10 text-green-700 dark:text-green-400",
              checked &&
                picked.includes(index) &&
                !correctIndexes.includes(index) &&
                "border-destructive bg-destructive/10 text-destructive",
              // Options that were neither picked nor correct fade out.
              checked && !picked.includes(index) && !correctIndexes.includes(index) && "disabled:opacity-50",
            )}
          >
            {option}
          </Button>
        ))}
      </div>
      {checked && explanation && <p className="mt-3 text-sm text-muted-foreground">{explanation}</p>}
    </div>
  );
}
