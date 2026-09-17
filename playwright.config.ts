import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
const LOCAL_BASE_URL = `http://127.0.0.1:${PORT}`;
const baseURL = process.env.PLAYWRIGHT_BASE_URL || LOCAL_BASE_URL;

export default defineConfig({
  testDir: "./tests/e2e",
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { outputFolder: "playwright-report" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Preview URL(PLAYWRIGHT_BASE_URL)이 지정되면 이미 배포된 환경을 대상으로 하므로
  // 로컬 dev 서버를 띄우지 않는다.
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        url: LOCAL_BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
