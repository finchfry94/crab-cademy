import { test, expect } from '@playwright/test';

test.describe('Chapter 3: Programming a Guessing Game', () => {
    test('3.1 Programming a Guessing Game', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch03-01');

        // Quiz
        await page.locator('label', { hasText: 'std::cmp::Ordering' }).click();
        await page.locator('label', { hasText: 'loop (infinite with break)' }).click();
        await page.locator('label', { hasText: 'Outside the loop (mutable)' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `
// Write: validate(guess: i32) -> bool
fn validate(guess: i32) -> bool {
    guess >= 1 && guess <= 100
}

// Write: check_guess(guess: i32, secret: i32) -> i32
fn check_guess(guess: i32, secret: i32) -> i32 {
    if guess < secret {
        -1
    } else if guess > secret {
        1
    } else {
        0
    }
}

// Write: count_attempts(guesses: &[i32], secret: i32) -> i32
fn count_attempts(guesses: &[i32], secret: i32) -> i32 {
    let mut count = 0;
    for &guess in guesses {
        count += 1;
        if guess == secret {
            return count;
        }
    }
    -1
}

fn main() {
    println!("Is 50 valid? {}", validate(50));
    println!("Check 10 vs 50: {}", check_guess(10, 50));
    
    let game = [10, 40, 70, 42, 90];
    println!("Attempts to find 42: {}", count_attempts(&game, 42));
}
`;

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
