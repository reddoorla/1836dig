import adapter from "@sveltejs/adapter-netlify";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

// VITE_REDDOOR_GATE_FIXTURES=1 builds the /dev fixtures into the bundle, for
// the a11y gate's own build and nothing else (src/routes/dev/+layout.server.ts,
// reddoor-maintenance#948). Set on Netlify it would deploy them, so refuse it
// there, at module load.
if (process.env.VITE_REDDOOR_GATE_FIXTURES && process.env.NETLIFY) {
  throw new Error(
    "VITE_REDDOOR_GATE_FIXTURES is set on Netlify: it builds the /dev fixtures into the " +
      "deployed site. It belongs to the a11y gate's own build (reddoor-maint audit) only. " +
      "Unset it in the Netlify environment.",
  );
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    // Prerendered endpoints (robots.txt etc.) bake `url.origin` into their
    // output at build time. Netlify sets URL to the production origin.
    prerender: {
      ...(process.env.URL ? { origin: process.env.URL } : {}),
    },
    // Tight baseline CSP — no CMS, no third-party media. Cloudflare Turnstile
    // (contact-form anti-bot, gated behind PUBLIC_TURNSTILE_SITE_KEY) and GA4
    // (reddoor-maintenance's ANALYTICS_CSP hosts) are the only external
    // surfaces. SvelteKit adds nonces/hashes for its own inline scripts
    // automatically.
    csp: {
      mode: "auto",
      directives: {
        "default-src": ["self"],
        "script-src": [
          "self",
          "https://challenges.cloudflare.com",
          // GA4, loaded by initAnalytics (src/hooks.client.ts) on 1836dig.com only.
          "https://www.googletagmanager.com",
        ],
        "style-src": ["self", "unsafe-inline"],
        "img-src": [
          "self",
          "data:",
          "https://www.googletagmanager.com",
          "https://*.google-analytics.com",
        ],
        "font-src": ["self", "data:"],
        "frame-src": ["self", "https://challenges.cloudflare.com"],
        "connect-src": [
          "self",
          "https://www.googletagmanager.com",
          "https://*.google-analytics.com",
          "https://*.google.com",
        ],
        "base-uri": ["self"],
        "form-action": ["self"],
        "frame-ancestors": ["self"],
      },
    },
  },
  preprocess: vitePreprocess(),
};

export default config;
