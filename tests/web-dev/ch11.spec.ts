import { test, expect } from '@playwright/test';

test.describe('Web Dev Chapter 11: ORM Patterns & Migrations', () => {
    test('ORM Patterns & Migrations Lesson', async ({ page }) => {
        test.setTimeout(120000);
        await page.goto('/path/web-dev/lesson/webdev-11');

        // Quiz
        await page.locator('label', { hasText: 'Translates between database rows and Rust objects automatically' }).click();
        await page.locator('label', { hasText: 'Version control for your database structure (schema) over time' }).click();
        await page.locator('label', { hasText: 'Applies a new structural change to the database' }).click();
        await page.locator('label', { hasText: 'It eliminates the need to write repetitive CRUD queries manually, keeping code clean' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `struct Schema {
    columns: Vec<String>,
}

impl Schema {
    fn new() -> Self {
        Self { columns: Vec::new() }
    }

    fn apply_migration(&mut self, command: &str) {
        match command {
            "CREATE_USERS" => {
                self.columns.push("id".into());
                self.columns.push("name".into());
            }
            "ADD_AGE" => {
                self.columns.push("age".into());
            }
            _ => {}
        }
    }
}

fn main() {
    let mut s = Schema::new();
    s.apply_migration("CREATE_USERS");
    println!("Migration 1 Columns: {:?}", s.columns);
    s.apply_migration("ADD_AGE");
    println!("Migration 2 Columns: {:?}", s.columns);
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
