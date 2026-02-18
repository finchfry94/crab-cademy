import { defineConfig, devices } from '@playwright/test';

const isProduction = !!process.env.TEST_BUILD;

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: isProduction ? 'http://localhost:4173' : 'http://localhost:5173',
        trace: 'on-first-retry',
    },
    webServer: {
        command: isProduction ? 'npm run preview' : 'npm run dev',
        url: isProduction ? 'http://localhost:4173' : 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],
});
