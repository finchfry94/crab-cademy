import { test, expect } from '@playwright/test';

test.describe('Web Dev Chapter 2: Routes & Extractors', () => {
    test('1.2 Routes & Extractors', async ({ page }) => {
        test.setTimeout(120000);
        await page.goto('/path/web-dev/lesson/webdev-02');

        // Quiz
        await page.locator('label', { hasText: 'Deserialize' }).click();
        await page.locator('label', { hasText: '/users/:name' }).click();
        await page.locator('label', { hasText: 'Axum returns a 400 Bad Request' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `use axum::{extract::{Path, Query}, routing::get, Router};
use serde::Deserialize;

#[derive(Deserialize)]
struct SearchParams {
    q: String,
    limit: Option<u32>,
}

async fn hello(Path(name): Path<String>) -> String {
    format!("Hello, {}!", name)
}

async fn add(Path((a, b)): Path<(i32, i32)>) -> String {
    (a + b).to_string()
}

async fn search(Query(params): Query<SearchParams>) -> String {
    let limit = params.limit.unwrap_or(10);
    format!("Searching for '{}' (limit: {})", params.q, limit)
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
