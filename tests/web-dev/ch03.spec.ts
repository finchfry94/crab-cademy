import { test, expect } from '@playwright/test';

test.describe('Web Dev Chapter 3: JSON APIs', () => {
    test('1.3 JSON APIs', async ({ page }) => {
        test.setTimeout(120000);
        await page.goto('/path/web-dev/lesson/webdev-03');

        // Quiz
        await page.locator('label', { hasText: 'Deserialize' }).click();
        await page.locator('label', { hasText: '400 Bad Request' }).click();
        await page.locator('label', { hasText: '(StatusCode::CREATED, Json(data))' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `use axum::{routing::{get, post}, Json, Router, http::StatusCode};
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
    (StatusCode::CREATED, Json(Item { id: 1, name: payload.name }))
}

async fn get_item() -> Json<Item> {
    Json(Item { id: 1, name: "placeholder".to_string() })
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
`;

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            if (models.length > 0) {
                models[0].setValue(code);
            }
        }, rustCode);

        await page.click('button:has-text("Test")');
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 120000 });
        await expect(page.locator('button:has-text("Objectives")')).toContainText('ALL PASS');
    });
});
