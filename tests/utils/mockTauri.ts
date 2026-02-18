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
        const mockInvoke = async (cmd: string, args: any) => {
            console.log(`[MockTauri] invoke: ${cmd}`, args);
            if (cmd === 'run_code') {
                // Return a combined output that matches various lesson test names
                return `
running 10 tests
test test_args_collection ... ok
test test_conceptual ... ok
test one_result ... ok
test multiple_results ... ok
test test_print ... ok
test tests::test_internal ... ok
test test_logic ... ok
test test_add_three ... ok
test test_calculate_total ... ok
test test_window ... ok
test result: ok. 10 passed; 0 failed;
`;
            }
            return "";
        };

        window.__TAURI_INTERNALS__ = {
            invoke: mockInvoke
        };
        window.__TAURI__ = {
            core: {
                invoke: mockInvoke
            }
        };
    });
};
