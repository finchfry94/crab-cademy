import { test, expect } from '@playwright/test';

test.describe('Web Dev Chapter 6: The Persistence Problem', () => {
    test('The Persistence Problem Lesson', async ({ page }) => {
        test.setTimeout(120000);
        await page.goto('/path/web-dev/lesson/webdev-06');

        // Quiz
        await page.locator('label', { hasText: 'It is wiped from memory and lost forever' }).click();
        await page.locator('label', { hasText: 'Because searching through a giant file is incredibly slow and inefficient compared to a true database engine' }).click();
        await page.locator('label', { hasText: 'A database engine that stores data in a single file' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn handle_request(name: String) -> usize {
    let mut users = Vec::new();
    users.push(name);
    users.len()
}

fn main() {
    println!("Request 1 (ferris): Users saved: {}", handle_request("ferris".into()));
    println!("Request 2 (crabby): Users saved: {}", handle_request("crabby".into()));
    println!("Where did ferris go? We need a real database!");
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
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 120000 });
        await expect(page.locator('button:has-text("Objectives")')).toContainText('ALL PASS');
    });
});
