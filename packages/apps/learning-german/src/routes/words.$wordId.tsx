import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Fragment } from "react";
import { PageHeader } from "#/components/page-header.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { Button } from "#/components/ui/button.tsx";
import { AddToList, LearnedToggle } from "#/components/word-actions.tsx";
import { WordTypeBadge } from "#/components/word-type-badge.tsx";
import { useDeleteCustomWord, useRemoveWordFromList, useVocab } from "#/hooks/use-data.ts";
import { displayGerman, displayPerfect } from "#/lib/vocab.ts";

export const Route = createFileRoute("/words/$wordId")({ component: WordPage });

function WordPage() {
  const { wordId } = Route.useParams();
  const navigate = useNavigate();
  const { wordsById, lists, learned, isLoading } = useVocab();
  const removeFromList = useRemoveWordFromList();
  const deleteWord = useDeleteCustomWord();

  const word = wordsById.get(wordId);
  if (!word) return isLoading ? null : <p>Word not found.</p>;
  const memberOf = lists.filter((l) => l.wordIds.includes(word.id));

  console.log({ word });

  return (
    <>
      <p className="text-sm text-muted-foreground">
        <Link to="/words" className="hover:underline">
          All words
        </Link>
      </p>
      <PageHeader
        title={displayGerman(word)}
        description={word.english.join(", ")}
        actions={<WordTypeBadge type={word.type} />}
      />
      {word.plural && (
        <p className="mb-4 text-sm text-muted-foreground">
          Plural: <span className="font-medium text-foreground">die {word.plural}</span>
        </p>
      )}
      {word.conjugation && (
        <dl className="mb-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 rounded-xl border bg-card px-4 py-3 text-sm">
          {[
            ["Infinitiv", word.german],
            ["ich", word.conjugation.ich],
            ["er/sie/es", word.conjugation.er],
            ["Präteritum", word.conjugation.preterite],
            ["Perfekt", displayPerfect(word.conjugation.perfect)],
          ].map(([label, form]) => (
            <Fragment key={label}>
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="font-medium">{form}</dd>
            </Fragment>
          ))}
        </dl>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <LearnedToggle wordId={word.id} learned={learned.has(word.id)} />
        <AddToList wordId={word.id} lists={lists} />
      </div>

      <h2 className="mb-2 text-lg font-semibold">Examples</h2>
      {word.examples.length === 0 ? (
        <p className="text-sm text-muted-foreground">No example sentences.</p>
      ) : (
        <ul className="space-y-2">
          {word.examples.map((example) => (
            <li key={example.de} className="rounded-xl border bg-card px-4 py-3">
              <p className="font-medium">{example.de}</p>
              <p className="text-sm text-muted-foreground">{example.en}</p>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-6 mb-2 text-lg font-semibold">In lists</h2>
      {memberOf.length === 0 ? (
        <p className="text-sm text-muted-foreground">Not in any list yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {memberOf.map((list) => (
            <Badge key={list.id} variant="outline" className="gap-1 bg-card py-1">
              <Link to="/vocab/$listId" params={{ listId: list.id }} className="hover:underline">
                {list.name}
              </Link>
              {!list.builtin && (
                <button
                  type="button"
                  aria-label={`Remove from ${list.name}`}
                  onClick={() => removeFromList.mutate({ listId: list.id, wordId: word.id })}
                >
                  <X className="size-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}

      {!word.builtin && (
        <Button
          variant="outline"
          className="mt-8"
          onClick={() => deleteWord.mutate(word.id, { onSuccess: () => navigate({ to: "/words" }) })}
        >
          Delete this word
        </Button>
      )}
    </>
  );
}
