import { Page } from '@playwright/test';

declare global {
    interface Window {
        __TAURI_INTERNALS__: any;
        __TAURI__: any;
    }
}

/**
 * Mocks the Tauri environment in the browser context.
 * This sets up the necessary global variables to make `isTauri()` return true
 * and mocks the `invoke` function to simulate backend responses.
 */
export const mockTauri = async (page: Page) => {
    await page.addInitScript(() => {
        window.__TAURI_INTERNALS__ = {};
        window.__TAURI__ = {
            core: {
                invoke: async (cmd: string, args: any) => {
                    console.log(`[MockTauri] invoke: ${cmd}`, args);
                    if (cmd === 'run_code') {
                        // Simulate a successful test run with multiple potential test names
                        // We include names for all desktop lessons we are testing
                        return `
running 5 tests
test test_args_collection ... ok
test test_conceptual ... ok
test one_result ... ok
test multiple_results ... ok
test result: ok. 5 passed; 0 failed;
`;
                    }
                    return "";
                }
            }
        };
    });
};
