//! Integration tests for the lessons module (TOML loading)

use std::path::PathBuf;

/// Lesson structure matching the TOML format
#[derive(Debug, serde::Deserialize)]
#[allow(dead_code)]
struct Lesson {
    id: String,
    chapter: String,
    title: String,
    content: String,
    starter_code: String,
    test_code: String,
    sort_order: i32,
}

#[test]
fn test_parse_lesson_toml() {
    let toml_content = r#"
id = "test-lesson"
chapter = "1.0"
title = "Test Lesson"
sort_order = 1
content = '''
# Test Content
'''
starter_code = '''
fn main() {}
'''
test_code = '''
fn main() {}
'''
"#;

    let lesson: Lesson = toml::from_str(toml_content).expect("Failed to parse TOML");
    assert_eq!(lesson.id, "test-lesson");
    assert_eq!(lesson.chapter, "1.0");
    assert_eq!(lesson.title, "Test Lesson");
}

#[test]
fn test_lessons_directory_exists() {
    let dev_path = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("resources")
        .join("lessons");
    assert!(dev_path.exists(), "Lessons directory should exist");
}

#[test]
fn test_load_ch01_01() {
    let path = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("resources")
        .join("lessons")
        .join("ch01-01.toml");

    let content = std::fs::read_to_string(&path).expect("Failed to read ch01-01.toml");
    let lesson: Lesson = toml::from_str(&content).expect("Failed to parse ch01-01.toml");

    assert_eq!(lesson.id, "ch01-01");
    assert_eq!(lesson.chapter, "1.1");
    assert_eq!(lesson.title, "Hello, World!");
    assert!(lesson.content.contains("Hello, World!"));
}

#[test]
fn test_all_lessons_valid() {
    let lessons_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("resources")
        .join("lessons");

    let entries = std::fs::read_dir(&lessons_dir).expect("Failed to read lessons directory");

    for entry in entries {
        let entry = entry.expect("Failed to read entry");
        let path = entry.path();

        if path.extension().map_or(false, |ext| ext == "toml") {
            let content = std::fs::read_to_string(&path)
                .unwrap_or_else(|_| panic!("Failed to read {:?}", path));
            let _lesson: Lesson = toml::from_str(&content)
                .unwrap_or_else(|e| panic!("Failed to parse {:?}: {}", path, e));
        }
    }
}
