import { test, expect } from '@playwright/test';

test.describe('Web Dev Chapter 19: Deployment', () => {
    test('5.2 Deployment', async ({ page }) => {
        test.setTimeout(120000);
        await page.goto('/path/web-dev/lesson/webdev-19');

        // Quiz
        await page.locator('label', { hasText: 'cargo build --release' }).click();
        await page.locator('label', { hasText: 'The final image is much smaller — no compiler, just the binary' }).click();
        await page.locator('label', { hasText: 'Hardcoded secrets and API keys' }).click();

        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `use axum::{routing::get, Json, Router};
use serde::Serialize;
use tower_http::trace::TraceLayer;

#[derive(Serialize)]
struct HealthResponse {
    status: String,
}

async fn health() -> Json<HealthResponse> {
    Json(HealthResponse { status: "ok".to_string() })
}

fn make_app() -> Router {
    Router::new()
        .route("/health", get(health))
        .layer(TraceLayer::new_for_http())
}

#[tokio::main]
async fn main() {
    let port = std::env::var("PORT").unwrap_or_else(|_| "3000".into());
    let addr = format!("0.0.0.0:{}", port);

    let app = make_app();

    println!("🚀 Server running on http://localhost:{}", port);

    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .unwrap();

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
