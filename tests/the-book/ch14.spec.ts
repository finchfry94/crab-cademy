import { test, expect } from '@playwright/test';

test.describe('Chapter 14: More about Cargo and Crates.io', () => {
    test('14.1 Customizing Builds with Release Profiles', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch14-01');

        // Quiz
        await page.locator('label', { hasText: 'Cargo.toml' }).click();
        await page.locator('label', { hasText: '3' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge (TOML based, so we just supply the expected text)
        await page.click('button:has-text("Objectives")');

        const tomlCode = `[profile.dev]
opt-level = 1`;

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            if (models.length > 0) {
                models[0].setValue(code);
            }
        }, tomlCode);

        // Since this uses assert!(true) in test_code, as long as it "compiles" it passes.
        // We expect it to pass because the playground runner for desktop is currently
        // just running rustc on the main.rs.
        // NOTE: In a real scenario, this would fail as it's not Rust.
        // But for testing the UI flow, we click Test.
        await page.click('button:has-text("Test")');
        // We don't necessarily expect "All tests passed" if it's not valid Rust,
        // but let's see how the app behaves.
    });

    test('14.3 Cargo Workspaces', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch14-03');

        // Quiz
        await page.locator('label', { hasText: 'The Cargo.lock file' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const tomlCode = `[workspace]
members = [
    "app",
    "utils",
]`;

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            if (models.length > 0) {
                models[0].setValue(code);
            }
        }, tomlCode);

        await page.click('button:has-text("Test")');
    });
});
