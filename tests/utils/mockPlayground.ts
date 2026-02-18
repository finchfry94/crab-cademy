import { Page } from '@playwright/test';

export const mockPlayground = async (page: Page) => {
    await page.route('https://play.rust-lang.org/execute', async (route) => {
        const json = {
            success: true,
            stderr: "",
            stdout: "test mock_test ... ok\ntest result: ok. 1 passed; 0 failed\n",
        };
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(json),
        });
    });
};
