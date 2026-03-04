import { test, expect } from '@playwright/test';

test.describe('Web Dev Chapter 13: Models & Migrations', () => {
    test('3.2 Models & Migrations', async ({ page }) => {
        test.setTimeout(120000);
        await page.goto('/path/web-dev/lesson/webdev-13');

        // Quiz
        await page.locator('label', { hasText: 'DeriveEntityModel' }).click();
        await page.locator('label', { hasText: 'field: Set(value)' }).click();
        await page.locator('label', { hasText: 'Option<Model>' }).click();

        await page.click('button:has-text("Check Answers")');

        // File tree sidebar should be visible
        const sidebar = page.locator('.file-tree-sidebar');
        await expect(sidebar).toBeVisible({ timeout: 120000 });
        await expect(sidebar.getByText('src', { exact: true })).toBeVisible();

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const mainCode = `mod controllers;
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
`;

        const modelsItemCode = `use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Item {
    pub id: u64,
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateItem {
    pub name: String,
    pub description: Option<String>,
}
`;

        const controllersItemsCode = `use axum::{routing::{get, post}, Json, Router, http::StatusCode};
use crate::models::item::{Item, CreateItem};

async fn list() -> Json<Vec<Item>> {
    Json(vec![Item { id: 1, name: String::from("Item"), description: None }])
}

async fn create(Json(payload): Json<CreateItem>) -> (StatusCode, Json<Item>) {
    (StatusCode::CREATED, Json(Item { id: 1, name: payload.name, description: payload.description }))
}

pub fn routes() -> Router {
    Router::new()
        .route("/items", get(list).post(create))
}
`;

        await sidebar.getByText('models', { exact: true }).click();
        await page.waitForTimeout(500);

        await sidebar.getByText('item.rs', { exact: true }).click();
        await page.waitForTimeout(500);

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            const stateModel = models.find(m => m.uri.path.endsWith('item.rs'));
            if (stateModel) stateModel.setValue(code);
        }, modelsItemCode);

        await sidebar.getByText('controllers', { exact: true }).click();
        await page.waitForTimeout(500);

        await sidebar.locator('.file-tree-item').filter({ hasText: /^items\.rs$/ }).click();
        await page.waitForTimeout(500);

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            const stateModel = models.find(m => m.uri.path.endsWith('items.rs'));
            if (stateModel) stateModel.setValue(code);
        }, controllersItemsCode);

        // Click Test
        await page.click('button:has-text("Test")');
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 120000 });
        await expect(page.locator('button:has-text("Objectives")')).toContainText('ALL PASS');
    });
});
