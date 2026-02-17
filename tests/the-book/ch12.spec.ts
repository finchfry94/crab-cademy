import { test, expect } from '@playwright/test';

test.describe('Chapter 12: An I/O Project - minigrep', () => {
    // Note: 12.1 and 12.2 are desktop-only lessons

    test('12.4 Developing with TDD', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch12-04');

        // Quiz
        await page.locator('label', { hasText: "To tell the compiler the returned slices live as long as 'contents'" }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `pub fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    let mut results = Vec::new();

    for line in contents.lines() {
        if line.contains(query) {
            results.push(line);
        }
    }

    results
}

fn main() {
    let query = "fast";
    let contents = "Rust is fast\\nPython is slow";
    println!("{:?}", search(query, contents));
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
