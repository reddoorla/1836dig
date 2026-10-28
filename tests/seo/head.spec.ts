import { test, expect } from "@playwright/test";
import { smokeRoutes } from "../smoke/routes";

// The fleet's nightly browser audit (reddoor-maintenance src/audits/browser.ts,
// `titleMetaOk`) fails a site when any sampled route has an empty <title> or
// meta description, or when two routes share a title. This pins the same three
// rules over every route in the smoke manifest, so a page added without its own
// head fails here before the nightly flags it.

for (const route of smokeRoutes) {
  test(`${route.path} (${route.name}) has a title and a meta description`, async ({
    page,
  }) => {
    await page.goto(route.path);
    const title = (await page.title()).trim();
    const description = await page.evaluate(() =>
      (
        document.head
          .querySelector('meta[name="description"]')
          ?.getAttribute("content") ?? ""
      ).trim(),
    );
    expect(title, `${route.path}: empty title`).not.toBe("");
    expect(description, `${route.path}: missing meta description`).not.toBe("");
  });
}

test("no two routes share a title", async ({ page }) => {
  const byTitle = new Map<string, string[]>();
  for (const route of smokeRoutes) {
    await page.goto(route.path);
    const title = (await page.title()).trim();
    if (title) byTitle.set(title, [...(byTitle.get(title) ?? []), route.path]);
  }
  const dupes = [...byTitle].filter(([, paths]) => paths.length > 1);
  expect(dupes, `duplicate titles: ${JSON.stringify(dupes)}`).toEqual([]);
});
