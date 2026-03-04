import { test, expect } from '@playwright/test';

test.describe('Web Dev Chapter 17: Background Jobs', () => {
    test('4.3 Background Jobs', async ({ page }) => {
        test.setTimeout(120000);
        await page.goto('/path/web-dev/lesson/webdev-17');

        // Quiz
        await page.locator('label', { hasText: "It blocks the response — users wait seconds for a task they don't see" }).click();
        await page.locator('label', { hasText: 'Tasks are lost if the server restarts' }).click();

        await page.click('button:has-text("Check Answers")');

        // File tree sidebar should be visible
        const sidebar = page.locator('.file-tree-sidebar');
        await expect(sidebar).toBeVisible({ timeout: 120000 });
        await expect(sidebar.getByText('src', { exact: true })).toBeVisible();

        // Coding Challenge
        await page.click('button:has-text("Objectives")');


        const jobsCode = `pub enum Job {
    LogMessage(String),
    Countdown(u32),
}

impl Job {
    pub async fn execute(&self) {
        match self {
            Job::LogMessage(msg) => {
                println!("[LOG] {}", msg);
            }
            Job::Countdown(n) => {
                for i in (1..=*n).rev() {
                    println!("{}", i);
                    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
                }
            }
        }
    }
}
`;

        const controllersJobsCode = `use axum::{extract::State, routing::post, http::StatusCode, Json, Router};
use serde::Deserialize;
use std::sync::Arc;
use tokio::sync::mpsc;
use crate::jobs::Job;

pub struct JobState {
    pub sender: mpsc::Sender<Job>,
}

#[derive(Deserialize)]
struct LogRequest {
    message: String,
}

#[derive(Deserialize)]
struct CountdownRequest {
    from: u32,
}

async fn queue_log(
    State(state): State<Arc<JobState>>,
    Json(payload): Json<LogRequest>,
) -> StatusCode {
    let _ = state.sender.send(Job::LogMessage(payload.message)).await;
    StatusCode::ACCEPTED
}

async fn queue_countdown(
    State(state): State<Arc<JobState>>,
    Json(payload): Json<CountdownRequest>,
) -> StatusCode {
    let _ = state.sender.send(Job::Countdown(payload.from)).await;
    StatusCode::ACCEPTED
}

pub fn routes(state: Arc<JobState>) -> Router {
    Router::new()
        .route("/jobs/log", post(queue_log))
        .route("/jobs/countdown", post(queue_countdown))
        .with_state(state)
}
`;

        await sidebar.getByText('jobs.rs', { exact: true }).click();
        await page.waitForTimeout(500);

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            const stateModel = models.find(m => m.uri.path.endsWith('jobs.rs'));
            if (stateModel) stateModel.setValue(code);
        }, jobsCode);

        await sidebar.getByText('controllers', { exact: true }).click();
        await page.waitForTimeout(500);

        await sidebar.getByText('jobs_controller.rs', { exact: true }).click();
        await page.waitForTimeout(500);

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            const stateModel = models.find(m => m.uri.path.endsWith('jobs_controller.rs'));
            if (stateModel) stateModel.setValue(code);
        }, controllersJobsCode);


        // Click Test
        await page.click('button:has-text("Test")');
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 120000 });
        await expect(page.locator('button:has-text("Objectives")')).toContainText('ALL PASS');
    });
});
