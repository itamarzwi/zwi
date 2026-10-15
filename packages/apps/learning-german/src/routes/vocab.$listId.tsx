import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { PageHeader } from "#/components/page-header.tsx";
import { Button } from "#/components/ui/button.tsx";
import { WordForm } from "#/components/word-form.tsx";
import { WordTypeBadge } from "#/components/word-type-badge.tsx";
import { useCreateWord, useDeleteUserList, useRemoveWordFromList, useVocab } from "#/hooks/use-data.ts";
import { displayGerman } from "#/lib/vocab.ts";
import { MY_WORDS_ID } from "#/storage/repository.ts";

export const Route = createFileRoute("/vocab/$listId")({ component: ListPage });

function ListPage() {
  const { listId } = Route.useParams();
  const navigate = useNavigate();
  const { lists, wordsById, learned, isLoading } = useVocab();
  const createWord = useCreateWord();
  const removeFromList = useRemoveWordFromList();
  const deleteList = useDeleteUserList();

  const list = lists.find((l) => l.id === listId);
  if (!list) return isLoading ? null : <p>List not found.</p>;
  const listWords = list.wordIds.flatMap((id) => wordsById.get(id) ?? []);

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
        <ul className="divide-y rounded-xl border bg-card">
          {listWords.map((word) => (
            <li key={word.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <Link to="/words/$wordId" params={{ wordId: word.id }} className="min-w-0 flex-1 hover:underline">
                <span className="font-medium">{displayGerman(word)}</span>
                <span className="ml-3 text-muted-foreground">{word.english.join(", ")}</span>
              </Link>
              <div className="flex items-center gap-2">
                {learned.has(word.id) && <Check className="size-4 text-green-600" aria-label="Learned" />}
                <WordTypeBadge type={word.type} />
                {!list.builtin && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${word.german} from list`}
                    onClick={() => removeFromList.mutate({ listId: list.id, wordId: word.id })}
                  >
                    <X className="size-4" />
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
