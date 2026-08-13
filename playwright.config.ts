import { defineConfig, devices } from "@playwright/test";

const PORT = 3311;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  // One browser. Tests that care about a breakpoint set their own viewport,
  // which keeps the assertion and the width it depends on in the same place.
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 900 },
      },
    },
  ],
  webServer: {
    command: "npm run dev",
    // Set via `env` rather than a `PORT=` prefix, which PowerShell/cmd reject.
    env: { PORT: String(PORT) },
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
