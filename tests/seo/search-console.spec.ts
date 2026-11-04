import { test, expect } from "@playwright/test";

// Search Console verifies https://1836dig.com/ by reading this exact tag from
// the home page's head as the server sends it (Google does not run the page's
// JavaScript for it), so JavaScript is off here. The tag lives in
// src/app.html, so every page gets it; if it goes, Search Console un-verifies
// the property on its next check and the maintenance report loses its
// Google Indexed row.

test.use({ javaScriptEnabled: false });

const TOKEN = "_afrO-vNgLl_StiJ4LW_O5fKaTwkA96lstr2ZL3nEdE";

test("home page carries the Search Console verification tag", async ({
  page,
}) => {
  const response = await page.goto("/");
  expect(response?.ok(), `/: HTTP ${response?.status()}`).toBe(true);
  const tags = await page.evaluate(() =>
    [
      ...document.head.querySelectorAll(
        'meta[name="google-site-verification"]',
      ),
    ].map((m) => m.getAttribute("content")),
  );
  expect(tags).toEqual([TOKEN]);
});
