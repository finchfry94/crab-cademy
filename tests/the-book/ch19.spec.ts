import { test, expect } from '@playwright/test';

test.describe('Chapter 19: Patterns and Matching', () => {
    test('19.3 Pattern Syntax', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch19-03');

        // Quiz
        await page.locator('label', { hasText: '..=' }).click();
        await page.locator('label', { hasText: 'Logical OR (matches either pattern)' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `struct Color { r: u8, g: u8, b: u8 }

fn is_pure_red(c: Color) -> bool {
    match c {
        Color { r: 255, g: 0, b: 0 } => true,
        _ => false,
    }
}

fn main() {
    let c = Color { r: 255, g: 0, b: 0 };
    println!("Is red? {}", is_pure_red(c));
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
