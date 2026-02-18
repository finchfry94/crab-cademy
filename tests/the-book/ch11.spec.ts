import { test, expect } from '@playwright/test';
import { mockPlayground } from '../utils/mockPlayground';

test.describe('Chapter 11: Writing Automated Tests', () => {
    test.beforeEach(async ({ page }) => {
        await mockPlayground(page);
    });

    test('11.1 How to Write Tests', async ({ page }) => {
        test.setTimeout(60000);
        await page.goto('/path/the-book/lesson/ch11-01');

        // Quiz
        await page.locator('label', { hasText: '#[test]' }).click();
        await page.locator('label', { hasText: 'assert_eq!' }).click();
        await page.locator('label', { hasText: 'In the same file as the code, inside a `tests` module' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn add_three(n: i32) -> i32 {
    n + 3
}

fn main() {}`;

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

    test('11.2 Controlling How Tests Are Run', async ({ page }) => {
        // Mock Tauri for desktop environment
        await page.addInitScript(() => {
            // @ts-ignore
            window.__TAURI__ = {
                // @ts-ignore
                invoke: async (cmd, args) => {
                    console.log(`Invoke: ${cmd}`, args);
                    return { status: "ok", stdout: "I am visible with --show-output\n" };
                }
            };
        });

        await page.goto('/path/the-book/lesson/ch11-02');

        // Quiz
        await page.locator('label').filter({ hasText: 'cargo test -- --test-threads=1' }).click();
        await page.locator('label').filter({ hasText: /^No$/ }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `#[cfg(test)]
mod tests {
    #[test]
    fn test_print() {
        println!("I am visible with --show-output");
        assert!(true);
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
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 60000 });
    });

    test('11.3 Test Organization', async ({ page }) => {
        // Mock Tauri for desktop environment
        await page.addInitScript(() => {
            // @ts-ignore
            window.__TAURI__ = {
                // @ts-ignore
                invoke: async (cmd, args) => {
                    return { status: "ok", stdout: "test tests::test_internal ... ok" };
                }
            };
        });

        await page.goto('/path/the-book/lesson/ch11-03');

        // Quiz
        await page.locator('label', { hasText: 'In a top-level /tests folder' }).click();
        await page.locator('label', { hasText: 'Yes' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `fn internal_compute(n: i32) -> i32 {
    n * 2
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_internal() {
        assert_eq!(internal_compute(5), 10);
    }
}

fn main() {}`;

        await page.evaluate((code) => {
            // @ts-ignore
            const models = monaco.editor.getModels();
            if (models.length > 0) {
                models[0].setValue(code);
            }
        }, rustCode);

        await page.click('button:has-text("Test")');
        await expect(page.locator('text=🎉 All tests passed! Lesson complete!')).toBeVisible({ timeout: 60000 });
    });
});
