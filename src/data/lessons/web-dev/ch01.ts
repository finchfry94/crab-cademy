import { Lesson } from "../../types";

export const ch01Lessons: Lesson[] = [
    {
        id: "webdev-01",
        chapter: "1.1",
        title: "Hello Axum",
        sort_order: 1,
        environment: "desktop",
        content: `# Hello Axum

Welcome to **Web Dev with Rust**! We're going to build web servers and APIs using the Rust ecosystem's most popular tools. But first, let's understand the foundation: **Axum**.

## What is Axum?

Axum is a web framework built by the **Tokio team** — the same people who built Rust's async runtime. It's fast, ergonomic, and designed to work seamlessly with the Tokio ecosystem.

If you're coming from other languages:
- **Express.js** (Node) → Axum is similar but with type safety and zero-cost abstractions
- **Flask/FastAPI** (Python) → Similar routing, but compiled and much faster
- **Sinatra** (Ruby) → Minimal, composable, no magic

## Your First Server

\`\`\`rust
use axum::{routing::get, Router};

async fn hello() -> &'static str {
    "Hello, World!"
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/", get(hello));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();

    axum::serve(listener, app).await.unwrap();
}
\`\`\`

### What's happening here?

| Line | Purpose |
|------|---------|
| \`Router::new()\` | Creates a new router (like Express's \`app\`) |
| \`.route("/", get(hello))\` | Maps GET \`/\` to the \`hello\` function |
| \`async fn hello()\` | A **handler** — an async function that returns a response |
| \`TcpListener::bind\` | Binds to port 3000 |
| \`axum::serve\` | Starts serving requests |

## Handlers

In Axum, a **handler** is any async function that returns something implementing \`IntoResponse\`. Strings, JSON, status codes — they all work:

\`\`\`rust
async fn plain_text() -> &'static str {
    "Just a string — Axum converts this to a 200 OK response"
}
\`\`\`

The simplicity is the point. No annotations, no decorators, no macros on your handlers. Just functions.

## ⚠️ Common Mistakes

1. **Forgetting \`#[tokio::main]\`** — Axum is async, so \`main\` must be an async function running on Tokio.
2. **Using \`0.0.0.0\` vs \`127.0.0.1\`** — \`0.0.0.0\` listens on all interfaces (needed in containers), \`127.0.0.1\` is localhost only.
3. **Port conflicts** — If port 3000 is in use, you'll get an error. Change it!`,
        quiz: [
            {
                question: "What is Axum built on top of?",
                options: [
                    "Actix",
                    "Hyper and Tokio",
                    "Rocket",
                    "Warp",
                ],
                correctIndex: 1,
            },
            {
                question: "What must a handler function return?",
                options: [
                    "A String",
                    "An HttpResponse",
                    "Anything implementing IntoResponse",
                    "A JSON object",
                ],
                correctIndex: 2,
            },
            {
                question: "Why do we use #[tokio::main]?",
                options: [
                    "It makes the code faster",
                    "It sets up the async runtime needed by Axum",
                    "It's a Rust requirement for all programs",
                    "It enables logging",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Create a web server with **two routes**:

1. \`GET /\` — Returns \`"Welcome to CrabCademy!"\`
2. \`GET /health\` — Returns \`"OK"\`

### Requirements:
- Define two separate handler functions
- Use \`Router::new()\` and chain two \`.route()\` calls
- Bind to port 3000`,
        test_code: `#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::http::{Request, StatusCode};
    use tower::ServiceExt;

    fn app() -> Router {
        Router::new()
            .route("/", get(root))
            .route("/health", get(health))
    }

    #[tokio::test]
    async fn test_root() {
        let response = app()
            .oneshot(Request::builder().uri("/").body(Body::empty()).unwrap())
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        assert_eq!(&body[..], b"Welcome to CrabCademy!");
    }

    #[tokio::test]
    async fn test_health() {
        let response = app()
            .oneshot(Request::builder().uri("/health").body(Body::empty()).unwrap())
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        assert_eq!(&body[..], b"OK");
    }
}`,
        starter_code: `use axum::{routing::get, Router};

// Define your handlers here
async fn root() -> &'static str {
    // Return "Welcome to CrabCademy!"
    todo!()
}

async fn health() -> &'static str {
    // Return "OK"
    todo!()
}

#[tokio::main]
async fn main() {
    // Build your router with two routes: "/" and "/health"
    let app = Router::new();
    // Add routes here...

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();
    println!("🚀 Server running on http://localhost:3000");
    axum::serve(listener, app).await.unwrap();
}
`,
    },
];
