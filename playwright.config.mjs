import { defineConfig } from "@playwright/test";
import { tmpdir } from "node:os";
import { join } from "node:path";
export default defineConfig({
  testDir: ".",
  testMatch: "**/*.spec.mjs",
  outputDir: join(tmpdir(), "portfolio-guilherme-luiz-playwright"),
  timeout: 30000,
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:4173", channel: "chrome", headless: true, viewport: { width: 1440, height: 900 }, trace: "retain-on-failure" },
  webServer: { command: "npm run start", url: "http://127.0.0.1:4173", reuseExistingServer: true, timeout: 20000 },
});
