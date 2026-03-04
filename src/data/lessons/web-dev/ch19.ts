import { Lesson } from "../../types";

export const ch19Lessons: Lesson[] = [
    {
        id: "webdev-19",
        chapter: "7.2",
        title: "Deployment",
        sort_order: 19,
        environment: "desktop",
        content: `# Deploying Your Rust Web App

You've built an API, tested it, and it works locally. Now let's talk about getting it into production. Rust's compiled nature makes deployment slightly different from interpreted languages — and much simpler in some ways.

## Building for Release

\`\`\`bash
cargo build --release
\`\`\`

This produces a **single binary** in \`target/release/your_app\`. That's it. No runtime, no interpreter, no dependency manager on the server. Just copy and run.

### The release binary is:
- **Optimized** — 10-100x faster than debug builds
- **Self-contained** — no Rust installation needed on the server
- **Small** — typically 5-20MB (add \`strip = true\` to Cargo.toml for even smaller)

## Configuration

Use environment variables for production config:

\`\`\`rust
let port = std::env::var("PORT").unwrap_or_else(|_| "3000".into());
let db_url = std::env::var("DATABASE_URL")
    .expect("DATABASE_URL must be set");
\`\`\`

In Loco, this is handled by YAML config files:

\`\`\`yaml
# config/production.yaml
server:
  port: 8080
  host: 0.0.0.0
database:
  uri: \${{DATABASE_URL}}
\`\`\`

## Docker

Docker is the most common deployment method:

\`\`\`dockerfile
# Build stage
FROM rust:1.75 AS builder
WORKDIR /app
COPY . .
RUN cargo build --release

# Runtime stage  
FROM debian:bookworm-slim
COPY --from=builder /app/target/release/my_app /usr/local/bin/
EXPOSE 3000
CMD ["my_app"]
\`\`\`

This **multi-stage build** is important:
1. **Build stage** — has Rust compiler, compiles your app (~2GB image)
2. **Runtime stage** — just Debian + your binary (~80MB image)

## Deployment Platforms

| Platform | Best For | Rust Support |
|----------|----------|-------------|
| **Fly.io** | Simple deploys, free tier | Excellent (Dockerfile) |
| **Railway** | Database + app bundles | Good (Dockerfile) |
| **AWS ECS/Fargate** | Production scale | Docker containers |
| **DigitalOcean App Platform** | Managed hosting | Dockerfile |
| **Shuttle.rs** | Rust-native, zero-config | First-class Rust support |

## Production Checklist

- [ ] **Release build** — never deploy debug builds
- [ ] **Environment variables** — no hardcoded secrets
- [ ] **HTTPS** — use a reverse proxy (nginx) or platform-provided TLS
- [ ] **Health check endpoint** — \`GET /health\` returning 200
- [ ] **Structured logging** — use \`tracing\` with JSON output
- [ ] **Graceful shutdown** — handle SIGTERM to finish in-flight requests
- [ ] **Database migrations** — run migrations on startup or in CI
- [ ] **Error monitoring** — Sentry, Datadog, or similar

## Graceful Shutdown

\`\`\`rust
let listener = TcpListener::bind("0.0.0.0:3000").await?;
axum::serve(listener, app)
    .with_graceful_shutdown(shutdown_signal())
    .await?;

async fn shutdown_signal() {
    tokio::signal::ctrl_c().await.ok();
    println!("Shutting down gracefully...");
}
\`\`\`

## 🎉 Congratulations!

You've completed the **Web Dev with Rust** learning path! You now know:

1. **Axum fundamentals** — routing, extractors, JSON, state, middleware
2. **Loco conventions** — controllers, models, project structure
3. **Real-world patterns** — CRUD, auth, background jobs
4. **Production readiness** — testing, Docker, deployment

Your Rust web apps are **type-safe**, **blazing fast**, and **memory safe**. Go build something amazing! 🦀`,
        quiz: [
            {
                question: "What command builds an optimized Rust binary for production?",
                options: [
                    "cargo build",
                    "cargo build --release",
                    "cargo deploy",
                    "cargo run --production",
                ],
                correctIndex: 1,
            },
            {
                question: "Why use a multi-stage Docker build?",
                options: [
                    "It's faster to build",
                    "The final image is much smaller — no compiler, just the binary",
                    "Docker requires it for Rust",
                    "It enables hot reloading",
                ],
                correctIndex: 1,
            },
            {
                question: "What should you NEVER put in source code?",
                options: [
                    "Comments",
                    "Hardcoded secrets and API keys",
                    "Type annotations",
                    "Error handling",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Create a production-ready app entry point:

1. Read \`PORT\` from environment (default to 3000)
2. Add a \`GET /health\` endpoint returning \`{"status": "ok"}\`
3. Add graceful shutdown with \`tokio::signal::ctrl_c\`
4. Add \`TraceLayer\` for request logging

### Requirements:
- Use \`std::env::var\` for the port
- The health endpoint must return JSON, not a plain string
- Print a startup message showing the actual port`,
        test_code: `#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::http::{Request, StatusCode};
    use tower::ServiceExt;

    #[tokio::test]
    async fn test_health_check() {
        let app = make_app();
        let response = app
            .oneshot(
                Request::builder()
                    .uri("/health")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        let health: serde_json::Value = serde_json::from_slice(&body).unwrap();
        assert_eq!(health["status"], "ok");
    }
}`,
        starter_code: `use axum::{routing::get, Json, Router};
use serde::Serialize;
use tower_http::trace::TraceLayer;

#[derive(Serialize)]
struct HealthResponse {
    status: String,
}

async fn health() -> Json<HealthResponse> {
    // Return {"status": "ok"}
    todo!()
}

fn make_app() -> Router {
    Router::new()
        .route("/health", get(health))
        .layer(TraceLayer::new_for_http())
}

#[tokio::main]
async fn main() {
    // 1. Read PORT from env, default to "3000"
    let port = std::env::var("PORT").unwrap_or_else(|_| "3000".into());
    let addr = format!("0.0.0.0:{}", port);

    let app = make_app();

    // 2. Print startup message
    println!("🚀 Server running on http://localhost:{}", port);

    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .unwrap();

    // 3. Serve with graceful shutdown
    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .unwrap();
}

async fn shutdown_signal() {
    tokio::signal::ctrl_c()
        .await
        .expect("failed to listen for ctrl_c");
    println!("\\n🛑 Graceful shutdown initiated...");
}
`,
    },
];
