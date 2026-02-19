import { test, expect } from '../utils/persistentTest';

test.describe.serial('Chapter 16: Fearless Concurrency (Persistent)', () => {
    test('16.1 Using Threads to Run Code Simultaneously', async ({ persistentPage }) => {
        const page = persistentPage;
        await page.goto('/path/the-book/lesson/ch16-01');

        // Quiz
        await page.locator('label', { hasText: 'All spawned threads are shut down immediately' }).click();
        await page.locator('label', { hasText: 'Use the \'move\' keyword' }).click();
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

    test('16.2 Message Passing with Channels', async ({ persistentPage }) => {
        const page = persistentPage;
        await page.goto('/path/the-book/lesson/ch16-02');

        // Quiz
        await page.locator('label', { hasText: 'Multiple Producer, Single Consumer' }).click();
        await page.locator('label', { hasText: 'Yes, ownership moves to the receiver' }).click();
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
