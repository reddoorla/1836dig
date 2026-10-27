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

  test("names the business, the effective date and the contact email", async ({
    page,
  }) => {
    await page.goto("/privacy", { waitUntil: "domcontentloaded" });
    const text = await page.locator("article").innerText();
    expect(text).toContain(
      '1836 Digital Investment Group ("we") runs this website',
    );
    expect(text).toContain("Effective October 6, 2026");
    expect(text).not.toContain("[client legal name]");
    expect(text).not.toContain("[privacy contact email]");
    await expect(
      page.locator('article a[href="mailto:benhalbach@gmail.com"]').first(),
    ).toBeVisible();
  });

  // The fleet browser audit (reddoor-maintenance src/audits/browser.ts) scores
  // a route as rendering only when `main, [role=main]` is visible, on every
  // engine and device. Without it /privacy stored crossbrowser_ok = 0 and
  // mobile_ok = 0 every night from 2026-10-06.
  test("has exactly one visible main landmark around the policy", async ({
    page,
  }) => {
    await page.goto("/privacy", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main, [role=main]")).toHaveCount(1);
    await expect(page.locator("main, [role=main]").first()).toBeVisible();
    await expect(page.locator("main article")).toHaveCount(1);
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

  test("the contact form carries the notice, unclipped, clear of its submit button", async ({
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
    // Neither covers the other: their boxes do not intersect. Edges are compared
    // with each other, never with a number, so any gap or side a designer picks
    // passes, and a notice pulled even partly over the button fails.
    await expect(form.locator('button[type="submit"]')).toBeInViewport({
      ratio: 1,
    });
    const boxes = await form.evaluate((f) => {
      const edges = (el: Element) => {
        const { top, right, bottom, left } = el.getBoundingClientRect();
        return { top, right, bottom, left };
      };
      return {
        button: edges(f.querySelector('button[type="submit"]')!),
        notice: edges(f.querySelector("[data-testid='privacy-notice']")!),
      };
    });
    const { button, notice: n } = boxes;
    const apart =
      button.bottom <= n.top ||
      n.bottom <= button.top ||
      button.right <= n.left ||
      n.right <= button.left;
    expect(
      apart,
      `the submit button's box and the notice's box intersect: ${JSON.stringify(boxes)}`,
    ).toBe(true);
  });
});
