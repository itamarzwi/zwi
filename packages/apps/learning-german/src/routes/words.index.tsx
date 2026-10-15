import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "#/components/page-header.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs.tsx";
import { WordForm } from "#/components/word-form.tsx";
import { WordTypeBadge } from "#/components/word-type-badge.tsx";
import { useCreateWord, useVocab } from "#/hooks/use-data.ts";
import { displayGerman, matchesQuery } from "#/lib/vocab.ts";
import { MY_WORDS_ID } from "#/storage/repository.ts";

export const Route = createFileRoute("/words/")({ component: WordsPage });

type Filter = "all" | "learned" | "not-learned";

function WordsPage() {
  const { words, learned } = useVocab();
  const createWord = useCreateWord();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const results = words
    .filter((w) => matchesQuery(w, query))
    .filter((w) => filter === "all" || (filter === "learned") === learned.has(w.id))
    .sort((a, b) => a.german.localeCompare(b.german, "de"));

  return (
    <>
      <PageHeader title="All words" description="Look up any word, mark it as learned, and add it to a list." />
      <div className="mb-4 space-y-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search German or English"
          aria-label="Search words"
        />
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="learned">Learned</TabsTrigger>
            <TabsTrigger value="not-learned">Not learned</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {results.length === 0 ? (
        <p className="text-muted-foreground">No words found.</p>
      ) : (
        <ul className="divide-y rounded-xl border bg-card">
          {results.map((word) => (
            <li key={word.id}>
              <Link
                to="/words/$wordId"
                params={{ wordId: word.id }}
                className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-accent/50"
              >
                <span>
                  <span className="font-medium">{displayGerman(word)}</span>
                  <span className="ml-3 text-muted-foreground">{word.english.join(", ")}</span>
                </span>
                <span className="flex items-center gap-2">
                  <WordTypeBadge type={word.type} />
                  {learned.has(word.id) && <Check className="size-4 text-green-600" aria-label="Learned" />}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <h2 className="mt-8 mb-3 text-lg font-semibold">Add your own word</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        New words are added to "My words". You can put them in other lists afterwards.
      </p>
      <WordForm onSubmit={(word) => createWord.mutate({ word, listId: MY_WORDS_ID })} />
    </>
  );
}
