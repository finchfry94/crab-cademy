import { test, expect } from '@playwright/test';

test.describe('Chapter 11: Writing Automated Tests', () => {
    test('11.1 How to Write Tests', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch11-01');

        // Quiz
        await page.locator('label', { hasText: '#[test]' }).click();
        await page.locator('label', { hasText: 'assert_ne!' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn add_three(n: i32) -> i32 {
    n + 3
}

fn main() {}`;

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

    // Note: 11.2 and 11.3 are desktop-only lessons
});
