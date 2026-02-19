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

        const rustCode = `fn double_value(x: i32) -> i32 {
    let double = |n| n * 2;
    double(x)
}

fn add_with_closure(x: i32, y: i32) -> i32 {
    let add = |n| n + y;
    add(x)
}

fn main() {
    println!("Double 5: {}", double_value(5));
    println!("5 + 10: {}", add_with_closure(5, 10));
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

        const rustCode = `fn process_numbers(input: Vec<i32>) -> Vec<i32> {
    input.into_iter()
        .filter(|x| x % 2 == 0)
        .map(|x| x * 10)
        .collect()
}

fn main() {
    let numbers = vec![1, 2, 3, 4, 5, 6];
    let result = process_numbers(numbers);
    println!("{:?}", result);
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
