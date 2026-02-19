import { test, expect } from '@playwright/test';

test.describe('Chapter 1: Hello, World!', () => {
    test('1.1 Hello, World!', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch01-01');

        // Quiz
        await page.locator('label', { hasText: "It's a macro, not a regular function" }).click();
        await page.locator('label', { hasText: 'main()' }).click();
        await page.locator('label', { hasText: 'format! returns a String instead of printing to the console' }).click();
        await page.locator('label', { hasText: 'println!("hello")' }).nth(1).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn farewell(name: &str) -> String {
    format!("Goodbye, {}!", name)
}

fn main() {
    println!("{}", greet("World"));
    println!("{}", farewell("World"));
}`;

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            if (models.length > 0) {
                models[0].setValue(code);
            }
        }, rustCode);

        await page.click('button:has-text("Test")');
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('button:has-text("Objectives")')).toContainText('ALL PASS');
    });
});
