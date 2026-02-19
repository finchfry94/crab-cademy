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
import { ch11Lessons } from "./ch11";
import { ch12Lessons } from "./ch12";
import { ch13Lessons } from "./ch13";
import { ch14Lessons } from "./ch14";
import { ch15Lessons } from "./ch15";
import { ch16Lessons } from "./ch16";
import { ch17Lessons } from "./ch17";
import { ch18Lessons } from "./ch18";
import { ch19Lessons } from "./ch19";
import { ch20Lessons } from "./ch20";

export const path: LearningPath = {
    id: "the-book",
    title: "The Rust Book",
    description:
        "Work through The Rust Programming Language book interactively — from Hello World to advanced ownership.",
    icon: "📖",
    color: "from-orange-500 to-red-600",
    modules: [
        {
            id: "basics",
            title: "Module 1: Foundations",
            description: "Getting set up and learning the core syntax of Rust.",
            chapters: ["1", "2", "3"],
        },
        {
            id: "ownership",
            title: "Module 2: The Core Secret",
            description: "Ownership, Borrowing, and Structs — the heart of Rust.",
            chapters: ["4", "5", "6"],
        },
        {
            id: "organization",
            title: "Module 3: Project Structure",
            description: "Modules, Crates, and automated testing.",
            chapters: ["7", "8", "9", "11"],
        },
        {
            id: "intermediate",
            title: "Module 4: Versatility",
            description: "Generics, Traits, Lifetimes, and project work.",
            chapters: ["10", "12", "13", "14"],
        },
        {
            id: "advanced",
            title: "Module 5: Mastery",
            description: "Smart Pointers, Concurrency, and advanced patterns.",
            chapters: ["15", "16", "17", "18", "19"],
        },
        {
            id: "final",
            title: "Module 6: The Summit",
            description: "Systems programming and the Final Project.",
            chapters: ["20"],
        },
    ],
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
    ...ch11Lessons,
    ...ch12Lessons,
    ...ch13Lessons,
    ...ch14Lessons,
    ...ch15Lessons,
    ...ch16Lessons,
    ...ch17Lessons,
    ...ch18Lessons,
    ...ch19Lessons,
    ...ch20Lessons,
];
