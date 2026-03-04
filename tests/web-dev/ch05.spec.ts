import { test, expect } from '@playwright/test';

test.describe('Web Dev Chapter 5: In-Memory Data Stores', () => {
    test('In-Memory Data Stores Lesson', async ({ page }) => {
        test.setTimeout(120000);
        await page.goto('/path/web-dev/lesson/webdev-05');

        // Quiz
        await page.locator('label', { hasText: 'A collection of organized data, like a spreadsheet' }).click();
        await page.locator('label', { hasText: 'SELECT' }).click();
        await page.locator('label', { hasText: 'INSERT INTO' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `struct UserStore {
    users: Vec<String>,
}

impl UserStore {
    fn new() -> Self {
        Self { users: Vec::new() }
    }

    fn add_user(&mut self, name: String) {
        self.users.push(name);
    }

    fn find_user(&self, index: usize) -> Option<&String> {
        self.users.get(index)
    }
}

fn main() {
    let mut store = UserStore::new();
    store.add_user("ferris".into());
    println!("User at 0: {:?}", store.find_user(0));
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
