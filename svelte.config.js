import adapter from "@sveltejs/adapter-netlify";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

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
    // is the only external surface (contact-form anti-bot, gated behind
    // PUBLIC_TURNSTILE_SITE_KEY). SvelteKit adds nonces/hashes for its own
    // inline scripts automatically.
    csp: {
      mode: "auto",
      directives: {
        "default-src": ["self"],
        "script-src": ["self", "https://challenges.cloudflare.com"],
        "style-src": ["self", "unsafe-inline"],
        "img-src": ["self", "data:"],
        "font-src": ["self", "data:"],
        "frame-src": ["self", "https://challenges.cloudflare.com"],
        "connect-src": ["self"],
        "base-uri": ["self"],
        "form-action": ["self"],
        "frame-ancestors": ["self"],
      },
    },
  },
  preprocess: vitePreprocess(),
};

export default config;
