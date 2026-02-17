import { test, expect } from '@playwright/test';

test.describe('Chapter 5: Using Structs', () => {
    test('5.1 Defining and Using Structs', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch05-01');

        // Quiz
        await page.locator('label', { hasText: 'impl' }).click();
        await page.locator('label', { hasText: 'The method borrows the struct immutably' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `struct Rectangle {
    width: f64,
    height: f64,
}

impl Rectangle {
    fn new(width: f64, height: f64) -> Rectangle {
        Rectangle { width, height }
    }

    fn area(&self) -> f64 {
        self.width * self.height
    }

    fn perimeter(&self) -> f64 {
        2.0 * (self.width + self.height)
    }

    fn is_square(&self) -> bool {
        self.width == self.height
    }

    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}

fn main() {
    let r = Rectangle::new(10.0, 5.0);
    println!("Area: {}", r.area());
    println!("Perimeter: {}", r.perimeter());
    println!("Square? {}", r.is_square());
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

    test('5.3 Method Syntax', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch05-03');

        // Quiz
        await page.locator('label', { hasText: '&mut self' }).click();
        await page.locator('label', { hasText: 'It is moved (ownership is transferred)' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `struct Counter {
    count: u32,
}

impl Counter {
    fn new(start: u32) -> Counter {
        Counter { count: start }
    }

    fn tick(&mut self) {
        self.count += 1;
    }

    fn get_count(&self) -> u32 {
        self.count
    }

    fn combine(self, other: Counter) -> Counter {
        Counter { count: self.count + other.count }
    }
}

fn main() {
    let mut c = Counter::new(0);
    c.tick();
    println!("Count after tick: {}", c.get_count());

    let c2 = Counter::new(10);
    let c3 = c.combine(c2);
    println!("Combined count: {}", c3.get_count());
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
