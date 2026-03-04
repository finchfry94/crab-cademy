import { test, expect } from '@playwright/test';

test.describe('Web Dev Chapter 12: Loco Project Anatomy', () => {
    test('3.1 Loco Project Anatomy', async ({ page }) => {
        test.setTimeout(120000);
        await page.goto('/path/web-dev/lesson/webdev-12');

        // Quiz
        await page.locator('label', { hasText: 'Axum and SeaORM' }).click();
        await page.locator('label', { hasText: 'An Axum handler with extra conventions' }).click();
        await page.locator('label', { hasText: 'YAML files in config/' }).click();

        await page.click('button:has-text("Check Answers")');

        // File tree sidebar should be visible
        const sidebar = page.locator('.file-tree-sidebar');
        await expect(sidebar).toBeVisible({ timeout: 120000 });
        await expect(sidebar.getByText('src', { exact: true })).toBeVisible();
        await expect(sidebar.getByText('main.rs', { exact: true })).toBeVisible();

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const greetCode = `use axum::{extract::Path, routing::get, Json, Router};
use serde::Serialize;

#[derive(Serialize)]
struct GreetResponse {
    message: String,
}

async fn greet_default() -> Json<GreetResponse> {
    Json(GreetResponse { message: "Hello from Loco!".to_string() })
}

async fn greet_name(Path(name): Path<String>) -> Json<GreetResponse> {
    Json(GreetResponse { message: format!("Hello, {}!", name) })
}

pub fn routes() -> Router {
    Router::new()
        .route("/greet", get(greet_default))
        .route("/greet/:name", get(greet_name))
}
`;

        // Expand controllers directory
        await sidebar.getByText('controllers', { exact: true }).click();
        await page.waitForTimeout(500);

        // Click greet.rs
        await sidebar.getByText('greet.rs', { exact: true }).click();
        await page.waitForTimeout(500);

        // Inject greet.rs
        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            const stateModel = models.find(m => m.uri.path.endsWith('greet.rs'));
            if (stateModel) stateModel.setValue(code);
        }, greetCode);

        // Click Test
        await page.click('button:has-text("Test")');
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 120000 });
        await expect(page.locator('button:has-text("Objectives")')).toContainText('ALL PASS');
    });
});
