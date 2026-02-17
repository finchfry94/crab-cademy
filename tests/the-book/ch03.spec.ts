import { test, expect } from '@playwright/test';

test.describe('Chapter 3: Common Programming Concepts', () => {
    test('3.1 Variables and Mutability', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch03-01');

        // Quiz
        await page.locator('label', { hasText: "Immutable by default" }).click();
        await page.locator('label', { hasText: "Declaring a new variable with the same name" }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn double_mut(x: i32) -> i32 {
    let mut val = x;
    val *= 2;
    val
}

fn shadow_add(x: i32, y: i32) -> i32 {
    let res = x;
    let res = res + y;
    res
}

fn main() {
    println!("double_mut(5) = {}", double_mut(5));
    println!("shadow_add(3, 7) = {}", shadow_add(3, 7));
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

    test('3.2 Data Types', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch03-02');

        // Quiz
        await page.locator('label', { hasText: "i32" }).click();
        await page.locator('label', { hasText: "t.1" }).click();
        await page.locator('label', { hasText: "An array [0, 0, 0, 0, 0]" }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn swap_pair(pair: (i32, i32)) -> (i32, i32) {
    (pair.1, pair.0)
}

fn array_sum(arr: &[i32]) -> i32 {
    arr.iter().sum()
}

fn classify_number(n: i32) -> &'static str {
    if n > 0 { "positive" }
    else if n < 0 { "negative" }
    else { "zero" }
}

fn main() {
    println!("swap (1, 2) = {:?}", swap_pair((1, 2)));
    println!("sum [1..5] = {}", array_sum(&[1, 2, 3, 4, 5]));
    println!("42 is {}", classify_number(42));
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

    test('3.3 Functions', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch03-03');

        // Quiz
        await page.locator('label', { hasText: "It becomes a statement and returns () instead" }).click();
        await page.locator('label', { hasText: "snake_case" }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn square(n: i32) -> i32 {
    n * n
}

fn is_even(n: i32) -> bool {
    n % 2 == 0
}

fn celsius_to_fahrenheit(c: f64) -> f64 {
    c * 9.0 / 5.0 + 32.0
}

fn main() {
    println!("5 squared = {}", square(5));
    println!("4 is even: {}", is_even(4));
    println!("100°C = {}°F", celsius_to_fahrenheit(100.0));
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

    test('3.5 Control Flow', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch03-05');

        // Quiz
        await page.locator('label', { hasText: "Yes, if is an expression and can return a value" }).click();
        await page.locator('label', { hasText: "for" }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn fizzbuzz(n: u32) -> String {
    if n % 15 == 0 { "FizzBuzz".to_string() }
    else if n % 3 == 0 { "Fizz".to_string() }
    else if n % 5 == 0 { "Buzz".to_string() }
    else { n.to_string() }
}

fn sum_range(start: i32, end: i32) -> i32 {
    (start..=end).sum()
}

fn main() {
    for i in 1..=20 {
        println!("{}: {}", i, fizzbuzz(i));
    }
    println!("sum 1..=100 = {}", sum_range(1, 100));
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
