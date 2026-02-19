import { test, expect } from '@playwright/test';
import { mockPlayground } from '../utils/mockPlayground';

test.describe('Chapter 12: I/O Project (Desktop)', () => {
    test.beforeEach(async ({ page }) => {
        // Use mockPlayground as fallback for desktop lessons too (forcing logic via missing Tauri env)
        await mockPlayground(page);

        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
        page.on('requestfailed', request => {
            console.log(`REQUEST FAILED: ${request.url()} - ${request.failure()?.errorText || 'unknown'}`);
        });
        page.on('response', response => {
            if (response.status() >= 400) {
                console.log(`RESPONSE ERROR: ${response.url()} - ${response.status()}`);
            }
        });
    });

    test('12.1 Accepting Command Line Arguments', async ({ page }) => {
        test.setTimeout(60000);
        await page.goto('/path/the-book/lesson/ch12-01');

        // Quiz
        await page.locator('label', { hasText: 'std::env::args()' }).click();
        await page.locator('label', { hasText: 'The program name' }).click();
        await page.locator('label', { hasText: 'Turns an iterator into a collection (like a Vec)' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        // This is a "conceptual" test in the lesson data, meaning checks are done inside the Rust test logic.
        // Our mockTauri always returns "ok", so we just need to provide some code and run it.
        const rustCode = `use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() < 3 {
        return;
    }

    // Extract query and file_path
    let query = &args[1];
    let file_path = &args[2];

    println!("Searching for {}", query);
    println!("In file {}", file_path);
}`;

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            if (models.length > 0) {
                models[0].setValue(code);
            }
        }, rustCode);

        await page.click('button:has-text("Test")');
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 60000 });
    });

    test('12.2 Reading a File', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch12-02');

        // Quiz
        await page.locator('label', { hasText: 'std::fs' }).click();
        await page.locator('label', { hasText: 'It returns an Error' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `use std::fs;

fn main() {
    let file_path = "poem.txt";
    // Read the file and print contents
    let contents = fs::read_to_string(file_path)
        .expect("Should have been able to read the file");
    
    println!("With text:\n{}", contents);
}`;

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            if (models.length > 0) {
                models[0].setValue(code);
            }
        }, rustCode);

        await page.click('button:has-text("Test")');
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 60000 });
    });
    test('12.4 Developing with TDD', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch12-04');

        // Quiz
        await page.locator('label', { hasText: "To tell the compiler the returned slices live as long as 'contents'" }).click();
        await page.locator('label', { hasText: 'Write just enough code to pass the test' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `pub fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    let mut results = Vec::new();

    for line in contents.lines() {
        if line.contains(query) {
            results.push(line);
        }
    }

    results
}

fn main() {
    let query = "fast";
    let contents = "Rust is fast\\nPython is slow";
    println!("{:?}", search(query, contents));
}`;

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            if (models.length > 0) {
                models[0].setValue(code);
            }
        }, rustCode);

        await page.click('button:has-text("Test")');
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 15000 });
        await expect(page.locator('button:has-text("Objectives")')).toContainText('ALL PASS');
    });
});
