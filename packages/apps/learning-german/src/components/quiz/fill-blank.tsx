import { useState } from "react";
import { Button } from "#/components/ui/button.tsx";
import { Input } from "#/components/ui/input.tsx";
import { cn } from "#/lib/utils.ts";
import { useQuizQuestion } from "./quiz-context.tsx";

type Props = {
  /** Use ___ to mark the blank, e.g. "Ich ___ aus Deutschland." */
  prompt: string;
  /** Accepted answers (case-insensitive, trimmed). */
  answer: string | string[];
  hint?: string;
};

const normalize = (value: string) => value.trim().toLowerCase();

export function FillBlank({ prompt, answer, hint }: Props) {
  const report = useQuizQuestion();
  const [value, setValue] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const accepted = (Array.isArray(answer) ? answer : [answer]).map(normalize);
  const [before, after] = prompt.split("___");

  const check = () => {
    if (!value.trim()) return;
    const correct = accepted.includes(normalize(value));
    setResult(correct ? "correct" : "wrong");
    report(correct);
  };

  return (
    <div className="not-prose my-4 rounded-xl border bg-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span>{before}</span>
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setResult(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && check()}
          className={cn("w-32", result === "correct" && "border-green-600", result === "wrong" && "border-destructive")}
          aria-label="Your answer"
        />
        <span>{after}</span>
        <Button type="button" size="sm" onClick={check}>
          Check
        </Button>
      </div>
      {hint && <p className="mt-2 text-sm text-muted-foreground">Hint: {hint}</p>}
      {result === "correct" && <p className="mt-2 text-sm text-green-700 dark:text-green-400">Richtig!</p>}
      {result === "wrong" && <p className="mt-2 text-sm text-destructive">Not quite, try again.</p>}
    </div>
  );
}
