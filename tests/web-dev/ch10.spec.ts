import { test, expect } from '@playwright/test';

test.describe('Web Dev Chapter 10: SQLx — Type-Safe SQL', () => {
    test('SQLx — Type-Safe SQL Lesson', async ({ page }) => {
        test.setTimeout(120000);
        await page.goto('/path/web-dev/lesson/webdev-10');

        // Quiz
        await page.locator('label', { hasText: 'It checks your SQL queries for typos at compile-time' }).click();
        await page.locator('label', { hasText: 'It uses the #[derive(FromRow)] macro or the query_as! macro to do it automatically' }).click();
        await page.locator('label', { hasText: 'By using bound parameters with the \'?\' placeholder' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `use sqlx::{sqlite::SqlitePoolOptions, SqlitePool, FromRow};

#[derive(Debug, FromRow)]
struct User {
    id: i64, 
    name: String,
}

async fn setup_db() -> Result<SqlitePool, sqlx::Error> {
    let pool = SqlitePoolOptions::new().connect("sqlite::memory:").await?;
    sqlx::query("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)").execute(&pool).await?;
    sqlx::query("INSERT INTO users (id, name) VALUES (1, 'ferris')").execute(&pool).await?;
    Ok(pool)
}

async fn fetch_user(pool: &SqlitePool, user_id: i64) -> Result<User, sqlx::Error> {
    let user = sqlx::query_as::<_, User>(
        "SELECT id, name FROM users WHERE id = ?"
    )
    .bind(user_id)
    .fetch_one(pool) 
    .await?;
    Ok(user)
}

#[tokio::main]
async fn main() {
    let pool = setup_db().await.unwrap();
    match fetch_user(&pool, 1).await {
        Ok(user) => println!("Mapped User: {:?}", user),
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
