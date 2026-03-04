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

export const path: LearningPath = {
    id: "web-dev",
    title: "Web Dev with Rust",
    description:
        "Build web APIs from scratch with Axum, understand the database progression from raw SQL to ORMs, then ship production apps with the Loco framework.",
    icon: "🚀",
    color: "from-violet-500 to-indigo-600",
    modules: [
        {
            id: "axum-fundamentals",
            title: "Module 1: Axum Fundamentals",
            description: "Core web framework concepts — routing, handlers, JSON, state.",
            chapters: ["1"],
        },
        {
            id: "simulation",
            title: "Module 2: State & Simulation",
            description: "Understand tables and the problem of data persistence using pure Rust.",
            chapters: ["2"],
        },
        {
            id: "raw-sqlite",
            title: "Module 3: Raw SQL with SQLite",
            description: "Writing full SQL strings. Experience the pain of manual row mapping.",
            chapters: ["3"],
        },
        {
            id: "path-to-orms",
            title: "Module 4: The Path to ORMs",
            description: "Solving raw SQL problems using compile-time checked SQLx and ORMs.",
            chapters: ["4"],
        },
        {
            id: "enter-loco",
            title: "Module 5: Enter Loco",
            description: "Convention over configuration — the Rails of Rust.",
            chapters: ["5"],
        },
        {
            id: "full-app",
            title: "Module 6: Building a Full App",
            description: "CRUD, authentication, and background jobs.",
            chapters: ["6"],
        },
        {
            id: "production",
            title: "Module 7: Production Patterns",
            description: "Testing, deployment, and ship-ready code.",
            chapters: ["7"],
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
];
