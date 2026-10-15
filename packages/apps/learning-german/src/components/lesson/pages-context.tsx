import { createContext, type ReactNode, useContext } from "react";

export type LessonPages = {
  /** Current page, 1-based (as in the URL). */
  page: number;
  goToPage: (page: number) => void;
  /** Called by the lesson content once it knows how many pages it has. */
  setPageCount: (count: number) => void;
  /** Shown above Back/Next on the last page (quiz result, completion). */
  footer?: ReactNode;
  /** The lesson that follows this one; the last page's Next button links to it. */
  nextLesson?: { moduleId: string; lessonId: string; title: string };
};

export const LessonPagesContext = createContext<LessonPages | null>(null);

/** Null when MDX is rendered outside a lesson page; content then renders as a single page. */
export const useLessonPages = () => useContext(LessonPagesContext);
