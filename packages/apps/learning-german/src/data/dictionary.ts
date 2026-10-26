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
    conjugation: {
      ich: "bin",
      er: "ist",
      preterite: "war",
      perfect: { auxiliary: "sein", participle: "gewesen" },
    },
    type: "verb",
    english: ["to be"],
    examples: [ex("Ich bin Anna.", "I am Anna."), ex("Das Kind ist groß.", "The child is big.")],
  },
  haben: {
    german: "haben",
    conjugation: {
      ich: "habe",
      er: "hat",
      preterite: "hatte",
      perfect: { auxiliary: "haben", participle: "gehabt" },
    },
    type: "verb",
    english: ["to have"],
    examples: [ex("Ich habe einen Hund.", "I have a dog."), ex("Wir haben zwei Kinder.", "We have two children.")],
  },
  heißen: {
    german: "heißen",
    conjugation: {
      ich: "heiße",
      er: "heißt",
      preterite: "hieß",
      perfect: { auxiliary: "haben", participle: "geheißen" },
    },
    type: "verb",
    english: ["to be called"],
    examples: [ex("Ich heiße Anna.", "My name is Anna."), ex("Wie heißt du?", "What is your name?")],
  },
  kommen: {
    german: "kommen",
    conjugation: {
      ich: "komme",
      er: "kommt",
      preterite: "kam",
      perfect: { auxiliary: "sein", participle: "gekommen" },
    },
    type: "verb",
    english: ["to come"],
    examples: [ex("Ich komme aus Litauen.", "I am from Lithuania."), ex("Woher kommst du?", "Where are you from?")],
  },
  wohnen: {
    german: "wohnen",
    conjugation: {
      ich: "wohne",
      er: "wohnt",
      preterite: "wohnte",
      perfect: { auxiliary: "haben", participle: "gewohnt" },
    },
    type: "verb",
    english: ["to live", "to reside"],
    examples: [ex("Ich wohne in Marburg.", "I live in Marburg."), ex("Wo wohnst du?", "Where do you live?")],
  },
  machen: {
    german: "machen",
    conjugation: {
      ich: "mache",
      er: "macht",
      preterite: "machte",
      perfect: { auxiliary: "haben", participle: "gemacht" },
    },
    type: "verb",
    english: ["to do", "to make"],
    examples: [
      ex("Was machst du heute?", "What are you doing today?"),
      ex("Ich mache einen Kaffee.", "I am making a coffee."),
    ],
  },
  lernen: {
    german: "lernen",
    conjugation: {
      ich: "lerne",
      er: "lernt",
      preterite: "lernte",
      perfect: { auxiliary: "haben", participle: "gelernt" },
    },
    type: "verb",
    english: ["to learn"],
    examples: [ex("Ich lerne Deutsch.", "I am learning German."), ex("Wir lernen heute.", "We are learning today.")],
  },
  sprechen: {
    german: "sprechen",
    conjugation: {
      ich: "spreche",
      er: "spricht",
      preterite: "sprach",
      perfect: { auxiliary: "haben", participle: "gesprochen" },
    },
    type: "verb",
    english: ["to speak"],
    examples: [ex("Ich spreche Deutsch.", "I speak German."), ex("Sprichst du Englisch?", "Do you speak English?")],
  },
  essen: {
    german: "essen",
    conjugation: {
      ich: "esse",
      er: "isst",
      preterite: "aß",
      perfect: { auxiliary: "haben", participle: "gegessen" },
    },
    type: "verb",
    english: ["to eat"],
    examples: [
      ex("Ich esse gern Pizza.", "I like eating pizza."),
      ex("Wir haben gestern Pizza gegessen.", "We ate pizza yesterday."),
    ],
  },
  trinken: {
    german: "trinken",
    conjugation: {
      ich: "trinke",
      er: "trinkt",
      preterite: "trank",
      perfect: { auxiliary: "haben", participle: "getrunken" },
    },
    type: "verb",
    english: ["to drink"],
    examples: [
      ex("Trinkst du Kaffee?", "Do you drink coffee?"),
      ex("Ich habe zwei Kaffee getrunken.", "I drank two coffees."),
    ],
  },
  sehen: {
    german: "sehen",
    conjugation: {
      ich: "sehe",
      er: "sieht",
      preterite: "sah",
      perfect: { auxiliary: "haben", participle: "gesehen" },
    },
    type: "verb",
    english: ["to see"],
    examples: [ex("Siehst du das Haus?", "Do you see the house?"), ex("Ich habe den Film gesehen.", "I saw the film.")],
  },
  lesen: {
    german: "lesen",
    conjugation: {
      ich: "lese",
      er: "liest",
      preterite: "las",
      perfect: { auxiliary: "haben", participle: "gelesen" },
    },
    type: "verb",
    english: ["to read"],
    examples: [
      ex("Anna liest ein Buch.", "Anna is reading a book."),
      ex("Hast du das Buch gelesen?", "Have you read the book?"),
    ],
  },
  schreiben: {
    german: "schreiben",
    conjugation: {
      ich: "schreibe",
      er: "schreibt",
      preterite: "schrieb",
      perfect: { auxiliary: "haben", participle: "geschrieben" },
    },
    type: "verb",
    english: ["to write"],
    examples: [
      ex("Ich schreibe eine Nachricht.", "I am writing a message."),
      ex("Peter hat eine E-Mail geschrieben.", "Peter wrote an email."),
    ],
  },
  schlafen: {
    german: "schlafen",
    conjugation: {
      ich: "schlafe",
      er: "schläft",
      preterite: "schlief",
      perfect: { auxiliary: "haben", participle: "geschlafen" },
    },
    type: "verb",
    english: ["to sleep"],
    examples: [ex("Das Kind schläft.", "The child is sleeping."), ex("Hast du gut geschlafen?", "Did you sleep well?")],
  },
  finden: {
    german: "finden",
    conjugation: {
      ich: "finde",
      er: "findet",
      preterite: "fand",
      perfect: { auxiliary: "haben", participle: "gefunden" },
    },
    type: "verb",
    english: ["to find"],
    examples: [
      ex("Ich finde meinen Schlüssel nicht.", "I can't find my key."),
      ex("Wir haben ein Café gefunden.", "We found a café."),
    ],
  },
  nehmen: {
    german: "nehmen",
    conjugation: {
      ich: "nehme",
      er: "nimmt",
      preterite: "nahm",
      perfect: { auxiliary: "haben", participle: "genommen" },
    },
    type: "verb",
    english: ["to take"],
    examples: [ex("Ich nehme den Bus.", "I take the bus."), ex("Anna hat einen Tee genommen.", "Anna had a tea.")],
  },
  treffen: {
    german: "treffen",
    conjugation: {
      ich: "treffe",
      er: "trifft",
      preterite: "traf",
      perfect: { auxiliary: "haben", participle: "getroffen" },
    },
    type: "verb",
    english: ["to meet"],
    examples: [
      ex("Ich treffe Peter heute.", "I am meeting Peter today."),
      ex("Wir haben Anna in Marburg getroffen.", "We met Anna in Marburg."),
    ],
  },
  gehen: {
    german: "gehen",
    conjugation: {
      ich: "gehe",
      er: "geht",
      preterite: "ging",
      perfect: { auxiliary: "sein", participle: "gegangen" },
    },
    type: "verb",
    english: ["to go", "to walk"],
    examples: [
      ex("Ich gehe nach Hause.", "I am going home."),
      ex("Wir sind ins Kino gegangen.", "We went to the cinema."),
    ],
  },
  fahren: {
    german: "fahren",
    conjugation: {
      ich: "fahre",
      er: "fährt",
      preterite: "fuhr",
      perfect: { auxiliary: "sein", participle: "gefahren" },
    },
    type: "verb",
    english: ["to drive", "to go (by vehicle)"],
    examples: [
      ex("Peter fährt nach Marburg.", "Peter is driving to Marburg."),
      ex("Ich bin mit dem Zug gefahren.", "I went by train."),
    ],
  },
  fliegen: {
    german: "fliegen",
    conjugation: {
      ich: "fliege",
      er: "fliegt",
      preterite: "flog",
      perfect: { auxiliary: "sein", participle: "geflogen" },
    },
    type: "verb",
    english: ["to fly"],
    examples: [
      ex("Wir fliegen im Sommer nach Litauen.", "We are flying to Lithuania in the summer."),
      ex("Anna ist gestern nach Hause geflogen.", "Anna flew home yesterday."),
    ],
  },
  bleiben: {
    german: "bleiben",
    conjugation: {
      ich: "bleibe",
      er: "bleibt",
      preterite: "blieb",
      perfect: { auxiliary: "sein", participle: "geblieben" },
    },
    type: "verb",
    english: ["to stay"],
    examples: [
      ex("Ich bleibe heute zu Hause.", "I am staying at home today."),
      ex("Wir sind zwei Tage in Marburg geblieben.", "We stayed in Marburg for two days."),
    ],
  },
} satisfies Record<string, Entry>;

export type BuiltinWordId = keyof typeof entries;

export const builtinWords: Word[] = Object.entries(entries).map(([id, entry]) => ({ id, ...(entry as Entry) }));
