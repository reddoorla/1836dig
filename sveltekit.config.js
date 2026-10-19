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

// SvelteKit 3 refuses `svelte.config.js` (`config_file_unsupported`): its
// configuration is passed to the `sveltekit(...)` plugin in vite.config.ts,
// and kit's options are top-level there, with no `kit` namespace. This object
// is that argument. It lives in its own module, not inline in vite.config.ts,
// because eslint.config.js, the privacy-services plugin and
// tests/kit-config.spec.ts read the same object with a bare `node` (no Vite).
//
// Kit 2's `prerender.origin` (Netlify's URL) is gone and deliberately not
// replaced by `paths.origin`: in kit 3 that is also the ONLY origin the CSRF
// check accepts a form POST from, so the contact form would answer 403 on the
// netlify.app host, a deploy preview, and any domain attached after the last
// build (measured on reddoor-starter#187). Nothing here needs it: every page is
// rendered per request (`prerender = false`) and robots.txt is a static file,
// so no build bakes an origin into its output.
/** @type {import('@sveltejs/kit/vite').Config} */
const config = {
  adapter: adapter(),
  preprocess: vitePreprocess(),
  // Kit 3 no longer provides `$lib` (`module_removed_lib`). `alias` itself is
  // deprecated (a build warning) in favour of package.json subpath imports;
  // moving to `#lib` is a fleet follow-up (reddoor-maintenance P1-45's plan).
  alias: {
    $lib: "src/lib",
    "$lib/*": "src/lib/*",
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
};

export default config;
