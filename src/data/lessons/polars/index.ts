
import { LearningPath, Lesson } from "../../types";
import { ch01Lessons } from "./ch01";
import { ch02Lessons } from "./ch02";
import { ch03Lessons } from "./ch03";
import { ch04Lessons } from "./ch04";
import { ch05Lessons } from "./ch05";
import { ch06Lessons } from "./ch06";
import { ch07Lessons } from "./ch07";

export const path: LearningPath = {
    id: "polars",
    title: "Polars Dataframes",
    description: "Master high-performance data manipulation with the Polars library in Rust.",
    icon: "🐻‍❄️", // Polar bear icon seems appropriate? Or just a chart 📊
    color: "from-blue-500 to-cyan-400",
    modules: [
        {
            id: "polars-basics",
            title: "Module 1: Getting Started with Polars",
            description: "Core concepts and basic operations.",
            chapters: ["1", "2", "3", "4", "5", "6", "7"],
        }
    ]
};

export const lessons: Lesson[] = [
    ...ch01Lessons,
    ...ch02Lessons,
    ...ch03Lessons,
    ...ch04Lessons,
    ...ch05Lessons,
    ...ch06Lessons,
    ...ch07Lessons,
];
