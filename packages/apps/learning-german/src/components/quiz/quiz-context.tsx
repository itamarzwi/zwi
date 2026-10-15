import { createContext, type ReactNode, useCallback, useContext, useEffect, useId, useMemo, useState } from "react";

type QuizState = {
  /** questionId -> was the latest answer correct (undefined = unanswered) */
  results: Record<string, boolean | undefined>;
  /** Number of questions currently mounted in the lesson. */
  total: number;
  register: (id: string) => () => void;
  report: (id: string, correct: boolean) => void;
};

const QuizContext = createContext<QuizState | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [results, setResults] = useState<Record<string, boolean | undefined>>({});
  const [registered, setRegistered] = useState<string[]>([]);

  const register = useCallback((id: string) => {
    setRegistered((r) => [...r, id]);
    return () => setRegistered((r) => r.filter((x) => x !== id));
  }, []);
  const report = useCallback((id: string, correct: boolean) => setResults((r) => ({ ...r, [id]: correct })), []);

  const value = useMemo(
    () => ({ results, total: registered.length, register, report }),
    [results, registered, register, report],
  );
  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export const useQuizState = () => {
  const quiz = useContext(QuizContext);
  if (!quiz) throw new Error("useQuizState must be used inside <QuizProvider>");
  const correct = Object.values(quiz.results).filter(Boolean).length;
  const answered = Object.values(quiz.results).filter((r) => r !== undefined).length;
  return { total: quiz.total, correct, answered };
};

/** For a single question component: registers it with the lesson and returns a reporter. */
export const useQuizQuestion = () => {
  const id = useId();
  const quiz = useContext(QuizContext);
  const register = quiz?.register;
  useEffect(() => register?.(id), [register, id]);
  return useCallback((correct: boolean) => quiz?.report(id, correct), [quiz?.report, id]);
};
