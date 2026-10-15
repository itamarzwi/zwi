import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { type ComponentType, lazy, Suspense, useState } from "react";
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

  return (
    <article>
      <p className="text-sm text-muted-foreground">
        <Link to="/lessons" className="hover:underline">
          Lessons
        </Link>
      </p>
      <h1 className="mb-6 text-3xl font-bold tracking-tight">{lesson.title}</h1>
      <QuizProvider key={`${lesson.key}-${attempt}`}>
        <div className="prose max-w-none dark:prose-invert">
          <Suspense fallback={<p>Loading…</p>}>
            <Content />
          </Suspense>
        </div>
        <LessonFooter lesson={lesson} onRetry={() => setAttempt((a) => a + 1)} />
      </QuizProvider>
    </article>
  );
}

function LessonFooter({ lesson, onRetry }: { lesson: Lesson; onRetry: () => void }) {
  const { total, correct, answered } = useQuizState();
  const progress = useProgress();
  const setProgress = useSetLessonProgress();
  const clearProgress = useClearLessonProgress();
  const completed = progress.data?.lessons[lesson.key];
  const next = nextLesson(lesson);

  return (
    <div className="mt-10 space-y-3 rounded-xl border bg-card p-4">
      {total > 0 && (
        <p className="text-sm text-muted-foreground">
          Quiz: {correct} correct, {answered} of {total} answered
          {completed?.quiz && ` · last saved score ${completed.quiz.correct}/${completed.quiz.total}`}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() =>
            setProgress.mutate({
              key: lesson.key,
              progress: { completedAt: Date.now(), quiz: total > 0 ? { correct, total } : completed?.quiz },
            })
          }
        >
          {completed ? "Update completion" : "Mark as completed"}
        </Button>
        {completed && (
          <Button variant="ghost" onClick={() => clearProgress.mutate(lesson.key)}>
            Mark as not completed
          </Button>
        )}
        {total > 0 && (
          <Button variant="outline" onClick={onRetry}>
            Retry quiz
          </Button>
        )}
        {next && (
          <Button asChild variant="outline" className="ml-auto">
            <Link to="/lessons/$moduleId/$lessonId" params={{ moduleId: next.moduleId, lessonId: next.lessonId }}>
              Next: {next.title}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
