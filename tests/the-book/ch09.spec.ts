import { test, expect } from '@playwright/test';

test.describe('Chapter 9: Error Handling', () => {
    test('9.1 Unrecoverable Errors with panic!', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch09-01');

        // Quiz
        await page.locator('label', { hasText: 'It terminates the program immediately' }).click();
        await page.locator('label', { hasText: "No, it's unrecoverable" }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn verify_positive(n: i32) {
    if n < 0 {
        panic!("Number must be positive!");
    }
}

fn main() {
    verify_positive(10);
    println!("10 is ok");
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

    test('9.2 Recoverable Errors with Result', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch09-02');

        // Quiz
        await page.locator('label', { hasText: 'Panics' }).click();
        await page.locator('label', { hasText: 'To propagate errors (return early on Err)' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err("Cannot divide by zero".to_string())
    } else {
        Ok(a / b)
    }
}

fn main() {
    let result = divide(10.0, 2.0);
    println!("10 / 2 = {:?}", result);

    let error = divide(10.0, 0.0);
    println!("10 / 0 = {:?}", error);
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
