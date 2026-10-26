import type { Example, Word } from "#/storage/schemas.ts";

type Entry = Omit<Word, "id">;

const ex = (de: string, en: string): Example => ({ de, en });

/**
 * The built-in dictionary. Every word is defined once, here, and keyed by its id.
 * Lists (see lists.ts) only reference these ids.
 *
 * Casing rule: `german` is the dictionary form. Nouns are capitalised, everything else is
 * lowercase, even greetings ("hallo", "guten Morgen"). Capital letters at the start of a
 * sentence only appear in the examples.
 */
const entries = {
  // Numbers (no examples needed)
  eins: { german: "eins", type: "number", english: ["one"], examples: [] },
  zwei: { german: "zwei", type: "number", english: ["two"], examples: [] },
  drei: { german: "drei", type: "number", english: ["three"], examples: [] },
  vier: { german: "vier", type: "number", english: ["four"], examples: [] },
  fünf: { german: "fünf", type: "number", english: ["five"], examples: [] },
  sechs: { german: "sechs", type: "number", english: ["six"], examples: [] },
  sieben: { german: "sieben", type: "number", english: ["seven"], examples: [] },
  acht: { german: "acht", type: "number", english: ["eight"], examples: [] },
  neun: { german: "neun", type: "number", english: ["nine"], examples: [] },
  zehn: { german: "zehn", type: "number", english: ["ten"], examples: [] },

  // Greetings and short answers
  hallo: {
    german: "hallo",
    type: "phrase",
    english: ["hello"],
    examples: [
      ex("Hallo, ich heiße Anna.", "Hello, my name is Anna."),
      ex("Hallo! Wie geht's dir?", "Hello! How are you?"),
    ],
  },
  "guten-morgen": {
    german: "guten Morgen",
    type: "phrase",
    english: ["good morning"],
    examples: [
      ex("Guten Morgen, Herr Weber!", "Good morning, Mr Weber!"),
      ex("Guten Morgen! Wie geht's dir?", "Good morning! How are you?"),
    ],
  },
  "guten-tag": {
    german: "guten Tag",
    type: "phrase",
    english: ["good day", "hello"],
    examples: [
      ex("Guten Tag, ich bin Anna.", "Hello, I am Anna."),
      ex("Guten Tag! Wie heißen Sie?", "Hello! What is your name?"),
    ],
  },
  "guten-abend": {
    german: "guten Abend",
    type: "phrase",
    english: ["good evening"],
    examples: [
      ex("Guten Abend, Frau Schmidt.", "Good evening, Mrs Schmidt."),
      ex("Guten Abend! Ich komme aus Litauen..", "Good evening! I am from Canada."),
    ],
  },
  tschüss: {
    german: "tschüss",
    type: "phrase",
    english: ["bye"],
    examples: [ex("Tschüss, bis morgen!", "Bye, see you tomorrow!"), ex("Tschüss, Anna!", "Bye, Anna!")],
  },
  danke: {
    german: "danke",
    type: "phrase",
    english: ["thank you", "thanks"],
    examples: [
      ex("Danke für das Buch.", "Thanks for the book."),
      ex("Danke, das ist sehr nett.", "Thank you, that is very nice."),
    ],
  },
  bitte: {
    german: "bitte",
    type: "phrase",
    english: ["please", "you're welcome"],
    examples: [ex("Einen Kaffee, bitte.", "A coffee, please."), ex("Danke! Bitte schön.", "Thanks! You're welcome.")],
  },
  ja: {
    german: "ja",
    type: "other",
    english: ["yes"],
    examples: [
      ex("Ja, ich komme aus Deutschland.", "Yes, I come from Germany."),
      ex("Ja, das ist mein Hund.", "Yes, that is my dog."),
    ],
  },
  nein: {
    german: "nein",
    type: "other",
    english: ["no"],
    examples: [
      ex("Nein, ich wohne nicht in Marburg.", "No, I do not live in Marburg."),
      ex("Nein, danke.", "No, thank you."),
    ],
  },

  // Nouns
  name: {
    german: "Name",
    article: "der",
    plural: "Namen",
    type: "noun",
    english: ["name"],
    examples: [ex("Mein Name ist Anna.", "My name is Anna."), ex("Wie ist dein Name?", "What is your name?")],
  },
  frau: {
    german: "Frau",
    article: "die",
    plural: "Frauen",
    type: "noun",
    english: ["woman", "wife"],
    examples: [
      ex("Die Frau wohnt in Marburg.", "The woman lives in Marburg."),
      ex("Meine Frau kommt aus Litauen.", "My wife comes from Lithuania."),
    ],
  },
  mann: {
    german: "Mann",
    article: "der",
    plural: "Männer",
    type: "noun",
    english: ["man", "husband"],
    examples: [
      ex("Der Mann heißt Peter.", "The man is called Peter."),
      ex("Mein Mann spricht Deutsch.", "My husband speaks German."),
    ],
  },
  kind: {
    german: "Kind",
    article: "das",
    plural: "Kinder",
    type: "noun",
    english: ["child"],
    examples: [
      ex("Das Kind lernt Deutsch.", "The child is learning German."),
      ex("Ich habe zwei Kinder.", "I have two children."),
    ],
  },
  land: {
    german: "Land",
    article: "das",
    plural: "Länder",
    type: "noun",
    english: ["country"],
    examples: [
      ex("Deutschland ist ein Land.", "Germany is a country."),
      ex("Welches Land ist das?", "Which country is that?"),
    ],
  },
  stadt: {
    german: "Stadt",
    article: "die",
    plural: "Städte",
    type: "noun",
    english: ["city"],
    examples: [ex("Die Stadt ist groß.", "The city is big."), ex("Wie heißt die Stadt?", "What is the city called?")],
  },

  // Verbs
  sein: {
    german: "sein",
    perfect: { auxiliary: "sein", participle: "gewesen" },
    type: "verb",
    english: ["to be"],
    examples: [ex("Ich bin Anna.", "I am Anna."), ex("Das Kind ist groß.", "The child is big.")],
  },
  haben: {
    german: "haben",
    perfect: { auxiliary: "haben", participle: "gehabt" },
    type: "verb",
    english: ["to have"],
    examples: [ex("Ich habe einen Hund.", "I have a dog."), ex("Wir haben zwei Kinder.", "We have two children.")],
  },
  heißen: {
    german: "heißen",
    perfect: { auxiliary: "haben", participle: "geheißen" },
    type: "verb",
    english: ["to be called"],
    examples: [ex("Ich heiße Anna.", "My name is Anna."), ex("Wie heißt du?", "What is your name?")],
  },
  kommen: {
    german: "kommen",
    perfect: { auxiliary: "sein", participle: "gekommen" },
    type: "verb",
    english: ["to come"],
    examples: [ex("Ich komme aus Litauen.", "I am from Lithuania."), ex("Woher kommst du?", "Where are you from?")],
  },
  wohnen: {
    german: "wohnen",
    perfect: { auxiliary: "haben", participle: "gewohnt" },
    type: "verb",
    english: ["to live", "to reside"],
    examples: [ex("Ich wohne in Marburg.", "I live in Marburg."), ex("Wo wohnst du?", "Where do you live?")],
  },
  machen: {
    german: "machen",
    perfect: { auxiliary: "haben", participle: "gemacht" },
    type: "verb",
    english: ["to do", "to make"],
    examples: [
      ex("Was machst du heute?", "What are you doing today?"),
      ex("Ich mache einen Kaffee.", "I am making a coffee."),
    ],
  },
  lernen: {
    german: "lernen",
    perfect: { auxiliary: "haben", participle: "gelernt" },
    type: "verb",
    english: ["to learn"],
    examples: [ex("Ich lerne Deutsch.", "I am learning German."), ex("Wir lernen heute.", "We are learning today.")],
  },
  sprechen: {
    german: "sprechen",
    perfect: { auxiliary: "haben", participle: "gesprochen" },
    type: "verb",
    english: ["to speak"],
    examples: [ex("Ich spreche Deutsch.", "I speak German."), ex("Sprichst du Englisch?", "Do you speak English?")],
  },
} satisfies Record<string, Entry>;

export type BuiltinWordId = keyof typeof entries;

export const builtinWords: Word[] = Object.entries(entries).map(([id, entry]) => ({ id, ...(entry as Entry) }));
