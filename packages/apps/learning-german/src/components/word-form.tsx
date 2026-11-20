import { type FormEvent, useState } from "react";
import { Button } from "#/components/ui/button.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Label } from "#/components/ui/label.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select.tsx";
import { personLabels, regularPresent } from "#/lib/conjugation.ts";
import { type Article, type Auxiliary, type Person, persons, type Word, type WordType } from "#/storage/schemas.ts";

const NO_ARTICLE = "none";
const types: WordType[] = ["noun", "verb", "adjective", "adverb", "phrase", "number", "other"];
const examplePresent = regularPresent("machen");

export function WordForm({ onSubmit }: { onSubmit: (word: Word) => void }) {
  const [german, setGerman] = useState("");
  const [english, setEnglish] = useState("");
  const [article, setArticle] = useState<string>(NO_ARTICLE);
  const [type, setType] = useState<WordType>("noun");
  /** Only the Präsens forms the user typed; the rest follow the regular pattern of `german`. */
  const [editedPresent, setEditedPresent] = useState<Partial<Record<Person, string>>>({});
  const [preterite, setPreterite] = useState("");
  const [auxiliary, setAuxiliary] = useState<Auxiliary>("haben");
  const [participle, setParticiple] = useState("");
  const [exampleDe, setExampleDe] = useState("");
  const [exampleEn, setExampleEn] = useState("");

  const regularForms = german.trim() ? regularPresent(german.trim()) : undefined;
  const presentValue = (p: Person) => editedPresent[p] ?? regularForms?.[p] ?? "";

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const meanings = english
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);
    if (!german.trim() || meanings.length === 0) return;
    const hasExample = exampleDe.trim() && exampleEn.trim();
    // Verb forms are all-or-nothing: a half-filled conjugation is dropped.
    const present = Object.fromEntries(persons.map((p) => [p, presentValue(p).trim()])) as Record<Person, string>;
    const [pret, part] = [preterite.trim(), participle.trim()];
    const hasConjugation = type === "verb" && [...Object.values(present), pret, part].every(Boolean);
    onSubmit({
      id: crypto.randomUUID(),
      german: german.trim(),
      english: meanings,
      article: type === "noun" && article !== NO_ARTICLE ? (article as Article) : undefined,
      conjugation: hasConjugation
        ? {
            present,
            preterite: pret,
            perfect: { auxiliary, participle: part },
          }
        : undefined,
      type,
      examples: hasExample ? [{ de: exampleDe.trim(), en: exampleEn.trim() }] : [],
    });
    setGerman("");
    setEnglish("");
    setArticle(NO_ARTICLE);
    setEditedPresent({});
    setPreterite("");
    setAuxiliary("haben");
    setParticiple("");
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
      {type === "verb" && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {persons.map((p) => (
              <div key={p} className="space-y-1.5">
                <Label htmlFor={`present-${p}`}>{personLabels[p]}</Label>
                <Input
                  id={`present-${p}`}
                  value={presentValue(p)}
                  onChange={(e) => setEditedPresent((forms) => ({ ...forms, [p]: e.target.value }))}
                  placeholder={examplePresent[p]}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            The Präsens is filled in with the regular forms. Correct any that are irregular, like "fährst".
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="preterite">Präteritum</Label>
              <Input
                id="preterite"
                value={preterite}
                onChange={(e) => setPreterite(e.target.value)}
                placeholder="machte"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Perfekt auxiliary</Label>
              <Select value={auxiliary} onValueChange={(v) => setAuxiliary(v as Auxiliary)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="haben">haben</SelectItem>
                  <SelectItem value="sein">sein</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="participle">Participle</Label>
              <Input
                id="participle"
                value={participle}
                onChange={(e) => setParticiple(e.target.value)}
                placeholder="gemacht"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Verb forms are optional, but only saved if all are filled in.</p>
        </>
      )}
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
