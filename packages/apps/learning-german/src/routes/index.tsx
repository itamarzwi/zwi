import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "#/components/page-header.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card.tsx";
import { Progress } from "#/components/ui/progress.tsx";
import { useCardStates, useProgress } from "#/hooks/use-data.ts";
import { lessons } from "#/lessons/registry.ts";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const progress = useProgress();
  const cards = useCardStates();

  const done = lessons.filter((l) => progress.data?.lessons[l.key]).length;
  const next = lessons.find((l) => !progress.data?.lessons[l.key]);
  const now = Date.now();
  const dueCount = (cards.data ?? []).filter((c) => c.due <= now).length;

  return (
    <>
      <PageHeader title="Willkommen!" description="Pick up where you left off." />
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              <Link to="/lessons" className="hover:underline">
                Lessons
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={lessons.length ? (done / lessons.length) * 100 : 0} />
            <p className="text-sm text-muted-foreground">
              {done} of {lessons.length} completed
            </p>
            {next ? (
              <Button asChild>
                <Link to="/lessons/$moduleId/$lessonId" params={{ moduleId: next.moduleId, lessonId: next.lessonId }}>
                  {done === 0 ? "Start" : "Continue"}: {next.title}
                </Link>
              </Button>
            ) : (
              <p className="text-sm">All lessons done. 🎉</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{dueCount} cards due for review</p>
            <Button asChild variant="outline">
              <Link to="/practice">Open practice</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
