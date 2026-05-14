import { describe, expect, it } from "vitest";
import { greet } from "./mod.ts";

describe("greet", () => {
  it("includes name", () => {
    expect(greet("Ada")).toBe("Hello, Ada!");
  });
});
