import { Lesson } from "../../types";

export const ch15Lessons: Lesson[] = [
    {
        id: "webdev-15",
        chapter: "6.1",
        title: "CRUD API",
        sort_order: 15,
        environment: "desktop",
        content: `# Building a CRUD API

Time to combine everything you've learned into a real **CRUD** (Create, Read, Update, Delete) API. This is the bread and butter of web development — nearly every app needs these four operations.

## REST Convention

RESTful APIs follow a predictable pattern:

| Operation | HTTP Method | Route | Handler |
|-----------|------------|-------|---------|
| List all | GET | \`/api/tasks\` | \`list\` |
| Get one | GET | \`/api/tasks/:id\` | \`show\` |
| Create | POST | \`/api/tasks\` | \`create\` |
| Update | PUT | \`/api/tasks/:id\` | \`update\` |
| Delete | DELETE | \`/api/tasks/:id\` | \`destroy\` |

## In-Memory Store

For this lesson, we'll use an in-memory \`Vec\` behind a \`Mutex\` (like we learned in Module 1). In a real Loco app, this would be a database query.

\`\`\`rust
use std::sync::Arc;
use tokio::sync::Mutex;

struct AppState {
    tasks: Mutex<Vec<Task>>,
    next_id: Mutex<u64>,
}
\`\`\`

## The Update Pattern

Updates are interesting because you need to:
1. Find the existing record
2. Apply changes
3. Return the updated version

\`\`\`rust
async fn update(
    Path(id): Path<u64>,
    State(state): State<Arc<AppState>>,
    Json(payload): Json<UpdateTask>,
) -> Result<Json<Task>, StatusCode> {
    let mut tasks = state.tasks.lock().await;
    let task = tasks.iter_mut()
        .find(|t| t.id == id)
        .ok_or(StatusCode::NOT_FOUND)?;
    
    if let Some(title) = payload.title {
        task.title = title;
    }
    if let Some(completed) = payload.completed {
        task.completed = completed;
    }
    
    Ok(Json(task.clone()))
}
\`\`\`

Notice the \`Option<T>\` fields in \`UpdateTask\` — this lets clients send partial updates (only the fields they want to change).

## ⚠️ Common Mistakes

1. **Cloning vs borrowing** — when returning data from behind a Mutex, you often need to \`.clone()\` since the lock is dropped when the function returns.
2. **Forgetting NOT_FOUND** — always handle the case where the ID doesn't exist.
3. **ID generation** — use a separate counter instead of \`tasks.len()\` to avoid ID reuse after deletions.`,
        quiz: [
            {
                question: "What HTTP method is conventionally used for updates?",
                options: ["POST", "PATCH", "PUT", "UPDATE"],
                correctIndex: 2,
            },
            {
                question: "Why use Option<T> fields in an update struct?",
                options: [
                    "To make the struct smaller",
                    "To allow partial updates — only changed fields are sent",
                    "To avoid compilation errors",
                    "Option is required by Axum",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Build a complete Task CRUD API with in-memory storage:

### Endpoints:
- \`GET /api/tasks\` — list all tasks
- \`POST /api/tasks\` — create a task
- \`PUT /api/tasks/:id\` — update a task
- \`DELETE /api/tasks/:id\` — delete a task (return 204 No Content)

### Models:
- \`Task\`: id (u64), title (String), completed (bool)
- \`CreateTask\`: title (String)
- \`UpdateTask\`: title (Option<String>), completed (Option<bool>)`,
        test_code: "",
        test_files: {
            "src/controllers/tasks.rs": `#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::http::{Request, StatusCode, header};
    use tower::ServiceExt;

    fn test_app() -> Router {
        let state = Arc::new(AppState::new());
        make_router(state)
    }

    #[tokio::test]
    async fn test_create_task() {
        let app = test_app();
        let response = app
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/api/tasks")
                    .header(header::CONTENT_TYPE, "application/json")
                    .body(Body::from(r#"{"title":"Learn Rust"}"#))
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::CREATED);
        let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        let task: serde_json::Value = serde_json::from_slice(&body).unwrap();
        assert_eq!(task["title"], "Learn Rust");
        assert_eq!(task["completed"], false);
    }

    #[tokio::test]
    async fn test_list_tasks() {
        let app = test_app();
        let response = app
            .oneshot(Request::builder().uri("/api/tasks").body(Body::empty()).unwrap())
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
    }
}`
        },
        starter_code: {
            "src/main.rs": `mod controllers;
mod models;

use std::sync::Arc;
use controllers::tasks::{AppState, make_router};

#[tokio::main]
async fn main() {
    let state = Arc::new(AppState::new());
    let app = make_router(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();
    println!("🚀 Task API on http://localhost:3000");
    axum::serve(listener, app).await.unwrap();
}
`,
            "src/models/task.rs": `use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize)]
pub struct Task {
    pub id: u64,
    pub title: String,
    pub completed: bool,
}

#[derive(Debug, Deserialize)]
pub struct CreateTask {
    pub title: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateTask {
    pub title: Option<String>,
    pub completed: Option<bool>,
}
`,
            "src/models/mod.rs": `pub mod task;
`,
            "src/controllers/tasks.rs": `use axum::{
    extract::{Path, State},
    routing::{get, post, put, delete},
    http::StatusCode, Json, Router,
};
use std::sync::Arc;
use tokio::sync::Mutex;
use crate::models::task::{Task, CreateTask, UpdateTask};

pub struct AppState {
    tasks: Mutex<Vec<Task>>,
    next_id: Mutex<u64>,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            tasks: Mutex::new(Vec::new()),
            next_id: Mutex::new(1),
        }
    }
}

async fn list(State(state): State<Arc<AppState>>) -> Json<Vec<Task>> {
    let tasks = state.tasks.lock().await;
    Json(tasks.clone())
}

async fn create(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<CreateTask>,
) -> (StatusCode, Json<Task>) {
    // 1. Get and increment next_id
    // 2. Create a Task with completed = false
    // 3. Push to the tasks vec
    // 4. Return (StatusCode::CREATED, Json(task))
    todo!()
}

async fn update(
    Path(id): Path<u64>,
    State(state): State<Arc<AppState>>,
    Json(payload): Json<UpdateTask>,
) -> Result<Json<Task>, StatusCode> {
    // 1. Find the task by id
    // 2. Apply partial updates (if Some)
    // 3. Return Ok(Json(task.clone())) or Err(StatusCode::NOT_FOUND)
    todo!()
}

async fn destroy(
    Path(id): Path<u64>,
    State(state): State<Arc<AppState>>,
) -> StatusCode {
    // 1. Remove the task by id
    // 2. Return NO_CONTENT if found, NOT_FOUND if not
    todo!()
}

pub fn make_router(state: Arc<AppState>) -> Router {
    Router::new()
        .route("/api/tasks", get(list).post(create))
        .route("/api/tasks/:id", put(update).delete(destroy))
        .with_state(state)
}
`,
            "src/controllers/mod.rs": `pub mod tasks;
`
        },
    },
];
