import { test, expect } from '@playwright/test';

test.describe('Web Dev Chapter 9: Schema Design & Constraints', () => {
    test('Schema Design & Constraints Lesson', async ({ page }) => {
        test.setTimeout(120000);
        await page.goto('/path/web-dev/lesson/webdev-09');

        // Quiz
        await page.locator('label', { hasText: 'A column that uniquely identifies each row in a table' }).click();
        await page.locator('label', { hasText: 'Enforces that the column must have a value' }).click();
        await page.locator('label', { hasText: /^UNIQUE$/ }).click();
        await page.locator('label', { hasText: 'SQLite refuses to insert the data and returns an error to Rust' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `use rusqlite::{Connection, Result};

fn setup_db(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE users (
            id INTEGER PRIMARY KEY,
            username TEXT NOT NULL UNIQUE
        )",
        [],
    )?;
    conn.execute("INSERT INTO users (username) VALUES ('ferris')", [])?;
    Ok(())
}

fn insert_duplicate(conn: &Connection) -> String {
    let result = conn.execute(
        "INSERT INTO users (username) VALUES ('ferris')",
        [],
    );
    match result {
        Ok(_) => "Wait, this shouldn't have succeeded!".into(),
        Err(e) => e.to_string(),
    }
}

fn main() {
    let conn = Connection::open_in_memory().unwrap();
    setup_db(&conn).unwrap();
    println!("Constraint Error: {}", insert_duplicate(&conn));
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
