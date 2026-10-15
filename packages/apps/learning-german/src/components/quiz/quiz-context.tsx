import { createContext, type ReactNode, useCallback, useContext, useEffect, useId, useMemo, useState } from "react";

type QuizState = {
  /** questionId -> is the current answer correct (undefined = unanswered). Hidden from the user until `checked`. */
  results: Record<string, boolean | undefined>;
  /** True once the user pressed "Check answers"; answers are locked and results shown. */
  checked: boolean;
  check: () => void;
  /** Number of questions currently mounted in the lesson. */
  total: number;
  register: (id: string) => () => void;
  report: (id: string, correct: boolean | undefined) => void;
};

const QuizContext = createContext<QuizState | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [results, setResults] = useState<Record<string, boolean | undefined>>({});
  const [checked, setChecked] = useState(false);
  const [registered, setRegistered] = useState<string[]>([]);

  const register = useCallback((id: string) => {
    setRegistered((r) => [...r, id]);
    return () => setRegistered((r) => r.filter((x) => x !== id));
  }, []);
  const report = useCallback(
    (id: string, correct: boolean | undefined) => setResults((r) => ({ ...r, [id]: correct })),
    [],
  );
  const check = useCallback(() => setChecked(true), []);

  const value = useMemo(
    () => ({ results, checked, check, total: registered.length, register, report }),
    [results, checked, check, registered, register, report],
  );
  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export const useQuizState = () => {
  const quiz = useContext(QuizContext);
  if (!quiz) throw new Error("useQuizState must be used inside <QuizProvider>");
  const correct = Object.values(quiz.results).filter(Boolean).length;
  const answered = Object.values(quiz.results).filter((r) => r !== undefined).length;
  return { total: quiz.total, correct, answered, checked: quiz.checked, check: quiz.check };
};

/** For a single question component: registers it with the lesson. `report(undefined)` marks it unanswered. */
export const useQuizQuestion = () => {
  const id = useId();
  const quiz = useContext(QuizContext);
  const register = quiz?.register;
  useEffect(() => register?.(id), [register, id]);
  const report = useCallback((correct: boolean | undefined) => quiz?.report(id, correct), [quiz?.report, id]);
  return { report, checked: quiz?.checked ?? false };
};
