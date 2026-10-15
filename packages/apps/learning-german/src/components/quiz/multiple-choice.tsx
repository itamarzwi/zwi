import { useState } from "react";
import { Button } from "#/components/ui/button.tsx";
import { cn } from "#/lib/utils.ts";
import { useQuizQuestion } from "./quiz-context.tsx";

type Props = {
  question: string;
  options: string[];
  /** Index of the correct option. */
  answer: number;
  explanation?: string;
};

export function MultipleChoice({ question, options, answer, explanation }: Props) {
  const report = useQuizQuestion();
  const [picked, setPicked] = useState<number | null>(null);

  const pick = (index: number) => {
    if (picked !== null) return;
    setPicked(index);
    report(index === answer);
  };

  return (
    <div className="not-prose my-4 rounded-xl border bg-card p-4">
      <p className="mb-3 font-medium">{question}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => (
          <Button
            key={option}
            type="button"
            variant="outline"
            onClick={() => pick(index)}
            className={cn(
              picked !== null &&
                index === answer &&
                "border-green-600 bg-green-600/10 text-green-700 dark:text-green-400",
              picked === index && index !== answer && "border-destructive bg-destructive/10 text-destructive",
            )}
          >
            {option}
          </Button>
        ))}
      </div>
      {picked !== null && explanation && <p className="mt-3 text-sm text-muted-foreground">{explanation}</p>}
    </div>
  );
}
