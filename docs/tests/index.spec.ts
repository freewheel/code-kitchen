import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/");
  // Wait for the assets (esbuild, editor) to load
  await page.waitForLoadState("networkidle");
});

test("preview is rendered", async ({ page }) => {
  const movingDot = page.locator(
    `.code-kitchen-preview-panel >> [data-testid="moving-dot-inner"]`
  );
  await expect(movingDot).toHaveCount(1);
});

test("code panel is rendered", async ({ page }) => {
  await expect(page.locator('text=import React from "react"')).toHaveCount(1);
});

test("update the color of moving dot", async ({ page }) => {
  const movingDot = page.locator(
    `.code-kitchen-preview-panel >> [data-testid="moving-dot-inner"]`
  );

  expect(await movingDot.evaluate((el) => el.style.backgroundColor)).toBe(
    "white"
  );

  // Focus the code editor
  await page.locator('text=import React from "react"').click();

  // Press f with modifiers
  await page.locator('text=import React from "react"').press("Control+f");

  // Fill [aria-label="Find"]
  await page.locator('[aria-label="Find"]').fill("white");
  // Click [aria-label="Toggle\ Replace"]
  await page.locator('[aria-label="Toggle Replace"]').click();

  // Click [aria-label="Replace"]
  await page.locator('[aria-label="Replace"]').click();
  // Fill [aria-label="Replace"]
  await page.locator('[aria-label="Replace"]').fill("red");
  // Click [aria-label="Replace\ All\ \(⌘Enter\)"]
  await page.locator('[aria-label="Replace All (Ctrl+Alt+Enter)"]').click();

  // Wait until bundled
  await page.waitForTimeout(1000);

  expect(await movingDot.evaluate((el) => el.style.backgroundColor)).toBe(
    "red"
  );

  // Reset the code editor and we will get the color back
  await page.locator('.code-kitchen-action-button:has-text("Reset")').click();

  // Wait until bundled
  await page.waitForTimeout(1000);

  expect(await movingDot.evaluate((el) => el.style.backgroundColor)).toBe(
    "white"
  );
});
