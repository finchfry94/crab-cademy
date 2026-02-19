import { test, expect } from '@playwright/test';
import { mockPlayground } from '../utils/mockPlayground';

test.describe('Chapter 10: Generic Types, Traits, and Lifetimes', () => {
    test.beforeEach(async ({ page }) => {
        await mockPlayground(page);
    });

    test('10.1 Generic Data Types', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch10-01');

        // Quiz
        await page.locator('label', { hasText: "It declares a generic type parameter placeholder" }).click();
        await page.locator('label', { hasText: "No, because 'x' and 'y' must be the EXACT same type" }).click();
        await page.locator('label', { hasText: "struct Point<T, U> { x: T, y: U }" }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `struct Pair<T> {
    x: T,
    y: T,
}

impl<T> Pair<T> {
    fn new(x: T, y: T) -> Self {
        Pair { x, y }
    }
}

fn main() {
    let int_pair = Pair::new(5, 10);
    let float_pair = Pair::new(1.5, 2.5);

    println!("Ints: {}, {}", int_pair.x, int_pair.y);
    println!("Floats: {}, {}", float_pair.x, float_pair.y);
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
        await expect(page.locator('button:has-text("Objectives")')).toContainText('ALL PASS');
    });

    test('10.2 Traits: Defining Shared Behavior', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch10-02');

        // Quiz
        await page.locator('label', { hasText: /^trait$/ }).click();
        await page.locator('label', { hasText: 'No, I can use the default behavior' }).click();
        await page.locator('label', { hasText: 'You cannot implement external traits on external types' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `trait Printable {
    fn format(&self) -> String;
}

struct Person {
    name: String,
    age: u32,
}

impl Printable for Person {
    fn format(&self) -> String {
        format!("Name: {}, Age: {}", self.name, self.age)
    }
}

fn main() {
    let p = Person {
        name: String::from("Alice"),
        age: 30,
    };
    println!("{}", p.format());
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
        await expect(page.locator('button:has-text("Objectives")')).toContainText('ALL PASS');
    });

    test('10.3 Validating References with Lifetimes', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch10-03');

        // Quiz
        await page.locator('label', { hasText: "' (single quote/tick)" }).click();
        await page.locator('label', { hasText: 'No, they only verify relationships for the compiler' }).click();
        await page.locator('label', { hasText: 'The reference is valid for the entire program duration' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn first_part<'a>(s: &'a str, delimiter: &str) -> &'a str {
    s.split(delimiter).next().unwrap()
}

fn main() {
    let s = String::from("hello_world");
    let part = first_part(&s, "_");
    println!("Part: {}", part);
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
        await expect(page.locator('button:has-text("Objectives")')).toContainText('ALL PASS');
    });
});
