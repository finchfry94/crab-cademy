import { Lesson } from "../../types";

export const ch18Lessons: Lesson[] = [
    {
        id: "webdev-18",
        chapter: "7.1",
        title: "Testing Your API",
        sort_order: 18,
        environment: "desktop",
        content: `# Testing Your API

You've built routes, handlers, extractors, and state. Now make sure they actually work! Axum provides excellent testing support through Tower's \`ServiceExt\` — you can test your app without starting a real server.

## The Testing Pattern

\`\`\`rust
use axum::body::Body;
use axum::http::{Request, StatusCode};
use tower::ServiceExt; // for .oneshot()

#[tokio::test]
async fn test_hello() {
    let app = Router::new().route("/", get(hello));

    let response = app
        .oneshot(
            Request::builder()
                .uri("/")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
    
    let body = axum::body::to_bytes(response.into_body(), usize::MAX)
        .await
        .unwrap();
    assert_eq!(&body[..], b"Hello, World!");
}
\`\`\`

### Key Concepts:
- **\`.oneshot()\`** — sends a single request without starting a server
- **\`Request::builder()\`** — constructs HTTP requests programmatically
- **\`Body::empty()\`** — for GET requests with no body
- **\`axum::body::to_bytes()\`** — reads the response body

## Testing JSON APIs

\`\`\`rust
use axum::http::header;

#[tokio::test]
async fn test_create_item() {
    let app = make_app();

    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/items")
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(r#"{"name":"Test Item"}"#))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::CREATED);
    
    let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
    let item: serde_json::Value = serde_json::from_slice(&body).unwrap();
    assert_eq!(item["name"], "Test Item");
}
\`\`\`

**Remember**: POST/PUT requests need the \`Content-Type: application/json\` header!

## Testing with State

When your app has state, create it fresh for each test:

\`\`\`rust
fn test_app() -> Router {
    let state = Arc::new(AppState::new());
    make_router(state) // same function used in main()
}
\`\`\`

This ensures tests are **isolated** — no shared mutable state between tests.

## Test Organization

\`\`\`rust
#[cfg(test)]
mod tests {
    use super::*;
    
    // Helper: builds the test app
    fn app() -> Router { /* ... */ }
    
    // Tests grouped by feature
    mod list {
        #[tokio::test]
        async fn returns_empty_list() { /* ... */ }
        
        #[tokio::test]
        async fn returns_items_after_creation() { /* ... */ }
    }
    
    mod create {
        #[tokio::test]
        async fn creates_with_valid_data() { /* ... */ }
        
        #[tokio::test]
        async fn rejects_invalid_json() { /* ... */ }
    }
}
\`\`\`

## ⚠️ Common Mistakes

1. **Forgetting \`Content-Type\`** — JSON endpoints will return 415 Unsupported Media Type.
2. **Shared state between tests** — create fresh state per test to avoid flaky tests.
3. **Not testing error cases** — test 404s, 400s, and 401s too!`,
        quiz: [
            {
                question: "What does .oneshot() do in Axum testing?",
                options: [
                    "Starts a server on a random port",
                    "Sends a single request to the app without starting a server",
                    "Runs the test only once",
                    "Creates a mock server",
                ],
                correctIndex: 1,
            },
            {
                question: "Why should each test create fresh app state?",
                options: [
                    "It's required by Rust",
                    "To ensure tests are isolated and don't affect each other",
                    "To test the constructor",
                    "For better performance",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Write tests for a todo API:

### src/app.rs
- The todo app is already implemented
- \`make_app()\` returns a Router with:
  - \`GET /todos\` — list all (starts empty)
  - \`POST /todos\` — create (\`{"title": "..."}\`)
  - \`DELETE /todos/:id\` — delete (204 or 404)

### src/main.rs
- Write a comprehensive test suite in the tests module
- Test: empty list returns \`[]\`
- Test: create returns 201 with the todo
- Test: delete existing returns 204
- Test: delete non-existent returns 404`,
        test_code: `#[cfg(test)]
mod grading_tests {
    use super::*;
    use axum::body::Body;
    use axum::http::{Request, StatusCode, header};
    use tower::ServiceExt;

    #[tokio::test]
    async fn test_student_tests_exist() {
        // This test just verifies the student's code compiles with tests
        let app = app::make_app();
        let response = app
            .oneshot(Request::builder().uri("/todos").body(Body::empty()).unwrap())
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
    }
}`,
        starter_code: {
            "src/main.rs": `mod app;

#[tokio::main]
async fn main() {
    let app = app::make_app();

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();
    println!("📝 Todo API on http://localhost:3000");
    axum::serve(listener, app).await.unwrap();
}

// ============================================
// YOUR TESTS GO HERE
// ============================================
#[cfg(test)]
mod tests {
    use crate::app;
    use axum::body::Body;
    use axum::http::{Request, StatusCode, header};
    use tower::ServiceExt;

    #[tokio::test]
    async fn test_list_empty() {
        // Test that GET /todos returns an empty JSON array
        todo!()
    }

    #[tokio::test]
    async fn test_create_todo() {
        // Test that POST /todos with {"title": "Learn testing"}
        // returns 201 and the created todo
        todo!()
    }

    #[tokio::test]
    async fn test_delete_existing() {
        // Create a todo first, then delete it
        // Should return 204 No Content
        todo!()
    }

    #[tokio::test]
    async fn test_delete_not_found() {
        // Try to delete a todo that doesn't exist
        // Should return 404 Not Found
        todo!()
    }
}
`,
            "src/app.rs": `use axum::{
    extract::{Path, State},
    routing::{get, post, delete},
    http::StatusCode, Json, Router,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Debug, Clone, Serialize)]
pub struct Todo {
    pub id: u64,
    pub title: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateTodo {
    pub title: String,
}

struct AppState {
    todos: Mutex<Vec<Todo>>,
    next_id: Mutex<u64>,
}

pub fn make_app() -> Router {
    let state = Arc::new(AppState {
        todos: Mutex::new(Vec::new()),
        next_id: Mutex::new(1),
    });

    Router::new()
        .route("/todos", get(list).post(create))
        .route("/todos/:id", delete(remove))
        .with_state(state)
}

async fn list(State(state): State<Arc<AppState>>) -> Json<Vec<Todo>> {
    let todos = state.todos.lock().await;
    Json(todos.clone())
}

async fn create(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<CreateTodo>,
) -> (StatusCode, Json<Todo>) {
    let mut next_id = state.next_id.lock().await;
    let todo = Todo { id: *next_id, title: payload.title };
    *next_id += 1;
    state.todos.lock().await.push(todo.clone());
    (StatusCode::CREATED, Json(todo))
}

async fn remove(
    Path(id): Path<u64>,
    State(state): State<Arc<AppState>>,
) -> StatusCode {
    let mut todos = state.todos.lock().await;
    let len_before = todos.len();
    todos.retain(|t| t.id != id);
    if todos.len() < len_before {
        StatusCode::NO_CONTENT
    } else {
        StatusCode::NOT_FOUND
    }
}
`
        },
    },
];
