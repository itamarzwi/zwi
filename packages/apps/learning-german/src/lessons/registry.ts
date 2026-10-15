import type { ComponentType } from "react";
import { modules } from "./modules.ts";

export type LessonMeta = { title: string; summary: string };

export type Lesson = LessonMeta & {
  moduleId: string;
  lessonId: string;
  /** Key used for progress storage. */
  key: string;
  Content: () => Promise<{ default: ComponentType }>;
};

const metas = import.meta.glob<LessonMeta>("./*/*.mdx", { import: "meta", eager: true });
const contents = import.meta.glob<{ default: ComponentType }>("./*/*.mdx");

/** All lessons, ordered by module order and then by file name (01-..., 02-...). */
export const lessons: Lesson[] = Object.entries(metas)
  .map(([path, meta]) => {
    const [, moduleId, file] = path.split("/");
    const lessonId = file.replace(/\.mdx$/, "");
    return {
      ...meta,
      moduleId,
      lessonId,
      key: `${moduleId}/${lessonId}`,
      Content: contents[path],
    };
  })
  .sort((a, b) => {
    const m = modules.findIndex((x) => x.id === a.moduleId) - modules.findIndex((x) => x.id === b.moduleId);
    return m !== 0 ? m : a.lessonId.localeCompare(b.lessonId);
  });

export const findLesson = (moduleId: string, lessonId: string) =>
  lessons.find((l) => l.moduleId === moduleId && l.lessonId === lessonId);

export const lessonsInModule = (moduleId: string) => lessons.filter((l) => l.moduleId === moduleId);

export const nextLesson = (lesson: Lesson) => lessons[lessons.indexOf(lesson) + 1];
