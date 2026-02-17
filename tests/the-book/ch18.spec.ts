import { test, expect } from '@playwright/test';

test.describe('Chapter 18: OOP Features of Rust', () => {
    test('18.2 Using Trait Objects for Different Types', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch18-02');

        // Quiz
        await page.locator('label', { hasText: /^\s*dyn\s*$/ }).click();
        await page.locator('label', { hasText: 'Dynamic' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `trait Area {
    fn calc_area(&self) -> f64;
}

struct Circle { radius: f64 }
impl Area for Circle {
    fn calc_area(&self) -> f64 { std::f64::consts::PI * self.radius * self.radius }
}

struct Square { side: f64 }
impl Area for Square {
    fn calc_area(&self) -> f64 { self.side * self.side }
}

fn main() {
    let shapes: Vec<Box<dyn Area>> = vec![
        Box::new(Circle { radius: 10.0 }),
        Box::new(Square { side: 5.0 }),
    ];

    for shape in shapes {
        println!("Area: {}", shape.calc_area());
    }
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
