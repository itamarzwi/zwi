import { describe, expect, it } from "vitest";
import { guessSeparablePrefix, regularPresent } from "./conjugation.ts";

/** ich du er wir ihr sie, as one string so the tables stay readable. */
const table = (forms: string) => {
  const [ich, du, er, wir, ihr, sie] = forms.split(" ");
  return { ich, du, er, wir, ihr, sie };
};

describe("regularPresent", () => {
  it.each([
    ["machen", "mache machst macht machen macht machen"],
    ["finden", "finde findest findet finden findet finden"],
    ["arbeiten", "arbeite arbeitest arbeitet arbeiten arbeitet arbeiten"],
    ["atmen", "atme atmest atmet atmen atmet atmen"],
    ["öffnen", "öffne öffnest öffnet öffnen öffnet öffnen"],
    ["rechnen", "rechne rechnest rechnet rechnen rechnet rechnen"],
    ["wohnen", "wohne wohnst wohnt wohnen wohnt wohnen"],
    ["lernen", "lerne lernst lernt lernen lernt lernen"],
    ["kennen", "kenne kennst kennt kennen kennt kennen"],
    ["heißen", "heiße heißt heißt heißen heißt heißen"],
    ["tanzen", "tanze tanzt tanzt tanzen tanzt tanzen"],
    ["reisen", "reise reist reist reisen reist reisen"],
    ["waschen", "wasche waschst wascht waschen wascht waschen"],
    ["sammeln", "sammle sammelst sammelt sammeln sammelt sammeln"],
    ["wandern", "wandere wanderst wandert wandern wandert wandern"],
    ["tun", "tue tust tut tun tut tun"],
  ])("%s", (infinitive, forms) => {
    expect(regularPresent(infinitive)).toEqual(table(forms));
  });

  it("puts a separable prefix after the conjugated base verb", () => {
    expect(regularPresent("aufwachen", "auf")).toEqual({
      ich: "wache auf",
      du: "wachst auf",
      er: "wacht auf",
      wir: "wachen auf",
      ihr: "wacht auf",
      sie: "wachen auf",
    });
    expect(regularPresent("anmelden", "an").du).toBe("meldest an");
  });
});

describe("guessSeparablePrefix", () => {
  it.each([
    ["aufwachen", "auf"],
    ["einschlafen", "ein"],
    ["anrufen", "an"],
    ["zur\u00fcckkommen", "zur\u00fcck"],
    ["zusammenarbeiten", "zusammen"],
    ["herausfinden", "heraus"],
    ["machen", undefined],
    ["verstehen", undefined],
    ["antworten", undefined],
    ["\u00fcbersetzen", undefined],
  ])("%s -> %s", (infinitive, prefix) => {
    expect(guessSeparablePrefix(infinitive)).toBe(prefix);
  });
});
