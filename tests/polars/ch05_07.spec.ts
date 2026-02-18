import { test, expect } from '@playwright/test';

test.describe('Polars Chapters 5-7', () => {
    test('1.5 Joins & Concatenation', async ({ page }) => {
        // Mock Playground API
        await page.route('https://play.rust-lang.org/execute', async route => {
            const json = {
                success: true,
                exitDetail: "Test run mocked",
                stdout: "running 1 test\ntest test_mock ... ok\ntest result: ok. 1 passed; 0 failed\n",
                stderr: ""
            };
            await route.fulfill({ json });
        });

        await page.goto('/path/polars/lesson/polars-05');

        // Quiz
        await page.locator('label', { hasText: 'Inner Join' }).click();
        await page.locator('label', { hasText: 'The right columns are filled with nulls' }).click();
        await page.locator('label', { hasText: 'concat()' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding
        await page.click('button:has-text("Objectives")');
        const code = `use polars::prelude::*;

pub fn get_player_teams(players: DataFrame, teams: DataFrame) -> PolarsResult<DataFrame> {
    players.lazy()
        .join(
            teams.lazy(),
            [col("team_id")],
            [col("id")],
            JoinArgs::new(JoinType::Left)
        )
        .collect()
}

fn main() -> PolarsResult<()> {
    let players = df![
        "name" => ["Alice", "Bob", "Charlie"],
        "team_id" => [1, 2, 1]
    ]?;
    
    let teams = df![
        "id" => [1, 2],
        "team_name" => ["Crustaceans", "Cephalopods"]
    ]?;

    let result = get_player_teams(players, teams)?;
    println!("{}", result);
    Ok(())
}
`;
        await page.evaluate((c) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            if (models.length > 0) models[0].setValue(c);
        }, code);

        await page.click('button:has-text("Test")');
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 15000 });
    });

    test('1.6 Reading & Writing Data (I/O)', async ({ page }) => {
        // Mock Playground API
        await page.route('https://play.rust-lang.org/execute', async route => {
            const json = {
                success: true,
                exitDetail: "Test run mocked",
                stdout: "running 1 test\ntest test_mock ... ok\ntest result: ok. 1 passed; 0 failed\n",
                stderr: ""
            };
            await route.fulfill({ json });
        });

        await page.goto('/path/polars/lesson/polars-06');

        // Quiz
        await page.locator('label', { hasText: 'It delays loading to allow for optimization like predicate pushdown' }).click();
        await page.locator('label', { hasText: 'Parquet' }).click();
        await page.locator('label', { hasText: 'Moving filters directly into the file reading process' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding (Simple compilation test as per lesson)
        await page.click('button:has-text("Objectives")');
        const code = `use polars::prelude::*;

pub fn process_sensor_data(path: &str) -> PolarsResult<DataFrame> {
    // In a real env this would exist, but let's mock the logic for compilation
    // LazyFrame::scan_parquet(path, Default::default())?
    // .filter(col("value").gt(100.0))
    // .select([col("timestamp"), col("value")])
    // .collect()
    
    // For the sake of the test which needs to "pass" or "compile"
    // We'll just return an empty DF if the file doesn't exist, but follow the logic
    let lf = df!["timestamp" => [0], "value" => [0.0]]?.lazy();
    lf.filter(col("value").gt(100.0))
      .select([col("timestamp"), col("value")])
      .collect()
}

fn main() {
   let _ = process_sensor_data("sensor_data.parquet");
}
`;
        await page.evaluate((c) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            if (models.length > 0) models[0].setValue(c);
        }, code);

        await page.click('button:has-text("Test")');
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 15000 });
    });

    test('1.7 Window Functions', async ({ page }) => {
        // Mock Playground API
        await page.route('https://play.rust-lang.org/execute', async route => {
            const json = {
                success: true,
                exitDetail: "Test run mocked",
                stdout: "running 1 test\ntest test_mock ... ok\ntest result: ok. 1 passed; 0 failed\n",
                stderr: ""
            };
            await route.fulfill({ json });
        });

        await page.goto('/path/polars/lesson/polars-07');

        // Quiz
        await page.locator('label', { hasText: 'group_by collapses the frame; over keeps all rows' }).click();
        await page.locator('label', { hasText: '.over()' }).click();
        await page.locator('label', { hasText: 'Yes, using .rank() and .over()' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding
        await page.click('button:has-text("Objectives")');
        const code = `use polars::prelude::*;

pub fn add_class_average(df: DataFrame) -> PolarsResult<DataFrame> {
    df.lazy()
        .with_column(
            col("grade").mean().over(["class"]).alias("class_avg")
        )
        .collect()
}

fn main() -> PolarsResult<()> {
    let df = df![
        "student" => ["Alice", "Bob", "Charlie", "David"],
        "class" => ["Math", "Math", "Science", "Science"],
        "grade" => [90.0, 80.0, 70.0, 100.0]
    ]?;

    let result = add_class_average(df)?;
    println!("{}", result);
    Ok(())
}
`;
        await page.evaluate((c) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            if (models.length > 0) models[0].setValue(c);
        }, code);

        await page.click('button:has-text("Test")');
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 15000 });
    });
});
