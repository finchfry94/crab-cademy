import { ref, computed } from "vue";
import { getFirstLesson, getLesson, type Lesson } from "../data/lessons";
import { getProgress, markLessonRead, saveUserCode, type Progress } from "../services/progressStore";
import type { TestResult } from "../services/codeRunner";

export type { Lesson };

const currentLesson = ref<Lesson | null>(null);
const progress = ref<Progress | null>(null);
const activeTab = ref<"lesson" | "objectives" | "results">("lesson");
const isLoading = ref(true);
const quizCompleted = ref(false);
const quizAnswers = ref<Record<number, number>>({}); // questionIndex → selectedOptionIndex
const testResults = ref<TestResult[]>([]);
const hasRunTests = ref(false);

export function useLessonState() {
    const isLessonRead = computed(() => progress.value?.lesson_read ?? false);
    const isCompleted = computed(() => progress.value?.completed ?? false);
    const allTestsPassed = computed(() =>
        testResults.value.length > 0 && testResults.value.every((t) => t.passed)
    );

    async function loadLesson(pathId: string) {
        isLoading.value = true;
        try {
            currentLesson.value = getFirstLesson(pathId);
            if (currentLesson.value) {
                progress.value = await getProgress(currentLesson.value.id);
            }
        } catch (error) {
            console.error("Failed to load lesson:", error);
        } finally {
            isLoading.value = false;
        }
    }

    async function loadLessonById(pathId: string, id: string) {
        isLoading.value = true;
        activeTab.value = "lesson";
        quizCompleted.value = false;
        quizAnswers.value = {};
        testResults.value = [];
        hasRunTests.value = false;
        try {
            currentLesson.value = getLesson(pathId, id);
            if (currentLesson.value) {
                progress.value = await getProgress(currentLesson.value.id);
            }
        } catch (error) {
            console.error("Failed to load lesson:", error);
        } finally {
            isLoading.value = false;
        }
    }

    function setQuizAnswer(questionIndex: number, optionIndex: number) {
        quizAnswers.value = { ...quizAnswers.value, [questionIndex]: optionIndex };
    }

    function submitQuiz() {
        if (!currentLesson.value) return false;
        const quiz = currentLesson.value.quiz;
        const allCorrect = quiz.every(
            (q, i) => quizAnswers.value[i] === q.correctIndex
        );
        if (allCorrect) {
            quizCompleted.value = true;
        }
        return allCorrect;
    }

    function setTestResults(results: TestResult[]) {
        testResults.value = results;
        hasRunTests.value = true;
    }

    async function unlockObjectives() {
        if (currentLesson.value && !isLessonRead.value) {
            await markLessonRead(currentLesson.value.id);
            progress.value = await getProgress(currentLesson.value.id);
        }
    }

    async function updateUserCode(code: string) {
        if (currentLesson.value) {
            await saveUserCode(currentLesson.value.id, code);
        }
    }

    function setActiveTab(tab: "lesson" | "objectives" | "results") {
        activeTab.value = tab;
    }

    return {
        currentLesson,
        progress,
        activeTab,
        isLoading,
        isLessonRead,
        isCompleted,
        quizCompleted,
        quizAnswers,
        testResults,
        hasRunTests,
        allTestsPassed,
        loadLesson,
        loadLessonById,
        setQuizAnswer,
        submitQuiz,
        setTestResults,
        unlockObjectives,
        updateUserCode,
        setActiveTab,
    };
}
