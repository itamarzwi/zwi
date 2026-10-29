import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "#/components/page-header.tsx";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "#/components/ui/accordion.tsx";
import { Button } from "#/components/ui/button.tsx";
import { Input } from "#/components/ui/input.tsx";
import { WordForm } from "#/components/word-form.tsx";
import { WordForms } from "#/components/word-forms.tsx";
import { WordTypeBadge } from "#/components/word-type-badge.tsx";
import { useCreateWord, useDeleteUserList, useRemoveWordFromList, useVocab } from "#/hooks/use-data.ts";
import { cn } from "#/lib/utils.ts";
import { displayGerman, formsPreview, matchesQuery } from "#/lib/vocab.ts";
import { MY_WORDS_ID } from "#/storage/repository.ts";

export const Route = createFileRoute("/vocab/$listId")({ component: ListPage });

function ListPage() {
  const { listId } = Route.useParams();
  const navigate = useNavigate();
  const { lists, wordsById, learned, isLoading } = useVocab();
  const createWord = useCreateWord();
  const removeFromList = useRemoveWordFromList();
  const deleteList = useDeleteUserList();
  const [query, setQuery] = useState("");

  const list = lists.find((l) => l.id === listId);
  if (!list) return isLoading ? null : <p>List not found.</p>;
  const listWords = list.wordIds.flatMap((id) => wordsById.get(id) ?? []);
  const results = listWords.filter((w) => matchesQuery(w, query));

  return (
    <>
      <p className="text-sm text-muted-foreground">
        <Link to="/vocab" className="hover:underline">
          Vocabulary
        </Link>
      </p>
      <PageHeader
        title={list.name}
        description={list.description}
        actions={
          !list.builtin &&
          list.id !== MY_WORDS_ID && (
            <Button
              variant="outline"
              onClick={() => deleteList.mutate(list.id, { onSuccess: () => navigate({ to: "/vocab" }) })}
            >
              Delete list
            </Button>
          )
        }
      />
      {!list.builtin && (
        <div className="mb-6">
          <WordForm onSubmit={(word) => createWord.mutate({ word, listId: list.id })} />
          <p className="mt-2 text-sm text-muted-foreground">
            To add an existing word, open it in{" "}
            <Link to="/words" className="underline">
              All words
            </Link>{" "}
            and use "Add to list".
          </p>
        </div>
      )}
      {listWords.length === 0 ? (
        <p className="text-muted-foreground">No words yet.</p>
      ) : (
        <>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search German or English"
            aria-label="Search words"
            className="mb-4"
          />
          {results.length === 0 ? (
            <p className="text-muted-foreground">No words found.</p>
          ) : (
            <Accordion type="multiple" className="gap-0 divide-y overflow-hidden rounded-xl border bg-card">
              {results.map((word) => (
                <AccordionItem key={word.id} value={word.id} className="rounded-none border-0 bg-transparent">
                  <AccordionTrigger className="items-center gap-3 px-4 py-3">
                    <span className="min-w-0 flex-1">
                      <span className="block">
                        <span className="text-base">{displayGerman(word)}</span>
                        <span className="ml-3 font-normal text-muted-foreground">{word.english.join(", ")}</span>
                      </span>
                      {formsPreview(word) && (
                        <span className="mt-0.5 block font-normal text-muted-foreground">{formsPreview(word)}</span>
                      )}
                    </span>
                    <span className="flex items-center gap-2">
                      {learned.has(word.id) && <Check className="size-4 text-green-600" aria-label="Learned" />}
                      <WordTypeBadge type={word.type} />
                    </span>
                  </AccordionTrigger>
                  <AccordionContent
                    className={cn(
                      "grid items-start gap-4 px-4 pb-4",
                      (word.plural || word.conjugation) && "sm:grid-cols-2",
                    )}
                  >
                    <WordForms word={word} />
                    <div className="space-y-4 mt-1">
                      {word.examples.length > 0 && (
                        <ul className="space-y-2">
                          {word.examples.map((example) => (
                            <li key={example.de}>
                              <p className="font-medium">{example.de}</p>
                              <p className="text-muted-foreground">{example.en}</p>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/words/$wordId" params={{ wordId: word.id }}>
                            Open word page
                          </Link>
                        </Button>
                        {!list.builtin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromList.mutate({ listId: list.id, wordId: word.id })}
                          >
                            <X />
                            Remove from list
                          </Button>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </>
      )}
    </>
  );
}
