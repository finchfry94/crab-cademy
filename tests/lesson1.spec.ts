import { test, expect } from '@playwright/test';

test.describe('Lesson 1.1: Hello, World!', () => {
    test('completes the quiz and passes the coding challenge', async ({ page }) => {
        // 1. Navigate to the lesson
        await page.goto('/lesson/ch01-01');

        // 2. Complete the quiz
        // Question 1: What does the ! in println! indicate?
        // Correct answer: "It's a macro, not a regular function"
        await page.click('text="It\'s a macro, not a regular function"');

        // Question 2: What is the required entry point function in a Rust program?
        // Correct answer: "main()"
        await page.click('text="main()"');

        // 3. Click "Check Answers"
        await page.click('button:has-text("Check Answers")');

        // 4. Verify quiz is passed and "Objectives" tab is available/clicked
        await page.click('button:has-text("Objectives")');

        // 5. Update Monaco editor with the correct code
        const rustCode = `fn greet(name: &str) -> String {
    format!("Hello, {name}!")
}

fn main() {
    let message = greet("World");
    println!("{message}");
}`;

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            if (models.length > 0) {
                models[0].setValue(code);
            }
        }, rustCode);

        // 6. Run the tests
        await page.click('button:has-text("Test")');

        // 7. Assert that all tests passed
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 10000 });

        // Check for the "ALL PASS" badge on the Objectives tab
        await expect(page.locator('button:has-text("Objectives")')).toContainText('ALL PASS');
    });
});
