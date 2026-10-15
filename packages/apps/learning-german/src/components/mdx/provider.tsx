import type { MDXComponents } from "mdx/types";
import { FillBlank } from "#/components/quiz/fill-blank.tsx";
import { MultipleChoice } from "#/components/quiz/multiple-choice.tsx";
import { Callout } from "./callout.tsx";
import { Example, ExampleList } from "./example.tsx";
import { LessonPage, LessonPages } from "./lesson-pages.tsx";
import { ScrollableTable } from "./table.tsx";

const components: MDXComponents = {
  Example,
  ExampleList,
  Callout,
  MultipleChoice,
  FillBlank,
  table: ScrollableTable,
  LessonPages,
  LessonPage,
};

/** Referenced by @mdx-js/rollup (providerImportSource) so every .mdx file gets these components. */
export const useMDXComponents = (): MDXComponents => components;
