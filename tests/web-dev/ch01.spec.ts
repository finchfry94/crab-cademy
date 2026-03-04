import { test, expect } from '@playwright/test';

test.describe('Web Dev Chapter 1: Foundations', () => {
    test('1.1 Hello Axum', async ({ page }) => {
        test.setTimeout(120000);
        await page.goto('/path/web-dev/lesson/webdev-01');

        // Quiz
        await page.locator('label', { hasText: 'Hyper and Tokio' }).click();
        await page.locator('label', { hasText: 'Anything implementing IntoResponse' }).click();
        await page.locator('label', { hasText: 'It sets up the async runtime needed by Axum' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `use axum::{routing::get, Router};

// Define your handlers here
async fn root() -> &'static str {
    "Welcome to CrabCademy!"
}

async fn health() -> &'static str {
    "OK"
}

#[tokio::main]
async fn main() {
    // Build your router with two routes: "/" and "/health"
    let app = Router::new()
        .route("/", get(root))
        .route("/health", get(health));

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
