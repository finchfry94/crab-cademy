import { test, expect } from '@playwright/test';

test.describe('Chapter 6: Enums and Pattern Matching', () => {
    test('6.1 Defining Enums', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch06-01');

        // Quiz
        await page.locator('label').filter({ hasText: 'Variants can hold data of different types' }).click();
        await page.locator('label').filter({ hasText: "To force you to explicitly handle the 'missing value' case" }).click();
        await page.locator('label').filter({ hasText: 'No, they are different types' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `enum WebEvent {
    PageLoad,
    KeyPress(char),
    Click { x: i64, y: i64 },
}

fn create_keypress(c: char) -> WebEvent {
    WebEvent::KeyPress(c)
}

fn create_click(x: i64, y: i64) -> WebEvent {
    WebEvent::Click { x, y }
}

fn main() {
    create_click(10, 20);
}`;

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            if (models.length > 0) {
                models[0].setValue(code);
            }
        }, rustCode);

        await page.click('button:has-text("Test")');
        // Increased timeout to 30s
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 30000 });
        await expect(page.locator('button:has-text("Objectives")')).toContainText('ALL PASS');
    });

    test('6.2 The Match Control Flow', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch06-02');

        // Quiz
        await page.locator('label').filter({ hasText: 'The compiler gives an error' }).click();
        await page.locator('label').filter({ hasText: 'Matches any value (catch-all)' }).click();
        await page.locator('label').filter({ hasText: 'Using pattern matching syntax like Variant(val)' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `enum WebEvent {
    PageLoad,
    KeyPress(char),
    Click { x: i64, y: i64 },
}

fn inspect_event(event: WebEvent) -> String {
    match event {
        WebEvent::PageLoad => String::from("page loaded"),
        WebEvent::KeyPress(c) => format!("keypress: {}", c),
        WebEvent::Click { x, y } => format!("clicked: {}, {}", x, y),
    }
}

fn main() {
    inspect_event(WebEvent::PageLoad);
}`;

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            if (models.length > 0) {
                models[0].setValue(code);
            }
        }, rustCode);

        await page.click('button:has-text("Test")');
        // Increased timeout to 30s
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 30000 });
        await expect(page.locator('button:has-text("Objectives")')).toContainText('ALL PASS');
    });

    test('6.3 Concise Control Flow with if let', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch06-03');

        // Quiz
        await page.locator('label').filter({ hasText: 'When you want to match one pattern and ignore the rest' }).click();
        await page.locator('label').filter({ hasText: /^Yes$/ }).click();
        await page.locator('label').filter({ hasText: 'No, it ignores unmatched patterns by design' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn get_or_default(opt: Option<i32>, default: i32) -> i32 {
    if let Some(x) = opt {
        x
    } else {
        default
    }
}

fn main() {
    get_or_default(Some(10), 0);
}`;

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            if (models.length > 0) {
                models[0].setValue(code);
            }
        }, rustCode);

        await page.click('button:has-text("Test")');
        // Increased timeout to 30s
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 30000 });
        await expect(page.locator('button:has-text("Objectives")')).toContainText('ALL PASS');
    });
});
