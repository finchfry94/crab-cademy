import { test, expect } from '@playwright/test';

test.describe('Chapter 5: Structs', () => {
    test('5.1 Defining Structs', async ({ page }) => {
        await page.goto('/path/the-book/lesson/ch05-01');

        // Quiz
        await page.locator('label', { hasText: 'No, mutability is a property of the entire instance' }).click();
        await page.locator('label', { hasText: 'Writing `field` instead of `field: field`' }).click();
        await page.locator('label', { hasText: 'No, they are distinct types' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `struct Point {
    x: i32,
    y: i32,
}

fn new_point(x: i32, y: i32) -> Point {
    Point { x, y }
}

fn inspect_point(p: &Point) -> i32 {
    println!("x: {}, y: {}", p.x, p.y);
    p.x + p.y
}

fn main() {
    let p = new_point(10, 20);
    let sum = inspect_point(&p);
    println!("Sum of coordinates: {}", sum);
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
        await page.locator('label', { hasText: 'self (or variant)' }).click();
        await page.locator('label', { hasText: '`area` is a method (takes self)' }).click();
        await page.locator('label', { hasText: 'It takes ownership (consumes) the instance' }).click();
        await page.click('button:has-text("Check Answers")');

        // Coding Challenge
        await page.click('button:has-text("Objectives")');

        const rustCode = `struct BankAccount {
    balance: i32,
}

impl BankAccount {
    fn new(balance: i32) -> BankAccount {
        BankAccount { balance }
    }

    fn get_balance(&self) -> i32 {
        self.balance
    }

    fn deposit(&mut self, amount: i32) {
        self.balance += amount;
    }

    fn withdraw(&mut self, amount: i32) -> bool {
        if self.balance >= amount {
            self.balance -= amount;
            true
        } else {
            false
        }
    }
}

fn main() {
    let mut acc = BankAccount::new(100);
    acc.deposit(50);
    acc.withdraw(20);
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
