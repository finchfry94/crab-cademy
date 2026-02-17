import { test, expect } from '@playwright/test';

test.describe('Chapter 4: Understanding Ownership', () => {
    test('4.1 What is Ownership?', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch04-01');

        // Quiz
        await page.locator('label', { hasText: 'The value is moved (original becomes invalid)' }).click();
        await page.locator('label', { hasText: 'When the owner goes out of scope' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn make_greeting(name: String) -> String {
    format!("Welcome, {name}!")
}

fn first_word(s: &str) -> String {
    match s.find(' ') {
        Some(i) => s[..i].to_string(),
        None => s.to_string(),
    }
}

fn main() {
    let name = String::from("Rustacean");
    let greeting = make_greeting(name);
    println!("{greeting}");

    let sentence = "hello world";
    println!("First word: {}", first_word(sentence));
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

    test('4.2 References and Borrowing', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch04-02');

        // Quiz
        await page.locator('label', { hasText: 'Exactly one' }).click();
        await page.locator('label', { hasText: 'The function borrows the value (immutable reference)' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn count_chars(s: &str) -> usize {
    s.chars().count()
}

fn append_exclaim(s: &mut String) {
    s.push('!');
}

fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() >= b.len() { a } else { b }
}

fn main() {
    let s = String::from("hello");
    println!("chars: {}", count_chars(&s));

    let mut greeting = String::from("hi");
    append_exclaim(&mut greeting);
    println!("{greeting}");

    println!("longest: {}", longest("short", "longer string"));
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

    test('4.3 The Slice Type', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch04-03');

        // Quiz
        await page.locator('label', { hasText: /^\s*&str\s*$/ }).click();
        await page.locator('label', { hasText: 'No, it borrows the data' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn first_word(s: &str) -> &str {
    match s.find(' ') {
        Some(i) => &s[..i],
        None => s,
    }
}

fn trim_ends(arr: &[i32]) -> &[i32] {
    if arr.len() < 2 {
        &[]
    } else {
        &arr[1..arr.len() - 1]
    }
}

fn main() {
    let s = "hello world";
    println!("First word: '{}'", first_word(s));

    let a = [1, 2, 3, 4, 5];
    println!("Trimmed: {:?}", trim_ends(&a));
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
