import { test, expect } from '@playwright/test';

test.describe('Chapter 16: Fearless Concurrency', () => {
    test('16.1 Using Threads to Run Code Simultaneously', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch16-01');

        // Quiz
        await page.locator('label', { hasText: 'All spawned threads are shut down' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `use std::thread;

fn main() {
    let handle = thread::spawn(|| {
        println!("Spawned thread!");
    });

    handle.join().unwrap();
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
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 15000 });
    });

    test('16.2 Message Passing with Channels', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch16-02');

        // Quiz
        await page.locator('label', { hasText: 'Multiple Producer, Single Consumer' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        tx.send(String::from("hi")).unwrap();
    });

    let received = rx.recv().unwrap();
    println!("Got: {}", received);
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
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 15000 });
    });
});
