import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ChevronRight } from "lucide-react";
import { PageHeader } from "#/components/page-header.tsx";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "#/components/ui/accordion.tsx";
import { useProgress } from "#/hooks/use-data.ts";
import { modules } from "#/lessons/modules.ts";
import { lessonsInModule } from "#/lessons/registry.ts";
import { cn } from "#/lib/utils.ts";

export const Route = createFileRoute("/lessons/")({ component: LessonsPage });

function LessonsPage() {
  const progress = useProgress();
  const completedKeys = progress.data?.lessons;
  if (!completedKeys) return null;

  const rows = modules.map((module, i) => {
    // Number by course order, then show unfinished lessons first and finished ones below, newest first.
    const lessons = lessonsInModule(module.id).map((lesson, index) => ({
      lesson,
      number: index + 1,
      done: Boolean(completedKeys[lesson.key]),
    }));
    const todo = lessons.filter((l) => !l.done);
    const done = lessons.filter((l) => l.done).reverse();
    return { module, moduleNumber: i + 1, rows: [...todo, ...done], doneCount: done.length };
  });
  // Modules with something left to do start open.
  const openModules = rows.filter((r) => r.doneCount < r.rows.length).map((r) => r.module.id);

  return (
    <>
      <PageHeader title="Lessons" description="Go back to any lesson at any time." />
      <Accordion type="multiple" defaultValue={openModules}>
        {rows.map(({ module, moduleNumber, rows: lessonRows, doneCount }) => (
          <AccordionItem key={module.id} value={module.id}>
            <AccordionTrigger>
              <span>
                <span className="block text-base">
                  Module {moduleNumber}: {module.title}
                </span>
                <span className="block font-normal text-muted-foreground">{module.description}</span>
                <span className="mt-1 block text-xs font-normal text-muted-foreground">
                  {doneCount} of {lessonRows.length} completed
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ol className="divide-y border-t">
                {lessonRows.map(({ lesson, number, done }) => (
                  <li key={lesson.key}>
                    <Link
                      to="/lessons/$moduleId/$lessonId"
                      params={{ moduleId: lesson.moduleId, lessonId: lesson.lessonId }}
                      className={cn(
                        "group relative grid cursor-pointer grid-cols-[3rem_1fr_auto] items-stretch transition hover:z-10 hover:scale-[1.01] hover:bg-primary/10 hover:shadow-md active:scale-100 active:bg-primary/20 active:shadow-none",
                        done && "bg-foreground/[0.03]",
                      )}
                    >
                      <span
                        className={cn(
                          "flex items-center justify-center border-r font-medium tabular-nums",
                          done && "opacity-60",
                        )}
                      >
                        {number}
                      </span>
                      <span className={cn("px-3 py-3", done && "opacity-60")}>
                        <span className={cn("block font-medium group-hover:text-primary", !done && "text-foreground")}>
                          {lesson.title}
                        </span>
                        <span className="block text-sm text-muted-foreground">{lesson.summary}</span>
                      </span>
                      <span className="flex items-center gap-2 pr-3">
                        {done && <Check className="size-5 text-green-600" aria-label="Completed" />}
                        <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
