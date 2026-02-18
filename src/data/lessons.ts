import { LearningPath, Lesson, QuizQuestion } from "./types";

import * as theBook from "./lessons/the-book/index";
import * as reqwest from "./lessons/reqwest/index";
import * as plotters from "./lessons/plotters/index";
import * as polars from "./lessons/polars/index";

export type { Lesson, QuizQuestion, LearningPath };

interface PathModule {
    path: LearningPath;
    lessons: Lesson[];
}

const registry: PathModule[] = [theBook, reqwest, plotters, polars];

/** All registered learning paths */
export function getAllPaths(): LearningPath[] {
    return registry.map((m) => m.path);
}

/** Sorted lessons for a specific learning path */
export function getPathLessons(pathId: string): Lesson[] {
    const mod = registry.find((m) => m.path.id === pathId);
    if (!mod) return [];
    return [...mod.lessons].sort((a, b) => a.sort_order - b.sort_order);
}

/** Find a learning path by its ID */
export function getPath(pathId: string): LearningPath | null {
    return registry.find((m) => m.path.id === pathId)?.path ?? null;
}

/** Find a single lesson within a learning path */
export function getLesson(pathId: string, lessonId: string): Lesson | null {
    const lessons = getPathLessons(pathId);
    return lessons.find((l) => l.id === lessonId) || null;
}

/** First lesson in a learning path (by sort_order) */
export function getFirstLesson(pathId: string): Lesson | null {
    const lessons = getPathLessons(pathId);
    return lessons[0] || null;
}
