import { z } from "zod";

export const articleSchema = z.enum(["der", "die", "das"]);
export const auxiliarySchema = z.enum(["haben", "sein"]);
export const wordTypeSchema = z.enum(["noun", "verb", "adjective", "adverb", "phrase", "number", "other"]);

export const exampleSchema = z.object({ de: z.string().min(1), en: z.string().min(1) });

/** The Perfekt of a verb: its auxiliary and Partizip II, e.g. haben + "gemacht". */
export const perfectSchema = z.object({ auxiliary: auxiliarySchema, participle: z.string().min(1) });

/** The forms of a verb besides its infinitive, without pronouns: "mache", "macht", "machte". */
export const conjugationSchema = z.object({
  ich: z.string().min(1),
  /** er/sie/es. */
  er: z.string().min(1),
  /** Präteritum, ich and er/sie/es (they're the same). */
  preterite: z.string().min(1),
  perfect: perfectSchema,
});

/**
 * A dictionary entry. `german` is the lemma exactly as it is written in a dictionary:
 * capitalised only for nouns, lowercase for everything else (e.g. "bitte", "guten Morgen").
 * Built-in words ship with the app; custom words created by the user use the same shape.
 */
export const wordSchema = z.object({
  id: z.string(),
  german: z.string().min(1),
  /** Nouns only. */
  article: articleSchema.optional(),
  /** Nouns only: the plural form without article, e.g. "Männer". */
  plural: z.string().optional(),
  /** Verbs only. */
  conjugation: conjugationSchema.optional(),
  type: wordTypeSchema,
  /** One or more English meanings. */
  english: z.array(z.string().min(1)).min(1),
  examples: z.array(exampleSchema),
});

/** A user-owned list. Lists only reference words by id; words exist independently of lists. */
export const userListSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  wordIds: z.array(z.string()),
  createdAt: z.number(),
});

/** Whether the user marked a word as learned (independent of the flashcard schedule). */
export const wordStateSchema = z.object({
  wordId: z.string(),
  learned: z.boolean(),
  updatedAt: z.number(),
});

export const cardStateSchema = z.object({
  wordId: z.string(),
  ease: z.number(),
  intervalDays: z.number(),
  reps: z.number(),
  lapses: z.number(),
  due: z.number(),
  lastReviewedAt: z.number(),
});

export const lessonProgressSchema = z.object({
  completedAt: z.number(),
  quiz: z.object({ correct: z.number(), total: z.number() }).optional(),
});

export const progressSchema = z.object({
  lessons: z.record(z.string(), lessonProgressSchema),
});

export type Article = z.infer<typeof articleSchema>;
export type Auxiliary = z.infer<typeof auxiliarySchema>;
export type Perfect = z.infer<typeof perfectSchema>;
export type Conjugation = z.infer<typeof conjugationSchema>;
export type WordType = z.infer<typeof wordTypeSchema>;
export type Example = z.infer<typeof exampleSchema>;
export type Word = z.infer<typeof wordSchema>;
export type UserList = z.infer<typeof userListSchema>;
export type WordState = z.infer<typeof wordStateSchema>;
export type CardState = z.infer<typeof cardStateSchema>;
export type LessonProgress = z.infer<typeof lessonProgressSchema>;
export type Progress = z.infer<typeof progressSchema>;
