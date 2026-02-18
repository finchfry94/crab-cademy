import { test, expect } from '@playwright/test';

test.describe('Chapter 17: Async / Await', () => {
    test('17.1 Futures and the Async Syntax', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch17-01');

        // Quiz
        await page.locator('label', { hasText: 'No, it returns a Future' }).click();
        await page.locator('label', { hasText: 'An async runtime' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `async fn say_hi() {
    println!("Hi from async!");
}

#[tokio::main]
async fn main() {
    say_hi().await;
}
`;

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            if (models.length > 0) {
                models[0].setValue(code);
            }
        }, rustCode);

        // This lesson has conceptual tests because tokio is not in the default playground
        await page.click('button:has-text("Test")');
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 15000 });
    });
});
