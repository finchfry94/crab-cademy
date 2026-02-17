import { test, expect } from '@playwright/test';

test.describe('Chapter 8: Common Collections', () => {
    test('8.1 Vectors', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch08-01');

        // Quiz
        await page.locator('label', { hasText: /^\s*vec!\s*$/ }).click();
        await page.locator('label', { hasText: 'The program panics (crashes)' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn sum_vectors(v1: &Vec<i32>, v2: &Vec<i32>) -> Vec<i32> {
    let len = v1.len().min(v2.len());
    let mut result = Vec::new();
    for i in 0..len {
        result.push(v1[i] + v2[i]);
    }
    result
}

fn main() {
    let v1 = vec![1, 2, 3];
    let v2 = vec![4, 5, 6];
    let sum = sum_vectors(&v1, &v2);
    println!("Sum: {:?}", sum);
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
        await page.locator('label', { hasText: 'String' }).click();
        await page.locator('label', { hasText: 'It is moved (ownership transferred)' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn add_suffix(mut s: String, suffix: &str) -> String {
    s.push_str(suffix);
    s
}

fn main() {
    let s = String::from("hello");
    let result = add_suffix(s, " world");
    println!("{}", result);
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
        await page.locator('label', { hasText: 'std::collections::HashMap' }).click();
        await page.locator('label', { hasText: 'Option<&V>' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `use std::collections::HashMap;

fn count_words(text: &str) -> HashMap<String, u32> {
    let mut map = HashMap::new();
    for word in text.split_whitespace() {
        let count = map.entry(word.to_string()).or_insert(0);
        *count += 1;
    }
    map
}

fn main() {
    let text = "hello world hello";
    let counts = count_words(text);
    println!("{:?}", counts);
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
