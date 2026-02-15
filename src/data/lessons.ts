import { Lesson, QuizQuestion } from "./types";
import { ch01Lessons } from "./lessons/ch01";
import { ch02Lessons } from "./lessons/ch02";
import { ch03Lessons } from "./lessons/ch03";
import { ch04Lessons } from "./lessons/ch04";
import { ch05Lessons } from "./lessons/ch05";
import { ch06Lessons } from "./lessons/ch06";
import { ch07Lessons } from "./lessons/ch07";
import { ch08Lessons } from "./lessons/ch08";
import { ch09Lessons } from "./lessons/ch09";
import { ch10Lessons } from "./lessons/ch10";

export type { Lesson, QuizQuestion };

const lessons: Lesson[] = [
    ...ch01Lessons,
    ...ch02Lessons,
    ...ch03Lessons,
    ...ch04Lessons,
    ...ch05Lessons,
    ...ch06Lessons,
    ...ch07Lessons,
    ...ch08Lessons,
    ...ch09Lessons,
    ...ch10Lessons,
];

export function getAllLessons(): Lesson[] {
    return [...lessons].sort((a, b) => a.sort_order - b.sort_order);
}

export function getLesson(id: string): Lesson | null {
    return lessons.find((l) => l.id === id) || null;
}

export function getFirstLesson(): Lesson | null {
    const sorted = getAllLessons();
    return sorted[0] || null;
}
