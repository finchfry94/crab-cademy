import { test, expect } from '@playwright/test';

test.describe('Web Dev Chapter 7: Intro to SQLite', () => {
    test('Intro to SQLite Lesson', async ({ page }) => {
        test.setTimeout(120000);
        await page.goto('/path/web-dev/lesson/webdev-07');

        // Quiz
        await page.locator('label', { hasText: 'Executes a raw SQL command string' }).click();
        await page.locator('label', { hasText: 'If you provide the wrong index or wrong type, the program crashes at runtime' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `use rusqlite::{Connection, Result};

fn setup_db(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE users (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL
        )",
        [],
    )?;
    Ok(())
}

fn insert_and_read(conn: &Connection) -> Result<Vec<String>> {
    conn.execute(
        "INSERT INTO users (name) VALUES ('ferris')", 
        [],
    )?;

    let mut stmt = conn.prepare("SELECT id, name FROM users")?;
    
    let rows = stmt.query_map([], |row| {
        let name: String = row.get(1)?;
        Ok(name)
    })?;

    let mut names = Vec::new();
    for name_result in rows {
        names.push(name_result?);
    }
    
    Ok(names)
}

fn main() {
    let conn = Connection::open_in_memory().unwrap();
    setup_db(&conn).unwrap();
    
    match insert_and_read(&conn) {
        Ok(names) => println!("Inserted users: {:?}", names),
        Err(e) => println!("Database error: {}", e),
    }
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
