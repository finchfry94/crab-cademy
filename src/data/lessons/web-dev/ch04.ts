import { Lesson } from "../../types";

export const ch04Lessons: Lesson[] = [
    {
        id: "webdev-04",
        chapter: "1.4",
        title: "App State & Layers",
        sort_order: 4,
        environment: "desktop",
        content: `# App State & Layers

Real applications need **shared state** (like a database connection or configuration) and **middleware** (logging, CORS, authentication). Axum handles both elegantly.

## Shared State

Use \`State<T>\` to share data across all handlers:

\`\`\`rust
use axum::extract::State;
use std::sync::Arc;
use tokio::sync::Mutex;

struct AppState {
    counter: Mutex<u64>,
}

async fn increment(State(state): State<Arc<AppState>>) -> String {
    let mut count = state.counter.lock().await;
    *count += 1;
    format!("Count: {}", *count)
}
\`\`\`

### Why Arc<Mutex<T>>?

- **Arc** (Atomic Reference Counted) — lets multiple handlers share ownership of the state
- **Mutex** — ensures only one handler modifies the data at a time (thread safety!)

You attach state to your router with \`.with_state()\`:

\`\`\`rust
let state = Arc::new(AppState {
    counter: Mutex::new(0),
});

let app = Router::new()
    .route("/count", get(increment))
    .with_state(state);
\`\`\`

## Middleware with Layers

Axum uses **Tower** for middleware. The most common pattern is adding a \`Layer\`:

\`\`\`rust
use tower_http::trace::TraceLayer;
use tower_http::cors::{CorsLayer, Any};

let app = Router::new()
    .route("/", get(root))
    .layer(TraceLayer::new_for_http())   // Logging
    .layer(
        CorsLayer::new()
            .allow_origin(Any)
            .allow_methods(Any)
    );
\`\`\`

### Common Middleware:
| Layer | Purpose |
|-------|---------|
| \`TraceLayer\` | HTTP request/response logging |
| \`CorsLayer\` | Cross-Origin Resource Sharing headers |
| \`TimeoutLayer\` | Request timeout enforcement |
| \`CompressionLayer\` | Gzip/Brotli response compression |

## ⚠️ Common Mistakes

1. **Forgetting \`Arc\`** — without \`Arc\`, Rust can't share ownership across async tasks. You'll get a move error.
2. **Deadlocks** — holding a \`Mutex\` guard across an \`.await\` point can deadlock. Use \`tokio::sync::Mutex\` (not \`std::sync::Mutex\`) for async code.
3. **Layer order** — layers wrap from bottom to top. The last \`.layer()\` call wraps the outermost.`,
        quiz: [
            {
                question: "Why do we wrap AppState in Arc?",
                options: [
                    "To make it mutable",
                    "To share ownership across async handler tasks",
                    "To make it serializable",
                    "Arc is required by Axum",
                ],
                correctIndex: 1,
            },
            {
                question: "Which Mutex should you use in async Axum handlers?",
                options: [
                    "std::sync::Mutex",
                    "tokio::sync::Mutex",
                    "parking_lot::Mutex",
                    "Any mutex works the same",
                ],
                correctIndex: 1,
            },
            {
                question: "What does CorsLayer do?",
                options: [
                    "Encrypts responses",
                    "Adds Cross-Origin Resource Sharing headers",
                    "Compresses responses",
                    "Logs requests",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Build a hit counter API with two files:

### src/main.rs
- Define \`AppState\` with a \`tokio::sync::Mutex<Vec<String>>\` field called \`messages\`
- \`POST /messages\` — accepts a plain string body and adds it to the vector. Returns the new count as a string.
- \`GET /messages\` — returns all messages as JSON (\`Json<Vec<String>>\`)
- Add CORS middleware (allow any origin)

### src/state.rs
- Define the \`AppState\` struct and a \`new()\` constructor

### Requirements:
- Use \`Arc<AppState>\` with \`.with_state()\`
- Use \`tokio::sync::Mutex\` (not std!)`,
        test_code: `#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::http::{Request, StatusCode};
    use tower::ServiceExt;

    fn test_app() -> Router {
        let state = Arc::new(AppState::new());
        Router::new()
            .route("/messages", get(get_messages).post(add_message))
            .with_state(state)
    }

    #[tokio::test]
    async fn test_add_and_get() {
        let state = Arc::new(AppState::new());
        let app = Router::new()
            .route("/messages", get(get_messages).post(add_message))
            .with_state(state);

        // Add a message
        let response = app.clone()
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/messages")
                    .body(Body::from("Hello!"))
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        assert_eq!(&body[..], b"1");
    }
}`,
        test_files: {
            "src/state.rs": `#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_state_new() {
        let state = AppState::new();
        let messages = state.messages.lock().await;
        assert!(messages.is_empty());
    }
}`
        },
        starter_code: {
            "src/main.rs": `use axum::{extract::State, routing::{get, post}, Json, Router};
use std::sync::Arc;
use tower_http::cors::{CorsLayer, Any};

mod state;
use state::AppState;

async fn add_message(
    State(state): State<Arc<AppState>>,
    body: String,
) -> String {
    // Lock the mutex, push the message, return the new count
    todo!()
}

async fn get_messages(
    State(state): State<Arc<AppState>>,
) -> Json<Vec<String>> {
    // Lock the mutex, clone the messages, return as JSON
    todo!()
}

#[tokio::main]
async fn main() {
    let state = Arc::new(AppState::new());

    let app = Router::new()
        .route("/messages", get(get_messages).post(add_message))
        .layer(CorsLayer::new().allow_origin(Any).allow_methods(Any))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();
    println!("🚀 Server running on http://localhost:3000");
    axum::serve(listener, app).await.unwrap();
}
`,
            "src/state.rs": `use tokio::sync::Mutex;

pub struct AppState {
    pub messages: Mutex<Vec<String>>,
}

impl AppState {
    pub fn new() -> Self {
        // Initialize with an empty message list
        todo!()
    }
}
`
        },
    },
];
