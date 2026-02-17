import { test, expect } from '@playwright/test';

test.describe('Chapter 6: Enums and Pattern Matching', () => {
    test('6.1 Defining Enums', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch06-01');

        // Quiz
        await page.locator('label', { hasText: 'Yes, each variant can hold different types and amounts of data' }).click();
        await page.locator('label', { hasText: 'Option<T>' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `enum Shape {
    Circle(f64),
    Rectangle(f64, f64),
}

fn create_circle(radius: f64) -> Shape {
    Shape::Circle(radius)
}

fn main() {
    let circle = create_circle(10.0);
    println!("Created a circle!");
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

    test('6.2 The Match Control Flow', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch06-02');

        // Quiz
        await page.locator('label', { hasText: 'Compiler error' }).click();
        await page.locator('label', { hasText: '_' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}

fn main() {
    let five = Some(5);
    let six = plus_one(five);
    let none = plus_one(None);

    println!("5 + 1 = {:?}", six);
    println!("None + 1 = {:?}", none);
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

    test('6.3 Concise Control Flow with if let', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch06-03');

        // Quiz
        await page.locator('label', { hasText: 'When you match one pattern and ignore the rest' }).click();
        await page.locator('label', { hasText: /^\s*No\s*$/ }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn value_or_default(opt: Option<i32>, default: i32) -> i32 {
    if let Some(v) = opt {
        v
    } else {
        default
    }
}

fn main() {
    let some = Some(42);
    let none = None;

    println!("Some: {}", value_or_default(some, 0));
    println!("None: {}", value_or_default(none, 0));
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
