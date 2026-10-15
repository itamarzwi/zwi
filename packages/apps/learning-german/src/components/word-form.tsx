import { type FormEvent, useState } from "react";
import { Button } from "#/components/ui/button.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Label } from "#/components/ui/label.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select.tsx";
import type { Article, Word, WordType } from "#/storage/schemas.ts";

const NO_ARTICLE = "none";
const types: WordType[] = ["noun", "verb", "adjective", "adverb", "phrase", "number", "other"];

export function WordForm({ onSubmit }: { onSubmit: (word: Word) => void }) {
  const [german, setGerman] = useState("");
  const [english, setEnglish] = useState("");
  const [article, setArticle] = useState<string>(NO_ARTICLE);
  const [type, setType] = useState<WordType>("noun");
  const [exampleDe, setExampleDe] = useState("");
  const [exampleEn, setExampleEn] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const meanings = english
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);
    if (!german.trim() || meanings.length === 0) return;
    const hasExample = exampleDe.trim() && exampleEn.trim();
    onSubmit({
      id: crypto.randomUUID(),
      german: german.trim(),
      english: meanings,
      article: type === "noun" && article !== NO_ARTICLE ? (article as Article) : undefined,
      type,
      examples: hasExample ? [{ de: exampleDe.trim(), en: exampleEn.trim() }] : [],
    });
    setGerman("");
    setEnglish("");
    setArticle(NO_ARTICLE);
    setExampleDe("");
    setExampleEn("");
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl border bg-card p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="german">German</Label>
          <Input id="german" value={german} onChange={(e) => setGerman(e.target.value)} placeholder="Haus" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="english">English (comma-separated)</Label>
          <Input id="english" value={english} onChange={(e) => setEnglish(e.target.value)} placeholder="house, home" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as WordType)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {types.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Article</Label>
          <Select value={article} onValueChange={setArticle} disabled={type !== "noun"}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_ARTICLE}>-</SelectItem>
              <SelectItem value="der">der</SelectItem>
              <SelectItem value="die">die</SelectItem>
              <SelectItem value="das">das</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="example-de">Example sentence (optional)</Label>
          <Input
            id="example-de"
            value={exampleDe}
            onChange={(e) => setExampleDe(e.target.value)}
            placeholder="Das Haus ist groß."
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="example-en">Translation</Label>
          <Input
            id="example-en"
            value={exampleEn}
            onChange={(e) => setExampleEn(e.target.value)}
            placeholder="The house is big."
          />
        </div>
      </div>
      <Button type="submit">Add word</Button>
    </form>
  );
}
