import Database from "@tauri-apps/plugin-sql";

let db: Database | null = null;

export interface Progress {
    lesson_id: string;
    lesson_read: boolean;
    completed: boolean;
    user_code: string | null;
}

async function getDb(): Promise<Database> {
    if (!db) {
        db = await Database.load("sqlite:crabcademy.db");
    }
    return db;
}

export async function getProgress(lessonId: string): Promise<Progress | null> {
    const database = await getDb();
    const result = await database.select<Progress[]>(
        "SELECT * FROM progress WHERE lesson_id = ?",
        [lessonId]
    );
    return result[0] || null;
}

export async function markLessonRead(lessonId: string): Promise<void> {
    const database = await getDb();
    await database.execute(
        `INSERT INTO progress (lesson_id, lesson_read) VALUES (?, 1)
     ON CONFLICT(lesson_id) DO UPDATE SET lesson_read = 1`,
        [lessonId]
    );
}

export async function saveUserCode(
    lessonId: string,
    code: string
): Promise<void> {
    const database = await getDb();
    await database.execute(
        `INSERT INTO progress (lesson_id, user_code) VALUES (?, ?)
     ON CONFLICT(lesson_id) DO UPDATE SET user_code = ?`,
        [lessonId, code, code]
    );
}

export async function markCompleted(lessonId: string): Promise<void> {
    const database = await getDb();
    await database.execute(
        `INSERT INTO progress (lesson_id, completed) VALUES (?, 1)
     ON CONFLICT(lesson_id) DO UPDATE SET completed = 1`,
        [lessonId]
    );
}
