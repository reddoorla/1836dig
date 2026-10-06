# 1836dig — Work Journal

Running log of build work: what was done, why, and where it landed.
Chronological — newest entry at the bottom.

The convention is in [CLAUDE.md](../CLAUDE.md) under "The work journal". In
short: every working session appends a dated entry, prose over bullets, why
over what, and history is never edited to be right — a later entry corrects an
earlier one and says so.

---

## 2026-09-05 — Journal opened, 11 commits of history summarised rather than reconstructed (`chore/work-journal`)

The journal starts today, so this first entry is a **backfill**: a coarse
summary written from the commit log, not from memory. Detail below this line is
trustworthy; detail above it is not, and nothing here should be cited as though
someone wrote it down at the time. For anything before 2026-09-05 the commit
log is the record.

**What this repo is.** The one-page site for
[1836dig.com](https://www.1836dig.com/) — 1836 Digital Investment Group —
converted off Webflow onto the Reddoor stack: SvelteKit 2 / Svelte 5 /
Tailwind 4 on adapter-netlify, **no CMS**. There is one page and its content is
hardcoded in `src/routes/+page.svelte`. The point of the conversion was to stop
paying Webflow: every asset (background photo, star logo, favicon, the Proxima
Nova webfont) is self-hosted under `static/`, and nothing references the Webflow
CDN, so the plan can be cancelled once DNS moves.

**The eras, such as they are.** Eleven commits, all inside eight days —
2026-07-27 to 2026-08-03, five in July and six in August. Three of them are the
site: the conversion itself (29 files, 3,359 insertions, in one commit on
07-27), the fleet bootstrap the same day (CI caller workflow, eslint, the
`/dev/a11y-fixtures` and `/dev/animate-in` audit routes), and the fleet smoke
suite on 07-31 (#1). Every commit after that is automation — the org Renovate
preset (#2), Renovate re-authenticating as the `reddoor-renovate` GitHub App
instead of an operator PAT (#4), and five dependency bumps on 08-03. So: built
in a sitting, then left alone while Renovate keeps it current. That is the
honest shape of it, and it is what a finished one-pager should look like.

**State as of this entry.** Branch `chore/work-journal`, cut from local `main`
at `d783be8`, tree clean, nothing of anyone's in flight. Local `main` is two
Renovate merges behind `origin/main` (#12, #13, 2026-08-10 and 08-12) and a
fetch shows the remote has moved further still, plus a `ci/run-on-staging`
branch nobody here has looked at — this checkout is stale, not divergent. The
README's launch checklist is still entirely unticked, and the log records no
DNS cutover, so whether the domain actually moved and the Webflow plan was
cancelled cannot be answered from inside this repo.

**What changed today.** `CLAUDE.md` now exists and carries "The work journal";
this file is the other half.

## 2026-10-05 — A DRAFT /privacy page and GA4 (G-1ZYB95TKC1) on 1836dig.com

The property (556936272) and its stream (`G-1ZYB95TKC1`, `https://1836dig.com/`) existed since 10-01, but the site carried no tag. The central `analytics-tag` recipe refuses a site with no `/privacy`, so the fleet page from reddoor-starter#165 came first, ported the way data-dynamiq#59 ported it the same day. The operator answered reddoor-maintenance's Operator decisions 73 "yes, before the legal review" for Data Dynamiq, and then extended that to this site and 29 Navy.

**This site's CSP is the difference from Data Dynamiq.** `kit.csp` here is SvelteKit's own option, and the recipe only knows how to extend the `createSvelteConfig` factory's `csp`, so it wrote the hook and printed the hosts to add by hand. The gate spec came first and was red: served as `1836dig.com` and as `www.1836dig.com`, the build requested no gtag at all. The tag ran and the browser refused the loader, which on a live site is a property that silently records nothing. After `script-src`, `img-src` and `connect-src` took reddoor-maintenance's `ANALYTICS_CSP` hosts, it went green. Removing the `script-src` host again turns both production-host tests red.

**The policy's service list comes from the CSP and the code together.** With a CSP present, a video host must be admitted and a font host must also be named in code. That gives: the contact form (the ingest action), Netlify, and GA4 once the hook exists. Fonts are self-hosted (`@fontsource` Baskervville and a local Proxima Nova), so no font line appears. Turnstile is decided at request time from `PUBLIC_TURNSTILE_SITE_KEY`.

**Two test lessons carried over.** "The notice is in view without scrolling" was the right test for Data Dynamiq's scrolling dialog, but here it was false and the page was fine: at 1280×800 the submit button itself sits below the fold, and the page scrolls by design. The test now asserts what matters here instead: once scrolled to, the notice is fully visible and starts less than 40px under the button. The site had no `@types/node`, which the ported specs and the build plugin need, and a JS `vite.config` cannot import a `.ts` plugin under `checkJs`, so it became `vite.config.ts`.

**Not done.** The legal name, privacy email and effective date render as placeholders, because none is in this repo or on the fleet row. The copyright line's "1836 Digital Investment Group" may be the legal name, but nobody has said so. No live GA hit can exist until the PR merges and deploys.

## 2026-10-06 — The privacy page names its owner and its effective date

The operator asked for the legal business name, privacy contact email and effective date to be filled from what could be found. The legal name is "1836 Digital Investment Group", from the site's copyright line and its former Webflow site name. The effective date is 2026-10-06, the day these values went live. The contact email stays a placeholder. The only address on file is a person's personal Gmail, which is not one to publish. No entity suffix (LLC, Inc.) is confirmed: California's bizfile search refuses automated requests, and web searches found no filing. So the name is the business's own public name, not a verified registration.

## 2026-10-06 — The privacy contact is the report recipient

The operator ruled that the policy's contact email is whoever receives this site's maintenance report. The stored row resolves that the same way the report sender does (`report_recipients_to`, falling back to `point_of_contact`, `src/reports/send/orchestrate.ts:216` in reddoor-maintenance), and for this site it gives `benhalbach@gmail.com`. That replaces the value or placeholder from this morning's entry. The privacy test now asserts the `mailto:` link. It fails against the previous config and passes against this one.
