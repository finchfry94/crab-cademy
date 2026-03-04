import { test, expect } from '@playwright/test';

test.describe('Web Dev Chapter 15: CRUD API', () => {
    test('4.1 CRUD API', async ({ page }) => {
        test.setTimeout(120000);
        await page.goto('/path/web-dev/lesson/webdev-15');

        // Quiz
        await page.locator('label', { hasText: 'PUT' }).click();
        await page.locator('label', { hasText: 'To allow partial updates — only changed fields are sent' }).click();

        await page.click('button:has-text("Check Answers")');

        // File tree sidebar should be visible
        const sidebar = page.locator('.file-tree-sidebar');
        await expect(sidebar).toBeVisible({ timeout: 120000 });
        await expect(sidebar.getByText('src', { exact: true })).toBeVisible();

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const mainCode = `mod controllers;
mod models;

use std::sync::Arc;
use controllers::tasks::{AppState, make_router};

#[tokio::main]
async fn main() {
    let state = Arc::new(AppState::new());
    let app = make_router(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();
    println!("🚀 Task API on http://localhost:3000");
    axum::serve(listener, app).await.unwrap();
}
`;

        const modelsTaskCode = `use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Task {
    pub id: u64,
    pub title: String,
    pub completed: bool,
}

#[derive(Debug, Deserialize)]
pub struct CreateTask {
    pub title: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateTask {
    pub title: Option<String>,
    pub completed: Option<bool>,
}
`;

        const controllersTasksCode = `use axum::{
    extract::{Path, State},
    routing::{get, post, put, delete},
    http::StatusCode, Json, Router,
};
use std::sync::Arc;
use tokio::sync::Mutex;
use crate::models::task::{Task, CreateTask, UpdateTask};

pub struct AppState {
    tasks: Mutex<Vec<Task>>,
    next_id: Mutex<u64>,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            tasks: Mutex::new(Vec::new()),
            next_id: Mutex::new(1),
        }
    }
}

async fn list(State(state): State<Arc<AppState>>) -> Json<Vec<Task>> {
    let tasks = state.tasks.lock().await;
    Json(tasks.clone())
}

async fn create(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<CreateTask>,
) -> (StatusCode, Json<Task>) {
    let mut next_id = state.next_id.lock().await;
    let mut tasks = state.tasks.lock().await;
    let task = Task {
        id: *next_id,
        title: payload.title,
        completed: false,
    };
    tasks.push(task.clone());
    *next_id += 1;
    (StatusCode::CREATED, Json(task))
}

async fn update(
    Path(id): Path<u64>,
    State(state): State<Arc<AppState>>,
    Json(payload): Json<UpdateTask>,
) -> Result<Json<Task>, StatusCode> {
    let mut tasks = state.tasks.lock().await;
    let task = tasks.iter_mut()
        .find(|t| t.id == id)
        .ok_or(StatusCode::NOT_FOUND)?;
    
    if let Some(title) = payload.title {
        task.title = title;
    }
    if let Some(completed) = payload.completed {
        task.completed = completed;
    }
    
    Ok(Json(task.clone()))
}

async fn destroy(
    Path(id): Path<u64>,
    State(state): State<Arc<AppState>>,
) -> StatusCode {
    let mut tasks = state.tasks.lock().await;
    if let Some(pos) = tasks.iter().position(|t| t.id == id) {
        tasks.remove(pos);
        StatusCode::NO_CONTENT
    } else {
        StatusCode::NOT_FOUND
    }
}

pub fn make_router(state: Arc<AppState>) -> Router {
    Router::new()
        .route("/api/tasks", get(list).post(create))
        .route("/api/tasks/:id", put(update).delete(destroy))
        .with_state(state)
}
`;

        await sidebar.getByText('models', { exact: true }).click();
        await page.waitForTimeout(500);

        await sidebar.getByText('task.rs', { exact: true }).click();
        await page.waitForTimeout(500);

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            const stateModel = models.find(m => m.uri.path.endsWith('task.rs'));
            if (stateModel) stateModel.setValue(code);
        }, modelsTaskCode);

        await sidebar.getByText('controllers', { exact: true }).click();
        await page.waitForTimeout(500);

        await sidebar.getByText('tasks.rs', { exact: true }).click();
        await page.waitForTimeout(500);

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            const stateModel = models.find(m => m.uri.path.endsWith('tasks.rs'));
            if (stateModel) stateModel.setValue(code);
        }, controllersTasksCode);

        // Click Test
        await page.click('button:has-text("Test")');
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 120000 });
        await expect(page.locator('button:has-text("Objectives")')).toContainText('ALL PASS');
    });
});
