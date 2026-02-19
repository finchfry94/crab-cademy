import { test, expect } from '@playwright/test';

test.describe('Chapter 15: Smart Pointers', () => {
    test('15.1 Using Box<T> to Point to Data on the Heap', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch15-01');

        // Quiz
        await page.locator('label', { hasText: 'Heap' }).click();
        await page.locator('label', { hasText: 'To give them a known, fixed size (the size of a pointer)' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn double_box(b: Box<i32>) -> i32 {
    *b * 2
}

fn main() {
    let b = Box::new(10);
    println!("{}", double_box(b));
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
        await page.locator('label', { hasText: 'the data is cleaned up (dropped)' }).click();
        await page.locator('label', { hasText: 'No, use Arc<T> instead' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `use std::rc::Rc;

fn count_references(s: &str) -> usize {
    let a = Rc::new(String::from(s));
    let _b = Rc::clone(&a);
    let _c = Rc::clone(&a);
    Rc::strong_count(&a)
}

fn main() {
    println!("{}", count_references("hello"));
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
        await page.locator('label', { hasText: /^Runtime$/ }).click();
        await page.locator('label', { hasText: 'Runtime Panic' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `use std::cell::RefCell;

fn add_ten(r: &RefCell<i32>) {
    *r.borrow_mut() += 10;
}

fn main() {
    let r = RefCell::new(5);
    add_ten(&r);
    println!("{:?}", r);
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
