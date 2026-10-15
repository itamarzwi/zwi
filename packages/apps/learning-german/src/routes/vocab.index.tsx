import { createFileRoute, Link } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";
import { PageHeader } from "#/components/page-header.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Card, CardDescription, CardHeader, CardTitle } from "#/components/ui/card.tsx";
import { Input } from "#/components/ui/input.tsx";
import { useSaveUserList, useVocab } from "#/hooks/use-data.ts";

export const Route = createFileRoute("/vocab/")({ component: VocabPage });

function VocabPage() {
  const { lists } = useVocab();
  const saveList = useSaveUserList();
  const [name, setName] = useState("");

  const create = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    saveList.mutate({ id: crypto.randomUUID(), name: name.trim(), wordIds: [], createdAt: Date.now() });
    setName("");
  };

  return (
    <>
      <PageHeader
        title="Vocabulary"
        description="Word lists from the lessons, plus your own."
        actions={
          <Button asChild variant="outline">
            <Link to="/words">Look up words</Link>
          </Button>
        }
      />
      <form onSubmit={create} className="mb-6 flex gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New list name, e.g. Food"
          aria-label="New list name"
        />
        <Button type="submit">Create list</Button>
      </form>
      <div className="grid gap-4 sm:grid-cols-2">
        {lists.map((list) => (
          <Link key={list.id} to="/vocab/$listId" params={{ listId: list.id }}>
            <Card className="h-full transition-colors hover:bg-accent/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  {list.name}
                  <Badge variant={list.builtin ? "secondary" : "default"}>{list.builtin ? "Built-in" : "Yours"}</Badge>
                </CardTitle>
                <CardDescription>
                  {list.wordIds.length} words
                  {list.description && ` · ${list.description}`}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
