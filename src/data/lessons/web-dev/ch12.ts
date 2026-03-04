import { Lesson } from "../../types";

export const ch12Lessons: Lesson[] = [
    {
        id: "webdev-12",
        chapter: "5.1",
        title: "Loco Project Anatomy",
        sort_order: 12,
        environment: "desktop",
        content: `# Enter Loco — Convention Over Configuration

You've been building Axum servers by hand. You defined routers, wired up state, added middleware manually. Now imagine a framework that does all of that for you — and generates boilerplate code so you can focus on business logic.

Meet **Loco** 🚂 — Ruby on Rails for Rust, built on top of **Axum** and **SeaORM**.

## What Does Loco Give You?

| Feature | Without Loco (raw Axum) | With Loco |
|---------|------------------------|-----------|
| Routing | Manual \`Router::new().route(...)\` | Convention-based + generated |
| Database | Write SQLx queries by hand | SeaORM models + migrations |
| Auth | Build from scratch | Built-in JWT auth |
| Background jobs | DIY with Tokio tasks | Redis-backed job queue |
| Config | \`dotenv\` or custom | YAML config with environments |

## Project Structure

A Loco project looks like this:

\`\`\`
my_app/
├── src/
│   ├── app.rs          # App hooks & initialization
│   ├── controllers/    # HTTP handlers (like Axum handlers!)
│   │   └── items.rs
│   ├── models/         # SeaORM entities
│   │   └── _entities/  # Auto-generated model code
│   ├── workers/        # Background job processors
│   └── lib.rs          # Crate root
├── config/
│   ├── development.yaml
│   └── production.yaml
├── migration/          # Database migrations
└── Cargo.toml
\`\`\`

## Controllers = Axum Handlers

Here's the key insight — a Loco controller **is** an Axum handler:

\`\`\`rust
// Loco controller
use loco_rs::prelude::*;

async fn list() -> Result<Response> {
    format::json(vec!["item1", "item2"])
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("items")
        .add("/", get(list))
}
\`\`\`

Compare that to raw Axum:

\`\`\`rust
// Raw Axum (what you wrote in Module 1!)
async fn list() -> Json<Vec<&'static str>> {
    Json(vec!["item1", "item2"])
}

let app = Router::new().route("/items", get(list));
\`\`\`

They're almost identical! The difference:
- \`format::json()\` instead of \`Json()\` — adds error handling
- \`Routes::new()\` instead of \`Router::new()\` — Loco auto-registers these
- \`Result<Response>\` — standardized error handling

## ⚠️ Key Differences from Raw Axum

1. **You don't write \`main()\`** — Loco has its own entry point that sets up logging, database, workers, etc.
2. **Config-driven** — database URLs, server ports, etc. come from YAML files, not hardcoded.
3. **Generators** — in a real Loco project, you'd run \`cargo loco generate controller items\` to scaffold files.`,
        quiz: [
            {
                question: "What is Loco built on top of?",
                options: [
                    "Actix-web and Diesel",
                    "Axum and SeaORM",
                    "Rocket and SQLx",
                    "Warp and Prisma",
                ],
                correctIndex: 1,
            },
            {
                question: "What is a Loco controller essentially?",
                options: [
                    "A database model",
                    "A configuration file",
                    "An Axum handler with extra conventions",
                    "A background job",
                ],
                correctIndex: 2,
            },
            {
                question: "Where does Loco store configuration like database URLs?",
                options: [
                    "Environment variables only",
                    "Hardcoded in main.rs",
                    "YAML files in config/",
                    "A .env file",
                ],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

Create a Loco-style controller with two endpoints:

### src/main.rs
- Set up the app with a Loco-style Routes struct

### src/controllers/greet.rs
- \`GET /greet\` — returns \`{"message": "Hello from Loco!"}\` as JSON
- \`GET /greet/:name\` — returns \`{"message": "Hello, {name}!"}\` as JSON

### Requirements:
- Use \`serde::Serialize\` for your response struct
- Define a \`GreetResponse\` with a \`message: String\` field
- Use \`axum::extract::Path\` for the name parameter`,
        test_code: "",
        test_files: {
            "src/controllers/greet.rs": `#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::http::Request;
    use tower::ServiceExt;

    #[tokio::test]
    async fn test_greet_default() {
        let app = routes();
        let response = app
            .oneshot(Request::builder().uri("/greet").body(Body::empty()).unwrap())
            .await
            .unwrap();
        let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        let resp: serde_json::Value = serde_json::from_slice(&body).unwrap();
        assert_eq!(resp["message"], "Hello from Loco!");
    }

    #[tokio::test]
    async fn test_greet_name() {
        let app = routes();
        let response = app
            .oneshot(Request::builder().uri("/greet/Rustacean").body(Body::empty()).unwrap())
            .await
            .unwrap();
        let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        let resp: serde_json::Value = serde_json::from_slice(&body).unwrap();
        assert_eq!(resp["message"], "Hello, Rustacean!");
    }
}`
        },
        starter_code: {
            "src/main.rs": `mod controllers;

use axum::Router;

#[tokio::main]
async fn main() {
    // In a real Loco app, this is handled by the framework.
    // Here we wire it up manually to show what Loco does under the hood.
    let app = Router::new()
        .merge(controllers::greet::routes());

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();
    println!("🚂 Loco-style server on http://localhost:3000");
    axum::serve(listener, app).await.unwrap();
}
`,
            "src/controllers/greet.rs": `use axum::{extract::Path, routing::get, Json, Router};
use serde::Serialize;

#[derive(Serialize)]
struct GreetResponse {
    message: String,
}

async fn greet_default() -> Json<GreetResponse> {
    // Return {"message": "Hello from Loco!"}
    todo!()
}

async fn greet_name(Path(name): Path<String>) -> Json<GreetResponse> {
    // Return {"message": "Hello, {name}!"}
    todo!()
}

pub fn routes() -> Router {
    Router::new()
        .route("/greet", get(greet_default))
        .route("/greet/:name", get(greet_name))
}
`,
            "src/controllers/mod.rs": `pub mod greet;
`
        },
    },
];
