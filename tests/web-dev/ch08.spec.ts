import { test, expect } from '@playwright/test';

test.describe('Web Dev Chapter 8: Relationships & JOINs', () => {
    test('Relationships & JOINs Lesson', async ({ page }) => {
        test.setTimeout(120000);
        await page.goto('/path/web-dev/lesson/webdev-08');

        // Quiz
        await page.locator('label', { hasText: 'A column that points to the ID of a row in another table' }).click();
        await page.locator('label', { hasText: 'JOIN' }).click();
        await page.locator('label', { hasText: 'The code compiles, but crashes at runtime when the query is executed' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `use rusqlite::{Connection, Result, params};

fn setup_db(conn: &Connection) -> Result<()> {
    conn.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT)", [])?;
    conn.execute("CREATE TABLE posts (id INTEGER PRIMARY KEY, title TEXT, user_id INTEGER)", [])?;
    conn.execute("INSERT INTO users (id, username) VALUES (1, 'ferris')", [])?;
    conn.execute("INSERT INTO posts (id, title, user_id) VALUES (101, 'Hello Rust', 1)", [])?;
    Ok(())
}

fn find_post_author(conn: &Connection, post_id: i32) -> Result<String> {
    let username: String = conn.query_row(
        "
        SELECT users.username
        FROM posts
        JOIN users ON posts.user_id = users.id
        WHERE posts.id = ?
        ",
        params![post_id],
        |row| row.get(0)
    )?;
    Ok(username)
}

fn main() {
    let conn = Connection::open_in_memory().unwrap();
    setup_db(&conn).unwrap();
    match find_post_author(&conn, 101) {
        Ok(name) => println!("Post 101 author: {}", name),
        Err(e) => println!("Error: {}", e),
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
