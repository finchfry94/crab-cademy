import { ref, computed, onMounted } from "vue";
import { invoke } from "@tauri-apps/api/core";
import { getProgress, markLessonRead, saveUserCode, type Progress } from "../db/database";

export interface Lesson {
    id: string;
    chapter: string;
    title: string;
    content: string;
    starter_code: string;
    test_code: string;
    sort_order: number;
}

const currentLesson = ref<Lesson | null>(null);
const progress = ref<Progress | null>(null);
const activeTab = ref<"lesson" | "objectives" | "tests">("lesson");
const isLoading = ref(true);

export function useLessonState() {
    const isLessonRead = computed(() => progress.value?.lesson_read ?? false);
    const isCompleted = computed(() => progress.value?.completed ?? false);
    const isObjectivesUnlocked = computed(() => true); // Always unlocked

    async function loadLesson() {
        isLoading.value = true;
        try {
            console.log("Loading lesson from resources...");
            currentLesson.value = await invoke<Lesson | null>("get_first_lesson");
            console.log("Lesson loaded:", currentLesson.value);
            if (currentLesson.value) {
                progress.value = await getProgress(currentLesson.value.id);
                console.log("Progress loaded:", progress.value);
            }
        } catch (error) {
            console.error("Failed to load lesson:", error);
        } finally {
            isLoading.value = false;
        }
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

    function setActiveTab(tab: "lesson" | "objectives" | "tests") {
        if (tab === "objectives" && !isObjectivesUnlocked.value) {
            return;
        }
        activeTab.value = tab;
    }

    onMounted(() => {
        loadLesson();
    });

    return {
        currentLesson,
        progress,
        activeTab,
        isLoading,
        isLessonRead,
        isCompleted,
        isObjectivesUnlocked,
        loadLesson,
        unlockObjectives,
        updateUserCode,
        setActiveTab,
    };
}
