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
