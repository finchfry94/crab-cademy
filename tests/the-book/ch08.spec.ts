import { test, expect } from '@playwright/test';

test.describe('Chapter 8: Common Collections', () => {
    test('8.1 Vectors', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch08-01');

        // Quiz
        await page.locator('label', { hasText: 'Heap' }).click();
        await page.locator('label', { hasText: '.get() is safer' }).click();
        await page.locator('label', { hasText: 'No, vectors are homogeneous' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn sum_vectors(v1: &Vec<i32>, v2: &Vec<i32>) -> Vec<i32> {
    let mut sum = Vec::new();
    let len = std::cmp::min(v1.len(), v2.len());
    for i in 0..len {
        sum.push(v1[i] + v2[i]);
    }
    sum
}

fn main() {
    let v1 = vec![1, 2, 3];
    let v2 = vec![4, 5, 6];
    sum_vectors(&v1, &v2);
}`;

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            if (models.length > 0) {
                models[0].setValue(code);
            }
        }, rustCode);

        await page.click('button:has-text("Test")');
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('button:has-text("Objectives")')).toContainText('ALL PASS');
    });

    test('8.2 Strings', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch08-02');

        // Quiz
        await page.locator('label', { hasText: 'No, never' }).click();
        await page.locator('label', { hasText: 'Vec<u8>' }).click();
        await page.locator('label', { hasText: 'String' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn make_excited(s: &str) -> String {
    let mut owned = s.to_string();
    owned.push_str("!!");
    owned
}

fn main() {
    make_excited("hello");
}`;

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            if (models.length > 0) {
                models[0].setValue(code);
            }
        }, rustCode);

        await page.click('button:has-text("Test")');
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('button:has-text("Objectives")')).toContainText('ALL PASS');
    });

    test('8.3 Hash Maps', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch08-03');

        // Quiz
        await page.locator('label', { hasText: 'No, you must import it' }).click();
        await page.locator('label', { hasText: 'It overwrites the old value' }).click();
        await page.locator('label', { hasText: 'Inserts v only if key is MISSING' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `use std::collections::HashMap;

fn word_frequencies(text: &str) -> HashMap<String, u32> {
    let mut map = HashMap::new();
    for word in text.to_lowercase().split_whitespace() {
        let count = map.entry(word.to_string()).or_insert(0);
        *count += 1;
    }
    map
}

fn main() {
    word_frequencies("Hello hello");
}`;

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            if (models.length > 0) {
                models[0].setValue(code);
            }
        }, rustCode);

        await page.click('button:has-text("Test")');
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('button:has-text("Objectives")')).toContainText('ALL PASS');
    });
});
