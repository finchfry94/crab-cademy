import { test, expect } from '@playwright/test';

test.describe('Chapter 15: Smart Pointers', () => {
    test('15.1 Using Box<T> to Point to Data on the Heap', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch15-01');

        // Quiz
        await page.locator('label', { hasText: 'Heap' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn main() {
    let b = Box::new([0; 1000]);
    println!("Length: {}", b.len());
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

    test('15.4 Rc<T>, the Reference Counted Smart Pointer', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch15-04');

        // Quiz
        await page.locator('label', { hasText: 'Reference Counting' }).click();
        await page.locator('label', { hasText: 'No, only in single-threaded scenarios' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `use std::rc::Rc;

fn main() {
    let a = Rc::new(String::from("hello"));
    let b = Rc::clone(&a);

    println!("Count: {}", Rc::strong_count(&a));
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

    test('15.5 RefCell<T> and Interior Mutability', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch15-05');

        // Quiz
        await page.locator('label', { hasText: 'Runtime' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `use std::cell::RefCell;

fn main() {
    let x = RefCell::new(10);

    {
        let mut y = x.borrow_mut();
        *y += 5;
    }

    println!("Value: {}", x.borrow());
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
