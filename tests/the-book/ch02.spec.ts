import { test, expect } from '@playwright/test';

test.describe('Chapter 2: Guessing Game', () => {
    test('2.1 Guessing Game', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch02-01');

        // Quiz
        await page.locator('label', { hasText: "std::cmp::Ordering" }).click();
        await page.locator('label', { hasText: "Less, Greater, Equal" }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `use std::cmp::Ordering;

fn check_guess(guess: u32, secret: u32) -> Ordering {
    guess.cmp(&secret)
}

fn parse_input(input: &str) -> u32 {
    input.parse().unwrap_or(0)
}

fn main() {
    let secret = 42;
    let guess_str = "50";
    let guess = parse_input(guess_str);
    
    match check_guess(guess, secret) {
        Ordering::Less => println!("Too small!"),
        Ordering::Greater => println!("Too big!"),
        Ordering::Equal => println!("You win!"),
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
});
