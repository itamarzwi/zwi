import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Children, isValidElement, type ReactNode, useEffect, useRef } from "react";
import { useLessonPages } from "#/components/lesson/pages-context.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Progress } from "#/components/ui/progress.tsx";

/** One `##` section of a lesson. Created automatically by plugins/remark-lesson-pages.ts. */
export function LessonPage({ children }: { title: string; children?: ReactNode }) {
  return <>{children}</>;
}

/**
 * Shows one LessonPage at a time with progress and Back/Next. All pages stay mounted (only hidden)
 * so quiz answers survive navigating between pages.
 */
export function LessonPages({ children }: { children?: ReactNode }) {
  const lesson = useLessonPages();
  const pages = Children.toArray(children).filter(isValidElement<{ title: string }>);
  const total = pages.length;
  const current = Math.min(Math.max(lesson?.page ?? 1, 1), total);

  const setPageCount = lesson?.setPageCount;
  useEffect(() => setPageCount?.(total), [setPageCount, total]);

  const previous = useRef(current);
  useEffect(() => {
    if (previous.current !== current) window.scrollTo({ top: 0 });
    previous.current = current;
  }, [current]);

  if (!lesson) return <>{pages}</>;

  const multiple = total > 1;
  const isLast = current === total;
  const { nextLesson, footer } = lesson;
  const title = pages[current - 1]?.props.title;
  const back = () => lesson.goToPage(current - 1);
  const next = () => lesson.goToPage(current + 1);
  return (
    <>
      {multiple && (
        <div className="not-prose mb-6 space-y-2">
          <Progress value={(current / total) * 100} />
          <p className="text-sm text-muted-foreground">
            Step {current} of {total}
            {title && ` · ${title}`}
          </p>
        </div>
      )}
      {pages.map((page, index) => (
        <section key={page.key} hidden={index !== current - 1}>
          {page}
        </section>
      ))}
      {isLast && footer}
      <div className={`not-prose mt-auto flex justify-between gap-2 ${isLast && footer ? "pt-4" : "pt-8"}`}>
        {multiple ? (
          <Button variant="outline" className="rounded-lg bg-card" disabled={current === 1} onClick={back}>
            <ChevronLeft />
            Back
          </Button>
        ) : (
          <span />
        )}
        {!isLast && (
          <Button variant="outline" className="rounded-lg bg-card" onClick={next}>
            Next
            <ChevronRight />
          </Button>
        )}
        {isLast && nextLesson && (
          <Button asChild variant="outline" className="rounded-lg bg-card">
            <Link
              to="/lessons/$moduleId/$lessonId"
              params={{ moduleId: nextLesson.moduleId, lessonId: nextLesson.lessonId }}
            >
              Next lesson: {nextLesson.title}
              <ChevronRight />
            </Link>
          </Button>
        )}
      </div>
    </>
  );
}
