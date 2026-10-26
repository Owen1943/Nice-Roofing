import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("homepage navigation, image loading and viewport fit", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Naturally",
  );
  await expect(
    page.getByRole("link", { name: "Explore products", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(
    await page
      .locator(".hero-visual img")
      .evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0),
  ).toBe(true);
  await page
    .getByRole("link", { name: "Explore products", exact: true })
    .click();
  await expect(page).toHaveURL(/products/);
  await page.getByRole("button", { name: "Roof", exact: true }).click();
  await expect(page.locator(".product-card")).toHaveCount(1);
});
test("gallery opens, zooms, navigates and restores keyboard focus", async ({
  page,
}) => {
  await page.goto("/projects");
  const opener = page.getByRole("button", {
    name: "Enlarge A quieter roofline",
  });
  await opener.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await expect(page.locator("output")).toHaveText("150%");
  await page.getByRole("button", { name: "Next image" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "At home in the landscape",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(opener).toBeFocused();
});
test("enquiry validation and unavailable fallback never fake success", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByText("Please enter your name.")).toBeVisible();
  await page.getByLabel("Your name", { exact: true }).fill("Test Visitor");
  await page.getByLabel("Phone / WhatsApp number").fill("0771234567");
  await page.route("**/api/enquiries", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        error: "Email delivery unavailable. Please use WhatsApp.",
      }),
    }),
  );
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByRole("alert")).toContainText("unavailable");
  await expect(
    page.getByRole("link", { name: "Continue on WhatsApp" }),
  ).toHaveAttribute("href", /wa.me\/94777173041/);
  await expect(page.getByLabel("Your name", { exact: true })).toHaveValue(
    "Test Visitor",
  );
});
test("provider accepted success state", async ({ page }) => {
  await page.goto("/contact");
  await page.route("**/api/enquiries", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        message: "Your enquiry was accepted for email delivery.",
      }),
    }),
  );
  await page.getByLabel("Your name", { exact: true }).fill("Test Visitor");
  await page.getByLabel("Phone / WhatsApp number").fill("0771234567");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByRole("status")).toContainText("accepted");
});
test("accessible main pages", async ({ page }) => {
  for (const path of [
    "/",
    "/contact",
    "/projects",
    "/products/roofing-tiles",
  ]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  }
});
test("SEO and real 404", async ({ page, request }) => {
  await page.goto("/products/roofing-tiles");
  await expect(page).toHaveTitle(/Terracotta roofing tiles/);
  await expect(page.locator("link[rel=canonical]")).toHaveCount(1);
  expect((await request.get("/this-page-does-not-exist")).status()).toBe(404);
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain("/products/roofing-tiles");
});

test("theme choice persists across navigation and reload", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page
    .getByRole("link", { name: "Explore products", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Switch to dark mode" }),
  ).toBeVisible();
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(result.violations).toEqual([]);
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("reduced motion keeps gallery imagery revealed", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/projects");
  await expect(page.locator(".scroll-reveal").first()).toHaveCSS(
    "clip-path",
    "none",
  );
  await page
    .getByRole("button", { name: "Enlarge A quieter roofline" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
});
