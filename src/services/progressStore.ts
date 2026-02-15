/**
 * Progress persistence using localStorage.
 * Replaces the Tauri SQLite plugin (`@tauri-apps/plugin-sql`).
 */

const STORAGE_KEY = "crabcademy_progress";

export interface Progress {
    lesson_id: string;
    lesson_read: boolean;
    completed: boolean;
    user_code: string | null;
}

type ProgressMap = Record<string, Progress>;

function loadAll(): ProgressMap {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function saveAll(data: ProgressMap): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getOrCreate(lessonId: string): Progress {
    const all = loadAll();
    if (!all[lessonId]) {
        all[lessonId] = {
            lesson_id: lessonId,
            lesson_read: false,
            completed: false,
            user_code: null,
        };
        saveAll(all);
    }
    return all[lessonId];
}

export async function getProgress(lessonId: string): Promise<Progress | null> {
    const all = loadAll();
    return all[lessonId] || null;
}

export async function markLessonRead(lessonId: string): Promise<void> {
    const all = loadAll();
    const progress = all[lessonId] || getOrCreate(lessonId);
    progress.lesson_read = true;
    all[lessonId] = progress;
    saveAll(all);
}

export async function saveUserCode(lessonId: string, code: string): Promise<void> {
    const all = loadAll();
    const progress = all[lessonId] || getOrCreate(lessonId);
    progress.user_code = code;
    all[lessonId] = progress;
    saveAll(all);
}

export async function markCompleted(lessonId: string): Promise<void> {
    const all = loadAll();
    const progress = all[lessonId] || getOrCreate(lessonId);
    progress.completed = true;
    all[lessonId] = progress;
    saveAll(all);
}

export function resetLesson(lessonId: string): void {
    const all = loadAll();
    delete all[lessonId];
    saveAll(all);
}
