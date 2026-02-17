import { test, expect } from '@playwright/test';

test.describe('Chapter 7: Modules', () => {
    test('7.1 Packages and Crates', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch07-01');

        // Quiz
        await page.locator('label').filter({ hasText: 'Cargo.toml' }).click();
        await page.locator('label').filter({ hasText: 'Binary crate' }).click();
        await page.locator('label').filter({ hasText: 'Zero or one' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn is_binary(has_main: bool) -> bool {
    has_main
}

fn main() {
    is_binary(true);
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

    test('7.2 Defining Modules', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch07-02');

        // Quiz
        // "Private" vs "Package-private"
        await page.locator('label').filter({ hasText: /^Private$/ }).click();
        // "No" vs "No, ..."
        await page.locator('label').filter({ hasText: /^No$/ }).first().click();
        // "Yes" vs "Yes, ..."
        await page.locator('label').filter({ hasText: /^Yes$/ }).first().click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `mod kitchen {
    pub struct Sandwich {
        pub name: String,
        pub is_tasty: bool,
    }

    pub fn prepare_order() -> Sandwich {
        Sandwich {
            name: String::from("BLT"),
            is_tasty: true,
        }
    }
}

use kitchen::prepare_order;

fn make_sandwich() -> kitchen::Sandwich {
    prepare_order()
}

fn main() {
    make_sandwich();
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

    test('7.3 Paths and use', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch07-03');

        // Quiz
        // "use" vs "Don't use use"
        await page.locator('label').filter({ hasText: /^use$/ }).click();
        await page.locator('label').filter({ hasText: 'super' }).click();
        await page.locator('label').filter({ hasText: 'Bring the parent module' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `mod calculator {
    pub fn add(a: i32, b: i32) -> i32 {
        a + b
    }
}

use calculator::add;

fn compute(a: i32, b: i32) -> i32 {
    add(a, b)
}

fn main() {
    compute(1, 2);
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
