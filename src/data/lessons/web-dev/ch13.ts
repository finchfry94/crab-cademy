import { Lesson } from "../../types";

export const ch13Lessons: Lesson[] = [
    {
        id: "webdev-13",
        chapter: "5.2",
        title: "Models & Migrations",
        sort_order: 13,
        environment: "desktop",
        content: `# Models & Migrations

In Loco, the database layer is powered by **SeaORM** — an async ORM built on top of SQLx. Instead of writing raw SQL, you define **entities** (Rust structs that map to database tables) and **migrations** (code that creates/modifies tables).

## What is an Entity?

An entity is a Rust struct with \`#[derive(DeriveEntityModel)]\` that maps to a database table:

\`\`\`rust
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "items")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
    pub created_at: DateTime,
}
\`\`\`

This maps to a table called \`items\` with columns: \`id\`, \`name\`, \`description\`, \`created_at\`.

## ActiveModel — For Inserts & Updates

To create or modify records, you use an \`ActiveModel\`:

\`\`\`rust
use sea_orm::ActiveValue::Set;

let new_item = item::ActiveModel {
    name: Set("Widget".to_owned()),
    description: Set(Some("A useful widget".to_owned())),
    ..Default::default() // id and created_at are auto-generated
};

let result = new_item.insert(&db).await?;
\`\`\`

\`Set(value)\` means "I want to set this field." \`Default::default()\` means "let the database handle it" (auto-increment IDs, default timestamps).

## Querying

SeaORM provides a fluent query builder:

\`\`\`rust
// Find by primary key
let item = Item::find_by_id(1).one(&db).await?;

// Find all
let items = Item::find().all(&db).await?;

// Find with conditions
let widgets = Item::find()
    .filter(item::Column::Name.contains("widget"))
    .all(&db)
    .await?;
\`\`\`

## Migrations

In Loco, migrations are Rust code:

\`\`\`rust
// migration/m20240101_000001_create_items.rs
async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager.create_table(
        Table::create()
            .table(Items::Table)
            .col(ColumnDef::new(Items::Id).integer().primary_key().auto_increment())
            .col(ColumnDef::new(Items::Name).string().not_null())
            .to_owned(),
    ).await
}
\`\`\`

## ⚠️ Common Mistakes

1. **Forgetting \`Set()\`** — ActiveModel fields require \`Set(value)\`, not just the value.
2. **Option fields** — nullable columns should be \`Option<T>\` in the model.
3. **\`.one()\` vs \`.all()\`** — \`.one()\` returns \`Option<Model>\`, \`.all()\` returns \`Vec<Model>\`.`,
        quiz: [
            {
                question: "What derive macro maps a Rust struct to a database table in SeaORM?",
                options: [
                    "DeriveModel",
                    "DeriveEntityModel",
                    "Table",
                    "FromRow",
                ],
                correctIndex: 1,
            },
            {
                question: "How do you set a field value when creating an ActiveModel?",
                options: [
                    "field = value",
                    "field: value",
                    "field: Set(value)",
                    "field.set(value)",
                ],
                correctIndex: 2,
            },
            {
                question: "What does .one(&db).await? return?",
                options: [
                    "Model",
                    "Vec<Model>",
                    "Option<Model>",
                    "Result<Model>",
                ],
                correctIndex: 2,
            },
        ],
        objectives: `## Your Mission

Create a simple in-memory item store using SeaORM-style patterns:

### src/main.rs
- Wire up the routes from the items controller

### src/models/item.rs
- Define an \`Item\` struct with \`id: u64\`, \`name: String\`, and \`description: Option<String>\`
- Implement \`Serialize\` and \`Deserialize\`
- Define a \`CreateItem\` struct with \`name\` and \`description\`

### src/controllers/items.rs
- \`GET /items\` — return all items as JSON (use a static list for now)
- \`POST /items\` — accept a \`CreateItem\` and return the created \`Item\`

### Requirements:
- Use proper Serialize/Deserialize derives
- Items controller returns JSON responses`,
        test_code: "",
        test_files: {
            "src/controllers/items.rs": `#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::Body;
    use axum::http::{Request, header};
    use tower::ServiceExt;

    #[tokio::test]
    async fn test_list_items() {
        let app = routes();
        let response = app
            .oneshot(Request::builder().uri("/items").body(Body::empty()).unwrap())
            .await
            .unwrap();
        let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        let items: Vec<serde_json::Value> = serde_json::from_slice(&body).unwrap();
        assert!(!items.is_empty());
    }

    #[tokio::test]
    async fn test_create_item() {
        let app = routes();
        let response = app
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/items")
                    .header(header::CONTENT_TYPE, "application/json")
                    .body(Body::from(r#"{"name":"Gadget","description":"A cool gadget"}"#))
                    .unwrap(),
            )
            .await
            .unwrap();
        let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        let item: serde_json::Value = serde_json::from_slice(&body).unwrap();
        assert_eq!(item["name"], "Gadget");
        assert!(item["id"].as_u64().unwrap() > 0);
    }
}`
        },
        starter_code: {
            "src/main.rs": `mod controllers;
mod models;

use axum::Router;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .merge(controllers::items::routes());

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();
    println!("🚂 Server on http://localhost:3000");
    axum::serve(listener, app).await.unwrap();
}
`,
            "src/models/item.rs": `use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize)]
pub struct Item {
    pub id: u64,
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CreateItem {
    pub name: String,
    pub description: Option<String>,
}
`,
            "src/models/mod.rs": `pub mod item;
`,
            "src/controllers/items.rs": `use axum::{routing::{get, post}, Json, Router, http::StatusCode};
use crate::models::item::{Item, CreateItem};

async fn list() -> Json<Vec<Item>> {
    // Return a hardcoded list of items for now
    // In a real app, this would query the database
    todo!()
}

async fn create(Json(payload): Json<CreateItem>) -> (StatusCode, Json<Item>) {
    // Create a new Item from the payload with id = 1
    // Return StatusCode::CREATED
    todo!()
}

pub fn routes() -> Router {
    Router::new()
        .route("/items", get(list).post(create))
}
`,
            "src/controllers/mod.rs": `pub mod items;
`
        },
    },
];
