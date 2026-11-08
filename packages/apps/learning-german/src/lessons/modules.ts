export type ModuleInfo = { id: string; title: string; description: string };

/** Modules in display order. The `id` matches the folder name under src/lessons. */
export const modules: ModuleInfo[] = [
  {
    id: "01-basics",
    title: "The basics",
    description: "Genders, first verbs, numbers, introductions, sentence structure and the first cases.",
  },
  {
    id: "02-past-tense",
    title: "The past tense",
    description: "The Perfekt with haben and sein, regular and irregular verbs, war and hatte.",
  },
  {
    id: "03-prepositions-separable",
    title: "Prepositions and separable verbs",
    description: "Akkusativ and time prepositions, separable verbs in the Präsens and the Perfekt.",
  },
  {
    id: "04-dativ",
    title: "The Dativ case",
    description: "The Dativ case, dative prepositions, stationary vs movement verbs",
  },
];
