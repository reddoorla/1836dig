import { test, expect } from "@playwright/test";

test.describe("/privacy", () => {
  test("renders the DRAFT policy, noindex, with this site's services", async ({
    page,
  }) => {
    const response = await page.goto("/privacy", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(
      "Privacy Policy | 1836 Digital Investment Group",
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex",
    );
    await expect(page.getByTestId("privacy-draft")).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 1, name: "Privacy Policy" }),
    ).toBeVisible();
    for (const id of ["forms", "ga4", "netlify"]) {
      await expect(page.getByTestId(`service-${id}`)).toBeVisible();
    }
    for (const id of [
      "newsletter",
      "vimeo",
      "youtube",
      "googleFonts",
      "adobeFonts",
    ]) {
      await expect(page.getByTestId(`service-${id}`)).toHaveCount(0);
    }
    await expect(page.getByTestId("privacy-dnt")).toBeVisible();
  });

  test("names the business and the effective date, and shows a placeholder for the contact email", async ({
    page,
  }) => {
    await page.goto("/privacy", { waitUntil: "domcontentloaded" });
    const text = await page.locator("article").innerText();
    expect(text).toContain(
      '1836 Digital Investment Group ("we") runs this website',
    );
    expect(text).toContain("Effective October 6, 2026");
    expect(text).not.toContain("[client legal name]");
    expect(text).toContain("[privacy contact email]");
  });

  test("is the only page that asks not to be indexed", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  });
});

test.describe("links to /privacy", () => {
  test("the footer links to the policy", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator('footer a[href="/privacy"]')).toBeVisible();
  });

  test("the contact form carries the notice, unclipped, directly under its submit button", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "networkidle" });
    const form = page
      .locator("form")
      .filter({ has: page.locator('input[name="email"]') });
    const notice = form.getByTestId("privacy-notice");
    await notice.scrollIntoViewIfNeeded();
    await expect(notice).toBeInViewport({ ratio: 1 });
    const button = await form.locator('button[type="submit"]').boundingBox();
    const box = await notice.boundingBox();
    expect(box!.y - (button!.y + button!.height)).toBeGreaterThanOrEqual(0);
    expect(box!.y - (button!.y + button!.height)).toBeLessThan(40);
    await expect(notice.locator('a[href="/privacy"]')).toBeVisible();
    const after = await form.evaluate((f) => {
      const submit = f.querySelector('button[type="submit"]');
      const n = f.querySelector("[data-testid='privacy-notice']");
      return (
        !!submit &&
        !!n &&
        !!(submit.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_FOLLOWING)
      );
    });
    expect(after).toBe(true);
  });
});
