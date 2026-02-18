import { test, expect } from '@playwright/test';

test.describe('Chapter 21: Final Project: Building a Multithreaded Web Server', () => {
    test('21.1 Building a Single-Threaded Web Server', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch21-01');

        // Quiz
        await page.locator('label', { hasText: '7878' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `use std::net::TcpListener;

fn main() {
    println!("Web server tutorial");
}
`;

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            if (models.length > 0) {
                models[0].setValue(code);
            }
        }, rustCode);

        // Conceptual test
        await page.click('button:has-text("Test")');
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 15000 });
    });
});
