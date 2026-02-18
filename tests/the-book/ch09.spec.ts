import { test, expect } from '@playwright/test';
import { mockPlayground } from '../utils/mockPlayground';

test.describe('Chapter 9: Error Handling', () => {
    test.beforeEach(async ({ page }) => {
        await mockPlayground(page);
    });

    test('9.1 Unrecoverable Errors with panic!', async ({ page }) => {
        test.setTimeout(60000);
        await page.goto('/path/the-book/lesson/ch09-01');

        // Quiz
        await page.locator('label', { hasText: 'Terminates the program immediately' }).click();
        await page.locator('label', { hasText: 'No, use Result to handle it gracefully' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn validate_age(age: i32) {
    if age < 0 {
        panic!("Too young!");
    } else if age > 150 {
        panic!("Too old!");
    }
}

fn main() {
    // Only call with valid data so main() doesn't panic
    validate_age(25);
}`;

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            if (models.length > 0) {
                models[0].setValue(code);
            }
        }, rustCode);

        await page.click('button:has-text("Test")');
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 60000 });
        await expect(page.locator('button:has-text("Objectives")')).toContainText('ALL PASS');
    });

    test('9.2 Recoverable Errors with Result', async ({ page }) => {
        test.setTimeout(60000);
        await page.goto('/path/the-book/lesson/ch09-02');

        // Quiz
        await page.locator('label', { hasText: 'Propagates the error (returns early) or unwraps the value' }).click();
        await page.locator('label', { hasText: 'unwrap()' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn safe_divide(num: f64, den: f64) -> Result<f64, String> {
    if den == 0.0 {
        Err(String::from("Division by zero"))
    } else {
        Ok(num / den)
    }
}

fn main() {
    safe_divide(10.0, 2.0);
}`;

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            if (models.length > 0) {
                models[0].setValue(code);
            }
        }, rustCode);

        await page.click('button:has-text("Test")');
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 60000 });
        await expect(page.locator('button:has-text("Objectives")')).toContainText('ALL PASS');
    });
});
