import { test as base, Page, BrowserContext, Browser } from '@playwright/test';
import { mockTauri } from './mockTauri';

/**
 * Custom fixture that provides a persistent browser context and page.
 * All tests using this fixture in the SAME WORKER will share the SAME PAGE.
 */
export const test = base.extend<{}, {
    persistentContext: BrowserContext;
    persistentPage: Page;
}>({
    // Worker-scoped fixtures
    persistentContext: [async ({ browser }, use) => {
        const context = await browser.newContext();
        await use(context);
        await context.close();
    }, { scope: 'worker' }],

    persistentPage: [async ({ persistentContext }, use) => {
        const page = await persistentContext.newPage();
        // Auto-mock Tauri for all tests using this page
        await mockTauri(page);
        await use(page);
        await page.close();
    }, { scope: 'worker' }]
});

export { expect } from '@playwright/test';
