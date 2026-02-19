import { test, expect } from '@playwright/test';
import { mockPlayground } from '../utils/mockPlayground';

test.describe('Chapter 20: Advanced Features', () => {
    test.beforeEach(async ({ page }) => {
        await mockPlayground(page);
    });

    test('20.1 Unsafe Rust', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch20-01');

        // Quiz
        await page.getByText(/^No$/, { exact: true }).nth(0).click();
        await page.getByText(/^No$/, { exact: true }).nth(1).click();

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

    test('20.5 Macros', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch20-05');

        // Quiz
        await page.locator('label', { hasText: 'Macros expand into code at compile time' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `macro_rules! say_hello {
    () => {
        println!("Hello!");
    };
}

fn main() {
    say_hello!();
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
});
