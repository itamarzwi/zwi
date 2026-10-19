export type ModuleInfo = { id: string; title: string; description: string };

/** Modules in display order. The `id` matches the folder name under src/lessons. */
export const modules: ModuleInfo[] = [
  {
    id: "01-basics",
    title: "The basics",
    description: "Genders, first verbs, numbers, introductions, sentence structure and the first cases.",
  },
  {
    id: "02-prepositions-dativ",
    title: "Prepositions and the Dativ case",
    description: "The Dativ case, prepositions, stationary vs movement cases",
  },
];
