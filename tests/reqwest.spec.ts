import { test, expect } from '@playwright/test';

test.describe('HTTP with Reqwest', () => {
    test.beforeEach(async ({ page }) => {
        await page.route('https://play.rust-lang.org/execute', async route => {
            const json = {
                success: true,
                exitDetail: "",
                stdout: "running 1 test\ntest tests::test_request ... ok\n\ntest result: ok. 1 passed; 0 failed;",
                stderr: ""
            };
            await route.fulfill({ json });
        });
    });

    test('1.1 Your First GET Request', async ({ page }) => {
        await page.goto('/path/reqwest/lesson/reqwest-01');

        // Quiz
        await page.locator('label', { hasText: 'await' }).click();
        await page.locator('label', { hasText: 'Result<Response, Error>' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let response = reqwest::get("https://httpbin.org/get")
        .await?
        .text()
        .await?;

    println!("{response}");
    Ok(())
}`;

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            if (models.length > 0) {
                models[0].setValue(code);
            }
        }, rustCode);

        await page.click('button:has-text("Test")');
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 15000 });
        await expect(page.locator('button:has-text("Objectives")')).toContainText('ALL PASS');
    });

    test('1.2 Working with JSON', async ({ page }) => {
        await page.goto('/path/reqwest/lesson/reqwest-02');

        // Quiz
        await page.locator('label', { hasText: /^Serialize$/ }).click();
        await page.locator('label', { hasText: 'It reuses connection pools' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `use serde::Serialize;

#[derive(Serialize)]
struct Payload {
    message: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    let payload = Payload { message: "Hello from CrabCademy!".into() };

    let res = client.post("https://httpbin.org/post")
        .json(&payload)
        .send()
        .await?;

    println!("Status: {}", res.status());
    Ok(())
}`;

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            if (models.length > 0) {
                models[0].setValue(code);
            }
        }, rustCode);

        await page.click('button:has-text("Test")');
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 15000 });
    });

    test('1.3 Handling HTTP Errors', async ({ page }) => {
        await page.goto('/path/reqwest/lesson/reqwest-03');

        // Quiz
        await page.locator('label', { hasText: 'error_for_status()' }).click();
        await page.locator('label', { hasText: '400-499' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let res = reqwest::get("https://httpbin.org/status/500").await?;

    if res.status().is_server_error() {
        println!("Server Error");
    }

    Ok(())
}`;

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            if (models.length > 0) {
                models[0].setValue(code);
            }
        }, rustCode);

        await page.click('button:has-text("Test")');
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 15000 });
    });
});
