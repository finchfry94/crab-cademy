import { test, expect } from '@playwright/test';

test.describe('Chapter 13: Functional Language Features', () => {
    test('13.1 Closures', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch13-01');

        // Quiz
        await page.locator('label', { hasText: 'Closures can capture their environment' }).click();
        await page.locator('label', { hasText: 'move' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn main() {
    let multiplier = 2;
    let double = |x: i32| x * multiplier;

    let result = double(5);
    println!("Result: {}", result);
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

    test('13.2 Processing a Series of Items with Iterators', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch13-02');

        // Quiz
        await page.locator('label', { hasText: "They don't do anything until consumed" }).click();
        await page.locator('label', { hasText: 'collect()' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn main() {
    let numbers = vec![1, 2, 3, 4, 5, 6];

    let evens_times_ten: Vec<i32> = numbers.into_iter()
        .filter(|x| x % 2 == 0)
        .map(|x| x * 10)
        .collect();

    println!("{:?}", evens_times_ten);
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
