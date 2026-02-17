import { test, expect } from '@playwright/test';

test.describe('Chapter 7: Managing Growing Projects', () => {
    test('7.1 Packages and Crates', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch07-01');

        // Quiz
        await page.locator('label', { hasText: 'Binary crates have a main function, library crates do not' }).click();
        await page.locator('label', { hasText: 'Exactly one at most' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `// This lesson is conceptual.
// Click "Run" to proceed!

fn main() {
    println!("I understand packages and crates!");
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

    test('7.2 Defining Modules', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch07-02');

        // Quiz
        await page.locator('label', { hasText: /^\s*Private\s*$/ }).click();
        await page.locator('label', { hasText: /^\s*pub\s*$/ }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `mod math {
    pub fn add(a: i32, b: i32) -> i32 {
        a + b
    }

    fn subtract(a: i32, b: i32) -> i32 {
        a - b
    }
}

fn main() {
    let sum = math::add(10, 20);
    println!("Sum: {}", sum);
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

    test('7.3 Paths for Referring to an Item', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch07-03');

        // Quiz
        await page.locator('label', { hasText: 'crate' }).click();
        await page.locator('label', { hasText: 'super' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `mod tools {
    pub fn add(a: i32, b: i32) -> i32 {
        a + b
    }
}

use tools::add;

fn compute(a: i32, b: i32) -> i32 {
    add(a, b)
}

fn main() {
    println!("Result: {}", compute(4, 6));
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
