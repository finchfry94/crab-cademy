import { test, expect } from '@playwright/test';

test.describe('Web Dev Chapter 14: Controllers & Views', () => {
    test('3.3 Controllers & Views', async ({ page }) => {
        test.setTimeout(120000);
        await page.goto('/path/web-dev/lesson/webdev-14');

        // Quiz
        await page.locator('label', { hasText: 'A Result<Response> with JSON body' }).click();
        await page.locator('label', { hasText: 'A 404 response is sent automatically' }).click();
        await page.locator('label', { hasText: 'Standard REST resource routes' }).click();

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
        .merge(controllers::notes::routes());

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();
    println!("🚂 Server on http://localhost:3000");
    axum::serve(listener, app).await.unwrap();
}
`;

        const modelsNoteCode = `use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize)]
pub struct Note {
    pub id: u64,
    pub title: String,
    pub body: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateNote {
    pub title: String,
    pub body: String,
}
`;

        const controllersNotesCode = `use axum::{
    extract::Path, routing::{get, post},
    http::StatusCode, Json, Router,
};
use crate::models::note::{Note, CreateNote};
use serde::Serialize;

#[derive(Serialize)]
struct ErrorResponse {
    error: String,
}

fn sample_notes() -> Vec<Note> {
    vec![
        Note { id: 1, title: "First Note".into(), body: "Hello world".into() },
        Note { id: 2, title: "Second Note".into(), body: "Learning Loco".into() },
    ]
}

async fn list() -> Json<Vec<Note>> {
    Json(sample_notes())
}

async fn show(Path(id): Path<u64>) -> Result<Json<Note>, (StatusCode, Json<ErrorResponse>)> {
    let notes = sample_notes();
    if let Some(note) = notes.into_iter().find(|n| n.id == id) {
        Ok(Json(note))
    } else {
        Err((StatusCode::NOT_FOUND, Json(ErrorResponse { error: "Not found".into() })))
    }
}

async fn create(Json(payload): Json<CreateNote>) -> (StatusCode, Json<Note>) {
    (StatusCode::CREATED, Json(Note { id: 3, title: payload.title, body: payload.body }))
}

pub fn routes() -> Router {
    Router::new()
        .route("/notes", get(list).post(create))
        .route("/notes/:id", get(show))
}
`;

        await sidebar.getByText('controllers', { exact: true }).click();
        await page.waitForTimeout(500);

        await sidebar.getByText('notes.rs', { exact: true }).click();
        await page.waitForTimeout(500);

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            const stateModel = models.find(m => m.uri.path.endsWith('notes.rs'));
            if (stateModel) stateModel.setValue(code);
        }, controllersNotesCode);

        // Click Test
        await page.click('button:has-text("Test")');
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 120000 });
        await expect(page.locator('button:has-text("Objectives")')).toContainText('ALL PASS');
    });
});
