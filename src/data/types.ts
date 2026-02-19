export interface QuizQuestion {
    question: string;
    options: string[];
    correctIndex: number;
}

export interface Lesson {
    id: string;
    chapter: string;
    title: string;
    content: string;
    quiz: QuizQuestion[];
    objectives: string;
    test_code: string;
    starter_code: string;
    sort_order: number;
    environment: "browser" | "desktop";
    default_args?: string[];
}

export interface Module {
    id: string;
    title: string;
    description?: string;
    chapters: string[]; // Corresponding to lesson.chapter split[0]
}

export interface LearningPath {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string; // Tailwind gradient classes, e.g. "from-orange-500 to-red-600"
    modules?: Module[];
}
