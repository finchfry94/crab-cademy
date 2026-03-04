import { Lesson } from "../../types";

export const ch14Lessons: Lesson[] = [
    {
        id: "webdev-14",
        chapter: "5.3",
        title: "Controllers & Views",
        sort_order: 14,
        environment: "desktop",
        content: `# Controllers & Views

In Loco, the **controller** is the heart of request handling. It replaces the boilerplate you'd write with raw Axum by providing conventions for:
- Response formatting
- Error handling
- Route registration

## Loco's Response Helpers

Instead of manually constructing \`Json<T>\` or \`(StatusCode, Json<T>)\`, Loco provides the \`format\` module:

\`\`\`rust
use loco_rs::prelude::*;

// Return JSON
format::json(item)  // → 200 with JSON body

// Return empty response
format::empty()     // → 200 with no body

// Return with status
format::render()
    .status_code(StatusCode::CREATED)
    .json(item)     // → 201 with JSON body
\`\`\`

Compare to raw Axum:
\`\`\`rust
// Raw Axum equivalent
(StatusCode::CREATED, Json(item))
\`\`\`

The Loco version is more readable and handles serialization errors gracefully.

## Error Handling

Loco controllers return \`Result<Response>\`. Errors are automatically converted to proper HTTP responses:

\`\`\`rust
async fn get_item(Path(id): Path<i32>) -> Result<Response> {
    let item = find_item(id)
        .ok_or_else(|| Error::NotFound)?;
    
    format::json(item)
}
\`\`\`

If \`find_item\` returns \`None\`, the user gets a **404 Not Found** automatically. No manual status code setting!

### Common Error Types:
| Error | HTTP Status |
|-------|-------------|
| \`Error::NotFound\` | 404 |
| \`Error::BadRequest\` | 400 |
| \`Error::Unauthorized\` | 401 |
| \`Error::InternalServerError\` | 500 |

## Route Groups

Loco organizes routes into groups with a common prefix:

\`\`\`rust
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/items")             // All routes start with /api/items
        .add("/", get(list).post(create))
        .add("/:id", get(show).put(update).delete(destroy))
}
\`\`\`

This mirrors RESTful conventions:
- \`GET /api/items\` → list all
- \`POST /api/items\` → create
- \`GET /api/items/:id\` → show one
- \`PUT /api/items/:id\` → update
- \`DELETE /api/items/:id\` → delete

## ⚠️ Common Mistakes

1. **Mixing Loco and raw Axum response types** — pick one pattern per controller.
2. **Not using \`Result<Response>\`** — Loco's error handling only works with this return type.
3. **Forgetting the prefix** — without \`.prefix()\`, your routes will be at the root path.`,
        quiz: [
            {
                question: "What does format::json(data) return in Loco?",
                options: [
                    "A String",
                    "A Result<Response> with JSON body",
                    "A raw JSON string",
                    "An HTTP redirect",
                ],
                correctIndex: 1,
            },
            {
                question: "What happens when a Loco controller returns Error::NotFound?",
                options: [
                    "The server panics",
                    "A 404 response is sent automatically",
                    "The error is logged and ignored",
                    "A 500 response is sent",
                ],
                correctIndex: 1,
            },
            {
                question: "What RESTful convention does .add('/:id', get(show).put(update).delete(destroy)) follow?",
                options: [
                    "GraphQL",
                    "RPC-style",
                    "Standard REST resource routes",
                    "WebSocket events",
                ],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

Build a notes API with proper error handling:

### src/main.rs
- Wire up the notes controller routes

### src/controllers/notes.rs
- \`GET /notes\` — returns all notes as JSON
- \`GET /notes/:id\` — returns a single note or 404
- \`POST /notes\` — creates a new note, returns 201

### src/models/note.rs
- \`Note\` struct with \`id: u64\`, \`title: String\`, \`body: String\`
- \`CreateNote\` struct with \`title\` and \`body\`

### Requirements:
- If a note with the requested id doesn't exist, return a 404 with \`{"error": "Not found"}\`
- The list endpoint should return a hardcoded list of 2 notes`,
        test_code: "",
        test_files: {
            "src/controllers/notes.rs": `#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::http::{Request, StatusCode, header};
    use tower::ServiceExt;

    #[tokio::test]
    async fn test_list_notes() {
        let app = routes();
        let response = app
            .oneshot(Request::builder().uri("/notes").body(Body::empty()).unwrap())
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        let notes: Vec<serde_json::Value> = serde_json::from_slice(&body).unwrap();
        assert_eq!(notes.len(), 2);
    }

    #[tokio::test]
    async fn test_get_note_found() {
        let app = routes();
        let response = app
            .oneshot(Request::builder().uri("/notes/1").body(Body::empty()).unwrap())
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
    }

    #[tokio::test]
    async fn test_get_note_not_found() {
        let app = routes();
        let response = app
            .oneshot(Request::builder().uri("/notes/999").body(Body::empty()).unwrap())
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::NOT_FOUND);
    }

    #[tokio::test]
    async fn test_create_note() {
        let app = routes();
        let response = app
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/notes")
                    .header(header::CONTENT_TYPE, "application/json")
                    .body(Body::from(r#"{"title":"Test","body":"Test body"}"#))
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::CREATED);
    }
}`
        },
        starter_code: {
            "src/main.rs": `mod controllers;
mod models;

use axum::Router;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .merge(controllers::notes::routes());

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();
    println!("🚂 Server on http://localhost:3000");
    axum::serve(listener, app).await.unwrap();
}
`,
            "src/models/note.rs": `use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize)]
pub struct Note {
    pub id: u64,
    pub title: String,
    pub body: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateNote {
    pub title: String,
    pub body: String,
}
`,
            "src/models/mod.rs": `pub mod note;
`,
            "src/controllers/notes.rs": `use axum::{
    extract::Path, routing::{get, post},
    http::StatusCode, Json, Router,
};
use crate::models::note::{Note, CreateNote};
use serde::Serialize;

#[derive(Serialize)]
struct ErrorResponse {
    error: String,
}

fn sample_notes() -> Vec<Note> {
    vec![
        Note { id: 1, title: "First Note".into(), body: "Hello world".into() },
        Note { id: 2, title: "Second Note".into(), body: "Learning Loco".into() },
    ]
}

async fn list() -> Json<Vec<Note>> {
    // Return sample_notes() as JSON
    todo!()
}

async fn show(Path(id): Path<u64>) -> Result<Json<Note>, (StatusCode, Json<ErrorResponse>)> {
    // Find the note by id in sample_notes()
    // If found: return Ok(Json(note))
    // If not found: return Err((StatusCode::NOT_FOUND, Json(ErrorResponse { error: "Not found".into() })))
    todo!()
}

async fn create(Json(payload): Json<CreateNote>) -> (StatusCode, Json<Note>) {
    // Create a new Note with id = 3 from the payload
    // Return StatusCode::CREATED
    todo!()
}

pub fn routes() -> Router {
    Router::new()
        .route("/notes", get(list).post(create))
        .route("/notes/:id", get(show))
}
`,
            "src/controllers/mod.rs": `pub mod notes;
`
        },
    },
];
