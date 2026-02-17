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
}

export interface LearningPath {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string; // Tailwind gradient classes, e.g. "from-orange-500 to-red-600"
}
