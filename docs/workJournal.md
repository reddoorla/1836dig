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

## 2026-10-19 — SvelteKit 3 and adapter-netlify 7, on `staging`

Renovate opened `@sveltejs/kit` 3 (#28) and `adapter-netlify` 7 (#27) at 04:23Z, and both were red. Kit 3 stops at `prepare` with `config_file_unsupported`, and adapter 7 throws reading `assets` on kit 2.70.3, so neither can land alone. This is reddoor-maintenance P1-53, and per its Operator decisions 113 the change lands on a new `staging` branch, cut from `main` at `18906e2`; only the operator promotes it to `main`.

**The port follows reddoor-starter#187 and vida-legacy-foundation#100, minus what this site does not have.** The config moved into `sveltekit.config.js`, which `vite.config.ts` passes to `sveltekit(...)` and `eslint.config.js` imports. Kit 3 no longer provides `$lib`, so it is in `alias`. The three variables the site reads are declared in `src/env.ts`, and every reader moved to `$app/env/*`. Measured here on a `vite preview` of the build with all three set: with `src/env.ts`, `/health` answered `ingestUrl:true, ingestToken:true, turnstile:true`; without it, all three `false`, from a green build. That is a contact form that silently stops delivering. `ClientInit` now comes from `@sveltejs/kit/hooks`, and `tsconfig.json` extends `$app/tsconfig` with its own `include`.

**`prerender.origin` was dropped, not moved.** Kit 3's replacement, `paths.origin`, is also the only origin its CSRF check accepts. Set to Netlify's `URL`, the form would answer 403 on the netlify.app host and on deploy previews. The starter carries a `productionOrigin` and `siteOrigin` to keep canonical URLs right. This site needs neither: every page has `prerender = false` and `robots.txt` is static, so no build output bakes an origin in.

**The one thing the worked examples did not cover was the privacy page.** `scripts/privacy-services.ts` read `kit.csp` and `kit.adapter` from `svelte.config.js`. With that file gone it would have read nothing, and the policy would have listed no Netlify. The site's own test caught it: pointing the plugin back at `svelte.config.js` turns "this site" red with `netlify: false`. It reads `sveltekit.config.js`, top-level, the same way the starter's does.

**The gate is a Playwright spec, `tests/kit-config.spec.ts`.** This repo has no vitest, and CI's `test:smoke` runs every spec, so a new runner would have been one more dependency for no gain. It reads the options kit itself validated off its plugin. Each of these turned it red: a `svelte.config.js` restored beside the new file (the dev server also refuses to start), a `$app/stores` import, `paths.origin` set, and `FORMS_INGEST_TOKEN` removed from `src/env.ts`.

## 2026-10-20 — `staging` recut, and Renovate on the staging flow (#37, `e1d18b6`, into `staging`)

P1-53's promotion merge deleted `staging`: `delete_branch_on_merge` removes a PR's head on merge, and `staging` had no ruleset to stop it. `main-gate` stayed on `main`, and it admits only a PR from `staging` or a Renovate patch or minor labelled `fast-track`. So the next lock-file maintenance or major would have failed it; none was open. `staging` was pushed back at `main`'s head (`9037725`, 19:31Z), and Netlify already listed it in `allowed_branches`.

#37 makes `renovate.json` extend `renovate-staging-flow` after `renovate-config`, as vida-legacy-foundation, 29-navy and beachfront-dentistry do. The preset sends majors and lock-file maintenance to `staging` and labels patches and minors into `main` `fast-track`. **It does nothing yet.** Renovate reads its config from the default branch, and this repo's `renovate.yml` sets no base or config path, so the file takes effect at the next promotion. The order is the operator's: the `staging` ruleset first (otherwise Renovate could automerge lock-file maintenance into an unprotected `staging`, and the promotion merge would delete `staging` again), then the promotion, then `main-gate` as a required check on `main`, which today requires only `ci / ci`.

The validator (`renovate-config-validator --strict`, renovate 44.172.1) passed the file and failed a copy carrying `nonsenseOption: true` with exit 1. It does not resolve presets, so the preset's existence was checked separately (HTTP 200). `main-gate` refused a probe PR into `main` from a non-staging head (reddoorla/1836dig#36, closed unmerged); its file is byte-identical here. No promotion has run under `main-gate` in this repo yet, so its pass on a `staging` head is still unobserved. The record for all three repos is reddoor-maintenance's `docs/journal/2026-10-20-1945-staging-recut-three.md`.

## 2026-10-21 — `main-gate` waits for the activity feed to reach the PR head (`claude/main-gate-activity-retry`, into `staging`)

`main-gate` proves that only `reddoor-renovate[bot]` pushed to a fast-track branch by reading the repository activity feed, and that feed is eventually consistent. On 2026-10-21 it listed nothing 22–24 seconds after Renovate created the branch for reddoorla/la-homelessness-initiative#65, a vite security patch, so the gate failed closed and the PR sat red until it was re-run by hand. The file here is now reddoor-maintenance's template from reddoorla/reddoor-maintenance#1625, byte for byte. It trusts the feed only once the newest entry is the PR's head commit and the feed lists a `branch_creation`, reading again for up to 60 seconds before it fails closed. Retrying merely until the feed was non-empty was the first draft, and review rejected it: a partly filled feed could show Renovate's creation without a stranger's later push. The stranger-pusher check is unchanged. `pull_request_target` runs `main`'s copy, so this takes effect at the next promotion. The test, the mutations and the live dry run are in reddoor-maintenance's `docs/journal/2026-10-21-1440-main-gate-activity-retry.md`.

## 2026-10-26 — `/privacy` gets its `<main>` landmark (`claude/eloquent-meitner-bwojr1`, into `staging`)

The fleet browser audit had stored `crossbrowser_ok = 0` and `mobile_ok = 0` for this site every night since `/privacy` merged (#24, 2026-10-06), and no other maintained site failed either check. The page was never broken: on chromium, firefox, webkit, Pixel 7 and iPhone 14 it loads with status 200, no page errors, no horizontal overflow and 3,340 characters of policy text. What it lacked was a landmark. The audit counts a route as rendering only when `main, [role=main]` is visible, and this site's layout is a bare `{@render children()}`, so the one `<main>` lived in the home page. The ported privacy page wrapped itself in a `<div>`. No other maintained site fails the check; that their layouts supply the `<main>` is likely but was not verified. The belief corrected: the brief arrived as "not rendering", and it was a missing landmark that the audit reports under a rendering name.

The wrapper `<div>` is now `<main>`, with the same classes. No CSS targets `main`, and each route still has exactly one. A Playwright test asserts one visible main landmark around the article. It failed on the old source (expected 1, received 0) and passes on the new. The audit's own runner, pointed at `vite dev` of this branch, scores `/` and `/privacy` ok on all ten engine and device checks; with the old source on the same server, `/privacy` fails all five. The evidence and the onset table are in reddoorla/reddoor-maintenance#1754.

Tried and dropped: restoring the lost space in "with your messageand is used to confirm…". Svelte trims the newline and indent at the start of the `{#if s.turnstile}` block, before "and is used", but the test build has no `PUBLIC_TURNSTILE_SITE_KEY`, so no CI test can see the clause. It is filed as #48 instead of riding this fix.

## 2026-10-27 — The privacy notice's 0–40 px gap under the submit button becomes "neither covers the other" (#52)

The fleet test audit (`reddoorla/reddoor-workspace` `audits/2026-10-26-fleet-test-audit/report.md`, batch D) flagged one test here: "the contact form carries the notice, unclipped, directly under its submit button" (now "… clear of its submit button", since the boxes may sit on any side) measured both `boundingBox`es and pinned the gap between the button's bottom and the notice's top to 0–40 px. That is a spacing value, which the template's rule keeps out of the gate, so the four lines went.

The audit's reviewer pointed out what went with them: nothing then checked that the notice does not overlap the CONTACT US button, since `toBeInViewport({ ratio: 1 })` does not see overlap and the kept `compareDocumentPosition` check is DOM order only. That is the bug a visitor would see, so the test now asserts it without a number: the button's and the notice's `getBoundingClientRect()` boxes do not intersect, edge compared with edge. The first version hit-tested each element's centre with `document.elementFromPoint`, and review 1 showed what that misses: `-mt-4` puts the notice's first line 16 px over the 46 px button (button bottom 741, notice top 725 at 1280×800) and the centre stays clear, so it passed; only `-mt-6` and beyond went red. With the boxes compared, `-mt-2`, `-mt-4` and `-mt-10` go red on the dev server, while `mt-0` (edges touching) and `mt-16` pass, and a production build (`vite build`) passes all six tests in the file. A notice pushed far below the button now passes, and that is a design call, not a defect.

## 2026-10-28 — /privacy gets a meta description, and a head test pins all three fleet rules (P1-86)

The fleet's nightly browser audit put 1836dig at Attention on 2026-10-28 with "page titles or meta descriptions missing or duplicated". Re-running maintenance's `browserAudit` against the live site at about 8:40am PT gave exactly one finding: `https://1836dig.com/privacy: missing meta description`. The privacy route came in with the fleet privacy rollout and set only a `<title>`; the home page already had both. The route now carries a description of the page (how the company handles what visitors send through the site), not of the business.

`tests/privacy/page.spec.ts` already pinned `/privacy`'s title and its noindex, but nothing tested a description or the audit's rules across routes, so `tests/seo/head.spec.ts` now applies the audit's own three rules (non-empty title, non-empty description, no shared title) to every route in the smoke manifest. It went red on `/privacy` before the fix. Two mutations were run against it: blanking the new description turned the per-route test red, and giving `/privacy` the home page's title turned the duplicate test red. The first draft read the description with a Playwright locator, which waits out the 30-second timeout when the tag is absent; it reads `document.head` directly now, and the spec runs in about five seconds. Review then pointed out that the spec read the head after hydration while the audit reads the server's HTML, so a description added only on the client would have passed here and failed the nightly; the spec now runs with JavaScript off.
