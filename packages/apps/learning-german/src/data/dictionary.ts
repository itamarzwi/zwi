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
      ex("Der Mann heißt Jess.", "The man is called Jess."),
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
      present: { ich: "bin", du: "bist", er: "ist", wir: "sind", ihr: "seid", sie: "sind" },
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
      present: { ich: "habe", du: "hast", er: "hat", wir: "haben", ihr: "habt", sie: "haben" },
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
      present: { ich: "heiße", du: "heißt", er: "heißt", wir: "heißen", ihr: "heißt", sie: "heißen" },
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
      present: { ich: "komme", du: "kommst", er: "kommt", wir: "kommen", ihr: "kommt", sie: "kommen" },
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
      present: { ich: "wohne", du: "wohnst", er: "wohnt", wir: "wohnen", ihr: "wohnt", sie: "wohnen" },
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
      present: { ich: "mache", du: "machst", er: "macht", wir: "machen", ihr: "macht", sie: "machen" },
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
      present: { ich: "lerne", du: "lernst", er: "lernt", wir: "lernen", ihr: "lernt", sie: "lernen" },
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
      present: { ich: "spreche", du: "sprichst", er: "spricht", wir: "sprechen", ihr: "sprecht", sie: "sprechen" },
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
      present: { ich: "esse", du: "isst", er: "isst", wir: "essen", ihr: "esst", sie: "essen" },
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
      present: { ich: "trinke", du: "trinkst", er: "trinkt", wir: "trinken", ihr: "trinkt", sie: "trinken" },
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
      present: { ich: "sehe", du: "siehst", er: "sieht", wir: "sehen", ihr: "seht", sie: "sehen" },
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
      present: { ich: "lese", du: "liest", er: "liest", wir: "lesen", ihr: "lest", sie: "lesen" },
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
      present: {
        ich: "schreibe",
        du: "schreibst",
        er: "schreibt",
        wir: "schreiben",
        ihr: "schreibt",
        sie: "schreiben",
      },
      preterite: "schrieb",
      perfect: { auxiliary: "haben", participle: "geschrieben" },
    },
    type: "verb",
    english: ["to write"],
    examples: [
      ex("Ich schreibe eine Nachricht.", "I am writing a message."),
      ex("Jess hat eine E-Mail geschrieben.", "Jess wrote an email."),
    ],
  },
  schlafen: {
    german: "schlafen",
    conjugation: {
      present: { ich: "schlafe", du: "schläfst", er: "schläft", wir: "schlafen", ihr: "schlaft", sie: "schlafen" },
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
      present: { ich: "finde", du: "findest", er: "findet", wir: "finden", ihr: "findet", sie: "finden" },
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
      present: { ich: "nehme", du: "nimmst", er: "nimmt", wir: "nehmen", ihr: "nehmt", sie: "nehmen" },
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
      present: { ich: "treffe", du: "triffst", er: "trifft", wir: "treffen", ihr: "trefft", sie: "treffen" },
      preterite: "traf",
      perfect: { auxiliary: "haben", participle: "getroffen" },
    },
    type: "verb",
    english: ["to meet"],
    examples: [
      ex("Ich treffe Jess heute.", "I am meeting Jess today."),
      ex("Wir haben Anna in Marburg getroffen.", "We met Anna in Marburg."),
    ],
  },
  gehen: {
    german: "gehen",
    conjugation: {
      present: { ich: "gehe", du: "gehst", er: "geht", wir: "gehen", ihr: "geht", sie: "gehen" },
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
      present: { ich: "fahre", du: "fährst", er: "fährt", wir: "fahren", ihr: "fahrt", sie: "fahren" },
      preterite: "fuhr",
      perfect: { auxiliary: "sein", participle: "gefahren" },
    },
    type: "verb",
    english: ["to drive", "to go (by vehicle)"],
    examples: [
      ex("Jess fährt nach Marburg.", "Jess is driving/going to Marburg."),
      ex("Ich bin mit dem Zug gefahren.", "I went by train."),
    ],
  },
  fliegen: {
    german: "fliegen",
    conjugation: {
      present: { ich: "fliege", du: "fliegst", er: "fliegt", wir: "fliegen", ihr: "fliegt", sie: "fliegen" },
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
      present: { ich: "bleibe", du: "bleibst", er: "bleibt", wir: "bleiben", ihr: "bleibt", sie: "bleiben" },
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
  werden: {
    german: "werden",
    conjugation: {
      present: { ich: "werde", du: "wirst", er: "wird", wir: "werden", ihr: "werdet", sie: "werden" },
      preterite: "wurde",
      perfect: { auxiliary: "sein", participle: "geworden" },
    },
    type: "verb",
    english: ["to become"],
    examples: [ex("Es wird kalt.", "It is getting cold."), ex("Anna ist Lehrerin geworden.", "Anna became a teacher.")],
  },
  wachsen: {
    german: "wachsen",
    conjugation: {
      present: { ich: "wachse", du: "wächst", er: "wächst", wir: "wachsen", ihr: "wachst", sie: "wachsen" },
      preterite: "wuchs",
      perfect: { auxiliary: "sein", participle: "gewachsen" },
    },
    type: "verb",
    english: ["to grow"],
    examples: [
      ex("Das Kind wächst schnell.", "The child is growing fast."),
      ex("Du bist aber gewachsen!", "You have really grown!"),
    ],
  },
  sterben: {
    german: "sterben",
    conjugation: {
      present: { ich: "sterbe", du: "stirbst", er: "stirbt", wir: "sterben", ihr: "sterbt", sie: "sterben" },
      preterite: "starb",
      perfect: { auxiliary: "sein", participle: "gestorben" },
    },
    type: "verb",
    english: ["to die"],
    examples: [ex("Mein Hund ist letztes Jahr gestorben.", "My dog died last year.")],
  },
  stehen: {
    german: "stehen",
    conjugation: {
      present: { ich: "stehe", du: "stehst", er: "steht", wir: "stehen", ihr: "steht", sie: "stehen" },
      preterite: "stand",
      perfect: { auxiliary: "haben", participle: "gestanden" },
    },
    type: "verb",
    english: ["to stand"],
    examples: [
      ex("Jess steht an der Tür.", "Jess is standing at the door."),
      ex("Wir haben lange gestanden.", "We stood for a long time."),
    ],
  },
  verstehen: {
    german: "verstehen",
    conjugation: {
      present: {
        ich: "verstehe",
        du: "verstehst",
        er: "versteht",
        wir: "verstehen",
        ihr: "versteht",
        sie: "verstehen",
      },
      preterite: "verstand",
      perfect: { auxiliary: "haben", participle: "verstanden" },
    },
    type: "verb",
    english: ["to understand"],
    examples: [
      ex("Verstehst du das?", "Do you understand that?"),
      ex("Ich habe das nicht verstanden.", "I didn't understand that."),
    ],
  },
  bekommen: {
    german: "bekommen",
    conjugation: {
      present: { ich: "bekomme", du: "bekommst", er: "bekommt", wir: "bekommen", ihr: "bekommt", sie: "bekommen" },
      preterite: "bekam",
      perfect: { auxiliary: "haben", participle: "bekommen" },
    },
    type: "verb",
    english: ["to get", "to receive"],
    examples: [
      ex("Ich bekomme viele E-Mails.", "I get a lot of emails."),
      ex("Anna hat ein Buch bekommen.", "Anna got a book."),
    ],
  },
  verschlafen: {
    german: "verschlafen",
    conjugation: {
      present: {
        ich: "verschlafe",
        du: "verschläfst",
        er: "verschläft",
        wir: "verschlafen",
        ihr: "verschlaft",
        sie: "verschlafen",
      },
      preterite: "verschlief",
      perfect: { auxiliary: "haben", participle: "verschlafen" },
    },
    type: "verb",
    english: ["to oversleep"],
    examples: [ex("Jess hat heute verschlafen.", "Jess overslept today.")],
  },
  wissen: {
    german: "wissen",
    conjugation: {
      present: { ich: "weiß", du: "weißt", er: "weiß", wir: "wissen", ihr: "wisst", sie: "wissen" },
      preterite: "wusste",
      perfect: { auxiliary: "haben", participle: "gewusst" },
    },
    type: "verb",
    english: ["to know (a fact)"],
    examples: [ex("Ich weiß es nicht.", "I don't know."), ex("Das habe ich nicht gewusst.", "I didn't know that.")],
  },
  kennen: {
    german: "kennen",
    conjugation: {
      present: { ich: "kenne", du: "kennst", er: "kennt", wir: "kennen", ihr: "kennt", sie: "kennen" },
      preterite: "kannte",
      perfect: { auxiliary: "haben", participle: "gekannt" },
    },
    type: "verb",
    english: ["to know (a person or place)"],
    examples: [
      ex("Kennst du Anna?", "Do you know Anna?"),
      ex("Ich habe Jess schon in Marburg gekannt.", "I already knew Jess in Marburg."),
    ],
  },
  denken: {
    german: "denken",
    conjugation: {
      present: { ich: "denke", du: "denkst", er: "denkt", wir: "denken", ihr: "denkt", sie: "denken" },
      preterite: "dachte",
      perfect: { auxiliary: "haben", participle: "gedacht" },
    },
    type: "verb",
    english: ["to think"],
    examples: [ex("Was denkst du?", "What do you think?"), ex("Das habe ich auch gedacht.", "I thought so too.")],
  },
  bringen: {
    german: "bringen",
    conjugation: {
      present: { ich: "bringe", du: "bringst", er: "bringt", wir: "bringen", ihr: "bringt", sie: "bringen" },
      preterite: "brachte",
      perfect: { auxiliary: "haben", participle: "gebracht" },
    },
    type: "verb",
    english: ["to bring"],
    examples: [
      ex("Ich bringe einen Kuchen.", "I'm bringing a cake."),
      ex("Anna hat Kaffee gebracht.", "Anna brought coffee."),
    ],
  },
} satisfies Record<string, Entry>;

export type BuiltinWordId = keyof typeof entries;

export const builtinWords: Word[] = Object.entries(entries).map(([id, entry]) => ({ id, ...(entry as Entry) }));
