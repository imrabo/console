import { defineConfig, devices } from "@playwright/test";

const baseURL = import.meta.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
    testDir: "./tests/e2e",
    fullyParallel: true,
    retries: import.meta.env.CI ? 2 : 0,
    workers: import.meta.env.CI ? 1 : undefined,
    timeout: 45_000,
    reporter: [["html", { open: "never" }], ["list"]],
    use: {
        baseURL,
        trace: "retain-on-failure",
    },
    webServer: import.meta.env.PLAYWRIGHT_BASE_URL
        ? undefined
        : {
            command: "pnpm dev",
            url: baseURL,
            reuseExistingServer: true,
            timeout: 180_000,
        },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
});
