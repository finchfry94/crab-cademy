import { test, expect } from '@playwright/test';

test.describe('Chapter 2: Common Programming Concepts', () => {
    test('2.1 Variables and Mutability', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch02-01');

        // Quiz
        await page.locator('label', { hasText: 'Immutable by default' }).click();
        await page.locator('label', { hasText: 'Declaring a new variable with the same name as an existing one' }).click();
        await page.locator('label', { hasText: 'Constants must be known at compile time' }).click();
        await page.locator('label', { hasText: 'A new variable is created, and the old one is no longer accessible by that name' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn double(x: i32) -> i32 {
    x * 2
}

fn shadow_example() -> i32 {
    let x = 5;
    let x = x + 10;
    let x = x * 2;
    x
}

fn main() {
    println!("double(5) = {}", double(5));
    println!("shadow result = {}", shadow_example());
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

    test('2.2 Data Types', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch02-02');

        // Quiz
        await page.locator('label', { hasText: 'i32' }).click();
        await page.locator('label', { hasText: '4 bytes (Unicode Scalar Value)' }).click();
        await page.locator('label', { hasText: 'The program panics at runtime' }).click();
        await page.locator('label', { hasText: 'Both of the above' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn celsius_to_fahrenheit(c: f64) -> f64 {
    c * 9.0 / 5.0 + 32.0
}

fn tuple_sum(t: (i32, i32, i32)) -> i32 {
    t.0 + t.1 + t.2
}

fn main() {
    println!("100°C = {}°F", celsius_to_fahrenheit(100.0));
    println!("Sum: {}", tuple_sum((1, 2, 3)));
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

    test('2.3 Functions', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch02-03');

        // Quiz
        await page.locator('label', { hasText: 'snake_case' }).click();
        await page.locator('label', { hasText: 'The unit type ()' }).click();
        await page.locator('label', { hasText: 'No — parameter types must always be explicitly annotated' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn multiply(a: i32, b: i32) -> i32 {
    a * b
}

fn is_even(n: i32) -> bool {
    n % 2 == 0
}

fn apply_twice(x: i32, amount: i32) -> i32 {
    x + amount + amount
}

fn main() {
    println!("3 × 4 = {}", multiply(3, 4));
    println!("4 is even? {}", is_even(4));
    println!("apply_twice(5, 3) = {}", apply_twice(5, 3));
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

    test('2.4 Comments', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch02-04');

        // Quiz
        await page.locator('label', { hasText: '///' }).click();
        await page.locator('label', { hasText: 'Markdown' }).click();
        await page.locator('label', { hasText: 'cargo doc' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `/// Returns the absolute value of a number.
///
/// # Examples
///
/// \`\`\`
/// let result = abs_val(-5);
/// assert_eq!(result, 5);
/// \`\`\`
fn abs_val(n: i32) -> i32 {
    if n < 0 { -n } else { n }
}

fn main() {
    println!("|−5| = {}", abs_val(-5));
    println!("|3| = {}", abs_val(3));
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

    test('2.5 Control Flow', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch02-05');

        // Quiz
        await page.locator('label', { hasText: "It's an expression that returns a value" }).click();
        await page.locator('label', { hasText: '1..5 excludes 5, 1..=5 includes 5' }).click();
        await page.locator('label', { hasText: 'Yes, via break with a value' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn fizzbuzz(n: i32) -> String {
    if n % 15 == 0 {
        String::from("FizzBuzz")
    } else if n % 3 == 0 {
        String::from("Fizz")
    } else if n % 5 == 0 {
        String::from("Buzz")
    } else {
        n.to_string()
    }
}

fn sum_range(start: i32, end: i32) -> i32 {
    let mut sum = 0;
    for i in start..=end {
        sum += i;
    }
    sum
}

fn main() {
    for i in 1..=20 {
        println!("{}: {}", i, fizzbuzz(i));
    }
    println!("Sum 1..=100 = {}", sum_range(1, 100));
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
