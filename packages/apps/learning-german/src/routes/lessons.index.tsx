import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PageHeader } from "#/components/page-header.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card.tsx";
import { useProgress } from "#/hooks/use-data.ts";
import { modules } from "#/lessons/modules.ts";
import { lessonsInModule } from "#/lessons/registry.ts";

export const Route = createFileRoute("/lessons/")({ component: LessonsPage });

function LessonsPage() {
  const progress = useProgress();

  return (
    <>
      <PageHeader title="Lessons" description="Go back to any lesson at any time." />
      <div className="space-y-6">
        {modules.map((module, i) => (
          <Card key={module.id}>
            <CardHeader>
              <CardTitle>
                Module {i + 1}: {module.title}
              </CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {lessonsInModule(module.id).map((lesson) => {
                const completed = progress.data?.lessons[lesson.key];
                return (
                  <Link
                    key={lesson.key}
                    to="/lessons/$moduleId/$lessonId"
                    params={{ moduleId: lesson.moduleId, lessonId: lesson.lessonId }}
                    className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-accent"
                  >
                    <span>
                      <span className="font-medium">{lesson.title}</span>
                      <span className="block text-sm text-muted-foreground">{lesson.summary}</span>
                    </span>
                    {completed && <Check className="size-5 text-green-600" aria-label="Completed" />}
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
