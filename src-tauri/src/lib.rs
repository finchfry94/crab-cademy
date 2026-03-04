pub mod execution;
pub mod lessons;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn run_code(
    app: tauri::AppHandle,
    code: String,
    use_sandbox: bool,
    is_test: bool,
    args: Option<Vec<String>>,
) -> String {
    execution::execute_rust_code(
        Some(&app),
        &code,
        use_sandbox,
        is_test,
        args.unwrap_or_default(),
    )
}

#[tauri::command]
async fn run_code_multi(
    app: tauri::AppHandle,
    files: std::collections::HashMap<String, String>,
    use_sandbox: bool,
    is_test: bool,
    args: Option<Vec<String>>,
) -> String {
    execution::execute_multi_file(
        Some(&app),
        files,
        use_sandbox,
        is_test,
        args.unwrap_or_default(),
    )
}

use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Only progress table - lessons are now bundled JSON
    let migrations = vec![Migration {
        version: 1,
        description: "create_progress_table",
        sql: r#"
            CREATE TABLE IF NOT EXISTS progress (
                lesson_id TEXT PRIMARY KEY,
                lesson_read INTEGER DEFAULT 0,
                completed INTEGER DEFAULT 0,
                user_code TEXT
            );
        "#,
        kind: MigrationKind::Up,
    }];

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:crabcademy.db", migrations)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![
            greet,
            run_code,
            run_code_multi,
            lessons::get_all_lessons,
            lessons::get_lesson,
            lessons::get_first_lesson
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
