import { describe, expect, it } from "vitest";
import { review } from "./srs.ts";

const NOW = 1_700_000_000_000;
const DAY = 24 * 60 * 60 * 1000;

describe("review", () => {
  it("schedules a new card rated good for 1 day, then 3 days", () => {
    const first = review(undefined, "w", "good", NOW);
    expect(first.intervalDays).toBe(1);
    expect(first.due).toBe(NOW + DAY);
    expect(review(first, "w", "good", NOW).intervalDays).toBe(3);
  });

  it("resets reps and lowers ease on again", () => {
    const good = review(review(undefined, "w", "good", NOW), "w", "good", NOW);
    const again = review(good, "w", "again", NOW);
    expect(again.reps).toBe(0);
    expect(again.lapses).toBe(1);
    expect(again.ease).toBeLessThan(good.ease);
    expect(again.due).toBeLessThan(NOW + DAY);
  });

  it("never drops ease below the minimum", () => {
    let state = review(undefined, "w", "again", NOW);
    for (let i = 0; i < 20; i++) state = review(state, "w", "again", NOW);
    expect(state.ease).toBeGreaterThanOrEqual(1.3);
  });
});
