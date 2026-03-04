import { Lesson } from "../../types";

export const ch02Lessons: Lesson[] = [
    {
        id: "webdev-02",
        chapter: "1.2",
        title: "Routes & Extractors",
        sort_order: 2,
        environment: "desktop",
        content: `# Routes & Extractors

Now that you can start a server, let's make it actually *do* things. Routes define **what** URL patterns your server responds to. Extractors define **how** data gets pulled out of requests.

## Path Parameters

Want to greet a user by name? Use \`Path<T>\`:

\`\`\`rust
use axum::extract::Path;

async fn greet_user(Path(name): Path<String>) -> String {
    format!("Hello, {}!", name)
}

// Route: .route("/users/:name", get(greet_user))
\`\`\`

The \`:name\` in the route is a **path parameter**. Axum extracts it and passes it to your handler as a typed value. No string parsing needed!

## Multiple Path Parameters

You can extract multiple parameters using a tuple:

\`\`\`rust
async fn get_post(Path((user_id, post_id)): Path<(u32, u32)>) -> String {
    format!("User {} — Post {}", user_id, post_id)
}

// Route: .route("/users/:user_id/posts/:post_id", get(get_post))
\`\`\`

## Query Parameters

For URL query strings like \`/search?q=rust&limit=10\`, use \`Query<T>\`:

\`\`\`rust
use axum::extract::Query;
use serde::Deserialize;

#[derive(Deserialize)]
struct SearchParams {
    q: String,
    limit: Option<u32>,
}

async fn search(Query(params): Query<SearchParams>) -> String {
    let limit = params.limit.unwrap_or(10);
    format!("Searching for '{}' (limit: {})", params.q, limit)
}
\`\`\`

Notice: \`Query\` requires your struct to implement \`Deserialize\` (from serde). Axum handles the rest.

## HTTP Methods

Axum supports all standard methods:

\`\`\`rust
use axum::routing::{get, post, put, delete};

let app = Router::new()
    .route("/items", get(list_items).post(create_item))
    .route("/items/:id", put(update_item).delete(delete_item));
\`\`\`

You can chain methods on the same route — clean and readable.

## ⚠️ Common Mistakes

1. **Forgetting \`Deserialize\`** on query param structs — you'll get a compile error about missing trait implementations.
2. **Wrong path parameter type** — if you use \`Path<u32>\` but the URL has a string, you'll get a 400 Bad Request.
3. **Extractor order matters** — put \`Path\` before \`Query\` before \`Body\` extractors in function arguments.`,
        quiz: [
            {
                question: "What derive macro is required on a struct used with Query<T>?",
                options: ["Serialize", "Deserialize", "Clone", "Debug"],
                correctIndex: 1,
            },
            {
                question: "How do you define a path parameter in an Axum route?",
                options: [
                    "/users/{name}",
                    "/users/<name>",
                    "/users/:name",
                    "/users/[name]",
                ],
                correctIndex: 2,
            },
            {
                question: "What happens if a Path<u32> receives a non-numeric value?",
                options: [
                    "It defaults to 0",
                    "The server crashes",
                    "Axum returns a 400 Bad Request",
                    "It silently ignores the request",
                ],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

Build a server with these routes:

1. \`GET /hello/:name\` — Returns \`"Hello, {name}!"\`
2. \`GET /add/:a/:b\` — Takes two \`i32\` path params and returns their sum as a string
3. \`GET /search?q=...&limit=...\` — Returns \`"Searching for '{q}' (limit: {limit})"\` where limit defaults to 10

### Requirements:
- Use \`Path<String>\`, \`Path<(i32, i32)>\`, and \`Query<SearchParams>\`
- Define a \`SearchParams\` struct with \`q: String\` and \`limit: Option<u32>\``,
        test_code: `#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::http::{Request, StatusCode};
    use tower::ServiceExt;

    fn app() -> Router {
        Router::new()
            .route("/hello/:name", get(hello))
            .route("/add/:a/:b", get(add))
            .route("/search", get(search))
    }

    #[tokio::test]
    async fn test_hello() {
        let response = app()
            .oneshot(Request::builder().uri("/hello/Rustacean").body(Body::empty()).unwrap())
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        assert_eq!(&body[..], b"Hello, Rustacean!");
    }

    #[tokio::test]
    async fn test_add() {
        let response = app()
            .oneshot(Request::builder().uri("/add/3/7").body(Body::empty()).unwrap())
            .await
            .unwrap();
        let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        assert_eq!(&body[..], b"10");
    }

    #[tokio::test]
    async fn test_search_with_limit() {
        let response = app()
            .oneshot(Request::builder().uri("/search?q=rust&limit=5").body(Body::empty()).unwrap())
            .await
            .unwrap();
        let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        assert_eq!(String::from_utf8_lossy(&body), "Searching for 'rust' (limit: 5)");
    }

    #[tokio::test]
    async fn test_search_default_limit() {
        let response = app()
            .oneshot(Request::builder().uri("/search?q=crab").body(Body::empty()).unwrap())
            .await
            .unwrap();
        let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        assert_eq!(String::from_utf8_lossy(&body), "Searching for 'crab' (limit: 10)");
    }
}`,
        starter_code: `use axum::{extract::{Path, Query}, routing::get, Router};
use serde::Deserialize;

#[derive(Deserialize)]
struct SearchParams {
    q: String,
    limit: Option<u32>,
}

async fn hello(Path(name): Path<String>) -> String {
    // Return "Hello, {name}!"
    todo!()
}

async fn add(Path((a, b)): Path<(i32, i32)>) -> String {
    // Return the sum as a string
    todo!()
}

async fn search(Query(params): Query<SearchParams>) -> String {
    // Return "Searching for '{q}' (limit: {limit})"
    // Default limit to 10 if not provided
    todo!()
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/hello/:name", get(hello))
        .route("/add/:a/:b", get(add))
        .route("/search", get(search));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();
    println!("🚀 Server running on http://localhost:3000");
    axum::serve(listener, app).await.unwrap();
}
`,
    },
];
