use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::Manager;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Lesson {
    pub id: String,
    pub chapter: String,
    pub title: String,
    pub content: String,
    pub starter_code: String,
    pub test_code: String,
    pub sort_order: i32,
}

/// Get the lessons directory, with dev mode fallback
fn get_lessons_dir(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    // Try bundled resources first (production)
    let resource_path = app
        .path()
        .resource_dir()
        .map_err(|e| format!("Failed to get resource dir: {}", e))?
        .join("lessons");

    if resource_path.exists() {
        return Ok(resource_path);
    }

    // Dev mode fallback: look in src-tauri/resources/lessons
    let dev_path = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("resources")
        .join("lessons");

    if dev_path.exists() {
        return Ok(dev_path);
    }

    Err(format!(
        "Lessons directory not found. Tried: {:?} and {:?}",
        resource_path, dev_path
    ))
}

/// Get all lessons from bundled resources
#[tauri::command]
pub fn get_all_lessons(app: tauri::AppHandle) -> Result<Vec<Lesson>, String> {
    let lessons_dir = get_lessons_dir(&app)?;
    let mut lessons = Vec::new();

    let entries =
        fs::read_dir(&lessons_dir).map_err(|e| format!("Failed to read lessons dir: {}", e))?;

    for entry in entries {
        let entry = entry.map_err(|e| format!("Failed to read entry: {}", e))?;
        let path = entry.path();

        if path.extension().map_or(false, |ext| ext == "toml") {
            let content = fs::read_to_string(&path)
                .map_err(|e| format!("Failed to read {}: {}", path.display(), e))?;
            let lesson: Lesson = toml::from_str(&content)
                .map_err(|e| format!("Failed to parse {}: {}", path.display(), e))?;
            lessons.push(lesson);
        }
    }

    lessons.sort_by_key(|l| l.sort_order);
    Ok(lessons)
}

/// Get a single lesson by ID
#[tauri::command]
pub fn get_lesson(app: tauri::AppHandle, id: String) -> Result<Option<Lesson>, String> {
    let lessons = get_all_lessons(app)?;
    Ok(lessons.into_iter().find(|l| l.id == id))
}

/// Get the first lesson
#[tauri::command]
pub fn get_first_lesson(app: tauri::AppHandle) -> Result<Option<Lesson>, String> {
    let lessons = get_all_lessons(app)?;
    Ok(lessons.into_iter().next())
}
