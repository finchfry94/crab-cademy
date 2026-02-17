import { test, expect } from '@playwright/test';

test.describe('Chapter 4: Understanding Ownership', () => {
    test('4.1 What is Ownership?', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch04-01');

        // Quiz
        await page.locator('label', { hasText: 'Exactly one' }).click();
        await page.locator('label', { hasText: 'The value is dropped (memory is freed)' }).click();
        await page.locator('label', { hasText: 's1 is moved to s2 (s1 is no longer valid)' }).click();
        await page.locator('label', { hasText: 'Simple stack types like i32, bool, f64' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn take_and_return(s: String) -> String {
    println!("{}", s);
    s
}

fn make_greeting(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn clone_and_modify(s: &str) -> String {
    let mut owned = String::from(s);
    owned.push_str(" (modified)");
    owned
}

fn main() {
    let s = String::from("hello");
    let s = take_and_return(s);
    println!("{}", s);
    let greeting = make_greeting("World");
    println!("{}", greeting);
    println!("{}", clone_and_modify("original"));
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
        await page.locator('label', { hasText: 'A reference (borrow) to the value' }).click();
        await page.locator('label', { hasText: 'No — the compiler prevents this' }).click();
        await page.locator('label', { hasText: 'Data races' }).click();
        await page.locator('label', { hasText: "Nothing — the reference doesn't own the data" }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn string_length(s: &String) -> usize {
    s.len()
}

fn append_exclamation(s: &mut String) {
    s.push_str("!");
}

fn first_word_length(s: &str) -> usize {
    match s.find(' ') {
        Some(i) => i,
        None => s.len(),
    }
}

fn main() {
    let mut s = String::from("hello world");
    println!("Length: {}", string_length(&s));
    append_exclamation(&mut s);
    println!("After append: {}", s);
    println!("First word length: {}", first_word_length("hello world"));
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
        await page.locator('label', { hasText: "No, it's just a reference with a length" }).click();
        await page.locator('label', { hasText: '&str can accept both &String and &str' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn first_word(s: &str) -> &str {
    match s.find(' ') {
        Some(i) => &s[..i],
        None => s,
    }
}

fn count_words(s: &str) -> usize {
    if s.is_empty() {
        0
    } else {
        s.split_whitespace().count()
    }
}

fn slice_sum(arr: &[i32]) -> i32 {
    let mut sum = 0;
    for &n in arr {
        sum += n;
    }
    sum
}

fn main() {
    let s = "hello world foo";
    println!("First word: '{}'", first_word(s));
    println!("Word count: {}", count_words(s));
    println!("Sum: {}", slice_sum(&[1, 2, 3, 4, 5]));
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
