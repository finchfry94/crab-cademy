import { test, expect } from '@playwright/test';

test.describe('Chapter 20: Advanced Features', () => {
    test('20.1 Unsafe Rust', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch20-01');

        // Quiz
        await page.locator('label', { hasText: "No, it just means the compiler can't verify safety" }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn main() {
    let x = 42;
    let p = &x as *const i32;
    unsafe {
        println!("Dereferenced: {}", *p);
    }
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

    // Note: 20.5 Macros is desktop-only
});
