import { LearningPath, Lesson } from "../../types";
import { ch01Lessons } from "./ch01";
import { ch02Lessons } from "./ch02";
import { ch03Lessons } from "./ch03";
import { ch04Lessons } from "./ch04";
import { ch05Lessons } from "./ch05";
import { ch06Lessons } from "./ch06";
import { ch07Lessons } from "./ch07";
import { ch08Lessons } from "./ch08";
import { ch09Lessons } from "./ch09";
import { ch10Lessons } from "./ch10";

export const path: LearningPath = {
    id: "the-book",
    title: "The Rust Book",
    description:
        "Work through The Rust Programming Language book interactively — from Hello World to advanced ownership.",
    icon: "📖",
    color: "from-orange-500 to-red-600",
};

export const lessons: Lesson[] = [
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
