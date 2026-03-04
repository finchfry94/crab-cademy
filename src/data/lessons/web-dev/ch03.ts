import { Lesson } from "../../types";

export const ch03Lessons: Lesson[] = [
    {
        id: "webdev-03",
        chapter: "1.3",
        title: "JSON APIs",
        sort_order: 3,
        environment: "desktop",
        content: `# JSON APIs

Most web APIs communicate using **JSON**. Axum makes this effortless with the \`Json<T>\` type — it works as both an **extractor** (parsing request bodies) and a **response** (serializing your data).

## Receiving JSON

To accept a JSON request body, use \`Json<T>\` where \`T\` implements \`Deserialize\`:

\`\`\`rust
use axum::Json;
use serde::Deserialize;

#[derive(Deserialize)]
struct CreateUser {
    username: String,
    email: String,
}

async fn create_user(Json(payload): Json<CreateUser>) -> String {
    format!("Created user: {} ({})", payload.username, payload.email)
}
\`\`\`

Axum automatically:
1. Checks the \`Content-Type\` header is \`application/json\`
2. Reads the request body
3. Deserializes it into your struct
4. Returns **400 Bad Request** if it can't parse

## Returning JSON

To return JSON, wrap your data in \`Json<T>\` where \`T\` implements \`Serialize\`:

\`\`\`rust
use serde::Serialize;

#[derive(Serialize)]
struct User {
    id: u32,
    username: String,
}

async fn get_user() -> Json<User> {
    Json(User {
        id: 1,
        username: "crab_lover".into(),
    })
}
\`\`\`

The response will have \`Content-Type: application/json\` automatically.

## Status Codes

Sometimes you need to return a specific status code. Use a tuple:

\`\`\`rust
use axum::http::StatusCode;

async fn create_item(Json(item): Json<NewItem>) -> (StatusCode, Json<Item>) {
    let created = Item { id: 42, name: item.name };
    (StatusCode::CREATED, Json(created)) // 201 Created
}
\`\`\`

Common status codes:
| Code | Constant | Meaning |
|------|----------|---------|
| 200 | \`StatusCode::OK\` | Success (default) |
| 201 | \`StatusCode::CREATED\` | Resource created |
| 400 | \`StatusCode::BAD_REQUEST\` | Invalid input |
| 404 | \`StatusCode::NOT_FOUND\` | Resource not found |
| 500 | \`StatusCode::INTERNAL_SERVER_ERROR\` | Server error |

## ⚠️ Common Mistakes

1. **Forgetting both Serialize AND Deserialize** — input structs need \`Deserialize\`, output structs need \`Serialize\`. If a struct is used for both, derive both.
2. **Sending non-JSON body** — if you test with \`curl\`, remember to set \`-H "Content-Type: application/json"\`.
3. **Field name mismatches** — JSON field names must match your struct field names exactly (or use \`#[serde(rename = "...")]\`).`,
        quiz: [
            {
                question: "What trait must a struct implement to be used as a JSON request body?",
                options: ["Serialize", "Deserialize", "Clone", "IntoResponse"],
                correctIndex: 1,
            },
            {
                question: "What status code does Axum return when JSON parsing fails?",
                options: ["200 OK", "400 Bad Request", "404 Not Found", "500 Internal Server Error"],
                correctIndex: 1,
            },
            {
                question: "How do you return a 201 Created response with JSON?",
                options: [
                    "Json(data).status(201)",
                    "(StatusCode::CREATED, Json(data))",
                    "Response::created(Json(data))",
                    "Json(data, 201)",
                ],
                correctIndex: 1,
            },
        ],
        objectives: `## Your Mission

Build a tiny item API:

1. Define a \`CreateItem\` struct with \`name: String\` (Deserialize)
2. Define an \`Item\` struct with \`id: u64\` and \`name: String\` (Serialize)
3. \`POST /items\` — accepts \`Json<CreateItem>\`, returns \`(StatusCode::CREATED, Json<Item>)\` with id = 1
4. \`GET /items/1\` — returns \`Json<Item>\` with id = 1 and name = "placeholder"

### Requirements:
- Use proper serde derives
- Return correct status codes`,
        test_code: `#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::http::{Request, StatusCode, header};
    use tower::ServiceExt;

    fn app() -> Router {
        Router::new()
            .route("/items", axum::routing::post(create_item))
            .route("/items/1", axum::routing::get(get_item))
    }

    #[tokio::test]
    async fn test_create_item() {
        let response = app()
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/items")
                    .header(header::CONTENT_TYPE, "application/json")
                    .body(Body::from(r#"{"name":"Widget"}"#))
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::CREATED);
        let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        let item: serde_json::Value = serde_json::from_slice(&body).unwrap();
        assert_eq!(item["name"], "Widget");
        assert_eq!(item["id"], 1);
    }

    #[tokio::test]
    async fn test_get_item() {
        let response = app()
            .oneshot(
                Request::builder()
                    .uri("/items/1")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        let item: serde_json::Value = serde_json::from_slice(&body).unwrap();
        assert_eq!(item["id"], 1);
    }
}`,
        starter_code: `use axum::{routing::{get, post}, Json, Router, http::StatusCode};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct CreateItem {
    name: String,
}

#[derive(Serialize)]
struct Item {
    id: u64,
    name: String,
}

async fn create_item(Json(payload): Json<CreateItem>) -> (StatusCode, Json<Item>) {
    // Return StatusCode::CREATED and a Json<Item> with id = 1
    todo!()
}

async fn get_item() -> Json<Item> {
    // Return a placeholder Item with id = 1
    todo!()
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/items", post(create_item))
        .route("/items/1", get(get_item));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();
    println!("🚀 Server running on http://localhost:3000");
    axum::serve(listener, app).await.unwrap();
}
`,
    },
];
