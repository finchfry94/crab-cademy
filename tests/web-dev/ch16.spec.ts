import { test, expect } from '@playwright/test';

test.describe('Web Dev Chapter 16: Authentication', () => {
    test('4.2 Authentication', async ({ page }) => {
        test.setTimeout(120000);
        await page.goto('/path/web-dev/lesson/webdev-16');

        // Quiz
        await page.locator('label', { hasText: "In the Authorization header as 'Bearer <token>'" }).click();
        await page.locator('label', { hasText: 'They automatically run before the handler, rejecting bad requests' }).click();

        await page.click('button:has-text("Check Answers")');

        // File tree sidebar should be visible
        const sidebar = page.locator('.file-tree-sidebar');
        await expect(sidebar).toBeVisible({ timeout: 120000 });
        await expect(sidebar.getByText('src', { exact: true })).toBeVisible();

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const mainCode = `mod auth;
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
`;

        const authCode = `use axum::{
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
        let auth_header = parts.headers
            .get("Authorization")
            .and_then(|v| v.to_str().ok())
            .ok_or(StatusCode::UNAUTHORIZED)?;
            
        if !auth_header.starts_with("Bearer user_") {
            return Err(StatusCode::UNAUTHORIZED);
        }
        
        let id_str = &auth_header["Bearer user_".len()..];
        let user_id = id_str.parse::<u64>().map_err(|_| StatusCode::UNAUTHORIZED)?;
        
        Ok(AuthUser { user_id })
    }
}
`;

        const controllersProfileCode = `use axum::{routing::get, Json, Router};
use crate::auth::AuthUser;
use serde::Serialize;

#[derive(Serialize)]
struct ProfileResponse {
    user_id: u64,
}

async fn profile(user: AuthUser) -> Json<ProfileResponse> {
    Json(ProfileResponse { user_id: user.user_id })
}

async fn public() -> &'static str {
    "Public endpoint"
}

pub fn routes() -> Router {
    Router::new()
        .route("/profile", get(profile))
        .route("/public", get(public))
}
`;

        await sidebar.getByText('auth.rs', { exact: true }).click();
        await page.waitForTimeout(500);

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            const stateModel = models.find(m => m.uri.path.endsWith('auth.rs'));
            if (stateModel) stateModel.setValue(code);
        }, authCode);

        await sidebar.getByText('controllers', { exact: true }).click();
        await page.waitForTimeout(500);

        await sidebar.getByText('profile.rs', { exact: true }).click();
        await page.waitForTimeout(500);

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            const stateModel = models.find(m => m.uri.path.endsWith('profile.rs'));
            if (stateModel) stateModel.setValue(code);
        }, controllersProfileCode);


        // Click Test
        await page.click('button:has-text("Test")');
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 120000 });
        await expect(page.locator('button:has-text("Objectives")')).toContainText('ALL PASS');
    });
});
