import type { CardState } from "#/storage/schemas.ts";

export type Rating = "again" | "hard" | "good" | "easy";

const DAY = 24 * 60 * 60 * 1000;
const AGAIN_DELAY = 10 * 60 * 1000;
const MIN_EASE = 1.3;

/** A simplified SM-2: returns the next state for a card after a review. */
export const review = (prev: CardState | undefined, wordId: string, rating: Rating, now: number): CardState => {
  const base: CardState = prev ?? {
    wordId,
    ease: 2.5,
    intervalDays: 0,
    reps: 0,
    lapses: 0,
    due: now,
    lastReviewedAt: now,
  };

  if (rating === "again") {
    return {
      ...base,
      ease: Math.max(MIN_EASE, base.ease - 0.2),
      intervalDays: 0,
      reps: 0,
      lapses: base.lapses + 1,
      due: now + AGAIN_DELAY,
      lastReviewedAt: now,
    };
  }

  let intervalDays: number;
  let ease = base.ease;
  if (rating === "hard") {
    ease = Math.max(MIN_EASE, ease - 0.15);
    intervalDays = Math.max(1, Math.round(base.intervalDays * 1.2));
  } else if (rating === "good") {
    intervalDays = base.reps === 0 ? 1 : base.reps === 1 ? 3 : Math.round(base.intervalDays * ease);
  } else {
    ease += 0.15;
    intervalDays = base.reps === 0 ? 3 : Math.max(4, Math.round(base.intervalDays * ease * 1.3));
  }

  return {
    ...base,
    ease,
    intervalDays,
    reps: base.reps + 1,
    due: now + intervalDays * DAY,
    lastReviewedAt: now,
  };
};

export const isDue = (state: CardState, now: number) => state.due <= now;

/** Human-readable preview of when a card returns, e.g. "10 min", "3 d". */
export const formatInterval = (from: number, to: number) => {
  const ms = to - from;
  if (ms < 60 * 60 * 1000) return `${Math.max(1, Math.round(ms / 60000))} min`;
  return `${Math.max(1, Math.round(ms / DAY))} d`;
};
