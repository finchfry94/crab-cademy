import { test, expect } from '@playwright/test';

test.describe('Chapter 2: Guessing Game', () => {
    test('2.1 Programming a Guessing Game', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch02-01');

        // Quiz
        await page.locator('label', { hasText: 'std::cmp::Ordering' }).click();
        await page.locator('label', { hasText: 'Less, Greater, Equal' }).click();
        await page.locator('label', { hasText: 'The compiler rejects the code' }).click();
        await page.locator('label', { hasText: 'Converts the string "42" into the unsigned integer 42' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `use std::cmp::Ordering;

fn compare_numbers(a: i32, b: i32) -> String {
    match a.cmp(&b) {
        Ordering::Less => String::from("Less"),
        Ordering::Greater => String::from("Greater"),
        Ordering::Equal => String::from("Equal"),
    }
}

fn clamp(value: i32, min: i32, max: i32) -> i32 {
    if value < min {
        min
    } else if value > max {
        max
    } else {
        value
    }
}

fn main() {
    println!("{}", compare_numbers(5, 10));
    println!("{}", compare_numbers(10, 5));
    println!("{}", compare_numbers(5, 5));
    println!("Clamped: {}", clamp(150, 0, 100));
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
