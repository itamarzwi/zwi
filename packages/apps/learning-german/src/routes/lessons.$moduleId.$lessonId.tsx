import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { type ComponentType, lazy, Suspense, useMemo, useState } from "react";
import { LessonPagesContext } from "#/components/lesson/pages-context.tsx";
import { QuizProvider, useQuizState } from "#/components/quiz/quiz-context.tsx";
import { Button } from "#/components/ui/button.tsx";
import { useClearLessonProgress, useProgress, useSetLessonProgress } from "#/hooks/use-data.ts";
import { findLesson, type Lesson, nextLesson } from "#/lessons/registry.ts";

export const Route = createFileRoute("/lessons/$moduleId/$lessonId")({
  loader: ({ params }) => {
    const lesson = findLesson(params.moduleId, params.lessonId);
    if (!lesson) throw notFound();
    return lesson;
  },
  validateSearch: (search: Record<string, unknown>): { page?: number } => {
    const page = Math.floor(Number(search.page));
    return page > 1 ? { page } : {};
  },
  component: LessonPage,
  notFoundComponent: () => <p>Lesson not found.</p>,
});

const contentCache = new Map<string, ComponentType>();
const getContent = (lesson: Lesson) => {
  let Content = contentCache.get(lesson.key);
  if (!Content) {
    Content = lazy(lesson.Content);
    contentCache.set(lesson.key, Content);
  }
  return Content;
};

function LessonPage() {
  const lesson = Route.useLoaderData();
  const Content = getContent(lesson);
  const [attempt, setAttempt] = useState(0);
  const [, setPageCount] = useState(0);
  const { page = 1 } = Route.useSearch();
  const navigate = Route.useNavigate();

  const pages = useMemo(
    () => ({
      page,
      setPageCount,
      goToPage: (next: number) => navigate({ search: { page: next > 1 ? next : undefined } }),
      footer: <LessonFooter lesson={lesson} onRetry={() => setAttempt((a) => a + 1)} />,
      nextLesson: nextLesson(lesson),
    }),
    [page, navigate, lesson],
  );

  return (
    <article className="flex flex-1 flex-col">
      <p className="text-sm text-muted-foreground">
        <Link to="/lessons" className="hover:underline">
          Lessons
        </Link>
      </p>
      <h1 className="mb-6 text-3xl font-bold tracking-tight">{lesson.title}</h1>
      <QuizProvider key={`${lesson.key}-${attempt}`}>
        <LessonPagesContext.Provider value={pages}>
          <div className="prose flex max-w-none flex-1 flex-col dark:prose-invert prose-h2:mt-0 prose-h2:mb-3 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-table:my-0">
            <Suspense fallback={<p>Loading…</p>}>
              <Content />
            </Suspense>
          </div>
        </LessonPagesContext.Provider>
      </QuizProvider>
    </article>
  );
}

function LessonFooter({ lesson, onRetry }: { lesson: Lesson; onRetry: () => void }) {
  const { total, correct, answered, checked, check } = useQuizState();
  const progress = useProgress();
  const setProgress = useSetLessonProgress();
  const clearProgress = useClearLessonProgress();
  const completed = progress.data?.lessons[lesson.key];
  const save = (quiz: { correct: number; total: number } | undefined) =>
    setProgress.mutate({ key: lesson.key, progress: { completedAt: completed?.completedAt ?? Date.now(), quiz } });
  // Checking the quiz saves the score (and completes the lesson, since a score can't exist without it).
  const submit = () => {
    check();
    save({ correct, total });
  };

  return (
    <div className="mt-10 space-y-3 rounded-xl border bg-card p-4">
      {checked && (
        <p className="text-sm text-muted-foreground">
          Quiz: {correct} of {total} correct
        </p>
      )}
      {completed && <p className="text-sm font-medium">Lesson completed ✓</p>}
      <div className="flex flex-wrap gap-2">
        {total > 0 && !checked && (
          <Button onClick={submit} disabled={answered < total}>
            Check answers
          </Button>
        )}
        {!completed && <Button onClick={() => save(undefined)}>Mark as completed</Button>}
        {completed && (
          <Button variant="outline" onClick={() => clearProgress.mutate(lesson.key)}>
            Mark as not completed
          </Button>
        )}
        {checked && (
          <Button variant="outline" onClick={onRetry}>
            Retry quiz
          </Button>
        )}
      </div>
    </div>
  );
}
