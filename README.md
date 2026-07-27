# 1836 Digital Investment Group

One-page site for [1836dig.com](https://www.1836dig.com/), converted from
Webflow onto the Reddoor stack — SvelteKit (Svelte 5) + Tailwind 4 +
adapter-netlify, **no CMS** (content is hardcoded; there is one page).

All assets (background photo, star logo, favicon, Proxima Nova webfont) are
self-hosted under `static/` — nothing references the Webflow CDN, so the
Webflow plan can be cancelled after DNS cutover. Baskervville is self-hosted
via `@fontsource/baskervville`.

## Develop

```sh
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # production build (adapter-netlify)
pnpm check      # svelte-check
pnpm lint       # prettier
```

## Contact form

The email form posts to the central dashboard ingest
(`@reddoorla/maintenance/forms` → `createIngestAction`), with the standard
honeypot + fill-timing bot screen and optional Cloudflare Turnstile
(`PUBLIC_TURNSTILE_SITE_KEY`). Deployed site needs `FORMS_INGEST_URL` +
`FORMS_INGEST_TOKEN` (see `.env.example`).

**Lead routing:** submissions should notify `benhalbach@gmail.com` — set that
as `point of contact` on this site's Airtable Websites row when onboarding.
Until the row's status is `maintenance`, lead notifications route to the
operator inbox.

## Launch checklist

- [ ] Create GitHub repo under `reddoorla/` and push
- [ ] Netlify site + custom domain `1836dig.com` / `www.1836dig.com`
- [ ] Set `FORMS_INGEST_URL` (slug `1836dig`) + `FORMS_INGEST_TOKEN` env vars
- [ ] Airtable Websites row: `point of contact` = benhalbach@gmail.com
- [ ] Fleet onboarding (CI caller workflow, Renovate, audits) via the
      standard playbook
- [ ] DNS cutover, then cancel Webflow
