import { Lesson } from "../../types";

export const ch17Lessons: Lesson[] = [
    {
        id: "webdev-17",
        chapter: "6.3",
        title: "Background Jobs",
        sort_order: 17,
        environment: "desktop",
        content: `# Background Jobs

Not everything should happen during a web request. Sending emails, processing images, generating reports — these are slow tasks that shouldn't block the user's response. Enter **background jobs**.

## The Problem

\`\`\`rust
// ❌ BAD: User waits while email sends
async fn register(Json(user): Json<NewUser>) -> StatusCode {
    save_to_database(&user).await;
    send_welcome_email(&user).await;  // 2-3 seconds!
    StatusCode::CREATED
}
\`\`\`

\`\`\`rust
// ✅ GOOD: Queue the email, respond immediately
async fn register(Json(user): Json<NewUser>) -> StatusCode {
    save_to_database(&user).await;
    queue_job(SendWelcomeEmail { user_id: user.id });  // Instant!
    StatusCode::CREATED
}
\`\`\`

## Tokio Spawn — Simple Background Tasks

The simplest approach is \`tokio::spawn\`:

\`\`\`rust
async fn register(Json(user): Json<NewUser>) -> StatusCode {
    save_to_database(&user).await;
    
    tokio::spawn(async move {
        // Runs in background — response sent immediately
        send_welcome_email(&user).await;
    });
    
    StatusCode::CREATED
}
\`\`\`

### Pros:
- Simple, no extra infrastructure
- Good for fire-and-forget tasks

### Cons:
- If the server restarts, in-flight tasks are lost
- No retry on failure
- No job queue visibility

## Channels — Producer/Consumer Pattern

For more robust background work, use \`tokio::sync::mpsc\`:

\`\`\`rust
use tokio::sync::mpsc;

enum Job {
    SendEmail { to: String, subject: String },
    ProcessImage { path: String },
}

// Producer: sends jobs from handlers
let (tx, mut rx) = mpsc::channel::<Job>(100);

// Consumer: processes jobs in background
tokio::spawn(async move {
    while let Some(job) = rx.recv().await {
        match job {
            Job::SendEmail { to, subject } => { /* send email */ }
            Job::ProcessImage { path } => { /* process image */ }
        }
    }
});
\`\`\`

## In Loco

Loco has a full job system with Redis:

\`\`\`rust
impl worker::Worker<App> for WelcomeEmailWorker {
    async fn perform(&self, ctx: &worker::AppContext) -> worker::Result<()> {
        // Your job logic here
    }
}
\`\`\`

Jobs are automatically retried on failure and persisted across restarts.

## ⚠️ Common Mistakes

1. **Not handling panics** — a panic in \`tokio::spawn\` silently kills the task. Use \`.unwrap_or_else()\`.
2. **Unbounded channels** — always set a buffer size to prevent memory issues.
3. **Moving state into spawn** — use \`Arc\` to share state with spawned tasks.`,
        quiz: [
            {
                question: "Why should you avoid sending emails during a web request?",
                options: [
                    "Emails are insecure",
                    "It blocks the response — users wait seconds for a task they don't see",
                    "Axum doesn't support email",
                    "It's against HTTP standards",
                ],
                correctIndex: 1,
            },
            {
                question: "What is the main downside of tokio::spawn for background jobs?",
                options: [
                    "It's too slow",
                    "Tasks are lost if the server restarts",
                    "It doesn't work with async",
                    "It requires Redis",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Build a simple job queue using channels:

### src/main.rs
- Create a \`mpsc::channel\` for jobs
- Spawn a worker task that processes jobs
- Pass the sender to handlers via State

### src/jobs.rs
- Define a \`Job\` enum with \`LogMessage(String)\` and \`Countdown(u32)\` variants
- Worker should print \`"[LOG] {message}"\` for LogMessage
- Worker should print countdown from n to 1 for Countdown

### src/controllers/jobs.rs
- \`POST /jobs/log\` — accepts \`{"message": "..."}\` and queues a LogMessage
- \`POST /jobs/countdown\` — accepts \`{"from": 5}\` and queues a Countdown
- Both return 202 Accepted immediately`,
        test_code: "",
        test_files: {
            "src/controllers/jobs.rs": `#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::http::{Request, StatusCode, header};
    use tower::ServiceExt;
    use tokio::sync::mpsc;
    use crate::jobs::Job;

    #[tokio::test]
    async fn test_queue_log() {
        let (tx, mut rx) = mpsc::channel::<Job>(10);
        let state = Arc::new(JobState { sender: tx });
        let app = routes(state);
        
        let response = app
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/jobs/log")
                    .header(header::CONTENT_TYPE, "application/json")
                    .body(Body::from(r#"{"message":"hello"}"#))
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::ACCEPTED);
        
        // Check the job was queued
        let job = rx.recv().await.unwrap();
        matches!(job, Job::LogMessage(msg) if msg == "hello");
    }
}`
        },
        starter_code: {
            "src/main.rs": `mod controllers;
mod jobs;

use std::sync::Arc;
use tokio::sync::mpsc;
use controllers::jobs_controller::{JobState, routes};
use jobs::Job;

#[tokio::main]
async fn main() {
    let (tx, mut rx) = mpsc::channel::<Job>(100);

    // Spawn worker
    tokio::spawn(async move {
        println!("🔧 Worker started");
        while let Some(job) = rx.recv().await {
            job.execute().await;
        }
    });

    let state = Arc::new(JobState { sender: tx });
    let app = routes(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();
    println!("🚀 Job Queue API on http://localhost:3000");
    axum::serve(listener, app).await.unwrap();
}
`,
            "src/jobs.rs": `pub enum Job {
    LogMessage(String),
    Countdown(u32),
}

impl Job {
    pub async fn execute(&self) {
        match self {
            Job::LogMessage(msg) => {
                // Print "[LOG] {msg}"
                todo!()
            }
            Job::Countdown(n) => {
                // Print countdown from n to 1, with 1 second delay between each
                // Hint: use tokio::time::sleep
                todo!()
            }
        }
    }
}
`,
            "src/controllers/jobs_controller.rs": `use axum::{extract::State, routing::post, http::StatusCode, Json, Router};
use serde::Deserialize;
use std::sync::Arc;
use tokio::sync::mpsc;
use crate::jobs::Job;

pub struct JobState {
    pub sender: mpsc::Sender<Job>,
}

#[derive(Deserialize)]
struct LogRequest {
    message: String,
}

#[derive(Deserialize)]
struct CountdownRequest {
    from: u32,
}

async fn queue_log(
    State(state): State<Arc<JobState>>,
    Json(payload): Json<LogRequest>,
) -> StatusCode {
    // Send a LogMessage job and return ACCEPTED
    todo!()
}

async fn queue_countdown(
    State(state): State<Arc<JobState>>,
    Json(payload): Json<CountdownRequest>,
) -> StatusCode {
    // Send a Countdown job and return ACCEPTED
    todo!()
}

pub fn routes(state: Arc<JobState>) -> Router {
    Router::new()
        .route("/jobs/log", post(queue_log))
        .route("/jobs/countdown", post(queue_countdown))
        .with_state(state)
}
`,
            "src/controllers/mod.rs": `pub mod jobs_controller;
`
        },
    },
];
