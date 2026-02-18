import { test, expect } from '@playwright/test';

test.describe('Polars Chapters 1-4', () => {
    test('1.1 Introduction to Polars', async ({ page }) => {
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

        await page.goto('/path/polars/lesson/polars-01');

        // Quiz
        await page.locator('label', { hasText: 'It uses Apache Arrow and parallel execution' }).click();
        await page.locator('label', { hasText: 'It delays execution to optimize the query plan' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');
        const code = `use polars::prelude::*;

pub fn create_inventory() -> PolarsResult<DataFrame> {
    let df = df! [
        "item" => ["Amphora", "Scroll", "Gladius"],
        "count" => [10, 50, 3],
        "price" => [15.5, 5.0, 75.0]
    ]?;
    Ok(df)
}

fn main() -> PolarsResult<()> {
    let df = create_inventory()?;
    println!("{}", df);
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

    test('1.2 Contexts & Expressions', async ({ page }) => {
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

        await page.goto('/path/polars/lesson/polars-02');

        // Quiz
        await page.locator('label', { hasText: 'col()' }).click();
        await page.locator('label', { hasText: 'Renames the output of an expression' }).click();
        await page.locator('label', { hasText: 'To enable query implementation optimizations' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding
        await page.click('button:has-text("Objectives")');
        const code = `use polars::prelude::*;

pub fn calculate_total(df: DataFrame) -> PolarsResult<DataFrame> {
    df.lazy()
        .select([
            col("item"),
            (col("price") * (lit(1) + col("tax_rate"))).alias("total_price")
        ])
        .collect()
}

fn main() -> PolarsResult<()> {
    let df = df! [
        "item" => ["Sword", "Shield", "Potion"],
        "price" => [100.0, 50.0, 10.0],
        "tax_rate" => [0.1, 0.1, 0.0]
    ]?;

    let result = calculate_total(df)?;
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

    test('1.3 Filtering & Sorting', async ({ page }) => {
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

        await page.goto('/path/polars/lesson/polars-03');

        // Quiz
        await page.locator('label', { hasText: 'A boolean expression' }).click();
        await page.locator('label', { hasText: '.gt()' }).click();
        await page.locator('label', { hasText: 'Yes, and it is encouraged for optimization' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding
        await page.click('button:has-text("Objectives")');
        const code = `use polars::prelude::*;

pub fn find_successful_high_launches(df: DataFrame) -> PolarsResult<DataFrame> {
    df.lazy()
        .filter(col("success").eq(lit(true)))
        .filter(col("altitude").gt(100))
        .sort(["altitude"], Default::default())
        .collect()
}

fn main() -> PolarsResult<()> {
    let df = df! [
        "spacecraft" => ["Vostok", "Apollo", "N1", "Falcon"],
        "success" => [true, true, false, true],
        "altitude" => [200, 380000, 30, 500]
    ]?;

    let result = find_successful_high_launches(df)?;
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

    test('1.4 Aggregation (GroupBy)', async ({ page }) => {
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

        await page.goto('/path/polars/lesson/polars-04');

        // Quiz
        await page.locator('label', { hasText: 'group_by()' }).click();
        await page.locator('label', { hasText: '.agg()' }).click();
        await page.locator('label', { hasText: 'Using .alias() on the expression' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding
        await page.click('button:has-text("Objectives")');
        const code = `use polars::prelude::*;

pub fn summarize_sales(df: DataFrame) -> PolarsResult<DataFrame> {
    df.lazy()
        .group_by(["region"])
        .agg([
            col("sales").sum().alias("total_sales"),
            col("sales").mean().alias("avg_sales")
        ])
        .sort(["total_sales"], SortOptions::default().with_descending(true))
        .collect()
}

fn main() -> PolarsResult<()> {
    let df = df! [
        "region" => ["North", "South", "North", "East", "South"],
        "sales" => [100.0, 200.0, 150.0, 50.0, 100.0]
    ]?;

    let result = summarize_sales(df)?;
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
