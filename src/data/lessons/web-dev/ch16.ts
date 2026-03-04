import { Lesson } from "../../types";

export const ch16Lessons: Lesson[] = [
    {
        id: "webdev-16",
        chapter: "6.2",
        title: "Authentication",
        sort_order: 16,
        environment: "desktop",
        content: `# Authentication

Most APIs need to know *who* is making requests. The standard approach for APIs is **JWT (JSON Web Tokens)** — a self-contained token that carries user identity.

## How JWT Works

1. **Login**: User sends credentials → server returns a JWT
2. **Subsequent requests**: User sends JWT in the \`Authorization\` header
3. **Server verifies**: Checks the token signature, extracts user info

\`\`\`
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxfQ.abc123
\`\`\`

## Building Auth Middleware

In Axum, we can create an extractor that validates the JWT:

\`\`\`rust
use axum::{extract::FromRequestParts, http::request::Parts};

struct AuthUser {
    user_id: u64,
}

#[axum::async_trait]
impl<S> FromRequestParts<S> for AuthUser {
    type Rejection = StatusCode;

    async fn from_request_parts(parts: &mut Parts, _: &S) -> Result<Self, Self::Rejection> {
        let auth_header = parts.headers
            .get("Authorization")
            .and_then(|v| v.to_str().ok())
            .ok_or(StatusCode::UNAUTHORIZED)?;
        
        // Validate token and extract user_id...
        Ok(AuthUser { user_id: 1 })
    }
}
\`\`\`

Now any handler with \`AuthUser\` as a parameter is **automatically protected**:

\`\`\`rust
async fn my_profile(user: AuthUser) -> String {
    format!("You are user {}", user.user_id)
}
\`\`\`

If the token is missing or invalid, the request is rejected with 401 before the handler runs.

## In Loco

Loco has this built in! You just use:

\`\`\`rust
async fn my_profile(auth: auth::JWT) -> Result<Response> {
    // auth.claims.user_id is available
}
\`\`\`

No manual extractor implementation needed.

## ⚠️ Common Mistakes

1. **Storing passwords as plain text** — always hash with bcrypt/argon2.
2. **No token expiration** — JWTs should expire (1 hour is typical for access tokens).
3. **Putting secrets in code** — JWT signing keys should come from environment variables.`,
        quiz: [
            {
                question: "Where is a JWT typically sent in HTTP requests?",
                options: [
                    "In the URL query string",
                    "In the Authorization header as 'Bearer <token>'",
                    "In a cookie only",
                    "In the request body",
                ],
                correctIndex: 1,
            },
            {
                question: "What is the benefit of custom extractors in Axum?",
                options: [
                    "They make the code longer",
                    "They automatically run before the handler, rejecting bad requests",
                    "They bypass middleware",
                    "They are faster than functions",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Build a simple auth layer:

### src/auth.rs
- Define \`AuthUser\` struct with \`user_id: u64\`
- Implement \`FromRequestParts\` — extract user_id from \`Authorization: Bearer user_{id}\` header format
  - If header missing → return 401
  - If format wrong → return 401

### src/controllers/profile.rs
- \`GET /profile\` — requires AuthUser, returns \`{"user_id": <id>}\`
- \`GET /public\` — no auth required, returns \`"Public endpoint"\`

### Requirements:
- The auth extractor should parse "Bearer user_42" → user_id = 42
- Requests without the header should get 401`,
        test_code: "",
        test_files: {
            "src/controllers/profile.rs": `#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::http::{Request, StatusCode};
    use tower::ServiceExt;

    #[tokio::test]
    async fn test_public() {
        let app = routes();
        let response = app
            .oneshot(Request::builder().uri("/public").body(Body::empty()).unwrap())
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
    }

    #[tokio::test]
    async fn test_profile_unauthorized() {
        let app = routes();
        let response = app
            .oneshot(Request::builder().uri("/profile").body(Body::empty()).unwrap())
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::UNAUTHORIZED);
    }

    #[tokio::test]
    async fn test_profile_authorized() {
        let app = routes();
        let response = app
            .oneshot(
                Request::builder()
                    .uri("/profile")
                    .header("Authorization", "Bearer user_42")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        let resp: serde_json::Value = serde_json::from_slice(&body).unwrap();
        assert_eq!(resp["user_id"], 42);
    }
}`
        },
        starter_code: {
            "src/main.rs": `mod auth;
mod controllers;

use axum::Router;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .merge(controllers::profile::routes());

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();
    println!("🔐 Auth API on http://localhost:3000");
    axum::serve(listener, app).await.unwrap();
}
`,
            "src/auth.rs": `use axum::{
    extract::FromRequestParts,
    http::{request::Parts, StatusCode},
};

#[derive(Debug)]
pub struct AuthUser {
    pub user_id: u64,
}

#[axum::async_trait]
impl<S: Send + Sync> FromRequestParts<S> for AuthUser {
    type Rejection = StatusCode;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        // 1. Get the "Authorization" header
        // 2. Check it starts with "Bearer user_"
        // 3. Parse the number after "user_"
        // 4. Return AuthUser { user_id } or StatusCode::UNAUTHORIZED
        todo!()
    }
}
`,
            "src/controllers/profile.rs": `use axum::{routing::get, Json, Router};
use crate::auth::AuthUser;
use serde::Serialize;

#[derive(Serialize)]
struct ProfileResponse {
    user_id: u64,
}

async fn profile(user: AuthUser) -> Json<ProfileResponse> {
    // Return the user_id from the auth extractor
    todo!()
}

async fn public() -> &'static str {
    "Public endpoint"
}

pub fn routes() -> Router {
    Router::new()
        .route("/profile", get(profile))
        .route("/public", get(public))
}
`,
            "src/controllers/mod.rs": `pub mod profile;
`
        },
    },
];
