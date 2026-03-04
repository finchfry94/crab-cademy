import { test, expect } from '@playwright/test';

test.describe('Web Dev Chapter 18: Testing Your API', () => {
    test('5.1 Testing Your API', async ({ page }) => {
        test.setTimeout(120000);
        await page.goto('/path/web-dev/lesson/webdev-18');

        // Quiz
        await page.locator('label', { hasText: 'Sends a single request to the app without starting a server' }).click();
        await page.locator('label', { hasText: "To ensure tests are isolated and don't affect each other" }).click();

        await page.click('button:has-text("Check Answers")');

        // File tree sidebar should be visible
        const sidebar = page.locator('.file-tree-sidebar');
        await expect(sidebar).toBeVisible({ timeout: 120000 });
        await expect(sidebar.getByText('src', { exact: true })).toBeVisible();

        // Coding Challenge
        await page.click('button:has-text("Objectives")');


        const mainCode = `mod app;

#[tokio::main]
async fn main() {
    let app = app::make_app();

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();
    println!("📝 Todo API on http://localhost:3000");
    axum::serve(listener, app).await.unwrap();
}

// ============================================
// YOUR TESTS GO HERE
// ============================================
#[cfg(test)]
mod tests {
    use crate::app;
    use axum::body::Body;
    use axum::http::{Request, StatusCode, header};
    use tower::ServiceExt;

    #[tokio::test]
    async fn test_list_empty() {
        let app = app::make_app();
        let response = app
            .oneshot(Request::builder().uri("/todos").body(Body::empty()).unwrap())
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        let todos: Vec<serde_json::Value> = serde_json::from_slice(&body).unwrap();
        assert!(todos.is_empty());
    }

    #[tokio::test]
    async fn test_create_todo() {
        let app = app::make_app();
        let response = app
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/todos")
                    .header(header::CONTENT_TYPE, "application/json")
                    .body(Body::from(r#"{"title": "Learn testing"}"#))
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::CREATED);
        let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        let todo: serde_json::Value = serde_json::from_slice(&body).unwrap();
        assert_eq!(todo["title"], "Learn testing");
    }

    #[tokio::test]
    async fn test_delete_existing() {
        let app = app::make_app();
        
        let create_resp = app.clone()
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/todos")
                    .header(header::CONTENT_TYPE, "application/json")
                    .body(Body::from(r#"{"title": "To delete"}"#))
                    .unwrap(),
            )
            .await
            .unwrap();
            
        let body = axum::body::to_bytes(create_resp.into_body(), usize::MAX).await.unwrap();
        let todo: serde_json::Value = serde_json::from_slice(&body).unwrap();
        let id = todo["id"].as_u64().unwrap();

        let response = app
            .oneshot(
                Request::builder()
                    .method("DELETE")
                    .uri(&format!("/todos/{}", id))
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::NO_CONTENT);
    }

    #[tokio::test]
    async fn test_delete_not_found() {
        let app = app::make_app();
        let response = app
            .oneshot(
                Request::builder()
                    .method("DELETE")
                    .uri("/todos/999")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::NOT_FOUND);
    }
}
`;


        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            const stateModel = models.find(m => m.uri.path.endsWith('main.rs'));
            if (stateModel) stateModel.setValue(code);
        }, mainCode);



        // Click Test
        await page.click('button:has-text("Test")');
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 120000 });
        await expect(page.locator('button:has-text("Objectives")')).toContainText('ALL PASS');
    });
});
