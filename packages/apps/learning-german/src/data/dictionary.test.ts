import { describe, expect, it } from "vitest";
import { wordSchema } from "#/storage/schemas.ts";
import { builtinWords } from "./dictionary.ts";
import { builtinLists } from "./lists.ts";

describe("built-in dictionary", () => {
  it("only contains valid words with unique ids", () => {
    for (const word of builtinWords) expect(wordSchema.safeParse(word).success, word.id).toBe(true);
    expect(new Set(builtinWords.map((w) => w.id)).size).toBe(builtinWords.length);
  });

  it("keeps ids and German text NFC-normalised", () => {
    for (const word of builtinWords) {
      expect(word.id, word.id).toBe(word.id.normalize("NFC"));
      expect(word.german, word.id).toBe(word.german.normalize("NFC"));
      const c = word.conjugation;
      for (const form of c ? [c.ich, c.er, c.preterite, c.perfect.participle] : [])
        expect(form, word.id).toBe(form.normalize("NFC"));
    }
  });

  it("capitalises nouns and nothing else (dictionary form)", () => {
    for (const word of builtinWords) {
      const first = word.german[0];
      const capitalised = first === first.toUpperCase();
      expect(capitalised, `${word.id}: "${word.german}"`).toBe(word.type === "noun");
    }
  });

  it("gives every noun an article and no one else", () => {
    for (const word of builtinWords) expect(Boolean(word.article), word.id).toBe(word.type === "noun");
  });

  it("conjugates every verb and nothing else", () => {
    for (const word of builtinWords) expect(Boolean(word.conjugation), word.id).toBe(word.type === "verb");
  });

  it("has examples for every word except numbers", () => {
    for (const word of builtinWords) {
      if (word.type === "number") continue;
      expect(word.examples.length, word.id).toBeGreaterThan(0);
    }
  });

  it("only references existing words in lists", () => {
    const ids = new Set(builtinWords.map((w) => w.id));
    for (const list of builtinLists) for (const id of list.wordIds) expect(ids.has(id), `${list.id}: ${id}`).toBe(true);
  });
});
