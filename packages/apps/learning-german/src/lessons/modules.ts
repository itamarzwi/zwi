export type ModuleInfo = { id: string; title: string; description: string };

/** Modules in display order. The `id` matches the folder name under src/lessons. */
export const modules: ModuleInfo[] = [
  {
    id: "01-basics",
    title: "The basics",
    description: "Genders, capitalisation, first verbs, numbers and introductions.",
  },
  {
    id: "02-sentences",
    title: "Sentence structure",
    description: "Subject, verb, object, and where time and place go.",
  },
  { id: "03-cases", title: "Cases", description: "Nominativ and Akkusativ." },
];
