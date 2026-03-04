import { test, expect } from '@playwright/test';

test.describe('Web Dev Chapter 4: App State & Layers (Multifile)', () => {
    test('multifile lesson shows file tree and renders correctly and runs tests', async ({ page }) => {
        test.setTimeout(120000);
        await page.goto('/path/web-dev/lesson/webdev-04');

        // Quiz
        await page.locator('label', { hasText: 'To share ownership across async handler tasks' }).click();
        await page.locator('label', { hasText: 'tokio::sync::Mutex' }).click();
        await page.locator('label', { hasText: 'Adds Cross-Origin Resource Sharing headers' }).click();
        await page.click('button:has-text("Check Answers")');

        // File tree sidebar should be visible
        const sidebar = page.locator('.file-tree-sidebar');
        await expect(sidebar).toBeVisible({ timeout: 120000 });
        await expect(sidebar.getByText('src', { exact: true })).toBeVisible();
        await expect(sidebar.getByText('main.rs', { exact: true })).toBeVisible();
        await expect(sidebar.getByText('state.rs', { exact: true })).toBeVisible();

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const mainCode = `use axum::{extract::State, routing::{get, post}, Json, Router};
use std::sync::Arc;
use tower_http::cors::{CorsLayer, Any};

mod state;
use state::AppState;

async fn add_message(
    State(state): State<Arc<AppState>>,
    body: String,
) -> String {
    let mut messages = state.messages.lock().await;
    messages.push(body);
    messages.len().to_string()
}

async fn get_messages(
    State(state): State<Arc<AppState>>,
) -> Json<Vec<String>> {
    let messages = state.messages.lock().await;
    Json(messages.clone())
}

#[tokio::main]
async fn main() {
    let state = Arc::new(AppState::new());

    let app = Router::new()
        .route("/messages", get(get_messages).post(add_message))
        .layer(CorsLayer::new().allow_origin(Any).allow_methods(Any))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();
    println!("🚀 Server running on http://localhost:3000");
    axum::serve(listener, app).await.unwrap();
}
`;

        const stateCode = `use tokio::sync::Mutex;

pub struct AppState {
    pub messages: Mutex<Vec<String>>,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            messages: Mutex::new(Vec::new()),
        }
    }
}
`;

        // Inject main.rs
        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            const mainModel = models.find(m => m.uri.path.endsWith('main.rs'));
            if (mainModel) mainModel.setValue(code);
        }, mainCode);

        // Click state.rs
        await sidebar.getByText('state.rs', { exact: true }).click();
        await page.waitForTimeout(500);

        // Inject state.rs
        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            const stateModel = models.find(m => m.uri.path.endsWith('state.rs'));
            if (stateModel) stateModel.setValue(code);
        }, stateCode);

        // Click Test
        await page.click('button:has-text("Test")');
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 120000 });
        await expect(page.locator('button:has-text("Objectives")')).toContainText('ALL PASS');
    });
});
